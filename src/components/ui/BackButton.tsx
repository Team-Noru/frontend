'use client';

import { PropsWithChildren } from 'react';

import { useRouter } from 'next/navigation';

interface Props {
	className?: string;
	fallbackUrl?: string;
}

const BackButton: React.FC<PropsWithChildren<Props>> = ({
	children,
	className,
	fallbackUrl = '/',
}) => {
	const router = useRouter();

	const handleBack = () => {
		let isSameOrigin = false;

		if (document.referrer) {
			try {
				const referrerOrigin = new URL(document.referrer).origin;
				isSameOrigin = referrerOrigin === window.location.origin;
			} catch {
				isSameOrigin = false;
			}
		}

		if (isSameOrigin) {
			router.back();
		} else {
			router.push(fallbackUrl);
		}
	};

	return (
		<div
			role="button"
			tabIndex={0}
			className={className}
			onClick={handleBack}
			data-testid="back-button"
			aria-label="뒤로가기"
		>
			{children}
		</div>
	);
};

export default BackButton;
