import { Component, inject, Input, OnInit } from '@angular/core';
import { ShopService } from '../shop.service';

import { fakerES_MX as faker } from "@faker-js/faker";
import { Producto } from 'src/app/shared/models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})

export class SearchComponent implements OnInit {
  @Input() productos: Producto[] = []
  public productosFiltered: Producto[] = []

  public searchQuery: string|null = null
  public loading: boolean = false

  private service = inject(ShopService)

  ngOnInit(): void {
    this.productos = faker.helpers.multiple(this.createRandomProduct, { count: 30 })
    this.productosFiltered = this.productos
  }

  filterProductos = () => {
    console.log(this.searchQuery);
    
    this.productosFiltered = this.productos.filter(item => item.nombre.toLowerCase().includes((this.searchQuery as string).toLowerCase()))
    console.log(this.productosFiltered.length);
    
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
}
