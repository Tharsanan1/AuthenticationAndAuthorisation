const jwt = require('jsonwebtoken');

let authenticationFilter = function (req, res, next) {
    let token = req.cookies.Authorization;
    try {
        var decoded = jwt.verify(token, process.env.privateKey);
    } catch(err) {
        console.log("Authorization failed.", err);
        res.redirect("/login?parameters=<script>alert('wrong password or email.');</script>");
        return;
    }
    next();
    
}

module.exports = authenticationFilter;