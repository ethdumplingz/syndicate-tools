import { createTheme } from '@mui/material/styles';


// Create a theme instance.
const theme = createTheme({
	palette: {
		primary: {
			main: '#000000',
			'10': "#f7f7f7",
			'60': "#7D7D7D",
			'80': "#262626"
		},
		secondary: {
			main: '#ED584E',
			'10': '#F6F8F9',
		},
		light: {
			main: "#f7f7f7",
			'10': '#d9d9d9'
		}
	},
	typography:{
		fontFamily: `"Inconsolata", "Helvetica Neue", sans-serif`
	}
});

export default theme;
