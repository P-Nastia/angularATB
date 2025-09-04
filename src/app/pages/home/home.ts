import {Component, OnInit, ViewChild} from '@angular/core';
import {CategoryService} from '../../services/category.service';
import {Category} from '../../models/Category';
import {CommonModule} from '@angular/common';
import {environment} from '../../../environments/environment';
import {RouterLink} from '@angular/router';
import {ConfirmModal} from '../../components/confirm-modal/confirm-modal';
import {ServerAccessError} from '../../components/server-access-error/server-access-error';
import {LoadingOverlay} from '../../components/loading-overlay/loading-overlay';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterLink,
    ConfirmModal,
    ServerAccessError,
    LoadingOverlay,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit{

  //list of categories
  categories: Category[] = [];
  selectedCategoryId: number | -1 = -1;
  isServerAccessError: boolean = false;
  loading: boolean = false;

  @ViewChild('confirmModal') confirmModal!: ConfirmModal;

  constructor(private categoryService: CategoryService) { }

 ngOnInit() : void {
    this.loading = true;
   console.log("Home page on init");
   this.getCategories();
 }

 getCategories() {
   this.categoryService.getCategories().subscribe({
     next: (categories) => {
       this.categories = categories;
       this.loading = false;
     },
     error: (err) => {
       console.error("ERROR", err);
       if (err.status === 0) {
         this.isServerAccessError = true;
       }
       this.loading = false;
     }
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
        if(err.status === 0){
          this.isServerAccessError = true;
        }
        console.error('Error occurred while deleting category', err);
      }
    })

  }

  protected readonly environment = environment;
}
