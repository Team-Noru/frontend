'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

interface TabsContextValue {
	value: string;
	onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(
	undefined
);

interface TabsProps {
	defaultValue?: string;
	value?: string;
	onValueChange?: (value: string) => void;
	children: React.ReactNode;
	className?: string;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
	(
		{
			defaultValue,
			value: controlledValue,
			onValueChange,
			children,
			className,
		},
		ref
	) => {
		const [uncontrolledValue, setUncontrolledValue] = React.useState(
			defaultValue || ''
		);
		const isControlled = controlledValue !== undefined;
		const value = isControlled ? controlledValue : uncontrolledValue;

		const handleValueChange = React.useCallback(
			(newValue: string) => {
				if (!isControlled) {
					setUncontrolledValue(newValue);
				}
				onValueChange?.(newValue);
			},
			[isControlled, onValueChange]
		);

		return (
			<TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
				<div ref={ref} className={className}>
					{children}
				</div>
			</TabsContext.Provider>
		);
	}
);
Tabs.displayName = 'Tabs';

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
	title?: string;
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
	({ className, title, children, ...props }, ref) => {
		return (
			<div ref={ref} className={cn('space-y-4', className)} {...props}>
				{title && (
					<h2 className="text-lg sm:text-xl font-bold text-foreground">
						{title}
					</h2>
				)}
				<div className="flex items-end -mx-4 sm:-mx-6 md:-mx-8 overflow-x-auto border-b border-border [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
					<div className="flex items-end px-4 sm:px-6 md:px-8 gap-4 sm:gap-6">
						{children}
					</div>
				</div>
			</div>
		);
	}
);
TabsList.displayName = 'TabsList';

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
	({ className, value, children, ...props }, ref) => {
		const context = React.useContext(TabsContext);
		if (!context) {
			throw new Error('TabsTrigger must be used within Tabs');
		}

		const isActive = context.value === value;

		return (
			<button
				ref={ref}
				type="button"
				role="tab"
				aria-selected={isActive}
				className={cn(
					'whitespace-nowrap pb-2 px-1 transition-colors relative',
					isActive
						? 'font-bold text-foreground'
						: 'font-normal text-muted-foreground hover:text-foreground',
					className
				)}
				onClick={() => context.onValueChange(value)}
				{...props}
			>
				{children}
				{isActive && (
					<span className="absolute -bottom-px left-0 right-0 h-[2px] bg-foreground" />
				)}
			</button>
		);
	}
);
TabsTrigger.displayName = 'TabsTrigger';

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
	value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
	({ className, value, children, ...props }, ref) => {
		const context = React.useContext(TabsContext);
		if (!context) {
			throw new Error('TabsContent must be used within Tabs');
		}

		if (context.value !== value) {
			return null;
		}

		return (
			<div ref={ref} className={className} {...props}>
				{children}
			</div>
		);
	}
);
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
