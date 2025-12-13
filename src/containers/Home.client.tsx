'use client';

import { useState } from 'react';

import CompanyItem from '@/components/CompanyItem';
import NewsItem from '@/components/NewsItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetNewsByDate } from '@/hooks/api/news/useGetNewsByDate';
import { Sentiment } from '@/types/company';

const HomeClientContainer = () => {
	const { data: newsData } = useGetNewsByDate('2025-11-30');
	const [activeTab, setActiveTab] = useState('news');
	// 예시 데이터
	// const newsData = [
	// 	{
	// 		id: 1,
	// 		title: "美 AI 엔지니어 200억 주는데...'AI 블랙홀'에 인재 유출 가속",
	// 		description:
	// 			'Coffee is the most popular drink in the world and drinking coffee in the morning has become a routine for many people before their activities. Besides being considered to be able to provide energy intake, it turns out that the ...',
	// 		pulishedAt: '2023-05-31',
	// 		thumbnailUrl: undefined,
	// 		publisher: 'SBS BIZ',
	// 		author: '홍길동',
	// 	},
	// 	{
	// 		id: 2,
	// 		title: "美 AI 엔지니어 200억 주는데...'AI 블랙홀'에 인재 유출 가속",
	// 		description:
	// 			'Coffee is the most popular drink in the world and drinking coffee in the morning has become a routine for many people before their activities. Besides being considered to be able to provide energy intake, it turns out that the ...',
	// 		pulishedAt: '2023-05-31',
	// 		thumbnailUrl: undefined,
	// 		publisher: 'SBS BIZ',
	// 		author: '홍길동',
	// 	},
	// 	{
	// 		id: 3,
	// 		title: "美 AI 엔지니어 200억 주는데...'AI 블랙홀'에 인재 유출 가속",
	// 		description:
	// 			'Coffee is the most popular drink in the world and drinking coffee in the morning has become a routine for many people before their activities. Besides being considered to be able to provide energy intake, it turns out that the ...',
	// 		pulishedAt: '2023-05-31',
	// 		thumbnailUrl: undefined,
	// 		publisher: 'SBS BIZ',
	// 		author: '홍길동',
	// 	},
	// 	{
	// 		id: 4,
	// 		title: "美 AI 엔지니어 200억 주는데...'AI 블랙홀'에 인재 유출 가속",
	// 		description:
	// 			'Coffee is the most popular drink in the world and drinking coffee in the morning has become a routine for many people before their activities. Besides being considered to be able to provide energy intake, it turns out that the ...',
	// 		pulishedAt: '2023-05-31',
	// 		thumbnailUrl: undefined,
	// 		publisher: 'SBS BIZ',
	// 		author: '홍길동',
	// 	},
	// 	{
	// 		id: 5,
	// 		title: "美 AI 엔지니어 200억 주는데...'AI 블랙홀'에 인재 유출 가속",
	// 		description:
	// 			'Coffee is the most popular drink in the world and drinking coffee in the morning has become a routine for many people before their activities. Besides being considered to be able to provide energy intake, it turns out that the ...',
	// 		pulishedAt: '2023-05-31',
	// 		thumbnailUrl: undefined,
	// 		publisher: 'SBS BIZ',
	// 		author: '홍길동',
	// 	},
	// ];

	const companies = [
		{
			companyId: '055550',
			name: '신한지주',
			isListed: true,
			isDomestic: true,
			sentiment: 'positive',
			tags: [],
		},
		{
			companyId: 'GOOGL',
			name: '알파벳 A',
			isListed: false,
			isDomestic: false,
			sentiment: 'positive',
			tags: [],
		},
		{
			companyId: '005930',
			name: '삼성전자',
			isListed: true,
			isDomestic: true,
			sentiment: 'positive',
			tags: [],
		},
		{
			companyId: '035420',
			name: '네이버',
			isListed: true,
			isDomestic: true,
			sentiment: 'positive',
			tags: [],
		},
	];

	return (
		<div className="w-full h-full bg-white overflow-auto">
			<div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
				{/* 헤더 */}
				<h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
					서비스이름
				</h1>

				{/* 데스크톱 레이아웃 */}
				<div className="hidden lg:flex flex-row gap-8">
					{/* 왼쪽: 뉴스 목록 */}
					<div className="flex-1">
						<div className="space-y-2">
							{newsData?.map((news) => (
								<NewsItem
									key={news.id}
									id={news.id}
									title={news.title}
									description={news.description}
									publishedAt={news.publishedAt}
									thumbnailUrl={news.thumbnailUrl}
									publisher={news.publisher}
								/>
							))}
						</div>
					</div>

					{/* 오른쪽: 기업 목록 */}
					<div className="w-80 shrink-0">
						<h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
							기업 목록
						</h2>
						<div className="space-y-3">
							{companies.map((company) => (
								<CompanyItem
									key={company.companyId}
									companyId={company.companyId}
									name={company.name}
									isListed={company.isListed}
									isDomestic={company.isDomestic}
									sentiment={company.sentiment as Sentiment}
									tags={company.tags}
									showSentiment={false}
								/>
							))}
						</div>
					</div>
				</div>

				{/* 모바일 탭 레이아웃 */}
				<div className="lg:hidden">
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList>
							<TabsTrigger value="news">뉴스 목록</TabsTrigger>
							<TabsTrigger value="companies">기업 목록</TabsTrigger>
						</TabsList>
						<TabsContent value="news" className="mt-6">
							<div className="space-y-2">
								{newsData?.map((news) => (
									<NewsItem
										key={news.id}
										id={news.id}
										title={news.title}
										description={news.description}
										publishedAt={news.publishedAt}
										thumbnailUrl={news.thumbnailUrl}
										publisher={news.publisher}
									/>
								))}
							</div>
						</TabsContent>
						<TabsContent value="companies" className="mt-6">
							<div className="space-y-3">
								{companies.map((company) => (
									<CompanyItem
										key={company.companyId}
										companyId={company.companyId}
										name={company.name}
										isListed={company.isListed}
										isDomestic={company.isDomestic}
										sentiment={company.sentiment as Sentiment}
										tags={company.tags}
										showSentiment={false}
									/>
								))}
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
};

export default HomeClientContainer;
