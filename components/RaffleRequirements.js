import {Button, Grid, Typography, useTheme} from "@mui/material";
import {ethers} from "ethers";
import TwitterIcon from "@mui/icons-material/Twitter";
import DiscordIcon from "./icons/DiscordIcon";
// import DiscordIcon from "../images/discord.svg";
const RaffleRequirementSocialButton = (props) => {
	const {children, platform, icon} = props;
	const theme = useTheme();
	return(
		<Button
			variant={"contained"}
			startIcon={icon}
			sx={{
				'.MuiButton-startIcon':{
					mr: 2,
					height: "24px",
					width: "24px"
				},
				backgroundColor: theme.palette.socials[platform],
				padding: '18px 24px',
				fontSize: "1rem",
				textTransform: "initial",
				minWidth: "240px",
				justifyContent:"flex-start",
				'&:hover':{
					backgroundColor: theme.palette.socials[`${platform}_dark`]
				}
			}}
		>{children}</Button>
	)
}

const RaffleRequirements = (props) => {
	const componentLoggingTag = `[RaffleRequirements]`;
	const {title, requirements} = props;
	const theme = useTheme();
	
	return(
		<Grid
			item
			container
			rowSpacing={3}
			direction={"column"}
		>
			{Object.keys(requirements).map((key, index) => {
				const requirement = requirements[key];
				
				return(
					<Grid
						item
						key={`${title}-req-${index}`}
					>
						{
							key === "eth" ? (
								<Typography
									sx={{
										color: theme.palette.primary['500'],
										fontSize: "1.2rem"
									}}
								>
									Have {ethers.utils.formatEther(ethers.BigNumber.from(requirement.amount.toString()))} ETH in your wallet </Typography>
							) : key === "twitter" ? (
									<RaffleRequirementSocialButton
										icon={<TwitterIcon/>}
										platform={key}
									>
										Follow @{requirement.handle}
									</RaffleRequirementSocialButton>
							) : (
								<RaffleRequirementSocialButton
									icon={<DiscordIcon viewBox="0 0 71 55" sx={{color:"#FFFFFF", width:"20px", height:"auto"}}/>}
									platform={key}
									>
									Join Their Server
								</RaffleRequirementSocialButton>
								
							)
						}
					</Grid>
				)
			})}
		</Grid>
	)
}

export default RaffleRequirements;