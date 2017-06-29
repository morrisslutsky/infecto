


function CLifer () {

    var that = this;    // inner function workaround //

    this.p1Color = 0xFF1020;
    this.p2Color = 0x20FF00;
    this.bgColor = 0x100030;
    this.msgColor = "rgba(255,255,0,0.8)";
    this.msgFill = "rgba(255,255,0,0.5)";
    this.lossRadius = 0.1;
    this.fadestep = 1;

    /*  difficulty settings                                                     */
    this.spawnBox = 0.25;
    this.mouseCycles = 1;
    this.spawnCycles = 500;
    this.frameDelay = 10;

    /*  helper table for neighbor enumeration                                   */
    var dx = [ 0,  1, 1, 1, 0, -1, -1, -1];
    var dy = [-1, -1, 0, 1, 1,  1,  0, -1];

    this.init = function() {
        console.log("Initializing LIFER Object");
        console.log("bgColor = " + that.bgColor);
    }
  
    console.log("Constructed LIFER Object");
 


}

var LIFER = new CLifer();

