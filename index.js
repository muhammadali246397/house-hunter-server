const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = 3000
require('dotenv').config()
const cors = require('cors')

app.use(cors())
app.use(express.json())

// console.log(`${process.env.DB_user},${process.env.DB_Password}`)



const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_Password}@cluster0.rfaan6v.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const database = client.db('house-hunter')
    const userCollection = database.collection('userCollection')

    app.get('/', (req, res) => {
      res.send('create server')
    })

  app.post('/saveInfo',async(req, res) => {
    const info = req.body
    console.log(info)
    const query = {email:info.email}
    const user = await userCollection.findOne(query)
    if(user){
      return res.send('email allready used')
    }else{
      const result = await userCollection.insertOne(info);
      res.send(result)
    }
  })

  app.get('/getUser', async(req, res) => {
    const {email, password} = req.query
    const query = {email:email}
    const user = await userCollection.findOne(query);
    if(user?.email !== email){
      return res.send({message:'worng email'})
    }else if(user?.password !== password){
      return res.send({message:'worng password'})
    }else{
      res.send(user)
    }
  })



    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   
  }
}
run().catch(console.dir);



// app.get('/', (req, res) => {
//     res.send('create server')
//   })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})