function RealisticPen( context ){
    this.init( context );
}

RealisticPen.prototype = {
    context: null,
    mouseX: null, 
    mouseY: null,
    painters: null,
    interval: null,
    canvas: null,
    penColor: [0, 0, 0],
    brushPressure: 1,
    brushSize: 3,
    canvasDefWidth: '200',
    canvasDefHeight: 200,

    init: function( canvas ) {
        var scope = this, 
            container = canvas.parentNode;
        
        canvas.width    = container.offsetWidth ? container.offsetWidth : this.canvasDefWidth;
        canvas.height   = container.offsetHeight ? container.offsetHeight : this.canvasDefHeight;

        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.attachEventListeners();

        this.context.globalCompositeOperation = 'source-over';
        this.mouseX = this.canvas.width / 2;
        this.mouseY = this.canvas.height / 2;
        this.painters = [];
        for (var i = 0; i < 50; i++) {
            this.painters.push({ 
                dx: this.canvas.width / 2, 
                dy: this.canvas.height / 2, 
                ax: 0, 
                ay: 0, 
                div: 0.1, 
                ease: 0.5
            });//Math.random() * 0.1 + 0.2});
        }
        this.interval = setInterval(update, 1000/60);
        function update() {
            var i;
            scope.context.lineWidth = scope.brushSize;            
            scope.context.strokeStyle =  "rgba(" + scope.penColor[0] + ", " + scope.penColor[1] + ", " + scope.penColor[2] + ", " + 0.05 * scope.brushPressure + ")";
            for (i = 0; i < scope.painters.length; i++) {
                scope.context.beginPath();
                scope.context.moveTo(scope.painters[i].dx, scope.painters[i].dy);        
                scope.painters[i].dx -= scope.painters[i].ax = (scope.painters[i].ax + (scope.painters[i].dx - scope.mouseX) * scope.painters[i].div) * scope.painters[i].ease;
                scope.painters[i].dy -= scope.painters[i].ay = (scope.painters[i].ay + (scope.painters[i].dy - scope.mouseY) * scope.painters[i].div) * scope.painters[i].ease;
                scope.context.lineTo(scope.painters[i].dx, scope.painters[i].dy);
                scope.context.stroke();
            }
        }
    },

    destroy: function() {
        clearInterval(this.interval);
    },

    strokeStart: function(mouseX, mouseY) {
        this.mouseX = mouseX;
        this.mouseY = mouseY;
        for (var i = 0; i < this.painters.length; i++) {
            this.painters[i].dx = mouseX;
            this.painters[i].dy = mouseY;
        }
        this.shouldDraw = true;
    },

    stroke: function( mouseX, mouseY ) {
        this.mouseX = mouseX;
        this.mouseY = mouseY;
    },

    strokeEnd: function() {
    
    },


    attachEventListeners: function() {
        var scope = this,
            onCanvasMouseDown = function(event) {
                scope.strokeStart( event.clientX, event.clientY );
                window.addEventListener('mousemove', onCanvasMouseMove, false);
                window.addEventListener('mouseup',   onCanvasMouseUp, false);
            },
            onCanvasMouseMove = function(event) {    
                scope.stroke(event.clientX, event.clientY);
            },
            onCanvasMouseUp = function() {
                scope.strokeEnd();
                window.removeEventListener('mousemove', onCanvasMouseMove, false);
                window.removeEventListener('mouseup',   onCanvasMouseUp,   false);
            },
            onCanvasTouchStart = function(event) {
                if(event.touches.length == 1) {
                    event.preventDefault();
                    
                    scope.strokeStart( event.touches[0].pageX, event.touches[0].pageY );
                    
                    window.addEventListener('touchmove', onCanvasTouchMove, false);
                    window.addEventListener('touchend', onCanvasTouchEnd, false);
                }
            },
            onCanvasTouchMove = function(event) {
                if(event.touches.length == 1) {
                    event.preventDefault();
                    scope.stroke( event.touches[0].pageX, event.touches[0].pageY );
                }
            },
            onCanvasTouchEnd = function(event) {
                if(event.touches.length === 0) {
                    event.preventDefault();
                    
                    scope.strokeEnd();

                    window.removeEventListener('touchmove', onCanvasTouchMove, false);
                    window.removeEventListener('touchend', onCanvasTouchEnd, false);
                }
            };

        this.canvas.addEventListener('mousedown', onCanvasMouseDown, false);
        this.canvas.addEventListener('touchstart', onCanvasTouchStart, false);
    }
};

