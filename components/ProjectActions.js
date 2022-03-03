import {Grid} from "@mui/material";
import {useState, useEffect} from "react";
import FollowProjectBtn from "./FollowProjectBtn";
import UserProjectStatus from "./UserProjectStatus";
import useSWR from "swr";
import axios from "axios";
import {useSyndicateAuthenticationContext} from "./SyndicateAuthenticationProvider";

const fetcher = async (url) => {
	const loggingTag = `[fetcher]`;
	try{
		console.info(`${loggingTag} url: ${url}`);
		return await axios.get(`${process.env.NEXT_PUBLIC_BASE_URI}${url}`);
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		throw e;
	}
}

const ProjectActions = (props) => {
	const componentLoggingTag = `[ProjectActions]`;
	const {id:projectID} = props;
	const [isWatching, setWatching] = useState(false);
	const {address} = useSyndicateAuthenticationContext();
	const {data:resp, error} = useSWR(`/users/${address}/projects/${projectID}/following`, fetcher);
	
	console.info(`data:`, resp);
	
	useEffect(()=>{
		if(typeof resp === "object" && resp.data.ok){
			console.info(`${componentLoggingTag} is following?`, resp.data.is_following);
			setWatching(resp.data.is_following);
		}
	}, []);
	
	const updateProjectFollowStatus = async (e) => {
		const loggingTag = `${componentLoggingTag}[updateProjectFollowStatus]`;
		setWatching(!isWatching);
		const reqBody = {
			user: address,
			project_id: projectID,
			action: isWatching ? "unfollow" : "follow"
		}
		try{
			await axios.post(`${process.env.NEXT_PUBLIC_BASE_URI}/users/projects/actions/add`, reqBody);
		} catch(e){
			setWatching(!isWatching);//reverting back
			console.error(`${loggingTag} Error:`, e);
		}
	}
	
	return (
		<Grid
			container
			columnSpacing={4}
			justifyContent={"flex-end"}
			alignItems={"center"}
		>
			<Grid
				item
				sx={{
					display: isWatching ? "block" : "none"
				}}
			>
				<UserProjectStatus
					id={projectID}
				/>
			</Grid>
			<Grid
				item
				sx={{
					pt:1,
					pb:1
				}}
			>
				<FollowProjectBtn
					watching={isWatching}
					onClick={updateProjectFollowStatus}
				/>
			</Grid>
		</Grid>
	)
}

export default ProjectActions;