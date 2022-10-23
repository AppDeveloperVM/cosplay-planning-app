import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Form, NgForm,FormGroup, FormBuilder, Validators, ReactiveFormsModule  } from '@angular/forms';
import { AuthenticationService } from "../../services/authenticationService";
import { SharedModule } from 'src/app/shared/shared.module';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  ionicForm: FormGroup;
  isLoading = false;
  isSubmitted = false;

  constructor(
    public formBuilder: FormBuilder,
    public authService: AuthenticationService,
    private router: Router, 
    private loadingCtrl: LoadingController,
    private alertController: AlertController) { }

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  get errorControl() {
    return this.ionicForm.controls;
  }

  async logIn() {
    const email = this.ionicForm.value.email;
    const password = this.ionicForm.value.password;

    if( this.ionicForm.valid == false){
      return false;
    }

    this.authService.SignIn(email, password)
      .then(async (res) => {

        if(!this.authService.getUserByEmail(email)){
          const alert = await this.alertController.create({
            header: 'User doesnt exist.',
            message: res.additionalUserInfo.username,
            buttons: ['OK'],
          });
          await alert.present();
          return false;
        }

        if(this.authService.isEmailVerified(email) ) {
          this.router.navigate(['/']);          
        } else {

          const alert = await this.alertController.create({
            header: 'Login failed, Email isnt verified.',
            message: res.additionalUserInfo.username,
            buttons: [
              {
                text: 'OK',
                role: 'info'
              },
              {
                text: 'Go to verify page',
                role: 'info',
                handler: data => {
                  this.router.navigate(['/verify-email'])
                }
              }
            ],
          });
          await alert.present();
        }
      }).catch((error) => {
        window.alert(error.message)
      })
  }

}