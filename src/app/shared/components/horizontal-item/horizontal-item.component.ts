import { Component, Input, OnInit } from '@angular/core';
import { Producto } from '../../models';

@Component({
  selector: 'app-horizontal-item',
  templateUrl: './horizontal-item.component.html',
  styleUrl: './horizontal-item.component.scss'
})
export class HorizontalItemComponent implements OnInit {
  @Input() producto!: Producto
  @Input() route!: string

  ngOnInit(): void {
    setTimeout(() => { console.log(this.route) }, 0)
  }
}
