
import "../styles/global.css";
import theme from "../utils/theme";
import { ThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import Layout from "../components/Layout";
import { SyndicateAuthenticationProvider } from "../components/SyndicateAuthenticationProvider";
import { MoralisProvider } from "react-moralis";

import * as React from "react";

const App = ({ Component, pageProps}) => {
	return (
		<MoralisProvider
			appId={"5w1stbOP83Wj7jtIkpGYA8cTFcd2YgOQHU1J87YU"}
			serverUrl={"https://3bvfs4ldi8dd.usemoralis.com:2053/server"}
		>
			<SyndicateAuthenticationProvider>
				<ThemeProvider theme={theme}>
					<Head>
						<title>Syndicate 893</title>
						<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />
					</Head>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</ThemeProvider>
			</SyndicateAuthenticationProvider>
		</MoralisProvider>
	)
}

export default App;
