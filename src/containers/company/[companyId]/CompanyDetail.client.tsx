'use client';

import { FC, useMemo, useState, useEffect } from 'react';

import dynamic from 'next/dynamic';
import Image from 'next/image';

import { scaleLog } from '@visx/scale';
import { Text } from '@visx/text';
import { Wordcloud } from '@visx/wordcloud';
import { GraphEdge, GraphNode } from 'reagraph';

import CompanyItem from '@/components/CompanyItem';
import NewsItem from '@/components/NewsItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStockImageUrl } from '@/lib/values';
import {
	Announcement,
	CompanyDetail,
	Sentiment,
	WordData,
} from '@/types/company';
import { News } from '@/types/news';

interface Props {
	companyData: CompanyDetail;
	wordCloudData: WordData[];
	newsData: News[];
	announcementsData: Announcement[];
}

const GraphCanvas = dynamic(
	() => import('reagraph').then((mod) => mod.GraphCanvas),
	{ ssr: false }
);

const CompanyDetailClientContainer: FC<Props> = ({
	companyData,
	wordCloudData,
	newsData,
	announcementsData,
}) => {
	const [activeTab, setActiveTab] = useState('network');
	// 네트워크 그래프 노드 및 엣지 생성
	const { nodes, edges } = useMemo(() => {
		const graphNodes = [
			{
				id: companyData.companyId,
				label: companyData.name,
				fill: '#10b981', // green-500
				size: 50,
				data: companyData,
			},
			...companyData.related.map((related) => ({
				id: related.companyId || related.name,
				label: related.name,
				fill: '#e5e7eb', // gray-200
				size: 40,
				data: related,
			})),
		];

		const graphEdges = companyData.related.map((related) => ({
			id: `${companyData.companyId}-${related.companyId || related.name}`,
			source: companyData.companyId,
			target: related.companyId || related.name,
			label: '',
			size: 2,
			fill: '#10b981', // green-500
		}));

		return { nodes: graphNodes, edges: graphEdges };
	}, [companyData]);

	// 워드 클라우드 설정
	const fontScale = scaleLog({
		domain: [
			Math.min(...wordCloudData.map((w) => w.value)),
			Math.max(...wordCloudData.map((w) => w.value)),
		],
		range: [20, 80],
	});
	const fontSizeSetter = (datum: WordData) => fontScale(datum.value);

	// 워드 클라우드 크기 계산 (반응형)
	const [wordCloudSize, setWordCloudSize] = useState({
		width: 600,
		height: 300,
	});

	useEffect(() => {
		const updateSize = () => {
			const width = Math.min(600, window.innerWidth - 32); // 패딩 고려
			const height = Math.min(300, width * 0.5);
			setWordCloudSize({ width, height });
		};

		updateSize();
		window.addEventListener('resize', updateSize);
		return () => window.removeEventListener('resize', updateSize);
	}, []);

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
							<h2 className="text-lg sm:text-xl md:text-2xl font-bold">
								{companyData.name}
							</h2>
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
							<GraphCanvas
								nodes={nodes as GraphNode[]}
								edges={edges as GraphEdge[]}
								layoutType="forceDirected2d"
								labelType="all"
								edgeInterpolation="curved"
							/>
						</div>

						{/* 워드 클라우드 */}
						<div className="border border-border rounded-lg p-6 bg-white">
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-xl font-bold">분석 대상뉴스 7,086건</h3>
								<div className="flex gap-2 text-xs">
									<span className="flex items-center gap-1">
										<span className="w-2 h-2 bg-orange-500 rounded-full"></span>
										인물
									</span>
									<span className="flex items-center gap-1">
										<span className="w-2 h-2 bg-green-500 rounded-full"></span>
										장소
									</span>
									<span className="flex items-center gap-1">
										<span className="w-2 h-2 bg-blue-500 rounded-full"></span>
										기관
									</span>
								</div>
							</div>
							<div className="h-[300px] w-full overflow-hidden">
								<Wordcloud
									words={wordCloudData}
									width={wordCloudSize.width}
									height={wordCloudSize.height}
									fontSize={fontSizeSetter}
									font={'Arial'}
									padding={2}
									spiral={'archimedean'}
									rotate={0}
								>
									{(cloudWords) =>
										cloudWords.map((w, i) => (
											<Text
												key={w.text}
												fill={
													i % 3 === 0
														? '#f97316'
														: i % 3 === 1
															? '#10b981'
															: '#3b82f6'
												}
												textAnchor={'middle'}
												transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
												fontSize={w.size}
												fontFamily={w.font}
											>
												{w.text}
											</Text>
										))
									}
								</Wordcloud>
							</div>
						</div>

						{/* 뉴스 및 공시 목록 */}
						<div className="grid grid-cols-2 gap-6">
							{/* 뉴스 목록 */}
							<div className="border border-border rounded-lg p-6 bg-white">
								<h3 className="text-xl font-bold mb-4">뉴스</h3>
								<div className="space-y-2 max-h-[400px] overflow-y-auto">
									{newsData.length > 0 ? (
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
										<div className="text-sm text-muted-foreground text-center py-8">
											뉴스가 없습니다.
										</div>
									)}
								</div>
							</div>

							{/* 공시 목록 */}
							<div className="border border-border rounded-lg p-6 bg-white">
								<h3 className="text-xl font-bold mb-4">공시</h3>
								<div className="space-y-2 max-h-[400px] overflow-y-auto">
									{announcementsData.length > 0 ? (
										announcementsData.map((announcement) => (
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
										))
									) : (
										<div className="text-sm text-muted-foreground text-center py-8">
											공시 정보가 없습니다.
										</div>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* 우측 사이드바 */}
					<div className="w-80 shrink-0">
						<div className="sticky top-8 space-y-4">
							{/* 연관 기업 제목 */}
							<h2 className="text-2xl font-bold mb-4">연관 기업</h2>
							{/* 기업 목록 */}
							<div className="space-y-3">
								{companyData.related.map((company) => (
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
								<GraphCanvas
									nodes={nodes as GraphNode[]}
									edges={edges as GraphEdge[]}
									layoutType="forceDirected2d"
									labelType="all"
									edgeInterpolation="curved"
								/>
							</div>

							{/* 워드 클라우드 */}
							<div className="border border-border rounded-lg p-4 bg-white">
								<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-4">
									<h3 className="text-base sm:text-lg font-bold">
										분석 대상뉴스 7,086건
									</h3>
									<div className="flex gap-1.5 sm:gap-2 text-xs">
										<span className="flex items-center gap-1">
											<span className="w-2 h-2 bg-orange-500 rounded-full"></span>
											인물
										</span>
										<span className="flex items-center gap-1">
											<span className="w-2 h-2 bg-green-500 rounded-full"></span>
											장소
										</span>
										<span className="flex items-center gap-1">
											<span className="w-2 h-2 bg-blue-500 rounded-full"></span>
											기관
										</span>
									</div>
								</div>
								<div className="h-[200px] sm:h-[250px] w-full overflow-hidden">
									<Wordcloud
										words={wordCloudData}
										width={wordCloudSize.width}
										height={wordCloudSize.height}
										fontSize={fontSizeSetter}
										font={'Arial'}
										padding={2}
										spiral={'archimedean'}
										rotate={0}
									>
										{(cloudWords) =>
											cloudWords.map((w, i) => (
												<Text
													key={w.text}
													fill={
														i % 3 === 0
															? '#f97316'
															: i % 3 === 1
																? '#10b981'
																: '#3b82f6'
													}
													textAnchor={'middle'}
													transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
													fontSize={w.size}
													fontFamily={w.font}
												>
													{w.text}
												</Text>
											))
										}
									</Wordcloud>
								</div>
							</div>

							{/* 뉴스 및 공시 목록 */}
							<div className="grid grid-cols-1 gap-4">
								{/* 뉴스 목록 */}
								<div className="border border-border rounded-lg p-4 bg-white">
									<h3 className="text-base sm:text-lg font-bold mb-4">뉴스</h3>
									<div className="space-y-2 max-h-[400px] overflow-y-auto">
										{newsData.length > 0 ? (
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
											<div className="text-xs sm:text-sm text-muted-foreground text-center py-8">
												뉴스가 없습니다.
											</div>
										)}
									</div>
								</div>

								{/* 공시 목록 */}
								<div className="border border-border rounded-lg p-4 bg-white">
									<h3 className="text-base sm:text-lg font-bold mb-4">공시</h3>
									<div className="space-y-2 max-h-[400px] overflow-y-auto">
										{announcementsData.length > 0 ? (
											announcementsData.map((announcement) => (
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
											))
										) : (
											<div className="text-xs sm:text-sm text-muted-foreground text-center py-8">
												공시 정보가 없습니다.
											</div>
										)}
									</div>
								</div>
							</div>
						</TabsContent>
						<TabsContent value="companies" className="mt-6">
							<div className="space-y-3">
								{companyData.related.map((company) => (
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
