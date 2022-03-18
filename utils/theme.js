import { createTheme } from '@mui/material/styles';
import {red, yellow, green} from "@mui/material/colors"

// Create a theme instance.
const theme = createTheme({
	palette: {
		primary: {
			main: '#000000',
			'100': "#f7f7f7",
			'600': "#7D7D7D",
			'800': "#262626"
		},
		secondary: {
			main: '#ED584E',
			'100': '#F6F8F9',
		},
		light: {
			main: "#f7f7f7",
			'100': '#d9d9d9'
		},
		projects: {
			danger: red[100],
			// ok: yellow[100],
			ok: 'transparent',
			good: green[100]
		}
	},
	typography:{
		fontFamily: `"Inconsolata", "Helvetica Neue", sans-serif`
	}
});

export default theme;
