import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import PersonAddOutlined from "@material-ui/icons/PersonAddOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link as RouterLink } from "react-router-dom";
import Error from "../components/Error";
import utils from "../utils/index";
import { useMutation, gql } from "@apollo/client";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Book My Events
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const SIGNUP = gql`
  mutation createUsers(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    createUsers(
      userInput: {
        firstName: $firstName
        lastName: $lastName
        email: $email
        password: $password
      }
    ) {
      _id
      email
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const [verror, setError] = useState(false);
  const [severity,setSeverity] = useState('success')
   const [signup,{data,loading,error}] = useMutation(SIGNUP, {
    onCompleted: (data) => {
      if(data.createUsers){
      setError(true);
      setSeverity("success")
      setErrorMessage("Signup Successful. Login to Book your Events.");
      setUserInfo({
        ...userInfo,
        firstName:'',
        lastName:'',
        email:'',
        password:''
      })
      }else{
      setError(true);
      setSeverity("error")
      setErrorMessage("Error in Signup. Try again Later.");
      }
    },
    onError: (err) => {
      setError(true);
      setSeverity("error")
      setErrorMessage(err.message);
    },
  }
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [userInfo, setUserInfo] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleOnChange = (event) => {
    setUserInfo({
      ...userInfo,
      [event.target.name]: event.target.value,
    });
  };
  const handelSignup = (event) => {
    event.preventDefault();
    if (!validateInput()) {
      return;
    }
    signup({
      variables: {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        password: userInfo.password,
      },
    });

  };

  const validateInput = () => {
    if (
      userInfo.firstName.trim().length === 0 ||
      userInfo.lastName.trim().length === 0
    ) {
      setError(true);
      setSeverity("error")
      setErrorMessage("First Name and Last Name field can not be empty.");
      return false;
    }
    if (!utils.validateEmail(userInfo.email)) {
      setError(true);
      setSeverity("error")
      setErrorMessage("Invalid Email. Please Enter Email in Correct Format.");
      return false;
    }
    return true;
  };
  if(loading){
   // console.log('in loading')
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <PersonAddOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={handelSignup}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={userInfo.firstName}
                onChange={handleOnChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                value={userInfo.lastName}
                onChange={handleOnChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={userInfo.email}
                onChange={handleOnChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={userInfo.password}
                onChange={handleOnChange}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Typography variant="body2" component={RouterLink} to="/auth">
                Already have an account? Sign in
              </Typography>
            </Grid>
          </Grid>
        </form>
      </div>
      {verror ? <Error severity={severity} closeError={setError} message={errorMessage} /> : null}
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
