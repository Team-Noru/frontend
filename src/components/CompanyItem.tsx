import React, { FC, useMemo, useState, useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import BottomSheet from '@/components/ui/bottom-sheet';
import { getCompanyColor } from '@/lib/color';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';
import { getSentimentColor, getStockImageUrl } from '@/lib/values';
import { Company, Tag } from '@/types/company';

import { TagWithTooltip } from './ui/TagWithTooltip';

interface Props extends Company {
	showSentiment?: boolean;
}

const CompanyItem: FC<Props> = ({
	companyId,
	name,
	isListed,
	sentiment,
	isDomestic,
	tags = [],
	price,
	showSentiment = false,
	diffPrice,
	diffRate,
}) => {
	const stockImageUrl = getStockImageUrl(companyId, isDomestic);
	// companyId가 없거나, isDomestic이 false이거나, (isListed가 false이고 isDomestic이 true이지만 stockImageUrl이 없는 경우) 초기 표시
	const shouldShowInitial =
		!companyId || !isDomestic || (!isListed && isDomestic && !stockImageUrl);
	const initialLetter = name.charAt(0).toUpperCase();
	const backgroundColor = shouldShowInitial ? getCompanyColor(name) : undefined;

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

	// 바텀시트 상태
	const [selectedTag, setSelectedTag] = useState<{
		tag: Tag;
		relReasons: {
			reason: string | null;
			newsId?: number;
			disclosureUrl?: string;
		}[];
	} | null>(null);

	// tag.label을 한글로 변환하는 함수
	const translateTagLabel = (label: string): string => {
		const labelMap: Record<string, string> = {
			OWNERSHIP_CHANGE: '주주 변경',
			IPO_DILUTION: 'IPO',
			CAPITAL_INCREASE: '유상증자',
		};
		return labelMap[label] || label;
	};

	// 태그를 label 기준으로 그룹화하고 relReason 수집
	const groupedTags = useMemo(() => {
		const tagMap = new Map<
			string,
			{
				tag: Tag;
				relReasons: {
					reason: string | null;
					newsId?: number;
					disclosureUrl?: string;
				}[];
			}
		>();
		tags.forEach((tag) => {
			const existing = tagMap.get(tag.label);
			if (tag.relReason) {
				const relReasonItem = {
					reason: tag.relReason,
					newsId: tag.newsId,
					disclosureUrl: tag.disclosureUrl,
				};
				if (existing) {
					// 중복된 label이 있으면 relReason만 추가 (newsId/disclosureUrl 포함)
					const exists = existing.relReasons.some(
						(item) =>
							item.reason === tag.relReason &&
							item.newsId === tag.newsId &&
							item.disclosureUrl === tag.disclosureUrl
					);
					if (!exists) {
						existing.relReasons.push(relReasonItem);
					}
				} else {
					// 새로운 label이면 새로 추가
					tagMap.set(tag.label, {
						tag,
						relReasons: [relReasonItem],
					});
				}
			}
		});
		return Array.from(tagMap.values());
	}, [tags]);

	const isClickable = !!companyId && isDomestic && isListed;

	const content = (
		<div
			className={cn(
				'flex flex-col gap-2 sm:gap-3 p-3 sm:p-4 bg-muted/50 rounded-lg transition-colors',
				isClickable
					? 'hover:bg-muted cursor-pointer'
					: 'opacity-60 cursor-not-allowed pointer-events-none'
			)}
			aria-disabled={!isClickable}
		>
			<div className="flex items-start gap-2 sm:gap-3">
				{/* 로고 */}
				<div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center border border-border overflow-hidden">
					{shouldShowInitial ? (
						<div
							className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base"
							style={{ backgroundColor }}
						>
							{initialLetter}
						</div>
					) : (
						stockImageUrl && (
							<Image
								src={stockImageUrl}
								alt={name}
								width={48}
								height={48}
								className="object-contain w-full h-full"
							/>
						)
					)}
				</div>

				{/* 회사 정보 */}
				<div className="flex-1 min-w-0">
					<div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
						<div className="font-medium text-sm sm:text-base">{name}</div>
					</div>
					{price !== -1 && (
						<div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
							<span className="text-[10px] sm:text-xs text-muted-foreground">
								{formatPrice(price)}
							</span>
							{diffPrice !== undefined && diffRate !== undefined && (
								<span
									className={cn(
										'text-[10px] sm:text-xs font-medium flex items-center gap-0.5',
										diffPrice > 0
											? 'text-red-600 dark:text-red-400'
											: diffPrice < 0
												? 'text-blue-600 dark:text-blue-400'
												: 'text-gray-500 dark:text-gray-400'
									)}
								>
									<span>
										{diffPrice === 0
											? '-'
											: `${diffPrice > 0 ? '' : '-'}${formatPrice(
													Math.abs(diffPrice)
												)}(${diffPrice > 0 ? '+' : ''}${diffRate.toFixed(2)}%)`}
									</span>
								</span>
							)}
						</div>
					)}
				</div>

				{/* Sentiment 버튼 */}
				{showSentiment && sentiment && (
					<button
						className={cn(
							'px-2 sm:px-3 py-1 text-xs font-medium rounded-md border shrink-0 w-16 sm:w-20 text-center',
							getSentimentColor(sentiment)
						)}
						type="button"
					>
						{sentiment}
					</button>
				)}
			</div>

			{/* Tags */}
			{groupedTags && groupedTags.length > 0 && (
				<div
					className={cn(
						'flex flex-wrap gap-1.5 sm:gap-2 mt-0.5 sm:mt-1',
						!isClickable && 'pointer-events-auto'
					)}
				>
					{groupedTags.map(({ tag, relReasons }) => {
						const translatedLabel = translateTagLabel(tag.label);
						// 변환된 label을 가진 tag 객체 생성
						const translatedTag = { ...tag, label: translatedLabel };
						return (
							<TagWithTooltip
								key={`${companyId}-${tag.label}-${tag.id}`}
								tag={translatedTag}
								relReasons={relReasons}
								onMobileClick={() =>
									isMobile &&
									setSelectedTag({
										tag: translatedTag,
										relReasons,
									})
								}
								isMobile={isMobile}
							/>
						);
					})}
				</div>
			)}
		</div>
	);

	if (isClickable) {
		return (
			<>
				<Link href={`/company/${companyId}`} className="block">
					{content}
				</Link>
				{/* 바텀시트 (모바일 전용) - content 밖에서 렌더링하여 opacity 영향 방지 */}
				{isMobile && selectedTag && (
					<BottomSheet
						open={!!selectedTag}
						onClose={() => setSelectedTag(null)}
						title={selectedTag.tag.label}
					>
						<div className="space-y-2">
							{selectedTag.relReasons.map((item, index) => (
								<div key={index} className="text-sm text-foreground">
									{item.newsId ? (
										<Link
											href={`/news/${item.newsId}`}
											className="flex items-center gap-1.5 hover:underline"
											onClick={() => setSelectedTag(null)}
										>
											•
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="shrink-0"
											>
												<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
												<polyline points="15 3 21 3 21 9" />
												<line x1="10" y1="14" x2="21" y2="3" />
											</svg>
											<span>{item.reason}</span>
										</Link>
									) : item.disclosureUrl ? (
										<a
											href={item.disclosureUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center gap-1.5 hover:underline"
											onClick={() => setSelectedTag(null)}
										>
											•
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="shrink-0"
											>
												<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
												<polyline points="15 3 21 3 21 9" />
												<line x1="10" y1="14" x2="21" y2="3" />
											</svg>
											<span>{item.reason}</span>
										</a>
									) : (
										<span>• {item.reason}</span>
									)}
								</div>
							))}
						</div>
					</BottomSheet>
				)}
			</>
		);
	}

	return (
		<>
			{content}
			{/* 바텀시트 (모바일 전용) - content 밖에서 렌더링하여 opacity 영향 방지 */}
			{isMobile && selectedTag && (
				<BottomSheet
					open={!!selectedTag}
					onClose={() => setSelectedTag(null)}
					title={selectedTag.tag.label}
				>
					<div className="space-y-2">
						{selectedTag.relReasons.map((item, index) => (
							<div key={index} className="text-sm text-foreground">
								{item.newsId ? (
									<Link
										href={`/news/${item.newsId}`}
										className="flex items-center gap-1.5 hover:underline"
										onClick={() => setSelectedTag(null)}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="shrink-0"
										>
											<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
											<polyline points="15 3 21 3 21 9" />
											<line x1="10" y1="14" x2="21" y2="3" />
										</svg>
										<span>· {item.reason}</span>
									</Link>
								) : item.disclosureUrl ? (
									<a
										href={item.disclosureUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-1.5 hover:underline"
										onClick={() => setSelectedTag(null)}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="shrink-0"
										>
											<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
											<polyline points="15 3 21 3 21 9" />
											<line x1="10" y1="14" x2="21" y2="3" />
										</svg>
										<span>· {item.reason}</span>
									</a>
								) : (
									<span>· {item.reason}</span>
								)}
							</div>
						))}
					</div>
				</BottomSheet>
			)}
		</>
	);
};

export default CompanyItem;
