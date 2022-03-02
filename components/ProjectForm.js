import {Alert, Button, FormControlLabel, FormGroup, Grid, Snackbar, Switch, TextField, Typography} from "@mui/material";
import {useState} from "react";
import axios from "axios";
import fetchProjectInfo from "../utils/project";

const delay = (time = 5000) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, time);
	})
}

const FormTextField = (props) => {
	const componentLoggingTag = `[FormTextField]`;
	const {defaultValue, maxRows = 1, onChange = ()=>{}, children, label="", type="text", step = 1, helperText=""} = props;
	return(
		<TextField
			variant={"outlined"}
			defaultValue={defaultValue}
			onChange={onChange}
			fullWidth={true}
			multiline={maxRows > 1}
			maxRows={maxRows}
			label={label}
			type={type}
			step={step}
			helperText={helperText}
		>
			{children}
		</TextField>
	)
}

const ProjectForm = (props) => {
	const componentLoggingTag = `[ProjectForm]`;
	
	const {mode = "add"} = props;
	
	const [title, setTitle] = useState("");
	const [wlUrl, setWLUrl] = useState("");
	const [website, setWebsite] = useState("");
	const [twitter, setTwitter] = useState("");
	const [discord, setDiscord] = useState({
		isOpen: true,
		url:""
	});
	const [price, setPrice] = useState(0);
	const [unit, setUnit] = useState("ETH");
	const [presale, setPresale] = useState({
		start: 0,
		end: 0
	});
	const [contractAddress, setContractAddress] = useState("");
	const [description, setDescription] = useState("");
	
	const [reqOutcome, setReqOutcome] = useState({
		pending: false,
		display: false,
		severity: "success",
		message: "Success!"
	});
	
	const handleAlertClose = (e) => {
		const loggingTag = `[handleAlertClose]`;
		try{
			setReqOutcome({...reqOutcome, display: false});
		} catch(e){
			console.error(`${loggingTag} Error:`, e);
		}
	}
	
	if(mode === "edit"){
	
	}
	
	const addProjectToServer = async () => {
		const loggingTag = `${componentLoggingTag}[addProjectToServer]`;
		try{
			const url = URL.createObjectURL(new Blob()),
				projectID = url.substring(url.lastIndexOf('/') + 1);//generating random value for the server
			console.info(`${loggingTag} random value:`, projectID);
			
			const payload = {
				id: projectID,
				title,
				wl_register_url:wlUrl,
				website_url: website,
				twitter_url: twitter,
				discord_url: discord.url,
				is_discord_open: discord.isOpen,
				presale_price: price,
				sale_unit: unit,
				ts_presale_start: presale.start,
				ts_presale_end: presale.end,
				address: contractAddress,
				description
			}
			console.info(`${loggingTag} Payload to be saved to server:`, payload);
			
			try{
				setReqOutcome({...reqOutcome, display: true, pending:true, severity: "info", message: `Saving project info...`});
				const result = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URI}/projects/add`, payload);
				console.info(`${loggingTag} result:`, result);
				// await delay();//5 seconds
				if(result.data.ok){
					setReqOutcome({...reqOutcome, display: true, pending:false, severity: "success", message: `Success! Saved "${title}"`});
				} else {
					setReqOutcome({...reqOutcome, display: true, pending:false, severity: "error", message: `Looks like there was a problem saving "${title}".  Please check your internet and try again.`});
					console.error(`${loggingTag} An error occurred while saving project: "${title}" to the db.  Errors:`, result.data.errors);
				}
				
			} catch(e){
				setReqOutcome({...reqOutcome, display: true, pending:false, severity: "error", message: `There was a problem saving this project.   Please check your internet connection and try again.`});
				console.error(`${loggingTag} Unable to make request to add project`);
			} finally {
				await delay();//5 seconds
				setReqOutcome({...reqOutcome, display: false});
			}
			
		} catch(e){
			console.error(`${loggingTag} Error:`, e);
		}
	}
	
	return (
		<>
			<Grid
				container
				direction={"column"}
				alignItems={"stretch"}
				flexGrow={1}
				rowSpacing={3}
				sx={{
					pt:3
				}}
			>
				<Grid
					item
				>
					<Typography
						variant={"h4"}
					>{mode === "edit" ? "Edit" : "Add"} Project</Typography>
				</Grid>
				<Grid
					item
				>
					<FormTextField
						defaultValue={title}
						label={"Title"}
						onChange={(e)=>{setTitle(e.currentTarget.value)}}
					/>
				</Grid>
				<Grid
					item
				>
					<FormTextField
						defaultValue={wlUrl}
						label={"Whitelist URL"}
						type={"url"}
						onChange={(e)=>{setWLUrl(e.currentTarget.value)}}
					/>
				</Grid>
				<Grid
					item
				>
					<FormTextField
						defaultValue={website}
						label={"Website URL"}
						type={"url"}
						onChange={(e)=>{setWebsite(e.currentTarget.value)}}
					/>
				</Grid>
				<Grid
					item
				>
					<FormTextField
						defaultValue={twitter}
						label={"Twitter URL"}
						type={"url"}
						onChange={(e)=>{setTwitter(e.currentTarget.value)}}
					/>
				</Grid>
				<Grid
					item
					container
					columnSpacing={3}
					alignItems={"center"}
				>
					<Grid
						item
						flexGrow={1}
					>
						<FormTextField
							defaultValue={description}
							label={"Discord URL"}
							type={"url"}
							onChange={(e)=>{setDiscord({...discord, url:e.currentTarget.value})}}
						/>
					</Grid>
					<Grid
						item
					>
						<FormGroup>
							<FormControlLabel control={<Switch defaultChecked onChange={(e)=>{console.info(e.target.checked); setDiscord({...discord, isOpen: e.target.checked})}}/>} label="Public" />
						</FormGroup>
					</Grid>
				</Grid>
				<Grid
					item
					container
					alignItems={"center"}
					columnSpacing={3}
				>
					<Grid item>
						<FormTextField
							label={"Price"}
							defaultValue={price}
							type={"number"}
							step={0.05}
							onChange={(e) => {setPrice(e.currentTarget.value)}}
						/>
					</Grid>
					<Grid item>
						<FormTextField
							label={"Unit"}
							defaultValue={unit}
							onChange={(e) => {setUnit(e.currentTarget.value)}}
						/>
					</Grid>
				</Grid>
				{/*presale section*/}
				<Grid
					item
					container
					alignItems={"center"}
					columnSpacing={3}
				>
					<Grid item>
						<FormTextField
							helperText={"Presale Start"}
							defaultValue={presale.start}
							type={"datetime-local"}
							onChange={(e)=>{console.info(e.currentTarget.value);setPresale({...presale, start:e.currentTarget.value})}}
						/>
					</Grid>
					<Grid item>
						<FormTextField
							helperText={"Presale End"}
							defaultValue={presale.end}
							type={"datetime-local"}
							onChange={(e)=>{console.info(e.currentTarget.value);setPresale({...presale, end:e.currentTarget.value})}}
						/>
					</Grid>
				</Grid>
				<Grid
					item
				>
					<FormTextField
						defaultValue={contractAddress}
						label={"Contract Address"}
						maxRows={5}
						onChange={(e)=>{setContractAddress(e.currentTarget.value)}}
					/>
				</Grid>
				<Grid
					item
				>
					<FormTextField
						defaultValue={description}
						label={"Description"}
						maxRows={5}
						onChange={(e)=>{setDescription(e.currentTarget.value)}}
					/>
				</Grid>
				<Grid
					item
					container
					alignItems={"center"}
					justifyContent={"flex-end"}
					columnSpacing={3}
				>
					<Grid item>
						<Button
							variant={"outlined"}
						>
							Reset
						</Button>
					</Grid>
					<Grid item>
						<Button
							variant={"contained"}
							disabled={reqOutcome.pending}
							onClick={addProjectToServer}
						>
							Save
						</Button>
					</Grid>
				</Grid>
			</Grid>
			<Snackbar
				anchorOrigin={{ vertical:"top", horizontal:"right" }}
				open={reqOutcome.display}
				autoHideDuration={6000}
				onClose={handleAlertClose}
			>
				<Alert
					onClose={handleAlertClose}
					severity={reqOutcome.severity}
				>
					{reqOutcome.message}
				</Alert>
			</Snackbar>
		</>
	)
}

export default ProjectForm;