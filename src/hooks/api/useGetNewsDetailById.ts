import { useQuery } from '@tanstack/react-query';

import { getNewsDetailById } from '@/service/news';
import { NewsDetail } from '@/types/news';

export const useGetNewsDetailById = (newsId: number) => {
	return useQuery({
		queryKey: ['news', newsId],
		queryFn: () => getNewsDetailById(newsId),
		enabled: !!newsId,
		select: (data): NewsDetail => {
			if (process.env.NODE_ENV === 'development') {
				return {
					...data,
					thumbnailUrl: undefined,
					imageUrl: [],
				} as NewsDetail;
			}
			return data as NewsDetail;
		},
	});
};
