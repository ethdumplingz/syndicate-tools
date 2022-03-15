import {Grid, Typography, Button} from "@mui/material";
import axios from "axios";
import useSWR from "swr";
import {DataGrid} from "@mui/x-data-grid";
import dayjs from "dayjs";
import {useRouter} from "next/router";
import {useSyndicateAuthenticationContext} from "./SyndicateAuthenticationProvider";
import {project} from "../utils/strings";
import {render} from "../utils/TableRenderHelper";
import ProjectTableActions from "./ProjectTableActions";

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

const ActiveProjectsTable = (props) => {
	const componentLoggingTag = `[ActiveProjectsTable]`;
	
	const {address} = useSyndicateAuthenticationContext();
	
	const {data:resp, error, isValidating} = useSWR(`/users/${address}/projects/active`, fetchTableData);
	
	console.info(`${componentLoggingTag} projects`, render);
	
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
			// {
			// 	field: "stage",
			// 	headerName: "Progress",
			// 	minWidth: 150,
			// 	renderCell: render.stage
			// },
			{
				field: "title",
				headerName: "Project",
				minWidth: 170,
				renderCell: render.title
			},
			{
				field: "raffle_won",
				headerName: "WL",
				headerAlign: "center",
				cellClassName: 'center',
				renderCell: render.checkbox
			},
			{
				field: "role_assigned",
				headerName: "Role",
				headerAlign: "center",
				cellClassName: 'center',
				renderCell: render.checkbox
			},
			{
				field: "wallet_added",
				headerName: "Wallet",
				headerAlign: 'center',
				cellClassName: 'center',
				renderCell: render.checkbox
			},
			{
				field: "minted",
				headerName: "Mint",
				headerAlign: "center",
				cellClassName: 'center',
				renderCell: render.checkbox
			},
			{
				field: "role_acquisition_url",
				headerName: "Role Info",
				headerAlign: "center",
				cellClassName: 'center',
				renderCell: render.information
			},
			{
				field: "wallet_submission_url",
				headerName: "Wallet Info",
				headerAlign: "center",
				cellClassName: 'center',
				renderCell: render.information
			},
			{
				field: "presale_price",
				headerName: "Presale Ξ",
				type: "number",
				minWidth: 120,
				headerAlign: 'center',
				cellClassName: 'center',
				valueFormatter: render.mintPrice,
			},
			{
				field: "max_per_transaction",
				headerName: "Per Transaction",
				type: "number",
				minWidth: 60,
				renderCell: render.general,
				headerAlign: "center",
				cellClassName: 'center',
			},
			{
				field: "max_per_wallet",
				headerName: "Per Wallet",
				type: "number",
				minWidth: 60,
				renderCell: render.general,
				headerAlign: "center",
				cellClassName: 'center',
			},
			// {
			// 	field: "ts_presale_start",
			// 	headerName: "Presale Start",
			// 	type: "datetime",
			// 	minWidth: 300,
			// 	renderCell: render.datetime,
			// },
			{
				field: "wl_source",
				headerName: "Source",
				type: "text",
				cellClassName: "center",
				renderCell: render.text,
			},
			{
				field: "ts_presale_start",
				headerName: "Presale Starts In...",
				type: "datetime",
				cellClassName: "center",
				minWidth: 180,
				renderCell: render.countdown,
			},
			{
				field: "max_supply",
				headerName: "Supply",
				type: "number",
				renderCell: render.general,
				headerAlign: "center",
				cellClassName: "center",
				minWidth: 80,
			},
			{
				field: "website_url",
				headerName: "Links",
				headerClassName: 'center',
				cellClassName: 'center',
				renderCell: render.urls,
				width: 240,
				sortable: false
			},
			{
				field: "id",
				headerName: "Actions",
				type: "actions",
				minWidth: 180,
				renderCell: (params) => {
					return render.actions({params, set_id: "active-projects"})
				}
			}
		]
		return (
			<>
				<ProjectTableActions/>
				<Grid
					item
				>
					<DataGrid
						columns={columns}
						rows={projects}
						density={"comfortable"}
						autoHeight={true}
						sx={{
							'& .center':{
								justifyContent: "center"
							}
						}}
					/>
				</Grid>
			</>
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