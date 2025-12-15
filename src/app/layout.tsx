import localFont from 'next/font/local';

import { Toaster } from 'sonner';

import Header from '@/components/Header';
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
	title: 'LINKompany',
	description: '기업과 기업을 연결하고 탐색하는 LINKompany',
	metadataBase: new URL('https://noru.panghae.site'),
	openGraph: {
		url: 'https://noru.panghae.site',
		siteName: 'LINKompany',
		description: '기업과 기업을 연결하고 탐색하는 LINKompany',
		images: '/og-image.png',
		locale: 'ko_KR',
		type: 'website',
		title: 'LINKompany',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko">
			<body
				className={`${pretendard.className} antialiased flex flex-col w-dvw h-dvh overflow-hidden bg-custom-gray-bg`}
			>
				<QueryClientProvider>
					<Header />
					<div className="flex-1 overflow-hidden">{children}</div>
				</QueryClientProvider>
				<Toaster position="top-right" />
			</body>
		</html>
	);
}
