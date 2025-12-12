import { useQuery } from '@tanstack/react-query';

import { getNewsByDate } from '@/service/news';

export const useGetNewsByDate = (date: string) => {
	return useQuery({
		queryKey: ['news', date],
		queryFn: () => getNewsByDate(date),
		enabled: !!date,
	});
};
