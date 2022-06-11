import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Plugins, Capacitor } from '@capacitor/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { SettingsService } from './services/settings.service';
import { Observable } from 'rxjs';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  navigate: any;
  selectedTheme: String;
  public darkMode$: Observable<boolean> = this._settings.selectToogleDarkMode();
  public theme$: Observable<string> = this._settings.selectActualTheme();
  //Important observables ( auth - settings )
  settings$ = this._settings._settings$;

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    public _settings: SettingsService
  ) {
    this.initializeApp();

    //Settings 
    this._settings._settings$.subscribe(config => {
      this.selectedTheme = config.theme;
      console.log('theme : '+ config.theme);
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {  
        Plugins.SplashScreen.hide();
      }
    });
    


  }

  toggleDarkMode() {
    this._settings.setDarkMode(!this._settings.snapshot.darkMode);
  }

  changeTheme(theme: string) {
    this._settings.setActualTheme(theme);
  }


  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

}
