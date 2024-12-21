export interface Producto {
    id?: string
    id_producto?: number
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
    fotos?: ProductoFoto[]
}

interface ProductoFoto {
    recurso: string
}