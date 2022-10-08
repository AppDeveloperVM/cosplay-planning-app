import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { CosElementToDo } from 'src/app/models/cosElementToDo.model';
import { Cosplay } from 'src/app/models/cosplay.model';
import { CosplayDevelopService } from 'src/app/services/cosplay-develop.service';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-cos-element-tomake-modal',
  templateUrl: './cos-element-tomake-modal.component.html',
  styleUrls: ['./cos-element-tomake-modal.component.scss'],
})
export class CosElementTomakeModalComponent implements OnInit {

  @Input() selectedCosplay: Cosplay;
  @Input() item;
  @Input() itemID;

  form: FormGroup;
  cosElementToMake: CosElementToDo;

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private cosDevelopService: CosplayDevelopService,
    public fb: FormBuilder
  ) {
    
  }

  ngOnInit() {
    this.form =  this.fb.group({
      name: new FormControl( this.item?.name ? this.item?.name : null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      hours: new FormControl( this.item?.hours ? this.item?.hours : '00' , {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      minutes: new FormControl( this.item?.minutes ? this.item?.minutes : '01' , {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      notes: new FormControl(this.item?.notes ? this.item?.notes : 'notes', {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      elementID: new FormControl( this.itemID )
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
      const cosplayId = this.selectedCosplay?.id || null;
      this.cosDevelopService.onSaveElToMake(elementToMake, cosplayId);
      console.log(elementToMake);
      
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
