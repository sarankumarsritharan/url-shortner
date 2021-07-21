const express = require('express')
const shortId = require('shortid')
const createHttpError = require('http-errors')
const mongoose = require('mongoose')
const path = require('path')
const ShortUrl = require('./models/url.model')


const app = express()
app.use(express.static(path.join(__dirname, 'public'))) // settings as static
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

mongoose.connect('mongodb+srv://sarankumar:sarankumar@cluster0.wmylt.mongodb.net/test', {
        dbName: 'url-shortner',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }).then(() => console.log('mongoose is connected'))
    .catch((error) => console.log('error connect....'))

app.set('view engine', 'ejs')

app.get('/', async(req, res, next) => {
    res.render('index')
})

app.post('/', async(req, res, next) => {
    try {
        const { url } = req.body
        if (!url) {
            throw createHttpError.BadRequest('Give Proper Url')
        }
        const urlExists = await ShortUrl.findOne({ url })
        if (urlExists) {
            res.render('index', { short_url: `http://localhost:4000/${urlExists.shortId}` })
            return
        }
        const shortUrl = new ShortUrl({ url: url, shortId: shortId.generate() })
        const result = await shortUrl.save()
        res.render('index', { shortUrl: `http://localhost:4000/${result.shortId}` })
    } catch (error) {
        next(error)
    }
})

app.get('/:shortId', async(req, res, next) => {

    try {
        const { shortId } = req.params
        const result = await ShortUrl.findOne({ shortId })
        if (!result) {
            throw createHttpError.NotFound('shortUrl does not exist')
        }
        res.redirect(result.url)
    } catch (error) {
        nex(error)
    }

})
app.use((req, res, next) => {
    next((createHttpError.NotFound()))
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.render('index', { error: err.message })
})

app.listen('4000', () => {
    console.log("server listening on the port 4000 ")
})