import React, { Component } from "react";
import { InputField } from "../Elements/Basics";

class PasswordGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newPassword: "",
      repeatNewPassword: "",
      onPasswordsChange: (password, repeatPassword, error) => {}
    };
  }

  handlePassChange = event => {
    this.setState({ newPassword: event.target.value });
    this.props.onPasswordsChange(
      event.target.value,
      this.state.repeatNewPassword,
      this.state.repeatNewPassword !== event.target.value
        ? "Passwords must match"
        : ""
    );
  };
  handleRepeatPassChange = event => {
    this.setState({ repeatNewPassword: event.target.value });
    this.props.onPasswordsChange(
      this.state.newPassword,
      event.target.value,
      this.state.newPassword !== event.target.value ? "Passwords must match" : ""
    );
  };

  render() {
    return (
      <div>
        <InputField
          name="newPasswordField"
          type="password"
          placeholder="Super Secret"
          value={this.state.newPassword}
          onChange={this.handlePassChange}
          text="Password"
        />
        <InputField
          name="repeatNewPasswordField"
          type="password"
          placeholder="Repeat Super Secret"
          value={this.state.repeatNewPassword}
          onChange={this.handleRepeatPassChange}
        />
      </div>
    );
  }
}

export default PasswordGroup;
