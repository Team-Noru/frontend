'use client';

import { FC, useMemo } from 'react';

import dynamic from 'next/dynamic';
import Image from 'next/image';

import { scaleLog } from '@visx/scale';
import { Text } from '@visx/text';
import { Wordcloud } from '@visx/wordcloud';

import CompanyItem from '@/components/CompanyItem';
import NewsItem from '@/components/NewsItem';
import { getStockImageUrl } from '@/lib/values';
import { CompanyDetailData } from '@/types/company';

interface Props {
	companyId: string;
}

interface WordData {
	text: string;
	value: number;
}

interface NewsData {
	id: number;
	title: string;
	description: string;
	publishedAt: string;
	thumbnailUrl?: string;
	publisher: string;
	author: string;
}

const GraphCanvas = dynamic(
	() => import('reagraph').then((mod) => mod.GraphCanvas),
	{ ssr: false }
);

const CompanyDetailClientContainer: FC<Props> = ({ companyId }) => {
	// TODO: 실제 API 호출로 대체
	// 예시 데이터
	const companyData: CompanyDetailData = {
		id: companyId,
		stockCode: '005930',
		name: '삼성전자',
		isListed: true,
		isDomestic: true,
		sentiment: 'positive',
		tags: [
			{ id: 1, label: '반도체' },
			{ id: 2, label: 'AI' },
		],
		related: [
			{
				id: '1',
				stockCode: '055550',
				name: '신한지주',
				isListed: true,
				isDomestic: true,
				sentiment: 'positive',
				tags: [{ id: 3, label: '금융' }],
			},
			{
				id: '2',
				stockCode: '035720',
				name: '카카오',
				isListed: true,
				isDomestic: true,
				sentiment: 'slightlyPositive',
				tags: [{ id: 4, label: '플랫폼' }],
			},
			{
				id: '3',
				stockCode: '035420',
				name: '네이버',
				isListed: true,
				isDomestic: true,
				sentiment: 'neutral',
				tags: [{ id: 5, label: '플랫폼' }],
			},
		],
	};

	// TODO: 실제 API 호출로 대체
	const wordCloudData: WordData[] = [
		{ text: '미국', value: 150 },
		{ text: '한국', value: 120 },
		{ text: '일본', value: 100 },
		{ text: '국회', value: 90 },
		{ text: '이재명', value: 85 },
		{ text: '더불어민주당', value: 80 },
		{ text: '삼성전자', value: 75 },
		{ text: '경기도', value: 70 },
		{ text: '부산', value: 65 },
		{ text: '인천', value: 60 },
	];

	// TODO: 실제 API 호출로 대체
	const newsData: NewsData[] = [
		{
			id: 1,
			title: "美 AI 엔지니어 200억 주는데...'AI 블랙홀'에 인재 유출 가속",
			description:
				'Coffee is the most popular drink in the world and drinking coffee in the morning has become a routine for many people before their activities.',
			publishedAt: '2023-05-31',
			publisher: 'SBS BIZ',
			author: '홍길동',
		},
		{
			id: 2,
			title: "美 AI 엔지니어 200억 주는데...'AI 블랙홀'에 인재 유출 가속",
			description:
				'Coffee is the most popular drink in the world and drinking coffee in the morning has become a routine for many people before their activities.',
			publishedAt: '2023-05-31',
			publisher: 'SBS BIZ',
			author: '홍길동',
		},
		{
			id: 3,
			title: "美 AI 엔지니어 200억 주는데...'AI 블랙홀'에 인재 유출 가속",
			description:
				'Coffee is the most popular drink in the world and drinking coffee in the morning has become a routine for many people before their activities.',
			publishedAt: '2023-05-31',
			publisher: 'SBS BIZ',
			author: '홍길동',
		},
	];

	return (
		<CompanyDetailClient
			companyData={companyData}
			wordCloudData={wordCloudData}
			newsData={newsData}
		/>
	);
};

interface CompanyDetailClientProps {
	companyData: CompanyDetailData;
	wordCloudData: WordData[];
	newsData: NewsData[];
}
const CompanyDetailClient: FC<CompanyDetailClientProps> = ({
	companyData,
	wordCloudData,
	newsData,
}) => {
	// 네트워크 그래프 노드 및 엣지 생성
	const { nodes, edges } = useMemo(() => {
		const graphNodes = [
			{
				id: companyData.id,
				label: companyData.name,
				fill: '#10b981', // green-500
				size: 50,
				data: companyData,
			},
			...companyData.related.map((related) => ({
				id: related.id,
				label: related.name,
				fill: '#e5e7eb', // gray-200
				size: 40,
				data: related,
			})),
		];

		const graphEdges = companyData.related.map((related) => ({
			id: `${companyData.id}-${related.id}`,
			source: companyData.id,
			target: related.id,
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

	return (
		<div className="w-full h-full bg-white overflow-auto">
			<div className="max-w-[1920px] mx-auto p-8">
				{/* 헤더 */}
				<div className="mb-6">
					<h1 className="text-3xl font-bold mb-4">서비스이름</h1>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-3">
							{companyData.stockCode &&
								getStockImageUrl(
									companyData.stockCode,
									companyData.isDomestic
								) && (
									<div className="relative w-16 h-16 bg-white rounded-lg border border-border overflow-hidden flex items-center justify-center">
										<Image
											src={
												getStockImageUrl(
													companyData.stockCode,
													companyData.isDomestic
												)!
											}
											alt={companyData.name}
											fill
											className="object-contain"
										/>
									</div>
								)}
							<h2 className="text-2xl font-bold">{companyData.name}</h2>
						</div>
					</div>
				</div>

				<div className="flex gap-8">
					{/* 메인 콘텐츠 영역 */}
					<div className="flex-1 space-y-6">
						{/* 네트워크 그래프 */}
						<div className="h-[600px] w-full border border-border rounded-lg overflow-hidden bg-white relative">
							<GraphCanvas
								nodes={nodes}
								edges={edges}
								layoutType="forceDirected2d"
								labelType="all"
								edgeInterpolation="curved"
							/>
						</div>

						<div className="grid grid-cols-2 gap-6">
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
								<div className="h-[300px] w-full">
									<Wordcloud
										words={wordCloudData}
										width={600}
										height={300}
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

							{/* 뉴스 목록 */}
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
											author={news.author}
										/>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* 우측 사이드바 */}
					<div className="w-80 shrink-0 space-y-4">
						{/* 필터 버튼 */}
						{/* <div className="grid grid-cols-2 gap-2">
							{(['뉴스', '지분', '리스크', '투자'] as const).map((filter) => (
								<button
									key={filter}
									onClick={() => setSelectedFilter(filter)}
									className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
										selectedFilter === filter
											? filter === '뉴스'
												? 'bg-green-600 text-white'
												: filter === '지분'
													? 'bg-blue-600 text-white'
													: filter === '리스크'
														? 'bg-red-600 text-white'
														: 'bg-orange-600 text-white'
											: 'bg-muted text-muted-foreground hover:bg-muted/80'
									}`}
								>
									{filter}
								</button>
							))}
						</div> */}

						{/* 기업 목록 */}
						<div className="space-y-3">
							{companyData.related.map((company) => (
								<CompanyItem
									key={company.id}
									id={company.id}
									stockCode={company.stockCode}
									name={company.name}
									isListed={company.isListed}
									isDomestic={company.isDomestic}
									sentiment={companyData.sentiment}
									tags={company.tags}
									showSentiment={false}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CompanyDetailClientContainer;
