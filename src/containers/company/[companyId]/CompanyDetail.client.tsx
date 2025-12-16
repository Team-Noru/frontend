'use client';

import { FC, useMemo, useState } from 'react';

import Image from 'next/image';

import CompanyNetworkGraph from '@/components/company/CompanyNetworkGraph';
import CompanyWordCloud from '@/components/company/CompanyWordCloud';
import CompanyItem from '@/components/CompanyItem';
import NewsItem from '@/components/NewsItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatPrice } from '@/lib/format';
import { sortCompanies } from '@/lib/sort';
import { cn } from '@/lib/utils';
import { getStockImageUrl } from '@/lib/values';
import {
	Announcement,
	CompanyDetail,
	Sentiment,
	WordDataDTO,
} from '@/types/company';
import { News } from '@/types/news';

interface Props {
	companyData: CompanyDetail;
	wordCloudData: WordDataDTO[];
	newsData: News[];
	announcementsData: Announcement[];
}

const CompanyDetailClientContainer: FC<Props> = ({
	companyData,
	wordCloudData,
	newsData,
	announcementsData,
}) => {
	const [activeTab, setActiveTab] = useState('network');

	// 연관 기업 정렬: companyId가 있는 회사를 우선, 그 다음 isDomestic && isListed > isDomestic && !isListed > !isDomestic
	const sortedRelatedCompanies = useMemo(() => {
		return sortCompanies(companyData.related).filter(
			(company) => company.companyId && company.isDomestic && company.isListed
		);
	}, [companyData.related, companyData.companyId]);

	return (
		<div className="w-full h-full bg-white overflow-auto">
			<div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
				{/* 헤더 */}
				<div className="mb-4 sm:mb-6">
					<div className="flex items-center gap-2 sm:gap-4">
						<div className="flex items-center gap-2 sm:gap-3">
							{companyData.companyId &&
								getStockImageUrl(
									companyData.companyId,
									companyData.isDomestic
								) && (
									<div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-lg border border-border overflow-hidden flex items-center justify-center">
										<Image
											src={
												getStockImageUrl(
													companyData.companyId,
													companyData.isDomestic
												)!
											}
											alt={companyData.name}
											fill
											className="object-contain"
											sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1280px"
										/>
									</div>
								)}
							<div className="flex flex-col gap-1">
								<h2 className="text-lg sm:text-xl md:text-2xl font-bold">
									{companyData.name}
								</h2>
								{companyData.price !== undefined &&
									companyData.price !== -1 && (
										<div className="flex items-center gap-1.5 sm:gap-2">
											<span className="text-xs sm:text-sm text-muted-foreground">
												{formatPrice(companyData.price)}
											</span>
											{companyData.diffPrice !== undefined &&
												companyData.diffRate !== undefined && (
													<span
														className={cn(
															'text-xs sm:text-sm font-medium flex items-center gap-0.5',
															companyData.diffPrice > 0
																? 'text-red-600 dark:text-red-400'
																: companyData.diffPrice < 0
																	? 'text-blue-600 dark:text-blue-400'
																	: 'text-gray-500 dark:text-gray-400'
														)}
													>
														<span>
															{companyData.diffPrice === 0
																? '-'
																: `${companyData.diffPrice > 0 ? '' : '-'}${formatPrice(
																		Math.abs(companyData.diffPrice)
																	)}(${companyData.diffPrice > 0 ? '+' : ''}${companyData.diffRate.toFixed(2)}%)`}
														</span>
													</span>
												)}
										</div>
									)}
							</div>
						</div>
					</div>
				</div>

				{/* 데스크톱 레이아웃 */}
				<div className="hidden lg:flex flex-row gap-8">
					{/* 메인 콘텐츠 영역 */}
					<div className="flex-1 space-y-6">
						{/* 기업 정보 제목 */}
						<h2 className="text-2xl font-bold">기업 정보</h2>
						{/* 네트워크 그래프 */}
						<div className="h-[600px] w-full border border-border rounded-lg overflow-hidden bg-white relative">
							<CompanyNetworkGraph companyData={companyData} />
						</div>
						{/* 워드 클라우드 */}
						<CompanyWordCloud wordCloudData={wordCloudData} />

						{/* 뉴스 및 공시 목록 */}
						<div className="grid grid-cols-2 gap-6">
							{/* 뉴스 목록 */}
							{newsData && newsData.length > 0 && (
								<div className="border border-border rounded-lg p-6 bg-white">
									<h3 className="text-xl font-bold mb-4">뉴스</h3>
									<div className="space-y-2 max-h-[400px] overflow-y-auto">
										{newsData.map((news) => (
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
							)}

							{/* 공시 목록 */}
							{announcementsData && announcementsData.length > 0 && (
								<div className="border border-border rounded-lg p-6 bg-white">
									<h3 className="text-xl font-bold mb-4">공시</h3>
									<div className="space-y-2 max-h-[400px] overflow-y-auto">
										{announcementsData.map((announcement) => (
											<a
												key={announcement.announcementId}
												href={announcement.announcementUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="block border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
											>
												<div className="flex items-start justify-between gap-2 mb-2">
													<span className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground">
														{announcement.category}
													</span>
													<span className="text-xs text-muted-foreground whitespace-nowrap">
														{new Date(
															announcement.publishedAt
														).toLocaleDateString('ko-KR', {
															year: 'numeric',
															month: '2-digit',
															day: '2-digit',
														})}
													</span>
												</div>
												<h4 className="text-sm font-medium line-clamp-2">
													{announcement.title}
												</h4>
											</a>
										))}
									</div>
								</div>
							)}
						</div>
					</div>

					{/* 우측 사이드바 */}
					<div className="w-80 shrink-0">
						<div className="sticky top-8 space-y-4">
							{/* 연관 기업 제목 */}
							<h2 className="text-2xl font-bold mb-4">연관 기업</h2>
							{/* 기업 목록 */}
							<div className="space-y-3">
								{sortedRelatedCompanies.map((company) => (
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
							<TabsTrigger value="network">기업 정보</TabsTrigger>
							<TabsTrigger value="companies">연관 기업</TabsTrigger>
						</TabsList>
						<TabsContent value="network" className="mt-6 space-y-4">
							{/* 네트워크 그래프 */}
							<div className="h-[300px] w-full border border-border rounded-lg overflow-hidden bg-white relative">
								<CompanyNetworkGraph companyData={companyData} />
							</div>
							{/* 워드 클라우드 */}
							<CompanyWordCloud wordCloudData={wordCloudData} />

							{/* 뉴스 및 공시 목록 */}
							<div className="grid grid-cols-1 gap-4">
								{/* 뉴스 목록 */}
								{newsData && newsData.length > 0 && (
									<div className="border border-border rounded-lg p-4 bg-white">
										<h3 className="text-base sm:text-lg font-bold mb-4">
											뉴스
										</h3>
										<div className="space-y-2 max-h-[400px] overflow-y-auto">
											{newsData.map((news) => (
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
								)}

								{/* 공시 목록 */}
								{announcementsData && announcementsData.length > 0 && (
									<div className="border border-border rounded-lg p-4 bg-white">
										<h3 className="text-base sm:text-lg font-bold mb-4">
											공시
										</h3>
										<div className="space-y-2 max-h-[400px] overflow-y-auto">
											{announcementsData.map((announcement) => (
												<a
													key={announcement.announcementId}
													href={announcement.announcementUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="block border border-border rounded-lg p-3 sm:p-4 hover:bg-muted/50 transition-colors"
												>
													<div className="flex items-start justify-between gap-2 mb-2">
														<span className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground">
															{announcement.category}
														</span>
														<span className="text-xs text-muted-foreground whitespace-nowrap">
															{new Date(
																announcement.publishedAt
															).toLocaleDateString('ko-KR', {
																year: 'numeric',
																month: '2-digit',
																day: '2-digit',
															})}
														</span>
													</div>
													<h4 className="text-xs sm:text-sm font-medium line-clamp-2">
														{announcement.title}
													</h4>
												</a>
											))}
										</div>
									</div>
								)}
							</div>
						</TabsContent>
						<TabsContent value="companies" className="mt-6">
							<div className="space-y-3">
								{sortedRelatedCompanies.map((company) => (
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

export default CompanyDetailClientContainer;
