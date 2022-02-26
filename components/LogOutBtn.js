import { Button } from "@mui/material";
import { useTheme } from "@mui/material";
import {useMoralis} from "react-moralis";

const LogOutBtn = (props) => {
	const componentLoggingTag = `[LogOutBtn]`;
	
	const theme = useTheme();
	const { logout } = useMoralis();
	
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
			sx={{
				backgroundColor: theme.palette.primary.main,
				padding: "20px 30px"
			}}
			onClick={logUserOut}
		>
			Sign In
		</Button>
	)
}

export default LogOutBtn;