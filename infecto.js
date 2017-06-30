
function dbg(A) {
    console.log(A);
}

function graphicSettings() {
    this.p1Color = 0xFF1020;
    this.p2Color = 0x20FF00;
    this.bgColor = 0x100030;
    this.msgColor = "rgba(255,255,0,0.8)";
    this.msgFill = "rgba(255,255,0,0.5)";
    this.lossRadius = 0.1;
    this.fadestep = 2;
}

function gameSettings() {
    this.spawnBox = 0.25;
    this.mouseCycles = 1;
    this.spawnCycles = 500;
    this.frameDelay = 5;
}

function cellRenderer() {
    var that = this;
    var g = new graphicSettings();
    this.getGS = function() {return g;}
    
    var Canvas = new Array();
    /*  curCanvas is the HIDDEN surface
        onto which rendering is done, prior
        to calling swap() */

    var curCanvas = 0;  


    var colorMap;

    this.getColorMap = function() {return colorMap;}

    var szX, szY;

    this.getCanvas = function() {return Canvas;}
    this.getCurCanvas = function() {return curCanvas;}

    this.rgba2List = function(rgba) {
        return [(rgba >> 16) & 0xFF, (rgba >> 8) & 0xFF, rgba & 0xFF, 0xFF];
    }

    this.render = function(cellStates) {
        var ctx = Canvas[curCanvas].getContext("2d");
        var image = ctx.getImageData(0,0,szX, szY);
        var imageData = image.data;
        var sz = szX * szY; var i; var j = 0; 
        for (i=0; i < sz; i++) {
            imageData.set(colorMap[cellStates[i]],j);
            j += 4;
        }
        ctx.putImageData(image,0,0);
        imageData = 0; image = 0;
        that.swap();
    }

    this.swap = function() {
        Canvas[1-curCanvas].style.visibility='hidden';
        Canvas[curCanvas].style.visibility='visible';
        curCanvas = 1 - curCanvas;
    }

    this.resize = function() {
        Canvas[0] = document.getElementById("cells1");
        Canvas[1] = document.getElementById("cells2");
        szX = Canvas[0].width; szY = Canvas[0].height;
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
        var i;  for (i=0;i<2;i++) {
            var ctx=Canvas[i].getContext("2d");
            ctx.fillStyle = "#" + g.bgColor.toString(16);
            ctx.fillRect(0,0,szX, szY);
            ctx = 0;
        }
        that.swap();
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
    var szX, szY;
    var cb = new Array();
    this.getCB = function() {return cb;}

    this.cellState = function() {return cb[0].cellState;}

    this.init = function() {
        var cc = document.getElementById("cells1");
        szX = cc.width; szY = cc.height;
        dbg("Initializing cell automaton " + szX + ", " + szY);
        cb[0] = new cellBoard(szX, szY);
        cb[1] = new cellBoard(szX, szY);
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
        cb[1].cellState = cb[0].cellState.map(function(x) {if (x < 0) {x = x + 2; if (x > 0) {x=0;}} return x;});
        var x, y, c, n, nc, i=0;
        for (y = 0; y < szY; y++) {
            for (x = 0; x < szX; x++) {
                c = cb[0].cellState[i]; nc = c;
                n = cb[0].p1NCnt[i] + cb[0].p2NCnt[i]; 
                if (c <= 0) {
                    /* is a new cell born here? */
                    if (n == 3) {
                        nc = (cb[0].p1NCnt[i] > cb[0].p2NCnt[i]) ? 1 : 2;
                        that.alterCell(x, y, nc, 1);
                    }
                }   else { /* c must be either 1 or 2 */
                    if ( (n < 2) || (n > 3) ) {
                        /* cell dies */
                        that.alterCell(x, y, (c==1)?-21:-22, 1);
                        //that.alterCell(x, y, 0, 1);
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

    function setScaling() {
        dbg("Resizing window");
        cR.resize();
    }

    this.init = function() {
        dbg("Initializing LIFER Object");
        cR.init();
        dbg("Initialized cell renderer");
        setScaling();
        cA.init();
        window.addEventListener("resize", setScaling);
        window.addEventListener("touchmove", function(e) {e.preventDefault();});
        this.demoLoop();
    }
  
    dbg("Constructed LIFER Object");
 
    this.renderCells = function() {
        cR.render(cA.cellState());
    }

    this.demoLoop = function() {
        dbg("Demo loop");
        cA.testCellState();
        that.loop2();
    }

    this.loop2 = function() {
        cA.cycle();
        cR.render(cA.cellState());
        window.setTimeout(that.loop2, g.frameDelay);
    }

}

var LIFER = new CLifer();

