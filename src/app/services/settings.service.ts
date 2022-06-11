import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { appSettingsConfig } from '../models/appSettingsConfig.model';
import { DataService } from './data.service';

const LOCALDATAKEY = 'settings';

@Injectable()
export class SettingsService {

    private privateAccount: boolean = true;
    private push_notifs: boolean = false;
    private theme: string = 'dark-theme';
    private darkMode: boolean = true;
    private settingsObj : appSettingsConfig;
 
    settingsConfig : appSettingsConfig = new appSettingsConfig(
        this.privateAccount,
        this.push_notifs,
        this.theme,
        this.darkMode 
    )
    
    private _settings$ : BehaviorSubject<appSettingsConfig> = new BehaviorSubject<appSettingsConfig>(
        this.settingsConfig
    );
    settings$ : Observable<appSettingsConfig> = this._settings$.asObservable();

    constructor(private dataService : DataService) { }
    
    async init(){
        //cargar datos locales
        this.loadLocalData(LOCALDATAKEY);
    }

    public get settings(): Observable<appSettingsConfig> {
        return this.settings$;
    }

    public get snapshot(): appSettingsConfig {
        return this._settings$.getValue();
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
                
                var settingsObj = { 
                    privateAccount: this.privateAccount,
                    push_notifs : this.push_notifs,
                    theme: this.theme,
                    darkMode : this.darkMode
                } 
                this.updateAllValues(settingsObj);

            }
        });
    }

    private updateAllValues(obj){
        console.log('update values');
        this._settings$.next(obj);
    }

    //privateAccount
    public selectPrivateAccount(): Observable<boolean> {
        return this._settings$.pipe(
            map(state => state.privateAccount),
            distinctUntilChanged()
        );
    }

    public setPrivateAccount(privateAccount: boolean) {
        this.patch({privateAccount});
        
    }

    //pushNotifications
    public selectPushNotifs(): Observable<boolean> {
        return this._settings$.pipe(
            map(state => state.push_notifs),
            distinctUntilChanged()
        );
    }

    public setPushNotifs(push_notifs: boolean) {
        this.patch({push_notifs});
        
    }

    //dark mode
    public selectToogleDarkMode(): Observable<boolean> {
        return this._settings$.pipe(
            map(state => state.darkMode),
            distinctUntilChanged()
        );
    }

    public setDarkMode(darkMode: boolean) {
        this.patch({darkMode});
    }

    //actual theme
    public selectActualTheme() : Observable<string> {
        return this._settings$.pipe(
            map(state => state.theme),
            distinctUntilChanged()
        )
    }

    public setActualTheme(theme: string) {
        this.patch({theme});
    }

    public getActualTheme(){
        return this.theme;
    }

    private patch(value: Partial<appSettingsConfig>) {
        this._settings$.next({...this._settings$.getValue(), ...value});
    }
 
    

}