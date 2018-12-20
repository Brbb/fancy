import React, { Component } from "react";
import "./General.css";

const languages = [
  "English",
  "French",
  "German",
  "Japanese",
  "Chinese",
  "Korean",
  "Thai"
];

class Security extends Component {
  render() {
    return (
      <div>
        <form className="form" onSubmit={this.handleSubmit}>
          <label className="textFieldLabel">Language</label>
          <select className="langDropdown">
            {languages.map(language => {
              return (
                <option key={language} value={language}>
                  {language}
                </option>
              );
            })}
          </select>
          <label className="textFieldLabel">Privacy</label>
          <div className="radioGroup">
            <label className="radioButton">
              <input type="radio" name="gender" value="public" />
              Public
            </label>
            <label className="radioButton">
              <input type="radio" name="gender" value="private" />
              Private
            </label>
          </div>

          <input
            className="submitBtn generalSubmitBtn"
            type="button"
            value="Save changes"
            onClick={this.login}
          />
        </form>
      </div>
    );
  }
}

export default Security;
