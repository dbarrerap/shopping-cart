import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { ShopComponent } from "./shop.component";

import { AppCustomModule } from "src/app/shared/app-custom.module";
import { WalletComponent } from './wallet/wallet.component';
import { SearchComponent } from './search/search.component';




@NgModule({
  declarations: [
    ShopComponent, 
    WalletComponent, 
    SearchComponent,
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    ShopRoutingModule,
  ],
})
export class ShopModule { }
