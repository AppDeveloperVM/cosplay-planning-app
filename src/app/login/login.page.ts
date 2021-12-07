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
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login failed',
          message: res.error.error,
          buttons: ['OK'],
        });
 
        await alert.present();
      }
    );

    /*if (!this.ionicForm.valid) {
      //Show errors
      console.log('Please provide all the required values!')
      return false;
    } else {
      //LOGIN
      this.isLoading = true;
      
      this.loadingCtrl
      .create({keyboardClose: true, message: 'Logging in..'})
      .then(loadingEl => {
        loadingEl.present();

        if (!this.ionicForm.valid) { // if is false
          return;
        }

        this.authService.login( this.ionicForm.value );
        
        
        //localStorage.setItem('user' , resp.accessToken);
        this.router.navigateByUrl(
          '/'
        )
  
        setTimeout(() => {
          this.isLoading = false;
          loadingEl.dismiss();
          //this.router.navigateByUrl('/');
        } , 500);
        
        
       });
      
    }
    */
    



  }

}
