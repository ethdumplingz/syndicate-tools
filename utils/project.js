import axios from "axios";

export const fetchProjectInfo = async (url) => {
	const loggingTag = `[fetchProjectInfo]`;
	try{
		console.info(`${loggingTag} url: ${url}`);
		return await axios.get(`${process.env.NEXT_PUBLIC_BASE_URI}${url}`);
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		throw e;
	}
}

export const convertScoreToStatus = (score = 0) => {
	const loggingTag = `[convertScoreToStatus]`;
	let status = "good";
	try{
		status = score < 0 ? "danger" : score < 3 ? "ok" : "good";
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
	}
	return status;
}
