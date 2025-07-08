// src/components/Input.jsx
import React from 'react';
import './Input.css';

const Input = ({ type, placeholder, value, onChange, required }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="input"
    />
  );
};

export default Input;
