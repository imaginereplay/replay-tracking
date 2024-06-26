// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.11;

import "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "lib/openzeppelin-contracts-upgradeable/contracts/security/ReentrancyGuardUpgradeable.sol";
import "../../../extension/Multicall.sol";
import "../../interface/airdrop/IAirdropERC20Claimable.sol";
import "../../../lib/MerkleProof.sol";

contract AirdropERC20Claimable is Initializable, ReentrancyGuardUpgradeable, Multicall, IAirdropERC20Claimable {
    address public airdropTokenAddress;
    address public tokenOwner;
    uint256 public availableAmount;
    uint256 public expirationTimestamp;
    uint256 public openClaimLimitPerWallet;
    bytes32 public merkleRoot;

    mapping(address => uint256) public supplyClaimedByWallet;

    constructor() {
        _disableInitializers();
    }

    function initialize(
        address[] memory _trustedForwarders,
        address _tokenOwner,
        address _airdropTokenAddress,
        uint256 _airdropAmount,
        uint256 _expirationTimestamp,
        uint256 _openClaimLimitPerWallet,
        bytes32 _merkleRoot
    ) external initializer {
        __ReentrancyGuard_init();
        __ERC2771Context_init(_trustedForwarders);
        tokenOwner = _tokenOwner;
        airdropTokenAddress = _airdropTokenAddress;
        availableAmount = _airdropAmount;
        expirationTimestamp = _expirationTimestamp;
        openClaimLimitPerWallet = _openClaimLimitPerWallet;
        merkleRoot = _merkleRoot;
    }

    function claim(
        address _receiver,
        uint256 _quantity,
        bytes32[] calldata _proofs,
        uint256 _proofMaxQuantityForWallet
    ) external nonReentrant {
        address claimer = _msgSender();
        verifyClaim(claimer, _quantity, _proofs, _proofMaxQuantityForWallet);
        _transferClaimedTokens(_receiver, _quantity);
        emit TokensClaimed(_msgSender(), _receiver, _quantity);
    }

    function verifyClaim(
        address _claimer,
        uint256 _quantity,
        bytes32[] calldata _proofs,
        uint256 _proofMaxQuantityForWallet
    ) public view {
        bool isOverride;
        if (merkleRoot != bytes32(0)) {
            (isOverride, ) = MerkleProof.verify(
                _proofs,
                merkleRoot,
                keccak256(abi.encodePacked(_claimer, _proofMaxQuantityForWallet))
            );
        }
        uint256 supplyClaimedAlready = supplyClaimedByWallet[_claimer];
        require(_quantity > 0, "Claiming zero tokens");
        require(_quantity <= availableAmount, "exceeds available tokens.");
        uint256 expTimestamp = expirationTimestamp;
        require(expTimestamp == 0 || block.timestamp < expTimestamp, "airdrop expired.");
        uint256 claimLimitForWallet = isOverride ? _proofMaxQuantityForWallet : openClaimLimitPerWallet;
        require(_quantity + supplyClaimedAlready <= claimLimitForWallet, "invalid quantity.");
    }

    function _transferClaimedTokens(address _to, uint256 _quantityBeingClaimed) internal {
        supplyClaimedByWallet[_msgSender()] += _quantityBeingClaimed;
        availableAmount -= _quantityBeingClaimed;
        require(IERC20(airdropTokenAddress).transferFrom(tokenOwner, _to, _quantityBeingClaimed), "transfer failed");
    }

    function _msgSender() internal view virtual override(ERC2771ContextUpgradeable, Multicall) returns (address sender) {
        return ERC2771ContextUpgradeable._msgSender();
    }
}
