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

    function _init( inCanvas, inOptions ) {
        var container = inCanvas.parentNode;

        if (inOptions) {
            _options = _extend(_options, inOptions);    
        }
        
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
                // ease: Math.random() * 0.1 + 0.4
                ease: 0.5 + i*0.005
            });//Math.random() * 0.1 + 0.2});
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
                _strokeStart(event.pageX - _canvas.offsetLeft, event.pageY  - _canvas.offsetTop);
                _canvas.addEventListener('mousemove', onCanvasMouseMove, false);
                _canvas.addEventListener('mouseup',   onCanvasMouseUp, false);
            },
            onCanvasMouseMove = function(event) {    
                _stroke(event.pageX - _canvas.offsetLeft, event.pageY  - _canvas.offsetTop);
            },
            onCanvasMouseUp = function() {
                _strokeEnd();
                _canvas.removeEventListener('mousemove', onCanvasMouseMove, false);
                _canvas.removeEventListener('mouseup',   onCanvasMouseUp,   false);
            },
            onCanvasTouchStart = function(event) {
                if(event.touches.length == 1) {
                    event.preventDefault();
                    
                    _strokeStart( event.touches[0].pageX, event.touches[0].pageY );
                    
                    _canvas.addEventListener('touchmove', onCanvasTouchMove, false);
                    _canvas.addEventListener('touchend', onCanvasTouchEnd, false);
                }
            },
            onCanvasTouchMove = function(event) {
                if(event.touches.length == 1) {
                    event.preventDefault();
                    _stroke( event.touches[0].pageX, event.touches[0].pageY );
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

    _init(inCanvas, inOptions);
}
 
