export const validateURL = ({url, type = "twitter"}) => {
	const loggingTag = `[validateURL]`;
	const supportedURLTypes = {
		twitter:{
			substr: "twitter.com"
		},
		discord:{
			substr: "discord.com"
		}
	}
	let isValid = false;
	try{
		if(typeof supportedURLTypes[type] === "object"){//is supported type!
			const substr = supportedURLTypes[type].substr;
			// console.info(`${loggingTag}[url:${url}][substr:${substr}] check: ${url.indexOf(`://${substr}`) > -1}`);
			isValid = url === null || url.length  === 0 || url.indexOf(`://${substr}`) > -1 || url.indexOf(`://www.${substr}`) > -1;
		}
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
	}
	return isValid;
}
