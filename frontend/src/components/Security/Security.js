import React, { Component } from "react";
import { Button, InputField, Message } from "../Elements/Elements";
import api from "../../services/users/api";
import { withRouter } from "react-router-dom";

class Security extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: "",
      newPassword: "",
      repeatNewPassword: "",
      outcome: { message: "", success: true },
    };
  }

  handleOldPasswordChange = event => {
    this.setState({ oldPassword: event.target.value });
  };

  handleNewPasswordChange = event => {
    this.setState({ newPassword: event.target.value });
  };

  handleRepeatNewPasswordChange = event => {
    if (this.state.newPassword !== event.target.value) {
      this.setState({ error: "Passwords must match" });
    } else {
      this.setState({ error: "" });
    }
    this.setState({ repeatNewPassword: event.target.value });
  };

  save = async () => {
    let result = await api.updatePassword(
      this.props.user,
      this.state.oldPassword,
      this.state.newPassword,
      this.state.repeatNewPassword
    );

    if (!result.err) {
      this.props.history.push("/");
    } else {
      this.setState({
        outcome: {
          message: result.err,
          success: false
        }
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
            type="password"
            placeholder="Old password"
            value={this.state.oldPassword}
            onChange={this.handleOldPasswordChange}
            text="Old Password"
          />
          <InputField
            type="password"
            placeholder="super secret"
            value={this.state.newPassword}
            onChange={this.handleNewPasswordChange}
            text="New Password"
          />
          <InputField
            type="password"
            placeholder="repeat super secret"
            value={this.state.repeatNewPassword}
            onChange={this.handleRepeatNewPasswordChange}
          />
          <Button
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
          <Message text={this.state.outcome.message} success={this.state.outcome.success} />
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
            className="f-button warning"
            text="Delete"
            onClick={this.delete}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(Security);
