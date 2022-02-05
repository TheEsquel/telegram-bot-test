const { Schema, model} = require('mongoose')

const schema = new Schema({
    id: { type: Number, required: true, unique: true},
    chatId: {type: String, required: true, unique: true},
    right: {type: Number},
    wrong: {type: Number}
})

module.exports = model('User', schema)