import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartComponent } from "./cart.component";
import { CartRoutingModule } from './cart-routing.module';
import { AppCustomModule } from 'src/app/shared/app-custom.module';
import { CartItemComponent } from './cart-item/cart-item.component';


@NgModule({
  declarations: [
    CartComponent,
    CartItemComponent,
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    CartRoutingModule
  ]
})
export class CartModule { }
