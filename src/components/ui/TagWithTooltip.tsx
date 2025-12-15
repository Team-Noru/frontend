'use client';

import { FC } from 'react';

import { cn } from '@/lib/utils';
import { Tag } from '@/types/company';

interface TagWithTooltipProps {
	tag: Tag;
	tooltipText: string;
	relReasons: string[];
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

	return (
		<span
			className={cn(
				'relative group px-2 py-0.5 sm:py-1 text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md font-medium',
				isMobile ? 'cursor-pointer' : 'cursor-help'
			)}
			onClick={handleClick}
		>
			{tag.label}
			{!isMobile && tooltipText && (
				<span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1.5 text-xs text-white bg-gray-900 dark:bg-gray-800 rounded-md whitespace-pre-line opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-50 w-[250px] text-left shadow-lg pointer-events-none">
					{tooltipText}
					<span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></span>
				</span>
			)}
		</span>
	);
};
