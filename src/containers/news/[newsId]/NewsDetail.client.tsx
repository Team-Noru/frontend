'use client';

import { FC, useState } from 'react';

import Image from 'next/image';

import CompanyItem from '@/components/CompanyItem';
import MobileHeader from '@/components/ui/MobileHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetNewsDetailById } from '@/hooks/api/news/useGetNewsDetailById';

interface Props {
	newsId: number;
}

const NewsDetailClient: FC<Props> = ({ newsId }) => {
	const { data: newsData, isLoading } = useGetNewsDetailById(newsId);
	const [activeTab, setActiveTab] = useState('article');

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!newsData) {
		return <div>News not found</div>;
	}

	return (
		<div className="w-full h-full bg-white overflow-auto">
			<MobileHeader fallbackUrl="/" />
			<div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
				{/* 데스크톱 레이아웃 */}
				<div className="hidden lg:flex flex-row gap-8">
					{/* 좌측: 뉴스 전문 */}
					<div className="flex-1">
						<article className="space-y-4 sm:space-y-6">
							{/* 헤더 */}
							<header className="space-y-3 sm:space-y-4">
								<h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
									{newsData.title}
								</h1>
								<div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
									<span className="font-medium">{newsData.publisher}</span>
									<span>•</span>
									<span>{newsData.author}</span>
									<span>•</span>
									<span>
										{new Date(newsData.publishedAt).toLocaleDateString(
											'ko-KR',
											{
												year: 'numeric',
												month: 'long',
												day: 'numeric',
											}
										)}
									</span>
								</div>
							</header>

							{/* 썸네일 */}
							{newsData.thumbnailUrl ? (
								<div className="relative w-full h-48 sm:h-64 md:h-96 bg-muted rounded-lg overflow-hidden">
									<Image
										src={newsData.thumbnailUrl}
										alt={newsData.title}
										fill
										className="object-cover"
									/>
								</div>
							) : (
								<div className="w-full h-48 sm:h-64 md:h-96 bg-muted rounded-lg flex items-center justify-center">
									<span className="text-muted-foreground text-sm sm:text-base">
										이미지
									</span>
								</div>
							)}

							{/* 본문 */}
							<div className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
								<p className="text-sm sm:text-base leading-6 sm:leading-7 whitespace-pre-line">
									{newsData.content}
								</p>
							</div>
						</article>
					</div>

					{/* 우측: 연관 기업 목록 */}
					<div className="w-80 shrink-0">
						<div className="sticky top-8 space-y-4">
							<h2 className="text-xl sm:text-2xl font-bold mb-4">연관 기업</h2>
							<div className="space-y-3">
								{newsData.companies.map((company) => (
									<CompanyItem
										key={company.companyId}
										companyId={company.companyId}
										name={company.name}
										isListed={company.isListed}
										isDomestic={company.isDomestic}
										sentiment={company.sentiment}
										tags={company.tags}
										showSentiment={true}
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
							<TabsTrigger value="article">기사</TabsTrigger>
							<TabsTrigger value="companies">연관기업</TabsTrigger>
						</TabsList>
						<TabsContent value="article" className="mt-6">
							<article className="space-y-4 sm:space-y-6">
								{/* 헤더 */}
								<header className="space-y-3 sm:space-y-4">
									<h1 className="text-xl sm:text-2xl font-bold leading-tight">
										{newsData.title}
									</h1>
									<div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
										<span className="font-medium">{newsData.publisher}</span>
										<span>•</span>
										<span>{newsData.author}</span>
										<span>•</span>
										<span>
											{new Date(newsData.publishedAt).toLocaleDateString(
												'ko-KR',
												{
													year: 'numeric',
													month: 'long',
													day: 'numeric',
												}
											)}
										</span>
									</div>
								</header>

								{/* 썸네일 */}
								{newsData.thumbnailUrl ? (
									<div className="relative w-full h-48 sm:h-64 bg-muted rounded-lg overflow-hidden">
										<Image
											src={newsData.thumbnailUrl}
											alt={newsData.title}
											fill
											className="object-cover"
										/>
									</div>
								) : (
									<div className="w-full h-48 sm:h-64 bg-muted rounded-lg flex items-center justify-center">
										<span className="text-muted-foreground text-sm sm:text-base">
											이미지
										</span>
									</div>
								)}

								{/* 본문 */}
								<div className="prose prose-sm sm:prose-base max-w-none">
									<p className="text-sm sm:text-base leading-6 sm:leading-7 whitespace-pre-line">
										{newsData.content}
									</p>
								</div>
							</article>
						</TabsContent>
						<TabsContent value="companies" className="mt-6">
							<div className="space-y-3">
								{newsData.companies.map((company) => (
									<CompanyItem
										key={company.companyId}
										companyId={company.companyId}
										name={company.name}
										isListed={company.isListed}
										isDomestic={company.isDomestic}
										sentiment={company.sentiment}
										tags={company.tags}
										showSentiment={true}
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

export default NewsDetailClient;
