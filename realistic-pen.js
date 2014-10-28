/**
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
*   brushPressure: - opacity of line
*   brushSize:     - widht of line
*   brushesCount   - Count of lines that will be used to draw
*
* Interface:
*   destroy()                           - destroys the pen
*   setPenColor(inColor)                - sets penColor 
*   setBrushPressure(inBrushPressure)   - sets brushPressure
*   setBrushSize(inBrushSize)           - sets brushSize
*   setBrushesCount(inBrushesCount)     - sets brushesCount
*
* Example:
*   var canvas          = document.getElementById('draw-canvas');
*   brush = new RealisticPen(canvas, {
*       penColor: [217, 101, 110],
*       brushPressure: 1,
*       brushSize: 3,
*       brushesCount: 5
*   });
*
*/
function RealisticPen(inCanvas, inOptions) {
    var _context = null,
        _mouseX = null, 
        _mouseY = null,
        _painters = null,
        _updateInterval = null,
        _canvas = null,
        _canvasDefWidth = 200,
        _canvasDefHeight = 200,
        _options = {
            penColor: [0, 0, 0],
            brushPressure: 1,
            brushSize: 3,
            brushesCount: 4
        };

    this.destroy = function() {
        clearInterval(_updateInterval);
    };

    this.setPenColor = function(inColor) {
        _options.penColor = _ensureRgb(inColor);
    };

    this.setBrushPressure = function(inBrushPressure) {
        _options.brushPressure = inBrushPressure;
    };

    this.setBrushSize = function(inBrushSize) {
        _options.brushSize = inBrushSize;
    };

    this.setBrushesCount = function(inBrushesCount) {
        _options.brushesCount = inBrushesCount;
    };


    function _init( inCanvas, inOptions ) {
        var container = inCanvas.parentNode;

        if (inOptions) {
            _options = _extend(_options, inOptions);    
        }

        _options.penColor = _ensureRgb(_options.penColor);
        
        inCanvas.width    = container.offsetWidth ? container.offsetWidth : _canvasDefWidth;
        inCanvas.height   = container.offsetHeight ? container.offsetHeight : _canvasDefHeight;

        _canvas  = inCanvas;
        _context = _canvas.getContext("2d");

        _attachEventListeners();

        _context.globalCompositeOperation = 'source-over';
        _mouseX = _canvas.width / 2;
        _mouseY = _canvas.height / 2;
        _painters = [];
        for (var i = 0; i < _options.brushesCount; i++) {
            _painters.push({ 
                dx: _canvas.width / 2, 
                dy: _canvas.height / 2, 
                ax: 0, 
                ay: 0, 
                div: 0.1, 
                ease: 0.5 + i*0.005
            }); 
        }
        _updateInterval = setInterval(update, 1000/60);
        function update() {
            var i;
            _context.lineWidth = _options.brushSize;            
            _context.strokeStyle =  "rgba(" + _options.penColor[0] + ", " + 
                _options.penColor[1] + ", " + _options.penColor[2] + ",  " + _options.brushPressure + ")";
            for (i = 0; i < _painters.length; i++) {
                _context.beginPath();
                _context.moveTo(_painters[i].dx, _painters[i].dy);        
                _painters[i].dx -= _painters[i].ax = (_painters[i].ax + (_painters[i].dx - _mouseX) * _painters[i].div) * _painters[i].ease;
                _painters[i].dy -= _painters[i].ay = (_painters[i].ay + (_painters[i].dy - _mouseY) * _painters[i].div) * _painters[i].ease;
                _context.lineTo(_painters[i].dx, _painters[i].dy);
                _context.stroke();
            }
        }
    }

    function _strokeStart(mouseX, mouseY) {
        _mouseX = mouseX;
        _mouseY = mouseY;
        for (var i = 0; i < _painters.length; i++) {
            _painters[i].dx = mouseX;
            _painters[i].dy = mouseY;
        }
    }

    function _stroke( mouseX, mouseY ) {
        _mouseX = mouseX;
        _mouseY = mouseY;
    }

    function _strokeEnd() {
    
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
            onCanvasMouseUp = function() {
                _strokeEnd();
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
            };

        _canvas.addEventListener('mousedown', onCanvasMouseDown, false);
        _canvas.addEventListener('touchstart', onCanvasTouchStart, false);
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
                return obj != null && obj === obj.window;
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
 
