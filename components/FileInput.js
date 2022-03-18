import { useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";

import {Box, TextField, ButtonBase, Button} from "@mui/material";

const FileInput = ({ label, onChange, error, height = 56}) => {
	const componentLoggingTag = `[FileInput]`;
	const ref = useRef();
	const theme = useTheme();
	const [attachment, setAttachment] = useState();
	
	const handleChange = (event) => {
		const loggingTag = `${componentLoggingTag}[handleChange]`;
		const files = Array.from(event.target.files);
		const [file] = files;
		console.info(`${loggingTag} file:`, file);
		setAttachment(file);
		
		if (!!onChange) onChange({ target: { value: file } });
	};
	
	return (
		<Box
			position="relative"
			height={height}
			color={
				!!error ? theme.palette.error.main : theme.palette.background.paper
			}
			borderBottom={0}
		>
			<Box
				position="absolute"
				top={0}
				bottom={0}
				left={0}
				right={0}
				mx={0}
			>
				<TextField
					sx={{
						"& .MuiFormLabel-root.Mui-disabled": {
							color: theme.palette.text.secondary,
						}
					}}
					margin={"none"}
					fullWidth
					disabled
					label={label}
					value={attachment?.name || ""}
					error={!!error}
					helperText={error?.message || ""}
				/>
			</Box>
			<Button
				position="absolute"
				top={0}
				bottom={0}
				left={0}
				right={0}
				sx={{
					height: "100%",
					width: "100%",
					overflow: "hidden",
				}}
				component="label"
				onKeyDown={(e) => e.keyCode === 32 && ref.current?.click()}
			>
				<input
					ref={ref}
					type="file"
					accept=".csv,text/plain"
					hidden
					onChange={handleChange}
				/>
			</Button>
		</Box>
	);
};

export default FileInput;