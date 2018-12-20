import React, { Component } from "react";
import "./CreateAccount.css";
import auth from "../../services/auth/api";
import { Button, InputField, Message } from "../Elements/Elements";

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
    if (this.state.repeatPassword !== event.target.value) {
      this.setState({ error: "Passwords must match" });
    } else this.dismissError();
    this.setState({ password: event.target.value });
  };
  handleRepeatPassChange = event => {
    if (this.state.password !== event.target.value) {
      this.setState({ error: "Passwords must match" });
    } else this.dismissError();
    this.setState({ repeatPassword: event.target.value });
  };

  signup = async () => {
    var result = await auth.signup(
      this.state.username,
      this.state.password,
      this.state.repeatPassword
    );
    if (!result.err) {
      this.props.history.push("/");
    } else this.setState({ error: result.err });
  };

  render() {
    return (
      <div className="f-section bordered centered">
        <label className="f-section-title">Fancy App</label>
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
        <InputField
          type="password"
          placeholder="repeat super secret"
          value={this.state.repeatPassword}
          onChange={this.handleRepeatPassChange}
        />
        <Button
          className="f-submit-button"
          text="Create New Account"
          onClick={this.signup}
          disabled={
            this.state.username === "" ||
            this.state.password === "" ||
            this.state.repeatPassword === "" ||
            this.state.error !== ""
          }
        />
        <Message text={this.state.error} success={this.state.error === ""} />
      </div>
    );
  }
}

export default CreateAccount;
