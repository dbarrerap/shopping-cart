import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreditData } from '../../../../shared/models';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.scss'
})
export class WalletComponent {
  private activeModal = inject(NgbActiveModal)
  close = () => {
    this.activeModal.close()
  }

  public credit: CreditData = {
    estado: 0,
    cupo_credito: 0,
    cupo_disponible: 0,
    facturas_vencidas: 0,
    valores_vencidos: 0
  }
}
