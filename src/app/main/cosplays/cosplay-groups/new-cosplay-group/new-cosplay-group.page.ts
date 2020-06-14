import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CosplayGroup } from '../cosplay-group.model';
import { CosplayGroupService } from '../cosplay-group.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-cosplay-group',
  templateUrl: './new-cosplay-group.page.html',
  styleUrls: ['./new-cosplay-group.page.scss'],
})
export class NewCosplayGroupPage implements OnInit {
  form: FormGroup;
  @Input() selectedCosplayGroup: CosplayGroup;
  @Input() selectedMode: 'select' | 'random';
  startDate: string;
  endDate: string;

  constructor(private cosplayGroupService: CosplayGroupService, private router: Router) { }

  ngOnInit() {
    const availableFrom = new Date();
    const availableTo = new Date();

    this.startDate = new Date().toISOString();
    this.endDate = new Date(new Date(this.startDate).getTime()).toISOString();

    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      series: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      place: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [ Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [ Validators.required]
      })
    });
  }

  onCreateGroup() {
    console.log(this.form.value);  // { first: '', last: '' }
    console.log(this.form.valid);

    this.cosplayGroupService.addCosplayGroup(
      this.form.value.title,
      this.form.value.series,
      this.form.value.description,
      new Date(this.form.value.dateFrom),
      new Date(this.form.value.dateTo),
      this.form.value.place
    );

    this.form.reset();
    this.router.navigate(['main/tabs/cosplays/cosplay-groups']);
  }


}
