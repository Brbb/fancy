import React, { Component } from "react";
import "./CreateAccount.css";
import auth from "../services/auth/api";

class CreateAccount extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      repeatPassword: "",
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
  handleRepeatPassChange = event => {
    if (this.state.password !== event.target.value) {
      this.setState({ error: "Passwords must match" });
    } else this.dismissError();
    this.setState({ repeatPassword: event.target.value });
  };

  signup = async () => {
    var signupResult = await auth.signup(
      this.state.username,
      this.state.password,
      this.state.repeatPassword
    );
    if (signupResult.success) {
      this.props.history.push("/");
    } else this.setState({ error: signupResult.reason });
  };

  render() {
    return (
      <div className="CreateAccount formContainer">
        <form className="form" onSubmit={this.handleSubmit}>
          <label className="formTitle">Fancy App</label>
          <label>Email</label>
          <input
            type="text"
            className="textField"
            placeholder="user@email.com"
            data-test="username"
            value={this.state.username}
            onChange={this.handleUserChange}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="super secret"
            data-test="password"
            className="textField"
            value={this.state.password}
            onChange={this.handlePassChange}
          />
          <input
            type="password"
            placeholder="repeat super secret"
            data-test="password"
            className="textField"
            value={this.state.repeatPassword}
            onChange={this.handleRepeatPassChange}
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
            value="Create New Account"
            onClick={this.signup}
            disabled={
              this.state.username === "" ||
              this.state.password === "" ||
              this.state.repeatPassword === "" ||
              this.state.error !== ""
            }
          />
        </form>
      </div>
    );
  }
}

export default CreateAccount;
