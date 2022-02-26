import * as React from "react";
import {useState, useEffect} from "react";
import {useContext} from "react";
import { useMoralis, useNFTBalances} from "react-moralis";


export const SyndicateAuthenticationContext = React.createContext({});

export const SyndicateAuthenticationProvider = (props) => {
	const componentLoggingTag = `[SyndicateAuthenticationProvider]`;
	
	const { children } = props;
	const [isAgent, setAgent] = useState(false);
	
	const {isAuthenticated, user, account, isWeb3Enabled, authenticate} = useMoralis();
	const { getNFTBalances, data, error, isLoading, isFetching } = useNFTBalances();
	
	useEffect(() => {
		const loggingTag = `${componentLoggingTag}[initial mount]`;
		console.info(`${loggingTag} SyndicateAuthenticate called!`);
		console.info(`${loggingTag} is authenticated: ${isAuthenticated}, is web3 enabled: ${isWeb3Enabled}`);
		
	}, []);

	useEffect(async () => {
		const loggingTag = `${componentLoggingTag}[auth:${isAuthenticated}][isWeb3Enabled:${isWeb3Enabled}] `;
		console.info(`${loggingTag} authentication state changed`);
		if(isAuthenticated){
			const balances = await getNFTBalances({
				params:{
					token_address: "0x0a8D803E3e29f07BD58e3061D9AeE7B57813DF2c"
				}
			});
			
			if(balances.total > 0){
				setAgent(true);
			}
			
			console.info(`${loggingTag} agent pass balance:`, balances);
		
		}
	}, [isAuthenticated, isWeb3Enabled]);
	
	const authContext = {
		isAgent
	};
	return(
		<SyndicateAuthenticationContext.Provider value={authContext}>
			{children}
		</SyndicateAuthenticationContext.Provider>
	)
}

export const useSyndicateAuthenticationContext = () => useContext(SyndicateAuthenticationContext);