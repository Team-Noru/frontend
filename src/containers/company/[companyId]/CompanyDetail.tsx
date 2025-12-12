import { FC } from 'react';

import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query';

import { getCompanyNewsById } from '@/service/company';

import CompanyDetailClientContainer from './CompanyDetail.client';

interface Props {
	params: Promise<{
		companyId: string;
	}>;
}

const CompanyDetailContainer: FC<Props> = async ({ params }) => {
	const { companyId } = await params;
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ['company', companyId],
		queryFn: () => getCompanyNewsById(companyId),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<CompanyDetailClientContainer companyId={companyId} />
		</HydrationBoundary>
	);
};

export default CompanyDetailContainer;
