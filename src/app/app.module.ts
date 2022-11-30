import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CosplayGroupSendRequestComponent } from './pages/main/cosplay-groups/cosplay-group-send-request/cosplay-group-send-request.component';
import { CosElementTobuyModalComponent } from './pages/main/cosplays/my-cosplays/cosplay-details/cos-element-tobuy-modal/cos-element-tobuy-modal.component';
import { CosElementTomakeModalComponent } from './pages/main/cosplays/my-cosplays/cosplay-details/cos-element-tomake-modal/cos-element-tomake-modal.component';
import { CosTaskModalComponent } from './pages/main/cosplays/my-cosplays/cosplay-details/cos-task-modal/cos-task-modal.component';
import { ComponentsModule } from './components/components.module';
import { PopinfoComponent } from './components/popinfo/popinfo.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { AuthInterceptor } from './services/auth-interceptor.service';

import { firebaseConfig } from '../environments/environment';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { MapModalLeafletComponent } from './shared/map-modal-leaflet/map-modal-leaflet.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { SettingsService } from './services/settings.service';

import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import * as cordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
// geolocation and native-geocoder
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
    declarations: [
        AppComponent,
        CosplayGroupSendRequestComponent,
        CosElementTobuyModalComponent,
        CosElementTomakeModalComponent,
        CosTaskModalComponent,
        MapModalLeafletComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        ComponentsModule,
        IonicModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFirestoreModule.enablePersistence({ synchronizeTabs: true }),
        AngularFireAuthModule,
        SharedModule,
        LazyLoadImageModule,
        IonicStorageModule.forRoot({
            name: "cosappdb",
            driverOrder: [cordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage]
        })
    ],
    providers: [
        StatusBar,
        SplashScreen,
        AngularFirestoreModule,
        SettingsService,
        
        Geolocation,
        NativeGeocoder,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
        //{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
