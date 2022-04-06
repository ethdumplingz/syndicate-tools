import {Grid, Typography} from '@mui/material';
import BulkAddProjectsBtn from "../../../components/BulkAddProjectsBtn";
import AdminProjectsGrid from "../../../components/AdminProjectsGrid";
const Admins = (props) => {
	return(
		<Grid
			container
			spacing={2}
			sx={{
				p:4
			}}
		>
			<Grid item>
				<Typography sx={{fontSize: "1.5rem"}}>Actions:</Typography>
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