import {Component, OnInit} from '@angular/core';
import {CategoryService} from '../../services/category.service';
import {Category} from '../../models/Category';
import {CommonModule} from '@angular/common';
import {environment} from '../../../environments/environment';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit{

  //list of categories
  categories: Category[] = [];

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

  protected readonly environment = environment;
}
