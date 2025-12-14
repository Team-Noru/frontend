'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

interface PopoverProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	children: React.ReactNode;
}

const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
	({ open, onOpenChange, children, ...props }, ref) => {
		const [isOpen, setIsOpen] = React.useState(open ?? false);

		React.useEffect(() => {
			if (open !== undefined) {
				setIsOpen(open);
			}
		}, [open]);

		const handleOpenChange = (newOpen: boolean) => {
			setIsOpen(newOpen);
			onOpenChange?.(newOpen);
		};

		return (
			<div ref={ref} className="relative" {...props}>
				{React.Children.map(children, (child) => {
					if (React.isValidElement(child)) {
						if (child.type === PopoverTrigger) {
							return React.cloneElement(child, {
								onClick: () => handleOpenChange(!isOpen),
							} as any);
						}
						if (child.type === PopoverContent && isOpen) {
							return React.cloneElement(child, {
								onClose: () => handleOpenChange(false),
							} as any);
						}
					}
					return child;
				})}
			</div>
		);
	}
);
Popover.displayName = 'Popover';

interface PopoverTriggerProps {
	children: React.ReactNode;
	onClick?: () => void;
	className?: string;
}

const PopoverTrigger = React.forwardRef<HTMLDivElement, PopoverTriggerProps>(
	({ children, className, ...props }, ref) => {
		return (
			<div ref={ref} className={cn('w-full', className)} {...props}>
				{children}
			</div>
		);
	}
);
PopoverTrigger.displayName = 'PopoverTrigger';

interface PopoverContentProps {
	children: React.ReactNode;
	onClose?: () => void;
	className?: string;
	align?: 'start' | 'center' | 'end';
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
	({ children, className, align = 'start', ...props }) => {
		const contentRef = React.useRef<HTMLDivElement>(null);

		React.useEffect(() => {
			const handleClickOutside = (event: MouseEvent) => {
				if (
					contentRef.current &&
					!contentRef.current.contains(event.target as Node)
				) {
					props.onClose?.();
				}
			};

			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}, [props]);

		return (
			<div
				ref={contentRef}
				className={cn(
					'absolute z-50 w-full mt-2 bg-white border border-border rounded-lg shadow-lg',
					align === 'start' && 'left-0',
					align === 'center' && 'left-1/2 -translate-x-1/2',
					align === 'end' && 'right-0',
					className
				)}
				{...props}
			>
				{children}
			</div>
		);
	}
);
PopoverContent.displayName = 'PopoverContent';

export { Popover, PopoverTrigger, PopoverContent };
