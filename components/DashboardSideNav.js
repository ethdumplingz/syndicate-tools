import * as React from 'react';
import {useState} from "react";

import {
	Button,
	SwipeableDrawer,
	Grid,
	List,
	Divider,
	ListItem,
	ListItemIcon,
	ListItemText,
	Collapse,
	SvgIcon,
	useTheme
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import CalenderIcon from '@mui/icons-material/CalendarToday';
import TableIcon from "@mui/icons-material/TableChart";
import ViewAllIcon from "@mui/icons-material/TableView"
import AddIcon from "@mui/icons-material/Add";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import WLGameIcon from "@mui/icons-material/VisibilityOutlined";
import AdminIcon from "@mui/icons-material/SupportAgent";
import SyndicateLogo from "../images/circle_stroke_logo.svg";
import {useRouter} from "next/router";
import Link from "next/link";
import {useSyndicateAuthenticationContext} from "./SyndicateAuthenticationProvider";
import LogOutBtn from "./LogOutBtn";
import {useMoralis} from "react-moralis";

const items = [
	{
		id: "projects",
		str: "Projects",
		icon: <TableIcon />,
		expandable: true,
		children : [
			{
				id: "all-projects",
				str: "Upcoming Mints",
				icon: <ViewAllIcon />,
				path: "/projects/view"
			},
			{
				id: "active-projects",
				str: "Whitelist Game",
				icon: <WLGameIcon />,
				path: "/projects/active"
			},
			{
				id: "projects-admin",
				str: "Admins",
				icon: <AdminIcon/>,
				adminsOnly: true,
				path: "/projects/admins"
			}
			// {
			// 	id: "projects-add",
			// 	str: "Add",
			// 	icon: <AddIcon />,
			// 	path: "/projects/add"
			// },
		]
	},
	{
		id: "profit-loss",
		str: "Profit/Loss",
		icon: <CalculateIcon />,
		disabled: true,
		path: "/wallet/profit-loss"
	},
	{
		id: "calendar",
		str: "Calendar",
		disabled: true,
		icon: <CalenderIcon />
	},
]

const ConditionalLinkWrapper = (props) => {
	const componentLoggingTag = `[ConditionalLinkWrapper]`;
	const {condition, wrapper, children} = props
	return(
		condition ? wrapper(children) : children
	)
}

const DashboardSideNav = (props) => {
	
	const theme = useTheme();
	const router = useRouter();
	const {isAuthenticated} = useMoralis();
	const {isAdmin, isAgent} = useSyndicateAuthenticationContext();
	const [isOpen, setOpen] = useState(true);
	const [sectionExpanded, setSectionExpanded] = useState({
		"projects" : true
	});
	
	const toggleDrawer = (open = false) => (event) => {
		setOpen(open);
	}
	
	const list = () => (
		<Grid
			container
			sx={{
				width: 250
			}}
			flexGrow={1}
			role="presentation"
			flexDirection={"column"}
			justifyContent={"space-between"}
		>
			<Grid item>
				<List>
					<ListItem>
						<ListItemIcon>
							<SvgIcon
								component={SyndicateLogo}
								htmlColor={"#000000"}
								viewBox={"0 0 266 251"}
								sx={{
									height: 42,
									width: 42
								}}
							/>
						</ListItemIcon>
						<ListItemText
							sx={{
								'& .MuiListItemText-primary':{
									fontSize: "1.2rem"
								}
							}}
						>Syndicate893</ListItemText>
					</ListItem>
				</List>
				<Divider/>
				<List>
					{items.map((item, index) => (
						<React.Fragment key={index}>
							<ConditionalLinkWrapper
								condition={typeof item.path === "string"}di
								wrapper={children => <Link href={item.path}>{children}</Link>}
							>
								<ListItem
									button
									key={index}
									disabled={(item.disabled || !isAuthenticated || !isAgent) && (!isAdmin)}
									sx={{
										padding: "14px 24px"
									}}
									onClick={item.expandable ? (e) => {
										const prevItemExpanded = sectionExpanded[item.id],
											newSectionExpandedState = {...sectionExpanded, [item.id]: !prevItemExpanded}
										setSectionExpanded(newSectionExpandedState);
									} : () => {}}
								>
									<ListItemIcon
										sx={{
											color: "black",
											minWidth: "50px"
										}}
									>
										{item.icon}
									</ListItemIcon>
									<ListItemText primary={item.str} />
									{item.expandable && sectionExpanded[item.id] ? <ExpandLess /> : item.expandable ? <ExpandMore /> : ''}
								</ListItem>
							</ConditionalLinkWrapper>
							{
								typeof item.children === "object"  && item.children.length > 0 ? (
									<Collapse
										in={sectionExpanded[item.id]}
										sx={{
											backgroundColor: `rgba(0,0,0,0.04)`
										}}
									>
										<List>
											{
												item.children.map((child, index) => (
													<ListItem
														key={index}
														button
														disabled={item.disabled || !isAuthenticated || !isAgent}
														sx={{
															display: (child.adminsOnly && !isAdmin) ? "none" : "flex",
															padding: "14px 24px",
														}}
														onClick={(e)=>{router.push(child.path)}}
													>
														<ListItemIcon
															sx={{
																color: "black",
																minWidth: "46px",
															}}
														>
															{child.icon}
														</ListItemIcon>
														<ListItemText primary={child.str}/>
													</ListItem>
												))
											}
										</List>
									</Collapse>
								) : (
									<></>
								)
							}
						</React.Fragment>
					))}
				</List>
			</Grid>
			<Grid
				item
				sx={{
					p: 3,
					display: isAgent ? "block" : "none"
				}}
			>
				<LogOutBtn/>
			</Grid>
		</Grid>
	);
	
	return (
		<SwipeableDrawer
			variant={"permanent"}
			open={isOpen}
			elevation={2}
			hideBackdrop={true}
			onClose={toggleDrawer(false)}
			onOpen={toggleDrawer(true)}
		>
			{list()}
		</SwipeableDrawer>
	);
}

export default DashboardSideNav;