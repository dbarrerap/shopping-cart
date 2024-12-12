import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ShopService } from "./shop.service";
import { CommonService } from 'src/app/services/common.service';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/shared/models';

import { fakerES_MX as faker } from "@faker-js/faker";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit, OnDestroy {
  @ViewChild('modalSearch', { static: false }) modalSearch!: ElementRef
  @ViewChild('modalWallet', { static: false }) modalWallet!: ElementRef
  private service = inject(ShopService)
  private commonService = inject(CommonService)
  private modalService = inject(NgbModal)
  private walletSubscription!: Subscription
  private searchSubscription!: Subscription

  public productos: any[] = []
  public pagination: any = {
    _page: 1,
    _per_page: 6,
    _limit: 6,
    _length: 0,
    _pages: 0,
    _start: 0,
    _end: 0,
  }

  // Usar una estruxtura para automatizar filtros genera error
  public filterDeliveryItems = [
    {label: 'Free Store', items: 8},
    {label: 'Free Delivery', items: 8},
    {label: 'Fast Delivery', items: 8}
  ]

  constructor() {
    this.walletSubscription = this.commonService.wallet.asObservable().subscribe(() => {
      this.modalService.open(this.modalWallet, { size: 'lg', centered: true })
    })
    this.searchSubscription = this.commonService.search.asObservable().subscribe(() => {
      this.modalService.open(this.modalSearch, { size: 'xl', windowClass: 'transparent-modal' })
    }
    )
  }

  ngOnInit(): void {
    setTimeout(() => {
     this.productos = faker.helpers.multiple(this.createRandomProduct, {count: 60})
     Object.assign(this.pagination, {
      _length: this.productos.length,
      _pages: Math.ceil(this.productos.length / this.pagination._per_page),
      _start: (this.pagination._page - 1) * this.pagination._per_page + 1,
      _end: Math.min(this.pagination._page * this.pagination._per_page, this.productos.length)
    })
    }, 0)
  }

  ngOnDestroy(): void {
    this.walletSubscription.unsubscribe()
    this.searchSubscription.unsubscribe()
  }

  changePage = (event: number) => {
    // console.log(event);
    Object.assign(this.pagination, {
      _page: event,
      _start: (event - 1) * this.pagination._per_page + 1,
      _end: Math.min(event * this.pagination._per_page, this.productos.length)
    })

  }

  logger = (event: any) => {
    console.log(event);

  }

  createRandomProduct = (): Producto => {
    const imagenNumber: number = Math.floor(Math.random() * 6) + 1
    const precio: number = parseFloat(faker.commerce.price())
    const oferta: boolean = faker.datatype.boolean({probability: 0.75})
    const descuento = (Math.floor(Math.random() * 25) + 1)
    const precio_oferta = oferta ? precio / (1 + (descuento / 100)) : precio
    return {
      id: faker.database.mongodbObjectId(),
      nombre: faker.commerce.productName(),
      codigo: faker.commerce.isbn(),
      descripcion: faker.commerce.productDescription(),
      precio,
      oferta,
      descuento,
      precio_oferta,
      imagen: `assets/images/productos/repuesto-${imagenNumber}.png`,
    }
  }
}
