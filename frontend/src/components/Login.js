import React, { Component } from "react";
import "./Login.css";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      error: ""
    };
  }
  render() {
    return (
      <div className="Login">
      <label>Fancy App</label>
        <form className="form" onSubmit={this.handleSubmit}>
          {this.state.error && (
            <h3 data-test="error" onClick={this.dismissError}>
              <button onClick={this.dismissError}>✖</button>
              {this.state.error}
            </h3>
          )}
          <label>User Name</label>
          <input
            type="text"
            data-test="username"
            value={this.state.username}
            onChange={this.handleUserChange}
          />

          <label>Password</label>
          <input
            type="password"
            data-test="password"
            value={this.state.password}
            onChange={this.handlePassChange}
          />

          <input type="submit" value="Log In" data-test="submit" />
        </form>
      </div>
    );
  }
}

export default Login;
