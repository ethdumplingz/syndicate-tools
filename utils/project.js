import axios from "axios";

const fetchProjectInfo = async (url) => {
	const loggingTag = `[fetchProjectInfo]`;
	try{
		console.info(`${loggingTag} url: ${url}`);
		return await axios.get(`${process.env.NEXT_PUBLIC_BASE_URI}${url}`);
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		throw e;
	}
}

export default fetchProjectInfo;