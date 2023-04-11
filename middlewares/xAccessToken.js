var config = require("./../config");
const jwt = require("jsonwebtoken");
const User = require("../modles/user")
var secret = config.secret;
//  global.loggedInUser = null;
module.exports = {
    token: async (req, res, next) => {
        let token = req.headers["token"];
        let uuid = req.headers["uuid"];
        if (token && uuid) {
            jwt.verify(token, config.secret, async (err, decoded) => {
                if (err) {
                    return res.status(400).json({ responseMessage: "Failed to authenticate token.", responseData: {}, });
                } else {
                    new Promise(async (resolve, reject) => {
                        var authenticate = await User.findOne({
                            _id: decoded.user,
                            device: { $elemMatch: { token: token } },
                            device: { $elemMatch: { uuid: uuid } },
                        }).exec();
                        if (authenticate) {
                            let data = await User.findOneAndUpdate(
                                { _id: decoded.user },
                                { $set: { updated_at: new Date() } },
                                { new: true }
                            ).clone();
                            if (!data) {
                                return res.status(400).json({ responseMessage: "Failed to authenticate token.", responseData: {}, });
                            };
                            // loggedInUser = decoded.user;
                            req.user = authenticate;
                            next();
                        } else {
                            return res.status(401).json({ responseMessage: "Unauthorized.", responseData: {}, });
                        }

                    });
                }
            });
        } else {
            return res.status(400).json({ responseMessage: "Failed to authenticate token.", responseData: {}, });
        }
    }
};

