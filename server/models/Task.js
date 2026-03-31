const mongoose = require('mongoose');

const userTasks= new mongoose.Schema({

    "title": {
        type: String,
        required: true
    },
    "notes": {
        type: String,
        required: false
    },
    "tags": {
        type: [String],
        default: []
    },
    "deadline": {
        type: Date
    },
    "priority": {
        type: String,
        enum: ['low', 'medium', 'high'],
        default:'medium'
    },
    "completed": {
        type: Boolean,
        default: false
    },
    "order": {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

}, {timestamps: true})

const Task= mongoose.model('Task', userTasks)
module.exports= Task;
