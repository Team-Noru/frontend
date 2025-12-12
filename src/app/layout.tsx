import localFont from 'next/font/local';

import QueryClientProvider from '@/components/providers/QueryClientProvider';

import type { Metadata } from 'next';

import './globals.css';

const pretendard = localFont({
	src: './fonts/PretendardVariable.woff2',
	display: 'swap',
	weight: '45 920',
	variable: '--font-pretendard',
});

export const metadata: Metadata = {
	title: 'TEAM NORU',
	description: 'NORU NORU',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${pretendard.className} antialiased flex w-dvw h-dvh overflow-hidden bg-custom-gray-bg`}
			>
				<QueryClientProvider>{children}</QueryClientProvider>
			</body>
		</html>
	);
}
