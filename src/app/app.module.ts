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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { AuthInterceptor } from './services/auth-interceptor.service';

import { firebaseConfig } from 'src/environments/environment';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { MapModalLeafletComponent } from './shared/map-modal-leaflet/map-modal-leaflet.component';



@NgModule({
  declarations: [AppComponent, CosplayGroupSendRequestComponent,MapModalLeafletComponent],
  entryComponents: [CosplayGroupSendRequestComponent,PopinfoComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ComponentsModule,
    IonicModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    //AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFirestoreModule,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    //{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
