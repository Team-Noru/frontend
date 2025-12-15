'use client';

import { useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { toast } from 'sonner';

import CompanyItem from '@/components/CompanyItem';
import NewsItem from '@/components/NewsItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearch } from '@/hooks/api/search/useSearch';
import { useDebounce } from '@/hooks/useDebounce';
import { sortCompanies } from '@/lib/sort';
import { isValidInput, sanitizeInput } from '@/lib/validation';
import { Sentiment } from '@/types/company';

const SearchClient = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const initialQuery = sanitizeInput(searchParams.get('q') || '');
	const [searchQuery, setSearchQuery] = useState(initialQuery);
	const debouncedQuery = useDebounce(searchQuery, 300);
	const { data: searchResults, isLoading } = useSearch(debouncedQuery);

	// 탭 상태 관리 (URL 변경 없이)
	const [activeTab, setActiveTab] = useState(() => {
		const type = searchParams.get('type');
		return type === 'companies' ? 'companies' : 'news';
	});

	const handleTabChange = (value: string) => {
		setActiveTab(value);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value;

		// 입력 검증
		if (!isValidInput(rawValue)) {
			toast.error('유효하지 않은 입력입니다.');
			return;
		}

		// 입력 정제
		const sanitized = sanitizeInput(rawValue);
		setSearchQuery(sanitized);
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();

		// 검증된 검색어만 사용
		if (!isValidInput(searchQuery)) {
			toast.error('유효하지 않은 검색어입니다.');
			return;
		}

		if (!searchQuery.trim()) return;

		// 모바일에서는 URL 변경하지 않음 (lg 브레이크포인트: 1024px)
		const isMobile = window.innerWidth < 1024;
		if (isMobile) {
			return;
		}

		// 데스크탑에서만 페이지 이동
		const sanitizedQuery = sanitizeInput(searchQuery);
		router.push(`/search?q=${encodeURIComponent(sanitizedQuery)}`);
	};

	return (
		<div className="w-full h-full bg-white overflow-auto">
			{/* 검색 헤더 - 모바일 전용 */}
			<div className="lg:hidden sticky top-0 z-50 bg-white border-b border-border">
				<div className="flex items-center h-14 px-4">
					<form onSubmit={handleSearch} className="flex-1 min-w-0">
						<div className="relative">
							<input
								type="text"
								value={searchQuery}
								onChange={handleInputChange}
								placeholder="검색..."
								maxLength={100}
								className="w-full px-3 py-2 pl-9 pr-3 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
							/>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
							>
								<circle cx="11" cy="11" r="8" />
								<path d="m21 21-4.35-4.35" />
							</svg>
						</div>
					</form>
				</div>
			</div>

			{/* 검색 결과 */}
			<div className="max-w-7xl mx-auto p-4">
				{isLoading ? (
					<div className="text-center py-8 text-muted-foreground">
						검색 중...
					</div>
				) : !debouncedQuery ? (
					<div className="text-center py-8 text-muted-foreground">
						검색어를 입력해주세요.
					</div>
				) : !searchResults ||
				  (searchResults.news.length === 0 &&
						searchResults.companies.length === 0) ? (
					<div className="text-center py-8 text-muted-foreground">
						검색 결과가 없습니다.
					</div>
				) : (
					<Tabs value={activeTab} onValueChange={handleTabChange}>
						<TabsList>
							<TabsTrigger value="news">
								뉴스 ({searchResults.news.length})
							</TabsTrigger>
							<TabsTrigger value="companies">
								기업 ({searchResults.companies.length})
							</TabsTrigger>
						</TabsList>
						<TabsContent value="news" className="mt-6">
							<div className="space-y-2">
								{searchResults.news.map((news) => (
									<NewsItem
										key={news.id}
										id={news.id}
										title={news.title}
										description={news.description}
										publishedAt={news.publishedAt}
										thumbnailUrl={news.thumbnailUrl}
										publisher={news.publisher}
									/>
								))}
							</div>
						</TabsContent>
						<TabsContent value="companies" className="mt-6">
							<div className="space-y-3">
								{sortCompanies(searchResults.companies).map((company) => (
									<CompanyItem
										key={`${company.companyId || ''}-${company.name}`}
										companyId={company.companyId}
										name={company.name}
										isListed={company.isListed}
										isDomestic={company.isDomestic}
										sentiment={company.sentiment as Sentiment}
										tags={company.tags}
										showSentiment={false}
										price={company.price}
									/>
								))}
							</div>
						</TabsContent>
					</Tabs>
				)}
			</div>
		</div>
	);
};

export default SearchClient;
