import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { log } from 'console';
import { CosElementToBuy } from 'src/app/models/cosElementToBuy.model';
import { Cosplay } from 'src/app/models/cosplay.model';
import { CosplayDevelopService } from 'src/app/services/cosplay-develop.service';

@Component({
  selector: 'app-cos-element-tobuy-modal',
  templateUrl: './cos-element-tobuy-modal.component.html',
  styleUrls: ['./cos-element-tobuy-modal.component.scss'],
})
export class CosElementTobuyModalComponent implements OnInit {

  @Input() selectedCosplay: Cosplay;
  @Input() item: any;

  title;
  name;
  store;
  cost;
  comment;

  form:FormGroup;
  cosElementToBuy: CosElementToBuy;

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private cosDevelopService: CosplayDevelopService
  ) {
    this.title = this.item!= null ? this.item.title : 'Detalles';
    this.name = this.item!= null ? this.item.name : 'New Item';
    this.store = this.item!= null ? this.item.store : 'Amazon';
    this.cost = this.item!= null ? this.item.cost : '0.00€';
    this.comment = this.item!= null ? this.item.comment : 'Notes...';
  }

  ngOnInit() {

    this.form = new FormGroup({
      name: new FormControl(this.name, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      image: new FormControl(null),
      notes: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      stores: new FormControl(['amazon?','amazon?','amazon?','amazon?'], {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      cost: new FormControl(0, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      important: new FormControl(false),
      completed: new FormControl(false, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
    });
  }
  
  onSubmitElement(){
    //if (!this.form.valid) return

    this.loadingCtrl
    .create({
      message: 'Creating Element ...'
    })
    .then(loadingEl => {
      loadingEl.present();
      const elementToBuy = this.form.value;
      const cosplayId = this.selectedCosplay?.id || null;
      this.cosDevelopService.onSaveElToBuy(elementToBuy, cosplayId);
      console.log(cosplayId);
      
      loadingEl.dismiss();
      this.form.reset();

      this.modalCtrl.dismiss();
    });
    
  }

  onCancel() {
    this.modalCtrl.dismiss();
    // cerrar modal
  }

}
