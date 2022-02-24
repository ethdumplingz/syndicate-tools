// next.config.js
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

const nextConfig = {
	images:{
		disableStaticImages: true,
	},
	// experimental: process.env.NODE_ENV !== "development" ? {
	// 		removeConsole: {
	// 			exclude: ['error'],
	// 		}
	// 	} : {},
}

module.exports = withPlugins([
	[optimizedImages, {
		hangleImages:["svg", "png", "jpeg"],
		mozjpeg:{
			quality: 80,
		},
		optipng:{
			optimizationLevel: 3,
		},
		svgo:{}
	}]
	
	// your other plugins here

], nextConfig);

