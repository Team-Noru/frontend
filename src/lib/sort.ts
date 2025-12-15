import { Company } from '@/types/company';

export const shuffleSort = (array: any[]) => {
	array.sort(() => Math.random() - 0.5);
	return array;
};

/**
 * 회사 목록을 정렬하는 함수
 * 우선순위:
 * 1. companyId가 있고 isDomestic && isListed
 * 2. companyId가 있고 isDomestic && !isListed
 * 3. companyId가 있고 !isDomestic
 * 4. companyId가 없고 isDomestic && isListed
 * 5. companyId가 없고 isDomestic && !isListed
 * 6. companyId가 없고 !isDomestic
 */
export const sortCompanies = (companies: Company[]): Company[] => {
	return [...companies].sort((a, b) => {
		const getPriority = (company: Company): number => {
			const hasCompanyId = !!company.companyId;
			const basePriority =
				company.isDomestic && company.isListed
					? 0
					: company.isDomestic && !company.isListed
						? 1
						: 2;
			// companyId가 없으면 +3을 해서 후순위로
			return hasCompanyId ? basePriority : basePriority + 3;
		};
		return getPriority(a) - getPriority(b);
	});
};
