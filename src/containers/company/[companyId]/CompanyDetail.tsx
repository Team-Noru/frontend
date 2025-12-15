import { FC } from 'react';

import NotFound from '@/components/ui/NotFound';
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
		return (
			<NotFound
				title="기업을 찾을 수 없습니다"
				description="요청하신 기업이 존재하지 않거나 삭제되었을 수 있습니다."
				imageAlt="Company Not Found"
			/>
		);
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
