import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective, FormControl, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-new-planning',
  templateUrl: './new-planning.page.html',
  styleUrls: ['./new-planning.page.scss'],
})
export class NewPlanningPage implements OnInit {

  form: FormGroup;
  @ViewChild('createForm', { static: false }) createForm: FormGroupDirective;

  constructor(
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl(''),
    });
    this.loadingCtrl
    .create({

    })
    .then(loadingEl => {
      loadingEl.present();
      
    });
  }

  onCreatePlanning() {
    if (!this.form.valid) {
      return;
    }
  }

}
