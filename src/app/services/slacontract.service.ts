import { Injectable } from '@angular/core';
import * as TruffleContract from 'truffle-contract';
declare let require: any;
const Web3 = require('web3');
const SlaContracts_artifacts = require('../../../build/contracts/SlaContracts.json');

declare let window: any;

@Injectable()
export class Web3Service {
  private web3: any;
  private accounts: string[];
  public ready = false;
  private slaContract: any;
  private contractInstance: any;
  private web3Provider = null;

  constructor() {
    window.addEventListener('load', (event) => {
      this.bootstrapWeb3();
    });
  }

  public bootstrapWeb3() {

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3Provider = window.web3.currentProvider;
    } else {
      console.log('No web3? You should consider trying MetaMask!');

      // Hack to provide backwards compatibility for Truffle, which uses web3js 0.20.x
      Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }

    this.web3 = new Web3(this.web3Provider);
    this.refreshAccounts();

    this.slaContract =  TruffleContract(SlaContracts_artifacts);
    this.slaContract.setProvider(this.web3Provider);
    this.slaContract.deployed().then(instance => {
      this.contractInstance = instance;
      }
    );
  }

  public GetBalance() {
    this.contractInstance.GetBalance().then(function(balance) {
      console.log(balance);
    });
  }

  private refreshAccounts() {
    this.web3.eth.getAccounts((err, accs) => {
      console.log('Refreshing accounts');
      if (err != null) {
        console.warn('There was an error fetching your accounts.');
        return;
      }

      // Get the initial account balance so it can be displayed.
      if (accs.length === 0) {
        console.warn('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
        return;
      }

      if (!this.accounts || this.accounts.length !== accs.length || this.accounts[0] !== accs[0]) {
        console.log('Observed new accounts');

        // this.accountsObservable.next(accs);
        this.accounts = accs;
      }

      this.ready = true;
    });
  }

}
