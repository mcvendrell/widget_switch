/*
*   The Switch widget provides a switch with the new Android Holo style, instead of basic toggle.   
*   See the documentation in the docs directory for more details.
*/

// Default size
var defaults = {
    width: 80,
    height: 32
};
var properties = ["parentView", "value"];

// Allow parameters to be brought in through the parent tss file.
var args = _.defaults(arguments[0], defaults);
_.extend($.switchView, _.omit(args, properties));    

// Holds the lblCheck width for later calculations
var lblWidth = 40;

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

    // Initialize internal value    
    $._value = false;
    
    // borderRadius not under dip system variable, make manual dip
    var radius = dpUnitsToPixels($.switchView.height / 2);
    
    // Initialize general sizes
    $.switchView.borderRadius = radius;
    
    // Rearrange label sizes
    lblWidth = $.switchView.width / 2;
    $.lblCheck.width = lblWidth;
    $.lblCheck.borderRadius = radius;

    // On every click, change value to opposite
    $.switchView.addEventListener('click', function() {
        if ($.value) {
            // ON was selected, change to OFF;
            $.value = false;
        } else {
            // OFF was selected, change to ON;
            $.value = true;
        }
        // Trigger a change event for the widget
        $.trigger('change', { 
            source: $, 
            type: 'change', 
            value: $.value 
        });
    });
};

function dpUnitsToPixels(dpUnits) {
    if (OS_IOS) {
        return dpUnits;
    } else {
        return (dpUnits * (Titanium.Platform.displayCaps.dpi / 160));
    }
}

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

            // Create transformation&Animation (not under dip system variable, make manual dip)
            var x = (value === true) ? dpUnitsToPixels(lblWidth) : 0;
            var trans = Ti.UI.create2DMatrix();
            trans = trans.translate(x, 0);
            var anim = Ti.UI.createAnimation();
            anim.transform = trans;
            anim.duration = 300;
            // Do it over a view container instead the label, because there is a bug with 2D Matrix and borderRadius
            // https://jira.appcelerator.org/browse/TIMOB-13488
            $.lblWrapper.animate(anim);
            
            // Change the image
            var image = (value === true) ? 'on' : 'off';
            $.lblCheck.backgroundImage = '/images/com.mcvendrell.switch/' + image + '.png';
        }
    }
});

