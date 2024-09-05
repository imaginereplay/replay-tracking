// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts47/security/Pausable.sol";
import "@openzeppelin/contracts47/access/Ownable.sol";
import "@openzeppelin/contracts47/access/AccessControl.sol";
import "@openzeppelin/contracts47/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts47/utils/Address.sol";
import "./ReplayLibrary.sol";

contract ReplayTrackingContractV3 is Ownable, Pausable, AccessControl {
    using Address for address;
    using ReplayLibrary for ReplayLibrary.Transaction;

    // Define roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Nonce for replay attack prevention
    mapping(string => uint256) public nonces;

    // Mapping for storing daily transactions
    mapping(bytes32 => ReplayLibrary.Transaction[]) public dailyTransactions;
    
    bytes32[] public transactionKeys;

    // Event emitted when a transaction is added
    event TransactionAdded(
        string indexed userId,
        uint256 indexed day,
        uint256 indexed month,
        uint256 year,
        string assetId,
        uint256 totalDuration,
        uint256 totalRewardsConsumer,
        uint256 totalRewardsContentOwner
    );

    constructor() Ownable() Pausable() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Only admin can call this function");
        _;
    }

    // Function to pause the contract
    function pause() public onlyAdmin {
        _pause();
    }

    // Function to unpause the contract
    function unpause() public onlyAdmin {
        _unpause();
    }

    // Batch function to insert records for multiple users
    function batchInsertRecords(
        ReplayLibrary.Transaction[] calldata transactions
    ) external onlyAdmin whenNotPaused {
        require(transactions.length <= 100, "Batch size too large");

        for (uint256 i = 0; i < transactions.length; i++) {
            ReplayLibrary.Transaction memory txn = transactions[i];

            // Cria uma chave única para o dia da transação
            bytes32 keyDay = ReplayLibrary.encodeKey(
                txn.userId,
                txn.day,
                txn.month,
                txn.year,
                txn.assetId
            );

            // Verifica se a chave já foi registrada
            if (dailyTransactions[keyDay].length == 0) {
                transactionKeys.push(keyDay); // Armazena a chave se for nova
            }

            // Adiciona a transação ao mapeamento de transações diárias
            dailyTransactions[keyDay].push(txn);

            // Emite o evento
            emit TransactionAdded(
                txn.userId,
                txn.day,
                txn.month,
                txn.year,
                txn.assetId,
                txn.totalDuration,
                txn.totalRewardsConsumer,
                txn.totalRewardsContentOwner
            );
        }
    }


    function getTransactionsByUserId(
        string memory userId
    ) public view returns (ReplayLibrary.Transaction[] memory) {
        uint256 totalTransactions = 0;

        // Primeiro, contar o número de transações correspondentes
        for (uint256 i = 0; i < transactionKeys.length; i++) {
            bytes32 key = transactionKeys[i];
            ReplayLibrary.Transaction[] storage transactions = dailyTransactions[key];

            // Verifica se o userId da transação corresponde
            if (keccak256(bytes(transactions[0].userId)) == keccak256(bytes(userId))) {
                totalTransactions += transactions.length;
            }
        }

        // Inicializa um array com o tamanho correto
        ReplayLibrary.Transaction[] memory allTransactions = new ReplayLibrary.Transaction[](totalTransactions);
        uint256 index = 0;

        // Agora, popula o array com as transações
        for (uint256 i = 0; i < transactionKeys.length; i++) {
            bytes32 key = transactionKeys[i];
            ReplayLibrary.Transaction[] storage transactions = dailyTransactions[key];

            // Adiciona transações correspondentes ao array
            if (keccak256(bytes(transactions[0].userId)) == keccak256(bytes(userId))) {
                for (uint256 j = 0; j < transactions.length; j++) {
                    allTransactions[index] = transactions[j];
                    index++;
                }
            }
        }

        return allTransactions;
    }

    function getTransactionsByUserIdAndAssetId(
        string memory userId,
        string memory assetId
    ) public view returns (ReplayLibrary.Transaction[] memory) {
        uint256 totalTransactions = 0;

        // Primeiro, contar o número de transações correspondentes
        for (uint256 i = 0; i < transactionKeys.length; i++) {
            bytes32 key = transactionKeys[i];
            ReplayLibrary.Transaction[] storage transactions = dailyTransactions[key];

            // Verifica se o userId e assetId da transação correspondem
            if (keccak256(bytes(transactions[0].userId)) == keccak256(bytes(userId)) &&
                keccak256(bytes(transactions[0].assetId)) == keccak256(bytes(assetId))) {
                totalTransactions += transactions.length;
            }
        }

        // Inicializa um array com o tamanho correto
        ReplayLibrary.Transaction[] memory allTransactions = new ReplayLibrary.Transaction[](totalTransactions);
        uint256 index = 0;

        // Agora, popula o array com as transações
        for (uint256 i = 0; i < transactionKeys.length; i++) {
            bytes32 key = transactionKeys[i];
            ReplayLibrary.Transaction[] storage transactions = dailyTransactions[key];

            // Adiciona transações correspondentes ao array
            if (keccak256(bytes(transactions[0].userId)) == keccak256(bytes(userId)) &&
                keccak256(bytes(transactions[0].assetId)) == keccak256(bytes(assetId))) {
                for (uint256 j = 0; j < transactions.length; j++) {
                    allTransactions[index] = transactions[j];
                    index++;
                }
            }
        }

        return allTransactions;
    }

    function getTransactionsByUserAndDate(
        string memory userId,
        uint256 day,
        uint256 month,
        uint256 year
    ) public view returns (ReplayLibrary.Transaction[] memory) {
        uint256 totalTransactions = 0;

        // Primeiro, contar o número de transações correspondentes
        for (uint256 i = 0; i < transactionKeys.length; i++) {
            bytes32 key = transactionKeys[i];
            ReplayLibrary.Transaction[] storage transactions = dailyTransactions[key];

            // Verifica se o userId e a data da transação correspondem
            if (keccak256(bytes(transactions[0].userId)) == keccak256(bytes(userId)) &&
                transactions[0].day == day &&
                transactions[0].month == month &&
                transactions[0].year == year) {
                totalTransactions += transactions.length;
            }
        }

        // Inicializa um array com o tamanho correto
        ReplayLibrary.Transaction[] memory allTransactions = new ReplayLibrary.Transaction[](totalTransactions);
        uint256 index = 0;

        // Agora, popula o array com as transações
        for (uint256 i = 0; i < transactionKeys.length; i++) {
            bytes32 key = transactionKeys[i];
            ReplayLibrary.Transaction[] storage transactions = dailyTransactions[key];

            // Adiciona transações correspondentes ao array
            if (keccak256(bytes(transactions[0].userId)) == keccak256(bytes(userId)) &&
                transactions[0].day == day &&
                transactions[0].month == month &&
                transactions[0].year == year) {
                for (uint256 j = 0; j < transactions.length; j++) {
                    allTransactions[index] = transactions[j];
                    index++;
                }
            }
        }

        return allTransactions;
    }

    function getTransactionsByDay(
        string memory userId,
        uint256 day,
        uint256 month,
        uint256 year,
        string memory assetId
    ) public view returns (ReplayLibrary.Transaction[] memory) {
        bytes32 key = ReplayLibrary.encodeKey(
            userId,
            day,
            month,
            year,
            assetId
        );
        return dailyTransactions[key];
    }
}
