const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    name: String,
    description: String
});

const TasksSchema = new Schema({
    tasks: [TaskSchema]
},
    { timestamps: true, toJSON: true },
);

TasksSchema.set("toObject", { virtuals: true });
TasksSchema.set('toJSON', { virtuals: true });


const Tasks = mongoose.model('Tasks', TasksSchema);
module.exports = Tasks;
