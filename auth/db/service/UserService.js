let UserModel = require('./../models/User').model;
const cryptoRandomString = require('crypto-random-string');
const crypto = require('crypto');
const saltLength  = 10;
const minPasswordLength = 8;

// Save a User. Returns a promise. If success resolve with true, otherwise reject with error.
const save = function(user) {
    return new Promise(function (resolve, reject) {
        try {
            let { hashedPassword, salt} = hashPassword(user);
            user.password = hashedPassword;
            user.salt = salt;
            const userModel = new UserModel(user);
            userModel.save(function(err){
                if (err) {
                    reject(err);
                }
                else {
                    resolve(true);
                }
            })
        } catch (err) {
            reject(err);
        }
    }); 
}

/**
Find a user with a specific email and update the data.
 */
const findByEmailAndUpdate = function (user) {
    return new Promise(function(resolve, reject){
        try {
            if(!user.email) {
                reject(new Error("Empty email submitted."))
            }
            if (user.password) {
                let { hashedPassword, salt} = hashPassword(user);
                user.password = hashedPassword;
                user.salt = salt;
            }
            else {
                user.salt = undefined;
            }

            UserModel.findOneAndUpdate({ email : user.email}, user, {
                    new: true
                }, function (err, result) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
            });
        }
        catch (err) {
            reject(err);
        }
    }); 
}

/**
Find a user with a specific email.
 */
const findUserByEmail = function(email) {
    return new Promise(function(resolve, reject) {
        if (!email) {
            reject(new Error("Empty email."));
        }
        else {
            UserModel.findOne({email : email}, function(err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            })
        }
    })
}

const shasum = crypto.createHash('sha512');
const digest = 'hex';

/**
Generate a random string with @saltLength and return its hash and the generated salt.
 */
function hashPassword(user) {
    let passwordPlainString = user.password;
    if (passwordPlainString === undefined || passwordPlainString === '' || passwordPlainString === null || passwordPlainString.length < minPasswordLength) {
        throw new Error("Password does not meet required constraints.")
    }
    let salt = cryptoRandomString({length: saltLength});
    shasum.update(passwordPlainString + salt);
    let hashedPassword = shasum.digest(digest);
    return {
        hashedPassword,
        salt
    }
}

/**
Check whether the password and salt is valid for the hash. 
 */
let isCorrectPassword = function (user, plainPassword) {
    if (!user.salt) {
        throw new Error("User salt is empty");
    }
    shasum.update(plainPassword + user.salt);
    let hashedPassword = shasum.digest(digest);
    if (hashedPassword === user.password) {
        return true;
    }
    return false;
}

module.exports = {
    save,
    findUserByEmail,
    findByEmailAndUpdate,
    isCorrectPassword
}