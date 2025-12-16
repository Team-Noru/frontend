'use client';

import { FC } from 'react';

import Link from 'next/link';

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Tag } from '@/types/company';

interface TagWithTooltipProps {
	tag: Tag;
	relReasons: { reason: string | null; newsId?: number }[];
	onMobileClick?: () => void;
	isMobile: boolean;
}

export const TagWithTooltip: FC<TagWithTooltipProps> = ({
	tag,
	relReasons,
	onMobileClick,
	isMobile,
}) => {
	const handleClick = (e: React.MouseEvent) => {
		if (isMobile && onMobileClick) {
			e.preventDefault();
			e.stopPropagation();
			onMobileClick();
		}
	};

	const tagElement = (
		<span
			className={cn(
				'relative px-2 py-0.5 sm:py-1 text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md font-medium',
				isMobile ? 'cursor-pointer' : 'cursor-help'
			)}
			onClick={handleClick}
		>
			{tag.label}
		</span>
	);

	// relReasons가 없거나 모바일이면 Tooltip 없이 반환
	if (isMobile || !relReasons || relReasons.length === 0) {
		return tagElement;
	}

	// Tooltip 내용 렌더링
	const tooltipContent = (
		<div className="space-y-1">
			{relReasons.map((item, index) => (
				<div key={index} className="text-xs">
					{item.newsId ? (
						<Link
							href={`/news/${item.newsId}`}
							className="flex items-center gap-1.5 hover:underline"
							onClick={(e) => e.stopPropagation()}
						>
							•
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="12"
								height="12"
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
					) : (
						<span>· {item.reason}</span>
					)}
				</div>
			))}
		</div>
	);

	// 데스크탑에서 relReasons가 있으면 Tooltip으로 감싸서 반환
	return (
		<Tooltip>
			<TooltipTrigger asChild>{tagElement}</TooltipTrigger>
			<TooltipContent
				side="top"
				sideOffset={8}
				className="max-w-[250px] text-left bg-gray-900 dark:bg-gray-800 text-white"
			>
				{tooltipContent}
			</TooltipContent>
		</Tooltip>
	);
};
