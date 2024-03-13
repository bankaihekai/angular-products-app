import { Component } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product, Products } from '../../types';
import { ProductComponent } from '../components/product/product.component';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { EditPopupComponent } from '../components/edit-popup/edit-popup.component';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [ProductComponent, CommonModule, PaginatorModule, EditPopupComponent, ButtonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent {
    constructor(private productService: ProductsService) {}

    products: Product[] = [];
    totalRecords: number = 0;
    rows: number = 5;

    displayEditPopup: boolean = false;
    displayAddPopup: boolean = false;

    toggleEditPopup(product: Product){
        this.selectedProduct = product;
        this.displayEditPopup = !this.displayEditPopup;
    }

    toggleDeletePopup(product: Product){
        
    }

    toggleAddPopup(){
        this.displayEditPopup = true;
    }

    selectedProduct: Product = {
        id: 0,
        name: '',
        image: '',
        price: '',
        rating: 0
    };

    onConfirmEdit(product: Product){
        if(!this.selectedProduct.id){
            return;
        }
        this.editProduct(product, this.selectedProduct.id);
        this.displayEditPopup = false;
    }

    onConfirmAdd(product: Product){
        this.addProduct(product);
        this.displayAddPopup = false;
    }

    ngOnInit() {
        this.fetchProducts(0, this.rows);
    }

    onProductOutput(product: Product) {
        console.log(product);
    }

    fetchProducts(page: number, perPage: number) {
        this.productService
            .getProducts('http://localhost:3000/clothes', {
                page,
                perPage,
            })
            .subscribe({
                next: (data: Products) => {
                    this.products = data.items;
                    this.totalRecords = data.total;
                },
                error: (error) => {
                    console.log(error);
                },
            });
    }

    onPageChange(event: any) {
        this.fetchProducts(event.page, event.rows);
    }

    // other functionalities
    editProduct(product: Product, id: number) {
        this.productService
            .editProduct(`http://localhost:3000/clothes/${id}`, product)
            .subscribe({
                next: (data) => {
                    console.log(data);
                    this.fetchProducts(0, this.rows);
                },
                error: (error) => {
                    console.log(error);
                },
            });
    }

    deleteProduct(id: number) {
        this.productService
            .deleteProduct(`http://localhost:3000/clothes/${id}`)
            .subscribe({
                next: (data) => {
                    console.log(data);
                    this.fetchProducts(0, this.rows);
                },
                error: (error) => {
                    console.log(error);
                },
            });
    }

    addProduct(product: Product) {
        this.productService
            .addProduct(`http://localhost:3000/clothes`, product)
            .subscribe({
                next: (data) => {
                    console.log(data);
                    this.fetchProducts(0, this.rows);
                },
                error: (error) => {
                    console.log(error);
                },
            });
    }
}
