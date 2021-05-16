var PointerReference;


function search(ele) {
    if(event.key === 'Enter') {
        AddTableRow();
    }
}

function openModal(Alphas,Pointer){
	$("#myModal").modal('show'); //Open Modal on Scren
	PointerReference = Pointer;
	
	
	//Fill Modal with Alphas
	for(var Akey in Alphas){
		forAlpha = Alphas[Akey];
		AddTableRow(forAlpha);
	}
}


function AddTableRow(text){
	var addFlag = false;
	if(text == undefined){
		text = $("#txtAlpha").val();
		$("#txtAlpha").val("");
		addFlag = true;
	}
	
	var existe = false;
	$('table tr').each(function(){
		var simb = $(this).find('#simbolo').html();
		if(simb == text) existe = true;
		else if(text == "") existe = true;
	});
	
	var id = parseInt($("#idAlpha").html());
	if(!existe){
		id += 1;
		var newRow = $("<tr>");
		newRow.attr("class","trValues");
		var newHtml;
		newHtml += '<td id="idSimbolo">'+id+'</td>';		    
		newHtml += '<td id="simbolo">'+text+'</td>';		    
		newHtml += '<td>';		    
		newHtml += '<button class="btn btn-danger" onclick="trRemove(this)" type="button">Remover</button>';
		newHtml += '</td>';	
		newRow.append(newHtml);		    
		$("#idAlpha").text(id);
		$("#tableSimbol").append(newRow);
		if(addFlag){
			PointerReference.addAlpha(text);
		}
		newHtml = "";	
	}
}

function trRemove(item){
	var tr = $(item).closest('tr');
	var idAt = parseInt(tr.find('td').html());
	var id = $("#idAlpha");
	var i = 1;
	var valRemoved = $(item.parentNode).prev().text();
	PointerReference.deleteAlpha(valRemoved);
	console.log(PointerReference,valRemoved);
    tr.fadeOut(400, function() {		      
       	tr.remove();
       	id.text(parseInt(id.html())-1);  		    
    });	
    $('table tr').each(function(){
		var idAux = $(this).find('#idSimbolo');
		if(parseInt(idAux.html()) > 0 && parseInt(idAux.html()) != idAt){
		    idAux.html(i++);
	    }
	});	  
}	

function CloseModal(){
	if(PointerReference){
		$(".trValues").remove();
		PointerReference = null;
		DrawByAutomoto();
		$("#idAlpha").text("0");		
	}

}
