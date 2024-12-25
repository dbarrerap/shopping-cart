import { Cliente } from "./Cliente";
import { Producto } from "./Producto";

export interface OrdenCompra {
    cliente?: Cliente
    detalles?: Producto[]
    subtotal?: number
    subtotal_iva?: number
    subtotal_0?: number
    iva?: number
    descuento?: number
    total?: number
    transporte?: number
    total_cobro?: number

    estado?: string
    fecha?: string
    tipo_documento?: string

    nombre?: string
    cedula?: string
    direccion?: string
    observacion?: string
    cliente_email?: string
    cliente_telefono?: string
    porcentaje_iva?: number
    total_con_impuesto?: number
}