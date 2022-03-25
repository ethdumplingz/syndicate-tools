import * as React from "react";

import {useState, useEffect, useContext, useCallback} from "react";

import { useMoralis, useNFTBalances, useNFTTransfers} from "react-moralis";
import axios from "axios";
import {mergeObjectArraysOnProperty, sortArraysByProperty} from "../utils/utils";




export const UserPortfolioContext = React.createContext({});

export const UserPortfolioProvider = (props) => {
	const componentLoggingTag = `[UserPortfolioProvider]`;
	const [collections, setCollections] = useState([]);
	const { children } = props;
	
	const { isAuthenticated } = useMoralis();
	const { getNFTBalances, data:balances, error, isLoading, isFetching } = useNFTBalances();
	const { getNFTTransfers, data:transfers, error:transfersError, isLoading:transfersLoading, isFetching:transfersFetching } = useNFTTransfers();
	
	const findTransactionHash = useCallback(({token_id:tokenID = "", token_address:tokenAddress = ""} = {}) => {
		const loggingTag = `${componentLoggingTag}[findTransactionHash][token_id: ${tokenID}][token_addr: ${tokenAddress}]`;
		// console.info(`${loggingTag} ${transfers.total} transfers`);
		if(typeof transfers.result === "object" && transfers.result.length > 0){
			return transfers.result.filter(transfer => (transfer.token_id === tokenID && transfer.token_address === tokenAddress));
		}
	}, [transfers]);
	
	useEffect(async () => {
		let abortController = new AbortController();//needed to prevent a memory leak
		console.info(`${componentLoggingTag} is user authenticated? ${isAuthenticated}`);
		getNFTBalances();
		getNFTTransfers();
		
		return () => {
			abortController.abort();
		}
	}, []);
	
	useEffect(() => {
		console.info(`${componentLoggingTag} transfers`, transfers);
		console.info(`${componentLoggingTag} balances`, balances);
		if(balances !== null && balances.result.length > 0 &&  transfers !== null && transfers.result.length > 0){
			const sortedBalances = sortArraysByProperty({array: balances.result, property: "token_address"});
			
			let transactionHashsToRetrieve = [],
				collectionIDsToRetrieve = [],
				tempBalances = [];
			
			sortedBalances.forEach((balance, index) => {
				const prevItem = tempBalances[tempBalances.length - 1];
				// console.info(`${componentLoggingTag}[index:${index}] prev item`, prevItem);
				
				const {token_id, token_address} = balance;
				const transferEvents = findTransactionHash({token_id, token_address}),
					sortedTransfers = sortArraysByProperty({array: transferEvents, property: "block_number"}),//always sorting in "asc" order
					{transaction_hash:hash} = sortedTransfers[0];
				
				if(transactionHashsToRetrieve.indexOf(hash) === -1){
					// console.info(`${componentLoggingTag} duplicate hash found! "${hash}" transfer event:`, sortedTransfers);
					transactionHashsToRetrieve.push(hash);
				}
				
				if(
					(index === 0) ||
					(balance.token_address !== prevItem.token_address)
				){
					const {name, token_address, symbol, contract_type} = balance;
					const newBalance = {
						name,
						token_address,
						symbol,
						contract_type,
						tokens: [balance]
					}
					tempBalances.push(newBalance);
					collectionIDsToRetrieve.push(newBalance.token_address);
				} else {
					prevItem.tokens.push(balance);
				}
				
			});
			
			if(
				(transactionHashsToRetrieve.length > 0) &&
				(collectionIDsToRetrieve.length > 0)
			){
				console.info(`${componentLoggingTag} retrieving data for ${collectionIDsToRetrieve.length} collections...`);
				Promise.all([getCollectionsInfoBatch({ids:collectionIDsToRetrieve}), getTransactionDetailsBatch({hashes: transactionHashsToRetrieve})])
					.then((values) => {
						const [collections, transactions] = values;
						// console.info(`${componentLoggingTag} ${transactions.length} transactions, ${collections.length} collections`);
						// console.info(`${componentLoggingTag} ${tempBalances.length} num temp balances`, tempBalances);
						const collectionsWithBalances = collections.map((collection, i) => {
							
							if(collection._id === tempBalances[i].token_address){
								//merging two objects
								return Object.assign({}, collection,{tokens:tempBalances[i].tokens, num_tokens: tempBalances[i].tokens.length})
							}
						});
						// console.info(`${componentLoggingTag} collections with balances`, collectionsWithBalances);
						let finalArray = collectionsWithBalances.length > 0 && transactions.length > 0 ? mergeObjectArraysOnProperty({arrays: [collectionsWithBalances, transactions], property:"token_address"})
							: collectionsWithBalances.length > 0 ? collectionsWithBalances
								: [];
						console.info(`${componentLoggingTag}, final merged array`, finalArray);
						setCollections(finalArray);
					})
					.catch(e => {
						console.error(`${componentLoggingTag} Error fetching data from client:`, e);
					})
			}
			
		}
	}, [transfers, balances]);
	
	const getCollectionsInfoBatch = async ({ids = []} = {}) => {
		const loggingTag = `${componentLoggingTag}[getCollectionsInfoBatch]`;
		let collections = [];
		try{
			const result = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URI}/collections/get-bulk`, {
				addresses:ids
			});
			console.info(`${loggingTag} result:`, result.data);
			collections = result.data.collections;
		} catch(e){
			console.error(`${loggingTag} Error:`, e);
		}
		return collections;
	}
	
	const getTransactionDetailsBatch = async ({hashes = []} = {}) => {
		const loggingTag = `${componentLoggingTag}[getTransactionDetailsBatch]`;
		let transactions = [];
		try{
			const result = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URI}/transactions/get-bulk`, {
				hashes
			});
			console.info(`${loggingTag} result:`, result.data);
			transactions = result.data.transactions;
		} catch(e){
			console.error(`${loggingTag} Error:`, e);
		}
		return transactions;
	}
	
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