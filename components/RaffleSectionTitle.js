import {Typography} from "@mui/material";

const RaffleSectionTitle = (props) => {
	const {children} = props;
	return(
		<Typography
			variant={"h3"}
			sx={{
				fontWeight: 500,
				fontSize: "2rem"
			}}
		>
			{children}
		</Typography>
	)
}

export default RaffleSectionTitle;