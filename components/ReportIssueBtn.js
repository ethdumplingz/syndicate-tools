import {IconButton, Tooltip} from "@mui/material";
import SupportIcon from "@mui/icons-material/Support";
const ReportIssueBtn = (props) => {
	return(
		<Tooltip title={"Report an Issue"}>
			<a href={"https://discord.com/channels/923503878857691215/938709154099523645/938709909019713546"} target={"_blank"}>
				<IconButton>
					<SupportIcon/>
				</IconButton>
			</a>
		</Tooltip>
	)
}

export default ReportIssueBtn;