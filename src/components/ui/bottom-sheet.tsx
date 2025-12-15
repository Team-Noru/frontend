'use client';

import React from 'react';

import { cn } from '@/lib/utils';

interface BottomSheetProps {
	open: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
	open,
	onClose,
	title,
	children,
}) => {
	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	if (!open) return null;

	return (
		<div
			className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-end justify-center"
			onClick={onClose}
			style={{ width: '100%', height: '100%' }}
		>
			{/* Backdrop */}
			<div className="absolute inset-0 bg-black/50" />

			{/* Sheet */}
			<div
				className={cn(
					'absolute bottom-0 left-0 right-0 w-full max-w-lg mx-auto bg-white dark:bg-gray-900 rounded-t-xl shadow-lg transition-transform',
					open ? 'translate-y-0' : 'translate-y-full'
				)}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Handle */}
				<div className="flex justify-center pt-3 pb-2">
					<div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
				</div>

				{/* Header */}
				{title && (
					<div className="px-4 pb-4 border-b border-border">
						<h3 className="text-lg font-semibold">{title}</h3>
					</div>
				)}

				{/* Content */}
				<div className="max-h-[70vh] overflow-y-auto px-4 py-4">{children}</div>
			</div>
		</div>
	);
};

export default BottomSheet;
