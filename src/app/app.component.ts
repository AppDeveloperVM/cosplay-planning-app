import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Plugins, Capacitor } from '@capacitor/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  navigate: any;
  selectedTheme: String;

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router,
    private settings: SettingsService
  ) {
    this.initializeApp();
    this.settings.activeTheme.subscribe(
    val => {
      this.selectedTheme = val;
      console.log("theme: "+this.selectedTheme)
    }
    );
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {  
        Plugins.SplashScreen.hide();
      }
    });
  }


  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

}
