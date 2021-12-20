// migrating the appropriate contracts
var SquareVerifier = artifacts.require("./contracts/verifier.sol");
var SolnSquareVerifier = artifacts.require("./contracts/SolnSquareVerifier.sol");
var verifier = artifacts.require('verifier');

module.exports = function(deployer) {
  deployer.then(async () => {
    await deployer.deploy(SquareVerifier);
    await deployer.deploy(SolnSquareVerifier, SquareVerifier.address);
    await deployer.deploy(verifier);
  })
};
