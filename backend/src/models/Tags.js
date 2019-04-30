const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const _ = require('lodash');

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const tagsSchema = new Schema({
  array: [String],
});

function unique(next) {
  this.array = _.uniq(this.array);
  next();
}

tagsSchema.pre('create', unique);
tagsSchema.pre('save', unique);

tagsSchema.statics.addToSet = function addToSet(id, newTags) {
  return this.findOneAndUpdate({ _id: id }, { $addToSet: { array: newTags } }, { new: true });
};

tagsSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Tags', tagsSchema);
