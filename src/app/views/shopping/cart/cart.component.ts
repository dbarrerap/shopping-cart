import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente, OrdenCompra, Producto } from "src/app/shared/models/index";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  public router = inject(Router)
  private cliente: Cliente = {
    nombre: 'David Barrera',
    direccion: 'Samanes 7',
    telefono: '0981548032',
    email: 'dbarrerap@live.com'
  }
  private productos: Producto[] = [
    {
      codigo: '6190f888-a983-491c-9b3f-b56167717d9f',
      nombre: 'Small Metal Hat',
      descripcion: 'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
      precio: 327.00,
      imagen: '',
      cantidad: 1
    },
    {
      codigo: '6190f888-a983-491c-9b3f-b56167717d9f',
      nombre: 'Small Metal Hat',
      descripcion: 'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
      precio: 327.00,
      imagen: '',
      cantidad: 2
    },
    {
      codigo: '6190f888-a983-491c-9b3f-b56167717d9f',
      nombre: 'Small Metal Hat',
      descripcion: 'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
      precio: 327.00,
      imagen: '',
      cantidad: 3
    },
  ]
  private subtotal: number = this.productos.reduce((acc: number, curr: Producto) => acc + parseFloat(curr.precio as string), 0) / 1.15
  private subtotal_iva: number = this.subtotal
  private iva: number = this.subtotal * 0.15
  private total: number = this.subtotal + this.iva
  /* @Input() */ public orden: OrdenCompra = {
    cliente: this.cliente,
    detalles: this.productos,
    subtotal: this.subtotal,
    subtotal_iva: this.subtotal,
    subtotal_0: 0,
    iva: this.iva,
    descuento: 0,
    total: this.total,
    transporte: 0,
    total_cobro: this.total
  }
}
