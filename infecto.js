
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
    this.fadestep = 1;
}

function gameSettings() {
    this.spawnBox = 0.25;
    this.mouseCycles = 1;
    this.spawnCycles = 500;
    this.frameDelay = 10;
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
        return [rgba & 0xFF, (rgba >> 8) & 0xFF, (rgba >> 16) & 0xFF, 0];
    }

    this.render = function(cellStates) {
        ctx = Canvas[curCanvas].getContext("2d");
        imageData = ctx.getImageData(0,0,szX, szY);
        var sz = szX * szY; var i;
        for (i=0; i < sz; i++) {

        }
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
        cm[0] = g.bgColor; cm[1] = g.p1Color; cm[2] = g.p2Color;
        var i; for (i = -128; i<0; i+=2) {
            rp1 = (rp1 > rbk) ? (rp1 - fs) : (rp1 < rbk) ? (rp1 + fs) : rp1;
            rp2 = (rp2 > rbk) ? (rp2 - fs) : (rp2 < rbk) ? (rp2 + fs) : rp2;
            gp1 = (gp1 > gbk) ? (gp1 - fs) : (gp1 < gbk) ? (gp1 + fs) : gp1;
            gp2 = (gp2 > gbk) ? (gp2 - fs) : (gp2 < gbk) ? (gp2 + fs) : gp2;
            bp1 = (bp1 > bbk) ? (bp1 - fs) : (bp1 < bbk) ? (bp1 + fs) : bp1;
            bp2 = (bp2 > bbk) ? (bp2 - fs) : (bp2 < bbk) ? (bp2 + fs) : bp2;
            cm[i] = (rp2 << 16) | (gp2 << 8) | bp2;
            cm[i+1] = (rp1 << 16) | (gp1 << 8) | bp1;
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
}

function cellAutomaton() {
    var that = this;
    var szX, szY;
    var cb = new Array();
    this.getCB = function() {return cb;}
    this.init = function() {
        var cc = document.getElementById("cells1");
        szX = cc.width; szY = cc.height;
        dbg("Initializing cell automaton " + szX + ", " + szY);
        cb[0] = new cellBoard(szX, szY);
        cb[1] = new cellBoard(szX, szY);
    }

    this.testCellState = function() {
        var sz = szX * szY;
        var ret = new Int8Array(szX * szY);
        var i, b; for (i=0; i < sz; i++) {
            b = (i >> 2) % 128; b = - b;
            if (Math.random() < 0.2) b = 1;
            if (Math.random() < 0.2) b = 2;
            ret[i] = b;
        }
        return ret;
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
    }
  
    dbg("Constructed LIFER Object");
 


}

var LIFER = new CLifer();

