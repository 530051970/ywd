import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-left',
  templateUrl: './home-left.component.html',
  styleUrls: ['./home-left.component.css']
})
export class HomeLeftComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    jQuery('.menu-list > a').click(function () {


    });

    jQuery('.custom-nav > li').hover(function () {
      jQuery(this).addClass('nav-hover');
      // 如果左边菜单是收缩状态,则划进来的时候sub子菜单显示
      if (jQuery('body').hasClass('left-side-collapsed')) {
        jQuery(this).children('.sub-menu-list').show();
      }
    }, function () {
      jQuery(this).removeClass('nav-hover');
      // 如果左边菜单是收缩状态,则划进来的时候sub子菜单显示
      if (jQuery('body').hasClass('left-side-collapsed')) {
        jQuery(this).children('.sub-menu-list').hide();
      }


    });
  }

  onMenuListClick(obj){
    const parent = jQuery(obj).parent();
    const sub = parent.find('> ul');

    if (!jQuery('body').hasClass('left-side-collapsed')) {
      if (sub.is(':visible')) {
        sub.slideUp(200, function () {
          parent.removeClass('nav-active');
          jQuery('.main-content').css({height: ''});
          var docHeight = jQuery(document).height();
          if (docHeight > jQuery('.main-content').height())
            jQuery('.main-content').height(docHeight);
        });
      } else {
        jQuery('.menu-list').each(function () {
          var t = jQuery(this);
          if (t.hasClass('nav-active')) {
            t.find('> ul').slideUp(200, function () {
              t.removeClass('nav-active');
            });
          }
        });
        parent.addClass('nav-active');
        sub.slideDown(200, function () {
          var docHeight = jQuery(document).height();
          if (docHeight > jQuery('.main-content').height())
            jQuery('.main-content').height(docHeight);
        });
      }
    }
    return false;
  }

  // visibleSubMenuClose() {
  //   jQuery('.menu-list').each(function () {
  //     var t = jQuery(this);
  //     if (t.hasClass('nav-active')) {
  //       t.find('> ul').slideUp(200, function () {
  //         t.removeClass('nav-active');
  //       });
  //     }
  //   });
  // }

  // mainContentHeightAdjust() {
  //   // Adjust main content height
  //   var docHeight = jQuery(document).height();
  //   if (docHeight > jQuery('.main-content').height())
  //     jQuery('.main-content').height(docHeight);
  // }


}
