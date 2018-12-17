const jwt = require("jsonwebtoken");

module.exports = {
  handle: (req, res, next) => {
    if (req.url == "/api/auth") return next();

    var token = req.headers["authorization"];
    if (!token) {
      return res.status(403).send({
        success: false,
        message: "No token provided."
      });
    }
    // verifies secret and checks exp
    jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: "Failed to authenticate token."
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  }
};