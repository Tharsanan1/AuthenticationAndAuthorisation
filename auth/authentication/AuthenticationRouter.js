let userService = require('./../db/service/UserService');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const authCookieName = "Authorization"
const expiresInSeconds = 60 * 15;
const  options = {
    maxAge: 1000 * expiresInSeconds, // would expire after 15 minutes
    httpOnly: true, // The cookie only accessible by the web server
    signed: true // Indicates if the cookie should be signed
}

let signMeInRouter = function (req, res) {
    let password = req.body.password;
    let email = req.body.email;
    userService.findUserByEmail(email).then(function(result) {
        let authFlag = userService.isCorrectPassword(result, password);
        if (authFlag && process.env.privateKey) {
            const token = jwt.sign({ email : result.email, authorizationLevel : result.authorizationLevel, name : result.name }, process.env.privateKey, {expiresIn : expiresInSeconds});
            console.log("JWTToken", token);
            // Set cookie
            res.cookie(authCookieName, token, options); // options is optional
            res.redirect(307, '/home');
        }
    })

}

module.exports = signMeInRouter;