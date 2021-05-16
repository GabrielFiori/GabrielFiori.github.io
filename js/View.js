var renderer;
var stage;
var GameState = DrawByAutomoto;
var drag = false;  
var pointerDrag = false;  
var MainAutomoto;

//Globals for Simulating
var SelectedSimulate = null;
var SelectedType = null;
var ContOnString = 0;
var SimulatedString = null;
var SimulatedClock = null;


//Aliases
var Container = PIXI.Container,
autoDetect = PIXI.autoDetectRenderer,
loader = PIXI.loader,
resources = PIXI.loader.resources,
Sprite = PIXI.Sprite,
Graphics = PIXI.Graphics;


//Configs
var CanvasWidth = $(window).width();
var CanvasHeight = $(window).height();
var MainSize = CanvasWidth/204.8;
var BackGroundColor = 0xFFFFFF; //Background of the stage
var CircleColor = 0x000000; 
var ClicledCircleColor = 0xFF0000; //Color of a Selected Stage
var LineColor = 0x000000; //Color of pointers
var CircleRadius = MainSize*8; //Radius of Circles
var ArrowSize = MainSize*3; //Size of the point of the Arrow
var FontStyle = new PIXI.TextStyle({fontSize: MainSize*4.8}); // Style for Alphas
var AngleADDBezier = 20; //Angle of Curved Arrows start on Circle
var pointArrowColor = 0x000000; //color of the point of the arrow
var pointArrowAgnel = 35; //Angle of the point of arrow
var fillPointArrowColor = 0x000000; //fill color of point arrow
var LineWidth = 0.4*MainSize;
var FontLettersSize = 6*MainSize;





function StartRender(){
	MainAutomoto = new Automoto();	
	
	stage = new Container;
	stage.hitArea = new PIXI.Rectangle(0,0,CanvasWidth,CanvasHeight);
	stage.interactive = true;
	stage.pointerup = function(e){
		if(!pointerDrag && !drag && (MainAutomoto._selectedTool == 0)){
			nState = MainAutomoto.newState();
			renderCircle(nState,e.data.global.x,e.data.global.y);
		}
		else{
			drag = false;
		}

	}
	
	var options = {
		view:myCanvas
	};
	
	myCanvas = document.getElementById('myCanvas');
    renderer = autoDetect(CanvasWidth,CanvasHeight,options);
	renderer.backgroundColor = BackGroundColor;
	renderer.autoResize = true;
	document.body.appendChild(renderer.view);
	
	

	
	
	gameLoop();
}

function clickedCircle(target){
	ClickedState = 	MainAutomoto.selectStatebyID(target.__id);				
	if(MainAutomoto._selectedTool == 0){
		MainAutomoto._selectedState = ClickedState._id;
		MainAutomoto._selectedTool = 1;
		ClickedState._Color = ClicledCircleColor;
		renderCircle(ClickedState,target.x,target.y);
		target.destroy();
	}
	else if(MainAutomoto._selectedTool == 1){//Point a State
		SelectedState = MainAutomoto.selectStatebyID(MainAutomoto._selectedState);
		var createdPointer = SelectedState.createPointer(target.__id);
		MainAutomoto._selectedState = false;
		MainAutomoto._selectedTool = 0;
		targetToDestroy = SelectedState._DrawRef;
		TgX = SelectedState._DrawRef.x;
		TgY = SelectedState._DrawRef.y;
		SelectedState._Color = CircleColor;
		renderCircle(SelectedState,TgX,TgY);
		targetToDestroy.destroy();
		openModal("",createdPointer);//Open Modal to add Alphas
	}
	else if(MainAutomoto._selectedTool == 2){//Remove selected
		MainAutomoto.deleteState(ClickedState);
		MainAutomoto._selectedTool = 0;
		RenewStages();
	}
	else if(MainAutomoto._selectedTool == 3){//Select Begin
		for(var Skey in MainAutomoto._states){
			forState = MainAutomoto._states[Skey];	
			if(forState._type == 1){
				forState._type = 0;
			}
			else if(forState._type == 3){
				forState._type = 2;
			}
		}		
		if(ClickedState._type == 2){
			ClickedState._type = 3;
		}
		else{
			ClickedState._type = 1;
		}
		MainAutomoto._selectedTool = 0;
		RenewStages();
	}
	else if(MainAutomoto._selectedTool == 4){//Select Ending
		for(var Skey in MainAutomoto._states){
			forState = MainAutomoto._states[Skey];	
			if(forState._type == 2){
				forState._type = 0;
			}
			else if(forState._type == 3){
				forState._type = 1;
			}
		}	
		if(ClickedState._type == 1){
			ClickedState._type = 3;
		}
		else{
			ClickedState._type = 2;
		}
		MainAutomoto._selectedTool = 0;
		RenewStages();
	}
	DrawByAutomoto();
}

function createClickedPointer(target){  
  target.pointerup = function(e){
	if(!drag && (MainAutomoto._selectedTool==0)){
		pointerDrag = true;
		var modalAlpha = [];
		selectedPointer = target.__pointerRef;
		for(var Akey in selectedPointer._alphas){
			forAlpha = selectedPointer._alphas[Akey];
			modalAlpha[Akey] = forAlpha._Simbol;
		}
		openModal(modalAlpha,selectedPointer);
		setTimeout(function(){ pointerDrag = false; }, 10);
	}
  }
}



function createDragAndDropFor(target){  
  target.interactive = true;
  
  target.pointerdown = function(e){
    if(MainAutomoto._selectedTool == 1){
		clickedCircle(this);
		drag = true;
	}
	else{
		drag = target;
		drag.__moved = false;		
	}

  }
  
  target.pointerup = function(e){
	if(drag == this){
		if(!drag.__moved){
			clickedCircle(this);
			drag.__moved = false;
		}
		setTimeout(function(){ drag = false; }, 10);
	}
  }

  target.pointerupoutside = function(e){
    if(drag == this){
		setTimeout(function(){ drag = false; }, 10);
		drag.__moved = false;
	}
  }
  
  target.pointermove = function(e){
	if((drag == this) && (MainAutomoto._selectedTool == 0) ){
		drag.__moved = true;
		drag.position.x += e.data.originalEvent.movementX;
		drag.position.y += e.data.originalEvent.movementY;
		DrawByAutomoto();
	}
  }
}

function gameLoop(){
	requestAnimationFrame(gameLoop);
	//GameState(); Loop Infinito do game (Fazer)
	renderer.render(stage);
	if(MainAutomoto._selectedTool == 5){
		DrawByAutomoto();
	}
}



function DrawByAutomoto(){
	for(var Skey in MainAutomoto._states){
		forState = MainAutomoto._states[Skey];	
		if(MainAutomoto._selectedTool == 5){
			var tempX = forState._DrawRef.x;
			var tempY = forState._DrawRef.y;
			forState._DrawRef.destroy();		
			renderCircle(forState,tempX,tempY);		
		}		
		for(var Pkey in forState._pointers){
			forPointer = forState._pointers[Pkey];
			if(forPointer._DrawRef){
				forPointer._DrawRef.destroy();
			}	
			PointedState = MainAutomoto.selectStatebyID(forPointer._pointedID); 
			if(forState._id != PointedState._id){
				if(CheckPointEachOther(forState,PointedState)){
					forPointer._DrawRef = DrawCurvedArrow(forState, forPointer);
				}
				else{
					forPointer._DrawRef = DrawNormalArrow(forState, forPointer);
				}				
			}
			else{
				forPointer._DrawRef = drawArrowHimSelf(forState, forPointer);
			}			
		}
	}
}

function RenewStages(){
	for(var Skey in MainAutomoto._states){
		forState = MainAutomoto._states[Skey];
		forStateX = forState._DrawRef.x;
		forStateY = forState._DrawRef.y;
		forState._DrawRef.destroy();
		renderCircle(forState,forStateX,forStateY);
	}
}




function renderCircle(State,x,y,color = CircleColor){
	var circle = new Graphics();
	circle.__id = State._id;
	State._DrawRef = circle;
	circle.lineStyle( LineWidth , State._Color ,  1)
	circle.drawCircle(0, 0, CircleRadius);
	circle.x = x;
	circle.y = y;
	
	if( (State._type == 1) || (State._type == 3) ){// When its a Init State
		circle.beginFill(0x000000);		
		x = -(CircleRadius*1.125);
		y = -(CircleRadius/2);
		circle.moveTo(x,y);
		y = y + CircleRadius;
		circle.lineTo(x,y);
		x += CircleRadius*0.5;
		y -= CircleRadius*0.5;
		circle.lineTo(x,y);
		x -= CircleRadius*0.5;
		y -= CircleRadius*0.5;
		circle.lineTo(x,y);
		circle.endFill();
	}
	if( (State._type == 2) || (State._type == 3) ){// When is a Ending State
		circle.drawCircle(0, 0, CircleRadius*0.75);
	}
	
	renderTextInsideCirlce(State._id,circle);
	

	
	circle.interactive = true;
	circle.buttonMode = true;
	circle.hitArea = new PIXI.Circle(0, 0, CircleRadius);
	createDragAndDropFor(circle);	
	
	
	
	stage.addChild(circle);	
	
	
	
	
	
}

function renderTextInsideCirlce(stateID,Cicle){
	CircleText = "S" + stateID;
	var basicText = new PIXI.Text(CircleText,FontStyle);
	basicText.anchor.set(0.5, 0.5);
	Cicle.addChild(basicText);	
}

function renderText(x,y,PointerST,anchor){
	text = PointerST.alphaString();
	var FontDraw = new PIXI.TextStyle({fontSize: FontStyle.fontSize, fill:PointerST._AlphaColor});
	var basicText = new PIXI.Text(text,FontDraw);
	basicText.anchor.set(0.5, 0.5);
	basicText.x = x;
	basicText.y = y;
	basicText.interactive = true;
	basicText.buttonMode = true;
	basicText.hitArea = new PIXI.Rectangle(-basicText.width/2,-basicText.height/2, basicText.width, basicText.height);
	createClickedPointer(basicText);
	anchor.addChild(basicText);	
	return basicText;
}



function DrawNormalArrow(State, SelectedPointer){
	PointedStateArrow = MainAutomoto.selectStatebyID(SelectedPointer._pointedID); 
	
	Ox = State._DrawRef.x;
	Oy = State._DrawRef.y;
	Dx = PointedStateArrow._DrawRef.x;
	Dy = PointedStateArrow._DrawRef.y;
	
	angle = twoPointsAngle(Ox,Oy,Dx,Dy);
	xdiference = CircleRadius * sinDegrees(90-angle);
	ydiference = CircleRadius * sinDegrees(angle);
	orgx = Ox + xdiference;
	orgy = Oy + ydiference;
	destx = Dx - xdiference;
	desty = Dy - ydiference;	
	return canvas_arrow(orgx,orgy,destx,desty,SelectedPointer);
}



function canvas_arrow(fromx, fromy, tox, toy, SelectedPointer){
	tex = SelectedPointer.alphaString();
	var line = new Graphics();
	line.lineStyle(LineWidth, SelectedPointer._Color, 1);
	var angle = Math.atan2(toy-fromy,tox-fromx);
	var headlen = ArrowSize;
	line.moveTo(fromx, fromy);
    line.lineTo(tox, toy);	
	
	var textHeight = new PIXI.TextMetrics.measureText(tex,FontStyle).height;
	angle = angle*180/Math.PI;	
	
	//Call point Arrow
	drawArrowPoint(tox,toy,angle,line,SelectedPointer);

	
	TextX = (fromx+tox)/2;
	TextY = (fromy+toy)/2;
	TextY -= Math.abs(textHeight/2*cosDegrees(angle));
	
	SelectedPointer._DrawRef = renderText(TextX,TextY,SelectedPointer,line);
	SelectedPointer._DrawRef.__pointerRef = SelectedPointer;
	
	stage.addChild(line);
	return line;
}

function drawArrowHimSelf(State,SelectedPointer){
	circle = State._DrawRef;
	headlen = ArrowSize;
	
	var arc = new Graphics();
	arc.lineStyle(LineWidth, SelectedPointer._Color, 1);
	angle = 45;
	CosAngle = cosDegrees(angle);
	SinAngle = sinDegrees(angle);
	ArcEndPoint = 2 + ((5 / (90 / (90 - angle))) / 10);
	ArcStartPoint = 3 - ArcEndPoint;
	y = circle.y - (CosAngle * CircleRadius)*2;
	arc.arc(circle.x,y,CircleRadius,ArcStartPoint*Math.PI,ArcEndPoint*Math.PI);

	//draw point of arrow
	ArrowPointX = circle.x - CosAngle * CircleRadius;
	ArrowPointY = circle.y - SinAngle * CircleRadius;	
	drawArrowPoint(ArrowPointX,ArrowPointY,angle,arc,SelectedPointer);
	
	stage.addChild(arc);
	
	
	var AlphaText = SelectedPointer.alphaString();
	var textHeight = new PIXI.TextMetrics.measureText(AlphaText,FontStyle).height;
	
	TextX = circle.x;
	TextY = y - CircleRadius;
	TextY -= textHeight/2;
	
	SelectedPointer._DrawRef = renderText(TextX,TextY,SelectedPointer,arc);
	SelectedPointer._DrawRef.__pointerRef = SelectedPointer;
	
	return arc;
}


function DrawCurvedArrow(stateOrg, SelectedPointer){;
	var tempG;
	stateDest = MainAutomoto.selectStatebyID(SelectedPointer._pointedID); 
	
	OriginX = stateOrg._DrawRef.x;
	OriginY = stateOrg._DrawRef.y;
	DestX = stateDest._DrawRef.x;
	DestY = stateDest._DrawRef.y;
	angle = twoPointsAngle(OriginX,OriginY,DestX,DestY);	
	angle2 = twoPointsAngle(DestX,DestY,OriginX,OriginY);
	
	//Set the angle Add for the bezier start
	angle -= AngleADDBezier;
	angle2 += AngleADDBezier;
	
	
	//Origin 
	OriginX = OriginX + CircleRadius * sinDegrees(90 - angle);
	OriginY = OriginY + CircleRadius * sinDegrees(angle);
	//arconpoint(OriginX,OriginY,"0xFF0000");
	
	//Destination 
	DestX = DestX + CircleRadius * sinDegrees(90 - angle2);
	DestY = DestY + CircleRadius * sinDegrees(angle2);
	//arconpoint(DestX,DestY,"0xFF0000");	
	
	//OriginUP
	AngleOriginUP = twoPointsAngle(OriginX,OriginY,DestX,DestY);
	AngleOriginUP += 90;
	OriginXUP = OriginX - CircleRadius * cosDegrees(AngleOriginUP);
	OriginYUP = OriginY - CircleRadius * sinDegrees(AngleOriginUP);	
	//arconpoint(OriginXUP,OriginYUP,"0xFF0000");		
	
	//Destination UP
	AngleDestUP = twoPointsAngle(DestX,DestY,OriginX,OriginY);
	AngleDestUP += 90;
	DestXUP = DestX + CircleRadius * cosDegrees(AngleDestUP);
	DestYUP = DestY + CircleRadius * sinDegrees(AngleDestUP);	
	//arconpoint(DestXUP,DestYUP,"0xFF0000");		

	//Draw the BezierCurve
	var bezierRef = canvas_curve(OriginX,OriginY,OriginXUP,OriginYUP,DestXUP,DestYUP,DestX,DestY,SelectedPointer);
	
	//Finding the right angle for Pointer
	var pointAX = pointOnBezierCurve(0.88,OriginX,OriginXUP,DestXUP,DestX);
	var pointAY = pointOnBezierCurve(0.88,OriginY,OriginYUP,DestYUP,DestY);
	var pointAX2 = pointOnBezierCurve(0.95,OriginX,OriginXUP,DestXUP,DestX);
	var pointAY2 = pointOnBezierCurve(0.95,OriginY,OriginYUP,DestYUP,DestY);	
	AngleArrowPoint = twoPointsAngle(pointAX,pointAY,pointAX2,pointAY2);

	//Draw de Arrow Pointer
	drawArrowPoint(DestX,DestY,AngleArrowPoint,bezierRef,SelectedPointer);
	
	
	
	//Finding the middle of Bezier
	var middleX = pointOnBezierCurve(0.5,OriginX,OriginXUP,DestXUP,DestX);
	var middleY = pointOnBezierCurve(0.5,OriginY,OriginYUP,DestYUP,DestY);
	var middleX2 = pointOnBezierCurve(0.50005,OriginX,OriginXUP,DestXUP,DestX);
	var middleY2 = pointOnBezierCurve(0.50005,OriginY,OriginYUP,DestYUP,DestY);	
	AngleText = twoPointsAngle(middleX,middleY,middleX2,middleY2);
	
	//all the Alphas in a String
	var AlphaText = SelectedPointer.alphaString();
	var textHeight = new PIXI.TextMetrics.measureText(AlphaText,FontStyle).height;
	
	middleY -= Math.abs(textHeight/2*cosDegrees(AngleText));
	SelectedPointer._DrawRef = renderText(middleX,middleY,SelectedPointer,bezierRef);
	SelectedPointer._DrawRef.__pointerRef = SelectedPointer;
	

	return bezierRef;
}



function canvas_curve(org1,org2,orgup1,orgup2,destup1,destup2,dest1,dest2,SelectedPointer){
	headlen = ArrowSize;
	var bezier = new Graphics();
	bezier.lineStyle(LineWidth, SelectedPointer._Color , 1);
	bezier.moveTo(org1,org2);
	bezier.bezierCurveTo(orgup1,orgup2,destup1,destup2,dest1,dest2);
	
	//call point Arrow

	stage.addChild(bezier);
	
	return bezier;	
}

function selectTool(num){
	MainAutomoto._selectedTool = num;
}

function drawArrowPoint(x,y,angle,anchor,SelectedPointer){
	angle2 = angle - pointArrowAgnel;
	angle += pointArrowAgnel;

	point2X = x - ArrowSize * cosDegrees(angle);
	point2Y = y - ArrowSize * sinDegrees(angle);
	point3X = x - ArrowSize * cosDegrees(angle2);
	point3Y = y - ArrowSize * sinDegrees(angle2);

	
	var pointArrow = new Graphics();
	pointArrow.beginFill(fillPointArrowColor);		
	pointArrow.lineStyle(LineWidth, SelectedPointer._Color, 1);
	pointArrow.moveTo(x, y);
    pointArrow.lineTo(point2X, point2Y);
	pointArrow.lineTo(point3X, point3Y);
	pointArrow.lineTo(x, y);
	pointArrow.endFill();
    anchor.addChild(pointArrow);
}

function arconpoint(x,y,Color){
	var circle = new Graphics();
	circle.lineStyle( LineWidth , Color,  1);
	circle.drawCircle(x, y, 10);
	stage.addChild(circle);
}


//<< Math Functions

function pointOnBezierCurve(t,p1,p2,p3,p4){
	calc = 	(1 - t);
	part1 = calc * calc * calc * p1;
	part2 = 3 * t * calc * calc * p2;
	part3 = 3 * t * t * calc * p3;
	part4 = t * t * t * p4;
	return part1 + part2 + part3 + part4;
}


function twoPointsAngle(x1,y1,x2,y2){
	return Math.atan2(y2 - y1, x2 - x1) *180/Math.PI;
}

function sinDegrees(angle) {
	return Math.sin(angle/180*Math.PI);
}

function cosDegrees(angle) {
	return Math.cos(angle/180*Math.PI);
}


//<<< HTML Functions




function addNewAlpha() {
	var td = $("<td>");
	var input = $("<input>").attr('size','1').appendTo(td);
	input.attr('type','text');
	var Bdelete = $("<button>").attr('onclick','deleteAlpha(this)').appendTo(td);;
	Bdelete.text("x");
	var lastTD = $("#lastTD");
	lastTD.after( td );
	lastTD.removeAttr("id");
	td.attr('id','lastTD');	
}

function deleteAlpha(element){
	element = element.parentNode;
	if(element.getAttribute("id") == "lastTD"){
		element.previousSibling.setAttribute("id","lastTD");
	}
	element.remove();
}


Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

//HTML Functions >>>>>


//Simulating

function StopTimer(){
	clearInterval(SimulatedClock);
	clearTimeout(SimulatedClock);
};

function simulateText(Tstring){
	MainAutomoto._selectedTool = 5;
	SimulatedString = Tstring;
	SelectedSimulate = MainAutomoto.hasInit();
	SelectedSimulate._Color = ClicledCircleColor;
	SelectedType = 0;
	ContOnString = 0;
	SimulatedClock = setTimeout(  function(){ StopTimer(); SimulatedClock = setInterval( function(){ stepFowardSimulate(); }, 1500); }, 1300 );
}

function stepFowardSimulate(){
	if(SimulatedString.length < ContOnString+1){
		if( (SelectedSimulate._type == 2) || (SelectedSimulate._type == 3) ){
			stopSimulating(2);
			return 0;
		}
		if(SelectedType == 0){
			stopSimulating(0);	
			return 0;			
		}
		
	}
	
	
	if(SelectedType == 0){
		SelectedSimulate._Color = CircleColor;
		for(var Pkey in SelectedSimulate._pointers){
			forPointer = SelectedSimulate._pointers[Pkey];
			for(var Akey in forPointer._alphas){
				forAlpha = forPointer._alphas[Akey];
				if(SimulatedString[ContOnString] == forAlpha._Simbol){
					SelectedSimulate = forPointer;
					SelectedSimulate._Color = ClicledCircleColor;
					SelectedSimulate._AlphaColor = ClicledCircleColor;
					mountLabel(SimulatedString,ContOnString);
					ContOnString++;
					SelectedType = 1;
					return 0;
				}				
			}
		}
		stopSimulating(1);
	}
	
	if( (SelectedType == 1) || (SelectedType == 3) ){	
		SelectedSimulate._Color = CircleColor;
		SelectedSimulate._AlphaColor = CircleColor;
		SelectedSimulate = MainAutomoto.selectStatebyID(SelectedSimulate._pointedID);
		SelectedSimulate._Color = ClicledCircleColor;
		SelectedType = 0;
		return 0;
	}
	
}


function zoom(Size){
	MainSize = Size;
	CircleRadius = MainSize*8; 
	ArrowSize = MainSize*3;
	FontStyle = new PIXI.TextStyle({fontSize: MainSize*4.8});
	LineWidth = 0.4*MainSize;
	FontLettersSize = 6*MainSize;
	var tempSelected = MainAutomoto._selectedTool;
	MainAutomoto._selectedTool = 5;
	DrawByAutomoto();
	MainAutomoto._selectedTool = tempSelected;
	$(".LetterLabel").css("font-size", FontLettersSize + "px");
}








