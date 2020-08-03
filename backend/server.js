const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const transactionsRouter = require('./routes/transactions');
const ATLAS_URI ='mongodb+srv://dbHanan:dbHananPASS@cluster0.raw8r.gcp.mongodb.net/test?retryWrites=true&w=majority'

//require('dotenv').config(); Need to be added

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

app.use('/transactions', transactionsRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});