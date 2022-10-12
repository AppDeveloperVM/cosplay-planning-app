These are Cordova resources. You can replace icon.png and splash.png and run
`ionic cordova resources` to generate custom icons and splash screens for your
app. See `ionic cordova resources --help` for details.

Cordova reference documentation:

- Icons: https://cordova.apache.org/docs/en/latest/config_ref/images.html
- Splash Screens: https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-splashscreen/

The source image for icons should ideally be at least 1024×1024px and located at resources/icon.png. The source image for splash screens should ideally be at least 2732×2732px and located at resources/splash.png

Cordova-res expects a Cordova-like structure: place one icon and one splash screen file in a top-level resources folder within your project, like so:

resources/
├── icon.png
└── splash.png
Next, run the following to generate all images then copy them into the native projects:

capacitor-resources ios --skip-config --copy
capacitor-resources android --skip-config --copy

<!-- "webDir": "www",
"plugins": {
    "SplashScreen": {
        "launchShowDuration": 2000,
        "launchAutoHide": true,
        "backgroundColor": "#ffffffff",
        "androidSplashResourceName": "splash"
    } -->

capacitor.config.json


<!-- initializeApp() {
    this.platform.ready().then(() => {
      /* if (Capacitor.isPluginAvailable('SplashScreen')) {  
        Plugins.SplashScreen.hide();
      }  */
      //this.router.navigateByUrl('splash');
}); -->

app.component.ts



<!-- <style name="AppTheme.NoActionBarLaunch" parent="AppTheme.NoActionBar">
        <item name="android:background">@null</item>
</style> -->

styles.xml