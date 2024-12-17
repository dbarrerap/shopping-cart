import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ShopService } from "./shop.service";
import { CommonService } from 'src/app/services/common.service';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/shared/models';

import { fakerES_MX as faker } from "@faker-js/faker";
import { Productos } from './productos.interface';

import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit, OnDestroy {
  @ViewChild('modalSearch', { static: false }) modalSearch!: ElementRef
  @ViewChild('modalWallet', { static: false }) modalWallet!: ElementRef
  private service = inject(ShopService)
  private commonService = inject(CommonService)
  private modalService = inject(NgbModal)
  private walletSubscription!: Subscription
  private searchSubscription!: Subscription

  itemCount: number = 0;
  private itemsCountSubscription!: Subscription;
  private itemsSubscription!: Subscription;

  public productos: any[] = []
  public pagination: any = {
    _page: 1,
    _per_page: 6,
    _limit: 6,
    _length: 0,
    _pages: 0,
    _start: 0,
    _end: 0,
  }
  public pagination_2: any = {
    page: 1,
    perPage: 6,
    limit: 6,
    length: 0,
    pages: 0,
    start: 0,
    end: 0,
  }

  // Usar una estruxtura para automatizar filtros genera error
  public filterDeliveryItems = [
    {label: 'Free Store', items: 8},
    {label: 'Free Delivery', items: 8},
    {label: 'Fast Delivery', items: 8}
  ]

  filter: any = {};
  paginate: any;
  lista_productos: any[] = [];
  orden: any = []
  producto: any

  constructor( private toastr: ToastrService,) {
    this.walletSubscription = this.commonService.wallet.asObservable().subscribe(() => {
      this.modalService.open(this.modalWallet, { size: 'lg', centered: true })
    })
    this.searchSubscription = this.commonService.search.asObservable().subscribe(() => {
      this.modalService.open(this.modalSearch, { size: 'xl', windowClass: 'transparent-modal' })
    }
    )
  }

  ngOnInit(): void {

    this.service.pedido$.subscribe(
      (res)=>{
        console.log(res)
        
        if(res.val == 'GUARDAR'){
          res.data.forEach((e:any) => {
            // let items = res.data.filter(dat => {e.id_producto == dat.id_producto}) 
            // if(e.id_producto == items[0]){
              Object.assign(e,{cantidad: 1})
            //}
          })
          this.lista_productos.forEach(e => {
            // let items = res.data.filter(dat => {e.id_producto == dat.id_producto}) 
            // if(e.id_producto == items[0]){
              Object.assign(e,{cantidad: 1})
            //}
          })
        }else if(res.val == 'ELIMINAR'){
          this.lista_productos.forEach(e => {
            if(e.id_producto == res.id_eliminado){
              Object.assign(e,{cantidad: 1})
            }
          })
        }
        else{
          // this.lista_productos.forEach(e => {
          //   if(e.id_producto == res){
          //     Object.assign(e,{cantidad: 1})
          //   }
          // })
        }
      }
    )
    this.service.cliente$.subscribe(
      (res)=>{
        console.log(res)
        this.orden = res
      }
    )


    this.itemsCountSubscription = this.service.getItemsCount().subscribe(count => {
      this.itemCount = count;
      console.log(this.itemCount)
   
    });

   
    this.producto = {
      id_producto: 0,
      codigo: '',
      nombre: '',
      descripcion: '',
      nombrecorto: '',
      marca: '',
      precio1: 0,
      stock: 0,
      estado: '',
      id_usuario: 0,
      fotos: [],
    }
   

    this.filter = {
      busqueda:'',
      filterControl: ""
    }
    this.paginate = {
      length: 0,
      perPage: 20,
      page: 1,
      pageSizeOptions: [20, 40,60,80,100]
    }
    setTimeout(() => {
      this.CargarProductos()
     this.productos = faker.helpers.multiple(this.createRandomProduct, {count: 60})
     Object.assign(this.pagination, {
      _length: this.productos.length,
      _pages: Math.ceil(this.productos.length / this.pagination._per_page),
      _start: (this.pagination._page - 1) * this.pagination._per_page + 1,
      _end: Math.min(this.pagination._page * this.pagination._per_page, this.productos.length)
    })
    }, 0)
  }

  ngOnDestroy(): void {
    this.walletSubscription.unsubscribe()
    this.searchSubscription.unsubscribe()
  }

  changePage = (event: number) => {
     console.log(event);
    Object.assign(this.pagination, {
      _page: event,
      _start: (event - 1) * this.pagination._per_page + 1,
      _end: Math.min(event * this.pagination._per_page, this.productos.length)
    })
    this.CargarProductos()
  }


  logger = (event: any) => {
    console.log(event);

  }

  createRandomProduct = (): Producto => {
    const imagenNumber: number = Math.floor(Math.random() * 6) + 1
    const precio: number = parseFloat(faker.commerce.price())
    const oferta: boolean = faker.datatype.boolean({probability: 0.75})
    const descuento = (Math.floor(Math.random() * 25) + 1)
    const precio_oferta = oferta ? precio / (1 + (descuento / 100)) : precio
    return {
      id: faker.database.mongodbObjectId(),
      nombre: faker.commerce.productName(),
      codigo: faker.commerce.isbn(),
      descripcion: faker.commerce.productDescription(),
      precio,
      oferta,
      descuento,
      precio_oferta,
      imagen: `assets/images/productos/repuesto-${imagenNumber}.png`,
    }
  }

  async CargarProductos() {
    // this.mensajeSpiner = "Cargando productos...";
    // this.lcargando.ctlSpinner(true);
    try {

   
      //alert(JSON.stringify(this.filter));
      
       let productos = await this.service.getProductosFotos({filter: this.filter, paginate : this.pagination});
       console.log(productos)
       productos.data.data.map((item: any) => Object.assign(item, { cantidad: 1 }))
      
       
        this.lista_productos= productos.data.data;
        console.log(this.lista_productos)

        Object.assign(this.pagination, {
          _length: this.productos.length,
          _pages: Math.ceil(this.productos.length / this.pagination._per_page),
          _start: (this.pagination._page - 1) * this.pagination._per_page + 1,
          _end: Math.min(this.pagination._page * this.pagination._per_page, this.productos.length)
        })
 
      //  console.log(this.lista_productos);
      //  this.paginate.length = productos.total;
      //  this.lcargando.ctlSpinner(false)
     } catch (err) {
       console.log(err)
      //  this.lcargando.ctlSpinner(false)
        //this.toastr.error(err.error.message, 'Error en Carga Inicial')
     }
  
 }

 incrementarCantidad(product: Productos, index:number): void {
  this.lista_productos[index].cantidad++;
}

disminuirCantidad(product: Productos, index: number): void {
  if (this.lista_productos[index].cantidad > 1) {
    this.lista_productos[index].cantidad--;
  }
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
  this.service.cliente$.emit (this.orden);
}

 
}
