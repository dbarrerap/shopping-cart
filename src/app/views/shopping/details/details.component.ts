import { Component, inject, OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../shop/shop.service';
import { NgbCarouselConfig, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { ApiService } from '../../../services/api.service';
import { Producto, Cliente } from '../../../shared/models';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  providers: [NgbCarouselConfig],
})
export class DetailsComponent implements OnInit{
  @ViewChild('carousel', { static: true }) carousel: NgbCarousel | undefined;
  private route = inject(ActivatedRoute)
  private apiService = inject(ApiService)
  private service = inject(ShopService)
  private productId!: string|null

  public loading: boolean = false
  public producto!: Producto
  public cantidad: number = 0

  public items: { product: Producto, cantidad: number }[] = [];
  public cliente: Cliente[] = [];
  public itemCount: number = 0;
  private itemsCountSubscription!: Subscription;
  private clienteSubscription!: Subscription;

  totalProductos: any = 0

  showNavigationArrows = false;
	showNavigationIndicators = false;

  public lst_equipamiento: any[] = [
    {value: 1, label: 'Uno'},
    {value: 2, label: 'Dos'},
    {value: 3, label: 'Tres'},
  ]

  constructor(config: NgbCarouselConfig) {

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
          
          this.totalPorProducto()
        }else{
          // this.vmButtons[0].showimg= false
          // this.vmButtons[1].showimg= true
        }
      }
    )

    this.items = this.service.getItems();
    
    if(this.items.length > 0){
      this.totalPorProducto()
    }else{
    //  this.vmButtons[0].showimg= false
    //  this.vmButtons[1].showimg= true
    }
    this.itemsCountSubscription = this.service.getItemsCount().subscribe(count => {
      console.log(count)
      this.itemCount = count;
    });

		config.showNavigationArrows = true;
		config.showNavigationIndicators = true;
	}


  // ngOnInit(): void {
  //    this.route.paramMap.subscribe((param) => {
  //     this.productId = param.get('id')

  //     // console.log(this.productId);
  //     this.loading = true

  //     this.service.getProducto({id: this.productId}).subscribe(
  //       (res: any) => {
  //         // console.log(res);
  //         this.producto = res
  //         this.loading = false
  //       }
  //     )
      
  //   }) 
  //  this.producto = this.createRandomProduct()
  // }

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(async (param) => {
      this.productId = param.get('id');
      console.log(param.get('id'))

      if (this.productId) {
        this.loading = true;
        const productIdNumber = Number(this.productId);
        
        if (isNaN(productIdNumber)) {
          throw new Error('El ID del producto no es un número válido.');
        }
        try {
          const producto = await this.service.getProducto(productIdNumber, {});
          //Object.assign(producto.data,{foto1: producto.data.fotos[0].recurso, fotosTodas: producto.data.fotos})
          this.producto = producto.data
          console.log(this.producto)
        } catch (error) {
          console.error('Error al obtener producto:', error);
        } finally {
          this.loading = false;
        }
      }
    });
    //this.producto = this.createRandomProduct();
  }
  selectSlide(slideId: number): void {

    if (this.carousel) {
      this.carousel.select(slideId.toString());
    }
   
  }

 

  increment = (valor: number) => {
    this.cantidad += valor;
    //if (this.cantidad > parseInt(this.producto.stock as string)) this.cantidad = parseInt(this.producto.stock as string)
  }

  decrement = (valor: number) => {
    this.cantidad -= valor
    if (this.cantidad < 0) this.cantidad = 0
  }

  incrementarCantidad(product: Producto) {

    this.service.agregarDesdeCarrito(product);
    //this.calculoIva();
  }
  disminuirCantidad(product: Producto) {

    this.service.disminuirDesdeCarrito(product);
    //this.calculoIva();
    
  }

  
  totalPorProducto(){
    //const totalCount = this.items.reduce((total, item) => total + item.product.precio1, 0);
    this.items.forEach(item => {
      item.product.subtotal = parseFloat(item.product.precio1! as string) * Number(item.product.cantidad);
      item.product.descuento = parseFloat(item.product.precio1! as string) * Number(item.product.cantidad) * Number(item.product.porcentaje) / 100;
      item.product.total = item.product.subtotal -  Number(item.product.descuento);
      this.totalProductos += parseFloat(item.product.precio1! as string) * Number(item.product.cantidad);
    });

  

   }


  /* createRandomProduct = (): Producto => {
    const imagenNumber: number = Math.floor(Math.random() * 6) + 1
    const precio: number = parseFloat(faker.commerce.price())
    const oferta: boolean = faker.datatype.boolean({probability: 0.75})
    const descuento = (Math.floor(Math.random() * 25) + 1)
    const precio_oferta = oferta ? precio / (1 + (descuento / 100)) : precio
    const fotos = [
      { recurso: 'assets/images/productos/repuesto-1.png' },
      { recurso: 'assets/images/productos/repuesto-3.png' },
      { recurso: 'assets/images/productos/repuesto-5.png' },
    ]
    return {
      id: faker.database.mongodbObjectId(),
      nombre: faker.commerce.productName(),
      codigo: faker.commerce.isbn(),
      descripcion: faker.commerce.productDescription(),
      precio,
      oferta,
      descuento,
      precio_oferta,
      fotos,
      imagen: `assets/images/productos/repuesto-${imagenNumber}.png`,
    }
  } */
}
