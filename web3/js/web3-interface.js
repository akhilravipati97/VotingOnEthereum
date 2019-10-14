//Setup
//connect to local node
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:6500"));

//the ABI
var abi =
[
	{
		"constant": false,
		"inputs": [
			{
				"name": "hash",
				"type": "bytes32"
			},
			{
				"name": "v",
				"type": "uint8"
			},
			{
				"name": "r",
				"type": "bytes32"
			},
			{
				"name": "s",
				"type": "bytes32"
			}
		],
		"name": "submitSign",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "hash",
				"type": "bytes32"
			}
		],
		"name": "submitSecretKeyHash",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "votes",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "secretKeyHashes",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "secretKey",
				"type": "bytes32"
			}
		],
		"name": "submitSecretKey",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "voterApproved",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "encryptedVote",
				"type": "bytes32"
			}
		],
		"name": "vote",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "usedAddress",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "signingAuthority",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_signerAddress",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "voter",
				"type": "address"
			}
		],
		"name": "VoterIsNowApproved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "voter",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "hash",
				"type": "bytes32"
			}
		],
		"name": "VoterSecretKeyHashSubmitted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "voter",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "encryptedVote",
				"type": "bytes32"
			}
		],
		"name": "EncryptedVoteSubmitted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "voter",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "secretKey",
				"type": "bytes32"
			}
		],
		"name": "CorrectSecretKeySubmitted",
		"type": "event"
	}
];

//Get contract from the local node
var Ballot = web3.eth.contract(abi).at("0x698a285e9cec87f976fbe22179ab83160750eb2c");
//To view all the functions of Ballot --> console.log(Ballot);



//Functions
function getOwner(){
	var owner = Ballot.owner.call();
	document.querySelectorAll('li[id="owner"] p')[1].innerText = owner;
}

function getSigningAuthority(){
	var signingAuthority = Ballot.signingAuthority.call();
	document.querySelectorAll('li[id="signingAuthority"] p')[1].innerText = signingAuthority;
}

function getVotes(){
	var res = "";
	var val = document.querySelector('li[id="votes"] input').value;
	if(val!=""){
		//Add more checks to val
		res = Ballot.votes.call(val);
	}else{
		//As of now error
		alert("Enter input!");
	}
	if(res["c"][0] == 1)
		res = "Submitted, it exists on the blockchain!";
	else
		res = "Not submitted, it does not exist on the blockchain.";
	document.querySelectorAll('li[id="votes"] p')[1].innerText = res;
}

function getUsedAddress(){
	var res = "";
	var val = document.querySelector('li[id="usedAddress"] input').value;
	if(val!=""){
		//Add more checks to val
		res = Ballot.usedAddress.call(val);
	}else{
		//As of now error
		alert("Enter input!");
	}
	
	if(res["c"][0] == 1)
		res = "Used.";
	else
		res = "Unused.";
	
	document.querySelectorAll('li[id="usedAddress"] p')[1].innerText = res;
}

function getSecretKeyHashes(){
	var res = "";
	var val = document.querySelector('li[id="secretKeyHashes"] input').value;
	if(val!=""){
		//Add more checks to val
		res = Ballot.secretKeyHashes.call(val);
	}else{
		//As of now error
		alert("Enter input!");
	}
	
	if(res["c"][0] == 1)
		res = "Present.";
	else
		res = "Not Present.";
	
	document.querySelectorAll('li[id="secretKeyHashes"] p')[1].innerText = res;
}

function getSecretKeyHashes(){
	var res = "";
	var val = document.querySelector('li[id="secretKeyHashes"] input').value;
	if(val!=""){
		//Add more checks to val
		res = Ballot.secretKeyHashes.call(val);
	}else{
		//As of now error
		alert("Enter input!");
	}
	
	if(res["c"][0] == 1)
		res = "Present.";
	else
		res = "Not Present.";
	
	document.querySelectorAll('li[id="secretKeyHashes"] p')[1].innerText = res;
}

function getVoterApproved(){
	var res = "";
	var val = document.querySelector('li[id="voterApproved"] input').value;
	if(val!=""){
		//Add more checks to val
		res = Ballot.voterApproved.call(val);
	}else{
		//As of now error
		alert("Enter input!");
	}
	
	if(res["c"][0] == 1)
		res = "Authorized!";
	else
		res = "Unauthorized.";
	document.querySelectorAll('li[id="voterApproved"] p')[1].innerText = res;
}

function getUnlockedAccounts(){
	var lis = document.querySelectorAll('ul[id^="select-options"] li[class*="unlocked"]');
	var unlockedAccounts = [];
	for(var i=0; i<lis.length; i++){
		if(lis[i].hasAttribute("noted"))
			unlockedAccounts.push(lis[i].getAttribute("address"));
	}
}

function submitSignature(){
	
	var unlockedAccountsCount = document.querySelector("div[id='preparationFunctionsPage'] div[id='unlockedAccounts'] p");
	if(!unlockedAccountsCount || unlockedAccountsCount < 3){
		Materialize.toast("Please unlock the three Ethereum accounts", 3000, "red");
		return;
	}
	
	var sig = document.querySelector("div[id='preparationFunctionsPage'] div[id='signature'] p");
	if(!sig){
		Materialize.toast("Please generate a signature first", 3000, "red");
		return;
	}else{
		sig = sig.innerHTML;
		sig = sig.split(",");
		//var acc = web.eth.accounts[0];
		var acc = getUnlockedAccounts()[0];
		Ballot.submitSign.sendTransaction(sig[0], Number(sig[1]), sig[2], sig[3], {from: acc, gas: 3000000}, function(error, result){
			if(!error)
			{
				//result box
				var p = document.querySelector("li[id='submitSignature'] p[class='result']");
				p.innerHTML = "Signature Submitted";
				
				Materialize.toast("Submitted Signature to transaction pool!", 2000);
				Materialize.toast("Check the Tallying tab for 'VoterIsNowApproved'", 2000);
			}
			else{
				Materialize.toast("Failed submitting signature.", 3000, "red");
			}
		});
	}
	
}

function submitSecretKeyHash(){
	var unlockedAccountsCount = document.querySelector("div[id='preparationFunctionsPage'] div[id='unlockedAccounts'] p");
	if(!unlockedAccountsCount || unlockedAccountsCount < 3){
		Materialize.toast("Please unlock the three Ethereum accounts", 3000, "red");
		return;
	}
	
	var secretKeyHash = document.querySelector("div[id='preparationFunctionsPage'] div[id='secretKeyHash'] p");
	if(!secretKeyHash){
		Materialize.toast("Please generate the secret key hash first", 3000, "red");
		return;
	}else{
		secretKeyHash = secretKeyHash.innerHTML;
		//var acc = web.eth.accounts[0];
		var acc = getUnlockedAccounts()[0];
		Ballot.submitSecretKeyHash.sendTransaction(secretKeyHash, {from: acc, gas: 3000000}, function(error, result){
			if(!error)
			{
				//result box
				var p = document.querySelector("li[id='submitSecretKeyHash'] p[class='result']");
				p.innerHTML = "Secret Key Hash Submitted";
				
				Materialize.toast("Submitted Secret Key Hash to transaction pool!", 2000);
				Materialize.toast("Check the Tallying tab for 'VoterSecretKeyHashSubmitted'", 2000);
			}
			else{
				Materialize.toast("Failed submitting secret key hash.", 3000, "red");
			}
		});
	}
}

function submitEncryptedVote(){
	var unlockedAccountsCount = document.querySelector("div[id='preparationFunctionsPage'] div[id='unlockedAccounts'] p");
	if(!unlockedAccountsCount || unlockedAccountsCount < 3){
		Materialize.toast("Please unlock the three Ethereum accounts", 3000, "red");
		return;
	}
	
	var encryptedVote = document.querySelector("div[id='preparationFunctionsPage'] div[id='encryptedVote'] p");
	if(!encryptedVote){
		Materialize.toast("Please generate the encrypted vote first", 3000, "red");
		return;
	}else{
		encryptedVote = encryptedVote.innerHTML;
		//var acc = web.eth.accounts[1];
		var acc = getUnlockedAccounts()[1];
		Ballot.vote.sendTransaction(encryptedVote, {from: acc, gas: 3000000}, function(error, result){
			if(!error)
			{
				//result box
				var p = document.querySelector("li[id='submitEncryptedVote'] p[class='result']");
				p.innerHTML = "Encrypted Vote Submitted";
				
				Materialize.toast("Submitted Encrypted Vote to transaction pool!", 2000);
				Materialize.toast("Check the Tallying tab for 'EncryptedVoteSubmitted'", 2000);
			}
			else{
				Materialize.toast("Failed submitting encrypted vote.", 3000, "red");
			}
		});
	}
}

function submitSecretKey(){
	var unlockedAccountsCount = document.querySelector("div[id='preparationFunctionsPage'] div[id='unlockedAccounts'] p");
	if(!unlockedAccountsCount || unlockedAccountsCount < 3){
		Materialize.toast("Please unlock the three Ethereum accounts", 3000, "red");
		return;
	}
	
	var secretKey = document.querySelector("div[id='preparationFunctionsPage'] div[id='secretKey'] p");
	if(!secretKey){
		Materialize.toast("Please generate the secret key first", 3000, "red");
		return;
	}else{
		secretKey = secretKey.innerHTML;
		//var acc = web.eth.accounts[2];
		var acc = getUnlockedAccounts()[2];
		Ballot.submitSecretKey.sendTransaction(secretKey, {from: acc, gas: 3000000}, function(error, result){
			if(!error)
			{
				//result box
				var p = document.querySelector("li[id='submitSecretKey'] p[class='result']");
				p.innerHTML = "Secret Key Submitted";
				
				Materialize.toast("Submitted secret key to transaction pool!", 2000);
				Materialize.toast("Check the Tallying tab for 'CorrectSecretKeySubmitted'", 2000);
			}
			else{
				Materialize.toast("Failed submitting secret key.", 3000, "red");
			}
		});
	}
}


//other functions
function ethereumAccountsList(){
	var accounts = web3.eth.accounts;
	var elem = document.querySelector("select[id='ethereum-accounts']");
	for(var i=0; i<accounts.length; i++){
		elem.innerHTML += "<option value='" + accounts[i] + "'>" + accounts[i] + "</option>";
	}
}

function addUnlockedEthereumAddressesToDataBox(){
	var lis = document.querySelectorAll('ul[id^="select-options"] li[class*="unlocked"]');
	for(var i=0; i<lis.length; i++){
		if(lis[i].hasAttribute("noted"))
			continue;
		var div = document.querySelector('div[id="unlockedAccounts"] div div');
		div.innerHTML += "<p>" + lis[i].getAttribute("address") + "</p>";
		lis[i].setAttribute("noted", "yes");
	}
}

function unlockEthereumAccount(e){
	var elem = document.querySelector('ul[id^="select-options"] li[class*="selected"]');
	var address = elem.innerText;
	
	var pwd = document.querySelector('input[id="ethereum-account-password"]').value;
	try{
		var result = web3.personal.unlockAccount(address, pwd, 1000);
		if(result){
			var span = document.querySelector("ul[id*='select-options'] li[class*='selected'] span");
			span.innerText = span.innerText + " (unlocked)";
			span.parentElement.classList.add("disabled");
			span.parentElement.classList.add("unlocked");
			span.parentElement.setAttribute("address",address);
			
			Materialize.toast("Account unlocked!", 3000);
		}
		else{
			Materialize.toast("Unlock failed. Please recheck the password.", 3000, "red");
		}
	}
	catch(e){
		Materialize.toast("Account unlock failed, most probably because of wrong password.", 3000, "red");
	}
	
	addUnlockedEthereumAddressesToDataBox();
}




//Event Listeners
//NOTE: Maybe implement a single getter
document.querySelector('li[id="owner"] a').addEventListener('click', getOwner);
document.querySelector('li[id="signingAuthority"] a').addEventListener('click', getSigningAuthority);
document.querySelector('li[id="votes"] a').addEventListener('click', getVotes);
document.querySelector('li[id="usedAddress"] a').addEventListener('click', getUsedAddress);
document.querySelector('li[id="secretKeyHashes"] a').addEventListener('click', getSecretKeyHashes);
document.querySelector('li[id="voterApproved"] a').addEventListener('click', getVoterApproved);

document.querySelector('li[id="submitSecretKey"] a').addEventListener('click', submitSecretKey);
document.querySelector('li[id="submitSecretKeyHash"] a').addEventListener('click', submitSecretKeyHash);
document.querySelector('li[id="submitSignature"] a').addEventListener('click', submitSignature);
document.querySelector('li[id="submitEncryptedVote"] a').addEventListener('click', submitEncryptedVote);

document.querySelector('a[id="unlockEthereumAccount"]').addEventListener('click', unlockEthereumAccount);

document.addEventListener("DOMContentLoaded", ethereumAccountsList);