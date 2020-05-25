import { Component, OnInit, Input } from '@angular/core';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { CosplayGroup } from '../cosplay-group.model';
import { ModalController } from '@ionic/angular';
import { Cosplay } from '../../cosplay.model';

@Component({
  selector: 'app-cosplay-group-send-request',
  templateUrl: './cosplay-group-send-request.component.html',
  styleUrls: ['./cosplay-group-send-request.component.scss'],
})
export class CosplayGroupSendRequestComponent implements OnInit {
  @Input() selectedCosplayGroup: CosplayGroup;
  @Input() requestedCharacter: Cosplay;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onSendCosplayGroupRequest() {
    this.modalCtrl.dismiss({ message: 'Request send from cosplay-group-send-request !'}, 'confirm');
  }

}
