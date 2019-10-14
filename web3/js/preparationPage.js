function padding(msg){
	var remlen = 66 - msg.length;
	for(var i=0; i<remlen; i++){
		msg += "0";
	}
	return msg;
}

function updateSecretKeyAndHash(e){
	var secretKey = document.querySelector("input[id='secret-key']").value;
	if(secretKey != ""){
		var div = document.querySelector("div[id='secretKey'] div div");
		div.innerHTML += "<p>" + secretKey + "</p>";
		
		div = document.querySelector("div[id='secretKeyHash'] div div");
		//div.innerHTML += "<p>" + "0x" + sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(secretKey)) + "</p>";
		div.innerHTML += "<p>" + web3.sha3(padding(web3.toHex(secretKey)), {encoding:"hex"}) + "</p>";
		
		//disable button
		document.querySelector("div[id='chooseSecretKey'] div div a").setAttribute("disabled", 1);
		document.querySelector("div[id='chooseSecretKey'] div div p[class='result']").innerHTML = "Secret Key and Hash updated in the Data box above.";
		
		//enable candidate button
		document.querySelector("div[id='candidateName'] div div a").removeAttribute("disabled");
		
		//enabled voter page button
		document.querySelector("li[id='submitSecretKeyHash'] a").removeAttribute("disabled");
		document.querySelector("li[id='submitSecretKey'] a").removeAttribute("disabled");
		
		Materialize.toast("Hash generated successfully.", 3000);
	}
	else{
		Materialize.toast("Please enter the secret key first!", 3000, "red");
	}
}

function encryptVote(e){
	var candidateName = document.querySelector("input[id='candidate-name']").value;
	
	if(candidateName != ""){
		var secretKey = document.querySelector("div[id='secretKey'] div div p").innerHTML;
		secretKey = padding(web3.toHex(secretKey));
		var candidateHashBitArray = sjcl.hash.sha256.hash(candidateName);
		var aesobject = new sjcl.cipher.aes(sjcl.codec.hex.toBits(secretKey));
		var encryptedBitArray1 = aesobject.encrypt(candidateHashBitArray.slice(0,4));
		var encryptedBitArray2 = aesobject.encrypt(candidateHashBitArray.slice(4));
		var encryptedVote = sjcl.codec.hex.fromBits(encryptedBitArray1.concat(encryptedBitArray2));
		
		var div = document.querySelector("div[id='candidateName'] div div");
		div.innerHTML += "<p>" + candidateName + "</p>";
		
		div = document.querySelector("div[id='encryptedVote'] div div");
		div.innerHTML += "<p>" + "0x" + encryptedVote + "</p>";
		
		//disable button
		document.querySelector("div[id='candidateName'] div div a").setAttribute("disabled", 1);
		document.querySelector("div[id='candidateName'] div div p[class='result']").innerHTML = "Candidate name and encrypted vote updated in Data box above.";
		
		//enabled voter page button
		document.querySelector("li[id='submitEncryptedVote'] a").removeAttribute("disabled");
		
		Materialize.toast("Encrypted Vote generated successfully!", 3000);
		
	}
	else{
		Materialize.toast("Please enter the candidate name first!", 3000, "red");
	}
}

function tohex(msg){
	var hexmsg = "";
	for(var i=0; i<msg.length; i++){
		hexmsg += msg.charCodeAt(i).toString(16);
	}
	return "0x"+hexmsg;
}

function verificationScheme(str){
	var msghex = tohex(str);
	var sig = web3.eth.sign(web3.eth.accounts[0], msghex);
	
	var r = sig.slice(0, 66);
	var s = '0x' + sig.slice(66, 130);
	var v = '0x' + sig.slice(130, 132);
	v = web3.toDecimal(v);
	
	var verificationMessage = "\x19Ethereum Signed Message:\n" + str.length + str;
	var verificationMessageHash = web3.sha3(verificationMessage);
	
	return [verificationMessageHash, v, r, s];
}

function getSignature(){
	var unlockedAccountsCount = document.querySelector("div[id='preparationFunctionsPage'] div[id='unlockedAccounts'] p");
	if(!unlockedAccountsCount || unlockedAccountsCount < 3){
		Materialize.toast("Please unlock the three Ethereum accounts", 3000, "red");
		return;
	}
	
	var msg = document.querySelector("input[id='self-name']").value;
	if(msg != ""){
		var signatureArray = verificationScheme(msg);
		var div = document.querySelector("div[id='signature'] div div");
		div.innerHTML += "<p style='word-wrap:break-word;'>" + signatureArray.toString() + "</p>";
		
		//disable button
		document.querySelector("div[id='getSignature'] div div a").setAttribute("disabled", 1);
		document.querySelector("div[id='getSignature'] div div p[class='result']").innerHTML = "Signature generated and updated in the Data box above.";
		
		//enabled voter page button
		document.querySelector("li[id='submitSignature'] a").removeAttribute("disabled");
		
		Materialize.toast("Signature generated!", 3000);
		
	}else{
		Materialize.toast("Please enter your name first!", 3000, "red");
	}
}

//Event Listeners
document.querySelector("div[id='chooseSecretKey'] div div a").addEventListener('click', updateSecretKeyAndHash);
document.querySelector("div[id='candidateName'] div div a").addEventListener('click', encryptVote);
document.querySelector("div[id='getSignature'] div div a").addEventListener('click', getSignature);

