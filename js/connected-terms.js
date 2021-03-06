SEARCH_TYPE = "connected";

var input;
$(document).ready(function(){	
	makePageSections();
	
	makeAutocomplete($("#inputSection"), "inputbar", "GAK protein, human");
	input = document.getElementById("inputbar");
	
	addExampleLink();
});

var _withSubterms = false;
//var _subterms declared in chemotext.js

/* Executes the search */
function simpleSearch(){
	if (input.value == "") return;

	$(displayText).text("");
	$("#results").hide();
	$("#show-subterms").hide();
	showLoader();

	var term = termBank.getSynonym(input.value);

	_withSubterms = subtermsCheckbox.checked;
	if(_withSubterms){
		queryNeo4j(getMentionsWithSubtermsPayload(term), simpleSearchOnSuccess);	// search term and subterm co-occurrences
	}else{
		queryNeo4j(getMentionsPayload(term), simpleSearchOnSuccess);	// fetch search term co-occurrences
	}
}

/* Callback for receiving the search results */
function simpleSearchOnSuccess(data){
	var results = readResults(data, _withSubterms);
	showResult(results, input.value, _withSubterms);
}

/* Show results table */
function makeConnectedTermsTable(stack, index, indexLimit){
	var $tbody = $(tableform).find("tbody");

	/*append TR: 
		<tr>
			<td>name</td>
			<td>
				<button type="button" class="articleButton">count</button>
			</td>
		</tr>
	*/
	for(var i=index;i<indexLimit;i++){
		var term = stack[i];
		$tr = $("<tr/>");
		$tr.append('<td>'+term.name+'</td>');
		$buttonTd = $("<td/>").append( $("<button/>", {
			type: "button", 
			"class": "articleButton", 
			text: term.articles.length, 
			click: function(term){ return function(){openArticleList(term);} }(term)
		}));
		$tbody.append($tr.append($buttonTd));		
	}	
	return;
}


