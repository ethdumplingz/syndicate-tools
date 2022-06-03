import {Box, Grid} from "@mui/material";
import RaffleViewTitle from "../../../components/RaffleViewTitle";
import RaffleCreationForm from "../../../components/RaffleCreationForm";

const RaffleManagementView = (props) => {
	return (
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
				<RaffleViewTitle>Manage Raffles</RaffleViewTitle>
			</Grid>
			<Grid item>
				Raffle Table Will Go Here.
			</Grid>
		</Grid>
	)
}

export default RaffleManagementView;