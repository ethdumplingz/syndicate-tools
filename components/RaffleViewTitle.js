import {Typography} from "@mui/material";

const RaffleViewTitle = (props) => {
	const {children} = props;
	return(
		<Typography
			variant={"h1"}
			sx={{
				fontSize: "2.25rem",
				fontWeight: 500,
				whiteSpace: "nowrap",
				textOverflow: "ellipsis",
				overflow: "hidden",
			}}
		>{children}</Typography>
	)
}

export default RaffleViewTitle;