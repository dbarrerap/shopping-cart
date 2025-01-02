import { Component, inject, Input } from '@angular/core';
import { Producto } from '../../../../shared/models';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  @Input() producto!: Producto
  @Input() removeFromCart!: (id_producto: number) => Promise<void>
  @Input() incrementarCantidad!: (id_producto: number) => Promise<void>
  @Input() decrementarCantidad!: (id_producto: number) => Promise<void>

  public defaultImage = 'https://placehold.co/320?text=Sin+Imagen'

  incrementar = () => {
    this.producto.cantidad = parseInt(this.producto.cantidad as string) + 1
  }

  decrementar = () => {
    let cantidad: number = parseInt(this.producto.cantidad as string)
    cantidad -= 1
    if (cantidad < 1) {
      cantidad = 1
    }
    this.producto.cantidad = cantidad
    
  }

  onIncrementar = async (): Promise<void> => {
    await this.incrementarCantidad(this.producto.id_producto!)
  }

  onDecrementar = async (): Promise<void> => {
    await this.decrementarCantidad(this.producto.id_producto!)
  }
 
  onEliminar = async (): Promise<void> => {
    await this.removeFromCart(this.producto.id_producto!)
  }
}
