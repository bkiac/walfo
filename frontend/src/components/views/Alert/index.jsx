import { Paper } from '@material-ui/core';
import React from 'react';
import * as PropTypes from 'prop-types';
import style from './style.module.scss';

function Alert({ success, error, warning, children }) {
  let color;
  if (success) color = style.success;
  if (error) color = style.error;
  if (warning) color = style.warning;

  const className = `${color} ${style.padding}`;
  return <Paper className={className}>{children}</Paper>;
}

Alert.propTypes = {
  success: PropTypes.bool,
  error: PropTypes.bool,
  warning: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Alert.defaultProps = {
  success: false,
  error: false,
  warning: false,
};

export default Alert;
