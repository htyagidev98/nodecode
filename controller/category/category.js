const { json } = require("body-parser");
const Category = require("../../modles/category");
const User = require("../../modles/user");
const multer = require('multer');

Validator = require("validatorjs");
config = require("../../config"),
    moment = require("moment-timezone"),
    _ = require("lodash");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {

        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        filesize: 1024 * 1024 * 20
    },
    fileFilter: fileFilter
});

exports.categoryCreate = async (req, res) => {
    try {
    const rules = { category: "required" }
    const validation = new Validator(req.headers, rules);
    if (validation.fails()) {
        return res.status(422).json({ responseMessage: "Validation Error", responseData: validation.errors.all(), })
    } else {
        const { category } = req.headers;
        let checkData = await Category.findOne({ category: category });
        if (!checkData) {
            let data = await Category.create({ category: category });
            if (data) {
                upload.single('image')(req, res, (err) => {
                    let imagePath = req.file.filename;
                    if (err) {
                        return res.status(400).json({ responseMessage: "File Upload Error", responseData: {}, })
                    } else {
                        return res.status(200).json({
                            responseMessage: "Created Successfully", responseData: { data, imagePath: imagePath, },
                        })
                    }
                });
            } else {
                return res.status(400).json({ responseMessage: " Category Not Add! ", responseData: {}, })
            }
        } else {
            return res.status(422).json({ responseMessage: "Category All Ready Used", responseData: {}, })
        }
    }
    } catch (err) {
        return res.status(500).json({ responseMessage: "Internal Server Error", responseData: {} })
    }
};

exports.categoryList = async (req, res) => {
    try {
        const categories = await Category.find({});
        if (categories) {
            return res.status(200).json({ responseMessage: " Successfully", responseData: { categories } });
        } else {
            return res.status(404).json({ responseMessage: "Data Not Found!", responseData: {} })
        }
    } catch (error) {
        return res.status(500).json({ responseMessage: 'Internal server error', responseData: {} });
    }

};


