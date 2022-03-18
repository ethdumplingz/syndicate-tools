import {Grid, Typography} from '@mui/material';
import BulkAddProjectsBtn from "../../../components/BulkAddProjectsBtn";
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
			<Grid item container>
				<Grid item>
					<BulkAddProjectsBtn/>
				</Grid>
			</Grid>
		</Grid>
	)
}

export default Admins;