import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
  FormHelperText,
} from "@material-ui/core";
import { register } from "./store/utils/thunkCreators";
import { theme } from "./themes/theme";
import { makeStyles } from "@material-ui/core/styles";
import LoginSidebar from "./LoginSidebar";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  otherPageBox: {
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
  const { user, register } = props;
  const [formErrorMessage, setFormErrorMessage] = useState({});

  const handleRegister = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setFormErrorMessage({ confirmPassword: "Passwords must match" });
      return;
    }

    await register({ username, email, password });
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
              Already have an account?
            </Typography>
          </Box>
          <Button
            className={classes.otherPageButton}
            size="large"
            variant="contained"
            onClick={() => history.push("/login")}
          >
            Login
          </Button>
        </Box>
        <Box className={classes.formBox}>
          <form onSubmit={handleRegister}>
            <Box display="flex" flexDirection="column" justifyContent="center">
              <Box my={4} mx={2}>
                <Typography variant="h5">
                  <Box fontWeight="fontWeightBold">Create an account.</Box>
                </Typography>
              </Box>
              <FormControl>
                <Box m={2}>
                  <TextField
                    fullWidth
                    aria-label="username"
                    label="Username"
                    name="username"
                    type="text"
                    required
                  />
                </Box>
              </FormControl>
              <FormControl>
                <Box m={2}>
                  <TextField
                    fullWidth
                    label="E-mail address"
                    aria-label="e-mail address"
                    type="email"
                    name="email"
                    required
                  />
                </Box>
              </FormControl>
              <FormControl error={!!formErrorMessage.confirmPassword}>
                <Box m={2}>
                  <TextField
                    fullWidth
                    aria-label="password"
                    label="Password"
                    type="password"
                    inputProps={{ minLength: 6 }}
                    name="password"
                    required
                  />
                  <FormHelperText>
                    {formErrorMessage.confirmPassword}
                  </FormHelperText>
                </Box>
              </FormControl>
              <FormControl error={!!formErrorMessage.confirmPassword}>
                <Box m={2}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    aria-label="confirm password"
                    type="password"
                    inputProps={{ minLength: 6 }}
                    name="confirmPassword"
                    required
                  />
                  <FormHelperText>
                    {formErrorMessage.confirmPassword}
                  </FormHelperText>
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
                  Create
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
    register: (credentials) => {
      dispatch(register(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
