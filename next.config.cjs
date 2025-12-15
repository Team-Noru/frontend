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
		if (process.env.NODE_ENV === 'development' && process.env.SERVICE_URL) {
			return [
				{
					source: '/api/v1/:path*',
					destination: `${process.env.NEXT_PUBLIC_SERVICE_URL}/:path*`,
				},
			];
		} else {
			return [];
		}
	},
};

module.exports = nextConfig;
