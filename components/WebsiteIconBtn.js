import {IconButton, SvgIcon, Tooltip} from "@mui/material";
import WebsiteIcon from "@mui/icons-material/Public";

const WebsiteIconBtn = (props) => {
	const {onClick} = props;
	return(
		<Tooltip title={"Website"}>
			<IconButton
				onClick={typeof onClick === "function" ? onClick : ()=>{}}
			>
				<SvgIcon>
					<WebsiteIcon/>
				</SvgIcon>
			</IconButton>
		</Tooltip>
	)
}

export default WebsiteIconBtn;