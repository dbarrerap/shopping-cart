import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgxCurrencyInputMode } from "ngx-currency";

@Component({
  selector: 'cc-currency',
  templateUrl: './currency-input.component.html',
  styleUrl: './currency-input.component.scss'
})
export class CurrencyInputComponent implements OnInit, OnChanges {
  public config = {
    align: 'right',
    allowNegative: true,
    allowZero: true,
    decimal: '.',
    precision: 2,
    prefix: '$ ',
    suffix: '',
    thousands: ',',
    nullable: true,
    inputMode: NgxCurrencyInputMode.Natural
  }

  @Input() value: number|string = 0;
  @Input() currencyOptions: any = {};
  @Output() valueChange: EventEmitter<number> = new EventEmitter<number>()

  public amount: number = 0

  public options = {
    align: 'right',
    allowNegative: true,
    allowZero: true,
    decimal: '.',
    precision: 2,
    prefix: '$ ',
    suffix: '',
    thousands: ',',
    nullable: true,
    inputMode: NgxCurrencyInputMode.Natural
  }

  ngOnInit(): void {
    this.amount = parseFloat(this.value as string) || 0;

    setTimeout(() => {
      Object.assign(this.options, {...this.currencyOptions})
    }, 0)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      // Cuando el valor de 'value' cambia, actualizamos 'amount'
      this.amount = parseFloat(this.value as string) || 0;
    }
  }

  onAmountChange = () => {
    this.valueChange.emit(this.amount)
  }

  handleInput = (event: KeyboardEvent) => {
    const input = event.target as HTMLInputElement

    if (event.key == '.' || event.key == ',') {
      const currValue = input.value
      const cursorPos = input.selectionStart

      const decimalIdx = currValue.indexOf(this.options.decimal)

      if (decimalIdx === -1 || cursorPos! <= decimalIdx) {
        setTimeout(() => {
          input.setSelectionRange(decimalIdx + 1, decimalIdx + 1)
        }, 0)
      }
    }
    
  }

}
