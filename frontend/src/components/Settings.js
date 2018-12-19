import React, { Component } from "react";
import "./Settings.css";
import auth from "../services/auth/api";
import Security from "./Security";
import General from "./General";

class Settings extends Component {
  constructor() {
    super();
    this.state = {
      error: "",
      currentComponent: "test"
    };
  }

  componentDidMount() {
    if (!auth.isSignedIn()) this.props.history.push("/");
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
    var logoutResult = await auth.logout();
    if (logoutResult.success) this.props.history.push("/");
  };

  render() {
    let mainAreaComponent =
      this.state.currentComponent === "security" ? <Security /> : <General />;

    return (
      <div className="formContainer">
        <div className="sidenav">
          <input
            className="sidenavBtn"
            type="button"
            value="General"
            onClick={() => this.setState({ currentComponent: "general" })}
          />
          <input
            className="sidenavBtn"
            type="button"
            value="Security"
            onClick={() => this.setState({ currentComponent: "security" })}
          />
          <input
            className="bottomBtn sidenavBtn"
            type="button"
            value="Logout"
            onClick={this.logout}
          />
        </div>
        {mainAreaComponent}
      </div>
    );
  }
}

export default Settings;
