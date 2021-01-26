export const background = {
	dungeon: new Image(),
	init: function() {
		this.dungeon.src = "assets/sprites/background_dungeon.png";
	}
}

// object containing spritesheet images
export const spritesheet = {
	// Corresponds to 'spritesheet' property in animation.json
	player : new Image(),
	monsters_dungeon : new Image(),
	items : new Image(),
	// set sources of Image instances
	init : function() {
		this.player.src = "assets/sprites/spritesheet_player.png";
		this.monsters_dungeon.src = "assets/sprites/spritesheet_monsters_dungeon.png";
		this.items.src = "assets/sprites/spritesheet_items.png"
	}
}

// object containing sounds
export const sound = {
	test1: new Audio(),
	// set sources of Audio instances
	init: function() {
		this.test1.src = "assets/sounds/test1.wav";
	}
}

background.init();
spritesheet.init();
sound.init();