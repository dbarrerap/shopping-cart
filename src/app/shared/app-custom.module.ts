import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';

import { 
    NgbModule,
    NgbActiveModal, 
    NgbCarouselModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgScrollbarModule } from "ngx-scrollbar";
import { 
    AccordionModule,
    SharedModule,
    SpinnerModule,
    CarouselModule,
} from "@coreui/angular";

import { CcInputGroup } from './cc-input-group.component';
import { 
    HorizontalItemComponent, 
    VerticalItemComponent, 
    RoundedButtonComponent,
    SearchComponent, 
} from "./components/index";


@NgModule({
    declarations: [
        CcInputGroup,
        HorizontalItemComponent,
        VerticalItemComponent,
        RoundedButtonComponent,
        SearchComponent, 
        
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule, 
        ReactiveFormsModule,
        NgScrollbarModule,
        RouterModule,
        SharedModule,
        AccordionModule,
        SpinnerModule,
        CarouselModule,
        NgbCarouselModule,
    ],
    exports: [
        CommonModule,
        CcInputGroup,
        HorizontalItemComponent,
        VerticalItemComponent,
        RoundedButtonComponent,
        SearchComponent, 
        NgbModule,
        FormsModule, 
        ReactiveFormsModule,
        NgScrollbarModule,
        SharedModule,
        AccordionModule,
        SpinnerModule,
        CarouselModule,
        NgbCarouselModule,
    ],
    providers: [
        NgbActiveModal,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppCustomModule { }