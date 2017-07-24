
function dbg(A) {
    console.log(A);
}

function graphicSettings() {

    if (typeof graphicSettings.instance === 'object') {
        return graphicSettings.instance;
    }
    var that = this;
    this.defaults = function () {
        that.p1Color = 0xFF1020;
        that.p2Color = 0x20FF00;
        that.bgColor = 0x100030;
        that.fadestep = 3;
        that.cursorColor = 0xE0F0F0;
        that.cursorRadius = 0.05;
        that.cursorArms = 0.1;
        that.cursorPx = 2.0;
        that.cursorK = 300.0;
        that.cursorD = 0.65;
        that.boxColor = 0xC0C0F0;
        that.boxPx = 3.0;
        that.lostColor = 'rgba(255,255,0,0.5)';
        that.lostRadius = 0.2;
    }
    that.defaults();
    graphicSettings.instance = this;
}

function gameSettings() {

    if (typeof gameSettings.instance === 'object') {
        return gameSettings.instance;
    }
    var that = this;
    this.defaults = function() {
        that.spawnBox = 0.25;
        that.dropCycles = 1;
        that.dropMode = 0; /* 0 is blinker.  */
        that.frameDelay = 40;
        that.shieldWidth = 5;
    }
    that.defaults();
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

    var lostX; var lostY;
    var lostMarker = false;


    this.setLostMarker = function (x,y) {lostMarker = true; lostX = x; lostY = y;}
    this.clearLostMarker = function() {lostMarker = false;}

    var flashSpawnBox = false;

    this.flashSpawnBox = function() {flashSpawnBox = true;}

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
        var cX = Canvas.width; var cY = Canvas.height;
        if (eb) {ctx.clearRect(0,0,cX, cY);}

        var spawnBox = new gameSettings().spawnBox;
        if (spawnBox) {
            ctx.beginPath();
            ctx.rect(parseInt(cX*(0.5-spawnBox)), parseInt(cY*(0.5-spawnBox)),
                    parseInt(cX*spawnBox*2), parseInt(cY*spawnBox*2));
            if (flashSpawnBox) {ctx.strokeStyle="#FFFFFF"; flashSpawnBox = false;} 
                else {ctx.strokeStyle = "#" + g.boxColor.toString(16);}
            ctx.lineWidth = g.boxPx * 1.0 * cX / 384.0;
            ctx.stroke();
        }

        if (lostMarker) {
            ctx.beginPath();
            ctx.arc(lostX * cX, lostY * cY, g.lostRadius * cX * 0.5, 0, 6.2831853);
            ctx.fillStyle = g.lostColor;
            ctx.fill();
        }

        ctx.strokeStyle = "#" + g.cursorColor.toString(16);
        ctx.lineWidth = g.cursorPx * 1.0 * cX / 384.0;
        var dx = g.cursorArms * cX * 0.5;
        var oriX = that.posX * cX;
        var oriY = that.posY * cY;
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
        lostMarker = false;
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

    var flash = false;
    var oldBG = [0,0,0,0];

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
        if (flash) {that.unflash();}
      
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

        /* white 'flash' when cells are nuked */
        cm[-71] = [255,255,255,255]; cm[-72] = [255,255,255,255];
        cm[-69] = [255,255,255,255]; cm[-70] = [255,255,255,255];
        cm[-67] = [255,255,255,255]; cm[-68] = [255,255,255,255];
        for (i=0; i<4;i++) {
            cm[-65][i] = (cm[-67][i] + cm[-63][i])/2;
            cm[-66][i] = (cm[-68][i] + cm[-64][i])/2;
        }
        colorMap = cm;
        dbg("Colormap created");
    }

    this.flash = function() {
        flash = true;
        oldBG = colorMap[0];
        var i; var nB = [0,0,0,0];
        for (i=0;i<4;i++){
            nB[i] = Math.floor((3 * 255 + oldBG[i])/4);
        }
        colorMap[0] = nB;
    }

    this.unflash = function() {
        flash = false;
        colorMap[0] = oldBG;
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
    var gs = new gameSettings();


    this.alertNear = false;
    this.alertLoss = false;
    var lostX = 0;  var lostY = 0;

    this.lostCoord = function() {
        if (!that.alertLoss) return null;
        return [(lostX * 1.0 )/ szX, (lostY * 1.0) / szY];
    }

    this.SPAWN_CLEAR_BOX = 128;

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
        that.alertNear = that.alertLoss = false; 
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

    this.getCell = function(x, y, cboard) {
        if (!(that.validXY(x,y))) return 100; /* invalid */
        var ocell = cb[cboard].cellState[x + szX * y];
        return ocell;
    }

    this.dropBlinker = function(posX, posY) {
        var bX = Math.round(posX * szX); 
        var bY = Math.round(posY * szY);
        bX = Math.max(1, bX); bY = Math.max(1, bY);
        bX = Math.min(bX, szX - 2); bY = Math.min(bY, szY - 2);
        /* drop new green cells onto cb[0] */
        
        that.alterCell(bX, bY, 2, 0);
        that.alterCell(bX, bY+1, 2, 0);
        that.alterCell(bX, bY-1, 2, 0);


    }

    /* used to drop player glider or spaceship, as opposed to enemy formation */
    this.putGlider = function(posX, posY) {
        var bX = Math.round(posX * szX); 
        var bY = Math.round(posY * szY);
        bX = Math.max(2, bX); bY = Math.max(2, bY);
        bX = Math.min(bX, szX - 3); bY = Math.min(bY, szY - 3);
        /* 0 is down-right, 1 is down-left, 2 is up-right, 3 is up-left */
        var dir = ( (posY > 0.5) ? 2 : 0 ) | ( (posX > 0.5 ) ? 1 : 0);
        that.dropGlider(bX, bY, dir, 2);
           
    }

    /* used to drop player glider or spaceship, as opposed to enemy formation */
    this.putSpaceship = function(posX, posY) {
        var bX = Math.round(posX * szX); 
        var bY = Math.round(posY * szY);
        bX = Math.max(3, bX); bY = Math.max(3, bY);
        bX = Math.min(bX, szX - 4); bY = Math.min(bY, szY - 4);
        /* spaceship dir 0=down 1=up 2=right 3=left */
        var minD = Math.min(posX, posY, 1-posX, 1-posY);
        if (minD == posX) {dir = 2;}
        else if (minD == posY) {dir = 0;}
        else if (minD == 1-posX) {dir = 3;}
        else {dir = 1;}
        that.dropSpaceship(bX, bY, dir, 2);
           
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
                        if (nc == 1) {
                            if ( (x < 5) || (y < 5) || (x > szX-5) || (y > szY-5) ) {
                                that.alertNear = true;
                                if ( (x == 0) || (y == 0) || (x == szX-1) || (y == szY-1)) {
                                    that.alertLoss = true; lostX = x; lostY = y; 
                                }
                            }
                        }
                
                    } 
                }   else { /* c must be either 1 or 2 */
                    if ( (n < 2) || (n > 3) ) {
                        /* cell dies */
                        that.alterCell(x, y, (c==1)?-63:-64, 1);
                    }
                }
                i++;
            }
        }
        var tp = cb[0]; cb[0] = cb[1]; cb[1] = tp;
    }
    /* if not p2kill, only removes p1 cells (enemy) */
    this.nuke = function (p2kill) {
        var x, y, c, i=0;
        for (y=0; y < szY; y++) {
            for (x=0; x<szX; x++) {
                c = cb[0].cellState[i]; i++;
                switch (c) {
                    case 1:
                        that.alterCell(x, y, -71, 0);
                        break;
                    case 2:
                        if (p2kill) {
                            that.alterCell(x, y, -72, 0);
                            break;
                        }
                }
            }
        }
    }

    this.shield = function() {
        var x, y, c, i=0;
        for (y=0; y < szY; y++) {
            for (x=0; x<szX; x++) {
                if ( (x < gs.shieldWidth) || (x > szX - gs.shieldWidth)  
                        || (y < gs.shieldWidth) || (y > szY - gs.shieldWidth)) { 
                    c = cb[0].cellState[i]; 
                    switch (c) {
                        case 1:
                            that.alterCell(x, y, -71, 0);
                            break;
                        case 2:
                            that.alterCell(x, y, -72, 0);
                            break;
                        case 0:
                            that.alterCell(x, y, ((x+y)%2) - 65, 0);
                            break;
                    }
                }
                i++;
            }
        }
    }

    this.deShield = function() {
        var x, y, c, i=0;
        for (y=0; y < szY; y++) {
            for (x=0; x<szX; x++) {
                if ( (x < gs.shieldWidth) || (x > szX - gs.shieldWidth)  
                        || (y < gs.shieldWidth) || (y > szY - gs.shieldWidth)) { 
                    c = cb[0].cellState[i]; 
                    if (c < 0) {cb[0].cellState[i] = 0;}
                }
                i++;
            }
        }
    }

    this.spawnCells = function(type) {
        var x, y, b;
        var x0 = Math.round((0.5 - gs.spawnBox) * szX);
        var x1 = Math.round((0.5 + gs.spawnBox) * szX);
        var y0 = Math.round((0.5 - gs.spawnBox) * szY);
        var y1 = Math.round((0.5 + gs.spawnBox) * szY);
        var a1 = false, a2 = false, a3 = false, a4 = false;

        if (type & that.SPAWN_CLEAR_BOX) {
            type = type & (~that.SPAWN_CLEAR_BOX);
            for (x = x0; x < x1; x++) {
                for (y = y0; y < y1; y++) {
                    b = that.getCell(x, y, 0);
                    if (b == 1) {b = -71;}
                    else if (b == 2) {b = -72;}
                    else {b = 0;}
                    that.alterCell(x, y, b, 0);
                }
            }
        }

        switch (type) {
            case 0: /* random fill */
                 for (x=x0; x <= x1; x++) {
                    for (y = y0; y <= y1; y++) {
                        b = 0;
                        if (Math.random() < 0.3) {b = 1;}
                        if (b) {that.alterCell (x, y, b, 0);}
                    }
                }
                break;
            case 1: /* 1-direction glider flotilla */
            case 2:
            case 3:
            case 4:
                for (x = szX/2; x < x1-2; x += 5) {
                    for (y = szY/2; y < y1-2; y+= 5) {
                        that.dropGlider(x,y,type-1,1);
                        that.dropGlider(szX-x, szY-y, type-1,1);
                        that.dropGlider(szX-x, y, type-1,1);
                        that.dropGlider(x, szY-y, type-1,1);
                    }
                }
                break; 
            case 5: /* 2-way glider flotillas */ /* up */
            case 6: /* down */
            case 7: /* right */
            case 8: /* left */
            case 9: /* 4-way glider flotilla */
                if (type == 5) {a2 = a4 = true;}
                if (type == 6) {a1 = a3 = true;}
                if (type == 7) {a1 = a4 = true;}
                if (type == 8) {a2 = a3 = true;}
                if (type == 9) {a1 = a2 = a3 = a4 = true;}
                for (x = 5 + szX/2; x < x1-2; x += 5) {
                    for (y = 5 + szY/2; y < y1-2; y+= 5) {
                        if (a1) {that.dropGlider(x,y,0,1);}
                        if (a2) {that.dropGlider(szX-x, szY-y, 3,1);}
                        if (a3) {that.dropGlider(szX-x, y, 1,1);}
                        if (a4) {that.dropGlider(x, szY-y, 2,1);}
                    }
                }
                break;
                        /* spaceship flotillas */
            case 10: /* down */
            case 11: /* up */
            case 12: /* right */
            case 13: /* left */
                for (x = szX/2; x < x1-3; x += 7) {
                    for (y = szY/2; y < y1-3; y+= 7) {
                        that.dropSpaceship(x,y,type-10, 1);
                        that.dropSpaceship(szX-x, szY-y, type-10, 1);
                        that.dropSpaceship(szX-x, y, type-10, 1);
                        that.dropSpaceship(x, szY-y, type-10, 1);
                    }
                }
                break;
            case 14: /* drop MAX pattern */
                that.dropMax(szX/2, szY/2);
                break;
            case 15: /* drop box pattern */
                for (x=x0; x <= x1; x++) {
                    that.alterCell(x, y0, 1, 0);
                    that.alterCell(x, y1, 1, 0);
                }
                for (y = y0; y <= y1; y++) {
                    that.alterCell(x0, y, 1, 0);
                    that.alterCell(x1, y, 1, 0);
                }
                break;
            case 16: /* null drop.  useful with SPAWN_CLEAR_BOX */
                break;
            case 17: /* drop blocks tight pattern*/
                for (x=x0; x<= x1; x++) {
                    for (y = y0; y<=y1; y++) {
                        if ( (x & 2) & (y & 2) ) {
                            that.alterCell(x,y,1,0);
                        }
                    }
                }
                break;
            case 18: /* drop blocks loose pattern*/
                for (x=x0; x<= x1; x++) {
                    for (y = y0; y<=y1; y++) {
                        if ( ((x %6) < 2 ) & ((y %6)<2) ) {
                            that.alterCell(x,y,1,0);
                        }
                    }
                }
                break;
        }
    }

    /* x and y are center position.  dir is 0 to 3, specs orientation */
    this.dropSpaceship = function (x, y, dir, pl) {
        var i, j;
        var spc = [ [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,1,1,1,1,0], 
                    [0,1,0,0,0,1,0], [0,0,0,0,0,1,0], [0,1,0,0,1,0,0],
                    [0,0,0,0,0,0,0]];
        if (dir & 1) {
            for (i = 0; i < spc.length; i++) {
                spc[i].reverse();
            }
        }

        for (i = 0; i < 7; i++) {
            for (j = 0; j < 7; j++) {
                if (dir & 2) {that.alterCell (x + i - 3, y + j - 3, pl*spc[j][i], 0);}
                else {that.alterCell (x + i - 3, y + j - 3, pl*spc[i][j], 0);}
            }
        }
    }



    /* x and y are center position.  dir is 0 to 3, specs orientation */
    this.dropGlider = function (x, y, dir, pl) {
        var i, j;
        var gld = [ [0,0,0,0,0], [0,0,1,0,0], [0,0,0,1,0], [0,1,1,1,0], [0,0,0,0,0]];
        if (dir & 1) {gld.reverse();}
        if (dir & 2) {
            for (i = 0; i < gld.length; i++) {
                gld[i].reverse();
            }
        }

        for (i = 0; i < 5; i++) {
            for (j = 0; j < 5; j++) {
                that.alterCell (x + i - 2, y + j - 2, pl*gld[i][j], 0)
            }
        }
    }


    this.dropMax = function(x, y) {
        var i, j;
        var mxp = new Array();
        mxp[0]=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0];
        mxp[1]=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0];
        mxp[2]=[0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0];
        mxp[3]=[0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,0,0,1,0,1,1,0,0,0,0];
        mxp[4]=[0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,0,1,0,1,0,0,0,0,0];
        mxp[5]=[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,1,0,1,0,1,0,1,1,0,0];
        mxp[6]=[0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,1,0,0,0,1,1,0,0];
        mxp[7]=[1,1,1,1,0,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,1,0,1,1,1,0,0];
        mxp[8]=[1,0,0,0,1,1,0,1,0,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0];
        mxp[9]=[1,0,0,0,0,0,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0];
        mxp[10]=[0,1,0,0,1,1,0,1,0,0,1,0,0,1,0,1,1,0,0,0,0,0,0,0,0,0,0];
        mxp[11]=[0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,1,1,1,1];
        mxp[12]=[0,1,0,0,1,1,0,1,0,0,1,0,0,1,0,0,1,1,0,1,0,1,1,0,0,0,1];
        mxp[13]=[1,0,0,0,0,0,1,1,0,0,0,1,0,1,0,1,0,0,0,1,1,0,0,0,0,0,1];
        mxp[14]=[1,0,0,0,1,1,0,1,0,1,1,0,0,1,0,0,1,0,0,1,0,1,1,0,0,1,0];
        mxp[15]=[1,1,1,1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0];
        mxp[16]=[0,0,0,0,0,0,0,0,0,0,1,1,0,1,0,0,1,0,0,1,0,1,1,0,0,1,0];
        mxp[17]=[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,0,0,0,0,0,1];
        mxp[18]=[0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,0,1,0,1,1,0,0,0,1];
        mxp[19]=[0,0,1,1,1,0,1,0,0,0,1,0,0,0,0,1,0,1,0,0,0,0,0,1,1,1,1];
        mxp[20]=[0,0,1,1,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0];
        mxp[21]=[0,0,1,1,0,1,0,1,0,1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0];
        mxp[22]=[0,0,0,0,0,1,0,1,0,0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0];
        mxp[23]=[0,0,0,0,1,1,0,1,0,0,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0];
        mxp[24]=[0,0,0,0,0,0,1,1,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0];
        mxp[25]=[0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        mxp[26]=[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

        for (i = 0; i < 27; i++) {
            for (j = 0; j < 27; j++) {
                that.alterCell (x + i - 12, y + j - 12, mxp[i][j], 0)
            }
        }
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

    this.level = 0; 
    var frameCount = 0;

    var g = new gameSettings();
    this.getGS = function () {return g;}
    
    var cR = new cellRenderer();
    this.getCR = function() {return cR;}

    var cA = new cellAutomaton();
    this.getCA = function() {return cA;}

    var gC = new gameCursor();
    this.getGC = function() {return gC;}

    this.WARP = -1;

    function setScaling() {
        var clientX, clientY;
        clientX = document.documentElement.clientWidth;
        clientY = document.documentElement.clientHeight;
        dbg("Resizing window " + clientX + ", " + clientY);
        LAYOUT.doLayout();
        cR.resize();
        gC.setScale();
    }

    var firstRun = true;

    this.init = function() {

        if (firstRun) {
            window.addEventListener("resize", setScaling);
            window.addEventListener("touchmove", function(e) {e.preventDefault();});
            document.addEventListener("onscroll", function(e) {e.preventDefault(); e.stopPropagation();}, true);
            document.addEventListener("touchstart", function(e) {e.preventDefault();}, true);
            document.addEventListener("touchmove", function(e) {e.preventDefault();}, true);
            document.getElementById("thebody").onkeydown = LAYOUT.keyHandler;
            var ele;
            var ename = ["overlay", "cells", "container", "outer"];
            for (var i = 0; i < ename.length; i++) {
                ele = document.getElementById(ename[i]);
                if (ele) {
                    ele.addEventListener("mousemove", that.onMouseMove, true);
                    ele.addEventListener("touchmove", that.onTouchMove, true);
                    ele.addEventListener("touchstart", that.onTouchMove, false);
             }
            }
            firstRun = false;
        }
        document.getElementById("outer").style.backgroundColor="#111";
        cR.init();
        setScaling();
        gC.init();
        cA.init();
        cA.testCellState();
        that.level = 0;
        LAYOUT.enableButton("bomb", false);
        LAYOUT.enableButton("clock", false);
        LAYOUT.enableButton("trash", false);
        LAYOUT.enableButton("shield", false);
        LAYOUT.getButtons();
        that.promptGo("Welcome to CellFence.  Start Game", that.playLevel);
    }

    var pwrClock = false; var pwrBomb = false; var pwrTrash = false; var pwrShield = false;
    var clockFrames = 0;  var shieldFrames = 0;

    this.playLevel = function() {
        if (that.WARP >= 0) {that.level = that.WARP; that.WARP = -1;}
        document.getElementById("outer").style.backgroundColor="#111";
        dbg ("Starting level " + (1 + that.level));
        document.getElementById("textLine").innerText = "Level: " + (1 + that.level);
        var lData = LEVELS[that.level];
        var gr = new graphicSettings(); gr.defaults();
        var gm = new gameSettings(); gm.defaults();
        var i;
        for (i in lData["graphics"]) {
            dbg(i + ": " + lData["graphics"][i]);
            gr[i]=lData["graphics"][i];
        }
        for (i in lData["game"]) {
            dbg(i + ": " + lData["game"][i]);
            gm[i]=lData["game"][i];
        }
        cR.init(); 
        gC.init(); 
        cA.init(); 
        gC.physics(); 
        frameCount = 0;
        cA.alertLoss = false;
        pwrClock = pwrBomb = pwrTrash = pwrShield = false;
        clockFrames = shieldFrames = 0;
        LAYOUT.getButtons(); /* clear button push buffer */
        AUDIO.play("start"); /* notify user */
        that.runLevel();
    }

    this.dropCycle = 0;


    this.runLevel = function () {
        /* check for powerup activation */
        var buttons = LAYOUT.getButtons();
        if (buttons.lastIndexOf("clock") != -1) {
            pwrClock = true; clockFrames = Math.round(3000/(new gameSettings().frameDelay)); 
            LAYOUT.popup(true, "3-Second Freeze", 2000);
            LAYOUT.enableButton("clock", false);
            AUDIO.play("clock");
        }
        if (buttons.lastIndexOf("bomb") != -1) {
            pwrBomb = true;
            LAYOUT.popup(true, "Bomb Clears Playfield", 2000);
            cA.nuke(true);
            LAYOUT.enableButton("bomb", false);
            AUDIO.play("bomb");
        }

        if (buttons.lastIndexOf("trash") != -1) {
            pwrBomb = true;
            LAYOUT.popup(true, "Trash Clears Enemy", 2000);
            cA.nuke(false);
            LAYOUT.enableButton("trash", false);
            AUDIO.play("trash");
        }

        if (buttons.lastIndexOf("shield") != -1) {
            pwrShield = true;
            shieldFrames = Math.round(5000/(new gameSettings().frameDelay));
            LAYOUT.popup(true, "5-Second Shield", 2000);
            LAYOUT.enableButton("shield", false);
            AUDIO.play("shield");
        }

        /* read level script */
        var cmd = LEVELS[that.level].sequence[frameCount];
        if (cmd) {
            if (cmd[0] == "PROMPT") {
                LAYOUT.popup(true, cmd[1], 2000);
            }
            if (cmd[0] == "SPAWN") {
                cA.spawnCells(cmd[1]);
                gC.flashSpawnBox();
                AUDIO.play("spawn");
            }
            if (cmd[0] == "POWERUP") {
                if (!LAYOUT.isButtonEnabled(cmd[1])) {
                    LAYOUT.enableButton(cmd[1], true);
                    LAYOUT.popup(true, cmd[1].toUpperCase() + " POWERUP ENABLED", 2000);
                }   
            }
            if (cmd[0] == "BOX") {
                g.spawnBox = cmd[1];
            }
            if ((cmd[0] == "END") || (cmd[0] == "ENDNOP" ) ){
                AUDIO.play("win");
                if (LEVELS[that.level+1]) {
                    that.level++; 
                    if (cmd[0] == "END") {that.promptNextLevel();}
                    else {that.promptGo("Level Completed!", that.playLevel);}
                    return;
                } else {
                    that.promptGo("Game Completed!  Congratulations!", that.init);
                    return;
                }
            }
        }
        /* manage input and drop cells */
        gC.physics();
        if (that.dropCycle == 0) {
            if ( (Math.abs(gC.posX - 0.5) > g.spawnBox) || (Math.abs(gC.posY - 0.5) > g.spawnBox) ){
                switch (g.dropMode) {
                    case 0:
                        cA.dropBlinker(gC.posX, gC.posY);
                        break;
                    case 1:
                        cA.putGlider(gC.posX, gC.posY); /* dropGlider name used by spawn routine sorry */
                        break;
                    case 2:
                        cA.putSpaceship(gC.posX, gC.posY);
                        break;
                }
            }
        }
        that.dropCycle++; if (that.dropCycle == g.dropCycles) {that.dropCycle = 0;}
        /* run automaton and check loss conditions */
        cA.alertNear = false;
        if (pwrShield) {cA.shield();}
        if (!pwrClock) {cA.cycle();}
        if (cA.alertLoss) {
                document.getElementById("outer").style.backgroundColor = "#F00";
        } else if (cA.alertNear) {
             document.getElementById("outer").style.backgroundColor = "#EE0";
             AUDIO.play("warn");
        } else {document.getElementById("outer").style.backgroundColor="#111";}

        /* render playfield */
        if (pwrBomb) {
            cR.flash();
            pwrBomb = false;
        }
        cR.render(cA.cellState());
        
        if (!pwrClock) {frameCount++;}
        clockFrames--; if (clockFrames == 0) {pwrClock = false;}
        shieldFrames--; if (shieldFrames == 0) {pwrShield = false; cA.deShield();}
        /* continue or break out of game loop */
        if (cA.alertLoss) {
            AUDIO.play("loss");
            var lC = cA.lostCoord();  gC.setLostMarker(lC[0], lC[1]);
            that.promptRestart();
        } else {
            window.setTimeout(that.runLevel, g.frameDelay);
        }
    }


    var continuation = null;

    this.promptGo = function (prompt, nextcall) {
        LAYOUT.choices(true, prompt, "OK", "");
        continuation = nextcall;
        that.promptLoop();
    }

    this.promptNextLevel = function() {
        var prompt = "Level Completed! \n";
        var pup = LAYOUT.pickRandomPowerup();
        if (pup) {
            LAYOUT.enableButton(pup, true);
            prompt = prompt + pup.toUpperCase() + " POWERUP ENABLED";
        }
        continuation = that.playLevel;
        LAYOUT.choices(true, prompt, "OK", "");
        that.promptLoop();
    }

    this.promptLoop = function() {
        if (LAYOUT.lastChoice != -1) {continuation();}
        else {
            gC.physics();
            cA.cycle();
            cR.render(cA.cellState());
            window.setTimeout(that.promptLoop, g.frameDelay);
        }
    }

    this.promptRestart = function() {
        LAYOUT.choices(true, "Enemy cells escaped.  Game over.", "Retry Level", "Restart");
        window.setTimeout(that.restartLoop, g.frameDelay);
    }

    this.restartLoop = function() {
        if (LAYOUT.lastChoice == 1) {
            that.init(); return;
        }
        if (LAYOUT.lastChoice == 0) {
            that.playLevel(); return;
        }
        gC.physics();
        cA.cycle();
        cR.render(cA.cellState());
        window.setTimeout(that.restartLoop, g.frameDelay);
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

    var fCounter = 0;

    dbg("Constructed LIFER Object");
}

var LIFER = new CLifer();

