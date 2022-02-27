import { Typography, Grid } from "@mui/material";
import SignInBtn from "../components/SignInBtn";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import {useSyndicateAuthenticationContext} from "../components/SyndicateAuthenticationProvider";
import { useEffect } from "react";

const SignIn = (props) => {
	const router = useRouter();
	const { isAgent } = useSyndicateAuthenticationContext();
	
	useEffect(()=>{
		if(isAgent){
			router.back();
		}
	}, [isAgent]);
	return (
		<Grid
			container
			direction={"column"}
			alignItems={"stretch"}
		>
			<Grid item>
				<Typography>Sign in view</Typography>
			</Grid>
			<Grid item>
				<SignInBtn/>
			</Grid>
		</Grid>
	)
}

export default SignIn;