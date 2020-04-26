import { Component, OnInit } from '@angular/core';
import { CosplaysService } from '../cosplays.service';
import { Cosplay } from '../cosplay.model';
import { SegmentChangeEventDetail } from '@ionic/core';

@Component({
  selector: 'app-my-cosplays',
  templateUrl: './my-cosplays.page.html',
  styleUrls: ['./my-cosplays.page.scss'],
})
export class MyCosplaysPage implements OnInit {
  loadedCosplays: Cosplay[];
  listedLoadedCosplays: Cosplay[];

  constructor(private cosplaysService: CosplaysService) { }

  ngOnInit() {
    this.loadedCosplays = this.cosplaysService.cosplays;
    this.listedLoadedCosplays = this.loadedCosplays.slice(0);
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log(event.detail);
  }

}
