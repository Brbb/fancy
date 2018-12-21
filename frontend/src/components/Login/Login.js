import React, { Component } from "react";
import "./Login.css";
import authApi from "../../services/auth/api";
import userApi from "../../services/users/api";
import {
  Button,
  InputField,
  Message,
  SectionTitle
} from "../Elements/Elements";
import { Link } from "react-router-dom";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      error: ""
    };
  }

  dismissError = () => {
    this.setState({ error: "" });
  };

  handleUserChange = event => {
    this.setState({ username: event.target.value });
  };
  handlePassChange = event => {
    this.setState({ password: event.target.value });
  };

  loadUser = async userId => {
    let user = await userApi.getById(userId);
    if (!user.err) {
      this.setState({ user: user });
      this.props.history.push({
        pathname: "/settings",
        state: { user: user }
      });
    } else {
      this.props.history.push("/error");
    }
  };

  login = async () => {
    var loginResult = await authApi.login(
      this.state.username,
      this.state.password
    ); // SSL
    if (!loginResult.err) {
      this.loadUser(loginResult.userId);
    } else {
      this.setState({ error: loginResult.err });
    }
  };

  render() {
    return (
      <div className="f-section bordered centered">
        <SectionTitle text="Login" />
        <InputField
          placeholder="user@email.com"
          value={this.state.username}
          onChange={this.handleUserChange}
          text="Email"
        />
        <InputField
          type="password"
          placeholder="super secret"
          value={this.state.password}
          onChange={this.handlePassChange}
          text="Password"
        />

        <Button
          className="f-submit-button"
          text="Login"
          onClick={this.login}
          disabled={this.state.username === "" || this.state.password === ""}
        />
        <Link to="/new">
          <Button className="f-button" text="Create new account" />
        </Link>
        <Message text={this.state.error} success={this.state.error === ""} />
      </div>
    );
  }
}

export default Login;
