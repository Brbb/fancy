import React from "react";
import { Route, BrowserRouter as Router } from 'react-router-dom'
import Login from '../components/Login';

export default () =>
  <Router>
    <Route path="/" exact component={Login} />
  </Router>;
  