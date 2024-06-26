import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-category',
  template: `<app-products [products]="products" (loadMore)="onloadMore()"></app-products>`,
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categoryId: string | null = null;
  products: Product[] = [];
  limit = 10;
  offset = 0;

  constructor(private route: ActivatedRoute,
    private productsService: ProductsService
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap
    .pipe(
      switchMap(params => {
        this.categoryId = params.get('id');
        if (this.categoryId) {
          return this.productsService.getByCategory(this.categoryId, this.limit, this.offset)
        }
        return []
      })
    )
    .subscribe((data) => {
      this.products = data;
    });
  }
  onloadMore(): void {
    this.productsService.getAll(this.limit, this.offset)
      .subscribe(data => {
        this.products = this.products.concat(data.filter(product => product.images.length > 0));
        this.offset += this.limit;
      });
  }
}
