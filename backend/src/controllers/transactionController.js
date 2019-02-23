const mongoose = require('mongoose');

const Transaction = mongoose.model('Transaction');

exports.createTransaction = async (req, res) => {
  const { user } = req;

  await Transaction.create({ user, ...req.body });

  res.status(201).send('New transaction created!');
};

exports.updateTransaction = async (req, res) => {
  const { id } = req.params;

  await Transaction.findOneAndUpdate({ _id: id }, req.body);

  res.status(200).send('Transaction updated!');
};

exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;

  await Transaction.deleteOne({ _id: id });

  res.status(200).send('Transaction deleted!');
};
