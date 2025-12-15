'use client';

import { FC, useMemo, useState, useEffect, useRef } from 'react';

import dynamic from 'next/dynamic';
import Image from 'next/image';

import { scaleLog } from '@visx/scale';
import { Text } from '@visx/text';
import { Wordcloud } from '@visx/wordcloud';
import { GraphEdge, GraphNode } from 'reagraph';

import CompanyItem from '@/components/CompanyItem';
import NewsItem from '@/components/NewsItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStockImageUrl } from '@/lib/values';
import {
	Announcement,
	CompanyDetail,
	Sentiment,
	WordData,
	WordDataDTO,
	WordType,
} from '@/types/company';
import { News } from '@/types/news';

interface Props {
	companyData: CompanyDetail;
	wordCloudData: WordDataDTO[];
	newsData: News[];
	announcementsData: Announcement[];
}

const GraphCanvas = dynamic(
	() => import('reagraph').then((mod) => mod.GraphCanvas),
	{ ssr: false }
);

const CompanyDetailClientContainer: FC<Props> = ({
	companyData,
	wordCloudData,
	newsData,
	announcementsData,
}) => {
	const [activeTab, setActiveTab] = useState('network');

	// 네트워크 그래프 노드 및 엣지 생성
	const { nodes, edges } = useMemo(() => {
		const graphNodes = [
			{
				id: companyData.companyId,
				label: companyData.name,
				fill: '#10b981', // green-500
				size: 50,
				data: companyData,
			},
			...companyData.related.map((related) => ({
				id: related.companyId || related.name,
				label: related.name,
				fill: '#e5e7eb', // gray-200
				size: 40,
				data: related,
			})),
		];

		const graphEdges = companyData.related.map((related) => ({
			id: `${companyData.companyId}-${related.companyId || related.name}`,
			source: companyData.companyId,
			target: related.companyId || related.name,
			label: '',
			size: 2,
			fill: '#10b981', // green-500
		}));

		return { nodes: graphNodes, edges: graphEdges };
	}, [companyData]);

	// 타입별 색상 매핑
	const getColorByType = (type: WordType): string => {
		const colorMap: Record<WordType, string> = {
			ORG: '#3b82f6', // 파랑 (blue-500)
			PERSON: '#f97316', // 주황 (orange-500)
			TECH: '#a855f7', // 보라 (purple-500)
			PRODUCT: '#10b981', // 초록 (green-500)
			MARKET: '#0ea5e9', // 하늘 (sky-500)
			FINANCE: '#059669', // 진초록 (emerald-600)
			GOVERNANCE: '#6b7280', // 회색 (gray-500)
		};
		return colorMap[type];
	};

	// 타입별 레이블 매핑
	const getLabelByType = (type: WordType): string => {
		const labelMap: Record<WordType, string> = {
			ORG: '기업/기관',
			PERSON: '인물',
			TECH: '기술/반도체',
			PRODUCT: '제품/서비스',
			MARKET: '시장',
			FINANCE: '실적/재무',
			GOVERNANCE: '지배구조',
		};
		return labelMap[type];
	};

	// WordDataDTO를 WordData로 변환
	const transformedWordCloudData = useMemo(() => {
		return wordCloudData.map((word) => ({
			text: word.text,
			value: word.weight,
			type: word.type,
		}));
	}, [wordCloudData]);

	// 모바일 여부 감지
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 1024); // lg 브레이크포인트
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	// 워드 클라우드 설정 (모바일일 때 글자 크기 축소)
	const fontScale = useMemo(() => {
		return scaleLog({
			domain: [
				Math.min(...transformedWordCloudData.map((w) => w.value)),
				Math.max(...transformedWordCloudData.map((w) => w.value)),
			],
			range: isMobile ? [12, 40] : [20, 80], // 모바일: 12-40, 데스크탑: 20-80
		});
	}, [transformedWordCloudData, isMobile]);
	const fontSizeSetter = (datum: WordData) => fontScale(datum.value);

	// 워드 클라우드 크기 계산 (반응형)
	const [wordCloudSize, setWordCloudSize] = useState({
		width: 600,
		height: 300,
	});
	const wordCloudContainerRef = useRef<HTMLDivElement>(null);
	const wordCloudMobileContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const updateSize = () => {
			// 데스크탑과 모바일 컨테이너 크기 확인
			const desktopContainer = wordCloudContainerRef.current;
			const mobileContainer = wordCloudMobileContainerRef.current;
			const activeContainer = mobileContainer || desktopContainer;

			if (activeContainer) {
				const containerRect = activeContainer.getBoundingClientRect();
				const width = Math.min(600, containerRect.width);
				// 모바일의 경우 컨테이너 높이에 맞춤 (200px 또는 250px)
				const height = mobileContainer
					? containerRect.height
					: Math.min(300, width * 0.5);
				setWordCloudSize({ width, height });
			} else {
				// 초기 렌더링 시 fallback
				const width = Math.min(600, window.innerWidth - 32);
				const height = Math.min(300, width * 0.5);
				setWordCloudSize({ width, height });
			}
		};

		// 약간의 지연을 두어 DOM이 완전히 렌더링된 후 크기 계산
		const timeoutId = setTimeout(updateSize, 0);

		window.addEventListener('resize', updateSize);
		// ResizeObserver를 사용하여 컨테이너 크기 변화 감지
		const resizeObserver = new ResizeObserver(updateSize);

		// ref가 연결된 후에 observe 시작
		const observeContainers = () => {
			if (wordCloudContainerRef.current) {
				resizeObserver.observe(wordCloudContainerRef.current);
			}
			if (wordCloudMobileContainerRef.current) {
				resizeObserver.observe(wordCloudMobileContainerRef.current);
			}
		};

		// 즉시 시도하고, 약간의 지연 후에도 시도 (탭 전환 시 DOM 재연결 대비)
		observeContainers();
		const observeTimeoutId = setTimeout(observeContainers, 100);

		return () => {
			clearTimeout(timeoutId);
			clearTimeout(observeTimeoutId);
			window.removeEventListener('resize', updateSize);
			resizeObserver.disconnect();
		};
	}, [activeTab]); // activeTab이 변경될 때마다 다시 설정

	return (
		<div className="w-full h-full bg-white overflow-auto">
			<div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
				{/* 헤더 */}
				<div className="mb-4 sm:mb-6">
					<div className="flex items-center gap-2 sm:gap-4">
						<div className="flex items-center gap-2 sm:gap-3">
							{companyData.companyId &&
								getStockImageUrl(
									companyData.companyId,
									companyData.isDomestic
								) && (
									<div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-lg border border-border overflow-hidden flex items-center justify-center">
										<Image
											src={
												getStockImageUrl(
													companyData.companyId,
													companyData.isDomestic
												)!
											}
											alt={companyData.name}
											fill
											className="object-contain"
											sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1280px"
										/>
									</div>
								)}
							<h2 className="text-lg sm:text-xl md:text-2xl font-bold">
								{companyData.name}
							</h2>
						</div>
					</div>
				</div>

				{/* 데스크톱 레이아웃 */}
				<div className="hidden lg:flex flex-row gap-8">
					{/* 메인 콘텐츠 영역 */}
					<div className="flex-1 space-y-6">
						{/* 기업 정보 제목 */}
						<h2 className="text-2xl font-bold">기업 정보</h2>
						{/* 네트워크 그래프 */}
						<div className="h-[600px] w-full border border-border rounded-lg overflow-hidden bg-white relative">
							<GraphCanvas
								nodes={nodes as GraphNode[]}
								edges={edges as GraphEdge[]}
								layoutType="forceDirected2d"
								labelType="all"
								edgeInterpolation="curved"
							/>
						</div>

						{/* 워드 클라우드 */}
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
								className="h-[300px] w-full overflow-hidden"
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
							</div>
						</div>

						{/* 뉴스 및 공시 목록 */}
						<div className="grid grid-cols-2 gap-6">
							{/* 뉴스 목록 */}
							<div className="border border-border rounded-lg p-6 bg-white">
								<h3 className="text-xl font-bold mb-4">뉴스</h3>
								<div className="space-y-2 max-h-[400px] overflow-y-auto">
									{newsData.length > 0 ? (
										newsData.map((news) => (
											<NewsItem
												key={news.id}
												id={news.id}
												title={news.title}
												description={news.description}
												publishedAt={news.publishedAt}
												thumbnailUrl={news.thumbnailUrl}
												publisher={news.publisher}
											/>
										))
									) : (
										<div className="text-sm text-muted-foreground text-center py-8">
											뉴스가 없습니다.
										</div>
									)}
								</div>
							</div>

							{/* 공시 목록 */}
							<div className="border border-border rounded-lg p-6 bg-white">
								<h3 className="text-xl font-bold mb-4">공시</h3>
								<div className="space-y-2 max-h-[400px] overflow-y-auto">
									{announcementsData.length > 0 ? (
										announcementsData.map((announcement) => (
											<a
												key={announcement.announcementId}
												href={announcement.announcementUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="block border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
											>
												<div className="flex items-start justify-between gap-2 mb-2">
													<span className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground">
														{announcement.category}
													</span>
													<span className="text-xs text-muted-foreground whitespace-nowrap">
														{new Date(
															announcement.publishedAt
														).toLocaleDateString('ko-KR', {
															year: 'numeric',
															month: '2-digit',
															day: '2-digit',
														})}
													</span>
												</div>
												<h4 className="text-sm font-medium line-clamp-2">
													{announcement.title}
												</h4>
											</a>
										))
									) : (
										<div className="text-sm text-muted-foreground text-center py-8">
											공시 정보가 없습니다.
										</div>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* 우측 사이드바 */}
					<div className="w-80 shrink-0">
						<div className="sticky top-8 space-y-4">
							{/* 연관 기업 제목 */}
							<h2 className="text-2xl font-bold mb-4">연관 기업</h2>
							{/* 기업 목록 */}
							<div className="space-y-3">
								{companyData.related.map((company) => (
									<CompanyItem
										key={`${company.companyId || ''}-${company.name}`}
										companyId={company.companyId}
										name={company.name}
										isListed={company.isListed}
										isDomestic={company.isDomestic}
										sentiment={company.sentiment as Sentiment}
										tags={company.tags}
										showSentiment={false}
										price={company.price}
									/>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* 모바일 탭 레이아웃 */}
				<div className="lg:hidden">
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList>
							<TabsTrigger value="network">기업 정보</TabsTrigger>
							<TabsTrigger value="companies">연관 기업</TabsTrigger>
						</TabsList>
						<TabsContent value="network" className="mt-6 space-y-4">
							{/* 네트워크 그래프 */}
							<div className="h-[300px] w-full border border-border rounded-lg overflow-hidden bg-white relative">
								<GraphCanvas
									nodes={nodes as GraphNode[]}
									edges={edges as GraphEdge[]}
									layoutType="forceDirected2d"
									labelType="all"
									edgeInterpolation="curved"
								/>
							</div>

							{/* 워드 클라우드 */}
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
									className="h-[200px] sm:h-[250px] w-full overflow-hidden"
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
								</div>
							</div>

							{/* 뉴스 및 공시 목록 */}
							<div className="grid grid-cols-1 gap-4">
								{/* 뉴스 목록 */}
								<div className="border border-border rounded-lg p-4 bg-white">
									<h3 className="text-base sm:text-lg font-bold mb-4">뉴스</h3>
									<div className="space-y-2 max-h-[400px] overflow-y-auto">
										{newsData.length > 0 ? (
											newsData.map((news) => (
												<NewsItem
													key={news.id}
													id={news.id}
													title={news.title}
													description={news.description}
													publishedAt={news.publishedAt}
													thumbnailUrl={news.thumbnailUrl}
													publisher={news.publisher}
												/>
											))
										) : (
											<div className="text-xs sm:text-sm text-muted-foreground text-center py-8">
												뉴스가 없습니다.
											</div>
										)}
									</div>
								</div>

								{/* 공시 목록 */}
								<div className="border border-border rounded-lg p-4 bg-white">
									<h3 className="text-base sm:text-lg font-bold mb-4">공시</h3>
									<div className="space-y-2 max-h-[400px] overflow-y-auto">
										{announcementsData.length > 0 ? (
											announcementsData.map((announcement) => (
												<a
													key={announcement.announcementId}
													href={announcement.announcementUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="block border border-border rounded-lg p-3 sm:p-4 hover:bg-muted/50 transition-colors"
												>
													<div className="flex items-start justify-between gap-2 mb-2">
														<span className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground">
															{announcement.category}
														</span>
														<span className="text-xs text-muted-foreground whitespace-nowrap">
															{new Date(
																announcement.publishedAt
															).toLocaleDateString('ko-KR', {
																year: 'numeric',
																month: '2-digit',
																day: '2-digit',
															})}
														</span>
													</div>
													<h4 className="text-xs sm:text-sm font-medium line-clamp-2">
														{announcement.title}
													</h4>
												</a>
											))
										) : (
											<div className="text-xs sm:text-sm text-muted-foreground text-center py-8">
												공시 정보가 없습니다.
											</div>
										)}
									</div>
								</div>
							</div>
						</TabsContent>
						<TabsContent value="companies" className="mt-6">
							<div className="space-y-3">
								{companyData.related.map((company) => (
									<CompanyItem
										key={company.companyId}
										companyId={company.companyId}
										name={company.name}
										isListed={company.isListed}
										isDomestic={company.isDomestic}
										sentiment={company.sentiment as Sentiment}
										tags={company.tags}
										showSentiment={false}
										price={company.price}
									/>
								))}
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
};

export default CompanyDetailClientContainer;
