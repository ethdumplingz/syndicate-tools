import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import {Typography, Grid, Button, Tooltip} from "@mui/material";
import {fetchProjectInfo} from "../../utils/project";
import ProjectActions from "../../components/ProjectActions";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);


const ProjectViewContainer = (props) => {
	const {children} = props;
	return (
		<Grid
			container
			rowSpacing={5}
			sx={{
				p: 5,
				minHeight: "500px",
				maxWidth:{
					xs: "100vw",
					md: "800px"
				},
				backgroundImage:`url(${require("../../images/roadmap-bg.svg")})`,
				backgroundRepeat: "no-repeat",
				backgroundPosition: "center center",
				backgroundSize: {
					xs: "80% auto",
					md: "400px auto"
				}
			}}
		>
			{children}
		</Grid>
	)
}

const ProjectURLRow = (props) => {
	const {url, label} = props;
	
	const displayStr = (typeof url  === "string" && url.length > 0) ? (
		<a href={url} target={"_blank"}>{url}</a>
	) : (
		<Tooltip title={"To be confirmed"}>
			<Typography
				sx={{
					fontSize: "1.25rem"
				}}
			>TBC</Typography>
		</Tooltip>
	);
	
	return (
		<ProjectInfoRow
			label={"Website"}
			value={displayStr}
		/>
	)
}

const ProjectInfoRow = (props) => {
	const {label, value} = props;
	return(
		<Grid
			item
			container
			justifyContent={"space-between"}
			sx={{
				fontSize: "1.25rem"
			}}
		>
			<Grid item>
				<Typography
					sx={{
						fontWeight: 800,
						fontSize: "inherit"
					}}
				>{label}:</Typography>
			</Grid>
			<Grid item>
				<Typography
					sx={{
						fontSize: "inherit"
					}}
				>{value}</Typography>
			</Grid>
		</Grid>
	)
}

const formatTimeForDisplay = (datetime) => {
	const loggingTag = `[formatTimeForDisplay]`;
	let displayStr = 'N/A';
	try{
		const isValidDate = dayjs(datetime).unix() !== 0;//submitting epoch for projects if a date isn't provided
		if(isValidDate){
			displayStr = dayjs.utc(datetime).local().format("MMMM D, YYYY h:mm A")
		}
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
	}
	return displayStr;
}

const ProjectView = (props) => {
	const componentLoggingTag = `[ProjectView]`;
	const router = useRouter();
	const { id } = router.query;
	const {data:resp, error, isValidating} = useSWR(`/projects/get/${id}`, fetchProjectInfo);
	
	if(error){
		console.error(`${componentLoggingTag} Error:`, error);
		return (
			<ProjectViewContainer>
				<Grid item>
					<Typography>Error!</Typography>
				</Grid>
			</ProjectViewContainer>
		)
	} else if (resp){
		const loggingTag = `${componentLoggingTag}[resp rcvd]`;
		const info = resp.data.project[0];
		const {title, description, website_url, discord_url, role_acquisition, wallet_submission_url, twitter_url, ts_presale_start, ts_presale_end, presale_price, wl_register_url, max_supply, max_per_transaction, max_per_wallet} = info;
		console.info(`${componentLoggingTag} project info:`, info);
		
		console.info(`${loggingTag} pre dayjs`, ts_presale_start);
		
		console.info(`${loggingTag} post dayjs`, dayjs(ts_presale_start).utc());
		console.info(`${loggingTag} post dayjs unix`, dayjs(ts_presale_start).unix());
		return(
			<ProjectViewContainer>
				<Grid
					item
					container
				>
					<ProjectActions id={id}/>
				</Grid>
				<Grid
					item
					container
					direction={"column"}
					rowSpacing={3}
				>
					<ProjectInfoRow
						label={"Title"}
						value={title}
					/>
					<ProjectURLRow
						label={"Website"}
						url={website_url}
					/>
					<ProjectURLRow
						label={"Twitter"}
						url={twitter_url}
					/>
					<ProjectURLRow
						label={"Discord"}
						url={discord_url}
					/>
					<ProjectURLRow
						label={"Raffle Entry"}
						url={wl_register_url}
					/>
					<ProjectURLRow
						label={"Role Acquisition"}
						url={role_acquisition}
					/>
					<ProjectURLRow
						label={"Wallet Submission"}
						url={wallet_submission_url}
					/>
					<ProjectInfoRow
						label={"Presale Price"}
						value={`${presale_price}E`}
					/>
					<ProjectInfoRow
						label={"Max Supply"}
						value={max_supply > 0 ? max_supply : 0}
					/>
					<ProjectInfoRow
						label={"Max Per Transaction"}
						value={max_per_transaction > 0 ? max_per_transaction : 0}
					/>
					<ProjectInfoRow
						label={"Max Per Wallet"}
						value={max_per_wallet > 0 ? max_per_wallet : 0}
					/>
					<ProjectInfoRow
						label={"Presale Start"}
						value={formatTimeForDisplay(ts_presale_start)}
					/>
					<ProjectInfoRow
						label={"Presale End"}
						value={formatTimeForDisplay(ts_presale_end)}
					/>
					<Grid
						item
						sx={{
							fontSize: "1.25rem"
						}}
						flexGrow={1}
					>
						<Typography
							sx={{
								fontWeight: 800,
								fontSize: "inherit"
							}}
						>Description:</Typography>
						<Typography
							sx={{
								fontSize: "inherit"
							}}
						>{description}</Typography>
					</Grid>
					<Grid
						item
						container
					>
						<Grid
							item
							container
							justifyContent={"flex-end"}
							columnSpacing={2}
						>
							<Grid item>
								<Button
									variant={"outlined"}
									onClick={(e)=>{router.back()}}
									sx={{
										fontSize: "1.0rem",
										p: "8px 18px"
									}}
								>Go Back</Button>
							</Grid>
							<Grid item>
								<Button
									variant={"contained"}
									sx={{
										fontSize: "1.0rem",
										p: "8px 18px"
									}}
									onClick={(e)=>{router.push(`/projects/${id}/edit`)}}
								>Edit</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</ProjectViewContainer>
		)
	} else {//is validating
		return (
			<ProjectViewContainer>
				<Grid item>
					<Typography>Loading...</Typography>
				</Grid>
			</ProjectViewContainer>
		)
	}
	
}

export default ProjectView;