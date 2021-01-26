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

export const mask = {
	light1 : new Image(),
	init : function() {
		this.light1.src = "assets/sprites/mask_light1.png";
	}
}

export const nineslice = {
	test1 : {
		base : new Image(),
		left : 8, 
		right : 16,
		top : 8,
		bottom : 16
	},
	test2 : {
		base : new Image(),
		left : 3, 
		right : 6,
		top : 3,
		bottom : 6
	},
	init : function() {
		this.test1.base.src = "assets/sprites/nineSlice.png";
		this.test2.base.src = "assets/sprites/nineslicetest.png";
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

export const Ui = {
	lastVisibleElements: [],
	visibleElements: [],
	textOnHover: document.getElementById("textOnHover"),

	updateVisibility : function() {
		for(let i in this.lastVisibleElements) {
			if(this.lastVisibleElements[i] != this.visibleElements[i]) {
				// hide all ui before displaying new ones
				for(let i in this) {
					let html = this[i].html;
					if(html) {
						html.style.display = "none";
					}
				}
				// set elements to visible
				for(let i in this.visibleElements) {
					let elementName = this.visibleElements[i];
					let html = this[elementName].html;
					html.style.display = "initial";
				}
			}
		}
		this.lastVisibleElements = this.visibleElements;
	},

	replace : function (elements) {
		this.visibleElements = elements;
	},

	show : function (element) {
		if(!this.visibleElements.includes(element)) {
			this.visibleElements.push(element);
		}
	},

	hide : function (element) {
		this.visibleElements = this.visibleElements.filter(e => e !== element);
	}
}

export const debugOutput = {
	output0: document.getElementById("debug0"),
	output1: document.getElementById("debug1"),
	output2: document.getElementById("debug2"),
	output3: document.getElementById("debug3"),
	output4: document.getElementById("debug4"),
	output5: document.getElementById("debug5"),
	output6: document.getElementById("debug6"),
	output7: document.getElementById("debug7"),
	output8: document.getElementById("debug8"),
	output9: document.getElementById("debug9"),

	show: function() {
		this.output0.style.display = "initial";
		this.output1.style.display = "initial";
		this.output2.style.display = "initial";
		this.output3.style.display = "initial";
		this.output4.style.display = "initial";
		this.output5.style.display = "initial";
		this.output6.style.display = "initial";
		this.output7.style.display = "initial";
		this.output8.style.display = "initial";
		this.output9.style.display = "initial";
	},

	hide: function() {
		this.output0.style.display = "none";
		this.output1.style.display = "none";
		this.output2.style.display = "none";
		this.output3.style.display = "none";
		this.output4.style.display = "none";
		this.output5.style.display = "none";
		this.output6.style.display = "none";
		this.output7.style.display = "none";
		this.output8.style.display = "none";
		this.output9.style.display = "none";
	}
}

background.init();
spritesheet.init();
mask.init();
nineslice.init();
sound.init();

//cache all elements under ui-container
let container = document.getElementById("ui_container");
let children = container.getElementsByClassName("bg");
for(let i in children) {
	let child = children[i];
	if(child.className) {
		let arrayOfClassNames = child.className.toString().split(/\s+/);
		let uiElement = {};
		uiElement["html"] = child; 
		let classes = {};
		for(let j = 0; j < arrayOfClassNames.length; j+=2) {
			classes[arrayOfClassNames[j]] = arrayOfClassNames[j + 1];
		}
		uiElement["tags"] = classes;
		Ui[child.id] = uiElement;
	}
	child.style.display = "none";
}
Ui.show("main_menu");
Ui.show("main_menu_connect");
Ui.show("main_menu_create");
