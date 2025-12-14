import { FC } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { getCompanyColor } from '@/lib/color';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';
import { getSentimentColor, getStockImageUrl } from '@/lib/values';
import { Company } from '@/types/company';

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
}) => {
	const stockImageUrl = getStockImageUrl(companyId, isDomestic);
	const shouldShowInitial = !isListed && isDomestic && !stockImageUrl;
	const initialLetter = name.charAt(0).toUpperCase();
	const backgroundColor = shouldShowInitial ? getCompanyColor(name) : undefined;

	const content = (
		<div
			className={cn(
				'flex flex-col gap-2 sm:gap-3 p-3 sm:p-4 bg-muted/50 rounded-lg transition-colors',
				isDomestic
					? 'hover:bg-muted cursor-pointer'
					: 'opacity-60 cursor-not-allowed'
			)}
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
						{companyId && (
							<span className="text-xs text-muted-foreground">
								({companyId})
							</span>
						)}
					</div>
					{price !== -1 && (
						<div className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
							{formatPrice(price)}
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
			{tags && tags.length > 0 && (
				<div className="flex flex-wrap gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
					{tags.map((tag) => (
						<span
							key={`${companyId}-${tag.label}`}
							className="px-2 py-0.5 sm:py-1 text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md font-medium"
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
