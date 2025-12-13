'use client';

import BackButton from './BackButton';

interface Props {
	fallbackUrl?: string;
}

const MobileHeader: React.FC<Props> = ({ fallbackUrl = '/' }) => {
	return (
		<header className="sticky top-0 z-50 bg-white border-b border-border lg:hidden">
			<div className="flex items-center h-14 px-4">
				<BackButton
					fallbackUrl={fallbackUrl}
					className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors -ml-2"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="text-foreground"
					>
						<path d="m12 19-7-7 7-7" />
						<path d="M19 12H5" />
					</svg>
				</BackButton>
			</div>
		</header>
	);
};

export default MobileHeader;
