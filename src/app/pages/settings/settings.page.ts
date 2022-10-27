import { Component, OnInit } from '@angular/core';
import { appSettingsConfig } from '../../models/appSettingsConfig.model';
import { DataService } from '../../services/data.service';
import { SettingsService } from '../../services/settings.service';
import { AuthenticationService } from 'src/app/services/authenticationService';
import { AngularFireAuth } from '@angular/fire/compat/auth';


const LOCALDATAKEY = 'settings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  public privateAccount: boolean = false;
  public push_notifs: boolean = true;
  public theme: string = 'dark-theme';
  public darkMode: boolean = false;
  public settingsObj : appSettingsConfig;
  public userData : any;
  public isLoading = false;
  
  constructor(
    private settings: SettingsService,
    private dataService: DataService,
    private authService : AuthenticationService,
    private authFire : AngularFireAuth

    ) {
    //Orden de datos
    this.loadLocalData(LOCALDATAKEY);
    
  }

  async ngOnInit() {
    this.isLoading = true;
    this.authFire.authState.subscribe((user) => {  
      this.userData = user;
      this.isLoading = false;
    });
    
    console.group("userData: " ,this.userData);
  }

  async loadLocalData(key){
    console.log('->Load local data');
    
    //await this.dataService.addData('user',`Vic ${Math.floor(Math.random() * 100)}`);
    this.dataService.getData(key).subscribe(async config => {
      if(config != null){
        console.log(config);
        this.privateAccount = config['privateAccount'];
        this.push_notifs = config['push_notifs'];
        this.theme = config['theme'];
        this.darkMode = config['darkMode'];
      } else {
        await this.updateSettingsConfig();
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
    //await this.settings._settings$.next(this.settingsObj);

    this.dataService.addData('settings', this.settingsObj, true);
    console.log(this.settingsObj);
    //await this.dataService.addData(LOCALDATAKEY, this.settingsObj, true);
  }


}
