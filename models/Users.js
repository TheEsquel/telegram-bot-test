const { Schema, model} = require('mongoose')

const schema = new Schema({
    chatId: {type: String, required: true, unique: true},
    right: {type: Number, default: 0},
    wrong: {type: Number, default: 0}
})

module.exports = model('User', schema)