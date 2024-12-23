export interface Producto {
    id?: string
    id_producto?: number
    codigo: string
    nombre: string
    nombrecorto?: string
    marca?: string
    descripcion: string
    precio: number | string
    oferta?: boolean
    descuento?: number|string
    precio_oferta?: number|string
    stock?: number | string
    imagen?: string
    cantidad?: number|string
    estado?: string
    subtotal?: number
    porcentaje?: number
    total?: number
    iva?:number
    total_final?: number
    fotos?: ProductoFoto[]
}

interface ProductoFoto {
    id_producto_foto?: number
    fk_producto?: number
    recurso: string
}