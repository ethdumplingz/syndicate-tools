import DashboardSideNav from "./DashboardSideNav";
import {Typography, Box} from "@mui/material";
import {useSyndicateAuthenticationContext} from "./SyndicateAuthenticationProvider";
import { useEffect } from "react";
import { useRouter } from "next/router";
import NavigateBackBtn from "../components/NavigateBackBtn";
import IsLoadingView from "./IsLoadingView";

const Layout = (props) => {
	const componentLoggingTag = `[Layout]`;
	const router = useRouter();
	const {children:content} = props;
	const {isAgent, isPending} = useSyndicateAuthenticationContext();
	
	useEffect(()=>{
		console.info(`${componentLoggingTag}[useEffect] isAgent: ${isAgent} isPending:${isPending}`);
		// if(!isPending && !isAgent){
		// 	console.info(`${componentLoggingTag} redirecting user to /signin...`)
		// 	router.push("/signin");
		// }
	}, [isAgent, isPending]);
	
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
				{!isPending ? content : <IsLoadingView/>}
			</Box>
		</>
	)
}

export default Layout;