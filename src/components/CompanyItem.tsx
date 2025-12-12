import { FC } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import {
	getSentimentColor,
	getSentimentLabel,
	getStockImageUrl,
} from '@/lib/values';
import { Company } from '@/types/company';

interface Props extends Company {
	price?: string;
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
}) => {
	const stockImageUrl = getStockImageUrl(companyId, isDomestic);

	const content = (
		<div
			className={cn(
				'flex flex-col gap-3 p-4 bg-muted/50 rounded-lg transition-colors',
				isDomestic
					? 'hover:bg-muted cursor-pointer'
					: 'opacity-60 cursor-not-allowed'
			)}
		>
			<div className="flex items-start gap-3">
				{/* 로고 */}
				<div className="shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-border overflow-hidden">
					{stockImageUrl &&
						(isDomestic ? (
							<Image
								src={stockImageUrl}
								alt={name}
								width={48}
								height={48}
								className="object-contain"
							/>
						) : (
							<Image
								src={stockImageUrl}
								alt={name}
								width={32}
								height={32}
								className="object-contain"
								unoptimized
								preload
							/>
						))}
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
						{companyId && (
							<span className="text-xs text-muted-foreground">
								({companyId})
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
		</div>
	);

	if (isDomestic) {
		return (
			<Link href={`/company/${companyId}`} className="block">
				{content}
			</Link>
		);
	}

	return content;
};

export default CompanyItem;
