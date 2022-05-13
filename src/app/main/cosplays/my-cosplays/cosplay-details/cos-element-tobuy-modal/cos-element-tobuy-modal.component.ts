import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { log } from 'console';
import { CosElementToBuy } from 'src/app/models/cosElementToBuy.model';
import { CosplayDevelopService } from 'src/app/services/cosplay-develop.service';

@Component({
  selector: 'app-cos-element-tobuy-modal',
  templateUrl: './cos-element-tobuy-modal.component.html',
  styleUrls: ['./cos-element-tobuy-modal.component.scss'],
})
export class CosElementTobuyModalComponent implements OnInit {

  @Input() title = 'Detalles';
  @Input() name = 'New Item';
  @Input() store = 'Amazon';
  @Input() cost = '0.00€';
  @Input() comment = 'Notes...';

  form:FormGroup;
  cosElementToBuy: CosElementToBuy;

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private cosDevelopService: CosplayDevelopService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      image: new FormControl('img'),
      notes: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      stores: new FormControl(null, {
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
      const elementId = this.cosElementToBuy?.id || null;
      this.cosDevelopService.onSaveElToBuy(elementToBuy, elementId);
      console.log(elementToBuy);
      
      loadingEl.dismiss();
      this.form.reset();
    });
    
  }

  onCancel() {
    this.modalCtrl.dismiss();
    // cerrar modal
  }

}
