"use client";

import { memo } from 'react'; // Import memo
import PropTypes from 'prop-types';
import styles from './Button.module.css';
import classNames from 'classnames';

const ButtonComponent = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  isLoading = false,
  icon = null,
  trailingIcon = null,
  ...props
}) => {
  return (
    <button
      type={type}
      className={classNames(
        styles.button,
        styles[variant],
        styles[size],
        { [styles.loading]: isLoading }
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        icon && <span className={styles.icon}>{icon}</span>
      )}
      <span className={styles.label}>{children}</span>
      {!isLoading && trailingIcon && (
        <span className={styles.icon}>{trailingIcon}</span>
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  icon: PropTypes.node,
  trailingIcon: PropTypes.node,
};

Button.defaultProps = {
  type: 'button',
  variant: 'primary',
  size: 'medium',
  disabled: false,
  isLoading: false,
  icon: null,
  trailingIcon: null,
};

export const Button = memo(ButtonComponent);
