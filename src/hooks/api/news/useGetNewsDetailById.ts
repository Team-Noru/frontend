import { useQuery } from '@tanstack/react-query';

import { getNewsDetailById } from '@/service/news';

export const useGetNewsDetailById = (newsId: number) => {
	return useQuery({
		queryKey: ['news', newsId],
		queryFn: () => getNewsDetailById(newsId),
		enabled: !!newsId,
	});
};
