import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-rounded-button',
  templateUrl: './rounded-button.component.html',
  styleUrl: './rounded-button.component.scss'
})
export class RoundedButtonComponent {
  @Input() styleClass!: string
  @Output() click = new EventEmitter<void>()

  
}
