import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Cosplay } from '../../cosplay.model';
import { CosplaysService } from '../../cosplays.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-cosplay',
  templateUrl: './new-cosplay.page.html',
  styleUrls: ['./new-cosplay.page.scss'],
})
export class NewCosplayPage implements OnInit {

  createContactForm: FormGroup;
  @ViewChild('createForm', { static: false }) createForm: FormGroupDirective;

  constructor(
    private modalController: ModalController,
     private cosplaysService: CosplaysService,
     private router: Router
    // private dataService: DataService
    ) { }

  dismissModal() {
    //this.modalController.dismiss();
    this.router.navigateByUrl('/main/tabs/cosplays/my-cosplays');
  }

  ngOnInit(): void {
    this.createContactForm = new FormGroup({
      'firstName': new FormControl('', Validators.required),
      'lastName': new FormControl('', Validators.required),
      'email': new FormControl(''),
      'phone': new FormControl('', Validators.required),
      'category': new FormControl('', Validators.required)
    });
  }

  submitForm() {
    this.createForm.onSubmit(undefined);
  }

  createContact(values: any) {
    // copy all the form values into the new contact
    let newContact: Cosplay = { ...values };
    //this.cosplaysService.setCosplayGroupRequest(newContact);
    this.dismissModal();
  }

}
