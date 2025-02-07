import {IconButton, Typography, Grid, Tooltip} from "@mui/material";
import dayjs from "dayjs";
import {project} from "./strings";
import WebsiteIcon from "@mui/icons-material/Public";
import RaffleIcon from "@mui/icons-material/ConfirmationNumber";
import NotAvailableIcon from "@mui/icons-material/NotInterested";
import DatetimeIcon from "@mui/icons-material/CalendarToday";
import FollowProjectBtn from "../components/FollowProjectBtn";
import WebsiteIconBtn from "../components/WebsiteIconBtn";
import TwitterIconBtn from "../components/TwitterIconBtn";
import DiscordIconBtn from "../components/DiscordIconBtn";
import RaffleIconBtn from "../components/RaffleIconBtn";
import CountdownTimer from "../components/CountdownTimer";
import AddToCalendarBtn from "../components/AddToCalendarBtn";
import ProjectActionCheckbox from "../components/ProjectActionCheckbox";

import InfoAvailableBtn from "../components/InfoAvailableBtn";
import EditProjectBtn from "../components/EditProjectBtn";
import ProjectScore from "../components/ProjectScore";
import ProjectStatusTooltip from "../components/ProjectStatusTooltip";

import ToggleProjectBtn from "../components/project-actions/ToggleProjectBtn";


import {convertScoreToStatus} from "../utils/project";
import ReportIssueBtn from "../components/ReportIssueBtn";
import SyndicateIndicator from "../components/SyndicateIndicator";

import Link from "next/link";

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

const stageDisplayStr = (id) => {
	const loggingTag = `[stageDisplayStr]`;
	const item = stages.find(stage => stage.id === id);
	console.info(`${loggingTag} ${id} item:`, item);
	return item.display_str;
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
		const {row} = params,
			{score, from_syndicate, id} = row,
			projectReliabilityStatus = convertScoreToStatus(score);
		
		// console.info(`${loggingTag} project reliability: ${projectReliabilityStatus}`);
		// console.info(`${loggingTag} row`, row);
		return(
			<TableTextCell>
				<Link href={`/projects/${id}`}>
					<Grid container columnSpacing={1.5} flexWrap={"nowrap"}>
						<Grid item>
							<Typography
								sx={{
									whiteSpace: "normal",
									textDecoration:"underline",
									'&:hover':{
										cursor: "pointer"
									}
								}}
							>{params.value}</Typography>
						</Grid>
						{from_syndicate ? (<Grid item><SyndicateIndicator/></Grid>) : ''}
						{projectReliabilityStatus !== "good" ? (<Grid item><ProjectStatusTooltip score={score} status={projectReliabilityStatus}/></Grid>) : ''}
					</Grid>
				</Link>
			</TableTextCell>
		)
	},
	stage: (params) => {
		const loggingTag = `[renderStage]`;
		if(typeof params.value === "string" && params.value.length > 0){

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
			if(
				(propsToLookFor.indexOf(key) > -1) &&
				(row[key] !== null) &&
				(row[key].length > 0)
			){
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
					sx={{
						ml:0
					}}
				>
					{actions.map((action, index) => (
						<a key={action.id} target={"_blank"} href={action.value}>
							<Grid item>
								{action.icon}
							</Grid>
						</a>
					))}
				</Grid>
			)
		} else {
			return(
				<Grid
					container
					spacing={1}
					alignItems={"center"}
					sx={{
						ml:0
					}}
				>
					<Grid item>
						{/*<NotAvailableIndicator/>*/}
					</Grid>
				</Grid>
			)
		}
	},
	datetime: (params) => {
		const loggingTag = `[render][datetime]`;
		let value = "N/A";
		try{
			if(typeof params.value === "string"){
				const formattedDateTime = dayjs(params.value).format("ddd MM/DD/YY h:mm A");
				// if()
				value = formattedDateTime;
			}
		} catch(e){
			console.error(`${loggingTag} Error:`, e);
			
		} finally {
			return (value);
		}
		
	},
	countdown: (params) => {
		const loggingTag = `[render][countdown]`;
		if(typeof params.value !== "undefined"){
			const {row, value} = params;
			// console.info(`${loggingTag} value: ${value}, row:`, row);
			return(
				<CountdownTimer
					presale={{
						start: dayjs(params.value),
						end: dayjs(params.row.ts_presale_end)
					}}
				/>
			)
		}
	},
	mintPrice: (params) => {
		let {value} = params;
		if(value === null){
			value = 0;
		}
		const ethPrice = Number(value).toFixed(2);
		return `${ethPrice} Ξ`;
	},
	actions: ({params, set_id:setID = "default", is_admin:isAdmin = false} = {}) => {
		const {id, row} = params;
		// const value = params.getValue();
		const loggingTag = `${baseLoggingTag}[actions]`;
		// const router = useRouter();
		// console.info(`[render][actions] id:`, value);
		// console.info(`${loggingTag} row`, row);
		// console.info(`${loggingTag} id`, id);
		
		const actions = [
			<EditProjectBtn id={id}/>,
			<ReportIssueBtn/>,
		]
		if(setID === "active-projects"){
			actions.splice(1, 0, <AddToCalendarBtn
					id={id}
					event={{
						name: row.title,
						details: row.description,
						start: row.ts_presale_start,
						end: row.ts_presale_end
					}}
				/>)
		}
		if(isAdmin){
			const {is_active} = row;
			// console.info(`${loggingTag} isActive: ${is_active}`, row);
			actions.push(
				<ToggleProjectBtn id={id} is_active={is_active}/>,
				// <DeleteProjectBtn id={id}/>
			)
		}
		
		return actions;
	},
	checkbox: (params) => {
		const loggingTag = `${baseLoggingTag}[checkbox]`;
		
		const {field, row, value} = params;
		const userSpecificField = field === "num_role_assigned" ? "role_assigned" :
				field === "num_wallet_added" ? "wallet_added" : 
					field === "num_mints" ? "minted" :
						"raffle_won";
		const isChecked = row[userSpecificField];
		// console.info(`${loggingTag} user specific value: ${row[field]}`);
		// console.info(`${loggingTag} value: ${value}`, row)
		return (
			<Grid
				container
				alignItems={"center"}
			>
				<Grid item>
					<ProjectActionCheckbox
						field={userSpecificField}
						project_id={row.id}
						label={stageDisplayStr(userSpecificField)}
						value={isChecked}
					/>
				</Grid>
				<Grid item>
					<Typography>({value})</Typography>
				</Grid>
			</Grid>
		)
	},
	text: (params) => {
		const loggingTag = `${baseLoggingTag}[text]`;
		let displayStr = (typeof params.value !== "undefined")  ? params.value : "N/A";
		return(
			<TableTextCell>{displayStr}</TableTextCell>
		)
	},
	general: (params) => {
		const content = typeof params.value === "number" ? params.value : 0;

		return (
			<span>{content}</span>
		)
	},
	information: (params) => {
		const loggingTag = `${baseLoggingTag}[information]`;
		const {value} = params;
		return (
			<InfoAvailableBtn
				url={value}
			/>
		)
	},
	score: (params) => {
		const loggingTag = `${baseLoggingTag}[score]`;
		// console.info(`${loggingTag} params`, params);
		const {row} = params;
		const {id, title, vote, upvotes, downvotes, score} = row;
		return [
			<ProjectScore
				id={id}
				title={title}
				vote={vote}
				upvotes={upvotes}
				downvotes={downvotes}
				score={score}
			/>
		]
	},
	following: (params) => {
		const loggingTag = `${baseLoggingTag}[following]`;
		// console.info(`${loggingTag} params`, params);
		const {row} = params;
		const {id, title, is_following} = row;
		return[
			<FollowProjectBtn
				id={id}
				title={title}
				is_following={is_following}
			/>
		]
	},
	header:{
		date: (params) => {
			const loggingTag = `${baseLoggingTag}[header][date]`;
			const {colDef} = params;
			// console.info(`${loggingTag} params`, params);
			
			return(
				<>
					<DatetimeIcon
						sx={{mr:1}}
					/>
					{colDef.headerName}
				</>
			)
		}
	},
	row: (params) => {
		const loggingTag = `${baseLoggingTag}[row]`;
		// console.info(`${loggingTag} params`, params);
		const {row} = params,
			{is_active, score} = row,
			projectStatus = `Project-Status-${convertScoreToStatus(score).toUpperCase()}`;
		
		return (`Project-isActive-${is_active} ${projectStatus}`);
	}
}

export {render};