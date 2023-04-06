const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const SubPageSchema = new Schema({
    name: String,
    content: String
});

const PageSchema = new Schema({
    name: String,
    subpages: [SubPageSchema]
});

const CategorySchema = new Schema({
    name: String,
    pages: [PageSchema]
});

const NotesSchema = new Schema({
    category: String,
    categories: [CategorySchema]
},
    { timestamps: true, toJSON: true },
);

NotesSchema.set("toObject", { virtuals: true });
NotesSchema.set('toJSON', { virtuals: true });

const Notes = mongoose.model("Notes", NotesSchema, "Notes");
module.exports = Notes;

