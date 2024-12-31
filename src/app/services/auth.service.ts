import { inject, Injectable } from '@angular/core';

import { ApiService } from './api.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiService = inject(ApiService)
  validData: boolean = localStorage.getItem('validToken') === 'true'

  constructor() { }

  isLoggedIn = async (): Promise<boolean> => {
    const hasData = localStorage.getItem('Datauser') != null // || true

    if (hasData) {
      try {
        const res = await firstValueFrom(this.apiService.apiCall('seguridad/valida-token', 'POST')!)
        console.log(res);

        this.validData = true;
        localStorage.setItem('validToken', 'true');
      } catch (error) {
        console.error(error);
        localStorage.setItem('validToken', 'false');
        localStorage.removeItem('Datauser');
        setTimeout(() => location.reload(), 1750);
      }
    }

    console.log(hasData, this.validData)
    return hasData && this.validData || true;
  }

  /* isLoggedIn = (): boolean => {
    const hasData = localStorage.getItem('Datauser') != null // || true
    hasData && this.apiService.apiCall('seguridad/valida-token', 'POST')!.subscribe({
      next: (res: any) => {
        console.log(res)
        this.validData = true
        localStorage.setItem('validToken', 'true')
      },
      error: (err: any) => {
        console.error(err)
        // this.toastr.error('Token invalido, volver a iniciar sesion')
        localStorage.setItem('validToken', 'false')
        localStorage.removeItem('Datauser')
        setTimeout(() => {
          location.reload()
        }, 1750)
      }
    })


    console.log(hasData, this.validData)
    return hasData && this.validData || true;
  } */
}
