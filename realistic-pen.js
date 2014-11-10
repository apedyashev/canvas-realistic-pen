/**
* canvas-realistic-pen@1.0.0
*
* Library for smooth pen-like drawing on canvas
* 
* This is refactored and enhanced version of code taken from this post: http://stackoverflow.com/a/10661872/2248909
*
* Authors: 
*   - mrdob.com
*   - Alex <http://stackoverflow.com/users/873836/alex>
*   - Alexey Pedyashev
* 
* Options:
*   penColor       -  Color of the pen. Allowed formats: 
*                     Array - [0, 0, 0], Hex - #ccc, #cfc4c1, rgb(1, 2, 3), rgba(1, 2, 3, 0)
*   brushSize:     - widht of line
*
* Interface:
*   destroy()                           - destroys the pen
*   setPenColor(inColor)                - sets penColor 
*   setBrushSize(inBrushSize)           - sets brushSize
*
* Example:
*   var canvas          = document.getElementById('draw-canvas');
*   brush = new RealisticPen(canvas, {
*       penColor: [217, 101, 110],
*       brushSize: 3,
*   });
*
*/
function RealisticPen(inCanvas, inOptions) {
    var _context = null,
        _mouseX = null, 
        _mouseY = null,
        _mouseXStart = null,
        _mouseYStart = null,
        _prevCoords = {
            x: null,
            y: null
        },
        _currentDelta = null,
        _painters = null,
        _updateInterval = null,
        _canvas = null,
        _container = null,
        _canvasDefWidth = 200,
        _canvasDefHeight = 200,
        _options = {
            penColor: [0, 0, 0],
            brushSize: 3
        },
        _brushSizes = {
          1: 4.5, 
          2: 4.25, 
          3: 4, 
          4: 3.75, 
          5: 3.5, 
          6: 3.25, 
          7: 3, 
          8: 2.75, 
          9: 2.5, 
          10: 2.25, 
          11: 2.2, 
          12: 2.15, 
          13: 2.1, 
          14: 2.05, 
          15: 2, 
          16: 1.95, 
          17: 1.9, 
          18: 1.85,  
          19: 1.8,  
          20: 1.75, 
          21: 1.7, 
          22: 1.65, 
          23: 1.6, 
          24: 1.55, 
          25: 1.5, 
          26: 1.48, 
          27: 1.46, 
          28: 1.44, 
          29: 1.42, 
          30: 1.4, 
          31: 1.38, 
          32: 1.36,  
          33: 1.34, 
          34: 1.32, 
          35: 1.3, 
          36: 1.28, 
          37: 1.26, 
          38: 1.24, 
          39: 1.22, 
          40: 1.2, 
          41: 1.18, 
          42: 1.16, 
          43: 1.14, 
          44: 1.12, 
          45: 1.1, 
          46: 1.08, 
          47: 1.06,  
          48: 1.04, 
          49: 1.02, 
          50: 1
      };

    this.destroy = function() {
        clearInterval(_updateInterval);
    };

    this.setPenColor = function(inColor) {
        _options.penColor = _ensureRgb(inColor);
    };

    this.setBrushSize = function(inBrushSize) {
        _options.brushSize = inBrushSize;
    };

    function _init( inCanvas, inOptions ) {
        _container = inCanvas.parentNode;

        if (inOptions) {
            _options = _extend(_options, inOptions);    
        }

        _options.penColor = _ensureRgb(_options.penColor);
        
        

        _canvas  = inCanvas;
        _context = _canvas.getContext("2d");

        _attachEventListeners();

        _context.globalCompositeOperation = 'source-over';
        _mouseX = _canvas.width / 2;
        _mouseY = _canvas.height / 2;
        _painters = [];

        for (var i = 0; i < 1; i++) {
            _painters.push({ 
                dx: _canvas.width / 2, 
                dy: _canvas.height / 2, 
                ax: 0, 
                ay: 0, 
                div: 0.08,
                ease: 0.7
            }); 
        }

        _updateInterval = setInterval(update, 1000/90);
        
        function makeStrokeStyle(inOpacity){
            var opacity = inOpacity ? inOpacity : 1;
            return "rgba(" + _options.penColor[0] + ", " + 
                _options.penColor[1] + ", " + _options.penColor[2] + ",  " + opacity + ")";
        }

        var maxLineWidht = 0;//Math.max.apply(null, _brushSizes);
        for(var key in _brushSizes) {
            maxLineWidht = Math.max(maxLineWidht, _brushSizes[key]);
        }

        function update() {
            var i,
                lineWidth = _brushSizes[_currentDelta] + _options.brushSize / maxLineWidht;
                // console.log(lineWidth);

            for (i = 0; i < _painters.length; i++) {
                _context.beginPath();

                var xPrev = _painters[i].dx,
                    yPrev = _painters[i].dy;

                _painters[i].ax = (_painters[i].ax + (_painters[i].dx - _mouseX) * _painters[i].div) * _painters[i].ease;
                _painters[i].dx -= _painters[i].ax;
                _painters[i].ay = (_painters[i].ay + (_painters[i].dy - _mouseY) * _painters[i].div) * _painters[i].ease;
                _painters[i].dy -= _painters[i].ay;

                // draw background line with opacity to smooth primaary line's edges 
                _context.strokeStyle =  makeStrokeStyle(0.35);
                _context.lineWidth = lineWidth + 2;
                _context.lineCap    = 'butt'; 
                _context.lineJoin   = 'miter';

                _context.moveTo(xPrev, yPrev); 
                _context.lineTo(_painters[i].dx, _painters[i].dy);
                _context.stroke();
                

                //draw primary line without opacity
                _context.strokeStyle =  makeStrokeStyle(1);
                _context.lineWidth = lineWidth;
                _context.lineCap    = 'round'; 
                _context.lineJoin   = 'round';

                _context.moveTo(xPrev, yPrev);
                _context.lineTo(_painters[i].dx, _painters[i].dy);
                _context.stroke();
            }
        }
    }

    function _strokeStart(mouseX, mouseY) {
        _mouseXStart = _mouseX = mouseX;
        _mouseYStart = _mouseY = mouseY;
        for (var i = 0; i < _painters.length; i++) {
            _painters[i].dx = mouseX;
            _painters[i].dy = mouseY;
        }

        
    }

    function _stroke( mouseX, mouseY ) {
        _prevCoords.x = _mouseX;
        _prevCoords.y = _mouseY;

        _mouseX = mouseX;
        _mouseY = mouseY;


        var delta = Math.abs(_prevCoords.x - _mouseX);
        if ((_currentDelta !== null) && (2 <= Math.abs(_currentDelta - delta))) {
             _currentDelta = (_currentDelta < delta) ? (_currentDelta + 1) : (_currentDelta - 1); 
        }
        else {
            _currentDelta = delta;
        }
    }

    function _strokeEnd(mouseX, mouseY) {
        if ((_mouseXStart === mouseX) && (_mouseYStart === mouseY) ){ 
            var i,
                radius = _options.brushSize / 2;
            for (i = 0; i < _painters.length; i++) {
                _context.beginPath();
                _context.arc(mouseX, mouseY, radius, 0, 2 * Math.PI, false);
                _context.fillStyle = _context.strokeStyle;
                _context.fill();
                _context.lineWidth = 1;
                _context.strokeStyle = _context.strokeStyle;
                _context.stroke();
            }
        }
    }

    function _attachEventListeners() {
        var onCanvasMouseDown = function(event) {
                var canvasOffset = _offset(_canvas);
                _strokeStart(event.pageX - canvasOffset.left, event.pageY  - canvasOffset.top);
                _canvas.addEventListener('mousemove', onCanvasMouseMove, false);
                _canvas.addEventListener('mouseup',   onCanvasMouseUp, false);
            },
            onCanvasMouseMove = function(event) {  
                var canvasOffset = _offset(_canvas);  
                _stroke(event.pageX - canvasOffset.left, event.pageY  - canvasOffset.top);
            },
            onCanvasMouseUp = function(event) {
                var canvasOffset = _offset(_canvas); 
                _strokeEnd(event.pageX - canvasOffset.left, event.pageY  - canvasOffset.top);
                _canvas.removeEventListener('mousemove', onCanvasMouseMove, false);
                _canvas.removeEventListener('mouseup',   onCanvasMouseUp,   false);
            },
            onCanvasTouchStart = function(event) {
                if(event.touches.length == 1) {
                    event.preventDefault();
                    
                    var canvasOffset = _offset(_canvas);
                    _strokeStart( event.touches[0].pageX - canvasOffset.left, event.touches[0].pageY  - canvasOffset.top);
                    
                    _canvas.addEventListener('touchmove', onCanvasTouchMove, false);
                    _canvas.addEventListener('touchend', onCanvasTouchEnd, false);
                }
            },
            onCanvasTouchMove = function(event) {
                if(event.touches.length == 1) {
                    event.preventDefault();

                    var canvasOffset = _offset(_canvas);
                    _stroke( event.touches[0].pageX - canvasOffset.left, event.touches[0].pageY  - canvasOffset.top);
                }
            },
            onCanvasTouchEnd = function(event) {
                if(event.touches.length === 0) {
                    event.preventDefault();
                    
                    _strokeEnd();

                    _canvas.removeEventListener('touchmove', onCanvasTouchMove, false);
                    _canvas.removeEventListener('touchend', onCanvasTouchEnd, false);
                }
            },
            onCanvasResize = function() {
                _canvas.width    = _container.offsetWidth ? _container.offsetWidth : _canvasDefWidth;
                _canvas.height   = _container.offsetHeight ? _container.offsetHeight : _canvasDefHeight;
            };

        _canvas.addEventListener('mousedown', onCanvasMouseDown, false);
        _canvas.addEventListener('touchstart', onCanvasTouchStart, false);
        window.addEventListener('resize', onCanvasResize, false);

        onCanvasResize();
    }

    function _extend(object, properties) {
        var key, val;
        if (!object) {
            object = {};
        }
        if (!properties) {
            properties = {};
        }
        for (key in properties) {
            val = properties[key];
            object[key] = val;
        }
        return object;
    }

    function _ensureRgb(color){
        var colorsArray = [0, 0, 0];
        if (/^#./.test(color)) {
            colorsArray = _hexToRgbArray(color);
        }
        else if (/^rgb\(./.test(color)) {
            colorsArray = color.substring(4, color.length-1)
                 .replace(/ /g, '')
                 .split(',');
        }
        else if (/^rgba\(./.test(color)) {
            colorsArray = color.substring(5, color.length-1)
                 .replace(/ /g, '')
                 .split(',');
            colorsArray.pop();
        }
        else if(Object.prototype.toString.call( color ) === '[object Array]' ) {
            colorsArray = color;
        }

        return colorsArray;
    }

    function _hexToRgbArray(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0];
    }

    function _offset(elem) {
        var docElem, win,
            box = { top: 0, left: 0 },
            doc = elem && elem.ownerDocument,
            isWindow = function( obj ) {
                return obj !== null && obj === obj.window;
            },
            getWindow = function ( elem ) {
                return isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
            };

        if (!doc) {
            return;
        }

        docElem = doc.documentElement;

        if ( typeof elem.getBoundingClientRect !== typeof undefined ) {
            box = elem.getBoundingClientRect();
        }
        win = getWindow( doc );
        return {
            top: box.top + win.pageYOffset - docElem.clientTop,
            left: box.left + win.pageXOffset - docElem.clientLeft
        };
    }

    _init(inCanvas, inOptions);
}
 
