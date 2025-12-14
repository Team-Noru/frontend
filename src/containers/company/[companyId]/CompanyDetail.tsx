import { FC } from 'react';

import {
	getCompanyAnnouncementsById,
	getCompanyDetailById,
	getCompanyNewsById,
} from '@/service/company';
import { WordData } from '@/types/company';

import CompanyDetailClientContainer from './CompanyDetail.client';

interface Props {
	params: Promise<{
		companyId: string;
	}>;
}

const CompanyDetailContainer: FC<Props> = async ({ params }) => {
	const { companyId } = await params;

	const [companyData, newsData, announcementsData] = await Promise.all([
		await getCompanyDetailById(companyId),
		await getCompanyNewsById(companyId),
		await getCompanyAnnouncementsById(companyId),
	]);
	console.log(companyData);

	const wordCloudData: WordData[] = [
		{ text: '미국', value: 150 },
		{ text: '한국', value: 120 },
		{ text: '일본', value: 100 },
		{ text: '국회', value: 90 },
		{ text: '이재명', value: 85 },
		{ text: '더불어민주당', value: 80 },
		{ text: '삼성전자', value: 75 },
		{ text: '경기도', value: 70 },
		{ text: '부산', value: 65 },
		{ text: '인천', value: 60 },
	];

	if (!companyData) {
		return <div>Company not found</div>;
	}

	return (
		<CompanyDetailClientContainer
			companyData={companyData}
			newsData={newsData}
			announcementsData={announcementsData}
			wordCloudData={wordCloudData}
		/>
	);
};

export default CompanyDetailContainer;
