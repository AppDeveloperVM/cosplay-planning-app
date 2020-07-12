import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-planning',
  templateUrl: './new-planning.page.html',
  styleUrls: ['./new-planning.page.scss'],
})
export class NewPlanningPage implements OnInit {

  form: FormGroup;
  @ViewChild('createForm', { static: false }) createForm: FormGroupDirective;


  constructor() { }

  ngOnInit(): void {
    this.form = new FormGroup({
      characterName: new FormControl('', Validators.required),
      series: new FormControl('', Validators.required),
      description: new FormControl(''),
      image: new FormControl(null)
    });
  }

}
