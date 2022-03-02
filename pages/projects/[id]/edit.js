import {useRouter} from "next/router";
import {Typography, Grid, Container} from "@mui/material";
import ProjectForm from "../../../components/ProjectForm";

const ProjectEditView = (props) => {
	const componentLoggingTag = `[ProjectEditView]`;
	const router = useRouter();
	const { id } = router.query;
	console.info(`${componentLoggingTag} editing project: ${id}`);
	return (
		<Container maxWidth={"md"}>
			<Grid container>
				<ProjectForm
					id={id}
				/>
			</Grid>
		</Container>
	)
}

export default ProjectEditView;