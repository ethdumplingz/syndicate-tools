import {Alert, Button, FormControlLabel, FormGroup, Grid, Snackbar, Switch, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";
import {fetchProjectInfo} from "../utils/project";
import useSWR from "swr";
import {useRouter} from "next/router";
import {useSyndicateAuthenticationContext} from "./SyndicateAuthenticationProvider";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const delay = (time = 5000) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, time);
	})
}

const FormActionBtn = (props) => {
	const componentLoggingTag = `[FormActionBtn]`;
	const {text, onClick, variant, disabled = false} = props;
	return (
		<Button
			variant={variant}
			disabled={disabled}
			onClick={onClick}
			sx={{
				padding: "8px 18px",
				fontSize: "1rem"
			}}
		>
			{text}
		</Button>
	)
}

const FormTextField = (props) => {
	const componentLoggingTag = `[FormTextField]`;
	const {value="",defaultValue, maxRows = 1, onChange = ()=>{}, children, label="", type="text", step = 1, helperText=""} = props;
	// console.info(`${componentLoggingTag} props`, props);
	return(
		<TextField
			variant={"outlined"}
			value={value}
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

const formatDatetimeForForm = (dbDatetime) => {
	const loggingTag = `[formatDateTimeForForm]`;
	let datetime = "";
	try{
		datetime = dayjs(dbDatetime).format("YYYY-MM-DDTHH:mm:ss");
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
	}
	return datetime;
}

const formatDatetimeForServer = (clientDateTime) => {
	const loggingTag = `[formatDatetimeForServer]`;
	let datetime = "";
	try{
		//need to convert timestamps to be UTC before sending to server
		datetime = dayjs(clientDateTime.length > 0 ? clientDateTime : 0).utc().format("YYYY-MM-DDTHH:mm:ss");
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
	}
	return datetime;
}

const ProjectForm = (props) => {
	const componentLoggingTag = `[ProjectForm]`;
	
	const { isAdmin }= useSyndicateAuthenticationContext();
	
	const router = useRouter();
	const {id = ""} = props;
	
	const [title, setTitle] = useState("");
	const [wlUrl, setWLUrl] = useState("");
	const [website, setWebsite] = useState("");
	const [twitter, setTwitter] = useState("");
	const [discord, setDiscord] = useState({
		isOpen: true,
		url: "",
		role_acquisition_url: "",
		wallet_submission_url: ""
	});
	const [price, setPrice] = useState({
		presale: 0,
		public: 0
	});
	const [unit, setUnit] = useState("ETH");
	const [supply, setSupply] = useState(0);
	const [presale, setPresale] = useState({
		per_transaction: 0,
		per_wallet: 0,
		start: dayjs().format("YYYY-MM-DDTHH:mm"),//prepopulating the date value to NOW
		end: dayjs().format("YYYY-MM-DDTHH:mm")//prepopulating the date value to NOW
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
	
	const addProjectToServer = async () => {
		const loggingTag = `${componentLoggingTag}[addProjectToServer]`;
		try{
			const url = URL.createObjectURL(new Blob()),
				projectID = url.substring(url.lastIndexOf('/') + 1);//generating random value for the server
			console.info(`${loggingTag} random value:`, projectID);
			console.info(`${loggingTag} presale: ${presale.start} typeof ${typeof presale.start}`, );
			const payload = {
				id: projectID,
				title,
				wl_register_url:wlUrl,
				website_url: website,
				twitter_url: twitter,
				discord_url: discord.url,
				role_acquisition_url: discord.role_acquisition_url,
				wallet_submission_url: discord.wallet_submission_url,
				is_discord_open: discord.isOpen,
				presale_price: price.presale,
				public_price: price.public,
				sale_unit: unit,
				// ts_presale_start: presale.start,
				// ts_presale_end: presale.end,
				ts_presale_start: formatDatetimeForServer(presale.start),
				ts_presale_end: formatDatetimeForServer(presale.end),
				address: contractAddress,
				description,
				max_supply: supply,
				max_per_transaction: presale.per_transaction,
				max_per_wallet: presale.per_wallet,
			}
			console.info(`${loggingTag} Payload to be saved to server:`, payload);
			
			try{
				setReqOutcome({...reqOutcome, display: true, pending:true, severity: "info", message: `Saving project info...`});
				const result = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URI}/projects/add`, payload);
				console.info(`${loggingTag} result:`, result);
				// await delay();//5 seconds
				if(result.data.ok){
					setReqOutcome({...reqOutcome, display: true, pending:false, severity: "success", message: `Success! Saved "${title}"`});
					await router.push(`/projects/${projectID}`);
				} else {
					setReqOutcome({...reqOutcome, display: true, pending:false, severity: "error", message: `Looks like there was a problem saving "${title}".  Please check your internet and try again.`});
					console.error(`${loggingTag} An error occurred while saving project: "${title}" to the db.  Errors:`, result.data.errors);
				}
				
			} catch(e){
				setReqOutcome({...reqOutcome, display: true, pending:false, severity: "error", message: `There was a problem saving this project.   Please check your internet connection and try again.`});
				console.error(`${loggingTag} Unable to make request to add project`, e);
			} finally {
				await delay();//5 seconds
				setReqOutcome({...reqOutcome, display: false});
			}
			
		} catch(e){
			console.error(`${loggingTag} Error:`, e);
		}
	}
	
	const updateProjectOnServer = async () => {
		const loggingTag = `${componentLoggingTag}[updateProjectOnServer]`;
		try{
			// console.info(`${loggingTag} presale`, presale);
			const payload = {
				id: id,
				title,
				wl_register_url:wlUrl,
				website_url: website,
				twitter_url: twitter,
				discord_url: discord.url,
				role_acquisition_url: discord.role_acquisition_url,
				wallet_submission_url: discord.wallet_submission_url,
				is_discord_open: discord.isOpen,
				presale_price: price.presale,
				public_price: price.public,
				sale_unit: unit,
				ts_presale_start: dayjs(presale.start).utc().format("YYYY-MM-DDTHH:mm:ss"),
				ts_presale_end: dayjs(presale.end).utc().format("YYYY-MM-DDTHH:mm:ss"),
				address: contractAddress,
				description,
				max_supply: supply,
				max_per_transaction: presale.per_transaction,
				max_per_wallet: presale.per_wallet,
			}
			console.info(`${loggingTag} Payload to be sent to server:`, payload);
			
			try{
				setReqOutcome({...reqOutcome, display: true, pending:true, severity: "info", message: `Saving project info...`});
				const result = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URI}/projects/edit`, payload);
				console.info(`${loggingTag} result:`, result);
				// await delay();//5 seconds
				if(result.data.ok){
					setReqOutcome({...reqOutcome, display: true, pending:false, severity: "success", message: `Success! Edits made for "${title}"`});
					router.push(`/projects/${id}`);
				} else {
					setReqOutcome({...reqOutcome, display: true, pending:false, severity: "error", message: `Looks like there was a problem saving "${title}".  Please check your internet and try again.`});
					console.error(`${loggingTag} An error occurred while saving project: "${title}" to the db.  Errors:`, result.data.errors);
				}
				
			} catch(e){
				setReqOutcome({...reqOutcome, display: true, pending:false, severity: "error", message: `There was a problem editing this project.   Please check your internet connection and try again.`});
				console.error(`${loggingTag} Unable to make request to edit project`, e);
			} finally {
				await delay();//5 seconds
				setReqOutcome({...reqOutcome, display: false});
			}
		} catch(e){
			console.error(`${loggingTag} Error:`, e);
		}
	}
	
	const deleteProjectOnServer = async () => {
		const loggingTag = `${componentLoggingTag}[deleteProjectOnServer]`;
		try{
			const payload = {
				id
			}
			console.info(`${loggingTag} Payload to be sent to server:`, payload);
			
			try{
				setReqOutcome({...reqOutcome, display: true, pending:true, severity: "info", message: `Saving project info...`});
				const result = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URI}/projects/delete`, payload);
				console.info(`${loggingTag} result:`, result);
				// await delay();//5 seconds
				if(result.data.ok){
					setReqOutcome({...reqOutcome, display: true, pending:false, severity: "success", message: `Success! Project "${title}" deleted.`});
					await delay(500);
					router.push(`/projects/view`);
				} else {
					setReqOutcome({...reqOutcome, display: true, pending:false, severity: "error", message: `Looks like there was a problem deleting "${title}".  Please check your internet and try again.`});
					console.error(`${loggingTag} An error occurred while saving project: "${title}" to the db.  Errors:`, result.data.errors);
				}
				
			} catch(e){
				setReqOutcome({...reqOutcome, display: true, pending:false, severity: "error", message: `There was a problem deleting this project.   Please check your internet connection and try again.`});
				console.error(`${loggingTag} Unable to make request to delete project`);
			} finally {
				await delay();//5 seconds
				setReqOutcome({...reqOutcome, display: false});
			}
		} catch(e){
			console.error(`${loggingTag} Error:`, e);
		}
	}
	
	const resetProjectForm = async () => {
		const loggingTag = `${componentLoggingTag}[resetProjectForm]`;
		try{
			setTitle("");
			setDescription("");
			setWebsite("");
			setTwitter("");
			setDiscord({...discord, url: "", role_acquisition_url: ""});
			setPrice({
				presale:0,
				public: 0
			});
			setPresale({
				start:0,
				end: 0
			});
			setWLUrl("");
		} catch(e){
			console.error(`${loggingTag} Error:`, e);
		}
	}
	
	const shouldFetchProjectInfo = id.length > 0;
	
	const {data, error} = useSWR(shouldFetchProjectInfo ? `/projects/get/${id}` : null, fetchProjectInfo,{revalidateIfStale: false});
	
	if(error){
		return (
			<Grid item container>
				<Grid item>
					<Typography> Error: Unable to load this project.  Click <a onClick={(e)=>{router.reload()}}>here</a> to try again.</Typography>
				</Grid>
			</Grid>
		)
	} else if (data || !shouldFetchProjectInfo){
		// console.info(`${componentLoggingTag} data:`, data);
		if(typeof data !== "undefined"){
			const resp = data,
				project = resp.data.project[0];
			const {title, description, website_url, twitter_url, discord_url, role_acquisition_url, wallet_submission_url, presale_price, public_price, ts_presale_start, ts_presale_end, wl_register_url, max_supply, max_per_transaction, max_per_wallet} = project;
			
			useEffect(() => {
				setTitle(title);
				setDescription(description);
				setWebsite(website_url);
				setTwitter(twitter_url);
				setDiscord({...discord, url: discord_url, role_acquisition_url, wallet_submission_url});
				setPrice({
					presale: presale_price,
					public: public_price
				});
				console.info(`${componentLoggingTag}[localization] presale start: ${ts_presale_start} end: ${ts_presale_end}`);
				const formattedTimes = {
					per_transaction: max_per_transaction,
					per_wallet: max_per_wallet,
					start: formatDatetimeForForm(ts_presale_start),
					end: formatDatetimeForForm(ts_presale_end),
				}
				console.info(`${componentLoggingTag}[localization] formatted time`, formattedTimes);
				setSupply(max_supply);
				setPresale(formattedTimes);
				// console.info(`${componentLoggingTag} presale state:`, presale);
				setWLUrl(wl_register_url);
			}, []);
			
		}
		
		console.info(`${componentLoggingTag} is admin? `, isAdmin);
		return (
			<>
				<Grid
					container
					direction={"column"}
					alignItems={"stretch"}
					flexGrow={1}
					rowSpacing={4}
					sx={{
						pt:4
					}}
				>
					<Grid
						item
					>
						<Typography
							variant={"h4"}
						>{shouldFetchProjectInfo ? "Edit" : "Add"} Project</Typography>
					</Grid>
					<Grid
						item
					>
						<FormTextField
							value={title}
							label={"Title"}
							onChange={(e)=>{console.info(`${componentLoggingTag} title on change triggered!`); setTitle(e.currentTarget.value)}}
						/>
					</Grid>
					<Grid
						item
					>
						<FormTextField
							value={wlUrl}
							label={"Whitelist URL"}
							type={"url"}
							onChange={(e)=>{setWLUrl(e.currentTarget.value)}}
						/>
					</Grid>
					<Grid
						item
					>
						<FormTextField
							value={website}
							label={"Website URL"}
							type={"url"}
							onChange={(e)=>{setWebsite(e.currentTarget.value)}}
						/>
					</Grid>
					<Grid
						item
					>
						<FormTextField
							value={twitter}
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
								value={discord.url}
								label={"Discord URL"}
								type={"url"}
								onChange={(e)=>{setDiscord({...discord, url:e.currentTarget.value})}}
							/>
						</Grid>
						<Grid
							item
							sx={{
								display: "none"
							}}
						>
							<FormGroup>
								<FormControlLabel control={<Switch defaultChecked onChange={(e)=>{console.info(e.target.checked); setDiscord({...discord, isOpen: e.target.checked})}}/>} label="Public" />
							</FormGroup>
						</Grid>
					</Grid>
					<Grid item>
						<FormTextField
							value={discord.role_acquisition_url}
							label={"Role Acquisition URL"}
							type={"url"}
							onChange={(e)=>{setDiscord({...discord, role_acquisition_url: e.currentTarget.value})}}
						/>
					</Grid>
					<Grid item>
						<FormTextField
							value={discord.wallet_submission_url}
							label={"Wallet Submission URL"}
							type={"url"}
							onChange={(e)=>{setDiscord({...discord, wallet_submission_url: e.currentTarget.value})}}
						/>
					</Grid>
					<Grid
						item
						container
						alignItems={"center"}
						wrap={"nowrap"}
						spacing={3}
					>
						<Grid item>
							<FormTextField
								label={"(Presale) Price"}
								value={price.presale}
								type={"number"}
								step={0.05}
								onChange={(e) => {setPrice({...price, presale: e.currentTarget.value})}}
							/>
						</Grid>
						<Grid item>
							<FormTextField
								label={"(Public) Price"}
								defaultValue={price.presale}
								value={price.public}
								type={"number"}
								step={0.05}
								onChange={(e) => {setPrice({...price, public: e.currentTarget.value})}}
							/>
						</Grid>
						<Grid item>
							<FormTextField
								label={"Max Supply"}
								value={supply}
								onChange={(e) => {setSupply(e.currentTarget.value)}}
							/>
						</Grid>
						<Grid item>
							<FormTextField
								label={"Max Per Transaction"}
								value={presale.per_transaction}
								onChange={(e) => {setPresale({...presale, per_transaction:e.currentTarget.value})}}
							/>
						</Grid>
						<Grid item>
							<FormTextField
								label={"Max Per Wallet"}
								value={presale.per_wallet}
								onChange={(e) => {setPresale({...presale, per_wallet:e.currentTarget.value})}}
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
								value={presale.start}
								type={"datetime-local"}
								onChange={(e)=>{console.info(e.currentTarget.value);setPresale({...presale, start:e.currentTarget.value})}}
							/>
						</Grid>
						<Grid item>
							<FormTextField
								helperText={"Presale End"}
								value={presale.end}
								type={"datetime-local"}
								onChange={(e)=>{console.info(e.currentTarget.value);setPresale({...presale, end:e.currentTarget.value})}}
							/>
						</Grid>
					</Grid>
					<Grid
						item
					>
						<FormTextField
							value={contractAddress}
							label={"Contract Address"}
							maxRows={5}
							onChange={(e)=>{setContractAddress(e.currentTarget.value)}}
						/>
					</Grid>
					<Grid
						item
					>
						<FormTextField
							value={description}
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
						<Grid
							item
							sx={{
								display: isAdmin ? "block" : "none"
							}}
						>
							<FormActionBtn
								variant={"outlined"}
								text={shouldFetchProjectInfo ? "Delete" : "Reset"}
								onClick={shouldFetchProjectInfo ? deleteProjectOnServer : resetProjectForm}
							/>
						</Grid>
						<Grid item>
							<FormActionBtn
								variant={"contained"}
								disabled={reqOutcome.pending}
								onClick={shouldFetchProjectInfo ? updateProjectOnServer : addProjectToServer}
								text={"Save"}
							/>
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
	} else {
		return(
			<Grid item container>
				<Grid item>
					<Typography> Loading...</Typography>
				</Grid>
			</Grid>
		)
	}
}

export default ProjectForm;