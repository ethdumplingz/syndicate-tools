import {Tooltip} from "@mui/material";
import InfoIcon from "@mui/icons-material/HelpOutlineOutlined";
import ErrorIcon from "@mui/icons-material/ErrorOutlineOutlined";
const ProjectStatusTooltip = (props) => {
	const componentLoggingTag = `[ProjectStatusTooltip]`;
	const {status, score} = props;
	const content = status === "ok" ? `This project has a community score of ${score}.  Agents are not confident.` :
		status === "danger" ? `WARNING: This project has a community score of ${score}! Agents do NOT recommend it! Proceed at your own risk` :
		`Error: unrecognized status: "${status}"`;
	return (
		<Tooltip title={content} placement={"right"}>
			{
				status === "danger" ? <ErrorIcon fontSize={"small"} color={"error"}/> :
				<InfoIcon fontSize={"small"}/>
			}
		</Tooltip>
	)
}

export default ProjectStatusTooltip;