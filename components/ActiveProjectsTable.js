import {Grid, Typography, Button} from "@mui/material";
import axios from "axios";
import useSWR from "swr";
import {DataGrid} from "@mui/x-data-grid";
import dayjs from "dayjs";
import {useRouter} from "next/router";
import {useSyndicateAuthenticationContext} from "./SyndicateAuthenticationProvider";
import {project} from "../utils/strings";

const TableWrapper = (props) => {
	const {children} = props;
	return (
		<Grid
			item
			container
		>
			{children}
		</Grid>
	)
}

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

const fetchTableData = async (url) => {
	const loggingTag = `[fetchTableData]`;
	try{
		console.info(`${loggingTag} url: ${url}`);
		return await axios.get(`${process.env.NEXT_PUBLIC_BASE_URI}${url}`);
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		throw e;
	}
}

const renderURLCell = (params) => {
	const loggingTag = `[renderURLCell]`;
	// console.info(`${loggingTag}`, params);
	if(typeof params.value === "string" && params.value.length > 0){
		return(
			<a href={params.value} target={"_blank"}>Open</a>
		)
	} else {
		return("N/A")
	}
}

const render = {
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
			return("N/A")
		}
	},
	datetime: (params) => {
		if(typeof params.value === "string"){
			const formattedDateTime = dayjs(params.value).format("MM/DD/YY h:mm A");
			return(formattedDateTime)
		} else {
			return("N/A");
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
		const {value} = params;
		const router = useRouter();
		// console.info(`[render][actions] id:`, value);
		return(
			<Button
				variant={"contained"}
				onClick={(e)=>{
					router.push(`/projects/${value}`);
				}}
			>
				View
			</Button>
		)
	},
	general: (params) => {
		const content = typeof params.value === "number" ? params.value : 0;
		
		return (
			<span>{content}</span>
		)
	}
}

const { stages } = project;

const ActiveProjectsTable = (props) => {
	const componentLoggingTag = `[ActiveProjectsTable]`;
	
	const {address} = useSyndicateAuthenticationContext();
	
	const {data:resp, error, isValidating} = useSWR(`/users/${address}/projects/active`, fetchTableData);
	
	if(error){
		console.error(`${componentLoggingTag} error:`, error);
		return(
			<TableWrapper>
				<Grid item>
					<Typography>Table Content</Typography>
				</Grid>
			</TableWrapper>
		)
	} else if(resp) {
		console.info(`${componentLoggingTag} data received!`, resp);
		const projects = resp.data.projects;
		console.info(`${componentLoggingTag} projects received`, projects);
		
		const columns = [
			{
				field: "stage",
				headerName: "Progress",
				minWidth: 150,
				renderCell: render.stage
			},
			{
				field: "title",
				headerName: "Project",
				flex: 0
			},
			{
				field: "presale_price",
				headerName: "Presale Price",
				type: "number",
				minWidth: 120,
				cellClassName: 'center',
				valueFormatter: render.mintPrice,
			},
			{
				field: "max_per_transaction",
				headerName: "Per Transaction",
				type: "number",
				minWidth: 60,
				renderCell: render.general,
				cellClassName: 'center',
			},
			{
				field: "max_per_wallet",
				headerName: "Per Wallet",
				type: "number",
				minWidth: 60,
				renderCell: render.general,
				cellClassName: 'center',
			},
			{
				field: "ts_presale_start",
				headerName: "Presale Start",
				type: "datetime",
				minWidth: 140,
				renderCell: render.datetime,
			},
			{
				field: "ts_presale_end",
				headerName: "Presale End",
				type: "datetime",
				minWidth: 140,
				renderCell: render.datetime,
			},
			{
				field: "website_url",
				headerName: "Website",
				headerClassName: 'center',
				cellClassName: 'center',
				renderCell: render.url,
				sortable: false
			},
			{
				field: "twitter_url",
				headerName: "Twitter",
				headerClassName: 'center',
				cellClassName: 'center',
				renderCell: render.url,
				sortable: false
			},
			{
				field: "discord_url",
				headerName: "Discord",
				headerClassName: 'center',
				cellClassName: 'center',
				renderCell: render.url,
				sortable: false
			},
			// {
			// 	field: "is_discord_open",
			// 	headerName: "Public Discord?",
			// 	type: "boolean",
			// 	width: 140
			// },
			// {
			// 	field: "public_price",
			// 	headerName: "Public Price",
			// 	minWidth: 120,
			// 	cellClassName: 'center',
			// 	valueFormatter: render.mintPrice
			// },
			{
				field: "wl_register_url",
				headerName: "Raffle Registration URL",
				renderCell: render.url,
				sortable: false,
			},
			{
				field: "id",
				headerName: "Actions",
				type: "actions",
				renderCell: render.actions
			}
		]
		return (
			<Grid
				item
			>
				<DataGrid
					columns={columns}
					rows={projects}
					autoHeight={true}
					sx={{
						'& .center':{
							justifyContent: "center"
						}
					}}
				/>
			</Grid>
		)
	} else if (isValidating){
		return(
			<TableWrapper>
				<Typography>Validating...</Typography>
			</TableWrapper>
		)
	} else {
		return(
			<TableWrapper>
				<Typography>Loading...</Typography>
			</TableWrapper>
		)
	}
}
export default ActiveProjectsTable;