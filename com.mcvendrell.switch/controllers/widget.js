/*
*   The Switch widget provides a switch with the new Android Holo style, instead of basic toggle.   
*   See the documentation in the docs directory for more details.
*/

// Default size
var defaults = {
    width: 85,
    height: 21
};
var dimensions =  ["left", "top", "right", "bottom", "center", "width", "height"];
var properties = ["parentView", "value"];

// Allow parameters to be brought in through the parent tss file.
var args = _.defaults(arguments[0], defaults);
_.extend($.switchView, _.omit(args, properties));    

/**
 * @method init
 * Initializes the switch.
 * @param {TiUIWindow} [parentView] Parent view/window to display the switch in.
 */
exports.init = function (parentView) {
    if (!parentView) {
        Ti.API.error("Custom Switch: missing required parameter \'parent\'.");
    }
    $.parentView = parentView;

    // Create two buttons to emulate states
    var btnOn = Ti.UI.createButton({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        id: 'on',
        backgroundImage : '/images/com.mcvendrell.switch/on.png'
    });
    var btnOff = Ti.UI.createButton({
        width : Ti.UI.SIZE,
        height : Ti.UI.SIZE,
        id: 'off',
        backgroundImage : '/images/com.mcvendrell.switch/off.png'
    });
    
    // Add each button to own view on the scroll
    //$.switchView.setOverScrollMode(Ti.UI.Android.OVER_SCROLL_NEVER); //Doesn't work, so make background same color as background images
    $.switchView.setViews([btnOn, btnOff]);
    // First page is on (to get a good scroll), set off as default
    $.switchView.scrollToView(1);
    $._value = false;

    // When the scroll is finished, get the state and trigger (first page = ON)
    $.switchView.addEventListener('dragend', function(e) {
        var page = e.currentPage;
        if (page == 0) {
            // ON is selected;
            $.value = true;
        } else {
            // OFF is selected;
            $.value = false;
        }
        // Trigger a change event for the widget
        $.trigger('change', { 
            source: $, 
            type: 'change', 
            value: $.value 
        });
    });
};

// value is the configured value for the switch: true or false
Object.defineProperty($, "value", {
    get: function() { 
        return $._value; 
    },
    set: function(value) {
        if (typeof value !== 'boolean') {
            Ti.API.error("Custom Switch: \'value\' must be boolean.");
        } else {
            $._value = value;
            // Remember, first page = ON = true
            var page = (value === true) ? 0 : 1;
            $.switchView.scrollToView(page);
        }
    }
});

