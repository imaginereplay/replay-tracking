# Replay Tracking

**Overview**

The Replay Tracking Contract is a decentralized application that enables users to withdraw tokens, maintains records of user activity, and manages wallet addresses, balances, and token transfers.

**State Variables**

The contract maintains several state variables, including:

* **Wallets**: a mapping of wallet addresses to their current balance of tokens
* **Treasurer Address**: the wallet address holding the tokens to be transferred
* **Owner Address**: the owner of the contract
* **Admins**: a mapping of admin addresses
* **Token Admin**: the address of the admin who can add tokens to user wallets
* **Records**: mappings to store records grouped by user, movie, month, and year, as well as by user and month/year, and by user and year
* **Transactions**: mappings to store transactions grouped by user, movie, month, and year, as well as by user and month/year, and by user and year

**Events**

The contract emits several events, including:

* **TokenWithdrawal**: when a user withdraws tokens
* **AdminAdded**: when an admin is added
* **AdminRemoved**: when an admin is removed
* **TokenAdminSet**: when the token admin is set

**Functions**

The contract has several functions, including:

* **withdrawTokens**: allows users to withdraw tokens, subtracting the requested amount from their balance and transferring it to their wallet
* **addTokens**: allows the token admin to add tokens to a user's balance
* **setTreasurerAddress**: allows the owner to set the treasurer address
* **addAdmin**: allows the owner to add an admin
* **removeAdmin**: allows the owner to remove an admin
* **setTokenAdmin**: allows the owner to set the token admin
* **incrementRecord**: increments the time watched and amount earned for each user, movie, month, and year, as well as by user and month/year, and by user and year
* **addTransaction**: adds a transaction to the corresponding mapping

**Requirements**

The contract must prevent parallel execution and ensure that only one transaction is processed at a time. It must also allow admins to add tokens to user wallets, and allow the owner to set the treasurer address, add/remove admins, and set the token admin. Additionally, the contract must have a function to increment the records every x minutes.
