//Matt's Amazing Game Engine
//info to go here


//global vars go here
//MAGE games will appear on a single canvas element
var myScreen = 0;//main graphics context
var scrnX = 0;//the screen's width
var scrnY = 0;//the screen's height
var screenL = 0;//leftmost screen position
var screenR = 28;//rightmost screen position
var screenT = 0;//upper screen position
var screenB = 12;//bottom of the screen
var Xfact = 0;//x-rendering modifier
var Yfact = 0;//y-rendering modifier

//map tile size
var tileX = 50;//width of an individual map tile
var tileY = 50;//height of an individual map tile
var magnify = 1;//multiplier applied to tileX & tileY to zoom in and out

//basic sprite size
var imageIndex = 100;

//input
var mainX = 0;//x-coordinate of click
var mainY = 0;//y-coordinate of click
//menu variables
var chosen = false;
var theMenu = new menu();
var menumarker = 0;
var menuindex = 0;
var menuPointer = 0;

//level objects encode game levels
var myLevel = 0;
//the level map
var mymap = 0;

//Game Mode
//modes 0= initialization, "start" = splash screen,"play" = regular play, "menu" = in-game menus
var Game_State = 0;

//id number for game pieces
var IDcount = 0;

//units the player controls
var playerUnits = [];
//which unit is currently being sent commands
var activeUnit = 0;
 
//initialization variables
var firstflag = true;
var psheet = false;
var mapsheet = false;
var mobsheet = false;
var itemsheet = false;
var marksheet = false;
var splash = false;
var startpic = false;
var ban = false;


//functions start here, most general first
function Main(){
	setScreen(document.getElementById("mainscreen"));
	var start = false;
	while(start == false){
		if( startpic  ){
					start = true;
				}
	}
	//show the start screen
	myScreen.drawImage(document.getElementById("startscrn"),0,0,800,500,0,0,scrnX,scrnY);
	//initialize the level and the map
	myLevel = get_Level();
	mymap = myLevel.map.get_Map();
	//go to the game's splash screen
	setTimeout(function(){show_Splash();},1000)
};

//pass in a game level
function setLevel(lv){
	myLevel = lv;
	mymap = lv.getMap();
};



//handles user input
function mainClick(){
	//mainX-mainY
	switch(Game_State){
		//splash screen
		case "start": start_Game(); break;
		//regular play
		case "play"://if changing the number of tiles x & y, readjust with showControlls
		if(mainX < 6 && mainY < 9 && mainY > 2){
		if(mainX < 2){if(mainY == 3 || mainY == 4){activeUnit.command("UL");}if(mainY == 5 || mainY == 6){activeUnit.command("L");}if(mainY==7 || mainY == 8){activeUnit.command("LL");}}
		if(mainX >= 2 && mainX < 4){if(mainY == 3 || mainY == 4){activeUnit.command("U");}if(mainY == 5 || mainY == 6){activeUnit.command("C");}if(mainY==7 || mainY == 8){activeUnit.command("D");}}
		if(mainX >= 4 && mainX < 6){if(mainY == 3 || mainY == 4){activeUnit.command("UR");}if(mainY == 5 || mainY == 6){activeUnit.command("R");}if(mainY==7 || mainY == 8){activeUnit.command("LR");}}
		}
		else{handleInput(mainX,mainY);}
		display();showControls();
		break;
		//menu navigation
		case "menu":
		if(mainX >= 2 && mainX < 4){
			if(mainY == 3 || mainY == 4){if(menuPointer == 0){if(menuindex > 0){menuindex -= 1;}}else{menuPointer -= 1;}}
			if(mainY == 5 || mainY == 6){chosen = true;}
			if(mainY==7 || mainY == 8){if(menuPointer == 3){}else{menuPointer += 1;}}
			}
			showMenu();
		break;
	}
	};



//Graphics

//pass in a canvas to set the graphics context
function setScreen(view){
	 myScreen = view.getContext("2d");
	 var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
	 var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
	 tileX = w/screenR;
	 tileY = h/screenB;
	 for (i = 0; i < view.attributes.length; i++) {
        if(view.attributes[i].name == "width"){view.attributes[i].value = w; scrnX = view.attributes[i].value;}
        if(view.attributes[i].name == "height"){view.attributes[i].value = h;scrnY = view.attributes[i].value;}
    }
} 



//display methods

//show a message on the screen
function showMesage(message){
	
}

//displays menus
function showMenu(menu){
	//darken the screen
	myScreen.fillStyle = "#000000";
	myScreen.fillRect(0,0,scrnX,scrnY);
	//add controls
	showControls();
	//show thetitle
	myScreen.fillStyle = "#FFFFFF";
	myScreen.font = tileY+'px Arial';
	myScreen.fillText(theMenu.title,tileX*9,tileY);
	//display the options
	var vshift = 0;
	switch(theMenu.type){
	case "W":
	for (var a = 0; a < theMenu.words.length;a++){
		myScreen.fillText(theMenu.words[a],tileX*9,tileY*(a+3));
	} break;
	case "W+P": vshift = 2;
	for (var a = 0; a < theMenu.words.length;a++){
		myScreen.fillText(theMenu.words[a],tileX*9,tileY*(a+3+vshift));
	}
	var myImg = theMenu.pictures[menuPointer+menuindex];
	myScreen.drawImage(document.getElementById(myImg.sheet),myImg.getXind()*imageIndex,myImg.getYind()*imageIndex,myImg.xsiz,myImg.ysiz,tileX*9,tileY*2,tileX*2,tileY*2);
	 break;
	
	}
	//display the pointer
	myScreen.drawImage(document.getElementById("sheet1"),0,500,imageIndex,imageIndex,tileX*8,tileY*(2+menuPointer+vshift),tileX,tileY);
	if(chosen == true){handleMenu(theMenu.choices[menuPointer+menuindex])}
	

	
};



//show the current play state
function display(){draw_Map(); draw_Marks();draw_Things();}

//draws the visible portion of the map
function draw_Map(){
	
	for(var y = screenT + Yfact; y < (screenB/magnify) + Yfact; y++){
		for(var x = screenL + Xfact; x < (screenR/magnify) + Xfact; x++){
		//If the map tile is visible:
		if(mymap[x][y].isVisible()){
		//. . .draw it to the screen
		var myPic = mymap[x][y].pic;
		myScreen.drawImage(document.getElementById(myPic.sheet),myPic.getXind() * imageIndex,myPic.getYind()*imageIndex,myPic.xsiz,myPic.ysiz,(x-Xfact)*tileX,(y-Yfact)*tileY,tileX+1,tileY+1);
		//. . . and apply the apropriate fade.
		myScreen.fillStyle = "rgba(0, 0, 0,"+mymap[x][y].getFade()+")";
		myScreen.fillRect((x-Xfact)*tileX,(y-Yfact)*tileY,tileX+1,tileY+1);}
	
		//Otherwise, black out the square.
		else{myScreen.fillStyle = ("#000000");myScreen.fillRect((x-Xfact)*tileX,(y-Yfact)*tileY,tileX+1,tileY+1);}
		}}
	
	
	};
	
//draws on the landmarks
function draw_Marks(){
	for(var y = screenT + Yfact; y < (screenB/magnify) + Yfact; y++){
		for(var x = screenL + Xfact; x < (screenR/magnify) + Xfact; x++){
			if(mymap[x][y].marked == true){mymap[x][y].mark.spotted = false;}
		}}
	for(var y = screenT + Yfact; y < (screenB/magnify) + Yfact; y++){
		for(var x = screenL + Xfact; x < (screenR/magnify) + Xfact; x++){
		if(mymap[x][y].marked == true){
			if(mymap[x][y].mark.spotted == false ){
				if(mymap[x][y].isVisible()){
					var myPic = mymap[x][y].mark.pic;
				myScreen.drawImage(document.getElementById(myPic.sheet),myPic.getXind()*imageIndex,myPic.getYind()*imageIndex,myPic.xsiz,myPic.ysiz,(mymap[x][y].mark.mapx-Xfact)*tileX,(mymap[x][y].mark.mapy-Yfact)*tileY,tileX*mymap[x][y].mark.xout,tileY*mymap[x][y].mark.yout);
				mymap[x][y].mark.spotted = true;
			}}
		}}}
	};
//draws items & units, etc.
function draw_Things(){
	for(var y = screenT + Yfact; y < (screenB/magnify) + Yfact; y++){
		for(var x = screenL + Xfact; x < (screenR/magnify) + Xfact; x++){
			var myStuff = [];
			myStuff = mymap[x][y].getVisible();
			if(myStuff.length > 0){
				for(var a = 0; a < myStuff.length; a++){
				var myPic = myStuff[a].pic;
				myScreen.drawImage(document.getElementById(myPic.sheet),myPic.getXind()*imageIndex,myPic.getYind()*imageIndex,myPic.xsiz,myPic.ysiz,(x-Xfact)*tileX,(y-Yfact)*tileY,tileX+1,tileY+1);
				}}
			
		}}
	};


//shows the mini-map
function show_Map(){}

//shows the controls
function showControls(){//if changing the number of tiles on the screen, fix with mainClick()
	switch(Game_State){
	case "play": 
	myScreen.drawImage(document.getElementById("sheet1"),0,400,300,100,0,scrnY-(tileY*9),tileX*6,(tileY*2)+1);
	myScreen.drawImage(document.getElementById("sheet1"),300,400,300,100,0,scrnY-(tileY*7),tileX*6,(tileY*2)+1);
	myScreen.drawImage(document.getElementById("sheet1"),300,500,300,100,0,scrnY-(tileY*5),tileX*6,(tileY*2)+1);
	break;
	case "menu":
	myScreen.drawImage(document.getElementById("sheet1"),100,400,100,100,tileX*2,scrnY-(tileY*9),tileX*2,(tileY*2)+1);
	myScreen.drawImage(document.getElementById("sheet1"),400,400,100,100,tileX*2,scrnY-(tileY*7),tileX*2,(tileY*2)+1);
	myScreen.drawImage(document.getElementById("sheet1"),400,500,100,100,tileX*2,scrnY-(tileY*5),tileX*2,(tileY*2)+1);
	break;
}
};


//objects

//subclassing method
function inheritPrototype(child, parent){
var copy_of_parent = Object.create(parent.prototype);
copy_of_parent.constructor = child;
child.prototype = copy_of_parent;
};

//basic image
function image(){
	this.comment = "";
	this.sheet = "sheet1";
	this.xind = 0;
	this.yind = 0;
	this.xsiz = 100;
	this.ysiz = 100;
};
image.prototype = {
	constructor: image,
	setInd: function(x,y){this.xind = x; this.yind = y;},
	setSiz: function(x,y){this.xsiz = x; this.ysiz = y;},
	getXind: function(){return this.xind;},
	getYind: function(){return this.yind;}
};


//basic game piece
function gamePiece(){
	IDcount += 1;
	var ID = IDcount;
	
	this.type = 0;
	
	this.properties = {};
	//the map position of this piece
	this.mapx = -1;
	this.mapy = -1;
	//describes where the current image of this piece is on its sprite sheet
	//this.xind = 0;
	//this.yind = 0;
	//sets the size of the piece's image
	//this.xsiz = 100;
	//this.ysiz = 100;
	//what sprite sheet is the graphic on
	//this.sheet = "sheet1";
	//the image used to depict this piece
	this.pic = new image()
	//is this piece visible?
	this.visible = true;
	//how faded is the piece when rendered (0 = clear up to 1 = invisible)
	this.fade = 0;
};
gamePiece.prototype = {
	constructor: gamePiece,
	getID: function(){return this.ID;},
	set_Type: function(kind){this.type = kind;},
	get_Type: function(){return this.type;},
	set_Property: function(property,value){this.properties[property] = value;},
	get_Property: function(property){return this.properties[property];},
	set_img: function(image){this.pic.setInd(0,0);},
	get_xind: function(){ return this.xind;},
	get_yind: function(){ return this.yind;},
	isVisible: function(){ return this.visible;},
	getFade: function(){ return this.fade;},
	getSheet: function(){return this.sheet;}
};

// basic unit
function unit(){
	gamePiece.call(this);
	this.pic.sheet = "mobz";
	
};
inheritPrototype(unit,gamePiece);
//passes commands to a unit
unit.prototype.command = function(cmd){
		switch(cmd){
			case "U":break;
			case "D":break;
			case "L":break;
			case "R":break;
			case "UL":break;
			case "UR":break;
			case "LL":break;
			case "LR":break;
			case "C": break;
		}
	};
	
unit.prototype.moveCheck = function(){
	return true;
};



//map tile
function tile(){
	gamePiece.call(this);
	this.thing = new item();
	this.marked = false;
	this.mark = false;
	this.occupied = false;
	this.occupant = 0;
	this.pic.sheet = "landscape";
	 
	
};
inheritPrototype(tile,gamePiece);
tile.prototype.getVisible = function(){return [];};



//item
function item(){
	gamePiece.call(this);
	this.pic.sheet = "itemz"
	this.visible = false;
	this.collected = true;
};
inheritPrototype(item,gamePiece);
tile.prototype.isCollected = function(){ return collected;};


//landmark
function landmark(){
	gamePiece.call(this);
	this.pic.sheet = "lmarks";
	this.spotted = false;
	this.xout = 2;
	this.yout = 2;
	this.pic.setSiz(200,200);
	//this.xsiz = 200;
	//this.ysiz = 200;
};
inheritPrototype(landmark,gamePiece);


//basic map
function map(){
	this.mapX = 0;
	this.mapY = 0;
	this.theMap = [];
};
map.prototype = {
	constructor: map,
	//creates an array of map tiles
	create: function(x,y){
		mapX = x-1;
		mapY = y-1; 
		for(var a = 0; a < x; a++){
			var mapcol = [];
		for(var b = 0; b < y; b++){
			mapcol.push( new tile());
			}
			this.theMap.push(mapcol);
			}
			},
	//returns the full array
	get_Map: function(){ return this.theMap;},
	//replaces one of the tiles in the map with a tile passed in as an argument
	set_Tile: function(x,y,tile){
		if(x < 0){x = 0;}
		if(x > mapX){x = mapX;}
		if(y < 0){y = 0;}
		if(y > mapY){y = mapY;}
		this.theMap[x][y] = tile;
		},
	//returns a tile out of the map
	get_Tile: function(x,y){
		if(x < 0){x = 0;}
		if(x > mapX){x = mapX;}
		if(y < 0){y = 0;}
		if(y > mapY){y = mapY;}
		return this.theMap[x][y];
	}
};

//basic level
function level(){
	this.map = new map();
}

//a set of menu options
function menu(){
	this.type = "W";
	this.title = "menu";
	this.choices = [];
	//this.usepics = false;
	this.pictures = [];
	//this.usewords = false;
	this.words = [];
}; 

