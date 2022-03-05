import {IconButton, SvgIcon} from "@mui/material";
import WebsiteIcon from "@mui/icons-material/Public";

const WebsiteIconBtn = (props) => {
	const {onClick} = props;
	return(
		<IconButton
			onClick={typeof onClick === "function" ? onClick : ()=>{}}
		>
			<SvgIcon>
				<WebsiteIcon/>
			</SvgIcon>
		</IconButton>
	)
}

export default WebsiteIconBtn;