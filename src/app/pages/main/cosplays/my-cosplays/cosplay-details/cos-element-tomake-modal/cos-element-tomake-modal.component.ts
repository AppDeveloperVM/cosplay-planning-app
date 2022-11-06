import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { CosElementToDo } from '../../../../../../models/cosElementToDo.model';
import { Cosplay } from '../../../../../../models/cosplay.model';
import { CosplayDevelopService } from '../../../../../../services/cosplay-develop.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-cos-element-tomake-modal',
  templateUrl: './cos-element-tomake-modal.component.html',
  styleUrls: ['./cos-element-tomake-modal.component.scss'],
})
export class CosElementTomakeModalComponent implements OnInit {

  @Input() selectedCosplay: Cosplay;
  @Input() item;
  @Input() itemID;

  element: UntypedFormGroup;
  cosElementToMake: CosElementToDo;
  validations = null;

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private cosDevelopService: CosplayDevelopService,
    public fb: UntypedFormBuilder
  ) {

    this.validations = {
      'name': [
        { type: 'required', message: 'Name is required.' },
        { type: 'maxlength', message: 'Name cannot be more than 25 characters long.' },
      ],
      'hours': [
        { type: 'maxlength', message: 'Cost cannot be more than 2 digits long.' },
        { type: 'pattern', message: 'The cost must contain only numbers .' },
      ],
      'minutes': [
        { type: 'maxlength', message: 'Cost cannot be more than 2 digits long.' },
        { type: 'pattern', message: 'The cost must contain only numbers .' },
      ],
      'notes': [
        { type: 'maxlength', message: 'Cost cannot be more than 2 digits long.' },
      ],
      // other validations
    };
    
  }

  ngOnInit() {
    this.element =  this.fb.group({
      name: new UntypedFormControl( this.item?.name ? this.item?.name : null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      hours: new UntypedFormControl( this.item?.hours ? this.item?.hours : '00' , {
        updateOn: 'blur',
        validators: [Validators.maxLength(2)]
      }),
      minutes: new UntypedFormControl( this.item?.minutes ? this.item?.minutes : '01' , {
        updateOn: 'blur',
        validators: [Validators.maxLength(2)]
      }),
      notes: new UntypedFormControl(this.item?.notes ? this.item?.notes : null, {
        updateOn: 'blur',
        validators: [Validators.maxLength(180)]
      }),
      elementID: new UntypedFormControl( this.itemID )
    });
  }

  onSubmitElement(){
    if (!this.element.valid) return

    const modalText = this.item?.name ? 'Updating ...' : 'Creating ...'; 

    this.loadingCtrl
    .create({
      message: modalText
    })
    .then(loadingEl => {
      loadingEl.present();
      const elementToMake = this.element.value;
      const cosplayId = this.selectedCosplay?.id || null;
      this.cosDevelopService.onSaveElToMake(elementToMake, cosplayId);
      
      setTimeout(() => {
        loadingEl.dismiss();
        this.closeModal();
        this.element.reset();
      }, 500);
      
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
    // cerrar modal
  }

  onCancel() {
    this.modalCtrl.dismiss();
    // cerrar modal
  }

}
