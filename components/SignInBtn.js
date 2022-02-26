import { Button } from "@mui/material";
import { useTheme } from "@mui/material";
import {useMoralis} from "react-moralis";

const SignInBtn = (props) => {
	const componentLoggingTag = `[SignInBtn]`;
	
	const theme = useTheme();
	const { authenticate } = useMoralis();
	
	const signUserIn = (e) => {
		const loggingTag = `${componentLoggingTag}[signUserIn]`;
		try{
			authenticate({
				signingMessage: `Welcome, Agent`,
				onComplete: () => {
					console.info(`${loggingTag} Authentication complete! Should fetch the user's assets now...`);
				}
			})
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
			onClick={signUserIn}
		>
			Sign In
		</Button>
	)
}

export default SignInBtn;