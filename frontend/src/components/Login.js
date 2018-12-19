import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import auth from "../services/auth/api";

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

  login = async () => {
    var loginResult = await auth.login(
      this.state.username,
      this.state.password
    ); // SSL
    if (!loginResult.err) {
      this.props.history.push("/settings");
    } else {
      this.setState({ error: loginResult.err });
    }
  };

  render() {
    return (
      <div className="Login formContainer">
        <form className="form" onSubmit={this.handleSubmit}>
          <label className="formTitle">Fancy App</label>
          <label className="textFieldLabel">Email</label>
          <input
            type="text"
            className="textField"
            placeholder="user@email.com"
            data-test="username"
            value={this.state.username}
            onChange={this.handleUserChange}
          />

          <label className="textFieldLabel">Password</label>
          <input
            type="password"
            placeholder="super secret"
            data-test="password"
            className="textField"
            value={this.state.password}
            onChange={this.handlePassChange}
          />
          {this.state.error && (
            <label
              className="loginError"
              data-test="error"
              onClick={this.dismissError}
            >
              {this.state.error}
            </label>
          )}
          <input
            className="submitBtn"
            type="button"
            value="Log In"
            onClick={this.login}
            disabled={this.state.username === "" || this.state.password === ""}
          />
          <button className="genericBtn">
            <Link to="/new">Create New Account</Link>
          </button>
        </form>
      </div>
    );
  }
}

export default Login;
