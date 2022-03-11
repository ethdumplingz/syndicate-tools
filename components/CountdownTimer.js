import * as React from "react";
import {useEffect, useState} from "react";

import {Typography, Grid, Tooltip} from "@mui/material";

import dayjs from "dayjs";
import Duration from "dayjs/plugin/duration";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(Duration);
dayjs.extend(LocalizedFormat)

const CountdownDivider = (props) => {
	return(
		<Typography
			sx={{
				'&:last-child':{
					display: "none"
				}
			}}
		>:</Typography>
	)
}
const TimeUnit = (props) => {
	let {value, unit} = props;
	// if(unit === "seconds"){
	// 	console.info(`[${unit}] value:${value}`);
	// }
	return (
		<>
			<Typography>
				{`${value < 10 ? `0${value}` : value}${unit.substr(0,1)}`}
			</Typography>
		</>
	)
}

const UnitWrapper = ({children}) => {
	return (
		<Grid
			item
		>
			{children}
		</Grid>
	)
}
const timeFromNow = (end) => {
	const start = dayjs(),
		diff = end.diff(start);
	return diff;
}
const CountdownTimer = (props) => {
	const componentLoggingTag = `[CountdownTimer]`;
	const {presale} = props;
	const tsPresaleStart = presale.start;
	// console.info(`${componentLoggingTag} ts mint:`, tsMint);
	
	const [timeTil, setTimeTil] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0
	});
	
	useEffect(() => {
		const interval = setInterval(() => {
			const diff = timeFromNow(tsPresaleStart),
				duration = dayjs.duration(diff);
			// console.info(`[duration][seconds] return value ${duration.seconds()}`);
			setTimeTil({
				days: duration.days(),
				hours: duration.hours(),
				minutes: duration.minutes(),
				seconds: duration.seconds(),
			});
			
		}, 1000);
		return () => clearInterval(interval);
	}, []);
	
	if(timeFromNow(tsPresaleStart) > 0){
		return (
			<Grid
				container
				columnSpacing={1}
				justifyContent={"flex-end"}
			>
				{
					Object.keys(timeTil).map((key, index) => {
						if(typeof timeTil[key] === "number" && timeTil[key] > -1){
							return(
								<React.Fragment key={index}>
									<UnitWrapper>
										<TimeUnit value={timeTil[key]} unit={key}/>
									</UnitWrapper>
									<UnitWrapper>
										<CountdownDivider/>
									</UnitWrapper>
								</React.Fragment>
							)
						}
					})
				}
			</Grid>
		)
	} else if (dayjs(presale.start).unix() === 0) {
		return (<Typography>N/A</Typography>)
	} else if (timeFromNow(presale.end) < 0){
		console.info(`${componentLoggingTag} time from now (presale end): ${timeFromNow(presale.end)} full presale end string: ${presale.end}`);
		return(
			<Tooltip title={`Ended on: ${dayjs(presale.end).format('llll')}`}>
				<Typography sx={{fontWeight: 600}}>It's over!</Typography>
			</Tooltip>
		)
	} else {//already started!
		return(
			<Tooltip title={`Started on: ${dayjs(tsPresaleStart).format('llll')}`}>
				<Typography sx={{fontWeight: 600}}>Happening Now!</Typography>
			</Tooltip>
		)
	}
	
}

export default CountdownTimer;