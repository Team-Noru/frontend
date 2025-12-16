'use client';

import { FC, useState } from 'react';

import Image from 'next/image';

import CompanyItem from '@/components/CompanyItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sortCompanies } from '@/lib/sort';
import { NewsDetail } from '@/types/news';

interface Props {
	newsData: NewsDetail;
}

const NewsDetailClient: FC<Props> = ({ newsData }) => {
	const [activeTab, setActiveTab] = useState('article');

	return (
		<div className="w-full h-full bg-white overflow-auto">
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
							{/* 본문 */}
							<div className="prose prose-sm sm:prose-base md:prose-lg max-w-none space-y-4">
								{newsData.content
									.split(/\[IMG\]/)
									.flatMap((segment, index, segments) => {
										const result = [];
										const isAfterImage =
											index > 0 && newsData.imageUrl[index - 1];

										// 텍스트 segment 렌더링
										if (segment.trim()) {
											// 이미지 다음 segment면 첫 번째 줄만 caption으로 처리
											if (isAfterImage) {
												const lines = segment.split('\n');
												const firstLine = lines[0]?.trim();
												const restLines = lines.slice(1).join('\n').trim();

												if (firstLine) {
													result.push(
														<p
															key={`caption-${index}`}
															className="text-xs sm:text-sm text-muted-foreground text-center italic mt-2 mb-3"
														>
															{firstLine}
														</p>
													);
												}

												if (restLines) {
													result.push(
														<p
															key={`text-${index}`}
															className="text-sm sm:text-base leading-6 sm:leading-7 whitespace-pre-line"
														>
															{restLines}
														</p>
													);
												}
											} else {
												result.push(
													<p
														key={`text-${index}`}
														className="text-sm sm:text-base leading-6 sm:leading-7 whitespace-pre-line"
													>
														{segment}
													</p>
												);
											}
										}

										if (
											newsData.imageUrl[index] &&
											(index < segments.length - 1 || !segment.trim())
										) {
											result.push(
												<div
													key={`img-${index}`}
													className="w-full mt-6 mb-2 flex justify-center"
												>
													<Image
														src={newsData.imageUrl[index]}
														alt={`${newsData.title} - 이미지 ${index + 1}`}
														width={1200}
														height={800}
														className="max-w-full h-auto max-h-[400px] sm:max-h-[500px] md:max-h-[600px]"
														sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1280px"
														unoptimized
														preload
													/>
												</div>
											);
										}

										return result;
									})}
							</div>
						</article>
					</div>

					{/* 우측: 연관 기업 목록 */}
					<div className="w-80 shrink-0">
						<div className="sticky top-8 space-y-4">
							<h2 className="text-xl sm:text-2xl font-bold mb-4">
								언급된 기업
							</h2>
							<div className="space-y-3">
								{sortCompanies(newsData.companies).map((company) => (
									<CompanyItem
										key={`${company.companyId || ''}-${company.name}`}
										companyId={company.companyId}
										name={company.name}
										isListed={company.isListed}
										isDomestic={company.isDomestic}
										sentiment={company.sentiment}
										tags={company.tags}
										showSentiment={true}
										price={company.price}
									/>
								))}
							</div>
							{newsData.related && newsData.related.length > 0 && (
								<>
									<h2 className="text-xl sm:text-2xl font-bold mb-4">
										{newsData.name} 연관 기업
									</h2>
									<div className="space-y-3">
										{sortCompanies(newsData.related).map((company) => (
											<CompanyItem
												key={`${company.companyId || ''}-${company.name}`}
												companyId={company.companyId}
												name={company.name}
												isListed={company.isListed}
												isDomestic={company.isDomestic}
												sentiment={company.sentiment}
												tags={company.tags}
												showSentiment={true}
												price={company.price}
											/>
										))}
									</div>
								</>
							)}
						</div>
					</div>
				</div>

				{/* 모바일 탭 레이아웃 */}
				<div className="lg:hidden">
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList>
							<TabsTrigger value="article">기사</TabsTrigger>
							<TabsTrigger value="companies">기업 목록</TabsTrigger>
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
								{/* 본문 */}
								<div className="prose prose-sm sm:prose-base max-w-none space-y-4">
									{newsData.content
										.split(/\[IMG\]/)
										.flatMap((segment, index, segments) => {
											const result = [];
											const isAfterImage =
												index > 0 && newsData.imageUrl[index - 1];

											// 텍스트 segment 렌더링
											if (segment.trim()) {
												// 이미지 다음 segment면 첫 번째 줄만 caption으로 처리
												if (isAfterImage) {
													const lines = segment.split('\n');
													const firstLine = lines[0]?.trim();
													const restLines = lines.slice(1).join('\n').trim();

													if (firstLine) {
														result.push(
															<p
																key={`caption-${index}`}
																className="text-xs sm:text-sm text-muted-foreground text-center italic mt-2 mb-3"
															>
																{firstLine}
															</p>
														);
													}

													if (restLines) {
														result.push(
															<p
																key={`text-${index}`}
																className="text-sm sm:text-base leading-6 sm:leading-7 whitespace-pre-line"
															>
																{restLines}
															</p>
														);
													}
												} else {
													result.push(
														<p
															key={`text-${index}`}
															className="text-sm sm:text-base leading-6 sm:leading-7 whitespace-pre-line"
														>
															{segment}
														</p>
													);
												}
											}

											if (
												newsData.imageUrl[index] &&
												(index < segments.length - 1 || !segment.trim())
											) {
												result.push(
													<div
														key={`img-${index}`}
														className="w-full mt-6 mb-2 flex justify-center"
													>
														<Image
															src={newsData.imageUrl[index]}
															alt={`${newsData.title} - 이미지 ${index + 1}`}
															width={1200}
															height={800}
															className="max-w-full h-auto max-h-[300px] sm:max-h-[400px]"
															sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1280px"
															unoptimized
															preload
														/>
													</div>
												);
											}

											return result;
										})}
								</div>
							</article>
						</TabsContent>
						<TabsContent value="companies" className="mt-6">
							{/* 언급된 기업 */}
							<div className="mb-6">
								<h2 className="text-base font-bold mb-3">언급된 기업</h2>
								<div className="space-y-3">
									{sortCompanies(newsData.companies).map((company) => (
										<CompanyItem
											key={`${company.companyId || ''}-${company.name}`}
											companyId={company.companyId}
											name={company.name}
											isListed={company.isListed}
											isDomestic={company.isDomestic}
											sentiment={company.sentiment}
											tags={company.tags}
											showSentiment={true}
											price={company.price}
										/>
									))}
								</div>
							</div>
							{/* 구분선 및 연관 기업 - related가 있을 때만 표시 */}
							{newsData.related && newsData.related.length > 0 && (
								<>
									{/* 구분선 */}
									<div className="border-t border-border my-6"></div>
									{/* 연관 기업 */}
									<div>
										<h2 className="text-base font-bold mb-3">
											{newsData.name} 연관 기업
										</h2>
										<div className="space-y-3">
											{sortCompanies(newsData.related).map((company) => (
												<CompanyItem
													key={`${company.companyId || ''}-${company.name}`}
													companyId={company.companyId}
													name={company.name}
													isListed={company.isListed}
													isDomestic={company.isDomestic}
													sentiment={company.sentiment}
													tags={company.tags}
													showSentiment={true}
													price={company.price}
												/>
											))}
										</div>
									</div>
								</>
							)}
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
};

export default NewsDetailClient;
