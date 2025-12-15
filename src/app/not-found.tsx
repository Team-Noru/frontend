import NotFound from '@/components/ui/NotFound';

const NotFoundPage = () => {
	return (
		<NotFound
			title="페이지를 찾을 수 없습니다"
			description="요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다."
			imageAlt="404 Not Found"
		/>
	);
};

export default NotFoundPage;
