const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  authorizationLevel: {
    type: Number,
    required : true,
    default : 1
  }
});

const userModelName = 'user';
module.exports = {
  modelName : userModelName,
  model : mongoose.model(userModelName, UserSchema)
};