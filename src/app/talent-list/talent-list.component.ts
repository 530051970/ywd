import { Component, OnInit } from '@angular/core';
import * as Rx from 'rxjs/Rx' 
import {Router} from '@angular/Router';
declare const each: any;
declare const jQuery: any;


@Component({
  selector: 'app-talent-list',
  templateUrl: './talent-list.component.html',
  styleUrls: ['./talent-list.component.css']
})
export class TalentListComponent implements OnInit {

  constructor(private router:Router) { }
  // constructor() { }
 
  ngOnInit() {

    // Cached vars
    let active: any;
    var _iCheck = 'iCheck',
      _iCheckHelper = _iCheck + '-helper',
      _checkbox = 'checkbox',
      _radio = 'radio',
      _checked = 'checked',
      _unchecked = 'un' + _checked,
      _disabled = 'disabled',
      _determinate = 'determinate',
      _indeterminate = 'in' + _determinate,
      _update = 'update',
      _type = 'type',
      _click = 'click',
      _touch = 'touchbegin.i touchend.i',
      _add = 'addClass',
      _remove = 'removeClass',
      _callback = 'trigger',
      _label = 'label',
      _cursor = 'cursor',
      _mobile = /ipad|iphone|ipod|android|blackberry|windows phone|opera mini|silk/i.test(navigator.userAgent);

    // Plugin init
    $.fn[_iCheck] = function (options, fire) {

      // Walker
      var handle = ':' + _checkbox + ', :' + _radio,
        stack = $(),
        walker = function (object) {
          object.each(function () {
            var self = $(this);

            if (self.is(handle)) {
              stack = stack.add(self);
            } else {
              stack = stack.add(self.find(handle));
            };
          });
        };

      // Check if we should operate with some method
      if (/^(check|uncheck|toggle|indeterminate|determinate|disable|enable|update|destroy)$/i.test(options)) {

        // Normalize method's name
        options = options.toLowerCase();

        // Find checkboxes and radio buttons
        walker(this);

        return stack.each(function () {
          if (options == 'destroy') {
            tidy(this, 'ifDestroyed');
          } else {
            operate($(this), true, options);
          };

          // Fire method's callback
          if ($.isFunction(fire)) {
            fire();
          };
        });

        // Customization
      } else if (typeof options == 'object' || !options) {

        // Check if any options were passed
        var settings = $.extend({
          checkedClass: _checked,
          disabledClass: _disabled,
          indeterminateClass: _indeterminate,
          labelHover: true
        }, options),

          selector = settings.handle,
          hoverClass = settings.hoverClass || 'hover',
          focusClass = settings.focusClass || 'focus',
          activeClass = settings.activeClass || 'active',
          labelHover = !!settings.labelHover,
          labelHoverClass = settings.labelHoverClass || 'hover',

          // Setup clickable area
          area = (settings.increaseArea).replace('%', '') | 0;

        // Selector limit
        if (selector == _checkbox || selector == _radio) {
          handle = ':' + selector;
        };

        // Clickable area limit
        if (area < -50) {
          area = -50;
        };

        // Walk around the selector
        walker(this);

        return stack.each(function () {

          // If already customized
          tidy(this, null);

          var self = $(this),
            node = this,
            id = node.id,

            // Layer styles
            offset = -area + '%',
            size = 100 + (area * 2) + '%',
            layer = {
              position: 'absolute',
              top: offset,
              left: offset,
              display: 'block',
              width: size,
              height: size,
              margin: 0,
              padding: 0,
              background: '#fff',
              border: 0,
              opacity: 0
            },

            // Choose how to hide input
            hide = _mobile ? {
              position: 'absolute',
              visibility: 'hidden'
            } : area ? layer : {
              position: 'absolute',
              opacity: 0
            },

            // Get proper class
            className = node[_type] == _checkbox ? settings.checkboxClass || 'i' + _checkbox : settings.radioClass || 'i' + _radio,

            // Find assigned labels
            label = $(_label + '[for="' + id + '"]').add(self.closest(_label)),

            // Wrap input
            parent = self.wrap('<div class="' + className + '"/>')[_callback]('ifCreated').parent().append(settings.insert),

            // Layer addition
            helper = $('<ins class="' + _iCheckHelper + '"/>').css(layer).appendTo(parent);

          // Finalize customization
          self.data(_iCheck, { o: settings, s: self.attr('style') }).css(hide);
          !!settings.inheritClass && parent[_add](node.className);
          !!settings.inheritID && id && parent.attr('id', _iCheck + '-' + id);
          parent.css('position') == 'static' && parent.css('position', 'relative');
          operate(self, true, _update);

          // Label events
          if (label.length) {
            label.on(_click + '.i mouseenter.i mouseleave.i ' + _touch, function (event) {
              var type = event[_type],
                item = $(this);

              // Do nothing if input is disabled
              if (!node[_disabled]) {

                // Click
                if (type == _click) {
                  operate(self, false, true);

                  // Hover state
                } else if (labelHover) {

                  // mouseleave|touchend
                  if (/ve|nd/.test(type)) {
                    parent[_remove](hoverClass);
                    item[_remove](labelHoverClass);
                  } else {
                    parent[_add](hoverClass);
                    item[_add](labelHoverClass);
                  };
                };

                if (_mobile) {
                  event.stopPropagation();
                } else {
                  return false;
                };
              };
            });
          };

          // Input events
          self.on(_click + '.i focus.i blur.i keyup.i keydown.i keypress.i', function (event) {
            var type = event[_type],
              key = event.keyCode;

            // Click
            if (type == _click) {
              return false;

              // Keydown
            } else if (type == 'keydown' && key == 32) {
              if (!(node[_type] == _radio && node[_checked])) {
                if (node[_checked]) {
                  off(self, _checked, null);
                } else {
                  on(self, _checked, null);
                };
              };

              return false;

              // Keyup
            } else if (type == 'keyup' && node[_type] == _radio) {
              !node[_checked] && on(self, _checked, null);

              // Focus/blur
            } else if (/us|ur/.test(type)) {
              parent[type == 'blur' ? _remove : _add](focusClass);
            };
          });

          // Helper events
          helper.on(_click + ' mousedown mouseup mouseover mouseout ' + _touch, function (event) {
            var type = event[_type],

              // mousedown|mouseup
              toggle = /wn|up/.test(type) ? activeClass : hoverClass;

            // Do nothing if input is disabled
            if (!node[_disabled]) {

              // Click
              if (type == _click) {
                operate(self, false, true);

                // Active and hover states
              } else {

                // State is on
                if (/wn|er|in/.test(type)) {

                  // mousedown|mouseover|touchbegin
                  parent[_add](toggle);

                  // State is off
                } else {
                  parent[_remove](toggle + ' ' + activeClass);
                };

                // Label hover
                if (label.length && labelHover && toggle == hoverClass) {

                  // mouseout|touchend
                  label[/ut|nd/.test(type) ? _remove : _add](labelHoverClass);
                };
              };

              if (_mobile) {
                event.stopPropagation();
              } else {
                return false;
              };
            };
          });
        });
      } else {
        return this;
      };

    };

    // Rx.Observable.fromEvent(jQuery("#employerName")[0],"mouseover").debounceTime(300).subscribe(()=>{
    //   // alert("12345");
    //   jQuery("#employerprofile").stop().animate({"width":"900px"});
    // });



    Rx.Observable.fromEvent(jQuery("#employer1")[0],"mouseout").subscribe(()=>{
      // alert("safdas");
      jQuery("#employerprofile").css({"width":"0px"});
    });

    // Do something with inputs
    function operate(input, direct, method) {
      var node = input[0];
      state = /er/.test(method) ? _indeterminate : /bl/.test(method) ? _disabled : _checked,
        active = method == _update ? {
          checked: node[_checked],
          disabled: node[_disabled],
          indeterminate: input.attr(_indeterminate) == 'true' || input.attr(_determinate) == 'false'
        } : node[state];

      // Check, disable or indeterminate
      if (/^(ch|di|in)/.test(method) && !active) {
        on(input, state, null);

        // Uncheck, enable or determinate
      } else if (/^(un|en|de)/.test(method) && active) {
        off(input, state, null);

        // Update
      } else if (method == _update) {

        // Handle states
        for (var state in active) {
          if (active[state]) {
            on(input, state, true);
          } else {
            off(input, state, true);
          };
        };

      } else if (!direct || method == 'toggle') {

        // Helper or label was clicked
        if (!direct) {
          input[_callback]('ifClicked');
        };

        // Toggle checked state
        if (active) {
          if (node[_type] !== _radio) {
            off(input, state, null);
          };
        } else {
          on(input, state, null);
        };
      };
    };

    // Add checked, disabled or indeterminate state
    function on(input, state, keep) {
      var node = input[0],
        parent = input.parent(),
        checked = state == _checked,
        indeterminate = state == _indeterminate,
        callback = indeterminate ? _determinate : checked ? _unchecked : 'enabled',
        regular = option(node, callback + capitalize(node[_type]), null),
        specific = option(node, state + capitalize(node[_type]), null);

      // Prevent unnecessary actions
      if (node[state] !== true) {

        // Toggle assigned radio buttons
        if (!keep && state == _checked && node[_type] == _radio && node.name) {
          var form = input.closest('form'),
            inputs = 'input[name="' + node.name + '"]';

          inputs = form.length ? form.find(inputs) : $(inputs);

          // inputs.each(function() {
          //   if (this !== node && $.data(this, _iCheck)) {
          //     off($(this), state,null);
          //   };
          // });
        };

        // Indeterminate state
        if (indeterminate) {

          // Add indeterminate state
          node[state] = true;

          // Remove checked state
          if (node[_checked]) {
            off(input, _checked, 'force');
          };

          // Checked or disabled state
        } else {

          // Add checked or disabled state
          if (!keep) {
            node[state] = true;
          };

          // Remove indeterminate state
          if (checked && node[_indeterminate]) {
            off(input, _indeterminate, false);
          };
        };

        // Trigger callbacks
        callbacks(input, checked, state, keep);
      };

      // Add proper cursor
      if (node[_disabled] && !!option(node, _cursor, true)) {
        parent.find('.' + _iCheckHelper).css(_cursor, 'default');
      };

      // Add state class
      parent[_add](specific || option(node, state, null));

      // Remove regular state class
      parent[_remove](regular || option(node, callback, null) || '');
    };

    // Remove checked, disabled or indeterminate state
    function off(input, state, keep) {
      var node = input[0],
        parent = input.parent(),
        checked = state == _checked,
        indeterminate = state == _indeterminate,
        callback = indeterminate ? _determinate : checked ? _unchecked : 'enabled',
        regular = option(node, callback + capitalize(node[_type]), null),
        specific = option(node, state + capitalize(node[_type]), null);

      // Prevent unnecessary actions
      if (node[state] !== false) {

        // Toggle state
        if (indeterminate || !keep || keep == 'force') {
          node[state] = false;
        };

        // Trigger callbacks
        callbacks(input, checked, callback, keep);
      };

      // Add proper cursor
      if (!node[_disabled] && !!option(node, _cursor, true)) {
        parent.find('.' + _iCheckHelper).css(_cursor, 'pointer');
      };

      // Remove state class
      parent[_remove](specific || option(node, state, null) || '');

      // Add regular state class
      parent[_add](regular || option(node, callback, null));
    };

    // Remove all traces
    function tidy(node, callback) {
      if ($.data(node, _iCheck)) {
        var input = $(node);

        // Remove everything except input
        input.parent().html(input.attr('style', $.data(node, _iCheck).s || '')[_callback](callback || ''));

        // Unbind events
        input.off('.i').unwrap();
        $(_label + '[for="' + node.id + '"]').add(input.closest(_label)).off('.i');
      };
    };

    // Get some option
    function option(node, state, regular) {
      if ($.data(node, _iCheck)) {
        return $.data(node, _iCheck).o[state + (regular ? '' : 'Class')];
      };
    };

    // Capitalize some string
    function capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Executable handlers
    function callbacks(input, checked, callback, keep) {
      if (!keep) {
        if (checked) {
          input[_callback]('ifToggled');
        };

        input[_callback]('ifChanged')[_callback]('if' + capitalize(callback));
      };
    };
  }

  onMouseOverKeyword(obj){
      jQuery(obj).show();
      // jQuery(obj).stop().animate({"width":"100px"});
  }

  onMouseOutKeyword(obj){
    jQuery(obj).hide();
}

onClickKeya(obj){
  jQuery(obj).hide();
  //TODO:后端处理
}


  onclickGroup(obj1,obj2){
    // jQuery(obj).hide();
    if(jQuery(obj1).is(':visible')){
    jQuery(obj1).hide()
    jQuery(obj2).show()
  } else{
    jQuery(obj1).show()
    jQuery(obj2).hide()
  }
  }

  onClickSexRadio(obj){
    if(obj=='1'){
     jQuery("#all").show();
     jQuery("#man").add("#woman").hide();
    }else if(obj=='2'){
      jQuery("#man").show();
      jQuery("#all").add("#woman").hide();
     }else{
      jQuery("#woman").show();
      jQuery("#all").add("#man").hide();
     }

  }

 onMouseOverGroup(obj1,obj2){
    jQuery(obj1).show();
    jQuery(obj2).css({"background-color":"#075090"});
  }

  onMouseOutGroup(obj1,obj2){
    jQuery(obj1).hide();
    jQuery(obj2).css({"background-color":"#666"});
  }

  onclickChange(event: Event, obj1: Object,obj2: Object){
    event.stopPropagation();
    jQuery(obj1).hide();
    jQuery(obj2).show();
    jQuery(event.target).hide();
  }

  onClickInput(event: Event){
    event.stopPropagation();
  }

  obBlurInput(){
    // alert("blur");
  }

  // 滑上手机号码
  onMouseOverPhone(obj){
    jQuery(obj).stop().animate({"width":"100px"},300);
  }
  onMouseOutPhone(obj){
    jQuery(obj).stop().animate({"width":"0px"});
  }

  // 滑上QQ号码
  onMouseOverQQ(obj){
    jQuery(obj).stop().animate({"width":"100px"},300);
  }
  onMouseOutQQ(obj){
    jQuery(obj).stop().animate({"width":"0px"});
  }

   // 滑上微信号码
   onMouseOverWechat(obj){
    jQuery(obj).stop().animate({"width":"100px"},300);
  }
  onMouseOutWechat(obj){
    jQuery(obj).stop().animate({"width":"0px"});
  }

   // 滑上Email
   onMouseOverEmail(obj){
    jQuery(obj).stop().animate({"width":"140px"},300);
  }
  onMouseOutEmail(obj){
    jQuery(obj).stop().animate({"width":"0px"});
  }

  // 划过check
  onMouseOverCheck(obj){
    jQuery(obj).css({"border-color":"#075090","cursor":"pointer"});
  }

  onMouseOutCheck(obj){
    jQuery(obj).css({"border-color":"rgb(204, 204, 204)"});
  }
  //列表的checkbox
  onClickCheck(obj){
    jQuery(obj).toggleClass("checkbox-checked");
    //TODO:其他后续处理
  }

  onOpenResume(){
    jQuery("#employerprofile").stop().animate({"width":"0px"});
    this.router.navigate(["home/resume"]);

  }

  showMinisizeTime(){
    if(jQuery("#timeline").height()==0){
    jQuery("#timeline").stop().animate({"height":"24%"});}else {
      jQuery("#timeline").stop().animate({"height":"0"});
    }
  }

  // 生成QRcode
  onMakeQRcode(o){
    const target=jQuery(o);
    var options = {
      render: "canvas",
      ecLevel: 'H',//识别度
      fill: '#f00',//二维码颜色
      background: '#ffffff',//背景颜色
      quiet: 10,//边距
      width: 100,//宽度
      height: 100,
      text: "http://www.baidu.com",//二维码内容
      //中间logo start
      mode: 4,
      mSize: 11 * 0.01,
      mPosX: 50 * 0.01,
      mPosY: 50 * 0.01,
      // image:$('#img-buffer')[0],
      src:"../../assets/img/photos/user1.png",
      //logo图片
      //中间logo end
      label: 'jQuery.qrcode',
      fontname: 'Ubuntu',
      fontcolor: '#ff9818',
  };
    if(target.children().length==0){
      target.qrcode(options);
      target.slideUp();
  }
  target.slideToggle();
  }

  // 打开预览简历
  onOpenPreview(o1,o2){
    jQuery("#employerprofile").stop().animate({"width":"900px"});
    jQuery(o1).hide();
    jQuery(o2).show();
  }

  // 关闭预览简历
  onClosePreview(o1,o2){
    jQuery("#employerprofile").stop().animate({"width":"0px"});
    jQuery(o1).show();
    jQuery(o2).hide();
  }

  // 鼠标划入的时候显示关注图标和预览图标
  onMouseOverName(o1,o2){
    jQuery(o1).add(o2).show();
  }

  // 鼠标划出的时候隐藏关注图标和预览图标
  onMouseOutName(o1,o2){
    jQuery(o1).add(o2).hide();
  }
}
