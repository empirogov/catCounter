/**
 * IIFE, expanding prototype of jQuery with catCounter method
 * @author E.Pirogov
 * @version 0.1
 * @param {Object} $ Generic jQuery object
 * @param {Object} window Topmost context of code execution
 * @param {undefined} undefined Obviously undefined parameter
 */
(function($, window, undefined){

    $.fn.catCounter = function (options) {

        var defaults = {
            test2: '2'
        };

        options = $.extend({}, defaults, options);

        return $(this).each(function () {
            $.fn.catCounter.init(this, options);
        });
    };

    /**
     * Visually replaces DOM element of future counter with necessary elements
     * @param {Object} elt Subject to replacement
     * @param {Object} options Not implemented yet
     * @return {boolean} True, if DOM element was successfully wrapped
     */
    $.fn.catCounter.init = function (elt, options) {

        console.log('init');
        console.log(elt);
        console.log(options);

        if (!$.fn.catCounter.isCounterValid(elt)) {
            return false;
        } else {
            console.log('"' + elt.innerText + '" is valid');
        }

        var $elt = $(elt);
        $elt.after('<span class="catCounter">!</span>').hide();
        return true;
    };

    /**
     * Validates innerText property of DOM element
     * @param {Object} elt DOM inline element, which innerText is validated
     * @return {boolean} True, if any characters, except numerals is present in 'elt'
     * */
    $.fn.catCounter.isCounterValid = function (elt) {
        var text = elt.innerText,
            notNumerals = new RegExp('[^\\d]');
        return !notNumerals.test(text);
    };

})(jQuery, this);
