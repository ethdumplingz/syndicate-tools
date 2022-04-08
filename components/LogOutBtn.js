import { Button } from "@mui/material";
import { useTheme } from "@mui/material";
import {useMoralis} from "react-moralis";

const LogOutBtn = (props) => {
	const componentLoggingTag = `[LogOutBtn]`;
	
	const theme = useTheme();
	const { logout, isAuthenticating, isAuthenticated } = useMoralis();
	
	const logUserOut = (e) => {
		const loggingTag = `${componentLoggingTag}[logUserOut]`;
		try{
			console.info(`${loggingTag} Logging the user out...`)
			logout();
		} catch(e){
			console.error(`${loggingTag} Error:`, e);
		}
	}
	
	return (
		<Button
			variant={"contained"}
			disabled={isAuthenticating || !isAuthenticated}
			sx={{
				backgroundColor: theme.palette.primary.main,
				color: "#FFFFFF",
				width: "100%",
				borderRadius: "0px",
				pt: 1,
				pb: 1,
				"&:hover":{
					backgroundColor: theme.palette.primary.light
				}
			}}
			onClick={logUserOut}
		>
			Log Out
		</Button>
	)
}

export default LogOutBtn;