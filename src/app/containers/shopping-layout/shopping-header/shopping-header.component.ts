import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from "src/app/services/common.service";

@Component({
  selector: 'app-shopping-header',
  templateUrl: './shopping-header.component.html',
  styleUrl: './shopping-header.component.scss'
})
export class ShoppingHeaderComponent {
  constructor(private commonService: CommonService, public _router: Router) {}
  emitWallet = () => {
    this.commonService.wallet.next({})
  }

  emitSearch = () => {
    this.commonService.search.next({})
  }
}
