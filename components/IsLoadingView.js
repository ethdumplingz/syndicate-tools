import {Box, CircularProgress, Grid} from "@mui/material";
const IsLoadingView = (props) => {
	const componentLoggingTag = `[IsLoadingView]`;
	return (
		<Grid
		container
		alignItems={"center"}
		justifyContent={"center"}
		sx={{
			height: "100%",
			width: "100%"
		}}
		>
			<Grid item>
				<CircularProgress/>
			</Grid>
		</Grid>
	)
}

export default IsLoadingView;