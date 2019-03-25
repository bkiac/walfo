const mongoose = require('mongoose');

const Transaction = mongoose.model('Transaction');

exports.createTransaction = async (req, res) => {
  const { user } = req;

  const tx = await Transaction.create({ user, ...req.body });

  res.status(201).send(tx);
};

exports.updateTransaction = async (req, res) => {
  const { id } = req.params;

  const tx = await Transaction.findOneAndUpdate({ _id: id }, req.body, { new: true });

  res.status(200).send(tx);
};

exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;

  const tx = await Transaction.findOneAndDelete({ _id: id });

  res.status(200).send(tx);
};
