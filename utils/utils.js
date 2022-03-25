const baseLoggingTag = `[UTILS]`;

export const sortArraysByProperty = ({array = [], property = ""} = {}) => {
	const loggingTag = `${baseLoggingTag}[sortArraysByProperty]`;
	let sortedArray = array;
	try{
		sortedArray = array.sort((a, b) => {//sorting by token_address
			let fa = a[property].toLowerCase(),
				fb = b[property].toLowerCase();
			
			if (fa < fb) {
				return -1;
			}
			if (fa > fb) {
				return 1;
			}
			return 0;
		});
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
	}
	
	return sortedArray;
}

export const mergeObjectArraysOnProperty = ({arrays = [] , property = ''} = {}) => {
	const loggingTag = `${baseLoggingTag}[mergeObjectArraysOnProperty]`
	let mergedArray = [];
	try {
		const [arr1, arr2] = arrays;
		
		mergedArray = arr1.map((item,i)=>{
			if(item[property] === arr2[i][property]){
				//merging two objects
				return Object.assign({},item,{transaction:arr2[i]})
			}
		});
	} catch(e){
		console.error(`${loggingTag} Error:`, e);
	}
	return mergedArray;
}