import { getYesterdayDateString } from '@/lib/format';
import { shuffleSort } from '@/lib/sort';
import { getHomeCompanies } from '@/service/company';
import { getNewsByDate } from '@/service/news';
import { Company } from '@/types/company';

import HomeClientContainer from './Home.client';

const HomeContainer = async () => {
	const yesterdayString = getYesterdayDateString();
	console.log(yesterdayString);
	const newsData = await getNewsByDate('2025-12-14');
	const companiesData = await getHomeCompanies();
	const companies = shuffleSort(
		companiesData.map((company) => ({
			companyId: company.companyId,
			name: company.name,
			isListed: true,
			isDomestic: true,
			sentiment: 'neutral' as const,
			tags: [],
			price: company.price,
			diffPrice: company.diffPrice,
			diffRate: company.diffRate,
		}))
	).slice(0, 5) as Company[];

	return <HomeClientContainer newsData={newsData} companies={companies} />;
};
export default HomeContainer;
