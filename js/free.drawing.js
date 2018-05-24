
canvas.selection = false;
var rect, ellipse, line, triangle, isDown, origX, origY, freeDrawing = true, textVal, activeObj;
var isRectActive = false, isCircleActive = false, isArrowActive = false;

var rectangle = document.getElementById('rect');
var circle = document.getElementById('circle');
var arrowSel = document.getElementById('arrow');
var freedrawing = document.getElementById('freedrawing');
rectangle.addEventListener('click', function () {
    isRectActive = !isRectActive;
});

circle.addEventListener('click', function () {
    isCircleActive = !isCircleActive;
});
arrowSel.addEventListener('click', function () {
    isArrowActive = !isArrowActive;
});
freedrawing.addEventListener('click', function () {
    freeDrawing = !freeDrawing;
});

canvas.on('mouse:down', function(o) {
    if (freeDrawing) {
        isDown = true;
        var pointer = canvas.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;
        if(isRectActive) {
            rect = new fabric.Rect({
                left: origX,
                top: origY,
                width: pointer.x-origX,
                height: pointer.y-origY,
                fill: '',
                stroke : 'red',
                type : 'rect',
                uuid : generateUUID(),
                strokeWidth:5,
            });
            canvas.add(rect);
            activeObj = rect;
        } else if (isCircleActive) {
            ellipse = new fabric.Ellipse({
                left: origX,
                top: origY,
                originX: 'left',
                originY: 'top',
                rx: pointer.x - origX,
                ry: pointer.y - origY,
                angle: 0,
                fill: '',
                stroke: 'orange',
                strokeWidth:6,
                type : 'ellipse',
                uuid : generateUUID()
            });
            canvas.add(ellipse);
            activeObj = ellipse;
        } else if (isArrowActive) {
            var points = [pointer.x, pointer.y, pointer.x, pointer.y];
            line = new fabric.Line(points, {
                strokeWidth: 6,
                fill: 'red',
                stroke: 'red',
                originX: 'center',
                originY: 'center',
                id:'arrow_line',
                uuid : generateUUID(),
                type : 'arrow'
            });
            var centerX = (line.x1 + line.x2) / 2;
            var centerY = (line.y1 + line.y2) / 2;
            deltaX = line.left - centerX;
            deltaY = line.top - centerY;

            triangle = new fabric.Triangle({
                left: line.get('x1') + deltaX,
                top: line.get('y1') + deltaY,
                originX: 'center',
                originY: 'center',
                selectable: false,
                pointType: 'arrow_start',
                angle: -45,
                width: 20,
                height: 20,
                fill: 'red',
                id:'arrow_triangle',
                uuid : line.uuid
            });
            canvas.add(line, triangle);
            activeObj = line;
        }
    }
});

var _FabricCalcArrowAngle = function(x1, y1, x2, y2) {
    var angle = 0, x, y;
    x = (x2 - x1);
    y = (y2 - y1);
    if (x === 0) {
        angle = (y === 0) ? 0 : (y > 0) ? Math.PI / 2 : Math.PI * 3 / 2;
    } else if (y === 0) {
        angle = (x > 0) ? 0 : Math.PI;
    } else {
        angle = (x < 0) ? Math.atan(y / x) + Math.PI :
            (y < 0) ? Math.atan(y / x) + (2 * Math.PI) : Math.atan(y / x);
    }
    return (angle * 180 / Math.PI + 90);
};

canvas.on('mouse:move', function(o) {
    if (isDown && freeDrawing) {
        var pointer = canvas.getPointer(o.e);

        if(isRectActive) {
            if(origX>pointer.x){
                rect.set({ left: Math.abs(pointer.x) });
            }
            if(origY>pointer.y){
                rect.set({ top: Math.abs(pointer.y) });
            }

            rect.set({ width: Math.abs(origX - pointer.x) });
            rect.set({ height: Math.abs(origY - pointer.y) });
        } else if (isCircleActive) {
            if(ellipse === null) {
                return;
            }
            var rx = Math.abs(origX - pointer.x)/2;
            var ry = Math.abs(origY - pointer.y)/2;
            if (rx > ellipse.strokeWidth) {
                rx -= ellipse.strokeWidth/2;
            }
            if (ry > ellipse.strokeWidth) {
                ry -= ellipse.strokeWidth/2;
            }
            ellipse.set({ rx: rx, ry: ry});

            if(origX > pointer.x){
                ellipse.set({originX: 'right' });
            } else {
                ellipse.set({originX: 'left' });
            }
            if(origY > pointer.y){
                ellipse.set({originY: 'bottom'  });
            } else {
                ellipse.set({originY: 'top'  });
            }
        } else if (isArrowActive) {
            line.set({
                x2: pointer.x,
                y2: pointer.y
            });
            triangle.set({
                'left': pointer.x + deltaX,
                'top': pointer.y + deltaY,
                'angle': _FabricCalcArrowAngle(line.x1,
                    line.y1,
                    line.x2,
                    line.y2)
            });
        }
        canvas.renderAll();
    }
});

canvas.on('mouse:up', function(o) {
    if(freeDrawing) {
        isDown = false;
        if (isRectActive || isCircleActive || isArrowActive) {
            textVal = "";
            if(isArrowActive) {
                var group = new window.fabric.Group([line,triangle],
                    {
                        borderColor: 'black',
                        cornerColor: 'green',
                        lockScalingFlip : true,
                        typeOfGroup : 'arrow',
                        userLevel : 1,
                        name:'my_ArrowGroup',
                        uuid : activeObj.uuid,
                        type : 'arrow'
                    }
                );
                canvas.remove(line, triangle);// removing old object
                activeObj = group;
                canvas.add(group);
            }
            //add text to the canvas.
            var _text = new fabric.Text(textVal, {
                fontSize: 30,
                fill : 'green',
                type : 'text',
                selectable : false,
                left : activeObj.left,
                top : activeObj.top - 30,
                uuid : activeObj.uuid,
                type : 'text'
            });
            canvas.add(_text);
        }
    }
    //set coordinates for proper mouse interaction
    var objs = canvas.getObjects();
    for (var i = 0 ; i < objs.length; i++) {
        objs[i].setCoords();
    }
});
function generateUUID(){
    var d = new Date().getTime();
    if(window.performance && typeof window.performance.now === "function"){
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}
canvas.on("object:modified", function (e) {
    try {
        var obj = e.target;
        if (obj.type === 'ellipse') {
            obj.rx *= obj.scaleX;
            obj.ry *= obj.scaleY;
        }
        if (obj.type !== 'arrow') {
            obj.width *= obj.scaleX;
            obj.height *= obj.scaleY;
            obj.scaleX = 1;
            obj.scaleY = 1;
        }
        //find text with the same UUID
        var currUUID = obj.uuid;
        var objs = canvas.getObjects();
        var currObjWithSameUUID = null;
        for (var i = 0 ; i < objs.length; i++) {
            if (objs[i].uuid === currUUID &&
                objs[i].type === 'text') {
                currObjWithSameUUID = objs[i];
                break;
            }
        }
        if (currObjWithSameUUID) {
            currObjWithSameUUID.left = obj.left;
            currObjWithSameUUID.top = obj.top - 30;
            currObjWithSameUUID.opacity = 1;
        }
    } catch (E) {
    }
});

var _hideText = function (e) {
    try {
        var obj = e.target;
//        	 	console.log(obj);
        //find text with the same UUID
        var currUUID = obj.uuid;
        var objs = canvas.getObjects();
        var currObjWithSameUUID = null;
        for (var i = 0 ; i < objs.length; i++) {
            if (objs[i].uuid === currUUID && objs[i].type === 'text') {
                currObjWithSameUUID = objs[i];
                break;
            }
        }
        if (currObjWithSameUUID) {
            currObjWithSameUUID.opacity = 0;
        }
    } catch (E) {
    }
}

canvas.on("object:moving", function (e) {
    _hideText(e);
});
canvas.on("object:scaling", function (e) {
    _hideText(e);
});
canvas.renderAll();