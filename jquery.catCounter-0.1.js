/**
 * Fictive class, described for documenting purpose
 * @class
 * @name jQuery
 */


// TODO: check, if user browser has console and supports console.log

/**
 * IIFE, expanding prototype of jQuery with catCounter method
 * @function
 * @param {$} $ Generic jQuery object
 * @param {Window} window Topmost context of code execution
 * @param {undefined} undefined Obviously undefined parameter
 */
(function($, window, undefined){


    /**
     * Represents one decimal digit of catCounter
     * @class
     * @name catCounterDigit
     * @extends Node
     * @property {Number} _value
     *      Current value
     * @property {catCounter} parent
     *      Superior instance of {@link catCounter} class
     * @constructor
     * @param {catCounter} parent
     *      Initial value of {@link catCounterDigit#parent} property
     * @param {Number} value
     *      Initial value of {@link catCounterDigit#_value} property
     */
    var catCounterDigit = function (parent, value) {
        // TODO: Implement links with previous and next digits
        this._value = value;
        this.parent = parent;


        this._html = document.createElement('span');

        this._html.className = this.parent.options.digitClassName;

        var element = document.createElement('span');

        element.innerText = this.parent.options.allDigits;
        this._html.appendChild(element);
    };
    /****************************************************************************************************************/


    /**
     * @return {Number} {@link catCounterDigit#_value} property
     */
    catCounterDigit.prototype.getValue = function () {
        return this._value;
    };
    /****************************************************************************************************************/


    /**
     * Sets {@link catCounterDigit#_value} property of given instance of {@link catCounterDigit} class if any
     * convertible to float parameter is specified
     */
    catCounterDigit.prototype.setValue = function (value) {
        if (catCounter.catParseFloat(value) !== false) {
            this._value = value;
            return true;
        }
        return false;
    };
    /****************************************************************************************************************/


    /**
     * Sets {@link catCounterDigit#_value} property of given instance of {@link catCounterDigit} class if any
     * convertible to float parameter is specified and returns {@link catCounterDigit#_value} property value otherwise.
     * @param {Number} value New value of {@link catCounterDigit#_value} property
     * @description
     */
    catCounterDigit.prototype.changeValue = function (value) {
        // TODO: implement catCounterDigit.changeValue method: no value passed - get, valid passed - set, invalid passed - exception
    };
    /****************************************************************************************************************/


    /**
     * @class
     * @name catCounter
     * @property {Options} options Current instance options, extended from user defined and default ones
     * @property {HTMLElement} _parent HTML element, replaced with catCounter instance
     * @property {HTMLElement} _html HTML element, containing whole catCounter DOM-hierarchy
     * @property {jQuery} _$parent Same as _parent, wrapped in jQuery object
     * @constructor
     * @param {HTMLElement} parent
     *      HTML element, replaced with catCounter instance. This parameter can be retrieved by
     *      {@link catCounter#_parent} property of given instance
     * @param {Options} options
     *      Current instance options, extended from user defined, default and automatically detected ones.
     *      This parameter can be retrieved by {@link catCounter#options} property.
     * @description
     *      Each instance of catCounter class can be accessed through DOM. Each object, successfully
     *      replaced with catCounter instance has property cCounter, containing a link to catCounter object
     */
    var catCounter = function (parent, options) {
        // TODO: Implement digits constructor/destructor calls
        // TODO: Implement method, parsing and changing all of counter digits
        // TODO: Implement style-setting and renewal for HTML elements of catCounter instance
        this.options = options;
        this._parent = parent;
        this._$parent = $(parent);


        this._html = document.createElement('span');
        this._html.className = this._parent.className + ' ' + this.options.counterClassName;

        var parsedDigits = this._parseDigits(this._parent.textContent);
        this.digits = [];
        for (var d = 0; d < parsedDigits.length; d ++) {
            // TODO: implement addDigit method for catCounter object
            // this.addDigit();
            var digit = new catCounterDigit(this, 0);
            // TODO: CRITICAL! Fix FF digit creation routine
            this._html.appendChild(digit._html);
            this.digits.push(digit);
        }

        this.refreshStyles();

        this._$parent.hide()
            .after(this._html);

        this._setChangeListener();
    };
    /****************************************************************************************************************/


    /**
     * Returns CSS properties for given catCounter instance
     * @private
     * @return {Object}
     */
    catCounter.prototype._detectCSSProperties = function () {
        // TODO: Perfomance testing and code refactoring
        var _characterWidth = 0,
            _characterHeight = 0,
            oldVal = this._parent.innerText;

        //for (var char = 0; char < 10; char++) {
            this._parent.innerText = '0';
            _characterWidth = Math.max(_characterWidth, this._$parent.width());
            _characterHeight = Math.max(_characterHeight, this._$parent.height());
        //};
        this._parent.innerText = oldVal;

        return {
            lineHeight: this._$parent.css('line-height'),
            height:     _characterHeight,
            width:      _characterWidth
            };
    };
    /****************************************************************************************************************/


    /**
     * Returns array of decimal digit's values for given value
     * (i.e. returns [4, 3, 2] for passed value '432')
     * @param {String||Number} value
     * @return {Array}
     * @private
     */
    catCounter.prototype._parseDigits = function (value) {
        // TODO: CRITICAL! Fix x-large integer values parsing
        // TODO: Implement float values parsing
        // TODO: Refactor code to remove magical toFixed calls (?)
        var digits = new Array();
        value = parseInt($.trim(value));
        if ($.isNumeric(value)) {
            var newValue = value.toFixed(0)*10;
            for (var d=1; (newValue /= 10) >= 1; d++) {
                digits.push((newValue % 10).toFixed(0));
            }
        } else {
            // TODO: fix x-large values parsing
            var newValue = parseInt(value);
            if ((newValue === 0) || (newValue && String(newValue).length)) {
                var valueStr = String(newValue),
                    totalDigits = valueStr.length;
                for (var digit = totalDigits; digit > 0; digit--) {
                    digits.push(valueStr.charAt(digit-1));
                }
            }
        }
        // TODO: Optimise code
        var digits2 = new Array();
        for (var i = digits.length-1; i >= 0; i--) {
            digits2.push(digits[i]);
        }
        return digits2.length ? digits2 : ['0'];
    };
    /****************************************************************************************************************/


    /**
     * Executes routine for catCounter value changing from oldValue to newValue.
     * New value is parsed to digits, then, if necessary, new digits created and for each of them required loops number
     * is calculated and passed to according animation method.
     * @param {Number} value New value for catCounter instance
     * @returns {Boolean} true or false, based on validity of passed value
     */
    catCounter.prototype.changeValueTo = function (value) {
        // TODO: implement catCounter.changeValueTo method
        // parse digits:
        var newValueDigits = this._parseDigits(value);
        // create digits
        // if ()
        // calc animation loops count
        // change digits (includes animation start)
    };
    /****************************************************************************************************************/


    /**
     * Callback, executed in case of parent counter object value changed ('catCounter.valueChanged' event)
     * @param {Event} e 'catCounter.valueChanged' event object
     */
    catCounter.prototype._onValueChanged = function (e) {
        if (e.newValue !== undefined) {
            this.cCounter.options.onBeforeValueChanged(e);

            // clearInterval(this._catCounterChangeListener);

//            console.log('Value changed to: "' + e.newValue + '"');
            this.cCounter._oldParentValue = e.newValue;

            this.cCounter.options.onAfterValueChanged(e);
        }
    };
    /****************************************************************************************************************/


    /**
     * Initializes infinite loop of checks if of given catCounter instance parent element innerText changed
     * and fires 'catCounter.valueChanged' event if necessary
     */
    catCounter.prototype._setChangeListener = function () {
        this._$parent.on('catCounter.valueChanged', this._onValueChanged);

        this._oldParentValue = this._parent.innerText;
        var counter = this;
        this._catCounterChangeListener = setInterval (
            function () {
                if (counter._parent.innerText != counter._oldParentValue) {
                    var onChangeEvent = jQuery.Event('catCounter.valueChanged');
                    onChangeEvent.newValue = counter._parent.innerText;
                    onChangeEvent.oldValue = counter._oldParentValue;
                    counter._$parent.trigger(onChangeEvent);
                }
            },
            this.options.listenerInterval
        );
    };
    /****************************************************************************************************************/


    /**
     * Renews inline styles for given catCounter instance
     */
    catCounter.prototype.refreshStyles = function () {
        // TODO: Perfomance testing and code refactoring
        this._css = this._detectCSSProperties();
        //console.log(this._css);

        var newHeight = this._css.height,
            newWidth = this._css.width;

        $(this._html)
            .children()
            .css({
                'height': this._css.height,
                'width': this._css.width
            });
    };
    /****************************************************************************************************************/


    /**
     * Detection of browser CSS animation support and vendor prefixes (if any) for required CSS properties
     * @static
     * @return {{
     *      _useCSS: boolean,
     *      _usePrefix: String
     * }}
     * @methodOf catCounter
     */
    catCounter.checkCSSSupport = function () {
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
        if  (useCSS) {
            for (prop in support.prefix) {
                usePrefix = usePrefix || support.prefix[prop];
                if (usePrefix != support.prefix[prop]) {
                    useCSS = false;
                    break;
                }
            }
        }

        return {
            _useCSS: useCSS,
            _usePrefix: usePrefix
        };
    };
    /****************************************************************************************************************/


    /**
     * Sets new value for whole counter instance
     * @param {Number} value
     * @return {boolean}
     */
    catCounter.prototype.setValue = function (value) {
        var newValue = parseInt(this.value);
        if (newValue) {
            this.value = newValue;
            return true;
        } else {
            return false;
        }
    };
    /****************************************************************************************************************/


    /**
     * Returns float number value of passed param if it is convertible to float, and boolean false otherwise.
     * @static
     * @param value
     * @return {*}
     */
    catCounter.catParseFloat = function (value) {
        var parsedValue = parseFloat(value);
        if ( (arguments.length >= 1) && ((parsedValue === 0) || (parsedValue) ) ) {
            return value;
        }
        return false;
    };
    /****************************************************************************************************************/


    /**
     * @function
     * @name catCounter
     * @param {Object} options
     *      Object of type {@link catCounter.Options}, containing user defined options for catCounter class instance
     *      creation. Any missed options will be taken from new instance of {@link Options} class.
     * @returns {jQuery}
     * @memberOf jQuery
     */
    $.fn.catCounter = function (options) {
        var _defaults = new $.fn.catCounter._defaults();

        options = $.extend({}, _defaults, options, catCounter.checkCSSSupport());
        options.allDigits = (options.ascendingOrder) ? '0 1 3 4 5 6 7 8 9 0' : '0 9 8 7 6 5 4 3 2 1 0';
        //console.log(options);

        return $(this).each(function () {

            // Checking if no catCounter instances already assigned on this this element and/or any of it's parents
            if ((this.cCounter) || (this.isCatCounterChild())) {
                console.log('Rejected: catCounter instance already exists!');
                return true;
            }

            // Checks, if elements' inner text is valid
            if ((this.childElementCount) || (!this.ccIsParentValid())) {
                console.log('Rejected: Element contents isn\'t valid!');
                return true;
            }

            this.cCounter = new catCounter(this, options);
        });
    };
    /****************************************************************************************************************/


    /**
     * Fictive class for documenting plugin options hierarchy
     * @class
     * @ name Options
     * @property {String} [counterClassName="catCounter"]
     *      Class name for top-level HTMLElement of single catCounter instance
     * @property {String} [digitClassName="catCounter_decimalPlace"]
     *      Class name for decimal place wrapper HTMLElement
     * @property {Number} [listenerInterval=500]
     *      Interval (in ms) of checks for original counter value changes
     * @property {boolean} [ascendingOrder=true]
     *      Vertical order of digits (from top): ascending (true) or descending (false)
     * @property {boolean} [showAllDigits=false]
     *      Appearance of leading zero-value digits: zero (true) or blank space (false)
     * @property {Function} [onBeforeValueChanged]
     *      Callback executed before default onValueChanged method
     * @property {Function} [onAfterValueChanged]
     *      Callback executed after default onValueChanged method
     * @property {boolean} _useCSS
     *      If true, counter should be animated by CSS3 animation.
     *      Can't be defined by user, only by {@link catCounter.checkCSSSupport} method
     * @property {String} __usePrefix
     *      Vendor prefix (if any) for CSS3 animation properties, supported by user's browser
     * @private
     */
    $.fn.catCounter._defaults = function () {
        this.counterClassName = 'catCounter';
        this.digitClassName = 'catCounter__decimalPlace';
        this.listenerInterval = 500;
        this.ascendingOrder = true;
        this.showAllDigits = false;
        /* Callbacks */
        this.onBeforeValueChanged = function (e) {return !!e};
        this.onAfterValueChanged = function (e) {return !!e};
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
     * @this {HTMLElement}
     * @param {HTMLElement} newElement
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
     * Validates innerText property of DOM element
     * @this {HTMLElement}
     * @return {boolean} True, if any characters, except numerals is present in _parent
     * */
    Element.prototype.ccIsParentValid = function () {
        var notNumerals = new RegExp('[^\\d]'),
            text = $.text(this);
        return !notNumerals.test($.trim(text));
    };
    /****************************************************************************************************************/


    /**
     * Returns true if any of given as context HTML element's parents is already replaced with catCounter instance
     * @this {HTMLElement}
     * @return {boolean}
     */
    Element.prototype.isCatCounterChild = function () {
        var catCounterFound = false;
        $(this).parents().each(function () {
            catCounterFound = catCounterFound || (this.cCounter);
        });
        return catCounterFound;
    };
    /****************************************************************************************************************/

})(jQuery, this);
