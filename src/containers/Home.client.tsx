'use client';

import { useState } from 'react';

import CompanyItem from '@/components/CompanyItem';
import NewsItem from '@/components/NewsItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Company, Sentiment } from '@/types/company';
import { News } from '@/types/news';

interface Props {
	newsData: News[];
	companies: Company[];
}

const HomeClientContainer: React.FC<Props> = ({ newsData, companies }) => {
	const [activeTab, setActiveTab] = useState('news');

	return (
		<div className="w-full h-full bg-white overflow-auto">
			<div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
				{/* 데스크톱 레이아웃 */}
				<div className="hidden lg:flex flex-row gap-8">
					{/* 왼쪽: 뉴스 목록 */}
					<div className="flex-1">
						<h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
							오늘의 뉴스
						</h2>
						<div className="space-y-2">
							{newsData && newsData.length > 0 ? (
								newsData.map((news) => (
									<NewsItem
										key={news.id}
										id={news.id}
										title={news.title}
										description={news.description}
										publishedAt={news.publishedAt}
										thumbnailUrl={news.thumbnailUrl}
										publisher={news.publisher}
									/>
								))
							) : (
								<div className="text-center py-8 text-gray-500">
									오늘의 뉴스가 없습니다.
								</div>
							)}
						</div>
					</div>

					{/* 오른쪽: 기업 목록 */}
					<div className="w-80 shrink-0">
						<div className="sticky top-8">
							<h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
								기업 목록
							</h2>
							<div className="space-y-3">
								{companies.map((company) => (
									<CompanyItem
										key={`${company.companyId || ''}-${company.name}`}
										companyId={company.companyId}
										name={company.name}
										isListed={company.isListed}
										isDomestic={company.isDomestic}
										sentiment={company.sentiment as Sentiment}
										tags={company.tags}
										showSentiment={false}
										price={company.price}
										diffPrice={company.diffPrice}
										diffRate={company.diffRate}
									/>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* 모바일 탭 레이아웃 */}
				<div className="lg:hidden">
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList>
							<TabsTrigger value="news">오늘의 뉴스</TabsTrigger>
							<TabsTrigger value="companies">기업 목록</TabsTrigger>
						</TabsList>
						<TabsContent value="news" className="mt-6">
							<div className="space-y-2">
								{newsData && newsData.length > 0 ? (
									newsData.map((news) => (
										<NewsItem
											key={news.id}
											id={news.id}
											title={news.title}
											description={news.description}
											publishedAt={news.publishedAt}
											thumbnailUrl={news.thumbnailUrl}
											publisher={news.publisher}
										/>
									))
								) : (
									<div className="text-center py-8 text-gray-500">
										오늘의 뉴스가 없습니다.
									</div>
								)}
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
										price={company.price}
										diffPrice={company.diffPrice}
										diffRate={company.diffRate}
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
