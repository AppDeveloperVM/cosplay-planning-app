import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
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

  constructor(public formBuilder: FormBuilder,private authService: AuthService, private router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(2)]],
    })
  }

  get errorControl() {
    return this.ionicForm.controls;
  }

  onSubmit(form: NgForm) {
    this.isSubmitted = true;
    if (!this.ionicForm.valid) {
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

        this.authService.login(this.ionicForm.value);
        
        
        setTimeout(() => {
          this.isLoading = false;
          loadingEl.dismiss();
          //this.router.navigateByUrl('/');
        } , 500);
        
        
       });
      

    }

  }

}
