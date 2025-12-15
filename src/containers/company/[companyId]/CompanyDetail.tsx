import { FC } from 'react';

import {
	getCompanyAnnouncementsById,
	getCompanyDetailById,
	getCompanyNewsById,
	getCompanyWordCloudById,
} from '@/service/company';

import CompanyDetailClientContainer from './CompanyDetail.client';

interface Props {
	params: Promise<{
		companyId: string;
	}>;
}

const CompanyDetailContainer: FC<Props> = async ({ params }) => {
	const { companyId } = await params;

	const [companyData, newsData, announcementsData, wordCloudData] =
		await Promise.all([
			await getCompanyDetailById(companyId),
			await getCompanyNewsById(companyId),
			await getCompanyAnnouncementsById(companyId),
			await getCompanyWordCloudById(companyId),
		]);

	if (!companyData) {
		return <div>Company not found</div>;
	}

	return (
		<CompanyDetailClientContainer
			companyData={companyData}
			newsData={newsData}
			announcementsData={announcementsData}
			wordCloudData={wordCloudData.wordList}
		/>
	);
};

export default CompanyDetailContainer;
