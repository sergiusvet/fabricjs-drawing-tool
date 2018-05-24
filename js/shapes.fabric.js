// Draw Line
let Line = (function() {
    function Line(canvas) {
        this.canvas = canvas;
        this.isDrawing = false;
        this.bindEvents();
    }

    Line.prototype.bindEvents = function() {
        let inst = this;
        inst.canvas.on('mouse:down', function(o) {
            inst.onMouseDown(o);
        });
        inst.canvas.on('mouse:move', function(o) {
            inst.onMouseMove(o);
        });
        inst.canvas.on('mouse:up', function(o) {
            inst.onMouseUp(o);
        });
        inst.canvas.on('object:moving', function(o) {
            inst.disable();
        })
    }

    Line.prototype.onMouseUp = function(o) {
        let inst = this;
        if (inst.isEnable()) {
            inst.disable();
        }
    };

    Line.prototype.onMouseMove = function(o) {
        let inst = this;
        if (!inst.isEnable()) {
            return;
        }

        let pointer = inst.canvas.getPointer(o.e);
        let activeObj = inst.canvas.getActiveObject();

        activeObj.set({
            x2: pointer.x,
            y2: pointer.y
        });
        activeObj.setCoords();
        inst.canvas.renderAll();
    };

    Line.prototype.onMouseDown = function(o) {
        let inst = this;
        inst.enable();

        let pointer = inst.canvas.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;

        let points = [pointer.x, pointer.y, pointer.x, pointer.y];
        let line = new fabric.Line(points, {
            strokeWidth: 5,
            stroke: inst.canvas.freeDrawingBrush.color,
            fill: inst.canvas.freeDrawingBrush.color,
            originX: 'center',
            originY: 'center',
            selectable: false,
            hasBorders: false,
            hasControls: false
        });
        inst.canvas.add(line).setActiveObject(line);
    };

    Line.prototype.isEnable = function() {
        return this.isDrawing;
    }

    Line.prototype.enable = function() {
        this.isDrawing = true;
    }

    Line.prototype.disable = function() {
        this.isDrawing = false;
    }

    return Line;
}());
// Draw Circle
let Circle = (function() {
    function Circle(canvas) {
        this.canvas = canvas;
        this.className = 'Circle';
        this.isDrawing = false;
        this.bindEvents();
    }

    Circle.prototype.bindEvents = function() {
        let inst = this;
        inst.canvas.on('mouse:down', function(o) {
            inst.onMouseDown(o);
        });
        inst.canvas.on('mouse:move', function(o) {
            inst.onMouseMove(o);
        });
        inst.canvas.on('mouse:up', function(o) {
            inst.onMouseUp(o);
        });
        inst.canvas.on('object:moving', function(o) {
            inst.disable();
        })
    }

    Circle.prototype.onMouseUp = function(o) {
        let inst = this;
        inst.disable();
    };

    Circle.prototype.onMouseMove = function(o) {
        let inst = this;
        if (!inst.isEnable()) {
            return;
        }

        let pointer = inst.canvas.getPointer(o.e);
        let activeObj = inst.canvas.getActiveObject();

        activeObj.stroke = inst.canvas.freeDrawingBrush.color,
        activeObj.strokeWidth = 5;
        activeObj.fill = 'transparent';

        if (origX > pointer.x) {
            activeObj.set({
                left: Math.abs(pointer.x)
            });
        }

        if (origY > pointer.y) {
            activeObj.set({
                top: Math.abs(pointer.y)
            });
        }

        activeObj.set({
            rx: Math.abs(origX - pointer.x) / 2
        });
        activeObj.set({
            ry: Math.abs(origY - pointer.y) / 2
        });
        activeObj.setCoords();
        inst.canvas.renderAll();
    };

    Circle.prototype.onMouseDown = function(o) {
        let inst = this;
        inst.enable();

        let pointer = inst.canvas.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;

        let ellipse = new fabric.Ellipse({
            top: origY,
            left: origX,
            rx: 0,
            ry: 0,
            selectable: false,
            hasBorders: false,
            hasControls: false
        });

        inst.canvas.add(ellipse).setActiveObject(ellipse);
    };

    Circle.prototype.isEnable = function() {
        return this.isDrawing;
    };

    Circle.prototype.enable = function() {
        this.isDrawing = true;
    };

    Circle.prototype.disable = function() {
        this.isDrawing = false;
    };

    return Circle;
}());

// Draw Rectangle/Square
let Rectangle = (function() {
    function Rectangle(canvas) {
        let inst = this;
        this.canvas = canvas;
        this.className = 'Rectangle';
        this.isDrawing = false;
        this.bindEvents();
    }

    Rectangle.prototype.bindEvents = function() {
        let inst = this;
        inst.canvas.on('mouse:down', function(o) {
            inst.onMouseDown(o);
        });
        inst.canvas.on('mouse:move', function(o) {
            inst.onMouseMove(o);
        });
        inst.canvas.on('mouse:up', function(o) {
            inst.onMouseUp(o);
        });
        inst.canvas.on('object:moving', function(o) {
            inst.disable();
        })
    };

    Rectangle.prototype.onMouseUp = function(o) {
        let inst = this;
        inst.disable();
    };

    Rectangle.prototype.onMouseMove = function(o) {
        let inst = this;


        if (!inst.isEnable()) {
            return;
        }
        // console.log("mouse move rectange");
        let pointer = inst.canvas.getPointer(o.e);
        let activeObj = inst.canvas.getActiveObject();

        activeObj.stroke = inst.canvas.freeDrawingBrush.color;
        activeObj.strokeWidth = 5;
        activeObj.fill = 'transparent';

        if (origX > pointer.x) {
            activeObj.set({
                left: Math.abs(pointer.x)
            });
        }
        if (origY > pointer.y) {
            activeObj.set({
                top: Math.abs(pointer.y)
            });
        }

        activeObj.set({
            width: Math.abs(origX - pointer.x)
        });
        activeObj.set({
            height: Math.abs(origY - pointer.y)
        });

        activeObj.setCoords();
        inst.canvas.renderAll();

    };

    Rectangle.prototype.onMouseDown = function(o) {
        let inst = this;
        inst.enable();

        let pointer = inst.canvas.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;

        let rect = new fabric.Rect({
            left: origX,
            top: origY,
            originX: 'left',
            originY: 'top',
            width: pointer.x - origX,
            height: pointer.y - origY,
            selectable: false,
            hasBorders: false,
            hasControls: false
        });

        inst.canvas.add(rect).setActiveObject(rect);
    };

    Rectangle.prototype.isEnable = function() {
        return this.isDrawing;
    };

    Rectangle.prototype.enable = function() {
        this.isDrawing = true;
    };

    Rectangle.prototype.disable = function() {
        this.isDrawing = false;
    };

    return Rectangle;
}());

// Draw Arrow
// Extended fabric line class
fabric.LineArrow = fabric.util.createClass(fabric.Line, {

    type: 'lineArrow',

    initialize: function(element, options) {
        options || (options = {});
        this.callSuper('initialize', element, options);
    },

    toObject: function() {
        return fabric.util.object.extend(this.callSuper('toObject'));
    },

    _render: function(ctx) {
        this.callSuper('_render', ctx);

        // do not render if width/height are zeros or object is not visible
        if (this.width === 0 || this.height === 0 || !this.visible) return;

        ctx.save();

        let xDiff = this.x2 - this.x1;
        let yDiff = this.y2 - this.y1;
        let angle = Math.atan2(yDiff, xDiff);
        ctx.translate((this.x2 - this.x1) / 2, (this.y2 - this.y1) / 2);
        ctx.rotate(angle);
        ctx.beginPath();
        //move 10px in front of line to start the arrow so it does not have the square line end showing in front (0,0)
        ctx.moveTo(10, 0);
        ctx.lineTo(-20, 15);
        ctx.lineTo(-20, -15);
        ctx.closePath();
        ctx.fillStyle = this.stroke;
        ctx.fill();

        ctx.restore();

    }
});

fabric.LineArrow.fromObject = function(object, callback) {
    callback && callback(new fabric.LineArrow([object.x1, object.y1, object.x2, object.y2], object));
};

fabric.LineArrow.async = true;

let Arrow = (function() {
    function Arrow(canvas) {
        this.canvas = canvas;
        this.className = 'Arrow';
        this.isDrawing = false;
        this.bindEvents();
    }

    Arrow.prototype.bindEvents = function() {
        let inst = this;
        inst.canvas.on('mouse:down', function(o) {
            inst.onMouseDown(o);
        });
        inst.canvas.on('mouse:move', function(o) {
            inst.onMouseMove(o);
        });
        inst.canvas.on('mouse:up', function(o) {
            inst.onMouseUp(o);
        });
        inst.canvas.on('object:moving', function(o) {
            inst.disable();
        })
    }

    Arrow.prototype.onMouseUp = function(o) {
        let inst = this;
        inst.disable();
    };

    Arrow.prototype.onMouseMove = function(o) {
        let inst = this;
        if (!inst.isEnable()) {
            return;
        }

        let pointer = inst.canvas.getPointer(o.e);
        let activeObj = inst.canvas.getActiveObject();
        activeObj.set({
            x2: pointer.x,
            y2: pointer.y
        });
        activeObj.setCoords();
        inst.canvas.renderAll();
    };

    Arrow.prototype.onMouseDown = function(o) {
        let inst = this;
        inst.enable();
        let pointer = inst.canvas.getPointer(o.e);

        let points = [pointer.x, pointer.y, pointer.x, pointer.y];
        let line = new fabric.LineArrow(points, {
            strokeWidth: 5,
            fill: inst.canvas.freeDrawingBrush.color,
            stroke: inst.canvas.freeDrawingBrush.color,
            originX: 'center',
            originY: 'center',
            selectable: false,
            hasBorders: false,
            hasControls: false
        });

        inst.canvas.add(line).setActiveObject(line);
    };

    Arrow.prototype.isEnable = function() {
        return this.isDrawing;
    }

    Arrow.prototype.enable = function() {
        this.isDrawing = true;
    }

    Arrow.prototype.disable = function() {
        this.isDrawing = false;
    }

    return Arrow;
}());