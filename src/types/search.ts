import { Company } from './company';
import { News } from './news';

export interface SearchResult {
	news: News[];
	companies: Company[];
}
