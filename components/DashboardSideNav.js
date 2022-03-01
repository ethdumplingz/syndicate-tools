import * as React from 'react';
import {useState} from "react";

import {Box, SwipeableDrawer, Button, List, Divider, ListItem, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import CalenderIcon from '@mui/icons-material/CalendarToday';
import TableIcon from "@mui/icons-material/TableChart";
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import {useRouter} from "next/router";

const items = [
	{
		id: "profit-loss",
		str: "Profit/Loss",
		icon: <CalculateIcon />
	},
	{
		id: "calendar",
		str: "Calendar",
		icon: <CalenderIcon />
	},
	{
		id: "database",
		str: "Database",
		icon: <TableIcon />,
		expandable: true,
		onClick: () => {
		
		},
		children : [
			{
				id: "database-add",
				str: "Add",
				icon: <AddIcon />,
				path: "/database/add"
			},
			{
				id: "database-view",
				str: "View",
				icon: <SearchIcon />,
				path: "/database/view"
			},
		]
	}
]

const DashboardSideNav = (props) => {
	
	const router = useRouter();
	const [isOpen, setOpen] = useState(true);
	const [sectionExpanded, setSectionExpanded] = useState({
		"database" : true
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
					<>
						<ListItem
							button
							key={index}
							sx={{
								padding: "14px 24px"
							}}
							onClick={item.expandable ? (e) => {
								const prevItemExpanded = sectionExpanded[item.id],
									newSectionExpandedState = {...sectionExpanded, [item.id]: !prevItemExpanded}
								setSectionExpanded(newSectionExpandedState);
							} : false}
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
						{typeof item.children === "object"  && item.children.length > 0 ? (
							<Collapse in={sectionExpanded[item.id]}>
								<List>
									{
										item.children.map((child, index) => (
											<ListItem
												key={index}
												button
												sx={{
													padding: "14px 24px",
													pl: 6
												}}
												onClick={(e)=>{router.push(child.path)}}
											>
												<ListItemIcon
													sx={{
														color: "black",
														minWidth: "50px"
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
					</>
				))}
			</List>
			{/*<Divider />*/}
			{/*<List>*/}
			{/*	{['All mail', 'Trash', 'Spam'].map((text, index) => (*/}
			{/*		<ListItem button key={text}>*/}
			{/*			<ListItemIcon>*/}
			{/*				{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}*/}
			{/*			</ListItemIcon>*/}
			{/*			<ListItemText primary={text} />*/}
			{/*		</ListItem>*/}
			{/*	))}*/}
			{/*</List>*/}
		</Box>
	);
	
	return (
		<SwipeableDrawer
			variant={"persistent"}
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