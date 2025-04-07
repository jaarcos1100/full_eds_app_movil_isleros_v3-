import {DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {InterceptorService} from './services/interceptor/iterceptor-interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReplaceTextPipe } from './pipes/replace-text/replace-text.pipe';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    // { provide: LOCALE_ID, useValue: 'es-Co' },
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true},
    // {provide: DEFAULT_CURRENCY_CODE, useValue: 'COP'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
