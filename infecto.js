
function dbg(A) {
    console.log(A);
}

function graphicSettings() {

    if (typeof graphicSettings.instance === 'object') {
        return graphicSettings.instance;
    }
    this.p1Color = 0xFF1020;
    this.p2Color = 0x20FF00;
    this.bgColor = 0x100030;
    this.fadestep = 3;
    this.cursorColor = 0xE0F0F0;
    this.cursorRadius = 0.05;
    this.cursorArms = 0.1;
    this.cursorPx = 2.0;
    this.cursorK = 100.0;
    this.cursorD = 0.75;

    graphicSettings.instance = this;
}

function gameSettings() {

    if (typeof gameSettings.instance === 'object') {
        return gameSettings.instance;
    }

    this.spawnBox = 0.25;
    this.mouseCycles = 1;
    this.spawnCycles = 500;
    this.frameDelay = 40;

    gameSettings.instance = this;
}

function gameCursor() {
    var that = this;
    var g = new graphicSettings();
    this.getGS = function() {return g;}

    var Canvas;
    this.posX = 0.5;
    this.posY = 0.5;
    this.visible = true;

    var fD = new gameSettings().frameDelay;

    var tX = 0.5; var tY = 0.5;
    var vX = 0; var vY = 0;

    this.moveCursor = function (nX, nY) {
        tX = nX; tY = nY;
    }

    this.setScale = function() {
        Canvas = document.getElementById("overlay");
        Canvas.style.visibility = "visible";
        Canvas.width = Canvas.getBoundingClientRect().width;
        Canvas.height = Canvas.getBoundingClientRect().height;
        dbg ("Set canvas style wh" + Canvas.width + "," + Canvas.height);
        fD = new gameSettings().frameDelay;
        that.paint(true);
    }

    this.sendMouseClientPos = function (cX, cY) {
        Canvas = document.getElementById("overlay");
        var rr = Canvas.getBoundingClientRect();
        cX = cX - rr.left; cY = cY - rr.top;
        cX /= rr.width; cY /= rr.height;
        cX = Math.max (cX, 0.0); cY = Math.max (cY, 0.0);
        cX = Math.min (cX, 1.0); cY = Math.min (cY, 1.0);
        tX = cX; tY = cY;
    }

    this.physics = function() {
        var aX, aY; var tc = fD/1000;
        aX = g.cursorK * (tX - that.posX);
        aY = g.cursorK * (tY - that.posY);
        var c = g.cursorD * 2.0 * Math.sqrt(g.cursorK);
        aX -= c * vX;  aY -= c *vY;
        vX += aX * tc; vY += aY * tc;
        that.posX += vX * tc; that.posY += vY * tc;
        that.paint(true);
    }

    this.paint = function(eb) {
        var ctx = Canvas.getContext("2d");
        if (eb) {ctx.clearRect(0,0,Canvas.width, Canvas.height);}
        ctx.strokeStyle = "#" + g.cursorColor.toString(16);
        ctx.lineWidth = g.cursorPx * 1.0 * Canvas.width / 384.0;
        var dx = g.cursorArms * Canvas.width * 0.5;
        var oriX = that.posX * Canvas.width;
        var oriY = that.posY * Canvas.height;
        ctx.beginPath();
        ctx.moveTo(oriX, oriY-dx);
        ctx.lineTo(oriX, oriY+dx);
        ctx.moveTo(oriX-dx,oriY);
        ctx.lineTo(oriX+dx, oriY);

        ctx.arc(oriX, oriY, g.cursorRadius * Canvas.width * 0.5, 0, 6.2831853);
        ctx.stroke();

    }

    this.init = function () {
        that.setScale();
        posX = posY = tX = tY = 0.5;
        vX = vY = 0;

    }
}

function cellRenderer() {
    var that = this;
    var g = new graphicSettings();
    this.getGS = function() {return g;}
    
    var Canvas;
    


    var colorMap;

    this.getColorMap = function() {return colorMap;}

    var szX, szY;

    this.getCanvas = function() {return Canvas;}

    this.rgba2List = function(rgba) {
        return [(rgba >> 16) & 0xFF, (rgba >> 8) & 0xFF, rgba & 0xFF, 0xFF];
    }

    this.render = function(cellStates) {
        var ctx = Canvas.getContext("2d");
        var image = ctx.getImageData(0,0,szX, szY);
        var imageData = image.data;
        var sz = szX * szY; var i; var j = 0; 
        for (i=0; i < sz; i++) {
            imageData.set(colorMap[cellStates[i]],j);
            j += 4;
        }
        ctx.putImageData(image,0,0);
        imageData = 0; image = 0;
      
    }


    this.resize = function() {
        Canvas = document.getElementById("cells");
        szX = Canvas.width; szY = Canvas.height;
        dbg("Resize cell canvas: " + szX + "," + szY)
    }

    this.createColorMap = function() {
        /* 
            cellState storage format:  row by row (x coordinate)
            cellState 0:  empty cell
            cellState 1:  player 1 (computer enemy)
            cellState 2:  player 2 (you the user)
            cellState < 0:  holds a 'ghost' of a dead cell
            cellState:  -127 to -1, odd numbered, ghost of p1
            cellState:  -128 to -2, odd numbered, ghost of p2
        */
        var rp1 = (g.p1Color & 0xFF0000) >> 16;
        var gp1 = (g.p1Color & 0xFF00) >> 8;
        var bp1 = g.p1Color & 0xFF;
        var rp2 = (g.p2Color & 0xFF0000) >> 16;
        var gp2 = (g.p2Color & 0xFF00) >> 8;
        var bp2 = g.p2Color & 0xFF;

        var rbk = (g.bgColor & 0xFF0000) >> 16;
        var gbk = (g.bgColor & 0xFF00) >> 8;
        var bbk = g.bgColor & 0xFF;


        var fs = g.fadestep;

        var cm = new Array();
        cm[0] = that.rgba2List(g.bgColor); cm[1] = that.rgba2List(g.p1Color); cm[2] = that.rgba2List(g.p2Color);
        var i; for (i = -128; i<0; i+=2) {
            rp1 = (rp1 > rbk) ? (rp1 - fs) : (rp1 < rbk) ? (rp1 + fs) : rp1;
            rp2 = (rp2 > rbk) ? (rp2 - fs) : (rp2 < rbk) ? (rp2 + fs) : rp2;
            gp1 = (gp1 > gbk) ? (gp1 - fs) : (gp1 < gbk) ? (gp1 + fs) : gp1;
            gp2 = (gp2 > gbk) ? (gp2 - fs) : (gp2 < gbk) ? (gp2 + fs) : gp2;
            bp1 = (bp1 > bbk) ? (bp1 - fs) : (bp1 < bbk) ? (bp1 + fs) : bp1;
            bp2 = (bp2 > bbk) ? (bp2 - fs) : (bp2 < bbk) ? (bp2 + fs) : bp2;
            cm[i] = [rp2, gp2, bp2, 255];
            cm[i+1] = [rp1, gp1, bp1, 255];
        }

        for (i=3;i<127;i++) {
            cm[i] = [255,255,255,255]; /* invalid cell states */
        }
        colorMap = cm;
        dbg("Colormap created");
    }

    this.init = function() {
        that.resize();
        that.createColorMap();
        dbg ("Bringing up canvas:" + szX + ", " + szY)
        
        var ctx=Canvas.getContext("2d");
        ctx.fillStyle = "#" + g.bgColor.toString(16);
        ctx.fillRect(0,0,szX, szY);
        ctx = 0;
        Canvas.style.visibility = 'visible';
    }

}


function cellBoard(a, b) {
    var that = this;
    this.szX = a; this.szY = b;
    this.sz = a * b;
    /* 
        cellState storage format:  row by row (x coordinate)
        cellState 0:  empty cell
        cellState 1:  player 1 (computer enemy)
        cellState 2:  player 2 (you the user)
        cellState < 0:  holds a 'ghost' of a dead cell
        cellState:  -127 to -1, odd numbered, ghost of p1
        cellState:  -128 to -2, odd numbered, ghost of p2
    */
    this.cellState = new Int8Array(a * b);
    this.p1NCnt = new Int8Array(a * b);
    this.p2NCnt = new Int8Array(a * b);

    this.blit = function (cB2) {
        that.cellState.set(cB2.cellState);
        that.p1NCnt.set(cB2.p1NCnt);
        that.p2NCnt.set(cB2.p2NCnt);
    }

    this.blitNC = function (cB2) {
        that.p1NCnt.set(cB2.p1NCnt);
        that.p2NCnt.set(cB2.p2NCnt);
    }
}

function cellAutomaton() {
    var that = this;
    var dx = [ 0,  1, 1, 1, 0, -1, -1, -1];
    var dy = [-1, -1, 0, 1, 1,  1,  0, -1];
    var fadeLUT = new Array();
    var szX, szY;
    var cb = new Array();
    this.getCB = function() {return cb;}

    this.cellState = function() {return cb[0].cellState;}

    this.init = function() {
        var cc = document.getElementById("cells");
        szX = cc.width; szY = cc.height;
        dbg("Initializing cell automaton " + szX + ", " + szY);
        cb[0] = new cellBoard(szX, szY);
        cb[1] = new cellBoard(szX, szY);
        var i = 0;
        for (i = -128; i < -1; i++) {
            fadeLUT[i] = i + 2;
        }
        fadeLUT[-1] = 0; fadeLUT[-2] = 0;
        for (i = 0; i < 128; i++) {
            fadeLUT[i] = i;
        }
    }

    this.validXY = function (x, y) {
        return (x >= 0) && (y >= 0) && (x < szX) && (y < szY);
    }

    this.adjNCnt = function (x, y, indx, dp1, dp2) {
        var xx, yy;
        var i; for (i = 0; i < dx.length; i++) {
            xx = x + dx[i]; yy = y + dy[i];
            if (that.validXY(xx,yy)) {
                cb[indx].p1NCnt[xx+szX*yy] += dp1;
                cb[indx].p2NCnt[xx+szX*yy] += dp2;
            }
        }
    }

    /*  alters the state of a cell on cellBoard[cboard] and
        adjusts corresponding neighborcounts also on
        cellboard[cboard]
    */
    this.alterCell = function(x, y, ncell, cboard) {
        if (!(that.validXY(x,y))) return;
        var ocell = cb[cboard].cellState[x + szX*y];
        var dp1 = 0, dp2 = 0;
        if (ocell == 1) {dp1--;}
        if (ocell == 2) {dp2--;}
        if (ncell == 1) {dp1++;}
        if (ncell == 2) {dp2++;}
        that.adjNCnt(x, y, cboard, dp1, dp2);
        cb[cboard].cellState[x + szX * y] = ncell;
    }

    /*  reads cell states and neighbor counts from cb[0]
        writes them to cb[1].  Finally, swaps cb[0] and cb[1] */

    this.cycle = function() {
        cb[1].blitNC(cb[0]); 
        var x, y, c, n, nc, ac, i=0;
        for (y = 0; y < szY; y++) {
            for (x = 0; x < szX; x++) {
                c = cb[0].cellState[i]; nc = c;
                n = cb[0].p1NCnt[i] + cb[0].p2NCnt[i]; 
                cb[1].cellState[i] = fadeLUT[c];
                if (c <= 0) {
                    /* is a new cell born here? */
                    if (n == 3) {
                        nc = (cb[0].p1NCnt[i] > cb[0].p2NCnt[i]) ? 1 : 2;
                        that.alterCell(x, y, nc, 1);
                
                    } 
                }   else { /* c must be either 1 or 2 */
                    if ( (n < 2) || (n > 3) ) {
                        /* cell dies */
                        that.alterCell(x, y, (c==1)?-31:-32, 1);
                    }
                }
                i++;
            }
        }
        var tp = cb[0]; cb[0] = cb[1]; cb[1] = tp;
    }

    this.testCellState = function() {
        var x, y;
        var b; 
        for (x=0; x < szX; x++) {
            for (y = 0; y < szY; y++) {
                b = 0;
                if (Math.random() < 0.2) {b = 1;}
                if (Math.random() < 0.2) {b = 2;}
                if (b) {that.alterCell (x, y, b, 0);}
            }
        }
    }
}

function CLifer () {

    var that = this;    
    var g = new gameSettings();
    this.getGS = function () {return g;}
    
    var cR = new cellRenderer();
    this.getCR = function() {return cR;}

    var cA = new cellAutomaton();
    this.getCA = function() {return cA;}

    var gC = new gameCursor();
    this.getGC = function() {return gC;}

    function setScaling() {
        dbg("Resizing window");
        cR.resize();
        gC.setScale();
    }

    this.init = function() {
        dbg("Initializing LIFER Object");
        cR.init();
        dbg("Initialized cell renderer");
        setScaling();
        gC.init();
        cA.init();
        window.addEventListener("resize", setScaling);
        window.addEventListener("touchmove", function(e) {e.preventDefault();});
        document.addEventListener("onscroll", function(e) {e.preventDefault(); e.stopPropagation();}, true);
        document.addEventListener("touchstart", function(e) {e.preventDefault();}, true);
        document.addEventListener("touchmove", function(e) {e.preventDefault();}, true);

        var ele;
        var ename = ["overlay", "playfield", "cells", "container", "outer"];
        for (var i = 0; i < ename.length; i++) {
            ele = document.getElementById(ename[i]);
            if (ele) {
                ele.addEventListener("mousemove", that.onMouseMove, true);
                ele.addEventListener("touchmove", that.onTouchMove, true);
                ele.addEventListener("touchstart", that.onTouchMove, true);
            }
        }
        this.demoLoop();
    }
  
    this.onMouseMove = function(e) {
        gC.sendMouseClientPos(e.clientX, e.clientY);
        e.stopPropagation();
        e.preventDefault();
    }

    this.onTouchMove = function(e) {
        if (0 ==e.touches.length) return;
        gC.sendMouseClientPos(event.touches.item(0).clientX, event.touches.item(0).clientY);
        e.stopPropagation();
        e.preventDefault();
    }


    this.renderCells = function() {
        cR.render(cA.cellState());
    }

    this.demoLoop = function() {
        dbg("Demo loop");
        cA.testCellState();
        that.loop2();
    }

    this.loop2 = function() {
        gC.physics();
        cA.cycle();
        cR.render(cA.cellState());
        window.setTimeout(that.loop2, g.frameDelay);
    }

    dbg("Constructed LIFER Object");
}

var LIFER = new CLifer();

