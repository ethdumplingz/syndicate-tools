import {Tooltip, Icon} from "@mui/material";

const SyndicateIndicator = (props) => {
	return(
		<Tooltip title={"Syndicate Affiliated"}>
			<Icon
				sx={{
					textAlign: 'center',
					height: "20px",
					width: "20px",
					display: "flex",
					alignItems: "center"
				}}
			>
				<img
					style={{
						height: '100%'
					}}
					src={require("../images/circle_stroke_logo.svg")}
				/>
			</Icon>
		</Tooltip>
	)
}

export default SyndicateIndicator;