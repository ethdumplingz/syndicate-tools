import * as React from "react";
import {useState, useEffect} from "react";
import {useContext} from "react";
import { useMoralis, useNFTBalances} from "react-moralis";
import axios from "axios";

export const SyndicateAuthenticationContext = React.createContext({});

const checkIfUserIsTeamMember = async (url) => {
	const loggingTag = `[checkIfUserIsTeamMember]`;
	try{
		console.info(`${loggingTag} url: ${url}`);
		return await axios.get(`${process.env.NEXT_PUBLIC_BASE_URI}${url}`);
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
		throw e;
	}
}

export const SyndicateAuthenticationProvider = (props) => {
	const componentLoggingTag = `[SyndicateAuthenticationProvider]`;
	
	const { children } = props;
	
	const [isPending, setLoading] = useState(false);
	const [isAgent, setAgent] = useState(false);
	const [isAdmin, setAdmin] = useState(false);
	const [address, setAddress] = useState("");
	
	const { isAuthenticated, user, account, isWeb3Enabled, authenticate} = useMoralis();
	const { getNFTBalances, data, error, isLoading, isFetching } = useNFTBalances();
	
	useEffect(() => {
		const loggingTag = `${componentLoggingTag}[initial mount]`;
		console.info(`${loggingTag} SyndicateAuthenticate called!`);
		console.info(`${loggingTag} is authenticated: ${isAuthenticated}, is web3 enabled: ${isWeb3Enabled}`);
	}, []);
	
	useEffect(async () => {
		const loggingTag = `${componentLoggingTag}[auth:${isAuthenticated}][isWeb3Enabled:${isWeb3Enabled}] `;
		console.info(`${loggingTag} isAuthenticated or isWeb3Enabled state changed`);
		setLoading(true);
		try{
			if(isAuthenticated){
				const balances = await getNFTBalances({
					params:{
						token_address: "0x0a8D803E3e29f07BD58e3061D9AeE7B57813DF2c"
					}
				});
				
				console.info(`${loggingTag} agent pass balance:`, balances);
				
				if(balances.total > 0){
					setAgent(true);
					console.info(`${loggingTag} account: ${user.attributes.ethAddress} user`, user);
					setAddress(user.attributes.ethAddress);
					//checking is user is admin
					const userWalletAddress = balances.result[0].owner_of;
					console.info(`${loggingTag} wallet address:`, userWalletAddress);
					const result = await checkIfUserIsTeamMember(`/users/${userWalletAddress}/team/check`),
						check = result.data.ok;
					console.info(`${loggingTag} result:`, result);
					setAdmin(check);
				}
			}
		} finally{
			setLoading(false);
		}
		
	}, [isAuthenticated, isWeb3Enabled]);
	
	const authContext = {
		isPending,
		isAgent,
		address,
		isAdmin
	};
	
	return(
		<SyndicateAuthenticationContext.Provider value={authContext}>
			{children}
		</SyndicateAuthenticationContext.Provider>
	)
}

export const useSyndicateAuthenticationContext = () => useContext(SyndicateAuthenticationContext);