import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as jQuery from 'jquery';
import { Http } from '@angular/http';
import { FormControl } from '@angular/forms'
// import { Http } from '@angular/http';


@Injectable()
export class CommonService {

  private lang: string;
  public json2: any;
  // private subscription:Observable;

  constructor(public translateService: TranslateService, private http: Http) {
    this.http.get('assets/i18n/zh.json').map(res => { this.json2 = res.json });
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
    } else {
      this.translateService.use('en');
      this.translateService.setDefaultLang('en');
      this.translateService.set('lang', 'en');
    }
  }

  // 生成英语日期和时间
  showDate(currentLang: string) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const dayNames = ['Sun, ', 'Mon, ', 'Tue, ', 'Wed, ', 'Thu, ', 'Fri, ', 'Sat, '];
    const dayNamesZh = ['星期日 ', '星期一 ', '星期二 ', '星期三 ', '星期四 ', '星期五 ', '星期六 '];
    const dayNamesJp = ['日曜日 ', '月曜日 ', '火曜日 ', '水曜日 ', '木曜日 ', '金曜日 ', '土曜日 '];
    const newDate = new Date();
    newDate.setDate(newDate.getDate());
    if (currentLang == 'zh') {
      jQuery('#Date').html(newDate.getFullYear() + '年' + (newDate.getMonth() + 1) + '月' + newDate.getDate() + '日 ' + dayNamesZh[newDate.getDay()]);
    } else if (currentLang == 'jp') {
      jQuery('#Date').html(newDate.getFullYear() + '年' + (newDate.getMonth() + 1) + '月' + newDate.getDate() + '日 ' + dayNamesJp[newDate.getDay()]);
    } else {
      jQuery('#Date').html(dayNames[newDate.getDay()] + ' ' + newDate.getDate() +
        ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear());

    }
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
  // 弹出弹窗,2s后消失
  // obj:Jquery对象
  // content:弹窗内容
  // type:弹窗类型  'info' 'success' 'danger' 'warning'
  showTip(obj: any, type: string) {
    //  this.json2 = this.getI18nJsonFile();

    if (obj.length == 0) {
      obj = $('<span id="tip" style="font-weight:bold;position:absolute;top:50px;left: 50%;z-index:9999"></span>');
      jQuery('body').append(obj);
    }
    // obj.stop(true).attr('class', 'alert alert-' + type).text(content).css('margin-left', -obj.outerWidth() / 2).fadeIn(500).delay(2000).fadeOut(500);
    obj.stop(true).attr('class', 'alert alert-' + type).css('margin-left', -obj.outerWidth() / 2).fadeIn(500).delay(2000).fadeOut(500);
  }

  // 获取当前语言
  getCurrentLang(): any {
    // alert(this.translateService.currentLang);
    return this.translateService.currentLang;
  }

  // 自定义校验器
  // 判断是不是email格式
  // emailValidatorByJquery(obj):any{
  //   const myreg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
  //   let valid=myreg.test(control.value);
  //   return valid?null:{email:true}
  // }


}
