import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { Cosplay } from 'src/app/models/cosplay.model';
import { CosTask } from 'src/app/models/cosTask.model';
import { CosplayDevelopService } from 'src/app/services/cosplay-develop.service';

@Component({
  selector: 'app-cos-task-modal',
  templateUrl: './cos-task-modal.component.html',
  styleUrls: ['./cos-task-modal.component.scss'],
})
export class CosTaskModalComponent implements OnInit {
  @Input() selectedCosplay: Cosplay;
  @Input() item;
  @Input() itemID;

  form: FormGroup;
  task: CosTask;

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private cosDevelopService: CosplayDevelopService
  ) {
    
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl( this.item?.name ? this.item?.name : '-' , {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      alarm: new FormControl( this.item?.alarm ? this.item?.alarm : false, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      date: new FormControl( this.item?.date ? this.item?.date : new Date() , {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      done: new FormControl( this.item?.done ? this.item?.done : false , {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      taskID: new FormControl( this.itemID )
    });
      
  }

  onSubmitTask(){
    if (!this.form.valid) return

    this.loadingCtrl
    .create({
      message: 'Creating Task ...'
    })
    .then(loadingEl => {
      loadingEl.present();
      const task = this.form.value;
      const cosplayId = this.selectedCosplay?.id || null;
      this.cosDevelopService.onSaveTask(task, cosplayId);
      console.log(task);
      
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
