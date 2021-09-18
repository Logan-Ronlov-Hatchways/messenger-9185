import { Box, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { theme } from "../themes/theme";

const useStyles = makeStyles(() => ({
  otherPageBox: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
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
    <Box className={classes.otherPageBox}>
      <Box mx={2}>
        <Typography variant="body2" color="secondary">
          {text}
        </Typography>
      </Box>
      <Button
        className={classes.otherPageButton}
        size="large"
        variant="contained"
        onClick={props.onClick}
      >
        {buttonText}
      </Button>
    </Box>
  );
};

export default PageSwitchButton;
