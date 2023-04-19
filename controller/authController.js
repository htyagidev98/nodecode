const User = require("../modles/user")
const { Stringify } = require("uuid");
const { JsonWebTokenError } = require("jsonwebtoken");
const nodemailer = require('nodemailer');
jwt = require("jsonwebtoken"),
    Validator = require("validatorjs"),
    uuidv1 = require("uuid").v1,
    bcrypt = require("bcryptjs"),
    config = require("../config"),
    moment = require("moment-timezone"),
    _ = require("lodash");

exports.signup = async (req, res) => {
    try {
        const rules = { name: "required", email: "required", password: "required" };
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        var validation = new Validator(req.body, rules);
        if (validation.fails()) {
            return res.status(422).json({ responseMessage: "Validation Error", responseData: validation.errors.all(), });
        } else {
            const { name, email, password } = req.body;
            if (regex.test(req.body.email)) {
                if (req.body.password.length >= 8) {
                    let checkEmail = await User.findOne({ email: email }).lean();
                    if (!checkEmail) {
                        bcrypt.hash(password, 10, async (err, hashPassword) => {
                            if (err) {
                                return res.status(422).json({ responseMessage: "Error Occured", responseData: {}, });
                            }
                            await User.create({
                                name: name, email: email, password: hashPassword, account_info: { status: "Active" }
                            });
                            return res.status(200).json({ responseMessage: "Registered Successfully", responseData: {}, });
                        })
                    } else {
                        return res.status(400).json({ responseMessage: "Email Already in Used", responseData: {}, })
                    }
                } else {
                    return res.status(422).json({ responseMessage: "Password should be min 8 length" })
                }

            } else {
                return res.status(422).json({ responseMessage: "Invalid email address ", responseData: {}, });
            }
        }
    } catch (err) {
        return res.status(500).json({ responseMessage: "Internal Server Error", responseData: {}, })
    }
};

exports.login = async (req, res) => {
    try {
        const rules = { email: "required", password: "required" };
        var validation = new Validator(req.body, rules);
        if (validation.fails()) {
            return res.status(422).json({ responseMessage: "Validation Error", responseData: validation.errors.all(), });
        } else {
            const { email, password } = req.body;
            let user = await User.findOne({ email: email }).lean();

            if (user) {
                if (user.account_info.status == "Active") {
                    if (!bcrypt.compareSync(password, user.password)) {
                        return res.status(400).json({ responseMessage: "Authentication failed. Wrong password", responseData: {}, });
                    } else {
                        const payload = { user: user._id, };
                        let token = jwt.sign(payload, config.secret,);
                        let uuid = uuidv1();

                        let deviceInfo = [];
                        deviceInfo = _.filter(user.device, (device) => device.uuid != uuid);
                        deviceInfo.push({
                            uuid: uuid,
                            token: token,
                        });

                        let userData = await User.findByIdAndUpdate({ _id: user._id, }, { $set: { device: deviceInfo } }, { new: false });
                        if (!userData) {
                            return res.status(422).json({ responseMessage: "Something wrong when updating data", responseData: {}, });
                        } else {
                            let userDetails = await User.findOne({ _id: user._id, }).lean();
                            return res.status(200).json({
                                responseMessage: "LoggedIn Successfully", responseData: {
                                    token: token,
                                    uuid: userDetails.device[0].uuid,
                                    userId: userDetails._id,
                                },
                            });
                        }
                    }
                } else {
                    return res.status(400).json({ responseMessage: "Account is not Active!", responseData: {}, });
                }
            } else {
                return res.status(404).json({ responseMessage: "User not found", responseData: {}, });
            }

        };
    } catch (err) {
        return res.status(500).json({ responseMessage: "Internal Server Error", responseData: {}, });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const rules = { email: "required" }
        var validation = new Validator(req.body, rules);
        if (validation.fails()) {
            return res.status(422).json({ responseMessage: "Validation Error", responseData: validation.errors.all(), })
        } else {
            const { email } = req.body;
            let user = await User.findOne({ email: email }).lean();
            if (user) {
                let otp = Math.floor(Math.random() * 9000) + 1000;
                var date = new Date();
                var expire = new Date(date.getTime() + 5 * 60000);
                let data = { auth: { otp: otp, expire: new Date(expire), created: date } };
                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'htyagistaple246@gmail.com',
                        pass: 'itrkewxqlnkamhej'
                    }
                });
                let info = await transporter.sendMail({
                    from: '"stapletest" <htyagistaple246@gmail.com>', // sender address
                    to: user.email, // list of receivers
                    subject: "Forgot Password OTP ", // Subject line
                    text: `Your OTP for forgot password is: ${otp}`,

                });

                let updateData = await User.findOneAndUpdate({ _id: user._id }, { $set: data }, { new: true });
                if (updateData) {
                    return res.status(200).json({ responseMessage: "OTP Genreated successfully", responseData: { id: user._id, otp: otp, info: info } });

                } else {
                    return res.status(400).json({ responseMessage: "Data not updating ", responseData: {}, });
                }
            } else {
                return res.status(400).json({ responseMessage: "User Not Found", responseData: {}, });
            }
        }
    } catch (err) {
        return res.status(500).json({ responseMessage: "Internal Server Error", responseData: {}, })
    }

};

exports.sendMail = async (req, res,) => {

    await nodemailer.createTestAccount();
    let user = await User.findById(req.user._id).lean();
    let useremail = user.email
    let otp = user.auth.otp
    // connect with the smtp
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'htyagistaple246@gmail.com',
            pass: 'ayliuwksnufgrobk'
        }
    });
    let info = await transporter.sendMail({
        from: '"stapletest" <htyagistaple246@gmail.com>', // sender address
        to: useremail, // list of receivers  simple@199999  ayliuwksnufgrobk
        subject: "Forgot Password OTP ", // Subject line
        text: `Your OTP for forgot password is: ${otp}`,
        // html: "<b>Hello YT Thapa</b>", // html body

    });
    if (info.messageId) {

        return res.status(200).json({ responseMessage: "mail has send", responseData: { info: info.messageId } });
    } else {

        return res.status(400).json({ responseMessage: "mail has not send", responseData: {} });
    }

};

exports.otpVerification = async (req, res) => {
    console.log('otp frontend', req.body)
    try {
        const rules = { email: "required", otp: "required" }
        var validation = new Validator(req.body, rules);
        if (validation.fails()) {
            return res.status(422).json({ responseMessage: "Validation Error", responseData: validation.errors.all(), })
        } else {
            const { email, otp } = req.body;
            let user = await User.findOne({ email: email }).lean();
            if (user) {
                let checkOtp = await User.findOne({ email: user.email, 'auth.otp': otp, "auth.expire": { $gte: new Date() } }).lean();////"auth.expire": { $gt: new Date() }
                if (checkOtp) {
                    let data = { auth: { otp: null, expire: null, created: null } };
                    let updateData = await User.findOneAndUpdate({ email: user.email }, { $set: data }, { new: true });
                    if (updateData) {
                        return res.status(200).json({ responseMessage: "OTP Verified successfully", responseData: {}, });
                    } else {
                        return res.status(400).json({ responseMessage: "Data not Updating", responseData: {}, });
                    }
                } else {
                    return res.status(422).json({ responseMessage: "Otp Invalid or Expired", responseData: {}, });
                }
            } else {
                return res.status(400).json({ responseMessage: "User Not Found", responseData: {}, });
            }
        }
    } catch (err) {
        return res.status(500).json({ responseMessage: "Internal Server Error", responseData: {}, })
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const rules = { password: "required", confirm_password: "required" }
        var validation = new Validator(req.body, rules);
        if (validation.fails()) {
            return res.status(422).json({ responseMessage: "Validation Error", responseData: validation.errors.all(), })
        }
        const { password, confirm_password } = req.body;
        if (req.body.password.length >= 8) {
            if (password !== confirm_password) {
                return res.status(400).json({ responseMessage: 'Password  Not Match' });
            } else {
                let user = await User.findById(req.user._id).lean();
                if (user) {
                    let newhash = bcrypt.hashSync(password, 10);
                    if (!newhash) {
                        return res.status(422).json({ responseMessage: "Error Occured while generating hash!", responseData: {}, });
                    } else {
                        let newData = await User.findOneAndUpdate({ _id: user._id }, { $set: { password: newhash } }, { new: true });
                        if (!newData) {
                            return res.status(422).json({ responseMessage: "Data not Updateing!", responseData: {}, });

                        } else {
                            return res.status(200).json({ responseMessage: "Password Create Successfully", responseData: {}, });
                        }
                    };

                } else {
                    return res.status(400).json({ responseMessage: "User Not Found", responseData: {}, });
                };
            }
        } else {
            return res.status(400).json({ responseMessage: "Password should be minimum 8 Digites", responseData: {}, });
        }
    } catch (err) {
        return res.status(500).json({ responseMessage: "Internal Server Error", responseData: {}, })
    }

};


