import { Component, EventEmitter, Input, Output,inject,OnInit, } from '@angular/core';
import { Producto, Cliente } from '../../models';
import { ShopService } from 'src/app/views/shopping/shop/shop.service';
import { ToastrService } from 'ngx-toastr'; 
import { Subscription } from 'rxjs';

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


  public items: { product: Producto, cantidad: number }[] = [];
  public cliente: Cliente[] = [];
  public itemCount: number = 0;
  private itemsCountSubscription!: Subscription;
  private clienteSubscription!: Subscription;
  public orden: any = []

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

  constructor( private service: ShopService,private toastr: ToastrService) {
    this.service.pedido$.subscribe(
      (res)=>{
        console.log(res)

        if(res.data.length > 0){
          res.data.forEach((e:any) => {
            e.product.cantidad = e.cantidad
          });
          this.items = res.data
        }else{
          this.items = []
        }
       
        if(this.items.length > 0){
          console.log(this.items)
          
        
        }else{
          // this.vmButtons[0].showimg= false
          // this.vmButtons[1].showimg= true
        }
      }
    )

    this.service.cliente$.subscribe(
      (res)=>{
        console.log(res)
        this.orden = res
      }
    )
  }


  ngOnInit(): void {
    // this.productos = faker.helpers.multiple(this.createRandomProduct, { count: 30 })
     //this.productosFiltered = this.productos
 
    console.log(this.producto)
    if(this.producto.fotos.length > 0){
      Object.assign(this.producto,{foto1: this.producto.fotos[0].recurso})
    }

    this.itemsCountSubscription = this.service.getItemsCount().subscribe(count => {
      console.log(count)
      this.itemCount = count;
    });
 
    
   }

      incrementarCantidad(product: Producto): void {
        if(product.codigo == this.producto.codigo){
          product.cantidad = parseFloat(product.cantidad as string) + 1; 
        }
       //this.producto[index].cantidad++;
     }
     
     disminuirCantidad(product: Producto): void {

      if(product.codigo == this.producto.codigo){
        if (parseFloat(product.cantidad as string) > 1) {
          product.cantidad = parseFloat(product.cantidad as string) - 1;
        }
      }
      
     }
   

   addToCart(product: any): void {
    if (product) {
      this.service.addToCart(product);
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
