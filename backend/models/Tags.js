const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const tagsSchema = new Schema({
  tags: [String],
});

tagsSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Tags', tagsSchema);
