import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { CosElementToDo } from 'src/app/models/cosElementToDo.model';
import { CosplayDevelopService } from 'src/app/services/cosplay-develop.service';

@Component({
  selector: 'app-cos-element-tomake-modal',
  templateUrl: './cos-element-tomake-modal.component.html',
  styleUrls: ['./cos-element-tomake-modal.component.scss'],
})
export class CosElementTomakeModalComponent implements OnInit {

  form: FormGroup;
  cosElementToMake: CosElementToDo;

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private cosDevelopService: CosplayDevelopService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({

    });
  }

  onSubmitElement(){
    if (!this.form.valid) return

    this.loadingCtrl
    .create({
      message: 'Creating Element ...'
    })
    .then(loadingEl => {
      loadingEl.present();
      const elementToMake = this.form.value;
      const elementId = this.cosElementToMake?.id || null;
      this.cosDevelopService.onSaveElToMake(elementToMake,elementId);
      console.log(elementToMake);
      
      loadingEl.dismiss();
      this.form.reset();
    });
  }

  onCancel() {
    this.modalCtrl.dismiss();
    // cerrar modal
  }

}
