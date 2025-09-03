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
  selectedCategory: {id: number; name: string} | null = null;

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

  requestCategoryDelete(category: { id: number; name: string }) {
    this.selectedCategory = category;
    console.log("Opening modal", this.selectedCategory);
    this.confirmModal.openModal(this.selectedCategory);
  }

  onCategoryDeleteConfirmed(category: { id: number; name: string }) {
    console.log('User confirmed delete for:', category);
    this.categoryService.deleteCategory(category.id).subscribe({
      next: () => {
        this.categories = this.categories.filter(cat => cat.id !== category.id);
      },
      error: (err) => {
        console.error('Error occurred while deleting category', err);
      }
    })

  }

  protected readonly environment = environment;
}
