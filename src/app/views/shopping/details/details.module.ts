import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsComponent } from "./details.component";
import { DetailsRoutingModule } from './details-routing.module';
import { AppCustomModule } from 'src/app/shared/app-custom.module';


@NgModule({
  declarations: [
    DetailsComponent,
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    DetailsRoutingModule
  ]
})
export class DetailsModule { }
