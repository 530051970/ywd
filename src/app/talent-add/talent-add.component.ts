import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
declare const laydate: any;
declare const SelCity: any;

@Component({
  selector: 'app-talent-add',
  templateUrl: './talent-add.component.html',
  styleUrls: ['./talent-add.component.css']
})
export class TalentAddComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
    jQuery("#city").click(function (e) {
      SelCity(jQuery("#cParent")[0], jQuery("#city")[0], e);
    });
    jQuery("#descity").click(function (e) {
      SelCity(jQuery("#descParent")[0], jQuery("#descity")[0], e);
    });
    jQuery("#birthday").click(function (e) {
      laydate.render({
        elem: '#birthday'
        , mark: {
          '0-10-14': '生日'
          , '0-12-31': '跨年' //每年的日期
          , '0-0-10': '工资' //每月某天
          , '0-0-15': '月中'
          , '2017-8-15': '' //如果为空字符，则默认显示数字+徽章
          , '2099-10-14': '呵呵'
        },
        theme: "#56b4f8",
        left:15
      });
    });
    jQuery("#edu-start").click(function (e) {
laydate.render({
  elem: '#edu-start'
  ,type: 'month'
  ,theme: "#56b4f8"
  ,left:7
});
    });
    jQuery("#edu-end").click(function (e) {
      laydate.render({
        elem: '#edu-end'
        ,type: 'month'
        ,theme: "#56b4f8"
        ,left:9
      });
    });
  }

  onChangePhoto(obj1, obj2) {
    jQuery(obj1).hide();
    jQuery(obj2).show();
    jQuery(obj2).css("cursor", "pointer");

  }

  onResetPhoto(obj1, obj2) {
    jQuery(obj1).show();
    jQuery(obj2).hide();

  }

  onUploadPhoto() {
    jQuery('.remodal-overlay').add('.remodal-wrapper').add('#uploadPho').show();
    jQuery("#modal").hide();
  }

  onSelectDegree(o1, o2) {
    jQuery(o1).toggleClass("fa-caret-down").toggleClass("fa-caret-up");
    jQuery(o2).slideToggle();
  }

  onSelectDegreeItem(o1, o2, o3, e) {
    jQuery(o1).toggleClass("fa-caret-down").toggleClass("fa-caret-up");
    jQuery(o2).slideToggle();
    jQuery(o3).html(e.target.innerText);
  }

  // onMouseoverTem(e){
  //   e.style.backgroundColor= "gray"; 
  // }

  onSelectJob() {
    jQuery('.remodal-overlay').add('.remodal-wrapper').add('#selectJob').show();
    jQuery("#modal").hide();
  }

  // 锚点控制
  toAncher(ancher, obj1, obj2, obj3, obj4, obj5) {
    const mainArea = $("#mainArea");
    if (!$(obj1).hasClass("selected")) {
      $(obj1).addClass("selected");
    }
    $(obj2).add(obj3).add(obj4).add(obj5).each(function () {
      if ($(this).hasClass("selected")) {
        $(this).removeClass("selected");
      }
    });
    mainArea.animate({
      scrollTop: $(ancher).offset().top - mainArea.offset().top + mainArea.scrollTop()
    }, 100);
  }

  // 监听手工入力右侧div的滚动
  onScroll(obj1, obj2, obj3, obj4, obj5, obj6, obj7, obj8, obj9, obj10) {
    // alert($(obj1).height+"    "+$(obj5).height);
    const mainArea = $("#mainArea");
    $(obj6).add(obj7).add(obj8).add(obj9).add(obj10).each(function () {
      if ($(this).hasClass("selected")) {
        $(this).removeClass("selected");
      }
    });
    if (mainArea.scrollTop() > 50) {
      $(obj7).addClass("selected");
      if (mainArea.scrollTop() > $(obj1).height() + 50) {
        $(obj7).removeClass("selected");
        $(obj8).addClass("selected");
        if (mainArea.scrollTop() > $(obj1).height() + $(obj2).height() + 50) {
          $(obj8).removeClass("selected");
          $(obj9).addClass("selected");
          if (mainArea.scrollTop() > $(obj1).height() + $(obj2).height() + $(obj3).height() + 50) {
            $(obj9).removeClass("selected");
            $(obj10).addClass("selected");
          }
        }
      }
    } else {
      $(obj6).addClass("selected");
    }
  }
}
