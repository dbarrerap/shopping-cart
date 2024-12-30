import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from "../../../services/common.service";
import { ShopService } from '../../../views/shopping/shop/shop.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-header',
  templateUrl: './shopping-header.component.html',
  styleUrl: './shopping-header.component.scss'
})
export class ShoppingHeaderComponent {

  itemCount: number = 0;
  private itemsCountSubscription!: Subscription;
  private itemsSubscription!: Subscription;

  constructor(private commonService: CommonService,private shopService: ShopService, public _router: Router) {}

  ngOnInit():void{
    this.itemsCountSubscription = this.shopService.getItemsCount().subscribe(count => {
      this.itemCount = count;
      // console.log(this.itemCount)
   
    });
  }
  emitWallet = () => {
    this.commonService.wallet.next({})
  }

  emitSearch = () => {
    this.commonService.search.next({})
  }
}
