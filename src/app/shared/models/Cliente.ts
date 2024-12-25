export interface Cliente {
    nombre: string
    direccion: string
    telefono: string
    email?: string

    cedula: string
    observacion?: string
    cliente_email?: string
    cliente_telefono?: string
    porcentaje_iva?: number
    total_con_impuesto?: number
}