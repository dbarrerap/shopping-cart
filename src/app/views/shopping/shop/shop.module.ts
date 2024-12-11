import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { ShopComponent } from "./shop.component";
import { ShoppingItemComponent } from './shopping-item/shopping-item.component'

import { AppCustomModule } from "src/app/shared/app-custom.module";
import { WalletComponent } from './wallet/wallet.component';
import { SearchComponent } from './search/search.component';
import { SarchItemComponent } from "./search/sarch-item/sarch-item.component";




@NgModule({
  declarations: [
    ShopComponent, 
    ShoppingItemComponent, 
    WalletComponent, 
    SearchComponent,
    SarchItemComponent,
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    ShopRoutingModule,
  ],
})
export class ShopModule { }
