'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

interface PopoverProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	children: React.ReactNode;
	ref?: React.Ref<HTMLDivElement>;
}

const Popover = ({
	open,
	onOpenChange,
	children,
	ref,
	...props
}: PopoverProps) => {
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
};

interface PopoverTriggerProps {
	children: React.ReactNode;
	onClick?: () => void;
	className?: string;
	ref?: React.Ref<HTMLDivElement>;
}

const PopoverTrigger = ({
	children,
	className,
	ref,
	...props
}: PopoverTriggerProps) => {
	return (
		<div ref={ref} className={cn('w-full', className)} {...props}>
			{children}
		</div>
	);
};

interface PopoverContentProps {
	children: React.ReactNode;
	onClose?: () => void;
	className?: string;
	align?: 'start' | 'center' | 'end';
	ref?: React.Ref<HTMLDivElement>;
}

const PopoverContent = ({
	children,
	className,
	align = 'start',
	ref,
	...props
}: PopoverContentProps) => {
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

	// ref를 contentRef에 할당
	React.useEffect(() => {
		if (ref && 'current' in ref) {
			(ref as React.MutableRefObject<HTMLDivElement | null>).current =
				contentRef.current;
		}
	}, [ref]);

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
};

export { Popover, PopoverTrigger, PopoverContent };
