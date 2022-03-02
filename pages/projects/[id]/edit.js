import {useRouter} from "next/router";

const ProjectEditView = (props) => {
	const componentLoggingTag = `[ProjectEditView]`;
	const router = useRouter();
	const {id} = router.query;
	return (
		<div>project: {id}</div>
	)
}

export default ProjectEditView;