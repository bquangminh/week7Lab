let mongoose = require('mongoose')

let developerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    level: {
        type: String,
        enum: ['Beginner', 'Expert']
    },
    address: {
        state: String,
        suburb: String,
        street: String,
        unit: Number
    }
})

module.exports = mongoose.model('Developer', developerSchema)