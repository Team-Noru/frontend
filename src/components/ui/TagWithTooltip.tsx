'use client';

import { FC } from 'react';

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Tag } from '@/types/company';

interface TagWithTooltipProps {
	tag: Tag;
	tooltipText: string | null;
	relReasons: (string | null)[];
	onMobileClick?: () => void;
	isMobile: boolean;
}

export const TagWithTooltip: FC<TagWithTooltipProps> = ({
	tag,
	tooltipText,
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

	// 모바일이거나 tooltipText가 없으면 Tooltip 없이 반환
	if (isMobile || !tooltipText) {
		return tagElement;
	}

	// 데스크탑에서 tooltipText가 있으면 Tooltip으로 감싸서 반환
	return (
		<Tooltip>
			<TooltipTrigger asChild>{tagElement}</TooltipTrigger>
			<TooltipContent
				side="top"
				sideOffset={8}
				className="max-w-[250px] whitespace-pre-line text-left bg-gray-900 dark:bg-gray-800 text-white"
			>
				{tooltipText}
			</TooltipContent>
		</Tooltip>
	);
};
