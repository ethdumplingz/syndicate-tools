import {Grid, Button} from "@mui/material";
import AddProjectIcon from "@mui/icons-material/Add";
import Link from "next/link";
import BulkAddProjectsBtn from "./BulkAddProjectsBtn";
import {useSyndicateAuthenticationContext} from "./SyndicateAuthenticationProvider";

const ProjectTableActions = (props) => {
	const componentLoggingTag = `[ProjectTableActions]`;
	const {isAdmin} = useSyndicateAuthenticationContext();
	return(
		<Grid
			item
			container
			sx={{
				mt: 1,
				mb: 1
			}}
			columnSpacing={2}
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
			{isAdmin ? <Grid item>
				<BulkAddProjectsBtn/>
			</Grid> : <></>
			}
			
		</Grid>
	)
}

export default ProjectTableActions;