import DashboardSideNav from "./DashboardSideNav";
import {Typography, Box} from "@mui/material";
import {useSyndicateAuthenticationContext} from "./SyndicateAuthenticationProvider";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Layout = (props) => {
	
	const router = useRouter();
	const {children:content} = props;
	const {isAgent} = useSyndicateAuthenticationContext();
	
	useEffect(()=>{
		if(!isAgent){
			router.push("/signin");
		}
	}, []);
	
	return (
		<>
			<DashboardSideNav/>
			<Box
				sx={{
					position: "fixed",
					top: "0px",
					right: "0px",
					bottom: "0px",
					left: "250px",
					overflowY: "auto"
				}}
			>
				{content}
			</Box>
		</>
	)
}

export default Layout;