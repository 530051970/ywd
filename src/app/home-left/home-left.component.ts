import { Component, OnInit } from '@angular/core';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-home-left',
  templateUrl: './home-left.component.html',
  styleUrls: ['./home-left.component.css']
})
export class HomeLeftComponent implements OnInit {

  private toggleButton: string;
  constructor(private commonService: CommonService) { }

  ngOnInit() {
    jQuery('.menu-list > a').click(function () { });

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

  ngAfterViewInit() {

    this.commonService.toggleButton.subscribe(
      res => {
      this.toggleButton = res;

        if (this.toggleButton == "open") {
          jQuery("#leftDiv").css({"width":"14%","float":"left"});

          // jQuery("#middlerow").css("height", "47%");
          // jQuery(".adv-table").css("height", "350px");
        } else {
          // alert("1");
          jQuery("#leftDiv").css({"width":"3%","float":"left","display":"block"});
          // jQuery("#middlerow").css("height", "53%"); 
          // jQuery(".adv-table").css("height", "250px");     
        }
        // jQuery("#leftDiv").css("float", "left");
      }
    );
  }

  onMenuListClick(obj) {
    const parent = jQuery(obj).parent();
    const sub = parent.find('> ul');

    if (!jQuery('body').hasClass('left-side-collapsed')) {
      if (sub.is(':visible')) {
        sub.slideUp(200, function () {
          parent.removeClass('nav-active');
          jQuery('.main-content').css({ height: '' });
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


}
