//Unlock accounts to use (account, password, time in seconds to unlock)
personal.unlockAccount(eth.accounts[0], "xxxxxxxx", 200000);

//check lock/unlock and other account status
personal

//latest block number
eth.getBlock("latest");

//send transaction
var sender = eth.accounts[0];
var receiver = eth.accounts[1];
var amount = web3.toWei(25, "ether"); //(value in ether, "ether")
eth.sendTransaction({from: sender, to: receiver, value: amount});
//Or simply
eth.sendTransaction({from:eth.accounts[0], to:eth.accounts[1], value: web3.toWei(20, "ether")});

//check pending transactions count
txpool.status
//OR
eth.getBlockTransactionCount("pending");

//print pending transactions
eth.getBlock("pending", true).transactions
 
 
//get transaction data
var txhash = eth.getBlock(26).transactions[0]; //((block number/block hash), (transaction number in that block))
eth.getTransaction(txhash); 
//OR
eth.getTransactionFromBlock(26, 0);

//mine specific number of blocks
miner.start(1); //(thread count)
admin.sleepBlocks(1); //(wait until that many blocks are mined)
miner.stop();



//dibs
var count = 0;
var highestCount = eth.getBlock("latest").number;
for(var i=0; i<highestCount; i++){
	count += eth.getBlock(i).transactions.length;
}