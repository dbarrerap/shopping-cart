import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CcInputGroup } from './cc-input-group.component';

import { NgbActiveModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgScrollbarModule } from "ngx-scrollbar";
import { HorizontalItemComponent, VerticalItemComponent } from "./components/index";

@NgModule({
    declarations: [
        CcInputGroup,
        HorizontalItemComponent,
        VerticalItemComponent,
        
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule, 
        ReactiveFormsModule,
        NgScrollbarModule,
    ],
    exports: [
        CommonModule,
        CcInputGroup,
        HorizontalItemComponent,
        VerticalItemComponent,
        NgbModule,
        FormsModule, 
        ReactiveFormsModule,
        NgScrollbarModule,
    ],
    providers: [
        NgbActiveModal,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppCustomModule { }