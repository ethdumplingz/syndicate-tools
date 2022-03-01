import {Grid} from "@mui/material";

const ProjectRow = (props) => {
	const componentLoggingTag = `[ProjectRow]`;
	const {title} = props;
	return(
		<Grid
			item
			container
		>
			<Grid
				item
			>
				{title}
			</Grid>
		</Grid>
	)
}

export default ProjectRow;