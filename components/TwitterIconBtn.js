import {IconButton, SvgIcon} from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";

const TwitterIconBtn = (props) => {
	const {onClick} = props;
	return(
		<IconButton
			onClick={typeof onClick === "function" ? onClick : ()=>{}}
		>
			<SvgIcon>
				<TwitterIcon/>
			</SvgIcon>
		</IconButton>
	)
}

export default TwitterIconBtn;