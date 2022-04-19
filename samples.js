const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const url = 'mongodb://localhost:27017'
const dbName = 'samples'

const findDocuments = function(db, callback) {
    const collection = db.collection('Quotes')
    collection.find({}).toArray((err, docs) => {
        assert.equal(err, null)
        console.log('Found the following records')
        console.log(docs)
        callback(docs)
    })
}

const client = new MongoClient(url)
client.connect((err) => {
    assert.equal(err, null)
    console.log('Connected to th DB Server')
    const db = client.db(dbName)
    findDocuments(db, () => {
        client.close()
    })
})
