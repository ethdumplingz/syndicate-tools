import {IconButton, Tooltip} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";

const EditProjectBtn = (props) => {
	const {id} = props;
	return(
			<Link href={`/projects/${id}/edit`}>
				<Tooltip title={"Edit"}>
					<IconButton>
						<EditIcon/>
					</IconButton>
				</Tooltip>
			</Link>
		
	)
}
export default EditProjectBtn;