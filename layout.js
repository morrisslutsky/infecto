function dbg(A) {
    console.log(A);
}

function Layout() {
	var that = this;

	this.padding = 16;

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

	this.doLayout = function () {
		var vp = that.getViewPort();
		var squ = Math.min (vp[0], vp[1]);
		var pad = Math.round(that.padding * (squ/600.0));
		squ -= 2 * pad;
		var id = ["container", "cells", "overlay"];
		var i, e;
		e = document.getElementById("outer");
		outer.style.padding = pad;
		for (i = 0; i < id.length; i++) {
			e = document.getElementById(id[i]);
			e.style.width = squ; e.style.height = squ;
		}
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