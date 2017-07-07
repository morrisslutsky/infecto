function dbg(A) {
    console.log(A);
}

function Layout() {
	var that = this;

	/* minimum space needed for sides in LS view or bottom bar in PT view */
	this.minimumSideW = 80;

	this.padding = 16;
	this.border = 4;

	this.buttonSize = 25; /* minimum, scales up with resolution though */
	this.buttonBorder = 3;

	this.testPattern = function() {
		dbg("Writing test pattern to 'cells' and 'overlay' canvases.");
		var cc = document.getElementById("cells");
		var szX = cc.width; var szY = cc.height;
		var ctx = cc.getContext("2d");
		var image = ctx.getImageData(0,0,szX, szY);
        var imageData = image.data;
        var j = 0; var a, b;
        for (y=0; y < szY; y++) {
        	for (x=0; x < szX; x++) {
        		a = x - 0.5*szX; b = y - 0.5*szY;
        		var gr = Math.sin(a*a + b*b);
        		gr = Math.round((gr + 1) * 127.0);
        		var gg = Math.sin(a*a + b*b + 2*Math.PI/3.0);
        		gg = Math.round((gg + 1) * 127.0);
        		var gb = Math.sin(a*a + b*b + 4*Math.PI/3.0);
        		gb = Math.round((gb + 1) * 127.0);
           		imageData.set([gr,gg,gb,255],j);
           		j += 4;
        	}
    	}
        ctx.putImageData(image,0,0);

        var co = document.getElementById("overlay");
        var ctx = co.getContext("2d");
        var szX = co.width; var szY = co.height;
        ctx.strokeStyle = "#151";
        ctx.lineWidth = 2.0 * szX / 384.0;
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(szX, szY);
        ctx.moveTo(szX, 0);
        ctx.lineTo(0, szY);
        ctx.stroke();
	}

	this.disableSelection = function (element) {
		/* from https://stackoverflow.com/questions/2310734/how-to-make-html-text-unselectable */
            if (typeof element.onselectstart != 'undefined') {
                element.onselectstart = function() { return false; };
            } else if (typeof element.style.MozUserSelect != 'undefined') {
    	        element.style.MozUserSelect = 'none';
            } else {
            element.onmousedown = function() { return false; };
        }
    }

	this.getViewPort = function() {
		/* from https://andylangton.co.uk/blog/development/get-viewportwindow-size-width-and-height-javascript */
		var viewportwidth, viewportheight;
		// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
  
		if (typeof window.innerWidth != 'undefined')
		{
		    viewportwidth = window.innerWidth,
		    viewportheight = window.innerHeight
		}
  
		// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
 
		 else if (typeof document.documentElement != 'undefined'
     				&& typeof document.documentElement.clientWidth !=
     					'undefined' && document.documentElement.clientWidth != 0)
 		{
       		viewportwidth = document.documentElement.clientWidth,
       		viewportheight = document.documentElement.clientHeight
 		}
  
 		// older versions of IE
		else
 		{
       		viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
       		viewportheight = document.getElementsByTagName('body')[0].clientHeight
 		}
		return [viewportwidth, viewportheight];
	}

	this.putButton = function(name, x, y, w, h) {
		var butn = 'btn_' + name;  var imgn = 'img_' + name;
		var bb = Math.round(this.buttonBorder * (w/25.0));
		document.getElementById(butn).style.borderWidth = bb;
		x-=bb; y-=bb;
		document.getElementById(imgn).style.width = Math.round(w);
		document.getElementById(imgn).style.height = Math.round(h);
		document.getElementById(butn).style.top = Math.round(y);
		document.getElementById(butn).style.left = Math.round(x);
		document.getElementById(butn).style.visibility = "visible";
		document.getElementById(butn).disabled = "true";
	}

	this.enableButton = function(name, val) {
		var e = document.getElementById("btn_"+name);
		if (val) {
			e.disabled = false;
			e.style.opacity = 1.0;
		} else {
			e.disabled = true;
			e.style.opacity = 0.5;
		}
	}

	this.doLayout = function () {
		document.getElementById("thebody").style.backgroundColor = "green";
		document.getElementById("outer").style.backgroundColor = "#111111"

		var vp = that.getViewPort();
		/* calculate playfield maximum size:  how big a square can fit in window? */
		/* need to leave 'minimumSideW' pixels either to bottom (portrait) or sides (landscape) */
		var squ = Math.min (vp[0], vp[1]);

		var bor = Math.round(that.border * squ / 600.0);
		document.getElementById("container").style.borderWidth=bor+"px";
		document.getElementById("container").style.borderStyle="solid";
		document.getElementById("container").style.borderColor="#444444";
		document.getElementById("container").style.borderRadius=bor*2+"px";
		var pad = Math.round(that.padding * (squ/600.0));
		squ -= 2 * pad;
		pad -= bor;

		var sideW = Math.max(vp[0],vp[1]) - (2 * (pad + bor) + squ);
		var dsW = that.minimumSideW - sideW;
		if (dsW > 0) {
			squ -= dsW;
		}

		/* set up playfield */
		var id = ["container", "cells", "overlay"];
		var i, e;
		e = document.getElementById("outer");
		outer.style.padding = pad;
		outer.style.height = vp[1];
		for (i = 0; i < id.length; i++) {
			e = document.getElementById(id[i]);
			e.style.width = squ; e.style.height = squ;
		}

		/* calculate button size */
		var bS = that.buttonSize;
		dbg("buttonsize: " + bS);
		if (squ > 350) {bS = Math.round (bS * squ / 350.0);}

		/* format text area */
		e = document.getElementById("textLine");
		e.style.borderWidth=bor+"px";
		e.style.borderStyle="solid";
		e.style.borderColor="#444444";
		e.style.backgroundColor="#777777";
		e.style.borderRadius=bor*2+"px";
		e.style.fontSize = Math.round(bS * 16 / 25);
		e.style.color = "#CC0000";
		e.style.textAlign = "center";
		that.disableSelection(e);
			
		/* lay out buttons and text area, depending upon portrait/landscape orientation */

		var x, xx, y, yy;
		var bnames = ["bomb", "trash", "clock", "shield", "", "menu"];
		/* the big choice */
		if (vp[0] > vp[1]) {
			/* landscape layout */
			dbg ("landscape layout");
			if (dsW > 0) {
				var tstr = "translateY("+Math.round(dsW/2) + "px)";
				dbg("Shift playfield down by " + tstr);
				document.getElementById("container").style.transform = tstr;
			}

			x = (vp[0] - (squ + bor)) * 0.25;
			x -= bS*0.5;
			y = (vp[1] - squ) * 0.5 + (dsW>0? dsW*0.25 : 0);
			/* [pad] [B1] [B2] [B3][B4] [pad] */
			yy = (squ - bS) / 3.0; /* bS*4 + 3 * (spacer) = squ */
			for (i=0; i < 4; i++) {
				if (bnames[i].length > 0) {
					that.putButton(bnames[i], x, y, bS, bS);
				}
				y += yy;
			}
			x = Math.min(vp[0] - x, vp[0] - (bS + pad + bor));
			that.putButton("menu", x, y-yy, bS, bS);
			y = (vp[1] - squ) * 0.5 + (dsW>0? dsW*0.25 : 0);
			e = document.getElementById("textLine");
			e.style.top = y - bor;
			x = (vp[0] - (squ + bor)) * 0.5 + squ + 2*bor;
			e.style.left = x;
			e.style.width = vp[0] - (x + 3*bor);
			//e.style.height = Math.round(bS * 16 / 25) + 2*bor;
			e.style.visibility = 'visible';
		} else {
			/* portrait layout */
			/* [pad] B1 B2 B3 B4 [No Button] [BMenu] [pad] */
			y = vp[1] - (bS + pad); //squ + 2 * pad + 2*bor;
			x = squ; //vp[0] - 2*pad; /* = 6*bS + 5 * spacing */
			x = (x-bS)/5.0; /* now x = bS + spacing! */
			xx = vp[0] * 0.5; /* halfway between B3 left and B4 right */
			xx -= (2.5*x + 0.5 * bS);
			for (i=0; i < bnames.length; i++) {
				if (bnames[i].length > 0) {
					that.putButton(bnames[i], xx, y, bS, bS);
				}
				xx += x;
			}

			e = document.getElementById("textLine");
			e.style.top = squ + pad + 2*bor;
			e.style.left = (vp[0]-squ) * 0.5 - bor;
			e.style.width = squ;
			e.style.height = y - e.style.top;
			e.style.height -= bor;
			e.style.visibility = 'visible';

		}
		that.enableButton("bomb", false);
		that.enableButton("clock", false);
		that.enableButton("trash", false);
		that.enableButton("shield", false);
		that.enableButton("menu", true);
	}

	this.init = function() {
		dbg ("initializing layout");
		/* writing test pattern to cells */
		that.testPattern();
		/* do the actual layout! */
		that.doLayout();
	}

}

var LAYOUT = new Layout();
dbg ("Constructed LAYOUT object");