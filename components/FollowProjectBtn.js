import {IconButton, Tooltip} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import UnFavoriteIcon from "@mui/icons-material/FavoriteBorder";
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
	const {address} = useSyndicateAuthenticationContext();
	const {onClick, id:projectID, title="", is_following} = props;
	const componentLoggingTag = `[FollowProjectBtn][proj: ${projectID}][proj name: ${title}]`;
	console.info(`${componentLoggingTag} address: "${address}" project id: ${projectID}`);
	const [following, setFollowing] = useState(is_following);
	
	useEffect(()=>{
		setFollowing(is_following);
	}, [is_following]);
	
	const updateProjectFollowStatus = async (e) => {
		const loggingTag = `${componentLoggingTag}[updateProjectFollowStatus]`;
		if(typeof onClick === "function"){
			console.info(`${loggingTag} triggering onclick...`);
			onClick(!following);
		}
		const reqBody = {
			user: address,
			project_id: projectID
		}
		
		setFollowing(!following);
		
		try{
			await axios.post(`${process.env.NEXT_PUBLIC_BASE_URI}/users/projects/${following ? "unfollow" : "follow"}`, reqBody);
			
			console.info(`${loggingTag} new favorite status:`, following);
		} catch(e){
			setFollowing(!following);
			if(typeof onClick === "function"){
				onClick(!following);
			}
			console.error(`${loggingTag} Error:`, e);
		}
	}
	
	return(
		<Tooltip title={following ? "Follow" : "Unfollow"}>
			<IconButton
				onClick={updateProjectFollowStatus}
			>
				{
					following ? (
						<FavoriteIcon
							sx={{
								color: following ? "black" : "inherit"
							}}
						/>
					) : (
						<UnFavoriteIcon
							sx={{
								color: following ? "black" : "inherit"
							}}
						/>
					)
				}
			</IconButton>
		</Tooltip>
	)
}

export default FollowProjectBtn;