import RaffleBubble from "./RaffleBubble";
import WinnerIcon from "@mui/icons-material/WorkspacePremiumOutlined";

const RaffleWinnersBubble = (props) => {
	const {num = 0} = props;
	return(
		<RaffleBubble
			icon={<WinnerIcon/>}
			content={`${num} Winner${num > 1 ? 's': ''}`}
		/>
	)
}

export default RaffleWinnersBubble;