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
  @Input() itemID;
  cosElementToBuy: CosElementToBuy;
  element:FormGroup;
  validations = null;

  name = null;
  image = null;

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private cosDevelopService: CosplayDevelopService,
    public fb: FormBuilder
  ) {

    this.validations = {
      'name': [
        { type: 'required', message: 'Name is required.' },
        { type: 'minlength', message: 'Name must be at least 5 characters long.' },
        { type: 'maxlength', message: 'Name cannot be more than 25 characters long.' },
        { type: 'pattern', message: 'The name must contain only numbers and letters.' },
      ],
      'cost': [
        { type: 'required', message: 'Cost is required.' },
        { type: 'maxlength', message: 'Cost cannot be more than 5 digits long.' },
        { type: 'pattern', message: 'The cost must contain only numbers .' },
      ],
      'notes': [
        { type: 'maxlength', message: 'Cost cannot be more than 180 characters long.' },
      ],
      'completed': [
        { type: 'required', message: 'Completed field is required' },
      ],
      // other validations
    };
 
  }

  ngOnInit(): void {
    console.log(this.item);
    this.element = this.fb.group({
      name: new FormControl( this.item?.name , {
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      image: new FormControl( this.item?.image ? this.item?.image : null ),
      cost: new FormControl( this.item?.cost ? this.item?.cost : 0, {
        updateOn: 'blur',
        validators: [Validators.maxLength(5), Validators.pattern("^([0-9]*)$")]
      }),
      stores: new FormControl( this.item?.stores ? this.item?.stores : '-', 
      {
        updateOn: 'blur',
        validators: [Validators.maxLength(180)]
      }),
      notes: new FormControl( this.item?.notes ? this.item?.notes : null , {
        updateOn: 'blur',
        validators: [Validators.maxLength(180)]
      }),
      important: new FormControl( this.item?.important ? this.item?.important :false ),
      completed: new FormControl( this.item?.completed ? this.item?.completed : false , {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      elementID: new FormControl( this.itemID )
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
