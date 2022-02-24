import DashboardSideNav from "./DashboardSideNav";
import {Typography, Box} from "@mui/material";

const Layout = (props) => {
	const {children:content} = props;
	return (
		<>
			<DashboardSideNav/>
			<Box
				sx={{
					position: "fixed",
					top: "0px",
					right: "0px",
					bottom: "0px",
					left: "250px"
				}}
			>
				{content}
			</Box>
		</>
	)
}

export default Layout;