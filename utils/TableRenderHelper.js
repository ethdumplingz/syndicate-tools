import {Box, IconButton, Typography, Link, Grid, Tooltip} from "@mui/material";
import dayjs from "dayjs";
import {useRouter} from "next/router";
import {project} from "./strings";
import WebsiteIcon from "@mui/icons-material/Public";
import RaffleIcon from "@mui/icons-material/ConfirmationNumber";
import NotAvailableIcon from "@mui/icons-material/NotInterested";
import LaunchIcon from "@mui/icons-material/Launch";
import FollowProjectBtn from "../components/FollowProjectBtn";
import {Twitter} from "@mui/icons-material";
import WebsiteIconBtn from "../components/WebsiteIconBtn";
import TwitterIconBtn from "../components/TwitterIconBtn";
import DiscordIconBtn from "../components/DiscordIconBtn";
import RaffleIconBtn from "../components/RaffleIconBtn";
import CountdownTimer from "../components/CountdownTimer";

const { stages } = project;
const baseLoggingTag = `[tableRender]`;
const TableTextCell = (props) => {
	const {children} = props;
	return(
		<Typography
			sx={{
				overflow: "hidden",
				textOverflow: "ellipsis",
				textAlign: "left",
				fontSize: "0.8rem"
			}}
		>
			{children}
		</Typography>
	)
}

const NotAvailableIndicator = (props) => {
	return(
		<Tooltip title={"Not Available"}>
			<NotAvailableIcon/>
		</Tooltip>
	)
}

const render = {
	title: (params) => {
		const loggingTag = `${baseLoggingTag}[title]`;
		// console.info(`${loggingTag} params`, params);
		return(
			<TableTextCell>
				<Link href={`/projects/${params.row.id}`}>
					{params.value}
				</Link>
			</TableTextCell>
		)
	},
	stage: (params) => {
		const loggingTag = `[renderStage]`;
		if(typeof params.value === "string" && params.value.length > 0){
			const stageDisplayStr = (id) => {
				const item = stages.find(stage => stage.id === params.value);
				console.info(`${loggingTag} ${params.value} item:`, item);
				return item.display_str;
			}

			return (
				<TableTextCell>
					{stageDisplayStr(params.value)}
				</TableTextCell>
			)
		}
	},
	website: (params) => {
		const loggingTag = `${baseLoggingTag}[website]`;
		// console.info(`${loggingTag}`, params);
		if(typeof params.value === "string" && params.value.length > 0){
			return(
				<a href={params.value} target={"_blank"}>
					<IconButton>
						<WebsiteIcon/>
					</IconButton>
				</a>
				
			)
		} else {
			return(<NotAvailableIcon/>)
		}
	},
	raffle: (params) => {
		const loggingTag = `${baseLoggingTag}[raffle]`;
		// console.info(`${loggingTag}`, params);
		if(typeof params.value === "string" && params.value.length > 0){
			return(
				<a href={params.value} target={"_blank"}>
					<IconButton>
						<RaffleIcon/>
					</IconButton>
				</a>
			
			)
		} else {
			return(<NotAvailableIndicator/>)
		}
	},
	twitter: (params) => {
		const loggingTag = `${baseLoggingTag}[twitter]`;
		// console.info(`${loggingTag}`, params);
		if(typeof params.value === "string" && params.value.length > 0){
			return(
				<a href={params.value} target={"_blank"}>
					<TwitterIconBtn/>
				</a>
			
			)
		} else {
			return(<NotAvailableIndicator/>)
		}
	},
	discord: (params) => {
		const loggingTag = `${baseLoggingTag}[twitter]`;
		// console.info(`${loggingTag}`, params);
		if(typeof params.value === "string" && params.value.length > 0){
			return(
				<a href={params.value} target={"_blank"}>
					<DiscordIconBtn/>
				</a>
			
			)
		} else {
			return(<NotAvailableIndicator/>)
		}
	},
	url: (params) => {
		const loggingTag = `[renderURLCell]`;
		// console.info(`${loggingTag}`, params);
		if(typeof params.value === "string" && params.value.length > 0){
			return(
				<TableTextCell>
					<a href={params.value} target={"_blank"}>{params.value}</a>
				</TableTextCell>
			)
		} else {
			return(<NotAvailableIndicator/>)
		}
	},
	urls: (params) => {
		const loggingTag = `[renderURLCell]`;
		// console.info(`${loggingTag}`, params);
		let actions = [];
		const {row} = params,
			propsToLookFor = ["website_url", "twitter_url", "discord_url", "wl_register_url"];
		
		Object.keys(row).map(key => {
			if(propsToLookFor.indexOf(key) > -1){
				actions.push({
					id: key,
					value: row[key],
					icon: key === "website_url" ? <WebsiteIconBtn/> :
								key === "twitter_url" ? <TwitterIconBtn/> :
								key === "wl_register_url" ? <RaffleIconBtn/> :
						<DiscordIconBtn/>
				});
			}
		});
		
		if(actions.length > 0){
			return(
				<Grid
					container
					columnSpacing={2}
				>
					{actions.map((action, index) => (
						<a key={action.id} href={action.value}>
							<Grid item>
								{action.icon}
							</Grid>
						</a>
					))}
				</Grid>
			)
		} else {
			return(<NotAvailableIndicator/>)
		}
	},
	datetime: (params) => {
		if(typeof params.value === "string"){
			const formattedDateTime = dayjs(params.value).format("ddd MM/DD/YY h:mm A");
			return(formattedDateTime)
		} else {
			return("N/A");
		}
	},
	countdown: (params) => {
		if(typeof params.value === "string"){
			return(<CountdownTimer end={dayjs(params.value)}/>)
		}
	},
	mintPrice: (params) => {
		let {value} = params;
		if(value === null){
			value = 0;
		}
		const ethPrice = Number(value).toFixed(2);
		return `${ethPrice}E`;
	},
	actions: (params) => {
		const {value, row} = params;
		// const router = useRouter();
		// console.info(`[render][actions] id:`, value);
		return(
			<Box
				sx={{
					display: "flex"
				}}
			>
				<Grid
					container
					columnSpacing={1}
				>
					{/*<Grid item>*/}
					{/*	<Tooltip title={"View Project"}>*/}
					{/*		<IconButton*/}
					{/*			onClick={(e)=>{*/}
					{/*				router.push(`/projects/${value}`);*/}
					{/*			}}*/}
					{/*		>*/}
					{/*			<LaunchIcon/>*/}
					{/*		</IconButton>*/}
					{/*	</Tooltip>*/}
					{/*</Grid>*/}
					<Grid item>
						<FollowProjectBtn
							id={value}
							title={row.title}
						/>
					</Grid>
				</Grid>
			</Box>
			
		)
	},
	general: (params) => {
		const content = typeof params.value === "number" ? params.value : 0;

		return (
			<span>{content}</span>
		)
	}
}

export {render};