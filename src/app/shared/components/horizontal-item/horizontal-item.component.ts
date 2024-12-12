import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Producto } from '../../models';

@Component({
  selector: 'app-horizontal-item',
  templateUrl: './horizontal-item.component.html',
  styleUrl: './horizontal-item.component.scss'
})
export class HorizontalItemComponent {
  @Input() producto!: Producto
  @Input() route!: string
  public cantidad = 1
  @Output() updatedQuantity = new EventEmitter<number>()

  increment = (valor: number) => {
    this.cantidad += valor;
    if (this.cantidad > parseInt(this.producto.stock as string)) this.cantidad = parseInt(this.producto.stock as string)
    
    this.updatedQuantity.emit(this.cantidad)
  }
  
  decrement = (valor: number) => {
    this.cantidad -= valor
    if (this.cantidad < 0) this.cantidad = 0
    
    this.updatedQuantity.emit(this.cantidad)
  }
}
