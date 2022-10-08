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
  cosElementToBuy: CosElementToBuy;
  element:FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private cosDevelopService: CosplayDevelopService,
    public fb: FormBuilder
  ) {
    this.element = this.fb.group({
      name: new FormControl( null, {
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      image: new FormControl(null),
      cost: new FormControl(0, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      stores: new FormControl('Amazon', 
      {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      notes: new FormControl('Detalles' , {
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

  ngOnInit(): void {

    
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
