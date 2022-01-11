import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cosgroup-edit-modal',
  templateUrl: './cosgroup-edit-modal.component.html',
  styleUrls: ['./cosgroup-edit-modal.component.scss'],
})
export class CosgroupEditModalComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  onSubmit(form: NgForm) {
    if (!form.valid) { // if is false
      return;
    }
    
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

}
