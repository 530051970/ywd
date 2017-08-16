import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient} from '@angular/common/http';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {AppRoutingModule} from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { Code404Component } from './code404/code404.component';
import { Code500Component } from './code500/code500.component';
import { HomeRightHeadComponent } from './home-right-head/home-right-head.component';
import { HomeLeftComponent } from './home-left/home-left.component';
import { HomeRightComponent } from './home-right/home-right.component';
import { HomeRightBodyComponent } from './home-right-body/home-right-body.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export function createTranslateHttpLoader(http: HttpClient) {
 return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    Code404Component,
    Code500Component,
    HomeRightHeadComponent,
    HomeLeftComponent,
    HomeRightComponent,
    HomeRightBodyComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: (createTranslateHttpLoader),
      deps: [HttpClient]
    }
 }),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
