import {Grid} from "@mui/material";
import {useState, useEffect} from "react";
import FollowProjectBtn from "./FollowProjectBtn";
import UserProjectStatus from "./UserProjectStatus";
import useSWR from "swr";
import axios from "axios";
import NavigateBackBtn from "./NavigateBackBtn";

const ProjectActions = (props) => {
	const componentLoggingTag = `[ProjectActions]`;
	const {id:projectID} = props;
	const [isWatching, setWatching] = useState(false);
	
	return (
		<Grid
			container
			columnSpacing={4}
			justifyContent={"space-between"}
			alignItems={"center"}
		>
			<Grid
				item>
				<NavigateBackBtn/>
			</Grid>
			{/*<Grid*/}
			{/*	item*/}
			{/*	sx={{*/}
			{/*		display: isWatching ? "block" : "none"*/}
			{/*	}}*/}
			{/*>*/}
			{/*	<UserProjectStatus*/}
			{/*		id={projectID}*/}
			{/*	/>*/}
			{/*</Grid>*/}
			<Grid
				item
				sx={{
					pt:1,
					pb:1
				}}
			>
				<FollowProjectBtn
					id={projectID}
					onClick={setWatching}
				/>
			</Grid>
		</Grid>
	)
}

export default ProjectActions;