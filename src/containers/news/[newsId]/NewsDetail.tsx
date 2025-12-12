import { FC } from 'react';

import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query';

import { getNewsDetailById } from '@/service/news';

import NewsDetailClient from './NewsDetail.client';

interface Props {
	params: Promise<{
		newsId: string;
	}>;
}

const NewsDetailContainer: FC<Props> = async ({ params }) => {
	const { newsId } = await params;
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ['news', Number(newsId)],
		queryFn: () => getNewsDetailById(Number(newsId)),
	});
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<NewsDetailClient newsId={Number(newsId)} />
		</HydrationBoundary>
	);
};

export default NewsDetailContainer;
