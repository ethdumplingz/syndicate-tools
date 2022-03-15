import {IconButton, Tooltip} from "@mui/material";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";

const SubmitWalletBtn = (props) => {
	const {url = ''} = props;
	const isValidURL = typeof url  === "string" && url.length > 0;
	const openSite = () => {
		if(isValidURL){
			window.open(url);
		}
	}
	return(
		<Tooltip title={isValidURL ? "Submit Wallet" : "To Be Confirmed"}>
			<IconButton
				onClick={openSite}
				sx={{
					color: isValidURL ? "#000000" : "rgba(0, 0, 0, 0.54)"
				}}
			>
				<WalletIcon/>
			</IconButton>
		</Tooltip>
	)
}

export default SubmitWalletBtn;