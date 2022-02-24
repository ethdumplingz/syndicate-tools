
import "../styles/global.css";
import theme from "../utils/theme";
import { ThemeProvider } from "@mui/material/styles";
import Head from "next/head";

const App = ({ Component, pageProps}) => {
	return (
		<ThemeProvider theme={theme}>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />
			</Head>
			<Component {...pageProps} />
		</ThemeProvider>
	)
}

export default App;
