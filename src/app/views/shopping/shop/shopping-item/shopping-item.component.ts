import { Component, Input } from '@angular/core';
import { Producto } from "src/app/shared/models/Producto";

@Component({
  selector: 'app-shopping-item',
  templateUrl: './shopping-item.component.html',
  styleUrl: './shopping-item.component.scss'
})
export class ShoppingItemComponent {
  @Input() producto!: Producto
  public cantidad: number = 0;

  decrement = (quantity: number) => {
    this.cantidad -= quantity
  }

  increment = (quantity: number) => {
    this.cantidad += quantity
  }
}
