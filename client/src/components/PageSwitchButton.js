import { Box, Grid, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { theme } from "../themes/theme";

const useStyles = makeStyles(() => ({
  otherPageBox: {
    justifyContent: "flex-end",
    alignItems: "center",
    flexWrap: "nowrap",
  },
  otherPageButton: {
    color: theme.palette.primary.main,
    backgroundColor: "white",
    height: 55,
    minWidth: 155,
  },
}));

const PageSwitchButton = (props) => {
  const classes = useStyles();
  const { text, buttonText } = props;
  return (
    <Grid container spacing={2} className={classes.otherPageBox}>
      <Grid item>
        <Typography variant="body2" color="secondary">
          {text}
        </Typography>
      </Grid>
      <Grid item>
        <Button
          className={classes.otherPageButton}
          size="large"
          variant="contained"
          onClick={props.onClick}
        >
          {buttonText}
        </Button>
      </Grid>
    </Grid>
  );
};

export default PageSwitchButton;
