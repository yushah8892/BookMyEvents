import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';

import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link as RouterLink, Redirect } from "react-router-dom";
import { useMutation, gql } from '@apollo/client';
import Error from '../components/Error';
import AuthContext from '../context/authConext'

const LOGIN = gql`
  mutation userLogin($email:String!,$password : String!) {
    login(email:$email,password : $password) {
      user {
        firstName
        lastName
      }
      userId
      token
      tokenExpiration
    }
  }
`;


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Book My Events
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => {
  return ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor:theme.palette.main
  },
})});


export default function AuthPage() {

  const authContext = React.useContext(AuthContext)
  //console.log('authContext',authContext)
  const [ login,{data}] = useMutation(LOGIN,{
    onCompleted:(data)=>{
        //console.log('data',data) 
        const {token,tokenExpiration,userId,user} = data.login
        authContext.login(token,tokenExpiration,userId,user.firstName,user.lastName)

    },
    onError: (error) =>{
      setIsError(true)
      setMessage(error.message)
    }
  })

  const classes = useStyles();
  const emailEl = React.useRef()
  const passEl = React.useRef()
  const [isError,setIsError] = useState(false)
  const [message,setMessage] = useState('')
  const handleLogin = (event) =>{
    login({ variables: { email:emailEl.current.value,password:passEl.current.value } })
    event.preventDefault()
    
  }

  if(data){
    return <Redirect to="/events" />
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleLogin}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            inputRef ={emailEl}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            inputRef={passEl}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          
          >
            Sign In
          </Button>
          <Grid container justify="flex-end">
            
            <Grid item>
              <Typography to="/signup" variant="body2" component={RouterLink}>
                {"Don't have an account? Sign Up"}
            </Typography>
            </Grid>
          </Grid>
        </form>
      </div>
      {
        isError ? 
          <Error severity="error" closeError={setIsError} message={message}/>
        : null
      }
      <Box mt={8}>
        <Copyright />
      </Box>
      
    </Container>
  );
}