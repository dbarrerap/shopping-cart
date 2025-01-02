import { Component, inject, Input } from '@angular/core';
import { Producto } from '../../../../shared/models';
import { CartService } from '../../../../services/cart.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  @Input() producto!: Producto

  private cartService = inject(CartService)
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
}
