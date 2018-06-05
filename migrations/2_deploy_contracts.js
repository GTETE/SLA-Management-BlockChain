var SlaContracts = artifacts.require("./SlaContracts.sol");

module.exports = function(deployer) {
  deployer.deploy(SlaContracts);
};
