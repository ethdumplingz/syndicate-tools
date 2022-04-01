import {Box} from "@mui/material";

import {UserPortfolioProvider} from "../../components/UserPortfolioProvider";
import ProfitLossGrid from "../../components/ProfitLossGrid";

const ProfitLossView = (props) => {
	const componentLoggingTag = `[ProfitLossView]`;
	console.info(`${componentLoggingTag} mounted!`);
	return (
		<UserPortfolioProvider>
			<ProfitLossGrid/>
		</UserPortfolioProvider>
	)
}

export default ProfitLossView;