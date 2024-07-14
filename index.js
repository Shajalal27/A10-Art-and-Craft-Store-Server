const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//midleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jisai8k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)
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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const artCollection = client.db('artcraftDB').collection('addCraft');
    const categoriesCollection = client.db('artcraftDB').collection('categories');
    const itemsCollection = client.db('artcraftDB').collection('items');


    app.get('/addCraft', async(req, res) =>{
      const cursor = artCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/addCraft/:id', async(req, res) =>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)}
      const result = await artCollection.findOne(query);
      res.send(result);
    })

     //subcategory
    app.get('/categories', async (req, res) =>{
      const categories = await categoriesCollection.find().toArray();
      res.send(categories);
    })

    app.get('/categories/:subcategory', async (req, res) =>{
      const{subcategory} = req.params;
      const items = await artCollection.find({subcategory_name:subcategory}).toArray();
      res.send(items);
    })

    app.get('/addCraft/:id', async (req, res) =>{
      const { id } = req.params;
      const item = await artCollection.findOne({_id: parseInt(id)});
      res.send(item);
    })


    app.post('/addCraft', async(req, res) =>{
      const newCratItem = req.body;
      console.log(newCratItem);
      const result = await artCollection.insertOne(newCratItem);
      res.send(result);
    })

    app.put('/addCraft/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options ={upsert: true};
      const updateCraftItem = req.body;
      const updateCraft = {
        $set: {
          photo: updateCraftItem.photo, 
          item_name: updateCraftItem.item_name, 
          subcategory_name: updateCraftItem.subcategory_name, 
          description: updateCraftItem.description,
          price: updateCraftItem.price,
          rating: updateCraftItem.rating,
          customization: updateCraftItem.customization,
          processing_time: updateCraftItem.processing_time,
          name: updateCraftItem.name,
          email: updateCraftItem.email,
          stockStatus: updateCraftItem.stockStatus
        }
      }
      const result = await artCollection.updateOne(filter, updateCraft, options);
      res.send(result);
    })

    app.delete('/addCraft/:id', async(req, res) =>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)}
      const result = await artCollection.deleteOne(query);
      res.send(result);
    })

   
    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('Art and Craft Server is runing')
})

app.listen(port, () =>{
    console.log(`Art and craft Server is runing on Port: ${port}`)
})