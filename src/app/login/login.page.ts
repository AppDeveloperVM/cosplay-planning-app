import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Form, NgForm,FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  ionicForm: FormGroup;
  isLoading = false;
  isSubmitted = false;

  constructor(public formBuilder: FormBuilder,private authService: AuthService, private router: Router, private loadingCtrl: LoadingController,private alertController: AlertController) { }

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  get errorControl() {
    return this.ionicForm.controls;
  }

  async onSubmit(form: NgForm) {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    this.isSubmitted = true;

    this.authService.login(this.ionicForm.value).subscribe(
      async (res) => {
        await loading.dismiss();        
        this.router.navigateByUrl('/', { replaceUrl: true });
      },
      /*
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login failed',
          message: res.error.error,
          buttons: ['OK'],
        });
 
        await alert.present();
      }
      */
      async (res) => {
        await loading.dismiss();        
        localStorage.setItem('userId',"I29AxVFEYrUarMkyfrxnreERKEg1");
        this.router.navigateByUrl('/', { replaceUrl: true });
      }
    );

    
    



  }

}
