import { Component } from '@angular/core';
import { Web3Service } from './services/slacontract.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private web3Service: Web3Service) {

  }

  GetBalance() {
    this.web3Service.GetBalance();
  }
}
