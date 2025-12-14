import { getYesterdayDateString } from '@/lib/format';
import { getNewsByDate } from '@/service/news';

import HomeClientContainer from './Home.client';

const HomeContainer = async () => {
	const yesterdayString = getYesterdayDateString();
	console.log(yesterdayString);
	const newsData = await getNewsByDate('2025-12-14');

	if (newsData.length === 0) {
		return <div>No news data</div>;
	}

	return <HomeClientContainer newsData={newsData} />;
};
export default HomeContainer;
