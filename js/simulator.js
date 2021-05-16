var normalElements = ["NormalTool","RemoveTool","BeginTool","EndTool","SimulateInput","TestButton"];
var simulateElements = ["PlayTool","ForthTool","ExitTool"];
var PlayorStop = true;

function simulate(){
	var StringSimulate = $("#SimulateInput").val();
	if(StringSimulate.length == 0){//verify if has text on the input
		$.notify('<strong>Erro,</strong> Digite um texto', { type: 'danger' });
		return 0;
	}
	//Verify if the caracters on text exist on the alphas.
	
	var AllAlphas = MainAutomoto.returnAllAlphas();
	for(var Skey in StringSimulate){
		var keepFor = false;
		var ForString = StringSimulate[Skey];
		for(var Akey in AllAlphas){
			ForAlpha = AllAlphas[Akey];
			if(ForString == ForAlpha){
				keepFor = true;
			}
		}
		if(!keepFor){
			$.notify('<strong>Erro,</strong> Utilize apenas Caracters que estão no Automato', { type: 'danger' });
			return 0;
		}
	}
	
	if(  typeof(MainAutomoto.hasInit()) == "boolean"  ){
		$.notify('<strong>Erro,</strong> Atribua um inicio', { type: 'danger' });
		return 0;
	}
	
	if(!MainAutomoto.hasEnd()){
		$.notify('<strong>Erro,</strong> Atribua um final', { type: 'danger' });
		return 0;
	}
	
	$.notify('<strong>Aguarde o inicio da Simulação</strong>', { type: 'success' });
	startSimulation(StringSimulate);

};

function help(){
	$.notify('Dúvidas ou Sugestões envie um e-mail para <strong>gabrielfioridias@gmail.com</strong>', { type: 'success' });
}

function startSimulation(simulationString){
	hideElements(normalElements);
	showElements(simulateElements);
	simulateText(simulationString);
}

function stopSimulating(type){
	hideElements(simulateElements);
	showElements(normalElements);
	$("#PlayTool").text("⏹️");
	SelectedSimulate._Color = CircleColor;
	if(SelectedType == 1){
		SelectedSimulate._AlphaColor = CircleColor;
	}
	ContOnString = 0;
	SelectedType = 0;
	SelectedSimulate = null;
	SimulatedString = null;
	gameLoop();
	MainAutomoto._selectedTool = 0;
	clearInterval(SimulatedClock);
	PlayorStop = true;
	unMountLabel();
	
	if(type == 0){
		$.notify('<strong>Erro,</strong> a palavra terminou e não chegou ao estado final', { type: 'danger' });
		return 0;
	}	
	if(type == 1){
		$.notify('<strong>Erro,</strong> a palavra não foi aceita', { type: 'danger' });
		return 0;
	}	
	if(type == 2){
		$.notify('<strong>Sucesso,</strong> a palavra foi aceita', { type: 'success' });
		return 0;
	}
	if(type == 3){
		$.notify('<strong>Simulação cancelada.</strong>', { type: 'success' });
		return 0;
	}
};


function hideElements(elem){
	for(var eKey in elem){
		forElement = elem[eKey];
		$("#" + forElement).attr("style","display: none;");
	};
}

function showElements(elem){
	for(var eKey in elem){
		var forElement = elem[eKey];
		$("#" + forElement).attr("style","");
	};
}


function PlayButton(){
	if(PlayorStop){
		$("#PlayTool").text("▶️");
		PlayorStop = false;
		StopTimer();
	}
	else{
		$("#PlayTool").text("⏹️");
		PlayorStop = true;
		StopTimer();
		SimulatedClock = setInterval(function(){ stepFowardSimulate(); }, 1500);
	}
};

function mountLabel(string, LetterNumber){
	if(string.length == 1){
		$("#LT2").text(string);
	}
	else{
		if(LetterNumber==0){
			$("#LT2").text(string.substring(0,LetterNumber+1));
			$("#LT3").text(string.substring(LetterNumber+1,string.length));	
		}
		else{
			$("#LT1").text(string.substring(0,LetterNumber));
			$("#LT2").text(string.substring(LetterNumber,LetterNumber+1));
			$("#LT3").text(string.substring(LetterNumber+1,string.length));	
		}

	}
	
}

function unMountLabel(){
	$("#LT1").text("");
	$("#LT2").text("");
	$("#LT3").text("");
}




