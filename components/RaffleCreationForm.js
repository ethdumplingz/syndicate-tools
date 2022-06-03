import {FormControl, Grid, Switch, FormLabel, FormGroup, FormControlLabel} from "@mui/material";
import FormTextField from "./FormTextField";
import FormActionBtn from "./FormActionBtn";
import RaffleSectionTitle from "./RaffleSectionTitle";
import {useState} from "react";

const RaffleFormSection = (props) => {
	const {title, fields} = props;
	return (
		<Grid
			item
			container
			direction={"column"}
			rowSpacing={3}
		>
			<Grid item>
				<RaffleSectionTitle>{title}</RaffleSectionTitle>
			</Grid>
			<Grid
				item
				container
				rowSpacing={2}
				direction={"column"}
			>
				{
					fields.map((field, index) => (
						<Grid item key={`${title}-${index}`}>
							{field}
						</Grid>
					))
				}
			</Grid>
		</Grid>
	)
}

//fake delay
const delay = (time= 1000) => {
	return new Promise((resolve, error) => {
		setTimeout(() => {
			resolve(true);
		}, time);
	})
}

const RaffleCreationForm = () => {
	const componentLoggingTag = `[RaffleCreationForm]`;
	
	const [requirements, setRequirements] = useState({
		twitter: true,
		discord: true,
		eth_in_wallet: false,
		min_eth_amount: 0
	});

	const createRaffle = async () => {
		await delay();
		alert("Raffle Created!");
	}
	
	const handleToggleChange = (event) => {
		setRequirements({
			...requirements,
			[event.target.name]: event.target.checked,
		});
	};
	
	const handleMinimumEthChange = (event) => {
		const loggingTag = `${componentLoggingTag}[handleMinimumEthChange]`;
		console.info(`${loggingTag} event target`, event.target);
		setRequirements({
			...requirements,
			min_eth_amount: event.target.value
		});
	}
	
	return(
		<Grid
			item
			container
			direction={"column"}
			rowSpacing={5}
			sx={{
				pb: 5,
				maxWidth: "600px"
			}}
		>
			<RaffleFormSection
				title={"Collection"}
				fields={[
					<FormTextField
						label={"Title"}
					/>,
					<FormTextField
						label={"Description"}
						maxRows={4}
						minRows={3}
					/>,
					<FormTextField
						label={"Twitter"}
					/>,
					<FormTextField
						label={"Discord"}
					/>
				]}
			/>
			<RaffleFormSection
				title={"Raffle"}
				fields={[
					<FormTextField
						label={"Title"}
					/>,
					<FormTextField
						label={"Description"}
						maxRows={4}
						minRows={3}
					/>,
					<FormTextField
						label={"Winners"}
						fullWidth={false}
						type={"number"}
						defaultValue={1}
					/>,
					<FormTextField
						helperText={"End Time"}
						fullWidth={false}
						type={"datetime-local"}
					/>
				]}
			/>
			{/*requirement section*/}
			<Grid
				item
				container
				direction={"column"}
				rowSpacing={3}
			>
				<Grid item>
					<RaffleSectionTitle>Requirements</RaffleSectionTitle>
				</Grid>
				<Grid
					item
					container
					rowSpacing={2}
					direction={"column"}
				>
					<Grid
						item
						container
						direction={"column"}
						rowSpacing={1.25}
					>
						<Grid item>
							<FormControlLabel
								control={
									<Switch checked={requirements.twitter} onChange={handleToggleChange} name={"twitter"}/>
								}
								label={"Follow Twitter"}
							/>
						</Grid>
						<Grid item>
							<FormControlLabel
								control={
									<Switch checked={requirements.discord} onChange={handleToggleChange} name={"discord"}/>
								}
								label={"Join Discord"}
							/>
						</Grid>
						<Grid item>
							<FormControlLabel
								control={
									<Switch checked={requirements.eth_in_wallet} onChange={handleToggleChange} name={"eth_in_wallet"}/>
								}
								label={"Minimum Wallet Eth Balance"}
							/>
						</Grid>
						<Grid
							item
							sx={{
								mt:1.5
							}}
						>
							<FormControlLabel
								sx={{
									display: !requirements.eth_in_wallet ? "none" : "inline-flex",
									ml: 0
								}}
								control={
									<FormTextField
										label={"Required Eth"}
										type={"number"}
										onChange={handleMinimumEthChange}
										value={requirements.min_eth_amount}
									/>
								}
								label={""}
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			{/*end requirement section*/}
			<Grid item container>
				<FormActionBtn
					onClick={createRaffle}
					text={"Create"}
				/>
			</Grid>
		</Grid>
	)
}

export default RaffleCreationForm;