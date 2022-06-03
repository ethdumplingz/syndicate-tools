import {Grid, Typography} from "@mui/material";
import RaffleViewTitle from "../../../components/RaffleViewTitle";
import RaffleCreationForm from "../../../components/RaffleCreationForm";

const createView = (props) => {
	return(
		<Grid
			container
			spacing={6}
			flexWrap={"nowrap"}
			direction={"column"}
			sx={{
				justifyContent: "flex-start",
				pl: 8,
				pt: 8,
				pr: 8
			}}
		>
			<Grid item>
				<RaffleViewTitle>Create a Raffle</RaffleViewTitle>
			</Grid>
			<Grid item>
				<RaffleCreationForm/>
			</Grid>
		</Grid>
	)
}

export default createView;