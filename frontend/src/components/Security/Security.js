import React, { Component } from "react";
import { Button, InputField, Message } from "../Elements/Basics";
import PasswordGroup from "../Elements/PasswordGroup";
import api from "../../services/users/api";
import { withRouter } from "react-router-dom";

class Security extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: "",
      newPassword: "",
      repeatNewPassword: "",
      onUserSettingsChange: () => {},
      error: ""
    };
  }

  handleOldPasswordChange = event => {
    this.setState({ oldPassword: event.target.value });
  };

  save = async () => {
    let result = await api.updatePassword(
      this.props.user,
      this.state.oldPassword,
      this.state.newPassword,
      this.state.repeatNewPassword
    );

    // logout
    if (!result.err) {
      await this.props.onUserSettingsChange();
    } else {
      this.setState({
        error: result.err
      });
    }
  };

  delete = async () => {
    let result = await api.delete(this.props.user);
    if (!result.err) {
      await this.props.onUserSettingsChange();
    } else {
      this.setState({
        error: "User not deleted!"
      });
    }
  };

  render() {
    return (
      <div>
        <div className="f-section">
          <label className="f-section-title-no-margin">Change Password</label>
          <hr className="f-hr-section" />
          <InputField
            name="oldPasswordField"
            type="password"
            placeholder="Old password"
            value={this.state.oldPassword}
            onChange={this.handleOldPasswordChange}
            text="Old Password"
          />
          <PasswordGroup
            onPasswordsChange={(newPassword, repeatPassword, error) => {
              this.setState({
                newPassword: newPassword,
                repeatNewPassword: repeatPassword,
                error: error
              });
            }}
          />
          <Button
            name="save-button"
            className="f-submit-button"
            text="Save Changes"
            onClick={this.save}
            disabled={
              this.state.oldPassword === "" ||
              this.state.newPassword === "" ||
              this.state.repeatNewPassword === "" ||
              this.state.newPassword !== this.state.repeatNewPassword
            }
          />
          <Message text={this.state.error} success={this.state.error === ""} />
        </div>
        <div className="f-section">
          <label className="f-section-title-no-margin warning-text">
            Delete Account
          </label>
          <hr className="f-hr-section" />
          <p className="f-description">
            Once the deletion process begins you will not be able to access to
            your profile and saved settings.
          </p>
          <Button
            name="delete-button"
            className="f-button warning"
            text="Delete"
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to delete your profile?\n(You will be redirected to the login screen)"
                )
              )
                return this.delete();
            }}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(Security);
