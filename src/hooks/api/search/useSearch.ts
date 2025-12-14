import { useQuery } from '@tanstack/react-query';

import { getTotalSearchResult } from '@/service/search';
import { SearchResult } from '@/types/search';

export const useSearch = (query: string) => {
	return useQuery<SearchResult>({
		queryKey: ['search', query],
		queryFn: () => getTotalSearchResult(query),
		enabled: !!query && query.trim().length > 0,
		staleTime: 5 * 60 * 1000, // 5분
	});
};
