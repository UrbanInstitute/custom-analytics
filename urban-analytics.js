// [{
// 	"elements":$,
// 	"category":
// 	"action":
// 	"label":
// 	"value"
// },

function trackEvents(inpArray){
	inpArray.map(sendElements)
}

function sendElements(inp){
	var elements = inp.elements
	if (elements.constructor === Array){
		elements.map(function(element){
			sendEvent(element,inp)
		})
	}
	else {
		sendEvent(elements,inp)
	}
}

function sendEvent(element,inp){
	if(inp.action == "scroll"){
		sendScrollEvent(element,inp)
	}
	else{

	}
}

function sendScrollEvent(){
}