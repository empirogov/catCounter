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

        /*************************************************************************************************************
         * Default options for catCounter plugin
         * @type {{_counterClassName: string, _digitClassName: string, showAllDigits: boolean}}
         */
        var defaults = {
            /**
             * @type {String} Class name for top-level HTMLElement of single catCounter instance
             */
            _counterClassName: 'catCounter',
            /**
             * @type {String} Class name for decimal place wrapper HTMLElement
             */
            _digitClassName: 'catCounter__decimalPlace',
            /**
             * @type {boolean} Appearance of leading zero-value digits: as zero (true) or blank space (false)
             */
            showAllDigits: false
        };
        /************************************************************************************************************/

        options = $.extend({}, defaults, options);

        return $(this).each(function () {
            $.fn.catCounter.init(this, options);
        });
    };
    /****************************************************************************************************************/

    /******************************************************************************************************************
     * Visually replaces DOM element of future counter with necessary elements
     * @param {HTMLElement} elt Subject to replacement
     * @param {Object} options CatCounter plugin options
     * @return {boolean} True, if DOM element was successfully wrapped
     */
    $.fn.catCounter.init = function (elt, options) {

        if (!$.fn.catCounter.isCounterValid(elt)) {
            //console.log('"' + elt.innerText + '" is invalid');
            return false;
        } else {
            //console.log('"' + elt.innerText + '" is valid');
        }

        // TODO: write jQuery-based implementation of createNode method
        // TODO: compare performance and readability of pure JS and jQuery version
        var $elt = $(elt),
            startTime = new Date(),
            catCounter = $.fn.catCounter.createNode(elt, options);

        $elt.hide().parent().append(catCounter);

        var endTime = new Date();
        console.log(endTime - startTime);


        return true;
    };
    /****************************************************************************************************************/

    /******************************************************************************************************************
     * Creates and returns DOM-hierarchy for single counter instance with given parameters
     * @param {HTMLElement} elt Counter parent HTMLElement, used for some calculations to properly build DOM structure
     * @param {Object} options CatCounter plugin options
     * @return {HTMLElement} Detached HTMLElement, containing all DOM structure for one instance of counter
     */
    $.fn.catCounter.createNode = function (elt, options) {
        var catCounter = document.createElement('span');
        catCounter.className = elt.className + ' ' + options._counterClassName;
        var text = elt.innerText;
        for (var d = 0; d < text.length; d ++) {
            var digit = document.createElement('span');
            digit.className = options._digitClassName;
            for (var i = 0; i < 10; i++) {
                var element = document.createElement('span');
                element.innerText = '' + i;
                digit.appendChild(element);
            }
            element = document.createElement('span');
            element.innerText = '0';
            digit.appendChild(element);

            if (!options.showAllDigits) {
                element = document.createElement('span');
                element.innerText = ' ';
                digit.appendChild(element);
            }
            catCounter.appendChild(digit);
        }
        return catCounter;
    };
    /****************************************************************************************************************/

    /******************************************************************************************************************
     * Validates innerText property of DOM element
     * @param {HTMLElement} elt DOM inline element, which innerText is validated
     * @return {boolean} True, if any characters, except numerals is present in 'elt'
     * */
    $.fn.catCounter.isCounterValid = function (elt) {
        var text = elt.innerText,
            notNumerals = new RegExp('[^\\d]');
        return !notNumerals.test(text);
    };
    /****************************************************************************************************************/

})(jQuery, this);
