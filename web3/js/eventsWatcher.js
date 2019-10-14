var candidates = ["suraj", "praveen"];
var candidateHashes = [];
var candidateVoteCount = {};

for(var i=0; i<candidates.length; i++){
	var hash = sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(candidates[i]));
	candidateHashes.push(hash);
	candidateVoteCount[hash] = 0;
}

function addCandidatesToDisplay(){
	var ul = document.querySelector("div[id='blockchainFunctionsPage'] ul[id='resultsData']");
	
	var header = "<div class='collapsible-header'>" + "Candidates" + "</div>";
	var tableInnerData = "";
	
	for(var i=0; i<candidates.length; i++){
		tableInnerData += "<tr><td id='" + candidateHashes[i] + "'>" + candidates[i] + "</td><td>" + candidateVoteCount[candidateHashes[i]] + "</td></tr>";		
	}
	
	var body = "<div class='collapsible-body'><table class='bordered'><thead><tr><th>Candidate</th><th>Vote Count</th></tr><tbody>" + tableInnerData + "</tbody></table></div>";
	
	ul.innerHTML = "<li>" + header + body + "</li>";
}

function decrypt(encryptedVote, secretKey){
	//console.log(encryptedVote, secretKey);
	var encryptedBitArray = sjcl.codec.hex.toBits(encryptedVote);
	var aesobject = new sjcl.cipher.aes(sjcl.codec.hex.toBits(web3.toHex(secretKey)));
	var decryptedBitArray1 = aesobject.decrypt(encryptedBitArray.slice(0,4));
	var decryptedBitArray2 = aesobject.decrypt(encryptedBitArray.slice(4));
	var decryptedMessageHash = sjcl.codec.hex.fromBits(decryptedBitArray1.concat(decryptedBitArray2));
	//console.log(decryptedMessageHash);
	
	if(candidateHashes.includes(decryptedMessageHash)){
		return decryptedMessageHash;
	}
	else{
		return false;
	}
}

function updateCandidateVoteCount(e){
	
	var events = document.querySelectorAll("div[id='blockchainFunctionsPage'] div[class='collapsible-header']");
	var secretKeys = [];
	for(var i=0; i<events.length; i++){
		if(events[i].innerHTML == "CorrectSecretKeySubmitted"){
			var tds = events[i].nextElementSibling.firstElementChild.querySelectorAll("td");
			for(var j=0; j<tds.length; j++){
				if(tds[j].innerHTML == "secretKey"){
					secretKeys.push(tds[j].nextElementSibling.innerHTML);
				}
			}
		}
	}
	
	var encryptedVotes = [];
	for(var i=0; i<events.length; i++){
		if(events[i].innerHTML == "EncryptedVoteSubmitted"){
			var tds = events[i].nextElementSibling.firstElementChild.querySelectorAll("td");
			for(var j=0; j<tds.length; j++){
				if(tds[j].innerHTML == "encryptedVote"){
					encryptedVotes.push(tds[j].nextElementSibling.innerHTML);
				}
			}
		}
	}	
	
	//reset candidate vote count and recalculate. This is for safety. Next time on it will add to the count
	for(var key in candidateVoteCount){
		candidateVoteCount[key] = 0;
	}
	
	//calculate vote count
	for(var i in encryptedVotes){
		for(var j in secretKeys){
			var res = decrypt(encryptedVotes[i], secretKeys[j]);
			if(res){
				//alert("decrypt");
				candidateVoteCount[res] += 1;
			}
		}
	}

	addCandidatesToDisplay();	
}

function updateBlockchainFunctionsPage(error, result){
	if(!error){
		var ul = document.querySelector("div[id='blockchainFunctionsPage'] ul[id='eventsData']");
		
		var header = "<div class='collapsible-header'>" + result["event"] + "</div>";
		var tableInnerData = "";
		for(var key in result){
			if(key == "args"){
				for(var keyInner in result["args"])
					tableInnerData += "<tr><td>" + keyInner + "</td><td>" + result["args"][keyInner] + "</td></tr>";
			}else{
				tableInnerData += "<tr><td>" + key + "</td><td>" + result[key] + "</td></tr>";
			}
			
		}
		
		var body = "<div class='collapsible-body'><table class='bordered'><thead><tr><th>Index</th><th>Value</th></tr><tbody>" + tableInnerData + "</tbody></table></div>";
		
		ul.innerHTML += "<li>" + header + body + "</li>";
		
		//call to update count
		updateCandidateVoteCount();
	}else{
		alert("Error watching for events!");
		alert(error);
	}
}

//Init

addCandidatesToDisplay();

var events = Ballot.allEvents({fromBlock:0, toBlock:'latest'});
events.watch(updateBlockchainFunctionsPage);