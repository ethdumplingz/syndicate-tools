import {Grid, Typography, Button, useTheme} from "@mui/material";
import axios from "axios";
import useSWR from "swr";
import {DataGrid} from "@mui/x-data-grid";
import {useState, useEffect} from "react";
import dayjs from "dayjs";
import {useRouter} from "next/router";
import {render} from "../utils/TableRenderHelper";
import ProjectTableActions from "./ProjectTableActions";
import {useSyndicateAuthenticationContext} from "./SyndicateAuthenticationProvider";
import CustomGridToolBar from "./CustomGridToolBar";

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

function escapeRegExp(value) {
	return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const ProjectsTable = (props) => {
	const componentLoggingTag = `[ProjectsTable]`;
	const {address, isAdmin} = useSyndicateAuthenticationContext();
	const theme = useTheme();
	const [pageSize, setPageSize] = useState(15);
	const [searchText, setSearchText] = useState("");
	const [rows, setRows] = useState([])
	
	const {data:resp, error, isValidating} = useSWR(`/projects/get?user=${address}`, fetchTableData, {revalidateIfStale: false});
	
	console.info(`${componentLoggingTag} data received!`, resp);
	
	let projects = [];
	if(resp){
		projects = resp.data.projects;
	}
	console.info(`${componentLoggingTag} projects received`, projects);
	useEffect(() => {
		if(typeof resp !== "undefined" && resp.data.projects){
			setRows(projects);
		}
		
	}, [resp]);
	
	const requestSearch = (searchValue) => {
		const loggingTag = `[requestSearch]`;
		setSearchText(searchValue);
		if(searchValue.length > 0){
			const searchRegex = new RegExp(escapeRegExp(searchValue.toLowerCase()), 'i');
			const filteredRows = rows.filter((row) => {
				console.info(`${loggingTag}`, rows);
				return searchRegex.test(row.title.toLowerCase().toString());//only going to search against the title
			});
			setRows(filteredRows);
		} else {
			setRows(projects)
		}
	};
		
		const columns = [
			{
				field:"from_syndicate",
				headerName: "Syndicate Affiliate",
				type:'boolean',
				filterable: true,
				hide: true
			},
			{
				field: "title",
				headerName: "Project",
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
				headerAlign: "center",
				minWidth: 120,
				cellClassName: 'center',
				valueFormatter: render.mintPrice
			},
			{
				field: "ts_presale_start",
				headerName: "Presale",
				type: "dateTime",
				renderHeader: render.header.date,
				valueGetter:(params) => {
					// console.info(`valueGetter datetime`, params);
					const {value, row} = params;
					let finalDate = value;
					
					if(new Date(value).getTime() === 0){
						console.info(`valueGetter datetime: ${value}, row:`, row);
						finalDate = 2147483647000;//short term hack to prevent projects where the presale is unknown, we display that last 4.22.22
					}
					console.info(`valueGetter datetime: ${finalDate}`);
					return new Date(finalDate);
				},
				renderCell: render.countdown,
				headerAlign: "center",
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
			{
				field: "website_url",
				headerName: "Links",
				headerClassName: 'center',
				align: "left",
				renderCell: render.urls,
				width: 200,
				sortable: false
			},
			{
				field: "score",
				headerName: "Score",
				headerAlign: "left",
				minWidth: 100,
				type: "number",
				renderCell: render.score
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
						rowsPerPageOptions={[5,10,15,25,50,100]}
						pageSize={pageSize}
						disableSelectionOnClick
						onPageSizeChange={(newPage) => setPageSize(newPage)}
						columns={columns}
						rows={rows}
						loading={isValidating}
						getRowClassName={render.row}
						density={"comfortable"}
						autoHeight={true}
						sx={{
							'& .center':{
								justifyContent: "center"
							}
						}}
						components={{
							Toolbar: CustomGridToolBar
						}}
						componentsProps={{
							toolbar:{
								value: searchText,
								onChange: (e) => requestSearch(e.target.value),
								clearSearch: () => requestSearch("")
							}
						}}
					/>
				</Grid>
			</>
		)
}
export default ProjectsTable;