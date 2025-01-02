import { Injectable } from '@angular/core';
import localforage from "localforage";
import { Producto } from '../shared/models'

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storeKey: string = 'cart'

  constructor() {
    localforage.config({
      name: 'ShoppingCart',
      storeName: 'shoppingCart',
      description: 'Carrito de compras'
    })
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
  }

  incrementarCantidad = async (id_producto: number): Promise<void> => {
    const carrito: Producto[] = (await localforage.getItem(this.storeKey)) || [];
    const index = carrito.findIndex((item: Producto) => item.id_producto === id_producto);
    if (index !== -1) {
      carrito[index].cantidad = parseInt(carrito[index].cantidad as string) + 1;
      await localforage.setItem(this.storeKey, carrito);
    }
  }

  decrementarCantidad = async (id_producto: number): Promise<void> => {
    const carrito: Producto[] = (await localforage.getItem(this.storeKey)) || [];
    const index = carrito.findIndex((item: Producto) => item.id_producto === id_producto);
    if (index !== -1) {
      carrito[index].cantidad = Math.max(1, parseInt(carrito[index].cantidad as string) - 1);
      await localforage.setItem(this.storeKey, carrito);
    }
  }

  obtenerCarrito = async (): Promise<any[]> => {
    return (await localforage.getItem(this.storeKey)) || [];
  }

  eliminarProducto = async (id_producto: number): Promise<void> => {
    const carrito: Producto[] = (await localforage.getItem(this.storeKey)) || []
    const nuevoCarrito = carrito.filter((item: Producto) => item.id_producto !== id_producto)
    await localforage.setItem(this.storeKey, nuevoCarrito)
  }

  limpiarCarrito = async (): Promise<void> => {
    await localforage.removeItem(this.storeKey)
  }
}

