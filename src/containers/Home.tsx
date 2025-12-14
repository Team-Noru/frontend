import { getYesterdayDateString } from '@/lib/format';
import { getHomeCompanies } from '@/service/company';
import { getNewsByDate } from '@/service/news';

import HomeClientContainer from './Home.client';

const HomeContainer = async () => {
	const yesterdayString = getYesterdayDateString();
	console.log(yesterdayString);
	const newsData = await getNewsByDate('2025-12-14');
	const companies = await getHomeCompanies();

	return <HomeClientContainer newsData={newsData} companies={companies} />;
};
export default HomeContainer;
