import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { ShopService } from "./shop.service";
import { CommonService } from '../../../services/common.service';
import { Producto, SidebarItem } from '../../../shared/models';

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
  private toastr = inject(ToastrService)
  private modalService = inject(NgbModal)
  public loadingProductos: boolean = false
  private walletSubscription!: Subscription
  private searchSubscription!: Subscription

  itemCount: number = 0;
  private itemsCountSubscription!: Subscription;
  private itemsSubscription!: Subscription;

  public productos: any[] = []
  public pagination: any = {
    length: 0,
    pageSize: 9,
    pageSizeOptions: [3, 9, 12],

    page: 1,
    start: 0,
    end: 0,
    pages: 0,
  }

  public sidebarFilter: SidebarItem[] = [];


  filter: any = {};
  // lista_productos: any[] = [];
  orden: any = []
  producto: any

  constructor() {
    this.walletSubscription = this.commonService.wallet.asObservable().subscribe(() => {
      this.modalService.open(this.modalWallet, { size: 'lg', centered: true })
    })

    this.searchSubscription = this.commonService.search.asObservable().subscribe(() => {
      this.modalService.open(this.modalSearch, { size: 'xl', windowClass: 'transparent-modal' })
      //this.modalService.open(this.modalSearch, { size: '', windowClass: 'transparent-modal modal-medium-large' })
    })

    this.service.pedido$.subscribe(
      (res) => {
        console.log(res)

        if (res.val == 'GUARDAR') {
          res.data.forEach((e: any) => {
            // let items = res.data.filter(dat => {e.id_producto == dat.id_producto}) 
            // if(e.id_producto == items[0]){
            Object.assign(e, { cantidad: 1 })
            //}
          })
          this.productos.forEach(e => {
            // let items = res.data.filter(dat => {e.id_producto == dat.id_producto}) 
            // if(e.id_producto == items[0]){
            Object.assign(e, { cantidad: 1 })
            //}
          })
        } else if (res.val == 'ELIMINAR') {
          this.productos.forEach(e => {
            if (e.id_producto == res.id_eliminado) {
              Object.assign(e, { cantidad: 1 })
            }
          })
        }
        else {
          // this.lista_productos.forEach(e => {
          //   if(e.id_producto == res){
          //     Object.assign(e,{cantidad: 1})
          //   }
          // })
        }
      }
    )
    this.service.cliente$.subscribe(
      (res) => {
        console.log(res)
        this.orden = res
      }
    )


    this.itemsCountSubscription = this.service.getItemsCount().subscribe(count => {
      this.itemCount = count;
      console.log(this.itemCount)

    });
  }

  ngOnInit(): void {


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
      busqueda: '',
      filterControl: "",
      grupos: [],
      marcas: []
    }

    setTimeout(() => {
      this.cargarProductos()
      // this.CargarProductos()
      this.CargarGruposMarcas()
    }, 0)
  }

  ngOnDestroy(): void {
    this.walletSubscription.unsubscribe()
    this.searchSubscription.unsubscribe()
  }

  changePage = (page: number) => {
    // console.log('change page', page)
    Object.assign(this.pagination, { page })
    // console.log('pagination', this.pagination);

    this.cargarProductos()
  }

  /* createRandomProduct = (): Producto => {
    const imagenNumber: number = Math.floor(Math.random() * 6) + 1
    const precio: number = parseFloat(faker.commerce.price())
    const oferta: boolean = faker.datatype.boolean({ probability: 0.75 })
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
  } */

  cargarProductos = async () => {
    this.productos = []
    this.loadingProductos = true
    try {
      const response = await this.service.getProductosFotos({ filter: this.filter, paginate: this.pagination })
      response.data.map((item: Producto) => Object.assign(item, { cantidad: 1 }))
      console.log(response)
      Object.assign(this.pagination, {
        length: response.total,
        start: response.from,
        end: response.to,
        pages: response.last_page
      })
      this.productos = response.data
    } catch (error) {
      console.error(error)
    } finally {
      this.loadingProductos = false
    }

  }

  async CargarGruposMarcas() {
    // this.mensajeSpiner = "Cargando productos...";
    // this.lcargando.ctlSpinner(true);
    try {


      //alert(JSON.stringify(this.filter));

      let gruposMarcas = await this.service.getGruposMarcas({ filter: this.filter });

      this.sidebarFilter = gruposMarcas.original

      console.log(gruposMarcas)

    } catch (err) {
      console.log(err)
      //  this.lcargando.ctlSpinner(false)
      //this.toastr.error(err.error.message, 'Error en Carga Inicial')
    }

  }

  incrementarCantidad(product: Producto, index: number): void {
    this.productos[index].cantidad++;
  }

  disminuirCantidad(product: Producto, index: number): void {
    if (this.productos[index].cantidad > 1) {
      this.productos[index].cantidad--;
    }
  }

  addToCart(product: any): void {
    if (product) {
      this.service.addToCart(product);
      console.log(product)
      if (product.cantidad > 1) {
        //this.toastr.success(product.cantidad + ' '+product.nombre +' agregados al carrito')
        this.toastr.success(product.cantidad + ' ' + product.nombre + ' agregados al carrito', '', {
          positionClass: 'toast-top-center'
        });
      } else if (product.cantidad == 1) {
        //this.toastr.success(product.cantidad + ' '+product.nombre +' agregado al carrito')
        this.toastr.success(product.cantidad + ' ' + product.nombre + ' agregados al carrito', '', {
          positionClass: 'toast-top-center'
        });
      }
    } else {
    }
    this.service.cliente$.emit(this.orden);
  }

  async onSelectedGrupoMarca(event: any, item: any): Promise<void> {

    console.log('Checkbox cambiado:', event.target.checked);
    console.log('Item:', item);
    console.log('Tipo:', item.tipo);
    if (event.target.checked) {
      if (item.tipo === 'marca') {
        console.log(item.id.trim())
        this.filter.marcas.push(item.id.trim());
      } else if (item.tipo === 'grupo') {
        this.filter.grupos.push(item.id.trim());
      }
      this.cargarProductos();
    } else {
      if (item.tipo === 'marca') {
        this.filter.marcas = this.filter.marcas.filter((marca: any) => marca !== item.id.trim());
      } else if (item.tipo === 'grupo') {
        this.filter.grupos = this.filter.grupos.filter((grupo: any) => grupo !== item.id.trim());
      }
      this.cargarProductos();
    }

  }



}
