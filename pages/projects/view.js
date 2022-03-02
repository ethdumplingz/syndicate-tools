import {Grid, Typography} from "@mui/material";
import ProjectsTable from "../../components/ProjectsTable";

const DatabaseView = (props) => {
	
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
				View Projects
				</Typography>
			</Grid>
			<ProjectsTable/>
		</Grid>
	)
}

export default DatabaseView;