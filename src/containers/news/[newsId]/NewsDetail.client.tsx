'use client';

import { FC } from 'react';

import Image from 'next/image';

import CompanyItem from '@/components/CompanyItem';
import { useGetNewsDetailById } from '@/hooks/api/news/useGetNewsDetailById';

interface Props {
	newsId: number;
}

const NewsDetailClient: FC<Props> = ({ newsId }) => {
	const { data: newsData, isLoading } = useGetNewsDetailById(newsId);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!newsData) {
		return <div>News not found</div>;
	}

	return (
		<div className="w-full h-full bg-white overflow-auto">
			<div className="max-w-7xl mx-auto p-8">
				<div className="flex gap-8">
					{/* 좌측: 뉴스 전문 */}
					<div className="flex-1">
						<article className="space-y-6">
							{/* 헤더 */}
							<header className="space-y-4">
								<h1 className="text-3xl font-bold leading-tight">
									{newsData.title}
								</h1>
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
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
								<div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
									<Image
										src={newsData.thumbnailUrl}
										alt={newsData.title}
										fill
										className="object-cover"
									/>
								</div>
							) : (
								<div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
									<span className="text-muted-foreground">이미지</span>
								</div>
							)}

							{/* 본문 */}
							<div className="prose prose-lg max-w-none">
								<p className="text-base leading-7 whitespace-pre-line">
									{newsData.content}
								</p>
							</div>
						</article>
					</div>

					{/* 우측: 연관 기업 목록 */}
					<div className="w-80 shrink-0">
						<div className="sticky top-8 space-y-4">
							<h2 className="text-2xl font-bold mb-4">연관 기업</h2>
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
			</div>
		</div>
	);
};

export default NewsDetailClient;
