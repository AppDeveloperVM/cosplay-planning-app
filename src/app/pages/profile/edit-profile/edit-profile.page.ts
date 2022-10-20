import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Profile } from '../profile.model';
import { ProfilePage } from '../profile.page';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  profile: Profile;
  isLoading = false;
  form: FormGroup;

  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {

    this.isLoading = true;

    this.form = new FormGroup({
      //this.profile.userName,
      userrName: new FormControl(  {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      //this.profile.description ,
      description: new FormControl( {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
    this.isLoading = false;

  }

  onUpdateProfile() {

  }


}
