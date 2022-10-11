const express = require('express')
const bodyParser = require('body-parser')
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const app = express()
const port =3000
const cors =require('cors')

app.use(cors({
  origin:'*'
}))

const URL = 'mongodb://localhost:27017'

MongoClient.connect(URL, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('students')
    const userCollection = db.collection('users')

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

    app.get('/getUsers', async (req, res) => {
      await  userCollection.find().toArray((err,result)=>{
          if(err) throw err
          res.send(result)
   })
    })

    app.post("/getUser", async (req,res)=>{
      console.log(req.body);
     await userCollection.findOne({_id:new mongodb.ObjectId(req.body.id)},(err,result)=>{
            if(err) throw err
            res.send(result)
     })
    })
    // await userCollection.findOne({_id:req.body.id})
    //   .then(result => {
    //     res.send(result)
    //   })
    //   .catch(error=>console.error(error))
    // })

    app.post('/insert',async (req, res) => {
    await  userCollection.insertOne(req.body,(err,result)=>{
        if(err) throw err
        res.send(result)
 })
    })

    app.post('/update', async (req, res) => {
      console.log(req.body);
    await  userCollection.findOneAndUpdate(
   {_id:new mongodb.ObjectId(req.body.id)},
        {
          $set: {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            profile: req.body.profile,

          }
        },
        {
          upsert: true
        },
        (err,result)=>{
          if(err) throw err
          res.send(result)
   })
    })

    app.post('/delete',async (req, res) => {
      console.log(req.body);
    await  userCollection.deleteOne(
      {_id:new mongodb.ObjectId(req.body.id)},
        (err,result)=>{
          if(err) throw err
          res.send(result)
   })
    })

    app.listen(port, function () {
      console.log(`listening on ${port}`)
    })
  })
  .catch(console.error)