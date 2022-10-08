import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { log } from 'console';
import { CosElementToBuy } from 'src/app/models/cosElementToBuy.model';
import { Cosplay } from 'src/app/models/cosplay.model';
import { CosplayDevelopService } from 'src/app/services/cosplay-develop.service';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-cos-element-tobuy-modal',
  templateUrl: './cos-element-tobuy-modal.component.html',
  styleUrls: ['./cos-element-tobuy-modal.component.scss'],
})
export class CosElementTobuyModalComponent implements OnInit {
  @Input() selectedCosplay: Cosplay;
  @Input() item;
  cosElementToBuy: CosElementToBuy;
  element:FormGroup;

  name = null;
  image = null;

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private cosDevelopService: CosplayDevelopService,
    public fb: FormBuilder
  ) {
 
  }

  ngOnInit(): void {
    console.log(this.item);
    this.element = this.fb.group({
      name: new FormControl( this.item?.name , {
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      image: new FormControl( this.item?.image ? this.item?.image : null ),
      cost: new FormControl( this.item?.cost ? this.item?.cost : null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      stores: new FormControl( this.item?.stores ? this.item?.stores : 'Amazon', 
      {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      notes: new FormControl( this.item?.notes ? this.item?.notes : null , {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      important: new FormControl( this.item?.important ? this.item?.important :false ),
      completed: new FormControl( this.item?.completed ? this.item?.completed : false , {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
    });
  }
  
  onSubmit(){
    console.log(this.element.value);
    if (!this.element.valid) return

    this.loadingCtrl
    .create({
      message: 'Creating Element ...'
    })
    .then(loadingEl => {
      
      loadingEl.present();

      const elementToBuy = this.element.value;
      console.log(elementToBuy);
      const cosplayId = this.selectedCosplay?.id || null;
      this.cosDevelopService.onSaveElToBuy(elementToBuy, cosplayId);
      
      setTimeout(() => {
        loadingEl.dismiss();
        this.closeModal();
        this.element.reset();
      }, 500);
  
      
    });
    
  }

  closeModal() {
    this.modalCtrl.dismiss(
      //this.element.value,'ee'
    );
    // cerrar modal
  }

}
