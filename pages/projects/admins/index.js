import {Grid, Typography} from '@mui/material';
import BulkAddProjectsBtn from "../../../components/BulkAddProjectsBtn";
import AdminProjectsGrid from "../../../components/AdminProjectsGrid";
const Admins = (props) => {
	return(
		<Grid
			container
			spacing={3}
			sx={{
				p:4
			}}
		>
			<Grid item>
				<Typography
					variant={"h1"}
					sx={{
						fontSize:"1.6rem"
					}}
				>Admins</Typography>
			</Grid>
			<Grid
				item
				container
				flexDirection={"column"}
				rowSpacing={3}
			>
				<Grid item>
					<BulkAddProjectsBtn/>
				</Grid>
				<AdminProjectsGrid/>
			</Grid>
		</Grid>
	)
}

export default Admins;