import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import * as jQuery from 'jquery';


@Injectable()
export class CommonService {

  constructor(public translateService: TranslateService) {
  }

  // 实现语言切换
  onChangeLang(lang: string) {
    if (lang === 'chinese') {
      this.translateService.use('zh');
      this.translateService.setDefaultLang('zh');
      this.translateService.set('lang', 'zh');
    } else if (lang === 'japanese') {
      this.translateService.use('jp');
      this.translateService.setDefaultLang('jp');
      this.translateService.set('lang', 'jp');
      // alert(this.translateService.getDefaultLang());
      // alert(this.translateService.get('lang').subscribe(lang=>th));
      // alert(this.lang);
    } else {
      this.translateService.use('en');
      this.translateService.setDefaultLang('en');
      this.translateService.set('lang', 'en');
    }
  }

  // 生成日期和时间
  showDate() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const dayNames = ['Sun, ', 'Mon, ', 'Tue, ', 'Wed, ', 'Thu, ', 'Fri, ', 'Sat, '];

    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 1);
    // alert(newDate.getDay());
    jQuery('#Date').html(dayNames[newDate.getDay()] + ' ' + newDate.getDate() +
      ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear());
    // const hours: number = newDate.getHours();
    // const mins: number = newDate.getMinutes();
    // const sec: number = newDate.getSeconds();
    // jQuery('.hour').html((hours < 10) ? ('0' + hours) : hours.toString());
    // jQuery('.min').html((mins < 10) ? ('0' + mins) : mins.toString());
    // jQuery('.sec').html((sec < 10) ? ('0' + sec) : sec.toString());
    // jQuery('.meridiem').html((hours < 12) ? 'AM' : 'PM');
  }

  showTime() {
    const newDate = new Date();
    const hours: number = newDate.getHours();
    const mins: number = newDate.getMinutes();
    const sec: number = newDate.getSeconds();
    jQuery('.hour').html((hours < 10) ? ('0' + hours) : hours.toString());
    jQuery('.min').html((mins < 10) ? ('0' + mins) : mins.toString());
    jQuery('.sec').html((sec < 10) ? ('0' + sec) : sec.toString());
    jQuery('.meridiem').html((hours < 12) ? 'AM' : 'PM');
  }

}
