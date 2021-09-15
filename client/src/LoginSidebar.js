import { Box, Hidden, Grid, Typography, Icon } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { theme } from "./themes/theme";

const useStyles = makeStyles(() => ({
  root: {
    height: "100vh",
    display: "flex",
  },
  image: {
    backgroundColor: "lightyellow",
    width: 425,
    backgroundImage: "url('bg-img.png')",
    backgroundRepeat: "no-repeat",
    alignItems: "stretch",
  },
  colorOverlay: {
    minHeight: "100%",
    width: 425,
    backgroundImage:
      "linear-gradient(#3A8DFFD8 0%, #97C3FFD8 550px, #97C3FFFF 560px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  bubble: { alignSelf: "center", margin: 40 },
  text: {
    color: "white",
    textAlign: "center",
  },
}));

const LoginSidebar = (props) => {
  const classes = useStyles();
  return (
    <Grid direction="row" className={classes.root}>
      <Hidden smDown>
        <Box item xs={0} className={classes.image}>
          <Box className={classes.colorOverlay}>
            <Box className={classes.bubble}>
              <Icon>
                <img src={"bubble.svg"} />
              </Icon>
            </Box>
            <Box className={classes.text}>
              <Typography variant="h5">{"Converse with anyone"}</Typography>
              <Typography variant="h5">{"with any language"}</Typography>
            </Box>
            {/*dummy box so that text is centered*/}
            <Box className={classes.bubble} height={75}></Box>
          </Box>
        </Box>
      </Hidden>
      {props.children}
    </Grid>
  );
};

export default LoginSidebar;
