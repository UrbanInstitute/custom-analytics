# custom-analytics
Custom events for google analytics

##Installing this script
At the bottom of a page that includes google analytics (currently only supported for `analytics.js`), embed the javascript with
```html
<script src = "path/to/custom-analytics.min.js"></script>
```
**below** the `analytics.js` embed script.

#Tracking non-scroll events

To track custom events, you will be calling the either the `scroll_track` method (for scrolling events) or the `track` method (for all other events) of the `custom_analytics` function inside a `<script>` tag, underneath the link to `urban-analytics.js`. The function takes a [javascript objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects) that is a list of settings to send to Google. Here's an example of what the `track` method call might look like. Below, there are descriptions of each value in the passed object.

```html
<script type="text/javascript">
$(".download-button")
.custom_analytics('track',{
	category: "button",
	action: "click",
	label: "object_ID",
	value: 1,
	timing: true,
	interaction: true
});

</script>
```
Let's break that up line by line.

##elements
In this example, `$(CSS_SELECTOR).custom_analytics('track',{options})` is the general form of function calls, for this plugin. Since this code plugs in to jQuery, jQuery is required (it's standard on all Urban pages), and selection should be made as above, using jQuery selectors. This structure means that:
1. Any selector will be valid, whether it selects a single element (usually by id) or multiple elements (usually by class). Selections made on multiple elements will make separate calls to google analytics for each element, using the same options for all calls.

2. Functions can be chained together. This means the following structure would work great:
```javascript
$(".download-button")
	.custom_analytics('track',{OPTIONS FOR CLICK EVENTS})
	.custom_analytics('track',{OPTIONS FOR MOUSEOVER EVENTS})
	.custom_analytics('scroll_track',{OPTIONS FOR SCROLL EVENTS (SEE BELOW)})
```

##category
*This is a required field.*
The `category` key is used by Google Analytics to group similar events together. It can be any String value you like. As a best practice, I suggest element types are used as categories (button, video, paragraph, window, text box, etc.)

##action
*This is a required field*
The next tier of classification Google uses is `action`s. The heirarchical structure means, for example:
All `button -> click`, `button -> focus`, or `button -> hover` events would be aggregated under `button` and could be further drilled down to examine the individual actions.
However, `button -> click`, `paragraph -> click`, and `image -> click` cannot be grouped together under the `click` action, they are all aggregated under their corresponding categories.

*IMPORTANT NOTE* The `action` field accepts a String, but it must be the name of a [standard web event](https://developer.mozilla.org/en-US/docs/Web/Events). Examples include `click`, `dblclick`, `mouseenter`, etc. See the [MDN reference](https://developer.mozilla.org/en-US/docs/Web/Events) for a link of all event names.

##label
*This is NOT a required field*
The optional `label` is a third tier of classification that Google uses. So, for example, each type of `button -> click` could have a separate label ("Download button", "Animate button", "Toggle button", etc.) If you do not specify a label, none will be sent.

####Special labels:
There are two special values for the `label` parameter.
- `label: "object_ID"` will use the object's css id as the label to send to google analytics.
- `label: "object_HTML"` will send the entire html of the object as a label, e.g. `<button id = "cool_button" class = "buttons">Button</button>`

####label function
The label attribute may also be a function of the form...
```javascript
function (el) {
	return ...
}
```
which takes in the selected DOM node and returns a string

##value
*This is NOT a required field*
The optional `value` can be used to attach an *integer* value to an event. Google tracks averages of these values, so they could be used for functions such as scroll depth tracking (see below), or any other numeric value. If you do not specify a value, none will be sent.

##timing
*This is NOT a required field*
Google analytics can also send "timing" events, which are separate in the analytics dashboard from all other events. If you enable timing by setting it to `true`, then the given event will be paired with a separate timing event, storing how long the event happened after the page loaded (in milliseconds). *If you do not specifically set this value to `true`, it defaults to `false`.*

##interaction
*This is NOT a required field*
By default, all events are set as non-interaction events, meaning they will not affect the [bounce rate](https://support.google.com/analytics/answer/1009409?hl=en). It may make sense to set certain events as interaction events (e.g. button clicks far down on the page), but I'd recomend leaving the default value of `false` for the interaction field during initial implementation. Setting many events as interaction events will make cross-project analytics difficult, as well as comparison of projects over time. *If you do not specifically set this value to `true`, it defaults to `false`.*


#Tracking scroll events

There are two types of scroll events:
- **breakpoint** events fire when the user has scrolled 25%, 50%, 75%, and 100% of the way down the page
- **element bound** events fire when a user has scrolled past a certain element.

Here are examples of each event type:

##Breakpoint event
Breakpoint events are always called on the `window` object.
```javascript
$(window)
.custom_analytics('scrollTrack', {
	timing: true,
	interaction: true
});
```
**NOTE: For breakpoint events you should not set `category`, `action`, `label`, or `value` fields for breakpoint events**
For breakpoint events, the `category` is always set to `scroll breakpoint`, the `action` is set to `scroll`, the `label` is set to the percentage down the page, and the `value` is set to the number of pixels down the page (which may differ across devices). As above, `timing` and `interaction` default to false, but may be set to true.


##Element bound events
```javascript
$("#download-button")
.custom_analytics('scrollTrack', {
	label: "object_HTML",
	value: 1,
	timing: true,
	interaction: true
});
```

For element bound events, the `category` is always set to "scroll past element" and the `action` is always set to "scroll". You may specify:

####label
The same as for non-scrolling events, including the special "object_ID" and "object_HTML" lables.

####value
The same as for non-scrolling events. **Note that if no value is specified, a default value will be sent to google analytics, equal to the distance in pixels from the top of the page to the top of the element**

####timing
The same as for non-scrolling events

####interaction
The same as for non-scrolling events

##Both breakpoint and element bound events
If you want to call scroll events on certain objects, but also track the 25%, 50%, 75%, 100% breakpoints, you may do so with a call like:
```javascript
$("#download-button")
.custom_analytics('scrollTrack', {
	breakpoints: true
});
```