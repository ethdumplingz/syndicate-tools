import * as React from 'react';
import {useState} from "react";

import {Box, SwipeableDrawer, Button, List, Divider, ListItem, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import CalenderIcon from '@mui/icons-material/CalendarToday';
import TableIcon from "@mui/icons-material/TableChart";
import ViewAllIcon from "@mui/icons-material/TableView"
import AddIcon from "@mui/icons-material/Add";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import WLGameIcon from "@mui/icons-material/VisibilityOutlined";
import AdminIcon from "@mui/icons-material/SupportAgent";
import {useRouter} from "next/router";
import {useSyndicateAuthenticationContext} from "./SyndicateAuthenticationProvider";

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
		path: "/wallet/profit-loss"
	},
	{
		id: "calendar",
		str: "Calendar",
		disabled: true,
		icon: <CalenderIcon />
	},
]

const DashboardSideNav = (props) => {
	
	const router = useRouter();
	const {isAdmin} = useSyndicateAuthenticationContext();
	const [isOpen, setOpen] = useState(true);
	const [sectionExpanded, setSectionExpanded] = useState({
		"projects" : true
	});
	
	const toggleDrawer = (open = false) => (event) => {
		setOpen(open);
	}
	
	const list = () => (
		<Box
			sx={{
				width: 250
			}}
			role="presentation"
		>
			<List>
				<ListItem>
					<ListItemIcon>
						<img src={require("../images/circle_stroke_logo.svg")} alt={"The Syndicate"} height={42} width={42}/>
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
						<ListItem
							button
							key={index}
							disabled={item.disabled}
							sx={{
								padding: "14px 24px"
							}}
							onClick={item.expandable ? (e) => {
								const prevItemExpanded = sectionExpanded[item.id],
									newSectionExpandedState = {...sectionExpanded, [item.id]: !prevItemExpanded}
								setSectionExpanded(newSectionExpandedState);
							} : (typeof item.path === "string" && item.path.length > 0) ? () => {router.push(item.path)} : () => {}}
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
		</Box>
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