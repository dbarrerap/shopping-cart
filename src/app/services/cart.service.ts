import { Injectable } from '@angular/core';
import localforage from "localforage";
import { Producto } from '../shared/models'
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storeKey: string = 'cart'
  private itemCount = new BehaviorSubject<number>(0);

  itemCount$ = this.itemCount.asObservable()

  constructor() {
    localforage.config({
      name: 'ShoppingCart',
      storeName: 'shoppingCart',
      description: 'Carrito de compras'
    })

    this.actualizarContador()
  }

  agregarProducto = async (producto: Producto): Promise<void> => {
    const carrito: Producto[] = await localforage.getItem(this.storeKey) || [];
    const index = carrito.findIndex((item: Producto) => item.id_producto === producto.id_producto);
    if (index !== -1) {
      carrito[index].cantidad = parseInt(carrito[index].cantidad as string) + 1;
    } else {
      carrito.push({ ...producto });
    }
    await localforage.setItem(this.storeKey, carrito);
    this.actualizarContador()
  }

  incrementarCantidad = async (id_producto: number): Promise<void> => {
    const carrito: Producto[] = (await localforage.getItem(this.storeKey)) || [];
    const index = carrito.findIndex((item: Producto) => item.id_producto === id_producto);
    if (index !== -1) {
      carrito[index].cantidad = parseInt(carrito[index].cantidad as string) + 1;
      await localforage.setItem(this.storeKey, carrito);
      this.actualizarContador()
    }
  }

  decrementarCantidad = async (id_producto: number): Promise<void> => {
    const carrito: Producto[] = (await localforage.getItem(this.storeKey)) || [];
    const index = carrito.findIndex((item: Producto) => item.id_producto === id_producto);
    if (index !== -1) {
      carrito[index].cantidad = Math.max(1, parseInt(carrito[index].cantidad as string) - 1);
      await localforage.setItem(this.storeKey, carrito);
      this.actualizarContador()
    }
  }

  obtenerCarrito = async (): Promise<Producto[]> => {
    return (await localforage.getItem(this.storeKey)) || [];
  }

  eliminarProducto = async (id_producto: number): Promise<void> => {
    const carrito: Producto[] = (await localforage.getItem(this.storeKey)) || []
    const nuevoCarrito = carrito.filter((item: Producto) => item.id_producto !== id_producto)
    await localforage.setItem(this.storeKey, nuevoCarrito)
    this.actualizarContador()
  }

  limpiarCarrito = async (): Promise<void> => {
    await localforage.removeItem(this.storeKey)
    this.actualizarContador()
  }

  private actualizarContador = async (): Promise<void> => {
    const carrito: Producto[] = await this.obtenerCarrito();
    const total = carrito.reduce((sum, item) => sum + parseInt(item.cantidad! as string), 0);
    this.itemCount.next(total); // Emitir el nuevo total
  }
}

