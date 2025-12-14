import { FC } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { formatDate } from '@/lib/format';

interface Props {
	id: number;
	title: string;
	description: string;
	publishedAt: string;
	thumbnailUrl?: string;
	publisher: string;
}

const NewsItem: FC<Props> = ({
	id,
	title,
	description,
	publishedAt,
	thumbnailUrl,
	publisher,
}) => {
	return (
		<Link
			href={`/news/${id}`}
			className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-muted/50 transition-colors rounded-lg cursor-pointer border border-border"
		>
			{/* 썸네일 이미지 */}
			<div className="shrink-0 w-full sm:w-32 h-32 sm:h-24 bg-muted rounded-lg overflow-hidden border border-border relative">
				{thumbnailUrl ? (
					<Image
						src={thumbnailUrl}
						alt={title}
						fill
						sizes="(max-width: 640px) 100vw, 128px"
						className="object-contain"
					/>
				) : (
					<div className="w-full h-full bg-gray-200 flex items-center justify-center">
						<span className="text-gray-400 text-xs">이미지</span>
					</div>
				)}
			</div>

			{/* 텍스트 내용 */}
			<div className="flex-1 flex flex-col gap-1.5 sm:gap-2 min-w-0">
				<h3 className="font-semibold text-base sm:text-lg leading-tight line-clamp-1">
					{title}
				</h3>
				<p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
					{description}
				</p>
				<div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground mt-auto">
					<span className="font-medium">{publisher}</span>
					<span>•</span>
					<span>{formatDate(publishedAt)}</span>
				</div>
			</div>
		</Link>
	);
};

export default NewsItem;
