import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Form, NgForm,FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

export class SignupPage implements OnInit {
  ionicForm: FormGroup;
  isLoading = false;
  isSubmitted = false;

  constructor(public formBuilder: FormBuilder,private authService: AuthService, private router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(2)]],
      confirm_password: ['', [Validators.required, Validators.minLength(2)]],
    })
   }

  onLogin() {
    this.isLoading = true;
    
    this.loadingCtrl
    .create({keyboardClose: true, message: 'Logging in..'})
    .then(loadingEl => {
      loadingEl.present();
      setTimeout(() => { 
        this.isLoading = false;
        loadingEl.dismiss();
        this.router.navigateByUrl('/profile');
      } , 1000);
     });
  }

  get errorControl() {
    return this.ionicForm.controls;
  }

  onSubmit(form: NgForm) {
    
    this.isSubmitted = true;
    if (!this.ionicForm.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {

      this.authService.signUp( 
        form.value
      );

      console.log(this.ionicForm.value)
    }

  }

}
