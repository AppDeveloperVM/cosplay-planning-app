import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { appSettingsConfig } from '../models/appSettingsConfig.model';
import { DataService } from './data.service';
 
@Injectable()
export class SettingsService {

    public privateAccount: boolean = true;
    public push_notifs: boolean = false;
    public theme: string = 'dark-theme';
    public darkMode: boolean = true;
    public settingsObj : appSettingsConfig;
 
    settingsConfig : appSettingsConfig = new appSettingsConfig(
        this.privateAccount,
        this.push_notifs,
        this.theme,
        this.darkMode 
    )
    public _settings$ : BehaviorSubject<appSettingsConfig> = new BehaviorSubject<appSettingsConfig>(
        this.settingsConfig
    );
    settings$ : Observable<appSettingsConfig> = this._settings$.asObservable();

    constructor(private dataService : DataService) { }

    public get settings(): Observable<appSettingsConfig> {
        return this.settings$;
    }

    public get snapshot(): appSettingsConfig {
        return this._settings$.getValue();
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

    private patch(value: Partial<appSettingsConfig>) {
        this._settings$.next({...this._settings$.getValue(), ...value});
    }
 
    

}