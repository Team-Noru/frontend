import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query';

import { getNewsByDate } from '@/service/news';

import HomeClientContainer from './Home.client';

const HomeContainer = async () => {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ['news', '2025-11-30'],
		queryFn: () => getNewsByDate('2025-11-30'),
	});
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<HomeClientContainer />
		</HydrationBoundary>
	);
};
export default HomeContainer;
