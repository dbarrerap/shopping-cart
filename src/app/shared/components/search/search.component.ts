import { Component, inject, Input, OnInit } from '@angular/core';
import { ShopService } from '../../../views/shopping/shop/shop.service';

import { fakerES_MX as faker } from "@faker-js/faker";
import { Producto } from '../../models';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})

export class SearchComponent implements OnInit {
  //@Input() productos: Producto[] = []
  public productosFiltered: Producto[] = []

  public searchQuery: string|null = null
  public loading: boolean = false
  public productos: Producto[] = []
  private service = inject(ShopService)
  itemCount: number = 0;
  private itemsCountSubscription!: Subscription;
  private itemsSubscription!: Subscription;

 
  filter: any = {};
  paginate: any;

  public lista_productos: any[] = []
  public pagination: any = {
    _page: 1,
    _per_page: 6,
    _limit: 6,
    _length: 0,
    _pages: 0,
    _start: 0,
    _end: 0,
  }
 

  ngOnInit(): void {
   // this.productos = faker.helpers.multiple(this.createRandomProduct, { count: 30 })
    //this.productosFiltered = this.productos

    

    this.itemsCountSubscription = this.service.getItemsCount().subscribe(count => {
      this.itemCount = count;
      console.log(this.itemCount)
   
    });

    this.filter = {
      busqueda:'',
      filterControl: ""
    }

    setTimeout(async  ()  => {
      await this.CargarProductos()
    }, 100)
  }

  filterProductos = () => {
    this.loading = true
    setTimeout(() => {
      this.productosFiltered = this.productos.filter(item => item.nombre.toLowerCase().includes((this.searchQuery as string).toLowerCase()))
      this.loading = false
    }, 1250)
    
  }

  createRandomProduct = (): Producto => {
    const imagenNumber: number = Math.floor(Math.random() * 6) + 1
    return {
      id: faker.database.mongodbObjectId(),
      nombre: faker.commerce.productName(),
      codigo: faker.commerce.isbn(),
      descripcion: faker.commerce.productDescription(),
      precio: faker.commerce.price(),
      imagen: `assets/images/productos/repuesto-${imagenNumber}.png`,
    }
  }

  async CargarProductos() {
    // this.mensajeSpiner = "Cargando productos...";
    // this.lcargando.ctlSpinner(true);
    this.loading = true
    try {

   
      //alert(JSON.stringify(this.filter));
      
       let productos = await this.service.getProductosFotos({filter: this.filter, paginate : this.pagination});
       console.log(productos)
       productos.data.map((item: any) => Object.assign(item, { cantidad: 1 }))
      
      this.productos= productos.data;
      this.productosFiltered = this.productos
      this.loading = false
 
      //  console.log(this.lista_productos);
      //  this.paginate.length = productos.total;
      //  this.lcargando.ctlSpinner(false)
     } catch (err) {
       console.log(err)
      //  this.lcargando.ctlSpinner(false)
        //this.toastr.error(err.error.message, 'Error en Carga Inicial')
     }
  
 }
}
