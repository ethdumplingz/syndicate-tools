import { Container } from "@mui/material";
import ProjectForm from "../../components/ProjectForm";

const AddView = (props) => {
	const componentLoggingTag = `[AddView]`;
	return(
		<>
			<Container maxWidth={"md"}>
				<ProjectForm/>
			</Container>
		</>
	)
}

export default AddView;