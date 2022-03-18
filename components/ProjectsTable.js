import {Grid, Typography, Button, useTheme} from "@mui/material";
import axios from "axios";
import useSWR from "swr";
import {DataGrid} from "@mui/x-data-grid";
import dayjs from "dayjs";
import {useRouter} from "next/router";
import {render} from "../utils/TableRenderHelper";
import ProjectTableActions from "./ProjectTableActions";
import {useSyndicateAuthenticationContext} from "./SyndicateAuthenticationProvider";


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

const ProjectsTable = (props) => {
	const componentLoggingTag = `[ProjectsTable]`;
	const {address, isAdmin} = useSyndicateAuthenticationContext();
	const theme = useTheme();
	
	const {data:resp, error, isValidating} = useSWR(`/projects/get?user=${address}`, fetchTableData, {revalidateIfStale: false});
	
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
				field: "title",
				headerName: "Title",
				renderCell: render.title,
				minWidth: 200
			},
			// {
			// 	field: "is_discord_open",
			// 	headerName: "Public Discord?",
			// 	type: "boolean",
			// 	width: 140
			// },
			{
				field: "presale_price",
				headerName: "Presale",
				type: "number",
				minWidth: 120,
				headerAlign: "center",
				cellClassName: 'center',
				valueFormatter: render.mintPrice,
			},
			{
				field: "public_price",
				headerName: "Public",
				minWidth: 120,
				cellClassName: 'center',
				valueFormatter: render.mintPrice
			},
			{
				field: "ts_presale_start",
				headerName: "Presale",
				type: "datetime",
				renderHeader: render.header.date,
				renderCell: render.countdown,
				cellClassName: "center",
				minWidth: 180,
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
			// {
			// 	field: "ts_presale_end",
			// 	headerName: "Presale End",
			// 	type: "datetime",
			// 	renderCell: render.datetime,
			// 	minWidth: 160,
			// },
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
				type: "actions",
				minWidth: 140,
				getActions: (params) => {
					return render.actions({params, is_admin: isAdmin})
				}
			}
		];

		return (
			<>
				<ProjectTableActions/>
				<Grid
					item
					sx={{
						'& .Project-isActive-false': {
							display: !isAdmin ? "none" : "flex",
							backgroundColor: isAdmin ? theme.palette.light[100] : "transparent"
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
						rowsPerPageOptions={[]}
						columns={columns}
						rows={projects}
						getRowClassName={render.row}
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
export default ProjectsTable;