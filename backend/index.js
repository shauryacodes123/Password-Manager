const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config()
const bodyparser = require('body-parser')
const cors = require('cors')
app.use(cors())

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'PassOP';
const port = 3000;
app.use(bodyparser.json())
client.connect();

app.get('/', async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection('documents');
  const findResult = await collection.find({}).toArray();
  res.json(findResult)
})

app.post('/', async (req, res) => {
  const password = req.body
  const db = client.db(dbName);
  const collection = db.collection('documents');
  const findResult = await collection.insertOne(password);
  res.send({success: true, result: findResult})
})
app.delete('/', async (req, res) => {
  const password = req.body
  const db = client.db(dbName);
  const collection = db.collection('documents');
  const findResult = await collection.deleteOne(password);
  res.send({success: true, result: findResult})
})

// central error handler so crashes don't silently kill the process
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: err.message });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

