import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {CategoryService} from '../../../services/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {serialize} from 'object-to-formdata';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-edit',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './edit.html',
  styleUrl: './edit.css'
})

export class CategoryEdit implements OnInit {
  categoryForm: FormGroup;
  imagePreview: string | Array<string> | null = null;
  categoryId!: number;

  constructor(private fb: FormBuilder,
              private router: Router,
              private categoryService: CategoryService,
              private route: ActivatedRoute) {
    this.categoryForm = this.fb.group({
      id:[-1],
      name: ['', Validators.required],
      slug: ['', Validators.required],
      imageFile: [null],
    })
  }
  ngOnInit(): void {
    this.categoryId = this.route.snapshot.params['id'];

    console.log("categoryId",this.categoryId);

    this.categoryService.getCategoryById(this.categoryId).subscribe({
      next: (category) => {
        this.categoryForm.patchValue({
            id: category.id,
            name: category.name,
            slug: category.slug
          }
        )

        this.imagePreview = category.image
        ? `${environment.imageUrl}800_${category.image}`:null;
      },
      error: err => {
        console.log("ERROR EDIT INITIALIZE",err);
      }
    })
  }

    onFileSelected(event: any) {
    const file = event.target.files[0];
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

  onSubmit(): void {
    if(this.categoryForm.invalid) {
      return;
    }

    const formData = serialize(this.categoryForm.value);
    this.categoryService.updateCategory(formData).subscribe({
      next: () => {this.router.navigate(['/'])},
      error: (err) => {
        console.error(err);
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

    })
  }
}

