import {IconButton, Tooltip} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const InfoAvailableBtn = (props) => {
	const {url = ''} = props;
	const isValidURL = typeof url  === "string" && url.length > 0;
	const openSite = () => {
		if(isValidURL){
			window.open(url);
		}
	}
	return(
		<Tooltip title={isValidURL ? "Info is available - check how to complete this step" : "To Be Confirmed"}>
			<IconButton
				onClick={openSite}
				sx={{
					color: isValidURL ? "#000000" : "rgba(0, 0, 0, 0.34)"
				}}
			>
				<InfoIcon/>
			</IconButton>
		</Tooltip>
	)
}

export default InfoAvailableBtn;