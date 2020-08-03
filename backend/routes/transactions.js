const router = require('express').Router();
const Transaction = require('../models/transaction.model');
const LatestRecord = require('../models/latestRecord.model');

//using metamask from frontend for now.
//let Web3 = require("web3");
//const web3 = new Web3('https://mainnet.infura.io/v3/ca1a29fe66dd40dbbc2b5cc2d7fda17c');


router.route('/:assetAddress/:userAddress').get(async (req, res) => {
  const {userAddress, assetAddress} = req.params;
 try{

    const LatestRecordInfo = await LatestRecord.findOne({
        userAddress,
        assetAddress
      })
    

    const savedTransactions = await Transaction.find({  userAddress,assetAddress });


    res.json({ data:{blockNumber: LatestRecordInfo && LatestRecordInfo.lastFetchedBlockNumber, savedTransactions, msg:'You got them'}, status: 200 })

 } catch(e){
    res.json({
        data: e,
      });
 }
});

router.route('/add/:assetAddress/:userAddress').post(async (req, res) => {
    try{
        const {userAddress, assetAddress} = req.params;
        const {transactions, toBlockNumber} = req.body;
        for(var i=0; i<transactions.length;i++){
            let transaction= transactions[i];
            let {hash,blockNumber,from,to,value}=transaction;
            let newTransaction = new Transaction({
                userAddress,
                assetAddress,
                hash,
                blockNumber,
                from,
                to,
                value
              });
              newTransaction.save()
        }

        const LatestRecordInfo = await LatestRecord.findOne({
            userAddress,
            assetAddress
          })

        if(LatestRecordInfo){
            await LatestRecord.findOneAndUpdate(
                { userAddress, assetAddress },
                { lastFetchedBlockNumber: toBlockNumber }
              )
        } else {
            const newLatestRecord = new LatestRecord({
                userAddress,
                assetAddress,
                lastFetchedBlockNumber:toBlockNumber,
              });
            newLatestRecord.save()
        };

        
        

        res.json({data:{msg:'Exercise added!'}, status:200});
        
    } catch(e){
        res.json({
            data: e,
          });
     }
    
});
       

module.exports = router;