export interface Producto {
    id?: string
    codigo: string
    nombre: string
    descripcion: string
    precio: number | string
    oferta?: boolean
    descuento?: number|string
    precio_oferta?: number|string
    stock?: number | string
    imagen: string
    cantidad?: number|string
}