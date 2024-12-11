import { Cliente } from "./Cliente";
import { Producto } from "./Producto";

export interface OrdenCompra {
    cliente: Cliente
    detalles: Producto[]
    subtotal: number
    subtotal_iva: number
    subtotal_0: number
    iva: number
    descuento: number
    total: number
    transporte: number
    total_cobro: number
}