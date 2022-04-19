const express = require('express')
const bodyParser = require('body-parser')
const assert = require("assert");
const path = require('path')
const {ObjectId} = require("mongodb");
const MongoClient = require('mongodb').MongoClient
const app = express()
const PORT = 3000
const dbUrl = 'mongodb://localhost:27017'
const dbName = 'samples'
let userName = "werner"

app.use(bodyParser.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json())

let quotes = null
let quote = null

function isEmpty(str) {
    let value =  !(str && str.trim() !== "")
    console.log(str + " === " + value)
    return value
}

MongoClient.connect(dbUrl)
    .then(client => {
        const db = client.db(dbName)
        const quotesCollection = db.collection('Quotes')

        app.get('/', (req, res) => {
            quotesCollection.find().toArray()
                .then((result => {
                    quotes = result
                    res.render('index.ejs', { quotes: quotes, quote: quote, username: userName })
                }))
                .catch(error => console.error(error))
        })

        app.get('/quotes', (req, res) => {
            quotesCollection.find().toArray()
                .then(result => {
                    res.send(result)
                })
                .catch(error => console.error(error))
        })

        app.put('/quotes', (req, res) => {
            let q = quotesCollection.findOne( {_id : ObjectId(req.body.id) })
                .then(result => {
                    quote = result
                    console.log(quote)
                    quotesCollection.findOneAndUpdate(
                        { _id: quote._id },
                        {
                            $inc: {
                                like: 1
                            },
                            $set: {
                                user: req.body.user
                            }
                        }
                    )
                        .then(result => {
                            console.log(result)
                            res.json("Success")
                        })
                        .catch(error => console.error(error))
                    // res.render('index.ejs', { quotes: quotes, quote: quote })
                })
                .catch(error => console.error(error))
        })

        app.post('/quotes', (req, res) => {
            console.log(req.body)
            if(!isEmpty(req.body.name) && !isEmpty(req.body.quote)) {
                quotesCollection.insertOne(req.body)
                    .then(result => {
                        console.log("Inserted" + result)
                    })
                    .catch(error => console.error(error))
            }
        })

        app.put('/username', (req, res) => {
            userName = req.body.user
            console.log(`CHanged username to ${userName}`)
            res.json("Success")
        })
    })
    .catch(console.error)



app.listen(PORT, () => {
    console.log(`Listing at Port ${PORT}`)
})