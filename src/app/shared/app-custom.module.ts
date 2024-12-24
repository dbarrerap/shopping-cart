import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CcInputGroup } from './cc-input-group.component';

import { NgbActiveModal, NgbModule, NgbAccordionModule } from "@ng-bootstrap/ng-bootstrap";
import { NgScrollbarModule } from "ngx-scrollbar";
import { HorizontalItemComponent, VerticalItemComponent, SearchComponent } from "./components/index";
import { RouterModule } from '@angular/router';
import { RoundedButtonComponent } from './components/rounded-button/rounded-button.component';



@NgModule({
    declarations: [
        CcInputGroup,
        HorizontalItemComponent,
        VerticalItemComponent,
        RoundedButtonComponent,
        SearchComponent

    ],
    imports: [
        CommonModule,
        NgbModule,
        NgbAccordionModule,
        FormsModule, 
        ReactiveFormsModule,
        NgScrollbarModule,
        RouterModule,
    ],
    exports: [
        CommonModule,
        CcInputGroup,
        HorizontalItemComponent,
        VerticalItemComponent,
        RoundedButtonComponent,
        SearchComponent, 
        NgbModule,
        NgbAccordionModule,
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