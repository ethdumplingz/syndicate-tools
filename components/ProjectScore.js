import {Box, Grid, IconButton} from "@mui/material";
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
    const [vote, setVote] = useState(0);
    const [upvotes, setUpvotes] = useState(0);
    const [downvotes, setDownvotes] = useState(0);
    // console.info(`${componentLoggingTag} re render`);
    const {data: scoreResp} = useSWR(`/projects/get/${projectID}/score`, fetcher, {revalidateIfStale: false});
    useEffect(() => {
        console.info(`${componentLoggingTag} score resp`, scoreResp)
        if (typeof scoreResp === "object" && scoreResp.data.ok) {
            setScore(scoreResp.data.score.score);
            setUpvotes(scoreResp.data.score.upvotes);
            setDownvotes(scoreResp.data.score.downvotes);
            if (typeof onClick === "function") {
                onClick(scoreResp.data.score.score);
            }
        }
    }, [scoreResp]);

    const {data: voteResp} = useSWR(`/users/${address}/projects/${projectID}/vote`, fetcher, {revalidateIfStale: false});
    useEffect(() => {
        console.info(`${componentLoggingTag} vote resp`, voteResp)
        if (typeof voteResp === "object" && voteResp.data.ok) {
            setVote(voteResp.data.vote);
            if (typeof onClick === "function") {
                onClick(voteResp.data.vote);
            }
        }
    }, [voteResp]);

    const projectVote = async (userVote) => {
        const loggingTag = `${componentLoggingTag}[projectVote][${userVote === 1 ? "Upvote" : "Downvote"}]`;
        console.info(`${loggingTag} calling...`);
        if (typeof onClick === "function") {
            console.info(`${loggingTag} triggering onclick...`);
            onClick(userVote);
        }

        let newVote = userVote;
        if (userVote === 1) {
            newVote = vote === 1 ? 0 : 1;
        } else if (userVote === -1) {
            newVote = vote === -1 ? 0 : -1;
        }

        const reqBody = {
            user: address,
            project_id: projectID,
            vote: newVote
        }

        try {
            const voteResult = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URI}/users/projects/vote`, reqBody);
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
        <Grid container alignItems="center" columnSpacing={1}>
            <Grid item xs={5}>
                <Box
                  sx={{
                      border: `1px solid #cccccc`,
                      borderRadius: "50%",
                      height: "34px",
                      width: "34px",
                      color: "black",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                >
                    {score}
                </Box>
            </Grid>
            <Grid item xs={7}>
                <Grid container>
                    <Grid item>
                        <IconButton onClick={() => {projectVote(1)}} size="small" sx={{height: "15px"}}>
                            <ThumbUp
                                sx={{
                                    color: vote === 1 ? "black" : "gray",
                                    fontSize: 15
                                }}
                            />
                        </IconButton>
                        <span>{upvotes}</span>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={() => {projectVote(-1)}} size="small" sx={{height: "15px"}}>
                            <ThumbDown
                                sx={{
                                    color: vote === -1 ? "black" : "gray",
                                    fontSize: 15
                                }}
                            />
                        </IconButton>
                        <span>{downvotes}</span>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default ProjectScore;