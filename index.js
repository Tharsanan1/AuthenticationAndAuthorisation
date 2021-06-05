require('dotenv-safe').config();
const express = require('express');
const app = express();
const port = process.env.port;

const cookieParser = require('cookie-parser');
app.use(cookieParser())

// Parse request body
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

/**
Connect to the database.
 */
let connect = require("./auth/MongoConnect")
connect();

// Server login page. 
app.use('/login', express.static('auth/Login'));

// Server login attempt
const signMeInRouter = require('./auth/authentication/AuthenticationRouter');
app.use('/signMeIn', signMeInRouter);

// Authentication filter
const authenticationFilter = require('./auth/authentication/AuthenticationFilter');
app.use(authenticationFilter);

// Authorization filter.

app.get("/home", function(req, res) {
  res.send("Welcome to Home...");
});

let userService = require("./auth/db/service/UserService");
// userService.save({
//     name: "test11",
//     password : "testtesttest",
//     email : "kurahulasingam.tharsanan@enactor.co.uk"
//   })
//   .then(function(result) {
//     console.log("Saved....");
//   })
//   .catch(function(err) {
//     console.log("Failed to save. ", err);
//   });

// userService.findByEmailAndUpdate({
//     email : "tharsanan",
//     name : "kuru"
//   }).then(function(result) {
//     console.log('Successfully updated',result);
//   }).catch(function(err) {
//     console.log("Failed to update.",err);
//   })

// userService.findUserByEmail("tharsanan").then(function(result) {
//   console.log(result);
// }).catch(function(err) {
//   console.log(err);
// }) 

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})