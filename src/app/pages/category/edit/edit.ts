import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {CategoryService} from '../../../services/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {serialize} from 'object-to-formdata';
import {environment} from '../../../../environments/environment';
import {LoadingOverlay} from '../../../components/loading-overlay/loading-overlay';
import {ServerAccessError} from '../../../components/server-access-error/server-access-error';

@Component({
  selector: 'app-edit',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    LoadingOverlay,
    ServerAccessError
  ],
  templateUrl: './edit.html',
  styleUrl: './edit.css'
})

export class CategoryEdit implements OnInit {
  categoryForm: FormGroup;
  imagePreview: string | Array<string> | null = null;
  categoryId!: number;
  loading: boolean = false;
  isServerAccessError: boolean = false;

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
    this.loading = true;
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
        this.loading = false;
      },
      error: err => {
        if (err.status === 0) {
          this.isServerAccessError = true;
        }
        console.log("ERROR EDIT INITIALIZE",err);
        this.loading = false;
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
    this.isServerAccessError = false;
    this.loading = true;
    if(this.categoryForm.invalid) {
      this.loading = false;
      return;
    }

    const formData = serialize(this.categoryForm.value);
    this.categoryService.updateCategory(formData).subscribe({
      next: () => {
        this.loading = false; this.router.navigate(['/'])
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

    })
  }
}

