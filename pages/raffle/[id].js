import {CircularProgress, Grid, Typography, Box, useTheme, SvgIcon, Button} from "@mui/material";
import useSWR from "swr";
import {useState} from "react";
import RaffleWinnersBubble from "../../components/RaffleWinnersBubble";
import RaffleEndDateBubble from "../../components/RaffleEndDateBubble";
import {ethers} from "ethers";
import RaffleRequirements from "../../components/RaffleRequirements";
import TwitterIcon from "@mui/icons-material/Twitter";
import DiscordIcon from "../../components/icons/DiscordIcon";

//start dummy info

const delay = (time = 3000) => {
	return new Promise((resolve, reject) => {
		setTimeout(()=>{
			resolve();
		}, [time]);
	})
}

const dummyRaffleResp = {
	data: {
		title: 'Mutant Ape Yacht Club X Syndicate893',
		collection:{
			img: `https://lh3.googleusercontent.com/lHexKRMpw-aoSyB1WdFBff5yfANLReFxHzt1DOj_sg7mS14yARpuvYcUtsyyx-Nkpk6WTcUPFoG53VnLJezYi8hAs0OxNZwlw6Y-dmI=s0`,
			title: `Mutant Ape Yacht Club`,
			desc: `The MUTANT APE YACHT CLUB is a collection of up to 20,000 Mutant Apes that can only be created by exposing an existing Bored Ape to a vial of MUTANT SERUM or by minting a Mutant Ape in the public sale.`,
			socials: {
				twitter: {
					followers: 55400,
					id: `BoredApeYC`,
				},
				discord: {
					members: 25400,
					id: `bayc`,
				}
			},
		},
		winners: 100,
		end: 1653919200000,//timestamp stored in ms
		info: `This is where the raffle information will go. Project is going to be the best ever.  Blah blah blah`,
		requirements: {
			eth: {
				required: true,
				amount: 1000000000000000000//stored in "wei"
			},
			twitter: {
				required: true,
				handle: `BoredApeYC`
			},
			discord: {
				required: true,
				id: 'bayc'
			}
		}
	}

};

const getRaffleInfo = async (url) => {
	const loggingTag = `[getRaffleInfo]`;
	await delay(500);
	return dummyRaffleResp;
}
//end dummy info

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

const RaffleView = (props) => {
	const componentLoggingTag = `[RaffleView]`;
	
	const theme = useTheme();
	const{data:resp, isValidating, error} = useSWR(`not in use`, getRaffleInfo, {revalidateOnFocus: false});
	
	if(isValidating){
		return(
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					width: "100%",
					height: "100%"
				}}
			>
				<CircularProgress/>
			</Box>
		)
	} else {
		
		const {title, collection, winners, end, info, requirements} = resp.data;
		const {img:collectionImage, title:collectionTitle, socials, desc} = collection;
		
		return (
			<Grid
				container
				spacing={6}
				flexWrap={"nowrap"}
				sx={{
					justifyContent: "flex-start",
					pl: 8,
					pt: 8,
					pr: 8
				}}
			>
				<Grid
					item
					container
					direction={"column"}
					flexGrow={0}
					flexShrink={2}
					sx={{
						width: "auto"
					}}
				>
					<Grid
						item
					>
						<img
							src={collectionImage}
							alt={collectionTitle}
							style={{
								width: "200px",
								height: "200px",
								borderRadius: "100px"
							}}
						/>
					</Grid>
					{/*social buttons*/}
					<Grid
						item
						container
						direction={"column"}
						rowSpacing={2}
						sx={{
							mt: 3
						}}
					>
						{
							Object.keys(socials).map((key) => {
								const info = socials[key],
									platform = key;
								console.info(`${componentLoggingTag}[${key}] social info:`, info);
								return (
									<Grid
										item
										container
										columnSpacing={2}
										sx={{
											width: "auto"
										}}
										key={`${title}-social-${key}`}
									>
										<Grid item>
											<Box
												sx={{
													height: "32px",
													width: "32px",
													borderRadius: "16px",
													color: "#FFFFFF",
													boxSizing: "border-box",
													backgroundColor: theme.palette.socials[platform],
													display: "flex",
													alignItems:"center",
													justifyContent:"center"
												}}
											>
												{platform === "twitter" ? <TwitterIcon/> : <DiscordIcon viewBox="0 0 71 55" sx={{color:"#FFFFFF", width:"22px", height:"auto"}}/>}
											</Box>
											
										</Grid>
										<Grid item>
											<Typography>{platform === "twitter" ? `${info.followers} Followers` : `${info.members} Members`}</Typography>
										</Grid>
									</Grid>
								)
							})
						}
					</Grid>
				</Grid>
				{/*main content*/}
				<Grid
					item
					container
					rowSpacing={6}
					flexGrow={1}
					sx={{
						minWidth: 0
					}}
				>
					{/*collection info*/}
					<Grid
						item
						container
						rowSpacing={1}
					>
						<Grid
							item
						>
							<Typography
								variant={"h1"}
								sx={{
									fontSize: "2.25rem",
									fontWeight: 500,
									whiteSpace: "nowrap",
									textOverflow: "ellipsis",
									overflow: "hidden",
								}}
								>{title}</Typography>
						</Grid>
						<Grid item>
							<Typography
								variant={"h2"}
								sx={{
									fontSize: "1.5rem",
									lineHeight: "1.9rem",
									color: theme.palette.primary['500']
								}}
							>
								{desc}
							</Typography>
						</Grid>
					</Grid>
					{/*raffle info*/}
					<Grid
						item
						container
						rowSpacing={3}
						>
						<Grid item>
							<RaffleSectionTitle>Raffle Info</RaffleSectionTitle>
						</Grid>
						<Grid
							item
							container
						>
							<Grid
								item
								sx={{
									mr: 2
								}}
							>
								{/*raffle winner*/}
								<RaffleWinnersBubble num={winners}/>
							</Grid>
							<Grid item>
								<RaffleEndDateBubble date={end}/>
							</Grid>
						</Grid>
						<Grid item>
							<Typography
								sx={{
									color: theme.palette.primary['500'],
									fontSize: "1.2rem"
								}}
								>{info}</Typography>
						</Grid>
					</Grid>
					{/*raffle requirements*/}
					<Grid
						item
						container
						rowSpacing={3}
					>
						<Grid item>
							<RaffleSectionTitle>Requirements</RaffleSectionTitle>
						</Grid>
						<RaffleRequirements
							title={title}
							requirements={requirements}
						/>
					</Grid>
				</Grid>
			</Grid>
		)
	}
}

export default RaffleView;