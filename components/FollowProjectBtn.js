import {IconButton, Tooltip} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const FollowProjectBtn = (props) => {
	const componentLoggingTag = `[FollowProjectBtn]`
	const {watching, onClick = ()=>{}} = props;
	console.info(`${componentLoggingTag} watching:`, watching);
	return(
		<Tooltip title={watching ? "Unfollow" : "Follow"}>
			<IconButton
				onClick={onClick}
			>
				<VisibilityIcon
					sx={{
						color: watching ? "black" : "inherit"
					}}
				/>
			</IconButton>
		</Tooltip>
	)
}

export default FollowProjectBtn;