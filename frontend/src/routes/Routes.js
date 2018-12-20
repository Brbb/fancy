import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import Login from "../components/Login/Login";
import CreateAccount from "../components/CreateAccount/CreateAccount";
import Settings from "../components/Settings/Settings";
import ErrorPage from "../components/ErrorPage";

export default () => (
  <Router>
    <div>
      <Route path="/" exact component={Login} />
      <Route path="/new" exact component={CreateAccount} />
      <Route path="/settings" exact component={Settings} />
      <Route path="/error" component={ErrorPage} />
    </div>
  </Router>
);
