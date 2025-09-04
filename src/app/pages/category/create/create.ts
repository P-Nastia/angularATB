import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { Router } from '@angular/router';
import {serialize} from 'object-to-formdata';
import {LoadingOverlay} from '../../../components/loading-overlay/loading-overlay';
import {ServerAccessError} from '../../../components/server-access-error/server-access-error';

@Component({
  selector: 'app-create',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoadingOverlay,
    ServerAccessError
  ],
  templateUrl: './create.html',
  styleUrls: ['./create.css']
})
export class CategoryCreate {
  loading: boolean = false;
  imagePreview: string | ArrayBuffer | null = null;
  isServerAccessError: boolean = false;

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
    if(file) {
      if (!file.type.startsWith('image/')) {
        alert("Оберіть фото!");
        return;
      }
      this.categoryForm.patchValue({
        imageFile: file
      });
      this.categoryForm.get('imageFile')?.updateValueAndValidity();
      this.imagePreview = URL.createObjectURL(file);
    }
    else {
      this.categoryForm.patchValue({
        imageFile: null
      });
      this.imagePreview = null;
    }
  }

  onSubmit() {
   this.isServerAccessError = false;
    console.log("form value",this.categoryForm.value);
    this.loading = true;
    const formData=serialize(this.categoryForm.value);
    console.log("formData",formData.values())

    this.categoryService.createCategory(formData).subscribe({
      next: (res) => {
        console.log('Created:', res);
        this.imagePreview = null;
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        if (err.status === 0) {
          this.isServerAccessError = true;
        }
        if(err.status === 400 && err.error?.errors){
          const {errors} = err.error;

          Object.keys(errors).forEach(key => {
            const control=this.categoryForm.get(key.charAt(0).toLowerCase() + key.slice(1));

            if(control){
              control.setErrors({serverError: errors[key]});
            }
          })
        }
      }
    });
  }
}
