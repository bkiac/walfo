const mongoose = require('mongoose');

const Transaction = mongoose.model('Transaction');
const Tags = mongoose.model('Tags');

exports.createTags = async (req, res, next) => {
  const { user } = req;
  const { symbol, portfolio, tags } = req.body;

  let tagsDoc;
  // Query a tx with the same `user`, `symbol` and `portfolio` attributes.
  const txWithSamePosition = await Transaction.findOne({ user, symbol, portfolio });
  if (txWithSamePosition) {
    // If a position already exists - a corresponding `Tags` document must also exist -,
    // append the input tags to the existing array.
    tagsDoc = await Tags.addToSet(txWithSamePosition.tags, tags);
  } else {
    // If there were no positions for this type of tx, create a new `Tags` document.
    tagsDoc = await Tags.create({ array: tags });
  }
  // Replace the input `tags` array with the `Tags` document.
  req.body.tags = tagsDoc;

  next();
};

exports.updateTags = async (req, res, next) => {
  const { id } = req.params;
  const { tags } = req.body;

  const tx = await Transaction.findOne({ _id: id });
  req.body.tags = await Tags.addToSet(tx.tags, tags);

  next();
};

exports.deleteTags = async (req, res, next) => {
  const { id } = req.params;

  const { user, portfolio, symbol, tags } = await Transaction.findOne({ _id: id });
  const numOfTxsWithSameTags = await Transaction.countDocuments({ user, portfolio, symbol });
  if (numOfTxsWithSameTags === 1) {
    await Tags.deleteOne({ _id: tags });
  }

  next();
};
