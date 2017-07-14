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

LEVELS[1] = {
	"graphics":{"p1Color":0xFF0010, "p2Color":0x20FF00, "bgColor":0x000020},
	"game":{"spawnBox":0.20},
	"sequence": {
		0: ["PROMPT", "And more"],
		10: ["SPAWN", 0],
		110: ["SPAWN", 1],
		210: ["SPAWN", 2],
		310: ["SPAWN", 3],
		410: ["SPAWN", 4],
		510: ["SPAWN", 0],
		590: ["SPAWN", 129],
		670: ["SPAWN", 130],
		750: ["SPAWN", 131],
		830: ["SPAWN", 132],
		930: ["SPAWN", 137],
		1030: ["SPAWN", 0],
		1100: ["END"]
	}
}

LEVELS[2] = {
	"graphics":{"p1Color":0xEF0020, "p2Color":0x00FF10, "bgColor":0x000018},
	"game":{"spawnBox":0.20},
	"sequence": {
		0: ["PROMPT", "3"],
		10: ["SPAWN", 0],
		20: ["SPAWN", 0],
		30: ["SPAWN", 0],
		40: ["SPAWN", 0],
		45: ["SPAWN", 0],
		50: ["SPAWN", 0],
		55: ["SPAWN", 0],
		60: ["SPAWN", 0],
		65: ["SPAWN", 0],
		70: ["SPAWN", 0],
		75: ["SPAWN", 0],
		80: ["SPAWN", 0],
		85: ["SPAWN", 0],
		90: ["SPAWN", 0],
		95: ["SPAWN", 0],
		100: ["SPAWN", 0],
		110: ["SPAWN", 132],
		210: ["SPAWN", 3],
		310: ["SPAWN", 2],
		410: ["SPAWN", 1],
		510: ["SPAWN", 0],
		590: ["SPAWN", 130],
		670: ["SPAWN", 129],
		750: ["SPAWN", 132],
		830: ["SPAWN", 131],
		930: ["SPAWN", 137],
		1030: ["SPAWN", 0],
		1100: ["END"]
	}
}