import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
} from "@material-ui/core";
import { login } from "./store/utils/thunkCreators";
import { theme } from "./themes/theme";
import { makeStyles } from "@material-ui/core/styles";
import LoginSidebar from "./LoginSidebar";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    //backgroundColor: "orange",
  },
  otherPageBox: {
    //backgroundColor: "lightgreen",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  otherPageButton: {
    color: theme.palette.primary.main,
    backgroundColor: "white",
    height: 55,
  },
  loginButton: {
    height: 55,
    width: 150,
  },
  formBox: {
    alignSelf: "center",
    width: "300px",
  },
}));

const Login = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { user, login } = props;

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    await login({ username, password });
  };

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <LoginSidebar>
      <Box m={1} className={classes.root}>
        <Box className={classes.otherPageBox}>
          <Box mx={2}>
            <Typography variant="body2" color="secondary">
              {"Don't have an account?"}
            </Typography>
          </Box>
          <Button
            className={classes.otherPageButton}
            size="large"
            variant="contained"
            onClick={() => history.push("/register")}
          >
            Create account
          </Button>
        </Box>
        <Box className={classes.formBox}>
          <form onSubmit={handleLogin}>
            <Box display="flex" flexDirection="column" justifyContent="center">
              <Box my={4} mx={2}>
                <Typography variant="h5">
                  <Box fontWeight="fontWeightBold">Welcome Back!</Box>
                </Typography>
              </Box>
              <FormControl required>
                <Box m={2}>
                  <TextField
                    fullWidth
                    aria-label="username"
                    label="Username"
                    name="username"
                    type="text"
                  />
                </Box>
              </FormControl>
              <FormControl required>
                <Box m={2}>
                  <TextField
                    fullWidth
                    label="password"
                    aria-label="password"
                    type="password"
                    name="password"
                  />
                </Box>
              </FormControl>
              <Box m={4} alignSelf="center" alignItems="center" display="flex">
                <Button
                  color="primary"
                  type="submit"
                  variant="contained"
                  size="large"
                  className={classes.loginButton}
                >
                  Login
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </LoginSidebar>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (credentials) => {
      dispatch(login(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
