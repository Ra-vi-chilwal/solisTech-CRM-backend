const jwt = require("jsonwebtoken");
require("dotenv").config()
module.exports = {
    verify: (req, res) => {
            try{
            var token = req.body.token;
         
            if (token) {
                var decodedJwt = jwt.decode(token, { complete: true });
               
                if (!decodedJwt) {
                    return res.status(401).json({
                        message: "Not a valid JWT token",
                    });
                }
                jwt.verify(token, process.env.TOKEN_KEY, function (err, payload) {
                    if (err) {
                        return res.status(401).json({
                            message: "Invaild Token",
                            body: err
                        })
                    } else {
                        return res.status(200).json({
                            code: "FETCHED",
                            body: {payload:payload, verify: true},
                        })
                    }
                })

            } else {
                console.log("err")
            }
        }catch(err) {console.log(err)}
        }

    

}