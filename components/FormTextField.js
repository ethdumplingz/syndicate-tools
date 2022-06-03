import {TextField} from "@mui/material";

const FormTextField = (props) => {
	const componentLoggingTag = `[FormTextField]`;
	const {value="", defaultValue, maxRows = 1, minRows = 1, onChange = ()=>{}, min, children, label="", type="text", step = 1, helperText="", error = false, fullWidth = true} = props;
	// console.info(`${componentLoggingTag} props`, props);
	return(
		<TextField
			variant={"outlined"}
			value={value}
			defaultValue={defaultValue}
			onChange={onChange}
			fullWidth={fullWidth}
			multiline={maxRows > 1}
			maxRows={maxRows}
			minRows={minRows}
			label={label}
			type={type}
			step={step}
			helperText={helperText}
			error={error}
			min={min}
		>
			{children}
		</TextField>
	)
}

export default FormTextField;