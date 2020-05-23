import { Component, OnInit, Input } from '@angular/core';
import { CosplayGroup } from '../cosplay-group.model';
import { Cosplay } from '../../cosplay.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cosplay-group-request',
  templateUrl: './cosplay-group-request.page.html',
  styleUrls: ['./cosplay-group-request.page.scss'],
})
export class CosplayGroupRequestPage implements OnInit {
  form: FormGroup;
  @Input() selectedCosplayGroup: CosplayGroup;
  @Input() requestedCharacter: Cosplay;

  constructor() { }

  ngOnInit() {
  }

}
