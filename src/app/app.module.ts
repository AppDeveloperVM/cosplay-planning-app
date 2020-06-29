import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CosplayGroupSendRequestComponent } from './main/cosplays/cosplay-groups/cosplay-group-send-request/cosplay-group-send-request.component';
import { ComponentsModule } from './components/components.module';
import { PopinfoComponent } from './components/popinfo/popinfo.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [AppComponent, CosplayGroupSendRequestComponent],
  entryComponents: [CosplayGroupSendRequestComponent, PopinfoComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ComponentsModule,
    IonicModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
