import {Grid, Button, Input, Typography} from "@mui/material";
import FileInput from "../../../components/FileInput";
import {useState} from "react";
import {useSyndicateAuthenticationContext} from "../../../components/SyndicateAuthenticationProvider";
import {useRouter} from "next/router";
import axios from "axios";

const BulkAdd = (props) => {
	const componentLoggingTag = `[BulkAdd]`;
	const{isAdmin} = useSyndicateAuthenticationContext();
	const router = useRouter();
	if(!isAdmin){
		//non admins shouldn't be on this page!
		router.push("/projects/view");
	}
	
	const[file, setFile] = useState(null);
	
	const sendFileToServer = async () => {
		const loggingTag = `${componentLoggingTag}[sendFileToServer]`;
		try{
			let formData = new FormData();
			console.info(`${loggingTag} Sending file`, file);
			formData.append("file", file);
			
			const result = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URI}/projects/bulk/add`, formData,{headers: {
					'Content-Type': 'multipart/form-data'
				}});
		} catch(e){
			console.error(`${loggingTag} Error:`, e);
		}
	}
	
	const uploadFile = (e) => {
		const loggingTag = `[uploadFile]`;
		try{
			// console.info(`${loggingTag} event`, e);
			const file = e.target.value;
			setFile(file);
			const reader = new FileReader();
			reader.readAsText(file, "UTF-8");
			reader.onload = function (evt) {
				// setFile(evt.target.result);
				console.info(`${loggingTag} file output`, evt.target.result);
			}
			reader.onerror = function (evt) {
				console.error(`${loggingTag} Error reading file`);
			}
			reader.onabort = (e) => {
				console.error(`${loggingTag} Error, aborted`, e);
			}
			
		} catch(e){
			console.error(`${loggingTag} Error:`, e);
		}
	}
	
	return (
		<Grid
			container
			spacing={2}
			sx={{
				p:4
			}}
			flexDirection={"column"}
		>
			<Grid item>
				<Typography sx={{fontSize: "1.5rem"}}>Add Projects in Bulk</Typography>
			</Grid>
			<Grid item container alignItems={"center"} columnSpacing={3}>
				<Grid item flex={1}>
					<FileInput label={"Click here to upload your CSV"} onChange={uploadFile}/>
				</Grid>
				<Grid item>
					<Button
						variant={"contained"}
						sx={{
							pt:1,
							pb:1,
							pr:2,
							pl:2,
							borderRadius: "2px"
						}}
						disabled={file === null}
						onClick={sendFileToServer}
					>
						Upload to Server
					</Button>
				</Grid>
			</Grid>
		</Grid>
	)
}

export default BulkAdd;