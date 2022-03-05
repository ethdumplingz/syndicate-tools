import {IconButton, SvgIcon} from "@mui/material";
import RaffleIcon from "@mui/icons-material/ConfirmationNumber";

const RaffleIconBtn = (props) => {
	const {onClick} = props;
	return(
		<IconButton
			onClick={typeof onClick === "function" ? onClick : ()=>{}}
		>
			<SvgIcon>
				<RaffleIcon/>
			</SvgIcon>
		</IconButton>
	)
}

export default RaffleIconBtn;