pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;
import './ERC721Mintable.sol';
import './verifier.sol';

// REAL ESTATE TOKEN NAME: PDS_ERC721Token

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract verifier{
}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is PDS_ERC721Token {
    
    Verifier private zokrateVerifier;

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint index;
        address soluAddress;
    }

    constructor(address verifierAddress) public {
        zokrateVerifier = Verifier(verifierAddress);
    }

    function getSolutionLength() public view returns(uint256) {
        return solutionArray.length;
    }

    // TODO define an array of the above struct
    Solution[] private solutionArray;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) private solutionMapping;

    // TODO Create an event to emit when a solution is added
    event SolutionE(uint256 index, address holder);

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(address to, uint256 tokenId, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory inputs) public {
        // we can hash the results of the inputs
        bytes32 hash_value = keccak256(abi.encodePacked(a,b,c, inputs));

        // we push value in the array
        uint256 solutionNumber = solutionArray.length;
        solutionArray.push(Solution(solutionNumber, to));

        // we store in the mapping of the last position
        solutionMapping[hash_value] = Solution(solutionNumber, to);
        emit SolutionE(solutionNumber, to);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function VerifyAndMint(address to, uint256 tokenId, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory inputs) public returns (bool result) {

        // has the proof values
        bytes32 hash_value = keccak256(abi.encodePacked(a,b,c,inputs));

        // make sure we have not the hash value in mapping before
        require(solutionMapping[hash_value].soluAddress == address(0), "Solution already used before.");

        // verify transaction
        bool verified = zokrateVerifier.verifyTx(a, b, c, inputs);

        // add solution
        require(verified, "Solution not verified."); 
        addSolution(to, tokenId, a, b, c, inputs);

        super.mint(to, tokenId);
    }
}











































