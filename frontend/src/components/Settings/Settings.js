import React, { Component } from "react";
import "./Settings.css";
import Security from "../Security/Security";
import General from "../General/General";
import { Button } from "../Elements/Elements";
import authApi from "../../services/auth/api";
import languageApi from "../../services/lang/api";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languages: [],
      error: "",
      currentComponent: "test",
      user: this.props.history.location.state.user
    };
  }

  async componentDidMount() {
    if (!authApi.isAuthorized()) this.props.history.push("/");

    let languages = languageApi.all();
    this.setState({ languages: languages });
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

  logout = async () => {
    localStorage.removeItem("jwt");
    await authApi.logout();
    this.props.history.push("/");
  };

  render() {
    let mainAreaComponent =
      this.state.currentComponent === "security" ? (
        <Security user={this.state.user} onUserSettingsChange={this.logout} />
      ) : (
        <General languages={this.state.languages} user={this.state.user} />
      );

    return (
      <div>
        <div className="f-sidenav">
          <Button
            className={
              "f-sidenav-button " +
              (this.state.currentComponent === "general" ? "f-active" : "")
            }
            text="General"
            onClick={() => this.setState({ currentComponent: "general" })}
          />
          <Button
            className={
              "f-sidenav-button " +
              (this.state.currentComponent === "security" ? "f-active" : "")
            }
            text="Security"
            onClick={() => this.setState({ currentComponent: "security" })}
          />
          <Button
            className="f-sidenav-button warning f-sidenav-logout"
            text="Logout"
            onClick={this.logout}
          />
        </div>
        <div className="f-main">{mainAreaComponent}</div>
      </div>
    );
  }
}

export default Settings;
