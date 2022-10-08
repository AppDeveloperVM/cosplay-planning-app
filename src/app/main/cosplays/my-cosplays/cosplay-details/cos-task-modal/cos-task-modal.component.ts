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

  form: FormGroup;
  task: CosTask;

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private cosDevelopService: CosplayDevelopService
  ) {
    this.form = new FormGroup({
      name: new FormControl('-', {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      alarm: new FormControl(false, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      date: new FormControl(new Date() , {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      done: new FormControl(false, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
    });
  }

  ngOnInit() {
    
      
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
