import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective, FormControl, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { PlanningService } from '../../planning.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-new-planning',
  templateUrl: './new-planning.page.html',
  styleUrls: ['./new-planning.page.scss'],
})
export class NewPlanningPage implements OnInit {

  form: FormGroup;
  @ViewChild('createForm', { static: false }) createForm: FormGroupDirective;

  constructor(
    private loadingCtrl: LoadingController, 
    private planningService: PlanningService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl(''),
    });
    
  }

  onImagePicked(imageData: string | File) {
    let imageFile;

  }

  onCreatePlanning() {
    if (!this.form.valid|| !this.form.get('image').value ) {
      return;
    }

    this.loadingCtrl
    .create({
      message: 'Creating Planning...'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.planningService.uploadImage(this.form.get('image').value)
      .pipe(
        switchMap(uploadRes => {
          return null;
        })
      )
      .subscribe(()=>{
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['main/tabs/plannings']);
      })
    });
  }

}
