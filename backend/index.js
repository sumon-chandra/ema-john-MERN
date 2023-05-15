const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB configuration

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lh1oos6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Database connection
    const productsCollection = client.db("ema_johnDB").collection("products");

    //   Get Products
    app.get("/products", async (req, res) => {
      const query = req.query;
      const page = parseInt(query.page) || 0;
      const limit = parseInt(query.limit) || 10;
      const skip = page * limit;
      const result = await productsCollection
        .find()
        .skip(skip)
        .limit(limit)
        .toArray();
      res.send(result);
    });
    app.get("/totalProducts", async (req, res) => {
      const result = await productsCollection.estimatedDocumentCount();
      res.send({ totalProducts: result });
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Ema John is running !!!!");
});

app.listen(port, () => {
  console.log("Ema John is listening on port " + port);
});
