import {Grid, Typography} from "@mui/material";
import ActiveProjectsTable from "../../components/ActiveProjectsTable";

const ActiveProjectsView = (props) => {
	
	return(
		<Grid
			container
			direction={"column"}
			alignItems={"stretch"}
			spacing={3}
			sx={{
				padding: "24px 30px"
			}}
		>
			<Grid
				item
			>
				<Typography
					variant={"h1"}
					sx={{
						fontSize:"1.6rem"
					}}
				>
					Active Projects
				</Typography>
			</Grid>
			<ActiveProjectsTable/>
		</Grid>
	)
}

export default ActiveProjectsView;