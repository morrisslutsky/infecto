function Audio() {

	var audioOK = false;
	this.isOK = function() {return audioOK;}

	var sounds = ["bomb", "trash", "clock", "loss", "win", "shield", "spawn0", "spawn1", "spawn2", "start", "warn"];
	var aO = {};
	var spC = 3; var spN = 0;

	this.play = function(fx) {
		if (fx == 'spawn') {
			fx = 'spawn' + spN;
			spN++; if (spN == spC) {spN = 0;}
		}
		if (aO[fx] == null) return;
		aO[fx].play();
	}

	function hasAudio() {
  		var audio = document.createElement('audio');
  		return ((audio && audio.canPlayType) != null);
	}

	function canPlayEvent(ele, name) {
		aO[name] = ele;
	}

	function makeHandler(ele, name) {return function() {canPlayEvent(ele, name);};}

	audioOK = hasAudio();
	if (!audioOK) return;

	var i; for (i=0;i<sounds.length;i++) {
		var a = document.createElement('audio');
		a.volume = 0.9; a.loop = false;
		a.src="snd/"+sounds[i]+'.mp3';
		a.addEventListener("canplay", makeHandler(a, sounds[i]), false);
	}
}

var AUDIO = new Audio();
