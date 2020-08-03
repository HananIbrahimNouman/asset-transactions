const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
      userAddress:{
        type: String,
        required: true,
      },
      assetAddress:{
        type: String,
        required: true,
      },
      hash: {
        type: String,
        required: true,
      },
      blockNumber: {
        type: Number,
        required: true,
      },
      from: {
        type: String,
        required: true,
      },
      to: {
        type: String,
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;