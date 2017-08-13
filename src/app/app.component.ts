import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(public translateService: TranslateService) {
  }
  ngOnInit() {
    // --- set i18n begin ---
    this.translateService.addLangs(['zh', 'en', 'jp']);
    this.translateService.setDefaultLang('zh');
    const browserLang = this.translateService.getBrowserLang();
    // console.log('语言是' + browserLang);
    this.translateService.use(browserLang.match(/en|zh|jp/) ? browserLang : 'en');
    // --- set i18n end ---
  }
}
