const customValidators = {
  isValidTxType(value) {
    return value === 'BUY' || value === 'SELL';
  },
};

module.exports = customValidators;
