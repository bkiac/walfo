const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const tagsSchema = new Schema({
  array: [String],
});

tagsSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Tags', tagsSchema);
