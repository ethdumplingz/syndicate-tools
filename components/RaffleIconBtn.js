import {IconButton, SvgIcon, Tooltip} from "@mui/material";
import RaffleIcon from "@mui/icons-material/ConfirmationNumber";

const RaffleIconBtn = (props) => {
	const {onClick, title = "Raffle"} = props;
	return(
		<Tooltip title={title}>
			<IconButton
				onClick={typeof onClick === "function" ? onClick : ()=>{}}
			>
				<SvgIcon>
					<RaffleIcon/>
				</SvgIcon>
			</IconButton>
		</Tooltip>
	)
}

export default RaffleIconBtn;