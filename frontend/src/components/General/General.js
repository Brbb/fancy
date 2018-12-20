import React, { Component } from "react";
import {
  Dropdown,
  RadioButtonGroup,
  Button,
  Message
} from "../Elements/Elements";
import { withRouter } from "react-router-dom";
import userApi from "../../services/users/api";

class General extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outcome: { message: "", success: true },
      privacyOptions: [
        { text: "Private", value: "private" },
        { text: "Public", value: "public" }
      ]
    };
  }

  save = async () => {
    let result = await userApi.update(this.props.user);
    if (!result.err) {
      this.setState({ outcome: { message: "Settings saved!", success: true } });
    } else
      this.setState({
        outcome: {
          message: "Error while saving your settings.",
          success: false
        }
      });
  };

  handleLanguageSettingChange = event => {
    var editableUser = this.props.user;
    editableUser.settings.language = event.target.value;
    this.setState({ user: editableUser });
  };

  handlePrivacySettingChange = event => {
    var editableUser = this.props.user;
    editableUser.settings.isPrivate = event.target.value === "private";
    this.setState({ user: editableUser });
  };

  render() {
    return (
      <div className="f-section">
      <label className="f-section-title-no-margin">Preferences</label>
          <hr className="f-hr-section" />
        <Dropdown
          options={this.props.languages}
          text="Language"
          onChange={this.handleLanguageSettingChange}
          selected={this.props.user.settings.language}
        />

        <RadioButtonGroup
          options={this.state.privacyOptions}
          label="Privacy"
          checkedValue={
            this.props.user.settings.isPrivate ? "private" : "public"
          }
          onChange={this.handlePrivacySettingChange}
        />
        <Button
          className="f-submit-button"
          text="Save changes"
          onClick={this.save}
        />
        <Message
          text={this.state.outcome.message}
          success={this.state.outcome.success}
        />
      </div>
    );
  }
}

export default withRouter(General);
