import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { appSettingsConfig } from '../models/appSettingsConfig.model';
import { DataService } from './data.service';
 
@Injectable()
export class SettingsService {
 
    settings$ = new BehaviorSubject<appSettingsConfig>({
        privateAccount: true,
        push_notifs: false,
        theme: 'dark-theme',
        darkMode: true
    });

    constructor(private dataService : DataService) {
    }

    /*public get settings$(): Observable<appSettingsConfig> {
        return this.settings$.asObservable();
    }*/

    public get snapshot(): appSettingsConfig {
        return this.settings$.getValue();
    }

    //privateAccount
    public selectPrivateAccount(): Observable<boolean> {
        return this.settings$.pipe(
            map(state => state.privateAccount),
            distinctUntilChanged()
        );
    }

    public setPrivateAccount(privateAccount: boolean) {
        this.patch({privateAccount});
        
    }

    //pushNotifications
    public selectPushNotifs(): Observable<boolean> {
        return this.settings$.pipe(
            map(state => state.push_notifs),
            distinctUntilChanged()
        );
    }

    public setPushNotifs(push_notifs: boolean) {
        this.patch({push_notifs});
        
    }

    //dark mode
    public selectToogleDarkMode(): Observable<boolean> {
        return this.settings$.pipe(
            map(state => state.darkMode),
            distinctUntilChanged()
        );
    }

    public setDarkMode(darkMode: boolean) {
        if(darkMode){
            this.patch({theme : 'dark-theme'});
        }else{
            this.patch({theme : 'light-theme'});
        }
        
    }

    //actual theme
    public selectActualTheme() : Observable<string> {
        return this.settings$.pipe(
            map(state => state.theme),
            distinctUntilChanged()
        )
    }

    public setActualTheme(theme: string) {
        this.patch({theme});
    }

    private patch(value: Partial<appSettingsConfig>) {
        this.settings$.next({...this.settings$.getValue(), ...value});
    }
 
    

}