// next.config.js
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

const nextConfig = {
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/i,
			issuer: /\.[jt]sx?$/,
			use: ['@svgr/webpack'],
		});
		
		return config;
	},
	// images:{
	// 	disableStaticImages: true,
	// },
	env: {
		baseURI: process.env.NODE_ENV === "development" ? "http://localhost:3001" : "https://syndicate-api.onrender.com"
	},
	compiler:{
		removeConsole: process.env.NODE_ENV !== "development"
	}
}

// module.exports = withPlugins([
// 	[optimizedImages, {
// 		hangleImages:["png", "jpeg"],
// 		mozjpeg:{
// 			quality: 80,
// 		},
// 		optipng:{
// 			optimizationLevel: 3,
// 		},
// 	}]
//
// 	// your other plugins here
//
// ], nextConfig);
module.exports = nextConfig;