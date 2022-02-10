const { Schema, model} = require('mongoose')

const TagSchema = new Schema({
    tag_id: { type: Number, unique: true, required: true},
    name: {type: String, unique: true, required: true }
})

const MemeSchema = new Schema({
    message_id: {type: String, required: true, unique: true},
    file_id: {type: String, unique: true},
    tags: {type: TagSchema},
    rating: {type: Number, default: 0},
    voices: {type: Number, default: 0},
    plus: {type: Number, default: 0},
    minus: {type: Number, default: 0},

})

module.exports = model('Meme', MemeSchema)