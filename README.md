# Voting on Etherum Blockchain

This was my attempt at trying to solve a few challenges that the current voting systems faces, such as
1. Susceptible to Coercion
2. Lack of transparency about the status/progress/inclusion of the vote
3. Adequate Authentication
and a few others.

# Rough Design
I tried to use Digital Signatures from a governing body to authenticate oneself. Involving a governing body already threatens to break the decentralization. But, I did not get enough time to explore reputation systems, or decentralized digital signature attesting bodies. The logs on the blockchain about how many authenticated users participated should serve a mediocre metric about how true the governing body was in its issue of signatures.

Further, I tried to use some obfuscation using multiple accounts, and vote encryption to hide the intended candidate. This was designed to be like the blind auctions where you only reveal your bid after all bids are made in secret. The keys to the decrypt the vote, can and must be submitted only after the voting period ends. Similarly, the revelation of keys occurs after the submission period ends. Post which, everyone is free to examine the blockchain and decrypt votes and tally up the count. 

This allows multiple users to report and corraborate the count while each voter can be absolutely sure that their vote was counted as is.

# Contents
The solidity folder contains the contracts and tests.
The web3 folder contains a sample UI on top of the contract. Provided you are running a local node.
The scripts folder has some useful scripts to run a local node.

# Disclaimer
I worked on this more than a year ago and so, most of it is very likely to be outdated. I was not aware of Frontend frameworks when I worked on this. Sorry about the javascript spagetti. But I plan to improve upon this soon.

# Regards
Please reach out to me if you have any questions or suggestions.
Thank you.