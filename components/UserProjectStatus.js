import {FormControl, InputLabel, Select, MenuItem} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";
import useSWR from "swr";
import {useSyndicateAuthenticationContext} from "./SyndicateAuthenticationProvider";
import {project} from "../utils/strings";

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

const { stages } = project;

const UserProjectStatus = (props) => {
	const componentLoggingTag = `[UserProjectStatus]`;
	const {id} = props;
	const {address} = useSyndicateAuthenticationContext();
	const [stage, setStage] = useState(stages[0].id);
	
	const handleChange = async (e) => {
		const loggingTag = `${componentLoggingTag}[handleChange]`;
		console.info(`${loggingTag} event:`, e);
		setStage(e.target.value);
		try{
			const body = {
				user: address,
				project_id: id,
				stage: e.target.value
			}
			await axios.post(`${process.env.NEXT_PUBLIC_BASE_URI}/users/projects/stages/add`, body);
		} catch(e){
			console.error(`${loggingTag} error:`, e);
		}
	}
	
	const {data:resp} = useSWR(`/users/${address}/projects/${id}/stages/latest`, fetcher, {
		revalidateIfStale: true
	});
	
	useEffect(()=>{
		if(typeof resp === "object" && resp.data.ok){
			const latestStage = resp.data.stage;
			console.info(`${componentLoggingTag} latest stage from server: ${latestStage}`);
			
			setStage(latestStage !== "unknown" ? latestStage : stages[0].id);
		}
	}, [resp]);
	
	return (
		<FormControl fullWidth>
			<InputLabel id="demo-simple-select-label">Status</InputLabel>
			<Select
				labelId="demo-simple-select-label"
				id="demo-simple-select"
				value={stage}
				label="Status"
				onChange={handleChange}
			>
				{
					stages.map(status => (
						<MenuItem value={status.id} key={status.id}>{status.display_str}</MenuItem>
					))
				}
			</Select>
		</FormControl>
	)
}

export default UserProjectStatus;