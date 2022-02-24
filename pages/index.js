import { Box, Container, Grid, Typography } from "@mui/material";

const Index = () => {
  return (
    <Box>
      <Container
        maxWidth={"lg"}
        sx={{
          height: "100vh"
        }}
      >
        <Grid
          container
          direction={"column"}
          alignItems={"stretch"}
        >
          <Grid
            item
            container
            justifyContent={"space-between"}
            sx={{
              padding: "20px 0px",
              marginBottom: "20px"
            }}
          >
            <Grid item>
              <Typography
                variant={"h1"}
                sx={{
                  fontSize: "1.2rem"
                }}
              >Syndicate893</Typography>
            </Grid>
          </Grid>
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
                  fontSize: "2.3rem",
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
      </Container>
    </Box>
  )
}

export default Index;
