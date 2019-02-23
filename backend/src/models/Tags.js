const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const tagsSchema = new Schema({
  array: [String],
});

tagsSchema.statics.addToSet = function addToSet(id, newTags) {
  return this.findOneAndUpdate({ _id: id }, { $addToSet: { array: newTags } }, { new: true });
};

tagsSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Tags', tagsSchema);
