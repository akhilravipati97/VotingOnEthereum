pragma solidity ^0.4.18;

contract Ballot{
    //Owner of this contract
    address public owner;

    //Start and end times of the Ballot
    uint startSignatureVerificationEpochTime;
    uint endSignatureVerificationEpochTime;
    uint startVotingEpochTime;
    uint endVotingEpochTime;
    uint startSecretKeyRevealEpochTime;
    uint endSecretKeyRevealEpochTime;

    //The address who signs the message and gives the certificate
    address public signingAuthority;

    //Address of all those voters who are approved
    mapping(address => uint) public voterApproved;
    //Used addresses
    mapping(address => uint) public usedAddress;
    //The secret key hashes
    mapping(bytes32 => uint) public secretKeyHashes;
    //The encrypted votes
    mapping(bytes32 => uint) public votes;

    //Log the approval of voter
    event VoterIsNowApproved(address voter);
    //Log the submission of hash of secret key
    event VoterSecretKeyHashSubmitted(address voter, bytes32 hash);
    //Log the encrypted vote
    event EncryptedVoteSubmitted(address voter, bytes32 encryptedVote);
    //Log secret key submission
    event CorrectSecretKeySubmitted(address voter, bytes32 secretKey);

    //Constructor to initialize the start and end times, and signature authority
    function Ballot(
        uint _startSignatureVerificationEpochTime,
        uint _endSignatureVerificationEpochTime,
        uint _startVotingEpochTime,
        uint _endVotingEpochTime,
        uint _startSecretKeyRevealEpochTime,
        uint _endSecretKeyRevealEpochTime,
        address _signerAddress
    )
    {
        //Mark the owner
        owner = msg.sender;

        //Demarcate the start and end times in unix epoch times
        startSignatureVerificationEpochTime = _startSignatureVerificationEpochTime;
        endSignatureVerificationEpochTime = _endSignatureVerificationEpochTime;
        startVotingEpochTime = _startVotingEpochTime;
        endVotingEpochTime = _endVotingEpochTime;
        startSecretKeyRevealEpochTime = _startSecretKeyRevealEpochTime;
        endSecretKeyRevealEpochTime = _endSecretKeyRevealEpochTime;

        //Set the signer address
        signingAuthority = _signerAddress;
    }

    modifier onlyAfter(uint _time){
        require(now >= _time);
        _;
    }

    modifier onlyBefore(uint _time){
        require(now <= _time);
        _;
    }

    //Verify if the signer of the message hash was the demarcated signed authority
    //Note: Must only be called internally and that too by submitSign
    function verifySign(bytes32 hash, uint8 v, bytes32 r, bytes32 s) internal view returns(bool){
        address signer = ecrecover(hash, v, r, s);
        if(signer == signingAuthority)
        {
            return true;
        }
        return false;
    }

    //Take a signature and approve voter if valid
    //Note: Must only be called once and must be the first function
    function submitSign(bytes32 hash, uint8 v, bytes32 r, bytes32 s)
        public
        onlyAfter(startVotingEpochTime)
        onlyBefore(endVotingEpochTime)
        returns(bool)
    {
        if(verifySign(hash, v, r, s) && voterApproved[msg.sender]==0){
            voterApproved[msg.sender] = 1;
            VoterIsNowApproved(msg.sender);
            return true;
        }
        return false;
    }

    //Take a secret key hash and record it if the sender is approved
    //Note: Must only be called once and must be the 2nd function to call
    function submitSecretKeyHash(bytes32 hash)
        public
        onlyAfter(startVotingEpochTime)
        onlyBefore(endVotingEpochTime)
        returns(bool)
    {
        if(voterApproved[msg.sender]==1){
            voterApproved[msg.sender] = 2;
            secretKeyHashes[hash] = 1;
            usedAddress[msg.sender] = 1;
            VoterSecretKeyHashSubmitted(msg.sender, hash);
            return true;
        }
        return false;
    }

    //Take the encrypted vote and record it
    function vote(bytes32 encryptedVote)
        public
        onlyAfter(startVotingEpochTime)
        onlyBefore(endVotingEpochTime)
        returns(bool)
    {
        //On the off chance the encrypted vote is still not unique
        require(votes[encryptedVote] == 0);
        //Must not be a part of those address which validated themselves,
        //this is to prevent link between voter and verified user
        if(!(usedAddress[msg.sender] == 1)){
            votes[encryptedVote] = 1;
            usedAddress[msg.sender] = 1;
            EncryptedVoteSubmitted(msg.sender, encryptedVote);
            return true;
        }
        return false;
    }

    function submitSecretKey(bytes32 secretKey)
        public
        onlyAfter(startSecretKeyRevealEpochTime)
        onlyBefore(endSecretKeyRevealEpochTime)
        returns(bool)
    {
        //Muse not be any of the older address
        if(!(usedAddress[msg.sender] == 1)){
            bytes32 hash = keccak256(secretKey);
            if(secretKeyHashes[hash] == 1){
                CorrectSecretKeySubmitted(msg.sender, secretKey);
                return true;
            }
        }
        return false;
    }
}
