let userService = require('./../db/service/UserService');
const jwt = require('jsonwebtoken');

const authCookieName = "Authorization"
const expiresInSeconds = 60 * 15;
const  options = {
    maxAge: 1000 * expiresInSeconds, // would expire after 15 minutes
    httpOnly: true, // The cookie only accessible by the web server
    signed: false // Indicates if the cookie should be signed
}

let signMeInRouter = function (req, res) {
    let password = req.body.password;
    let email = req.body.email;
    userService.findUserByEmail(email).then(function(result) {
        let authFlag = result && userService.isCorrectPassword(result, password);
        if (authFlag && process.env.privateKey) {
            const token = jwt.sign({ email : result.email, authorizationLevel : result.authorizationLevel, name : result.name }, process.env.privateKey, {expiresIn : expiresInSeconds});
            // Set cookie
            res.cookie(authCookieName, token, options); // options is optional
            res.redirect('/home');
        }
        else {
            res.redirect("/login");
        }
    })

}

module.exports = signMeInRouter;