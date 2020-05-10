import { Component, OnInit } from '@angular/core';
import { CosplayGroup } from './cosplay-group.model';
import { CosplayGroupService } from './cosplay-group.service';

@Component(
  {
  selector: 'app-cosplay-groups',
  templateUrl: './cosplay-groups.page.html',
  styleUrls: ['./cosplay-groups.page.scss'],
}
)

export class CosplayGroupsPage implements OnInit {
  cosplaygroups: CosplayGroup[];

  constructor(private cosplaygroupService: CosplayGroupService) { }

  ngOnInit() {
    this.cosplaygroups = this.cosplaygroupService.cosplaygroups;
  }

}
