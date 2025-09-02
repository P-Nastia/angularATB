import { Component } from '@angular/core';
import { ICategoryCreate } from '../../../models/Category';
import { CategoryService } from '../../../services/category.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {serialize} from 'object-to-formdata';

@Component({
  selector: 'app-create',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './create.html',
  styleUrls: ['./create.css']
})
export class CategoryCreate {
  category: ICategoryCreate = { name: '', slug: '' };
  imagePreview: string | ArrayBuffer | null = null;
  //selectedFile?: File;
  //errorMessage: string | null = null;

  categoryForm: FormGroup;

  constructor(private categoryService: CategoryService,
              private fb: FormBuilder,
              private router: Router) {
    this.categoryForm=this.fb.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      imageFile: [null,Validators.required],
    });
  }

  onFileSelected(event: any) {
    const file= event.target.files[0];
    if(!file.type.startsWith('image/')){
      alert("Оберіть фото!");
      return;
    }
    if(file){
      this.categoryForm.patchValue({
        imageFile: file,
      })
      this.categoryForm.get('imageFile')?.updateValueAndValidity();

      this.imagePreview = URL.createObjectURL(file);
    }
    else{
      this.categoryForm.patchValue({
        imageFile: null,
      })
    }
  }

  onSubmit() {
    if(this.categoryForm.invalid) {
      console.log("INVALID Category form");
      return;
    }

    console.log("form value",this.categoryForm.value);

    const formData=serialize(this.categoryForm.value);
    console.log("formData",formData.values())

    this.categoryService.createCategory(formData).subscribe({
      next: (res) => {
        console.log('Created:', res);
        //this.category = { name: '', slug: '', imageFile: '' };
        //this.selectedFile = undefined;
        this.imagePreview = null;
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        //this.errorMessage = err.error?.message || 'Error, check all fields';
      }
    });
  }
}
