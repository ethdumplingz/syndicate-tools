import {Badge, Chip, IconButton, Tooltip} from "@mui/material";
import axios from "axios";
import {useEffect, useState} from "react";
import {useSyndicateAuthenticationContext} from "./SyndicateAuthenticationProvider";
import useSWR from "swr";
import {ThumbDown, ThumbUp} from "@mui/icons-material";

const fetcher = async (url) => {
    const loggingTag = `[fetcher]`;
    try {
        console.info(`${loggingTag} url: ${url}`);
        return await axios.get(`${process.env.NEXT_PUBLIC_BASE_URI}${url}`);
    } catch (e) {
        console.error(`${loggingTag} Error:`, e);
        throw e;
    }
}

const ProjectScore = (props) => {
    const {address} = useSyndicateAuthenticationContext();
    const {onClick, id: projectID, title = ""} = props;
    const componentLoggingTag = `[ProjectScore][proj: ${projectID}][proj name: ${title}]`;

    const [score, setScore] = useState(0);
    const [vote, setVote] = useState(null);
    const [upvotes, setUpvotes] = useState(0);
    const [downvotes, setDownvotes] = useState(0);

    const {data: scoreResp} = useSWR(`/projects/get/${projectID}/score`, fetcher, {revalidateIfStale: true});
    useEffect(() => {
        console.info(`${componentLoggingTag}`, scoreResp)
        if (typeof scoreResp === "object" && scoreResp.data.ok) {
            setScore(scoreResp.data.score.score);
            setUpvotes(scoreResp.data.score.upvotes);
            setDownvotes(scoreResp.data.score.downvotes);
            if (typeof onClick === "function") {
                onClick(scoreResp.data.score.score);
            }
        }
    }, [scoreResp]);

    const {data: voteResp} = useSWR(`/users/${address}/projects/${projectID}/vote/latest`, fetcher, {revalidateIfStale: true});
    useEffect(() => {
        console.info(`${componentLoggingTag}`, voteResp)
        if (typeof voteResp === "object" && voteResp.data.ok) {
            setVote(voteResp.data.vote);
            if (typeof onClick === "function") {
                onClick(voteResp.data.vote);
            }
        }
    }, [voteResp]);

    const projectVote = (action) => async (e) => {
        const loggingTag = `${componentLoggingTag}[${action}]`;
        if (typeof onClick === "function") {
            console.info(`${loggingTag} triggering onclick...`);
            onClick(action);
        }

        let newVote = action;
        if (action === "upvote") {
            newVote = vote === "upvote" ? "unvote" : "upvote";
        } else if (action === "downvote") {
            newVote = vote === "downvote" ? "unvote" : "downvote";
        }

        const reqBody = {
            user: address,
            project_id: projectID,
            action: newVote
        }

        try {
            const voteResult = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URI}/users/projects/actions/vote`, reqBody);
            if (typeof scoreResp === "object" && voteResult.data.ok) {
                setVote(newVote);
                setScore(voteResult.data.score.score);
                setUpvotes(voteResult.data.score.upvotes);
                setDownvotes(voteResult.data.score.downvotes);
                console.info(`${loggingTag} new vote status:`, vote);
            }
        } catch (e) {
            if (typeof onClick === "function") {
                onClick(vote);
            }
            console.error(`${loggingTag} Error:`, e);
        }
    }

    return (
        <span>
            <Tooltip title="Downvote project">
                <IconButton onClick={projectVote("downvote")}>
                    <Badge badgeContent={downvotes} color="error" anchorOrigin={{vertical: 'top', horizontal: 'left'}}>
                        <ThumbDown
                            sx={{
                                color: vote === "downvote" ? "black" : "gray"
                            }}
                        />
                    </Badge>
                </IconButton>
            </Tooltip>
            <Chip label={score} variant="outlined" color="primary"/>
            <Tooltip title="Upvote project">
                <IconButton onClick={projectVote("upvote")}>
                    <Badge badgeContent={upvotes} color="success">
                        <ThumbUp
                            sx={{
                                color: vote === "upvote" ? "black" : "gray"
                            }}
                        />
                    </Badge>
                </IconButton>
            </Tooltip>
        </span>
    )
}

export default ProjectScore;