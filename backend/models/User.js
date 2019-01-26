const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');
const isEmail = require('validator/lib/isEmail');

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [isEmail, 'Invalid email address'],
    required: 'Email address is required!',
  },
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
