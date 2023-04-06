const Contact = require("../../modles/contact")
const User = require("../../modles/user")
const { Stringify } = require("uuid");
const { JsonWebTokenError } = require("jsonwebtoken");
jwt = require("jsonwebtoken"),
    Validator = require("validatorjs"),
    uuidv1 = require("uuid").v1,
    config = require("../../config"),
    moment = require("moment-timezone"),
    _ = require("lodash");

exports.contactCreate = async (req, res) => {
    // try {
    const rules = {
        fname: "required", uname: "required", birthday: "required", occupation: "required", location: "required",
        reminder: "required", company: "required", email: "required", textarea: "required"
    }
    const validation = new Validator(req.body, rules);
    if (validation.fails()) {
        return res.status(422).json({ responseMessage: "Validation Error", responseData: validation.errors.all(), })
    } else {
        const { fname, uname, birthday, occupation, location, reminder, company, email, textarea } = req.body;
        // let user = await User.findById(req.user._id).lean();
        // console.log("testttt", user)
        // if (user) {

        let data = await Contact.create({
            fname: fname, uname: uname, birthday: birthday,
            occupation: occupation, location: location, reminder: reminder,
            company: company, email: email,
            textarea: textarea
        })
        return res.status(200).json({  responseMessage: "Contact Create Successfully", responseData: { data }, });
        // }
    }
    //     } catch (err) {
    //         return res.status(500).json({ responseMessage: "Internal Server Error", responseData: {} })
    //     }
}