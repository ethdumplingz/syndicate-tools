import {Tooltip, IconButton} from "@mui/material";
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import axios from "axios";
import {useSyndicateAuthenticationContext} from "../SyndicateAuthenticationProvider";

const DeleteProjectBtn = (props) => {
	const componentLoggingTag = `[DeleteProjectBtn]`;
	const {id} = props;
	const {address} = useSyndicateAuthenticationContext();
	
	const deleteProject = async () => {
		const loggingTag = `${componentLoggingTag}[deleteProject`;
		
		try{
			const result = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URI}/projects/delete`, {id, user:address});
			if(result.data.ok){
				//success
			} else {
				console.error(`${loggingTag} Error, unable to delete project! Error(s):`, result.data.errors);
			}
		} catch(e){
			console.error(`${loggingTag} Error:`, e);
		}
	}
	return (
		<Tooltip title={"Delete"}>
			<IconButton
				onClick={deleteProject}
			>
				<DeleteSharpIcon/>
			</IconButton>
		</Tooltip>
	)
}

export default DeleteProjectBtn;