import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private lang = 'zh';
  title = 'app';

  constructor(public translateService: TranslateService) {
  }

  ngOnInit() {
    // --- set i18n begin ---

    this.translateService.addLangs(['zh', 'en', 'jp']);
    if (this.translateService.getDefaultLang() === null || this.translateService.getDefaultLang() === '') {
      this.translateService.setDefaultLang('zh');
      // this.translateService.get('lang').subscribe(lang => {this.lang = lang.toString(); });
      // alert(this.translateService.getBrowserCultureLang());
      // this.lang = this.translateService.getDefaultLang();

    }
    const browserLang = this.translateService.getBrowserLang();
    // console.log('语言是' + browserLang);
    this.translateService.use(browserLang.match(/en|zh|jp/) ? browserLang : 'zh');
    // --- set i18n end ---
  }
}
