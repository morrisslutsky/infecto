
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
    var curCanvas = 0;

    var fadeP1 = new Array();
    var fadeP2 = new Array();

    var szX, szY;

    this.getCanvas = function() {return Canvas;}
    this.getCurCanvas = function() {return curCanvas;}
    this.render = function(stateArray) {;}

    this.swap = function() {
        Canvas[1-curCanvas].style.visibility='hidden';
        Canvas[curCanvas].style.visibility='visible';
        curCanvas = 1 - curCanvas;
    }

    this.resize = function() {
        Canvas[0] = document.getElementById("cells1");
        Canvas[1] = document.getElementById("cells2");
        szX = Canvas[0].width; szY = Canvas[0].height;
        console.log("Resize cell canvas: " + szX + "," + szY)
    }

    this.colorMap = function() {
        var rp1 = (g.p1Color & 0xFF0000) >> 16;
        var gp1 = (g.p1Color & 0xFF00) >> 8;
        var bp1 = g.p1Color & 0xFF;
        var rp2 = (g.p2Color & 0xFF0000) >> 16;
        var gp2 = (g.p2Color & 0xFF00) >> 8;
        var bp2 = g.p2Color & 0xFF;

        var rbk = (g.bgColor & 0xFF0000) >> 16;
        var gbk = (g.bgColor & 0xFF00) >> 8;
        var bbk = g.bgColor & 0xFF;

        var i; for (i=0;i<256;i++){
            rp1 = rp1 - g.fadestep; if (rp1 < rbk) rp1 = rbk;
            rp2 = rp2 - g.fadestep; if (rp2 < rbk) rp2 = rbk;
            gp1 = gp1 - g.fadestep; if (gp1 < gbk) gp1 = gbk;
            gp2 = gp2 - g.fadestep; if (gp2 < gbk) gp2 = gbk;
            bp1 = bp1 - g.fadestep; if (bp1 < bbk) bp1 = bbk;
            bp2 = bp2 - g.fadestep; if (bp2 < bbk) bp2 = bbk;
            fadeP1[i] = (rp1 << 16) | (gp1 << 8) | bp1;
            fadeP2[i] = (rp2 << 16) | (gp2 << 8) | bp2;
        }
        console.log("Colormap created");
    }

    this.init = function() {
        that.resize();
        that.colorMap();
        console.log ("Bringing up canvas:" + szX + ", " + szY)
        var i;  for (i=0;i<2;i++) {
            var ctx=Canvas[i].getContext("2d");
            ctx.fillStyle = "#" + g.bgColor.toString(16);
            ctx.fillRect(0,0,szX, szY);
            ctx = 0;
        }
        that.swap();
    }

}


function CLifer () {

    var that = this;    
    var g = new gameSettings();
    this.getGS = function () {return g;}
    
    var cR = new cellRenderer();
    this.getCR = function() {return cR;}

    this.init = function() {
        console.log("Initializing LIFER Object");
        cR.init();
        console.log("Initialized cell renderer");

    }
  
    console.log("Constructed LIFER Object");
 


}

var LIFER = new CLifer();

