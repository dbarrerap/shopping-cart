import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Producto } from 'src/app/shared/models';
import { ShopService } from '../shop/shop.service';
import { fakerES_MX as faker } from "@faker-js/faker";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit{
  private route = inject(ActivatedRoute)
  private apiService = inject(ApiService)
  private service = inject(ShopService)
  private productId!: string|null

  public loading: boolean = false
  public producto!: Producto
  public cantidad: number = 0

  public lst_equipamiento: any[] = [
    {value: 1, label: 'Uno'},
    {value: 2, label: 'Dos'},
    {value: 3, label: 'Tres'},
  ]


  ngOnInit(): void {
    /* this.route.paramMap.subscribe((param) => {
      this.productId = param.get('id')

      // console.log(this.productId);
      this.loading = true
      this.apiService.apiCall(`productos/${this.productId}`, 'GET')?.subscribe(
        (res: any) => {
          // console.log(res);
          this.producto = res
          this.loading = false
        }
      )
      
    }) */
   this.producto = this.createRandomProduct()
  }

  increment = (valor: number) => {
    this.cantidad += valor;
    if (this.cantidad > parseInt(this.producto.stock as string)) this.cantidad = parseInt(this.producto.stock as string)
  }

  decrement = (valor: number) => {
    this.cantidad -= valor
    if (this.cantidad < 0) this.cantidad = 0
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
}
