import * as React from 'react';
import {useState} from "react";
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CalculateIcon from '@mui/icons-material/Calculate';
import CalenderIcon from '@mui/icons-material/CalendarToday';
import TableIcon from "@mui/icons-material/TableChart";

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
		icon: <TableIcon />
	},
]

const DashboardSideNav = (props) => {
	
	const [isOpen, setOpen] = useState(true);
	
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
					<ListItem
						button
						key={index}
						sx={{
							padding: "14px 24px"
						}}
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
					</ListItem>
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