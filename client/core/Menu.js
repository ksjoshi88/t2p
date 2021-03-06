import React from "react";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import HomeIcon from "material-ui-icons/Home";
import Button from "material-ui/Button";
import auth from "./../auth/auth-helper";
import { Link, withRouter } from "react-router-dom";

const isActive = (history, path) => {
  if (history.location.pathname == path) return { color: "#ffa726" };
  else return { color: "#ffffff" };
};
const Menu = withRouter(({ history }) => (
  <AppBar position="static">
    <Toolbar>
      <Typography type="title" color="inherit">
        TTP
      </Typography>
      <Link to="/">
        <IconButton aria-label="Home" style={isActive(history, "/")}>
          <HomeIcon />
        </IconButton>
      </Link>
      {!auth.isAuthenticated() && (
        <span>
          <Link to="/signup">
            <Button style={isActive(history, "/signup")}>Sign up</Button>
          </Link>
          <Link to="/signin">
            <Button style={isActive(history, "/signin")}>Sign In</Button>
          </Link>
        </span>
      )}
      {auth.isAuthenticated() && (
        <span>
          <span>
            {!auth.isAdmin() && (
              <span>
                <Link to={"/user/" + auth.isAuthenticated().user._id}>
                  <Button
                    style={isActive(
                      history,
                      "/user/" + auth.isAuthenticated().user._id
                    )}
                  >My Profile
                  </Button>
                </Link>
                <Link to={"/exchange"}>
                  <Button
                    style={isActive(
                      history,
                      "/exchange")}
                  >Exchange
                  </Button>
                </Link>
                <Link to={"/redeem"}>
                  <Button
                    style={isActive(
                      history,
                      "/redeem")}
                  >Redeem
                  </Button>
                </Link>
                <Link to={"/activity"}>
                  <Button
                    style={isActive(
                      history,
                      "/activity")}
                  >Activity
                  </Button>
                </Link>
              </span>
            )}

            {auth.isAdmin() && (
              <span>
                <Link to="/partner/add">
                  <Button style={isActive(history, "/partner/add")}>Partners</Button>
                </Link>
                <Link to="/redeem-partners">
                  <Button style={isActive(history, "/redeem-partners")}>Redeem Partners</Button>
                </Link>
              </span>
            )}
          </span>


          <Button
            color="inherit"
            onClick={() => {
              auth.signout(() => history.push("/"));
            }}
          >
            Sign out
          </Button>
        </span>
      )}
    </Toolbar>
  </AppBar >
));

export default Menu;
