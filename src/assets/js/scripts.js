// (function() {
$(function () {


  // "use strict";

  // 定制滚动条

  // $("html").niceScroll({
  //   styler: "fb",
  //   cursorcolor: "#65cea7",
  //   cursorwidth: '6',
  //   cursorborderradius: '0px',
  //   background: '#424f63',
  //   spacebarenabled: false,
  //   cursorborder: '0',
  //   zindex: '1000'
  // });
  // //
  // $(".left-side").niceScroll({
  //   styler: "fb",
  //   cursorcolor: "#65cea7",
  //   cursorwidth: '3',
  //   cursorborderradius: '0px',
  //   background: '#424f63',
  //   spacebarenabled: false,
  //   cursorborder: '0'
  // });
  // //
  // $('body').niceScroll({
  //   styler: "fb",
  //   cursorcolor: "#65cea7",
  //   cursorwidth: '3',
  //   cursorborderradius: '0px',
  //   background: '#424f63',
  //   spacebarenabled: false,
  //   cursorborder: '0'
  // });
  //
  // $('.sticky-left-side').add('.left-side-inner').niceScroll({
  //   styler: "fb",
  //   cursorcolor: "#65cea7",
  //   cursorwidth: '3',
  //   cursorborderradius: '0px',
  //   background: '#424f63',
  //   spacebarenabled: false,
  //   cursorborder: '0'
  // });

  $(".left-side").getNiceScroll();
  if ($('body').hasClass('left-side-collapsed')) {
    // if ($('#leftDiv').hasClass('left-side-collapsed')) {
    $(".left-side").getNiceScroll().hide();
  }

  // Toggle Left Menu


  // jQuery('.menu-list > a').click(function () {

  //   var parent = jQuery(this).parent();
  //   var sub = parent.find('> ul');

  //   if (!jQuery('body').hasClass('left-side-collapsed')) {
  //     if (sub.is(':visible')) {
  //       sub.slideUp(200, function () {
  //         parent.removeClass('nav-active');
  //         jQuery('.main-content').css({height: ''});
  //         mainContentHeightAdjust();
  //       });
  //     } else {
  //       visibleSubMenuClose();
  //       parent.addClass('nav-active');
  //       sub.slideDown(200, function () {
  //         mainContentHeightAdjust();
  //       });
  //     }
  //   }
  //   return false;
  // });

  // function visibleSubMenuClose() {
  //   jQuery('.menu-list').each(function () {
  //     var t = jQuery(this);
  //     if (t.hasClass('nav-active')) {
  //       t.find('> ul').slideUp(200, function () {
  //         t.removeClass('nav-active');
  //       });
  //     }
  //   });
  // }

  // function mainContentHeightAdjust() {
  //   // Adjust main content height
  //   var docHeight = jQuery(document).height();
  //   if (docHeight > jQuery('.main-content').height())
  //     jQuery('.main-content').height(docHeight);
  // }

  // //  class add mouse hover
  // jQuery('.custom-nav > li').hover(function () {
  //   // alert("OOK");
  //   jQuery(this).addClass('nav-hover');
  //   // 如果左边菜单是收缩状态,则划进来的时候sub子菜单显示
  //   if (jQuery('body').hasClass('left-side-collapsed')) {
  //     jQuery(this).children('.sub-menu-list').show();
  //   }


  //   // jQuery(this).children('.sub-menu-list').show();
  // }, function () {
  //   jQuery(this).removeClass('nav-hover');
  //   // 如果左边菜单是收缩状态,则划进来的时候sub子菜单显示
  //   if (jQuery('body').hasClass('left-side-collapsed')) {
  //     jQuery(this).children('.sub-menu-list').hide();
  //   }


  // });


  // Menu Toggle
  // jQuery('.toggle-btn').click(function () {
  //   $(".left-side").getNiceScroll().hide();
  //   if ($('body').hasClass('left-side-collapsed')) {
  //     $(".left-side").getNiceScroll().hide();
  //   }
  //   var body = jQuery('body');
  //   var bodyposition = body.css('position');
  //
  //   var mainContent = jQuery('.main-content');
  //   var stickyLeftSide = jQuery('.sticky-left-side');
  //   var logo = jQuery('.logo');
  //   var logoIcon = jQuery('.text-center');
  //
  //   if (bodyposition != 'relative') {
  //
  //     if (!body.hasClass('left-side-collapsed')) {
  //       body.addClass('left-side-collapsed');
  //
  //
  //       mainContent.attr('style', 'margin-left:52px');
  //       stickyLeftSide.attr('style', 'width:52px');
  //       logo.hide();
  //       logoIcon.removeClass('logo-icon');
  //       logoIcon.show();
  //       jQuery('.text-center').attr('style','height:48px')
  //       // 对于每一个一级菜单，如果是选中状态，收缩的时候不显示子菜单。
  //       jQuery.each(jQuery('.menu-list'), function (i, item) {
  //         if (jQuery(item).hasClass('nav-active')) {
  //           jQuery(item).children('.sub-menu-list').hide();
  //         }
  //       })
  //
  //       jQuery(this).addClass('menu-collapsed');
  //
  //     } else {
  //
  //       mainContent.attr('style', 'margin-left:240px');
  //       stickyLeftSide.attr('style', 'width:240px');
  //       logoIcon.addClass('logo-icon');
  //       logo.show();
  //       logoIcon.hide();
  //       // 对于每一个一级菜单，如果是选中状态，放开的时候显示子菜单。
  //       jQuery.each(jQuery('.menu-list'), function (i, item) {
  //         if (jQuery(item).hasClass('nav-active')) {
  //           jQuery(item).children('.sub-menu-list').show();
  //         }
  //       })
  //
  //       body.removeClass('left-side-collapsed');
  //       jQuery('.custom-nav li.active ul').css({display: 'block'});
  //
  //       jQuery(this).removeClass('menu-collapsed');
  //
  //     }
  //   } else {
  //
  //     if (body.hasClass('left-side-show'))
  //       body.removeClass('left-side-show');
  //     else
  //       body.addClass('left-side-show');
  //
  //     mainContentHeightAdjust();
  //   }
  //
  // });


  searchform_reposition();

  jQuery(window).resize(function () {

    if (jQuery('body').css('position') == 'relative') {
      jQuery('body').removeClass('left-side-collapsed');
    } else {
      jQuery('body').css({left: '', marginRight: ''});
    }
    searchform_reposition();
  });

  function searchform_reposition() {
    if (jQuery('.searchform').css('position') == 'relative') {
      jQuery('.searchform').insertBefore('.left-side-inner .logged-user');
    } else {
      jQuery('.searchform').insertBefore('.menu-right');
    }
  }

  $('.panel .tools .fa').click(function () {
    var el = $(this).parents(".panel").children(".panel-body");
    if ($(this).hasClass("fa-chevron-down")) {
      $(this).removeClass("fa-chevron-down").addClass("fa-chevron-up");
      el.slideUp(200);
    } else {
      $(this).removeClass("fa-chevron-up").addClass("fa-chevron-down");
      el.slideDown(200);
    }
  });

  $('.todo-check label').click(function () {
    $(this).parents('li').children('.todo-title').toggleClass('line-through');
  });

  $(document).on('click', '.todo-remove', function () {
    $(this).closest("li").remove();
    return false;
  });

  $("#sortable-todo").sortable();


  // panel close
  $('.panel .tools .fa-times').click(function () {
    $(this).parents(".panel").parent().remove();
  });


  // tool tips

  $('.tooltips').tooltip();

  // popovers

  $('.popovers').popover();

  //DIGITAL CLOCK
  // head.js("../assets/js/clock/jquery.clock.js", function() {

    //clock
    $('#digital-clock').clock({
      offset: '+5',
      type: 'digital'
    });

  // var monthNames = ["January", "February", "March", "April", "May", "June",
  //   "July", "August", "September", "October", "November", "December"
  // ];
  // var dayNames = ["Sun, ", "Mon, ", "Tue, ", "Wed, ", "Thu, ", "Fri, ", "Sat, "]
  //
  // var newDate = new Date();
  // newDate.setDate(newDate.getDate() + 1);
  // $('#Date').html(dayNames[newDate.getDay()] + " " + newDate.getDate() + ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear());

  // Home页面头部实现消息上下滚动
  function autoScroll(obj) {
    var n = jQuery(obj).find("li").height();
    jQuery(obj).find("ul").animate({
      marginTop: -n
    }, 500, function () {
      $(this).css({marginTop: "0px"}).find("li:first").appendTo(this);
    })
  }


});

