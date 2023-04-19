const Contact = require("../../modles/contact")
const User = require("../../modles/user")
const Category = require("../../modles/category")
jwt = require("jsonwebtoken"),
    Validator = require("validatorjs"),
    uuidv1 = require("uuid").v1,
    config = require("../../config"),
    moment = require("moment-timezone"),
    _ = require("lodash");

exports.contactCreate = async (req, res) => {
    try {
    const rules = {
        people: "required", email: "required", location: "required", job: "required",
        company: "required", phone: "required", category: "required"
    }
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const validation = new Validator(req.body, rules);
    if (validation.fails()) {
        return res.status(422).json({ responseMessage: "Validation Error", responseData: validation.errors.all(), })
    } else {
        const { people, email, location, job, company, phone, category } = req.body;
        if (regex.test(req.body.email)) {
            if (req.body.phone.length >= 10 && req.body.phone.length <= 14) {
                // let checkData = await Contact.findById(req.user._id).lean();
                let checkData = await Contact.findOne({ email: email }).lean();

                if (!checkData) {
                    // let user = await User.findById(req.user._id).lean();
                    // console.log("testttt", user)
                    // if (user) {
                    let data = await Contact.create({
                        people: people, email: email, location: location,
                        job: job, company: company, phone: phone, category: category
                    })
                    return res.status(200).json({ responseMessage: "Contact Create Successfully", responseData: { data }, });
                } else {
                    return res.status(400).json({ responseMessage: "Mail EXist!", responseData: {}, })
                }
            } else {
                return res.status(422).json({ responseMessage: "PhoneNumber Length Min 10 and max 14", responseData: {} })
            }
        } else {
            return res.status(422).json({ responseMessage: "Invalid Email", responseData: {} })

        }
    }
        } catch (err) {
            return res.status(500).json({ responseMessage: "Internal Server Error", responseData: {} })
        }
};


exports.contactList = async (req, res) => {
    try {
    const { category } = req.query;
    const categoryName = await Category.findOne({ category: category })
    if (categoryName) {
        const contactList = await Contact.find({ category: category });
        if (contactList && contactList.length > 0) {
            const contactData = [];
            contactList.forEach(contact => {
                const contactObj = {
                    people: contact.people,
                    email: contact.email,
                    phone: contact.phone,
                    location: contact.location,
                    job: contact.job,
                    company: contact.company
                };
                contactData.push(contactObj);
            });
            return res.status(200).json({ responseMessage: "successfull", responseData: { contactList: contactData } })
        } else {
            return res.status(404).json({ responseMessage: "Data Not Found", responseData: {} })
        };
    } else {
        return res.status(400).json({ responseMessage: " Category Not Exist!", responseData: {} })
    }
    } catch (err){
        return res.status(500).json({ responseMessage: "Internal Server Error", responseData: {} })
    }
};

