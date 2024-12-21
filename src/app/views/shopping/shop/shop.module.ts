import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { ShopComponent } from "./shop.component";

import { AppCustomModule } from "../../../shared/app-custom.module";
import { WalletComponent } from './wallet/wallet.component';




@NgModule({
  declarations: [
    ShopComponent, 
    WalletComponent, 
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    ShopRoutingModule,
  ],
})
export class ShopModule { }
