/**
 * IIFE, expanding prototype of jQuery with catCounter method
 * @param {Object} $ Generic jQuery object
 * @param {Object} window Topmost context of code execution
 * @param {undefined} undefined Obviously undefined parameter
 */
(function($, window, undefined){

    $.fn.catCounter = function (options) {
        $.fn.catCounter.catCounterStartTime = new Date();

        options = $.fn.catCounter.expandOptions.apply(options);
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
     * Extends empty object with default plugin options and passed as context user-given options,
     * also passes to options results of required browser features detection
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
             * @type {Number} Interval (in ms) of checks for original counter value changes
             */
            _listenerInterval: 500,
            /**
             * @type {boolean} Log in console timings of code execution
             */
            _useTimeProfiler: false,
            /**
             * @type {boolean} Vertical order of digits from top to down: ascending (true) or descending (false)
             */
            ascendingOrder: true,
            /**
             * @type {boolean} Appearance of leading zero-value digits: as zero (true) or blank space (false)
             */
            showAllDigits: false
        };

        return $.extend({}, defaults, this, $.fn.catCounter.checkCSSSupport());
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

    /******************************************************************************************************************
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
                console.log('Value changed to: "' + currentValue + '"');
                $elt.data('catCounterOldValue', currentValue);
            }
        }, options._listenerInterval));
    };
    /****************************************************************************************************************/

})(jQuery, this);
