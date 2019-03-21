import React from 'react';
import * as PropTypes from 'prop-types';

function Debug({ any }) {
  return <pre>{JSON.stringify(any, null, 2)}</pre>;
}

Debug.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  any: PropTypes.any,
};

Debug.defaultProps = {
  any: null,
};

export default Debug;
