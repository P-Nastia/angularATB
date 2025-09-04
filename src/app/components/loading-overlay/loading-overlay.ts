import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-loading-overlay',
  imports: [
    CommonModule,
  ],
  templateUrl: './loading-overlay.html',
  styleUrl: './loading-overlay.css'
})
export class LoadingOverlay {

  @Input() isLoading: boolean = false;
}
