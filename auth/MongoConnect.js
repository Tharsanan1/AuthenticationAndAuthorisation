const mongoose = require('mongoose');


// Connect to MongoDB
let connect = function() {
    mongoose
    .connect(process.env.mongoUri, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));
}

module.exports = connect;