import * as React from "react";
import {useEffect, useState} from "react";

import {Typography, Grid} from "@mui/material";

import dayjs from "dayjs";
import Duration from "dayjs/plugin/duration";
dayjs.extend(Duration);

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
	const {end} = props;
	const tsMint = end;
	// console.info(`${componentLoggingTag} ts mint:`, tsMint);
	
	const [timeTil, setTimeTil] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0
	});
	
	useEffect(() => {
		const interval = setInterval(() => {
			const diff = timeFromNow(tsMint),
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
	
	if(timeFromNow(tsMint) > 0){
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
	} else {//already started!
		return(<Typography sx={{fontWeight: 600}}>It's Begun!</Typography>)
	}
	
}

export default CountdownTimer;