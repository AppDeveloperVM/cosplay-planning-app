import { Component, OnInit } from '@angular/core';
import { Form, NgForm,FormGroup, FormBuilder, Validators, ReactiveFormsModule  } from '@angular/forms';
import { Router } from "@angular/router";
import { AuthenticationService } from "../../services/authenticationService";
import { SharedModule } from 'src/app/shared/shared.module';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  ionicForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public authService: AuthenticationService,
    private router: Router
  ) { }
  
  ngOnInit(){
    this.ionicForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  signUp(){
    const email = this.ionicForm.value.email;
    const password = this.ionicForm.value.password;

    if( this.ionicForm.valid == false){
      return false;
    }

    this.authService.RegisterUser(email, password)      
    .then((res) => {

        // Do something here
      this.authService.SendVerificationMail();
      this.router.navigate(['verify-email']);
      window.alert(res);
      
    }).catch((error) => {
      window.alert(error);
    })
  }
}