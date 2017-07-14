/* game levels go here */
var LEVELS = new Array();

/* really level one, right? zero-based array may be easier to handle. */
LEVELS[0] = {
	"graphics":{"p1Color":0xFF2010, "p2Color":0x10FF20, "bgColor":0x100030},
	"game":{"spawnBox":0.20},
	"sequence": {
		0: ["PROMPT", "Drop green cells to prevent the red cells from escaping!"],
		10: ["SPAWN", 0],
		210: ["SPAWN", 0],
		410: ["SPAWN", 0],
		510: ["SPAWN", 0],
		610: ["SPAWN", 0],
		710: ["SPAWN", 0],
		810: ["SPAWN", 0],
		910: ["SPAWN", 0],
		1000: ["PROMPT", "Very good!"],
		1050: ["END"]
	}
}

