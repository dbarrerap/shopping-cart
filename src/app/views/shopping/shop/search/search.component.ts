import { Component, inject, Input, OnInit } from '@angular/core';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})

export class SearchComponent implements OnInit {
  @Input() productos: any[] = []

  public searchQuery: string|null = null
  public loading: boolean = false

  private service = inject(ShopService)

  ngOnInit(): void {
    setTimeout(() => {
      this.getProductos()
    }, 0)
  }

  getProductos = () => {
    const params = {
      nombre_like: this.searchQuery ?? ''
    }

    this.loading = true
    this.service.getProductosSearch(params)?.subscribe(
      (res: any) => {
        setTimeout(() => {
          this.productos = res
          this.loading = false
        }, 1250)
      }
    )
  }
}
