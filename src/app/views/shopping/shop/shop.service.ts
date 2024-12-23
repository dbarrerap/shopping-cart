import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { LaravelPaginateResponse } from "../../../shared/models";

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private apiService = inject(ApiService)

  getProductos = (data?: any) => new Promise<LaravelPaginateResponse>((resolve, reject) => {
    this.apiService.apiCall('pedidos/get-productos', 'POST', data)?.subscribe({
      next: (response: any) => {
        if (!response || response.data === undefined) {
          console.error('Error con la respuesta del servidor', response)
          reject('Error con la respuesta del servicio')
        }

        resolve(response.data)
      },
      error: (error: any) => {
        console.log('Error con el servicio', error)
        reject(error)
      }
    })
  })

  getProductosSearch = (params: any) => {
    let endpoint = `productos?`
    Object.keys(params).forEach((key: string) => {
      console.log(key, params[key])
      endpoint += `&${key}=${params[key]}`
    })
    
    return this.apiService.apiCall(endpoint, 'GET')
  }

  getProductosFotosAsync(data: any = {}): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCallPedidos("pedidos/get-productos-fotos", "POST", data).subscribe({
        next: (res: any) => {
          console.log('Respuesta del servidor:', res);
          if (res && res.data !== undefined) {
            resolve(res.data);
          } else {
            reject(new Error('La respuesta no contiene un campo "data".'));
          }
        },
        error: (err: any) => {
          console.error('Error en la solicitud:', err);
          reject(err);
        },
      });
    });
  }

  // getProductosFotos(data: any = {})
  // {
  //   return this.apiService.apiCallPedidos('pedidos/get-productos-fotos', 'POST', data);
  // }
  getProductosFotos(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.apiCallPedidos('pedidos/get-productos-fotos', 'POST', data).subscribe({
        next: (res: any) => resolve(res),
        error: (err: any) => reject(err),
        complete: () => console.log('getProductosFotos completado'), // Opcional
      });
    });
  }

  
  
  
}
