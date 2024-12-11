import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sarch-item',
  templateUrl: './sarch-item.component.html',
  styleUrl: './sarch-item.component.scss'
})
export class SarchItemComponent {
  @Input() producto!: any

}
