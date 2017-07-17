/* game levels go here */
var LEVELS = new Array();

/* really level one, right? zero-based array may be easier to handle. */
LEVELS[0] = {
	"graphics":{"p1Color":0xFF2010, "p2Color":0x10FF20, "bgColor":0x100030},
	"game":{"spawnBox":0.20},
	"sequence": {
		0: ["PROMPT", "Drop green cells to prevent the red cells from escaping!"],
		50: ["PROMPT", "Move the cursor to leave a trail of green cells."],
		100: ["PROMPT", "Build up cells to make a growing population."],
		150: ["PROMPT", "Block the red cells from growing to the edge of the board."],
		200: ["SPAWN", 0],
		300: ["SPAWN", 0],
		400: ["SPAWN", 0],
		500: ["SPAWN", 0],
		600: ["SPAWN", 0],
		700: ["SPAWN", 0],
		800: ["SPAWN", 0],
		900: ["SPAWN", 0],
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
		530: ["SPAWN", 0],
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
	"graphics":{"p1Color":0xEF2000, "p2Color":0x00FF10, "bgColor":0x000010},
	"game":{"spawnBox":0.20},
	"sequence": {
		0: ["PROMPT", "Level 3"],
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

LEVELS[3] = {
	"graphics":{"p1Color":0xE02000, "p2Color":0x00FF10, "bgColor":0x000000},
	"game":{"spawnBox":0.20},
	"sequence": {
		0: ["PROMPT", "FOUR!"],
		15: ["SPAWN", 9],
		110: ["SPAWN", 0],
		120: ["SPAWN", 0],
		130: ["SPAWN", 0],
		140: ["SPAWN", 0],
		150: ["SPAWN", 0],
		160: ["SPAWN", 0],
		170: ["SPAWN", 0],
		180: ["SPAWN", 0],
		190: ["SPAWN", 0],
		200: ["SPAWN", 0],
		210: ["SPAWN", 0],
		220: ["SPAWN", 0],
		230: ["SPAWN", 0],
		240: ["SPAWN", 0],
		250: ["SPAWN", 0],
		260: ["SPAWN", 0],
		300: ["SPAWN", 132],
		400: ["SPAWN", 3],
		480: ["SPAWN", 2],
		540: ["SPAWN", 1],
		600: ["SPAWN", 0],
		660: ["SPAWN", 130],
		720: ["SPAWN", 129],
		780: ["SPAWN", 132],
		840: ["SPAWN", 131],
		930: ["SPAWN", 137],
		1030: ["SPAWN", 0],
		1100: ["ENDNOP"]
	}
}

LEVELS[4] = {
	"graphics":{"p1Color":0xE08000, "p2Color":0x00E080, "bgColor":0x100000},
	"game":{"spawnBox":0.20, "frameDelay": 35},
	"sequence": {
		0: ["PROMPT", "Level 5!"],
		10: ["SPAWN", 9],
		120: ["SPAWN", 5],
		125: ["SPAWN", 6],
		150: ["SPAWN", 7+128],
		160: ["SPAWN", 8],
		190: ["SPAWN", 0],
		192: ["SPAWN", 0],
		194: ["SPAWN", 0],
		196: ["SPAWN", 0],
		200: ["SPAWN", 0],
		210: ["SPAWN", 0],
		220: ["SPAWN", 0],
		230: ["SPAWN", 0],
		240: ["SPAWN", 0],
		250: ["SPAWN", 0],
		260: ["SPAWN", 0],
		300: ["SPAWN", 132],
		400: ["SPAWN", 5],
		480: ["SPAWN", 6],
		540: ["SPAWN", 7],
		600: ["SPAWN", 8],
		660: ["SPAWN", 138],
		720: ["SPAWN", 129],
		780: ["SPAWN", 132],
		840: ["SPAWN", 131],
		930: ["SPAWN", 137],
		1030: ["SPAWN", 0],
		1100: ["END"]
	}
}

LEVELS[5] = {
	"graphics":{"p1Color":0xD09000, "p2Color":0x00E080, "bgColor":0x200000},
	"game":{"spawnBox":0.23},
	"sequence": {
		0: ["PROMPT", "Did you ever feel boxed in?"],
		10: ["SPAWN", 9],
		120: ["SPAWN", 5],
		125: ["SPAWN", 6],
		150: ["SPAWN", 7+128],
		160: ["SPAWN", 8],
		190: ["SPAWN", 0],
		192: ["SPAWN", 0],
		194: ["SPAWN", 0],
		196: ["SPAWN", 0],
		200: ["SPAWN", 0],
		210: ["SPAWN", 0],
		220: ["SPAWN", 0],
		230: ["SPAWN", 0],
		240: ["SPAWN", 0],
		250: ["SPAWN", 0],
		260: ["SPAWN", 0],
		300: ["SPAWN", 13+128],
		400: ["SPAWN", 5],
		480: ["SPAWN", 6],
		540: ["SPAWN", 7],
		600: ["SPAWN", 8],
		660: ["SPAWN", 12+128],
		720: ["SPAWN", 129],
		780: ["SPAWN", 132],
		840: ["SPAWN", 131],
		930: ["SPAWN", 137],
		1030: ["SPAWN", 0],
		1100: ["END"]
	}
}

LEVELS[6] = {
	"graphics":{"p1Color":0xC0B000, "p2Color":0x00E0A0, "bgColor":0x300000},
	"game":{"spawnBox":0.23},
	"sequence": {
		0: ["PROMPT", "7!"],
		10: ["SPAWN", 11],
		120: ["SPAWN", 5],
		125: ["SPAWN", 12],
		150: ["SPAWN", 7+128],
		160: ["SPAWN", 8],
		190: ["SPAWN", 0],
		192: ["SPAWN", 0],
		194: ["SPAWN", 0],
		196: ["SPAWN", 0],
		200: ["SPAWN", 10],
		220: ["SPAWN", 12],
		240: ["SPAWN", 10],
		260: ["SPAWN", 12],
		300: ["SPAWN", 13+128],
		400: ["SPAWN", 1],
		480: ["SPAWN", 2],
		540: ["SPAWN", 3],
		600: ["SPAWN", 4],
		660: ["SPAWN", 12+128],
		780: ["SPAWN", 138],
		930: ["SPAWN", 139],
		1030: ["SPAWN", 0],
		1100: ["END"]
	}
}

LEVELS[7] = {
	"graphics":{"p1Color":0xB0C000, "p2Color":0x00D0B0, "bgColor":0x180018},
	"game":{"spawnBox":0.23},
	"sequence": {
		0: ["PROMPT", "If you liked 7, you'll love 8!"],
		10: ["SPAWN", 11],
		120: ["SPAWN", 5],
		125: ["SPAWN", 12],
		150: ["SPAWN", 7+128],
		160: ["SPAWN", 8],
		190: ["SPAWN", 0],
		192: ["SPAWN", 0],
		194: ["SPAWN", 0],
		196: ["SPAWN", 0],
		200: ["SPAWN", 10],
		210: ["SPAWN", 11],
		220: ["SPAWN", 12],
		230: ["SPAWN", 13],
		240: ["SPAWN", 10],
		250: ["SPAWN", 11],
		260: ["SPAWN", 12],
		300: ["SPAWN", 13+128],
		400: ["SPAWN", 1],
		480: ["SPAWN", 2],
		540: ["SPAWN", 3],
		600: ["SPAWN", 4],
		660: ["SPAWN", 12+128],
		720: ["SPAWN", 129],
		780: ["SPAWN", 138],
		840: ["SPAWN", 131],
		930: ["SPAWN", 139],
		1030: ["SPAWN", 0],
		1100: ["END"]
	}
}

LEVELS[8] = {
	"graphics":{"p1Color":0xC0B000, "p2Color":0x80C0F0, "bgColor":0x100020},
	"game":{"spawnBox":0.23},
	"sequence": {
		0: ["PROMPT", "Why was 6 afraid of 7?  Because 7 ate NINE!"],
		10: ["SPAWN", 11],
		120: ["SPAWN", 5],
		125: ["SPAWN", 12],
		150: ["SPAWN", 7+128],
		160: ["SPAWN", 8],
		190: ["SPAWN", 0],
		192: ["SPAWN", 0],
		194: ["SPAWN", 0],
		196: ["SPAWN", 0],
		200: ["SPAWN", 10],
		210: ["SPAWN", 11],
		220: ["SPAWN", 12],
		230: ["SPAWN", 13],
		240: ["SPAWN", 10],
		250: ["SPAWN", 11],
		260: ["SPAWN", 12],
		300: ["SPAWN", 13+128],
		390: ["SPAWN", 0],
		392: ["SPAWN", 0],
		394: ["SPAWN", 0],
		396: ["SPAWN", 0],
		400: ["SPAWN", 10+128],
		420: ["SPAWN", 0],
		422: ["SPAWN", 0],
		424: ["SPAWN", 0],
		426: ["SPAWN", 0],
		430: ["SPAWN", 11+128],
		460: ["SPAWN", 12+128],
		520: ["SPAWN", 129],
		580: ["SPAWN", 138],
		640: ["SPAWN", 131],
		730: ["SPAWN", 139],
		830: ["SPAWN", 0],
		900: ["PROMPT", "I had a Powerup for you but I lost it somewhere :("],
		1000: ["ENDNOP"]
	}
}

LEVELS[9] = {
	"graphics":{"p1Color":0xC0C000, "p2Color":0xB0E0FF, "bgColor":0x000030},
	"game":{"spawnBox":0.23},
	"sequence": {
		0: ["PROMPT", "TEN!"],
		10: ["SPAWN", 11],
		90: ["SPAWN", 6],
		140: ["SPAWN", 13],
		220: ["SPAWN", 7],
		260: ["SPAWN", 10],
		340: ["SPAWN", 5],
		390: ["SPAWN", 12],
		470: ["SPAWN", 8],
		510: ["SPAWN", 11],
		590: ["SPAWN", 6],
		640: ["SPAWN", 13],
		720: ["SPAWN", 7],
		760: ["SPAWN", 10],
		840: ["SPAWN", 5],
		890: ["SPAWN", 12],
		970: ["SPAWN", 8],
		1030: ["END"]
	}
}

LEVELS[10] = {
	"graphics":{"p1Color":0xFF2010, "p2Color":0x10FF20, "bgColor":0x100030},
	"game":{"spawnBox":0.28},
	"sequence": {
		0: ["PROMPT", "Home again!  This looks familiar."],
		5: ["SPAWN", 14],
		200: ["SPAWN", 0],
		300: ["SPAWN", 0],
		400: ["SPAWN", 0],
		500: ["SPAWN", 0],
		600: ["SPAWN", 14+128],
		700: ["SPAWN", 0],
		800: ["SPAWN", 0],
		900: ["SPAWN", 0],
		1000: ["PROMPT", "I guess that wasn't so hard."],
		1050: ["END"]
	}
}