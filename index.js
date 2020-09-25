require('dotenv-safe').config();

let connect = require("./auth/MongoConnect")
connect();


const User = require('./auth/db/models/User');
const newUser = new User({
  name: 'Red Panda'
})
newUser
  .save()
  .then(item => console.log(item))
  .catch(err => console.log(err));