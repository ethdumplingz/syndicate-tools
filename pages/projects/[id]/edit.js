import {useRouter} from "next/router";
import {Typography, Grid, Container} from "@mui/material";
import ProjectForm from "../../../components/ProjectForm";
import useSWR from "swr";
import {fetchProjectInfo} from "../../../utils/project";
import IsLoadingView from "../../../components/IsLoadingView";

const EditViewContainer = (props) => {
	const {children} = props;
	return (
		<Container maxWidth={"md"}>
			<Grid container>
				{children}
			</Grid>
		</Container>
	)
}

const ProjectEditView = (props) => {
	const componentLoggingTag = `[ProjectEditView]`;
	const router = useRouter();
	const { id } = router.query;
	console.info(`${componentLoggingTag} editing project: ${id}`);
	const {data, error, isValidating} = useSWR(`/projects/get/${id}`, fetchProjectInfo,{revalidateIfStale: false, revalidateOnFocus: false});
	if(isValidating){
		return(
			<IsLoadingView/>
		)
	} else if (error){
		return(
			<EditViewContainer>
				<Typography>An Error Occurred. Please check your internet and try again.</Typography>
			</EditViewContainer>
		)
	} else {
		return (
			<EditViewContainer>
				<ProjectForm
					id={id}
					{...data.data.project[0]}
				/>
			</EditViewContainer>
		)
	}
	
}

export default ProjectEditView;



