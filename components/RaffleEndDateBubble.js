import RaffleBubble from "./RaffleBubble";
import EndDateIcon from "@mui/icons-material/HourglassBottomSharp";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(LocalizedFormat);

const RaffleEndDateBubble = (props) => {
	const componentLoggingTag = `[RaffleEndDateBubble]`;
	const {date} = props;
	return (
		<RaffleBubble
			icon={<EndDateIcon/>}
			content={`Ends: ${dayjs(date).format("L LT")}`}
		/>
	)
}

export default RaffleEndDateBubble;