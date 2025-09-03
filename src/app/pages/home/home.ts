import {Component, OnInit, ViewChild} from '@angular/core';
import {CategoryService} from '../../services/category.service';
import {Category} from '../../models/Category';
import {CommonModule} from '@angular/common';
import {environment} from '../../../environments/environment';
import {RouterLink} from '@angular/router';
import {ConfirmModal} from '../../components/confirm-modal/confirm-modal';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterLink,
    ConfirmModal,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit{

  //list of categories
  categories: Category[] = [];
  selectedCategoryId: number | -1 = -1;

  @ViewChild('confirmModal') confirmModal!: ConfirmModal;

  constructor(private categoryService: CategoryService) { }

 ngOnInit() : void {
   console.log("Home page on init");
   this.getCategories();
 }

 getCategories(){
    this.categoryService.getCategories().subscribe(categories=>{
      this.categories = categories;
      console.log( "Categories ", categories ); // subscribe = виходить promise, який повертає список категорій
   });
 }

  requestCategoryDelete( id: number) {
    this.selectedCategoryId = id;
    this.confirmModal.openModal();
  }

  onCategoryDeleteConfirmed() {
    console.log('User confirmed delete for:', this.selectedCategoryId);
    this.categoryService.deleteCategory(this.selectedCategoryId).subscribe({
      next: () => {
        this.categories = this.categories.filter(cat => cat.id !== this.selectedCategoryId);
      },
      error: (err) => {
        console.error('Error occurred while deleting category', err);
      }
    })

  }

  protected readonly environment = environment;
}
