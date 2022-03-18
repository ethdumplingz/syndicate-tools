import {IconButton, Tooltip} from "@mui/material";
import HiddenIcon from "@mui/icons-material/VisibilityOff";
import VisibleIcon from "@mui/icons-material/Visibility";
import {useState, useEffect} from "react";
import axios from "axios";
import {useSyndicateAuthenticationContext} from "../SyndicateAuthenticationProvider";

const ToggleProjectBtn = (props) => {
	const componentLoggingTag = `[ProjectIsActiveToggleBtn]`;
	const {is_active, id} = props;
	const [isActive, setActive] = useState();
	const {address} = useSyndicateAuthenticationContext();
	
	useEffect(() => {
		setActive(is_active);
	}, [is_active]);
	
	const updateProjectVisibility = async (e) => {
		const loggingTag = `${componentLoggingTag}[updateProjectVisibility]`;
		try{
			const body = {
				id,
				user: address
			}
			setActive(prevState => (!prevState));
			const result = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URI}/projects/${isActive ? "hide" : "show"}`, body);
			console.info(`${loggingTag} result`, result);
			if(!result.data.ok){
				setActive(prevState => (!prevState));
			}
		} catch(e){
			console.error(`${loggingTag} Error:`, e);
		}
	}
	
	return (
		<Tooltip title={isActive ? "Hide" : "Show"}>
			<IconButton
				onClick={updateProjectVisibility}
			>
				{isActive ? <HiddenIcon/> : <VisibleIcon/>}
			</IconButton>
		</Tooltip>
	)
}
export default ToggleProjectBtn;