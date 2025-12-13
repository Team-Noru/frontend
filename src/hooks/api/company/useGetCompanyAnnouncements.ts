import { useQuery } from '@tanstack/react-query';

import { getCompanyAnnouncementsById } from '@/service/company';

export const useGetCompanyAnnouncements = (companyId: string) => {
	return useQuery({
		queryKey: ['company', companyId, 'announcements'],
		queryFn: () => getCompanyAnnouncementsById(companyId),
		enabled: !!companyId,
	});
};
