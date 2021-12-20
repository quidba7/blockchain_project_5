// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
var ERC721MintableComplete = artifacts.require('PDS_ERC721Token');
var verifier = artifacts.require('verifier');
var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const json = require("../../zokrates/proof.json");

contract('TestSolnSquareVerifiere', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];

    describe('Mint token after verifying transaction', function () {
        beforeEach(async function () {
            const verifierAddress = (await verifier.deployed()).address;
            this.pds_contract = await SolnSquareVerifier.new(verifierAddress, {from: account_one});

        })
        
        it('should add a new solution to zokrates', async function () {

            await this.pds_contract.addSolution(account_two, 2, json.proof.a, json.proof.b, json.proof.c, json.inputs);

            // now test that we have 1 solution in the array
            solutionLength = await this.pds_contract.getSolutionLength();

            assert.equal(solutionLength, 1, "We have succesfully confirm 1 solution in our verifier.");
        })

        it('should mint a new token after verifying the transaction', async function () {
            // mint contract using proof from json
            await this.pds_contract.VerifyAndMint(account_two, 2, json.proof.a, json.proof.b, json.proof.c, json.inputs, {from: account_one});
            await this.pds_contract.VerifyAndMint(account_three, 3, json.proof1.a, json.proof1.b, json.proof1.c, json.inputs1, {from: account_one});
            await this.pds_contract.VerifyAndMint(account_three, 4, json.proof2.a, json.proof2.b, json.proof2.c, json.inputs2, {from: account_one});
            await this.pds_contract.VerifyAndMint(account_two, 5, json.proof3.a, json.proof3.b, json.proof3.c, json.inputs3, {from: account_one});

            // now collect 
            let result = await this.pds_contract.totalSupply.call({from: account_one});
            // mint 
            assert.equal(result, 4, "We have not successfully minted 4 contracts with 4 different proofs.");
        })
    });
})