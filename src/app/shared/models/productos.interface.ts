export interface Productos {
    id_producto: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    nombrecorto: string;
    marca: string;
    precio1: string;
    stock: number;
    estado: string;
    id_usuario: number;
    fotos: Fotos[];
    cantidad: number,
    subtotal: number,
    porcentaje: number,
    descuento: number,
    total: number,
    iva:number,
    total_final: number,

    // Otros campos que sean necesarios
  }

  interface Fotos {
    id_producto_fotos: number;
    fk_producto: number;
    recurso: string;
  }

 