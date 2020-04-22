import { Component, OnInit } from '@angular/core';
import { CosplaysService } from '../cosplays.service';
import { Cosplay } from '../cosplay.model';

@Component({
  selector: 'app-my-cosplays',
  templateUrl: './my-cosplays.page.html',
  styleUrls: ['./my-cosplays.page.scss'],
})
export class MyCosplaysPage implements OnInit {
  loadedCosplays: Cosplay[];

  constructor(private cosplaysService: CosplaysService) { }

  ngOnInit() {
    this.loadedCosplays = this.cosplaysService.cosplays;
  }

}