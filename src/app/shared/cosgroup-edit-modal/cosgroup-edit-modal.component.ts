import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-cosgroup-edit-modal',
  templateUrl: './cosgroup-edit-modal.component.html',
  styleUrls: ['./cosgroup-edit-modal.component.scss'],
})
export class CosgroupEditModalComponent implements OnInit {

  cosplayGroupMember = null;

  navigationExtras: NavigationExtras = {
    state : {
      cosplaygroupmember: null
    }
  }

  constructor(
    private modalCtrl: ModalController,
    private router: Router
  ) {

  }

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
