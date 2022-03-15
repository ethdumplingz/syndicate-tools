import {IconButton, Tooltip} from "@mui/material";
import RoleIcon from "@mui/icons-material/PersonAdd";

const GetRoleBtn = (props) => {
	const {url = ''} = props;
	const isValidURL = typeof url  === "string" && url.length > 0;
	const openSite = () => {
		if(isValidURL){
			window.open(url);
		}
	}
	return(
		<Tooltip title={isValidURL ? "Get Role" : "To Be Confirmed"}>
			<IconButton
				onClick={openSite}
				sx={{
					color: isValidURL ? "#000000" : "rgba(0, 0, 0, 0.54)"
				}}
			>
				<RoleIcon/>
			</IconButton>
		</Tooltip>
	)
}

export default GetRoleBtn;