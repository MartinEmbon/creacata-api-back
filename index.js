// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv= require("dotenv")

// Create an Express app
const app = express();

dotenv.config({path:".env"})
const port = process.env.PORT || 8080


// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema and model for your data
const counterSchema = new mongoose.Schema({
  count: { type: Number, default: 0 },
});
const Counter = mongoose.model('Counter', counterSchema);

// Define routes
app.get('/api/counter', async (req, res) => {
  const counter = await Counter.findOne();
  res.json(counter);
});



app.post('/api/counter', async (req, res) => {
  let counter = await Counter.findOne();
  if (!counter) {
    counter = new Counter();
  }
  counter.count += 1;
  await counter.save();
  res.json(counter);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
