import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private apiService = inject(ApiService)

  getProductos = () => this.apiService.apiCall('productos', 'GET')

  getProductosSearch = (params: any) => {
    let endpoint = `productos?`
    Object.keys(params).forEach((key: string) => {
      console.log(key, params[key])
      endpoint += `&${key}=${params[key]}`
    })
    
    return this.apiService.apiCall(endpoint, 'GET')
  }
}
