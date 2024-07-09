import { Component, effect, inject, OnChanges, SimpleChanges } from '@angular/core';
import { ModalComponent } from '../../modal/modal.component';
import { ProductFormComponent } from '../product-form/product-form.component';
import { CategoryFormComponent } from '../../category/category-form/category-form.component';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { ProductService } from '../../../services/product.service';
import { IProduct, ICategory } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ModalComponent,
    ProductFormComponent,
    CategoryFormComponent,
    MatSnackBarModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent{
  public search: String = '';
  public productList: IProduct[] = [];
  public categoryList: ICategory[] = [];
  private serviceP = inject(ProductService);
  private snackBar = inject(MatSnackBar);
  public currentProduct: IProduct = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: {
      id: 0,
      name: '',
      description: ''
    }
  };

  public currentCategory: ICategory = {
    id: 0,
    name: '',
    description: ''
  };
  
  constructor() {
    this.serviceP.getAllSignal();
    effect(() => {      
      this.productList = this.serviceP.products$();
    });
  }

  showDetail(product: IProduct, modal: any) {
    this.currentProduct = {...product}; 
    modal.show();
  }

  deleteProduct(product: IProduct) {
    this.serviceP.deleteProductSignal(product).subscribe({
      next: () => {
        this.snackBar.open('Product deleted', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 5 * 1000,
        });
      },
      error: (error: any) => {
        this.snackBar.open('Error deleting Product', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    })
  }

}