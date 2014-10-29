var player1 = new unit();

//shows the splash screen at the start of the game
function show_Splash(){
	myScreen.drawImage(document.getElementById("splash"),0,0,800,500,0,0,scrnX,scrnY);
	Game_State = "start";
};

//provides levels to the engine
function get_Level(){ 
	var nUlev = new testlevel;
	nUlev.init();
	return nUlev;
};


//starts the fun
function  start_Game(){
	Game_State = "menu";
	
	var playermenu = new menu();
	playermenu.title = "Pick an Explorer";
	playermenu.choices = ["Dan","Stan","Fran","Dianne"];
	playermenu.usewords = true;
	playermenu.words = playermenu.choices;
	playermenu.type = "W+P";
	//playermenu.size = "Half";
	playermenu.pictures.push( new image());
	playermenu.pictures[0].setInd(6,4);
	playermenu.pictures[0].comment = "Dan";
	playermenu.pictures.push( new image());
	playermenu.pictures[1].setInd(7,4);
	playermenu.pictures[1].comment = "Stan";
	playermenu.pictures.push( new image());
	playermenu.pictures[2].setInd(6,5);
	playermenu.pictures[2].comment = "Fran";
	playermenu.pictures.push( new image());
	playermenu.pictures[3].setInd(7,5);
	playermenu.pictures[3].comment = "Dianne";
	theMenu = playermenu;
	showMenu();
	
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//INPUT Methods

//handles clicks on the screen during normal play (excepton the direction control)
function handleInput(x,y){};

//handles menu choices
function handleMenu(choice){
	chosen = false;menuPointer = 0; menuindex = 0;
	switch(theMenu.title){
		case "Pick an Explorer": player1.name = choice;if(choice == "Fran" || choice == "Dianne"){player1.properties.outfit.gender = "f";}
		player1.set_img("R");
		Game_State = "menu";
	var playermenu = new menu();
	playermenu.title = "Pick a Skillset";
	playermenu.choices = ["Ranger","Lumberjack","Diver"];
	playermenu.usewords = true;
	playermenu.words = playermenu.choices;
	playermenu.type = "W+Player(costume)";
	theMenu = playermenu;
	showMenu();
		break;
		
		case "Pick a Skillset":
		player1.set_Property("class",choice);
		Game_State = "play";player1.visCheck();display();showControls();
		break;
	}
	};



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//LAND
function land(){
	tile.call(this);
	this.marked = false;
	this.pic.setInd(Math.round(Math.random()*17),0);
	this.marked = false;
	this.mark = false;
	this.visible = false;
};
inheritPrototype(land,tile);
land.prototype.getVisible = function(){
		var mylist = [];
		if(this.thing.isVisible()){mylist.push(this.thing);}
		if(this.occupied == true){if(this.occupant.isVisible() == true){ mylist.push(this.occupant);
			if(this.occupant.properties.clothed == true){mylist.push(this.occupant.properties.outfit)}
			}}
		return mylist;
		};
land.prototype.setVisible = function(state){
	if(this.occupied == true){this.occupant.visible = state;}
	if(this.thing.collected == false){this.thing.visible = state;}
	this.visible = state;
} 

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//test level
function testlevel(){
	level.call(this);
	this.map.create(50,50);
	this.name = "funky level";
	
};
inheritPrototype(testlevel,level);
//testlevel.prototype.getMap = function(){return this.map.;};
//makes the level
testlevel.prototype.init = function(){
	
	for(var a = 0; a < 50; a++){
		for(var b = 0; b < 50; b++){
			var lnd = new land()
			lnd.mapx = a; lnd.mapy = b;
			this.map.set_Tile(a,b, lnd);
		}}
		var mymark = new testmark();
		mymark.mapx = 20; mymark.mapy = 20;
		
		for(var c = 20; c < 23; c++){
			for(var d = 20; d < 23; d++){
		
		this.map.get_Tile(c,d).marked = true;
		this.map.get_Tile(c,d).mark = mymark;
	
		
	}}
	
	this.map.get_Tile(21,21).thing = new testitem();
	this.map.get_Tile(3,0).occupant = new unit();
	this.map.get_Tile(3,0).occupant.xind = 2;
	this.map.get_Tile(3,0).occupied = true;
	this.map.get_Tile(3,2).thing = new testitem();
	
	
	this.map.get_Tile(7,2).occupant = new testplayer();
	player1 = this.map.get_Tile(7,2).occupant;
	player1.mapx = 7;
	player1.mapy = 2;
	activeUnit = player1;
	this.map.get_Tile(7,2).occupied = true;
	
	for(var a = 0; a < 50; a++){
		for(var b = 0; b < 50; b++){
			this.map.get_Tile(a,b).setVisible(false);
		}}
};

////////////////////////////////////////////////////////////////////////////////////////////////////
//test landmark
function testmark(){ 
	landmark.call(this);
	this.name = "howdy";
	this.spotted = false;
	this.xout = 3;
	this.yout = 3;
	this.pic.setInd(2,2);
}
inheritPrototype(testmark,landmark);

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//Explore! items
function testitem(){
	item.call(this);
	this.visible = true;
	this.collected = false;
	this.pic.setInd(Math.round(Math.random()*5),Math.round(Math.random()*3));
};
inheritPrototype(testitem,item);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//general unit (specific to Explore!)
function myUnit(){
	unit.call(this);
	this.target = 0;
	this.AP_tot = 0;
	this.AP_cost = {"U":1,"D":1,"L":1,"R":1,"UL":2,"UR":2,"LL":2,"LR":2,"C":0};
	this.properties.vision = 1;
};
inheritPrototype(myUnit,unit);
//passes commands to a unit
myUnit.prototype.command = function(cmd){
		this.AP_tot = this.AP_cost[cmd];
		
		var moveFlag = false;
		switch(cmd){
			case "U": if(this.mapy > 0){this.target = mymap[this.mapx][this.mapy-1];moveFlag = true;}; break;
			case "D": if(this.mapy < mymap[this.mapx].length-1){this.target = mymap[this.mapx][this.mapy+1];moveFlag = true;};break;
			case "L": if(this.mapx > 0){this.target = mymap[this.mapx-1][this.mapy];moveFlag = true;};break;
			case "R": if(this.mapx < mymap.length-1){this.target = mymap[this.mapx+1][this.mapy];moveFlag = true;};break;
			case "UL": if(this.mapy > 0 && this.mapx > 0){this.target = mymap[this.mapx-1][this.mapy-1];moveFlag = true;};break;
			case "UR": if(this.mapy > 0 && this.mapx < mymap.length-1){this.target = mymap[this.mapx+1][this.mapy-1];moveFlag = true;};break;
			case "LL": if(this.mapy < mymap[this.mapx].length-1 && this.mapx > 0){this.target = mymap[this.mapx-1][this.mapy+1];moveFlag = true;};break;
			case "LR": if(this.mapy < mymap[this.mapx].length-1 && this.mapx < mymap.length-1){this.target = mymap[this.mapx+1][this.mapy+1];moveFlag = true;};break;
			case "C": break;
		}
		if(moveFlag == true){if(this.moveCheck()){
			 GStemp = Game_State;
			Game_State = "Busy";
			this.animate("move");
			}
		}
			this.commandWrap();
	};
myUnit.prototype.commandWrap = function(){display();showControls();};
myUnit.prototype.moveCheck = function(){
	if(this.target.mapx < this.mapx){this.set_img("L");}
	if(this.target.mapx > this.mapx){this.set_img("R");}
	if(this.target.mapx > screenR+Xfact-(7+this.properties.screenborder)){if(Xfact+screenR < mymap.length){Xfact += 1;}}
	if(this.target.mapx < Xfact+screenL+this.properties.screenborder+6){if(Xfact+screenL > 0){Xfact -= 1;}}
	if(this.target.mapy > screenB+Yfact-(3+this.properties.screenborder)){if(Yfact+screenB < mymap[this.mapx].length){Yfact += 1;}}
	if(this.target.mapy < Yfact+screenT+this.properties.screenborder+2){if(Yfact+screenT > 0){Yfact -= 1;}}
	if(this.target.occupied == true){return false;}
	return true;
};
myUnit.prototype.move = function(){
	mymap[this.mapx][this.mapy].occupied = false;
			this.mapx = this.target.mapx; this.mapy = this.target.mapy;
			this.target.occupied = true;
			this.target.occupant = activeUnit;
};

myUnit.prototype.commandWrap = function(){this.visCheck();display();showControls();};
myUnit.prototype.visCheck = function(){};
myUnit.prototype.animate = function(name){
};


/////////////////////////////////////////////////////////////////////////////////////////////
//PLAYER
function testplayer(){
	myUnit.call(this);
	this.name = "Dan";
	this.pic.sheet = "sheet1";
	this.visible = true;
	this.properties.clothed = true;
	this.properties.outfit = new costume();
	this.properties.screenborder = 1;
	this.properties.class = "Ranger";
};
inheritPrototype(testplayer,myUnit);
//select the right image
testplayer.prototype.set_img = function(image){
	switch(image){
		case "L": switch(this.name){
					case "Dan":this.pic.setInd(1,0);break;
					case "Stan":this.pic.setInd(1,1);break;
					case "Fran":this.pic.setInd(1,2);break;
					case "Dianne":this.pic.setInd(1,3);break;
					}
					 this.properties.outfit.set_img("L");break;
		case "R":  switch(this.name){
					case "Dan":this.pic.setInd(0,0);break;
					case "Stan":this.pic.setInd(0,1);break;
					case "Fran":this.pic.setInd(0,2);break;
					case "Dianne":this.pic.setInd(0,3);break;
				}
					 this.properties.outfit.set_img("R");break;
	}
};
//visibility system check
testplayer.prototype.visCheck = function(){
	for(var x = 0; x < mymap.length; x++){
		for(var y = 0; y < mymap[x].length;y++){
			if(mymap[x][y].isVisible()){mymap[x][y].pic.fade = 0.5;}
			if(Math.abs(this.mapy-y) <= this.properties.vision && Math.abs(this.mapx-x) <= this.properties.vision){
				
				mymap[x][y].setVisible(true); mymap[x][y].pic.fade = 0;
				
				}
			}}
};
//animate the player
testplayer.prototype.animate = function(name){
	switch(name){
		case "move":
		var xinc = (this.target.mapx - this.mapx)*(tileX/10);
		var yinc = (this.target.mapy - this.mapy)*(tileY/10);
		var i = 0;
		var timer = setInterval(function(){
		 i += 1;
		 if (i == 10){clearInterval(timer);
			activeUnit.move();
			activeUnit.pic.Xoffset = 0;
			activeUnit.pic.Yoffset = 0;
			activeUnit.properties.outfit.pic.Xoffset = 0;
			activeUnit.properties.outfit.pic.Yoffset = 0;
			activeUnit.visCheck();
			Game_State = GStemp;}
		else{
		activeUnit.pic.Xoffset += xinc;
		activeUnit.pic.Yoffset += yinc;
		activeUnit.properties.outfit.pic.Xoffset += xinc;
		activeUnit.properties.outfit.pic.Yoffset += yinc;
		}
		display();showControls();}
		,20);
		
		
		
		
		break;
	}
};

/////////////////////////////////////////////////////////////////////////////////////////////////////
//Player character outfits

function costume(){
	gamePiece.call(this);
	this.visible = true;
	this.pic.sheet = "sheet1";
	this.gender = "m";
	this.direction = "r";
	this.type = "Ranger";
	};
inheritPrototype(costume,gamePiece);
costume.prototype.set_img = function(image){
	switch(image){
		case "L":switch(this.gender){
				 case "m":switch(this.type){
					case "Ranger": this.pic.setInd(3,1);break;
					case "Diver": this.pic.setInd(5,2); break; 
					case "Lumberjack": this.pic.setInd(5,0);break;
				 }break;
				 case "f":switch(this.type){
					case "Ranger": this.pic.setInd(3,3);break;
					case "Diver": this.pic.setInd(5,3); break; 
					case "Lumberjack": this.pic.setInd(5,1);break;
				 }break;
			 }break;
		case "R":switch(this.gender){
				case "m":switch(this.type){
					case "Ranger": this.pic.setInd(2,1);break;
					case "Diver": this.pic.setInd(4,2); break; 
					case "Lumberjack": this.pic.setInd(4,0);break;
				 }break;
				case "f":switch(this.type){
					case "Ranger": this.pic.setInd(2,3);break;
					case "Diver": this.pic.setInd(4,3); break; 
					case "Lumberjack": this.pic.setInd(4,1);break;
				 }break;
			}break;
	}
};

