const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
    people: {
        type: String,
        required: true,
        default: ""
    },
    email: {
        type: String,
        required: true,
        default: ""
    },
    location: {
        type: String,
        required: true,
        default: ""
    },
    job: {
        type: String,
        required: true,
        default: ""
    },
    company: {
        type: String,
        required: true,
        default: ""
    },
    phone: {
        type: String,
        trim: true,
        min: 10,
        maxlength: 14,
    },
    category:{
        type:String,
        required:true,
        defalut:""
    }
},
    { timestamps: true, toJSON: true },
);
ContactSchema.set("toObject", { virtuals: true });
ContactSchema.set("toJSON", { virtuals: true });

const Contact = mongoose.model("Contact", ContactSchema, "Contact");
module.exports = Contact;
