import { Component, inject, Input, OnInit } from '@angular/core';
import { ShopService } from '../../../views/shopping/shop/shop.service';

import { fakerES_MX as faker } from "@faker-js/faker";
import { Producto } from 'src/app/shared/models';
import { Productos } from '../../../views/shopping/shop/productos.interface';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})

export class SearchComponent implements OnInit {
  //@Input() productos: Productos[] = []
  public productosFiltered: Productos[] = []

  public searchQuery: string|null = null
  public loading: boolean = false
  public productos: Productos[] = []
  private service = inject(ShopService)
  itemCount: number = 0;
  private itemsCountSubscription!: Subscription;
  private itemsSubscription!: Subscription;

 
  filter: any = {};
  paginate: any;

  public lista_productos: any[] = []
  public pagination_old: any = {
    _page: 1,
    _per_page: 6,
    _limit: 6,
    _length: 0,
    _pages: 0,
    _start: 0,
    _end: 0,
  }

  public pagination: any = {
    length: 0,
    pageSize: 15,
    pageSizeOptions: [3, 9, 12],
    perPage: 15,
    page: 1,
    start: 0,
    end: 0,
    pages: 0,
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
      
       let productos = await this.service.getProductosFotosSearch({filter: this.filter, paginate : this.pagination});
       console.log(productos)
         // Verifica si 'productos.data' está definido y no es nulo antes de usar 'map'
         if (productos && productos.data) {
          // Asigna la cantidad de 1 a cada producto
          productos.data.map((item: any) => Object.assign(item, { cantidad: 1 }));
          this.productos = productos.data;
          this.productosFiltered = this.productos;
      } else {
          console.error('No se encontraron productos o la propiedad "data" está indefinida');
      }
      
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
