const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ShortUrlSchema = new Schema({
    url: {
        type: String,
        required: true,
    },
    shortId: {
        type: String,
        required: true,
    },
    //collection : shortUrl
})

const ShortUrl = mongoose.model('shortUrl', ShortUrlSchema) //collection:shortUrl

module.exports = ShortUrl