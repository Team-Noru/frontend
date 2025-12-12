import { FC } from 'react';

import CompanyDetailClientContainer from './CompanyDetail.client';

interface Props {
	params: Promise<{
		companyId: string;
	}>;
}

const CompanyDetailContainer: FC<Props> = async ({ params }) => {
	const { companyId } = await params;

	return <CompanyDetailClientContainer companyId={companyId} />;
};

export default CompanyDetailContainer;
