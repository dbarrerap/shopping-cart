import { Component, Input } from '@angular/core';
import { Producto } from '../../models';

@Component({
  selector: 'app-vertical-item',
  templateUrl: './vertical-item.component.html',
  styleUrl: './vertical-item.component.scss'
})
export class VerticalItemComponent {
  @Input() producto!: Producto
  public cantidad: number = 0

  increment = (valor: number) => {
    this.cantidad += valor;
    if (this.cantidad > parseInt(this.producto.stock as string)) this.cantidad = parseInt(this.producto.stock as string)
  }

  decrement = (valor: number) => {
    this.cantidad -= valor
    if (this.cantidad < 0) this.cantidad = 0
  }
}
