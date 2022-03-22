import {IconButton, Tooltip} from "@mui/material";
import {useRouter} from "next/router";
import BackIcon from "@mui/icons-material/ArrowBack";
import {useState, useEffect} from "react";

const NavigateBackBtn = (props) => {
	const componentLoggingTag = `[NavigateBackBtn]`;
	const [display, setDisplay] = useState(false);
	const router = useRouter();
	
	useEffect(()=>{
		console.info(`${componentLoggingTag} #1: ${typeof document},  referrer ${document.referrer}, origin:${window.location.origin}, check: ${document.referrer.startsWith(window.location.origin)}`);
		
		if(
			typeof document === "object" && 
			typeof document.referrer === "string" &&
			document.referrer.startsWith(window.location.origin)
		){
			console.info(`${componentLoggingTag} referrer ${document.referrer}, origin:${window.location.origin}`);
			console.info(`${componentLoggingTag} referrer`, document.referrer);
			setDisplay(true);
		}
		console.info(`${componentLoggingTag} display? ${display}`)
	}, []);
	
	const navigateBack = () => {
		const loggingTag = `[navigateBack]`;
		try{
			router.back();
		} catch(e){
			console.error(`${loggingTag} error:`, e);
		}
	}
	
	return(
		<Tooltip title={"Go Back"}>
			<IconButton
				onClick={navigateBack}
				sx={{
					display: display ? "flex" : "none"
				}}
			>
				<BackIcon/>
			</IconButton>
		</Tooltip>
	)
}

export default NavigateBackBtn;