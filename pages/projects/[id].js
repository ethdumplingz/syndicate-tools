import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import {Typography, Grid, Button} from "@mui/material";

const fetchProjectInfo = async (url) => {
	const loggingTag = `[fetchTableData]`;
	try{
		console.info(`${loggingTag} url: ${url}`);
		return await axios.get(`${process.env.NEXT_PUBLIC_BASE_URI}${url}`);
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		throw e;
	}
}
const ProjectViewContainer = (props) => {
	const {children} = props;
	return (
		<Grid
			container
			sx={{
				p: 5,
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
		const info = resp.data.project[0];
		const {title, description, website_url, discord_url, twitter_url, presale_start, presale_end, presale_price, wl_register_url} = info;
		console.info(`${componentLoggingTag} project info:`, info);
		return(
			<ProjectViewContainer>
				<Grid
					item
					container
					direction={"column"}
					rowSpacing={3}
					sx={{
						maxWidth:{
							xs: "100vw",
							md: "800px"
						}
					}}
				>
					<ProjectInfoRow
						label={"Title"}
						value={title}
					/>
					<ProjectInfoRow
						label={"Website"}
						value={<a href={website_url} target={"_blank"}>{website_url}</a>}
					/>
					<ProjectInfoRow
						label={"Twitter"}
						value={<a href={twitter_url} target={"_blank"}>{twitter_url}</a>}
					/>
					<ProjectInfoRow
						label={"Discord"}
						value={<a href={discord_url} target={"_blank"}>{discord_url}</a>}
					/>
					<ProjectInfoRow
						label={"WL Raffle Entry"}
						value={<a href={wl_register_url} target={"_blank"}>{wl_register_url}</a>}
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