import {useRouter} from "next/router";
import {Typography} from "@mui/material";
import ProjectForm from "../../../components/ProjectForm";

const ProjectEditView = (props) => {
	const componentLoggingTag = `[ProjectEditView]`;
	const router = useRouter();
	const { id } = router.query;
	return (
		<Typography>Coming soon...</Typography>
	)
}

export default ProjectEditView;