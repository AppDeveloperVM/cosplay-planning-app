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

  form: FormGroup;
  @ViewChild('createForm', { static: false }) createForm: FormGroupDirective;

  constructor(
    private modalController: ModalController,
    private cosplaysService: CosplaysService,
    private router: Router
    // private dataService: DataService
    ) { }


  ngOnInit(): void {
    this.form = new FormGroup({
      'characterName': new FormControl('', Validators.required),
      'series': new FormControl('', Validators.required),
      'description': new FormControl('')
    });
  }

  onCreateCosplay(characterName: string, description: string, imageUrl: string, series: string, funds: number, percentComplete: string, status: boolean) {
    /*if (!this.form.valid) {
      return;
    }*/
    this.cosplaysService.addCosplay(
      this.form.value.characterName,
      this.form.value.description,
      'https://pbs.twimg.com/media/DluGJLAUYAEdcIT?format=jpg&name=small',
      this.form.value.series,
      0,
      '0',
      false
    );

    this.form.reset();
    this.router.navigate(['main/tabs/cosplays/my-cosplays']);

  }

}
