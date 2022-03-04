import {IconButton, Tooltip} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TrackIcon from "@mui/icons-material/TrackChanges";
import axios from "axios";
import {useEffect, useState} from "react";
import {useSyndicateAuthenticationContext} from "./SyndicateAuthenticationProvider";
import useSWR from "swr";

const fetcher = async (url) => {
	const loggingTag = `[fetcher]`;
	try{
		// console.info(`${loggingTag} url: ${url}`);
		return await axios.get(`${process.env.NEXT_PUBLIC_BASE_URI}${url}`);
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		throw e;
	}
}

const FollowProjectBtn = (props) => {
	const componentLoggingTag = `[FollowProjectBtn]`;
	
	const {address} = useSyndicateAuthenticationContext();
	const {onClick, id:projectID} = props;
	const [isWatching, setWatching] = useState(false);
	
	const {data:resp, error} = useSWR(`/users/${address}/projects/${projectID}/following`, fetcher, {revalidateIfStale: false});
	
	// console.info(`${componentLoggingTag} watching:`, isWatching);
	
	useEffect(()=>{
		console.info(`${componentLoggingTag}`, resp)
		if(typeof resp === "object" && resp.data.ok){
			// console.info(`${componentLoggingTag} is following?`, resp.data.is_following);
			setWatching(resp.data.is_following);
			if(typeof onClick === "function"){
				onClick(resp.data.is_following);
			}
		}
	}, [resp]);
	
	const updateProjectFollowStatus = async (e) => {
		const loggingTag = `${componentLoggingTag}[updateProjectFollowStatus]`;
		setWatching(!isWatching);
		if(typeof onClick === "function"){
			onClick(!isWatching);
		}
		const reqBody = {
			user: address,
			project_id: projectID,
			action: isWatching ? "unfollow" : "follow"
		}
		try{
			await axios.post(`${process.env.NEXT_PUBLIC_BASE_URI}/users/projects/actions/add`, reqBody);
		} catch(e){
			setWatching(!isWatching);//reverting back
			if(typeof onClick === "function"){
				onClick(!isWatching);
			}
			console.error(`${loggingTag} Error:`, e);
		}
	}
	
	return(
		<Tooltip title={isWatching ? "Stop Tracking" : "Track this Project"}>
			<IconButton
				onClick={updateProjectFollowStatus}
			>
				<TrackIcon
					sx={{
						color: isWatching ? "black" : "inherit"
					}}
				/>
			</IconButton>
		</Tooltip>
	)
}

export default FollowProjectBtn;