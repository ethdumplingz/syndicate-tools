import {GridToolbarContainer, GridToolbarFilterButton} from "@mui/x-data-grid";
import ProjectSearchToolbar from "./ProjectSearchToolbar";

const CustomGridToolBar = (props) => {
	const{value, onChange, clearSearch} = props;
	return(
		<GridToolbarContainer
			sx={{
				m:0
			}}
		>
			<ProjectSearchToolbar
				value={value}
				onChange={onChange}
				clearSearch={clearSearch}
			/>
			<GridToolbarFilterButton/>
		</GridToolbarContainer>
	)
}

export default CustomGridToolBar;