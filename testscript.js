var player1 = new unit();

//shows the splash screen at the start of the game
function show_Splash(){
	myScreen.drawImage(document.getElementById("splash"),0,0,800,500,0,0,scrnX,scrnY);
	Game_State = "start";
};
//starts the fun
function  start_Game(){
	//display();showControls();
	//Game_State = "play";
	Game_State = "menu";
	var playermenu = new menu();
	playermenu.title = "Pick a Character";
	playermenu.choices = ["Dan","Stan","Fran","Dianne"];
	playermenu.usewords = true;
	playermenu.words = playermenu.choices;
	playermenu.type = "W+P";
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

//handles clicks on the screen during normal play (excepton the direction control)
function handleInput(x,y){};

//handles menu choices
function handleMenu(choice){
	switch(theMenu.title){
		case "Pick a Character": player1.name = choice;if(choice == "Fran" || choice == "Dianne"){player1.properties.outfit.gender = "f";}
		player1.set_img("R");
		Game_State = "play";display();showControls();break;
	}
	};

function get_Level(){
	return new testlevel();
};

//LAND
land.prototype = new tile();
function land(){
	tile.call(this);
	this.marked = false;
	//this.pic.sheet = "landscape";
	this.pic.setInd(Math.round(Math.random()*17),0);
	//this.xind = Math.round(Math.random()*17);
	//this.yind = 0;//Math.round(Math.random()*3);
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

//test level
function testlevel(){
	level.call(this);
	this.map.create(50,50);
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
	
	this.map.get_Tile(3,1).thing = new testitem();
	this.map.get_Tile(3,0).occupant = new unit();
	this.map.get_Tile(3,0).occupant.xind = 2;
	this.map.get_Tile(3,0).occupied = true;
	this.map.get_Tile(3,2).thing = new testitem();
	
	
	this.map.get_Tile(4,0).occupant = new testplayer();
	player1 = this.map.get_Tile(4,0).occupant;
	player1.mapx = 4;
	player1.mapy = 0;
	activeUnit = player1;
	this.map.get_Tile(4,0).occupied = true;
};
inheritPrototype(testlevel,level);


//test landmark
function testmark(){ 
	landmark.call(this);
	this.name = "howdy";
	this.spotted = false;
	this.xout = 3;
	this.yout = 3;
	this.pic.setInd(2,2);
	//this.xsiz = 200;
	//this.ysiz = 200;
}
inheritPrototype(testmark,landmark);



function testitem(){
	item.call(this);
	this.visible = true;
	this.collected = false;
	this.pic.setInd(Math.round(Math.random()*5),Math.round(Math.random()*3));
	//this.xind = Math.round(Math.random()*5);
	//this.yind = Math.round(Math.random()*3);
};
inheritPrototype(testitem,item);

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
		mymap[this.mapx][this.mapy].occupied = false;
		switch(cmd){
			case "U": if(this.mapy > 0){this.target = mymap[this.mapx][this.mapy-1];if(this.moveCheck()){this.mapy -= 1;}}; break;
			case "D": if(this.mapy < mymap[this.mapx].length-1){this.target = mymap[this.mapx][this.mapy+1];if(this.moveCheck()){this.mapy += 1;}};break;
			case "L": if(this.mapx > 0){this.target = mymap[this.mapx-1][this.mapy];if(this.moveCheck()){this.mapx -= 1;}};break;
			case "R": if(this.mapx < mymap.length-1){this.target = mymap[this.mapx+1][this.mapy];if(this.moveCheck()){this.mapx += 1;}};break;
			case "UL": if(this.mapy > 0 && this.mapx > 0){this.target = mymap[this.mapx-1][this.mapy-1];if(this.moveCheck()){this.mapy -= 1;this.mapx -= 1;}};break;
			case "UR": if(this.mapy > 0 && this.mapx < mymap.length-1){this.target = mymap[this.mapx+1][this.mapy-1];if(this.moveCheck()){this.mapy -= 1;this.mapx += 1;}};break;
			case "LL": if(this.mapy < mymap[this.mapx].length-1 && this.mapx > 0){this.target = mymap[this.mapx-1][this.mapy+1];if(this.moveCheck()){this.mapy += 1;this.mapx -= 1;}};break;
			case "LR": if(this.mapy < mymap[this.mapx].length-1 && this.mapx < mymap.length-1){this.target = mymap[this.mapx+1][this.mapy+1];if(this.moveCheck()){this.mapy += 1;this.mapx += 1;}};break;
			case "C": break;
		}
			mymap[this.mapx][this.mapy].occupied = true;
			mymap[this.mapx][this.mapy].occupant = this;
			this.commandWrap();
	};
myUnit.prototype.commandWrap = function(){};

function testplayer(){
	myUnit.call(this);
	this.name = "Dan";
	this.pic.sheet = "sheet1";
	this.visible = true;
	this.properties.clothed = true;
	this.properties.outfit = new costume();
	this.properties.screenborder = 1;
	//this.xind = 0;
	//this.yind = 0;
};
inheritPrototype(testplayer,myUnit);
testplayer.prototype.moveCheck = function(){
	if(this.target.mapx < this.mapx){this.set_img("L");}
	if(this.target.mapx > this.mapx){this.set_img("R");}
	if(this.target.mapx > screenR+Xfact-(1+this.properties.screenborder)){if(Xfact+screenR < mymap.length){Xfact += 1;}}
	if(this.target.mapx < Xfact+screenL+this.properties.screenborder){if(Xfact+screenL > 0){Xfact -= 1;}}
	if(this.target.mapy > screenB+Yfact-(1+this.properties.screenborder)){if(Yfact+screenB < mymap[this.mapx].length){Yfact += 1;}}
	if(this.target.mapy < Yfact+screenT+this.properties.screenborder){if(Yfact+screenT > 0){Yfact -= 1;}}
	return true;
};
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
testplayer.prototype.commandWrap = function(){this.visCheck();}
testplayer.prototype.visCheck = function(){
	for(var x = 0; x < mymap.length; x++){
		for(var y = 0; y < mymap[x].length;y++){
			if(mymap[x][y].isVisible()){mymap[x][y].fade = 0.5;}
			if(Math.abs(this.mapy-y) <= this.properties.vision && Math.abs(this.mapx-x) <= this.properties.vision){
				
				mymap[x][y].visible = true; mymap[x][y].fade = 0;
				
				}
			}}
};

function costume(){
	gamePiece.call(this);
	this.visible = true;
	this.pic.sheet = "sheet1";
	//this.xind = 2;
	//this.yind = 1;
	this.gender = "m";
	};
inheritPrototype(costume,gamePiece);
costume.prototype.set_img = function(image){
	switch(image){
		case "L":switch(this.gender){
				 case "m":this.pic.setInd(3,1);break;//this.xind = 3; this.yind = 1; break;
				 case "f":this.pic.setInd(3,3);break;//this.xind = 3; this.yind = 3;break;
			 }break;
		case "R":switch(this.gender){
				case "m":this.pic.setInd(2,1);break;//this.xind = 2; this.yind = 1;break;
				case "f":this.pic.setInd(2,3);break;//this.xind = 2; this.yind = 3;break;
			}break;
	}
};

