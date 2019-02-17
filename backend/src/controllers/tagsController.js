const mongoose = require('mongoose');

const Transaction = mongoose.model('Transaction');
const Tags = mongoose.model('Tags');

exports.handleTags = async (req, res, next) => {
  const { user } = req;
  const { symbol, portfolio, tags } = req.body;

  let tagsDoc;
  // Query a tx with the same `user`, `symbol` and `portfolio` attributes.
  const txWithSamePosition = await Transaction.findOne({ user, symbol, portfolio });
  if (txWithSamePosition) {
    // If a position already exists - a corresponding `Tags` document must also exist -,
    // append the input tags to the existing array.
    tagsDoc = await Tags.findOneAndUpdate(
      { _id: txWithSamePosition.tags },
      { $addToSet: { array: tags } },
      { new: true },
    );
  } else {
    // If there were no positions for this type of tx, create a new `Tags` document.
    tagsDoc = await Tags.create({ array: tags });
  }
  // Replace the input `tags` array with the `Tags` document.
  req.body.tags = tagsDoc;

  next();
};
