function Automoto(){
	this._states = null;
	this._selectedTool = 0;
	this._selectedState = false;
	this._alphas = null;
}

Automoto.prototype.newState = function(){ 
	if(!this._states){
		var stateArray = [];
		stateArray[0] = new State(1);
		this._states = stateArray; 
		return stateArray[0];
	}
	else{
		i = this._states.length;
		var newID = this._states[i-1]._id +1;
		this._states[i] = new State(newID);
		return this._states[i];
	}
}

Automoto.prototype.deleteState = function(State){
	var KeytoRemove = false;
	for(var Skey in this._states){
		forState = this._states[Skey];
		forState.deletePointed(State._id);//Deletar todos os Apontamentos para State
		if(forState._id == State._id){
			forState.destroy();//Destruir o Estado
			KeytoRemove = Skey;
		}
	}
	if(KeytoRemove){
		if(this._states.length == 1){
			this._states = null;
		}
		else{
			this._states.splice(KeytoRemove,1);
		}
	}
}

Automoto.prototype.selectStatebyID = function(id){ 
	for(var Skey in this._states){
		forStateC = this._states[Skey];
		if(forStateC._id == id){
			return forStateC;
		}
	}
}

Automoto.prototype.returnAllAlphas = function (){
	var returnAlphas = new Array();
	for(var Skey in this._states){
		forStateC = this._states[Skey];
		for(var Pkey in forStateC._pointers){
			forPointer = forStateC._pointers[Pkey];
			for(var Akey in forPointer._alphas){
				forAlpha = forPointer._alphas[Akey];
				returnAlphas.push(forAlpha._Simbol);
			}
		}
	}
	return returnAlphas;
}

Automoto.prototype.hasInit = function (){
	var returnInit = false;
	for(var Skey in this._states){
		var forState = this._states[Skey];
		if((forState._type == 1) || (forState._type == 3)){
			returnInit = forState;
		}
	}
	return returnInit;
}

Automoto.prototype.hasEnd = function (){
	var returnInit = false;
	for(var Skey in this._states){
		var forState = this._states[Skey];
		if( (forState._type == 2) || (forState._type == 3) ){
			returnInit = true;
		}
	}
	return returnInit;
}


function State(id){
	this._id = id;
	this._pointers = null;
	this._type = 0;
	this._DrawRef = null;
	this._Color = 0x000000;
}

State.prototype.createPointer = function(pointedID){
	if(!this._pointers){
		var pointersArray = [];
		pointersArray[0] = new Pointer(1, pointedID);
		this._pointers = pointersArray;
		return this._pointers[0];
	}
	else{
		alreadyPointed = false;
		for(var Pkey in this._pointers){
			forPoint = this._pointers[Pkey];
			if(forPoint._pointedID == pointedID){
				alreadyPointed = true;
			}
		}
		if(!alreadyPointed){
			i = this._pointers.length;
			this._pointers[i] = new Pointer(i+1,pointedID);
			return this._pointers[i];
		}
	}
}

State.prototype.deletePointed = function(pointedID){
	for(var Pkey in this._pointers){
		forPointer = this._pointers[Pkey];
		if(forPointer._pointedID == pointedID){
			forPointer.destroy();
			if(this._pointers.length == 1){
				this._pointers = null;
			}
			else{
				this._pointers.splice(Pkey,1);			
			}
		}
	}
}

State.prototype.deleteAllPointers = function(pointedID){
	for(var Pkey in this._pointers){
		forPointer = this._pointers[Pkey];
		forPointer.destroy();
	}
	this._pointers = null;
}

State.prototype.destroy = function(){
	this.deleteAllPointers();
	this._DrawRef.destroy();
	this._DrawRef = null;
}



function Pointer(id,pointedID){
	this._id = id;
	this._pointedID = pointedID;
	this._alphas = null;
	this._DrawRef = null;
	this._Color = 0x000000;
	this._AlphaColor = 0x000000;
}

Pointer.prototype.destroy = function(){
	this._DrawRef.destroy();
}

Pointer.prototype.addAlpha = function(Simbol){ 
	if(!this._alphas){
		var alphaArray = [];
		alphaArray[0] = new Alpha(Simbol);
		this._alphas = alphaArray; 
		return alphaArray[0];
	}
	else{
		i = this._alphas.length;
		for(var Akey in this._alphas){
			forAlpha = this._alphas[Akey];
			if(forAlpha._Simbol == Simbol){
				return 0;
			}
		}
		this._alphas[i] = new Alpha(Simbol);
		return this._alphas[i];
	}
}

Pointer.prototype.deleteAlpha = function(Simbol){ 
	for(var Akey in this._alphas){
		forAlpha = this._alphas[Akey];
		if(forAlpha._Simbol == Simbol){
			if(this._alphas.length == 1){
				this._alphas = null;
			}
			else{
				this._alphas.splice(Akey,1);				
			}

		}
	}	
}

Pointer.prototype.alphaString = function(){ 
	var retString = " ";
	for(var Akey in this._alphas){
		forAlpha = this._alphas[Akey];
		if(Akey == 0){
			retString = forAlpha._Simbol;
		}
		else{
			retString = retString + " , " + forAlpha._Simbol;
		}
	}	
	return retString;
}


function Alpha(Simbol){
	this._Simbol = Simbol;
}



function CheckPointEachOther(StateOrg,StateDest){
	for(var Pkey in StateDest._pointers){
		forPointer2 = StateDest._pointers[Pkey];
		if(forPointer2._pointedID == StateOrg._id){
			return true;
			break;
		}
	}
	return false;
}




