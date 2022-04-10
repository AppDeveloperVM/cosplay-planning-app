import { Component, OnInit } from '@angular/core';
import { appSettingsConfig } from '../models/appSettingsConfig.model';
import { DataService } from '../services/data.service';
import { SettingsService } from '../services/settings.service';

const LOCALDATAKEY = 'settings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  private privateAccount: boolean;
  public push_notifs: boolean;
  public theme: string;
  public darkMode: boolean;
  public settingsObj : appSettingsConfig;
  
  constructor(private settings: SettingsService, private dataService: DataService) {
    //Orden de datos

    //comprobar si hay datos locales de config 
    if( this.dataService.checkLocalStorage(LOCALDATAKEY) ){
      //cargar datos locales
      this.loadLocalData(LOCALDATAKEY);
    }else{
      this.settings.settings$.subscribe(config => {
        this.privateAccount = config.privateAccount;
        this.push_notifs = config.push_notifs;
        this.theme = config.theme;
        this.darkMode = config.darkMode;
        console.log(config);
      });
    }
    
  }

  ngOnInit() {
    
  }

  async loadLocalData(key){
    console.log('->Load local data');
    
    //await this.dataService.addData('user',`Vic ${Math.floor(Math.random() * 100)}`);
    this.dataService.getData(key).subscribe(config => {
      if(config != null){
        console.log(config);
        
        this.privateAccount = config['privateAccount'];
        this.push_notifs = config['push_notifs'];
        this.theme = config['theme'];
        this.darkMode = config['darkMode'];
        
      }
    });
  }

  async updateOption(option: string) {
    
    
      switch(option){
        case 'private_account': 
        this.settings.setPrivateAccount(this.privateAccount);
          break;
        case 'push_notifs': 
        this.settings.setPushNotifs(this.push_notifs);
          break;
        case 'theme': 
        this.settings.setActualTheme(this.theme);
          break;
        case 'darkMode': 
        this.settings.setDarkMode(this.darkMode);
          break;
      }
      await this.updateSettingsConfig();
  }

  async updateSettingsConfig() {
    console.log('-> Triggered update');
    this.settingsObj = new appSettingsConfig(this.privateAccount, this.push_notifs, this.theme, this.darkMode);
    await this.settings.settings$.next(this.settingsObj);
    this.dataService.addData('settings', this.settingsObj, true);
    console.log(this.settingsObj);
    
    //await this.dataService.addData(LOCALDATAKEY, this.settingsObj, true);
    
  }


}
