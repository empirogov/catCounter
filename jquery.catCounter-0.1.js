
/**
 * IIFE, expanding prototype of jQuery with catCounter method
 * @function
 * @param {Object} $ Generic jQuery object
 * @param {Object} window Topmost context of code execution
 * @param {undefined} undefined Obviously undefined parameter
 */
(function($, window, undefined){

    /**
     * @alias catCounter
     * @namespace catCounter plugin execution namespace
     */
    $.fn.catCounter = function (options) {
        $.fn.catCounter.catCounterStartTime = new Date();

        options = $.extend({}, $.fn.catCounter._defaults, options, $.fn.catCounter.checkCSSSupport());
        console.log(options);

        return $(this).each(function () {
            $.fn.catCounter.init(this, options);
            if (options._useTimeProfiler) {
                var catCounterEndTime = new Date();
                console.log(catCounterEndTime - $.fn.catCounter.catCounterStartTime);
            }
        });
    };
    /****************************************************************************************************************/

    /**
     * Fictive class for documenting plugin options hierarchy
     * @class
     * @name Options
     * @property {String} counterClassName  Class name for top-level HTMLElement of single catCounter instance
     * @property {String} digitClassName    Class name for decimal place wrapper HTMLElement
     * @property {Number} listenerInterval  Interval (in ms) of checks for original counter value changes
     * @property {boolean} useTimeProfiler  Defines if catCounter logs timings of code execution in browser console
     * @property {boolean} ascendingOrder   Vertical order of digits (from top): ascending (true) or descending (false)
     * @property {boolean} showAllDigits    Appearance of leading zero-value digits: zero (true) or blank space (false)
     * @private
     * @memberOf $.fn.catCounter
     */

    /**
     * Default options of catCounter plugin
     * @return {$.fn.catCounter.Options}
     */
    $.fn.catCounter._defaults = {
        counterClassName: 'catCounter',
        digitClassName: 'catCounter__decimalPlace',
        listenerInterval: 500,
        _useTimeProfiler: false,
        ascendingOrder: true,
        showAllDigits: false
    };
    /****************************************************************************************************************/

    /**
     * Detection of browser CSS animation support and vendor prefixes (if any) for required CSS properties
     * @return {{
     *      _useCSS: boolean,
     *      _usePrefix: String
     * }}
     */
    $.fn.catCounter.checkCSSSupport = function () {
        var support = {
                cssSupport: {},
                prefix: {}
            },
            useCSS = true,
            usePrefix = '',
            detector = document.createElement('test'),
            vendors = ',Webkit,Moz,Ms,O'.split(','),
            propertyName = 'Animation',
            properties = 'Name,Duration,TimingFunction,Delay,IterationCount,Direction,PlayState'.split(',');

        for (var prop in properties) {
            properties[prop] = propertyName + properties[prop];
            support.cssSupport[properties[prop]] = false;
            for (var vendor in vendors) {
                var prefixProperty = vendors[vendor] + properties[prop],
                    isSupported = (detector.style[prefixProperty] === '');
                if (isSupported) {
                    support.cssSupport[properties[prop]] = (support.cssSupport[properties[prop]]) || isSupported;
                    support.prefix[properties[prop]] = vendors[vendor];
                    break;
                }
            }
            useCSS = (useCSS) && (support.cssSupport[properties[prop]]);
        }
        // At the moment plugin will use CSS only if all required css properties prefixes are equal
        for (prop in support.prefix) {
            usePrefix = usePrefix || support.prefix[prop];
            if (usePrefix != support.prefix[prop]) {
                useCSS = false;
                break;
            }
        }

        return {
            _useCSS: useCSS,
            _usePrefix: usePrefix
        };
    };
    /****************************************************************************************************************/

    /**
     * Visually replaces DOM element of future counter with necessary elements
     * @param {HTMLElement} elt Subject to replacement
     * @param {Object} options CatCounter plugin options
     * @return {boolean} True, if DOM element was successfully wrapped
     */
    $.fn.catCounter.init = function (elt, options) {

        if (!$.fn.catCounter.isCounterValid(elt)) {
            return false;
        }

        var $elt = $(elt),
            catCounter = $.fn.catCounter.createNode(elt, options);

        $elt.hide().parent().append(catCounter);
        $.fn.catCounter.setChangeListener(elt, options);
        $elt.on('catCounter.valueChanged', $.fn.catCounter.onValueChanged);

        return true;
    };
    /****************************************************************************************************************/

    /**
     * Fictive class declaration for DOM Element object.
     * For further details see http://www.w3schools.com/jsref/dom_obj_element.asp
     * @name Element
     * @class
     * @constructor
     */

    /**
     * Adds parameter as first child of given as context HTML Node
     * @this {Node}
     * @param {Node} newElement
     * @methodOf Element.prototype
     */
    Element.prototype.ccPrependChild = function (newElement) {
        if (this.firstChild) {
            this.insertBefore(newElement, this.firstChild);
        } else {
            this.appendChild(newElement);
        }
    };
    /****************************************************************************************************************/

    /**
     * Create and return DOM-hierarchy for single counter instance with given parameters [pure JS]
     * @param {HTMLElement} elt - HTMLElement, replaced by counter
     * @param {Object} options - CatCounter plugin options
     * @return {HTMLElement} Detached HTMLElement, containing all DOM structure for one instance of counter
     */
    $.fn.catCounter.createNode = function (elt, options) {
        var catCounter = document.createElement('span'),
            allDigits = (options.ascendingOrder) ? '0 1 3 4 5 6 7 8 9 0' : '0 9 8 7 6 5 4 3 2 1 0';

        catCounter.className = elt.className + ' ' + options.counterClassName;
        var text = elt.innerText;
        for (var d = 0; d < text.length; d ++) {
            var digit = document.createElement('span');
            digit.className = options.digitClassName;

            var element = document.createElement('span');

            element.innerText = allDigits;
            digit.appendChild(element);

            catCounter.appendChild(digit);
        }
        return catCounter;
    };
    /****************************************************************************************************************/

    /**
     * Create and return DOM-hierarchy for single counter instance with given parameters [jQuery]
     * @param {HTMLElement} elt - HTMLElement, replaced by counter
     * @param {Object} options - CatCounter plugin options
     * @return {HTMLElement} Detached HTMLElement, containing all DOM structure for one instance of counter
     */
    $.fn.catCounter.$createNode = function (elt, options) {
        var $catCounter = $('<span/>', {
                class: elt.className + ' ' + options.counterClassName
            }),
            digitsCount = elt.innerText.length,
            allDigits = (options.ascendingOrder) ? '0 1 3 4 5 6 7 8 9 0' : '0 9 8 7 6 5 4 3 2 1 0';

        for (var d = --digitsCount; d >= 0; d--) {
            var $digit = $('<span/>', {
                    class: options.digitClassName,
                    'data-digit': d
                });
            $digit.append('<span>' + allDigits + '</span>')
            $catCounter.append($digit);
        }
        return $catCounter;
    };
    /****************************************************************************************************************/

    /**
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

    /**
     * Initializes infinite loop of checks if some element innerText is changed
     * @param {HTMLElement} elt - Checked element
     * @param {Object} options - Options of counter given instance
     */
    $.fn.catCounter.setChangeListener = function (elt, options) {
        var $elt = $(elt);
        $elt.data('catCounterOldValue', elt.innerText);
        $elt.data('catCounterChangeListener', setInterval(function () {
            var currentValue = elt.innerText,
                $elt = $(elt),
                oldValue = $elt.data('catCounterOldValue');
            if (currentValue != oldValue) {
                var onChangeEvent = jQuery.Event('catCounter.valueChanged');
                onChangeEvent.newValue = currentValue;
                $elt
                    .data('catCounterOldValue', currentValue)
                    .trigger(onChangeEvent);
            }
        }, options.listenerInterval));
    };
    /****************************************************************************************************************/

    /**
     * Callback, executed in case of parent counter object value changed ('catCounter.valueChanged' event)
     * @param {Object} e - 'catCounter.valueChanged' event object
     */
    $.fn.catCounter.onValueChanged = function (e) {
        console.log('Value changed to: "' + e.newValue + '"');
        console.log(e);
    };
    /****************************************************************************************************************/

})(jQuery, this);
