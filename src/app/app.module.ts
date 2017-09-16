import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { Code404Component } from './code404/code404.component';
import { Code500Component } from './code500/code500.component';
import { HomeRightHeadComponent } from './home-right-head/home-right-head.component';
import { HomeLeftComponent } from './home-left/home-left.component';
import { HomeRightComponent } from './home-right/home-right.component';
import { HomeRightBodyComponent } from './home-right-body/home-right-body.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CommonService } from './service/common.service';
import { MockService } from './service/mock.service';
import { QuoteService} from './service/quote.service'
import { FooterComponent } from './footer/footer.component';
import { User} from './model/user.model';
import './utils/debug.util';
import { ChatComponent } from './chat/chat.component';

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
    DashboardComponent,
    FooterComponent,
    ChatComponent
  ],
  imports: [
    HttpModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateHttpLoader),
        deps: [HttpClient]
      }
    }),
    AppRoutingModule
  ],
  providers: [
    User,
    CommonService,
    MockService,
    QuoteService,
    
    {
      provide: LocationStrategy, useClass: HashLocationStrategy
    },{
      provide:'BASE_CONFIG',useValue:{
        'json_server_uri':'http://localhost:3000'
      }
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
