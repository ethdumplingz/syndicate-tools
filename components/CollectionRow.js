import {Grid, Typography} from "@mui/material";

const CollectionRow = (props) => {
	const componentLoggingTag = `[CollectionRow]`;
	const {name, image_url, token_address, cost = 1.0, gas = 0.05, tokenID, floor_price = 1.5} = props;
	
	console.info(`${componentLoggingTag} props`, props);
	
	return(
		<Grid
			item
			container
			alignItems={"center"}
		>
			<Grid item>
				<img src={image_url} alt={name}/>
			</Grid>
			<Grid item>
				<Typography>{name}</Typography>
			</Grid>
		</Grid>
	)
}

export default CollectionRow;