import { Component, EventEmitter, Input, Output,inject,OnInit, } from '@angular/core';
import { Producto } from '../../models';
import { Productos } from 'src/app/views/shopping/shop/productos.interface';
import { ShopService } from 'src/app/views/shopping/shop/shop.service';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-horizontal-item',
  templateUrl: './horizontal-item.component.html',
  styleUrl: './horizontal-item.component.scss'
})
export class HorizontalItemComponent implements OnInit  {
  @Input() producto: any = []
  @Input() route!: string
  public cantidad = 1
  @Output() updatedQuantity = new EventEmitter<number>()

  private service = inject(ShopService)
  private toastr = inject(ToastrService)

  orden: any = []

  // increment = (valor: number) => {
  //   this.cantidad += valor;
  //   if (this.cantidad > parseInt(this.producto.stock as string)) this.cantidad = parseInt(this.producto.stock as string)
    
  //   this.updatedQuantity.emit(this.cantidad)
  // }
  
  // decrement = (valor: number) => {
  //   this.cantidad -= valor
  //   if (this.cantidad < 0) this.cantidad = 0
    
  //   this.updatedQuantity.emit(this.cantidad)
  // }


  ngOnInit(): void {
    // this.productos = faker.helpers.multiple(this.createRandomProduct, { count: 30 })
     //this.productosFiltered = this.productos
 
   console.log(this.producto)
 
    
   }

   addToCart(product: any, index: number): void {
    if (product) {
      this.service.addToCart(product, index);
      console.log(product)
      if(product.cantidad > 1){
        //this.toastr.success(product.cantidad + ' '+product.nombre +' agregados al carrito')
        this.toastr.success(product.cantidad + ' ' + product.nombre + ' agregados al carrito', '', {
          positionClass: 'toast-top-center'
        });
      }else if(product.cantidad == 1){
        //this.toastr.success(product.cantidad + ' '+product.nombre +' agregado al carrito')
        this.toastr.success(product.cantidad + ' ' + product.nombre + ' agregados al carrito', '', {
          positionClass: 'toast-top-center'
        });
      }
    } else {
    }
    //this.service.cliente$.emit (this.orden);
  }
}
