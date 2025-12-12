import { useQuery } from '@tanstack/react-query';

import { getCompanyNewsById } from '@/service/company';

export const useGetCompanyNewsById = (companyId: string) => {
	return useQuery({
		queryKey: ['company', companyId],
		queryFn: () => getCompanyNewsById(companyId),
		enabled: !!companyId,
	});
};
