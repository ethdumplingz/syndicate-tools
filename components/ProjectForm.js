import {Alert, Button, FormControlLabel, FormGroup, Grid, Snackbar, Switch, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";
import {fetchProjectInfo} from "../utils/project";
import useSWR from "swr";
import {useRouter} from "next/router";
import {useSyndicateAuthenticationContext} from "./SyndicateAuthenticationProvider";
import {validateURL} from "../utils/urls";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import NavigateBackBtn from "./NavigateBackBtn";
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
	const {value="",defaultValue, maxRows = 1, onChange = ()=>{}, min, children, label="", type="text", step = 1, helperText="", error = false} = props;
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
			error={error}
			min={min}
		>
			{children}
		</TextField>
	)
}

const formatDatetimeForForm = (dbDatetime) => {
	const loggingTag = `[formatDateTimeForForm]`;
	let datetime = "";
	try{
		datetime = dbDatetime !== null ? dayjs(dbDatetime).format("YYYY-MM-DDTHH:mm:ss") : null;
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
		datetime = clientDateTime !== null ? dayjs(clientDateTime.length > 0 ? clientDateTime : 0).utc().format("YYYY-MM-DDTHH:mm:ss") : null;
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
	}
	return datetime;
}

const ProjectForm = (props) => {
	const componentLoggingTag = `[ProjectForm]`;
	
	console.info(`${componentLoggingTag} project form`, props);
	const {title:projectTitle, description:desc, website_url = "", twitter_url = "", discord_url = "", role_acquisition_url = "", wallet_submission_url = "", presale_price = 0, public_price = 0, ts_presale_start = 0, ts_presale_end = 0, ts_public_sale = 0, wl_register_url, max_supply, max_per_transaction, max_per_wallet} = props;
	const { isAdmin, address } = useSyndicateAuthenticationContext();
	
	const router = useRouter();
	const {id = ""} = props;
	
	const [title, setTitle] = useState(projectTitle);
	const [description, setDescription] = useState(desc);
	const [wlUrl, setWLUrl] = useState(wl_register_url);
	const [website, setWebsite] = useState(website_url);
	const [twitter, setTwitter] = useState(twitter_url);
	const [discord, setDiscord] = useState({
		isOpen: true,
		url: discord_url,
		role_acquisition_url: role_acquisition_url,
		wallet_submission_url: wallet_submission_url
	});
	const [price, setPrice] = useState({
		presale: presale_price,
		public: public_price
	});
	const [unit, setUnit] = useState("ETH");
	const [supply, setSupply] = useState(max_supply);
	const [publicSale, setPublicSale] = useState({
		start: formatDatetimeForForm(ts_public_sale)
	});
	const [presale, setPresale] = useState({
		per_transaction: max_per_transaction,
		per_wallet: max_per_wallet,
		start: formatDatetimeForForm(ts_presale_start),
		end: formatDatetimeForForm(ts_presale_end)
	});
	const [contractAddress, setContractAddress] = useState("");
	
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
				ts_public_sale: formatDatetimeForServer(publicSale.start),
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
			console.info(`${loggingTag} public sale:`, publicSale);
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
				ts_presale_start: formatDatetimeForServer(presale.start),
				ts_presale_end: formatDatetimeForServer(presale.end),
				ts_public_sale: formatDatetimeForServer(publicSale.start),
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
				id,
				user: address
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
	
	const checkIfUrlsAreInvalid = () => {
		const loggingTag = `${componentLoggingTag}[checkIfUrlsAreInvalid]`;
		let invalid = false;
		try{
			const urlsToValidate = [
				twitter,
				discord.url,
				discord.role_acquisition_url,
				discord.wallet_submission_url
			];
			
			urlsToValidate.forEach( (url, index) => {
				if(!validateURL({url, type: index === 0 ? "twitter" : "discord"})){
					invalid = true;
					console.info(`${loggingTag} url: ${url} is invalid!`);
				}
			});
		} catch(e){
			console.error(`${loggingTag} Error:`, e);
		}
		return invalid;
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
			setPublicSale({
				start: 0
			})
			setPresale({
				start:0,
				end: 0
			});
			setWLUrl("");
		} catch(e){
			console.error(`${loggingTag} Error:`, e);
		}
	}
	
	console.info(`${componentLoggingTag} is admin? `, isAdmin);
	const isEditView = id.length > 0;
	return (
		<>
			<Grid
				container
				direction={"column"}
				alignItems={"stretch"}
				flexGrow={1}
				rowSpacing={4}
				sx={{
					pt: 4,
					pb: 4
				}}
			>
				<Grid
					item
					container
					alignItems={"center"}
					columnSpacing={1}
				>
					<Grid
						item
					>
						<NavigateBackBtn/>
					</Grid>
					<Grid item>
						<Typography
							variant={"h4"}
						>{isEditView ? "Edit" : "Add"} Project</Typography>
					</Grid>
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
						error={!validateURL({url: twitter})}
						label={"Twitter URL"}
						type={"url"}
						onChange={(e)=>{setTwitter(e.currentTarget.value)}}
						helperText={!validateURL({url: twitter}) ? "Invalid URL" : ""}
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
							error={!validateURL({url:discord.url, type: "discord"})}
							helperText={!validateURL({url: discord.url, type: "discord"}) ? "Invalid URL" : ""}
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
						error={!validateURL({url:discord.role_acquisition_url, type: "discord"})}
						helperText={!validateURL({url: discord.role_acquisition_url, type: "discord"}) ? "Invalid URL" : ""}
						label={"Role Acquisition URL"}
						type={"url"}
						onChange={(e)=>{setDiscord({...discord, role_acquisition_url: e.currentTarget.value})}}
					/>
				</Grid>
				<Grid item>
					<FormTextField
						value={discord.wallet_submission_url}
						error={!validateURL({url:discord.wallet_submission_url, type: "discord"})}
						helperText={!validateURL({url: discord.wallet_submission_url, type: "discord"}) ? "Invalid URL" : ""}
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
					flexWrap={"nowrap"}
					columns={3}
				>
					<Grid item xs={3} md={1}>
						<FormTextField
							helperText={"Presale Start"}
							// minDateTime={new Date()}
							value={presale.start}
							type={"datetime-local"}
							// onViewChange={(e)=>{console.info(`[onViewChange] event`, e)}}
							onChange={(e)=>{console.info(e.currentTarget.value);setPresale({...presale, start:e.currentTarget.value})}}
							// onChange={(e)=>{console.info(e)}}
						/>
					</Grid>
					<Grid item xs={3} md={1}>
						<FormTextField
							helperText={"Presale End"}
							// minDateTime={new Date(presale.start)}
							value={presale.end}
							type={"datetime-local"}
							onChange={(e)=>{console.info(e.currentTarget.value);setPresale({...presale, end:e.currentTarget.value})}}
							// onChange={(e)=>{console.info(e)}}
						/>
					</Grid>
					<Grid item xs={3} md={1}>
						<FormTextField
							renderInput={(props) => <TextField {...props}/>}
							helperText={"Public Start"}
							// minDateTime={new Date(presale.end)}
							value={publicSale.start}
							// value={""}
							type={"datetime-local"}
							onChange={(e)=>{console.info(`public start`,e.currentTarget.value);setPublicSale({...publicSale, start:e.currentTarget.value})}}
							// onChange={(e)=>{console.info(e)}}
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
							text={isEditView ? "Delete" : "Reset"}
							onClick={isEditView ? deleteProjectOnServer : resetProjectForm}
						/>
					</Grid>
					<Grid item>
						<FormActionBtn
							variant={"contained"}
							disabled={reqOutcome.pending || checkIfUrlsAreInvalid()}
							onClick={isEditView ? updateProjectOnServer : addProjectToServer}
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
}

export default ProjectForm;