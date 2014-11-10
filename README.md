canvas-realistic-pen
====================

Library  for smooth pen-like drawing on canvas written in vanilla JavaScript
-----------------------------------------------

![screenshot](screenshot.png)

[Demo](http://dev-eu.rrs-lab.com/demo/canvas-realistic-pen/realistic-pen.html)

This is refactored and enhanced version of code taken from this post: http://stackoverflow.com/a/10661872/2248909

Installation
------------
```
bower install canvas-realistic-pen --save
```

Authors: 
--------
  - mrdob.com
  - Alex <http://stackoverflow.com/users/873836/alex>
  - Alexey Pedyashev

Options:
--------
  - penColor       -  Color of the pen. Allowed formats: 
                    Array - [0, 0, 0], Hex - #ccc, #cfc4c1, rgb(1, 2, 3), rgba(1, 2, 3, 0)
  - brushSize:     - widht of line

Interface:
----------
  - destroy()                           - destroys the pen
  - setPenColor(inColor)                - sets penColor 
  - setBrushSize(inBrushSize)           - sets brushSize

Example:
--------
```JavaScript
  var canvas          = document.getElementById('draw-canvas');
  brush = new RealisticPen(canvas, {
      penColor: [217, 101, 110],
      brushSize: 3 
  });
  brush.setPenColor('#cfa');
  brush.setBrushSize(5);
```

Version History
===============

1.0.0
-----
  - Fixed aliasing problem
  - Removed following API methods:
    * setBrushesCount()
    * brushPressure()
  - Removed config options:
    * brushesCount
    * brushPressure

0.0.2
-----
  Added canvas resizing on window resize

0.0.1
-----
First release


