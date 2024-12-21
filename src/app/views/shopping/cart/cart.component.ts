import { Component, ElementRef, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fakerES_MX as faker } from "@faker-js/faker";
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Cliente, OrdenCompra, Producto } from "../../../shared/models";
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnDestroy {
  @ViewChild('modalSearch', { static: false }) modalSearch!: ElementRef
  private searchSubscription!: Subscription
  public router = inject(Router)
  /* @Input() */ public orden!: OrdenCompra
  private commonService = inject(CommonService)
  private modalService = inject(NgbModal)

  constructor() {
    this.searchSubscription = this.commonService.search.asObservable().subscribe(() => {
      this.modalService.open(this.modalSearch, { size: 'xl', windowClass: 'transparent-modal' })
    }
    )
  }

  ngOnInit(): void {
    const cliente: Cliente = {
      nombre: faker.person.fullName(),
      direccion: faker.location.streetAddress(),
      telefono: faker.phone.number(),
      email: faker.internet.email()
    }
    const detalles = faker.helpers.multiple(this.createRandomProduct, { count: faker.number.int({min: 3, max: 10}) })
    const subtotal = detalles.reduce((acc: number, curr: Producto) => acc + parseFloat(curr.precio_oferta as string), 0)
    const iva = subtotal * 0.15
    const total = subtotal + iva
    this.orden = {
      cliente,
      detalles,
      subtotal,
      subtotal_0: 0,
      subtotal_iva: subtotal,
      iva,
      total,
      descuento: 0,
      transporte: 0,
      total_cobro: total
    }
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe()
  }

  handleUpdateQuantity = (quantity: number) => {
    console.log(quantity);
    
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
      stock: faker.number.int({min: 1000, max: 65000}),
      imagen: `assets/images/productos/repuesto-${imagenNumber}.png`,
    }
  }
}
