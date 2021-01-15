const mongoose = require('mongoose')
const Schema = mongoose.Schema
const monSchema = new Schema ({
    property:  {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('items', monSchema)