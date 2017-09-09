import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

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
    this.translateService.addLangs(['zh', 'en', 'jp']);
    if (this.translateService.getDefaultLang() === null || this.translateService.getDefaultLang() === '') {
      this.translateService.setDefaultLang('zh');
    }
    const browserLang = this.translateService.getBrowserLang();
    this.translateService.use(browserLang.match(/en|zh|jp/) ? browserLang : 'zh');
  }
  // onClickFull(){
  //   var element=document.body;
  //   if (element.requestFullscreen) {
  //     element.requestFullscreen();
  // } else if (element.mozRequestFullScreen) {
  //     element.mozRequestFullScreen();
  // } else if (element.msRequestFullscreen) {
  //     element.msRequestFullscreen();
  // } else if (element.webkitRequestFullscreen) {
  //     element.webkitRequestFullScreen();
  // }
  // }
}
