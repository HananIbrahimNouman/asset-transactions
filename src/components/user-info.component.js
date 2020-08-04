import React, { Component } from 'react';
import axios from 'axios';
let Web3 = require("web3");
const web3 = new Web3('https://mainnet.infura.io/v3/ca1a29fe66dd40dbbc2b5cc2d7fda17c');
//window.web3.currentProvider if we want to use metamask

export default class UserInfo extends Component {


  state = {
      userAddress: '',
      contractAddress: '',
      fromBlock:'',
      toBlock:'',
      msg:''
    }


   onSubmit= async (e)=> {
    this.setState({msg:'blockchain reqs are being processed'})
    e.preventDefault();;
    let savedTransactions= [];
    let transactionsToBeSaved = [];
    let fromStateBlock = parseInt(this.state.fromBlock) ||0;

    const savedData =  await axios.get(`http://localhost:5000/transactions/${this.state.contractAddress}/${this.state.userAddress}`)

    if(savedData.data.data.blockNumber && savedData.data.data.blockNumber > fromStateBlock){
      savedTransactions= savedData.data.data.savedTransactions;
      fromStateBlock = parseInt(savedData.data.data.blockNumber)+1;
    }

    const contractABI = await axios.get(
      `https://api.etherscan.io/api?module=contract&action=getabi&address=${this.state.contractAddress}`
    );

    const formattedContractABI = await JSON.parse(contractABI.data.result);
    const myContract = new web3.eth.Contract(formattedContractABI, this.state.contractAddress);
    const currentBlockNumber = parseInt(await web3.eth.getBlockNumber());
    let n = parseInt(await web3.eth.getTransactionCount(this.state.userAddress, currentBlockNumber));
    let bal = parseInt(await web3.eth.getBalance(this.state.userAddress, currentBlockNumber));
    let delta =500000 // can be changed but will be controlled through feedback;
    let toBlock=  parseInt(this.state.toBlock) || currentBlockNumber;
    let fromBlock = toBlock; //as a starting point
    let flag = true;
    let storage;
    
      console.log("0000TOOO",toBlock)
      console.log("0000FROOOM",fromBlock)


    while( (fromBlock >= fromStateBlock || (n > 0 || bal > 0)) && flag){
      let transferEvents=[];

      try{

        if( fromBlock-delta >= 0 && fromBlock-delta > fromStateBlock){
          fromBlock = fromBlock - delta;
          console.log('11111',fromBlock)
        } else {
          fromBlock= fromStateBlock
          storage = fromBlock - fromStateBlock;
          flag= false;;
          console.log('222222222',fromBlock)
        }

        if((toBlock < fromStateBlock) || (toBlock < 0) ) {
          flag= false;
          console.log('333333TOOO',typeof toBlock)
          console.log('333333FROMSTAAATE',typeof fromStateBlock)
        } else {
          transferEvents = await myContract.getPastEvents("Transfer", {
            fromBlock,
            toBlock,
          });
          console.log('44444FROOOM',fromBlock)
          console.log('44444TOOOO',toBlock)
          console.log('44444',transferEvents)
        }

        toBlock = fromBlock -1;
      

        //Transactions should not be more than 1000, but it will take too long if it is much less. 
        if(transferEvents && (transferEvents.length<7000)){
          delta = delta * (3/2);
          console.log('555555',delta)
        }

      } catch(e){
        //feedback code should come here to minimise delta without missing blocks
        console.log('error from getPastEvents with metamask, transactions are more than 10000')
        delta = delta * (1/2);
        fromBlock = flag ? fromBlock + delta : fromStateBlock+storage        
        toBlock = fromBlock +1;
        flag= true;
        console.log('66666666FROOOM',fromBlock)
        console.log('66666666TOOOOO',toBlock)
        continue;
      }

      for(let r =0;r<transferEvents.length;r++){
        console.log('yes!')
        let event = transferEvents[r];
        let tx= await web3.eth.getTransaction(event.transactionHash);

        if((tx.to.toLowerCase() == this.state.userAddress.toLowerCase()) && (tx.from.toLowerCase() != this.state.userAddress.toLowerCase())){
          bal=bal+tx.value;
          transactionsToBeSaved.push(tx)

        } else if( (tx.from.toLowerCase() == this.state.userAddress.toLowerCase() )&&  (tx.to.toLowerCase() != this.state.userAddress.toLowerCase())){
          bal=bal-tx.value;
          n=n-1;
          transactionsToBeSaved.push(tx)

        } else if ((tx.from.toLowerCase() == this.state.userAddress.toLowerCase() )&&  (tx.to.toLowerCase() == this.state.userAddress.toLowerCase())){

          transactionsToBeSaved.push(tx)
        }
      }
    }

    await axios.post(`http://localhost:5000/transactions/add/${this.state.contractAddress}/${this.state.userAddress}`, {transactions:transactionsToBeSaved, toBlockNumber:this.state.toBlock})
    
    this.props.history.push({
      pathname: '/transactions',
      state: { allTransactions: savedTransactions.concat(transactionsToBeSaved) }
    })
}

  render() {
    return (
    <div>
      <h3>Post your Info</h3>
      <form onSubmit={this.onSubmit}>
        <div className="form-group"> 
          <label>User Address: </label>
          <input  type="text"
              required
              className="form-control"
              value={this.state.userAddress}
              onChange={(e)=>this.setState({
                userAddress: e.target.value
              })}
              />
        </div>
        <div className="form-group"> 
          <label>Asset Address: </label>
          <input  type="text"
              required
              className="form-control"
              value={this.state.contractAddress}
              onChange={(e)=>this.setState({
                contractAddress: e.target.value
              })}
              />
        </div>
        <div className="form-group"> 
          <label>from Block: </label>
          <input  type="text"
              className="form-control"
              value={this.state.fromBlock}
              onChange={(e)=>this.setState({
                fromBlock: e.target.value
              })}
              />
        </div>
        <div className="form-group"> 
          <label>to Block: </label>
          <input  type="text"
              className="form-control"
              value={this.state.toBlock}
              onChange={(e)=>this.setState({
                toBlock: e.target.value
              })}
              />
        </div>
        <div className="form-group">
          <input type="submit" value="Submit Addresses" className="btn btn-primary" />
        </div>
      </form>
      <div className="form-group">
        {this.state.msg?this.state.msg:null}
        </div>
    </div>
    )
  }
}

// another way that will take too long too because of checking each and every block but NOT RECOMMENDED

// const userAddress = this.state.userAddress;
// const assetAddress= this.state.contractAddress;
// let shouldBeSaved = false;
// let transactionsToSave = [];
// try {

// var currentBlock =await web3.eth.getBlockNumber()

// var n = await web3.eth.getTransactionCount(userAddress, currentBlock);
// var bal = await web3.eth.getBalance(userAddress, currentBlock);
// for (var i=currentBlock; i >= 0 && (n > 0 || bal > 0); --i) {
//     try {
//         var block = await web3.eth.getBlock(i, true);
//         if (block && block.transactions) {
//             block.transactions.forEach(async (transaction,y)=> {
//                 if (userAddress == transaction.from == transaction.to){
//                   shouldBeSaved = true;
//                 }
//                 else if (userAddress == transaction.from) {
//                     // bal = bal.plus(transaction.value);
//                     // --n;
//                     shouldBeSaved = true;
//                 }
//                 else if (userAddress == transaction.to) {
//                    // bal = bal.minus(transaction.value);
//                     shouldBeSaved = true;
//                 }

//                 var transactionRecipt = await web3.eth.getTransactionReceipt(transaction.hash)

//                 if( transactionRecipt.logs.length && transactionRecipt.logs.some(log => log['address'].toLowerCase() == assetAddress.toLowerCase() ) && shouldBeSaved ){
//                     transactionsToSave.push(transaction)
//                       this.setState({
//                         transactions: transactionsToSave,
//                       })
                    
//                 }
//             });
//         }
// }catch (e) { 
// console.error("Error in block " + i, e); 
// }
// }
// }catch(e){
// console.error(e); 
// }
// console.log(transactionsToSave,"transactionsToSave")
// pay attention when using forEach with await in its arg func