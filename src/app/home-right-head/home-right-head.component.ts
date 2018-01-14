import { Component, OnInit } from '@angular/core';
import * as jQuery from 'jquery';
import { CommonService } from "../service/common.service";
import * as Rx from "rxjs";
import {
  FormBuilder, FormGroup, FormControl, Validators, AsyncValidatorFn, AbstractControl,
  ValidationErrors
} from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { MockService } from '../service/mock.service';
import { exitFullScreen } from '../utils/common.utils';

@Component({
  selector: 'app-home-right-head',
  templateUrl: './home-right-head.component.html',
  styleUrls: ['./home-right-head.component.css']
})
export class HomeRightHeadComponent implements OnInit {

  showDate: Date;
  private timer;
  private LangDivStatus: string;
  validationTimeout: any;
  validPassword: boolean = false;
  dialogStatus: String = "0";

  constructor(private commonService: CommonService, private mockService$: MockService) {

  }

  ngOnInit() {
    // 当前语言的设置
    let currentLang: string = this.commonService.getCurrentLang();
    if (currentLang == 'zh') {
      jQuery('#langLink').text("中文");
    } else if (currentLang == 'jp') {
      jQuery('#langLink').text("日本語");
    } else {
      jQuery('#langLink').text("English");
    }
    // 日期的设置
    this.commonService.showDate(currentLang);
    // 时间的设置
    Rx.Observable.interval(1000).map(() => { return new Date() }).subscribe(
      t => { this.showDate = t; console.log( this.showDate)}
    );
  }

  // 点击三明治切换按钮
  onClickToggleBtn() {
    const body = jQuery('body');
    const rightHeader = jQuery('#header');
    const bodyposition = body.css('position');
    const mainContent = jQuery('.main-content');
    const stickyLeftSide = jQuery('.sticky-left-side');
    const logo = jQuery('.logo');
    const logoIcon = jQuery('.logo-icon.text-center.homeleft');
    if (bodyposition !== 'relative') {
      if (!body.hasClass('left-side-collapsed')) {

        this.commonService.toggleButton.emit("close");
        body.addClass('left-side-collapsed');
        // mainContent.attr('style', 'margin-left:52px');
        // mainContent.attr('style', 'width:97%;float:left');
        stickyLeftSide.attr('style', 'width:3%;float:left;position:fixed;z-index:999');
        rightHeader.attr('style', 'width:97%;  left: 3%;position:fixed;');
        mainContent.attr('style', 'width:97%;margin-top:51px;height:100%');
        logo.hide();
        logoIcon.removeClass('logo-icon');
        logoIcon.show();
        jQuery('.text-center.homeleft').attr('style', 'height:48px')
        // 对于每一个一级菜单，如果是选中状态，收缩的时候不显示子菜单。
        jQuery.each(jQuery('.menu-list'), function (i, item) {
          if (jQuery(item).hasClass('nav-active')) {
            jQuery(item).children('.sub-menu-list').hide();
          }
        })
        jQuery(this).addClass('menu-collapsed');
      } else {
        this.commonService.toggleButton.emit("open");
        const logoIcon =jQuery('.text-center.homeleft');
        logoIcon.addClass('logo-icon');
        stickyLeftSide.attr('style', 'width:14%;float:left;position:fixed;z-index:999');
        rightHeader.attr('style', 'width:86%;left:14%;position:fixed;');
        mainContent.attr('style', 'width:86%;margin-top:51px;margin-left: 14%;height:100%');
        logo.show();
        logoIcon.hide();
        // 对于每一个一级菜单，如果是选中状态，放开的时候显示子菜单。
        jQuery.each(jQuery('.menu-list'), function (i, item) {
          if (jQuery(item).hasClass('nav-active')) {
            jQuery(item).children('.sub-menu-list').show();
          }
        })
        body.removeClass('left-side-collapsed');
        jQuery('.custom-nav li.active ul').css({ display: 'block' });
        jQuery(this).removeClass('menu-collapsed');

      }
    } else {
      if (body.hasClass('left-side-show'))
        body.removeClass('left-side-show');
      else
        body.addClass('left-side-show');
    }


  }

  // 点击播放与停止按钮，控制ul的跳动
  onClickPlayer(obj, play, stop) {
    let playEle = jQuery(play);
    let stopEle = jQuery(stop);
    if (playEle.is(':visible')) {
      jQuery(play).hide();
      jQuery(stop).show();
      // ul开始滚动
      this.timer = setInterval(() => {
        let n = $(obj).find("li").height();
        $(obj).animate({
          marginTop: -n
        }, 500, function () {
          $(this).css({ marginTop: "0px" }).find("li:first").appendTo(this);
          // $(this).css({ marginTop: "0px" }).find("li:second").attr('style','display:none');
        })
      }, 3000)
    } else {
      jQuery(play).show();
      jQuery(stop).hide();
      // ul停止滚动
      if (this.timer) {
        clearInterval(this.timer);
      }
    }
  }

  // 点击ul里面的li标题，弹出窗口
  onClickTitle() {
    jQuery('.remodal-overlay').add('.remodal-wrapper').add('#modal').show();
    jQuery('#uploadPho').hide();
    document.body.style.height = '100%';
    return false;
  }

  onClickLay() {
    jQuery('.remodal-overlay').add('.remodal-wrapper').add('#modal').hide();
    document.body.style.height = '100%';
  }
  // 显示语言切换窗口
  onClickLang() {
    jQuery('.div-body').slideToggle();
  }

  onChangeLang(obj) {
    this.commonService.onChangeLang(obj);
    if (obj == 'chinese') {
      jQuery('#langLink').text("中文");
      this.commonService.showDate("zh");
    } else if (obj == 'japanese') {
      jQuery('#langLink').text("日本語");
      this.commonService.showDate("jp");
    } else {
      jQuery('#langLink').text("English");
      this.commonService.showDate("en");
    }

    jQuery('.div-body').slideToggle();
  }

  onClickLock(obj) {
    jQuery(".lock-screen").add("#sky-lock").add("#cloud-lock").show();
    obj.value = "";
  }

  onConfirmPass(obj) {
    this.mockService$.getUsers("admin@eworlder.com").subscribe(res => {
      if (obj.value === res[0].password) {
        this.validPassword = true;
        if (this.validPassword) {
          jQuery(".lock-screen").add("#sky-lock").add("#cloud-lock").hide();
        }
      } else {
        this.commonService.showTip(jQuery('#tip1'), 'danger');
      }
    });

  }

  onClickExpend(obj) {

    if (jQuery(obj).attr('class') == "fa fa-expand") {
      jQuery(obj).attr('class', "fa fa-compress");
      this.commonService.fullScreen.emit("1");
    } else {
      this.commonService.fullScreen.emit("0");
      jQuery(obj).attr('class', "fa fa-expand");
      exitFullScreen(document);
    }
  }

  onClickSearch(obj) {

  }

  onMoveinSearch(obj) {
    jQuery(obj).stop().animate({ "width": "160px" });
  }

  onMoveOutSearch(obj) {
    if (obj.value == null || obj.value == "") {
      jQuery(obj).stop().animate({ "width": "0px" });
    } else {
      jQuery(obj).css({ "border-width": "0 0 1px 0", "border-bottom-color": "gray" }
      );
    }
  }

  onClickDialog() {
    const tar = jQuery("#diaglog");
    if (tar.width() <= 0) {
      jQuery("#diaglog").stop().animate({ "width": "320px" });
    } else {
      jQuery("#diaglog").stop().animate({ "width": "0px" });
    }
  }
 // 点击选择图片按钮时，防止事件冒泡 
  onClickUpload(event){
    event.stopPropagation();
  }
}

