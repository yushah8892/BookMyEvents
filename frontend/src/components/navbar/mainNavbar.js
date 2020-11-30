import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Hidden, Menu, MenuItem } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { Link as RouterLink,withRouter } from "react-router-dom";
import AuthContext from '../../context/authConext'
const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
    justifyContent:'flex-end'

  },
  appBar: {
    backgroundColor: theme.palette.primary.main,
  },
  title:{
    flexGrow:1
  },
  linkHeaders: {
    
    marginLeft:theme.spacing(5),
    textDecoration: "none",
    color: "white",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  activeLink: {
    fontWeight: "bold",
    fontSize: 15,
  },
}));

const MainNavBar = (props) => {

  const authContext = React.useContext(AuthContext)
  
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.target);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const linkHeaders = React.useMemo(() => {
    return {
      Events: "/events",
      Bookings: "/bookings",
    };
  }, []);
  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" className={classes.title} noWrap>
  Welcome {`${authContext.firstName.toUpperCase()} ${authContext.lastName.toUpperCase()} !!` }
        </Typography>
        <Hidden only={["xs", "sm"]}>
          {Object.keys(linkHeaders).map((key,index) => (
            <Typography
              key={index}
              component={RouterLink}
              variant="button"
              className={
                props.location.pathname === linkHeaders[key]
                  ? `${classes.linkHeaders} ${classes.activeLink}`
                  : `${classes.linkHeaders}`
              }
              to={linkHeaders[key]}
            >
              {key}
            </Typography>

            
          ))}
              <Typography
              component={RouterLink}
              to={"/auth"} onClick={authContext.logout}
              variant="button"
              className={classes.linkHeaders}
              >
              Logout
            </Typography>
        </Hidden>
        <Hidden only={["md", "lg", "xl"]}>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {Object.keys(linkHeaders).map((key,index) => (
              <MenuItem
                key={index}
                component={RouterLink}
                to={linkHeaders[key]}
                onClick={handleClose}
                className={
                  props.location.pathname === linkHeaders[key]
                    ? `${classes.activeLink}`
                    : ``
                }
              >
                {key}
              </MenuItem>
            ))}
            <MenuItem   component={RouterLink}
                to={"/auth"} onClick={authContext.logout}>
                Logout
            </MenuItem>
          </Menu>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

export default withRouter(MainNavBar)