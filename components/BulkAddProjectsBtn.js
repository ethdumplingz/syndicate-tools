import {Button} from "@mui/material";
import BulkAddIcon from "@mui/icons-material/LibraryAddOutlined";
import Link from "next/link";

const BulkAddProjectsBtn = (props) => {
	return(
		<Link href={"/projects/admins/bulk-add"}>
			<Button
				variant={"contained"}
				sx={{
					textTransform: "uppercase",
					borderRadius: "2px",
					pt: 1,
					pb: 1,
					pl: 2,
					pr: 2,
				}}
			>
				<BulkAddIcon size={"sm"} sx={{mr:1}}/>
				Bulk Add
			</Button>
		</Link>
	)
}

export default BulkAddProjectsBtn;