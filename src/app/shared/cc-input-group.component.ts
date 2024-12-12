import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
    selector: 'app-cc-input-group',
    template: `
    <div class='input-group input-group-sm mt-1'>
      <span class="input-group-text {{ styleSpan }}" (click)="accionClickSpan()" placement="bottom" [ngbTooltip]="spanToolTip">{{ label }}</span>
      <ng-content></ng-content>
    </div>
    `,
})

export class CcInputGroup implements OnInit {
    @Input() label!: string;
    @Input() styleSpan!: string;
    @Input() spanToolTip!:string;

    @Output() onAccionClickSpan: EventEmitter<any> = new EventEmitter();

    ngOnInit(): void {
        this.spanToolTip = this.label
    }

    accionClickSpan = () => {
        this.onAccionClickSpan.emit()
    }
}