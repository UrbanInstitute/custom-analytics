/*!
* @preserve
* jquery.scrolldepth.js | v0.7.1
* Copyright (c) 2014 Rob Flaherty (@robflaherty)
* Licensed under the MIT and GPL licenses.
*
* Modified and repurposed by Ben Chartoff (@bchartoff) 1/2014
*/

(function($){
    // **********************************
    // ***** Start: Private Members *****
    var pluginName = 'custom_analytics';
    var startTime = +new Date;
    
    // List obtained from https://developer.mozilla.org/en-US/docs/Web/Events
    // Both `unimplemented` and `deprecated` events have been removed from this list
    // List up-to-date as of 1/26/2015
    var STANDARD_EVENTS = ["abort","afterprint","animationend","animationiteration","animationstart","audioprocess","beforeprint","beforeunload","beginEvent","blocked","blur","cached","canplay","canplaythrough","change","chargingchange","chargingtimechange","checking","click","close","complete","complete","compositionend","compositionstart","compositionupdate","contextmenu","copy","cut","dblclick","devicelight","devicemotion","deviceorientation","deviceproximity","dischargingtimechange","DOMContentLoaded","downloading","drag","dragend","dragenter","dragleave","dragover","dragstart","drop","durationchange","emptied","ended","ended","endEvent","error","focus","fullscreenchange","fullscreenerror","gamepadconnected","gamepaddisconnected","hashchange","input","invalid","keydown","keypress","keyup","languagechange","levelchange","load","load","loadeddata","loadedmetadata","loadend","loadstart","message","message","message","message","mousedown","mouseenter","mouseleave","mousemove","mouseout","mouseover","mouseup","noupdate","obsolete","offline","online","open","open","orientationchange","pagehide","pageshow","paste","pause","pointerlockchange","pointerlockerror","play","playing","popstate","progress","progress","ratechange","readystatechange","repeatEvent","reset","resize","scroll","seeked","seeking","select","show","stalled","storage","submit","success","suspend","SVGAbort","SVGError","SVGLoad","SVGResize","SVGScroll","SVGUnload","SVGZoom","timeout","timeupdate","touchcancel","touchend","touchenter","touchleave","touchmove","touchstart","transitionend","unload","updateready","upgradeneeded","userproximity","versionchange","visibilitychange","volumechange","waiting","wheel"]
   
    var cache = [],
        lastPixelDepth = 0,
        scrollDefaults = {
            elements: [],
            minHeight: 0,
            breakpoints: false,
            timing: false,
            pixelDepth: false,
            interaction: false
        };

    var calculateMarks = function(docHeight) {
        return {
          '25%' : parseInt(docHeight * 0.25, 10),
          '50%' : parseInt(docHeight * 0.50, 10),
          '75%' : parseInt(docHeight * 0.75, 10),
          // 1px cushion to trigger 100% event in iOS
          '100%': docHeight - 5
        };
    };

    var checkMarks = function(marks, scrollDistance, time, config) {
    // Check each active mark
    $.each(marks, function(key, val) {
          if ( $.inArray(key, cache) === -1 && scrollDistance >= val ) {
            // sendScrollEvent("event","scroll breakpoint","scroll",key,interaction,pixelDepth);
            sendScrollEvent("scroll breakpoint","scroll", key, scrollDistance, time, config);
            cache.push(key);
          }
        });
    };

    var checkElements = function(elements, scrollDistance, label, value, time, config) {
        $.each(elements, function(index, elem) {
          if ( $.inArray(elem, cache) === -1 && $(elem).length ) {
            var lab, val;
            if(label === "object_HTML"){
                lab = elem;
            }
            else if(label === "object_ID"){
                val = elem.id;
            }

            if (typeof value !== "undefined"){
                val = value;
            }
            else{
                val = scrollDistance;
            }

            if ( scrollDistance >= $(elem).offset().top ) {
              // sendScrollEvent(options,"scroll past element","scroll", elem, scrollDistance, timing);
              sendScrollEvent("scroll past element","scroll",lab,val,time,config)
              cache.push(elem);
            }
          }
        });
    };

    var rounded = function (scrollDistance) {
        // Returns String
        return (Math.floor(scrollDistance/250) * 250).toString();
    };

    // var sendScrollEvent = function(options, category, action, label, scrollDistance, timing) {
    var sendScrollEvent = function(category,action,label,value,time,config){
        var interaction = config.interaction;
        var pixelDepth = config.pixelDepth;
        var timing = config.timing;

        console.log("Fooo")

        // console.log('send', 'event', 'Scroll Depth', action, label, 1, {'nonInteraction': options.nonInteraction});
        sendEvent("event",category,action,label,value,interaction);

        if (pixelDepth && arguments.length > 2 && scrollDistance > lastPixelDepth) {
          lastPixelDepth = scrollDistance;
          sendEvent("event",category+ " pixel depth",action,label,rounded(scrollDistance),interaction)
        }

        if (timing && arguments.length > 3) {
          sendEvent("timing",category+" timing",action,label,time,interaction)
        }

    };

    var sendEvent = function(type,category,action,label,value,config){
        var interaction = config.interaction
        if(typeof interaction === "undefined"){
        //default behavior is all events are non-interaction events 
            interaction = false;
        }
        else if(interaction === true){
        }
        else{
            throw "Set 'interaction' to true, or leave blank for default of false"
        }

        if(typeof label !== 'undefined' && label !== null){
            if (typeof  value !== 'undefined' && value !== null){
                console.log("send | ",type,"|",category,"|",action,"|",label,"|",value,'|',interaction);
            }
            else{
                console.log("send | ",type,"|",category,"|",action,"|",label,'|',interaction);
            }
        }
        else{
            if (typeof value !== 'undefined' && value !== null){
                console.log("send | ",type,"|",category,"|",action,"|",value,'|',interaction);
            }
            else{
                console.log("send | ",type,"|",category,"|",action,'|',interaction);
            }
        }
    }



    /*
    * Throttle function borrowed from:
    * Underscore.js 1.5.2
    * http://underscorejs.org
    * (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
    * Underscore may be freely distributed under the MIT license.
    */

    var throttle = function(func, wait) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        var later = function() {
          previous = new Date;
          timeout = null;
          result = func.apply(context, args);
        };
        return function() {
          var now = new Date;
          if (!previous) previous = now;
          var remaining = wait - (now - previous);
          context = $(window);
          args = arguments;
          if (remaining <= 0) {
            clearTimeout(timeout);
            timeout = null;
            previous = now;
            result = func.apply(context, args);
          } else if (!timeout) {
            timeout = setTimeout(later, remaining);
          }
          return result;
        };
    }
    // ***** Fin: Private Members *****
    // ********************************

    // *********************************
    // ***** Start: Public Methods *****
    var methods = {
        init : function(options) {
            // startTime = +new Date;
            //"this" is a jquery object on which this plugin has been invoked.
            return this.each(function(index){
                var $this = $(this);
                var data = $this.data(pluginName);
                // If the plugin hasn't been initialized yet
                if (!data){
                    var settings = {
                    };
                    if(options) { $.extend(true, settings, options); }

                    $this.data(pluginName, {
                        target : $this,
                        settings: settings
                    });
                }
            });
        },
        track : function(options){
            var category = options.category;
            var action = options.action;
            var label = options.label;
            var value = options.value;
            var interaction = options.interaction;
            var timing = options.timing;

            if(typeof timing === "undefined"){
            //default behavior is all events do not track timing
                timing = false;
            }
            else if(timing === true){
            }
            else{
                throw "Set 'timing' to true, or leave blank for default of false"
            }

            var config = {interaction: interaction, timing: timing}

            if (typeof category === 'undefined' || typeof action === 'undefined'){
               throw "Call to track() must include value for 'category' and 'action'.";
            }
            else if (STANDARD_EVENTS.indexOf(action) == -1){
                throw action + " is not a valid name for an event.";
            }


            this.on(action, function(event){
                if(label == "object_HTML"){
                    label = event.target.outerHTML;
                }
                else if(label == "object_ID"){
                    label = event.target.id;
                }
                sendEvent("event",category,action,label,value,config);
                if(timing){
                    t = +new Date - startTime;
                    sendEvent("timing",category,action,label,t,config);
                }
            });
        },
        scrollTrack: function(options){            
            if(! $.isWindow(this[0])){
                var extended = $.extend({}, scrollDefaults, {elements: this});
            }
            else{
                var extended = $.extend({}, scrollDefaults, {breakpoints: true});
            }

            options = $.extend({}, extended, options);

            var breakpoints = options.breakpoints;
            var pixelDepth = options.pixelDepth;
            var label = options.label;
            var value = options.value;
            var interaction = options.interaction;
            var timing = options.timing;

            var config = {interaction: interaction, pixelDepth: pixelDepth, timing: timing}

            var $window = $(window);

            $window.on('scroll', throttle(function() {
            /*
             * We calculate document and window height on each scroll event to
             * account for dynamic DOM changes.
             */
                var docHeight = $(document).height(),
                  winHeight = window.innerHeight ? window.innerHeight : $window.height(),
                  scrollDistance = $window.scrollTop() + winHeight,

                  // Recalculate breakpoints marks
                  marks = calculateMarks(docHeight),

                  // Timing
                  t = +new Date - startTime;

                // If all marks already hit, unbind scroll event
                if (cache.length >= 4 + options.elements.length) {
                  $window.off('scroll');
                  return;
                }

                // Check specified DOM elements
                if (options.elements) {
                  checkElements(options.elements, scrollDistance, label, value, t, config);
                }

                // Check standard marks
                if (breakpoints) {
                  checkMarks(marks, scrollDistance, t, config);
                }

          }, 500));
        }
    };
    // ***** Fin: Public Methods *****
    // *******************************

    // *****************************
    // ***** Start: Supervisor *****
    $.fn[pluginName] = function( method ) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || !method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' + method + ' does not exist in jQuery.' + pluginName );
        }
    };
    // ***** Fin: Supervisor *****
    // ***************************
})( jQuery );