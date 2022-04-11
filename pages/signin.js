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
			router.push(`/projects/view`);
			// router.back();
		}
	}, [isAgent]);
	return (
		<Grid
			container
			direction={"column"}
			alignItems={"center"}
			justifyContent={"center"}
			rowSpacing={5}
			sx={{
				pt: 5,
				pl: 5,
				textAlign: "center",
				height: "100%"
			}}
		>
			<Grid
				item
			>
				<Typography
					sx={{
						fontSize: "1.5rem",
						mb: 2
					}}
				>
					WARNING: This area is off limits to <b><i>outsiders</i></b>.
				</Typography>
				<Typography
					sx={{
						fontSize: "1.5rem"
					}}
				>
					Click below to prove you are an <b>agent of the Syndicate893</b>.
				</Typography>
			</Grid>
			<Grid item>
				<SignInBtn/>
			</Grid>
		</Grid>
	)
}

export default SignIn;