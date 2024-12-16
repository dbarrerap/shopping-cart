import { Component, Input,inject } from '@angular/core';
import { Producto } from '../../models';
//import { Productos } from '../../models/productos.interface';
import { Productos } from '../../../views/shopping/shop/productos.interface';
import { ShopService } from 'src/app/views/shopping/shop/shop.service';

@Component({
  selector: 'app-vertical-item',
  templateUrl: './vertical-item.component.html',
  styleUrl: './vertical-item.component.scss'
})
export class VerticalItemComponent {
 // @Input() producto!: Producto
  @Input() producto!: Productos
  @Input() index!: number
  private service = inject(ShopService)

  items: { product: Productos, cantidad: number }[] = [];
 
  public cantidad: number = 0
  lista_productos: any[] = [];
  ngOnInit(): void {

    this.service.pedido$.subscribe(
      (res)=>{
        console.log(res)
        
      
      }
    )

  
  }
  
  increment = (valor: number) => {
    this.cantidad += valor;
    //if (this.cantidad > parseInt(this.producto.stock as string)) this.cantidad = parseInt(this.producto.stock as string)
  }

  decrement = (valor: number) => {
    this.cantidad -= valor
    if (this.cantidad < 0) this.cantidad = 0
  }

  incrementarCantidad(product: Productos, index: number) {

    this.service.agregarDesdeCarrito(product,index);
    this.calculoIva();
  }
  disminuirCantidad(product: Productos, index: number) {

    this.service.disminuirDesdeCarrito(product,index);
    this.calculoIva();
    
  }
  calculoIva() {
    this.items.forEach(item => {
      item.product.iva = item.product.total *  0.15;
    });
    this.calculoTotalFinal();
  }
  calculoTotalFinal() {
    this.items.forEach(item => {
      item.product.total_final = item.product.total + item.product.iva;
    });
  }

  addToCart(product: any, index: number): void {
    if (product) {
      this.service.addToCart(product, index);
      console.log(product)
      if(product.cantidad > 1){
       // this.toastr.success(product.cantidad + ' '+product.nombre +' agregados al carrito')
        // this.toastr.success(product.cantidad + ' ' + product.nombre + ' agregados al carrito', '', {
        //   positionClass: 'toast-top-center'
        // });
      }else if(product.cantidad == 1){
        //this.toastr.success(product.cantidad + ' '+product.nombre +' agregado al carrito')
        // this.toastr.success(product.cantidad + ' ' + product.nombre + ' agregados al carrito', '', {
        //   positionClass: 'toast-top-center'
        // });
      }
    } else {
    }
   // this.service.cliente$.emit (this.orden);
  }
}
