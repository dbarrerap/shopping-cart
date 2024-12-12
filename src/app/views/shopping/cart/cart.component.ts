import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente, OrdenCompra, Producto } from "src/app/shared/models";
import { fakerES_MX as faker } from "@faker-js/faker";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  public router = inject(Router)
  /* @Input() */ public orden!: OrdenCompra

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
