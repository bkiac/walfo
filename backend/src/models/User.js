const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

userSchema.virtual('password').set(function setPasswordHash(value) {
  this.passwordHash = bcrypt.hashSync(value, 12);
});

userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
