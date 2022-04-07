export const validateURL = ({url, type = "twitter"}) => {
	const loggingTag = `[validateURL]`;
	const supportedURLTypes = {
		twitter:{
			patterns: ["twitter.com"]
		},
		discord:{
			patterns: ["discord.com", "discord.gg"]
		},
	}
	let isValid = false;
	try{
		if(typeof supportedURLTypes[type] === "object"){//is supported type!
			const patterns = supportedURLTypes[type].patterns;
			let urlPatternCheck = false;
			for(let i =0; i < patterns.length; i++){
				const pattern = patterns[i];
				// console.info(`${loggingTag} checking if url: ${url} has pattern: ${pattern}`);
				urlPatternCheck = (url.indexOf(`://${pattern}`) > -1 || url.indexOf(`://www.${pattern}`) > -1);
				if(urlPatternCheck){
					break;
				}
			}
			
			console.info(`${loggingTag}[url:${url}] pattern check: ${urlPatternCheck}`);
			
			isValid = url === null || url.length  === 0 || urlPatternCheck;
		}
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
	}
	return isValid;
}
