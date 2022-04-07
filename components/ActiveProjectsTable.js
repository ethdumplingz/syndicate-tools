import {Grid, Typography, Button, useTheme} from "@mui/material";
import axios from "axios";
import useSWR from "swr";
import {DataGrid} from "@mui/x-data-grid";
import dayjs from "dayjs";
import {useSyndicateAuthenticationContext} from "./SyndicateAuthenticationProvider";
import {project} from "../utils/strings";
import {render} from "../utils/TableRenderHelper";
import ProjectTableActions from "./ProjectTableActions";
import {useCallback, useState} from "react";

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
	const theme = useTheme();
	const {address, isAdmin} = useSyndicateAuthenticationContext();
	const [pageSize, setPageSize] = useState(15);
	
	const {data:resp, error, isValidating} = useSWR(`/users/${address}/projects/active`, fetchTableData);
	
	console.info(`${componentLoggingTag} projects`, render);
	
	
	console.info(`${componentLoggingTag} data received!`, resp);
	let projects = [];
	if(resp){
		projects = resp.data.projects;
	}
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
			// field: "raffle_won",
			field: "num_allowlisted",
			headerName: "WL",
			headerAlign: "center",
			cellClassName: 'center',
			type: "number",
			renderCell: render.checkbox
		},
		{
			field: "num_role_assigned",
			headerName: "Role",
			headerAlign: "center",
			cellClassName: 'center',
			type: "number",
			renderCell: render.checkbox
		},
		{
			field: "num_wallet_added",
			headerName: "Wallet",
			headerAlign: 'center',
			cellClassName: 'center',
			type: "number",
			renderCell: render.checkbox
		},
		{
			field: "num_mints",
			headerName: "Mint",
			headerAlign: "center",
			cellClassName: 'center',
			type: "number",
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
			headerName: "Presale",
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
			editable: true,
			type: "text",
			cellClassName: "center",
			valueGetter: (params) => {
				const {value} = params;
				
				return value === null ? "N/A" : value;
			},
			renderCell: render.text,
		},
		{
			field: "ts_presale_start",
			headerName: "Presale",
			type: "datetime",
			cellClassName: "center",
			minWidth: 180,
			renderHeader: render.header.date,
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
			width: 200,
			sortable: false
		},
		{
			field: "vote",
			headerName: "Score",
			headerAlign: "left",
			minWidth: 100,
			type: "actions",
			getActions: render.score
		},
		{
			field: "is_following",
			headerName: "Following",
			minWidth: 0,
			headerAlign: "center",
			type: "actions",
			getActions: render.following
		},
		{
			field: "id",
			headerName: "Actions",
			headerAlign: "left",
			align: 'left',
			type: "actions",
			minWidth: 200,
			getActions: (params) => {
				return render.actions({params, set_id: "active-projects", is_admin:isAdmin})
			}
		}
	];
	
	const updateProjectSource = useCallback(async({project_id = "", value = ""})=>{
		const loggingTag = `${componentLoggingTag}[updateProjectSource]`;
		try{
			const result = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URI}/users/projects/actions/update`, {
				user: address,
				project_id,
				action: "wl_source",
				value
			});
			console.info(`${loggingTag} result:`, result);
			return result;
		} catch(e){
			console.error(`${loggingTag} Error:`, e);
			throw e;
		}
	}, [address]);
	
	const processRowUpdate = useCallback(async (newRow) => {
		const loggingTag = `${componentLoggingTag}[processRowUpdate]`;
		try{
			console.info(`${loggingTag} new row:`, newRow);
			const {id, wl_source} = newRow;
			const updateResult = await updateProjectSource({
				project_id: id,
				value: wl_source
			});
			
			return newRow;
		} catch(e){
			console.error(`${loggingTag} Error:`, e);
			throw e;
		}
	}, []);
	
	return (
		<>
			<ProjectTableActions/>
			<Grid
				item
				sx={{
					'& .Project-isActive-false':{
						display: !isAdmin ? "none" : "flex",
						backgroundColor: isAdmin ? theme.palette.light[10] : "transparent"
					},
					'& .Project-Status-DANGER' : {
						backgroundColor: theme.palette.projects.danger
					},
					'& .Project-Status-OK' : {
						backgroundColor: theme.palette.projects.ok
					}
				}}
			>
				<DataGrid
					disableSelectionOnClick
					columns={columns}
					rows={projects}
					getRowClassName={render.row}
					rowsPerPageOptions={[5,10,15,25,50,100]}
					density={"comfortable"}
					autoHeight={true}
					loading={isValidating}
					pageSize={pageSize}
					onPageSizeChange={(newPage) => setPageSize(newPage)}
					processRowUpdate={processRowUpdate}
					experimentalFeatures={{
						newEditingApi: true
					}}
					sx={{
						'& .center':{
							justifyContent: "center"
						}
					}}
				/>
			</Grid>
		</>
	)
	
}
export default ActiveProjectsTable;