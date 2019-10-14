pragma solidity ^0.4.18;

contract Test{
    function runVerification() public view returns(address)
    {
        bytes32 msg = "0x06b3dfaec148fb1bb2b066f10ec285e7c9bf402ab32aa78a5d38e34566810cd2";
        uint8 v =  28;
        bytes32 r = "0xb224300023a727f960b3e58a4ee170fd0eef20a8dbaef9561894846c2d82c0e1";
        bytes32 s = "0x68673f7de9ef93ba7cd428df2b266556ad0769fd8ba840dc6ce23916be779758";
        return ecrecover(msg, v, r, s);
    }
}