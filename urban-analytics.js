var STANDARD_EVENTS = ["abort","afterprint","animationend","animationiteration","animationstart","audioprocess","beforeprint","beforeunload","beginEvent","blocked","blur","cached","canplay","canplaythrough","change","chargingchange","chargingtimechange","checking","click","close","complete","complete","compositionend","compositionstart","compositionupdate","contextmenu","copy","cut","dblclick","devicelight","devicemotion","deviceorientation","deviceproximity","dischargingtimechange","DOMContentLoaded","downloading","drag","dragend","dragenter","dragleave","dragover","dragstart","drop","durationchange","emptied","ended","ended","endEvent","error","focus","fullscreenchange","fullscreenerror","gamepadconnected","gamepaddisconnected","hashchange","input","invalid","keydown","keypress","keyup","languagechange","levelchange","load","load","loadeddata","loadedmetadata","loadend","loadstart","message","message","message","message","mousedown","mouseenter","mouseleave","mousemove","mouseout","mouseover","mouseup","noupdate","obsolete","offline","online","open","open","orientationchange","pagehide","pageshow","paste","pause","pointerlockchange","pointerlockerror","play","playing","popstate","progress","progress","ratechange","readystatechange","repeatEvent","reset","resize","scroll","seeked","seeking","select","show","stalled","storage","submit","success","suspend","SVGAbort","SVGError","SVGLoad","SVGResize","SVGScroll","SVGUnload","SVGZoom","timeout","timeupdate","touchcancel","touchend","touchenter","touchleave","touchmove","touchstart","transitionend","unload","updateready","upgradeneeded","userproximity","versionchange","visibilitychange","volumechange","waiting","wheel"]

function trackEvents(inpArray){
	inpArray.map(sendElements);
}

function sendElements(inp){
	var elements = inp.elements;
	if (typeof elements !== 'object' || elements === null){
		throw "Call to trackEvents() must include value for 'elements'. Use jQuery to select elements.";
	}
	else{
		if (elements.constructor === Array){
			elements.map(function(element){
				sendEvent(element,inp);
			})
		}
		else {
			sendEvent(elements,inp);
		}
	}
}

function sendEvent(element,inp){
	var category = inp.category;
	var action = inp.action;
	var label = inp.label;
	var value = inp.value;

	if (typeof category === 'undefined' || typeof action === 'undefined'){
		throw "Call to trackEvents() must include value for 'category' and 'action'.";
	}
	else if (STANDARD_EVENTS.indexOf(action) == -1){
		throw action + " is not a valid name for an event.";
	}
	else{
		if(inp.action == "scroll"){
			sendScrollEvent(element,inp);
		}
		else{
			element.on(inp.action, function(){
				if(typeof label !== 'undefined'){
					if (typeof  value !== 'undefined'){
						console.log("category: ",category,"action: ",action,"label: ",label,"value: ",value);
					}
					else{
						console.log("category: ",category,"action: ",action,"label: ",label);
					}
				}
				else{
					if (typeof value !== 'undefined'){
						console.log("category: ",category,"action: ",action,"value: ",value);
					}
					else{
						console.log("category: ",category,"action: ",action);

					}
				}
			});
		}
	}
}

function sendScrollEvent(element,inp){
}