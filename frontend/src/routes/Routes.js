import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import Login from "../components/Login";
import CreateAccount from "../components/CreateAccount";
import Settings from "../components/Settings";

export default () => (
  <Router>
    <div>
      <Route path="/" exact component={Login} />
      <Route path="/new" exact component={CreateAccount} />
      <Route path="/settings" exact component={Settings} />
    </div>
  </Router>
);
