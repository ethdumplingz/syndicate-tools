import * as React from "react";

import {useState, useEffect, useContext, useCallback} from "react";

import { useMoralis, useMoralisCloudFunction, useNFTBalances, useNFTTransfers} from "react-moralis";
import axios from "axios";
import {mergeObjectArraysOnProperty, sortArraysByProperty} from "../utils/utils";




export const UserPortfolioContext = React.createContext({});

export const UserPortfolioProvider = (props) => {
	const componentLoggingTag = `[UserPortfolioProvider]`;
	const [collections, setCollections] = useState([]);
	const { children } = props;
	
	const { fetch:fetchProfitLoss, data, error, isLoading } = useMoralisCloudFunction("calculateProfitLoss");
	// const result = useMoralisCloudFunction("calculateProfitLoss");
	// console.info(`${componentLoggingTag} result`, result);
	useEffect(async () => {
		let abortController = new AbortController();//needed to prevent a memory leak
		
		fetchProfitLoss();

		return () => {
			abortController.abort();
		}
	}, []);
	
	useEffect(()=>{
		console.info(`${componentLoggingTag} data`, data);
		if(
			(data !== null) &&
			(data.length > 0)
			// (typeof data.result === "object") &&
			// (data.result.length > 0)
		){
			setCollections(data);
		}
	}, [data]);
	
	const portfolioContext = {
		collections,
	};
	
	return (
		<UserPortfolioContext.Provider value={portfolioContext}>
			{children}
		</UserPortfolioContext.Provider>
	)
}

export const usePortfolioContext = () => useContext(UserPortfolioContext);