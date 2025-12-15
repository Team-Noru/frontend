/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.tossinvest.com',
			},
		],
	},
	output: 'standalone',
	async rewrites() {
		if (process.env.NODE_ENV === 'development') {
			return [
				{
					source: '/api/v1/:path*',
					destination: `${process.env.SERVICE_URL}/:path*`,
				},
			];
		}
		return [];
	},
};

export default nextConfig;
