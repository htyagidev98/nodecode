const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const ContactSchema = new Schema({
//     name: String,
//     email: String,
//     phone: String
// });

// const TableSchema = new Schema({
//     name: String,
//     contacts: [ContactSchema]
// });

// const CategorySchema = new Schema({
//     name: String,
//     tables: [TableSchema]
// });

// const ContactsSchema = new Schema({
//     category: String,
//     categories: [CategorySchema]
// },
//     { timestamps: true, toJSON: true },
// );
const ContactSchema = new Schema({
    fname: {
        type: String,
        required: true,
        default: ""
    },
    uname: {
        type: String,
        required: true,
        // unique: true,
        default: ""
    },
    birthday: {
        type: Date,
        required: true,
        default: ""
    },
    occupation: {
        type: String,
        required: true,
        default: ""
    },
    location: {
        type: String,
        required: true,
        default: ""
    },
    reminder: {
        type: String,
        required: true,
        default: ""
    },
    company: {
        type: String,
        required: true,
        default: ""
    },
    email: {
        type: String,
        required: true,
        default: ""
    },
    textarea: {
        type: String,
        required: true,
        default: ""
    }
    // tag: [{
    //     type: String,
    //     required: true,
    //     default: ""
    // }],
},
    { timestamps: true, toJSON: true },
);
ContactSchema.set("toObject", { virtuals: true });
ContactSchema.set("toJSON", { virtuals: true });

const Contact = mongoose.model("Contact", ContactSchema, "Contact");
module.exports = Contact;
