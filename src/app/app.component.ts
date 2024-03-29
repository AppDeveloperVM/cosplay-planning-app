import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Plugins, Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';
import { SettingsService } from './services/settings.service';
import { Observable } from 'rxjs';
import { DataService } from './services/data.service';
import { threadId } from 'worker_threads';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  navigate: any;
  selectedTheme: String = this._settings.getActualTheme();
  public darkMode$: Observable<boolean> = this._settings.selectToogleDarkMode();
  public theme$: Observable<string> = this._settings.selectActualTheme();
  //Important observables ( auth - settings )
  settings$ = this._settings.settings;

  constructor(
    private platform: Platform,
    private dataService: DataService,
    private router: Router,
    public _settings: SettingsService
  ) {
    this.initializeApp();
    defineCustomElements(window);

    this.dataService.init();
    this._settings.init();
    //Settings 
    this.settings$.subscribe(config => {
      this.selectedTheme = config.theme;
      console.log('theme : '+ config.theme);
    });


  }

  initializeApp() {
    this.platform.ready().then(() => {
      /* if (Capacitor.isPluginAvailable('SplashScreen')) {  
        Plugins.SplashScreen.hide();
      }  */
      //this.router.navigateByUrl('splash');
    });
    


  }

  toggleDarkMode() {
    this._settings.setDarkMode(!this._settings.snapshot.darkMode);
  }

  changeTheme(theme: string) {
    this._settings.setActualTheme(theme);
  }


}
