import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { log } from 'console';
import { CosElementToBuy } from 'src/app/models/cosElementToBuy.model';
import { Cosplay } from 'src/app/models/cosplay.model';
import { CosplayDevelopService } from 'src/app/services/cosplay-develop.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-cos-element-tobuy-modal',
  templateUrl: './cos-element-tobuy-modal.component.html',
  styleUrls: ['./cos-element-tobuy-modal.component.scss'],
})
export class CosElementTobuyModalComponent implements OnInit {

  @Input() selectedCosplay: Cosplay;
  @Input() item: any;

  element:FormGroup;
  cosElementToBuy: CosElementToBuy;

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private cosDevelopService: CosplayDevelopService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {

    this.element = new FormGroup({
      name: new FormControl( this.item!= null ? this.item.name : 'New Item', {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      image: new FormControl(null),
      notes: new FormControl( this.item!= null ? this.item.title : 'Detalles' , {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      stores: new FormControl(this.item!= null ? this.item.store : 'Amazon', 
      {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      cost: new FormControl(this.item!= null ? this.item.cost : 0, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      important: new FormControl( false ),
      completed: new FormControl( false, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
    });
  }
  
  onSubmitElement(){
    //if (!this.form.valid) return
    console.log(this.element.value);
    

    /*this.loadingCtrl
    .create({
      message: 'Creating Element ...'
    })
    .then(loadingEl => {
      /*
      loadingEl.present();
      const elementToBuy = this.form.value;
      const cosplayId = this.selectedCosplay?.id || null;
      this.cosDevelopService.onSaveElToBuy(elementToBuy, cosplayId);
      */
      console.log(this.element.value);
      
      //loadingEl.dismiss();
      //this.form.reset();
      //this.modalCtrl.dismiss();
    //});
    
  }

  onCancel() {
    this.modalCtrl.dismiss();
    // cerrar modal
  }

}
