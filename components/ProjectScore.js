import {Box, Grid, IconButton} from "@mui/material";
import axios from "axios";
import {useEffect, useState} from "react";
import {useSyndicateAuthenticationContext} from "./SyndicateAuthenticationProvider";
import useSWR from "swr";
import {ThumbDown, ThumbUp} from "@mui/icons-material";

const fetcher = async (url) => {
    const loggingTag = `[fetcher]`;
    try {
        // console.info(`${loggingTag} url: ${url}`);
        return await axios.get(`${process.env.NEXT_PUBLIC_BASE_URI}${url}`);
    } catch (e) {
        console.error(`${loggingTag} Error:`, e);
        throw e;
    }
}

const ProjectScore = (props) => {
    const {address} = useSyndicateAuthenticationContext();
    const {onClick, id: projectID, title = "", vote, score, upvotes, downvotes} = props;
    const componentLoggingTag = `[ProjectScore][proj: ${projectID}][proj name: ${title}]`;
    // console.info(`${componentLoggingTag} vote: ${vote}`, vote === -1);
    const [voteState, setVote] = useState(vote);
    const [scoreState, setScore] = useState(score);
    const [upvotesState, setUpvotes] = useState(upvotes);
    const [downvotesState, setDownvotes] = useState(downvotes);
    useEffect(() => {
        setVote(vote);
    }, [vote]);
    useEffect(() => {
        setScore(score);
    }, [score]);
    useEffect(() => {
        setUpvotes(upvotes);
    }, [upvotes]);
    useEffect(() => {
        setDownvotes(downvotes);
    }, [downvotes]);
    const projectVote = async (userVote) => {
        const loggingTag = `${componentLoggingTag}[projectVote][${userVote === 1 ? "Upvote" : "Downvote"}]`;
        console.info(`${loggingTag} calling...`);

        let newVote = userVote;
        if (userVote === 1) {
            newVote = voteState === 1 ? 0 : 1;
        } else if (userVote === -1) {
            newVote = voteState === -1 ? 0 : -1;
        }
  
        setVote(newVote);
        
        console.info(`${loggingTag} new vote status:`, voteState);
        
        const reqBody = {
            user: address,
            project_id: projectID,
            vote: newVote
        }

        try {
            const voteResult = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URI}/users/projects/vote`, reqBody);
            console.info(`${loggingTag} vote result`, voteResult);
            if (typeof voteResult === "object" && voteResult.data.ok) {
                setScore(voteResult.data.score.score);
                setUpvotes(voteResult.data.score.upvotes);
                setDownvotes(voteResult.data.score.downvotes);
                console.info(`${loggingTag} new vote status:`, vote);
            }
        } catch (e) {
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
                    {scoreState}
                </Box>
            </Grid>
            <Grid item xs={7}>
                <Grid container>
                    <Grid item>
                        <IconButton onClick={() => {projectVote(1)}} size="small" sx={{height: "15px"}}>
                            <ThumbUp
                                sx={{
                                    color: voteState === 1 ? "black" : "gray",
                                    fontSize: 15
                                }}
                            />
                        </IconButton>
                        <span>{upvotesState}</span>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={() => {projectVote(-1)}} size="small" sx={{height: "15px"}}>
                            <ThumbDown
                                sx={{
                                    color: voteState === -1 ? "black" : "gray",
                                    fontSize: 15
                                }}
                            />
                        </IconButton>
                        <span>{downvotesState}</span>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default ProjectScore;