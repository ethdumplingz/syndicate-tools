import {IconButton, Tooltip} from "@mui/material";
import CommentIcon from "@mui/icons-material/comment";

const ProjectCommentBtn = (props) => {
	return(
		<Tooltip title={"Add a Comment"}>
			<IconButton
			
			>
				<CommentIcon/>
			</IconButton>
		</Tooltip>
	)
}

export default ProjectCommentBtn;