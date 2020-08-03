const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const latestRecordSchema = new Schema({
    userAddress:{
        type: String,
        required: true,
      },
    assetAddress:{
      type: String,
      required: true,
    },
    lastFetchedBlockNumber: {
        type: Number,
        required: true,
    },
});

const LatestRecord = mongoose.model('LatestRecord', latestRecordSchema);

module.exports = LatestRecord;