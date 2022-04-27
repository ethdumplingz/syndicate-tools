import {Box, TextField, IconButton} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

const ProjectSearchToolbar = (props) => {
	
	const {clearSearch = () => {}, value = '', onChange = () => {}} = props;
	return (
		<Box
			sx={{
				p: 0.5,
				pb: 0,
				mr: 2
			}}
		>
			<TextField
				variant="outlined"
				value={value}
				onChange={onChange}
				placeholder="Search…"
				InputProps={{
					startAdornment: <SearchIcon fontSize="small" />,
					endAdornment: (
						<IconButton
							title="Clear"
							aria-label="Clear"
							size="small"
							style={{ visibility: props.value ? 'visible' : 'hidden' }}
							onClick={clearSearch}
						>
							<ClearIcon fontSize="small" />
						</IconButton>
					),
				}}
				sx={{
					width: {
						xs: 1,
						sm: 'auto',
					},
					m: (theme) => theme.spacing(1, 0.5, 1.5),
					'& .MuiSvgIcon-root': {
						mr: 0.5,
					},
					'& .MuiInput-underline:before': {
						borderBottom: 1,
						borderColor: 'divider',
					},
				}}
			/>
		</Box>
	)
}

export default ProjectSearchToolbar;