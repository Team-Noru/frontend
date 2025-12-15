'use client';

import { FC } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { sortCompanies } from '@/lib/sort';
import { Company } from '@/types/company';
import { News } from '@/types/news';

interface Props {
	news: News[];
	companies: Company[];
	onItemClick?: () => void;
	searchQuery?: string;
}

const SearchResults: FC<Props> = ({
	news,
	companies,
	onItemClick,
	searchQuery = '',
}) => {
	const router = useRouter();

	if (news.length === 0 && companies.length === 0) {
		return (
			<div className="p-6 text-center text-sm text-muted-foreground">
				검색 결과가 없습니다.
			</div>
		);
	}

	const handleViewMore = (type: 'news' | 'companies') => {
		onItemClick?.();
		router.push(`/search?q=${encodeURIComponent(searchQuery)}&type=${type}`);
	};

	return (
		<div className="max-h-[500px] overflow-y-auto">
			{news.length > 0 && (
				<div className="p-4 border-b border-border">
					<h3 className="text-sm font-semibold text-muted-foreground mb-3">
						뉴스
					</h3>
					<div className="space-y-2">
						{news.slice(0, 5).map((item) => (
							<Link
								key={item.id}
								href={`/news/${item.id}`}
								onClick={onItemClick}
								className="block p-3 hover:bg-muted/50 rounded-lg transition-colors"
							>
								<h4 className="font-medium text-sm line-clamp-1 mb-1">
									{item.title}
								</h4>
								<p className="text-xs text-muted-foreground line-clamp-1">
									{item.description}
								</p>
							</Link>
						))}
						{news.length > 5 && (
							<button
								type="button"
								onClick={() => handleViewMore('news')}
								className="w-full text-xs text-muted-foreground text-center pt-2 hover:text-foreground transition-colors"
							>
								+{news.length - 5}개 더 보기
							</button>
						)}
					</div>
				</div>
			)}

			{companies.length > 0 && (
				<div className="p-4">
					<h3 className="text-sm font-semibold text-muted-foreground mb-3">
						기업
					</h3>
					<div className="space-y-2">
						{sortCompanies(companies)
							.slice(0, 5)
							.map((company) => (
								<Link
									key={`${company.companyId || ''}-${company.name}`}
									href={`/company/${company.companyId}`}
									onClick={onItemClick}
									className="block"
								>
									<div className="p-3 hover:bg-muted/50 rounded-lg transition-colors border border-border">
										<div className="font-medium text-sm">{company.name}</div>
										{company.companyId && (
											<div className="text-xs text-muted-foreground mt-1">
												{company.companyId}
											</div>
										)}
									</div>
								</Link>
							))}
						{companies.length > 5 && (
							<button
								type="button"
								onClick={() => handleViewMore('companies')}
								className="w-full text-xs text-muted-foreground text-center pt-2 hover:text-foreground transition-colors"
							>
								+{companies.length - 5}개 더 보기
							</button>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default SearchResults;
