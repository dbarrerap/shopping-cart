import { Component, Input } from '@angular/core';
import { Producto } from '../../models';

@Component({
  selector: 'app-horizontal-item',
  templateUrl: './horizontal-item.component.html',
  styleUrl: './horizontal-item.component.scss'
})
export class HorizontalItemComponent {
  @Input() producto!: Producto
  @Input() route!: string
}
