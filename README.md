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



# SECURITY

### Atualização do Contrato para Mitigar Ataques

1. **Reentrancy Attack**:
   - Usar um `reentrancy guard`.

2. **Unprotected Self-Destruct**:
   - Não aplicável ao contrato atual, pois não há `selfdestruct` usado.

3. **Underflow/Overflow Attack**:
   - Utilizar as verificações automáticas do Solidity 0.8.0+.

4. **Unsecured Direct Transfer**:
   - Não aplicável ao contrato atual, pois não há transferências diretas.

5. **Unprotected Function**:
   - Garantir que funções críticas tenham modificadores de acesso apropriados.

6. **ník Quentin Fault Attack**:
   - Não aplicável ao contrato atual.

7. **Replay Attack**:
   - Adicionar um nonce para rastrear transações.

8. **Elevation of Privilege**:
   - Garantir que apenas funções apropriadas sejam acessíveis por administradores.

9. **Front-Running Attack**:
   - Não aplicável ao contrato atual.

10. **Timestamp Dependence**:
    - Não aplicável ao contrato atual.

11. **tx.origin Attack**:
    - Evitar o uso de `tx.origin`.

12. **Visibility Vulnerability**:
    - Manter variáveis sensíveis privadas ou internas.

13. **Delegatecall Attack**:
    - Não aplicável ao contrato atual.

14. **Phishing Attack**:
    - Não aplicável ao contrato atual.

15. **Generalized Reentrancy Attack**:
    - Usar um `reentrancy guard`.
