import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoadingOverlay} from '../../../components/loading-overlay/loading-overlay';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {ServerAccessError} from '../../../components/server-access-error/server-access-error';
import {AuthService} from '../../../services/auth.service'
import {Router} from '@angular/router';
import {serialize} from 'object-to-formdata';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoadingOverlay,
    ServerAccessError
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  loading: boolean = false;
  imagePreview: string | ArrayBuffer | null = null;
  isServerAccessError: boolean = false;

  registerForm: FormGroup;

  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private router: Router) {
    this.registerForm=this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
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
      this.registerForm.patchValue({
        imageFile: file
      });
      this.registerForm.get('imageFile')?.updateValueAndValidity();
      this.imagePreview = URL.createObjectURL(file);
    }
    else {
      this.registerForm.patchValue({
        imageFile: null
      });
      this.imagePreview = null;
    }
  }

  onSubmit() {
    this.isServerAccessError = false;
    console.log("form value",this.registerForm.value);
    this.loading = true;
    const formData=serialize(this.registerForm.value);
    console.log("formData",formData.values())

    this.authService.register(formData).subscribe({
      next: (res) => {
        console.log('Registered:', res);
        this.imagePreview = null;
        this.loading = false;
        localStorage.setItem('token',res.token);
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
            const control=this.registerForm.get(key.charAt(0).toLowerCase() + key.slice(1));

            if(control){
              control.setErrors({serverError: errors[key]});
            }
          })
        }
      }
    });
  }
}
