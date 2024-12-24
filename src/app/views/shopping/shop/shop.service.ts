import { inject, Injectable, EventEmitter } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { LaravelPaginateResponse } from "../../../shared/models";
import { Productos } from './productos.interface';
import { Cliente } from './cliente.interface';
import { BehaviorSubject } from 'rxjs';



interface CartItem {
  product: Productos;
  cantidad: number;
}

type ClienteArray = Cliente[];

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private items: CartItem[] = [];
  // private cliente: Cliente[] = [];
   private clientearray: Cliente[] = [];
  private itemsCount = new BehaviorSubject<number>(0);
  private cliente = new BehaviorSubject<ClienteArray>([]);
  pedido$ = new EventEmitter<any>();
  cliente$ = new EventEmitter<any>();

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
        next: (res: any) => resolve(res),
        error: (err: any) => reject(err),
        complete: () => console.log('getProductosFotos completado'), 
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
        next: (res: any) => resolve(res.data),
        error: (err: any) => reject(err),
        complete: () => console.log('getProductosFotos completado'), 
      });
    });
  }

  getGruposMarcas(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.apiCallPedidos('pedidos/get-grupos-marcas', 'POST', data).subscribe({
        next: (res: any) => resolve(res.data),
        error: (err: any) => reject(err),
        complete: () => console.log('getProductosFotos completado'), 
      });
    });
  }

  getProducto(id:number,data:any={})
  {
   return new Promise<any>((resolve,reject)=>{
     this.apiService.apiCallPedidos(`pedidos/consultar-producto-foto/${id}`, "POST", data).subscribe({
        next: (res: any) => resolve(res),
        error: (err: any) => reject(err),
        complete: () => console.log('pedidos/consultar-producto-foto completado')
      //  (res:any)=>resolve(res.data),
      //  (err:any)=>reject(err)

    })

   })
  }

  setOrdenPedido(data:any) {
    return this.apiService.apiCallPedidos('pedidos/guardar-documento', 'POST', data);
  }

  editarPedido(data:any) {
    return this.apiService.apiCallPedidos('pedidos/actualizar-pedido', 'POST', data);
  }

  addToCart(product: Productos) {
    console.log(product)
    const existingItemIndex = this.items.findIndex(item => this.areProductsEqual(item.product, product));
    console.log(existingItemIndex)
    if (existingItemIndex !== -1) {
      this.items[existingItemIndex].cantidad += Number(product.cantidad);
      this.items[existingItemIndex].product.porcentaje = 0;
      this.items[existingItemIndex].product.transporte = 0;
      this.items[existingItemIndex].product.subtotal_iva = product.codigo_impuesto_iva == 2 ? product.subtotal :  0;
      this.items[existingItemIndex].product.subtotal_0 = product.codigo_impuesto_iva != 2 ? product.subtotal :  0;
      this.items[existingItemIndex].product.iva = parseFloat(product.precio1) * Number(product.cantidad) * 0.15;
      this.items[existingItemIndex].product.total_final = parseFloat(product.precio1)  * Number(product.cantidad) + product.iva;
      // this.items[existingItemIndex].product.fotos = {id_producto_fotos: 0,fk_producto: 0,recurso: ''}

    } else {
      product.porcentaje = 0;
      product.transporte = 0;
      product.subtotal_iva = product.codigo_impuesto_iva == 2 ? product.subtotal :  0;
      product.subtotal_0 = product.codigo_impuesto_iva != 2 ? product.subtotal :  0;
      product.iva = Number(product.precio1) * Number(product.cantidad) * 0.15;
      product.total_final = parseFloat(product.precio1)  * Number(product.cantidad) + product.iva;
      // product.fotos = {id_producto_fotos: 0,fk_producto: 0,recurso: ''}
      this.items.push({ product , cantidad: Number(product.cantidad)});
    }
    this.pedido$.emit ({val: 'AGREGAR', data:this.items});
    this.updateItemsCount();
  }

 

  agregarDesdeCarrito(product: Productos) {
    console.log(product)
    const existingItemIndex = this.items.findIndex(item => this.areProductsEqual(item.product, product));
    console.log(existingItemIndex)
    if (existingItemIndex !== -1) {
      console.log('1')
      this.items[existingItemIndex].cantidad += 1;
      this.pedido$.emit ({val: 'CARRITO AGREGAR', data:this.items});
      console.log(this.items)
      //this.items[existingItemIndex].product.porcentaje = 0;
     
    } else {
      console.log('2')
      //product.porcentaje = 0;
      this.items.push({ product , cantidad: 1 });
      this.pedido$.emit ({val: 'CARRITO AGREGAR', data:this.items});
    }
    this.updateItemsCount();
  }

  disminuirDesdeCarrito(product: Productos) {
    console.log(product);
    const existingItemIndex = this.items.findIndex(item => this.areProductsEqual(item.product, product));
    console.log(existingItemIndex);
    if (existingItemIndex !== -1) {
      console.log('1');
      if (this.items[existingItemIndex].cantidad > 1) {
        this.items[existingItemIndex].cantidad -= 1;
        this.pedido$.emit ({val: 'CARRITO DISMINUIR', data:this.items});
        console.log(this.items)
      } else {
        this.items.splice(existingItemIndex, 1);
        this.pedido$.emit ({val: 'CARRITO DISMINUIR', data:this.items});
        console.log(this.items)
      }
    }
    this.updateItemsCount();
  }

  eliminarDesdeCarrito(id_producto:number,index:number){
    console.log(index)
    this.items.splice(index, 1);
    this.pedido$.emit ({val: 'ELIMINAR', data:this.items, id_eliminado:id_producto });
    this.updateItemsCount();
    this.getItems()
    console.log(this.items)

  }

  agregarClienteDesdeCarrito( cliente: any) {

      this.cliente.next(cliente);
      console.log(this.cliente)
  }

  private areProductsEqual(product1: Productos, product2: Productos): boolean {
    return product1.id_producto === product2.id_producto && 
           product1.codigo === product2.codigo &&
           product1.nombre === product2.nombre &&
           product1.nombrecorto === product2.nombrecorto &&  
           product1.marca === product2.marca && 
           product1.precio1 === product2.precio1 && 
           product1.descripcion === product2.descripcion &&
           product1.stock === product2.stock && 
           product1.estado === product2.estado && 
           product1.id_usuario === product2.id_usuario;
  }

  updateItemsCount() {
    const totalCount = this.items.reduce((total, item) => total + Number(item.cantidad), 0);
    console.log(totalCount)
    this.itemsCount.next(totalCount);
  }
 

  getItems() {
    return this.items;
  }
  getCliente() {
    return this.cliente.asObservable();;
  }

  getItemsCount() {
    return this.itemsCount.asObservable();
  }

  clearCart() {
    this.items = [];
    this.updateItemsCount();
    return this.items;
  }

  increaseQuantity(product: Productos) {
    const existingItemIndex = this.items.findIndex(item => item.product.id_producto === product.id_producto);
    if (existingItemIndex !== -1) {
      this.items[existingItemIndex].cantidad += 1;
      this.updateItemsCount();
    }
  }

 decreaseQuantity(product: Productos) {
  const existingItemIndex = this.items.findIndex(item => item.product.id_producto === product.id_producto);
  if (existingItemIndex !== -1) {
    const existingItem = this.items[existingItemIndex];
    if (existingItem.cantidad > 1) {
      existingItem.cantidad -= 1;
    } else {
      this.items.splice(existingItemIndex, 1);
    }
    this.updateItemsCount();
  }
}


  
  
  
}
