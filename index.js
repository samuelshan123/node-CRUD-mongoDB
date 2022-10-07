const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()
const port =3000

const URL = 'mongodb://localhost:27017'

MongoClient.connect(URL, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('students')
    const userCollection = db.collection('users')

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

    app.get('/', (req, res) => {
        userCollection.find().toArray()
        .then(result => {
          res.send(result)
        })
        .catch(error=>console.error(error))
    })

    app.post('/insert', (req, res) => {
      userCollection.insertOne(req.body)
        .then(result => {
          res.send(result)
        })
        .catch(error => console.error(error))
    })

    app.put('/update', (req, res) => {
      userCollection.findOneAndUpdate(
       req.body.condition,
        {
          $set: {
            name: req.body.name,
            age: req.body.age
          }
        },
        {
          upsert: true
        }
      )
        .then(result => res.send(result))
        .catch(error => console.error(error))
    })

    app.delete('/delete', (req, res) => {
      userCollection.deleteOne(
        { name: req.body.name }
      )
        .then(result => {
          if (result.deletedCount === 0) {
            return res.send('No user to delete')
          }
          res.send('Deleted successfully')
        })
        .catch(error => console.error(error))
    })

    app.listen(port, function () {
      console.log(`listening on ${port}`)
    })
  })
  .catch(console.error)