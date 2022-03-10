import {Grid, Button} from "@mui/material";
import AddProjectIcon from "@mui/icons-material/Add";
import Link from "next/link";

const ProjectTableActions = (props) => {
	const componentLoggingTag = `[ProjectTableActions]`;
	return(
		<Grid
			item
			container
			sx={{
				mt: 1,
				mb: 1
			}}
		>
			<Grid item>
				<Link href={`/projects/add`}>
					<Button
						variant={"contained"}
						sx={{
							pt:1,
							pb:1,
							borderRadius: "0px"
						}}
					>
						<AddProjectIcon size={"sm"} sx={{mr:1}}/> Add new project
					</Button>
				</Link>
			</Grid>
		</Grid>
	)
}

export default ProjectTableActions;