import Image from 'next/image';
import Link from 'next/link';

interface NotFoundProps {
	title: string;
	description: string;
	imageAlt?: string;
	buttonText?: string;
	buttonHref?: string;
}

const NotFound: React.FC<NotFoundProps> = ({
	title,
	description,
	imageAlt = 'Not Found',
	buttonText = '홈으로 돌아가기',
	buttonHref = '/',
}) => {
	return (
		<div className="w-full h-full flex items-center justify-center bg-white">
			<div className="max-w-2xl mx-auto px-4 py-8 text-center">
				{/* 404 이미지 */}
				<div className="mb-8 flex justify-center">
					<Image
						src="/notfound.png"
						alt={imageAlt}
						width={300}
						height={200}
						className="w-full max-w-md h-auto"
						priority
					/>
				</div>

				{/* 메시지 */}
				<h1 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
					{title}
				</h1>
				<p className="text-lg text-muted-foreground mb-8">{description}</p>

				{/* 홈으로 돌아가기 버튼 */}
				<Link
					href={buttonHref}
					className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
				>
					{buttonText}
				</Link>
			</div>
		</div>
	);
};

export default NotFound;
