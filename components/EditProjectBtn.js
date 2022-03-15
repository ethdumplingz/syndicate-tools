import {IconButton} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";

const EditProjectBtn = (props) => {
	const {id} = props;
	return(
		<Link href={`/projects/${id}/edit`}>
			<IconButton>
				<EditIcon/>
			</IconButton>
		</Link>
		
	)
}
export default EditProjectBtn;