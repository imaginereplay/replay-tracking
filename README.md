# ReplayTrackingContract Documentation

This contract was written in Solidity and is part of a decentralized token market (DeFi). Its purpose is to manage content viewing records and rewards for users.

## Contract Details

### SPDX-License-Identifier

The contract uses the MIT license.

### Imports

The contract imports the following OpenZeppelin smart contract libraries:

* `@openzeppelin/contracts/access/Ownable.sol`: Allows the contract to be managed by a single owner.
* `@openzeppelin/contracts/security/ReentrancyGuard.sol`: Protects against reentrancy attacks.
* `@openzeppelin/contracts/utils/structs/EnumerableSet.sol`: Provides an iterable data structure.
* `@openzeppelin/contracts/utils/Address.sol`: Provides utility functions for working with addresses.
* `@openzeppelin/contracts/security/Pausable.sol`: Allows the contract to be paused in case of an emergency.
* `@openzeppelin/contracts/access/AccessControl.sol`: Provides an access control system for users.

### Contract Structure

The `ReplayTrackingContract` contract inherits functionality from `Ownable`, `ReentrancyGuard`, `Pausable`, and `AccessControl`.

### Functions and Variables

* `wallets`: A map that stores each user's token balance.
* `tokenAdmin`: The address of the administrator who can add tokens to user balances.
* `nonces`: A map that stores nonce numbers to prevent replay attacks.
* `ADMIN_ROLE`: A constant that defines the administrator role.
* `consolidatedByMonth` and `consolidatedByYear`: Maps that store consolidated records for each user, month, and year.
* `consolidatedByMonthTransactions` and `consolidatedByYearTransactions`: Maps that store consolidated transactions for each user, month, and year.
* `addTokens`: A function that adds tokens to a user's balance.
* `updateBalance`: A function that updates a user's balance.
* `addAdmin`: A function that adds a new administrator.
* `removeAdmin`: A function that removes an existing administrator.
* `setTokenAdmin`: A function that sets the token administrator's address.
* `pause` and `unpause`: Functions that allow the contract to be paused and unpaused.
* `incrementRecord`: A function that increments a user's viewing time and earnings.
* `addTransaction`: A function that adds a transaction to a user's record.
* `batchIncrementRecords`: A function that allows incrementing records for multiple users in bulk.

### Security

The contract uses various mechanisms to ensure security:

* `ReentrancyGuard` to prevent reentrancy attacks.
* `Pausable` to allow the contract to be paused in case of an emergency.
* `AccessControl` to control access to contract functions.
* `nonces` to prevent replay attacks.
* Permission checks before executing critical functions.



```
Consolidated record for 0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5 for month 5 and year 2023:
┌─────────┬─────────────┬──────────────┬───────┬──────┐
│ (index) │ timeWatched │ amountEarned │ month │ year │
├─────────┼─────────────┼──────────────┼───────┼──────┤
│ 0       │ '360'       │ '36'         │ 5     │ 2023 │
└─────────┴─────────────┴──────────────┴───────┴──────┘
Transactions for 0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5 for month 5 and year 2023:
┌─────────┬────────────────────────────────────────┬──────────────────────────────────────────────┬────────┬────────────────┬───────┬──────┐
│ (index) │ txnId                                  │ walletAddress                                │ amount │ type           │ month │ year │
├─────────┼────────────────────────────────────────┼──────────────────────────────────────────────┼────────┼────────────────┼───────┼──────┤
│ 0       │ 'bc7ace4d-1fed-4d1e-84bc-9cdb51f983e0' │ '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' │ '12'   │ 'content_type' │ 5     │ 2023 │
│ 1       │ '73e1a5a5-00e8-4657-98fe-6313257030de' │ '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' │ '9'    │ 'content_type' │ 5     │ 2023 │
│ 2       │ '13513978-4cfc-48b5-ab66-936698151323' │ '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' │ '15'   │ 'content_type' │ 5     │ 2023 │
└─────────┴────────────────────────────────────────┴──────────────────────────────────────────────┴────────┴────────────────┴───────┴──────┘
Consolidated record for 0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5 for month 6 and year 2023:
┌─────────┬─────────────┬──────────────┬───────┬──────┐
│ (index) │ timeWatched │ amountEarned │ month │ year │
├─────────┼─────────────┼──────────────┼───────┼──────┤
│ 0       │ '360'       │ '36'         │ 6     │ 2023 │
└─────────┴─────────────┴──────────────┴───────┴──────┘
Transactions for 0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5 for month 6 and year 2023:
┌─────────┬────────────────────────────────────────┬──────────────────────────────────────────────┬────────┬────────────────┬───────┬──────┐
│ (index) │ txnId                                  │ walletAddress                                │ amount │ type           │ month │ year │
├─────────┼────────────────────────────────────────┼──────────────────────────────────────────────┼────────┼────────────────┼───────┼──────┤
│ 0       │ 'ed02744d-cd96-4096-bfac-fcc7ff5632c3' │ '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' │ '12'   │ 'content_type' │ 6     │ 2023 │
│ 1       │ '4ca37d35-ee74-40fd-ace1-4a5c70333064' │ '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' │ '9'    │ 'content_type' │ 6     │ 2023 │
│ 2       │ 'e4d336db-146e-448f-8c0f-6d9e937fa805' │ '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' │ '15'   │ 'content_type' │ 6     │ 2023 │
└─────────┴────────────────────────────────────────┴──────────────────────────────────────────────┴────────┴────────────────┴───────┴──────┘
Consolidated record for 0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5 for year 2023:
┌─────────┬─────────────┬──────────────┬──────┐
│ (index) │ timeWatched │ amountEarned │ year │
├─────────┼─────────────┼──────────────┼──────┤
│ 0       │ '2160'      │ '216'        │ 2023 │
└─────────┴─────────────┴──────────────┴──────┘
Transactions for 0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5 for year 2023:
┌─────────┬────────────────────────────────────────┬──────────────────────────────────────────────┬────────┬────────────────┬──────┐
│ (index) │ txnId                                  │ walletAddress                                │ amount │ type           │ year │
├─────────┼────────────────────────────────────────┼──────────────────────────────────────────────┼────────┼────────────────┼──────┤
│ 0       │ 'bd5a11fa-a4ba-4d1b-861c-f577f204cf3b' │ '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' │ '12'   │ 'content_type' │ 2023 │
│ 1       │ '6091b30a-9220-4ce8-8c39-3a6e568ef7d4' │ '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' │ '9'    │ 'content_type' │ 2023 │
│ 2       │ '67a713a1-2b3a-4ebe-8744-43fdd86b2cf6' │ '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' │ '15'   │ 'content_type' │ 2023 │
│ 3       │ '5e5d1588-bdf7-4544-83a6-e202cd9b0495' │ '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' │ '12'   │ 'content_type' │ 2023 │
│ 4       │ '3776b167-2c28-4362-a48d-64cfd7636fc9' │ '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' │ '9'    │ 'content_type' │ 2023 │
│ 5       │ '410e3d13-b8fa-4deb-9913-4999516d9c40' │ '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' │ '15'   │ 'content_type' │ 2023 │
│ 6       │ '16af864a-6e08-4a43-9b98-f166bf4a4a7b' │ '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' │ '12'   │ 'content_type' │ 2023 │
│ 7       │ 'c82fbaab-5921-42f1-98c2-f1ca5401f3a5' │ '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' │ '9'    │ 'content_type' │ 2023 │
│ 8       │ '29a78f09-16c7-4a13-a65f-3aa135e0de54' │ '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' │ '15'   │ 'content_type' │ 2023 │
│ 9       │ '6db5b8de-50dd-43a0-87af-4ce909b90f22' │ '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' │ '12'   │ 'content_type' │ 2023 │
│ 10      │ '7267604b-c098-424d-aaef-5bad690d264e' │ '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' │ '9'    │ 'content_type' │ 2023 │
│ 11      │ 'db704fa0-4eb3-4b2b-99d0-acfbe8ba6ac9' │ '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' │ '15'   │ 'content_type' │ 2023 │
│ 12      │ 'bc7ace4d-1fed-4d1e-84bc-9cdb51f983e0' │ '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' │ '12'   │ 'content_type' │ 2023 │
│ 13      │ '73e1a5a5-00e8-4657-98fe-6313257030de' │ '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' │ '9'    │ 'content_type' │ 2023 │
│ 14      │ '13513978-4cfc-48b5-ab66-936698151323' │ '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' │ '15'   │ 'content_type' │ 2023 │
│ 15      │ 'ed02744d-cd96-4096-bfac-fcc7ff5632c3' │ '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' │ '12'   │ 'content_type' │ 2023 │
│ 16      │ '4ca37d35-ee74-40fd-ace1-4a5c70333064' │ '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' │ '9'    │ 'content_type' │ 2023 │
│ 17      │ 'e4d336db-146e-448f-8c0f-6d9e937fa805' │ '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' │ '15'   │ 'content_type' │ 2023 │
└─────────┴────────────────────────────────────────┴──────────────────────────────────────────────┴────────┴────────────────┴──────┘
User summary for 0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5 for June 2023:
┌─────────┬──────────────┬─────────────┬───────┬──────┐
│ (index) │ totalWatched │ totalEarned │ month │ year │
├─────────┼──────────────┼─────────────┼───────┼──────┤
│ 0       │ '2520'       │ '252'       │ 6     │ 2023 │
└─────────┴──────────────┴─────────────┴───────┴──────┘
Total transactions for 0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5 for June 2023: 21
Detailed user information for 0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5:
┌─────────┬─────────┬───────┬──────────────┬─────────────┬──────┐
│ (index) │ balance │ nonce │ totalWatched │ totalEarned │ year │
├─────────┼─────────┼───────┼──────────────┼─────────────┼──────┤
│ 0       │ '2000'  │ '0'   │ '4320'       │ '432'       │ 2023 │
└─────────┴─────────┴───────┴──────────────┴─────────────┴──────┘
Monthly and yearly report for June 2023:
┌─────────┬──────────────────────────────────────────────┬────────────────┬───────────────┬───────────────┬──────────────┐
│ (index) │ user                                         │ monthlyWatched │ monthlyEarned │ yearlyWatched │ yearlyEarned │
├─────────┼──────────────────────────────────────────────┼────────────────┼───────────────┼───────────────┼──────────────┤
│ 0       │ '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' │ '360'          │ '36'          │ '2160'        │ '216'        │
│ 1       │ '0x590c6083980ad9cDF050533d2064c11906B6c892' │ '360'          │ '36'          │ '2160'        │ '216'        │
│ 2       │ '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' │ '360'          │ '36'          │ '2160'        │ '216'        │
└─────────┴──────────────────────────────────────────────┴────────────────┴───────────────┴───────────────┴──────────────┘
```