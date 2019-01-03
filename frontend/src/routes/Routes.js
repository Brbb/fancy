import React from "react";
import { Route, BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import Login from "../components/Login/Login";
import CreateAccount from "../components/CreateAccount/CreateAccount";
import Settings from "../components/Settings/Settings";
import ErrorPage from "../components/ErrorPage";
import auth from "../services/auth/api";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    auth.isAuthorized() === true
      ? <Component {...props} />
      : <Redirect to='/' />
  )} />
)

export default () => (
  <Router>
    <Switch>
      <Route path="/" exact component={Login} />
      <Route path="/new" component={CreateAccount} />
      <PrivateRoute path="/settings" component={Settings} />
      <Route component={ErrorPage} />
    </Switch>
  </Router>
);
