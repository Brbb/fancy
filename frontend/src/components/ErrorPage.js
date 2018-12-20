import React, { Component } from "react";
import "./ErrorPage.css";
import Mistake from "../assets/mistake.png";

class ErrorPage extends Component {
  render() {
    return (
      <div className="parent">
        <img src={Mistake} alt="mistake" />
      </div>
    );
  }
}

export default ErrorPage;
