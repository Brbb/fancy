import React, { Component } from "react";
import "./CreateAccount.css";
import auth from "../../services/auth/api";
import { Button, InputField, Message, SectionTitle } from "../Elements/Basics";
import PasswordGroup from "../Elements/PasswordGroup";

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

  handleUserChange = event => {
    this.setState({ username: event.target.value });
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
        <SectionTitle text="New Account" />
        <InputField
          name="emailField"
          placeholder="user@email.com"
          value={this.state.username}
          onChange={this.handleUserChange}
          text="Email"
        />
        <PasswordGroup
          onPasswordsChange={(newPassword, repeatPassword, error) => {
            this.setState({
              password: newPassword,
              repeatPassword: repeatPassword,
              error: error
            });
          }}
        />
        <Button
          name="create-button"
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
        <Button
          className="f-button"
          text="← Back"
          onClick={() => this.props.history.push("/")}
        />
        <Message text={this.state.error} success={this.state.error === ""} />
      </div>
    );
  }
}

export default CreateAccount;
