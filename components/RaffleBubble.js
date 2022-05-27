import {Grid} from "@mui/material";
const RaffleBubble = (props) => {
	const componentLoggingTag = `[RaffleBubble]`;
	const {icon, content} = props;
	return (
		<Grid
			item
			container
			alignItems={"center"}
			sx={{
				padding: `6px 14px 6px 6px`,
				border: `2px solid #000000`,
				borderRadius: '3px'
			}}
		>
			<Grid
				item
				sx={{
					mr:1
				}}
			>
				{icon}
			</Grid>
			<Grid item>
				{content}
			</Grid>
		</Grid>
	)
}

export default RaffleBubble;