"use client";

import { memo } from 'react'; // Import memo
import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./Input.module.css";

const InputComponent = ({
  type = "text",
  value,
  onChange,
  placeholder = "",
  size = "medium",
  icon = null,
  trailingIcon = null,
  error = false,
  disabled = false,
  name,
  ...props
}) => {
  return (
    <div
      className={classNames(
        styles.container,
        styles[size],
        { [styles.error]: error, [styles.disabled]: disabled }
      )}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        name={name}
        className={styles.input}
        {...props}
      />
      {trailingIcon && (
        <span className={styles.trailingIcon}>{trailingIcon}</span>
      )}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  icon: PropTypes.node,
  trailingIcon: PropTypes.node,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  name: PropTypes.string,
};

Input.defaultProps = {
  type: "text",
  placeholder: "",
  size: "medium",
  icon: null,
  trailingIcon: null,
  error: false,
  disabled: false,
  name: undefined,
};

export const Input = memo(InputComponent);
