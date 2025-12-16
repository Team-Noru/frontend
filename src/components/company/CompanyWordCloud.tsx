'use client';

import { FC, useEffect, useMemo, useRef, useState } from 'react';

import { scaleLog } from '@visx/scale';
import { Text } from '@visx/text';
import { Wordcloud } from '@visx/wordcloud';

import { getColorByType } from '@/lib/color';
import { getLabelByType } from '@/lib/values';
import { WordData, WordDataDTO } from '@/types/company';

interface CompanyWordCloudProps {
	wordCloudData: WordDataDTO[];
}

const CompanyWordCloud: FC<CompanyWordCloudProps> = ({ wordCloudData }) => {
	// 모바일 여부 감지 (초기값을 직접 계산하여 불필요한 렌더링 방지)
	const [isMobile, setIsMobile] = useState(() => {
		if (typeof window !== 'undefined') {
			return window.innerWidth < 1024;
		}
		return false;
	});

	useEffect(() => {
		const checkMobile = () => {
			const newIsMobile = window.innerWidth < 1024;
			setIsMobile((prev) => (prev !== newIsMobile ? newIsMobile : prev));
		};
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	// WordDataDTO를 WordData로 변환
	const transformedWordCloudData = useMemo(() => {
		return wordCloudData.map((word) => ({
			text: word.text,
			value: word.weight,
			type: word.type,
		}));
	}, [wordCloudData]);

	// 워드 클라우드 설정 (모바일일 때 글자 크기 축소)
	const fontScale = useMemo(() => {
		if (transformedWordCloudData.length === 0) {
			// 빈 데이터일 때 기본 스케일 반환
			return scaleLog({
				domain: [1, 100],
				range: isMobile ? [12, 40] : [20, 80],
			});
		}
		const values = transformedWordCloudData.map((w) => w.value);
		return scaleLog({
			domain: [Math.min(...values), Math.max(...values)],
			range: isMobile ? [12, 40] : [20, 80], // 모바일: 12-40, 데스크탑: 20-80
		});
	}, [transformedWordCloudData, isMobile]);
	const fontSizeSetter = (datum: WordData) => fontScale(datum.value);

	// 워드 클라우드 크기 계산 (반응형)
	const [wordCloudSize, setWordCloudSize] = useState<{
		width: number;
		height: number;
	} | null>(null);
	const wordCloudContainerRef = useRef<HTMLDivElement>(null);
	const wordCloudMobileContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const updateSize = () => {
			// 데스크탑과 모바일 컨테이너 크기 확인
			const desktopContainer = wordCloudContainerRef.current;
			const mobileContainer = wordCloudMobileContainerRef.current;

			let newWidth = 600;
			let newHeight = 300;

			// 데스크톱 환경에서는 desktopContainer 사용
			if (desktopContainer && !isMobile) {
				const containerRect = desktopContainer.getBoundingClientRect();
				// 컨테이너가 실제로 렌더링되었는지 확인 (width > 0)
				if (containerRect.width > 0) {
					newWidth = Math.max(400, containerRect.width - 48); // padding 고려
					newHeight = Math.min(300, newWidth * 0.5);
				} else {
					// 초기 렌더링 시 fallback
					newWidth = Math.min(600, window.innerWidth - 64);
					newHeight = Math.min(300, newWidth * 0.5);
				}
			}
			// 모바일 환경에서는 mobileContainer 사용
			else if (mobileContainer && isMobile) {
				const containerRect = mobileContainer.getBoundingClientRect();
				if (containerRect.width > 0) {
					newWidth = Math.max(300, containerRect.width - 32); // padding 고려
					newHeight = containerRect.height;
				} else {
					// 초기 렌더링 시 fallback
					newWidth = Math.min(400, window.innerWidth - 32);
					newHeight = 200;
				}
			}

			// 값이 변경된 경우에만 업데이트
			setWordCloudSize((prev) => {
				if (prev && prev.width === newWidth && prev.height === newHeight) {
					return prev;
				}
				return { width: newWidth, height: newHeight };
			});
		};

		// DOM이 렌더링된 후에만 크기 계산
		// requestAnimationFrame을 사용하여 브라우저 렌더링 후 실행
		let rafId: number;
		let timeoutId: NodeJS.Timeout;

		const scheduleUpdate = () => {
			rafId = requestAnimationFrame(() => {
				timeoutId = setTimeout(updateSize, 0);
			});
		};

		scheduleUpdate();

		window.addEventListener('resize', updateSize);
		// ResizeObserver를 사용하여 컨테이너 크기 변화 감지
		const resizeObserver = new ResizeObserver(updateSize);

		// ref가 연결된 후에 observe 시작
		const observeContainers = () => {
			if (wordCloudContainerRef.current && !isMobile) {
				resizeObserver.observe(wordCloudContainerRef.current);
			}
			if (wordCloudMobileContainerRef.current && isMobile) {
				resizeObserver.observe(wordCloudMobileContainerRef.current);
			}
		};

		// 약간의 지연 후 observe 시작
		const observeTimeoutId = setTimeout(observeContainers, 0);

		return () => {
			cancelAnimationFrame(rafId);
			clearTimeout(timeoutId);
			clearTimeout(observeTimeoutId);
			window.removeEventListener('resize', updateSize);
			resizeObserver.disconnect();
		};
	}, [isMobile]);

	return (
		transformedWordCloudData.length > 0 &&
		wordCloudSize &&
		wordCloudSize.width > 0 &&
		wordCloudSize.height > 0 && (
			<>
				{/* 데스크탑 */}
				<div className="hidden lg:block">
					<div className="border border-border rounded-lg p-6 bg-white">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-xl font-bold">트렌드</h3>
							<div className="flex flex-wrap gap-2 text-xs">
								{Array.from(new Set(wordCloudData.map((w) => w.type))).map(
									(type) => (
										<span key={type} className="flex items-center gap-1">
											<span
												className="w-2 h-2 rounded-full"
												style={{ backgroundColor: getColorByType(type) }}
											></span>
											{getLabelByType(type)}
										</span>
									)
								)}
							</div>
						</div>
						<div
							ref={wordCloudContainerRef}
							className="h-[300px] w-full overflow-visible flex items-center justify-center"
						>
							<svg
								width={wordCloudSize.width}
								height={wordCloudSize.height}
								className="overflow-visible"
								viewBox={`0 0 ${wordCloudSize.width} ${wordCloudSize.height}`}
							>
								<Wordcloud
									words={transformedWordCloudData}
									width={wordCloudSize.width}
									height={wordCloudSize.height}
									fontSize={fontSizeSetter}
									font={'Arial'}
									padding={2}
									spiral={'archimedean'}
									rotate={0}
								>
									{(cloudWords) =>
										cloudWords.map((w) => {
											const originalWord = wordCloudData.find(
												(word) => word.text === w.text
											);
											const color = originalWord
												? getColorByType(originalWord.type)
												: '#6b7280';
											return (
												<Text
													key={w.text}
													fill={color}
													textAnchor={'middle'}
													transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
													fontSize={w.size}
													fontFamily={w.font}
												>
													{w.text}
												</Text>
											);
										})
									}
								</Wordcloud>
							</svg>
						</div>
					</div>
				</div>
				{/* 모바일 */}
				<div className="lg:hidden">
					<div className="border border-border rounded-lg p-4 bg-white">
						<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-4">
							<h3 className="text-base sm:text-lg font-bold">트렌드</h3>
							<div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs">
								{Array.from(new Set(wordCloudData.map((w) => w.type))).map(
									(type) => (
										<span key={type} className="flex items-center gap-1">
											<span
												className="w-2 h-2 rounded-full"
												style={{
													backgroundColor: getColorByType(type),
												}}
											></span>
											{getLabelByType(type)}
										</span>
									)
								)}
							</div>
						</div>
						<div
							ref={wordCloudMobileContainerRef}
							className="h-[200px] sm:h-[250px] w-full overflow-hidden flex items-center justify-center"
						>
							{transformedWordCloudData.length > 0 && wordCloudSize ? (
								<svg
									width={wordCloudSize.width}
									height={wordCloudSize.height}
									className="overflow-visible"
								>
									<Wordcloud
										words={transformedWordCloudData}
										width={wordCloudSize.width}
										height={wordCloudSize.height}
										fontSize={fontSizeSetter}
										font={'Arial'}
										padding={2}
										spiral={'archimedean'}
										rotate={0}
									>
										{(cloudWords) =>
											cloudWords.map((w) => {
												const originalWord = wordCloudData.find(
													(word) => word.text === w.text
												);
												const color = originalWord
													? getColorByType(originalWord.type)
													: '#6b7280';
												return (
													<Text
														key={w.text}
														fill={color}
														textAnchor={'middle'}
														transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
														fontSize={w.size}
														fontFamily={w.font}
													>
														{w.text}
													</Text>
												);
											})
										}
									</Wordcloud>
								</svg>
							) : (
								<div className="text-xs sm:text-sm text-muted-foreground text-center py-8">
									워드클라우드 데이터가 없습니다.
								</div>
							)}
						</div>
					</div>
				</div>
			</>
		)
	);
};

export default CompanyWordCloud;
