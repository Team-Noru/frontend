import { ReactNode } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import {
	getSentimentColor,
	getSentimentLabel,
	getStockImageUrl,
} from '@/lib/values';
import { Sentiment, Tag } from '@/types/company';

interface CompanyItemProps {
	id: string;
	stockCode?: string;
	name: string;
	isListed?: boolean;
	sentiment?: Sentiment;
	tags?: Tag[];
	// 기존 props (하위 호환성)
	logo?: ReactNode;
	price?: string;
	// 표시 옵션
	showSentiment?: boolean;
}

export default function CompanyItem({
	id,
	stockCode,
	name,
	isListed,
	sentiment,
	tags = [],
	logo,
	price,
	showSentiment = false,
}: CompanyItemProps) {
	const stockImageUrl = getStockImageUrl(stockCode);

	return (
		<Link
			href={`/company/${id}`}
			className="flex flex-col gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
		>
			<div className="flex items-start gap-3">
				{/* 로고 */}
				<div className="shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-border overflow-hidden">
					{stockImageUrl ? (
						<Image
							src={stockImageUrl}
							alt={name}
							width={48}
							height={48}
							className="object-contain"
						/>
					) : logo ? (
						logo
					) : (
						<div className="w-8 h-8 bg-gray-200 rounded"></div>
					)}
				</div>

				{/* 회사 정보 */}
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2">
						<div className="font-medium text-base">{name}</div>
						{isListed !== undefined && (
							<span className="text-xs text-muted-foreground">
								{isListed ? '상장' : '비상장'}
							</span>
						)}
						{stockCode && (
							<span className="text-xs text-muted-foreground">
								({stockCode})
							</span>
						)}
					</div>
					{price && (
						<div className="text-sm text-muted-foreground mt-1">{price}</div>
					)}
				</div>

				{/* Sentiment 버튼 */}
				{showSentiment && sentiment && (
					<button
						className={cn(
							'px-3 py-1 text-xs font-medium rounded-md border shrink-0 w-20 text-center',
							getSentimentColor(sentiment)
						)}
						type="button"
					>
						{getSentimentLabel(sentiment)}
					</button>
				)}
			</div>

			{/* Tags */}
			{tags && tags.length > 0 && (
				<div className="flex flex-wrap gap-2 mt-1">
					{tags.map((tag) => (
						<span
							key={tag.id}
							className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md"
						>
							{tag.label}
						</span>
					))}
				</div>
			)}
		</Link>
	);
}
