/**
 * IIFE, expanding prototype of jQuery with catCounter method
 * @param {Object} $ Generic jQuery object
 * @param {Object} window Topmost context of code execution
 * @param {undefined} undefined Obviously undefined parameter
 */
(function($, window, undefined){

    $.fn.catCounter = function (options) {


        options = $.fn.catCounter.expandOptions.apply(options);
        console.log(options);
        return $(this).each(function () {
            $.fn.catCounter.init(this, options);
        });
    };
    /****************************************************************************************************************/

    /**
     * Extends empty object with default plugin options and passed as context user-given options
     * @return {Object}
     */
    $.fn.catCounter.expandOptions = function () {
        /*************************************************************************************************************
         * Default options for catCounter plugin
         * @type {Object}
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
             * @type {boolean} Vertical order of digits from top to down: ascending (true) or descending (false)
             */
            ascendingOrder: true,
            /**
             * @type {boolean} Appearance of leading zero-value digits: as zero (true) or blank space (false)
             */
            showAllDigits: false
        };

        return $.extend({}, defaults, this);
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

        var $elt = $(elt),
            startTime = new Date(),
            catCounter = $.fn.catCounter.createNode(elt, options);

        $elt.hide().parent().append(catCounter);

        var endTime = new Date();
        console.log(endTime - startTime);


        return true;
    };
    /****************************************************************************************************************/

    /**
     * Adds parameter as first child of given as context HTML Node
     * @param {Node} element
     */
    $.fn.catCounter.NodePrepend = function (element) {
        if (this.childNodes.length) {
            var firstElement = this.childNodes[0];
            this.insertBefore(element, firstElement);
        } else {
            this.appendChild(element);
        }
    };
    /****************************************************************************************************************/

    /******************************************************************************************************************
     * Create and return DOM-hierarchy for single counter instance with given parameters [pure JS]
     * @param {HTMLElement} elt - HTMLElement, replaced by counter
     * @param {Object} options - CatCounter plugin options
     * @return {HTMLElement} Detached HTMLElement, containing all DOM structure for one instance of counter
     */
    $.fn.catCounter.createNode = function (elt, options) {
        var catCounter = document.createElement('span'),
            addElement = (options.ascendingOrder) ? HTMLElement.prototype.appendChild : $.fn.catCounter.NodePrepend;
        catCounter.className = elt.className + ' ' + options._counterClassName;
        var text = elt.innerText;
        for (var d = 0; d < text.length; d ++) {
            var digit = document.createElement('span');
            digit.className = options._digitClassName;
            for (var i = 0; i < 10; i++) {
                var element = document.createElement('span');
                element.innerText = '' + i;
                addElement.call(digit, element);
            }
            element = document.createElement('span');
            element.innerText = '0';
            addElement.call(digit, element);

            catCounter.appendChild(digit);
        }
        return catCounter;
    };
    /****************************************************************************************************************/

    /******************************************************************************************************************
     * Create and return DOM-hierarchy for single counter instance with given parameters [jQuery]
     * @param {HTMLElement} elt - HTMLElement, replaced by counter
     * @param {Object} options - CatCounter plugin options
     * @return {HTMLElement} Detached HTMLElement, containing all DOM structure for one instance of counter
     */
    $.fn.catCounter.$createNode = function (elt, options) {
        var $catCounter = $('<span/>', {
                class: elt.className + ' ' + options._counterClassName
            }),
            digitsCount = elt.innerText.length,
            counterAddElement = (options.ascendingOrder) ? $.fn.append : $.fn.prepend;

        for (var d = --digitsCount; d >= 0; d--) {
            var $digit = $('<span/>', {
                    class: options._digitClassName,
                    'data-digit': d
                });
            for (var i = 0; i < 10; i++) {
                counterAddElement.call($digit, '<span>' + i + '</span>');
            }
            counterAddElement.call($digit, '<span>0</span>');
            $catCounter.append($digit);
        }
        return $catCounter;
    };
    /****************************************************************************************************************/

    /******************************************************************************************************************
     * Validates innerText property of DOM element
     * @param {HTMLElement} elt - DOM inline element, which innerText is validated
     * @return {boolean} - True, if any characters, except numerals is present in 'elt'
     * */
    $.fn.catCounter.isCounterValid = function (elt) {
        var text = elt.innerText,
            notNumerals = new RegExp('[^\\d]');
        return !notNumerals.test(text);
    };
    /****************************************************************************************************************/

})(jQuery, this);
