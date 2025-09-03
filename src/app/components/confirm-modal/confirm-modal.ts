import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-confirm-modal',
  imports: [ ],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.css'
})

export class ConfirmModal {
  @Input() message = '';
  @Input() title = '';
  @Output() confirmed = new EventEmitter<any>();

  @ViewChild('modalRef') modalRef!: ElementRef;
  private modalInstance: any;

  ngAfterViewInit() {
    if (this.modalRef?.nativeElement) {
      this.modalInstance = new bootstrap.Modal(this.modalRef.nativeElement);
    } else {
      console.error('modalRef is not ready.');
    }
  }

  openModal() {

    if(!this.modalInstance) {
      this.modalRef = new bootstrap.Modal(this.modalRef.nativeElement);
    }
    this.modalInstance.show();
  }

  closeModal() {
    this.modalInstance?.hide();
  }

  confirmModal(){
    this.confirmed.emit();
    this.closeModal();
  }
}
