import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class CommonService {
    wallet: Subject<any>
    cart: Subject<any>
    search: Subject<any>

    constructor() {
        this.wallet = new Subject<any>()
        this.cart = new Subject<any>()
        this.search = new Subject<any>()
    }
}