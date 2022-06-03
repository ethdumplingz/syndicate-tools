import {Button} from "@mui/material";

const FormActionBtn = (props) => {
	const componentLoggingTag = `[FormActionBtn]`;
	const {text, onClick, variant = "contained", disabled = false} = props;
	return (
		<Button
			variant={variant}
			disabled={disabled}
			onClick={onClick}
			sx={{
				padding: "8px 18px",
				fontSize: "1rem"
			}}
		>
			{text}
		</Button>
	)
}

export default FormActionBtn;