(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var buildDom = require('./build-dom');
var draggable = require('./draggable');

var configMap = {
  'n':  { top: true, height: -1 },
  'w':  { left: true, width: -1 },
  'e':  { width: 1 },
  's':  { height: 1 },
  'nw': { left: true, top: true, width: -1, height: -1 },
  'ne': { top: true, width: 1, height: -1 },
  'sw': { left: true, width: -1, height: 1 },
  'se': { width: 1, height: 1 }
};

var getPosition = function (element) {
  var selfRect = element.getBoundingClientRect();
  var parentRect = element.offsetParent.getBoundingClientRect();

  return {
    left: selfRect.left - parentRect.left,
    top: selfRect.top - parentRect.top
  };
};

var Resizer = function(options) {
  for (var prop in options) {
    if (options.hasOwnProperty(prop)) this[prop] = options[prop];
  }
};

Resizer.prototype.doOnStateChange = function(state) {
};

Resizer.prototype.makeDraggable = function(dom) {
  var self = this;
  var dragState = {};
  var containment;

  draggable(dom, {
    start: function (event) {
      var parentNode = dom.parentNode;
      containment = {
        left: 0,
        top: 0,
        width: parentNode.clientWidth,
        height: parentNode.clientHeight,
        right: parentNode.clientWidth,
        bottom: parentNode.clientHeight
      };

      dragState.startLeft = event.clientX;
      dragState.startTop = event.clientY;

      var position = getPosition(dom);

      dragState.resizerStartLeft = position.left;
      dragState.resizerStartTop = position.top;
      dragState.resizerStartWidth = dom.offsetWidth;
      dragState.resizerStartHeight = dom.offsetHeight;
    },
    drag: function (event) {
      var offsetLeft = event.clientX - dragState.startLeft;
      var offsetTop = event.clientY - dragState.startTop;

      var left = dragState.resizerStartLeft + offsetLeft;
      var top = dragState.resizerStartTop + offsetTop;

      if (left < containment.left) {
        left = containment.left;
      }

      if (top < containment.top) {
        top = containment.top;
      }

      if (left + dragState.resizerStartWidth > containment.right) {
        left = containment.right - dragState.resizerStartWidth;
      }

      if (top + dragState.resizerStartHeight > containment.bottom) {
        top = containment.bottom - dragState.resizerStartHeight;
      }

      dom.style.left = left + 'px';
      dom.style.top = top + 'px';

      self.doOnStateChange();
    },
    end: function () {
      dragState = {};
      if (self.doOnDragEnd) {
        self.doOnDragEnd();
      }
    }
  });
};

Resizer.prototype.bindResizeEvent = function(dom) {
  var self = this;
  var resizeState = {};
  var aspectRatio = self.aspectRatio;

  if (typeof aspectRatio !== 'number') {
    aspectRatio = undefined;
  }

  var makeResizable = function (bar) {
    var type = bar.className.split(' ')[0];
    var transformMap = configMap[type.substr(4)];

    var containment;

    draggable(bar, {
      start: function (event) {
        var parentNode = dom.parentNode;
        containment = {
          left: 0,
          top: 0,
          width: parentNode.clientWidth,
          height: parentNode.clientHeight,
          right: parentNode.clientWidth,
          bottom: parentNode.clientHeight
        };

        resizeState.startWidth = dom.clientWidth;
        resizeState.startHeight = dom.clientHeight;
        resizeState.startLeft = event.clientX;
        resizeState.startTop = event.clientY;

        var position = getPosition(dom);
        resizeState.resizerStartLeft = position.left;
        resizeState.resizerStartTop = position.top;
      },
      drag: function (event) {
        var widthRatio = transformMap.width;
        var heightRatio = transformMap.height;

        var offsetLeft = event.clientX - resizeState.startLeft;
        var offsetTop = event.clientY - resizeState.startTop;

        var width, height, minWidth = 50, maxWidth = 10000, minHeight = 50, maxHeight = 10000;

        if (widthRatio !== undefined) {
          width = resizeState.startWidth + widthRatio * offsetLeft;
          if (width < minWidth) {
            width = minWidth;
          }

          if (maxWidth && width > maxWidth) {
            width = maxWidth;
          }
        }

        if (heightRatio !== undefined) {
          height = resizeState.startHeight + heightRatio * offsetTop;
          if (height < minHeight) {
            height = minHeight;
          }

          if (maxHeight && height > maxHeight) {
            height = maxHeight;
          }
        }

        if (aspectRatio !== undefined) {
          if (type === 'ord-n' || type === 'ord-s') {
            width = height * aspectRatio;
          } else if (type === 'ord-w' || type === 'ord-e') {
            height = width / aspectRatio;
          } else {
            if (width / height < aspectRatio) {
              height = width / aspectRatio;
            } else {
              width = height * aspectRatio;
            }
          }
        }

        var position = {
          left: resizeState.resizerStartLeft,
          top: resizeState.resizerStartTop
        };

        if (transformMap.left !== undefined) {
          position.left = resizeState.resizerStartLeft + (width - resizeState.startWidth) * widthRatio;
        }

        if (transformMap.top !== undefined) {
          position.top = resizeState.resizerStartTop + (height - resizeState.startHeight) * heightRatio;
        }

        //=== containment start

        if (width + position.left > containment.right) {
          width = containment.right - position.left;
        }

        if (position.left < containment.left) {
          width -= containment.left - position.left;
          position.left = containment.left;
        }

        if (height + position.top > containment.bottom) {
          height = containment.bottom - position.top;
        }

        if (position.top < containment.top) {
          height -= containment.top - position.top;
          position.top = containment.top;
        }

        //=== containment end

        if (aspectRatio !== undefined) {
          if (width / height < aspectRatio) {
            height = width / aspectRatio;
          } else {
            width = height * aspectRatio;
          }
        }

        if (transformMap.left !== undefined) {
          position.left = resizeState.resizerStartLeft + (width - resizeState.startWidth) * widthRatio;
        }

        if (transformMap.top !== undefined) {
          position.top = resizeState.resizerStartTop + (height - resizeState.startHeight) * heightRatio;
        }

        dom.style.width = width + 'px';
        dom.style.height = height + 'px';

        if (position.left !== undefined) {
          dom.style.left = position.left + 'px';
        }

        if (position.top !== undefined) {
          dom.style.top = position.top + 'px';
        }

        self.doOnStateChange();
      },
      end: function () {
        if (self.doOnDragEnd) {
          self.doOnDragEnd();
        }
      }
    });
  };

  var bars = dom.querySelectorAll('.resize-bar');
  var handles = dom.querySelectorAll('.resize-handle');

  var i, j;

  for (i = 0, j = bars.length; i < j; i++) {
    makeResizable(bars[i]);
  }

  for (i = 0, j = handles.length; i < j; i++) {
    makeResizable(handles[i]);
  }
};

Resizer.prototype.render = function(container) {
  var self = this;

  var dom = buildDom({
    tag: 'div',
    className: 'resizer',
    content: [
      { tag: 'div', className: 'ord-n resize-bar' },
      { tag: 'div', className: 'ord-s resize-bar' },
      { tag: 'div', className: 'ord-w resize-bar' },
      { tag: 'div', className: 'ord-e resize-bar' },
      { tag: 'div', className: 'ord-nw resize-handle' },
      { tag: 'div', className: 'ord-n resize-handle' },
      { tag: 'div', className: 'ord-ne resize-handle' },
      { tag: 'div', className: 'ord-w resize-handle' },
      { tag: 'div', className: 'ord-e resize-handle' },
      { tag: 'div', className: 'ord-sw resize-handle' },
      { tag: 'div', className: 'ord-s resize-handle' },
      { tag: 'div', className: 'ord-se resize-handle' }
    ]
  });

  self.dom = dom;

  self.bindResizeEvent(dom);
  self.makeDraggable(dom);

  if (container) {
    container.appendChild(dom);
  }

  return dom;
};

module.exports = Resizer;
},{"./build-dom":3,"./draggable":5}],2:[function(require,module,exports){
var Cropper = require('./cropper');

var cropperInstances = {};

Cropper.getInstance = function(id) {
  return cropperInstances[id];
};

angular.module('cropper', [])
.factory('Cropper', function() {
  return Cropper;
})
.directive('cropper', function() {
  return {
    restrict: 'A',
    scope: {
      cropperContext: '=',
      cropperAspectRatio: '@'
    },
    link: function(scope, element, attrs) {
      var id = attrs.cropper;
      if (!id) throw new Error('cropper id is required');
      var cropperAspectRatio = scope.cropperAspectRatio;

      if (cropperAspectRatio) {
        if (/^\d*(\.)?\d+$/g.test(cropperAspectRatio)) {
          cropperAspectRatio = parseFloat(cropperAspectRatio);
        }
      } else {
        cropperAspectRatio = 1;
      }

      var cropper = Cropper({ element: element[0], aspectRatio: cropperAspectRatio });

      cropperInstances[id] = cropper;

      var cropperContext = scope.cropperContext;

      cropper.onCroppedRectChange = function(rect) {
        if (cropperContext) {
          cropperContext.left = rect.left;
          cropperContext.top = rect.top;
          cropperContext.width = rect.width;
          cropperContext.height = rect.height;
        }
        try { scope.$apply(); } catch(e) {}
      };

      scope.$on('$destroy', function() {
        cropperInstances[id] = null;
        delete cropperInstances[id];
      });
    }
  };
}).directive('cropperPreview', function(){
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var id = attrs.cropperPreview;
      if (!id) throw new Error('cropper id is required');

      var cropper = cropperInstances[id];

      if (cropper) {
        cropper.addPreview(element[0]);
      }
    }
  }
}).directive('cropperSource', function() {
  return {
    restrict: 'A',
    link: function ($scope, $el, attrs) {
      var id = attrs.cropperSource;
      if (!id) throw new Error('cropper id is required');

      var fileValidateRegex = /\.(jpg|png|gif|jpeg)$/i;
      var fileTypes = attrs.cropperFileTypes;

      if (fileTypes) {
        var types = fileTypes.split(',');
        if (types.length > 0) {
          fileValidateRegex = new RegExp('\.(' + types.join('|') + ')$', 'i');
        }
      }

      $el.on('change', function () {
        var input = this;
        var cropper = cropperInstances[id];

        var fileName = input.value;
        if (!fileValidateRegex.test(fileName)) {
          cropper.setImage();
          return;
        }

        if (typeof FileReader !== 'undefined') {
          var reader = new FileReader();
          reader.onload = function (event) {
            cropper.setImage(event.target.result);
          };
          if (input.files && input.files[0]) {
            reader.readAsDataURL(input.files[0]);
          }
        } else {
          input.select();
          input.blur();

          var src = document.selection.createRange().text;
          cropper.setImage(src);
        }
      });
    }
  };
});
},{"./cropper":4}],3:[function(require,module,exports){
var buildDOM = function(config, refs) {
  if (!config) return null;
  var dom, childElement;
  if (config.tag) {
    dom = document.createElement(config.tag);
    for (var prop in config) {
      if (config.hasOwnProperty(prop)) {
        if (prop === 'content' || prop === 'tag') continue;
        if (prop === 'key' && refs) {
          var key = config[prop];
          if (key) {
            refs[key] = dom;
          }
        }
        dom[prop] = config[prop];
      }
    }
    var content = config.content;
    if (content instanceof Array) {
      for (var i = 0, j = content.length; i < j; i++) {
        var child = content[i];
        childElement = buildDOM(child, refs);
        dom.appendChild(childElement);
      }
    } else if (typeof content === 'string') {
      childElement = document.createTextNode(content);
      dom.appendChild(childElement);
    }
  }
  return dom;
};

module.exports = buildDOM;
},{}],4:[function(require,module,exports){
var Resizer = require('./Resizer');
var buildDom = require('./build-dom');

var blankImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

var preLoadElement;

var ieVersion = Number(document.documentMode);

var getImageSize = function(src, callback) {
  if (ieVersion < 10) {
    if (!preLoadElement) {
      preLoadElement = document.createElement('div');
      preLoadElement.style.position = 'absolute';
      preLoadElement.style.width = '1px';
      preLoadElement.style.height = '1px';
      preLoadElement.style.left = '-9999px';
      preLoadElement.style.top = '-9999px';
      preLoadElement.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=image)';
      document.body.insertBefore(preLoadElement, document.body.firstChild);
    }

    preLoadElement.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;

    var size = {
      width: preLoadElement.offsetWidth,
      height: preLoadElement.offsetHeight
    };

    if (typeof callback === 'function') {
      callback(size);
    }
  } else {
    var image = new Image();
    image.onload = function() {
      var size = {
        width: image.width,
        height: image.height
      };
      if (typeof callback === 'function') {
        callback(size);
      }
    };
    image.src = src;
  }
};

var Cropper = function(options) {
  var cropper = this;
  if (!(this instanceof Cropper)) {
    cropper = new Cropper();
  }
  cropper.aspectRatio = 1;
  for (var prop in options) {
    if (options.hasOwnProperty(prop)) cropper[prop] = options[prop];
  }

  if (cropper.element) {
    cropper.render(cropper.element);
  }

  return cropper;
};

Cropper.prototype.resetResizer = function() {
  var resizer = this.resizer;
  var cropperRect = this.cropperRect;
  var aspectRatio = this.aspectRatio;

  if (typeof aspectRatio !== 'number') {
    aspectRatio = 1;
  }

  var width = 100;
  var height = 100 / aspectRatio;

  var resizerDom = resizer.dom;
  resizerDom.style.width = width + 'px';
  resizerDom.style.height = height + 'px';

  if (cropperRect) {
    resizerDom.style.left = (cropperRect.width - width) / 2 + 'px';
    resizerDom.style.top = (cropperRect.height - height) / 2 + 'px';
  } else {
    resizerDom.style.left = resizerDom.style.top = '';
  }

  resizer.doOnStateChange();
  resizer.doOnDragEnd();
};

Cropper.prototype.setImage = function(src) {
  var element = this.element;
  var sourceImage = element.querySelector('img');
  var resizeImage = this.refs.image;

  var self = this;

  if (src === undefined || src === null) {
    resizeImage.src = sourceImage.src = blankImage;
    resizeImage.style.width = resizeImage.style.height = resizeImage.style.left = resizeImage.style.top = '';
    sourceImage.style.width = sourceImage.style.height = sourceImage.style.left = sourceImage.style.top = '';

    self.updatePreview(blankImage);

    self.dom.style.display = 'none';
    self.resetResizer();

    self.dom.style.left = self.dom.style.top = '';
    self.dom.style.width = element.offsetWidth + 'px';
    self.dom.style.height = element.offsetHeight + 'px';

    self.croppedRect = {
      width: 0,
      height: 0,
      left: 0,
      top: 0
    };

    self.onCroppedRectChange && self.onCroppedRectChange(self.croppedRect);

    return;
  }

  getImageSize(src, function(size) {
    if (ieVersion < 10) {
      resizeImage.src = sourceImage.src = blankImage;
      resizeImage.style.filter = sourceImage.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)';

      sourceImage.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
      resizeImage.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
    }

    self.imageSize = size;

    var elementWidth = element.offsetWidth;
    var elementHeight = element.offsetHeight;

    var dom = self.dom;

    var cropperRect = {};

    if (size.width / size.height > elementWidth / elementHeight) {
      cropperRect.width = elementWidth;
      cropperRect.height = elementWidth * size.height / size.width;
      cropperRect.top = (elementHeight - cropperRect.height) / 2;
      cropperRect.left = 0;
    } else {
      cropperRect.height = elementHeight;
      cropperRect.width = elementHeight * size.width / size.height;
      cropperRect.top = 0;
      cropperRect.left = (elementWidth - cropperRect.width) / 2;
    }

    self.cropperRect = cropperRect;

    for (var style in cropperRect) {
      if (cropperRect.hasOwnProperty(style)) {
        dom.style[style] = sourceImage.style[style] = resizeImage.style[style] = cropperRect[style] + 'px';
      }
    }

    if (!ieVersion || ieVersion > 9) {
      resizeImage.src = sourceImage.src = src;
    }

    self.dom.style.display = '';
    self.resetResizer();

    self.updatePreview(src);
  });
};

Cropper.prototype.addPreview = function(preview) {
  var previews = this.previews;
  if (!previews) {
    previews = this.previews = [];
  }
  previews.push(preview);
};

Cropper.prototype.render = function(container) {
  var resizer = new Resizer({ aspectRatio: this.aspectRatio });
  var refs = {};

  var dom = buildDom({
    tag: 'div',
    className: 'cropper',
    content: [{
      tag: 'div',
      className: 'mask'
    }]
  }, refs);

  var resizerDom = resizer.render(dom);

  var img = buildDom({
    tag: 'div',
    className: 'wrapper',
    content: [{
      tag: 'img',
      key: 'image',
      src: blankImage
    }]
  }, refs);

  var self = this;
  self.refs = refs;

  resizer.doOnStateChange = function() {
    var left = parseInt(resizerDom.style.left, 10) || 0;
    var top = parseInt(resizerDom.style.top, 10) || 0;

    var image = refs.image;

    image.style.left = -left + 'px';
    image.style.top = -top + 'px';

    self.updatePreview();
  };

  resizer.doOnDragEnd = function() {
    var left = parseInt(resizerDom.style.left, 10) || 0;
    var top = parseInt(resizerDom.style.top, 10) || 0;
    var resizerWidth = resizerDom.offsetWidth;
    var resizerHeight = resizerDom.offsetHeight;

    var imageSize = self.imageSize;
    var cropperRect = self.cropperRect;
    if (cropperRect) {
      var scale = cropperRect.width / imageSize.width;

      self.croppedRect = {
        width: Math.floor(resizerWidth / scale),
        height: Math.floor(resizerHeight / scale),
        left: Math.floor(left / scale),
        top: Math.floor(top / scale)
      };

      self.onCroppedRectChange && self.onCroppedRectChange(self.croppedRect);
    }
  };
  self.resizer = resizer;
  self.dom = dom;

  resizerDom.insertBefore(img, resizerDom.firstChild);

  container.appendChild(dom);

  self.dom.style.display = 'none';
};

Cropper.prototype.updatePreview = function(src) {
  var imageSize = this.imageSize;
  var cropperRect = this.cropperRect;
  if (!imageSize || !cropperRect) return;

  var previews = this.previews || [];

  var resizerDom = this.resizer.dom;
  var resizerLeft = parseInt(resizerDom.style.left, 10) || 0;
  var resizerTop = parseInt(resizerDom.style.top, 10) || 0;

  var resizerWidth = resizerDom.offsetWidth;
  var resizerHeight = resizerDom.offsetHeight;

  for (var i = 0, j = previews.length; i < j; i++) {
    var previewElement = previews[i];
    var previewImage = previewElement.querySelector('img');
    var previewWrapper = previewElement.querySelector('div');

    if (!previewImage) continue;

    if (src === blankImage) {
      previewImage.style.width = previewImage.style.height = previewImage.style.left = previewImage.style.top = '';
      previewImage.src = blankImage;
    } else {
      if (ieVersion < 10) {
        if (src) {
          previewImage.src = blankImage;

          previewImage.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)';
          previewImage.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
          previewImage.style.width = cropperRect.width + 'px';
          previewImage.style.height = cropperRect.height + 'px';
        }
      } else if (src) {
        previewImage.src = src;
      }

      var elementWidth = previewElement.offsetWidth;
      var elementHeight = previewElement.offsetHeight;

      var scale = elementWidth / resizerWidth;

      if (previewWrapper) {
        var elementRatio = elementWidth / elementHeight;
        var resizerRatio = resizerWidth / resizerHeight;

        if (elementRatio < resizerRatio) {
          previewWrapper.style.width = elementWidth + 'px';
          previewWrapper.style.height = resizerHeight * elementWidth / resizerWidth + 'px';
          previewWrapper.style.top = (elementHeight - previewWrapper.clientHeight) / 2 + 'px';
          previewWrapper.style.left = '';
        } else {
          var visibleWidth = resizerWidth * elementHeight / resizerHeight;
          scale = visibleWidth / resizerWidth;
          previewWrapper.style.height = elementHeight + 'px';
          previewWrapper.style.width = visibleWidth + 'px';
          previewWrapper.style.left = (elementWidth - previewWrapper.clientWidth) / 2 + 'px';
          previewWrapper.style.top = '';
        }
      }

      previewImage.style.width = scale * cropperRect.width + 'px';
      previewImage.style.height = scale * cropperRect.height + 'px';
      previewImage.style.left = -resizerLeft * scale + 'px';
      previewImage.style.top = -resizerTop * scale + 'px';
    }
  }
};

module.exports = Cropper;
},{"./Resizer":1,"./build-dom":3}],5:[function(require,module,exports){
var bind = function(element, event, fn) {
  if (element.attachEvent) {
    element.attachEvent('on' + event, fn);
  } else {
    element.addEventListener(event, fn, false);
  }
};

var unbind = function(element, event, fn) {
  if (element.detachEvent) {
    element.detachEvent('on' + event, fn);
  } else {
    element.removeEventListener(event, fn);
  }
};

var isDragging = false;

var isIE8 = Number(document.documentMode) < 9;

var fixEvent = function(event) {
  var scrollTop = Math.max(window.scrollY || 0, document.documentElement.scrollTop || 0);
  var scrollLeft = Math.max(window.scrollX || 0, document.documentElement.scrollLeft || 0);

  event.target = event.srcElement;
  event.pageX = scrollLeft + event.clientX;
  event.pageY = scrollTop + event.clientY;
};

module.exports = function(element, options) {
  var moveFn = function(event) {
    if (isIE8) {
      fixEvent(event);
    }
    if (options.drag) {
      options.drag(event);
    }
  };
  var upFn = function(event) {
    if (isIE8) {
      fixEvent(event);
    }
    unbind(document, 'mousemove', moveFn);
    unbind(document, 'mouseup', upFn);
    document.onselectstart = null;
    document.ondragstart = null;

    isDragging = false;

    if (options.end) {
      options.end(event);
    }
  };
  bind(element, 'mousedown', function(event) {
    if (isIE8) {
      fixEvent(event);
    }
    if (isDragging) return;
    document.onselectstart = function() { return false; };
    document.ondragstart = function() { return false; };

    bind(document, 'mousemove', moveFn);
    bind(document, 'mouseup', upFn);
    isDragging = true;

    if (options.start) {
      options.start(event);
    }
  });
};
},{}],6:[function(require,module,exports){
window.Cropper = require('./cropper');
},{"./cropper":4}],7:[function(require,module,exports){
if (typeof angular !== 'undefined') {
  require('./angular');
} else {
  require('./export');
}


},{"./angular":2,"./export":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL1Jlc2l6ZXIuanMiLCJzcmMvYW5ndWxhci5qcyIsInNyYy9idWlsZC1kb20uanMiLCJzcmMvY3JvcHBlci5qcyIsInNyYy9kcmFnZ2FibGUuanMiLCJzcmMvZXhwb3J0LmpzIiwic3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgYnVpbGREb20gPSByZXF1aXJlKCcuL2J1aWxkLWRvbScpO1xyXG52YXIgZHJhZ2dhYmxlID0gcmVxdWlyZSgnLi9kcmFnZ2FibGUnKTtcclxuXHJcbnZhciBjb25maWdNYXAgPSB7XHJcbiAgJ24nOiAgeyB0b3A6IHRydWUsIGhlaWdodDogLTEgfSxcclxuICAndyc6ICB7IGxlZnQ6IHRydWUsIHdpZHRoOiAtMSB9LFxyXG4gICdlJzogIHsgd2lkdGg6IDEgfSxcclxuICAncyc6ICB7IGhlaWdodDogMSB9LFxyXG4gICdudyc6IHsgbGVmdDogdHJ1ZSwgdG9wOiB0cnVlLCB3aWR0aDogLTEsIGhlaWdodDogLTEgfSxcclxuICAnbmUnOiB7IHRvcDogdHJ1ZSwgd2lkdGg6IDEsIGhlaWdodDogLTEgfSxcclxuICAnc3cnOiB7IGxlZnQ6IHRydWUsIHdpZHRoOiAtMSwgaGVpZ2h0OiAxIH0sXHJcbiAgJ3NlJzogeyB3aWR0aDogMSwgaGVpZ2h0OiAxIH1cclxufTtcclxuXHJcbnZhciBnZXRQb3NpdGlvbiA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgdmFyIHNlbGZSZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICB2YXIgcGFyZW50UmVjdCA9IGVsZW1lbnQub2Zmc2V0UGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgbGVmdDogc2VsZlJlY3QubGVmdCAtIHBhcmVudFJlY3QubGVmdCxcclxuICAgIHRvcDogc2VsZlJlY3QudG9wIC0gcGFyZW50UmVjdC50b3BcclxuICB9O1xyXG59O1xyXG5cclxudmFyIFJlc2l6ZXIgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcbiAgZm9yICh2YXIgcHJvcCBpbiBvcHRpb25zKSB7XHJcbiAgICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkgdGhpc1twcm9wXSA9IG9wdGlvbnNbcHJvcF07XHJcbiAgfVxyXG59O1xyXG5cclxuUmVzaXplci5wcm90b3R5cGUuZG9PblN0YXRlQ2hhbmdlID0gZnVuY3Rpb24oc3RhdGUpIHtcclxufTtcclxuXHJcblJlc2l6ZXIucHJvdG90eXBlLm1ha2VEcmFnZ2FibGUgPSBmdW5jdGlvbihkb20pIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgdmFyIGRyYWdTdGF0ZSA9IHt9O1xyXG4gIHZhciBjb250YWlubWVudDtcclxuXHJcbiAgZHJhZ2dhYmxlKGRvbSwge1xyXG4gICAgc3RhcnQ6IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICB2YXIgcGFyZW50Tm9kZSA9IGRvbS5wYXJlbnROb2RlO1xyXG4gICAgICBjb250YWlubWVudCA9IHtcclxuICAgICAgICBsZWZ0OiAwLFxyXG4gICAgICAgIHRvcDogMCxcclxuICAgICAgICB3aWR0aDogcGFyZW50Tm9kZS5jbGllbnRXaWR0aCxcclxuICAgICAgICBoZWlnaHQ6IHBhcmVudE5vZGUuY2xpZW50SGVpZ2h0LFxyXG4gICAgICAgIHJpZ2h0OiBwYXJlbnROb2RlLmNsaWVudFdpZHRoLFxyXG4gICAgICAgIGJvdHRvbTogcGFyZW50Tm9kZS5jbGllbnRIZWlnaHRcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGRyYWdTdGF0ZS5zdGFydExlZnQgPSBldmVudC5jbGllbnRYO1xyXG4gICAgICBkcmFnU3RhdGUuc3RhcnRUb3AgPSBldmVudC5jbGllbnRZO1xyXG5cclxuICAgICAgdmFyIHBvc2l0aW9uID0gZ2V0UG9zaXRpb24oZG9tKTtcclxuXHJcbiAgICAgIGRyYWdTdGF0ZS5yZXNpemVyU3RhcnRMZWZ0ID0gcG9zaXRpb24ubGVmdDtcclxuICAgICAgZHJhZ1N0YXRlLnJlc2l6ZXJTdGFydFRvcCA9IHBvc2l0aW9uLnRvcDtcclxuICAgICAgZHJhZ1N0YXRlLnJlc2l6ZXJTdGFydFdpZHRoID0gZG9tLm9mZnNldFdpZHRoO1xyXG4gICAgICBkcmFnU3RhdGUucmVzaXplclN0YXJ0SGVpZ2h0ID0gZG9tLm9mZnNldEhlaWdodDtcclxuICAgIH0sXHJcbiAgICBkcmFnOiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgdmFyIG9mZnNldExlZnQgPSBldmVudC5jbGllbnRYIC0gZHJhZ1N0YXRlLnN0YXJ0TGVmdDtcclxuICAgICAgdmFyIG9mZnNldFRvcCA9IGV2ZW50LmNsaWVudFkgLSBkcmFnU3RhdGUuc3RhcnRUb3A7XHJcblxyXG4gICAgICB2YXIgbGVmdCA9IGRyYWdTdGF0ZS5yZXNpemVyU3RhcnRMZWZ0ICsgb2Zmc2V0TGVmdDtcclxuICAgICAgdmFyIHRvcCA9IGRyYWdTdGF0ZS5yZXNpemVyU3RhcnRUb3AgKyBvZmZzZXRUb3A7XHJcblxyXG4gICAgICBpZiAobGVmdCA8IGNvbnRhaW5tZW50LmxlZnQpIHtcclxuICAgICAgICBsZWZ0ID0gY29udGFpbm1lbnQubGVmdDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRvcCA8IGNvbnRhaW5tZW50LnRvcCkge1xyXG4gICAgICAgIHRvcCA9IGNvbnRhaW5tZW50LnRvcDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGxlZnQgKyBkcmFnU3RhdGUucmVzaXplclN0YXJ0V2lkdGggPiBjb250YWlubWVudC5yaWdodCkge1xyXG4gICAgICAgIGxlZnQgPSBjb250YWlubWVudC5yaWdodCAtIGRyYWdTdGF0ZS5yZXNpemVyU3RhcnRXaWR0aDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRvcCArIGRyYWdTdGF0ZS5yZXNpemVyU3RhcnRIZWlnaHQgPiBjb250YWlubWVudC5ib3R0b20pIHtcclxuICAgICAgICB0b3AgPSBjb250YWlubWVudC5ib3R0b20gLSBkcmFnU3RhdGUucmVzaXplclN0YXJ0SGVpZ2h0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkb20uc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xyXG4gICAgICBkb20uc3R5bGUudG9wID0gdG9wICsgJ3B4JztcclxuXHJcbiAgICAgIHNlbGYuZG9PblN0YXRlQ2hhbmdlKCk7XHJcbiAgICB9LFxyXG4gICAgZW5kOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGRyYWdTdGF0ZSA9IHt9O1xyXG4gICAgICBpZiAoc2VsZi5kb09uRHJhZ0VuZCkge1xyXG4gICAgICAgIHNlbGYuZG9PbkRyYWdFbmQoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG59O1xyXG5cclxuUmVzaXplci5wcm90b3R5cGUuYmluZFJlc2l6ZUV2ZW50ID0gZnVuY3Rpb24oZG9tKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gIHZhciByZXNpemVTdGF0ZSA9IHt9O1xyXG4gIHZhciBhc3BlY3RSYXRpbyA9IHNlbGYuYXNwZWN0UmF0aW87XHJcblxyXG4gIGlmICh0eXBlb2YgYXNwZWN0UmF0aW8gIT09ICdudW1iZXInKSB7XHJcbiAgICBhc3BlY3RSYXRpbyA9IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIHZhciBtYWtlUmVzaXphYmxlID0gZnVuY3Rpb24gKGJhcikge1xyXG4gICAgdmFyIHR5cGUgPSBiYXIuY2xhc3NOYW1lLnNwbGl0KCcgJylbMF07XHJcbiAgICB2YXIgdHJhbnNmb3JtTWFwID0gY29uZmlnTWFwW3R5cGUuc3Vic3RyKDQpXTtcclxuXHJcbiAgICB2YXIgY29udGFpbm1lbnQ7XHJcblxyXG4gICAgZHJhZ2dhYmxlKGJhciwge1xyXG4gICAgICBzdGFydDogZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIHBhcmVudE5vZGUgPSBkb20ucGFyZW50Tm9kZTtcclxuICAgICAgICBjb250YWlubWVudCA9IHtcclxuICAgICAgICAgIGxlZnQ6IDAsXHJcbiAgICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgICB3aWR0aDogcGFyZW50Tm9kZS5jbGllbnRXaWR0aCxcclxuICAgICAgICAgIGhlaWdodDogcGFyZW50Tm9kZS5jbGllbnRIZWlnaHQsXHJcbiAgICAgICAgICByaWdodDogcGFyZW50Tm9kZS5jbGllbnRXaWR0aCxcclxuICAgICAgICAgIGJvdHRvbTogcGFyZW50Tm9kZS5jbGllbnRIZWlnaHRcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXNpemVTdGF0ZS5zdGFydFdpZHRoID0gZG9tLmNsaWVudFdpZHRoO1xyXG4gICAgICAgIHJlc2l6ZVN0YXRlLnN0YXJ0SGVpZ2h0ID0gZG9tLmNsaWVudEhlaWdodDtcclxuICAgICAgICByZXNpemVTdGF0ZS5zdGFydExlZnQgPSBldmVudC5jbGllbnRYO1xyXG4gICAgICAgIHJlc2l6ZVN0YXRlLnN0YXJ0VG9wID0gZXZlbnQuY2xpZW50WTtcclxuXHJcbiAgICAgICAgdmFyIHBvc2l0aW9uID0gZ2V0UG9zaXRpb24oZG9tKTtcclxuICAgICAgICByZXNpemVTdGF0ZS5yZXNpemVyU3RhcnRMZWZ0ID0gcG9zaXRpb24ubGVmdDtcclxuICAgICAgICByZXNpemVTdGF0ZS5yZXNpemVyU3RhcnRUb3AgPSBwb3NpdGlvbi50b3A7XHJcbiAgICAgIH0sXHJcbiAgICAgIGRyYWc6IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIHZhciB3aWR0aFJhdGlvID0gdHJhbnNmb3JtTWFwLndpZHRoO1xyXG4gICAgICAgIHZhciBoZWlnaHRSYXRpbyA9IHRyYW5zZm9ybU1hcC5oZWlnaHQ7XHJcblxyXG4gICAgICAgIHZhciBvZmZzZXRMZWZ0ID0gZXZlbnQuY2xpZW50WCAtIHJlc2l6ZVN0YXRlLnN0YXJ0TGVmdDtcclxuICAgICAgICB2YXIgb2Zmc2V0VG9wID0gZXZlbnQuY2xpZW50WSAtIHJlc2l6ZVN0YXRlLnN0YXJ0VG9wO1xyXG5cclxuICAgICAgICB2YXIgd2lkdGgsIGhlaWdodCwgbWluV2lkdGggPSA1MCwgbWF4V2lkdGggPSAxMDAwMCwgbWluSGVpZ2h0ID0gNTAsIG1heEhlaWdodCA9IDEwMDAwO1xyXG5cclxuICAgICAgICBpZiAod2lkdGhSYXRpbyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICB3aWR0aCA9IHJlc2l6ZVN0YXRlLnN0YXJ0V2lkdGggKyB3aWR0aFJhdGlvICogb2Zmc2V0TGVmdDtcclxuICAgICAgICAgIGlmICh3aWR0aCA8IG1pbldpZHRoKSB7XHJcbiAgICAgICAgICAgIHdpZHRoID0gbWluV2lkdGg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKG1heFdpZHRoICYmIHdpZHRoID4gbWF4V2lkdGgpIHtcclxuICAgICAgICAgICAgd2lkdGggPSBtYXhXaWR0aDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChoZWlnaHRSYXRpbyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBoZWlnaHQgPSByZXNpemVTdGF0ZS5zdGFydEhlaWdodCArIGhlaWdodFJhdGlvICogb2Zmc2V0VG9wO1xyXG4gICAgICAgICAgaWYgKGhlaWdodCA8IG1pbkhlaWdodCkge1xyXG4gICAgICAgICAgICBoZWlnaHQgPSBtaW5IZWlnaHQ7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKG1heEhlaWdodCAmJiBoZWlnaHQgPiBtYXhIZWlnaHQpIHtcclxuICAgICAgICAgICAgaGVpZ2h0ID0gbWF4SGVpZ2h0O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGFzcGVjdFJhdGlvICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIGlmICh0eXBlID09PSAnb3JkLW4nIHx8IHR5cGUgPT09ICdvcmQtcycpIHtcclxuICAgICAgICAgICAgd2lkdGggPSBoZWlnaHQgKiBhc3BlY3RSYXRpbztcclxuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ29yZC13JyB8fCB0eXBlID09PSAnb3JkLWUnKSB7XHJcbiAgICAgICAgICAgIGhlaWdodCA9IHdpZHRoIC8gYXNwZWN0UmF0aW87XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAod2lkdGggLyBoZWlnaHQgPCBhc3BlY3RSYXRpbykge1xyXG4gICAgICAgICAgICAgIGhlaWdodCA9IHdpZHRoIC8gYXNwZWN0UmF0aW87XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgd2lkdGggPSBoZWlnaHQgKiBhc3BlY3RSYXRpbztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHBvc2l0aW9uID0ge1xyXG4gICAgICAgICAgbGVmdDogcmVzaXplU3RhdGUucmVzaXplclN0YXJ0TGVmdCxcclxuICAgICAgICAgIHRvcDogcmVzaXplU3RhdGUucmVzaXplclN0YXJ0VG9wXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKHRyYW5zZm9ybU1hcC5sZWZ0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIHBvc2l0aW9uLmxlZnQgPSByZXNpemVTdGF0ZS5yZXNpemVyU3RhcnRMZWZ0ICsgKHdpZHRoIC0gcmVzaXplU3RhdGUuc3RhcnRXaWR0aCkgKiB3aWR0aFJhdGlvO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRyYW5zZm9ybU1hcC50b3AgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgcG9zaXRpb24udG9wID0gcmVzaXplU3RhdGUucmVzaXplclN0YXJ0VG9wICsgKGhlaWdodCAtIHJlc2l6ZVN0YXRlLnN0YXJ0SGVpZ2h0KSAqIGhlaWdodFJhdGlvO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy89PT0gY29udGFpbm1lbnQgc3RhcnRcclxuXHJcbiAgICAgICAgaWYgKHdpZHRoICsgcG9zaXRpb24ubGVmdCA+IGNvbnRhaW5tZW50LnJpZ2h0KSB7XHJcbiAgICAgICAgICB3aWR0aCA9IGNvbnRhaW5tZW50LnJpZ2h0IC0gcG9zaXRpb24ubGVmdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwb3NpdGlvbi5sZWZ0IDwgY29udGFpbm1lbnQubGVmdCkge1xyXG4gICAgICAgICAgd2lkdGggLT0gY29udGFpbm1lbnQubGVmdCAtIHBvc2l0aW9uLmxlZnQ7XHJcbiAgICAgICAgICBwb3NpdGlvbi5sZWZ0ID0gY29udGFpbm1lbnQubGVmdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChoZWlnaHQgKyBwb3NpdGlvbi50b3AgPiBjb250YWlubWVudC5ib3R0b20pIHtcclxuICAgICAgICAgIGhlaWdodCA9IGNvbnRhaW5tZW50LmJvdHRvbSAtIHBvc2l0aW9uLnRvcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwb3NpdGlvbi50b3AgPCBjb250YWlubWVudC50b3ApIHtcclxuICAgICAgICAgIGhlaWdodCAtPSBjb250YWlubWVudC50b3AgLSBwb3NpdGlvbi50b3A7XHJcbiAgICAgICAgICBwb3NpdGlvbi50b3AgPSBjb250YWlubWVudC50b3A7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLz09PSBjb250YWlubWVudCBlbmRcclxuXHJcbiAgICAgICAgaWYgKGFzcGVjdFJhdGlvICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIGlmICh3aWR0aCAvIGhlaWdodCA8IGFzcGVjdFJhdGlvKSB7XHJcbiAgICAgICAgICAgIGhlaWdodCA9IHdpZHRoIC8gYXNwZWN0UmF0aW87XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB3aWR0aCA9IGhlaWdodCAqIGFzcGVjdFJhdGlvO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRyYW5zZm9ybU1hcC5sZWZ0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIHBvc2l0aW9uLmxlZnQgPSByZXNpemVTdGF0ZS5yZXNpemVyU3RhcnRMZWZ0ICsgKHdpZHRoIC0gcmVzaXplU3RhdGUuc3RhcnRXaWR0aCkgKiB3aWR0aFJhdGlvO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRyYW5zZm9ybU1hcC50b3AgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgcG9zaXRpb24udG9wID0gcmVzaXplU3RhdGUucmVzaXplclN0YXJ0VG9wICsgKGhlaWdodCAtIHJlc2l6ZVN0YXRlLnN0YXJ0SGVpZ2h0KSAqIGhlaWdodFJhdGlvO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG9tLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xyXG4gICAgICAgIGRvbS5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xyXG5cclxuICAgICAgICBpZiAocG9zaXRpb24ubGVmdCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBkb20uc3R5bGUubGVmdCA9IHBvc2l0aW9uLmxlZnQgKyAncHgnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBvc2l0aW9uLnRvcCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBkb20uc3R5bGUudG9wID0gcG9zaXRpb24udG9wICsgJ3B4JztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlbGYuZG9PblN0YXRlQ2hhbmdlKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVuZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChzZWxmLmRvT25EcmFnRW5kKSB7XHJcbiAgICAgICAgICBzZWxmLmRvT25EcmFnRW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICB2YXIgYmFycyA9IGRvbS5xdWVyeVNlbGVjdG9yQWxsKCcucmVzaXplLWJhcicpO1xyXG4gIHZhciBoYW5kbGVzID0gZG9tLnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZXNpemUtaGFuZGxlJyk7XHJcblxyXG4gIHZhciBpLCBqO1xyXG5cclxuICBmb3IgKGkgPSAwLCBqID0gYmFycy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcclxuICAgIG1ha2VSZXNpemFibGUoYmFyc1tpXSk7XHJcbiAgfVxyXG5cclxuICBmb3IgKGkgPSAwLCBqID0gaGFuZGxlcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcclxuICAgIG1ha2VSZXNpemFibGUoaGFuZGxlc1tpXSk7XHJcbiAgfVxyXG59O1xyXG5cclxuUmVzaXplci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oY29udGFpbmVyKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICB2YXIgZG9tID0gYnVpbGREb20oe1xyXG4gICAgdGFnOiAnZGl2JyxcclxuICAgIGNsYXNzTmFtZTogJ3Jlc2l6ZXInLFxyXG4gICAgY29udGVudDogW1xyXG4gICAgICB7IHRhZzogJ2RpdicsIGNsYXNzTmFtZTogJ29yZC1uIHJlc2l6ZS1iYXInIH0sXHJcbiAgICAgIHsgdGFnOiAnZGl2JywgY2xhc3NOYW1lOiAnb3JkLXMgcmVzaXplLWJhcicgfSxcclxuICAgICAgeyB0YWc6ICdkaXYnLCBjbGFzc05hbWU6ICdvcmQtdyByZXNpemUtYmFyJyB9LFxyXG4gICAgICB7IHRhZzogJ2RpdicsIGNsYXNzTmFtZTogJ29yZC1lIHJlc2l6ZS1iYXInIH0sXHJcbiAgICAgIHsgdGFnOiAnZGl2JywgY2xhc3NOYW1lOiAnb3JkLW53IHJlc2l6ZS1oYW5kbGUnIH0sXHJcbiAgICAgIHsgdGFnOiAnZGl2JywgY2xhc3NOYW1lOiAnb3JkLW4gcmVzaXplLWhhbmRsZScgfSxcclxuICAgICAgeyB0YWc6ICdkaXYnLCBjbGFzc05hbWU6ICdvcmQtbmUgcmVzaXplLWhhbmRsZScgfSxcclxuICAgICAgeyB0YWc6ICdkaXYnLCBjbGFzc05hbWU6ICdvcmQtdyByZXNpemUtaGFuZGxlJyB9LFxyXG4gICAgICB7IHRhZzogJ2RpdicsIGNsYXNzTmFtZTogJ29yZC1lIHJlc2l6ZS1oYW5kbGUnIH0sXHJcbiAgICAgIHsgdGFnOiAnZGl2JywgY2xhc3NOYW1lOiAnb3JkLXN3IHJlc2l6ZS1oYW5kbGUnIH0sXHJcbiAgICAgIHsgdGFnOiAnZGl2JywgY2xhc3NOYW1lOiAnb3JkLXMgcmVzaXplLWhhbmRsZScgfSxcclxuICAgICAgeyB0YWc6ICdkaXYnLCBjbGFzc05hbWU6ICdvcmQtc2UgcmVzaXplLWhhbmRsZScgfVxyXG4gICAgXVxyXG4gIH0pO1xyXG5cclxuICBzZWxmLmRvbSA9IGRvbTtcclxuXHJcbiAgc2VsZi5iaW5kUmVzaXplRXZlbnQoZG9tKTtcclxuICBzZWxmLm1ha2VEcmFnZ2FibGUoZG9tKTtcclxuXHJcbiAgaWYgKGNvbnRhaW5lcikge1xyXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRvbSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZG9tO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZXNpemVyOyIsInZhciBDcm9wcGVyID0gcmVxdWlyZSgnLi9jcm9wcGVyJyk7XHJcblxyXG52YXIgY3JvcHBlckluc3RhbmNlcyA9IHt9O1xyXG5cclxuQ3JvcHBlci5nZXRJbnN0YW5jZSA9IGZ1bmN0aW9uKGlkKSB7XHJcbiAgcmV0dXJuIGNyb3BwZXJJbnN0YW5jZXNbaWRdO1xyXG59O1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2Nyb3BwZXInLCBbXSlcclxuLmZhY3RvcnkoJ0Nyb3BwZXInLCBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gQ3JvcHBlcjtcclxufSlcclxuLmRpcmVjdGl2ZSgnY3JvcHBlcicsIGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiB7XHJcbiAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgc2NvcGU6IHtcclxuICAgICAgY3JvcHBlckNvbnRleHQ6ICc9JyxcclxuICAgICAgY3JvcHBlckFzcGVjdFJhdGlvOiAnQCdcclxuICAgIH0sXHJcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgdmFyIGlkID0gYXR0cnMuY3JvcHBlcjtcclxuICAgICAgaWYgKCFpZCkgdGhyb3cgbmV3IEVycm9yKCdjcm9wcGVyIGlkIGlzIHJlcXVpcmVkJyk7XHJcbiAgICAgIHZhciBjcm9wcGVyQXNwZWN0UmF0aW8gPSBzY29wZS5jcm9wcGVyQXNwZWN0UmF0aW87XHJcblxyXG4gICAgICBpZiAoY3JvcHBlckFzcGVjdFJhdGlvKSB7XHJcbiAgICAgICAgaWYgKC9eXFxkKihcXC4pP1xcZCskL2cudGVzdChjcm9wcGVyQXNwZWN0UmF0aW8pKSB7XHJcbiAgICAgICAgICBjcm9wcGVyQXNwZWN0UmF0aW8gPSBwYXJzZUZsb2F0KGNyb3BwZXJBc3BlY3RSYXRpbyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNyb3BwZXJBc3BlY3RSYXRpbyA9IDE7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBjcm9wcGVyID0gQ3JvcHBlcih7IGVsZW1lbnQ6IGVsZW1lbnRbMF0sIGFzcGVjdFJhdGlvOiBjcm9wcGVyQXNwZWN0UmF0aW8gfSk7XHJcblxyXG4gICAgICBjcm9wcGVySW5zdGFuY2VzW2lkXSA9IGNyb3BwZXI7XHJcblxyXG4gICAgICB2YXIgY3JvcHBlckNvbnRleHQgPSBzY29wZS5jcm9wcGVyQ29udGV4dDtcclxuXHJcbiAgICAgIGNyb3BwZXIub25Dcm9wcGVkUmVjdENoYW5nZSA9IGZ1bmN0aW9uKHJlY3QpIHtcclxuICAgICAgICBpZiAoY3JvcHBlckNvbnRleHQpIHtcclxuICAgICAgICAgIGNyb3BwZXJDb250ZXh0LmxlZnQgPSByZWN0LmxlZnQ7XHJcbiAgICAgICAgICBjcm9wcGVyQ29udGV4dC50b3AgPSByZWN0LnRvcDtcclxuICAgICAgICAgIGNyb3BwZXJDb250ZXh0LndpZHRoID0gcmVjdC53aWR0aDtcclxuICAgICAgICAgIGNyb3BwZXJDb250ZXh0LmhlaWdodCA9IHJlY3QuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0cnkgeyBzY29wZS4kYXBwbHkoKTsgfSBjYXRjaChlKSB7fVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNyb3BwZXJJbnN0YW5jZXNbaWRdID0gbnVsbDtcclxuICAgICAgICBkZWxldGUgY3JvcHBlckluc3RhbmNlc1tpZF07XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH07XHJcbn0pLmRpcmVjdGl2ZSgnY3JvcHBlclByZXZpZXcnLCBmdW5jdGlvbigpe1xyXG4gIHJldHVybiB7XHJcbiAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgIHZhciBpZCA9IGF0dHJzLmNyb3BwZXJQcmV2aWV3O1xyXG4gICAgICBpZiAoIWlkKSB0aHJvdyBuZXcgRXJyb3IoJ2Nyb3BwZXIgaWQgaXMgcmVxdWlyZWQnKTtcclxuXHJcbiAgICAgIHZhciBjcm9wcGVyID0gY3JvcHBlckluc3RhbmNlc1tpZF07XHJcblxyXG4gICAgICBpZiAoY3JvcHBlcikge1xyXG4gICAgICAgIGNyb3BwZXIuYWRkUHJldmlldyhlbGVtZW50WzBdKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSkuZGlyZWN0aXZlKCdjcm9wcGVyU291cmNlJywgZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICBsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCAkZWwsIGF0dHJzKSB7XHJcbiAgICAgIHZhciBpZCA9IGF0dHJzLmNyb3BwZXJTb3VyY2U7XHJcbiAgICAgIGlmICghaWQpIHRocm93IG5ldyBFcnJvcignY3JvcHBlciBpZCBpcyByZXF1aXJlZCcpO1xyXG5cclxuICAgICAgdmFyIGZpbGVWYWxpZGF0ZVJlZ2V4ID0gL1xcLihqcGd8cG5nfGdpZnxqcGVnKSQvaTtcclxuICAgICAgdmFyIGZpbGVUeXBlcyA9IGF0dHJzLmNyb3BwZXJGaWxlVHlwZXM7XHJcblxyXG4gICAgICBpZiAoZmlsZVR5cGVzKSB7XHJcbiAgICAgICAgdmFyIHR5cGVzID0gZmlsZVR5cGVzLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgaWYgKHR5cGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGZpbGVWYWxpZGF0ZVJlZ2V4ID0gbmV3IFJlZ0V4cCgnXFwuKCcgKyB0eXBlcy5qb2luKCd8JykgKyAnKSQnLCAnaScpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgJGVsLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGlucHV0ID0gdGhpcztcclxuICAgICAgICB2YXIgY3JvcHBlciA9IGNyb3BwZXJJbnN0YW5jZXNbaWRdO1xyXG5cclxuICAgICAgICB2YXIgZmlsZU5hbWUgPSBpbnB1dC52YWx1ZTtcclxuICAgICAgICBpZiAoIWZpbGVWYWxpZGF0ZVJlZ2V4LnRlc3QoZmlsZU5hbWUpKSB7XHJcbiAgICAgICAgICBjcm9wcGVyLnNldEltYWdlKCk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIEZpbGVSZWFkZXIgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgY3JvcHBlci5zZXRJbWFnZShldmVudC50YXJnZXQucmVzdWx0KTtcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBpZiAoaW5wdXQuZmlsZXMgJiYgaW5wdXQuZmlsZXNbMF0pIHtcclxuICAgICAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoaW5wdXQuZmlsZXNbMF0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpbnB1dC5zZWxlY3QoKTtcclxuICAgICAgICAgIGlucHV0LmJsdXIoKTtcclxuXHJcbiAgICAgICAgICB2YXIgc3JjID0gZG9jdW1lbnQuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKCkudGV4dDtcclxuICAgICAgICAgIGNyb3BwZXIuc2V0SW1hZ2Uoc3JjKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH07XHJcbn0pOyIsInZhciBidWlsZERPTSA9IGZ1bmN0aW9uKGNvbmZpZywgcmVmcykge1xyXG4gIGlmICghY29uZmlnKSByZXR1cm4gbnVsbDtcclxuICB2YXIgZG9tLCBjaGlsZEVsZW1lbnQ7XHJcbiAgaWYgKGNvbmZpZy50YWcpIHtcclxuICAgIGRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoY29uZmlnLnRhZyk7XHJcbiAgICBmb3IgKHZhciBwcm9wIGluIGNvbmZpZykge1xyXG4gICAgICBpZiAoY29uZmlnLmhhc093blByb3BlcnR5KHByb3ApKSB7XHJcbiAgICAgICAgaWYgKHByb3AgPT09ICdjb250ZW50JyB8fCBwcm9wID09PSAndGFnJykgY29udGludWU7XHJcbiAgICAgICAgaWYgKHByb3AgPT09ICdrZXknICYmIHJlZnMpIHtcclxuICAgICAgICAgIHZhciBrZXkgPSBjb25maWdbcHJvcF07XHJcbiAgICAgICAgICBpZiAoa2V5KSB7XHJcbiAgICAgICAgICAgIHJlZnNba2V5XSA9IGRvbTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZG9tW3Byb3BdID0gY29uZmlnW3Byb3BdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB2YXIgY29udGVudCA9IGNvbmZpZy5jb250ZW50O1xyXG4gICAgaWYgKGNvbnRlbnQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGNvbnRlbnQubGVuZ3RoOyBpIDwgajsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGNoaWxkID0gY29udGVudFtpXTtcclxuICAgICAgICBjaGlsZEVsZW1lbnQgPSBidWlsZERPTShjaGlsZCwgcmVmcyk7XHJcbiAgICAgICAgZG9tLmFwcGVuZENoaWxkKGNoaWxkRWxlbWVudCk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIGNoaWxkRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNvbnRlbnQpO1xyXG4gICAgICBkb20uYXBwZW5kQ2hpbGQoY2hpbGRFbGVtZW50KTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGRvbTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYnVpbGRET007IiwidmFyIFJlc2l6ZXIgPSByZXF1aXJlKCcuL1Jlc2l6ZXInKTtcclxudmFyIGJ1aWxkRG9tID0gcmVxdWlyZSgnLi9idWlsZC1kb20nKTtcclxuXHJcbnZhciBibGFua0ltYWdlID0gJ2RhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEFRQUJBSUFBQUFBQUFQLy8veUg1QkFFQUFBQUFMQUFBQUFBQkFBRUFBQUlCUkFBNyc7XHJcblxyXG52YXIgcHJlTG9hZEVsZW1lbnQ7XHJcblxyXG52YXIgaWVWZXJzaW9uID0gTnVtYmVyKGRvY3VtZW50LmRvY3VtZW50TW9kZSk7XHJcblxyXG52YXIgZ2V0SW1hZ2VTaXplID0gZnVuY3Rpb24oc3JjLCBjYWxsYmFjaykge1xyXG4gIGlmIChpZVZlcnNpb24gPCAxMCkge1xyXG4gICAgaWYgKCFwcmVMb2FkRWxlbWVudCkge1xyXG4gICAgICBwcmVMb2FkRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICBwcmVMb2FkRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcbiAgICAgIHByZUxvYWRFbGVtZW50LnN0eWxlLndpZHRoID0gJzFweCc7XHJcbiAgICAgIHByZUxvYWRFbGVtZW50LnN0eWxlLmhlaWdodCA9ICcxcHgnO1xyXG4gICAgICBwcmVMb2FkRWxlbWVudC5zdHlsZS5sZWZ0ID0gJy05OTk5cHgnO1xyXG4gICAgICBwcmVMb2FkRWxlbWVudC5zdHlsZS50b3AgPSAnLTk5OTlweCc7XHJcbiAgICAgIHByZUxvYWRFbGVtZW50LnN0eWxlLmZpbHRlciA9ICdwcm9naWQ6RFhJbWFnZVRyYW5zZm9ybS5NaWNyb3NvZnQuQWxwaGFJbWFnZUxvYWRlcihzaXppbmdNZXRob2Q9aW1hZ2UpJztcclxuICAgICAgZG9jdW1lbnQuYm9keS5pbnNlcnRCZWZvcmUocHJlTG9hZEVsZW1lbnQsIGRvY3VtZW50LmJvZHkuZmlyc3RDaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJlTG9hZEVsZW1lbnQuZmlsdGVycy5pdGVtKCdEWEltYWdlVHJhbnNmb3JtLk1pY3Jvc29mdC5BbHBoYUltYWdlTG9hZGVyJykuc3JjID0gc3JjO1xyXG5cclxuICAgIHZhciBzaXplID0ge1xyXG4gICAgICB3aWR0aDogcHJlTG9hZEVsZW1lbnQub2Zmc2V0V2lkdGgsXHJcbiAgICAgIGhlaWdodDogcHJlTG9hZEVsZW1lbnQub2Zmc2V0SGVpZ2h0XHJcbiAgICB9O1xyXG5cclxuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgY2FsbGJhY2soc2l6ZSk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBzaXplID0ge1xyXG4gICAgICAgIHdpZHRoOiBpbWFnZS53aWR0aCxcclxuICAgICAgICBoZWlnaHQ6IGltYWdlLmhlaWdodFxyXG4gICAgICB9O1xyXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgY2FsbGJhY2soc2l6ZSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBpbWFnZS5zcmMgPSBzcmM7XHJcbiAgfVxyXG59O1xyXG5cclxudmFyIENyb3BwZXIgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcbiAgdmFyIGNyb3BwZXIgPSB0aGlzO1xyXG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBDcm9wcGVyKSkge1xyXG4gICAgY3JvcHBlciA9IG5ldyBDcm9wcGVyKCk7XHJcbiAgfVxyXG4gIGNyb3BwZXIuYXNwZWN0UmF0aW8gPSAxO1xyXG4gIGZvciAodmFyIHByb3AgaW4gb3B0aW9ucykge1xyXG4gICAgaWYgKG9wdGlvbnMuaGFzT3duUHJvcGVydHkocHJvcCkpIGNyb3BwZXJbcHJvcF0gPSBvcHRpb25zW3Byb3BdO1xyXG4gIH1cclxuXHJcbiAgaWYgKGNyb3BwZXIuZWxlbWVudCkge1xyXG4gICAgY3JvcHBlci5yZW5kZXIoY3JvcHBlci5lbGVtZW50KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBjcm9wcGVyO1xyXG59O1xyXG5cclxuQ3JvcHBlci5wcm90b3R5cGUucmVzZXRSZXNpemVyID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHJlc2l6ZXIgPSB0aGlzLnJlc2l6ZXI7XHJcbiAgdmFyIGNyb3BwZXJSZWN0ID0gdGhpcy5jcm9wcGVyUmVjdDtcclxuICB2YXIgYXNwZWN0UmF0aW8gPSB0aGlzLmFzcGVjdFJhdGlvO1xyXG5cclxuICBpZiAodHlwZW9mIGFzcGVjdFJhdGlvICE9PSAnbnVtYmVyJykge1xyXG4gICAgYXNwZWN0UmF0aW8gPSAxO1xyXG4gIH1cclxuXHJcbiAgdmFyIHdpZHRoID0gMTAwO1xyXG4gIHZhciBoZWlnaHQgPSAxMDAgLyBhc3BlY3RSYXRpbztcclxuXHJcbiAgdmFyIHJlc2l6ZXJEb20gPSByZXNpemVyLmRvbTtcclxuICByZXNpemVyRG9tLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xyXG4gIHJlc2l6ZXJEb20uc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcclxuXHJcbiAgaWYgKGNyb3BwZXJSZWN0KSB7XHJcbiAgICByZXNpemVyRG9tLnN0eWxlLmxlZnQgPSAoY3JvcHBlclJlY3Qud2lkdGggLSB3aWR0aCkgLyAyICsgJ3B4JztcclxuICAgIHJlc2l6ZXJEb20uc3R5bGUudG9wID0gKGNyb3BwZXJSZWN0LmhlaWdodCAtIGhlaWdodCkgLyAyICsgJ3B4JztcclxuICB9IGVsc2Uge1xyXG4gICAgcmVzaXplckRvbS5zdHlsZS5sZWZ0ID0gcmVzaXplckRvbS5zdHlsZS50b3AgPSAnJztcclxuICB9XHJcblxyXG4gIHJlc2l6ZXIuZG9PblN0YXRlQ2hhbmdlKCk7XHJcbiAgcmVzaXplci5kb09uRHJhZ0VuZCgpO1xyXG59O1xyXG5cclxuQ3JvcHBlci5wcm90b3R5cGUuc2V0SW1hZ2UgPSBmdW5jdGlvbihzcmMpIHtcclxuICB2YXIgZWxlbWVudCA9IHRoaXMuZWxlbWVudDtcclxuICB2YXIgc291cmNlSW1hZ2UgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2ltZycpO1xyXG4gIHZhciByZXNpemVJbWFnZSA9IHRoaXMucmVmcy5pbWFnZTtcclxuXHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICBpZiAoc3JjID09PSB1bmRlZmluZWQgfHwgc3JjID09PSBudWxsKSB7XHJcbiAgICByZXNpemVJbWFnZS5zcmMgPSBzb3VyY2VJbWFnZS5zcmMgPSBibGFua0ltYWdlO1xyXG4gICAgcmVzaXplSW1hZ2Uuc3R5bGUud2lkdGggPSByZXNpemVJbWFnZS5zdHlsZS5oZWlnaHQgPSByZXNpemVJbWFnZS5zdHlsZS5sZWZ0ID0gcmVzaXplSW1hZ2Uuc3R5bGUudG9wID0gJyc7XHJcbiAgICBzb3VyY2VJbWFnZS5zdHlsZS53aWR0aCA9IHNvdXJjZUltYWdlLnN0eWxlLmhlaWdodCA9IHNvdXJjZUltYWdlLnN0eWxlLmxlZnQgPSBzb3VyY2VJbWFnZS5zdHlsZS50b3AgPSAnJztcclxuXHJcbiAgICBzZWxmLnVwZGF0ZVByZXZpZXcoYmxhbmtJbWFnZSk7XHJcblxyXG4gICAgc2VsZi5kb20uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIHNlbGYucmVzZXRSZXNpemVyKCk7XHJcblxyXG4gICAgc2VsZi5kb20uc3R5bGUubGVmdCA9IHNlbGYuZG9tLnN0eWxlLnRvcCA9ICcnO1xyXG4gICAgc2VsZi5kb20uc3R5bGUud2lkdGggPSBlbGVtZW50Lm9mZnNldFdpZHRoICsgJ3B4JztcclxuICAgIHNlbGYuZG9tLnN0eWxlLmhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0ICsgJ3B4JztcclxuXHJcbiAgICBzZWxmLmNyb3BwZWRSZWN0ID0ge1xyXG4gICAgICB3aWR0aDogMCxcclxuICAgICAgaGVpZ2h0OiAwLFxyXG4gICAgICBsZWZ0OiAwLFxyXG4gICAgICB0b3A6IDBcclxuICAgIH07XHJcblxyXG4gICAgc2VsZi5vbkNyb3BwZWRSZWN0Q2hhbmdlICYmIHNlbGYub25Dcm9wcGVkUmVjdENoYW5nZShzZWxmLmNyb3BwZWRSZWN0KTtcclxuXHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBnZXRJbWFnZVNpemUoc3JjLCBmdW5jdGlvbihzaXplKSB7XHJcbiAgICBpZiAoaWVWZXJzaW9uIDwgMTApIHtcclxuICAgICAgcmVzaXplSW1hZ2Uuc3JjID0gc291cmNlSW1hZ2Uuc3JjID0gYmxhbmtJbWFnZTtcclxuICAgICAgcmVzaXplSW1hZ2Uuc3R5bGUuZmlsdGVyID0gc291cmNlSW1hZ2Uuc3R5bGUuZmlsdGVyID0gJ3Byb2dpZDpEWEltYWdlVHJhbnNmb3JtLk1pY3Jvc29mdC5BbHBoYUltYWdlTG9hZGVyKHNpemluZ01ldGhvZD1zY2FsZSknO1xyXG5cclxuICAgICAgc291cmNlSW1hZ2UuZmlsdGVycy5pdGVtKCdEWEltYWdlVHJhbnNmb3JtLk1pY3Jvc29mdC5BbHBoYUltYWdlTG9hZGVyJykuc3JjID0gc3JjO1xyXG4gICAgICByZXNpemVJbWFnZS5maWx0ZXJzLml0ZW0oJ0RYSW1hZ2VUcmFuc2Zvcm0uTWljcm9zb2Z0LkFscGhhSW1hZ2VMb2FkZXInKS5zcmMgPSBzcmM7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5pbWFnZVNpemUgPSBzaXplO1xyXG5cclxuICAgIHZhciBlbGVtZW50V2lkdGggPSBlbGVtZW50Lm9mZnNldFdpZHRoO1xyXG4gICAgdmFyIGVsZW1lbnRIZWlnaHQgPSBlbGVtZW50Lm9mZnNldEhlaWdodDtcclxuXHJcbiAgICB2YXIgZG9tID0gc2VsZi5kb207XHJcblxyXG4gICAgdmFyIGNyb3BwZXJSZWN0ID0ge307XHJcblxyXG4gICAgaWYgKHNpemUud2lkdGggLyBzaXplLmhlaWdodCA+IGVsZW1lbnRXaWR0aCAvIGVsZW1lbnRIZWlnaHQpIHtcclxuICAgICAgY3JvcHBlclJlY3Qud2lkdGggPSBlbGVtZW50V2lkdGg7XHJcbiAgICAgIGNyb3BwZXJSZWN0LmhlaWdodCA9IGVsZW1lbnRXaWR0aCAqIHNpemUuaGVpZ2h0IC8gc2l6ZS53aWR0aDtcclxuICAgICAgY3JvcHBlclJlY3QudG9wID0gKGVsZW1lbnRIZWlnaHQgLSBjcm9wcGVyUmVjdC5oZWlnaHQpIC8gMjtcclxuICAgICAgY3JvcHBlclJlY3QubGVmdCA9IDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjcm9wcGVyUmVjdC5oZWlnaHQgPSBlbGVtZW50SGVpZ2h0O1xyXG4gICAgICBjcm9wcGVyUmVjdC53aWR0aCA9IGVsZW1lbnRIZWlnaHQgKiBzaXplLndpZHRoIC8gc2l6ZS5oZWlnaHQ7XHJcbiAgICAgIGNyb3BwZXJSZWN0LnRvcCA9IDA7XHJcbiAgICAgIGNyb3BwZXJSZWN0LmxlZnQgPSAoZWxlbWVudFdpZHRoIC0gY3JvcHBlclJlY3Qud2lkdGgpIC8gMjtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLmNyb3BwZXJSZWN0ID0gY3JvcHBlclJlY3Q7XHJcblxyXG4gICAgZm9yICh2YXIgc3R5bGUgaW4gY3JvcHBlclJlY3QpIHtcclxuICAgICAgaWYgKGNyb3BwZXJSZWN0Lmhhc093blByb3BlcnR5KHN0eWxlKSkge1xyXG4gICAgICAgIGRvbS5zdHlsZVtzdHlsZV0gPSBzb3VyY2VJbWFnZS5zdHlsZVtzdHlsZV0gPSByZXNpemVJbWFnZS5zdHlsZVtzdHlsZV0gPSBjcm9wcGVyUmVjdFtzdHlsZV0gKyAncHgnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFpZVZlcnNpb24gfHwgaWVWZXJzaW9uID4gOSkge1xyXG4gICAgICByZXNpemVJbWFnZS5zcmMgPSBzb3VyY2VJbWFnZS5zcmMgPSBzcmM7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5kb20uc3R5bGUuZGlzcGxheSA9ICcnO1xyXG4gICAgc2VsZi5yZXNldFJlc2l6ZXIoKTtcclxuXHJcbiAgICBzZWxmLnVwZGF0ZVByZXZpZXcoc3JjKTtcclxuICB9KTtcclxufTtcclxuXHJcbkNyb3BwZXIucHJvdG90eXBlLmFkZFByZXZpZXcgPSBmdW5jdGlvbihwcmV2aWV3KSB7XHJcbiAgdmFyIHByZXZpZXdzID0gdGhpcy5wcmV2aWV3cztcclxuICBpZiAoIXByZXZpZXdzKSB7XHJcbiAgICBwcmV2aWV3cyA9IHRoaXMucHJldmlld3MgPSBbXTtcclxuICB9XHJcbiAgcHJldmlld3MucHVzaChwcmV2aWV3KTtcclxufTtcclxuXHJcbkNyb3BwZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKGNvbnRhaW5lcikge1xyXG4gIHZhciByZXNpemVyID0gbmV3IFJlc2l6ZXIoeyBhc3BlY3RSYXRpbzogdGhpcy5hc3BlY3RSYXRpbyB9KTtcclxuICB2YXIgcmVmcyA9IHt9O1xyXG5cclxuICB2YXIgZG9tID0gYnVpbGREb20oe1xyXG4gICAgdGFnOiAnZGl2JyxcclxuICAgIGNsYXNzTmFtZTogJ2Nyb3BwZXInLFxyXG4gICAgY29udGVudDogW3tcclxuICAgICAgdGFnOiAnZGl2JyxcclxuICAgICAgY2xhc3NOYW1lOiAnbWFzaydcclxuICAgIH1dXHJcbiAgfSwgcmVmcyk7XHJcblxyXG4gIHZhciByZXNpemVyRG9tID0gcmVzaXplci5yZW5kZXIoZG9tKTtcclxuXHJcbiAgdmFyIGltZyA9IGJ1aWxkRG9tKHtcclxuICAgIHRhZzogJ2RpdicsXHJcbiAgICBjbGFzc05hbWU6ICd3cmFwcGVyJyxcclxuICAgIGNvbnRlbnQ6IFt7XHJcbiAgICAgIHRhZzogJ2ltZycsXHJcbiAgICAgIGtleTogJ2ltYWdlJyxcclxuICAgICAgc3JjOiBibGFua0ltYWdlXHJcbiAgICB9XVxyXG4gIH0sIHJlZnMpO1xyXG5cclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgc2VsZi5yZWZzID0gcmVmcztcclxuXHJcbiAgcmVzaXplci5kb09uU3RhdGVDaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBsZWZ0ID0gcGFyc2VJbnQocmVzaXplckRvbS5zdHlsZS5sZWZ0LCAxMCkgfHwgMDtcclxuICAgIHZhciB0b3AgPSBwYXJzZUludChyZXNpemVyRG9tLnN0eWxlLnRvcCwgMTApIHx8IDA7XHJcblxyXG4gICAgdmFyIGltYWdlID0gcmVmcy5pbWFnZTtcclxuXHJcbiAgICBpbWFnZS5zdHlsZS5sZWZ0ID0gLWxlZnQgKyAncHgnO1xyXG4gICAgaW1hZ2Uuc3R5bGUudG9wID0gLXRvcCArICdweCc7XHJcblxyXG4gICAgc2VsZi51cGRhdGVQcmV2aWV3KCk7XHJcbiAgfTtcclxuXHJcbiAgcmVzaXplci5kb09uRHJhZ0VuZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGxlZnQgPSBwYXJzZUludChyZXNpemVyRG9tLnN0eWxlLmxlZnQsIDEwKSB8fCAwO1xyXG4gICAgdmFyIHRvcCA9IHBhcnNlSW50KHJlc2l6ZXJEb20uc3R5bGUudG9wLCAxMCkgfHwgMDtcclxuICAgIHZhciByZXNpemVyV2lkdGggPSByZXNpemVyRG9tLm9mZnNldFdpZHRoO1xyXG4gICAgdmFyIHJlc2l6ZXJIZWlnaHQgPSByZXNpemVyRG9tLm9mZnNldEhlaWdodDtcclxuXHJcbiAgICB2YXIgaW1hZ2VTaXplID0gc2VsZi5pbWFnZVNpemU7XHJcbiAgICB2YXIgY3JvcHBlclJlY3QgPSBzZWxmLmNyb3BwZXJSZWN0O1xyXG4gICAgaWYgKGNyb3BwZXJSZWN0KSB7XHJcbiAgICAgIHZhciBzY2FsZSA9IGNyb3BwZXJSZWN0LndpZHRoIC8gaW1hZ2VTaXplLndpZHRoO1xyXG5cclxuICAgICAgc2VsZi5jcm9wcGVkUmVjdCA9IHtcclxuICAgICAgICB3aWR0aDogTWF0aC5mbG9vcihyZXNpemVyV2lkdGggLyBzY2FsZSksXHJcbiAgICAgICAgaGVpZ2h0OiBNYXRoLmZsb29yKHJlc2l6ZXJIZWlnaHQgLyBzY2FsZSksXHJcbiAgICAgICAgbGVmdDogTWF0aC5mbG9vcihsZWZ0IC8gc2NhbGUpLFxyXG4gICAgICAgIHRvcDogTWF0aC5mbG9vcih0b3AgLyBzY2FsZSlcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHNlbGYub25Dcm9wcGVkUmVjdENoYW5nZSAmJiBzZWxmLm9uQ3JvcHBlZFJlY3RDaGFuZ2Uoc2VsZi5jcm9wcGVkUmVjdCk7XHJcbiAgICB9XHJcbiAgfTtcclxuICBzZWxmLnJlc2l6ZXIgPSByZXNpemVyO1xyXG4gIHNlbGYuZG9tID0gZG9tO1xyXG5cclxuICByZXNpemVyRG9tLmluc2VydEJlZm9yZShpbWcsIHJlc2l6ZXJEb20uZmlyc3RDaGlsZCk7XHJcblxyXG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkb20pO1xyXG5cclxuICBzZWxmLmRvbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG59O1xyXG5cclxuQ3JvcHBlci5wcm90b3R5cGUudXBkYXRlUHJldmlldyA9IGZ1bmN0aW9uKHNyYykge1xyXG4gIHZhciBpbWFnZVNpemUgPSB0aGlzLmltYWdlU2l6ZTtcclxuICB2YXIgY3JvcHBlclJlY3QgPSB0aGlzLmNyb3BwZXJSZWN0O1xyXG4gIGlmICghaW1hZ2VTaXplIHx8ICFjcm9wcGVyUmVjdCkgcmV0dXJuO1xyXG5cclxuICB2YXIgcHJldmlld3MgPSB0aGlzLnByZXZpZXdzIHx8IFtdO1xyXG5cclxuICB2YXIgcmVzaXplckRvbSA9IHRoaXMucmVzaXplci5kb207XHJcbiAgdmFyIHJlc2l6ZXJMZWZ0ID0gcGFyc2VJbnQocmVzaXplckRvbS5zdHlsZS5sZWZ0LCAxMCkgfHwgMDtcclxuICB2YXIgcmVzaXplclRvcCA9IHBhcnNlSW50KHJlc2l6ZXJEb20uc3R5bGUudG9wLCAxMCkgfHwgMDtcclxuXHJcbiAgdmFyIHJlc2l6ZXJXaWR0aCA9IHJlc2l6ZXJEb20ub2Zmc2V0V2lkdGg7XHJcbiAgdmFyIHJlc2l6ZXJIZWlnaHQgPSByZXNpemVyRG9tLm9mZnNldEhlaWdodDtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBwcmV2aWV3cy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcclxuICAgIHZhciBwcmV2aWV3RWxlbWVudCA9IHByZXZpZXdzW2ldO1xyXG4gICAgdmFyIHByZXZpZXdJbWFnZSA9IHByZXZpZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2ltZycpO1xyXG4gICAgdmFyIHByZXZpZXdXcmFwcGVyID0gcHJldmlld0VsZW1lbnQucXVlcnlTZWxlY3RvcignZGl2Jyk7XHJcblxyXG4gICAgaWYgKCFwcmV2aWV3SW1hZ2UpIGNvbnRpbnVlO1xyXG5cclxuICAgIGlmIChzcmMgPT09IGJsYW5rSW1hZ2UpIHtcclxuICAgICAgcHJldmlld0ltYWdlLnN0eWxlLndpZHRoID0gcHJldmlld0ltYWdlLnN0eWxlLmhlaWdodCA9IHByZXZpZXdJbWFnZS5zdHlsZS5sZWZ0ID0gcHJldmlld0ltYWdlLnN0eWxlLnRvcCA9ICcnO1xyXG4gICAgICBwcmV2aWV3SW1hZ2Uuc3JjID0gYmxhbmtJbWFnZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChpZVZlcnNpb24gPCAxMCkge1xyXG4gICAgICAgIGlmIChzcmMpIHtcclxuICAgICAgICAgIHByZXZpZXdJbWFnZS5zcmMgPSBibGFua0ltYWdlO1xyXG5cclxuICAgICAgICAgIHByZXZpZXdJbWFnZS5zdHlsZS5maWx0ZXIgPSAncHJvZ2lkOkRYSW1hZ2VUcmFuc2Zvcm0uTWljcm9zb2Z0LkFscGhhSW1hZ2VMb2FkZXIoc2l6aW5nTWV0aG9kPXNjYWxlKSc7XHJcbiAgICAgICAgICBwcmV2aWV3SW1hZ2UuZmlsdGVycy5pdGVtKCdEWEltYWdlVHJhbnNmb3JtLk1pY3Jvc29mdC5BbHBoYUltYWdlTG9hZGVyJykuc3JjID0gc3JjO1xyXG4gICAgICAgICAgcHJldmlld0ltYWdlLnN0eWxlLndpZHRoID0gY3JvcHBlclJlY3Qud2lkdGggKyAncHgnO1xyXG4gICAgICAgICAgcHJldmlld0ltYWdlLnN0eWxlLmhlaWdodCA9IGNyb3BwZXJSZWN0LmhlaWdodCArICdweCc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKHNyYykge1xyXG4gICAgICAgIHByZXZpZXdJbWFnZS5zcmMgPSBzcmM7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBlbGVtZW50V2lkdGggPSBwcmV2aWV3RWxlbWVudC5vZmZzZXRXaWR0aDtcclxuICAgICAgdmFyIGVsZW1lbnRIZWlnaHQgPSBwcmV2aWV3RWxlbWVudC5vZmZzZXRIZWlnaHQ7XHJcblxyXG4gICAgICB2YXIgc2NhbGUgPSBlbGVtZW50V2lkdGggLyByZXNpemVyV2lkdGg7XHJcblxyXG4gICAgICBpZiAocHJldmlld1dyYXBwZXIpIHtcclxuICAgICAgICB2YXIgZWxlbWVudFJhdGlvID0gZWxlbWVudFdpZHRoIC8gZWxlbWVudEhlaWdodDtcclxuICAgICAgICB2YXIgcmVzaXplclJhdGlvID0gcmVzaXplcldpZHRoIC8gcmVzaXplckhlaWdodDtcclxuXHJcbiAgICAgICAgaWYgKGVsZW1lbnRSYXRpbyA8IHJlc2l6ZXJSYXRpbykge1xyXG4gICAgICAgICAgcHJldmlld1dyYXBwZXIuc3R5bGUud2lkdGggPSBlbGVtZW50V2lkdGggKyAncHgnO1xyXG4gICAgICAgICAgcHJldmlld1dyYXBwZXIuc3R5bGUuaGVpZ2h0ID0gcmVzaXplckhlaWdodCAqIGVsZW1lbnRXaWR0aCAvIHJlc2l6ZXJXaWR0aCArICdweCc7XHJcbiAgICAgICAgICBwcmV2aWV3V3JhcHBlci5zdHlsZS50b3AgPSAoZWxlbWVudEhlaWdodCAtIHByZXZpZXdXcmFwcGVyLmNsaWVudEhlaWdodCkgLyAyICsgJ3B4JztcclxuICAgICAgICAgIHByZXZpZXdXcmFwcGVyLnN0eWxlLmxlZnQgPSAnJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdmFyIHZpc2libGVXaWR0aCA9IHJlc2l6ZXJXaWR0aCAqIGVsZW1lbnRIZWlnaHQgLyByZXNpemVySGVpZ2h0O1xyXG4gICAgICAgICAgc2NhbGUgPSB2aXNpYmxlV2lkdGggLyByZXNpemVyV2lkdGg7XHJcbiAgICAgICAgICBwcmV2aWV3V3JhcHBlci5zdHlsZS5oZWlnaHQgPSBlbGVtZW50SGVpZ2h0ICsgJ3B4JztcclxuICAgICAgICAgIHByZXZpZXdXcmFwcGVyLnN0eWxlLndpZHRoID0gdmlzaWJsZVdpZHRoICsgJ3B4JztcclxuICAgICAgICAgIHByZXZpZXdXcmFwcGVyLnN0eWxlLmxlZnQgPSAoZWxlbWVudFdpZHRoIC0gcHJldmlld1dyYXBwZXIuY2xpZW50V2lkdGgpIC8gMiArICdweCc7XHJcbiAgICAgICAgICBwcmV2aWV3V3JhcHBlci5zdHlsZS50b3AgPSAnJztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHByZXZpZXdJbWFnZS5zdHlsZS53aWR0aCA9IHNjYWxlICogY3JvcHBlclJlY3Qud2lkdGggKyAncHgnO1xyXG4gICAgICBwcmV2aWV3SW1hZ2Uuc3R5bGUuaGVpZ2h0ID0gc2NhbGUgKiBjcm9wcGVyUmVjdC5oZWlnaHQgKyAncHgnO1xyXG4gICAgICBwcmV2aWV3SW1hZ2Uuc3R5bGUubGVmdCA9IC1yZXNpemVyTGVmdCAqIHNjYWxlICsgJ3B4JztcclxuICAgICAgcHJldmlld0ltYWdlLnN0eWxlLnRvcCA9IC1yZXNpemVyVG9wICogc2NhbGUgKyAncHgnO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ3JvcHBlcjsiLCJ2YXIgYmluZCA9IGZ1bmN0aW9uKGVsZW1lbnQsIGV2ZW50LCBmbikge1xyXG4gIGlmIChlbGVtZW50LmF0dGFjaEV2ZW50KSB7XHJcbiAgICBlbGVtZW50LmF0dGFjaEV2ZW50KCdvbicgKyBldmVudCwgZm4pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGZuLCBmYWxzZSk7XHJcbiAgfVxyXG59O1xyXG5cclxudmFyIHVuYmluZCA9IGZ1bmN0aW9uKGVsZW1lbnQsIGV2ZW50LCBmbikge1xyXG4gIGlmIChlbGVtZW50LmRldGFjaEV2ZW50KSB7XHJcbiAgICBlbGVtZW50LmRldGFjaEV2ZW50KCdvbicgKyBldmVudCwgZm4pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGZuKTtcclxuICB9XHJcbn07XHJcblxyXG52YXIgaXNEcmFnZ2luZyA9IGZhbHNlO1xyXG5cclxudmFyIGlzSUU4ID0gTnVtYmVyKGRvY3VtZW50LmRvY3VtZW50TW9kZSkgPCA5O1xyXG5cclxudmFyIGZpeEV2ZW50ID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICB2YXIgc2Nyb2xsVG9wID0gTWF0aC5tYXgod2luZG93LnNjcm9sbFkgfHwgMCwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCB8fCAwKTtcclxuICB2YXIgc2Nyb2xsTGVmdCA9IE1hdGgubWF4KHdpbmRvdy5zY3JvbGxYIHx8IDAsIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0IHx8IDApO1xyXG5cclxuICBldmVudC50YXJnZXQgPSBldmVudC5zcmNFbGVtZW50O1xyXG4gIGV2ZW50LnBhZ2VYID0gc2Nyb2xsTGVmdCArIGV2ZW50LmNsaWVudFg7XHJcbiAgZXZlbnQucGFnZVkgPSBzY3JvbGxUb3AgKyBldmVudC5jbGllbnRZO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihlbGVtZW50LCBvcHRpb25zKSB7XHJcbiAgdmFyIG1vdmVGbiA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICBpZiAoaXNJRTgpIHtcclxuICAgICAgZml4RXZlbnQoZXZlbnQpO1xyXG4gICAgfVxyXG4gICAgaWYgKG9wdGlvbnMuZHJhZykge1xyXG4gICAgICBvcHRpb25zLmRyYWcoZXZlbnQpO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgdmFyIHVwRm4gPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgaWYgKGlzSUU4KSB7XHJcbiAgICAgIGZpeEV2ZW50KGV2ZW50KTtcclxuICAgIH1cclxuICAgIHVuYmluZChkb2N1bWVudCwgJ21vdXNlbW92ZScsIG1vdmVGbik7XHJcbiAgICB1bmJpbmQoZG9jdW1lbnQsICdtb3VzZXVwJywgdXBGbik7XHJcbiAgICBkb2N1bWVudC5vbnNlbGVjdHN0YXJ0ID0gbnVsbDtcclxuICAgIGRvY3VtZW50Lm9uZHJhZ3N0YXJ0ID0gbnVsbDtcclxuXHJcbiAgICBpc0RyYWdnaW5nID0gZmFsc2U7XHJcblxyXG4gICAgaWYgKG9wdGlvbnMuZW5kKSB7XHJcbiAgICAgIG9wdGlvbnMuZW5kKGV2ZW50KTtcclxuICAgIH1cclxuICB9O1xyXG4gIGJpbmQoZWxlbWVudCwgJ21vdXNlZG93bicsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICBpZiAoaXNJRTgpIHtcclxuICAgICAgZml4RXZlbnQoZXZlbnQpO1xyXG4gICAgfVxyXG4gICAgaWYgKGlzRHJhZ2dpbmcpIHJldHVybjtcclxuICAgIGRvY3VtZW50Lm9uc2VsZWN0c3RhcnQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGZhbHNlOyB9O1xyXG4gICAgZG9jdW1lbnQub25kcmFnc3RhcnQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGZhbHNlOyB9O1xyXG5cclxuICAgIGJpbmQoZG9jdW1lbnQsICdtb3VzZW1vdmUnLCBtb3ZlRm4pO1xyXG4gICAgYmluZChkb2N1bWVudCwgJ21vdXNldXAnLCB1cEZuKTtcclxuICAgIGlzRHJhZ2dpbmcgPSB0cnVlO1xyXG5cclxuICAgIGlmIChvcHRpb25zLnN0YXJ0KSB7XHJcbiAgICAgIG9wdGlvbnMuc3RhcnQoZXZlbnQpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59OyIsIndpbmRvdy5Dcm9wcGVyID0gcmVxdWlyZSgnLi9jcm9wcGVyJyk7IiwiaWYgKHR5cGVvZiBhbmd1bGFyICE9PSAndW5kZWZpbmVkJykge1xyXG4gIHJlcXVpcmUoJy4vYW5ndWxhcicpO1xyXG59IGVsc2Uge1xyXG4gIHJlcXVpcmUoJy4vZXhwb3J0Jyk7XHJcbn1cclxuXHJcbiJdfQ==
