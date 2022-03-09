import {IconButton, Tooltip} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import dayjs from "dayjs";

const generateGcalDateTimeStr = ({date}) => {
	const loggingTag = `[generateGcalDateTimeStr]`;
	let str = '';
	try{
		let dateObject = dayjs(date);
		str = `${dateObject.format("YYYYMMDDTHHmmss")}Z`
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
	}
	return str;
}

const generateGcalInviteLink = ({event:eventInfo} = {}) => {
	const loggingTag = `[generateGcalInviteLink]`;
	const {name = '', details = '', start = 0, end = 0} = eventInfo;
	let url = false;
	
	let dateStr = '';
	
	try{
		const preEncodingDateStr = `${generateGcalDateTimeStr({date:start})}/${generateGcalDateTimeStr({date:end})}`;
		console.info(`${loggingTag} pre encoding uri string: "${preEncodingDateStr}"`);
		dateStr = `&dates=${encodeURIComponent(preEncodingDateStr)}`;
	} catch(e){
		console.error(`${loggingTag} unable to build date str`);
	}
	console.info(`${loggingTag} details: ${details}`);
	try{
		url = `https://calendar.google.com/calendar/render?action=TEMPLATE${name.length > 0 ? `&text=${encodeURIComponent(name)}` : ''}${details.length > 0 ? `&details=${encodeURIComponent(details)}` : ''}${dateStr.length > 0 ? dateStr : ''}`
		// https://www.google.com/calendar/render?action=TEMPLATE&dates=20220324T001900Z%2F20220325T001900Z
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
	}
	return url;
}

const AddToCalendarBtn = (props) => {
	const componentLoggingTag = `[AddToCalendarBtn]`;
	// console.info(`${componentLoggingTag} `);
	const {event} = props;
	
	const eventURL = generateGcalInviteLink({
		event
	});
	console.info(`${componentLoggingTag} gcal url: "${eventURL}"`);
	return(
		<Tooltip title={"Add to Calendar"}>
			<a href={eventURL} target={"_blank"}>
				<IconButton
				>
					<EventIcon/>
				</IconButton>
			</a>
		</Tooltip>
	)
}



export default AddToCalendarBtn;