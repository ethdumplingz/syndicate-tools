import axios from "axios";
import {useSyndicateAuthenticationContext} from "./SyndicateAuthenticationProvider";
import {Checkbox, Tooltip} from "@mui/material";
import {useEffect, useState} from "react";

const ProjectActionCheckbox = (props) => {
	const componentLoggingTag = `[ProjectActionCheckbox]`;
	const {address} = useSyndicateAuthenticationContext();
	const {project_id, label, field, value = 0} = props;
	const [isChecked, setChecked] = useState(false);
	
	useEffect(()=>{
		setChecked(value);
	}, []);
	const updateProjectAction = async (e) => {
		const loggingTag = `${componentLoggingTag}[ProjectActionCheckbox]`;
		// console.info(`${loggingTag} event:`, e);
		setChecked(!isChecked);
		console.info(`${loggingTag} is checked?`, isChecked);
		// if(!isChecked){
			try{
				const body = {
					user: address,
					project_id,
					action: field,
					value: !isChecked
				}
				await axios.post(`${process.env.NEXT_PUBLIC_BASE_URI}/users/projects/actions/update`, body);
			} catch(e){
				console.error(`${loggingTag} error:`, e);
			}
		}
	// }
	
	return(
		<Tooltip title={label}>
			<Checkbox
				onChange={updateProjectAction}
				checked={isChecked}
				inputProps={{ 'aria-label': 'controlled' }}
			/>
		</Tooltip>
	)
}
export default ProjectActionCheckbox;