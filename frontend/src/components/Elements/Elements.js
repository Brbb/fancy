import React from "react";
import "./Elements.css";
export function Button({ onClick, name, text, className, disabled }) {
  return (
    <input
      className={className}
      type="button"
      name={name}
      value={text}
      onClick={onClick}
      disabled={disabled}
    />
  );
}

export function Dropdown({ onChange, options, name, text, selected }) {
  const optionList = options.map(option => (
    <option key={option} value={option}>
      {option}
    </option>
  ));
  return (
    <div className="f-input">
      <label className="f-input-field-label">{text}</label>
      <select
        className="f-dropdown"
        name={name}
        onChange={onChange}
        value={selected}
      >
        {optionList}
      </select>
    </div>
  );
}

export function InputField({
  onChange,
  name,
  type,
  text,
  value,
  placeholder,
  disabled
}) {
  return (
    <div className="f-input">
      <label className="f-input-field-label">{text}</label>
      <input
        type={type}
        className="f-input-field"
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export function RadioButtonGroup({ onChange, options, checkedValue, label }) {
  const buttonGroup = options.map(option => (
    <div className="f-radio-button" key={option.value}>
      <label className="f-radio-label">
        <input
          key={option.value}
          type="radio"
          value={option.value}
          onChange={onChange}
          checked={checkedValue === option.value}
        />{" "}
        {option.text}
      </label>
    </div>
  ));
  return (
    <div className="f-radio-button-group">
      <label className="f-input-field-label">{label}</label>
      {buttonGroup}
    </div>
  );
}

export function Message({ text, success }) {
  const className = success ? "f-message-s" : "f-message-e";
  return <label className={"f-message " + className}>{text}</label>;
}
