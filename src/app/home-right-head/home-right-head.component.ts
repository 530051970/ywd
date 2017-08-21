import { Component, OnInit } from '@angular/core';
import * as jQuery from 'jquery';
import {CommonService} from "../service/common.service";
import * as Rx from "rxjs";


@Component({
  selector: 'app-home-right-head',
  templateUrl: './home-right-head.component.html',
  styleUrls: ['./home-right-head.component.css']
})
export class HomeRightHeadComponent implements OnInit {

 showDate:Date;
 private timer;

  constructor(private commonService:CommonService) { }

  ngOnInit() {
    this.commonService.showDate();
    // let timer = Observable.timer('some time', 2000);
    // timer.subscribe(t => this.theValue += 1);
    // alert('2q321');
    Rx.Observable.interval(1000).map(()=>{ return new Date()}).subscribe(
      t => {this.showDate = t;}
    );
   

    
  }
  ngOnChanges(){
   
  }

  ngAfterContentInit() {
     setInterval(this.commonService.showTime(),1000);
  }

  // 点击三明治切换按钮
  onClickToggleBtn(){
    const body = jQuery('body');
    const bodyposition = body.css('position');

    const mainContent = jQuery('.main-content');
    const stickyLeftSide = jQuery('.sticky-left-side');
    const logo = jQuery('.logo');
    const logoIcon = jQuery('.text-center');

    if (bodyposition !== 'relative') {

      if (!body.hasClass('left-side-collapsed')) {
        body.addClass('left-side-collapsed');


        mainContent.attr('style', 'margin-left:52px');
        stickyLeftSide.attr('style', 'width:52px');
        logo.hide();
        logoIcon.removeClass('logo-icon');
        logoIcon.show();
        jQuery('.text-center').attr('style','height:48px')
        // 对于每一个一级菜单，如果是选中状态，收缩的时候不显示子菜单。
        jQuery.each(jQuery('.menu-list'), function (i, item) {
          if (jQuery(item).hasClass('nav-active')) {
            jQuery(item).children('.sub-menu-list').hide();
          }
        })

        jQuery(this).addClass('menu-collapsed');

      } else {

        mainContent.attr('style', 'margin-left:240px');
        stickyLeftSide.attr('style', 'width:240px');
        logoIcon.addClass('logo-icon');
        logo.show();
        logoIcon.hide();
        // 对于每一个一级菜单，如果是选中状态，放开的时候显示子菜单。
        jQuery.each(jQuery('.menu-list'), function (i, item) {
          if (jQuery(item).hasClass('nav-active')) {
            jQuery(item).children('.sub-menu-list').show();
          }
        })

        body.removeClass('left-side-collapsed');
        jQuery('.custom-nav li.active ul').css({display: 'block'});

        jQuery(this).removeClass('menu-collapsed');

      }
    } else {

      if (body.hasClass('left-side-show'))
        body.removeClass('left-side-show');
      else
        body.addClass('left-side-show');

      // mainContentHeightAdjust();
    }

  }
 
  // 点击播放与停止按钮，控制ul的跳动
  onClickPlayer(obj,play,stop){
    let playEle =jQuery(play);
    let stopEle =jQuery(stop);
    if (playEle.is(':visible')) {
    jQuery(play).hide();
    jQuery(stop).show();
    // ul开始滚动
    this.timer = setInterval(() => {
      let n=$(obj).find("li").height();
      $(obj).animate({
             marginTop:-n
  },500,function(){
       $(this).css({marginTop:"0px"}).find("li:first").appendTo(this);
  })
    },3000)

  //   $(obj).find("li").hover(function(){
  //     $("#mark-info").show();
  // },function(){
  //     $("#mark-info").hide();
  // })
   } else {
    jQuery(play).show();
    jQuery(stop).hide();
    // ul停止滚动
    if(this.timer){
      clearInterval(this.timer);
      }
  }
}

// 点击ul里面的li标题，弹出窗口
onClickTitle(){
  jQuery('.remodal-overlay').add('.remodal-wrapper').add('#modal').show();
  // jQuery('.remodal-overlay').show();
  document.body.style.overflow='hidden';
  document.body.style.height='100%';
  document.documentElement.style.overflow='hidden'
  return false;
}

onClickLay(){
  jQuery('.remodal-overlay').add('.remodal-wrapper').add('#modal').hide();
  document.body.style.overflow='auto';
  document.body.style.height='100%';
  document.documentElement.style.overflow='auto'
  // return false;
}

onHoverTitle(){
  alert('LLL');
}
}

