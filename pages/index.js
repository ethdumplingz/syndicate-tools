import { Box, Grid, Typography } from "@mui/material";
import {useRouter} from "next/router";
import {useEffect} from "react";
const Index = () => {
  const router = useRouter();
  
  useEffect( () => {
    router.redirect(`/projects/view`);
  }, []);
  
  
  return (
    <Box
      sx={{
        display: "flex",
        paddingTop: "50px"
      }}
    >
      <Grid
        container
        direction={"column"}
        alignItems={"stretch"}
      >
        {/*main content*/}
        <Grid
          item
          container
          direction={"column"}
          alignItems={"stretch"}
          rowSpacing={5}
          flexGrow={1}
        >
          <Grid
            item
            sx={{
              textAlign: "center"
            }}
          >
            <img src={require("../images/circle_stroke_logo.svg")} alt={"The Syndicate"} height={250} width={264}/>
          </Grid>
          <Grid
            item
            flexGrow={1}
            sx={{
              textAlign:"center"
            }}
          >
            <Typography
              variant={"h2"}
              sx={{
                fontWeight: 500,
                fontSize: {
                  xs: "1.8rem",
                  md: "2.3rem"
                },
                textAlign: "center",
                position: "relative",
                paddingBottom: "200px",
                maxWidth: "600px",
                margin: "0px auto",
                '&::after':{
                  content: "''",
                  position: "absolute",
                  top: "-24px",
                  bottom: "0px",
                  right: "0px",
                  left: "0px",
                  zIndex: -1,
                  backgroundImage: `url(${require("../images/light_grey_stroke.svg")})`,
                  backgroundSize: "100% auto",
                  backgroundRepeat: "no-repeat"
                }
              }}
            >Arsenal Incoming...</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Index;
