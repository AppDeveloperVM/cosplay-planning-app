import { Component, OnInit } from '@angular/core';
import { appSettingsConfig } from '../models/appSettingsConfig.model';
import { DataService } from '../services/data.service';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  public private_account: boolean;
  public push_notifs: boolean;
  public darkMode: boolean;


  constructor(private settings: SettingsService, private dataService: DataService) {
    this.settings.settings$.subscribe(config => {
      this.private_account = config.privateAccount;
      this.push_notifs = config.push_notifs;
      this.darkMode = config.darkMode;
      console.log(config);
    });

    this.loadLocalData();
  }

  ngOnInit() {
  }

  updateOption(option: string) {
      switch(option){
        case 'private_account': 
        this.settings.setPrivateAccount(this.private_account);
          break;
        case 'push_notifs': 
        this.settings.setPushNotifs(this.push_notifs);
          break;
        case 'darkMode': 
        this.settings.setDarkMode(this.darkMode);
          break;
      }
      
  }

  async loadLocalData(){
    //await this.dataService.addData('user',`Vic ${Math.floor(Math.random() * 100)}`);
    this.dataService.getData('settings').subscribe(config => {
      for (const key in config) {
        this.updateOption(key);
      }

    });
  }


}
