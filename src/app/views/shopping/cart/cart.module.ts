import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartComponent } from "./cart.component";
import { CartRoutingModule } from './cart-routing.module';
import { AppCustomModule } from '../../../shared/app-custom.module';

// import { SearchComponent } from '../../../views/shopping/shop/search/search.component';




@NgModule({
  declarations: [
    CartComponent,
    // SearchComponent
    
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    CartRoutingModule
  ]
})
export class CartModule { }
