/**
 * Fictive class, described for documenting purpose
 * @class
 * @name jQuery
 */


/**
 * IIFE, expanding prototype of jQuery with catCounter method
 * @function
 * @param {$} $ Generic jQuery object
 * @param {Window} window Topmost context of code execution
 * @param {undefined} undefined Obviously undefined parameter
 */
(function($, window, undefined){

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
        this.options = options;
        this._parent = parent;

        this._html = this._buildDOM();

        this._$parent = $(parent)
            .hide()
            .after(this._html);
        this._setChangeListener();
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
     * @property {Function} onBeforeValueChanged    Callback executed before default onValueChanged method
     * @property {Function} onAfterValueChanged     Callback executed after default onValueChanged method
     * @property {boolean} _useCSS
     *      If true, counter should be animated by CSS3 animation.
     *      Can't be defined by user, only by {@link catCounter.checkCSSSupport} method
     * @property {String} __usePrefix
     *      Vendor prefix (if any) for CSS3 animation properties, supported by user's browser
     * @private
     * @memberOf catCounter
     */

    /**
     * Default options of catCounter plugin
     * @static
     * @type {Options}
     */
    catCounter._defaults = {
        counterClassName: 'catCounter',
        digitClassName: 'catCounter__decimalPlace',
        listenerInterval: 500,
        _useTimeProfiler: false,
        ascendingOrder: true,
        showAllDigits: false,
        /* Callbacks */
        onBeforeValueChanged: function (e) {return this},
        onAfterValueChanged: function (e) {return this}
    };
    /****************************************************************************************************************/


    /**
     * Create and return DOM-hierarchy for given counter instance. Written without using of jQuery.
     * @return {HTMLElement} Detached HTMLElement, containing all DOM structure for one instance of counter
     */
    catCounter.prototype._buildDOM = function () {
        var counter = document.createElement('span'),
            allDigits = (this.options.ascendingOrder) ? '0 1 3 4 5 6 7 8 9 0' : '0 9 8 7 6 5 4 3 2 1 0';

        counter.className = this._parent.className + ' ' + this.options.counterClassName;
        var text = this._parent.innerText;
        for (var d = 0; d < text.length; d ++) {
            var digit = document.createElement('span');
            digit.className = this.options.digitClassName;

            var element = document.createElement('span');

            element.innerText = allDigits;
            digit.appendChild(element);

            counter.appendChild(digit);
        }
        return counter;
    };
    /****************************************************************************************************************/


    /**
     * Create and return DOM-hierarchy for single counter instance with given parameters.
     * @description
     *      Does exactly same things as {@link catCounter#_buildDOM}. Only difference is using of jQuery.
     *      Not surprisingly, pure JS code works up to 30% faster.
     * @return {jQuery}
     *      Detached HTMLElement, wrapped in jQuery object, which contains all DOM structure, required by catCounter
     *      with given options
     */
    catCounter.prototype._$buildDOM = function () {
        var $catCounter = $('<span/>', {
                class: this._parent.className + ' ' + this.options.counterClassName
            }),
            digitsCount = this._parent.innerText.length,
            allDigits = (this.options.ascendingOrder) ? '0 1 3 4 5 6 7 8 9 0' : '0 9 8 7 6 5 4 3 2 1 0';

        for (var d = --digitsCount; d >= 0; d--) {
            var $digit = $('<span/>', {
                class: this.options.digitClassName,
                'data-digit': d
            });
            $digit.append('<span>' + allDigits + '</span>')
            $catCounter.append($digit);
        }
        return $catCounter.get(0);
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
     * @function
     * @name catCounter
     * @param {Options} options
     *      Object of type {@link catCounter.Options}, containing user defined options for catCounter class instance
     *      creation. ny missed options will be taken from {@link catCounter._defaults} static property.
     * @returns {jQuery}
     * @memberOf jQuery
     */
    $.fn.catCounter = function (options) {
        $.fn.catCounter.catCounterStartTime = new Date();

        options = $.extend({}, catCounter._defaults, options, catCounter.checkCSSSupport());
        //console.log(options);

        return $(this).each(function () {
            /**
             *  Checks, if catCounter instance, based on this element, already exist
             *  TODO: check, if catCounter constructor called for any of it's existing child elements
             */
            if (this.cCounter) {
                console.log('Rejected: catCounter instance already exists!');
                return true;
            }

            /**
             * Checks, if elements' inner text is valid
             * TODO: Check, if element, used for catCounter creation has any unwanted children
             */
            if (!this.ccIsParentValid()) {
                console.log('Rejected: Element inner text isn\'t valid!');
                return true;
            }

            this.cCounter = new catCounter(this, options);

            if (this.cCounter.options._useTimeProfiler) {
                var catCounterEndTime = new Date();
                console.log(catCounterEndTime - $.fn.catCounter.catCounterStartTime);
            }
            //console.log(this.catCounter);
        });
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
        var notNumerals = new RegExp('[^\\d]');
        return !notNumerals.test(this.innerText);
    };
    /****************************************************************************************************************/


})(jQuery, this);
