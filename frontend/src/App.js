import React, { useState } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "./App.css";
import AuthPage from "./pages/Auth";
import BookedEvents from "./components/bookedEvents";
import EventPage from "./pages/Events";
import MainNavBar from "./components/navbar/mainNavbar";
import {
  fade,
  ThemeProvider,
  withStyles,
  makeStyles,
  createMuiTheme,
} from "@material-ui/core/styles";
import SignUp from "./pages/Signup";
import { ApolloProvider } from "@apollo/client";
import client from "./apollo/index";
import AuthContext from "./context/authConext";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#731a01",
    },
  },
});

function App() {
  const [authInfo, setAuthInfo] = useState({
    token: "",
    tokenExpiration: "",
    userId: "",
    firstName:"",
    lastName:""
  });
  const login = (token, tokenExpiration, userId,firstName,lastName) => {
    setAuthInfo({
      ...authInfo,
      token: token,
      tokenExpiration: tokenExpiration,
      userId: userId,
      firstName:firstName,
      lastName:lastName
    });
    localStorage.setItem('token',token)
  };
  const logout = () => {
    setAuthInfo({
      ...authInfo,
      token: "",
      tokenExpiration: "",
      userId: "",
      firstName:"",
      lastName:""
    });
    localStorage.removeItem('token')
  };
  return (
    <BrowserRouter>
      <AuthContext.Provider
        value={{
          token: authInfo.token,
          tokenExpiration: authInfo.tokenExpiration,
          userId: authInfo.userId,
          login: login,
          logout: logout,
          firstName:authInfo.firstName,
          lastName:authInfo.lastName
        }}
      >
        <ApolloProvider client={client}>
          <ThemeProvider theme={theme}>
            <Switch>
              {!authInfo.token && <Redirect from="/" to="/auth" exact />}
              {!authInfo.token && (
                <Route exact path="/auth" component={LoginContainer} />
              )}
              {!authInfo.token && (
                <Route exact path="/signup" component={LoginContainer} />
              )}
              {authInfo.token && <Route component={DefaultContainer} />}
            </Switch>
          </ThemeProvider>
        </ApolloProvider>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}
const LoginContainer = () => (
  <div>
    <Route path="/auth" component={AuthPage} />
    <Route path="/signup" component={SignUp} />
  </div>
);

const DefaultContainer = () => (
  <div className="container">
    <MainNavBar />
    <Route path="/events" component={EventPage} />
    <Route path="/bookings" component={BookedEvents} />
  </div>
);

export default App;
