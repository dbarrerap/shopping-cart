import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { fakerES_MX as faker } from "@faker-js/faker";

import { ShopService } from "./shop.service";
import { CommonService } from '../../../services/common.service';
import { Producto } from '../../../shared/models/Producto';


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
  public loadingProductos: boolean = false
  private walletSubscription!: Subscription
  private searchSubscription!: Subscription

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

  public sidebarFilter = [
    {
      id: 1,
      label: 'Categoria',
      items: [
        { id: 101, label: 'Switches', checked: false },
        { id: 102, label: 'Cables', checked: false },
        { id: 103, label: 'Accesorios', checked: false },
      ]
    },
    {
      id: 2,
      label: 'Marca',
      items: [
        { id: 201, label: 'D-Link', checked: false },
        { id: 202, label: 'Cisco', checked: false },
        { id: 203, label: 'LANPro', checked: false },
      ]
    },
    {
      id: 3,
      label: 'Color',
      items: [
        { id: 301, label: 'Negro', checked: false },
        { id: 302, label: 'Blanco', checked: false },
        { id: 303, label: 'Gris', checked: false },
      ]
    }
  ]

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
    }
    )
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
      filterControl: ""
    }

    setTimeout(() => {
      // this.productos = faker.helpers.multiple(this.createRandomProduct, { count: 60 })
      this.cargarProductos()
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

  createRandomProduct = (): Producto => {
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
  }

  cargarProductos = async () => {
    this.productos = []
    this.loadingProductos = true
    const response = await this.service.getProductos({pagination: this.pagination})
    console.log(response)
    Object.assign(this.pagination, {
      length: response.total, 
      start: response.from, 
      end: response.to,
      pages: response.last_page
    })
    this.productos = response.data
    this.loadingProductos = false
  }
}
