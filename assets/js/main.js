(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
//! moment.js

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

    var hookCallback;

    function hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
    }

    function isObject(input) {
        // IE8 will treat undefined and null as object if it wasn't for
        // input != null
        return input != null && Object.prototype.toString.call(input) === '[object Object]';
    }

    function isObjectEmpty(obj) {
        if (Object.getOwnPropertyNames) {
            return (Object.getOwnPropertyNames(obj).length === 0);
        } else {
            var k;
            for (k in obj) {
                if (obj.hasOwnProperty(k)) {
                    return false;
                }
            }
            return true;
        }
    }

    function isUndefined(input) {
        return input === void 0;
    }

    function isNumber(input) {
        return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false,
            parsedDateParts : [],
            meridiem        : null,
            rfc2822         : false,
            weekdayMismatch : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function (fun) {
            var t = Object(this);
            var len = t.length >>> 0;

            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    function isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            var parsedParts = some.call(flags.parsedDateParts, function (i) {
                return i != null;
            });
            var isNowValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.weekdayMismatch &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated &&
                (!flags.meridiem || (flags.meridiem && parsedParts));

            if (m._strict) {
                isNowValid = isNowValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }

            if (Object.isFrozen == null || !Object.isFrozen(m)) {
                m._isValid = isNowValid;
            }
            else {
                return isNowValid;
            }
        }
        return m._isValid;
    }

    function createInvalid (flags) {
        var m = createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i = 0; i < momentProperties.length; i++) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function warn(msg) {
        if (hooks.suppressDeprecationWarnings === false &&
                (typeof console !==  'undefined') && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (hooks.deprecationHandler != null) {
                hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                var args = [];
                var arg;
                for (var i = 0; i < arguments.length; i++) {
                    arg = '';
                    if (typeof arguments[i] === 'object') {
                        arg += '\n[' + i + '] ';
                        for (var key in arguments[0]) {
                            arg += key + ': ' + arguments[0][key] + ', ';
                        }
                        arg = arg.slice(0, -2); // Remove trailing comma and space
                    } else {
                        arg = arguments[i];
                    }
                    args.push(arg);
                }
                warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    hooks.suppressDeprecationWarnings = false;
    hooks.deprecationHandler = null;

    function isFunction(input) {
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
    }

    function set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (isFunction(prop)) {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
        // TODO: Remove "ordinalParse" fallback in next major release.
        this._dayOfMonthOrdinalParseLenient = new RegExp(
            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
                '|' + (/\d{1,2}/).source);
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig), prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentConfig) {
            if (hasOwnProp(parentConfig, prop) &&
                    !hasOwnProp(childConfig, prop) &&
                    isObject(parentConfig[prop])) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function (obj) {
            var i, res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function calendar (key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameElse'];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        ss : '%d seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (isFunction(output)) ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    var priorities = {};

    function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
    }

    function getPrioritizedUnits(unitsObj) {
        var units = [];
        for (var u in unitsObj) {
            units.push({unit: u, priority: priorities[u]});
        }
        units.sort(function (a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '', i;
            for (i = 0; i < length; i++) {
                output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match3to4      = /\d\d\d\d?/;     //     999 - 9999
    var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    // includes scottish gaelic two word and hyphenated months
    var matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i;

    var regexes = {};

    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }));
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (isNumber(callback)) {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;
    var WEEK = 7;
    var WEEKDAY = 8;

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? '' + y : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PRIORITIES

    addUnitPriority('year', 1);

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                set$1(this, unit, value);
                hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get(this, unit);
            }
        };
    }

    function get (mom, unit) {
        return mom.isValid() ?
            mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
    }

    function set$1 (mom, unit, value) {
        if (mom.isValid() && !isNaN(value)) {
            if (unit === 'FullYear' && isLeapYear(mom.year()) && mom.month() === 1 && mom.date() === 29) {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value, mom.month(), daysInMonth(value, mom.month()));
            }
            else {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
            }
        }
    }

    // MOMENTS

    function stringGet (units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units]();
        }
        return this;
    }


    function stringSet (units, value) {
        if (typeof units === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units);
            for (var i = 0; i < prioritized.length; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    function mod(n, x) {
        return ((n % x) + x) % x;
    }

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    function daysInMonth(year, month) {
        if (isNaN(year) || isNaN(month)) {
            return NaN;
        }
        var modMonth = mod(month, 12);
        year += (month - modMonth) / 12;
        return modMonth === 1 ? (isLeapYear(year) ? 29 : 28) : (31 - modMonth % 7 % 2);
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PRIORITY

    addUnitPriority('month', 8);

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m, format) {
        if (!m) {
            return isArray(this._months) ? this._months :
                this._months['standalone'];
        }
        return isArray(this._months) ? this._months[m.month()] :
            this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m, format) {
        if (!m) {
            return isArray(this._monthsShort) ? this._monthsShort :
                this._monthsShort['standalone'];
        }
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
            this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    function handleStrictParse(monthName, format, strict) {
        var i, ii, mom, llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (!isNumber(value)) {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            hooks.updateOffset(this, true);
            return this;
        } else {
            return get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    var defaultMonthsShortRegex = matchWord;
    function monthsShortRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
                this._monthsShortRegex = defaultMonthsShortRegex;
            }
            return this._monthsShortStrictRegex && isStrict ?
                this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }

    var defaultMonthsRegex = matchWord;
    function monthsRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
                this._monthsRegex = defaultMonthsRegex;
            }
            return this._monthsStrictRegex && isStrict ?
                this._monthsStrictRegex : this._monthsRegex;
        }
    }

    function computeMonthsParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    }

    function createDate (y, m, d, h, M, s, ms) {
        // can't just apply() to create a date:
        // https://stackoverflow.com/q/181348
        var date = new Date(y, m, d, h, M, s, ms);

        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));

        // the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear, resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek, resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PRIORITIES

    addUnitPriority('week', 5);
    addUnitPriority('isoWeek', 5);

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PRIORITY
    addUnitPriority('day', 11);
    addUnitPriority('weekday', 11);
    addUnitPriority('isoWeekday', 11);

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   function (isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd',   function (isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd',   function (isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseIsoWeekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m, format) {
        if (!m) {
            return isArray(this._weekdays) ? this._weekdays :
                this._weekdays['standalone'];
        }
        return isArray(this._weekdays) ? this._weekdays[m.day()] :
            this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
    }

    function handleStrictParse$1(weekdayName, format, strict) {
        var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse (weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return handleStrictParse$1.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\\.?') + '$', 'i');
                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$', 'i');
                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$', 'i');
            }
            if (!this._weekdaysParse[i]) {
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    var defaultWeekdaysRegex = matchWord;
    function weekdaysRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                this._weekdaysRegex = defaultWeekdaysRegex;
            }
            return this._weekdaysStrictRegex && isStrict ?
                this._weekdaysStrictRegex : this._weekdaysRegex;
        }
    }

    var defaultWeekdaysShortRegex = matchWord;
    function weekdaysShortRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }
            return this._weekdaysShortStrictRegex && isStrict ?
                this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
    }

    var defaultWeekdaysMinRegex = matchWord;
    function weekdaysMinRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }
            return this._weekdaysMinStrictRegex && isStrict ?
                this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
    }


    function computeWeekdaysParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom, minp, shortp, longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, 1]).day(i);
            minp = this.weekdaysMin(mom, '');
            shortp = this.weekdaysShort(mom, '');
            longp = this.weekdays(mom, '');
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 7; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
        this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PRIORITY
    addUnitPriority('hour', 13);

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('k',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);
    addRegexToken('kk', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['k', 'kk'], function (input, array, config) {
        var kInput = toInt(input);
        array[HOUR] = kInput === 24 ? 0 : kInput;
    });
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour they want. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
        relativeTime: defaultRelativeTime,

        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,

        week: defaultLocaleWeek,

        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,

        meridiemParse: defaultLocaleMeridiemParse
    };

    // internal storage for locale config files
    var locales = {};
    var localeFamilies = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return globalLocale;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && (typeof module !== 'undefined') &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                var aliasedRequire = require;
                aliasedRequire('./locale/' + name);
                getSetGlobalLocale(oldLocale);
            } catch (e) {}
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
            else {
                if ((typeof console !==  'undefined') && console.warn) {
                    //warn user if arguments are passed but the locale could not be set
                    console.warn('Locale ' + key +  ' not found. Did you forget to load it?');
                }
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, config) {
        if (config !== null) {
            var locale, parentConfig = baseConfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple('defineLocaleOverride',
                        'use moment.updateLocale(localeName, config) to change ' +
                        'an existing locale. moment.defineLocale(localeName, ' +
                        'config) should only be used for creating a new locale ' +
                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
                parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    parentConfig = locales[config.parentLocale]._config;
                } else {
                    locale = loadLocale(config.parentLocale);
                    if (locale != null) {
                        parentConfig = locale._config;
                    } else {
                        if (!localeFamilies[config.parentLocale]) {
                            localeFamilies[config.parentLocale] = [];
                        }
                        localeFamilies[config.parentLocale].push({
                            name: name,
                            config: config
                        });
                        return null;
                    }
                }
            }
            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            if (localeFamilies[name]) {
                localeFamilies[name].forEach(function (x) {
                    defineLocale(x.name, x.config);
                });
            }

            // backwards compat for now: also set the locale
            // make sure we set the locale AFTER all child locales have been
            // created, so we won't end up with the child locale set.
            getSetGlobalLocale(name);


            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale, tmpLocale, parentConfig = baseConfig;
            // MERGE
            tmpLocale = loadLocale(name);
            if (tmpLocale != null) {
                parentConfig = tmpLocale._config;
            }
            config = mergeConfigs(parentConfig, config);
            locale = new Locale(config);
            locale.parentLocale = locales[name];
            locales[name] = locale;

            // backwards compat for now: also set the locale
            getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function listLocales() {
        return keys(locales);
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(hooks.now());
        if (config._useUTC) {
            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, expectedWeekday, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear != null) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay();

        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }

        // check for mismatching day of week
        if (config._w && typeof config._w.d !== 'undefined' && config._w.d !== expectedWeekday) {
            getParsingFlags(config).weekdayMismatch = true;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            var curWeek = weekOfYear(createLocal(), dow, doy);

            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

            // Default to current week.
            week = defaults(w.w, curWeek.week);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
        ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
        ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
        ['YYYY-DDD', /\d{4}-\d{3}/],
        ['YYYY-MM', /\d{4}-\d\d/, false],
        ['YYYYYYMMDD', /[+-]\d{10}/],
        ['YYYYMMDD', /\d{8}/],
        // YYYYMM is NOT allowed by the standard
        ['GGGG[W]WWE', /\d{4}W\d{3}/],
        ['GGGG[W]WW', /\d{4}W\d{2}/, false],
        ['YYYYDDD', /\d{7}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
        ['HH:mm:ss', /\d\d:\d\d:\d\d/],
        ['HH:mm', /\d\d:\d\d/],
        ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
        ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
        ['HHmmss', /\d\d\d\d\d\d/],
        ['HHmm', /\d\d\d\d/],
        ['HH', /\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime, dateFormat, timeFormat, tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
    var rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/;

    function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
        var result = [
            untruncateYear(yearStr),
            defaultLocaleMonthsShort.indexOf(monthStr),
            parseInt(dayStr, 10),
            parseInt(hourStr, 10),
            parseInt(minuteStr, 10)
        ];

        if (secondStr) {
            result.push(parseInt(secondStr, 10));
        }

        return result;
    }

    function untruncateYear(yearStr) {
        var year = parseInt(yearStr, 10);
        if (year <= 49) {
            return 2000 + year;
        } else if (year <= 999) {
            return 1900 + year;
        }
        return year;
    }

    function preprocessRFC2822(s) {
        // Remove comments and folding whitespace and replace multiple-spaces with a single space
        return s.replace(/\([^)]*\)|[\n\t]/g, ' ').replace(/(\s\s+)/g, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }

    function checkWeekday(weekdayStr, parsedInput, config) {
        if (weekdayStr) {
            // TODO: Replace the vanilla JS Date object with an indepentent day-of-week check.
            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
                weekdayActual = new Date(parsedInput[0], parsedInput[1], parsedInput[2]).getDay();
            if (weekdayProvided !== weekdayActual) {
                getParsingFlags(config).weekdayMismatch = true;
                config._isValid = false;
                return false;
            }
        }
        return true;
    }

    var obsOffsets = {
        UT: 0,
        GMT: 0,
        EDT: -4 * 60,
        EST: -5 * 60,
        CDT: -5 * 60,
        CST: -6 * 60,
        MDT: -6 * 60,
        MST: -7 * 60,
        PDT: -7 * 60,
        PST: -8 * 60
    };

    function calculateOffset(obsOffset, militaryOffset, numOffset) {
        if (obsOffset) {
            return obsOffsets[obsOffset];
        } else if (militaryOffset) {
            // the only allowed military tz is Z
            return 0;
        } else {
            var hm = parseInt(numOffset, 10);
            var m = hm % 100, h = (hm - m) / 100;
            return h * 60 + m;
        }
    }

    // date and time from ref 2822 format
    function configFromRFC2822(config) {
        var match = rfc2822.exec(preprocessRFC2822(config._i));
        if (match) {
            var parsedArray = extractFromRFC2822Strings(match[4], match[3], match[2], match[5], match[6], match[7]);
            if (!checkWeekday(match[1], parsedArray, config)) {
                return;
            }

            config._a = parsedArray;
            config._tzm = calculateOffset(match[8], match[9], match[10]);

            config._d = createUTCDate.apply(null, config._a);
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

            getParsingFlags(config).rfc2822 = true;
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        configFromRFC2822(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        // Final attempt, use Input Fallback
        hooks.createFromInputFallback(config);
    }

    hooks.createFromInputFallback = deprecate(
        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
        'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
        'discouraged and will be removed in an upcoming major release. Please refer to ' +
        'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // constant that refers to the ISO standard
    hooks.ISO_8601 = function () {};

    // constant that refers to the RFC 2822 form
    hooks.RFC_2822 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === hooks.ISO_8601) {
            configFromISO(config);
            return;
        }
        if (config._f === hooks.RFC_2822) {
            configFromRFC2822(config);
            return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            // console.log('token', token, 'parsedInput', parsedInput,
            //         'regex', getParseRegexForToken(token, config));
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (config._a[HOUR] <= 12 &&
            getParsingFlags(config).bigHour === true &&
            config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
            return obj && parseInt(obj, 10);
        });

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isDate(input)) {
            config._d = input;
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        }  else {
            configFromInput(config);
        }

        if (!isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (isUndefined(input)) {
            config._d = new Date(hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (isObject(input)) {
            configFromObject(config);
        } else if (isNumber(input)) {
            // from milliseconds
            config._d = new Date(input);
        } else {
            hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (locale === true || locale === false) {
            strict = locale;
            locale = undefined;
        }

        if ((isObject(input) && isObjectEmpty(input)) ||
                (isArray(input) && input.length === 0)) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
        'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
        function () {
            var other = createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other < this ? this : other;
            } else {
                return createInvalid();
            }
        }
    );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
        function () {
            var other = createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other > this ? this : other;
            } else {
                return createInvalid();
            }
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +(new Date());
    };

    var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

    function isDurationValid(m) {
        for (var key in m) {
            if (!(indexOf.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
                return false;
            }
        }

        var unitHasDecimal = false;
        for (var i = 0; i < ordering.length; ++i) {
            if (m[ordering[i]]) {
                if (unitHasDecimal) {
                    return false; // only allow non-integers for smallest unit
                }
                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                    unitHasDecimal = true;
                }
            }
        }

        return true;
    }

    function isValid$1() {
        return this._isValid;
    }

    function createInvalid$1() {
        return createDuration(NaN);
    }

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        this._isValid = isDurationValid(normalizedInput);

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible to translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function absRound (number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // FORMATTING

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = (string || '').match(matcher);

        if (matches === null) {
            return null;
        }

        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return minutes === 0 ?
          0 :
          parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            hooks.updateOffset(res, false);
            return res;
        } else {
            return createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime, keepMinutes) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
                if (input === null) {
                    return this;
                }
            } else if (Math.abs(input) < 16 && !keepMinutes) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    addSubtract(this, createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === 'string') {
            var tZone = offsetFromString(matchOffset, this._i);
            if (tZone != null) {
                this.utcOffset(tZone);
            }
            else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset () {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc () {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    // and further modified to allow for strings containing both week and day
    var isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

    function createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (isNumber(input)) {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])                         * sign,
                h  : toInt(match[HOUR])                         * sign,
                m  : toInt(match[MINUTE])                       * sign,
                s  : toInt(match[SECOND])                       * sign,
                ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
            };
        } else if (!!(match = isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : (match[1] === '+') ? 1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                w : parseIso(match[4], sign),
                d : parseIso(match[5], sign),
                h : parseIso(match[6], sign),
                m : parseIso(match[7], sign),
                s : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    createDuration.fn = Duration.prototype;
    createDuration.invalid = createInvalid$1;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return {milliseconds: 0, months: 0};
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
                'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = createDuration(val, period);
            addSubtract(this, dur, direction);
            return this;
        };
    }

    function addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (months) {
            setMonth(mom, get(mom, 'Month') + months * isAdding);
        }
        if (days) {
            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
        }
        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (updateOffset) {
            hooks.updateOffset(mom, days || months);
        }
    }

    var add      = createAdder(1, 'add');
    var subtract = createAdder(-1, 'subtract');

    function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, 'days', true);
        return diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
    }

    function calendar$1 (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            format = hooks.calendarFormat(this, sod) || 'sameElse';

        var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

        return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween (from, to, units, inclusivity) {
        inclusivity = inclusivity || '()';
        return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
            (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
    }

    function isSame (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
        }
    }

    function isSameOrAfter (input, units) {
        return this.isSame(input, units) || this.isAfter(input,units);
    }

    function isSameOrBefore (input, units) {
        return this.isSame(input, units) || this.isBefore(input,units);
    }

    function diff (input, units, asFloat) {
        var that,
            zoneDelta,
            output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        switch (units) {
            case 'year': output = monthDiff(this, that) / 12; break;
            case 'month': output = monthDiff(this, that); break;
            case 'quarter': output = monthDiff(this, that) / 3; break;
            case 'second': output = (this - that) / 1e3; break; // 1000
            case 'minute': output = (this - that) / 6e4; break; // 1000 * 60
            case 'hour': output = (this - that) / 36e5; break; // 1000 * 60 * 60
            case 'day': output = (this - that - zoneDelta) / 864e5; break; // 1000 * 60 * 60 * 24, negate dst
            case 'week': output = (this - that - zoneDelta) / 6048e5; break; // 1000 * 60 * 60 * 24 * 7, negate dst
            default: output = this - that;
        }

        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function toISOString(keepOffset) {
        if (!this.isValid()) {
            return null;
        }
        var utc = keepOffset !== true;
        var m = utc ? this.clone().utc() : this;
        if (m.year() < 0 || m.year() > 9999) {
            return formatMoment(m, utc ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ');
        }
        if (isFunction(Date.prototype.toISOString)) {
            // native implementation is ~50x faster, use it when we can
            if (utc) {
                return this.toDate().toISOString();
            } else {
                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000).toISOString().replace('Z', formatMoment(m, 'Z'));
            }
        }
        return formatMoment(m, utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ');
    }

    /**
     * Return a human readable representation of a moment that can
     * also be evaluated to get a new moment which is the same
     *
     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
     */
    function inspect () {
        if (!this.isValid()) {
            return 'moment.invalid(/* ' + this._i + ' */)';
        }
        var func = 'moment';
        var zone = '';
        if (!this.isLocal()) {
            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
            zone = 'Z';
        }
        var prefix = '[' + func + '("]';
        var year = (0 <= this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
        var datetime = '-MM-DD[T]HH:mm:ss.SSS';
        var suffix = zone + '[")]';

        return this.format(prefix + year + datetime + suffix);
    }

    function format (inputString) {
        if (!inputString) {
            inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 createLocal(time).isValid())) {
            return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow (withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 createLocal(time).isValid())) {
            return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow (withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'quarter':
            case 'month':
                this.date(1);
                /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
            case 'date':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }

        // 'date' is an alias for 'day', so it should be considered as such.
        if (units === 'date') {
            units = 'day';
        }

        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function valueOf () {
        return this._d.valueOf() - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate () {
        return new Date(this.valueOf());
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function toJSON () {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function isValid$2 () {
        return isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PRIORITY

    addUnitPriority('weekYear', 1);
    addUnitPriority('isoWeekYear', 1);


    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input,
                this.week(),
                this.weekday(),
                this.localeData()._week.dow,
                this.localeData()._week.doy);
    }

    function getSetISOWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input, this.isoWeek(), this.isoWeekday(), 1, 4);
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PRIORITY

    addUnitPriority('quarter', 7);

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PRIORITY
    addUnitPriority('date', 9);

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        // TODO: Remove "ordinalParse" fallback in next major release.
        return isStrict ?
          (locale._dayOfMonthOrdinalParse || locale._ordinalParse) :
          locale._dayOfMonthOrdinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0]);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PRIORITY
    addUnitPriority('dayOfYear', 4);

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PRIORITY

    addUnitPriority('minute', 14);

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PRIORITY

    addUnitPriority('second', 15);

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PRIORITY

    addUnitPriority('millisecond', 16);

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var proto = Moment.prototype;

    proto.add               = add;
    proto.calendar          = calendar$1;
    proto.clone             = clone;
    proto.diff              = diff;
    proto.endOf             = endOf;
    proto.format            = format;
    proto.from              = from;
    proto.fromNow           = fromNow;
    proto.to                = to;
    proto.toNow             = toNow;
    proto.get               = stringGet;
    proto.invalidAt         = invalidAt;
    proto.isAfter           = isAfter;
    proto.isBefore          = isBefore;
    proto.isBetween         = isBetween;
    proto.isSame            = isSame;
    proto.isSameOrAfter     = isSameOrAfter;
    proto.isSameOrBefore    = isSameOrBefore;
    proto.isValid           = isValid$2;
    proto.lang              = lang;
    proto.locale            = locale;
    proto.localeData        = localeData;
    proto.max               = prototypeMax;
    proto.min               = prototypeMin;
    proto.parsingFlags      = parsingFlags;
    proto.set               = stringSet;
    proto.startOf           = startOf;
    proto.subtract          = subtract;
    proto.toArray           = toArray;
    proto.toObject          = toObject;
    proto.toDate            = toDate;
    proto.toISOString       = toISOString;
    proto.inspect           = inspect;
    proto.toJSON            = toJSON;
    proto.toString          = toString;
    proto.unix              = unix;
    proto.valueOf           = valueOf;
    proto.creationData      = creationData;
    proto.year       = getSetYear;
    proto.isLeapYear = getIsLeapYear;
    proto.weekYear    = getSetWeekYear;
    proto.isoWeekYear = getSetISOWeekYear;
    proto.quarter = proto.quarters = getSetQuarter;
    proto.month       = getSetMonth;
    proto.daysInMonth = getDaysInMonth;
    proto.week           = proto.weeks        = getSetWeek;
    proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
    proto.weeksInYear    = getWeeksInYear;
    proto.isoWeeksInYear = getISOWeeksInYear;
    proto.date       = getSetDayOfMonth;
    proto.day        = proto.days             = getSetDayOfWeek;
    proto.weekday    = getSetLocaleDayOfWeek;
    proto.isoWeekday = getSetISODayOfWeek;
    proto.dayOfYear  = getSetDayOfYear;
    proto.hour = proto.hours = getSetHour;
    proto.minute = proto.minutes = getSetMinute;
    proto.second = proto.seconds = getSetSecond;
    proto.millisecond = proto.milliseconds = getSetMillisecond;
    proto.utcOffset            = getSetOffset;
    proto.utc                  = setOffsetToUTC;
    proto.local                = setOffsetToLocal;
    proto.parseZone            = setOffsetToParsedOffset;
    proto.hasAlignedHourOffset = hasAlignedHourOffset;
    proto.isDST                = isDaylightSavingTime;
    proto.isLocal              = isLocal;
    proto.isUtcOffset          = isUtcOffset;
    proto.isUtc                = isUtc;
    proto.isUTC                = isUtc;
    proto.zoneAbbr = getZoneAbbr;
    proto.zoneName = getZoneName;
    proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
    proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

    function createUnix (input) {
        return createLocal(input * 1000);
    }

    function createInZone () {
        return createLocal.apply(null, arguments).parseZone();
    }

    function preParsePostFormat (string) {
        return string;
    }

    var proto$1 = Locale.prototype;

    proto$1.calendar        = calendar;
    proto$1.longDateFormat  = longDateFormat;
    proto$1.invalidDate     = invalidDate;
    proto$1.ordinal         = ordinal;
    proto$1.preparse        = preParsePostFormat;
    proto$1.postformat      = preParsePostFormat;
    proto$1.relativeTime    = relativeTime;
    proto$1.pastFuture      = pastFuture;
    proto$1.set             = set;

    proto$1.months            =        localeMonths;
    proto$1.monthsShort       =        localeMonthsShort;
    proto$1.monthsParse       =        localeMonthsParse;
    proto$1.monthsRegex       = monthsRegex;
    proto$1.monthsShortRegex  = monthsShortRegex;
    proto$1.week = localeWeek;
    proto$1.firstDayOfYear = localeFirstDayOfYear;
    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

    proto$1.weekdays       =        localeWeekdays;
    proto$1.weekdaysMin    =        localeWeekdaysMin;
    proto$1.weekdaysShort  =        localeWeekdaysShort;
    proto$1.weekdaysParse  =        localeWeekdaysParse;

    proto$1.weekdaysRegex       =        weekdaysRegex;
    proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
    proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

    proto$1.isPM = localeIsPM;
    proto$1.meridiem = localeMeridiem;

    function get$1 (format, index, field, setter) {
        var locale = getLocale();
        var utc = createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl (format, index, field) {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return get$1(format, index, field, 'month');
        }

        var i;
        var out = [];
        for (i = 0; i < 12; i++) {
            out[i] = get$1(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl (localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = getLocale(),
            shift = localeSorted ? locale._week.dow : 0;

        if (index != null) {
            return get$1(format, (index + shift) % 7, field, 'day');
        }

        var i;
        var out = [];
        for (i = 0; i < 7; i++) {
            out[i] = get$1(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function listMonths (format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function listMonthsShort (format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function listWeekdays (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function listWeekdaysShort (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function listWeekdaysMin (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    getSetGlobalLocale('en', {
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports

    hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
    hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

    var mathAbs = Math.abs;

    function abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function addSubtract$1 (duration, input, value, direction) {
        var other = createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function add$1 (input, value) {
        return addSubtract$1(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function subtract$1 (input, value) {
        return addSubtract$1(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        if (!this.isValid()) {
            return NaN;
        }
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function valueOf$1 () {
        if (!this.isValid()) {
            return NaN;
        }
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function clone$1 () {
        return createDuration(this);
    }

    function get$2 (units) {
        units = normalizeUnits(units);
        return this.isValid() ? this[units + 's']() : NaN;
    }

    function makeGetter(name) {
        return function () {
            return this.isValid() ? this._data[name] : NaN;
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        ss: 44,         // a few seconds to seconds
        s : 45,         // seconds to minute
        m : 45,         // minutes to hour
        h : 22,         // hours to day
        d : 26,         // days to month
        M : 11          // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
        var duration = createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds <= thresholds.ss && ['s', seconds]  ||
                seconds < thresholds.s   && ['ss', seconds] ||
                minutes <= 1             && ['m']           ||
                minutes < thresholds.m   && ['mm', minutes] ||
                hours   <= 1             && ['h']           ||
                hours   < thresholds.h   && ['hh', hours]   ||
                days    <= 1             && ['d']           ||
                days    < thresholds.d   && ['dd', days]    ||
                months  <= 1             && ['M']           ||
                months  < thresholds.M   && ['MM', months]  ||
                years   <= 1             && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set the rounding function for relative time strings
    function getSetRelativeTimeRounding (roundingFunction) {
        if (roundingFunction === undefined) {
            return round;
        }
        if (typeof(roundingFunction) === 'function') {
            round = roundingFunction;
            return true;
        }
        return false;
    }

    // This function allows you to set a threshold for relative time strings
    function getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        if (threshold === 's') {
            thresholds.ss = limit - 1;
        }
        return true;
    }

    function humanize (withSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var locale = this.localeData();
        var output = relativeTime$1(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var abs$1 = Math.abs;

    function sign(x) {
        return ((x > 0) - (x < 0)) || +x;
    }

    function toISOString$1() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var seconds = abs$1(this._milliseconds) / 1000;
        var days         = abs$1(this._days);
        var months       = abs$1(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        var totalSign = total < 0 ? '-' : '';
        var ymSign = sign(this._months) !== sign(total) ? '-' : '';
        var daysSign = sign(this._days) !== sign(total) ? '-' : '';
        var hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

        return totalSign + 'P' +
            (Y ? ymSign + Y + 'Y' : '') +
            (M ? ymSign + M + 'M' : '') +
            (D ? daysSign + D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? hmsSign + h + 'H' : '') +
            (m ? hmsSign + m + 'M' : '') +
            (s ? hmsSign + s + 'S' : '');
    }

    var proto$2 = Duration.prototype;

    proto$2.isValid        = isValid$1;
    proto$2.abs            = abs;
    proto$2.add            = add$1;
    proto$2.subtract       = subtract$1;
    proto$2.as             = as;
    proto$2.asMilliseconds = asMilliseconds;
    proto$2.asSeconds      = asSeconds;
    proto$2.asMinutes      = asMinutes;
    proto$2.asHours        = asHours;
    proto$2.asDays         = asDays;
    proto$2.asWeeks        = asWeeks;
    proto$2.asMonths       = asMonths;
    proto$2.asYears        = asYears;
    proto$2.valueOf        = valueOf$1;
    proto$2._bubble        = bubble;
    proto$2.clone          = clone$1;
    proto$2.get            = get$2;
    proto$2.milliseconds   = milliseconds;
    proto$2.seconds        = seconds;
    proto$2.minutes        = minutes;
    proto$2.hours          = hours;
    proto$2.days           = days;
    proto$2.weeks          = weeks;
    proto$2.months         = months;
    proto$2.years          = years;
    proto$2.humanize       = humanize;
    proto$2.toISOString    = toISOString$1;
    proto$2.toString       = toISOString$1;
    proto$2.toJSON         = toISOString$1;
    proto$2.locale         = locale;
    proto$2.localeData     = localeData;

    proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
    proto$2.lang = lang;

    // Side effect imports

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    hooks.version = '2.22.2';

    setHookCallback(createLocal);

    hooks.fn                    = proto;
    hooks.min                   = min;
    hooks.max                   = max;
    hooks.now                   = now;
    hooks.utc                   = createUTC;
    hooks.unix                  = createUnix;
    hooks.months                = listMonths;
    hooks.isDate                = isDate;
    hooks.locale                = getSetGlobalLocale;
    hooks.invalid               = createInvalid;
    hooks.duration              = createDuration;
    hooks.isMoment              = isMoment;
    hooks.weekdays              = listWeekdays;
    hooks.parseZone             = createInZone;
    hooks.localeData            = getLocale;
    hooks.isDuration            = isDuration;
    hooks.monthsShort           = listMonthsShort;
    hooks.weekdaysMin           = listWeekdaysMin;
    hooks.defineLocale          = defineLocale;
    hooks.updateLocale          = updateLocale;
    hooks.locales               = listLocales;
    hooks.weekdaysShort         = listWeekdaysShort;
    hooks.normalizeUnits        = normalizeUnits;
    hooks.relativeTimeRounding  = getSetRelativeTimeRounding;
    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
    hooks.calendarFormat        = getCalendarFormat;
    hooks.prototype             = proto;

    // currently HTML5 input type only supports 24-hour formats
    hooks.HTML5_FMT = {
        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm',             // <input type="datetime-local" />
        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss',  // <input type="datetime-local" step="1" />
        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS',   // <input type="datetime-local" step="0.001" />
        DATE: 'YYYY-MM-DD',                             // <input type="date" />
        TIME: 'HH:mm',                                  // <input type="time" />
        TIME_SECONDS: 'HH:mm:ss',                       // <input type="time" step="1" />
        TIME_MS: 'HH:mm:ss.SSS',                        // <input type="time" step="0.001" />
        WEEK: 'YYYY-[W]WW',                             // <input type="week" />
        MONTH: 'YYYY-MM'                                // <input type="month" />
    };

    return hooks;

})));

},{}],2:[function(require,module,exports){
/* smoothscroll v0.4.0 - 2018 - Dustan Kasten, Jeremias Menichelli - MIT License */
(function () {
  'use strict';

  // polyfill
  function polyfill() {
    // aliases
    var w = window;
    var d = document;

    // return if scroll behavior is supported and polyfill is not forced
    if (
      'scrollBehavior' in d.documentElement.style &&
      w.__forceSmoothScrollPolyfill__ !== true
    ) {
      return;
    }

    // globals
    var Element = w.HTMLElement || w.Element;
    var SCROLL_TIME = 468;

    // object gathering original scroll methods
    var original = {
      scroll: w.scroll || w.scrollTo,
      scrollBy: w.scrollBy,
      elementScroll: Element.prototype.scroll || scrollElement,
      scrollIntoView: Element.prototype.scrollIntoView
    };

    // define timing method
    var now =
      w.performance && w.performance.now
        ? w.performance.now.bind(w.performance)
        : Date.now;

    /**
     * indicates if a the current browser is made by Microsoft
     * @method isMicrosoftBrowser
     * @param {String} userAgent
     * @returns {Boolean}
     */
    function isMicrosoftBrowser(userAgent) {
      var userAgentPatterns = ['MSIE ', 'Trident/', 'Edge/'];

      return new RegExp(userAgentPatterns.join('|')).test(userAgent);
    }

    /*
     * IE has rounding bug rounding down clientHeight and clientWidth and
     * rounding up scrollHeight and scrollWidth causing false positives
     * on hasScrollableSpace
     */
    var ROUNDING_TOLERANCE = isMicrosoftBrowser(w.navigator.userAgent) ? 1 : 0;

    /**
     * changes scroll position inside an element
     * @method scrollElement
     * @param {Number} x
     * @param {Number} y
     * @returns {undefined}
     */
    function scrollElement(x, y) {
      this.scrollLeft = x;
      this.scrollTop = y;
    }

    /**
     * returns result of applying ease math function to a number
     * @method ease
     * @param {Number} k
     * @returns {Number}
     */
    function ease(k) {
      return 0.5 * (1 - Math.cos(Math.PI * k));
    }

    /**
     * indicates if a smooth behavior should be applied
     * @method shouldBailOut
     * @param {Number|Object} firstArg
     * @returns {Boolean}
     */
    function shouldBailOut(firstArg) {
      if (
        firstArg === null ||
        typeof firstArg !== 'object' ||
        firstArg.behavior === undefined ||
        firstArg.behavior === 'auto' ||
        firstArg.behavior === 'instant'
      ) {
        // first argument is not an object/null
        // or behavior is auto, instant or undefined
        return true;
      }

      if (typeof firstArg === 'object' && firstArg.behavior === 'smooth') {
        // first argument is an object and behavior is smooth
        return false;
      }

      // throw error when behavior is not supported
      throw new TypeError(
        'behavior member of ScrollOptions ' +
          firstArg.behavior +
          ' is not a valid value for enumeration ScrollBehavior.'
      );
    }

    /**
     * indicates if an element has scrollable space in the provided axis
     * @method hasScrollableSpace
     * @param {Node} el
     * @param {String} axis
     * @returns {Boolean}
     */
    function hasScrollableSpace(el, axis) {
      if (axis === 'Y') {
        return el.clientHeight + ROUNDING_TOLERANCE < el.scrollHeight;
      }

      if (axis === 'X') {
        return el.clientWidth + ROUNDING_TOLERANCE < el.scrollWidth;
      }
    }

    /**
     * indicates if an element has a scrollable overflow property in the axis
     * @method canOverflow
     * @param {Node} el
     * @param {String} axis
     * @returns {Boolean}
     */
    function canOverflow(el, axis) {
      var overflowValue = w.getComputedStyle(el, null)['overflow' + axis];

      return overflowValue === 'auto' || overflowValue === 'scroll';
    }

    /**
     * indicates if an element can be scrolled in either axis
     * @method isScrollable
     * @param {Node} el
     * @param {String} axis
     * @returns {Boolean}
     */
    function isScrollable(el) {
      var isScrollableY = hasScrollableSpace(el, 'Y') && canOverflow(el, 'Y');
      var isScrollableX = hasScrollableSpace(el, 'X') && canOverflow(el, 'X');

      return isScrollableY || isScrollableX;
    }

    /**
     * finds scrollable parent of an element
     * @method findScrollableParent
     * @param {Node} el
     * @returns {Node} el
     */
    function findScrollableParent(el) {
      var isBody;

      do {
        el = el.parentNode;

        isBody = el === d.body;
      } while (isBody === false && isScrollable(el) === false);

      isBody = null;

      return el;
    }

    /**
     * self invoked function that, given a context, steps through scrolling
     * @method step
     * @param {Object} context
     * @returns {undefined}
     */
    function step(context) {
      var time = now();
      var value;
      var currentX;
      var currentY;
      var elapsed = (time - context.startTime) / SCROLL_TIME;

      // avoid elapsed times higher than one
      elapsed = elapsed > 1 ? 1 : elapsed;

      // apply easing to elapsed time
      value = ease(elapsed);

      currentX = context.startX + (context.x - context.startX) * value;
      currentY = context.startY + (context.y - context.startY) * value;

      context.method.call(context.scrollable, currentX, currentY);

      // scroll more if we have not reached our destination
      if (currentX !== context.x || currentY !== context.y) {
        w.requestAnimationFrame(step.bind(w, context));
      }
    }

    /**
     * scrolls window or element with a smooth behavior
     * @method smoothScroll
     * @param {Object|Node} el
     * @param {Number} x
     * @param {Number} y
     * @returns {undefined}
     */
    function smoothScroll(el, x, y) {
      var scrollable;
      var startX;
      var startY;
      var method;
      var startTime = now();

      // define scroll context
      if (el === d.body) {
        scrollable = w;
        startX = w.scrollX || w.pageXOffset;
        startY = w.scrollY || w.pageYOffset;
        method = original.scroll;
      } else {
        scrollable = el;
        startX = el.scrollLeft;
        startY = el.scrollTop;
        method = scrollElement;
      }

      // scroll looping over a frame
      step({
        scrollable: scrollable,
        method: method,
        startTime: startTime,
        startX: startX,
        startY: startY,
        x: x,
        y: y
      });
    }

    // ORIGINAL METHODS OVERRIDES
    // w.scroll and w.scrollTo
    w.scroll = w.scrollTo = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        original.scroll.call(
          w,
          arguments[0].left !== undefined
            ? arguments[0].left
            : typeof arguments[0] !== 'object'
              ? arguments[0]
              : w.scrollX || w.pageXOffset,
          // use top prop, second argument if present or fallback to scrollY
          arguments[0].top !== undefined
            ? arguments[0].top
            : arguments[1] !== undefined
              ? arguments[1]
              : w.scrollY || w.pageYOffset
        );

        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        w,
        d.body,
        arguments[0].left !== undefined
          ? ~~arguments[0].left
          : w.scrollX || w.pageXOffset,
        arguments[0].top !== undefined
          ? ~~arguments[0].top
          : w.scrollY || w.pageYOffset
      );
    };

    // w.scrollBy
    w.scrollBy = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0])) {
        original.scrollBy.call(
          w,
          arguments[0].left !== undefined
            ? arguments[0].left
            : typeof arguments[0] !== 'object' ? arguments[0] : 0,
          arguments[0].top !== undefined
            ? arguments[0].top
            : arguments[1] !== undefined ? arguments[1] : 0
        );

        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        w,
        d.body,
        ~~arguments[0].left + (w.scrollX || w.pageXOffset),
        ~~arguments[0].top + (w.scrollY || w.pageYOffset)
      );
    };

    // Element.prototype.scroll and Element.prototype.scrollTo
    Element.prototype.scroll = Element.prototype.scrollTo = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        // if one number is passed, throw error to match Firefox implementation
        if (typeof arguments[0] === 'number' && arguments[1] === undefined) {
          throw new SyntaxError('Value could not be converted');
        }

        original.elementScroll.call(
          this,
          // use left prop, first number argument or fallback to scrollLeft
          arguments[0].left !== undefined
            ? ~~arguments[0].left
            : typeof arguments[0] !== 'object' ? ~~arguments[0] : this.scrollLeft,
          // use top prop, second argument or fallback to scrollTop
          arguments[0].top !== undefined
            ? ~~arguments[0].top
            : arguments[1] !== undefined ? ~~arguments[1] : this.scrollTop
        );

        return;
      }

      var left = arguments[0].left;
      var top = arguments[0].top;

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        this,
        this,
        typeof left === 'undefined' ? this.scrollLeft : ~~left,
        typeof top === 'undefined' ? this.scrollTop : ~~top
      );
    };

    // Element.prototype.scrollBy
    Element.prototype.scrollBy = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        original.elementScroll.call(
          this,
          arguments[0].left !== undefined
            ? ~~arguments[0].left + this.scrollLeft
            : ~~arguments[0] + this.scrollLeft,
          arguments[0].top !== undefined
            ? ~~arguments[0].top + this.scrollTop
            : ~~arguments[1] + this.scrollTop
        );

        return;
      }

      this.scroll({
        left: ~~arguments[0].left + this.scrollLeft,
        top: ~~arguments[0].top + this.scrollTop,
        behavior: arguments[0].behavior
      });
    };

    // Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = function() {
      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        original.scrollIntoView.call(
          this,
          arguments[0] === undefined ? true : arguments[0]
        );

        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      var scrollableParent = findScrollableParent(this);
      var parentRects = scrollableParent.getBoundingClientRect();
      var clientRects = this.getBoundingClientRect();

      if (scrollableParent !== d.body) {
        // reveal element inside parent
        smoothScroll.call(
          this,
          scrollableParent,
          scrollableParent.scrollLeft + clientRects.left - parentRects.left,
          scrollableParent.scrollTop + clientRects.top - parentRects.top
        );

        // reveal parent in viewport unless is fixed
        if (w.getComputedStyle(scrollableParent).position !== 'fixed') {
          w.scrollBy({
            left: parentRects.left,
            top: parentRects.top,
            behavior: 'smooth'
          });
        }
      } else {
        // reveal element in viewport
        w.scrollBy({
          left: clientRects.left,
          top: clientRects.top,
          behavior: 'smooth'
        });
      }
    };
  }

  if (typeof exports === 'object' && typeof module !== 'undefined') {
    // commonjs
    module.exports = { polyfill: polyfill };
  } else {
    // global
    polyfill();
  }

}());

},{}],3:[function(require,module,exports){
module.exports=[
  {
    "name": "Agence FAR",
    "address": "48 AV des forces armee royales",
    "city": "casablanca",
    "type": "agence",
    "coords": {
      "email": "jhondoe@gmail.com",
      "phone": "0618661866",
      "fax": "0618661866",
      "gps": {
        "lang": 33.5519556,
        "lat": -7.6913644
      }
    },
    "extension": {
      "name": "Al-bouchra Casanearshore",
      "address": "48 AV des forces armee royales"
    },
    "timetable": {
      "monday": "08:05-12:05 | 14:00-17:15",
      "tuesday": "08:05-12:05 | 14:00-17:15",
      "wednesday": "08:05-12:05 | 14:00-17:15",
      "thursday": "08:05-12:05 | 14:00-17:15",
      "friday": "08:05-12:05 | 14:00-17:15",
      "saturday": "08:05-12:05 | 14:00-17:15",
      "sunday": "08:05-12:05 | 14:00-17:15"
    }
  },
  {
    "name": "Agence SEIZE (16) NOVEMBRE",
    "address": "3 Place du 16 novembre",
    "city": "casablanca",
    "type": "agence",
    "coords": {
      "email": "jhondoe@gmail.com",
      "phone": "0618661866",
      "fax": "0618661866",
      "gps": {
        "lang": 33.561111,
        "lat": -7.6487924
      }
    },
    "extension": {
      "name": "Al-bouchra Casanearshore",
      "address": "48 AV des forces armee royales"
    },
    "timetable": {
      "monday": "08:05-12:05 | 14:00-17:15",
      "tuesday": "08:05-12:05 | 14:00-17:15",
      "wednesday": "08:05-12:05 | 14:00-17:15",
      "thursday": "08:05-12:05 | 14:00-17:15",
      "friday": "08:05-12:05 | 14:00-17:15",
      "saturday": "08:05-12:05 | 14:00-17:15",
      "sunday": "08:05-12:05 | 14:00-17:15"
    }
  },
  {
    "name": "Agence FAR",
    "address": "Agence ZERKTOUNI",
    "city": "casablanca",
    "type": "centres-affaires",
    "coords": {
      "email": "jhondoe@gmail.com",
      "phone": "0618661866",
      "fax": "0618661866",
      "gps": {
        "lang": 33.5845672,
        "lat": -7.6299096
      }
    },
    "extension": {
      "name": "Al-bouchra Casanearshore",
      "address": "48 AV des forces armee royales"
    },
    "timetable": {
      "monday": "08:05-12:05 | 14:00-17:15",
      "tuesday": "08:05-12:05 | 14:00-17:15",
      "wednesday": "08:05-12:05 | 14:00-17:15",
      "thursday": "08:05-12:05 | 14:00-17:15",
      "friday": "08:05-12:05 | 14:00-17:15",
      "saturday": "08:05-12:05 | 14:00-17:15",
      "sunday": "08:05-12:05 | 14:00-17:15"
    }
  },
  {
    "name": "Agence ROMANDIE",
    "address": "3 et 4,Imm Romandie II boulvard Bir anzarane",
    "city": "casablanca",
    "type": "agence",
    "coords": {
      "email": "jhondoe@gmail.com",
      "phone": "0618661866",
      "fax": "0618661866",
      "gps": {
        "lang": 33.5722678,
        "lat": -7.629223
      }
    },
    "extension": {
      "name": "Al-bouchra Casanearshore",
      "address": "48 AV des forces armee royales"
    },
    "timetable": {
      "monday": "08:05-12:05 | 14:00-17:15",
      "tuesday": "08:05-12:05 | 14:00-17:15",
      "wednesday": "08:05-12:05 | 14:00-17:15",
      "thursday": "08:05-12:05 | 14:00-17:15",
      "friday": "08:05-12:05 | 14:00-17:15",
      "saturday": "08:05-12:05 | 14:00-17:15",
      "sunday": "08:05-12:05 | 14:00-17:15"
    }
  },
  {
    "name": "Agence HAJ OMAR ABDELJALIL",
    "address": "KM 7, 3 Route de Rabat Ain sbaa",
    "city": "casablanca",
    "type": "reseau-etranger",
    "coords": {
      "email": "jhondoe@gmail.com",
      "phone": "0618661866",
      "fax": "0618661866",
      "gps": {
        "lang": 33.5810336,
        "lat": -7.5814015
      }
    },
    "extension": {
      "name": "Al-bouchra Casanearshore",
      "address": "48 AV des forces armee royales"
    },
    "timetable": {
      "monday": "08:05-12:05 | 14:00-17:15",
      "tuesday": "08:05-12:05 | 14:00-17:15",
      "wednesday": "08:05-12:05 | 14:00-17:15",
      "thursday": "08:05-12:05 | 14:00-17:15",
      "friday": "08:05-12:05 | 14:00-17:15",
      "saturday": "08:05-12:05 | 14:00-17:15",
      "sunday": "08:05-12:05 | 14:00-17:15"
    }
  },
  {
    "name": "Agence PORTE D’ANFA",
    "address": "N° 4 ANG BD D’anfa et rue moulay rachid BP 245",
    "city": "casablanca",
    "type": "agence",
    "coords": {
      "email": "jhondoe@gmail.com",
      "phone": "0618661866",
      "fax": "0618661866",
      "gps": {
        "lang": 33.57309,
        "lat": -7.6286979
      }
    },
    "extension": {
      "name": "Al-bouchra Casanearshore",
      "address": "48 AV des forces armee royales"
    },
    "timetable": {
      "monday": "08:05-12:05 | 14:00-17:15",
      "tuesday": "08:05-12:05 | 14:00-17:15",
      "wednesday": "08:05-12:05 | 14:00-17:15",
      "thursday": "08:05-12:05 | 14:00-17:15",
      "friday": "08:05-12:05 | 14:00-17:15",
      "saturday": "08:05-12:05 | 14:00-17:15",
      "sunday": "08:05-12:05 | 14:00-17:15"
    }
  },
  {
    "name": "Agence Omar",
    "address": "3 et 4,Imm Romandie II boulvard Bir anzarane",
    "city": "casablanca",
    "type": "gab",
    "coords": {
      "email": "jhondoe@gmail.com",
      "phone": "0618661866",
      "fax": "0618661866",
      "gps": {
        "lang": 33.5617623,
        "lat": -7.6248136
      }
    },
    "extension": {
      "name": "Al-bouchra Casanearshore",
      "address": "48 AV des forces armee royales"
    },
    "timetable": {
      "monday": "08:05-12:05 | 14:00-17:15",
      "tuesday": "08:05-12:05 | 14:00-17:15",
      "wednesday": "08:05-12:05 | 14:00-17:15",
      "thursday": "08:05-12:05 | 14:00-17:15",
      "friday": "08:05-12:05 | 14:00-17:15",
      "saturday": "08:05-12:05 | 14:00-17:15",
      "sunday": "08:05-12:05 | 14:00-17:15"
    }
  },
  {
    "name": "Agence HAJ OMAR ",
    "address": "KM 7, 3 Route de Rabat Ain sbaa",
    "city": "rabat",
    "type": "gab",
    "coords": {
      "email": "jhondoe@gmail.com",
      "phone": "0618661866",
      "fax": "0618661866",
      "gps": {
        "lang": 33.5856297,
        "lat": -7.6216577
      }
    },
    "extension": {
      "name": "Al-bouchra Casanearshore",
      "address": "48 AV des forces armee royales"
    },
    "timetable": {
      "monday": "08:05-12:05 | 14:00-17:15",
      "tuesday": "08:05-12:05 | 14:00-17:15",
      "wednesday": "08:05-12:05 | 14:00-17:15",
      "thursday": "08:05-12:05 | 14:00-17:15",
      "friday": "08:05-12:05 | 14:00-17:15",
      "saturday": "08:05-12:05 | 14:00-17:15",
      "sunday": "08:05-12:05 | 14:00-17:15"
    }
  },
  {
    "name": "Agence PORTE Rabat",
    "address": "N° 4 ANG BD D’anfa et rue moulay rachid BP 245",
    "city": "tanger",
    "type": "centres-affaires",
    "coords": {
      "email": "jhondoe@gmail.com",
      "phone": "0618661866",
      "fax": "0618661866",
      "gps": {
        "lang": 33.5955389,
        "lat": -7.6459343
      }
    },
    "timetable": {
      "monday": "08:05-12:05 | 14:00-17:15",
      "tuesday": "08:05-12:05 | 14:00-17:15",
      "wednesday": "08:05-12:05 | 14:00-17:15",
      "thursday": "08:05-12:05 | 14:00-17:15",
      "friday": "08:05-12:05 | 14:00-17:15",
      "saturday": "08:05-12:05 | 14:00-17:15",
      "sunday": "08:05-12:05 | 14:00-17:15"
    },
    "extension": {
      "name": "Al-bouchra Casanearshore",
      "address": "48 AV des forces armee royales"
    }
  }
]

},{}],4:[function(require,module,exports){
'use strict';

var _index = require('../../components/select-filter/index.js');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('../../components/top-header/index.js');

var _index4 = _interopRequireDefault(_index3);

var _index5 = require('../../components/header/index.js');

var _index6 = _interopRequireDefault(_index5);

var _index7 = require('../../components/footer/index.js');

var _index8 = _interopRequireDefault(_index7);

var _cardSlider = require('../../components/card/card-slider.js');

var _cardSlider2 = _interopRequireDefault(_cardSlider);

var _dateSlider = require('../../components/date-slider/date-slider.js');

var _dateSlider2 = _interopRequireDefault(_dateSlider);

var _index9 = require('../../components/logo-slider/index.js');

var _index10 = _interopRequireDefault(_index9);

var _index11 = require('../../components/finance/index.js');

var _index12 = _interopRequireDefault(_index11);

var _filter = require('../../components/finance/filter.js');

var _filter2 = _interopRequireDefault(_filter);

var _index13 = require('../../components/nos-banques/index.js');

var _index14 = _interopRequireDefault(_index13);

var _index15 = require('../../components/home-slider/index.js');

var _index16 = _interopRequireDefault(_index15);

var _index17 = require('../../components/besoin-aide/index.js');

var _index18 = _interopRequireDefault(_index17);

var _index19 = require('../../components/swipebox/index.js');

var _index20 = _interopRequireDefault(_index19);

var _index21 = require('../../components/article-slider/index.js');

var _index22 = _interopRequireDefault(_index21);

var _cardRapport = require('../../components/card/card-rapport/card-rapport.js');

var _cardRapport2 = _interopRequireDefault(_cardRapport);

var _index23 = require('../../components/popup-search/index.js');

var _index24 = _interopRequireDefault(_index23);

var _filter3 = require('../../components/popup-search/filter.js');

var _filter4 = _interopRequireDefault(_filter3);

var _index25 = require('../../components/popup-video/index.js');

var _index26 = _interopRequireDefault(_index25);

var _index27 = require('../../components/actualite-slider/index.js');

var _index28 = _interopRequireDefault(_index27);

var _index29 = require('../../components/pub-slider/index.js');

var _index30 = _interopRequireDefault(_index29);

var _formValidation = require('../../components/form/form-validation.js');

var _formValidation2 = _interopRequireDefault(_formValidation);

var _formUpload = require('../../components/form/form-upload.js');

var _formUpload2 = _interopRequireDefault(_formUpload);

var _cardActualites = require('../../components/card/card-actualites.js');

var _cardActualites2 = _interopRequireDefault(_cardActualites);

var _cardHistoire = require('../../components/card/card-histoire.js');

var _cardHistoire2 = _interopRequireDefault(_cardHistoire);

var _index31 = require('../../components/appel-offres/index.js');

var _index32 = _interopRequireDefault(_index31);

var _index33 = require('../../components/map/index.js');

var _index34 = _interopRequireDefault(_index33);

var _index35 = require('../../components/timeline/index.js');

var _index36 = _interopRequireDefault(_index35);

var _index37 = require('../../components/map-control/index.js');

var _smoothscrollPolyfill = require('smoothscroll-polyfill');

var _smoothscrollPolyfill2 = _interopRequireDefault(_smoothscrollPolyfill);

var _index38 = require('../../components/actualites/index.js');

var _index39 = _interopRequireDefault(_index38);

var _index40 = require('../../components/mediacenter/index.js');

var _index41 = _interopRequireDefault(_index40);

var _index42 = require('../../components/communiques/index.js');

var _index43 = _interopRequireDefault(_index42);

var _index44 = require('../../components/result/index.js');

var _index45 = _interopRequireDefault(_index44);

var _index46 = require('../../components/media-gallery/index.js');

var _index47 = _interopRequireDefault(_index46);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$(document).ready(function () {
  _smoothscrollPolyfill2.default.polyfill();

  if (typeof NodeList.prototype.forEach !== 'function') {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

  if (!String.prototype.includes) {
    Array.prototype.includes = function (search, start) {
      if (typeof start !== 'number') {
        start = 0;
      }
      if (start + search.length > this.length) {
        return false;
      } else {
        return this.indexOf(search, start) !== -1;
      }
    };
  }

  (0, _index2.default)();
  (0, _index4.default)();
  (0, _index6.default)();
  (0, _index8.default)();
  (0, _cardSlider2.default)();
  (0, _filter2.default)();
  (0, _dateSlider2.default)();
  (0, _index10.default)();
  (0, _index12.default)();
  (0, _index14.default)();
  (0, _index16.default)();
  (0, _index18.default)();
  (0, _index20.default)();
  (0, _index22.default)();
  (0, _cardRapport2.default)();
  (0, _index24.default)();
  (0, _index26.default)();
  (0, _index28.default)();
  (0, _index30.default)();
  (0, _formValidation2.default)();
  (0, _formUpload2.default)();
  (0, _cardActualites2.default)();
  (0, _cardHistoire2.default)();
  (0, _index34.default)();
  (0, _index37.mapControl)();
  (0, _index37.toggleControl)();
  (0, _index36.default)();
  (0, _index39.default)();
  (0, _index32.default)();
  (0, _index41.default)();
  (0, _index43.default)();
  (0, _filter4.default)();
  (0, _index45.default)();
  (0, _index47.default)();
});

},{"../../components/actualite-slider/index.js":5,"../../components/actualites/index.js":6,"../../components/appel-offres/index.js":7,"../../components/article-slider/index.js":8,"../../components/besoin-aide/index.js":9,"../../components/card/card-actualites.js":10,"../../components/card/card-histoire.js":11,"../../components/card/card-rapport/card-rapport.js":12,"../../components/card/card-slider.js":13,"../../components/communiques/index.js":14,"../../components/date-slider/date-slider.js":16,"../../components/finance/filter.js":17,"../../components/finance/index.js":18,"../../components/footer/index.js":19,"../../components/form/form-upload.js":20,"../../components/form/form-validation.js":21,"../../components/header/index.js":22,"../../components/home-slider/index.js":23,"../../components/logo-slider/index.js":24,"../../components/map-control/index.js":25,"../../components/map/index.js":26,"../../components/media-gallery/index.js":27,"../../components/mediacenter/index.js":28,"../../components/nos-banques/index.js":29,"../../components/popup-search/filter.js":30,"../../components/popup-search/index.js":31,"../../components/popup-video/index.js":32,"../../components/pub-slider/index.js":33,"../../components/result/index.js":34,"../../components/select-filter/index.js":35,"../../components/swipebox/index.js":36,"../../components/timeline/index.js":37,"../../components/top-header/index.js":38,"smoothscroll-polyfill":2}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  if ($('.actualite-slider').length) {

    var rtl = $('html').attr('dir') == 'rtl';

    if ($(window).width() > 991) {
      articleSlider(0, rtl);
    } else {
      articleSlider(0, rtl);
    }

    $(window).on('resize', function () {
      if ($(window).width() > 991) {
        articleSlider(0, rtl);
      } else {
        articleSlider(0, rtl);
      }
    });
  }

  function articleSlider(stagePadding, rtl) {
    $('.actualite-slider.owl-carousel').owlCarousel({
      stagePadding: stagePadding,
      margin: 18,
      dots: true,
      nav: true,
      merge: true,
      loop: true,
      rtl: rtl,
      responsive: {
        0: {
          items: 1
        },
        992: {
          items: 3
        }
      }
    });
  }
};

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function () {
  var tagFilters = document.querySelectorAll('#actualite-filters a');
  var actualiteHolder = document.querySelector('#actualite-holder');
  var startDate = document.querySelector('.start');
  var endDate = document.querySelector('.end');
  var allFilterBtn = document.querySelector('#actualite-filter-all');

  if (tagFilters.length <= 0 || !actualiteHolder) return;

  var state = {
    filters: [],
    dateFilter: {
      from: '',
      to: ''
    },
    order: 'desc',
    max: 3,
    data: [{
      type: 'article-img',
      tags: ['RSE', 'FINANCE', 'ENTREPRENARIAT'],
      date: '21/07/2017',
      title: 'une ambiance festive et familiale que s’est déroulé',
      content: 'Le Groupe BCP, acteur panafricain de référence, et la Société FinaTncière Internationale (IFC)...',
      image: 'assets/img/actu-2.png'
    }, {
      type: 'annonce',
      tags: ['RSE'],
      date: '29/07/2017',
      content: 'A l\u2019occasion de la Journ\xE9e Internationale de la Femme, la <a href="https://twitter.com/hashtag/Banque_Populaire" target="_blank">#Banque_Populaire</a> pr\xE9sente \xE0 toutes les femmes ses v\u0153ux les plus sinc\xE8res de r\xE9ussite et de prosp\xE9rit\xE9. <a href="https://twitter.com/hashtag/8mars"  target="_blank">#8mars</a> <a href="https://twitter.com/hashtag/corpo"  target="_blank">#corpo</a>\n        '
    }, {
      type: 'article',
      tags: ['RSE', 'ENTREPRENARIAT'],
      date: '22/07/2017',
      title: 'une ambiance festive et familiale que s’est déroulé',
      content: 'Le Groupe BCP, acteur panafricain de référence, et la Société FinaTncière Internationale (IFC)...'
    }, {
      type: 'article',
      tags: ['RSE', 'DEVELOPPEMENT DURABLE'],
      date: '23/07/2017',
      title: 'une ambiance festive et familiale que s’est déroulé',
      content: 'Le Groupe BCP, acteur panafricain de référence, et la Société FinaTncière Internationale (IFC)...'
    }, {
      type: 'article',
      tags: ['RSE'],
      date: '21/07/2017',
      title: 'une ambiance festive et familiale que s’est déroulé',
      content: 'Le Groupe BCP, acteur panafricain de référence, et la Société FinaTncière Internationale (IFC)...'
    }, {
      type: 'article',
      tags: ['RSE', 'FINANCE'],
      date: '24/07/2017',
      title: 'une ambiance festive et familiale que s’est déroulé',
      content: 'Le Groupe BCP, acteur panafricain de référence, et la Société FinaTncière Internationale (IFC)...'
    }, {
      type: 'article-img',
      tags: ['RSE', 'FINANCE'],
      date: '25/07/2017',
      title: 'une ambiance festive et familiale que s’est déroulé',
      content: 'Le Groupe BCP, acteur panafricain de référence, et la Société FinaTncière Internationale (IFC)...',
      image: 'assets/img/actu-1.png'
    }, {
      type: 'article',
      tags: ['RSE'],
      date: '26/07/2017',
      title: 'une ambiance festive et familiale que s’est déroulé',
      content: 'Le Groupe BCP, acteur panafricain de référence, et la Société FinaTncière Internationale (IFC)...'
    }, {
      type: 'article',
      tags: ['RSE', 'FINANCE'],
      date: '21/07/2017',
      title: 'une ambiance festive et familiale que s’est déroulé',
      content: 'Le Groupe BCP, acteur panafricain de référence, et la Société FinaTncière Internationale (IFC)...'
    }, {
      type: 'article-img',
      tags: ['RSE', 'FINANCE'],
      date: '21/08/2017',
      title: 'une ambiance festive et familiale que s’est déroulé',
      content: 'Le Groupe BCP, acteur panafricain de référence, et la Société FinaTncière Internationale (IFC)...',
      image: 'assets/img/actu-1.png'
    }, {
      type: 'article',
      tags: ['RSE'],
      date: '22/08/2016',
      title: 'une ambiance festive et familiale que s’est déroulé',
      content: 'Le Groupe BCP, acteur panafricain de référence, et la Société FinaTncière Internationale (IFC)...'
    }, {
      type: 'article',
      tags: ['RSE', 'FINANCE'],
      date: '21/09/2017',
      title: 'une ambiance festive et familiale que s’est déroulé',
      content: 'Le Groupe BCP, acteur panafricain de référence, et la Société FinaTncière Internationale (IFC)...'
    }, {
      type: 'article-img',
      tags: ['RSE', 'FINANCE'],
      date: '21/10/2017',
      title: 'une ambiance festive et familiale que s’est déroulé',
      content: 'Le Groupe BCP, acteur panafricain de référence, et la Société FinaTncière Internationale (IFC)...',
      image: 'assets/img/actu-1.png'
    }, {
      type: 'article',
      tags: ['RSE', 'FINANCE'],
      date: '21/07/2018',
      title: 'une ambiance festive et familiale que s’est déroulé',
      content: 'Le Groupe BCP, acteur panafricain de référence, et la Société FinaTncière Internationale (IFC)...'
    }, {
      type: 'article-img',
      tags: ['RSE', 'FINANCE'],
      date: '21/07/2018',
      title: 'une ambiance festive et familiale que s’est déroulé',
      content: 'Le Groupe BCP, acteur panafricain de référence, et la Société FinaTncière Internationale (IFC)...',
      image: 'assets/img/actu-1.png'
    }, {
      type: 'article',
      tags: ['RSE', 'FINANCE'],
      date: '21/07/2019',
      title: 'une ambiance festive et familiale que s’est déroulé',
      content: 'Le Groupe BCP, acteur panafricain de référence, et la Société FinaTncière Internationale (IFC)...'
    }, {
      type: 'article-img',
      tags: ['RSE', 'FINANCE'],
      date: '21/07/2020',
      title: 'une ambiance festive et familiale que s’est déroulé',
      content: 'Le Groupe BCP, acteur panafricain de référence, et la Société FinaTncière Internationale (IFC)...',
      image: 'assets/img/actu-1.png'
    }]
  };

  function cleanTag(tagFilter) {
    tagFilter = tagFilter.trim().toLowerCase();
    if (tagFilter[0] == '#') {
      return tagFilter.slice(1);
    }

    return tagFilter;
  }

  function makeDateObject(dateString) {
    var _dateString$split = dateString.split('/'),
        _dateString$split2 = _slicedToArray(_dateString$split, 3),
        day = _dateString$split2[0],
        month = _dateString$split2[1],
        year = _dateString$split2[2];

    return new Date(year, month - 1, day);
  }

  function applyFilters() {
    var data = state.data;
    if (state.filters.length > 0) {
      data = data.filter(function (post) {
        for (var i = 0; i < state.filters.length; i++) {
          if (post.tags.includes(state.filters[i].toUpperCase())) {
            return true;
          }
        }
        return false;
      });
    }

    if (state.dateFilter.from && state.dateFilter.to) {
      data = data.filter(function (post) {
        if (makeDateObject(post.date) - makeDateObject(state.dateFilter.from) >= 0 && makeDateObject(post.date) - makeDateObject(state.dateFilter.to) <= 0) {
          return true;
        }

        return false;
      });
    }

    data = data.sort(function (a, b) {
      return state.order == 'desc' ? makeDateObject(b.date) - makeDateObject(a.date) : makeDateObject(a.date) - makeDateObject(b.date);
    });

    showSelected(data);
  }
  function changeFilters(e) {
    e.preventDefault();

    this.classList.toggle('active');

    state.filters = [];

    tagFilters.forEach(function (tag) {
      if ($(tag).hasClass('active')) {
        state.filters.push(cleanTag(tag.innerText));
      }
    });

    if (state.filters.length > 0) {
      allFilterBtn.classList.remove('active');
    } else {
      allFilterBtn.classList.add('active');
    }

    applyFilters();
  }

  function showSelected(data) {
    var selectedData = data.slice(0, state.max * 3);

    // console.log(data.length)
    // console.log(selectedData.length)

    if (selectedData.length >= data.length) {
      $('#more-actualite').hide();
    } else {
      $('#more-actualite').show();
    }

    render(selectedData);
  }

  applyFilters();

  $('#more-actualite').on('click', function (e) {
    e.preventDefault();
    state.max++;
    applyFilters();

    this.scrollIntoView({
      behavior: 'smooth',
      inline: 'end'
    });
    if (state.max + 1 > state.data.length / 3) $(this).hide();
  });

  function render(data) {
    actualiteHolder.innerHTML = data.map(function (post) {
      if (post.type === 'article') {
        return '\n          <div class="col-12 col-lg-4 mb-2">\n          <div class="card card--actualites">\n          <div class="card_tags">\n            ' + post.tags.map(function (tag) {
          return '<a class="btn btn--tag btn--orange mr-1" href="/gbp-front/actualites.html">\n                    #' + tag + '\n                  </a>';
        }).join('') + '\n          </div>\n          <p class="card_date">\n              ' + post.date + '\n          </p>\n          <a class="card_title" href="/gbp-front/news-detail.html">\n          ' + post.title + '\n        </a>\n          <p class="card_desc">\n            ' + post.content + '\n          </p>\n          <div class="clearfix position-relative">\n              <a class="card_link" href="/gbp-front/news-detail.html">\n            en savoir plus\n          </a>\n              <a class="card_share" href="/dist/news-detail.html">\n                  <svg>\n                      <use xlink:href="#icon-share-symbol"></use>\n                  </svg>\n              </a>\n              <ul class="share">\n                      <li>\n                          <a href="https://www.facebook.com/share.php?u=" onclick="javascript:window.open(this.href,\'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600\');return false;">\n                              <svg class="fb">\n                                  <use xlink:href="#icon-facebook"></use>\n                              </svg>\n                          </a>\n                      </li>\n                      <li>\n                          <a href="https://twitter.com/intent/tweet?text=text-partage&amp;url=" onclick="javascript:window.open(this.href,\'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600\');return false;">\n                              <svg class="twitter">\n                                  <use xlink:href="#icon-twitter"></use>\n                              </svg>\n                          </a>\n                      </li>\n                      <li>\n                          <a href="https://plus.google.com/share?url=https://plus.google.com">\n                              <svg>\n                                  <use xlink:href="#icon-google-plus"></use>\n                              </svg>\n                          </a>\n                      </li>\n                      <li>\n                          <a href="https://api.whatsapp.com/send?text=text-whatsapp&amp;url=">\n                              <svg>\n                                  <use xlink:href="#icon-whatsapp"></use>\n                              </svg>\n                          </a>\n                      </li>\n                  </ul>\n          </div>\n      </div>\n          </div>\n          ';
      } else if (post.type === 'article-img') {
        return '\n          <div class="col-12 col-lg-8 mb-2"><div class="card card--actualites card--actualites-img clearfix">\n          <a class="img-wrapper" href="/gbp-front/news-detail.html">\n              <img src="' + post.image + '" alt="">\n          </a>\n          <div class="wrapper">\n              <div class="card_tags">\n              ' + post.tags.map(function (tag) {
          return '<a class="btn btn--tag btn--orange mr-1" href="/gbp-front/actualites.html">\n                        #' + tag + '\n                      </a>';
        }).join('') + '\n              </div>\n              <p class="card_date">\n                  ' + post.date + '\n              </p>\n              <a class="card_title" href="/gbp-front/news-detail.html">\n                ' + post.title + '\n          </a>\n              <p class="card_desc">\n              ' + post.content + '\n              </p>\n              <div class="clearfix position-relative">\n                  <a class="card_link" href="/gbp-front/news-detail.html">\n              en savoir plus\n            </a>\n                  <a class="card_share" href="#">\n                      <svg>\n                          <use xlink:href="#icon-share-symbol"></use>\n                      </svg>\n                  </a>\n                  <ul class="share">\n                      <li>\n                          <a href="https://www.facebook.com/share.php?u=" onclick="javascript:window.open(this.href,\'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600\');return false;">\n                              <svg class="fb">\n                                  <use xlink:href="#icon-facebook"></use>\n                              </svg>\n                          </a>\n                      </li>\n                      <li>\n                          <a href="https://twitter.com/intent/tweet?text=text-partage&amp;url=" onclick="javascript:window.open(this.href,\'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600\');return false;">\n                              <svg class="twitter">\n                                  <use xlink:href="#icon-twitter"></use>\n                              </svg>\n                          </a>\n                      </li>\n                      <li>\n                          <a href="https://plus.google.com/share?url=https://plus.google.com">\n                              <svg>\n                                  <use xlink:href="#icon-google-plus"></use>\n                              </svg>\n                          </a>\n                      </li>\n                      <li>\n                          <a href="https://api.whatsapp.com/send?text=text-whatsapp&amp;url=">\n                              <svg>\n                                  <use xlink:href="#icon-whatsapp"></use>\n                              </svg>\n                          </a>\n                      </li>\n                  </ul>\n              </div>\n          </div>\n      </div></div>\n          ';
      } else {
        return '\n          <div class="col-12 col-lg-4 mb-2">\n            <div class="card card--actualites card--actualites-annonce">\n              <img src="assets/img/twitter.png" alt="">\n              <p class="card_desc">\n                ' + post.content + '\n              </p>\n              <a class="card_link" href="http://www.twitter.com/BP_Maroc" target="_blank">\n                Twitter.com/BP_Maroc\n              </a>\n           </div>\n          </div>\n          ';
      }
    }).join('');
  }

  function dateFormat(date) {
    return '1/' + (date.month() + 1) + '/' + date.year();
  }

  var startFilter = new _index2.default(startDate, false, function (start) {
    state.dateFilter.from = dateFormat(start);
    applyFilters();
  });
  startFilter.init();

  var endFilter = new _index2.default(endDate, true, function (end) {
    state.dateFilter.to = dateFormat(end);
    applyFilters();
  });
  endFilter.init();

  $('#actualite-select-filter').on('change', function () {
    var selected = $('#actualite-select-filter').next().find('.current').text();
    selected = selected.toLowerCase();

    // console.log(selected)

    $('#date-filter').addClass('d-flex');
    $('#date-filter').show();

    if (selected !== 'période') {
      $('#date-filter').removeClass('d-flex');
      $('#date-filter').hide();
      state.order = 'desc';
      state.dateFilter.from = '';
      state.dateFilter.to = '';
      startFilter.clear();
      endFilter.clear();
    }

    if (selected === 'plus anciens') {
      state.order = 'asc';
      applyFilters();
    } else if (selected === 'plus récents') {
      applyFilters();
      state.order = 'desc';
    }
  });

  allFilterBtn.addEventListener('click', function (e) {
    e.preventDefault();
    state.filters = [];
    tagFilters.forEach(function (tag) {
      tag.classList.remove('active');
    });
    this.classList.add('active');
    applyFilters();
  });
  tagFilters.forEach(function (tag) {
    tag.addEventListener('click', changeFilters);
  });
};

var _index = require('../../components/date-filter/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"../../components/date-filter/index.js":15}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var appelOffres = document.querySelector('#appel-offres');

  if (!appelOffres) return;

  var state = {
    organisme: '',
    nature: '',
    data: [{
      organisme: 'organisme1',
      nature: 'nature1',
      dates: {
        pub: '12/12/2020',
        depo: '12/12/2022'
      },
      title: 'La Banque Centrale Populaire lance un appel d’offres ouvert relatif au « MARCHE CADRE ACQUISITION DE STYLOS PROMOTIONNELS ».',
      numero: 'N° : AO 014-18 - Prorogation'
    }, {
      organisme: 'organisme1',
      nature: 'nature1',
      dates: {
        pub: '12/12/2020',
        depo: '12/12/2022'
      },
      title: 'La Banque Centrale Populaire lance un appel d’offres ouvert relatif au « MARCHE CADRE ACQUISITION DE STYLOS PROMOTIONNELS ».',
      numero: 'N° : AO 014-18 - Prorogation'
    }, {
      organisme: 'organisme2',
      nature: 'nature1',
      dates: {
        pub: '12/12/2020',
        depo: '12/12/2022'
      },
      title: 'La Banque Centrale Populaire lance un appel d’offres ouvert relatif au « MARCHE CADRE ACQUISITION DE STYLOS PROMOTIONNELS ».',
      numero: 'N° : AO 014-18 - Prorogation'
    }, {
      organisme: 'organisme1',
      nature: 'nature1',
      dates: {
        pub: '12/12/2020',
        depo: '12/12/2022'
      },
      title: 'La Banque Centrale Populaire lance un appel d’offres ouvert relatif au « MARCHE CADRE ACQUISITION DE STYLOS PROMOTIONNELS ».',
      numero: 'N° : AO 014-18 - Prorogation'
    }, {
      organisme: 'organisme1',
      nature: 'nature1',
      dates: {
        pub: '12/12/2020',
        depo: '12/12/2022'
      },
      title: 'La Banque Centrale Populaire lance un appel d’offres ouvert relatif au « MARCHE CADRE ACQUISITION DE STYLOS PROMOTIONNELS ».',
      numero: 'N° : AO 014-18 - Prorogation'
    }, {
      organisme: 'organisme2',
      nature: 'nature1',
      dates: {
        pub: '12/12/2020',
        depo: '12/12/2022'
      },
      title: 'La Banque Centrale Populaire lance un appel d’offres ouvert relatif au « MARCHE CADRE ACQUISITION DE STYLOS PROMOTIONNELS ».',
      numero: 'N° : AO 014-18 - Prorogation'
    }, {
      organisme: 'organisme2',
      nature: 'nature1',
      dates: {
        pub: '12/12/2020',
        depo: '12/12/2022'
      },
      title: 'La Banque Centrale Populaire lance un appel d’offres ouvert relatif au « MARCHE CADRE ACQUISITION DE STYLOS PROMOTIONNELS ».',
      numero: 'N° : AO 014-18 - Prorogation'
    }, {
      organisme: 'organisme3',
      nature: 'nature2',
      dates: {
        pub: '12/12/2020',
        depo: '12/12/2022'
      },
      title: 'La Banque Centrale Populaire lance un appel d’offres ouvert relatif au « MARCHE CADRE ACQUISITION DE STYLOS PROMOTIONNELS ».',
      numero: 'N° : AO 014-18 - Prorogation'
    }, {
      organisme: 'organisme4',
      nature: 'nature1',
      dates: {
        pub: '12/12/2020',
        depo: '12/12/2022'
      },
      title: 'La Banque Centrale Populaire lance un appel d’offres ouvert relatif au « MARCHE CADRE ACQUISITION DE STYLOS PROMOTIONNELS ».',
      numero: 'N° : AO 014-18 - Prorogation'
    }, {
      organisme: 'organisme4',
      nature: 'nature1',
      dates: {
        pub: '12/12/2020',
        depo: '12/12/2022'
      },
      title: 'La Banque Centrale Populaire lance un appel d’offres ouvert relatif au « MARCHE CADRE ACQUISITION DE STYLOS PROMOTIONNELS ».',
      numero: 'N° : AO 014-18 - Prorogation'
    }, {
      organisme: 'organisme5',
      nature: 'nature1',
      dates: {
        pub: '12/12/2020',
        depo: '12/12/2022'
      },
      title: 'La Banque Centrale Populaire lance un appel d’offres ouvert relatif au « MARCHE CADRE ACQUISITION DE STYLOS PROMOTIONNELS ».',
      numero: 'N° : AO 014-18 - Prorogation'
    }, {
      organisme: 'organisme3',
      nature: 'nature1',
      dates: {
        pub: '12/12/2020',
        depo: '12/12/2022'
      },
      title: 'La Banque Centrale Populaire lance un appel d’offres ouvert relatif au « MARCHE CADRE ACQUISITION DE STYLOS PROMOTIONNELS ».',
      numero: 'N° : AO 014-18 - Prorogation'
    }]
  };

  function applyFilter() {
    var data = state.data.filter(function (offer) {
      return state.organisme === offer.organisme && state.nature === offer.nature;
    });

    render(data);
  }

  function render(data) {
    appelOffres.innerHTML = data.map(function (offer) {
      return '<a class="news" href="/gbp-front/news-detail.html">\n                  <div class="news_border">\n                  </div>\n                  <div class="news_content">\n                    <div class="news_date clearfix">\n                      <p class="publication">\n                        Date de publication  : ' + offer.dates.pub + '\n                      </p>\n                      <p class="limite">\n                        Date limite de d\xE9pot de dossier : ' + offer.dates.depo + '\n                      </p>\n                    </div>\n                    <h2 class="news_title">\n                    ' + offer.title + '\n                    </h2>\n                    <p class="news_txt">\n                    ' + offer.numero + '\n                    </p>\n                  </div>\n                </a>';
    }).join('');
  }

  function init() {
    state.organisme = $('#appel-offres-select_organisme').next().find('.current').text().toLowerCase();
    state.nature = $('#appel-offres-select_nature').next().find('.current').text().toLowerCase();
    applyFilter();
  }
  init();

  $('#appel-offres-select_organisme').on('change', function () {
    state.organisme = $('#appel-offres-select_organisme').next().find('.current').text().toLowerCase();
    applyFilter();
  });
  $('#appel-offres-select_nature').on('change', function () {
    state.nature = $('#appel-offres-select_nature').next().find('.current').text().toLowerCase();
    applyFilter();
  });
};

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  if ($('.article-slider').length) {

    var rtl = $('html').attr('dir') == 'rtl';

    if ($(window).width() > 991) {
      articleSlider(0, rtl);
    } else {
      articleSlider(32, rtl);
    }

    $(window).on('resize', function () {
      if ($(window).width() > 991) {
        articleSlider(0, rtl);
      } else {
        articleSlider(32, rtl);
      }
    });
  }

  function articleSlider(stagePadding, rtl) {
    $('.article-slider.owl-carousel').owlCarousel({
      stagePadding: stagePadding,
      margin: 10,
      dots: true,
      nav: true,
      loop: false,
      rtl: rtl,
      responsive: {
        0: {
          items: 1
        },
        992: {
          items: 3
        }
      }
    });
  }
};

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if ($('.besoin-aide').length) {

		$('.besoin-aide').on('click', function () {
			$('.questions').toggleClass('d-none');
		});
	}
};

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {

    if ($('.card-actualites-slider').length) {

        var rtl = $('html').attr('dir') == 'rtl';

        if ($(window).width() <= 991) {

            cardActuSlider(48, rtl);
        } else {

            $('.card-actualites-slider').owlCarousel('destroy');
        }

        $(window).on('resize', function () {
            if ($(window).width() <= 991) {

                $('.card-actualites-slider').owlCarousel('destroy');
                cardActuSlider(48, rtl);
            } else {

                $('.card-actualites-slider').owlCarousel('destroy');
            }
        });
    }

    function cardActuSlider(stagePadding, rtl) {
        $('.card-actualites-slider.owl-carousel').owlCarousel({
            stagePadding: stagePadding,
            margin: 16,
            dots: true,
            nav: false,
            rtl: rtl,
            responsive: {
                0: {
                    items: 1
                }
            }
        });
    }
};

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {

	if ($('.card-histoire-slider').length) {

		var rtl = $('html').attr('dir') == 'rtl';

		if ($(window).width() <= 768) {

			cardHistoireSlider(48, rtl);
		} else {
			$('.card-histoire-slider').owlCarousel('destroy');
		}

		$(window).on('resize', function () {
			if ($(window).width() <= 768) {

				cardHistoireSlider(48, rtl);
			} else {
				$('.card-histoire-slider').owlCarousel('destroy');
			}
		});
	}

	function cardHistoireSlider(stagePadding, rtl) {
		$('.card-histoire-slider.owl-carousel').owlCarousel({
			stagePadding: stagePadding,
			margin: 5,
			dots: true,
			nav: false,
			rtl: rtl,
			responsive: {
				0: {
					items: 1
				}
			}
		});
	}
};

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if ($('.card--rapport-right').length) {

		var rtl = $('html').attr('dir') == 'rtl';

		if ($(window).width() > 768) {
			rapportSlider(0, rtl);
		} else {
			rapportSlider(0, rtl);
		}

		$(window).on('resize', function () {
			if ($(window).width() > 768) {
				rapportSlider(0, rtl);
			} else {
				rapportSlider(0, rtl);
			}
		});
	}

	function rapportSlider(stagePadding, rtl) {
		var owl = $('.card--rapport-right.owl-carousel').owlCarousel({
			stagePadding: stagePadding,
			margin: 0,
			dots: false,
			nav: false,
			loop: false,
			rtl: rtl,
			responsive: {
				0: {
					items: 1
				}
			}
		});

		$('.card--rapport-right .wrapper_btn .next').on('click', function () {
			owl.trigger('next.owl.carousel');
		});

		// Go to the previous item
		$('.card--rapport-right .wrapper_btn .prev').on('click', function () {
			// With optional speed parameter
			// Parameters has to be in square bracket '[]'
			owl.trigger('prev.owl.carousel');
		});
	}
};

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {

  if ($('.card-slider-wrapper').length) {

    if ($(window).width() > 768) {
      cardSliderPage(16);
    } else {
      cardSliderPage(0);
    }

    $(window).on('resize', function () {
      if ($(window).width() > 768) {
        cardSliderPage(16);
      } else {
        cardSliderPage(0);
      }
    });
  }

  function cardSliderPage(stagePadding) {
    $('.card-slider-wrapper.owl-carousel').owlCarousel({
      stagePadding: stagePadding,
      margin: 16,
      dots: true,
      nav: true,
      responsive: {
        0: {
          items: 1
        },
        768: {
          items: 2
        },
        992: {
          items: 4
        }
      }
    });
  }
};

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function () {
  var tagFilters = document.querySelectorAll('#communiques-filters a');
  var communiquesHolder = document.querySelector('#communiques-holder');
  var startDate = document.querySelector('.start');
  var endDate = document.querySelector('.end');
  var allFilterBtn = document.querySelector('#communiques-filter-all');

  if (tagFilters.length <= 0 || !communiquesHolder) return;

  var state = {
    filters: [],
    dateFilter: {
      from: '',
      to: ''
    },
    order: 'desc',
    max: 3,
    data: [{
      tags: ['RSE', 'FINANCE', 'ENTREPRENARIAT'],
      date: '21/07/2017',
      title: 'Le Groupe BCP lance la pr emière banque marocaine dédiée à l’activité “titres”',
      size: 450,
      type: 'pdf'
    }, {
      tags: ['RSE'],
      title: 'Le Groupe BCP lance la pr emière banque marocaine dédiée à l’activité “titres”',
      date: '29/07/2017',
      size: 450,
      type: 'pdf'
    }, {
      tags: ['RSE', 'ENTREPRENARIAT'],
      date: '22/07/2017',
      title: 'Le Groupe BCP lance la première banque marocaine dédiée à l’activité “titres”',
      size: 450,
      type: 'pdf'
    }, {
      tags: ['RSE', 'DEVELOPPEMENT DURABLE'],
      date: '23/07/2017',
      title: 'Le Groupe BCP lance la première banque marocaine dédiée à l’activité “titres”',
      size: 450,
      type: 'pdf'
    }, {
      tags: ['RSE'],
      date: '21/07/2017',
      title: 'Le Groupe BCP lance la première banque marocaine dédiée à l’activité “titres”',
      size: 450,
      type: 'pdf'
    }, {
      tags: ['RSE', 'FINANCE'],
      date: '24/07/2017',
      title: 'Le Groupe BCP lance la première banque marocaine dédiée à l’activité “titres”',
      size: 450,
      type: 'pdf'
    }, {
      tags: ['RSE', 'FINANCE'],
      date: '25/07/2017',
      title: 'Le Groupe BCP lance la première banque marocaine dédiée à l’activité “titres”',
      size: 450,
      type: 'pdf'
    }, {
      tags: ['RSE'],
      date: '26/07/2017',
      title: 'Le Groupe BCP lance la première banque marocaine dédiée à l’activité “titres”',
      size: 450,
      type: 'pdf'
    }, {
      tags: ['RSE', 'FINANCE'],
      date: '21/07/2017',
      title: 'Le Groupe BCP lance la première banque marocaine dédiée à l’activité “titres”',
      size: 450,
      type: 'pdf'
    }, {
      tags: ['RSE', 'FINANCE'],
      date: '21/08/2017',
      title: 'Le Groupe BCP lance la première banque marocaine dédiée à l’activité “titres”',
      size: 450,
      type: 'pdf'
    }, {
      tags: ['RSE'],
      date: '22/08/2016',
      title: 'Le Groupe BCP lance la première banque marocaine dédiée à l’activité “titres”',
      size: 450,
      type: 'pdf'
    }, {
      tags: ['RSE', 'FINANCE'],
      date: '21/09/2017',
      title: 'Le Groupe BCP lance la première banque marocaine dédiée à l’activité “titres”',
      size: 450,
      type: 'pdf'
    }, {
      tags: ['RSE', 'FINANCE'],
      date: '21/10/2017',
      title: 'Le Groupe BCP lance la première banque marocaine dédiée à l’activité “titres”',
      size: 450,
      type: 'pdf'
    }, {
      tags: ['RSE', 'FINANCE'],
      date: '21/07/2018',
      title: 'Le Groupe BCP lance la première banque marocaine dédiée à l’activité “titres”',
      size: 450,
      type: 'pdf'
    }, {
      tags: ['RSE', 'FINANCE'],
      date: '21/07/2018',
      title: 'Le Groupe BCP lance la première banque marocaine dédiée à l’activité “titres”',
      size: 450,
      type: 'pdf'
    }, {
      tags: ['RSE', 'FINANCE'],
      date: '21/07/2019',
      title: 'Le Groupe BCP lance la première banque marocaine dédiée à l’activité “titres”',
      size: 450,
      type: 'pdf'
    }, {
      tags: ['RSE', 'FINANCE'],
      date: '21/07/2020',
      title: 'Le Groupe BCP lance la première banque marocaine dédiée à l’activité “titres”',
      size: 450,
      type: 'pdf'
    }]
  };

  function cleanTag(tagFilter) {
    tagFilter = tagFilter.toLowerCase();
    if (tagFilter[0] == '#') {
      tagFilter = tagFilter.slice(1);
    }

    return tagFilter;
  }

  function makeDateObject(dateString) {
    var _dateString$split = dateString.split('/'),
        _dateString$split2 = _slicedToArray(_dateString$split, 3),
        day = _dateString$split2[0],
        month = _dateString$split2[1],
        year = _dateString$split2[2];

    return new Date(year, month - 1, day);
  }

  function applyFilters() {
    var data = state.data;
    if (state.filters.length > 0) {
      data = data.filter(function (post) {
        for (var i = 0; i < state.filters.length; i++) {
          if (post.tags.includes(state.filters[i].toUpperCase())) {
            return true;
          }
        }
        return false;
      });
    }

    if (state.dateFilter.from && state.dateFilter.to) {
      data = data.filter(function (post) {
        if (makeDateObject(post.date) - makeDateObject(state.dateFilter.from) >= 0 && makeDateObject(post.date) - makeDateObject(state.dateFilter.to) <= 0) {
          return true;
        }

        return false;
      });
    }

    data = data.sort(function (a, b) {
      return state.order == 'desc' ? makeDateObject(b.date) - makeDateObject(a.date) : makeDateObject(a.date) - makeDateObject(b.date);
    });

    showSelected(data);
  }
  function changeFilters(e) {
    e.preventDefault();

    this.classList.toggle('active');

    state.filters = [];

    tagFilters.forEach(function (tag) {
      if ($(tag).hasClass('active')) {
        state.filters.push(cleanTag(tag.innerText));
      }
    });

    if (state.filters.length > 0) {
      allFilterBtn.classList.remove('active');
    } else {
      allFilterBtn.classList.add('active');
    }

    applyFilters();
  }

  function showSelected(data) {
    var selectedData = data.slice(0, state.max * 3);

    console.log(data.length);
    console.log(selectedData.length);

    if (selectedData.length >= data.length) {
      $('#more-communiques').hide();
    } else {
      $('#more-communiques').show();
    }

    render(selectedData);
  }

  applyFilters();

  $('#more-communiques').on('click', function (e) {
    e.preventDefault();
    state.max++;
    applyFilters();

    this.scrollIntoView({
      behavior: 'smooth',
      inline: 'end'
    });
    if (state.max + 1 > state.data.length / 3) $(this).hide();
  });

  function render(data) {
    communiquesHolder.innerHTML = data.map(function (post) {
      return '<a class="news news--communiques" href="#">\n        <div class="news_border">\n          <svg class="icon-pdf">\n            <use xlink:href="#icon-pdf"></use>\n          </svg>\n          <p>\n            T\xE9l\xE9charger\n          </p>\n        </div>\n        <div class="news_content">\n          <div class="news_date clearfix">\n            <p class="publication">\n              ' + post.date + '\n            </p>\n          </div>\n          <h2 class="news_title">\n            ' + post.title + '\n          </h2>\n          <p class="news_txt">\n            .' + post.type + ' - ' + post.size + ' KB\n          </p>\n        </div>\n      </a>';
    }).join('');
  }

  function dateFormat(date) {
    return '1/' + (date.month() + 1) + '/' + date.year();
  }

  var startFilter = new _index2.default(startDate, false, function (start) {
    state.dateFilter.from = dateFormat(start);
    applyFilters();
  });
  startFilter.init();

  var endFilter = new _index2.default(endDate, true, function (end) {
    state.dateFilter.to = dateFormat(end);
    applyFilters();
  });
  endFilter.init();

  $('#communiques-select-filter').on('change', function () {
    var selected = $('#communiques-select-filter').next().find('.current').text();
    selected = selected.toLowerCase();

    // console.log(selected)

    $('#date-filter').addClass('d-flex');
    $('#date-filter').show();

    if (selected !== 'période') {
      $('#date-filter').removeClass('d-flex');
      $('#date-filter').hide();
      state.order = 'desc';
      state.dateFilter.from = '';
      state.dateFilter.to = '';
      startFilter.clear();
      endFilter.clear();
    }

    if (selected === 'plus anciens') {
      state.order = 'asc';
      applyFilters();
    } else if (selected === 'plus récents') {
      applyFilters();
      state.order = 'desc';
    }
  });

  allFilterBtn.addEventListener('click', function (e) {
    e.preventDefault();
    state.filters = [];
    tagFilters.forEach(function (tag) {
      tag.classList.remove('active');
    });
    this.classList.add('active');
    applyFilters();
  });
  tagFilters.forEach(function (tag) {
    tag.addEventListener('click', changeFilters);
  });
};

var _index = require('../../components/date-filter/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"../../components/date-filter/index.js":15}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (parent, empty, callback) {
  var currentDate = (0, _moment2.default)();

  var incDate = parent.querySelector('.increment-date');
  var decDate = parent.querySelector('.decrement-date');
  var monthsInput = parent.querySelector('.date-filter_month input');
  var yearsInput = parent.querySelector('.date-filter_year input');

  function updateDate() {
    var currentMonth = currentDate.month() + 1;
    var currentYear = currentDate.year().toString();
    monthsInput.value = currentMonth;
    yearsInput.value = currentYear;
    callback(currentDate);
  }

  function bindEvents() {
    incDate.addEventListener('click', function (e) {
      e.preventDefault();
      currentDate = (0, _moment2.default)(currentDate).add(1, 'months');
      updateDate();
    });
    decDate.addEventListener('click', function (e) {
      e.preventDefault();
      currentDate = (0, _moment2.default)(currentDate).subtract(1, 'months');
      updateDate();
    });
    monthsInput.addEventListener('input', function () {
      if (parseInt(this.value) > 0 && parseInt(this.value) <= 31) {
        currentDate.month(this.value - 1);
        updateDate();
      }
    });
    yearsInput.addEventListener('input', function () {
      if (parseInt(this.value) > 0) {
        currentDate.year(this.value);
        updateDate();
      }
    });
  }

  this.clear = function () {
    monthsInput.value = yearsInput.value = '';
  };

  this.init = function () {
    bindEvents();
    if (!empty) updateDate();
  };

  this.selectedDate = function () {
    return currentDate;
  };
};

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"moment":1}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  if ($('.date-slider').length) {

    if ($(window).width() > 768) {
      dateSliderPage(0);
    } else {
      dateSliderPage(0);
    }

    $(window).on('resize', function () {
      if ($(window).width() > 768) {
        dateSliderPage(0);
      } else {
        dateSliderPage(0);
      }
    });
  }

  function dateSliderPage(stagePadding) {
    $('.date-slider.owl-carousel').owlCarousel({
      stagePadding: stagePadding,
      margin: 5,
      dots: true,
      nav: true,
      responsive: {
        0: {
          items: 4
        },
        768: {
          items: 10
        },
        992: {
          items: 15
        }
      }
    });
  }
};

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var tagFilters = void 0,
      financesDates = document.querySelector('#finance-dates'),
      financePosts = document.querySelector('#finance-posts');

  if (!financePosts) return;

  var state = {
    filter: '2018',
    data: [{
      date: '22/12/2017',
      img: 'assets/img/finance.png',
      title: {
        first: 'Résultats',
        last: 'Financiers'
      }
    }, {
      date: '22/12/2018',
      img: 'assets/img/finance.png',
      title: {
        first: 'Résultats',
        last: 'Financiers'
      }
    }, {
      date: '22/12/2016',
      img: 'assets/img/finance.png',
      title: {
        first: 'Résultats',
        last: 'Financiers'
      }
    }, {
      date: '22/12/1994',
      img: 'assets/img/finance.png',
      title: {
        first: 'Résultats',
        last: 'Financiers'
      }
    }, {
      date: '22/12/2012',
      img: 'assets/img/finance.png',
      title: {
        first: 'Résultats',
        last: 'Financiers'
      }
    }, {
      date: '22/12/2018',
      img: 'assets/img/finance.png',
      title: {
        first: 'Résultats',
        last: 'Financiers'
      }
    }, {
      date: '22/12/1996',
      img: 'assets/img/finance.png',
      title: {
        first: 'Résultats',
        last: 'Financiers'
      }
    }, {
      date: '22/12/1991',
      img: 'assets/img/finance.png',
      title: {
        first: 'Résultats',
        last: 'Financiers'
      }
    }, {
      date: '22/12/2000',
      img: 'assets/img/finance.png',
      title: {
        first: 'Résultats',
        last: 'Financiers'
      }
    }, {
      date: '22/12/2015',
      img: 'assets/img/finance.png',
      title: {
        first: 'Résultats',
        last: 'Financiers'
      }
    }, {
      date: '22/12/2014',
      img: 'assets/img/finance.png',
      title: {
        first: 'Résultats',
        last: 'Financiers'
      }
    }, {
      date: '22/12/2013',
      img: 'assets/img/finance.png',
      title: {
        first: 'Résultats',
        last: 'Financiers'
      }
    }, {
      date: '22/12/2010',
      img: 'assets/img/finance.png',
      title: {
        first: 'Résultats',
        last: 'Financiers'
      }
    }, {
      date: '22/12/2018',
      img: 'assets/img/finance.png',
      title: {
        first: 'Résultats',
        last: 'Financiers'
      }
    }, {
      date: '22/12/2018',
      img: 'assets/img/finance.png',
      title: {
        first: 'Résultats',
        last: 'Financiers'
      }
    }, {
      date: '22/12/2017',
      img: 'assets/img/finance.png',
      title: {
        first: 'Résultats',
        last: 'Financiers'
      }
    }, {
      date: '22/12/2018',
      img: 'assets/img/finance.png',
      title: {
        first: 'Résultats',
        last: 'Financiers'
      }
    }, {
      date: '22/12/2018',
      img: 'assets/img/finance.png',
      title: {
        first: 'Résultats',
        last: 'Financiers'
      }
    }, {
      date: '22/12/2001',
      img: 'assets/img/finance.png',
      title: {
        first: 'Résultats',
        last: 'Financiers'
      }
    }, {
      date: '22/12/2003',
      img: 'assets/img/finance.png',
      title: {
        first: 'Résultats',
        last: 'Financiers'
      }
    }, {
      date: '22/12/2005',
      img: 'assets/img/finance.png',
      title: {
        first: 'Résultats',
        last: 'Financiers'
      }
    }, {
      date: '22/12/2002',
      img: 'assets/img/finance.png',
      title: {
        first: 'Résultats',
        last: 'Financiers'
      }
    }, {
      date: '22/12/1999',
      img: 'assets/img/finance.png',
      title: {
        first: 'Résultats',
        last: 'Financiers'
      }
    }, {
      date: '22/12/1985',
      img: 'assets/img/finance.png',
      title: {
        first: 'Résultats',
        last: 'Financiers'
      }
    }]
  };

  function applyFilters() {
    var data = state.data;
    if (state.filter) {
      data = data.filter(function (post) {
        if (state.filter.trim() === post.date.split('/')[2]) {
          return true;
        }
        return false;
      });
    }

    render(data);
  }

  function changeFilter(e) {
    e.preventDefault();

    tagFilters.forEach(function (tag) {
      tag.classList.remove('active');
    });

    this.classList.add('active');

    state.filter = this.innerText;

    // console.log(state.filters)
    applyFilters();
  }

  function bindEvents() {
    $('.finance').on('click', function () {
      var currentItem = $(this);
      console.log('clicked');
      $('.finance').each(function (index, el) {
        if ($(el)[0] !== currentItem[0]) {
          $(el).removeClass('open');
        }
      });

      $(this).toggleClass('open');
    });
  }

  function render(data) {
    financePosts.innerHTML = data.map(function (post, index) {
      return '\n        ' + (index == 0 && data.length > 1 ? '<div class="col-12 col-lg-8 mb-lg-3 mb-2"><div class="finance finance--lg clearfix">' : '<div class="col-12 col-lg-4 mb-lg-3 mb-2"><div class="finance clearfix">') + '\n            <div>\n              <img src="assets/img/finance.png" alt="">\n            </div>\n            <div class="finance_title">\n              <h3 class="first">\n                ' + post.title.first + '\n                </h3>\n                <h3 class="last">\n                ' + post.title.last + '\n                </h3>\n                \n                <p class="finance_date">\n                ' + post.date + '\n              </p>\n\n              <p class="download">\n                <label class="checkbox">\n                  Comptes sociaux de la Banque \n                  <input type="checkbox">\n                  <span class="checkmark">\n                  </span>\n                </label>\n                <label class="checkbox">\n                  Centrale Populaire\n                  <input type="checkbox" checked>\n                  <span class="checkmark">\n                  </span>\n                </label>\n                <label class="checkbox">\n                  Communiqu\xE9 de presse- VA\n                  <input type="checkbox" checked>\n                  <span class="checkmark">\n                  </span>\n                </label>\n                <label class="checkbox">\n                  Communiqu\xE9 de presse- VF\n                  <input type="checkbox" checked>\n                  <span class="checkmark">\n                  </span>\n                </label>\n                <button type="button" class="btn btn--download">\n                  telecharger\n                </button>\n              </p>\n              \n            </div>\n        </div>\n        </div>\n      ';
    }).join('');

    bindEvents();
  }

  function init() {
    var distinctTags = [];

    financesDates.innerHTML = state.data.filter(function (post) {
      if (!distinctTags.includes(post.date)) {
        distinctTags.push(post.date);
        return true;
      }

      return false;
    }).sort(function (py, ny) {
      return ny.date.split('/')[2] - py.date.split('/')[2];
    }).map(function (post, index) {
      return '<a href="#" class="btn btn--tag ' + (index == 0 ? 'active' : '') + ' ">\n                  ' + post.date.split('/')[2] + '\n                </a>';
    }).join('');

    tagFilters = financesDates.querySelectorAll('a');

    tagFilters.forEach(function (tag) {
      tag.addEventListener('click', changeFilter);
    });

    applyFilters();
    bindEvents();
  }

  init();
};

},{}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if ($('.finance.length')) {

		$('.finance').on('click', function () {

			var currentItem = $(this);

			$('.finance').each(function (index, el) {

				if ($(el)[0] !== currentItem[0]) {
					$(el).removeClass('open');
				}
			});

			$(this).toggleClass('open');
		});
	}
};

},{}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if ($('.footer_title').length) {

		$('.footer_title').on('click', function () {
			if ($(this).next('ul').css('display') === 'none') {

				$('.footer_title + ul.open').css('display', 'none');
				$('.footer_title + ul.open').removeClass('open');

				$(this).next('ul').css('display', 'block');
				$(this).next('ul').addClass('open');
			} else {

				$(this).next('ul').css('display', 'none');
				$(this).next('ul').removeClass('open');
			}
		});

		$(window).on('resize', function () {
			if ($(window).width() > 768) {
				$('.footer_title + ul').css('display', 'block');
				$('.footer_title + ul.open').removeClass('open');
			} else {
				$('.footer_title + ul').css('display', 'none');
			}
		});
	}
};

},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {

    /* Variables */

    var $form = $('.form-stage');
    var $formDrop = $('.form_drop');
    var $input = $form.find('input[type=file]');
    var droppedFiles = false;

    /* Functions */

    var isAdvancedUpload = function () {
        var div = document.createElement('div');
        return ('draggable' in div || 'ondragstart' in div && 'ondrop' in div) && 'FormData' in window && 'FileReader' in window;
    }();

    var addfileDom = function addfileDom(file) {
        //console.log(file);

        var html = '<div class="col-12 col-md-6 mb-2">\n\t        \t\t\t<div class="form_file" id="' + (file.name + parseInt(file.size / 1024)) + '">\n\t\t\t                <div class="wrapper d-flex justify-content-between align-items-center">\n\t\t\t                    <div class="d-flex align-items-center">\n\t\t\t                        <span class="check d-none">\n\t\t\t                            <svg>\n\t\t\t                                <use xlink:href="#icon-check-file"></use>\n\t\t\t                            </svg>\n\t\t\t                        </span>\n\t\t\t                        <span class="pdf">\n\t\t\t                            <svg>\n\t\t\t                                <use xlink:href="#icon-pdf-file"></use>\n\t\t\t                            </svg>\n\t\t\t                        </span>\n\t\t\t                        <span>\n\t\t\t                            <p class="name">\n\t\t\t                                ' + file.name + '\n\t\t\t                            </p>\n\t\t\t                            <p class="size">\n\t\t\t                                ' + parseInt(file.size / 1024) + 'KB\n\t\t\t                            </p>\n\t\t\t                        </span>\n\t\t\t                    </div>\n\t\t\t                    <div class="d-flex align-items-center">\n\t\t\t                        <span class="remove d-none">\n\t\t\t                            <svg>\n\t\t\t                                <use xlink:href="#icon-remove-file"></use>\n\t\t\t                            </svg>\n\t\t\t                        </span>\n\t\t\t                        <span class="loading">\n\t\t\t                            Chargement en cours <span class="percentage"></span> %\n\t\t\t                        </span>\n\t\t\t                        <span class="cross">\n\t\t\t                            <svg>\n\t\t\t                                <use xlink:href="#icon-cross-file"></use>\n\t\t\t                            </svg>\n\t\t\t                        </span>\n\t\t\t                    </div>\n\t\t\t                </div>\n\t\t\t                <div class="progress-bar" style="width: 0%"></div>\n\t\t\t            </div>\n\t\t\t        </div>';

        $('.form_files').append(html);
    };

    var sendFiles = function sendFiles(files) {
        //console.log(files);

        var ajaxData = new FormData($form.get(0));

        $.each(droppedFiles, function (i, file) {

            var fileId = file.name + parseInt(file.size / 1024);
            ajaxData.append(fileId, file);

            addfileDom(file);

            $.ajax({
                xhr: function xhr() {

                    var xhr = new window.XMLHttpRequest();

                    xhr.upload.addEventListener("progress", function (evt) {
                        if (evt.lengthComputable) {

                            var percentComplete = evt.loaded / evt.total;
                            var fileId = file.name + parseInt(file.size / 1024);
                            var fileDom = $(document.getElementById(fileId));
                            var percentageDom = $(document.getElementById(fileId)).find('.percentage');
                            var progressBar = $(document.getElementById(fileId)).find('.progress-bar');

                            percentComplete = parseInt(percentComplete * 100);

                            percentageDom.append(percentComplete);
                            progressBar.css('width', percentComplete + '%');

                            //console.log(percentComplete);

                            if (percentComplete === 100) {
                                setTimeout(function () {

                                    fileDom.find('.progress-bar').toggleClass('d-none');
                                    fileDom.find('.loading').toggleClass('d-none');
                                    fileDom.find('.remove').toggleClass('d-none');
                                    fileDom.find('.cross').toggleClass('d-none');
                                }, 300);
                            }
                        }
                    }, false);

                    return xhr;
                },
                url: 'action/uploadfile',
                type: $form.attr('method'),
                data: ajaxData,
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false,
                complete: function complete() {
                    $form.removeClass('is-uploading');
                },
                success: function success(data) {
                    $form.addClass(data.success == true ? 'is-success' : 'is-error');
                    if (!data.success) console.log('upload error');
                },
                error: function error() {
                    // Log the error, show an alert, whatever works for you
                }
            });

            $('.remove').on('click', function () {
                var removeId = $(this).closest('.form_file').attr('id');

                removeFile(removeId);
            });
        });
    };

    var removeFile = function removeFile(id) {
        var file = $(document.getElementById(id)).parent();
        file.remove();
    };

    /* Drag and drop Listener */

    if (isAdvancedUpload) {
        // Browser support Drag and Drop

        $formDrop.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
        }).on('dragover dragenter', function () {
            $formDrop.addClass('is-dragover');
        }).on('dragleave dragend drop', function () {
            $formDrop.removeClass('is-dragover');
        }).on('drop', function (e) {
            droppedFiles = e.originalEvent.dataTransfer.files;
            sendFiles(droppedFiles);
        });

        $input.on('change', function (e) {
            droppedFiles = e.target.files;
            sendFiles(e.target.files);
        });
    } else {}

    //fallback for IE9- browsers


    /* Submit Listener */

    $form.on('submit', function (e) {
        if ($form.hasClass('is-uploading')) return false;

        $form.addClass('is-uploading').removeClass('is-error');

        if (isAdvancedUpload) {
            // ajax for modern browsers

            e.preventDefault();

            // Form Input Data
            var ajaxData = {};

            $.ajax({
                url: $form.attr('action'),
                type: $form.attr('method'),
                data: ajaxData,
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false,
                complete: function complete() {},
                success: function success(data) {},
                error: function error() {
                    // Log the error, show an alert, whatever works for you
                }
            });
        } else {
            // ajax for IE9- browsers
        }
    });
};

},{}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    $("form[name='form-stage']").validate({

        // Specify validation rules
        rules: {
            firstname: 'required',
            lastname: 'required',
            email: {
                required: true,
                email: true
            },
            tel: {
                required: true,
                digits: true
            },
            service: 'required',
            formation: 'required',
            stage: {
                required: true
            },
            'type-formation': {
                required: true
            }
        },
        // Specify validation error messages
        messages: {
            firstname: 'Veuillez entrer votre prénom',
            lastname: 'Veuillez entrer votre nom',
            email: 'Veuillez entrer un email valide',
            tel: 'Veuillez entrer un numéro de téléphone valide (10 caractères min)',
            'type-formation': 'Veuillez entrer un type de formation',
            'conditions': 'Veuillez acceptez les conditions générales d\'utilisation',
            'service': 'Veuillez choisir un service',
            'formation': 'Veuillez choisir une formation',
            'stage': 'Veuillez choisir un type de stage'
        },
        errorPlacement: function errorPlacement(error, element) {
            if ((element.attr('type') == 'radio' || element.attr('type') == 'checkbox') && element.attr('name') != 'conditions') {
                error.insertAfter(element.parent().parent());
            } else if (element.attr('name') == 'conditions') {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
        },

        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function submitHandler(form) {
            form.submit();
        }
    });
};

},{}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if ($('.header_mobile-menu').length) {
		$('.header_mobile-menu').on('click', function () {
			if ($('.header_menu').css('display') == 'block') {
				$('.header_menu').css('display', 'none');
			} else {
				$('.header_menu').css('display', 'block');
			}
		});
	}

	$(window).on('resize', function () {
		if ($(window).width() > 991) {
			if ($('.header_menu').css('display') == 'none') {
				$('.header_menu').css('display', 'block');
			}
		}
	});
};

},{}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    if ($('.home-slider').length) {

        var rtl = $('html').attr('dir') == 'rtl';

        if ($(window).width() > 768) {

            setHeightSlider();
            homeSlider(0, rtl);
        } else {
            homeSlider(0, rtl);
        }

        $(window).on('resize', function () {

            if ($(window).width() > 768) {
                $('.home-slider').owlCarousel('destroy');
                homeSlider(0, rtl);
            } else {
                $('.home-slider').owlCarousel('destroy');
                homeSlider(0, rtl);
            }
        });
    }

    function setHeightSlider() {
        var windowHeight = $(window).height();
        var topHeaderHeight = $('.top-header').height();
        var headerHeight = $('.header').height();

        var sliderHeight = windowHeight - topHeaderHeight - headerHeight;

        var slider = $('.home-slider');
        var sliderItem = $('.home-slider_item');

        slider.css('max-height', sliderHeight);
        sliderItem.css('max-height', sliderHeight);
    }

    function homeSlider(stagePadding, rtl) {
        var owl = $('.home-slider.owl-carousel').owlCarousel({
            stagePadding: stagePadding,
            margin: 0,
            dots: true,
            nav: false,
            loop: true,
            navSpeed: 400,
            //autoplay: true,
            autoplayTimeout: 5000,
            rtl: rtl,
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 1,
                    dotsData: true
                }
            }
        });
    }
};

},{}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  if ($('.logo-slider').length) {

    var rtl = $('html').attr('dir') == 'rtl';

    if ($(window).width() > 768) {
      logoSlider(0, rtl);
    } else {
      logoSlider(0, rtl);
    }

    $(window).on('resize', function () {
      if ($(window).width() > 768) {
        logoSlider(0, rtl);
      } else {
        logoSlider(0, rtl);
      }
    });
  }

  function logoSlider(stagePadding, rtl) {
    $('.logo-slider.owl-carousel').owlCarousel({
      stagePadding: stagePadding,
      margin: 45,
      dots: false,
      nav: true,
      loop: true,
      rtl: rtl,
      responsive: {
        0: {
          items: 2.5
        },
        768: {
          items: 4
        },
        992: {
          items: 5
        }
      }
    });
  }
};

},{}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildMapCardInfo = exports.calculateAndDisplayRoute = exports.toggleControl = exports.mapControl = undefined;

var _data = require('../../assets/js/data.json');

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapControl = exports.mapControl = function mapControl() {
  var processData = function processData(data) {
    var inputedSearch = $('#inputed-search');
    var searchResult = $('#search-result');
    var suggestionHolder = $('#suggestions-holder');
    var searchInput = $('#search-input');
    var suggestionsContainer = $('#suggestions-container');
    var selectedContainer = $('#selected-container');
    var mapControlContainer = $('.mapcontrol_container');
    var filters = $('.mapcontrol_options > .btn');
    var selectedElement = void 0;

    var state = {
      userInput: '',
      filters: [],
      filtredData: []
    };

    var checkSuggestionsStatus = function checkSuggestionsStatus() {
      if (state.filtredData.length <= 0) {
        mapControlContainer.css('height', '186px');
        suggestionsContainer.hide();
      } else {
        mapControlContainer.css('height', '245px');
        suggestionsContainer.show();
      }
    };

    var applyFilters = function applyFilters() {
      // filter data by user input
      state.filtredData = data.filter(function (element) {
        return (element.name.toLocaleLowerCase().includes(state.userInput) || element.address.toLocaleLowerCase().includes(state.userInputt) || element.city.toLocaleLowerCase().includes(state.userInput)) && state.userInput != '';
      });

      // Filter data by type
      state.filters.forEach(function (filter) {
        state.filtredData = state.filtredData.filter(function (element) {
          return element.type === filter;
        });
      });

      // render filtred data
      render();
    };

    var filterChanges = function filterChanges() {
      $(this).toggleClass('active'); // change the style of the tag
      state.filters = [];

      filters.each(function () {
        if ($(this).hasClass('active')) {
          state.filters.push($(this).data('value'));
        }
      });

      applyFilters();
    };

    var inputChanges = function inputChanges(e) {
      state.userInput = e.target.value.toLocaleLowerCase();
      applyFilters();
    };

    var showSelected = function showSelected() {
      var selectedName = $(this).find('h3').text();

      selectedElement = state.filtredData.filter(function (element) {
        return element.name === selectedName;
      }).reduce(function (prev) {
        return prev;
      });

      var selectedHTML = buildMapCardInfo(selectedElement);

      selectedContainer.html(selectedHTML);
      $('#selected-container--close').on('click', function (e) {
        e.preventDefault();
        render();
      });
      $('#selected-container--direction').on('click', displayDirection);
      selectedContainer.fadeIn();
      suggestionsContainer.hide();
    };

    function displayDirection(e) {
      e.preventDefault();
      console.log(selectedElement);
      calculateAndDisplayRoute(window.map, new google.maps.LatLng(selectedElement.coords.gps.lang, selectedElement.coords.gps.lat));
    }

    var render = function render() {
      // hide selected container
      selectedContainer.hide();

      // Check wether to display suggestions of not
      checkSuggestionsStatus();

      // update inputed search
      inputedSearch.text(state.userInput);
      // update search Result
      searchResult.text('( ' + state.filtredData.length + ' agences trouv\xE9es )');

      var content = state.filtredData.map(function (element) {
        return '<div class="suggestions_element">\n                  <h3>' + element.name + '</h3>\n                  <span>' + element.address + '</span>\n                </div>';
      }).join('');

      suggestionHolder.html(content);

      $('.suggestions_element').click(showSelected);
    };

    searchInput.on('input', inputChanges);
    filters.on('click', filterChanges);
  };

  // $.getJSON('http://localhost:9000/data.json', processData)

  processData(_data2.default);
};

var toggleControl = exports.toggleControl = function toggleControl() {
  $('.mapcontrol_toggle').click(function () {
    $('.mapcontrol').toggleClass('mapcontrol--hide');
  });
};

var calculateAndDisplayRoute = exports.calculateAndDisplayRoute = function calculateAndDisplayRoute(map, destination) {
  var directionsService = new google.maps.DirectionsService();
  window.directionsDisplay = window.directionsDisplay || new google.maps.DirectionsRenderer();
  window.directionsDisplay.setMap(map);

  directionsService.route({
    origin: map.getCenter(),
    destination: destination,
    travelMode: 'DRIVING'
  }, function (response, status) {
    if (status === 'OK') {
      window.directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
};

var buildMapCardInfo = exports.buildMapCardInfo = function buildMapCardInfo(selectedElement) {
  return '<div class="moreinfo_content">\n  <div class="moreinfo_head">\n    <h3 class="moreinfo_title" id="info-name">' + selectedElement.name + '</h3>\n    <p class="moreinfo_address" id="info-address">' + selectedElement.address + '</p>\n    <div class="moreinfo_actions">\n      <a href="#" id="selected-container--direction" >G\xC9N\xC9RER UN ITIN\xC9RAIRE</a>\n      <a href="#" id="selected-container--close">RETOURNER</a>\n    </div>\n  </div>\n  <div class="moreinfo_body">\n    <div class="moreinfo_section">\n      <h4>Coordonn\xE9es</h4>\n      <div class="moreinfo_list">\n        <div class="moreinfo_list-item">\n          <div class="left">\n            <span>Email</span>\n          </div>\n          <div class="right">\n            <span id="info-email">' + selectedElement.coords.email + '</span>\n          </div>\n        </div>\n        <div class="moreinfo_list-item">\n          <div class="left">\n            <span>T\xE9l\xE9phone</span>\n          </div>\n          <div class="right">\n            <span id="info-phone">' + selectedElement.coords.phone + '</span>\n          </div>\n        </div>\n        <div class="moreinfo_list-item">\n          <div class="left">\n            <span>Fax</span>\n          </div>\n          <div class="right">\n            <span id="info-fax">' + selectedElement.coords.fax + '</span>\n          </div>\n        </div>\n        <div class="moreinfo_list-item">\n          <div class="left">\n            <span>Coords GPS</span>\n          </div>\n          <div class="right">\n            <span>\n              <bold>\n                Latitude\n              </bold> : ' + selectedElement.coords.gps.lat + ' |\n              <bold>\n                Longitude\n              </bold> : ' + selectedElement.coords.gps.lang + ' </span>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class="moreinfo_section">\n      <h4>Agence li\xE9e</h4>\n      <div class="moreinfo_container">\n        <h5>' + selectedElement.extension.name + '</h5>\n        <p class="moreinfo_address">' + selectedElement.extension.address + '</p>\n      </div>\n    </div>\n    <div class="moreinfo_section">\n      <div class="moreinfo_list">\n        <div class="moreinfo_list-item">\n          <div class="left">\n            <span>Lundi</span>\n          </div>\n          <div class="right">\n            <span>' + selectedElement.timetable.monday + '</span>\n          </div>\n        </div>\n        <div class="moreinfo_list-item">\n          <div class="left">\n            <span>Mardi</span>\n          </div>\n          <div class="right">\n            <span>' + selectedElement.timetable.tuesday + '</span>\n          </div>\n        </div>\n        <div class="moreinfo_list-item">\n          <div class="left">\n            <span>Mercredi</span>\n          </div>\n          <div class="right">\n            <span>' + selectedElement.timetable.wednesday + '</span>\n          </div>\n        </div>\n        <div class="moreinfo_list-item">\n          <div class="left">\n            <span>Jeudi</span>\n          </div>\n          <div class="right">\n            <span>' + selectedElement.timetable.thursday + '</span>\n          </div>\n        </div>\n        <div class="moreinfo_list-item">\n          <div class="left">\n            <span>Vendredi</span>\n          </div>\n          <div class="right">\n            <span>' + selectedElement.timetable.friday + '</span>\n          </div>\n        </div>\n        <div class="moreinfo_list-item">\n          <div class="left">\n            <span>Samedi</span>\n          </div>\n          <div class="right">\n            <span>' + selectedElement.timetable.saturday + '</span>\n          </div>\n        </div>\n        <div class="moreinfo_list-item">\n          <div class="left">\n            <span>Diamanche</span>\n          </div>\n          <div class="right">\n            <span>' + selectedElement.timetable.sunday + '</span>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>';
};

},{"../../assets/js/data.json":3}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var mapControlContainer = $('.mapcontrol_container');
  var mapControl = $('.mapcontrol');
  var selectedContainer = $('#selected-container');
  var suggestionsContainer = $('#suggestions-container');

  var bindMarkers = function bindMarkers(map, locations) {
    var marker = void 0,
        latlng = void 0;

    locations.forEach(function (location) {
      latlng = new google.maps.LatLng(location.coords.gps.lang, location.coords.gps.lat);
      marker = new google.maps.Marker({
        position: latlng,
        icon: 'assets/img/pin.png'
      });
      marker.setMap(map);

      // biding the click event with each marker
      google.maps.event.addListener(marker, 'click', function () {
        mapControl.removeClass('mapcontrol--hide');
        mapControlContainer.css('height', '245px');
        var selectedHTML = (0, _index.buildMapCardInfo)(location);
        selectedContainer.html(selectedHTML);
        $('#selected-container--close').on('click', function (e) {
          e.preventDefault();
          mapControlContainer.css('height', '186px');
          selectedContainer.hide();
        });
        $('#selected-container--direction').on('click', function (e) {
          e.preventDefault();
          (0, _index.calculateAndDisplayRoute)(window.map, new google.maps.LatLng(location.coords.gps.lang, location.coords.gps.lat));
        });
        suggestionsContainer.hide();
        selectedContainer.show();
      });
    });
  };

  var ajustMapSize = function ajustMapSize(mapHolder) {
    // Define the height of the map
    var topHeaderHeight = 51;
    var mapHeight = $(window).height();
    mapHolder.style.height = mapHeight - topHeaderHeight + 'px';
  };
  function processMap(data) {
    $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyDCWD_q5NoEyVblC1mtS2bl08kukrnzDQs&region=MA', function () {
      var mapHolder = document.getElementById('map');
      if (mapHolder) {
        ajustMapSize(mapHolder);

        var mapProp = {
          center: new google.maps.LatLng(33.57309, -7.6286979),
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          zoom: 14,
          mapTypeControl: false,
          fullscreenControl: false
        };
        window.map = new google.maps.Map(mapHolder, mapProp);

        bindMarkers(map, data);
      }
    });
  }

  // $.getJSON('http://localhost:9000/data.json', processMap)
  processMap(_data2.default);
};

var _index = require('../../components/map-control/index.js');

var _data = require('../../assets/js/data.json');

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"../../assets/js/data.json":3,"../../components/map-control/index.js":25}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var tagFilters = document.querySelectorAll('#mediacenter-detail-filters a');
  var allFilterBtn = document.querySelector('#mediacenter-detail-filter-all');
  var mediaCenterHolder = document.querySelector('#mediacenter-detail-holder');

  if (!mediaCenterHolder) return;

  var state = {
    filters: [],
    data: [{
      type: 'audio',
      tags: ['RSE', 'FINANCE', 'ENTREPRENARIAT'],
      media: 'assets/img/media-img.png'
    }, {
      type: 'image',
      tags: ['RSE', 'FINANCE', 'ENTREPRENARIAT', 'DEVELOPPEMENT DURABLE'],
      media: 'assets/img/media-img.png'
    }, {
      type: 'video',
      tags: ['RSE', 'FINANCE', 'ENTREPRENARIAT', 'DEVELOPPEMENT DURABLE'],
      media: 'assets/img/res-2.png'
    }, {
      type: 'audio',
      tags: ['RSE', 'DEVELOPPEMENT DURABLE'],
      media: 'assets/img/media-img.png'
    }, {
      type: 'video',
      tags: ['RSE', 'FINANCE', 'DEVELOPPEMENT DURABLE'],
      media: 'assets/img/res-2.png'
    }, {
      type: 'image',
      tags: ['RSE', 'FINANCE', 'ENTREPRENARIAT', 'DEVELOPPEMENT DURABLE'],
      media: 'assets/img/media-img.png'
    }, {
      type: 'image',
      tags: ['RSE'],
      media: 'assets/img/media-img.png'
    }, {
      type: 'audio',
      tags: ['RSE', 'FINANCE', 'ENTREPRENARIAT'],
      media: 'assets/img/media-img.png'
    }, {
      type: 'image',
      tags: ['RSE', 'FINANCE', 'ENTREPRENARIAT', 'DEVELOPPEMENT DURABLE'],
      media: 'assets/img/media-img.png'
    }, {
      type: 'video',
      tags: ['RSE', 'FINANCE', 'ENTREPRENARIAT', 'DEVELOPPEMENT DURABLE'],
      media: 'assets/img/res-2.png'
    }, {
      type: 'audio',
      tags: ['RSE', 'DEVELOPPEMENT DURABLE'],
      media: 'assets/img/media-img.png'
    }, {
      type: 'video',
      tags: ['RSE', 'FINANCE', 'DEVELOPPEMENT DURABLE'],
      media: 'assets/img/res-2.png'
    }, {
      type: 'image',
      tags: ['RSE', 'FINANCE', 'ENTREPRENARIAT', 'DEVELOPPEMENT DURABLE'],
      media: 'assets/img/media-img.png'
    }, {
      type: 'image',
      tags: ['RSE'],
      media: 'assets/img/media-img.png'
    }, {
      type: 'audio',
      tags: ['RSE', 'FINANCE', 'ENTREPRENARIAT'],
      media: 'assets/img/media-img.png'
    }, {
      type: 'image',
      tags: ['RSE', 'FINANCE', 'ENTREPRENARIAT', 'DEVELOPPEMENT DURABLE'],
      media: 'assets/img/media-img.png'
    }, {
      type: 'video',
      tags: ['RSE', 'FINANCE', 'ENTREPRENARIAT', 'DEVELOPPEMENT DURABLE'],
      media: 'assets/img/res-2.png'
    }, {
      type: 'audio',
      tags: ['RSE', 'DEVELOPPEMENT DURABLE'],
      media: 'assets/img/media-img.png'
    }, {
      type: 'video',
      tags: ['RSE', 'FINANCE', 'DEVELOPPEMENT DURABLE'],
      media: 'assets/img/res-2.png'
    }, {
      type: 'image',
      tags: ['RSE', 'FINANCE', 'ENTREPRENARIAT', 'DEVELOPPEMENT DURABLE'],
      media: 'assets/img/media-img.png'
    }, {
      type: 'image',
      tags: ['RSE'],
      media: 'assets/img/media-img.png'
    }]
  };

  var $grid = void 0;

  function cleanTag(tagFilter) {
    tagFilter = tagFilter.trim().toLowerCase();
    if (tagFilter[0] == '#') {
      return tagFilter.slice(1);
    }

    return tagFilter;
  }

  function applyFilters() {
    $('.gallery-grid > .grid-item').each(function () {
      var notFound = true;
      $(this).find('.gallery-grid_tags > a').each(function () {
        if (state.filters.includes($(this).text().trim().slice(1).toLowerCase())) {
          notFound = false;
        }
      });
      if (notFound) {
        $(this).hide();
      } else {
        $(this).show();
      }
      console.log(notFound);
      $grid.masonry('layout');
    });

    if (state.filters.length <= 0) {
      $('.gallery-grid > .grid-item').each(function () {
        $(this).show();
        $grid.masonry('layout');
      });
    }
  }

  function changeFilters(e) {
    e.preventDefault();

    this.classList.toggle('active');

    state.filters = [];

    $('#mediacenter-detail-filters a').each(function () {
      if ($(this).hasClass('active')) {
        state.filters.push(cleanTag($(this).text()));
      }
    });

    if (state.filters.length > 0) {
      allFilterBtn.classList.remove('active');
    } else {
      allFilterBtn.classList.add('active');
    }

    applyFilters();
  }

  function init() {
    var newItems = state.data.map(function (post) {
      if (post.type == 'audio') {
        return '<div class="grid-item">\n        <div class="gallery-grid_element gallery-grid_element--empty">\n            <a class="swipebox swipebox--audio" href="' + post.media + '">\n                <div class="content"></div>\n            </a>\n            <div class="gallery-grid_tags">\n                <a href="#" class="btn btn--tag mb-s mr-s">\n                    #INSTITUTIONNELLE\n                </a>\n                <a href="#" class="btn btn--tag mb-s mr-s">\n                    #PARTICULIERS\n                </a>\n            </div>\n        </div>\n    </div>';
      } else if (post.type == 'video') {
        return '<div class="grid-item">\n        <div class="gallery-grid_element gallery-grid_element--2">\n            <a class="swipebox swipebox--video" href="' + post.media + '">\n                <img src="' + post.media + '" alt="">\n            </a>\n            <div class="gallery-grid_tags">\n                <a href="#" class="btn btn--tag mb-s mr-s">\n                    #INSTITUTIONNELLE\n                </a>\n                <a href="#" class="btn btn--tag mb-s mr-s">\n                    #PARTICULIERS\n                </a>\n            </div>\n        </div>\n    </div>';
      } else {
        return '<div class="grid-item">\n        <div class="gallery-grid_element gallery-grid_element--2">\n            <a class="swipebox swipebox--img" href="' + post.media + '">\n                <img src="' + post.media + '" alt="">\n            </a>\n            <div class="gallery-grid_tags">\n            ' + post.tags.map(function (tag) {
          return '<a href="#" class="btn btn--tag mb-s mr-s">\n              #' + tag + '\n            </a>';
        }).join('') + '\n            </div>\n        </div>\n    </div>';
      }
    });

    mediaCenterHolder.innerHTML = ['<div class="grid-sizer"></div>'].concat(_toConsumableArray(newItems)).join('');

    $(window).on('load', function () {
      $grid = gridSetup();
    });

    // setTimeout(() => {
    //   $grid = gridSetup()
    //   console.log('we are in')
    // }, 3000)
  }

  init();

  allFilterBtn.addEventListener('click', function (e) {
    e.preventDefault();
    state.filters = [];
    $('#mediacenter-detail-filters a').each(function () {
      $(this).removeClass('.active');
    });
    this.classList.add('active');
    applyFilters();
  });

  $('#mediacenter-detail-filters a').each(function () {
    $(this).on('click', changeFilters);
  });
};

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var gridSetup = exports.gridSetup = function gridSetup() {
  return $('.gallery-grid').masonry({
    itemSelector: '.grid-item',
    columnWidth: '.grid-sizer',
    percentPosition: true
  });
};

},{}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function () {
  var tagFilters = document.querySelectorAll('#mediacenter-filters a');
  var mediacenterHolder = document.querySelector('#mediacenter-holder');
  var startDate = document.querySelector('.start');
  var endDate = document.querySelector('.end');
  var allFilterBtn = document.querySelector('#mediacenter-filter-all');

  if (tagFilters.length <= 0 || !mediacenterHolder) return;

  var state = {
    filters: [],
    dateFilter: {
      from: '',
      to: ''
    },
    order: 'desc',
    max: 3,
    data: [{
      tags: ['RSE', 'FINANCE', 'ENTREPRENARIAT'],
      date: '21/07/2017',
      title: 'HISTOIRES POPULAIRES',
      content: 'La campagne \u201CHistoires populaires\u201D adopte une d\xE9marche encore plus proche des pr\xE9occupations des gens : ce sont des histoires\n                r\xE9elles de Marocains issus de toutes les classes sociales et qui ont r\xE9ussi \xE0 atteindre leurs objectifs dans\n                diff\xE9rents secteurs de la vie gr\xE2ce au soutien de leur banque.',
      image: 'assets/img/media-img.png'
    }, {
      title: 'HISTOIRES POPULAIRES',
      tags: ['RSE'],
      date: '29/07/2017',
      content: 'La campagne \u201CHistoires populaires\u201D adopte une d\xE9marche encore plus proche des pr\xE9occupations des gens : ce sont des histoires\n        r\xE9elles de Marocains issus de toutes les classes sociales et qui ont r\xE9ussi \xE0 atteindre leurs objectifs dans\n        diff\xE9rents secteurs de la vie gr\xE2ce au soutien de leur banque.',
      image: 'assets/img/media-img.png'
    }, {
      tags: ['RSE', 'ENTREPRENARIAT'],
      date: '22/07/2017',
      title: 'HISTOIRES POPULAIRES',
      content: 'La campagne \u201CHistoires populaires\u201D adopte une d\xE9marche encore plus proche des pr\xE9occupations des gens : ce sont des histoires\n                r\xE9elles de Marocains issus de toutes les classes sociales et qui ont r\xE9ussi \xE0 atteindre leurs objectifs dans\n                diff\xE9rents secteurs de la vie gr\xE2ce au soutien de leur banque.',
      image: 'assets/img/media-img.png'
    }, {
      tags: ['RSE', 'DEVELOPPEMENT DURABLE'],
      date: '23/07/2017',
      title: 'HISTOIRES POPULAIRES',
      content: 'La campagne \u201CHistoires populaires\u201D adopte une d\xE9marche encore plus proche des pr\xE9occupations des gens : ce sont des histoires\n                r\xE9elles de Marocains issus de toutes les classes sociales et qui ont r\xE9ussi \xE0 atteindre leurs objectifs dans\n                diff\xE9rents secteurs de la vie gr\xE2ce au soutien de leur banque.',
      image: 'assets/img/media-img.png'
    }, {
      tags: ['RSE'],
      date: '21/07/2017',
      title: 'HISTOIRES POPULAIRES',
      content: 'La campagne \u201CHistoires populaires\u201D adopte une d\xE9marche encore plus proche des pr\xE9occupations des gens : ce sont des histoires\n                r\xE9elles de Marocains issus de toutes les classes sociales et qui ont r\xE9ussi \xE0 atteindre leurs objectifs dans\n                diff\xE9rents secteurs de la vie gr\xE2ce au soutien de leur banque.',
      image: 'assets/img/media-img.png'
    }, {
      tags: ['RSE', 'FINANCE'],
      date: '24/07/2017',
      title: 'HISTOIRES POPULAIRES',
      content: 'La campagne \u201CHistoires populaires\u201D adopte une d\xE9marche encore plus proche des pr\xE9occupations des gens : ce sont des histoires\n                r\xE9elles de Marocains issus de toutes les classes sociales et qui ont r\xE9ussi \xE0 atteindre leurs objectifs dans\n                diff\xE9rents secteurs de la vie gr\xE2ce au soutien de leur banque.',
      image: 'assets/img/media-img.png'
    }, {
      tags: ['RSE', 'FINANCE'],
      date: '25/07/2017',
      title: 'HISTOIRES POPULAIRES',
      content: 'La campagne \u201CHistoires populaires\u201D adopte une d\xE9marche encore plus proche des pr\xE9occupations des gens : ce sont des histoires\n                r\xE9elles de Marocains issus de toutes les classes sociales et qui ont r\xE9ussi \xE0 atteindre leurs objectifs dans\n                diff\xE9rents secteurs de la vie gr\xE2ce au soutien de leur banque.',
      image: 'assets/img/media-img.png'
    }, {
      tags: ['RSE'],
      date: '26/07/2017',
      title: 'HISTOIRES POPULAIRES',
      content: 'La campagne \u201CHistoires populaires\u201D adopte une d\xE9marche encore plus proche des pr\xE9occupations des gens : ce sont des histoires\n                r\xE9elles de Marocains issus de toutes les classes sociales et qui ont r\xE9ussi \xE0 atteindre leurs objectifs dans\n                diff\xE9rents secteurs de la vie gr\xE2ce au soutien de leur banque.',
      image: 'assets/img/media-img.png'
    }, {
      tags: ['RSE', 'FINANCE'],
      date: '21/07/2017',
      title: 'HISTOIRES POPULAIRES',
      content: 'La campagne \u201CHistoires populaires\u201D adopte une d\xE9marche encore plus proche des pr\xE9occupations des gens : ce sont des histoires\n                r\xE9elles de Marocains issus de toutes les classes sociales et qui ont r\xE9ussi \xE0 atteindre leurs objectifs dans\n                diff\xE9rents secteurs de la vie gr\xE2ce au soutien de leur banque.',
      image: 'assets/img/media-img.png'
    }, {
      tags: ['RSE', 'FINANCE'],
      date: '21/08/2017',
      title: 'HISTOIRES POPULAIRES',
      content: 'La campagne \u201CHistoires populaires\u201D adopte une d\xE9marche encore plus proche des pr\xE9occupations des gens : ce sont des histoires\n                r\xE9elles de Marocains issus de toutes les classes sociales et qui ont r\xE9ussi \xE0 atteindre leurs objectifs dans\n                diff\xE9rents secteurs de la vie gr\xE2ce au soutien de leur banque.',
      image: 'assets/img/media-img.png'
    }, {
      tags: ['RSE'],
      date: '22/08/2016',
      title: 'HISTOIRES POPULAIRES',
      content: 'La campagne \u201CHistoires populaires\u201D adopte une d\xE9marche encore plus proche des pr\xE9occupations des gens : ce sont des histoires\n                r\xE9elles de Marocains issus de toutes les classes sociales et qui ont r\xE9ussi \xE0 atteindre leurs objectifs dans\n                diff\xE9rents secteurs de la vie gr\xE2ce au soutien de leur banque.',
      image: 'assets/img/media-img.png'
    }, {
      tags: ['RSE', 'FINANCE'],
      date: '21/09/2017',
      title: 'HISTOIRES POPULAIRES',
      content: 'La campagne \u201CHistoires populaires\u201D adopte une d\xE9marche encore plus proche des pr\xE9occupations des gens : ce sont des histoires\n                r\xE9elles de Marocains issus de toutes les classes sociales et qui ont r\xE9ussi \xE0 atteindre leurs objectifs dans\n                diff\xE9rents secteurs de la vie gr\xE2ce au soutien de leur banque.',
      image: 'assets/img/media-img.png'
    }, {
      tags: ['RSE', 'FINANCE'],
      date: '21/10/2017',
      title: 'HISTOIRES POPULAIRES',
      content: 'La campagne \u201CHistoires populaires\u201D adopte une d\xE9marche encore plus proche des pr\xE9occupations des gens : ce sont des histoires\n                r\xE9elles de Marocains issus de toutes les classes sociales et qui ont r\xE9ussi \xE0 atteindre leurs objectifs dans\n                diff\xE9rents secteurs de la vie gr\xE2ce au soutien de leur banque.',
      image: 'assets/img/media-img.png'
    }, {
      tags: ['RSE', 'FINANCE'],
      date: '21/07/2018',
      title: 'HISTOIRES POPULAIRES',
      content: 'La campagne \u201CHistoires populaires\u201D adopte une d\xE9marche encore plus proche des pr\xE9occupations des gens : ce sont des histoires\n                r\xE9elles de Marocains issus de toutes les classes sociales et qui ont r\xE9ussi \xE0 atteindre leurs objectifs dans\n                diff\xE9rents secteurs de la vie gr\xE2ce au soutien de leur banque.',
      image: 'assets/img/media-img.png'
    }, {
      tags: ['RSE', 'FINANCE'],
      date: '21/07/2018',
      title: 'HISTOIRES POPULAIRES',
      content: 'La campagne \u201CHistoires populaires\u201D adopte une d\xE9marche encore plus proche des pr\xE9occupations des gens : ce sont des histoires\n                r\xE9elles de Marocains issus de toutes les classes sociales et qui ont r\xE9ussi \xE0 atteindre leurs objectifs dans\n                diff\xE9rents secteurs de la vie gr\xE2ce au soutien de leur banque.',
      image: 'assets/img/media-img.png'
    }, {
      tags: ['RSE', 'FINANCE'],
      date: '21/07/2019',
      title: 'HISTOIRES POPULAIRES',
      content: 'La campagne \u201CHistoires populaires\u201D adopte une d\xE9marche encore plus proche des pr\xE9occupations des gens : ce sont des histoires\n                r\xE9elles de Marocains issus de toutes les classes sociales et qui ont r\xE9ussi \xE0 atteindre leurs objectifs dans\n                diff\xE9rents secteurs de la vie gr\xE2ce au soutien de leur banque.',
      image: 'assets/img/media-img.png'
    }, {
      tags: ['RSE', 'FINANCE'],
      date: '21/07/2020',
      title: 'HISTOIRES POPULAIRES',
      content: 'La campagne \u201CHistoires populaires\u201D adopte une d\xE9marche encore plus proche des pr\xE9occupations des gens : ce sont des histoires\n                r\xE9elles de Marocains issus de toutes les classes sociales et qui ont r\xE9ussi \xE0 atteindre leurs objectifs dans\n                diff\xE9rents secteurs de la vie gr\xE2ce au soutien de leur banque.',
      image: 'assets/img/media-img.png'
    }]
  };

  function cleanTag(tagFilter) {
    tagFilter = tagFilter.toLowerCase();
    if (tagFilter[0] == '#') {
      tagFilter = tagFilter.slice(1);
    }

    return tagFilter;
  }

  function makeDateObject(dateString) {
    var _dateString$split = dateString.split('/'),
        _dateString$split2 = _slicedToArray(_dateString$split, 3),
        day = _dateString$split2[0],
        month = _dateString$split2[1],
        year = _dateString$split2[2];

    return new Date(year, month - 1, day);
  }

  function applyFilters() {
    var data = state.data;
    if (state.filters.length > 0) {
      data = data.filter(function (post) {
        for (var i = 0; i < state.filters.length; i++) {
          if (post.tags.includes(state.filters[i].toUpperCase())) {
            return true;
          }
        }
        return false;
      });
    }

    if (state.dateFilter.from && state.dateFilter.to) {
      data = data.filter(function (post) {
        if (makeDateObject(post.date) - makeDateObject(state.dateFilter.from) >= 0 && makeDateObject(post.date) - makeDateObject(state.dateFilter.to) <= 0) {
          return true;
        }

        return false;
      });
    }

    data = data.sort(function (a, b) {
      return state.order == 'desc' ? makeDateObject(b.date) - makeDateObject(a.date) : makeDateObject(a.date) - makeDateObject(b.date);
    });

    showSelected(data);
  }
  function changeFilters(e) {
    e.preventDefault();

    this.classList.toggle('active');

    state.filters = [];

    tagFilters.forEach(function (tag) {
      if ($(tag).hasClass('active')) {
        state.filters.push(cleanTag(tag.innerText));
      }
    });

    if (state.filters.length > 0) {
      allFilterBtn.classList.remove('active');
    } else {
      allFilterBtn.classList.add('active');
    }

    applyFilters();
  }

  function showSelected(data) {
    var selectedData = data.slice(0, state.max * 3);

    console.log(data.length);
    console.log(selectedData.length);

    if (selectedData.length >= data.length) {
      $('#more-mediacenter').hide();
    } else {
      $('#more-mediacenter').show();
    }

    render(selectedData);
  }

  applyFilters();

  $('#more-mediacenter').on('click', function (e) {
    e.preventDefault();
    state.max++;
    applyFilters();

    this.scrollIntoView({
      behavior: 'smooth',
      inline: 'end'
    });
    if (state.max + 1 > state.data.length / 3) $(this).hide();
  });

  function render(data) {
    mediacenterHolder.innerHTML = data.map(function (post, index) {
      if (index % 2 === 0) {
        return '<div class="media-card my-8 ">\n                    <div class="row">\n                        <a class="col-md-5 media-card__imgside" href="/gbp-front/mediacenter-detail.html">\n                            <img class="media-card__img" src="' + post.image + '" alt="media image">\n                        </a>\n                        <div class="col-md-7 media-card__contentside ">\n                            <div class="card-media__tag ">\n                            ' + post.tags.map(function (tag) {
          return '<a class="btn btn--tag btn--orange active mr-1" href="/gbp-front/mediacenter.html"> #' + tag + '</a>';
        }).join('') + '\n                            </div>\n                            <h2 class="media-card__title">' + post.title + '</h2>\n                            <p class="media-card__content">\n                                ' + post.content + '\n                            </p>\n                            <div class="media-card__footer">\n                                <div class="card-footer__metadata">\n                                    <strong class="card-footer__datetitle">Date de lancement</strong>\n                                    <span class="card-footer__date">' + post.date + '</span>\n                                </div>\n                                <div class="card-footer__action">\n                                    <a href="/gbp-front/mediacenter-detail.html">D\xC9COUVRIR</a>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>';
      } else {
        return '<div class="media-card media-card--reverse my-8">\n          <div class="row">\n              <div class="col-md-7 media-card__contentside">\n                  <div class="card-media__tag ">\n                  ' + post.tags.map(function (tag) {
          return '<a class="btn btn--tag btn--orange active mr-1" href="/gbp-front/mediacenter.html"> #' + tag + '</a>';
        }).join('') + '\n                  </div>\n                  <h2 class="media-card__title">' + post.title + '</h2>\n                  <p class="media-card__content">\n                  ' + post.content + '\n                  </p>\n                  <div class="media-card__footer">\n                      <div class="card-footer__metadata">\n                          <strong class="card-footer__datetitle">Date de lancement</strong>\n                          <span class="card-footer__date">' + post.date + '</span>\n                      </div>\n                      <div class="card-footer__action">\n                          <a href="/gbp-front/mediacenter-detail.html">D\xC9COUVRIR</a>\n                      </div>\n                  </div>\n              </div>\n              <a class="col-md-5 media-card__imgside" href="/gbp-front/mediacenter-detail.html">\n                  <img class="media-card__img" src="' + post.image + '" alt="media image">\n              </a>\n          </div>\n      </div>';
      }
    }).join('');
  }

  function dateFormat(date) {
    return '1/' + (date.month() + 1) + '/' + date.year();
  }

  var startFilter = new _index2.default(startDate, false, function (start) {
    state.dateFilter.from = dateFormat(start);
    applyFilters();
  });
  startFilter.init();

  var endFilter = new _index2.default(endDate, true, function (end) {
    state.dateFilter.to = dateFormat(end);
    applyFilters();
  });
  endFilter.init();

  $('#mediacenter-select-filter').on('change', function () {
    var selected = $('#mediacenter-select-filter').next().find('.current').text();
    selected = selected.toLowerCase();

    // console.log(selected)

    $('#date-filter').addClass('d-flex');
    $('#date-filter').show();

    if (selected !== 'période') {
      $('#date-filter').removeClass('d-flex');
      $('#date-filter').hide();
      state.order = 'desc';
      state.dateFilter.from = '';
      state.dateFilter.to = '';
      startFilter.clear();
      endFilter.clear();
    }

    if (selected === 'plus anciens') {
      state.order = 'asc';
      applyFilters();
    } else if (selected === 'plus récents') {
      applyFilters();
      state.order = 'desc';
    }
  });

  allFilterBtn.addEventListener('click', function (e) {
    e.preventDefault();
    state.filters = [];
    tagFilters.forEach(function (tag) {
      tag.classList.remove('active');
    });
    this.classList.add('active');
    applyFilters();
  });
  tagFilters.forEach(function (tag) {
    tag.addEventListener('click', changeFilters);
  });
};

var _index = require('../../components/date-filter/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"../../components/date-filter/index.js":15}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {

    var sliderIndex;

    if ($('.nos-banques').length) {
        handleEventListeners();
    }

    if ($('.nos-banques .owl-carousel').length) {

        var rtl = $('html').attr('dir') == 'rtl';

        if ($(window).width() > 768) {
            $('.nos-banques .owl-carousel').owlCarousel('destroy');
            banquesSlider(0, rtl);
        } else {
            $('.nos-banques .owl-carousel').owlCarousel('destroy');
            banquesSlider(0, rtl);
        }

        $(window).on('resize', function () {

            if ($(window).width() > 768) {
                $('.nos-banques .owl-carousel').owlCarousel('destroy');
                banquesSlider(0, rtl);
            } else {
                $('.nos-banques .owl-carousel').owlCarousel('destroy');
                banquesSlider(0, rtl);
            }
        });
    }

    function removeHash() {
        history.pushState('', document.title, window.location.pathname + window.location.search);
    }

    function banquesSlider(stagePadding, rtl) {
        var owl = $('.nos-banques .owl-carousel').owlCarousel({
            stagePadding: stagePadding,
            margin: 0,
            dots: true,
            nav: true,
            loop: true,
            URLhashListener: true,
            navSpeed: 1000,
            rtl: rtl,
            responsive: {
                0: {
                    items: 1
                }
            }
        });

        owl.on("drag.owl.carousel", function (event) {

            if (event.relatedTarget['_drag']['direction']) {

                var indexBeforeChange = event.page.index;

                sliderIndex = indexBeforeChange;
            }
        });

        owl.on("dragged.owl.carousel", function (event) {

            var indexAfterChange = event.page.index;

            if (event.relatedTarget['_drag']['direction']) {

                if (indexAfterChange !== sliderIndex) {
                    if (event.relatedTarget['_drag']['direction'] === "left") {
                        next();
                    } else {
                        prev();
                    }
                }
            }

            //console.log(event)
        });

        $('.owl-next').on('click', function () {
            next();
        });

        $('.owl-prev').on('click', function () {
            prev();
        });

        function next() {
            var currentItem = $('.nos-banques_links .item.active');

            currentItem.removeClass('active');

            if (currentItem.is(':last-child')) {
                $('.nos-banques_links .item:first-child').addClass('active');
            } else {
                currentItem.next().addClass('active');
            }
        }

        function prev() {
            var currentItem = $('.nos-banques_links .item.active');

            currentItem.removeClass('active');

            if (currentItem.is(':first-child')) {
                $('.nos-banques_links .item:last-child').addClass('active');
            } else {
                currentItem.prev().addClass('active');
            }
        }
    }

    function handleEventListeners() {

        $('.nos-banques_links .item:first-child').addClass('active');

        $('.nos-banques_links .item').on('click', function () {

            var clickedItem = $(this);

            if (!clickedItem.hasClass('active')) {
                $('.nos-banques_links .item.active').removeClass('active');
                clickedItem.addClass('active');
            }
        });
    }
};

},{}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var searchInput = document.querySelector('#popup-search-input');
  var tagFilters = document.querySelectorAll('.popup-search_tag');
  var allFilterBtn = document.querySelector('.popup-search_tag--all');

  if (!searchInput) return;

  var state = {
    search: '',
    filters: [],
    data: [{
      category: 'ACTUALITES',
      tags: ['articles', 'videos'],
      text: 'Lorem1 ipsum dolor set amet'
    }, {
      category: 'ACTUALITES',
      tags: ['articles', 'videos'],
      text: 'Lorem2 ipsum dolor set amet'
    }, {
      category: 'ACTUALITES',
      tags: ['articles', 'videos', 'images'],
      text: 'Lorem1 ipsum dolor set amet'
    }, {
      category: 'ACTUALITES',
      tags: ['articles', 'videos'],
      text: 'Lorem3 ipsum dolor set amet'
    }, {
      category: 'COMMUNIQUÉS',
      tags: ['articles', 'videos', 'images'],
      text: 'Lorem1 ipsum dolor set amet'
    }, {
      category: 'COMMUNIQUÉS',
      tags: ['articles', 'videos'],
      text: 'Lorem1 ipsum dolor set amet'
    }, {
      category: 'COMMUNIQUÉS',
      tags: ['articles', 'videos', 'images'],
      text: 'Lorem2 ipsum dolor set amet'
    }, {
      category: 'COMMUNIQUÉS',
      tags: ['articles', 'videos'],
      text: 'Lorem1 ipsum dolor set amet'
    }, {
      category: 'COMMUNIQUÉS',
      tags: ['articles', 'videos'],
      text: 'Lorem3 ipsum dolor set amet'
    }, {
      category: 'PRESSE',
      tags: ['articles', 'videos', 'images'],
      text: 'Lorem2 ipsum dolor set amet'
    }, {
      category: 'PRESSE',
      tags: ['articles', 'videos'],
      text: 'Lorem1 ipsum dolor set amet'
    }, {
      category: 'PRESSE',
      tags: ['articles', 'videos'],
      text: 'Lorem3 ipsum dolor set amet'
    }, {
      category: 'COMPAGNES PUB',
      tags: ['articles', 'videos', 'images'],
      text: 'Lorem2 ipsum dolor set amet'
    }, {
      category: 'COMPAGNES PUB',
      tags: ['articles', 'videos'],
      text: 'Lorem1 ipsum dolor set amet'
    }, {
      category: 'RAPPORTS FINANCIERS',
      tags: ['articles', 'videos'],
      text: 'Lorem3 ipsum dolor set amet'
    }, {
      category: 'RAPPORTS FINANCIERS',
      tags: ['articles', 'videos', 'images'],
      text: 'Lorem2 ipsum dolor set amet'
    }, {
      category: 'RAPPORTS FINANCIERS',
      tags: ['articles', 'videos'],
      text: 'Lorem1 ipsum dolor set amet'
    }, {
      category: 'RAPPORTS FINANCIERS',
      tags: ['articles', 'videos'],
      text: 'Lorem3 ipsum dolor set amet'
    }, {
      category: 'AUTRES',
      tags: ['articles', 'videos', 'images'],
      text: 'Lorem2 ipsum dolor set amet'
    }, {
      category: 'AUTRES',
      tags: ['articles', 'videos'],
      text: 'Lorem1 ipsum dolor set amet'
    }, {
      category: 'AUTRES',
      tags: ['articles', 'videos'],
      text: 'Lorem3 ipsum dolor set amet'
    }]
  };

  function cleanTag(tagFilter) {
    tagFilter = tagFilter.trim().toLowerCase();
    if (tagFilter[0] == '#') {
      tagFilter = tagFilter.slice(1);
    }

    return tagFilter;
  }

  function matchTags(tags, filters) {
    return tags.some(function (tag) {
      for (var i = 0; i < filters.length; i++) {
        if (tag.includes(filters[i])) return true;
      }

      return false;
    });
  }

  function checkSearchResult() {
    if (state.search) {
      $('.popup-search_result').show();
    } else {
      $('.popup-search_result').hide();
    }
  }

  function applyFilters() {
    var data = state.data;

    if (state.search) {
      data = data.filter(function (post) {
        if (post.text.toLowerCase().includes(state.search.toLowerCase()) && (matchTags(post.tags, state.filters) || state.filters.length <= 0)) {
          return true;
        }
        return false;
      }).map(function (post) {
        var regexp = new RegExp('(' + state.search + ')', 'i');

        var text = post.text.replace(regexp, '<span class="found" >$1</span>');

        return {
          category: post.category,
          tags: [].concat(_toConsumableArray(post.tags)),
          text: text
        };
      });
    }

    checkSearchResult();

    render(data);
  }

  function filterAndMap(elem, data, category) {
    var foundResult = data.filter(function (post) {
      if (post.category === 'COMMUNIQUÉS') return true;

      return false;
    }).map(function (post) {
      var text = post.text;
      return '<li class="item">\n              <a href="/gbp-front/news-detail.html">\n                  ' + text + '\n              </a>\n          </li>';
    });

    elem.find('ul').html(foundResult.join(''));
    elem.find('.popup-menu_length').text(foundResult.length);
    if (foundResult.length <= 0) {
      elem.find('.item-plus').hide();
    } else {
      elem.find('.item-plus').show();
    }
  }

  function render(data) {
    // console.log(data)

    // COMMUNIQUÉS
    filterAndMap($('#search-communiques'), data, 'COMMUNIQUÉS');
    // ACTUALITES
    filterAndMap($('#search-actualites'), data, 'ACTUALITES');
    // RAPPORTS FINANCIERS
    filterAndMap($('#search-rapports'), data, 'RAPPORTS FINANCIERS');
    // AUTRES
    filterAndMap($('#search-autres'), data, 'AUTRES');
    // PRESSE
    filterAndMap($('#search-presse'), data, 'PRESSE');
    // COMPAGNES PUB
    filterAndMap($('#search-compagnes'), data, 'COMPAGNES PUB');
  }

  function changeFilters(e) {
    e.preventDefault();

    this.classList.toggle('active');

    state.filters = [];

    tagFilters.forEach(function (tag) {
      if ($(tag).hasClass('active')) {
        state.filters.push(cleanTag(tag.innerText));
      }
    });

    // console.log(state.filters)

    if (state.filters.length > 0) {
      allFilterBtn.classList.remove('active');
    } else {
      allFilterBtn.classList.add('active');
    }

    applyFilters();
  }

  allFilterBtn.addEventListener('click', function (e) {
    e.preventDefault();
    state.filters = [];
    tagFilters.forEach(function (tag) {
      tag.classList.remove('active');
    });
    this.classList.add('active');
    applyFilters();
  });

  tagFilters.forEach(function (tag) {
    tag.addEventListener('click', changeFilters);
  });

  searchInput.addEventListener('input', function () {
    state.search = this.value;
    applyFilters();
  });
};

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

},{}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  if ($('.header_search').length) {
    addEventListeners();
  }

  function addEventListeners() {
    $('.header_search-pop, .header_mobile-search').on('click', function () {
      $('.page-content').addClass('d-none');
      $('.popup-search').removeClass('d-none');
    });

    $('.close-wrapper').on('click', function () {
      $('.page-content').removeClass('d-none');
      $('.popup-search').addClass('d-none');
    });
  }
};

},{}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if ($('.swipebox--video').length) {
		addEventListeners();
	}

	function addEventListeners() {
		$('.swipebox--video').on('click', function () {
			$('.page-content').addClass('d-none');
			$('.popup-video').removeClass('d-none');
		});

		$('.close-wrapper').on('click', function () {
			$('.page-content').removeClass('d-none');
			$('.popup-video_section iframe').remove();
			$('.popup-video').addClass('d-none');
		});

		$('.swipebox--video').on('click', function (e) {
			var ytbId = $(this).attr('href');

			e.preventDefault();
			playVideo(ytbId);
		});

		$('.popup-video_slider .swipebox--video').on('click', function (e) {
			var ytbId = $(this).attr('href');

			e.preventDefault();
			playVideo(ytbId);
		});
	}

	function playVideo(ytbId) {

		var html = '<iframe  width="100%" height="400" \n\t\t\t\t\t\tsrc="https://www.youtube.com/embed/' + ytbId + '?autoplay=1" \n\t\t\t\t\t\tframeborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';

		$('.popup-video_section iframe').remove();

		$('.popup-video_section').prepend(html);
	}

	// carousel video
	if ($('.popup-video_slider').length) {

		var rtl = $('html').attr('dir') == 'rtl';

		if ($(window).width() > 768) {
			popupVideoSlider(0, rtl);
		} else {
			popupVideoSlider(20, rtl);
		}

		$(window).on('resize', function () {
			if ($(window).width() > 768) {
				popupVideoSlider(0, rtl);
			} else {
				popupVideoSlider(20, rtl);
			}
		});
	}

	function popupVideoSlider(stagePadding, rtl) {
		$('.popup-video_slider.owl-carousel').owlCarousel({
			stagePadding: stagePadding,
			margin: 10,
			dots: false,
			nav: false,
			loop: false,
			rtl: rtl,
			responsive: {
				0: {
					items: 1
				},
				768: {
					items: 5
				}
			}
		});
	}
};

},{}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  if ($('.pub-slider').length) {
    if ($(window).width() > 991) {
      articleSlider(0);
    } else {
      articleSlider(0);
    }

    $(window).on('resize', function () {
      if ($(window).width() > 991) {
        articleSlider(0);
      } else {
        articleSlider(0);
      }
    });
  }

  function articleSlider(stagePadding) {
    $('.pub-slider.owl-carousel').owlCarousel({
      stagePadding: stagePadding,
      margin: 18,
      dots: true,
      nav: true,
      loop: true,
      responsive: {
        0: {
          items: 1
        },
        992: {
          items: 1
        }
      }
    });
  }
};

},{}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var tagFilters = document.querySelectorAll('#result-filters a');
  var allFilterBtn = document.querySelector('#result-filter-all');
  var acualitesHolder = document.querySelector('#result-acualites-holder');

  if (!acualitesHolder) return;

  var state = {
    filters: [],
    search: '',
    type: 'documents',
    data: {
      actualites: [{
        type: 'article-img',
        tags: ['RSE', 'FINANCE', 'ENTREPRENARIAT'],
        date: '21/07/2017',
        title: 'une ambiance festive et familiale que s’est déroulé',
        content: 'Le Groupe BCP, acteur panafricain de référence, et la Société FinaTncière Internationale (IFC)...',
        image: 'assets/img/actu-2.png'
      }, {
        type: 'article',
        tags: ['RSE', 'ENTREPRENARIAT'],
        date: '22/07/2017',
        title: 'une ambiance festive et familiale que s’est déroulé',
        content: 'Le Groupe BCP, acteur panafricain de référence, et la Société FinaTncière Internationale (IFC)...'
      }, {
        type: 'article',
        tags: ['RSE', 'DEVELOPPEMENT DURABLE'],
        date: '23/07/2017',
        title: 'une ambiance festive et familiale que s’est déroulé',
        content: 'Le Groupe BCP, acteur panafricain de référence, et la Société FinaTncière Internationale (IFC)...'
      }, {
        type: 'article',
        tags: ['RSE'],
        date: '21/07/2017',
        title: 'une ambiance festive et familiale que s’est déroulé',
        content: 'Le Groupe BCP, acteur panafricain de référence, et la Société FinaTncière Internationale (IFC)...'
      }],
      communiques: [{
        tags: ['RSE', 'FINANCE'],
        date: '21/07/2018',
        title: 'Le Groupe BCP lance la première banque marocaine dédiée à l’activité “titres”',
        size: 450,
        type: 'pdf'
      }, {
        tags: ['RSE', 'FINANCE'],
        date: '21/07/2018',
        title: 'Le Groupe BCP lance la première banque marocaine dédiée à l’activité “titres”',
        size: 450,
        type: 'pdf'
      }, {
        tags: ['RSE', 'FINANCE'],
        date: '21/07/2019',
        title: 'Le Groupe BCP lance la première banque marocaine dédiée à l’activité “titres”',
        size: 450,
        type: 'pdf'
      }, {
        tags: ['RSE', 'FINANCE'],
        date: '21/07/2020',
        title: 'Le Groupe BCP lance la première banque marocaine dédiée à l’activité “titres”',
        size: 450,
        type: 'pdf'
      }],
      compagnes: [{
        tags: ['RSE', 'FINANCE'],
        date: '21/07/2018',
        title: 'HISTOIRES POPULAIRES',
        content: 'La campagne \u201CHistoires populaires\u201D adopte une d\xE9marche encore plus proche des pr\xE9occupations des gens : ce sont des histoires\n                r\xE9elles de Marocains issus de toutes les classes sociales et qui ont r\xE9ussi \xE0 atteindre leurs objectifs dans\n                diff\xE9rents secteurs de la vie gr\xE2ce au soutien de leur banque.',
        image: 'assets/img/media-img.png'
      }, {
        tags: ['RSE', 'FINANCE'],
        date: '21/07/2018',
        title: 'HISTOIRES POPULAIRES',
        content: 'La campagne \u201CHistoires populaires\u201D adopte une d\xE9marche encore plus proche des pr\xE9occupations des gens : ce sont des histoires\n                r\xE9elles de Marocains issus de toutes les classes sociales et qui ont r\xE9ussi \xE0 atteindre leurs objectifs dans\n                diff\xE9rents secteurs de la vie gr\xE2ce au soutien de leur banque.',
        image: 'assets/img/media-img.png'
      }, {
        tags: ['RSE', 'FINANCE'],
        date: '21/07/2019',
        title: 'HISTOIRES POPULAIRES',
        content: 'La campagne \u201CHistoires populaires\u201D adopte une d\xE9marche encore plus proche des pr\xE9occupations des gens : ce sont des histoires\n                r\xE9elles de Marocains issus de toutes les classes sociales et qui ont r\xE9ussi \xE0 atteindre leurs objectifs dans\n                diff\xE9rents secteurs de la vie gr\xE2ce au soutien de leur banque.',
        image: 'assets/img/media-img.png'
      }, {
        tags: ['RSE', 'FINANCE'],
        date: '21/07/2020',
        title: 'HISTOIRES POPULAIRES',
        content: 'La campagne \u201CHistoires populaires\u201D adopte une d\xE9marche encore plus proche des pr\xE9occupations des gens : ce sont des histoires\n                r\xE9elles de Marocains issus de toutes les classes sociales et qui ont r\xE9ussi \xE0 atteindre leurs objectifs dans\n                diff\xE9rents secteurs de la vie gr\xE2ce au soutien de leur banque.',
        image: 'assets/img/media-img.png'
      }]
    }
  };

  function applyFilters() {
    $('.header-section_search-result').text(state.search);

    var data = state.data;
    if (state.filters.length > 0) {
      data.actualites = state.data.actualites.filter(function (post) {
        for (var i = 0; i < state.filters.length; i++) {
          if (post.tags.includes(state.filters[i].toUpperCase())) {
            return true;
          }
        }
        return false;
      });
    }
    render(data);
  }

  function render(data) {}

  function cleanTag(tagFilter) {
    tagFilter = tagFilter.trim().toLowerCase();
    if (tagFilter[0] == '#') {
      return tagFilter.slice(1);
    }

    return tagFilter;
  }

  function changeFilters(e) {
    e.preventDefault();

    this.classList.toggle('active');

    state.filters = [];

    tagFilters.forEach(function (tag) {
      if ($(tag).hasClass('active')) {
        state.filters.push(cleanTag(tag.innerText));
      }
    });

    if (state.filters.length > 0) {
      allFilterBtn.classList.remove('active');
    } else {
      allFilterBtn.classList.add('active');
    }

    applyFilters();
  }

  function submitForm(e) {
    e.preventDefault();
    state.search = $('#result-search').val();
    applyFilters();
  }

  allFilterBtn.addEventListener('click', function (e) {
    e.preventDefault();
    state.filters = [];
    tagFilters.forEach(function (tag) {
      tag.classList.remove('active');
    });
    this.classList.add('active');
    applyFilters();
  });

  tagFilters.forEach(function (tag) {
    tag.addEventListener('click', changeFilters);
  });

  $('#result-select-type').on('change', function () {
    state.type = $(this).next().find('.current').text().toLowerCase();
    applyFilters();
  });

  $('#result-search-btn').on('click', submitForm);
  $('#search-form').on('submit', submitForm);
};

},{}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	$('select.nice-select').niceSelect();
};

},{}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if ($('.swipebox').length) {
		//$('.swipebox').swipebox();
	}
};

},{}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tracker = tracker;

exports.default = function () {
  var data = {
    periods: [{
      year: 2018,
      actions: {
        left: [{
          date: '11-01-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!'
        }, {
          date: '11-02-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!'
        }, {
          date: '11-03-2018',
          title: 'DISTINCTIONS<br> &TROPHÉES',
          content: '<span class="timeline_card_smalltitle">\n                        African Banker Awards 2015\n                      </span>\n                      Troph\xE9e \xAB Banque Africaine de l\u2019Ann\xE9e \xBB d\xE9cern\xE9 au Groupe Banque Centrale Populaire Troph\xE9e \xAB Inclusion Financi\xE8re \xBB remport\xE9\n                      par la filiale Attawfiq Micro-Finance. Cartes\n                      <span class="timeline_card_smalltitle">\n                        Afrique Awards 2015\n                      </span>\n                      Obtention du troph\xE9e \xAB Best Innovative Card Programme \xBB attribu\xE9 \xE0 \xAB GlobalCard \xBB, une carte mon\xE9tique pr\xE9pay\xE9e destin\xE9e\n                      aux voyageurs de passage au Maroc et qui constitue un moyen de substitution \xE0 la monnaie fiduciaire.\n                      <span class="timeline_card_smalltitle">\n                        Morocco MasterCard Customers Meetings 2015\n                      </span>\n                      Le Groupe Banque Centrale Populaire a remport\xE9 \xE0 cette occasion le troph\xE9e de champion national d\u2019activation des cartes de\n                      paiement TPE \xAB Pos Usage Activation Champion \xBB.'
        }],
        right: [{
          date: '11-03-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!',
          media: 'assets/img/res-2.png'
        }, {
          date: '11-03-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!',
          media: 'assets/img/explorer-metiers2.png'
        }]
      }
    }, {
      year: 2017,
      actions: {
        left: [{
          date: '11-01-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!'
        }, {
          date: '11-02-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!'
        }, {
          date: '11-03-2018',
          title: 'DISTINCTIONS<br> &TROPHÉES',
          content: '<span class="timeline_card_smalltitle">\n                        African Banker Awards 2015\n                      </span>\n                      Troph\xE9e \xAB Banque Africaine de l\u2019Ann\xE9e \xBB d\xE9cern\xE9 au Groupe Banque Centrale Populaire Troph\xE9e \xAB Inclusion Financi\xE8re \xBB remport\xE9\n                      par la filiale Attawfiq Micro-Finance. Cartes\n                      <span class="timeline_card_smalltitle">\n                        Afrique Awards 2015\n                      </span>\n                      Obtention du troph\xE9e \xAB Best Innovative Card Programme \xBB attribu\xE9 \xE0 \xAB GlobalCard \xBB, une carte mon\xE9tique pr\xE9pay\xE9e destin\xE9e\n                      aux voyageurs de passage au Maroc et qui constitue un moyen de substitution \xE0 la monnaie fiduciaire.\n                      <span class="timeline_card_smalltitle">\n                        Morocco MasterCard Customers Meetings 2015\n                      </span>\n                      Le Groupe Banque Centrale Populaire a remport\xE9 \xE0 cette occasion le troph\xE9e de champion national d\u2019activation des cartes de\n                      paiement TPE \xAB Pos Usage Activation Champion \xBB.'
        }],
        right: [{
          date: '11-03-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!',
          media: 'assets/img/res-2.png'
        }, {
          date: '11-03-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!',
          media: 'assets/img/explorer-metiers2.png'
        }]
      }
    }, {
      year: 2016,
      actions: {
        left: [{
          date: '11-01-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!'
        }, {
          date: '11-02-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!'
        }, {
          date: '11-03-2018',
          title: 'DISTINCTIONS<br> &TROPHÉES',
          content: '<span class="timeline_card_smalltitle">\n                        African Banker Awards 2015\n                      </span>\n                      Troph\xE9e \xAB Banque Africaine de l\u2019Ann\xE9e \xBB d\xE9cern\xE9 au Groupe Banque Centrale Populaire Troph\xE9e \xAB Inclusion Financi\xE8re \xBB remport\xE9\n                      par la filiale Attawfiq Micro-Finance. Cartes\n                      <span class="timeline_card_smalltitle">\n                        Afrique Awards 2015\n                      </span>\n                      Obtention du troph\xE9e \xAB Best Innovative Card Programme \xBB attribu\xE9 \xE0 \xAB GlobalCard \xBB, une carte mon\xE9tique pr\xE9pay\xE9e destin\xE9e\n                      aux voyageurs de passage au Maroc et qui constitue un moyen de substitution \xE0 la monnaie fiduciaire.\n                      <span class="timeline_card_smalltitle">\n                        Morocco MasterCard Customers Meetings 2015\n                      </span>\n                      Le Groupe Banque Centrale Populaire a remport\xE9 \xE0 cette occasion le troph\xE9e de champion national d\u2019activation des cartes de\n                      paiement TPE \xAB Pos Usage Activation Champion \xBB.'
        }],
        right: [{
          date: '11-03-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!',
          media: 'assets/img/res-2.png'
        }, {
          date: '11-03-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!',
          media: 'assets/img/explorer-metiers2.png'
        }]
      }
    }, {
      year: 2015,
      actions: {
        left: [{
          date: '11-01-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!'
        }, {
          date: '11-02-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!'
        }, {
          date: '11-03-2018',
          title: 'DISTINCTIONS<br> &TROPHÉES',
          content: '<span class="timeline_card_smalltitle">\n                        African Banker Awards 2015\n                      </span>\n                      Troph\xE9e \xAB Banque Africaine de l\u2019Ann\xE9e \xBB d\xE9cern\xE9 au Groupe Banque Centrale Populaire Troph\xE9e \xAB Inclusion Financi\xE8re \xBB remport\xE9\n                      par la filiale Attawfiq Micro-Finance. Cartes\n                      <span class="timeline_card_smalltitle">\n                        Afrique Awards 2015\n                      </span>\n                      Obtention du troph\xE9e \xAB Best Innovative Card Programme \xBB attribu\xE9 \xE0 \xAB GlobalCard \xBB, une carte mon\xE9tique pr\xE9pay\xE9e destin\xE9e\n                      aux voyageurs de passage au Maroc et qui constitue un moyen de substitution \xE0 la monnaie fiduciaire.\n                      <span class="timeline_card_smalltitle">\n                        Morocco MasterCard Customers Meetings 2015\n                      </span>\n                      Le Groupe Banque Centrale Populaire a remport\xE9 \xE0 cette occasion le troph\xE9e de champion national d\u2019activation des cartes de\n                      paiement TPE \xAB Pos Usage Activation Champion \xBB.'
        }],
        right: [{
          date: '11-03-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!',
          media: 'assets/img/res-2.png'
        }, {
          date: '11-03-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!',
          media: 'assets/img/explorer-metiers2.png'
        }]
      }
    }, {
      year: 2014,
      actions: {
        left: [{
          date: '11-01-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!'
        }, {
          date: '11-02-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!'
        }, {
          date: '11-03-2018',
          title: 'DISTINCTIONS<br> &TROPHÉES',
          content: '<span class="timeline_card_smalltitle">\n                        African Banker Awards 2015\n                      </span>\n                      Troph\xE9e \xAB Banque Africaine de l\u2019Ann\xE9e \xBB d\xE9cern\xE9 au Groupe Banque Centrale Populaire Troph\xE9e \xAB Inclusion Financi\xE8re \xBB remport\xE9\n                      par la filiale Attawfiq Micro-Finance. Cartes\n                      <span class="timeline_card_smalltitle">\n                        Afrique Awards 2015\n                      </span>\n                      Obtention du troph\xE9e \xAB Best Innovative Card Programme \xBB attribu\xE9 \xE0 \xAB GlobalCard \xBB, une carte mon\xE9tique pr\xE9pay\xE9e destin\xE9e\n                      aux voyageurs de passage au Maroc et qui constitue un moyen de substitution \xE0 la monnaie fiduciaire.\n                      <span class="timeline_card_smalltitle">\n                        Morocco MasterCard Customers Meetings 2015\n                      </span>\n                      Le Groupe Banque Centrale Populaire a remport\xE9 \xE0 cette occasion le troph\xE9e de champion national d\u2019activation des cartes de\n                      paiement TPE \xAB Pos Usage Activation Champion \xBB.'
        }],
        right: [{
          date: '11-03-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!',
          media: 'assets/img/res-2.png'
        }, {
          date: '11-03-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!',
          media: 'assets/img/explorer-metiers2.png'
        }]
      }
    }, {
      year: 2013,
      actions: {
        left: [{
          date: '11-01-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!'
        }, {
          date: '11-02-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!'
        }, {
          date: '11-03-2018',
          title: 'DISTINCTIONS<br> &TROPHÉES',
          content: '<span class="timeline_card_smalltitle">\n                        African Banker Awards 2015\n                      </span>\n                      Troph\xE9e \xAB Banque Africaine de l\u2019Ann\xE9e \xBB d\xE9cern\xE9 au Groupe Banque Centrale Populaire Troph\xE9e \xAB Inclusion Financi\xE8re \xBB remport\xE9\n                      par la filiale Attawfiq Micro-Finance. Cartes\n                      <span class="timeline_card_smalltitle">\n                        Afrique Awards 2015\n                      </span>\n                      Obtention du troph\xE9e \xAB Best Innovative Card Programme \xBB attribu\xE9 \xE0 \xAB GlobalCard \xBB, une carte mon\xE9tique pr\xE9pay\xE9e destin\xE9e\n                      aux voyageurs de passage au Maroc et qui constitue un moyen de substitution \xE0 la monnaie fiduciaire.\n                      <span class="timeline_card_smalltitle">\n                        Morocco MasterCard Customers Meetings 2015\n                      </span>\n                      Le Groupe Banque Centrale Populaire a remport\xE9 \xE0 cette occasion le troph\xE9e de champion national d\u2019activation des cartes de\n                      paiement TPE \xAB Pos Usage Activation Champion \xBB.'
        }],
        right: [{
          date: '11-03-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!',
          media: 'assets/img/res-2.png'
        }, {
          date: '11-03-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!',
          media: 'assets/img/explorer-metiers2.png'
        }]
      }
    }, {
      year: 2012,
      actions: {
        left: [{
          date: '11-01-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!'
        }, {
          date: '11-02-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!'
        }, {
          date: '11-03-2018',
          title: 'DISTINCTIONS<br> &TROPHÉES',
          content: '<span class="timeline_card_smalltitle">\n                        African Banker Awards 2015\n                      </span>\n                      Troph\xE9e \xAB Banque Africaine de l\u2019Ann\xE9e \xBB d\xE9cern\xE9 au Groupe Banque Centrale Populaire Troph\xE9e \xAB Inclusion Financi\xE8re \xBB remport\xE9\n                      par la filiale Attawfiq Micro-Finance. Cartes\n                      <span class="timeline_card_smalltitle">\n                        Afrique Awards 2015\n                      </span>\n                      Obtention du troph\xE9e \xAB Best Innovative Card Programme \xBB attribu\xE9 \xE0 \xAB GlobalCard \xBB, une carte mon\xE9tique pr\xE9pay\xE9e destin\xE9e\n                      aux voyageurs de passage au Maroc et qui constitue un moyen de substitution \xE0 la monnaie fiduciaire.\n                      <span class="timeline_card_smalltitle">\n                        Morocco MasterCard Customers Meetings 2015\n                      </span>\n                      Le Groupe Banque Centrale Populaire a remport\xE9 \xE0 cette occasion le troph\xE9e de champion national d\u2019activation des cartes de\n                      paiement TPE \xAB Pos Usage Activation Champion \xBB.'
        }],
        right: [{
          date: '11-03-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!',
          media: 'assets/img/res-2.png'
        }, {
          date: '11-03-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!',
          media: 'assets/img/explorer-metiers2.png'
        }]
      }
    }, {
      year: 2011,
      actions: {
        left: [{
          date: '11-01-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!'
        }, {
          date: '11-02-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!'
        }, {
          date: '11-03-2018',
          title: 'DISTINCTIONS<br> &TROPHÉES',
          content: '<span class="timeline_card_smalltitle">\n                        African Banker Awards 2015\n                      </span>\n                      Troph\xE9e \xAB Banque Africaine de l\u2019Ann\xE9e \xBB d\xE9cern\xE9 au Groupe Banque Centrale Populaire Troph\xE9e \xAB Inclusion Financi\xE8re \xBB remport\xE9\n                      par la filiale Attawfiq Micro-Finance. Cartes\n                      <span class="timeline_card_smalltitle">\n                        Afrique Awards 2015\n                      </span>\n                      Obtention du troph\xE9e \xAB Best Innovative Card Programme \xBB attribu\xE9 \xE0 \xAB GlobalCard \xBB, une carte mon\xE9tique pr\xE9pay\xE9e destin\xE9e\n                      aux voyageurs de passage au Maroc et qui constitue un moyen de substitution \xE0 la monnaie fiduciaire.\n                      <span class="timeline_card_smalltitle">\n                        Morocco MasterCard Customers Meetings 2015\n                      </span>\n                      Le Groupe Banque Centrale Populaire a remport\xE9 \xE0 cette occasion le troph\xE9e de champion national d\u2019activation des cartes de\n                      paiement TPE \xAB Pos Usage Activation Champion \xBB.'
        }],
        right: [{
          date: '11-03-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!',
          media: 'assets/img/res-2.png'
        }, {
          date: '11-03-2018',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, suscipit!',
          media: 'assets/img/explorer-metiers2.png'
        }]
      }
    }]
  };

  var dataIndex = 1;

  var mappedData = data.periods.map(function (period) {
    return '<div class="timeline_period">\n              <span class="timeline_period_date">' + period.year + '</span>\n                <div class="row">\n                   <div class="col-md-6 mt-3">\n\n                    ' + period.actions.left.map(function (action) {
      return '<div class="timeline_card timeline_card-left">\n                        <div class="timeline_card_content">\n                            <p class="timeline_card_date">' + action.date + '</p>\n                            ' + (action.title ? '<h2 class="timeline_card_title">' + action.title + '</h2>' : '') + '\n                            <p class="timeline_card_text">' + action.content + '</p>\n                        </div>\n                        ' + (action.media ? '<a class="swipebox swipebox--video" href="' + action.media + '">\n                          <img src="' + action.media + '" alt="">\n                        </a>' : '') + '\n                    </div>';
    }).join('') + '\n                    </div>\n                    <div class="col-md-6 mt-3">\n\n                    ' + period.actions.right.map(function (action) {
      return '<div class="timeline_card timeline_card-right">\n                        <div class="timeline_card_content">\n                            <p class="timeline_card_date">' + action.date + '</p>\n                            ' + (action.title ? '<h2 class="timeline_card_title">' + action.title + '</h2>' : '') + '\n                            <p class="timeline_card_text">' + action.content + '</p>\n                        </div>\n                        ' + (action.media ? '<a class="swipebox swipebox--video" href="' + action.media + '">\n                          <img src="' + action.media + '" alt="">\n                        </a>' : '') + '\n                    </div>';
    }).join('') + '\n                    </div>\n                </div>\n              </div>';
  });

  var updatePosition = tracker(function (position) {
    dataIndex = position;
    render();
    if (dataIndex + 1 > mappedData.length) {
      $('.timeline_actions-plus').css('display', 'none');
    } else {
      $('.timeline_actions-plus').css('display', 'block');
    }
  }); // init the trackbar

  function render() {
    var toRender = '';
    for (var i = 0; i < dataIndex; i++) {
      toRender += mappedData[i];
    }
    var actionsHolder = document.querySelector('.timeline_actions');
    if (actionsHolder) {
      actionsHolder.innerHTML = toRender;
    }
  }

  function increment() {
    dataIndex++;
    if (dataIndex + 1 > mappedData.length) {
      $('.timeline_actions-plus').css('display', 'none');
    }
    updatePosition(dataIndex - 1);
  }

  function scrollToLast() {
    var actions = document.querySelectorAll('.timeline_period');
    actions[actions.length - 1].scrollIntoView({
      behavior: 'smooth'
    });
  }

  render();

  $('.timeline_actions-plus').on('click', function () {
    increment();
    render();
    scrollToLast();
  });
};

function tracker(callback) {
  var elmnt = document.getElementById('timeline-selector');

  if (!elmnt) return null;

  var dots = document.getElementsByClassName('line_dot');

  var SIZE = 1140; // set the width of the tracker

  var step = SIZE / dots.length;
  var BLOCKSIZE = step;

  $('.line_dot').css('width', step + 'px');
  $('#timeline-selector').css('left', step / 2 - 20 + 'px');
  $('.timeline_line .container').append('<div class="timeline_line-progress"><div class="timeline_line-fill"></div></div>');
  $('.timeline_line-progress').css('width', SIZE - BLOCKSIZE + 'px');

  var pos1 = 0,
      pos3 = 0,
      position = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos3 = e.clientX;
    // set the element's new position:
    var newPosition = elmnt.offsetLeft - pos1;
    if (newPosition >= BLOCKSIZE / 2 - 20 && newPosition < SIZE - BLOCKSIZE / 2 - 20) {
      elmnt.style.left = newPosition + 'px';
    } else {
      document.onmouseup = closeDragElement;
    }
  }

  function setProperPosition() {
    position = Math.round((parseFloat(elmnt.style.left) - 50) / step);
    var newPosition = position * BLOCKSIZE + BLOCKSIZE / 2 - 20;
    elmnt.style.left = newPosition + 'px';
    updateActiveDots();
  }

  function updateActiveDots() {
    for (var i = 0; i < dots.length; i++) {
      dots[i].classList.remove('line_dot--active');
    }
    for (var _i = 0; _i < position; _i++) {
      dots[_i].classList.add('line_dot--active');
    }

    updateProgress();
  }

  function updateProgress() {
    var width = position * BLOCKSIZE;
    $('.timeline_line-fill').css('width', width + 'px');
  }

  function closeDragElement() {
    setProperPosition();
    callback(position + 1);
    /* stop moving when mouse button is released: */
    document.onmouseup = null;
    document.onmousemove = null;
  }

  Array.prototype.forEach.call(dots, function (dot, index) {
    dot.addEventListener('click', function () {
      updatePosition(index);
      callback(position + 1);
    });
  });

  function updatePosition(position) {
    elmnt.style.left = position * BLOCKSIZE + 'px';
    setProperPosition();
  }
  return updatePosition;
}

},{}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    $('.top-header_list .list, .top-header_list .lang').on('click', function (e) {

        if (!$(e.target).closest('.dropdown').length) {
            e.preventDefault();
        }

        $(this).toggleClass('open');
        $(this).find('.dropdown').toggleClass('d-none');
    });

    $('*').on('click', function (e) {

        if (!$.contains($('.top-header_list')[0], $(e.target)[0]) && ($('.lang').hasClass('open') || $('.list').hasClass('open'))) {

            closeDropdowns();
        }
    });

    function closeDropdowns() {
        if ($('.top-header_list .list').hasClass('open')) {
            $('.top-header_list .list').toggleClass('open');
            $('.top-header_list .list').find('.dropdown').toggleClass('d-none');
        }

        if ($('.top-header_list .lang').hasClass('open')) {
            $('.top-header_list .lang').toggleClass('open');
            $('.top-header_list .lang').find('.dropdown').toggleClass('d-none');
        }
    }
};

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbW9tZW50L21vbWVudC5qcyIsIm5vZGVfbW9kdWxlcy9zbW9vdGhzY3JvbGwtcG9seWZpbGwvZGlzdC9zbW9vdGhzY3JvbGwuanMiLCJzcmMvYXNzZXRzL2pzL2RhdGEuanNvbiIsInNyYy9hc3NldHMvanMvbWFpbi5qcyIsInNyYy9jb21wb25lbnRzL2FjdHVhbGl0ZS1zbGlkZXIvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9hY3R1YWxpdGVzL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvYXBwZWwtb2ZmcmVzL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvYXJ0aWNsZS1zbGlkZXIvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9iZXNvaW4tYWlkZS9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2NhcmQvY2FyZC1hY3R1YWxpdGVzLmpzIiwic3JjL2NvbXBvbmVudHMvY2FyZC9jYXJkLWhpc3RvaXJlLmpzIiwic3JjL2NvbXBvbmVudHMvY2FyZC9jYXJkLXJhcHBvcnQvY2FyZC1yYXBwb3J0LmpzIiwic3JjL2NvbXBvbmVudHMvY2FyZC9jYXJkLXNsaWRlci5qcyIsInNyYy9jb21wb25lbnRzL2NvbW11bmlxdWVzL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvZGF0ZS1maWx0ZXIvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9kYXRlLXNsaWRlci9kYXRlLXNsaWRlci5qcyIsInNyYy9jb21wb25lbnRzL2ZpbmFuY2UvZmlsdGVyLmpzIiwic3JjL2NvbXBvbmVudHMvZmluYW5jZS9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2Zvb3Rlci9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2Zvcm0vZm9ybS11cGxvYWQuanMiLCJzcmMvY29tcG9uZW50cy9mb3JtL2Zvcm0tdmFsaWRhdGlvbi5qcyIsInNyYy9jb21wb25lbnRzL2hlYWRlci9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2hvbWUtc2xpZGVyL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvbG9nby1zbGlkZXIvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9tYXAtY29udHJvbC9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL21hcC9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL21lZGlhLWdhbGxlcnkvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9tZWRpYWNlbnRlci9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL25vcy1iYW5xdWVzL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvcG9wdXAtc2VhcmNoL2ZpbHRlci5qcyIsInNyYy9jb21wb25lbnRzL3BvcHVwLXNlYXJjaC9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL3BvcHVwLXZpZGVvL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvcHViLXNsaWRlci9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL3Jlc3VsdC9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL3NlbGVjdC1maWx0ZXIvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9zd2lwZWJveC9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL3RpbWVsaW5lL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvdG9wLWhlYWRlci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzE1SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2YkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDOVBBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUlBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsRUFBRSxRQUFGLEVBQVksS0FBWixDQUFrQixZQUFZO0FBQzVCLGlDQUFhLFFBQWI7O0FBRUEsTUFBSSxPQUFPLFNBQVMsU0FBVCxDQUFt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Q0FBQyxVQUFELEVBQWEsUUFBYixDQUZSO0FBR0UsWUFBTTtBQUhSLEtBaEJJLEVBcUJKO0FBQ0UsZ0JBQVUsYUFEWjtBQUVFLFlBQU0sQ0FBQyxVQUFELEVBQWEsUUFBYixFQUF1QixRQUF2QixDQUZSO0FBR0UsWUFBTTtBQUhSLEtBckJJLEVBMEJKO0FBQ0UsZ0JBQVUsYUFEWjtBQUVFLFlBQU0sQ0FBQyxVQUFELEVBQWEsUUFBYixDQUZSO0FBR0UsWUFBTTtBQUhSLEtBMUJJLEVBK0JKO0FBQ0UsZ0JBQVUsYUFEWjtBQUVFLFlBQU0sQ0FBQyxVQUFELEVBQWEsUUFBYixFQUF1QixRQUF2QixDQUZSO0FBR0UsWUFBTTtBQUhSLEtBL0JJLEVBb0NKO0FBQ0UsZ0JBQVUsYUFEWjtBQUVFLFlBQU0sQ0FBQyxVQUFELEVBQWEsUUFBYixDQUZSO0FBR0UsWUFBTTtBQUhSLEtBcENJLEVBeUNKO0FBQ0UsZ0JBQVUsYUFEWjtBQUVFLFlBQU0sQ0FBQyxVQUFELEVBQWEsUUFBYixDQUZSO0FBR0UsWUFBTTtBQUhSLEtBekNJLEVBOENKO0FBQ0UsZ0JBQVUsUUFEWjtBQUVFLFlBQU0sQ0FBQyxVQUFELEVBQWEsUUFBYixFQUF1QixRQUF2QixDQUZSO0FBR0UsWUFBTTtBQUhSLEtBOUNJLEVBbURKO0FBQ0UsZ0JBQVUsUUFEWjtBQUVFLFlBQU0sQ0FBQyxVQUFELEVBQWEsUUFBYixDQUZSO0FBR0UsWUFBTTtBQUhSLEtBbkRJLEVBd0RKO0FBQ0UsZ0JBQVUsUUFEWjtBQUVFLFlBQU0sQ0FBQyxVQUFELEVBQWEsUUFBYixDQUZSO0FBR0UsWUFBTTtBQUhSLEtBeERJLEVBNkRKO0FBQ0UsZ0JBQVUsZUFEWjtBQUVFLFlBQU0sQ0FBQyxVQUFELEVBQWEsUUFBYixFQUF1QixRQUF2QixDQUZSO0FBR0UsWUFBTTtBQUhSLEtBN0RJLEVBa0VKO0FBQ0UsZ0JBQVUsZUFEWjtBQUVFLFlBQU0sQ0FBQyxVQUFELEVBQWEsUUFBYixDQUZSO0FBR0UsWUFBTTtBQUhSLEtBbEVJLEVBdUVKO0FBQ0UsZ0JBQVUscUJBRFo7QUFF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QUFyQyxDQUFELEtBQ0MsRUFBRSxPQUFGLEVBQVcsUUFBWCxDQUFvQixNQUFwQixLQUNELEVBQUUsT0FBRixFQUFXLFFBQVgsQ0FBb0IsTUFBcEIsQ0FGQSxDQUFKLEVBRW1DOztBQUUvQjtBQUNIO0FBQ0osS0FSRDs7QUFVQSxhQUFTLGNBQVQsR0FBMEI7QUFDdEIsWUFBSSxFQUFFLHdCQUFGLEVBQTRCLFFBQTVCLENBQXFDLE1BQXJDLENBQUosRUFBa0Q7QUFDOUMsY0FBRSx3QkFBRixFQUE0QixXQUE1QixDQUF3QyxNQUF4QztBQUNBLGNBQUUsd0JBQUYsRUFBNEIsSUFBNUIsQ0FBaUMsV0FBakMsRUFBOEMsV0FBOUMsQ0FBMEQsUUFBMUQ7QUFDSDs7QUFFRCxZQUFJLEVBQUUsd0JBQUYsRUFBNEIsUUFBNUIsQ0FBcUMsTUFBckMsQ0FBSixFQUFrRDtBQUM5QyxjQUFFLHdCQUFGLEVBQTRCLFdBQTVCLENBQXdDLE1BQXhDO0FBQ0EsY0FBRSx3QkFBRixFQUE0QixJQUE1QixDQUFpQyxXQUFqQyxFQUE4QyxXQUE5QyxDQUEwRCxRQUExRDtBQUNIO0FBQ0o7QUFDSixDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8hIG1vbWVudC5qc1xuXG47KGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gICAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgICBnbG9iYWwubW9tZW50ID0gZmFjdG9yeSgpXG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBob29rQ2FsbGJhY2s7XG5cbiAgICBmdW5jdGlvbiBob29rcyAoKSB7XG4gICAgICAgIHJldHVybiBob29rQ2FsbGJhY2suYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGlzIGRvbmUgdG8gcmVnaXN0ZXIgdGhlIG1ldGhvZCBjYWxsZWQgd2l0aCBtb21lbnQoKVxuICAgIC8vIHdpdGhvdXQgY3JlYXRpbmcgY2lyY3VsYXIgZGVwZW5kZW5jaWVzLlxuICAgIGZ1bmN0aW9uIHNldEhvb2tDYWxsYmFjayAoY2FsbGJhY2spIHtcbiAgICAgICAgaG9va0NhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNBcnJheShpbnB1dCkge1xuICAgICAgICByZXR1cm4gaW5wdXQgaW5zdGFuY2VvZiBBcnJheSB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzT2JqZWN0KGlucHV0KSB7XG4gICAgICAgIC8vIElFOCB3aWxsIHRyZWF0IHVuZGVmaW5lZCBhbmQgbnVsbCBhcyBvYmplY3QgaWYgaXQgd2Fzbid0IGZvclxuICAgICAgICAvLyBpbnB1dCAhPSBudWxsXG4gICAgICAgIHJldHVybiBpbnB1dCAhPSBudWxsICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzT2JqZWN0RW1wdHkob2JqKSB7XG4gICAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcykge1xuICAgICAgICAgICAgcmV0dXJuIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopLmxlbmd0aCA9PT0gMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgaztcbiAgICAgICAgICAgIGZvciAoayBpbiBvYmopIHtcbiAgICAgICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzVW5kZWZpbmVkKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PT0gdm9pZCAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTnVtYmVyKGlucHV0KSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgaW5wdXQgPT09ICdudW1iZXInIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IE51bWJlcl0nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRGF0ZShpbnB1dCkge1xuICAgICAgICByZXR1cm4gaW5wdXQgaW5zdGFuY2VvZiBEYXRlIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IERhdGVdJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXAoYXJyLCBmbikge1xuICAgICAgICB2YXIgcmVzID0gW10sIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKGZuKGFycltpXSwgaSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFzT3duUHJvcChhLCBiKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYSwgYik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXh0ZW5kKGEsIGIpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBiKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcChiLCBpKSkge1xuICAgICAgICAgICAgICAgIGFbaV0gPSBiW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc093blByb3AoYiwgJ3RvU3RyaW5nJykpIHtcbiAgICAgICAgICAgIGEudG9TdHJpbmcgPSBiLnRvU3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc093blByb3AoYiwgJ3ZhbHVlT2YnKSkge1xuICAgICAgICAgICAgYS52YWx1ZU9mID0gYi52YWx1ZU9mO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlVVRDIChpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlTG9jYWxPclVUQyhpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCwgdHJ1ZSkudXRjKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVmYXVsdFBhcnNpbmdGbGFncygpIHtcbiAgICAgICAgLy8gV2UgbmVlZCB0byBkZWVwIGNsb25lIHRoaXMgb2JqZWN0LlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZW1wdHkgICAgICAgICAgIDogZmFsc2UsXG4gICAgICAgICAgICB1bnVzZWRUb2tlbnMgICAgOiBbXSxcbiAgICAgICAgICAgIHVudXNlZElucHV0ICAgICA6IFtdLFxuICAgICAgICAgICAgb3ZlcmZsb3cgICAgICAgIDogLTIsXG4gICAgICAgICAgICBjaGFyc0xlZnRPdmVyICAgOiAwLFxuICAgICAgICAgICAgbnVsbElucHV0ICAgICAgIDogZmFsc2UsXG4gICAgICAgICAgICBpbnZhbGlkTW9udGggICAgOiBudWxsLFxuICAgICAgICAgICAgaW52YWxpZEZvcm1hdCAgIDogZmFsc2UsXG4gICAgICAgICAgICB1c2VySW52YWxpZGF0ZWQgOiBmYWxzZSxcbiAgICAgICAgICAgIGlzbyAgICAgICAgICAgICA6IGZhbHNlLFxuICAgICAgICAgICAgcGFyc2VkRGF0ZVBhcnRzIDogW10sXG4gICAgICAgICAgICBtZXJpZGllbSAgICAgICAgOiBudWxsLFxuICAgICAgICAgICAgcmZjMjgyMiAgICAgICAgIDogZmFsc2UsXG4gICAgICAgICAgICB3ZWVrZGF5TWlzbWF0Y2ggOiBmYWxzZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFBhcnNpbmdGbGFncyhtKSB7XG4gICAgICAgIGlmIChtLl9wZiA9PSBudWxsKSB7XG4gICAgICAgICAgICBtLl9wZiA9IGRlZmF1bHRQYXJzaW5nRmxhZ3MoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbS5fcGY7XG4gICAgfVxuXG4gICAgdmFyIHNvbWU7XG4gICAgaWYgKEFycmF5LnByb3RvdHlwZS5zb21lKSB7XG4gICAgICAgIHNvbWUgPSBBcnJheS5wcm90b3R5cGUuc29tZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzb21lID0gZnVuY3Rpb24gKGZ1bikge1xuICAgICAgICAgICAgdmFyIHQgPSBPYmplY3QodGhpcyk7XG4gICAgICAgICAgICB2YXIgbGVuID0gdC5sZW5ndGggPj4+IDA7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaSBpbiB0ICYmIGZ1bi5jYWxsKHRoaXMsIHRbaV0sIGksIHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzVmFsaWQobSkge1xuICAgICAgICBpZiAobS5faXNWYWxpZCA9PSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgZmxhZ3MgPSBnZXRQYXJzaW5nRmxhZ3MobSk7XG4gICAgICAgICAgICB2YXIgcGFyc2VkUGFydHMgPSBzb21lLmNhbGwoZmxhZ3MucGFyc2VkRGF0ZVBhcnRzLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpICE9IG51bGw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBpc05vd1ZhbGlkID0gIWlzTmFOKG0uX2QuZ2V0VGltZSgpKSAmJlxuICAgICAgICAgICAgICAgIGZsYWdzLm92ZXJmbG93IDwgMCAmJlxuICAgICAgICAgICAgICAgICFmbGFncy5lbXB0eSAmJlxuICAgICAgICAgICAgICAgICFmbGFncy5pbnZhbGlkTW9udGggJiZcbiAgICAgICAgICAgICAgICAhZmxhZ3MuaW52YWxpZFdlZWtkYXkgJiZcbiAgICAgICAgICAgICAgICAhZmxhZ3Mud2Vla2RheU1pc21hdGNoICYmXG4gICAgICAgICAgICAgICAgIWZsYWdzLm51bGxJbnB1dCAmJlxuICAgICAgICAgICAgICAgICFmbGFncy5pbnZhbGlkRm9ybWF0ICYmXG4gICAgICAgICAgICAgICAgIWZsYWdzLnVzZXJJbnZhbGlkYXRlZCAmJlxuICAgICAgICAgICAgICAgICghZmxhZ3MubWVyaWRpZW0gfHwgKGZsYWdzLm1lcmlkaWVtICYmIHBhcnNlZFBhcnRzKSk7XG5cbiAgICAgICAgICAgIGlmIChtLl9zdHJpY3QpIHtcbiAgICAgICAgICAgICAgICBpc05vd1ZhbGlkID0gaXNOb3dWYWxpZCAmJlxuICAgICAgICAgICAgICAgICAgICBmbGFncy5jaGFyc0xlZnRPdmVyID09PSAwICYmXG4gICAgICAgICAgICAgICAgICAgIGZsYWdzLnVudXNlZFRva2Vucy5sZW5ndGggPT09IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgZmxhZ3MuYmlnSG91ciA9PT0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoT2JqZWN0LmlzRnJvemVuID09IG51bGwgfHwgIU9iamVjdC5pc0Zyb3plbihtKSkge1xuICAgICAgICAgICAgICAgIG0uX2lzVmFsaWQgPSBpc05vd1ZhbGlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzTm93VmFsaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG0uX2lzVmFsaWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlSW52YWxpZCAoZmxhZ3MpIHtcbiAgICAgICAgdmFyIG0gPSBjcmVhdGVVVEMoTmFOKTtcbiAgICAgICAgaWYgKGZsYWdzICE9IG51bGwpIHtcbiAgICAgICAgICAgIGV4dGVuZChnZXRQYXJzaW5nRmxhZ3MobSksIGZsYWdzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhtKS51c2VySW52YWxpZGF0ZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfVxuXG4gICAgLy8gUGx1Z2lucyB0aGF0IGFkZCBwcm9wZXJ0aWVzIHNob3VsZCBhbHNvIGFkZCB0aGUga2V5IGhlcmUgKG51bGwgdmFsdWUpLFxuICAgIC8vIHNvIHdlIGNhbiBwcm9wZXJseSBjbG9uZSBvdXJzZWx2ZXMuXG4gICAgdmFyIG1vbWVudFByb3BlcnRpZXMgPSBob29rcy5tb21lbnRQcm9wZXJ0aWVzID0gW107XG5cbiAgICBmdW5jdGlvbiBjb3B5Q29uZmlnKHRvLCBmcm9tKSB7XG4gICAgICAgIHZhciBpLCBwcm9wLCB2YWw7XG5cbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl9pc0FNb21lbnRPYmplY3QpKSB7XG4gICAgICAgICAgICB0by5faXNBTW9tZW50T2JqZWN0ID0gZnJvbS5faXNBTW9tZW50T2JqZWN0O1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5faSkpIHtcbiAgICAgICAgICAgIHRvLl9pID0gZnJvbS5faTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX2YpKSB7XG4gICAgICAgICAgICB0by5fZiA9IGZyb20uX2Y7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl9sKSkge1xuICAgICAgICAgICAgdG8uX2wgPSBmcm9tLl9sO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5fc3RyaWN0KSkge1xuICAgICAgICAgICAgdG8uX3N0cmljdCA9IGZyb20uX3N0cmljdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX3R6bSkpIHtcbiAgICAgICAgICAgIHRvLl90em0gPSBmcm9tLl90em07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl9pc1VUQykpIHtcbiAgICAgICAgICAgIHRvLl9pc1VUQyA9IGZyb20uX2lzVVRDO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5fb2Zmc2V0KSkge1xuICAgICAgICAgICAgdG8uX29mZnNldCA9IGZyb20uX29mZnNldDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX3BmKSkge1xuICAgICAgICAgICAgdG8uX3BmID0gZ2V0UGFyc2luZ0ZsYWdzKGZyb20pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5fbG9jYWxlKSkge1xuICAgICAgICAgICAgdG8uX2xvY2FsZSA9IGZyb20uX2xvY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtb21lbnRQcm9wZXJ0aWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBtb21lbnRQcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcHJvcCA9IG1vbWVudFByb3BlcnRpZXNbaV07XG4gICAgICAgICAgICAgICAgdmFsID0gZnJvbVtwcm9wXTtcbiAgICAgICAgICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKHZhbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9bcHJvcF0gPSB2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRvO1xuICAgIH1cblxuICAgIHZhciB1cGRhdGVJblByb2dyZXNzID0gZmFsc2U7XG5cbiAgICAvLyBNb21lbnQgcHJvdG90eXBlIG9iamVjdFxuICAgIGZ1bmN0aW9uIE1vbWVudChjb25maWcpIHtcbiAgICAgICAgY29weUNvbmZpZyh0aGlzLCBjb25maWcpO1xuICAgICAgICB0aGlzLl9kID0gbmV3IERhdGUoY29uZmlnLl9kICE9IG51bGwgPyBjb25maWcuX2QuZ2V0VGltZSgpIDogTmFOKTtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgdGhpcy5fZCA9IG5ldyBEYXRlKE5hTik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUHJldmVudCBpbmZpbml0ZSBsb29wIGluIGNhc2UgdXBkYXRlT2Zmc2V0IGNyZWF0ZXMgbmV3IG1vbWVudFxuICAgICAgICAvLyBvYmplY3RzLlxuICAgICAgICBpZiAodXBkYXRlSW5Qcm9ncmVzcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHVwZGF0ZUluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgICAgICAgaG9va3MudXBkYXRlT2Zmc2V0KHRoaXMpO1xuICAgICAgICAgICAgdXBkYXRlSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNNb21lbnQgKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgTW9tZW50IHx8IChvYmogIT0gbnVsbCAmJiBvYmouX2lzQU1vbWVudE9iamVjdCAhPSBudWxsKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhYnNGbG9vciAobnVtYmVyKSB7XG4gICAgICAgIGlmIChudW1iZXIgPCAwKSB7XG4gICAgICAgICAgICAvLyAtMCAtPiAwXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKG51bWJlcikgfHwgMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKG51bWJlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0ludChhcmd1bWVudEZvckNvZXJjaW9uKSB7XG4gICAgICAgIHZhciBjb2VyY2VkTnVtYmVyID0gK2FyZ3VtZW50Rm9yQ29lcmNpb24sXG4gICAgICAgICAgICB2YWx1ZSA9IDA7XG5cbiAgICAgICAgaWYgKGNvZXJjZWROdW1iZXIgIT09IDAgJiYgaXNGaW5pdGUoY29lcmNlZE51bWJlcikpIHtcbiAgICAgICAgICAgIHZhbHVlID0gYWJzRmxvb3IoY29lcmNlZE51bWJlcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgLy8gY29tcGFyZSB0d28gYXJyYXlzLCByZXR1cm4gdGhlIG51bWJlciBvZiBkaWZmZXJlbmNlc1xuICAgIGZ1bmN0aW9uIGNvbXBhcmVBcnJheXMoYXJyYXkxLCBhcnJheTIsIGRvbnRDb252ZXJ0KSB7XG4gICAgICAgIHZhciBsZW4gPSBNYXRoLm1pbihhcnJheTEubGVuZ3RoLCBhcnJheTIubGVuZ3RoKSxcbiAgICAgICAgICAgIGxlbmd0aERpZmYgPSBNYXRoLmFicyhhcnJheTEubGVuZ3RoIC0gYXJyYXkyLmxlbmd0aCksXG4gICAgICAgICAgICBkaWZmcyA9IDAsXG4gICAgICAgICAgICBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmICgoZG9udENvbnZlcnQgJiYgYXJyYXkxW2ldICE9PSBhcnJheTJbaV0pIHx8XG4gICAgICAgICAgICAgICAgKCFkb250Q29udmVydCAmJiB0b0ludChhcnJheTFbaV0pICE9PSB0b0ludChhcnJheTJbaV0pKSkge1xuICAgICAgICAgICAgICAgIGRpZmZzKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpZmZzICsgbGVuZ3RoRGlmZjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB3YXJuKG1zZykge1xuICAgICAgICBpZiAoaG9va3Muc3VwcHJlc3NEZXByZWNhdGlvbldhcm5pbmdzID09PSBmYWxzZSAmJlxuICAgICAgICAgICAgICAgICh0eXBlb2YgY29uc29sZSAhPT0gICd1bmRlZmluZWQnKSAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignRGVwcmVjYXRpb24gd2FybmluZzogJyArIG1zZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXByZWNhdGUobXNnLCBmbikge1xuICAgICAgICB2YXIgZmlyc3RUaW1lID0gdHJ1ZTtcblxuICAgICAgICByZXR1cm4gZXh0ZW5kKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChob29rcy5kZXByZWNhdGlvbkhhbmRsZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGhvb2tzLmRlcHJlY2F0aW9uSGFuZGxlcihudWxsLCBtc2cpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZpcnN0VGltZSkge1xuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgICAgICAgICAgdmFyIGFyZztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBhcmcgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbaV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgKz0gJ1xcblsnICsgaSArICddICc7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gYXJndW1lbnRzWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnICs9IGtleSArICc6ICcgKyBhcmd1bWVudHNbMF1ba2V5XSArICcsICc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmcuc2xpY2UoMCwgLTIpOyAvLyBSZW1vdmUgdHJhaWxpbmcgY29tbWEgYW5kIHNwYWNlXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYXJncy5wdXNoKGFyZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHdhcm4obXNnICsgJ1xcbkFyZ3VtZW50czogJyArIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MpLmpvaW4oJycpICsgJ1xcbicgKyAobmV3IEVycm9yKCkpLnN0YWNrKTtcbiAgICAgICAgICAgICAgICBmaXJzdFRpbWUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9LCBmbik7XG4gICAgfVxuXG4gICAgdmFyIGRlcHJlY2F0aW9ucyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gZGVwcmVjYXRlU2ltcGxlKG5hbWUsIG1zZykge1xuICAgICAgICBpZiAoaG9va3MuZGVwcmVjYXRpb25IYW5kbGVyICE9IG51bGwpIHtcbiAgICAgICAgICAgIGhvb2tzLmRlcHJlY2F0aW9uSGFuZGxlcihuYW1lLCBtc2cpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZGVwcmVjYXRpb25zW25hbWVdKSB7XG4gICAgICAgICAgICB3YXJuKG1zZyk7XG4gICAgICAgICAgICBkZXByZWNhdGlvbnNbbmFtZV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaG9va3Muc3VwcHJlc3NEZXByZWNhdGlvbldhcm5pbmdzID0gZmFsc2U7XG4gICAgaG9va3MuZGVwcmVjYXRpb25IYW5kbGVyID0gbnVsbDtcblxuICAgIGZ1bmN0aW9uIGlzRnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0IGluc3RhbmNlb2YgRnVuY3Rpb24gfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0KSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXQgKGNvbmZpZykge1xuICAgICAgICB2YXIgcHJvcCwgaTtcbiAgICAgICAgZm9yIChpIGluIGNvbmZpZykge1xuICAgICAgICAgICAgcHJvcCA9IGNvbmZpZ1tpXTtcbiAgICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgdGhpc1tpXSA9IHByb3A7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXNbJ18nICsgaV0gPSBwcm9wO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgLy8gTGVuaWVudCBvcmRpbmFsIHBhcnNpbmcgYWNjZXB0cyBqdXN0IGEgbnVtYmVyIGluIGFkZGl0aW9uIHRvXG4gICAgICAgIC8vIG51bWJlciArIChwb3NzaWJseSkgc3R1ZmYgY29taW5nIGZyb20gX2RheU9mTW9udGhPcmRpbmFsUGFyc2UuXG4gICAgICAgIC8vIFRPRE86IFJlbW92ZSBcIm9yZGluYWxQYXJzZVwiIGZhbGxiYWNrIGluIG5leHQgbWFqb3IgcmVsZWFzZS5cbiAgICAgICAgdGhpcy5fZGF5T2ZNb250aE9yZGluYWxQYXJzZUxlbmllbnQgPSBuZXcgUmVnRXhwKFxuICAgICAgICAgICAgKHRoaXMuX2RheU9mTW9udGhPcmRpbmFsUGFyc2Uuc291cmNlIHx8IHRoaXMuX29yZGluYWxQYXJzZS5zb3VyY2UpICtcbiAgICAgICAgICAgICAgICAnfCcgKyAoL1xcZHsxLDJ9Lykuc291cmNlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtZXJnZUNvbmZpZ3MocGFyZW50Q29uZmlnLCBjaGlsZENvbmZpZykge1xuICAgICAgICB2YXIgcmVzID0gZXh0ZW5kKHt9LCBwYXJlbnRDb25maWcpLCBwcm9wO1xuICAgICAgICBmb3IgKHByb3AgaW4gY2hpbGRDb25maWcpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wKGNoaWxkQ29uZmlnLCBwcm9wKSkge1xuICAgICAgICAgICAgICAgIGlmIChpc09iamVjdChwYXJlbnRDb25maWdbcHJvcF0pICYmIGlzT2JqZWN0KGNoaWxkQ29uZmlnW3Byb3BdKSkge1xuICAgICAgICAgICAgICAgICAgICByZXNbcHJvcF0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgZXh0ZW5kKHJlc1twcm9wXSwgcGFyZW50Q29uZmlnW3Byb3BdKTtcbiAgICAgICAgICAgICAgICAgICAgZXh0ZW5kKHJlc1twcm9wXSwgY2hpbGRDb25maWdbcHJvcF0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGRDb25maWdbcHJvcF0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXNbcHJvcF0gPSBjaGlsZENvbmZpZ1twcm9wXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgcmVzW3Byb3BdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHByb3AgaW4gcGFyZW50Q29uZmlnKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcChwYXJlbnRDb25maWcsIHByb3ApICYmXG4gICAgICAgICAgICAgICAgICAgICFoYXNPd25Qcm9wKGNoaWxkQ29uZmlnLCBwcm9wKSAmJlxuICAgICAgICAgICAgICAgICAgICBpc09iamVjdChwYXJlbnRDb25maWdbcHJvcF0pKSB7XG4gICAgICAgICAgICAgICAgLy8gbWFrZSBzdXJlIGNoYW5nZXMgdG8gcHJvcGVydGllcyBkb24ndCBtb2RpZnkgcGFyZW50IGNvbmZpZ1xuICAgICAgICAgICAgICAgIHJlc1twcm9wXSA9IGV4dGVuZCh7fSwgcmVzW3Byb3BdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIExvY2FsZShjb25maWcpIHtcbiAgICAgICAgaWYgKGNvbmZpZyAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnNldChjb25maWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGtleXM7XG5cbiAgICBpZiAoT2JqZWN0LmtleXMpIHtcbiAgICAgICAga2V5cyA9IE9iamVjdC5rZXlzO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGtleXMgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICB2YXIgaSwgcmVzID0gW107XG4gICAgICAgICAgICBmb3IgKGkgaW4gb2JqKSB7XG4gICAgICAgICAgICAgICAgaWYgKGhhc093blByb3Aob2JqLCBpKSkge1xuICAgICAgICAgICAgICAgICAgICByZXMucHVzaChpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0Q2FsZW5kYXIgPSB7XG4gICAgICAgIHNhbWVEYXkgOiAnW1RvZGF5IGF0XSBMVCcsXG4gICAgICAgIG5leHREYXkgOiAnW1RvbW9ycm93IGF0XSBMVCcsXG4gICAgICAgIG5leHRXZWVrIDogJ2RkZGQgW2F0XSBMVCcsXG4gICAgICAgIGxhc3REYXkgOiAnW1llc3RlcmRheSBhdF0gTFQnLFxuICAgICAgICBsYXN0V2VlayA6ICdbTGFzdF0gZGRkZCBbYXRdIExUJyxcbiAgICAgICAgc2FtZUVsc2UgOiAnTCdcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gY2FsZW5kYXIgKGtleSwgbW9tLCBub3cpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IHRoaXMuX2NhbGVuZGFyW2tleV0gfHwgdGhpcy5fY2FsZW5kYXJbJ3NhbWVFbHNlJ107XG4gICAgICAgIHJldHVybiBpc0Z1bmN0aW9uKG91dHB1dCkgPyBvdXRwdXQuY2FsbChtb20sIG5vdykgOiBvdXRwdXQ7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb25nRGF0ZUZvcm1hdCA9IHtcbiAgICAgICAgTFRTICA6ICdoOm1tOnNzIEEnLFxuICAgICAgICBMVCAgIDogJ2g6bW0gQScsXG4gICAgICAgIEwgICAgOiAnTU0vREQvWVlZWScsXG4gICAgICAgIExMICAgOiAnTU1NTSBELCBZWVlZJyxcbiAgICAgICAgTExMICA6ICdNTU1NIEQsIFlZWVkgaDptbSBBJyxcbiAgICAgICAgTExMTCA6ICdkZGRkLCBNTU1NIEQsIFlZWVkgaDptbSBBJ1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsb25nRGF0ZUZvcm1hdCAoa2V5KSB7XG4gICAgICAgIHZhciBmb3JtYXQgPSB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXldLFxuICAgICAgICAgICAgZm9ybWF0VXBwZXIgPSB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXkudG9VcHBlckNhc2UoKV07XG5cbiAgICAgICAgaWYgKGZvcm1hdCB8fCAhZm9ybWF0VXBwZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBmb3JtYXQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXldID0gZm9ybWF0VXBwZXIucmVwbGFjZSgvTU1NTXxNTXxERHxkZGRkL2csIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWwuc2xpY2UoMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXldO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0SW52YWxpZERhdGUgPSAnSW52YWxpZCBkYXRlJztcblxuICAgIGZ1bmN0aW9uIGludmFsaWREYXRlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludmFsaWREYXRlO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0T3JkaW5hbCA9ICclZCc7XG4gICAgdmFyIGRlZmF1bHREYXlPZk1vbnRoT3JkaW5hbFBhcnNlID0gL1xcZHsxLDJ9LztcblxuICAgIGZ1bmN0aW9uIG9yZGluYWwgKG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5fb3JkaW5hbC5yZXBsYWNlKCclZCcsIG51bWJlcik7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRSZWxhdGl2ZVRpbWUgPSB7XG4gICAgICAgIGZ1dHVyZSA6ICdpbiAlcycsXG4gICAgICAgIHBhc3QgICA6ICclcyBhZ28nLFxuICAgICAgICBzICA6ICdhIGZldyBzZWNvbmRzJyxcbiAgICAgICAgc3MgOiAnJWQgc2Vjb25kcycsXG4gICAgICAgIG0gIDogJ2EgbWludXRlJyxcbiAgICAgICAgbW0gOiAnJWQgbWludXRlcycsXG4gICAgICAgIGggIDogJ2FuIGhvdXInLFxuICAgICAgICBoaCA6ICclZCBob3VycycsXG4gICAgICAgIGQgIDogJ2EgZGF5JyxcbiAgICAgICAgZGQgOiAnJWQgZGF5cycsXG4gICAgICAgIE0gIDogJ2EgbW9udGgnLFxuICAgICAgICBNTSA6ICclZCBtb250aHMnLFxuICAgICAgICB5ICA6ICdhIHllYXInLFxuICAgICAgICB5eSA6ICclZCB5ZWFycydcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gcmVsYXRpdmVUaW1lIChudW1iZXIsIHdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IHRoaXMuX3JlbGF0aXZlVGltZVtzdHJpbmddO1xuICAgICAgICByZXR1cm4gKGlzRnVuY3Rpb24ob3V0cHV0KSkgP1xuICAgICAgICAgICAgb3V0cHV0KG51bWJlciwgd2l0aG91dFN1ZmZpeCwgc3RyaW5nLCBpc0Z1dHVyZSkgOlxuICAgICAgICAgICAgb3V0cHV0LnJlcGxhY2UoLyVkL2ksIG51bWJlcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFzdEZ1dHVyZSAoZGlmZiwgb3V0cHV0KSB7XG4gICAgICAgIHZhciBmb3JtYXQgPSB0aGlzLl9yZWxhdGl2ZVRpbWVbZGlmZiA+IDAgPyAnZnV0dXJlJyA6ICdwYXN0J107XG4gICAgICAgIHJldHVybiBpc0Z1bmN0aW9uKGZvcm1hdCkgPyBmb3JtYXQob3V0cHV0KSA6IGZvcm1hdC5yZXBsYWNlKC8lcy9pLCBvdXRwdXQpO1xuICAgIH1cblxuICAgIHZhciBhbGlhc2VzID0ge307XG5cbiAgICBmdW5jdGlvbiBhZGRVbml0QWxpYXMgKHVuaXQsIHNob3J0aGFuZCkge1xuICAgICAgICB2YXIgbG93ZXJDYXNlID0gdW5pdC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBhbGlhc2VzW2xvd2VyQ2FzZV0gPSBhbGlhc2VzW2xvd2VyQ2FzZSArICdzJ10gPSBhbGlhc2VzW3Nob3J0aGFuZF0gPSB1bml0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZVVuaXRzKHVuaXRzKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdW5pdHMgPT09ICdzdHJpbmcnID8gYWxpYXNlc1t1bml0c10gfHwgYWxpYXNlc1t1bml0cy50b0xvd2VyQ2FzZSgpXSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3JtYWxpemVPYmplY3RVbml0cyhpbnB1dE9iamVjdCkge1xuICAgICAgICB2YXIgbm9ybWFsaXplZElucHV0ID0ge30sXG4gICAgICAgICAgICBub3JtYWxpemVkUHJvcCxcbiAgICAgICAgICAgIHByb3A7XG5cbiAgICAgICAgZm9yIChwcm9wIGluIGlucHV0T2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcChpbnB1dE9iamVjdCwgcHJvcCkpIHtcbiAgICAgICAgICAgICAgICBub3JtYWxpemVkUHJvcCA9IG5vcm1hbGl6ZVVuaXRzKHByb3ApO1xuICAgICAgICAgICAgICAgIGlmIChub3JtYWxpemVkUHJvcCkge1xuICAgICAgICAgICAgICAgICAgICBub3JtYWxpemVkSW5wdXRbbm9ybWFsaXplZFByb3BdID0gaW5wdXRPYmplY3RbcHJvcF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZWRJbnB1dDtcbiAgICB9XG5cbiAgICB2YXIgcHJpb3JpdGllcyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gYWRkVW5pdFByaW9yaXR5KHVuaXQsIHByaW9yaXR5KSB7XG4gICAgICAgIHByaW9yaXRpZXNbdW5pdF0gPSBwcmlvcml0eTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQcmlvcml0aXplZFVuaXRzKHVuaXRzT2JqKSB7XG4gICAgICAgIHZhciB1bml0cyA9IFtdO1xuICAgICAgICBmb3IgKHZhciB1IGluIHVuaXRzT2JqKSB7XG4gICAgICAgICAgICB1bml0cy5wdXNoKHt1bml0OiB1LCBwcmlvcml0eTogcHJpb3JpdGllc1t1XX0pO1xuICAgICAgICB9XG4gICAgICAgIHVuaXRzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBhLnByaW9yaXR5IC0gYi5wcmlvcml0eTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB1bml0cztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB6ZXJvRmlsbChudW1iZXIsIHRhcmdldExlbmd0aCwgZm9yY2VTaWduKSB7XG4gICAgICAgIHZhciBhYnNOdW1iZXIgPSAnJyArIE1hdGguYWJzKG51bWJlciksXG4gICAgICAgICAgICB6ZXJvc1RvRmlsbCA9IHRhcmdldExlbmd0aCAtIGFic051bWJlci5sZW5ndGgsXG4gICAgICAgICAgICBzaWduID0gbnVtYmVyID49IDA7XG4gICAgICAgIHJldHVybiAoc2lnbiA/IChmb3JjZVNpZ24gPyAnKycgOiAnJykgOiAnLScpICtcbiAgICAgICAgICAgIE1hdGgucG93KDEwLCBNYXRoLm1heCgwLCB6ZXJvc1RvRmlsbCkpLnRvU3RyaW5nKCkuc3Vic3RyKDEpICsgYWJzTnVtYmVyO1xuICAgIH1cblxuICAgIHZhciBmb3JtYXR0aW5nVG9rZW5zID0gLyhcXFtbXlxcW10qXFxdKXwoXFxcXCk/KFtIaF1tbShzcyk/fE1vfE1NP00/TT98RG98REREb3xERD9EP0Q/fGRkZD9kP3xkbz98d1tvfHddP3xXW298V10/fFFvP3xZWVlZWVl8WVlZWVl8WVlZWXxZWXxnZyhnZ2c/KT98R0coR0dHPyk/fGV8RXxhfEF8aGg/fEhIP3xraz98bW0/fHNzP3xTezEsOX18eHxYfHp6P3xaWj98LikvZztcblxuICAgIHZhciBsb2NhbEZvcm1hdHRpbmdUb2tlbnMgPSAvKFxcW1teXFxbXSpcXF0pfChcXFxcKT8oTFRTfExUfExMP0w/TD98bHsxLDR9KS9nO1xuXG4gICAgdmFyIGZvcm1hdEZ1bmN0aW9ucyA9IHt9O1xuXG4gICAgdmFyIGZvcm1hdFRva2VuRnVuY3Rpb25zID0ge307XG5cbiAgICAvLyB0b2tlbjogICAgJ00nXG4gICAgLy8gcGFkZGVkOiAgIFsnTU0nLCAyXVxuICAgIC8vIG9yZGluYWw6ICAnTW8nXG4gICAgLy8gY2FsbGJhY2s6IGZ1bmN0aW9uICgpIHsgdGhpcy5tb250aCgpICsgMSB9XG4gICAgZnVuY3Rpb24gYWRkRm9ybWF0VG9rZW4gKHRva2VuLCBwYWRkZWQsIG9yZGluYWwsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBmdW5jID0gY2FsbGJhY2s7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBmdW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW2NhbGxiYWNrXSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgIGZvcm1hdFRva2VuRnVuY3Rpb25zW3Rva2VuXSA9IGZ1bmM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhZGRlZCkge1xuICAgICAgICAgICAgZm9ybWF0VG9rZW5GdW5jdGlvbnNbcGFkZGVkWzBdXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gemVyb0ZpbGwoZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCBwYWRkZWRbMV0sIHBhZGRlZFsyXSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcmRpbmFsKSB7XG4gICAgICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9uc1tvcmRpbmFsXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkub3JkaW5hbChmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIHRva2VuKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVGb3JtYXR0aW5nVG9rZW5zKGlucHV0KSB7XG4gICAgICAgIGlmIChpbnB1dC5tYXRjaCgvXFxbW1xcc1xcU10vKSkge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0LnJlcGxhY2UoL15cXFt8XFxdJC9nLCAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlucHV0LnJlcGxhY2UoL1xcXFwvZywgJycpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VGb3JtYXRGdW5jdGlvbihmb3JtYXQpIHtcbiAgICAgICAgdmFyIGFycmF5ID0gZm9ybWF0Lm1hdGNoKGZvcm1hdHRpbmdUb2tlbnMpLCBpLCBsZW5ndGg7XG5cbiAgICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChmb3JtYXRUb2tlbkZ1bmN0aW9uc1thcnJheVtpXV0pIHtcbiAgICAgICAgICAgICAgICBhcnJheVtpXSA9IGZvcm1hdFRva2VuRnVuY3Rpb25zW2FycmF5W2ldXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXJyYXlbaV0gPSByZW1vdmVGb3JtYXR0aW5nVG9rZW5zKGFycmF5W2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAobW9tKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gJycsIGk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gaXNGdW5jdGlvbihhcnJheVtpXSkgPyBhcnJheVtpXS5jYWxsKG1vbSwgZm9ybWF0KSA6IGFycmF5W2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBmb3JtYXQgZGF0ZSB1c2luZyBuYXRpdmUgZGF0ZSBvYmplY3RcbiAgICBmdW5jdGlvbiBmb3JtYXRNb21lbnQobSwgZm9ybWF0KSB7XG4gICAgICAgIGlmICghbS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBtLmxvY2FsZURhdGEoKS5pbnZhbGlkRGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9ybWF0ID0gZXhwYW5kRm9ybWF0KGZvcm1hdCwgbS5sb2NhbGVEYXRhKCkpO1xuICAgICAgICBmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XSA9IGZvcm1hdEZ1bmN0aW9uc1tmb3JtYXRdIHx8IG1ha2VGb3JtYXRGdW5jdGlvbihmb3JtYXQpO1xuXG4gICAgICAgIHJldHVybiBmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XShtKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHBhbmRGb3JtYXQoZm9ybWF0LCBsb2NhbGUpIHtcbiAgICAgICAgdmFyIGkgPSA1O1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlcGxhY2VMb25nRGF0ZUZvcm1hdFRva2VucyhpbnB1dCkge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZS5sb25nRGF0ZUZvcm1hdChpbnB1dCkgfHwgaW5wdXQ7XG4gICAgICAgIH1cblxuICAgICAgICBsb2NhbEZvcm1hdHRpbmdUb2tlbnMubGFzdEluZGV4ID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPj0gMCAmJiBsb2NhbEZvcm1hdHRpbmdUb2tlbnMudGVzdChmb3JtYXQpKSB7XG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZShsb2NhbEZvcm1hdHRpbmdUb2tlbnMsIHJlcGxhY2VMb25nRGF0ZUZvcm1hdFRva2Vucyk7XG4gICAgICAgICAgICBsb2NhbEZvcm1hdHRpbmdUb2tlbnMubGFzdEluZGV4ID0gMDtcbiAgICAgICAgICAgIGkgLT0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmb3JtYXQ7XG4gICAgfVxuXG4gICAgdmFyIG1hdGNoMSAgICAgICAgID0gL1xcZC87ICAgICAgICAgICAgLy8gICAgICAgMCAtIDlcbiAgICB2YXIgbWF0Y2gyICAgICAgICAgPSAvXFxkXFxkLzsgICAgICAgICAgLy8gICAgICAwMCAtIDk5XG4gICAgdmFyIG1hdGNoMyAgICAgICAgID0gL1xcZHszfS87ICAgICAgICAgLy8gICAgIDAwMCAtIDk5OVxuICAgIHZhciBtYXRjaDQgICAgICAgICA9IC9cXGR7NH0vOyAgICAgICAgIC8vICAgIDAwMDAgLSA5OTk5XG4gICAgdmFyIG1hdGNoNiAgICAgICAgID0gL1srLV0/XFxkezZ9LzsgICAgLy8gLTk5OTk5OSAtIDk5OTk5OVxuICAgIHZhciBtYXRjaDF0bzIgICAgICA9IC9cXGRcXGQ/LzsgICAgICAgICAvLyAgICAgICAwIC0gOTlcbiAgICB2YXIgbWF0Y2gzdG80ICAgICAgPSAvXFxkXFxkXFxkXFxkPy87ICAgICAvLyAgICAgOTk5IC0gOTk5OVxuICAgIHZhciBtYXRjaDV0bzYgICAgICA9IC9cXGRcXGRcXGRcXGRcXGRcXGQ/LzsgLy8gICA5OTk5OSAtIDk5OTk5OVxuICAgIHZhciBtYXRjaDF0bzMgICAgICA9IC9cXGR7MSwzfS87ICAgICAgIC8vICAgICAgIDAgLSA5OTlcbiAgICB2YXIgbWF0Y2gxdG80ICAgICAgPSAvXFxkezEsNH0vOyAgICAgICAvLyAgICAgICAwIC0gOTk5OVxuICAgIHZhciBtYXRjaDF0bzYgICAgICA9IC9bKy1dP1xcZHsxLDZ9LzsgIC8vIC05OTk5OTkgLSA5OTk5OTlcblxuICAgIHZhciBtYXRjaFVuc2lnbmVkICA9IC9cXGQrLzsgICAgICAgICAgIC8vICAgICAgIDAgLSBpbmZcbiAgICB2YXIgbWF0Y2hTaWduZWQgICAgPSAvWystXT9cXGQrLzsgICAgICAvLyAgICAtaW5mIC0gaW5mXG5cbiAgICB2YXIgbWF0Y2hPZmZzZXQgICAgPSAvWnxbKy1dXFxkXFxkOj9cXGRcXGQvZ2k7IC8vICswMDowMCAtMDA6MDAgKzAwMDAgLTAwMDAgb3IgWlxuICAgIHZhciBtYXRjaFNob3J0T2Zmc2V0ID0gL1p8WystXVxcZFxcZCg/Ojo/XFxkXFxkKT8vZ2k7IC8vICswMCAtMDAgKzAwOjAwIC0wMDowMCArMDAwMCAtMDAwMCBvciBaXG5cbiAgICB2YXIgbWF0Y2hUaW1lc3RhbXAgPSAvWystXT9cXGQrKFxcLlxcZHsxLDN9KT8vOyAvLyAxMjM0NTY3ODkgMTIzNDU2Nzg5LjEyM1xuXG4gICAgLy8gYW55IHdvcmQgKG9yIHR3bykgY2hhcmFjdGVycyBvciBudW1iZXJzIGluY2x1ZGluZyB0d28vdGhyZWUgd29yZCBtb250aCBpbiBhcmFiaWMuXG4gICAgLy8gaW5jbHVkZXMgc2NvdHRpc2ggZ2FlbGljIHR3byB3b3JkIGFuZCBoeXBoZW5hdGVkIG1vbnRoc1xuICAgIHZhciBtYXRjaFdvcmQgPSAvWzAtOV17MCwyNTZ9WydhLXpcXHUwMEEwLVxcdTA1RkZcXHUwNzAwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGMDdcXHVGRjEwLVxcdUZGRUZdezEsMjU2fXxbXFx1MDYwMC1cXHUwNkZGXFwvXXsxLDI1Nn0oXFxzKj9bXFx1MDYwMC1cXHUwNkZGXXsxLDI1Nn0pezEsMn0vaTtcblxuICAgIHZhciByZWdleGVzID0ge307XG5cbiAgICBmdW5jdGlvbiBhZGRSZWdleFRva2VuICh0b2tlbiwgcmVnZXgsIHN0cmljdFJlZ2V4KSB7XG4gICAgICAgIHJlZ2V4ZXNbdG9rZW5dID0gaXNGdW5jdGlvbihyZWdleCkgPyByZWdleCA6IGZ1bmN0aW9uIChpc1N0cmljdCwgbG9jYWxlRGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIChpc1N0cmljdCAmJiBzdHJpY3RSZWdleCkgPyBzdHJpY3RSZWdleCA6IHJlZ2V4O1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFBhcnNlUmVnZXhGb3JUb2tlbiAodG9rZW4sIGNvbmZpZykge1xuICAgICAgICBpZiAoIWhhc093blByb3AocmVnZXhlcywgdG9rZW4pKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cCh1bmVzY2FwZUZvcm1hdCh0b2tlbikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlZ2V4ZXNbdG9rZW5dKGNvbmZpZy5fc3RyaWN0LCBjb25maWcuX2xvY2FsZSk7XG4gICAgfVxuXG4gICAgLy8gQ29kZSBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzU2MTQ5My9pcy10aGVyZS1hLXJlZ2V4cC1lc2NhcGUtZnVuY3Rpb24taW4tamF2YXNjcmlwdFxuICAgIGZ1bmN0aW9uIHVuZXNjYXBlRm9ybWF0KHMpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2V4RXNjYXBlKHMucmVwbGFjZSgnXFxcXCcsICcnKS5yZXBsYWNlKC9cXFxcKFxcWyl8XFxcXChcXF0pfFxcWyhbXlxcXVxcW10qKVxcXXxcXFxcKC4pL2csIGZ1bmN0aW9uIChtYXRjaGVkLCBwMSwgcDIsIHAzLCBwNCkge1xuICAgICAgICAgICAgcmV0dXJuIHAxIHx8IHAyIHx8IHAzIHx8IHA0O1xuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVnZXhFc2NhcGUocykge1xuICAgICAgICByZXR1cm4gcy5yZXBsYWNlKC9bLVxcL1xcXFxeJCorPy4oKXxbXFxde31dL2csICdcXFxcJCYnKTtcbiAgICB9XG5cbiAgICB2YXIgdG9rZW5zID0ge307XG5cbiAgICBmdW5jdGlvbiBhZGRQYXJzZVRva2VuICh0b2tlbiwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGksIGZ1bmMgPSBjYWxsYmFjaztcbiAgICAgICAgaWYgKHR5cGVvZiB0b2tlbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRva2VuID0gW3Rva2VuXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNOdW1iZXIoY2FsbGJhY2spKSB7XG4gICAgICAgICAgICBmdW5jID0gZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICAgICAgICAgIGFycmF5W2NhbGxiYWNrXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRva2VuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0b2tlbnNbdG9rZW5baV1dID0gZnVuYztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFdlZWtQYXJzZVRva2VuICh0b2tlbiwgY2FsbGJhY2spIHtcbiAgICAgICAgYWRkUGFyc2VUb2tlbih0b2tlbiwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnLCB0b2tlbikge1xuICAgICAgICAgICAgY29uZmlnLl93ID0gY29uZmlnLl93IHx8IHt9O1xuICAgICAgICAgICAgY2FsbGJhY2soaW5wdXQsIGNvbmZpZy5fdywgY29uZmlnLCB0b2tlbik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFRpbWVUb0FycmF5RnJvbVRva2VuKHRva2VuLCBpbnB1dCwgY29uZmlnKSB7XG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsICYmIGhhc093blByb3AodG9rZW5zLCB0b2tlbikpIHtcbiAgICAgICAgICAgIHRva2Vuc1t0b2tlbl0oaW5wdXQsIGNvbmZpZy5fYSwgY29uZmlnLCB0b2tlbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgWUVBUiA9IDA7XG4gICAgdmFyIE1PTlRIID0gMTtcbiAgICB2YXIgREFURSA9IDI7XG4gICAgdmFyIEhPVVIgPSAzO1xuICAgIHZhciBNSU5VVEUgPSA0O1xuICAgIHZhciBTRUNPTkQgPSA1O1xuICAgIHZhciBNSUxMSVNFQ09ORCA9IDY7XG4gICAgdmFyIFdFRUsgPSA3O1xuICAgIHZhciBXRUVLREFZID0gODtcblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKCdZJywgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgeSA9IHRoaXMueWVhcigpO1xuICAgICAgICByZXR1cm4geSA8PSA5OTk5ID8gJycgKyB5IDogJysnICsgeTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnWVknLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy55ZWFyKCkgJSAxMDA7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1lZWVknLCAgIDRdLCAgICAgICAwLCAneWVhcicpO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnWVlZWVknLCAgNV0sICAgICAgIDAsICd5ZWFyJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydZWVlZWVknLCA2LCB0cnVlXSwgMCwgJ3llYXInKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygneWVhcicsICd5Jyk7XG5cbiAgICAvLyBQUklPUklUSUVTXG5cbiAgICBhZGRVbml0UHJpb3JpdHkoJ3llYXInLCAxKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ1knLCAgICAgIG1hdGNoU2lnbmVkKTtcbiAgICBhZGRSZWdleFRva2VuKCdZWScsICAgICBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignWVlZWScsICAgbWF0Y2gxdG80LCBtYXRjaDQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1lZWVlZJywgIG1hdGNoMXRvNiwgbWF0Y2g2KTtcbiAgICBhZGRSZWdleFRva2VuKCdZWVlZWVknLCBtYXRjaDF0bzYsIG1hdGNoNik7XG5cbiAgICBhZGRQYXJzZVRva2VuKFsnWVlZWVknLCAnWVlZWVlZJ10sIFlFQVIpO1xuICAgIGFkZFBhcnNlVG9rZW4oJ1lZWVknLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W1lFQVJdID0gaW5wdXQubGVuZ3RoID09PSAyID8gaG9va3MucGFyc2VUd29EaWdpdFllYXIoaW5wdXQpIDogdG9JbnQoaW5wdXQpO1xuICAgIH0pO1xuICAgIGFkZFBhcnNlVG9rZW4oJ1lZJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtZRUFSXSA9IGhvb2tzLnBhcnNlVHdvRGlnaXRZZWFyKGlucHV0KTtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKCdZJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtZRUFSXSA9IHBhcnNlSW50KGlucHV0LCAxMCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICBmdW5jdGlvbiBkYXlzSW5ZZWFyKHllYXIpIHtcbiAgICAgICAgcmV0dXJuIGlzTGVhcFllYXIoeWVhcikgPyAzNjYgOiAzNjU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNMZWFwWWVhcih5ZWFyKSB7XG4gICAgICAgIHJldHVybiAoeWVhciAlIDQgPT09IDAgJiYgeWVhciAlIDEwMCAhPT0gMCkgfHwgeWVhciAlIDQwMCA9PT0gMDtcbiAgICB9XG5cbiAgICAvLyBIT09LU1xuXG4gICAgaG9va3MucGFyc2VUd29EaWdpdFllYXIgPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIHRvSW50KGlucHV0KSArICh0b0ludChpbnB1dCkgPiA2OCA/IDE5MDAgOiAyMDAwKTtcbiAgICB9O1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgdmFyIGdldFNldFllYXIgPSBtYWtlR2V0U2V0KCdGdWxsWWVhcicsIHRydWUpO1xuXG4gICAgZnVuY3Rpb24gZ2V0SXNMZWFwWWVhciAoKSB7XG4gICAgICAgIHJldHVybiBpc0xlYXBZZWFyKHRoaXMueWVhcigpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlR2V0U2V0ICh1bml0LCBrZWVwVGltZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHNldCQxKHRoaXMsIHVuaXQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICBob29rcy51cGRhdGVPZmZzZXQodGhpcywga2VlcFRpbWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0KHRoaXMsIHVuaXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldCAobW9tLCB1bml0KSB7XG4gICAgICAgIHJldHVybiBtb20uaXNWYWxpZCgpID9cbiAgICAgICAgICAgIG1vbS5fZFsnZ2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyB1bml0XSgpIDogTmFOO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldCQxIChtb20sIHVuaXQsIHZhbHVlKSB7XG4gICAgICAgIGlmIChtb20uaXNWYWxpZCgpICYmICFpc05hTih2YWx1ZSkpIHtcbiAgICAgICAgICAgIGlmICh1bml0ID09PSAnRnVsbFllYXInICYmIGlzTGVhcFllYXIobW9tLnllYXIoKSkgJiYgbW9tLm1vbnRoKCkgPT09IDEgJiYgbW9tLmRhdGUoKSA9PT0gMjkpIHtcbiAgICAgICAgICAgICAgICBtb20uX2RbJ3NldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgdW5pdF0odmFsdWUsIG1vbS5tb250aCgpLCBkYXlzSW5Nb250aCh2YWx1ZSwgbW9tLm1vbnRoKCkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG1vbS5fZFsnc2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyB1bml0XSh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBzdHJpbmdHZXQgKHVuaXRzKSB7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICBpZiAoaXNGdW5jdGlvbih0aGlzW3VuaXRzXSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzW3VuaXRzXSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gc3RyaW5nU2V0ICh1bml0cywgdmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB1bml0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplT2JqZWN0VW5pdHModW5pdHMpO1xuICAgICAgICAgICAgdmFyIHByaW9yaXRpemVkID0gZ2V0UHJpb3JpdGl6ZWRVbml0cyh1bml0cyk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByaW9yaXRpemVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpc1twcmlvcml0aXplZFtpXS51bml0XSh1bml0c1twcmlvcml0aXplZFtpXS51bml0XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKHRoaXNbdW5pdHNdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW3VuaXRzXSh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9kKG4sIHgpIHtcbiAgICAgICAgcmV0dXJuICgobiAlIHgpICsgeCkgJSB4O1xuICAgIH1cblxuICAgIHZhciBpbmRleE9mO1xuXG4gICAgaWYgKEFycmF5LnByb3RvdHlwZS5pbmRleE9mKSB7XG4gICAgICAgIGluZGV4T2YgPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZjtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpbmRleE9mID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgICAgIC8vIEkga25vd1xuICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzW2ldID09PSBvKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYXlzSW5Nb250aCh5ZWFyLCBtb250aCkge1xuICAgICAgICBpZiAoaXNOYU4oeWVhcikgfHwgaXNOYU4obW9udGgpKSB7XG4gICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtb2RNb250aCA9IG1vZChtb250aCwgMTIpO1xuICAgICAgICB5ZWFyICs9IChtb250aCAtIG1vZE1vbnRoKSAvIDEyO1xuICAgICAgICByZXR1cm4gbW9kTW9udGggPT09IDEgPyAoaXNMZWFwWWVhcih5ZWFyKSA/IDI5IDogMjgpIDogKDMxIC0gbW9kTW9udGggJSA3ICUgMik7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ00nLCBbJ01NJywgMl0sICdNbycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9udGgoKSArIDE7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignTU1NJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkubW9udGhzU2hvcnQodGhpcywgZm9ybWF0KTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdNTU1NJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkubW9udGhzKHRoaXMsIGZvcm1hdCk7XG4gICAgfSk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ21vbnRoJywgJ00nKTtcblxuICAgIC8vIFBSSU9SSVRZXG5cbiAgICBhZGRVbml0UHJpb3JpdHkoJ21vbnRoJywgOCk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdNJywgICAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdNTScsICAgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ01NTScsICBmdW5jdGlvbiAoaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gbG9jYWxlLm1vbnRoc1Nob3J0UmVnZXgoaXNTdHJpY3QpO1xuICAgIH0pO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ01NTU0nLCBmdW5jdGlvbiAoaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gbG9jYWxlLm1vbnRoc1JlZ2V4KGlzU3RyaWN0KTtcbiAgICB9KTtcblxuICAgIGFkZFBhcnNlVG9rZW4oWydNJywgJ01NJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbTU9OVEhdID0gdG9JbnQoaW5wdXQpIC0gMTtcbiAgICB9KTtcblxuICAgIGFkZFBhcnNlVG9rZW4oWydNTU0nLCAnTU1NTSddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIHZhciBtb250aCA9IGNvbmZpZy5fbG9jYWxlLm1vbnRoc1BhcnNlKGlucHV0LCB0b2tlbiwgY29uZmlnLl9zdHJpY3QpO1xuICAgICAgICAvLyBpZiB3ZSBkaWRuJ3QgZmluZCBhIG1vbnRoIG5hbWUsIG1hcmsgdGhlIGRhdGUgYXMgaW52YWxpZC5cbiAgICAgICAgaWYgKG1vbnRoICE9IG51bGwpIHtcbiAgICAgICAgICAgIGFycmF5W01PTlRIXSA9IG1vbnRoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuaW52YWxpZE1vbnRoID0gaW5wdXQ7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIExPQ0FMRVNcblxuICAgIHZhciBNT05USFNfSU5fRk9STUFUID0gL0Rbb0RdPyhcXFtbXlxcW1xcXV0qXFxdfFxccykrTU1NTT8vO1xuICAgIHZhciBkZWZhdWx0TG9jYWxlTW9udGhzID0gJ0phbnVhcnlfRmVicnVhcnlfTWFyY2hfQXByaWxfTWF5X0p1bmVfSnVseV9BdWd1c3RfU2VwdGVtYmVyX09jdG9iZXJfTm92ZW1iZXJfRGVjZW1iZXInLnNwbGl0KCdfJyk7XG4gICAgZnVuY3Rpb24gbG9jYWxlTW9udGhzIChtLCBmb3JtYXQpIHtcbiAgICAgICAgaWYgKCFtKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNBcnJheSh0aGlzLl9tb250aHMpID8gdGhpcy5fbW9udGhzIDpcbiAgICAgICAgICAgICAgICB0aGlzLl9tb250aHNbJ3N0YW5kYWxvbmUnXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXNBcnJheSh0aGlzLl9tb250aHMpID8gdGhpcy5fbW9udGhzW20ubW9udGgoKV0gOlxuICAgICAgICAgICAgdGhpcy5fbW9udGhzWyh0aGlzLl9tb250aHMuaXNGb3JtYXQgfHwgTU9OVEhTX0lOX0ZPUk1BVCkudGVzdChmb3JtYXQpID8gJ2Zvcm1hdCcgOiAnc3RhbmRhbG9uZSddW20ubW9udGgoKV07XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVNb250aHNTaG9ydCA9ICdKYW5fRmViX01hcl9BcHJfTWF5X0p1bl9KdWxfQXVnX1NlcF9PY3RfTm92X0RlYycuc3BsaXQoJ18nKTtcbiAgICBmdW5jdGlvbiBsb2NhbGVNb250aHNTaG9ydCAobSwgZm9ybWF0KSB7XG4gICAgICAgIGlmICghbSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzQXJyYXkodGhpcy5fbW9udGhzU2hvcnQpID8gdGhpcy5fbW9udGhzU2hvcnQgOlxuICAgICAgICAgICAgICAgIHRoaXMuX21vbnRoc1Nob3J0WydzdGFuZGFsb25lJ107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzQXJyYXkodGhpcy5fbW9udGhzU2hvcnQpID8gdGhpcy5fbW9udGhzU2hvcnRbbS5tb250aCgpXSA6XG4gICAgICAgICAgICB0aGlzLl9tb250aHNTaG9ydFtNT05USFNfSU5fRk9STUFULnRlc3QoZm9ybWF0KSA/ICdmb3JtYXQnIDogJ3N0YW5kYWxvbmUnXVttLm1vbnRoKCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZVN0cmljdFBhcnNlKG1vbnRoTmFtZSwgZm9ybWF0LCBzdHJpY3QpIHtcbiAgICAgICAgdmFyIGksIGlpLCBtb20sIGxsYyA9IG1vbnRoTmFtZS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoIXRoaXMuX21vbnRoc1BhcnNlKSB7XG4gICAgICAgICAgICAvLyB0aGlzIGlzIG5vdCB1c2VkXG4gICAgICAgICAgICB0aGlzLl9tb250aHNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fbG9uZ01vbnRoc1BhcnNlID0gW107XG4gICAgICAgICAgICB0aGlzLl9zaG9ydE1vbnRoc1BhcnNlID0gW107XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTI7ICsraSkge1xuICAgICAgICAgICAgICAgIG1vbSA9IGNyZWF0ZVVUQyhbMjAwMCwgaV0pO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Nob3J0TW9udGhzUGFyc2VbaV0gPSB0aGlzLm1vbnRoc1Nob3J0KG1vbSwgJycpLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldID0gdGhpcy5tb250aHMobW9tLCAnJykudG9Mb2NhbGVMb3dlckNhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdHJpY3QpIHtcbiAgICAgICAgICAgIGlmIChmb3JtYXQgPT09ICdNTU0nKSB7XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fc2hvcnRNb250aHNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9sb25nTW9udGhzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChmb3JtYXQgPT09ICdNTU0nKSB7XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fc2hvcnRNb250aHNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICBpZiAoaWkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fbG9uZ01vbnRoc1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX2xvbmdNb250aHNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICBpZiAoaWkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fc2hvcnRNb250aHNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9jYWxlTW9udGhzUGFyc2UgKG1vbnRoTmFtZSwgZm9ybWF0LCBzdHJpY3QpIHtcbiAgICAgICAgdmFyIGksIG1vbSwgcmVnZXg7XG5cbiAgICAgICAgaWYgKHRoaXMuX21vbnRoc1BhcnNlRXhhY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVTdHJpY3RQYXJzZS5jYWxsKHRoaXMsIG1vbnRoTmFtZSwgZm9ybWF0LCBzdHJpY3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLl9tb250aHNQYXJzZSkge1xuICAgICAgICAgICAgdGhpcy5fbW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX2xvbmdNb250aHNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fc2hvcnRNb250aHNQYXJzZSA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVE9ETzogYWRkIHNvcnRpbmdcbiAgICAgICAgLy8gU29ydGluZyBtYWtlcyBzdXJlIGlmIG9uZSBtb250aCAob3IgYWJicikgaXMgYSBwcmVmaXggb2YgYW5vdGhlclxuICAgICAgICAvLyBzZWUgc29ydGluZyBpbiBjb21wdXRlTW9udGhzUGFyc2VcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDEyOyBpKyspIHtcbiAgICAgICAgICAgIC8vIG1ha2UgdGhlIHJlZ2V4IGlmIHdlIGRvbid0IGhhdmUgaXQgYWxyZWFkeVxuICAgICAgICAgICAgbW9tID0gY3JlYXRlVVRDKFsyMDAwLCBpXSk7XG4gICAgICAgICAgICBpZiAoc3RyaWN0ICYmICF0aGlzLl9sb25nTW9udGhzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb25nTW9udGhzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKCdeJyArIHRoaXMubW9udGhzKG1vbSwgJycpLnJlcGxhY2UoJy4nLCAnJykgKyAnJCcsICdpJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2hvcnRNb250aHNQYXJzZVtpXSA9IG5ldyBSZWdFeHAoJ14nICsgdGhpcy5tb250aHNTaG9ydChtb20sICcnKS5yZXBsYWNlKCcuJywgJycpICsgJyQnLCAnaScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFzdHJpY3QgJiYgIXRoaXMuX21vbnRoc1BhcnNlW2ldKSB7XG4gICAgICAgICAgICAgICAgcmVnZXggPSAnXicgKyB0aGlzLm1vbnRocyhtb20sICcnKSArICd8XicgKyB0aGlzLm1vbnRoc1Nob3J0KG1vbSwgJycpO1xuICAgICAgICAgICAgICAgIHRoaXMuX21vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cChyZWdleC5yZXBsYWNlKCcuJywgJycpLCAnaScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGVzdCB0aGUgcmVnZXhcbiAgICAgICAgICAgIGlmIChzdHJpY3QgJiYgZm9ybWF0ID09PSAnTU1NTScgJiYgdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldLnRlc3QobW9udGhOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdHJpY3QgJiYgZm9ybWF0ID09PSAnTU1NJyAmJiB0aGlzLl9zaG9ydE1vbnRoc1BhcnNlW2ldLnRlc3QobW9udGhOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghc3RyaWN0ICYmIHRoaXMuX21vbnRoc1BhcnNlW2ldLnRlc3QobW9udGhOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gc2V0TW9udGggKG1vbSwgdmFsdWUpIHtcbiAgICAgICAgdmFyIGRheU9mTW9udGg7XG5cbiAgICAgICAgaWYgKCFtb20uaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICAvLyBObyBvcFxuICAgICAgICAgICAgcmV0dXJuIG1vbTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZiAoL15cXGQrJC8udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRvSW50KHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBtb20ubG9jYWxlRGF0YSgpLm1vbnRoc1BhcnNlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBBbm90aGVyIHNpbGVudCBmYWlsdXJlP1xuICAgICAgICAgICAgICAgIGlmICghaXNOdW1iZXIodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtb207XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZGF5T2ZNb250aCA9IE1hdGgubWluKG1vbS5kYXRlKCksIGRheXNJbk1vbnRoKG1vbS55ZWFyKCksIHZhbHVlKSk7XG4gICAgICAgIG1vbS5fZFsnc2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyAnTW9udGgnXSh2YWx1ZSwgZGF5T2ZNb250aCk7XG4gICAgICAgIHJldHVybiBtb207XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0TW9udGggKHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBzZXRNb250aCh0aGlzLCB2YWx1ZSk7XG4gICAgICAgICAgICBob29rcy51cGRhdGVPZmZzZXQodGhpcywgdHJ1ZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBnZXQodGhpcywgJ01vbnRoJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXREYXlzSW5Nb250aCAoKSB7XG4gICAgICAgIHJldHVybiBkYXlzSW5Nb250aCh0aGlzLnllYXIoKSwgdGhpcy5tb250aCgpKTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdE1vbnRoc1Nob3J0UmVnZXggPSBtYXRjaFdvcmQ7XG4gICAgZnVuY3Rpb24gbW9udGhzU2hvcnRSZWdleCAoaXNTdHJpY3QpIHtcbiAgICAgICAgaWYgKHRoaXMuX21vbnRoc1BhcnNlRXhhY3QpIHtcbiAgICAgICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX21vbnRoc1JlZ2V4JykpIHtcbiAgICAgICAgICAgICAgICBjb21wdXRlTW9udGhzUGFyc2UuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc1N0cmljdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb250aHNTaG9ydFN0cmljdFJlZ2V4O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzU2hvcnRSZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX21vbnRoc1Nob3J0UmVnZXgnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21vbnRoc1Nob3J0UmVnZXggPSBkZWZhdWx0TW9udGhzU2hvcnRSZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb250aHNTaG9ydFN0cmljdFJlZ2V4ICYmIGlzU3RyaWN0ID9cbiAgICAgICAgICAgICAgICB0aGlzLl9tb250aHNTaG9ydFN0cmljdFJlZ2V4IDogdGhpcy5fbW9udGhzU2hvcnRSZWdleDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TW9udGhzUmVnZXggPSBtYXRjaFdvcmQ7XG4gICAgZnVuY3Rpb24gbW9udGhzUmVnZXggKGlzU3RyaWN0KSB7XG4gICAgICAgIGlmICh0aGlzLl9tb250aHNQYXJzZUV4YWN0KSB7XG4gICAgICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ19tb250aHNSZWdleCcpKSB7XG4gICAgICAgICAgICAgICAgY29tcHV0ZU1vbnRoc1BhcnNlLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNTdHJpY3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzU3RyaWN0UmVnZXg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb250aHNSZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX21vbnRoc1JlZ2V4JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb250aHNSZWdleCA9IGRlZmF1bHRNb250aHNSZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb250aHNTdHJpY3RSZWdleCAmJiBpc1N0cmljdCA/XG4gICAgICAgICAgICAgICAgdGhpcy5fbW9udGhzU3RyaWN0UmVnZXggOiB0aGlzLl9tb250aHNSZWdleDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbXB1dGVNb250aHNQYXJzZSAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIGNtcExlblJldihhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYi5sZW5ndGggLSBhLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzaG9ydFBpZWNlcyA9IFtdLCBsb25nUGllY2VzID0gW10sIG1peGVkUGllY2VzID0gW10sXG4gICAgICAgICAgICBpLCBtb207XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG4gICAgICAgICAgICAvLyBtYWtlIHRoZSByZWdleCBpZiB3ZSBkb24ndCBoYXZlIGl0IGFscmVhZHlcbiAgICAgICAgICAgIG1vbSA9IGNyZWF0ZVVUQyhbMjAwMCwgaV0pO1xuICAgICAgICAgICAgc2hvcnRQaWVjZXMucHVzaCh0aGlzLm1vbnRoc1Nob3J0KG1vbSwgJycpKTtcbiAgICAgICAgICAgIGxvbmdQaWVjZXMucHVzaCh0aGlzLm1vbnRocyhtb20sICcnKSk7XG4gICAgICAgICAgICBtaXhlZFBpZWNlcy5wdXNoKHRoaXMubW9udGhzKG1vbSwgJycpKTtcbiAgICAgICAgICAgIG1peGVkUGllY2VzLnB1c2godGhpcy5tb250aHNTaG9ydChtb20sICcnKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU29ydGluZyBtYWtlcyBzdXJlIGlmIG9uZSBtb250aCAob3IgYWJicikgaXMgYSBwcmVmaXggb2YgYW5vdGhlciBpdFxuICAgICAgICAvLyB3aWxsIG1hdGNoIHRoZSBsb25nZXIgcGllY2UuXG4gICAgICAgIHNob3J0UGllY2VzLnNvcnQoY21wTGVuUmV2KTtcbiAgICAgICAgbG9uZ1BpZWNlcy5zb3J0KGNtcExlblJldik7XG4gICAgICAgIG1peGVkUGllY2VzLnNvcnQoY21wTGVuUmV2KTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDEyOyBpKyspIHtcbiAgICAgICAgICAgIHNob3J0UGllY2VzW2ldID0gcmVnZXhFc2NhcGUoc2hvcnRQaWVjZXNbaV0pO1xuICAgICAgICAgICAgbG9uZ1BpZWNlc1tpXSA9IHJlZ2V4RXNjYXBlKGxvbmdQaWVjZXNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAyNDsgaSsrKSB7XG4gICAgICAgICAgICBtaXhlZFBpZWNlc1tpXSA9IHJlZ2V4RXNjYXBlKG1peGVkUGllY2VzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX21vbnRoc1JlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgbWl4ZWRQaWVjZXMuam9pbignfCcpICsgJyknLCAnaScpO1xuICAgICAgICB0aGlzLl9tb250aHNTaG9ydFJlZ2V4ID0gdGhpcy5fbW9udGhzUmVnZXg7XG4gICAgICAgIHRoaXMuX21vbnRoc1N0cmljdFJlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgbG9uZ1BpZWNlcy5qb2luKCd8JykgKyAnKScsICdpJyk7XG4gICAgICAgIHRoaXMuX21vbnRoc1Nob3J0U3RyaWN0UmVnZXggPSBuZXcgUmVnRXhwKCdeKCcgKyBzaG9ydFBpZWNlcy5qb2luKCd8JykgKyAnKScsICdpJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlRGF0ZSAoeSwgbSwgZCwgaCwgTSwgcywgbXMpIHtcbiAgICAgICAgLy8gY2FuJ3QganVzdCBhcHBseSgpIHRvIGNyZWF0ZSBhIGRhdGU6XG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcS8xODEzNDhcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh5LCBtLCBkLCBoLCBNLCBzLCBtcyk7XG5cbiAgICAgICAgLy8gdGhlIGRhdGUgY29uc3RydWN0b3IgcmVtYXBzIHllYXJzIDAtOTkgdG8gMTkwMC0xOTk5XG4gICAgICAgIGlmICh5IDwgMTAwICYmIHkgPj0gMCAmJiBpc0Zpbml0ZShkYXRlLmdldEZ1bGxZZWFyKCkpKSB7XG4gICAgICAgICAgICBkYXRlLnNldEZ1bGxZZWFyKHkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZVVUQ0RhdGUgKHkpIHtcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShEYXRlLlVUQy5hcHBseShudWxsLCBhcmd1bWVudHMpKTtcblxuICAgICAgICAvLyB0aGUgRGF0ZS5VVEMgZnVuY3Rpb24gcmVtYXBzIHllYXJzIDAtOTkgdG8gMTkwMC0xOTk5XG4gICAgICAgIGlmICh5IDwgMTAwICYmIHkgPj0gMCAmJiBpc0Zpbml0ZShkYXRlLmdldFVUQ0Z1bGxZZWFyKCkpKSB7XG4gICAgICAgICAgICBkYXRlLnNldFVUQ0Z1bGxZZWFyKHkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cblxuICAgIC8vIHN0YXJ0LW9mLWZpcnN0LXdlZWsgLSBzdGFydC1vZi15ZWFyXG4gICAgZnVuY3Rpb24gZmlyc3RXZWVrT2Zmc2V0KHllYXIsIGRvdywgZG95KSB7XG4gICAgICAgIHZhciAvLyBmaXJzdC13ZWVrIGRheSAtLSB3aGljaCBqYW51YXJ5IGlzIGFsd2F5cyBpbiB0aGUgZmlyc3Qgd2VlayAoNCBmb3IgaXNvLCAxIGZvciBvdGhlcilcbiAgICAgICAgICAgIGZ3ZCA9IDcgKyBkb3cgLSBkb3ksXG4gICAgICAgICAgICAvLyBmaXJzdC13ZWVrIGRheSBsb2NhbCB3ZWVrZGF5IC0tIHdoaWNoIGxvY2FsIHdlZWtkYXkgaXMgZndkXG4gICAgICAgICAgICBmd2RsdyA9ICg3ICsgY3JlYXRlVVRDRGF0ZSh5ZWFyLCAwLCBmd2QpLmdldFVUQ0RheSgpIC0gZG93KSAlIDc7XG5cbiAgICAgICAgcmV0dXJuIC1md2RsdyArIGZ3ZCAtIDE7XG4gICAgfVxuXG4gICAgLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSVNPX3dlZWtfZGF0ZSNDYWxjdWxhdGluZ19hX2RhdGVfZ2l2ZW5fdGhlX3llYXIuMkNfd2Vla19udW1iZXJfYW5kX3dlZWtkYXlcbiAgICBmdW5jdGlvbiBkYXlPZlllYXJGcm9tV2Vla3MoeWVhciwgd2Vlaywgd2Vla2RheSwgZG93LCBkb3kpIHtcbiAgICAgICAgdmFyIGxvY2FsV2Vla2RheSA9ICg3ICsgd2Vla2RheSAtIGRvdykgJSA3LFxuICAgICAgICAgICAgd2Vla09mZnNldCA9IGZpcnN0V2Vla09mZnNldCh5ZWFyLCBkb3csIGRveSksXG4gICAgICAgICAgICBkYXlPZlllYXIgPSAxICsgNyAqICh3ZWVrIC0gMSkgKyBsb2NhbFdlZWtkYXkgKyB3ZWVrT2Zmc2V0LFxuICAgICAgICAgICAgcmVzWWVhciwgcmVzRGF5T2ZZZWFyO1xuXG4gICAgICAgIGlmIChkYXlPZlllYXIgPD0gMCkge1xuICAgICAgICAgICAgcmVzWWVhciA9IHllYXIgLSAxO1xuICAgICAgICAgICAgcmVzRGF5T2ZZZWFyID0gZGF5c0luWWVhcihyZXNZZWFyKSArIGRheU9mWWVhcjtcbiAgICAgICAgfSBlbHNlIGlmIChkYXlPZlllYXIgPiBkYXlzSW5ZZWFyKHllYXIpKSB7XG4gICAgICAgICAgICByZXNZZWFyID0geWVhciArIDE7XG4gICAgICAgICAgICByZXNEYXlPZlllYXIgPSBkYXlPZlllYXIgLSBkYXlzSW5ZZWFyKHllYXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzWWVhciA9IHllYXI7XG4gICAgICAgICAgICByZXNEYXlPZlllYXIgPSBkYXlPZlllYXI7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeWVhcjogcmVzWWVhcixcbiAgICAgICAgICAgIGRheU9mWWVhcjogcmVzRGF5T2ZZZWFyXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd2Vla09mWWVhcihtb20sIGRvdywgZG95KSB7XG4gICAgICAgIHZhciB3ZWVrT2Zmc2V0ID0gZmlyc3RXZWVrT2Zmc2V0KG1vbS55ZWFyKCksIGRvdywgZG95KSxcbiAgICAgICAgICAgIHdlZWsgPSBNYXRoLmZsb29yKChtb20uZGF5T2ZZZWFyKCkgLSB3ZWVrT2Zmc2V0IC0gMSkgLyA3KSArIDEsXG4gICAgICAgICAgICByZXNXZWVrLCByZXNZZWFyO1xuXG4gICAgICAgIGlmICh3ZWVrIDwgMSkge1xuICAgICAgICAgICAgcmVzWWVhciA9IG1vbS55ZWFyKCkgLSAxO1xuICAgICAgICAgICAgcmVzV2VlayA9IHdlZWsgKyB3ZWVrc0luWWVhcihyZXNZZWFyLCBkb3csIGRveSk7XG4gICAgICAgIH0gZWxzZSBpZiAod2VlayA+IHdlZWtzSW5ZZWFyKG1vbS55ZWFyKCksIGRvdywgZG95KSkge1xuICAgICAgICAgICAgcmVzV2VlayA9IHdlZWsgLSB3ZWVrc0luWWVhcihtb20ueWVhcigpLCBkb3csIGRveSk7XG4gICAgICAgICAgICByZXNZZWFyID0gbW9tLnllYXIoKSArIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXNZZWFyID0gbW9tLnllYXIoKTtcbiAgICAgICAgICAgIHJlc1dlZWsgPSB3ZWVrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHdlZWs6IHJlc1dlZWssXG4gICAgICAgICAgICB5ZWFyOiByZXNZZWFyXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd2Vla3NJblllYXIoeWVhciwgZG93LCBkb3kpIHtcbiAgICAgICAgdmFyIHdlZWtPZmZzZXQgPSBmaXJzdFdlZWtPZmZzZXQoeWVhciwgZG93LCBkb3kpLFxuICAgICAgICAgICAgd2Vla09mZnNldE5leHQgPSBmaXJzdFdlZWtPZmZzZXQoeWVhciArIDEsIGRvdywgZG95KTtcbiAgICAgICAgcmV0dXJuIChkYXlzSW5ZZWFyKHllYXIpIC0gd2Vla09mZnNldCArIHdlZWtPZmZzZXROZXh0KSAvIDc7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ3cnLCBbJ3d3JywgMl0sICd3bycsICd3ZWVrJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ1cnLCBbJ1dXJywgMl0sICdXbycsICdpc29XZWVrJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3dlZWsnLCAndycpO1xuICAgIGFkZFVuaXRBbGlhcygnaXNvV2VlaycsICdXJyk7XG5cbiAgICAvLyBQUklPUklUSUVTXG5cbiAgICBhZGRVbml0UHJpb3JpdHkoJ3dlZWsnLCA1KTtcbiAgICBhZGRVbml0UHJpb3JpdHkoJ2lzb1dlZWsnLCA1KTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ3cnLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCd3dycsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdXJywgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignV1cnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG5cbiAgICBhZGRXZWVrUGFyc2VUb2tlbihbJ3cnLCAnd3cnLCAnVycsICdXVyddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgd2Vla1t0b2tlbi5zdWJzdHIoMCwgMSldID0gdG9JbnQoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgLy8gTE9DQUxFU1xuXG4gICAgZnVuY3Rpb24gbG9jYWxlV2VlayAobW9tKSB7XG4gICAgICAgIHJldHVybiB3ZWVrT2ZZZWFyKG1vbSwgdGhpcy5fd2Vlay5kb3csIHRoaXMuX3dlZWsuZG95KS53ZWVrO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9jYWxlV2VlayA9IHtcbiAgICAgICAgZG93IDogMCwgLy8gU3VuZGF5IGlzIHRoZSBmaXJzdCBkYXkgb2YgdGhlIHdlZWsuXG4gICAgICAgIGRveSA6IDYgIC8vIFRoZSB3ZWVrIHRoYXQgY29udGFpbnMgSmFuIDFzdCBpcyB0aGUgZmlyc3Qgd2VlayBvZiB0aGUgeWVhci5cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbG9jYWxlRmlyc3REYXlPZldlZWsgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2Vlay5kb3c7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9jYWxlRmlyc3REYXlPZlllYXIgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2Vlay5kb3k7XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0V2VlayAoaW5wdXQpIHtcbiAgICAgICAgdmFyIHdlZWsgPSB0aGlzLmxvY2FsZURhdGEoKS53ZWVrKHRoaXMpO1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHdlZWsgOiB0aGlzLmFkZCgoaW5wdXQgLSB3ZWVrKSAqIDcsICdkJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0SVNPV2VlayAoaW5wdXQpIHtcbiAgICAgICAgdmFyIHdlZWsgPSB3ZWVrT2ZZZWFyKHRoaXMsIDEsIDQpLndlZWs7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gd2VlayA6IHRoaXMuYWRkKChpbnB1dCAtIHdlZWspICogNywgJ2QnKTtcbiAgICB9XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBhZGRGb3JtYXRUb2tlbignZCcsIDAsICdkbycsICdkYXknKTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdkZCcsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLndlZWtkYXlzTWluKHRoaXMsIGZvcm1hdCk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignZGRkJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkud2Vla2RheXNTaG9ydCh0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2RkZGQnLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS53ZWVrZGF5cyh0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2UnLCAwLCAwLCAnd2Vla2RheScpO1xuICAgIGFkZEZvcm1hdFRva2VuKCdFJywgMCwgMCwgJ2lzb1dlZWtkYXknKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnZGF5JywgJ2QnKTtcbiAgICBhZGRVbml0QWxpYXMoJ3dlZWtkYXknLCAnZScpO1xuICAgIGFkZFVuaXRBbGlhcygnaXNvV2Vla2RheScsICdFJyk7XG5cbiAgICAvLyBQUklPUklUWVxuICAgIGFkZFVuaXRQcmlvcml0eSgnZGF5JywgMTEpO1xuICAgIGFkZFVuaXRQcmlvcml0eSgnd2Vla2RheScsIDExKTtcbiAgICBhZGRVbml0UHJpb3JpdHkoJ2lzb1dlZWtkYXknLCAxMSk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdkJywgICAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdlJywgICAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdFJywgICAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdkZCcsICAgZnVuY3Rpb24gKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS53ZWVrZGF5c01pblJlZ2V4KGlzU3RyaWN0KTtcbiAgICB9KTtcbiAgICBhZGRSZWdleFRva2VuKCdkZGQnLCAgIGZ1bmN0aW9uIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUud2Vla2RheXNTaG9ydFJlZ2V4KGlzU3RyaWN0KTtcbiAgICB9KTtcbiAgICBhZGRSZWdleFRva2VuKCdkZGRkJywgICBmdW5jdGlvbiAoaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gbG9jYWxlLndlZWtkYXlzUmVnZXgoaXNTdHJpY3QpO1xuICAgIH0pO1xuXG4gICAgYWRkV2Vla1BhcnNlVG9rZW4oWydkZCcsICdkZGQnLCAnZGRkZCddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgdmFyIHdlZWtkYXkgPSBjb25maWcuX2xvY2FsZS53ZWVrZGF5c1BhcnNlKGlucHV0LCB0b2tlbiwgY29uZmlnLl9zdHJpY3QpO1xuICAgICAgICAvLyBpZiB3ZSBkaWRuJ3QgZ2V0IGEgd2Vla2RheSBuYW1lLCBtYXJrIHRoZSBkYXRlIGFzIGludmFsaWRcbiAgICAgICAgaWYgKHdlZWtkYXkgIT0gbnVsbCkge1xuICAgICAgICAgICAgd2Vlay5kID0gd2Vla2RheTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmludmFsaWRXZWVrZGF5ID0gaW5wdXQ7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsnZCcsICdlJywgJ0UnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIHdlZWtbdG9rZW5dID0gdG9JbnQoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgZnVuY3Rpb24gcGFyc2VXZWVrZGF5KGlucHV0LCBsb2NhbGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNOYU4oaW5wdXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQoaW5wdXQsIDEwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlucHV0ID0gbG9jYWxlLndlZWtkYXlzUGFyc2UoaW5wdXQpO1xuICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VJc29XZWVrZGF5KGlucHV0LCBsb2NhbGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbGUud2Vla2RheXNQYXJzZShpbnB1dCkgJSA3IHx8IDc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzTmFOKGlucHV0KSA/IG51bGwgOiBpbnB1dDtcbiAgICB9XG5cbiAgICAvLyBMT0NBTEVTXG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZVdlZWtkYXlzID0gJ1N1bmRheV9Nb25kYXlfVHVlc2RheV9XZWRuZXNkYXlfVGh1cnNkYXlfRnJpZGF5X1NhdHVyZGF5Jy5zcGxpdCgnXycpO1xuICAgIGZ1bmN0aW9uIGxvY2FsZVdlZWtkYXlzIChtLCBmb3JtYXQpIHtcbiAgICAgICAgaWYgKCFtKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNBcnJheSh0aGlzLl93ZWVrZGF5cykgPyB0aGlzLl93ZWVrZGF5cyA6XG4gICAgICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNbJ3N0YW5kYWxvbmUnXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXNBcnJheSh0aGlzLl93ZWVrZGF5cykgPyB0aGlzLl93ZWVrZGF5c1ttLmRheSgpXSA6XG4gICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1t0aGlzLl93ZWVrZGF5cy5pc0Zvcm1hdC50ZXN0KGZvcm1hdCkgPyAnZm9ybWF0JyA6ICdzdGFuZGFsb25lJ11bbS5kYXkoKV07XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVXZWVrZGF5c1Nob3J0ID0gJ1N1bl9Nb25fVHVlX1dlZF9UaHVfRnJpX1NhdCcuc3BsaXQoJ18nKTtcbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrZGF5c1Nob3J0IChtKSB7XG4gICAgICAgIHJldHVybiAobSkgPyB0aGlzLl93ZWVrZGF5c1Nob3J0W20uZGF5KCldIDogdGhpcy5fd2Vla2RheXNTaG9ydDtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZVdlZWtkYXlzTWluID0gJ1N1X01vX1R1X1dlX1RoX0ZyX1NhJy5zcGxpdCgnXycpO1xuICAgIGZ1bmN0aW9uIGxvY2FsZVdlZWtkYXlzTWluIChtKSB7XG4gICAgICAgIHJldHVybiAobSkgPyB0aGlzLl93ZWVrZGF5c01pblttLmRheSgpXSA6IHRoaXMuX3dlZWtkYXlzTWluO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZVN0cmljdFBhcnNlJDEod2Vla2RheU5hbWUsIGZvcm1hdCwgc3RyaWN0KSB7XG4gICAgICAgIHZhciBpLCBpaSwgbW9tLCBsbGMgPSB3ZWVrZGF5TmFtZS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoIXRoaXMuX3dlZWtkYXlzUGFyc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fbWluV2Vla2RheXNQYXJzZSA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNzsgKytpKSB7XG4gICAgICAgICAgICAgICAgbW9tID0gY3JlYXRlVVRDKFsyMDAwLCAxXSkuZGF5KGkpO1xuICAgICAgICAgICAgICAgIHRoaXMuX21pbldlZWtkYXlzUGFyc2VbaV0gPSB0aGlzLndlZWtkYXlzTWluKG1vbSwgJycpLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2hvcnRXZWVrZGF5c1BhcnNlW2ldID0gdGhpcy53ZWVrZGF5c1Nob3J0KG1vbSwgJycpLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNQYXJzZVtpXSA9IHRoaXMud2Vla2RheXMobW9tLCAnJykudG9Mb2NhbGVMb3dlckNhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdHJpY3QpIHtcbiAgICAgICAgICAgIGlmIChmb3JtYXQgPT09ICdkZGRkJykge1xuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3dlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0ID09PSAnZGRkJykge1xuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9taW5XZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZm9ybWF0ID09PSAnZGRkZCcpIHtcbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl93ZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIGlmIChpaSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgaWYgKGlpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaWk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX21pbldlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0ID09PSAnZGRkJykge1xuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICBpZiAoaWkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fd2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICBpZiAoaWkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fbWluV2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9taW5XZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIGlmIChpaSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl93ZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIGlmIChpaSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZVdlZWtkYXlzUGFyc2UgKHdlZWtkYXlOYW1lLCBmb3JtYXQsIHN0cmljdCkge1xuICAgICAgICB2YXIgaSwgbW9tLCByZWdleDtcblxuICAgICAgICBpZiAodGhpcy5fd2Vla2RheXNQYXJzZUV4YWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlU3RyaWN0UGFyc2UkMS5jYWxsKHRoaXMsIHdlZWtkYXlOYW1lLCBmb3JtYXQsIHN0cmljdCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuX3dlZWtkYXlzUGFyc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX21pbldlZWtkYXlzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fZnVsbFdlZWtkYXlzUGFyc2UgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgIC8vIG1ha2UgdGhlIHJlZ2V4IGlmIHdlIGRvbid0IGhhdmUgaXQgYWxyZWFkeVxuXG4gICAgICAgICAgICBtb20gPSBjcmVhdGVVVEMoWzIwMDAsIDFdKS5kYXkoaSk7XG4gICAgICAgICAgICBpZiAoc3RyaWN0ICYmICF0aGlzLl9mdWxsV2Vla2RheXNQYXJzZVtpXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Z1bGxXZWVrZGF5c1BhcnNlW2ldID0gbmV3IFJlZ0V4cCgnXicgKyB0aGlzLndlZWtkYXlzKG1vbSwgJycpLnJlcGxhY2UoJy4nLCAnXFxcXC4/JykgKyAnJCcsICdpJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2hvcnRXZWVrZGF5c1BhcnNlW2ldID0gbmV3IFJlZ0V4cCgnXicgKyB0aGlzLndlZWtkYXlzU2hvcnQobW9tLCAnJykucmVwbGFjZSgnLicsICdcXFxcLj8nKSArICckJywgJ2knKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9taW5XZWVrZGF5c1BhcnNlW2ldID0gbmV3IFJlZ0V4cCgnXicgKyB0aGlzLndlZWtkYXlzTWluKG1vbSwgJycpLnJlcGxhY2UoJy4nLCAnXFxcXC4/JykgKyAnJCcsICdpJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3dlZWtkYXlzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgICAgICByZWdleCA9ICdeJyArIHRoaXMud2Vla2RheXMobW9tLCAnJykgKyAnfF4nICsgdGhpcy53ZWVrZGF5c1Nob3J0KG1vbSwgJycpICsgJ3xeJyArIHRoaXMud2Vla2RheXNNaW4obW9tLCAnJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNQYXJzZVtpXSA9IG5ldyBSZWdFeHAocmVnZXgucmVwbGFjZSgnLicsICcnKSwgJ2knKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRlc3QgdGhlIHJlZ2V4XG4gICAgICAgICAgICBpZiAoc3RyaWN0ICYmIGZvcm1hdCA9PT0gJ2RkZGQnICYmIHRoaXMuX2Z1bGxXZWVrZGF5c1BhcnNlW2ldLnRlc3Qod2Vla2RheU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0cmljdCAmJiBmb3JtYXQgPT09ICdkZGQnICYmIHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZVtpXS50ZXN0KHdlZWtkYXlOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdHJpY3QgJiYgZm9ybWF0ID09PSAnZGQnICYmIHRoaXMuX21pbldlZWtkYXlzUGFyc2VbaV0udGVzdCh3ZWVrZGF5TmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXN0cmljdCAmJiB0aGlzLl93ZWVrZGF5c1BhcnNlW2ldLnRlc3Qod2Vla2RheU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXREYXlPZldlZWsgKGlucHV0KSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCAhPSBudWxsID8gdGhpcyA6IE5hTjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGF5ID0gdGhpcy5faXNVVEMgPyB0aGlzLl9kLmdldFVUQ0RheSgpIDogdGhpcy5fZC5nZXREYXkoKTtcbiAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlucHV0ID0gcGFyc2VXZWVrZGF5KGlucHV0LCB0aGlzLmxvY2FsZURhdGEoKSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hZGQoaW5wdXQgLSBkYXksICdkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZGF5O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0TG9jYWxlRGF5T2ZXZWVrIChpbnB1dCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQgIT0gbnVsbCA/IHRoaXMgOiBOYU47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHdlZWtkYXkgPSAodGhpcy5kYXkoKSArIDcgLSB0aGlzLmxvY2FsZURhdGEoKS5fd2Vlay5kb3cpICUgNztcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB3ZWVrZGF5IDogdGhpcy5hZGQoaW5wdXQgLSB3ZWVrZGF5LCAnZCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldElTT0RheU9mV2VlayAoaW5wdXQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0ICE9IG51bGwgPyB0aGlzIDogTmFOO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYmVoYXZlcyB0aGUgc2FtZSBhcyBtb21lbnQjZGF5IGV4Y2VwdFxuICAgICAgICAvLyBhcyBhIGdldHRlciwgcmV0dXJucyA3IGluc3RlYWQgb2YgMCAoMS03IHJhbmdlIGluc3RlYWQgb2YgMC02KVxuICAgICAgICAvLyBhcyBhIHNldHRlciwgc3VuZGF5IHNob3VsZCBiZWxvbmcgdG8gdGhlIHByZXZpb3VzIHdlZWsuXG5cbiAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHZhciB3ZWVrZGF5ID0gcGFyc2VJc29XZWVrZGF5KGlucHV0LCB0aGlzLmxvY2FsZURhdGEoKSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXkodGhpcy5kYXkoKSAlIDcgPyB3ZWVrZGF5IDogd2Vla2RheSAtIDcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF5KCkgfHwgNztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBkZWZhdWx0V2Vla2RheXNSZWdleCA9IG1hdGNoV29yZDtcbiAgICBmdW5jdGlvbiB3ZWVrZGF5c1JlZ2V4IChpc1N0cmljdCkge1xuICAgICAgICBpZiAodGhpcy5fd2Vla2RheXNQYXJzZUV4YWN0KSB7XG4gICAgICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ193ZWVrZGF5c1JlZ2V4JykpIHtcbiAgICAgICAgICAgICAgICBjb21wdXRlV2Vla2RheXNQYXJzZS5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzU3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzU3RyaWN0UmVnZXg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1JlZ2V4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfd2Vla2RheXNSZWdleCcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNSZWdleCA9IGRlZmF1bHRXZWVrZGF5c1JlZ2V4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzU3RyaWN0UmVnZXggJiYgaXNTdHJpY3QgP1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzU3RyaWN0UmVnZXggOiB0aGlzLl93ZWVrZGF5c1JlZ2V4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRXZWVrZGF5c1Nob3J0UmVnZXggPSBtYXRjaFdvcmQ7XG4gICAgZnVuY3Rpb24gd2Vla2RheXNTaG9ydFJlZ2V4IChpc1N0cmljdCkge1xuICAgICAgICBpZiAodGhpcy5fd2Vla2RheXNQYXJzZUV4YWN0KSB7XG4gICAgICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ193ZWVrZGF5c1JlZ2V4JykpIHtcbiAgICAgICAgICAgICAgICBjb21wdXRlV2Vla2RheXNQYXJzZS5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzU3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzU2hvcnRTdHJpY3RSZWdleDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzU2hvcnRSZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX3dlZWtkYXlzU2hvcnRSZWdleCcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNTaG9ydFJlZ2V4ID0gZGVmYXVsdFdlZWtkYXlzU2hvcnRSZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1Nob3J0U3RyaWN0UmVnZXggJiYgaXNTdHJpY3QgP1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzU2hvcnRTdHJpY3RSZWdleCA6IHRoaXMuX3dlZWtkYXlzU2hvcnRSZWdleDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBkZWZhdWx0V2Vla2RheXNNaW5SZWdleCA9IG1hdGNoV29yZDtcbiAgICBmdW5jdGlvbiB3ZWVrZGF5c01pblJlZ2V4IChpc1N0cmljdCkge1xuICAgICAgICBpZiAodGhpcy5fd2Vla2RheXNQYXJzZUV4YWN0KSB7XG4gICAgICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ193ZWVrZGF5c1JlZ2V4JykpIHtcbiAgICAgICAgICAgICAgICBjb21wdXRlV2Vla2RheXNQYXJzZS5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzU3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzTWluU3RyaWN0UmVnZXg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c01pblJlZ2V4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfd2Vla2RheXNNaW5SZWdleCcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNNaW5SZWdleCA9IGRlZmF1bHRXZWVrZGF5c01pblJlZ2V4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzTWluU3RyaWN0UmVnZXggJiYgaXNTdHJpY3QgP1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzTWluU3RyaWN0UmVnZXggOiB0aGlzLl93ZWVrZGF5c01pblJlZ2V4O1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBjb21wdXRlV2Vla2RheXNQYXJzZSAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIGNtcExlblJldihhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYi5sZW5ndGggLSBhLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBtaW5QaWVjZXMgPSBbXSwgc2hvcnRQaWVjZXMgPSBbXSwgbG9uZ1BpZWNlcyA9IFtdLCBtaXhlZFBpZWNlcyA9IFtdLFxuICAgICAgICAgICAgaSwgbW9tLCBtaW5wLCBzaG9ydHAsIGxvbmdwO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICAvLyBtYWtlIHRoZSByZWdleCBpZiB3ZSBkb24ndCBoYXZlIGl0IGFscmVhZHlcbiAgICAgICAgICAgIG1vbSA9IGNyZWF0ZVVUQyhbMjAwMCwgMV0pLmRheShpKTtcbiAgICAgICAgICAgIG1pbnAgPSB0aGlzLndlZWtkYXlzTWluKG1vbSwgJycpO1xuICAgICAgICAgICAgc2hvcnRwID0gdGhpcy53ZWVrZGF5c1Nob3J0KG1vbSwgJycpO1xuICAgICAgICAgICAgbG9uZ3AgPSB0aGlzLndlZWtkYXlzKG1vbSwgJycpO1xuICAgICAgICAgICAgbWluUGllY2VzLnB1c2gobWlucCk7XG4gICAgICAgICAgICBzaG9ydFBpZWNlcy5wdXNoKHNob3J0cCk7XG4gICAgICAgICAgICBsb25nUGllY2VzLnB1c2gobG9uZ3ApO1xuICAgICAgICAgICAgbWl4ZWRQaWVjZXMucHVzaChtaW5wKTtcbiAgICAgICAgICAgIG1peGVkUGllY2VzLnB1c2goc2hvcnRwKTtcbiAgICAgICAgICAgIG1peGVkUGllY2VzLnB1c2gobG9uZ3ApO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNvcnRpbmcgbWFrZXMgc3VyZSBpZiBvbmUgd2Vla2RheSAob3IgYWJicikgaXMgYSBwcmVmaXggb2YgYW5vdGhlciBpdFxuICAgICAgICAvLyB3aWxsIG1hdGNoIHRoZSBsb25nZXIgcGllY2UuXG4gICAgICAgIG1pblBpZWNlcy5zb3J0KGNtcExlblJldik7XG4gICAgICAgIHNob3J0UGllY2VzLnNvcnQoY21wTGVuUmV2KTtcbiAgICAgICAgbG9uZ1BpZWNlcy5zb3J0KGNtcExlblJldik7XG4gICAgICAgIG1peGVkUGllY2VzLnNvcnQoY21wTGVuUmV2KTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgICAgICAgc2hvcnRQaWVjZXNbaV0gPSByZWdleEVzY2FwZShzaG9ydFBpZWNlc1tpXSk7XG4gICAgICAgICAgICBsb25nUGllY2VzW2ldID0gcmVnZXhFc2NhcGUobG9uZ1BpZWNlc1tpXSk7XG4gICAgICAgICAgICBtaXhlZFBpZWNlc1tpXSA9IHJlZ2V4RXNjYXBlKG1peGVkUGllY2VzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3dlZWtkYXlzUmVnZXggPSBuZXcgUmVnRXhwKCdeKCcgKyBtaXhlZFBpZWNlcy5qb2luKCd8JykgKyAnKScsICdpJyk7XG4gICAgICAgIHRoaXMuX3dlZWtkYXlzU2hvcnRSZWdleCA9IHRoaXMuX3dlZWtkYXlzUmVnZXg7XG4gICAgICAgIHRoaXMuX3dlZWtkYXlzTWluUmVnZXggPSB0aGlzLl93ZWVrZGF5c1JlZ2V4O1xuXG4gICAgICAgIHRoaXMuX3dlZWtkYXlzU3RyaWN0UmVnZXggPSBuZXcgUmVnRXhwKCdeKCcgKyBsb25nUGllY2VzLmpvaW4oJ3wnKSArICcpJywgJ2knKTtcbiAgICAgICAgdGhpcy5fd2Vla2RheXNTaG9ydFN0cmljdFJlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgc2hvcnRQaWVjZXMuam9pbignfCcpICsgJyknLCAnaScpO1xuICAgICAgICB0aGlzLl93ZWVrZGF5c01pblN0cmljdFJlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgbWluUGllY2VzLmpvaW4oJ3wnKSArICcpJywgJ2knKTtcbiAgICB9XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBmdW5jdGlvbiBoRm9ybWF0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ob3VycygpICUgMTIgfHwgMTI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24ga0Zvcm1hdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaG91cnMoKSB8fCAyNDtcbiAgICB9XG5cbiAgICBhZGRGb3JtYXRUb2tlbignSCcsIFsnSEgnLCAyXSwgMCwgJ2hvdXInKTtcbiAgICBhZGRGb3JtYXRUb2tlbignaCcsIFsnaGgnLCAyXSwgMCwgaEZvcm1hdCk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ2snLCBbJ2trJywgMl0sIDAsIGtGb3JtYXQpO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2htbScsIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICcnICsgaEZvcm1hdC5hcHBseSh0aGlzKSArIHplcm9GaWxsKHRoaXMubWludXRlcygpLCAyKTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdobW1zcycsIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICcnICsgaEZvcm1hdC5hcHBseSh0aGlzKSArIHplcm9GaWxsKHRoaXMubWludXRlcygpLCAyKSArXG4gICAgICAgICAgICB6ZXJvRmlsbCh0aGlzLnNlY29uZHMoKSwgMik7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignSG1tJywgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJycgKyB0aGlzLmhvdXJzKCkgKyB6ZXJvRmlsbCh0aGlzLm1pbnV0ZXMoKSwgMik7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignSG1tc3MnLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAnJyArIHRoaXMuaG91cnMoKSArIHplcm9GaWxsKHRoaXMubWludXRlcygpLCAyKSArXG4gICAgICAgICAgICB6ZXJvRmlsbCh0aGlzLnNlY29uZHMoKSwgMik7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBtZXJpZGllbSAodG9rZW4sIGxvd2VyY2FzZSkge1xuICAgICAgICBhZGRGb3JtYXRUb2tlbih0b2tlbiwgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm1lcmlkaWVtKHRoaXMuaG91cnMoKSwgdGhpcy5taW51dGVzKCksIGxvd2VyY2FzZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG1lcmlkaWVtKCdhJywgdHJ1ZSk7XG4gICAgbWVyaWRpZW0oJ0EnLCBmYWxzZSk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ2hvdXInLCAnaCcpO1xuXG4gICAgLy8gUFJJT1JJVFlcbiAgICBhZGRVbml0UHJpb3JpdHkoJ2hvdXInLCAxMyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBmdW5jdGlvbiBtYXRjaE1lcmlkaWVtIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUuX21lcmlkaWVtUGFyc2U7XG4gICAgfVxuXG4gICAgYWRkUmVnZXhUb2tlbignYScsICBtYXRjaE1lcmlkaWVtKTtcbiAgICBhZGRSZWdleFRva2VuKCdBJywgIG1hdGNoTWVyaWRpZW0pO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0gnLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdoJywgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignaycsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0hIJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2hoJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2trJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuXG4gICAgYWRkUmVnZXhUb2tlbignaG1tJywgbWF0Y2gzdG80KTtcbiAgICBhZGRSZWdleFRva2VuKCdobW1zcycsIG1hdGNoNXRvNik7XG4gICAgYWRkUmVnZXhUb2tlbignSG1tJywgbWF0Y2gzdG80KTtcbiAgICBhZGRSZWdleFRva2VuKCdIbW1zcycsIG1hdGNoNXRvNik7XG5cbiAgICBhZGRQYXJzZVRva2VuKFsnSCcsICdISCddLCBIT1VSKTtcbiAgICBhZGRQYXJzZVRva2VuKFsnaycsICdrayddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgdmFyIGtJbnB1dCA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgYXJyYXlbSE9VUl0gPSBrSW5wdXQgPT09IDI0ID8gMCA6IGtJbnB1dDtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKFsnYScsICdBJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBjb25maWcuX2lzUG0gPSBjb25maWcuX2xvY2FsZS5pc1BNKGlucHV0KTtcbiAgICAgICAgY29uZmlnLl9tZXJpZGllbSA9IGlucHV0O1xuICAgIH0pO1xuICAgIGFkZFBhcnNlVG9rZW4oWydoJywgJ2hoJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBhcnJheVtIT1VSXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuYmlnSG91ciA9IHRydWU7XG4gICAgfSk7XG4gICAgYWRkUGFyc2VUb2tlbignaG1tJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIHZhciBwb3MgPSBpbnB1dC5sZW5ndGggLSAyO1xuICAgICAgICBhcnJheVtIT1VSXSA9IHRvSW50KGlucHV0LnN1YnN0cigwLCBwb3MpKTtcbiAgICAgICAgYXJyYXlbTUlOVVRFXSA9IHRvSW50KGlucHV0LnN1YnN0cihwb3MpKTtcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuYmlnSG91ciA9IHRydWU7XG4gICAgfSk7XG4gICAgYWRkUGFyc2VUb2tlbignaG1tc3MnLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgdmFyIHBvczEgPSBpbnB1dC5sZW5ndGggLSA0O1xuICAgICAgICB2YXIgcG9zMiA9IGlucHV0Lmxlbmd0aCAtIDI7XG4gICAgICAgIGFycmF5W0hPVVJdID0gdG9JbnQoaW5wdXQuc3Vic3RyKDAsIHBvczEpKTtcbiAgICAgICAgYXJyYXlbTUlOVVRFXSA9IHRvSW50KGlucHV0LnN1YnN0cihwb3MxLCAyKSk7XG4gICAgICAgIGFycmF5W1NFQ09ORF0gPSB0b0ludChpbnB1dC5zdWJzdHIocG9zMikpO1xuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5iaWdIb3VyID0gdHJ1ZTtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKCdIbW0nLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgdmFyIHBvcyA9IGlucHV0Lmxlbmd0aCAtIDI7XG4gICAgICAgIGFycmF5W0hPVVJdID0gdG9JbnQoaW5wdXQuc3Vic3RyKDAsIHBvcykpO1xuICAgICAgICBhcnJheVtNSU5VVEVdID0gdG9JbnQoaW5wdXQuc3Vic3RyKHBvcykpO1xuICAgIH0pO1xuICAgIGFkZFBhcnNlVG9rZW4oJ0htbXNzJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIHZhciBwb3MxID0gaW5wdXQubGVuZ3RoIC0gNDtcbiAgICAgICAgdmFyIHBvczIgPSBpbnB1dC5sZW5ndGggLSAyO1xuICAgICAgICBhcnJheVtIT1VSXSA9IHRvSW50KGlucHV0LnN1YnN0cigwLCBwb3MxKSk7XG4gICAgICAgIGFycmF5W01JTlVURV0gPSB0b0ludChpbnB1dC5zdWJzdHIocG9zMSwgMikpO1xuICAgICAgICBhcnJheVtTRUNPTkRdID0gdG9JbnQoaW5wdXQuc3Vic3RyKHBvczIpKTtcbiAgICB9KTtcblxuICAgIC8vIExPQ0FMRVNcblxuICAgIGZ1bmN0aW9uIGxvY2FsZUlzUE0gKGlucHV0KSB7XG4gICAgICAgIC8vIElFOCBRdWlya3MgTW9kZSAmIElFNyBTdGFuZGFyZHMgTW9kZSBkbyBub3QgYWxsb3cgYWNjZXNzaW5nIHN0cmluZ3MgbGlrZSBhcnJheXNcbiAgICAgICAgLy8gVXNpbmcgY2hhckF0IHNob3VsZCBiZSBtb3JlIGNvbXBhdGlibGUuXG4gICAgICAgIHJldHVybiAoKGlucHV0ICsgJycpLnRvTG93ZXJDYXNlKCkuY2hhckF0KDApID09PSAncCcpO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9jYWxlTWVyaWRpZW1QYXJzZSA9IC9bYXBdXFwuP20/XFwuPy9pO1xuICAgIGZ1bmN0aW9uIGxvY2FsZU1lcmlkaWVtIChob3VycywgbWludXRlcywgaXNMb3dlcikge1xuICAgICAgICBpZiAoaG91cnMgPiAxMSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzTG93ZXIgPyAncG0nIDogJ1BNJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpc0xvd2VyID8gJ2FtJyA6ICdBTSc7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIC8vIFNldHRpbmcgdGhlIGhvdXIgc2hvdWxkIGtlZXAgdGhlIHRpbWUsIGJlY2F1c2UgdGhlIHVzZXIgZXhwbGljaXRseVxuICAgIC8vIHNwZWNpZmllZCB3aGljaCBob3VyIHRoZXkgd2FudC4gU28gdHJ5aW5nIHRvIG1haW50YWluIHRoZSBzYW1lIGhvdXIgKGluXG4gICAgLy8gYSBuZXcgdGltZXpvbmUpIG1ha2VzIHNlbnNlLiBBZGRpbmcvc3VidHJhY3RpbmcgaG91cnMgZG9lcyBub3QgZm9sbG93XG4gICAgLy8gdGhpcyBydWxlLlxuICAgIHZhciBnZXRTZXRIb3VyID0gbWFrZUdldFNldCgnSG91cnMnLCB0cnVlKTtcblxuICAgIHZhciBiYXNlQ29uZmlnID0ge1xuICAgICAgICBjYWxlbmRhcjogZGVmYXVsdENhbGVuZGFyLFxuICAgICAgICBsb25nRGF0ZUZvcm1hdDogZGVmYXVsdExvbmdEYXRlRm9ybWF0LFxuICAgICAgICBpbnZhbGlkRGF0ZTogZGVmYXVsdEludmFsaWREYXRlLFxuICAgICAgICBvcmRpbmFsOiBkZWZhdWx0T3JkaW5hbCxcbiAgICAgICAgZGF5T2ZNb250aE9yZGluYWxQYXJzZTogZGVmYXVsdERheU9mTW9udGhPcmRpbmFsUGFyc2UsXG4gICAgICAgIHJlbGF0aXZlVGltZTogZGVmYXVsdFJlbGF0aXZlVGltZSxcblxuICAgICAgICBtb250aHM6IGRlZmF1bHRMb2NhbGVNb250aHMsXG4gICAgICAgIG1vbnRoc1Nob3J0OiBkZWZhdWx0TG9jYWxlTW9udGhzU2hvcnQsXG5cbiAgICAgICAgd2VlazogZGVmYXVsdExvY2FsZVdlZWssXG5cbiAgICAgICAgd2Vla2RheXM6IGRlZmF1bHRMb2NhbGVXZWVrZGF5cyxcbiAgICAgICAgd2Vla2RheXNNaW46IGRlZmF1bHRMb2NhbGVXZWVrZGF5c01pbixcbiAgICAgICAgd2Vla2RheXNTaG9ydDogZGVmYXVsdExvY2FsZVdlZWtkYXlzU2hvcnQsXG5cbiAgICAgICAgbWVyaWRpZW1QYXJzZTogZGVmYXVsdExvY2FsZU1lcmlkaWVtUGFyc2VcbiAgICB9O1xuXG4gICAgLy8gaW50ZXJuYWwgc3RvcmFnZSBmb3IgbG9jYWxlIGNvbmZpZyBmaWxlc1xuICAgIHZhciBsb2NhbGVzID0ge307XG4gICAgdmFyIGxvY2FsZUZhbWlsaWVzID0ge307XG4gICAgdmFyIGdsb2JhbExvY2FsZTtcblxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZUxvY2FsZShrZXkpIHtcbiAgICAgICAgcmV0dXJuIGtleSA/IGtleS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJ18nLCAnLScpIDoga2V5O1xuICAgIH1cblxuICAgIC8vIHBpY2sgdGhlIGxvY2FsZSBmcm9tIHRoZSBhcnJheVxuICAgIC8vIHRyeSBbJ2VuLWF1JywgJ2VuLWdiJ10gYXMgJ2VuLWF1JywgJ2VuLWdiJywgJ2VuJywgYXMgaW4gbW92ZSB0aHJvdWdoIHRoZSBsaXN0IHRyeWluZyBlYWNoXG4gICAgLy8gc3Vic3RyaW5nIGZyb20gbW9zdCBzcGVjaWZpYyB0byBsZWFzdCwgYnV0IG1vdmUgdG8gdGhlIG5leHQgYXJyYXkgaXRlbSBpZiBpdCdzIGEgbW9yZSBzcGVjaWZpYyB2YXJpYW50IHRoYW4gdGhlIGN1cnJlbnQgcm9vdFxuICAgIGZ1bmN0aW9uIGNob29zZUxvY2FsZShuYW1lcykge1xuICAgICAgICB2YXIgaSA9IDAsIGosIG5leHQsIGxvY2FsZSwgc3BsaXQ7XG5cbiAgICAgICAgd2hpbGUgKGkgPCBuYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHNwbGl0ID0gbm9ybWFsaXplTG9jYWxlKG5hbWVzW2ldKS5zcGxpdCgnLScpO1xuICAgICAgICAgICAgaiA9IHNwbGl0Lmxlbmd0aDtcbiAgICAgICAgICAgIG5leHQgPSBub3JtYWxpemVMb2NhbGUobmFtZXNbaSArIDFdKTtcbiAgICAgICAgICAgIG5leHQgPSBuZXh0ID8gbmV4dC5zcGxpdCgnLScpIDogbnVsbDtcbiAgICAgICAgICAgIHdoaWxlIChqID4gMCkge1xuICAgICAgICAgICAgICAgIGxvY2FsZSA9IGxvYWRMb2NhbGUoc3BsaXQuc2xpY2UoMCwgaikuam9pbignLScpKTtcbiAgICAgICAgICAgICAgICBpZiAobG9jYWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsb2NhbGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChuZXh0ICYmIG5leHQubGVuZ3RoID49IGogJiYgY29tcGFyZUFycmF5cyhzcGxpdCwgbmV4dCwgdHJ1ZSkgPj0gaiAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy90aGUgbmV4dCBhcnJheSBpdGVtIGlzIGJldHRlciB0aGFuIGEgc2hhbGxvd2VyIHN1YnN0cmluZyBvZiB0aGlzIG9uZVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgai0tO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnbG9iYWxMb2NhbGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZExvY2FsZShuYW1lKSB7XG4gICAgICAgIHZhciBvbGRMb2NhbGUgPSBudWxsO1xuICAgICAgICAvLyBUT0RPOiBGaW5kIGEgYmV0dGVyIHdheSB0byByZWdpc3RlciBhbmQgbG9hZCBhbGwgdGhlIGxvY2FsZXMgaW4gTm9kZVxuICAgICAgICBpZiAoIWxvY2FsZXNbbmFtZV0gJiYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSAmJlxuICAgICAgICAgICAgICAgIG1vZHVsZSAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBvbGRMb2NhbGUgPSBnbG9iYWxMb2NhbGUuX2FiYnI7XG4gICAgICAgICAgICAgICAgdmFyIGFsaWFzZWRSZXF1aXJlID0gcmVxdWlyZTtcbiAgICAgICAgICAgICAgICBhbGlhc2VkUmVxdWlyZSgnLi9sb2NhbGUvJyArIG5hbWUpO1xuICAgICAgICAgICAgICAgIGdldFNldEdsb2JhbExvY2FsZShvbGRMb2NhbGUpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG9jYWxlc1tuYW1lXTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgbG9hZCBsb2NhbGUgYW5kIHRoZW4gc2V0IHRoZSBnbG9iYWwgbG9jYWxlLiAgSWZcbiAgICAvLyBubyBhcmd1bWVudHMgYXJlIHBhc3NlZCBpbiwgaXQgd2lsbCBzaW1wbHkgcmV0dXJuIHRoZSBjdXJyZW50IGdsb2JhbFxuICAgIC8vIGxvY2FsZSBrZXkuXG4gICAgZnVuY3Rpb24gZ2V0U2V0R2xvYmFsTG9jYWxlIChrZXksIHZhbHVlcykge1xuICAgICAgICB2YXIgZGF0YTtcbiAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgaWYgKGlzVW5kZWZpbmVkKHZhbHVlcykpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gZ2V0TG9jYWxlKGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGVmaW5lTG9jYWxlKGtleSwgdmFsdWVzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAvLyBtb21lbnQuZHVyYXRpb24uX2xvY2FsZSA9IG1vbWVudC5fbG9jYWxlID0gZGF0YTtcbiAgICAgICAgICAgICAgICBnbG9iYWxMb2NhbGUgPSBkYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCh0eXBlb2YgY29uc29sZSAhPT0gICd1bmRlZmluZWQnKSAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgICAgICAgICAgICAgLy93YXJuIHVzZXIgaWYgYXJndW1lbnRzIGFyZSBwYXNzZWQgYnV0IHRoZSBsb2NhbGUgY291bGQgbm90IGJlIHNldFxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0xvY2FsZSAnICsga2V5ICsgICcgbm90IGZvdW5kLiBEaWQgeW91IGZvcmdldCB0byBsb2FkIGl0PycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBnbG9iYWxMb2NhbGUuX2FiYnI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVmaW5lTG9jYWxlIChuYW1lLCBjb25maWcpIHtcbiAgICAgICAgaWYgKGNvbmZpZyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIGxvY2FsZSwgcGFyZW50Q29uZmlnID0gYmFzZUNvbmZpZztcbiAgICAgICAgICAgIGNvbmZpZy5hYmJyID0gbmFtZTtcbiAgICAgICAgICAgIGlmIChsb2NhbGVzW25hbWVdICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkZXByZWNhdGVTaW1wbGUoJ2RlZmluZUxvY2FsZU92ZXJyaWRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd1c2UgbW9tZW50LnVwZGF0ZUxvY2FsZShsb2NhbGVOYW1lLCBjb25maWcpIHRvIGNoYW5nZSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdhbiBleGlzdGluZyBsb2NhbGUuIG1vbWVudC5kZWZpbmVMb2NhbGUobG9jYWxlTmFtZSwgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnY29uZmlnKSBzaG91bGQgb25seSBiZSB1c2VkIGZvciBjcmVhdGluZyBhIG5ldyBsb2NhbGUgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnU2VlIGh0dHA6Ly9tb21lbnRqcy5jb20vZ3VpZGVzLyMvd2FybmluZ3MvZGVmaW5lLWxvY2FsZS8gZm9yIG1vcmUgaW5mby4nKTtcbiAgICAgICAgICAgICAgICBwYXJlbnRDb25maWcgPSBsb2NhbGVzW25hbWVdLl9jb25maWc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbmZpZy5wYXJlbnRMb2NhbGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChsb2NhbGVzW2NvbmZpZy5wYXJlbnRMb2NhbGVdICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Q29uZmlnID0gbG9jYWxlc1tjb25maWcucGFyZW50TG9jYWxlXS5fY29uZmlnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsZSA9IGxvYWRMb2NhbGUoY29uZmlnLnBhcmVudExvY2FsZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2NhbGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50Q29uZmlnID0gbG9jYWxlLl9jb25maWc7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWxvY2FsZUZhbWlsaWVzW2NvbmZpZy5wYXJlbnRMb2NhbGVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxlRmFtaWxpZXNbY29uZmlnLnBhcmVudExvY2FsZV0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZUZhbWlsaWVzW2NvbmZpZy5wYXJlbnRMb2NhbGVdLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2NhbGVzW25hbWVdID0gbmV3IExvY2FsZShtZXJnZUNvbmZpZ3MocGFyZW50Q29uZmlnLCBjb25maWcpKTtcblxuICAgICAgICAgICAgaWYgKGxvY2FsZUZhbWlsaWVzW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxlRmFtaWxpZXNbbmFtZV0uZm9yRWFjaChmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgICAgICAgICBkZWZpbmVMb2NhbGUoeC5uYW1lLCB4LmNvbmZpZyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGJhY2t3YXJkcyBjb21wYXQgZm9yIG5vdzogYWxzbyBzZXQgdGhlIGxvY2FsZVxuICAgICAgICAgICAgLy8gbWFrZSBzdXJlIHdlIHNldCB0aGUgbG9jYWxlIEFGVEVSIGFsbCBjaGlsZCBsb2NhbGVzIGhhdmUgYmVlblxuICAgICAgICAgICAgLy8gY3JlYXRlZCwgc28gd2Ugd29uJ3QgZW5kIHVwIHdpdGggdGhlIGNoaWxkIGxvY2FsZSBzZXQuXG4gICAgICAgICAgICBnZXRTZXRHbG9iYWxMb2NhbGUobmFtZSk7XG5cblxuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZXNbbmFtZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB1c2VmdWwgZm9yIHRlc3RpbmdcbiAgICAgICAgICAgIGRlbGV0ZSBsb2NhbGVzW25hbWVdO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVMb2NhbGUobmFtZSwgY29uZmlnKSB7XG4gICAgICAgIGlmIChjb25maWcgIT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIGxvY2FsZSwgdG1wTG9jYWxlLCBwYXJlbnRDb25maWcgPSBiYXNlQ29uZmlnO1xuICAgICAgICAgICAgLy8gTUVSR0VcbiAgICAgICAgICAgIHRtcExvY2FsZSA9IGxvYWRMb2NhbGUobmFtZSk7XG4gICAgICAgICAgICBpZiAodG1wTG9jYWxlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnRDb25maWcgPSB0bXBMb2NhbGUuX2NvbmZpZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbmZpZyA9IG1lcmdlQ29uZmlncyhwYXJlbnRDb25maWcsIGNvbmZpZyk7XG4gICAgICAgICAgICBsb2NhbGUgPSBuZXcgTG9jYWxlKGNvbmZpZyk7XG4gICAgICAgICAgICBsb2NhbGUucGFyZW50TG9jYWxlID0gbG9jYWxlc1tuYW1lXTtcbiAgICAgICAgICAgIGxvY2FsZXNbbmFtZV0gPSBsb2NhbGU7XG5cbiAgICAgICAgICAgIC8vIGJhY2t3YXJkcyBjb21wYXQgZm9yIG5vdzogYWxzbyBzZXQgdGhlIGxvY2FsZVxuICAgICAgICAgICAgZ2V0U2V0R2xvYmFsTG9jYWxlKG5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gcGFzcyBudWxsIGZvciBjb25maWcgdG8gdW51cGRhdGUsIHVzZWZ1bCBmb3IgdGVzdHNcbiAgICAgICAgICAgIGlmIChsb2NhbGVzW25hbWVdICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAobG9jYWxlc1tuYW1lXS5wYXJlbnRMb2NhbGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbGVzW25hbWVdID0gbG9jYWxlc1tuYW1lXS5wYXJlbnRMb2NhbGU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChsb2NhbGVzW25hbWVdICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGxvY2FsZXNbbmFtZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsb2NhbGVzW25hbWVdO1xuICAgIH1cblxuICAgIC8vIHJldHVybnMgbG9jYWxlIGRhdGFcbiAgICBmdW5jdGlvbiBnZXRMb2NhbGUgKGtleSkge1xuICAgICAgICB2YXIgbG9jYWxlO1xuXG4gICAgICAgIGlmIChrZXkgJiYga2V5Ll9sb2NhbGUgJiYga2V5Ll9sb2NhbGUuX2FiYnIpIHtcbiAgICAgICAgICAgIGtleSA9IGtleS5fbG9jYWxlLl9hYmJyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWxMb2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzQXJyYXkoa2V5KSkge1xuICAgICAgICAgICAgLy9zaG9ydC1jaXJjdWl0IGV2ZXJ5dGhpbmcgZWxzZVxuICAgICAgICAgICAgbG9jYWxlID0gbG9hZExvY2FsZShrZXkpO1xuICAgICAgICAgICAgaWYgKGxvY2FsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsb2NhbGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrZXkgPSBba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjaG9vc2VMb2NhbGUoa2V5KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0TG9jYWxlcygpIHtcbiAgICAgICAgcmV0dXJuIGtleXMobG9jYWxlcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2tPdmVyZmxvdyAobSkge1xuICAgICAgICB2YXIgb3ZlcmZsb3c7XG4gICAgICAgIHZhciBhID0gbS5fYTtcblxuICAgICAgICBpZiAoYSAmJiBnZXRQYXJzaW5nRmxhZ3MobSkub3ZlcmZsb3cgPT09IC0yKSB7XG4gICAgICAgICAgICBvdmVyZmxvdyA9XG4gICAgICAgICAgICAgICAgYVtNT05USF0gICAgICAgPCAwIHx8IGFbTU9OVEhdICAgICAgID4gMTEgID8gTU9OVEggOlxuICAgICAgICAgICAgICAgIGFbREFURV0gICAgICAgIDwgMSB8fCBhW0RBVEVdICAgICAgICA+IGRheXNJbk1vbnRoKGFbWUVBUl0sIGFbTU9OVEhdKSA/IERBVEUgOlxuICAgICAgICAgICAgICAgIGFbSE9VUl0gICAgICAgIDwgMCB8fCBhW0hPVVJdICAgICAgICA+IDI0IHx8IChhW0hPVVJdID09PSAyNCAmJiAoYVtNSU5VVEVdICE9PSAwIHx8IGFbU0VDT05EXSAhPT0gMCB8fCBhW01JTExJU0VDT05EXSAhPT0gMCkpID8gSE9VUiA6XG4gICAgICAgICAgICAgICAgYVtNSU5VVEVdICAgICAgPCAwIHx8IGFbTUlOVVRFXSAgICAgID4gNTkgID8gTUlOVVRFIDpcbiAgICAgICAgICAgICAgICBhW1NFQ09ORF0gICAgICA8IDAgfHwgYVtTRUNPTkRdICAgICAgPiA1OSAgPyBTRUNPTkQgOlxuICAgICAgICAgICAgICAgIGFbTUlMTElTRUNPTkRdIDwgMCB8fCBhW01JTExJU0VDT05EXSA+IDk5OSA/IE1JTExJU0VDT05EIDpcbiAgICAgICAgICAgICAgICAtMTtcblxuICAgICAgICAgICAgaWYgKGdldFBhcnNpbmdGbGFncyhtKS5fb3ZlcmZsb3dEYXlPZlllYXIgJiYgKG92ZXJmbG93IDwgWUVBUiB8fCBvdmVyZmxvdyA+IERBVEUpKSB7XG4gICAgICAgICAgICAgICAgb3ZlcmZsb3cgPSBEQVRFO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGdldFBhcnNpbmdGbGFncyhtKS5fb3ZlcmZsb3dXZWVrcyAmJiBvdmVyZmxvdyA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBvdmVyZmxvdyA9IFdFRUs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZ2V0UGFyc2luZ0ZsYWdzKG0pLl9vdmVyZmxvd1dlZWtkYXkgJiYgb3ZlcmZsb3cgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgb3ZlcmZsb3cgPSBXRUVLREFZO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MobSkub3ZlcmZsb3cgPSBvdmVyZmxvdztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH1cblxuICAgIC8vIFBpY2sgdGhlIGZpcnN0IGRlZmluZWQgb2YgdHdvIG9yIHRocmVlIGFyZ3VtZW50cy5cbiAgICBmdW5jdGlvbiBkZWZhdWx0cyhhLCBiLCBjKSB7XG4gICAgICAgIGlmIChhICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGN1cnJlbnREYXRlQXJyYXkoY29uZmlnKSB7XG4gICAgICAgIC8vIGhvb2tzIGlzIGFjdHVhbGx5IHRoZSBleHBvcnRlZCBtb21lbnQgb2JqZWN0XG4gICAgICAgIHZhciBub3dWYWx1ZSA9IG5ldyBEYXRlKGhvb2tzLm5vdygpKTtcbiAgICAgICAgaWYgKGNvbmZpZy5fdXNlVVRDKSB7XG4gICAgICAgICAgICByZXR1cm4gW25vd1ZhbHVlLmdldFVUQ0Z1bGxZZWFyKCksIG5vd1ZhbHVlLmdldFVUQ01vbnRoKCksIG5vd1ZhbHVlLmdldFVUQ0RhdGUoKV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtub3dWYWx1ZS5nZXRGdWxsWWVhcigpLCBub3dWYWx1ZS5nZXRNb250aCgpLCBub3dWYWx1ZS5nZXREYXRlKCldO1xuICAgIH1cblxuICAgIC8vIGNvbnZlcnQgYW4gYXJyYXkgdG8gYSBkYXRlLlxuICAgIC8vIHRoZSBhcnJheSBzaG91bGQgbWlycm9yIHRoZSBwYXJhbWV0ZXJzIGJlbG93XG4gICAgLy8gbm90ZTogYWxsIHZhbHVlcyBwYXN0IHRoZSB5ZWFyIGFyZSBvcHRpb25hbCBhbmQgd2lsbCBkZWZhdWx0IHRvIHRoZSBsb3dlc3QgcG9zc2libGUgdmFsdWUuXG4gICAgLy8gW3llYXIsIG1vbnRoLCBkYXkgLCBob3VyLCBtaW51dGUsIHNlY29uZCwgbWlsbGlzZWNvbmRdXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbUFycmF5IChjb25maWcpIHtcbiAgICAgICAgdmFyIGksIGRhdGUsIGlucHV0ID0gW10sIGN1cnJlbnREYXRlLCBleHBlY3RlZFdlZWtkYXksIHllYXJUb1VzZTtcblxuICAgICAgICBpZiAoY29uZmlnLl9kKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50RGF0ZSA9IGN1cnJlbnREYXRlQXJyYXkoY29uZmlnKTtcblxuICAgICAgICAvL2NvbXB1dGUgZGF5IG9mIHRoZSB5ZWFyIGZyb20gd2Vla3MgYW5kIHdlZWtkYXlzXG4gICAgICAgIGlmIChjb25maWcuX3cgJiYgY29uZmlnLl9hW0RBVEVdID09IG51bGwgJiYgY29uZmlnLl9hW01PTlRIXSA9PSBudWxsKSB7XG4gICAgICAgICAgICBkYXlPZlllYXJGcm9tV2Vla0luZm8oY29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vaWYgdGhlIGRheSBvZiB0aGUgeWVhciBpcyBzZXQsIGZpZ3VyZSBvdXQgd2hhdCBpdCBpc1xuICAgICAgICBpZiAoY29uZmlnLl9kYXlPZlllYXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgeWVhclRvVXNlID0gZGVmYXVsdHMoY29uZmlnLl9hW1lFQVJdLCBjdXJyZW50RGF0ZVtZRUFSXSk7XG5cbiAgICAgICAgICAgIGlmIChjb25maWcuX2RheU9mWWVhciA+IGRheXNJblllYXIoeWVhclRvVXNlKSB8fCBjb25maWcuX2RheU9mWWVhciA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLl9vdmVyZmxvd0RheU9mWWVhciA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRhdGUgPSBjcmVhdGVVVENEYXRlKHllYXJUb1VzZSwgMCwgY29uZmlnLl9kYXlPZlllYXIpO1xuICAgICAgICAgICAgY29uZmlnLl9hW01PTlRIXSA9IGRhdGUuZ2V0VVRDTW9udGgoKTtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtEQVRFXSA9IGRhdGUuZ2V0VVRDRGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGVmYXVsdCB0byBjdXJyZW50IGRhdGUuXG4gICAgICAgIC8vICogaWYgbm8geWVhciwgbW9udGgsIGRheSBvZiBtb250aCBhcmUgZ2l2ZW4sIGRlZmF1bHQgdG8gdG9kYXlcbiAgICAgICAgLy8gKiBpZiBkYXkgb2YgbW9udGggaXMgZ2l2ZW4sIGRlZmF1bHQgbW9udGggYW5kIHllYXJcbiAgICAgICAgLy8gKiBpZiBtb250aCBpcyBnaXZlbiwgZGVmYXVsdCBvbmx5IHllYXJcbiAgICAgICAgLy8gKiBpZiB5ZWFyIGlzIGdpdmVuLCBkb24ndCBkZWZhdWx0IGFueXRoaW5nXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAzICYmIGNvbmZpZy5fYVtpXSA9PSBudWxsOyArK2kpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtpXSA9IGlucHV0W2ldID0gY3VycmVudERhdGVbaV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBaZXJvIG91dCB3aGF0ZXZlciB3YXMgbm90IGRlZmF1bHRlZCwgaW5jbHVkaW5nIHRpbWVcbiAgICAgICAgZm9yICg7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtpXSA9IGlucHV0W2ldID0gKGNvbmZpZy5fYVtpXSA9PSBudWxsKSA/IChpID09PSAyID8gMSA6IDApIDogY29uZmlnLl9hW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgZm9yIDI0OjAwOjAwLjAwMFxuICAgICAgICBpZiAoY29uZmlnLl9hW0hPVVJdID09PSAyNCAmJlxuICAgICAgICAgICAgICAgIGNvbmZpZy5fYVtNSU5VVEVdID09PSAwICYmXG4gICAgICAgICAgICAgICAgY29uZmlnLl9hW1NFQ09ORF0gPT09IDAgJiZcbiAgICAgICAgICAgICAgICBjb25maWcuX2FbTUlMTElTRUNPTkRdID09PSAwKSB7XG4gICAgICAgICAgICBjb25maWcuX25leHREYXkgPSB0cnVlO1xuICAgICAgICAgICAgY29uZmlnLl9hW0hPVVJdID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbmZpZy5fZCA9IChjb25maWcuX3VzZVVUQyA/IGNyZWF0ZVVUQ0RhdGUgOiBjcmVhdGVEYXRlKS5hcHBseShudWxsLCBpbnB1dCk7XG4gICAgICAgIGV4cGVjdGVkV2Vla2RheSA9IGNvbmZpZy5fdXNlVVRDID8gY29uZmlnLl9kLmdldFVUQ0RheSgpIDogY29uZmlnLl9kLmdldERheSgpO1xuXG4gICAgICAgIC8vIEFwcGx5IHRpbWV6b25lIG9mZnNldCBmcm9tIGlucHV0LiBUaGUgYWN0dWFsIHV0Y09mZnNldCBjYW4gYmUgY2hhbmdlZFxuICAgICAgICAvLyB3aXRoIHBhcnNlWm9uZS5cbiAgICAgICAgaWYgKGNvbmZpZy5fdHptICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZC5zZXRVVENNaW51dGVzKGNvbmZpZy5fZC5nZXRVVENNaW51dGVzKCkgLSBjb25maWcuX3R6bSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnLl9uZXh0RGF5KSB7XG4gICAgICAgICAgICBjb25maWcuX2FbSE9VUl0gPSAyNDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNoZWNrIGZvciBtaXNtYXRjaGluZyBkYXkgb2Ygd2Vla1xuICAgICAgICBpZiAoY29uZmlnLl93ICYmIHR5cGVvZiBjb25maWcuX3cuZCAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uZmlnLl93LmQgIT09IGV4cGVjdGVkV2Vla2RheSkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykud2Vla2RheU1pc21hdGNoID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRheU9mWWVhckZyb21XZWVrSW5mbyhjb25maWcpIHtcbiAgICAgICAgdmFyIHcsIHdlZWtZZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSwgdGVtcCwgd2Vla2RheU92ZXJmbG93O1xuXG4gICAgICAgIHcgPSBjb25maWcuX3c7XG4gICAgICAgIGlmICh3LkdHICE9IG51bGwgfHwgdy5XICE9IG51bGwgfHwgdy5FICE9IG51bGwpIHtcbiAgICAgICAgICAgIGRvdyA9IDE7XG4gICAgICAgICAgICBkb3kgPSA0O1xuXG4gICAgICAgICAgICAvLyBUT0RPOiBXZSBuZWVkIHRvIHRha2UgdGhlIGN1cnJlbnQgaXNvV2Vla1llYXIsIGJ1dCB0aGF0IGRlcGVuZHMgb25cbiAgICAgICAgICAgIC8vIGhvdyB3ZSBpbnRlcnByZXQgbm93IChsb2NhbCwgdXRjLCBmaXhlZCBvZmZzZXQpLiBTbyBjcmVhdGVcbiAgICAgICAgICAgIC8vIGEgbm93IHZlcnNpb24gb2YgY3VycmVudCBjb25maWcgKHRha2UgbG9jYWwvdXRjL29mZnNldCBmbGFncywgYW5kXG4gICAgICAgICAgICAvLyBjcmVhdGUgbm93KS5cbiAgICAgICAgICAgIHdlZWtZZWFyID0gZGVmYXVsdHMody5HRywgY29uZmlnLl9hW1lFQVJdLCB3ZWVrT2ZZZWFyKGNyZWF0ZUxvY2FsKCksIDEsIDQpLnllYXIpO1xuICAgICAgICAgICAgd2VlayA9IGRlZmF1bHRzKHcuVywgMSk7XG4gICAgICAgICAgICB3ZWVrZGF5ID0gZGVmYXVsdHMody5FLCAxKTtcbiAgICAgICAgICAgIGlmICh3ZWVrZGF5IDwgMSB8fCB3ZWVrZGF5ID4gNykge1xuICAgICAgICAgICAgICAgIHdlZWtkYXlPdmVyZmxvdyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb3cgPSBjb25maWcuX2xvY2FsZS5fd2Vlay5kb3c7XG4gICAgICAgICAgICBkb3kgPSBjb25maWcuX2xvY2FsZS5fd2Vlay5kb3k7XG5cbiAgICAgICAgICAgIHZhciBjdXJXZWVrID0gd2Vla09mWWVhcihjcmVhdGVMb2NhbCgpLCBkb3csIGRveSk7XG5cbiAgICAgICAgICAgIHdlZWtZZWFyID0gZGVmYXVsdHMody5nZywgY29uZmlnLl9hW1lFQVJdLCBjdXJXZWVrLnllYXIpO1xuXG4gICAgICAgICAgICAvLyBEZWZhdWx0IHRvIGN1cnJlbnQgd2Vlay5cbiAgICAgICAgICAgIHdlZWsgPSBkZWZhdWx0cyh3LncsIGN1cldlZWsud2Vlayk7XG5cbiAgICAgICAgICAgIGlmICh3LmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIHdlZWtkYXkgLS0gbG93IGRheSBudW1iZXJzIGFyZSBjb25zaWRlcmVkIG5leHQgd2Vla1xuICAgICAgICAgICAgICAgIHdlZWtkYXkgPSB3LmQ7XG4gICAgICAgICAgICAgICAgaWYgKHdlZWtkYXkgPCAwIHx8IHdlZWtkYXkgPiA2KSB7XG4gICAgICAgICAgICAgICAgICAgIHdlZWtkYXlPdmVyZmxvdyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh3LmUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIGxvY2FsIHdlZWtkYXkgLS0gY291bnRpbmcgc3RhcnRzIGZyb20gYmVnaW5pbmcgb2Ygd2Vla1xuICAgICAgICAgICAgICAgIHdlZWtkYXkgPSB3LmUgKyBkb3c7XG4gICAgICAgICAgICAgICAgaWYgKHcuZSA8IDAgfHwgdy5lID4gNikge1xuICAgICAgICAgICAgICAgICAgICB3ZWVrZGF5T3ZlcmZsb3cgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZGVmYXVsdCB0byBiZWdpbmluZyBvZiB3ZWVrXG4gICAgICAgICAgICAgICAgd2Vla2RheSA9IGRvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAod2VlayA8IDEgfHwgd2VlayA+IHdlZWtzSW5ZZWFyKHdlZWtZZWFyLCBkb3csIGRveSkpIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLl9vdmVyZmxvd1dlZWtzID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmICh3ZWVrZGF5T3ZlcmZsb3cgIT0gbnVsbCkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuX292ZXJmbG93V2Vla2RheSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0ZW1wID0gZGF5T2ZZZWFyRnJvbVdlZWtzKHdlZWtZZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSk7XG4gICAgICAgICAgICBjb25maWcuX2FbWUVBUl0gPSB0ZW1wLnllYXI7XG4gICAgICAgICAgICBjb25maWcuX2RheU9mWWVhciA9IHRlbXAuZGF5T2ZZZWFyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gaXNvIDg2MDEgcmVnZXhcbiAgICAvLyAwMDAwLTAwLTAwIDAwMDAtVzAwIG9yIDAwMDAtVzAwLTAgKyBUICsgMDAgb3IgMDA6MDAgb3IgMDA6MDA6MDAgb3IgMDA6MDA6MDAuMDAwICsgKzAwOjAwIG9yICswMDAwIG9yICswMClcbiAgICB2YXIgZXh0ZW5kZWRJc29SZWdleCA9IC9eXFxzKigoPzpbKy1dXFxkezZ9fFxcZHs0fSktKD86XFxkXFxkLVxcZFxcZHxXXFxkXFxkLVxcZHxXXFxkXFxkfFxcZFxcZFxcZHxcXGRcXGQpKSg/OihUfCApKFxcZFxcZCg/OjpcXGRcXGQoPzo6XFxkXFxkKD86Wy4sXVxcZCspPyk/KT8pKFtcXCtcXC1dXFxkXFxkKD86Oj9cXGRcXGQpP3xcXHMqWik/KT8kLztcbiAgICB2YXIgYmFzaWNJc29SZWdleCA9IC9eXFxzKigoPzpbKy1dXFxkezZ9fFxcZHs0fSkoPzpcXGRcXGRcXGRcXGR8V1xcZFxcZFxcZHxXXFxkXFxkfFxcZFxcZFxcZHxcXGRcXGQpKSg/OihUfCApKFxcZFxcZCg/OlxcZFxcZCg/OlxcZFxcZCg/OlsuLF1cXGQrKT8pPyk/KShbXFwrXFwtXVxcZFxcZCg/Ojo/XFxkXFxkKT98XFxzKlopPyk/JC87XG5cbiAgICB2YXIgdHpSZWdleCA9IC9afFsrLV1cXGRcXGQoPzo6P1xcZFxcZCk/LztcblxuICAgIHZhciBpc29EYXRlcyA9IFtcbiAgICAgICAgWydZWVlZWVktTU0tREQnLCAvWystXVxcZHs2fS1cXGRcXGQtXFxkXFxkL10sXG4gICAgICAgIFsnWVlZWS1NTS1ERCcsIC9cXGR7NH0tXFxkXFxkLVxcZFxcZC9dLFxuICAgICAgICBbJ0dHR0ctW1ddV1ctRScsIC9cXGR7NH0tV1xcZFxcZC1cXGQvXSxcbiAgICAgICAgWydHR0dHLVtXXVdXJywgL1xcZHs0fS1XXFxkXFxkLywgZmFsc2VdLFxuICAgICAgICBbJ1lZWVktREREJywgL1xcZHs0fS1cXGR7M30vXSxcbiAgICAgICAgWydZWVlZLU1NJywgL1xcZHs0fS1cXGRcXGQvLCBmYWxzZV0sXG4gICAgICAgIFsnWVlZWVlZTU1ERCcsIC9bKy1dXFxkezEwfS9dLFxuICAgICAgICBbJ1lZWVlNTUREJywgL1xcZHs4fS9dLFxuICAgICAgICAvLyBZWVlZTU0gaXMgTk9UIGFsbG93ZWQgYnkgdGhlIHN0YW5kYXJkXG4gICAgICAgIFsnR0dHR1tXXVdXRScsIC9cXGR7NH1XXFxkezN9L10sXG4gICAgICAgIFsnR0dHR1tXXVdXJywgL1xcZHs0fVdcXGR7Mn0vLCBmYWxzZV0sXG4gICAgICAgIFsnWVlZWURERCcsIC9cXGR7N30vXVxuICAgIF07XG5cbiAgICAvLyBpc28gdGltZSBmb3JtYXRzIGFuZCByZWdleGVzXG4gICAgdmFyIGlzb1RpbWVzID0gW1xuICAgICAgICBbJ0hIOm1tOnNzLlNTU1MnLCAvXFxkXFxkOlxcZFxcZDpcXGRcXGRcXC5cXGQrL10sXG4gICAgICAgIFsnSEg6bW06c3MsU1NTUycsIC9cXGRcXGQ6XFxkXFxkOlxcZFxcZCxcXGQrL10sXG4gICAgICAgIFsnSEg6bW06c3MnLCAvXFxkXFxkOlxcZFxcZDpcXGRcXGQvXSxcbiAgICAgICAgWydISDptbScsIC9cXGRcXGQ6XFxkXFxkL10sXG4gICAgICAgIFsnSEhtbXNzLlNTU1MnLCAvXFxkXFxkXFxkXFxkXFxkXFxkXFwuXFxkKy9dLFxuICAgICAgICBbJ0hIbW1zcyxTU1NTJywgL1xcZFxcZFxcZFxcZFxcZFxcZCxcXGQrL10sXG4gICAgICAgIFsnSEhtbXNzJywgL1xcZFxcZFxcZFxcZFxcZFxcZC9dLFxuICAgICAgICBbJ0hIbW0nLCAvXFxkXFxkXFxkXFxkL10sXG4gICAgICAgIFsnSEgnLCAvXFxkXFxkL11cbiAgICBdO1xuXG4gICAgdmFyIGFzcE5ldEpzb25SZWdleCA9IC9eXFwvP0RhdGVcXCgoXFwtP1xcZCspL2k7XG5cbiAgICAvLyBkYXRlIGZyb20gaXNvIGZvcm1hdFxuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21JU08oY29uZmlnKSB7XG4gICAgICAgIHZhciBpLCBsLFxuICAgICAgICAgICAgc3RyaW5nID0gY29uZmlnLl9pLFxuICAgICAgICAgICAgbWF0Y2ggPSBleHRlbmRlZElzb1JlZ2V4LmV4ZWMoc3RyaW5nKSB8fCBiYXNpY0lzb1JlZ2V4LmV4ZWMoc3RyaW5nKSxcbiAgICAgICAgICAgIGFsbG93VGltZSwgZGF0ZUZvcm1hdCwgdGltZUZvcm1hdCwgdHpGb3JtYXQ7XG5cbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pc28gPSB0cnVlO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsID0gaXNvRGF0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzb0RhdGVzW2ldWzFdLmV4ZWMobWF0Y2hbMV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGVGb3JtYXQgPSBpc29EYXRlc1tpXVswXTtcbiAgICAgICAgICAgICAgICAgICAgYWxsb3dUaW1lID0gaXNvRGF0ZXNbaV1bMl0gIT09IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGF0ZUZvcm1hdCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLl9pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1hdGNoWzNdKSB7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMCwgbCA9IGlzb1RpbWVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNvVGltZXNbaV1bMV0uZXhlYyhtYXRjaFszXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1hdGNoWzJdIHNob3VsZCBiZSAnVCcgb3Igc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVGb3JtYXQgPSAobWF0Y2hbMl0gfHwgJyAnKSArIGlzb1RpbWVzW2ldWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRpbWVGb3JtYXQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghYWxsb3dUaW1lICYmIHRpbWVGb3JtYXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYXRjaFs0XSkge1xuICAgICAgICAgICAgICAgIGlmICh0elJlZ2V4LmV4ZWMobWF0Y2hbNF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHR6Rm9ybWF0ID0gJ1onO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uZmlnLl9mID0gZGF0ZUZvcm1hdCArICh0aW1lRm9ybWF0IHx8ICcnKSArICh0ekZvcm1hdCB8fCAnJyk7XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJGQyAyODIyIHJlZ2V4OiBGb3IgZGV0YWlscyBzZWUgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzI4MjIjc2VjdGlvbi0zLjNcbiAgICB2YXIgcmZjMjgyMiA9IC9eKD86KE1vbnxUdWV8V2VkfFRodXxGcml8U2F0fFN1biksP1xccyk/KFxcZHsxLDJ9KVxccyhKYW58RmVifE1hcnxBcHJ8TWF5fEp1bnxKdWx8QXVnfFNlcHxPY3R8Tm92fERlYylcXHMoXFxkezIsNH0pXFxzKFxcZFxcZCk6KFxcZFxcZCkoPzo6KFxcZFxcZCkpP1xccyg/OihVVHxHTVR8W0VDTVBdW1NEXVQpfChbWnpdKXwoWystXVxcZHs0fSkpJC87XG5cbiAgICBmdW5jdGlvbiBleHRyYWN0RnJvbVJGQzI4MjJTdHJpbmdzKHllYXJTdHIsIG1vbnRoU3RyLCBkYXlTdHIsIGhvdXJTdHIsIG1pbnV0ZVN0ciwgc2Vjb25kU3RyKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXG4gICAgICAgICAgICB1bnRydW5jYXRlWWVhcih5ZWFyU3RyKSxcbiAgICAgICAgICAgIGRlZmF1bHRMb2NhbGVNb250aHNTaG9ydC5pbmRleE9mKG1vbnRoU3RyKSxcbiAgICAgICAgICAgIHBhcnNlSW50KGRheVN0ciwgMTApLFxuICAgICAgICAgICAgcGFyc2VJbnQoaG91clN0ciwgMTApLFxuICAgICAgICAgICAgcGFyc2VJbnQobWludXRlU3RyLCAxMClcbiAgICAgICAgXTtcblxuICAgICAgICBpZiAoc2Vjb25kU3RyKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChwYXJzZUludChzZWNvbmRTdHIsIDEwKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVudHJ1bmNhdGVZZWFyKHllYXJTdHIpIHtcbiAgICAgICAgdmFyIHllYXIgPSBwYXJzZUludCh5ZWFyU3RyLCAxMCk7XG4gICAgICAgIGlmICh5ZWFyIDw9IDQ5KSB7XG4gICAgICAgICAgICByZXR1cm4gMjAwMCArIHllYXI7XG4gICAgICAgIH0gZWxzZSBpZiAoeWVhciA8PSA5OTkpIHtcbiAgICAgICAgICAgIHJldHVybiAxOTAwICsgeWVhcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geWVhcjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmVwcm9jZXNzUkZDMjgyMihzKSB7XG4gICAgICAgIC8vIFJlbW92ZSBjb21tZW50cyBhbmQgZm9sZGluZyB3aGl0ZXNwYWNlIGFuZCByZXBsYWNlIG11bHRpcGxlLXNwYWNlcyB3aXRoIGEgc2luZ2xlIHNwYWNlXG4gICAgICAgIHJldHVybiBzLnJlcGxhY2UoL1xcKFteKV0qXFwpfFtcXG5cXHRdL2csICcgJykucmVwbGFjZSgvKFxcc1xccyspL2csICcgJykucmVwbGFjZSgvXlxcc1xccyovLCAnJykucmVwbGFjZSgvXFxzXFxzKiQvLCAnJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2tXZWVrZGF5KHdlZWtkYXlTdHIsIHBhcnNlZElucHV0LCBjb25maWcpIHtcbiAgICAgICAgaWYgKHdlZWtkYXlTdHIpIHtcbiAgICAgICAgICAgIC8vIFRPRE86IFJlcGxhY2UgdGhlIHZhbmlsbGEgSlMgRGF0ZSBvYmplY3Qgd2l0aCBhbiBpbmRlcGVudGVudCBkYXktb2Ytd2VlayBjaGVjay5cbiAgICAgICAgICAgIHZhciB3ZWVrZGF5UHJvdmlkZWQgPSBkZWZhdWx0TG9jYWxlV2Vla2RheXNTaG9ydC5pbmRleE9mKHdlZWtkYXlTdHIpLFxuICAgICAgICAgICAgICAgIHdlZWtkYXlBY3R1YWwgPSBuZXcgRGF0ZShwYXJzZWRJbnB1dFswXSwgcGFyc2VkSW5wdXRbMV0sIHBhcnNlZElucHV0WzJdKS5nZXREYXkoKTtcbiAgICAgICAgICAgIGlmICh3ZWVrZGF5UHJvdmlkZWQgIT09IHdlZWtkYXlBY3R1YWwpIHtcbiAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS53ZWVrZGF5TWlzbWF0Y2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgb2JzT2Zmc2V0cyA9IHtcbiAgICAgICAgVVQ6IDAsXG4gICAgICAgIEdNVDogMCxcbiAgICAgICAgRURUOiAtNCAqIDYwLFxuICAgICAgICBFU1Q6IC01ICogNjAsXG4gICAgICAgIENEVDogLTUgKiA2MCxcbiAgICAgICAgQ1NUOiAtNiAqIDYwLFxuICAgICAgICBNRFQ6IC02ICogNjAsXG4gICAgICAgIE1TVDogLTcgKiA2MCxcbiAgICAgICAgUERUOiAtNyAqIDYwLFxuICAgICAgICBQU1Q6IC04ICogNjBcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlT2Zmc2V0KG9ic09mZnNldCwgbWlsaXRhcnlPZmZzZXQsIG51bU9mZnNldCkge1xuICAgICAgICBpZiAob2JzT2Zmc2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gb2JzT2Zmc2V0c1tvYnNPZmZzZXRdO1xuICAgICAgICB9IGVsc2UgaWYgKG1pbGl0YXJ5T2Zmc2V0KSB7XG4gICAgICAgICAgICAvLyB0aGUgb25seSBhbGxvd2VkIG1pbGl0YXJ5IHR6IGlzIFpcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGhtID0gcGFyc2VJbnQobnVtT2Zmc2V0LCAxMCk7XG4gICAgICAgICAgICB2YXIgbSA9IGhtICUgMTAwLCBoID0gKGhtIC0gbSkgLyAxMDA7XG4gICAgICAgICAgICByZXR1cm4gaCAqIDYwICsgbTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGRhdGUgYW5kIHRpbWUgZnJvbSByZWYgMjgyMiBmb3JtYXRcbiAgICBmdW5jdGlvbiBjb25maWdGcm9tUkZDMjgyMihjb25maWcpIHtcbiAgICAgICAgdmFyIG1hdGNoID0gcmZjMjgyMi5leGVjKHByZXByb2Nlc3NSRkMyODIyKGNvbmZpZy5faSkpO1xuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgIHZhciBwYXJzZWRBcnJheSA9IGV4dHJhY3RGcm9tUkZDMjgyMlN0cmluZ3MobWF0Y2hbNF0sIG1hdGNoWzNdLCBtYXRjaFsyXSwgbWF0Y2hbNV0sIG1hdGNoWzZdLCBtYXRjaFs3XSk7XG4gICAgICAgICAgICBpZiAoIWNoZWNrV2Vla2RheShtYXRjaFsxXSwgcGFyc2VkQXJyYXksIGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbmZpZy5fYSA9IHBhcnNlZEFycmF5O1xuICAgICAgICAgICAgY29uZmlnLl90em0gPSBjYWxjdWxhdGVPZmZzZXQobWF0Y2hbOF0sIG1hdGNoWzldLCBtYXRjaFsxMF0pO1xuXG4gICAgICAgICAgICBjb25maWcuX2QgPSBjcmVhdGVVVENEYXRlLmFwcGx5KG51bGwsIGNvbmZpZy5fYSk7XG4gICAgICAgICAgICBjb25maWcuX2Quc2V0VVRDTWludXRlcyhjb25maWcuX2QuZ2V0VVRDTWludXRlcygpIC0gY29uZmlnLl90em0pO1xuXG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5yZmMyODIyID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gZGF0ZSBmcm9tIGlzbyBmb3JtYXQgb3IgZmFsbGJhY2tcbiAgICBmdW5jdGlvbiBjb25maWdGcm9tU3RyaW5nKGNvbmZpZykge1xuICAgICAgICB2YXIgbWF0Y2hlZCA9IGFzcE5ldEpzb25SZWdleC5leGVjKGNvbmZpZy5faSk7XG5cbiAgICAgICAgaWYgKG1hdGNoZWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKCttYXRjaGVkWzFdKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbmZpZ0Zyb21JU08oY29uZmlnKTtcbiAgICAgICAgaWYgKGNvbmZpZy5faXNWYWxpZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjb25maWcuX2lzVmFsaWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWdGcm9tUkZDMjgyMihjb25maWcpO1xuICAgICAgICBpZiAoY29uZmlnLl9pc1ZhbGlkID09PSBmYWxzZSkge1xuICAgICAgICAgICAgZGVsZXRlIGNvbmZpZy5faXNWYWxpZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpbmFsIGF0dGVtcHQsIHVzZSBJbnB1dCBGYWxsYmFja1xuICAgICAgICBob29rcy5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayhjb25maWcpO1xuICAgIH1cblxuICAgIGhvb2tzLmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrID0gZGVwcmVjYXRlKFxuICAgICAgICAndmFsdWUgcHJvdmlkZWQgaXMgbm90IGluIGEgcmVjb2duaXplZCBSRkMyODIyIG9yIElTTyBmb3JtYXQuIG1vbWVudCBjb25zdHJ1Y3Rpb24gZmFsbHMgYmFjayB0byBqcyBEYXRlKCksICcgK1xuICAgICAgICAnd2hpY2ggaXMgbm90IHJlbGlhYmxlIGFjcm9zcyBhbGwgYnJvd3NlcnMgYW5kIHZlcnNpb25zLiBOb24gUkZDMjgyMi9JU08gZGF0ZSBmb3JtYXRzIGFyZSAnICtcbiAgICAgICAgJ2Rpc2NvdXJhZ2VkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gYW4gdXBjb21pbmcgbWFqb3IgcmVsZWFzZS4gUGxlYXNlIHJlZmVyIHRvICcgK1xuICAgICAgICAnaHR0cDovL21vbWVudGpzLmNvbS9ndWlkZXMvIy93YXJuaW5ncy9qcy1kYXRlLyBmb3IgbW9yZSBpbmZvLicsXG4gICAgICAgIGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKGNvbmZpZy5faSArIChjb25maWcuX3VzZVVUQyA/ICcgVVRDJyA6ICcnKSk7XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgLy8gY29uc3RhbnQgdGhhdCByZWZlcnMgdG8gdGhlIElTTyBzdGFuZGFyZFxuICAgIGhvb2tzLklTT184NjAxID0gZnVuY3Rpb24gKCkge307XG5cbiAgICAvLyBjb25zdGFudCB0aGF0IHJlZmVycyB0byB0aGUgUkZDIDI4MjIgZm9ybVxuICAgIGhvb2tzLlJGQ18yODIyID0gZnVuY3Rpb24gKCkge307XG5cbiAgICAvLyBkYXRlIGZyb20gc3RyaW5nIGFuZCBmb3JtYXQgc3RyaW5nXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbVN0cmluZ0FuZEZvcm1hdChjb25maWcpIHtcbiAgICAgICAgLy8gVE9ETzogTW92ZSB0aGlzIHRvIGFub3RoZXIgcGFydCBvZiB0aGUgY3JlYXRpb24gZmxvdyB0byBwcmV2ZW50IGNpcmN1bGFyIGRlcHNcbiAgICAgICAgaWYgKGNvbmZpZy5fZiA9PT0gaG9va3MuSVNPXzg2MDEpIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21JU08oY29uZmlnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29uZmlnLl9mID09PSBob29rcy5SRkNfMjgyMikge1xuICAgICAgICAgICAgY29uZmlnRnJvbVJGQzI4MjIoY29uZmlnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25maWcuX2EgPSBbXTtcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuZW1wdHkgPSB0cnVlO1xuXG4gICAgICAgIC8vIFRoaXMgYXJyYXkgaXMgdXNlZCB0byBtYWtlIGEgRGF0ZSwgZWl0aGVyIHdpdGggYG5ldyBEYXRlYCBvciBgRGF0ZS5VVENgXG4gICAgICAgIHZhciBzdHJpbmcgPSAnJyArIGNvbmZpZy5faSxcbiAgICAgICAgICAgIGksIHBhcnNlZElucHV0LCB0b2tlbnMsIHRva2VuLCBza2lwcGVkLFxuICAgICAgICAgICAgc3RyaW5nTGVuZ3RoID0gc3RyaW5nLmxlbmd0aCxcbiAgICAgICAgICAgIHRvdGFsUGFyc2VkSW5wdXRMZW5ndGggPSAwO1xuXG4gICAgICAgIHRva2VucyA9IGV4cGFuZEZvcm1hdChjb25maWcuX2YsIGNvbmZpZy5fbG9jYWxlKS5tYXRjaChmb3JtYXR0aW5nVG9rZW5zKSB8fCBbXTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0b2tlbiA9IHRva2Vuc1tpXTtcbiAgICAgICAgICAgIHBhcnNlZElucHV0ID0gKHN0cmluZy5tYXRjaChnZXRQYXJzZVJlZ2V4Rm9yVG9rZW4odG9rZW4sIGNvbmZpZykpIHx8IFtdKVswXTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd0b2tlbicsIHRva2VuLCAncGFyc2VkSW5wdXQnLCBwYXJzZWRJbnB1dCxcbiAgICAgICAgICAgIC8vICAgICAgICAgJ3JlZ2V4JywgZ2V0UGFyc2VSZWdleEZvclRva2VuKHRva2VuLCBjb25maWcpKTtcbiAgICAgICAgICAgIGlmIChwYXJzZWRJbnB1dCkge1xuICAgICAgICAgICAgICAgIHNraXBwZWQgPSBzdHJpbmcuc3Vic3RyKDAsIHN0cmluZy5pbmRleE9mKHBhcnNlZElucHV0KSk7XG4gICAgICAgICAgICAgICAgaWYgKHNraXBwZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS51bnVzZWRJbnB1dC5wdXNoKHNraXBwZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc2xpY2Uoc3RyaW5nLmluZGV4T2YocGFyc2VkSW5wdXQpICsgcGFyc2VkSW5wdXQubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0b3RhbFBhcnNlZElucHV0TGVuZ3RoICs9IHBhcnNlZElucHV0Lmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGRvbid0IHBhcnNlIGlmIGl0J3Mgbm90IGEga25vd24gdG9rZW5cbiAgICAgICAgICAgIGlmIChmb3JtYXRUb2tlbkZ1bmN0aW9uc1t0b2tlbl0pIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuZW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnVudXNlZFRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYWRkVGltZVRvQXJyYXlGcm9tVG9rZW4odG9rZW4sIHBhcnNlZElucHV0LCBjb25maWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29uZmlnLl9zdHJpY3QgJiYgIXBhcnNlZElucHV0KSB7XG4gICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykudW51c2VkVG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWRkIHJlbWFpbmluZyB1bnBhcnNlZCBpbnB1dCBsZW5ndGggdG8gdGhlIHN0cmluZ1xuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5jaGFyc0xlZnRPdmVyID0gc3RyaW5nTGVuZ3RoIC0gdG90YWxQYXJzZWRJbnB1dExlbmd0aDtcbiAgICAgICAgaWYgKHN0cmluZy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS51bnVzZWRJbnB1dC5wdXNoKHN0cmluZyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjbGVhciBfMTJoIGZsYWcgaWYgaG91ciBpcyA8PSAxMlxuICAgICAgICBpZiAoY29uZmlnLl9hW0hPVVJdIDw9IDEyICYmXG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5iaWdIb3VyID09PSB0cnVlICYmXG4gICAgICAgICAgICBjb25maWcuX2FbSE9VUl0gPiAwKSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5iaWdIb3VyID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykucGFyc2VkRGF0ZVBhcnRzID0gY29uZmlnLl9hLnNsaWNlKDApO1xuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5tZXJpZGllbSA9IGNvbmZpZy5fbWVyaWRpZW07XG4gICAgICAgIC8vIGhhbmRsZSBtZXJpZGllbVxuICAgICAgICBjb25maWcuX2FbSE9VUl0gPSBtZXJpZGllbUZpeFdyYXAoY29uZmlnLl9sb2NhbGUsIGNvbmZpZy5fYVtIT1VSXSwgY29uZmlnLl9tZXJpZGllbSk7XG5cbiAgICAgICAgY29uZmlnRnJvbUFycmF5KGNvbmZpZyk7XG4gICAgICAgIGNoZWNrT3ZlcmZsb3coY29uZmlnKTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIG1lcmlkaWVtRml4V3JhcCAobG9jYWxlLCBob3VyLCBtZXJpZGllbSkge1xuICAgICAgICB2YXIgaXNQbTtcblxuICAgICAgICBpZiAobWVyaWRpZW0gPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gbm90aGluZyB0byBkb1xuICAgICAgICAgICAgcmV0dXJuIGhvdXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxvY2FsZS5tZXJpZGllbUhvdXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZS5tZXJpZGllbUhvdXIoaG91ciwgbWVyaWRpZW0pO1xuICAgICAgICB9IGVsc2UgaWYgKGxvY2FsZS5pc1BNICE9IG51bGwpIHtcbiAgICAgICAgICAgIC8vIEZhbGxiYWNrXG4gICAgICAgICAgICBpc1BtID0gbG9jYWxlLmlzUE0obWVyaWRpZW0pO1xuICAgICAgICAgICAgaWYgKGlzUG0gJiYgaG91ciA8IDEyKSB7XG4gICAgICAgICAgICAgICAgaG91ciArPSAxMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNQbSAmJiBob3VyID09PSAxMikge1xuICAgICAgICAgICAgICAgIGhvdXIgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGhvdXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB0aGlzIGlzIG5vdCBzdXBwb3NlZCB0byBoYXBwZW5cbiAgICAgICAgICAgIHJldHVybiBob3VyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gZGF0ZSBmcm9tIHN0cmluZyBhbmQgYXJyYXkgb2YgZm9ybWF0IHN0cmluZ3NcbiAgICBmdW5jdGlvbiBjb25maWdGcm9tU3RyaW5nQW5kQXJyYXkoY29uZmlnKSB7XG4gICAgICAgIHZhciB0ZW1wQ29uZmlnLFxuICAgICAgICAgICAgYmVzdE1vbWVudCxcblxuICAgICAgICAgICAgc2NvcmVUb0JlYXQsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgY3VycmVudFNjb3JlO1xuXG4gICAgICAgIGlmIChjb25maWcuX2YubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pbnZhbGlkRm9ybWF0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKE5hTik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY29uZmlnLl9mLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjdXJyZW50U2NvcmUgPSAwO1xuICAgICAgICAgICAgdGVtcENvbmZpZyA9IGNvcHlDb25maWcoe30sIGNvbmZpZyk7XG4gICAgICAgICAgICBpZiAoY29uZmlnLl91c2VVVEMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRlbXBDb25maWcuX3VzZVVUQyA9IGNvbmZpZy5fdXNlVVRDO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGVtcENvbmZpZy5fZiA9IGNvbmZpZy5fZltpXTtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21TdHJpbmdBbmRGb3JtYXQodGVtcENvbmZpZyk7XG5cbiAgICAgICAgICAgIGlmICghaXNWYWxpZCh0ZW1wQ29uZmlnKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBhbnkgaW5wdXQgdGhhdCB3YXMgbm90IHBhcnNlZCBhZGQgYSBwZW5hbHR5IGZvciB0aGF0IGZvcm1hdFxuICAgICAgICAgICAgY3VycmVudFNjb3JlICs9IGdldFBhcnNpbmdGbGFncyh0ZW1wQ29uZmlnKS5jaGFyc0xlZnRPdmVyO1xuXG4gICAgICAgICAgICAvL29yIHRva2Vuc1xuICAgICAgICAgICAgY3VycmVudFNjb3JlICs9IGdldFBhcnNpbmdGbGFncyh0ZW1wQ29uZmlnKS51bnVzZWRUb2tlbnMubGVuZ3RoICogMTA7XG5cbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyh0ZW1wQ29uZmlnKS5zY29yZSA9IGN1cnJlbnRTY29yZTtcblxuICAgICAgICAgICAgaWYgKHNjb3JlVG9CZWF0ID09IG51bGwgfHwgY3VycmVudFNjb3JlIDwgc2NvcmVUb0JlYXQpIHtcbiAgICAgICAgICAgICAgICBzY29yZVRvQmVhdCA9IGN1cnJlbnRTY29yZTtcbiAgICAgICAgICAgICAgICBiZXN0TW9tZW50ID0gdGVtcENvbmZpZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4dGVuZChjb25maWcsIGJlc3RNb21lbnQgfHwgdGVtcENvbmZpZyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbU9iamVjdChjb25maWcpIHtcbiAgICAgICAgaWYgKGNvbmZpZy5fZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGkgPSBub3JtYWxpemVPYmplY3RVbml0cyhjb25maWcuX2kpO1xuICAgICAgICBjb25maWcuX2EgPSBtYXAoW2kueWVhciwgaS5tb250aCwgaS5kYXkgfHwgaS5kYXRlLCBpLmhvdXIsIGkubWludXRlLCBpLnNlY29uZCwgaS5taWxsaXNlY29uZF0sIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBvYmogJiYgcGFyc2VJbnQob2JqLCAxMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbmZpZ0Zyb21BcnJheShjb25maWcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUZyb21Db25maWcgKGNvbmZpZykge1xuICAgICAgICB2YXIgcmVzID0gbmV3IE1vbWVudChjaGVja092ZXJmbG93KHByZXBhcmVDb25maWcoY29uZmlnKSkpO1xuICAgICAgICBpZiAocmVzLl9uZXh0RGF5KSB7XG4gICAgICAgICAgICAvLyBBZGRpbmcgaXMgc21hcnQgZW5vdWdoIGFyb3VuZCBEU1RcbiAgICAgICAgICAgIHJlcy5hZGQoMSwgJ2QnKTtcbiAgICAgICAgICAgIHJlcy5fbmV4dERheSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJlcGFyZUNvbmZpZyAoY29uZmlnKSB7XG4gICAgICAgIHZhciBpbnB1dCA9IGNvbmZpZy5faSxcbiAgICAgICAgICAgIGZvcm1hdCA9IGNvbmZpZy5fZjtcblxuICAgICAgICBjb25maWcuX2xvY2FsZSA9IGNvbmZpZy5fbG9jYWxlIHx8IGdldExvY2FsZShjb25maWcuX2wpO1xuXG4gICAgICAgIGlmIChpbnB1dCA9PT0gbnVsbCB8fCAoZm9ybWF0ID09PSB1bmRlZmluZWQgJiYgaW5wdXQgPT09ICcnKSkge1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUludmFsaWQoe251bGxJbnB1dDogdHJ1ZX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbmZpZy5faSA9IGlucHV0ID0gY29uZmlnLl9sb2NhbGUucHJlcGFyc2UoaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTW9tZW50KGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBNb21lbnQoY2hlY2tPdmVyZmxvdyhpbnB1dCkpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzRGF0ZShpbnB1dCkpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IGlucHV0O1xuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkoZm9ybWF0KSkge1xuICAgICAgICAgICAgY29uZmlnRnJvbVN0cmluZ0FuZEFycmF5KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0KSB7XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZyk7XG4gICAgICAgIH0gIGVsc2Uge1xuICAgICAgICAgICAgY29uZmlnRnJvbUlucHV0KGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzVmFsaWQoY29uZmlnKSkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb25maWc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbUlucHV0KGNvbmZpZykge1xuICAgICAgICB2YXIgaW5wdXQgPSBjb25maWcuX2k7XG4gICAgICAgIGlmIChpc1VuZGVmaW5lZChpbnB1dCkpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKGhvb2tzLm5vdygpKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0RhdGUoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShpbnB1dC52YWx1ZU9mKCkpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21TdHJpbmcoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5KGlucHV0KSkge1xuICAgICAgICAgICAgY29uZmlnLl9hID0gbWFwKGlucHV0LnNsaWNlKDApLCBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KG9iaiwgMTApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25maWdGcm9tQXJyYXkoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc09iamVjdChpbnB1dCkpIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21PYmplY3QoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc051bWJlcihpbnB1dCkpIHtcbiAgICAgICAgICAgIC8vIGZyb20gbWlsbGlzZWNvbmRzXG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShpbnB1dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBob29rcy5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayhjb25maWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlTG9jYWxPclVUQyAoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QsIGlzVVRDKSB7XG4gICAgICAgIHZhciBjID0ge307XG5cbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gdHJ1ZSB8fCBsb2NhbGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBzdHJpY3QgPSBsb2NhbGU7XG4gICAgICAgICAgICBsb2NhbGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoKGlzT2JqZWN0KGlucHV0KSAmJiBpc09iamVjdEVtcHR5KGlucHV0KSkgfHxcbiAgICAgICAgICAgICAgICAoaXNBcnJheShpbnB1dCkgJiYgaW5wdXQubGVuZ3RoID09PSAwKSkge1xuICAgICAgICAgICAgaW5wdXQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gb2JqZWN0IGNvbnN0cnVjdGlvbiBtdXN0IGJlIGRvbmUgdGhpcyB3YXkuXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNDIzXG4gICAgICAgIGMuX2lzQU1vbWVudE9iamVjdCA9IHRydWU7XG4gICAgICAgIGMuX3VzZVVUQyA9IGMuX2lzVVRDID0gaXNVVEM7XG4gICAgICAgIGMuX2wgPSBsb2NhbGU7XG4gICAgICAgIGMuX2kgPSBpbnB1dDtcbiAgICAgICAgYy5fZiA9IGZvcm1hdDtcbiAgICAgICAgYy5fc3RyaWN0ID0gc3RyaWN0O1xuXG4gICAgICAgIHJldHVybiBjcmVhdGVGcm9tQ29uZmlnKGMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUxvY2FsIChpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlTG9jYWxPclVUQyhpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCwgZmFsc2UpO1xuICAgIH1cblxuICAgIHZhciBwcm90b3R5cGVNaW4gPSBkZXByZWNhdGUoXG4gICAgICAgICdtb21lbnQoKS5taW4gaXMgZGVwcmVjYXRlZCwgdXNlIG1vbWVudC5tYXggaW5zdGVhZC4gaHR0cDovL21vbWVudGpzLmNvbS9ndWlkZXMvIy93YXJuaW5ncy9taW4tbWF4LycsXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBvdGhlciA9IGNyZWF0ZUxvY2FsLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBpZiAodGhpcy5pc1ZhbGlkKCkgJiYgb3RoZXIuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG90aGVyIDwgdGhpcyA/IHRoaXMgOiBvdGhlcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUludmFsaWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICk7XG5cbiAgICB2YXIgcHJvdG90eXBlTWF4ID0gZGVwcmVjYXRlKFxuICAgICAgICAnbW9tZW50KCkubWF4IGlzIGRlcHJlY2F0ZWQsIHVzZSBtb21lbnQubWluIGluc3RlYWQuIGh0dHA6Ly9tb21lbnRqcy5jb20vZ3VpZGVzLyMvd2FybmluZ3MvbWluLW1heC8nLFxuICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgb3RoZXIgPSBjcmVhdGVMb2NhbC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNWYWxpZCgpICYmIG90aGVyLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvdGhlciA+IHRoaXMgPyB0aGlzIDogb3RoZXI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVJbnZhbGlkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgLy8gUGljayBhIG1vbWVudCBtIGZyb20gbW9tZW50cyBzbyB0aGF0IG1bZm5dKG90aGVyKSBpcyB0cnVlIGZvciBhbGxcbiAgICAvLyBvdGhlci4gVGhpcyByZWxpZXMgb24gdGhlIGZ1bmN0aW9uIGZuIHRvIGJlIHRyYW5zaXRpdmUuXG4gICAgLy9cbiAgICAvLyBtb21lbnRzIHNob3VsZCBlaXRoZXIgYmUgYW4gYXJyYXkgb2YgbW9tZW50IG9iamVjdHMgb3IgYW4gYXJyYXksIHdob3NlXG4gICAgLy8gZmlyc3QgZWxlbWVudCBpcyBhbiBhcnJheSBvZiBtb21lbnQgb2JqZWN0cy5cbiAgICBmdW5jdGlvbiBwaWNrQnkoZm4sIG1vbWVudHMpIHtcbiAgICAgICAgdmFyIHJlcywgaTtcbiAgICAgICAgaWYgKG1vbWVudHMubGVuZ3RoID09PSAxICYmIGlzQXJyYXkobW9tZW50c1swXSkpIHtcbiAgICAgICAgICAgIG1vbWVudHMgPSBtb21lbnRzWzBdO1xuICAgICAgICB9XG4gICAgICAgIGlmICghbW9tZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVMb2NhbCgpO1xuICAgICAgICB9XG4gICAgICAgIHJlcyA9IG1vbWVudHNbMF07XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBtb21lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBpZiAoIW1vbWVudHNbaV0uaXNWYWxpZCgpIHx8IG1vbWVudHNbaV1bZm5dKHJlcykpIHtcbiAgICAgICAgICAgICAgICByZXMgPSBtb21lbnRzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogVXNlIFtdLnNvcnQgaW5zdGVhZD9cbiAgICBmdW5jdGlvbiBtaW4gKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICByZXR1cm4gcGlja0J5KCdpc0JlZm9yZScsIGFyZ3MpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1heCAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgIHJldHVybiBwaWNrQnkoJ2lzQWZ0ZXInLCBhcmdzKTtcbiAgICB9XG5cbiAgICB2YXIgbm93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3cgPyBEYXRlLm5vdygpIDogKyhuZXcgRGF0ZSgpKTtcbiAgICB9O1xuXG4gICAgdmFyIG9yZGVyaW5nID0gWyd5ZWFyJywgJ3F1YXJ0ZXInLCAnbW9udGgnLCAnd2VlaycsICdkYXknLCAnaG91cicsICdtaW51dGUnLCAnc2Vjb25kJywgJ21pbGxpc2Vjb25kJ107XG5cbiAgICBmdW5jdGlvbiBpc0R1cmF0aW9uVmFsaWQobSkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gbSkge1xuICAgICAgICAgICAgaWYgKCEoaW5kZXhPZi5jYWxsKG9yZGVyaW5nLCBrZXkpICE9PSAtMSAmJiAobVtrZXldID09IG51bGwgfHwgIWlzTmFOKG1ba2V5XSkpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB1bml0SGFzRGVjaW1hbCA9IGZhbHNlO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9yZGVyaW5nLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBpZiAobVtvcmRlcmluZ1tpXV0pIHtcbiAgICAgICAgICAgICAgICBpZiAodW5pdEhhc0RlY2ltYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBvbmx5IGFsbG93IG5vbi1pbnRlZ2VycyBmb3Igc21hbGxlc3QgdW5pdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocGFyc2VGbG9hdChtW29yZGVyaW5nW2ldXSkgIT09IHRvSW50KG1bb3JkZXJpbmdbaV1dKSkge1xuICAgICAgICAgICAgICAgICAgICB1bml0SGFzRGVjaW1hbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNWYWxpZCQxKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNWYWxpZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVJbnZhbGlkJDEoKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVEdXJhdGlvbihOYU4pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIER1cmF0aW9uIChkdXJhdGlvbikge1xuICAgICAgICB2YXIgbm9ybWFsaXplZElucHV0ID0gbm9ybWFsaXplT2JqZWN0VW5pdHMoZHVyYXRpb24pLFxuICAgICAgICAgICAgeWVhcnMgPSBub3JtYWxpemVkSW5wdXQueWVhciB8fCAwLFxuICAgICAgICAgICAgcXVhcnRlcnMgPSBub3JtYWxpemVkSW5wdXQucXVhcnRlciB8fCAwLFxuICAgICAgICAgICAgbW9udGhzID0gbm9ybWFsaXplZElucHV0Lm1vbnRoIHx8IDAsXG4gICAgICAgICAgICB3ZWVrcyA9IG5vcm1hbGl6ZWRJbnB1dC53ZWVrIHx8IDAsXG4gICAgICAgICAgICBkYXlzID0gbm9ybWFsaXplZElucHV0LmRheSB8fCAwLFxuICAgICAgICAgICAgaG91cnMgPSBub3JtYWxpemVkSW5wdXQuaG91ciB8fCAwLFxuICAgICAgICAgICAgbWludXRlcyA9IG5vcm1hbGl6ZWRJbnB1dC5taW51dGUgfHwgMCxcbiAgICAgICAgICAgIHNlY29uZHMgPSBub3JtYWxpemVkSW5wdXQuc2Vjb25kIHx8IDAsXG4gICAgICAgICAgICBtaWxsaXNlY29uZHMgPSBub3JtYWxpemVkSW5wdXQubWlsbGlzZWNvbmQgfHwgMDtcblxuICAgICAgICB0aGlzLl9pc1ZhbGlkID0gaXNEdXJhdGlvblZhbGlkKG5vcm1hbGl6ZWRJbnB1dCk7XG5cbiAgICAgICAgLy8gcmVwcmVzZW50YXRpb24gZm9yIGRhdGVBZGRSZW1vdmVcbiAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzID0gK21pbGxpc2Vjb25kcyArXG4gICAgICAgICAgICBzZWNvbmRzICogMWUzICsgLy8gMTAwMFxuICAgICAgICAgICAgbWludXRlcyAqIDZlNCArIC8vIDEwMDAgKiA2MFxuICAgICAgICAgICAgaG91cnMgKiAxMDAwICogNjAgKiA2MDsgLy91c2luZyAxMDAwICogNjAgKiA2MCBpbnN0ZWFkIG9mIDM2ZTUgdG8gYXZvaWQgZmxvYXRpbmcgcG9pbnQgcm91bmRpbmcgZXJyb3JzIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8yOTc4XG4gICAgICAgIC8vIEJlY2F1c2Ugb2YgZGF0ZUFkZFJlbW92ZSB0cmVhdHMgMjQgaG91cnMgYXMgZGlmZmVyZW50IGZyb20gYVxuICAgICAgICAvLyBkYXkgd2hlbiB3b3JraW5nIGFyb3VuZCBEU1QsIHdlIG5lZWQgdG8gc3RvcmUgdGhlbSBzZXBhcmF0ZWx5XG4gICAgICAgIHRoaXMuX2RheXMgPSArZGF5cyArXG4gICAgICAgICAgICB3ZWVrcyAqIDc7XG4gICAgICAgIC8vIEl0IGlzIGltcG9zc2libGUgdG8gdHJhbnNsYXRlIG1vbnRocyBpbnRvIGRheXMgd2l0aG91dCBrbm93aW5nXG4gICAgICAgIC8vIHdoaWNoIG1vbnRocyB5b3UgYXJlIGFyZSB0YWxraW5nIGFib3V0LCBzbyB3ZSBoYXZlIHRvIHN0b3JlXG4gICAgICAgIC8vIGl0IHNlcGFyYXRlbHkuXG4gICAgICAgIHRoaXMuX21vbnRocyA9ICttb250aHMgK1xuICAgICAgICAgICAgcXVhcnRlcnMgKiAzICtcbiAgICAgICAgICAgIHllYXJzICogMTI7XG5cbiAgICAgICAgdGhpcy5fZGF0YSA9IHt9O1xuXG4gICAgICAgIHRoaXMuX2xvY2FsZSA9IGdldExvY2FsZSgpO1xuXG4gICAgICAgIHRoaXMuX2J1YmJsZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRHVyYXRpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRHVyYXRpb247XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWJzUm91bmQgKG51bWJlcikge1xuICAgICAgICBpZiAobnVtYmVyIDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoLTEgKiBudW1iZXIpICogLTE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChudW1iZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgZnVuY3Rpb24gb2Zmc2V0ICh0b2tlbiwgc2VwYXJhdG9yKSB7XG4gICAgICAgIGFkZEZvcm1hdFRva2VuKHRva2VuLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy51dGNPZmZzZXQoKTtcbiAgICAgICAgICAgIHZhciBzaWduID0gJysnO1xuICAgICAgICAgICAgaWYgKG9mZnNldCA8IDApIHtcbiAgICAgICAgICAgICAgICBvZmZzZXQgPSAtb2Zmc2V0O1xuICAgICAgICAgICAgICAgIHNpZ24gPSAnLSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2lnbiArIHplcm9GaWxsKH5+KG9mZnNldCAvIDYwKSwgMikgKyBzZXBhcmF0b3IgKyB6ZXJvRmlsbCh+fihvZmZzZXQpICUgNjAsIDIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvZmZzZXQoJ1onLCAnOicpO1xuICAgIG9mZnNldCgnWlonLCAnJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdaJywgIG1hdGNoU2hvcnRPZmZzZXQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1paJywgbWF0Y2hTaG9ydE9mZnNldCk7XG4gICAgYWRkUGFyc2VUb2tlbihbJ1onLCAnWlonXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5fdXNlVVRDID0gdHJ1ZTtcbiAgICAgICAgY29uZmlnLl90em0gPSBvZmZzZXRGcm9tU3RyaW5nKG1hdGNoU2hvcnRPZmZzZXQsIGlucHV0KTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIC8vIHRpbWV6b25lIGNodW5rZXJcbiAgICAvLyAnKzEwOjAwJyA+IFsnMTAnLCAgJzAwJ11cbiAgICAvLyAnLTE1MzAnICA+IFsnLTE1JywgJzMwJ11cbiAgICB2YXIgY2h1bmtPZmZzZXQgPSAvKFtcXCtcXC1dfFxcZFxcZCkvZ2k7XG5cbiAgICBmdW5jdGlvbiBvZmZzZXRGcm9tU3RyaW5nKG1hdGNoZXIsIHN0cmluZykge1xuICAgICAgICB2YXIgbWF0Y2hlcyA9IChzdHJpbmcgfHwgJycpLm1hdGNoKG1hdGNoZXIpO1xuXG4gICAgICAgIGlmIChtYXRjaGVzID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaHVuayAgID0gbWF0Y2hlc1ttYXRjaGVzLmxlbmd0aCAtIDFdIHx8IFtdO1xuICAgICAgICB2YXIgcGFydHMgICA9IChjaHVuayArICcnKS5tYXRjaChjaHVua09mZnNldCkgfHwgWyctJywgMCwgMF07XG4gICAgICAgIHZhciBtaW51dGVzID0gKyhwYXJ0c1sxXSAqIDYwKSArIHRvSW50KHBhcnRzWzJdKTtcblxuICAgICAgICByZXR1cm4gbWludXRlcyA9PT0gMCA/XG4gICAgICAgICAgMCA6XG4gICAgICAgICAgcGFydHNbMF0gPT09ICcrJyA/IG1pbnV0ZXMgOiAtbWludXRlcztcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYSBtb21lbnQgZnJvbSBpbnB1dCwgdGhhdCBpcyBsb2NhbC91dGMvem9uZSBlcXVpdmFsZW50IHRvIG1vZGVsLlxuICAgIGZ1bmN0aW9uIGNsb25lV2l0aE9mZnNldChpbnB1dCwgbW9kZWwpIHtcbiAgICAgICAgdmFyIHJlcywgZGlmZjtcbiAgICAgICAgaWYgKG1vZGVsLl9pc1VUQykge1xuICAgICAgICAgICAgcmVzID0gbW9kZWwuY2xvbmUoKTtcbiAgICAgICAgICAgIGRpZmYgPSAoaXNNb21lbnQoaW5wdXQpIHx8IGlzRGF0ZShpbnB1dCkgPyBpbnB1dC52YWx1ZU9mKCkgOiBjcmVhdGVMb2NhbChpbnB1dCkudmFsdWVPZigpKSAtIHJlcy52YWx1ZU9mKCk7XG4gICAgICAgICAgICAvLyBVc2UgbG93LWxldmVsIGFwaSwgYmVjYXVzZSB0aGlzIGZuIGlzIGxvdy1sZXZlbCBhcGkuXG4gICAgICAgICAgICByZXMuX2Quc2V0VGltZShyZXMuX2QudmFsdWVPZigpICsgZGlmZik7XG4gICAgICAgICAgICBob29rcy51cGRhdGVPZmZzZXQocmVzLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUxvY2FsKGlucHV0KS5sb2NhbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RGF0ZU9mZnNldCAobSkge1xuICAgICAgICAvLyBPbiBGaXJlZm94LjI0IERhdGUjZ2V0VGltZXpvbmVPZmZzZXQgcmV0dXJucyBhIGZsb2F0aW5nIHBvaW50LlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9wdWxsLzE4NzFcbiAgICAgICAgcmV0dXJuIC1NYXRoLnJvdW5kKG0uX2QuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDE1KSAqIDE1O1xuICAgIH1cblxuICAgIC8vIEhPT0tTXG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW5ldmVyIGEgbW9tZW50IGlzIG11dGF0ZWQuXG4gICAgLy8gSXQgaXMgaW50ZW5kZWQgdG8ga2VlcCB0aGUgb2Zmc2V0IGluIHN5bmMgd2l0aCB0aGUgdGltZXpvbmUuXG4gICAgaG9va3MudXBkYXRlT2Zmc2V0ID0gZnVuY3Rpb24gKCkge307XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICAvLyBrZWVwTG9jYWxUaW1lID0gdHJ1ZSBtZWFucyBvbmx5IGNoYW5nZSB0aGUgdGltZXpvbmUsIHdpdGhvdXRcbiAgICAvLyBhZmZlY3RpbmcgdGhlIGxvY2FsIGhvdXIuIFNvIDU6MzE6MjYgKzAzMDAgLS1bdXRjT2Zmc2V0KDIsIHRydWUpXS0tPlxuICAgIC8vIDU6MzE6MjYgKzAyMDAgSXQgaXMgcG9zc2libGUgdGhhdCA1OjMxOjI2IGRvZXNuJ3QgZXhpc3Qgd2l0aCBvZmZzZXRcbiAgICAvLyArMDIwMCwgc28gd2UgYWRqdXN0IHRoZSB0aW1lIGFzIG5lZWRlZCwgdG8gYmUgdmFsaWQuXG4gICAgLy9cbiAgICAvLyBLZWVwaW5nIHRoZSB0aW1lIGFjdHVhbGx5IGFkZHMvc3VidHJhY3RzIChvbmUgaG91cilcbiAgICAvLyBmcm9tIHRoZSBhY3R1YWwgcmVwcmVzZW50ZWQgdGltZS4gVGhhdCBpcyB3aHkgd2UgY2FsbCB1cGRhdGVPZmZzZXRcbiAgICAvLyBhIHNlY29uZCB0aW1lLiBJbiBjYXNlIGl0IHdhbnRzIHVzIHRvIGNoYW5nZSB0aGUgb2Zmc2V0IGFnYWluXG4gICAgLy8gX2NoYW5nZUluUHJvZ3Jlc3MgPT0gdHJ1ZSBjYXNlLCB0aGVuIHdlIGhhdmUgdG8gYWRqdXN0LCBiZWNhdXNlXG4gICAgLy8gdGhlcmUgaXMgbm8gc3VjaCB0aW1lIGluIHRoZSBnaXZlbiB0aW1lem9uZS5cbiAgICBmdW5jdGlvbiBnZXRTZXRPZmZzZXQgKGlucHV0LCBrZWVwTG9jYWxUaW1lLCBrZWVwTWludXRlcykge1xuICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy5fb2Zmc2V0IHx8IDAsXG4gICAgICAgICAgICBsb2NhbEFkanVzdDtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0ICE9IG51bGwgPyB0aGlzIDogTmFOO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gb2Zmc2V0RnJvbVN0cmluZyhtYXRjaFNob3J0T2Zmc2V0LCBpbnB1dCk7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoTWF0aC5hYnMoaW5wdXQpIDwgMTYgJiYgIWtlZXBNaW51dGVzKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dCAqIDYwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLl9pc1VUQyAmJiBrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxBZGp1c3QgPSBnZXREYXRlT2Zmc2V0KHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fb2Zmc2V0ID0gaW5wdXQ7XG4gICAgICAgICAgICB0aGlzLl9pc1VUQyA9IHRydWU7XG4gICAgICAgICAgICBpZiAobG9jYWxBZGp1c3QgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkKGxvY2FsQWRqdXN0LCAnbScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9mZnNldCAhPT0gaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWtlZXBMb2NhbFRpbWUgfHwgdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcykge1xuICAgICAgICAgICAgICAgICAgICBhZGRTdWJ0cmFjdCh0aGlzLCBjcmVhdGVEdXJhdGlvbihpbnB1dCAtIG9mZnNldCwgJ20nKSwgMSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGhvb2tzLnVwZGF0ZU9mZnNldCh0aGlzLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcyA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgPyBvZmZzZXQgOiBnZXREYXRlT2Zmc2V0KHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0Wm9uZSAoaW5wdXQsIGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSAtaW5wdXQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KGlucHV0LCBrZWVwTG9jYWxUaW1lKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gLXRoaXMudXRjT2Zmc2V0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRPZmZzZXRUb1VUQyAoa2VlcExvY2FsVGltZSkge1xuICAgICAgICByZXR1cm4gdGhpcy51dGNPZmZzZXQoMCwga2VlcExvY2FsVGltZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0T2Zmc2V0VG9Mb2NhbCAoa2VlcExvY2FsVGltZSkge1xuICAgICAgICBpZiAodGhpcy5faXNVVEMpIHtcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KDAsIGtlZXBMb2NhbFRpbWUpO1xuICAgICAgICAgICAgdGhpcy5faXNVVEMgPSBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN1YnRyYWN0KGdldERhdGVPZmZzZXQodGhpcyksICdtJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0T2Zmc2V0VG9QYXJzZWRPZmZzZXQgKCkge1xuICAgICAgICBpZiAodGhpcy5fdHptICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KHRoaXMuX3R6bSwgZmFsc2UsIHRydWUpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLl9pID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdmFyIHRab25lID0gb2Zmc2V0RnJvbVN0cmluZyhtYXRjaE9mZnNldCwgdGhpcy5faSk7XG4gICAgICAgICAgICBpZiAodFpvbmUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KHRab25lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KDAsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhc0FsaWduZWRIb3VyT2Zmc2V0IChpbnB1dCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaW5wdXQgPSBpbnB1dCA/IGNyZWF0ZUxvY2FsKGlucHV0KS51dGNPZmZzZXQoKSA6IDA7XG5cbiAgICAgICAgcmV0dXJuICh0aGlzLnV0Y09mZnNldCgpIC0gaW5wdXQpICUgNjAgPT09IDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNEYXlsaWdodFNhdmluZ1RpbWUgKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQoKSA+IHRoaXMuY2xvbmUoKS5tb250aCgwKS51dGNPZmZzZXQoKSB8fFxuICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQoKSA+IHRoaXMuY2xvbmUoKS5tb250aCg1KS51dGNPZmZzZXQoKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRGF5bGlnaHRTYXZpbmdUaW1lU2hpZnRlZCAoKSB7XG4gICAgICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5faXNEU1RTaGlmdGVkKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzRFNUU2hpZnRlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjID0ge307XG5cbiAgICAgICAgY29weUNvbmZpZyhjLCB0aGlzKTtcbiAgICAgICAgYyA9IHByZXBhcmVDb25maWcoYyk7XG5cbiAgICAgICAgaWYgKGMuX2EpIHtcbiAgICAgICAgICAgIHZhciBvdGhlciA9IGMuX2lzVVRDID8gY3JlYXRlVVRDKGMuX2EpIDogY3JlYXRlTG9jYWwoYy5fYSk7XG4gICAgICAgICAgICB0aGlzLl9pc0RTVFNoaWZ0ZWQgPSB0aGlzLmlzVmFsaWQoKSAmJlxuICAgICAgICAgICAgICAgIGNvbXBhcmVBcnJheXMoYy5fYSwgb3RoZXIudG9BcnJheSgpKSA+IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9pc0RTVFNoaWZ0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9pc0RTVFNoaWZ0ZWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNMb2NhbCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSA/ICF0aGlzLl9pc1VUQyA6IGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzVXRjT2Zmc2V0ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCgpID8gdGhpcy5faXNVVEMgOiBmYWxzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1V0YyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSA/IHRoaXMuX2lzVVRDICYmIHRoaXMuX29mZnNldCA9PT0gMCA6IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIEFTUC5ORVQganNvbiBkYXRlIGZvcm1hdCByZWdleFxuICAgIHZhciBhc3BOZXRSZWdleCA9IC9eKFxcLXxcXCspPyg/OihcXGQqKVsuIF0pPyhcXGQrKVxcOihcXGQrKSg/OlxcOihcXGQrKShcXC5cXGQqKT8pPyQvO1xuXG4gICAgLy8gZnJvbSBodHRwOi8vZG9jcy5jbG9zdXJlLWxpYnJhcnkuZ29vZ2xlY29kZS5jb20vZ2l0L2Nsb3N1cmVfZ29vZ19kYXRlX2RhdGUuanMuc291cmNlLmh0bWxcbiAgICAvLyBzb21ld2hhdCBtb3JlIGluIGxpbmUgd2l0aCA0LjQuMy4yIDIwMDQgc3BlYywgYnV0IGFsbG93cyBkZWNpbWFsIGFueXdoZXJlXG4gICAgLy8gYW5kIGZ1cnRoZXIgbW9kaWZpZWQgdG8gYWxsb3cgZm9yIHN0cmluZ3MgY29udGFpbmluZyBib3RoIHdlZWsgYW5kIGRheVxuICAgIHZhciBpc29SZWdleCA9IC9eKC18XFwrKT9QKD86KFstK10/WzAtOSwuXSopWSk/KD86KFstK10/WzAtOSwuXSopTSk/KD86KFstK10/WzAtOSwuXSopVyk/KD86KFstK10/WzAtOSwuXSopRCk/KD86VCg/OihbLStdP1swLTksLl0qKUgpPyg/OihbLStdP1swLTksLl0qKU0pPyg/OihbLStdP1swLTksLl0qKVMpPyk/JC87XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVEdXJhdGlvbiAoaW5wdXQsIGtleSkge1xuICAgICAgICB2YXIgZHVyYXRpb24gPSBpbnB1dCxcbiAgICAgICAgICAgIC8vIG1hdGNoaW5nIGFnYWluc3QgcmVnZXhwIGlzIGV4cGVuc2l2ZSwgZG8gaXQgb24gZGVtYW5kXG4gICAgICAgICAgICBtYXRjaCA9IG51bGwsXG4gICAgICAgICAgICBzaWduLFxuICAgICAgICAgICAgcmV0LFxuICAgICAgICAgICAgZGlmZlJlcztcblxuICAgICAgICBpZiAoaXNEdXJhdGlvbihpbnB1dCkpIHtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge1xuICAgICAgICAgICAgICAgIG1zIDogaW5wdXQuX21pbGxpc2Vjb25kcyxcbiAgICAgICAgICAgICAgICBkICA6IGlucHV0Ll9kYXlzLFxuICAgICAgICAgICAgICAgIE0gIDogaW5wdXQuX21vbnRoc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmIChpc051bWJlcihpbnB1dCkpIHtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge307XG4gICAgICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb25ba2V5XSA9IGlucHV0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbi5taWxsaXNlY29uZHMgPSBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghIShtYXRjaCA9IGFzcE5ldFJlZ2V4LmV4ZWMoaW5wdXQpKSkge1xuICAgICAgICAgICAgc2lnbiA9IChtYXRjaFsxXSA9PT0gJy0nKSA/IC0xIDogMTtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge1xuICAgICAgICAgICAgICAgIHkgIDogMCxcbiAgICAgICAgICAgICAgICBkICA6IHRvSW50KG1hdGNoW0RBVEVdKSAgICAgICAgICAgICAgICAgICAgICAgICAqIHNpZ24sXG4gICAgICAgICAgICAgICAgaCAgOiB0b0ludChtYXRjaFtIT1VSXSkgICAgICAgICAgICAgICAgICAgICAgICAgKiBzaWduLFxuICAgICAgICAgICAgICAgIG0gIDogdG9JbnQobWF0Y2hbTUlOVVRFXSkgICAgICAgICAgICAgICAgICAgICAgICogc2lnbixcbiAgICAgICAgICAgICAgICBzICA6IHRvSW50KG1hdGNoW1NFQ09ORF0pICAgICAgICAgICAgICAgICAgICAgICAqIHNpZ24sXG4gICAgICAgICAgICAgICAgbXMgOiB0b0ludChhYnNSb3VuZChtYXRjaFtNSUxMSVNFQ09ORF0gKiAxMDAwKSkgKiBzaWduIC8vIHRoZSBtaWxsaXNlY29uZCBkZWNpbWFsIHBvaW50IGlzIGluY2x1ZGVkIGluIHRoZSBtYXRjaFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmICghIShtYXRjaCA9IGlzb1JlZ2V4LmV4ZWMoaW5wdXQpKSkge1xuICAgICAgICAgICAgc2lnbiA9IChtYXRjaFsxXSA9PT0gJy0nKSA/IC0xIDogKG1hdGNoWzFdID09PSAnKycpID8gMSA6IDE7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICB5IDogcGFyc2VJc28obWF0Y2hbMl0sIHNpZ24pLFxuICAgICAgICAgICAgICAgIE0gOiBwYXJzZUlzbyhtYXRjaFszXSwgc2lnbiksXG4gICAgICAgICAgICAgICAgdyA6IHBhcnNlSXNvKG1hdGNoWzRdLCBzaWduKSxcbiAgICAgICAgICAgICAgICBkIDogcGFyc2VJc28obWF0Y2hbNV0sIHNpZ24pLFxuICAgICAgICAgICAgICAgIGggOiBwYXJzZUlzbyhtYXRjaFs2XSwgc2lnbiksXG4gICAgICAgICAgICAgICAgbSA6IHBhcnNlSXNvKG1hdGNoWzddLCBzaWduKSxcbiAgICAgICAgICAgICAgICBzIDogcGFyc2VJc28obWF0Y2hbOF0sIHNpZ24pXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKGR1cmF0aW9uID09IG51bGwpIHsvLyBjaGVja3MgZm9yIG51bGwgb3IgdW5kZWZpbmVkXG4gICAgICAgICAgICBkdXJhdGlvbiA9IHt9O1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkdXJhdGlvbiA9PT0gJ29iamVjdCcgJiYgKCdmcm9tJyBpbiBkdXJhdGlvbiB8fCAndG8nIGluIGR1cmF0aW9uKSkge1xuICAgICAgICAgICAgZGlmZlJlcyA9IG1vbWVudHNEaWZmZXJlbmNlKGNyZWF0ZUxvY2FsKGR1cmF0aW9uLmZyb20pLCBjcmVhdGVMb2NhbChkdXJhdGlvbi50bykpO1xuXG4gICAgICAgICAgICBkdXJhdGlvbiA9IHt9O1xuICAgICAgICAgICAgZHVyYXRpb24ubXMgPSBkaWZmUmVzLm1pbGxpc2Vjb25kcztcbiAgICAgICAgICAgIGR1cmF0aW9uLk0gPSBkaWZmUmVzLm1vbnRocztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldCA9IG5ldyBEdXJhdGlvbihkdXJhdGlvbik7XG5cbiAgICAgICAgaWYgKGlzRHVyYXRpb24oaW5wdXQpICYmIGhhc093blByb3AoaW5wdXQsICdfbG9jYWxlJykpIHtcbiAgICAgICAgICAgIHJldC5fbG9jYWxlID0gaW5wdXQuX2xvY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgY3JlYXRlRHVyYXRpb24uZm4gPSBEdXJhdGlvbi5wcm90b3R5cGU7XG4gICAgY3JlYXRlRHVyYXRpb24uaW52YWxpZCA9IGNyZWF0ZUludmFsaWQkMTtcblxuICAgIGZ1bmN0aW9uIHBhcnNlSXNvIChpbnAsIHNpZ24pIHtcbiAgICAgICAgLy8gV2UnZCBub3JtYWxseSB1c2Ugfn5pbnAgZm9yIHRoaXMsIGJ1dCB1bmZvcnR1bmF0ZWx5IGl0IGFsc29cbiAgICAgICAgLy8gY29udmVydHMgZmxvYXRzIHRvIGludHMuXG4gICAgICAgIC8vIGlucCBtYXkgYmUgdW5kZWZpbmVkLCBzbyBjYXJlZnVsIGNhbGxpbmcgcmVwbGFjZSBvbiBpdC5cbiAgICAgICAgdmFyIHJlcyA9IGlucCAmJiBwYXJzZUZsb2F0KGlucC5yZXBsYWNlKCcsJywgJy4nKSk7XG4gICAgICAgIC8vIGFwcGx5IHNpZ24gd2hpbGUgd2UncmUgYXQgaXRcbiAgICAgICAgcmV0dXJuIChpc05hTihyZXMpID8gMCA6IHJlcykgKiBzaWduO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBvc2l0aXZlTW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpIHtcbiAgICAgICAgdmFyIHJlcyA9IHttaWxsaXNlY29uZHM6IDAsIG1vbnRoczogMH07XG5cbiAgICAgICAgcmVzLm1vbnRocyA9IG90aGVyLm1vbnRoKCkgLSBiYXNlLm1vbnRoKCkgK1xuICAgICAgICAgICAgKG90aGVyLnllYXIoKSAtIGJhc2UueWVhcigpKSAqIDEyO1xuICAgICAgICBpZiAoYmFzZS5jbG9uZSgpLmFkZChyZXMubW9udGhzLCAnTScpLmlzQWZ0ZXIob3RoZXIpKSB7XG4gICAgICAgICAgICAtLXJlcy5tb250aHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXMubWlsbGlzZWNvbmRzID0gK290aGVyIC0gKyhiYXNlLmNsb25lKCkuYWRkKHJlcy5tb250aHMsICdNJykpO1xuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpIHtcbiAgICAgICAgdmFyIHJlcztcbiAgICAgICAgaWYgKCEoYmFzZS5pc1ZhbGlkKCkgJiYgb3RoZXIuaXNWYWxpZCgpKSkge1xuICAgICAgICAgICAgcmV0dXJuIHttaWxsaXNlY29uZHM6IDAsIG1vbnRoczogMH07XG4gICAgICAgIH1cblxuICAgICAgICBvdGhlciA9IGNsb25lV2l0aE9mZnNldChvdGhlciwgYmFzZSk7XG4gICAgICAgIGlmIChiYXNlLmlzQmVmb3JlKG90aGVyKSkge1xuICAgICAgICAgICAgcmVzID0gcG9zaXRpdmVNb21lbnRzRGlmZmVyZW5jZShiYXNlLCBvdGhlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXMgPSBwb3NpdGl2ZU1vbWVudHNEaWZmZXJlbmNlKG90aGVyLCBiYXNlKTtcbiAgICAgICAgICAgIHJlcy5taWxsaXNlY29uZHMgPSAtcmVzLm1pbGxpc2Vjb25kcztcbiAgICAgICAgICAgIHJlcy5tb250aHMgPSAtcmVzLm1vbnRocztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogcmVtb3ZlICduYW1lJyBhcmcgYWZ0ZXIgZGVwcmVjYXRpb24gaXMgcmVtb3ZlZFxuICAgIGZ1bmN0aW9uIGNyZWF0ZUFkZGVyKGRpcmVjdGlvbiwgbmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbCwgcGVyaW9kKSB7XG4gICAgICAgICAgICB2YXIgZHVyLCB0bXA7XG4gICAgICAgICAgICAvL2ludmVydCB0aGUgYXJndW1lbnRzLCBidXQgY29tcGxhaW4gYWJvdXQgaXRcbiAgICAgICAgICAgIGlmIChwZXJpb2QgIT09IG51bGwgJiYgIWlzTmFOKCtwZXJpb2QpKSB7XG4gICAgICAgICAgICAgICAgZGVwcmVjYXRlU2ltcGxlKG5hbWUsICdtb21lbnQoKS4nICsgbmFtZSAgKyAnKHBlcmlvZCwgbnVtYmVyKSBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIG1vbWVudCgpLicgKyBuYW1lICsgJyhudW1iZXIsIHBlcmlvZCkuICcgK1xuICAgICAgICAgICAgICAgICdTZWUgaHR0cDovL21vbWVudGpzLmNvbS9ndWlkZXMvIy93YXJuaW5ncy9hZGQtaW52ZXJ0ZWQtcGFyYW0vIGZvciBtb3JlIGluZm8uJyk7XG4gICAgICAgICAgICAgICAgdG1wID0gdmFsOyB2YWwgPSBwZXJpb2Q7IHBlcmlvZCA9IHRtcDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFsID0gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgPyArdmFsIDogdmFsO1xuICAgICAgICAgICAgZHVyID0gY3JlYXRlRHVyYXRpb24odmFsLCBwZXJpb2QpO1xuICAgICAgICAgICAgYWRkU3VidHJhY3QodGhpcywgZHVyLCBkaXJlY3Rpb24pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkU3VidHJhY3QgKG1vbSwgZHVyYXRpb24sIGlzQWRkaW5nLCB1cGRhdGVPZmZzZXQpIHtcbiAgICAgICAgdmFyIG1pbGxpc2Vjb25kcyA9IGR1cmF0aW9uLl9taWxsaXNlY29uZHMsXG4gICAgICAgICAgICBkYXlzID0gYWJzUm91bmQoZHVyYXRpb24uX2RheXMpLFxuICAgICAgICAgICAgbW9udGhzID0gYWJzUm91bmQoZHVyYXRpb24uX21vbnRocyk7XG5cbiAgICAgICAgaWYgKCFtb20uaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICAvLyBObyBvcFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlT2Zmc2V0ID0gdXBkYXRlT2Zmc2V0ID09IG51bGwgPyB0cnVlIDogdXBkYXRlT2Zmc2V0O1xuXG4gICAgICAgIGlmIChtb250aHMpIHtcbiAgICAgICAgICAgIHNldE1vbnRoKG1vbSwgZ2V0KG1vbSwgJ01vbnRoJykgKyBtb250aHMgKiBpc0FkZGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRheXMpIHtcbiAgICAgICAgICAgIHNldCQxKG1vbSwgJ0RhdGUnLCBnZXQobW9tLCAnRGF0ZScpICsgZGF5cyAqIGlzQWRkaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWlsbGlzZWNvbmRzKSB7XG4gICAgICAgICAgICBtb20uX2Quc2V0VGltZShtb20uX2QudmFsdWVPZigpICsgbWlsbGlzZWNvbmRzICogaXNBZGRpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1cGRhdGVPZmZzZXQpIHtcbiAgICAgICAgICAgIGhvb2tzLnVwZGF0ZU9mZnNldChtb20sIGRheXMgfHwgbW9udGhzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBhZGQgICAgICA9IGNyZWF0ZUFkZGVyKDEsICdhZGQnKTtcbiAgICB2YXIgc3VidHJhY3QgPSBjcmVhdGVBZGRlcigtMSwgJ3N1YnRyYWN0Jyk7XG5cbiAgICBmdW5jdGlvbiBnZXRDYWxlbmRhckZvcm1hdChteU1vbWVudCwgbm93KSB7XG4gICAgICAgIHZhciBkaWZmID0gbXlNb21lbnQuZGlmZihub3csICdkYXlzJywgdHJ1ZSk7XG4gICAgICAgIHJldHVybiBkaWZmIDwgLTYgPyAnc2FtZUVsc2UnIDpcbiAgICAgICAgICAgICAgICBkaWZmIDwgLTEgPyAnbGFzdFdlZWsnIDpcbiAgICAgICAgICAgICAgICBkaWZmIDwgMCA/ICdsYXN0RGF5JyA6XG4gICAgICAgICAgICAgICAgZGlmZiA8IDEgPyAnc2FtZURheScgOlxuICAgICAgICAgICAgICAgIGRpZmYgPCAyID8gJ25leHREYXknIDpcbiAgICAgICAgICAgICAgICBkaWZmIDwgNyA/ICduZXh0V2VlaycgOiAnc2FtZUVsc2UnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbGVuZGFyJDEgKHRpbWUsIGZvcm1hdHMpIHtcbiAgICAgICAgLy8gV2Ugd2FudCB0byBjb21wYXJlIHRoZSBzdGFydCBvZiB0b2RheSwgdnMgdGhpcy5cbiAgICAgICAgLy8gR2V0dGluZyBzdGFydC1vZi10b2RheSBkZXBlbmRzIG9uIHdoZXRoZXIgd2UncmUgbG9jYWwvdXRjL29mZnNldCBvciBub3QuXG4gICAgICAgIHZhciBub3cgPSB0aW1lIHx8IGNyZWF0ZUxvY2FsKCksXG4gICAgICAgICAgICBzb2QgPSBjbG9uZVdpdGhPZmZzZXQobm93LCB0aGlzKS5zdGFydE9mKCdkYXknKSxcbiAgICAgICAgICAgIGZvcm1hdCA9IGhvb2tzLmNhbGVuZGFyRm9ybWF0KHRoaXMsIHNvZCkgfHwgJ3NhbWVFbHNlJztcblxuICAgICAgICB2YXIgb3V0cHV0ID0gZm9ybWF0cyAmJiAoaXNGdW5jdGlvbihmb3JtYXRzW2Zvcm1hdF0pID8gZm9ybWF0c1tmb3JtYXRdLmNhbGwodGhpcywgbm93KSA6IGZvcm1hdHNbZm9ybWF0XSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0KG91dHB1dCB8fCB0aGlzLmxvY2FsZURhdGEoKS5jYWxlbmRhcihmb3JtYXQsIHRoaXMsIGNyZWF0ZUxvY2FsKG5vdykpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbG9uZSAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgTW9tZW50KHRoaXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQWZ0ZXIgKGlucHV0LCB1bml0cykge1xuICAgICAgICB2YXIgbG9jYWxJbnB1dCA9IGlzTW9tZW50KGlucHV0KSA/IGlucHV0IDogY3JlYXRlTG9jYWwoaW5wdXQpO1xuICAgICAgICBpZiAoISh0aGlzLmlzVmFsaWQoKSAmJiBsb2NhbElucHV0LmlzVmFsaWQoKSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKCFpc1VuZGVmaW5lZCh1bml0cykgPyB1bml0cyA6ICdtaWxsaXNlY29uZCcpO1xuICAgICAgICBpZiAodW5pdHMgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlT2YoKSA+IGxvY2FsSW5wdXQudmFsdWVPZigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsSW5wdXQudmFsdWVPZigpIDwgdGhpcy5jbG9uZSgpLnN0YXJ0T2YodW5pdHMpLnZhbHVlT2YoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQmVmb3JlIChpbnB1dCwgdW5pdHMpIHtcbiAgICAgICAgdmFyIGxvY2FsSW5wdXQgPSBpc01vbWVudChpbnB1dCkgPyBpbnB1dCA6IGNyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICAgICAgaWYgKCEodGhpcy5pc1ZhbGlkKCkgJiYgbG9jYWxJbnB1dC5pc1ZhbGlkKCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyghaXNVbmRlZmluZWQodW5pdHMpID8gdW5pdHMgOiAnbWlsbGlzZWNvbmQnKTtcbiAgICAgICAgaWYgKHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZU9mKCkgPCBsb2NhbElucHV0LnZhbHVlT2YoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuZW5kT2YodW5pdHMpLnZhbHVlT2YoKSA8IGxvY2FsSW5wdXQudmFsdWVPZigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNCZXR3ZWVuIChmcm9tLCB0bywgdW5pdHMsIGluY2x1c2l2aXR5KSB7XG4gICAgICAgIGluY2x1c2l2aXR5ID0gaW5jbHVzaXZpdHkgfHwgJygpJztcbiAgICAgICAgcmV0dXJuIChpbmNsdXNpdml0eVswXSA9PT0gJygnID8gdGhpcy5pc0FmdGVyKGZyb20sIHVuaXRzKSA6ICF0aGlzLmlzQmVmb3JlKGZyb20sIHVuaXRzKSkgJiZcbiAgICAgICAgICAgIChpbmNsdXNpdml0eVsxXSA9PT0gJyknID8gdGhpcy5pc0JlZm9yZSh0bywgdW5pdHMpIDogIXRoaXMuaXNBZnRlcih0bywgdW5pdHMpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1NhbWUgKGlucHV0LCB1bml0cykge1xuICAgICAgICB2YXIgbG9jYWxJbnB1dCA9IGlzTW9tZW50KGlucHV0KSA/IGlucHV0IDogY3JlYXRlTG9jYWwoaW5wdXQpLFxuICAgICAgICAgICAgaW5wdXRNcztcbiAgICAgICAgaWYgKCEodGhpcy5pc1ZhbGlkKCkgJiYgbG9jYWxJbnB1dC5pc1ZhbGlkKCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyB8fCAnbWlsbGlzZWNvbmQnKTtcbiAgICAgICAgaWYgKHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZU9mKCkgPT09IGxvY2FsSW5wdXQudmFsdWVPZigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5wdXRNcyA9IGxvY2FsSW5wdXQudmFsdWVPZigpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5zdGFydE9mKHVuaXRzKS52YWx1ZU9mKCkgPD0gaW5wdXRNcyAmJiBpbnB1dE1zIDw9IHRoaXMuY2xvbmUoKS5lbmRPZih1bml0cykudmFsdWVPZigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNTYW1lT3JBZnRlciAoaW5wdXQsIHVuaXRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzU2FtZShpbnB1dCwgdW5pdHMpIHx8IHRoaXMuaXNBZnRlcihpbnB1dCx1bml0cyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNTYW1lT3JCZWZvcmUgKGlucHV0LCB1bml0cykge1xuICAgICAgICByZXR1cm4gdGhpcy5pc1NhbWUoaW5wdXQsIHVuaXRzKSB8fCB0aGlzLmlzQmVmb3JlKGlucHV0LHVuaXRzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkaWZmIChpbnB1dCwgdW5pdHMsIGFzRmxvYXQpIHtcbiAgICAgICAgdmFyIHRoYXQsXG4gICAgICAgICAgICB6b25lRGVsdGEsXG4gICAgICAgICAgICBvdXRwdXQ7XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIE5hTjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoYXQgPSBjbG9uZVdpdGhPZmZzZXQoaW5wdXQsIHRoaXMpO1xuXG4gICAgICAgIGlmICghdGhhdC5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cblxuICAgICAgICB6b25lRGVsdGEgPSAodGhhdC51dGNPZmZzZXQoKSAtIHRoaXMudXRjT2Zmc2V0KCkpICogNmU0O1xuXG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuXG4gICAgICAgIHN3aXRjaCAodW5pdHMpIHtcbiAgICAgICAgICAgIGNhc2UgJ3llYXInOiBvdXRwdXQgPSBtb250aERpZmYodGhpcywgdGhhdCkgLyAxMjsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtb250aCc6IG91dHB1dCA9IG1vbnRoRGlmZih0aGlzLCB0aGF0KTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdxdWFydGVyJzogb3V0cHV0ID0gbW9udGhEaWZmKHRoaXMsIHRoYXQpIC8gMzsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzZWNvbmQnOiBvdXRwdXQgPSAodGhpcyAtIHRoYXQpIC8gMWUzOyBicmVhazsgLy8gMTAwMFxuICAgICAgICAgICAgY2FzZSAnbWludXRlJzogb3V0cHV0ID0gKHRoaXMgLSB0aGF0KSAvIDZlNDsgYnJlYWs7IC8vIDEwMDAgKiA2MFxuICAgICAgICAgICAgY2FzZSAnaG91cic6IG91dHB1dCA9ICh0aGlzIC0gdGhhdCkgLyAzNmU1OyBicmVhazsgLy8gMTAwMCAqIDYwICogNjBcbiAgICAgICAgICAgIGNhc2UgJ2RheSc6IG91dHB1dCA9ICh0aGlzIC0gdGhhdCAtIHpvbmVEZWx0YSkgLyA4NjRlNTsgYnJlYWs7IC8vIDEwMDAgKiA2MCAqIDYwICogMjQsIG5lZ2F0ZSBkc3RcbiAgICAgICAgICAgIGNhc2UgJ3dlZWsnOiBvdXRwdXQgPSAodGhpcyAtIHRoYXQgLSB6b25lRGVsdGEpIC8gNjA0OGU1OyBicmVhazsgLy8gMTAwMCAqIDYwICogNjAgKiAyNCAqIDcsIG5lZ2F0ZSBkc3RcbiAgICAgICAgICAgIGRlZmF1bHQ6IG91dHB1dCA9IHRoaXMgLSB0aGF0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFzRmxvYXQgPyBvdXRwdXQgOiBhYnNGbG9vcihvdXRwdXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vbnRoRGlmZiAoYSwgYikge1xuICAgICAgICAvLyBkaWZmZXJlbmNlIGluIG1vbnRoc1xuICAgICAgICB2YXIgd2hvbGVNb250aERpZmYgPSAoKGIueWVhcigpIC0gYS55ZWFyKCkpICogMTIpICsgKGIubW9udGgoKSAtIGEubW9udGgoKSksXG4gICAgICAgICAgICAvLyBiIGlzIGluIChhbmNob3IgLSAxIG1vbnRoLCBhbmNob3IgKyAxIG1vbnRoKVxuICAgICAgICAgICAgYW5jaG9yID0gYS5jbG9uZSgpLmFkZCh3aG9sZU1vbnRoRGlmZiwgJ21vbnRocycpLFxuICAgICAgICAgICAgYW5jaG9yMiwgYWRqdXN0O1xuXG4gICAgICAgIGlmIChiIC0gYW5jaG9yIDwgMCkge1xuICAgICAgICAgICAgYW5jaG9yMiA9IGEuY2xvbmUoKS5hZGQod2hvbGVNb250aERpZmYgLSAxLCAnbW9udGhzJyk7XG4gICAgICAgICAgICAvLyBsaW5lYXIgYWNyb3NzIHRoZSBtb250aFxuICAgICAgICAgICAgYWRqdXN0ID0gKGIgLSBhbmNob3IpIC8gKGFuY2hvciAtIGFuY2hvcjIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYW5jaG9yMiA9IGEuY2xvbmUoKS5hZGQod2hvbGVNb250aERpZmYgKyAxLCAnbW9udGhzJyk7XG4gICAgICAgICAgICAvLyBsaW5lYXIgYWNyb3NzIHRoZSBtb250aFxuICAgICAgICAgICAgYWRqdXN0ID0gKGIgLSBhbmNob3IpIC8gKGFuY2hvcjIgLSBhbmNob3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9jaGVjayBmb3IgbmVnYXRpdmUgemVybywgcmV0dXJuIHplcm8gaWYgbmVnYXRpdmUgemVyb1xuICAgICAgICByZXR1cm4gLSh3aG9sZU1vbnRoRGlmZiArIGFkanVzdCkgfHwgMDtcbiAgICB9XG5cbiAgICBob29rcy5kZWZhdWx0Rm9ybWF0ID0gJ1lZWVktTU0tRERUSEg6bW06c3NaJztcbiAgICBob29rcy5kZWZhdWx0Rm9ybWF0VXRjID0gJ1lZWVktTU0tRERUSEg6bW06c3NbWl0nO1xuXG4gICAgZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxvY2FsZSgnZW4nKS5mb3JtYXQoJ2RkZCBNTU0gREQgWVlZWSBISDptbTpzcyBbR01UXVpaJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9JU09TdHJpbmcoa2VlcE9mZnNldCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdXRjID0ga2VlcE9mZnNldCAhPT0gdHJ1ZTtcbiAgICAgICAgdmFyIG0gPSB1dGMgPyB0aGlzLmNsb25lKCkudXRjKCkgOiB0aGlzO1xuICAgICAgICBpZiAobS55ZWFyKCkgPCAwIHx8IG0ueWVhcigpID4gOTk5OSkge1xuICAgICAgICAgICAgcmV0dXJuIGZvcm1hdE1vbWVudChtLCB1dGMgPyAnWVlZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTW1pdJyA6ICdZWVlZWVktTU0tRERbVF1ISDptbTpzcy5TU1NaJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzRnVuY3Rpb24oRGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmcpKSB7XG4gICAgICAgICAgICAvLyBuYXRpdmUgaW1wbGVtZW50YXRpb24gaXMgfjUweCBmYXN0ZXIsIHVzZSBpdCB3aGVuIHdlIGNhblxuICAgICAgICAgICAgaWYgKHV0Yykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRvRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSh0aGlzLnZhbHVlT2YoKSArIHRoaXMudXRjT2Zmc2V0KCkgKiA2MCAqIDEwMDApLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgnWicsIGZvcm1hdE1vbWVudChtLCAnWicpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZm9ybWF0TW9tZW50KG0sIHV0YyA/ICdZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTW1pdJyA6ICdZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTWicpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiBhIGh1bWFuIHJlYWRhYmxlIHJlcHJlc2VudGF0aW9uIG9mIGEgbW9tZW50IHRoYXQgY2FuXG4gICAgICogYWxzbyBiZSBldmFsdWF0ZWQgdG8gZ2V0IGEgbmV3IG1vbWVudCB3aGljaCBpcyB0aGUgc2FtZVxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cHM6Ly9ub2RlanMub3JnL2Rpc3QvbGF0ZXN0L2RvY3MvYXBpL3V0aWwuaHRtbCN1dGlsX2N1c3RvbV9pbnNwZWN0X2Z1bmN0aW9uX29uX29iamVjdHNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbnNwZWN0ICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuICdtb21lbnQuaW52YWxpZCgvKiAnICsgdGhpcy5faSArICcgKi8pJztcbiAgICAgICAgfVxuICAgICAgICB2YXIgZnVuYyA9ICdtb21lbnQnO1xuICAgICAgICB2YXIgem9uZSA9ICcnO1xuICAgICAgICBpZiAoIXRoaXMuaXNMb2NhbCgpKSB7XG4gICAgICAgICAgICBmdW5jID0gdGhpcy51dGNPZmZzZXQoKSA9PT0gMCA/ICdtb21lbnQudXRjJyA6ICdtb21lbnQucGFyc2Vab25lJztcbiAgICAgICAgICAgIHpvbmUgPSAnWic7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHByZWZpeCA9ICdbJyArIGZ1bmMgKyAnKFwiXSc7XG4gICAgICAgIHZhciB5ZWFyID0gKDAgPD0gdGhpcy55ZWFyKCkgJiYgdGhpcy55ZWFyKCkgPD0gOTk5OSkgPyAnWVlZWScgOiAnWVlZWVlZJztcbiAgICAgICAgdmFyIGRhdGV0aW1lID0gJy1NTS1ERFtUXUhIOm1tOnNzLlNTUyc7XG4gICAgICAgIHZhciBzdWZmaXggPSB6b25lICsgJ1tcIildJztcblxuICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXQocHJlZml4ICsgeWVhciArIGRhdGV0aW1lICsgc3VmZml4KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXQgKGlucHV0U3RyaW5nKSB7XG4gICAgICAgIGlmICghaW5wdXRTdHJpbmcpIHtcbiAgICAgICAgICAgIGlucHV0U3RyaW5nID0gdGhpcy5pc1V0YygpID8gaG9va3MuZGVmYXVsdEZvcm1hdFV0YyA6IGhvb2tzLmRlZmF1bHRGb3JtYXQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG91dHB1dCA9IGZvcm1hdE1vbWVudCh0aGlzLCBpbnB1dFN0cmluZyk7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5wb3N0Zm9ybWF0KG91dHB1dCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZnJvbSAodGltZSwgd2l0aG91dFN1ZmZpeCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZhbGlkKCkgJiZcbiAgICAgICAgICAgICAgICAoKGlzTW9tZW50KHRpbWUpICYmIHRpbWUuaXNWYWxpZCgpKSB8fFxuICAgICAgICAgICAgICAgICBjcmVhdGVMb2NhbCh0aW1lKS5pc1ZhbGlkKCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlRHVyYXRpb24oe3RvOiB0aGlzLCBmcm9tOiB0aW1lfSkubG9jYWxlKHRoaXMubG9jYWxlKCkpLmh1bWFuaXplKCF3aXRob3V0U3VmZml4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5pbnZhbGlkRGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZnJvbU5vdyAod2l0aG91dFN1ZmZpeCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mcm9tKGNyZWF0ZUxvY2FsKCksIHdpdGhvdXRTdWZmaXgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvICh0aW1lLCB3aXRob3V0U3VmZml4KSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmFsaWQoKSAmJlxuICAgICAgICAgICAgICAgICgoaXNNb21lbnQodGltZSkgJiYgdGltZS5pc1ZhbGlkKCkpIHx8XG4gICAgICAgICAgICAgICAgIGNyZWF0ZUxvY2FsKHRpbWUpLmlzVmFsaWQoKSkpIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVEdXJhdGlvbih7ZnJvbTogdGhpcywgdG86IHRpbWV9KS5sb2NhbGUodGhpcy5sb2NhbGUoKSkuaHVtYW5pemUoIXdpdGhvdXRTdWZmaXgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLmludmFsaWREYXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b05vdyAod2l0aG91dFN1ZmZpeCkge1xuICAgICAgICByZXR1cm4gdGhpcy50byhjcmVhdGVMb2NhbCgpLCB3aXRob3V0U3VmZml4KTtcbiAgICB9XG5cbiAgICAvLyBJZiBwYXNzZWQgYSBsb2NhbGUga2V5LCBpdCB3aWxsIHNldCB0aGUgbG9jYWxlIGZvciB0aGlzXG4gICAgLy8gaW5zdGFuY2UuICBPdGhlcndpc2UsIGl0IHdpbGwgcmV0dXJuIHRoZSBsb2NhbGUgY29uZmlndXJhdGlvblxuICAgIC8vIHZhcmlhYmxlcyBmb3IgdGhpcyBpbnN0YW5jZS5cbiAgICBmdW5jdGlvbiBsb2NhbGUgKGtleSkge1xuICAgICAgICB2YXIgbmV3TG9jYWxlRGF0YTtcblxuICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGUuX2FiYnI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdMb2NhbGVEYXRhID0gZ2V0TG9jYWxlKGtleSk7XG4gICAgICAgICAgICBpZiAobmV3TG9jYWxlRGF0YSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9jYWxlID0gbmV3TG9jYWxlRGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxhbmcgPSBkZXByZWNhdGUoXG4gICAgICAgICdtb21lbnQoKS5sYW5nKCkgaXMgZGVwcmVjYXRlZC4gSW5zdGVhZCwgdXNlIG1vbWVudCgpLmxvY2FsZURhdGEoKSB0byBnZXQgdGhlIGxhbmd1YWdlIGNvbmZpZ3VyYXRpb24uIFVzZSBtb21lbnQoKS5sb2NhbGUoKSB0byBjaGFuZ2UgbGFuZ3VhZ2VzLicsXG4gICAgICAgIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlKGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgZnVuY3Rpb24gbG9jYWxlRGF0YSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RhcnRPZiAodW5pdHMpIHtcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgIC8vIHRoZSBmb2xsb3dpbmcgc3dpdGNoIGludGVudGlvbmFsbHkgb21pdHMgYnJlYWsga2V5d29yZHNcbiAgICAgICAgLy8gdG8gdXRpbGl6ZSBmYWxsaW5nIHRocm91Z2ggdGhlIGNhc2VzLlxuICAgICAgICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgICAgICAgICBjYXNlICd5ZWFyJzpcbiAgICAgICAgICAgICAgICB0aGlzLm1vbnRoKDApO1xuICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgIGNhc2UgJ3F1YXJ0ZXInOlxuICAgICAgICAgICAgY2FzZSAnbW9udGgnOlxuICAgICAgICAgICAgICAgIHRoaXMuZGF0ZSgxKTtcbiAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICBjYXNlICd3ZWVrJzpcbiAgICAgICAgICAgIGNhc2UgJ2lzb1dlZWsnOlxuICAgICAgICAgICAgY2FzZSAnZGF5JzpcbiAgICAgICAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICAgICAgICAgIHRoaXMuaG91cnMoMCk7XG4gICAgICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICAgICAgY2FzZSAnaG91cic6XG4gICAgICAgICAgICAgICAgdGhpcy5taW51dGVzKDApO1xuICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgIGNhc2UgJ21pbnV0ZSc6XG4gICAgICAgICAgICAgICAgdGhpcy5zZWNvbmRzKDApO1xuICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgIGNhc2UgJ3NlY29uZCc6XG4gICAgICAgICAgICAgICAgdGhpcy5taWxsaXNlY29uZHMoMCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB3ZWVrcyBhcmUgYSBzcGVjaWFsIGNhc2VcbiAgICAgICAgaWYgKHVuaXRzID09PSAnd2VlaycpIHtcbiAgICAgICAgICAgIHRoaXMud2Vla2RheSgwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodW5pdHMgPT09ICdpc29XZWVrJykge1xuICAgICAgICAgICAgdGhpcy5pc29XZWVrZGF5KDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcXVhcnRlcnMgYXJlIGFsc28gc3BlY2lhbFxuICAgICAgICBpZiAodW5pdHMgPT09ICdxdWFydGVyJykge1xuICAgICAgICAgICAgdGhpcy5tb250aChNYXRoLmZsb29yKHRoaXMubW9udGgoKSAvIDMpICogMyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbmRPZiAodW5pdHMpIHtcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgIGlmICh1bml0cyA9PT0gdW5kZWZpbmVkIHx8IHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vICdkYXRlJyBpcyBhbiBhbGlhcyBmb3IgJ2RheScsIHNvIGl0IHNob3VsZCBiZSBjb25zaWRlcmVkIGFzIHN1Y2guXG4gICAgICAgIGlmICh1bml0cyA9PT0gJ2RhdGUnKSB7XG4gICAgICAgICAgICB1bml0cyA9ICdkYXknO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnRPZih1bml0cykuYWRkKDEsICh1bml0cyA9PT0gJ2lzb1dlZWsnID8gJ3dlZWsnIDogdW5pdHMpKS5zdWJ0cmFjdCgxLCAnbXMnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWx1ZU9mICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2QudmFsdWVPZigpIC0gKCh0aGlzLl9vZmZzZXQgfHwgMCkgKiA2MDAwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdW5peCAoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMudmFsdWVPZigpIC8gMTAwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9EYXRlICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHRoaXMudmFsdWVPZigpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0FycmF5ICgpIHtcbiAgICAgICAgdmFyIG0gPSB0aGlzO1xuICAgICAgICByZXR1cm4gW20ueWVhcigpLCBtLm1vbnRoKCksIG0uZGF0ZSgpLCBtLmhvdXIoKSwgbS5taW51dGUoKSwgbS5zZWNvbmQoKSwgbS5taWxsaXNlY29uZCgpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b09iamVjdCAoKSB7XG4gICAgICAgIHZhciBtID0gdGhpcztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHllYXJzOiBtLnllYXIoKSxcbiAgICAgICAgICAgIG1vbnRoczogbS5tb250aCgpLFxuICAgICAgICAgICAgZGF0ZTogbS5kYXRlKCksXG4gICAgICAgICAgICBob3VyczogbS5ob3VycygpLFxuICAgICAgICAgICAgbWludXRlczogbS5taW51dGVzKCksXG4gICAgICAgICAgICBzZWNvbmRzOiBtLnNlY29uZHMoKSxcbiAgICAgICAgICAgIG1pbGxpc2Vjb25kczogbS5taWxsaXNlY29uZHMoKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvSlNPTiAoKSB7XG4gICAgICAgIC8vIG5ldyBEYXRlKE5hTikudG9KU09OKCkgPT09IG51bGxcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCgpID8gdGhpcy50b0lTT1N0cmluZygpIDogbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1ZhbGlkJDIgKCkge1xuICAgICAgICByZXR1cm4gaXNWYWxpZCh0aGlzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzaW5nRmxhZ3MgKCkge1xuICAgICAgICByZXR1cm4gZXh0ZW5kKHt9LCBnZXRQYXJzaW5nRmxhZ3ModGhpcykpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGludmFsaWRBdCAoKSB7XG4gICAgICAgIHJldHVybiBnZXRQYXJzaW5nRmxhZ3ModGhpcykub3ZlcmZsb3c7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRpb25EYXRhKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaW5wdXQ6IHRoaXMuX2ksXG4gICAgICAgICAgICBmb3JtYXQ6IHRoaXMuX2YsXG4gICAgICAgICAgICBsb2NhbGU6IHRoaXMuX2xvY2FsZSxcbiAgICAgICAgICAgIGlzVVRDOiB0aGlzLl9pc1VUQyxcbiAgICAgICAgICAgIHN0cmljdDogdGhpcy5fc3RyaWN0XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydnZycsIDJdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLndlZWtZZWFyKCkgJSAxMDA7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ0dHJywgMl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNvV2Vla1llYXIoKSAlIDEwMDtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4gKHRva2VuLCBnZXR0ZXIpIHtcbiAgICAgICAgYWRkRm9ybWF0VG9rZW4oMCwgW3Rva2VuLCB0b2tlbi5sZW5ndGhdLCAwLCBnZXR0ZXIpO1xuICAgIH1cblxuICAgIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4oJ2dnZ2cnLCAgICAgJ3dlZWtZZWFyJyk7XG4gICAgYWRkV2Vla1llYXJGb3JtYXRUb2tlbignZ2dnZ2cnLCAgICAnd2Vla1llYXInKTtcbiAgICBhZGRXZWVrWWVhckZvcm1hdFRva2VuKCdHR0dHJywgICdpc29XZWVrWWVhcicpO1xuICAgIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4oJ0dHR0dHJywgJ2lzb1dlZWtZZWFyJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3dlZWtZZWFyJywgJ2dnJyk7XG4gICAgYWRkVW5pdEFsaWFzKCdpc29XZWVrWWVhcicsICdHRycpO1xuXG4gICAgLy8gUFJJT1JJVFlcblxuICAgIGFkZFVuaXRQcmlvcml0eSgnd2Vla1llYXInLCAxKTtcbiAgICBhZGRVbml0UHJpb3JpdHkoJ2lzb1dlZWtZZWFyJywgMSk7XG5cblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ0cnLCAgICAgIG1hdGNoU2lnbmVkKTtcbiAgICBhZGRSZWdleFRva2VuKCdnJywgICAgICBtYXRjaFNpZ25lZCk7XG4gICAgYWRkUmVnZXhUb2tlbignR0cnLCAgICAgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2dnJywgICAgIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdHR0dHJywgICBtYXRjaDF0bzQsIG1hdGNoNCk7XG4gICAgYWRkUmVnZXhUb2tlbignZ2dnZycsICAgbWF0Y2gxdG80LCBtYXRjaDQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0dHR0dHJywgIG1hdGNoMXRvNiwgbWF0Y2g2KTtcbiAgICBhZGRSZWdleFRva2VuKCdnZ2dnZycsICBtYXRjaDF0bzYsIG1hdGNoNik7XG5cbiAgICBhZGRXZWVrUGFyc2VUb2tlbihbJ2dnZ2cnLCAnZ2dnZ2cnLCAnR0dHRycsICdHR0dHRyddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgd2Vla1t0b2tlbi5zdWJzdHIoMCwgMildID0gdG9JbnQoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgYWRkV2Vla1BhcnNlVG9rZW4oWydnZycsICdHRyddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgd2Vla1t0b2tlbl0gPSBob29rcy5wYXJzZVR3b0RpZ2l0WWVhcihpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXRXZWVrWWVhciAoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGdldFNldFdlZWtZZWFySGVscGVyLmNhbGwodGhpcyxcbiAgICAgICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgICAgICB0aGlzLndlZWsoKSxcbiAgICAgICAgICAgICAgICB0aGlzLndlZWtkYXkoKSxcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2FsZURhdGEoKS5fd2Vlay5kb3csXG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWsuZG95KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXRJU09XZWVrWWVhciAoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGdldFNldFdlZWtZZWFySGVscGVyLmNhbGwodGhpcyxcbiAgICAgICAgICAgICAgICBpbnB1dCwgdGhpcy5pc29XZWVrKCksIHRoaXMuaXNvV2Vla2RheSgpLCAxLCA0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRJU09XZWVrc0luWWVhciAoKSB7XG4gICAgICAgIHJldHVybiB3ZWVrc0luWWVhcih0aGlzLnllYXIoKSwgMSwgNCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0V2Vla3NJblllYXIgKCkge1xuICAgICAgICB2YXIgd2Vla0luZm8gPSB0aGlzLmxvY2FsZURhdGEoKS5fd2VlaztcbiAgICAgICAgcmV0dXJuIHdlZWtzSW5ZZWFyKHRoaXMueWVhcigpLCB3ZWVrSW5mby5kb3csIHdlZWtJbmZvLmRveSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0V2Vla1llYXJIZWxwZXIoaW5wdXQsIHdlZWssIHdlZWtkYXksIGRvdywgZG95KSB7XG4gICAgICAgIHZhciB3ZWVrc1RhcmdldDtcbiAgICAgICAgaWYgKGlucHV0ID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB3ZWVrT2ZZZWFyKHRoaXMsIGRvdywgZG95KS55ZWFyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2Vla3NUYXJnZXQgPSB3ZWVrc0luWWVhcihpbnB1dCwgZG93LCBkb3kpO1xuICAgICAgICAgICAgaWYgKHdlZWsgPiB3ZWVrc1RhcmdldCkge1xuICAgICAgICAgICAgICAgIHdlZWsgPSB3ZWVrc1RhcmdldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzZXRXZWVrQWxsLmNhbGwodGhpcywgaW5wdXQsIHdlZWssIHdlZWtkYXksIGRvdywgZG95KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFdlZWtBbGwod2Vla1llYXIsIHdlZWssIHdlZWtkYXksIGRvdywgZG95KSB7XG4gICAgICAgIHZhciBkYXlPZlllYXJEYXRhID0gZGF5T2ZZZWFyRnJvbVdlZWtzKHdlZWtZZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSksXG4gICAgICAgICAgICBkYXRlID0gY3JlYXRlVVRDRGF0ZShkYXlPZlllYXJEYXRhLnllYXIsIDAsIGRheU9mWWVhckRhdGEuZGF5T2ZZZWFyKTtcblxuICAgICAgICB0aGlzLnllYXIoZGF0ZS5nZXRVVENGdWxsWWVhcigpKTtcbiAgICAgICAgdGhpcy5tb250aChkYXRlLmdldFVUQ01vbnRoKCkpO1xuICAgICAgICB0aGlzLmRhdGUoZGF0ZS5nZXRVVENEYXRlKCkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBhZGRGb3JtYXRUb2tlbignUScsIDAsICdRbycsICdxdWFydGVyJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3F1YXJ0ZXInLCAnUScpO1xuXG4gICAgLy8gUFJJT1JJVFlcblxuICAgIGFkZFVuaXRQcmlvcml0eSgncXVhcnRlcicsIDcpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignUScsIG1hdGNoMSk7XG4gICAgYWRkUGFyc2VUb2tlbignUScsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbTU9OVEhdID0gKHRvSW50KGlucHV0KSAtIDEpICogMztcbiAgICB9KTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIGdldFNldFF1YXJ0ZXIgKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gTWF0aC5jZWlsKCh0aGlzLm1vbnRoKCkgKyAxKSAvIDMpIDogdGhpcy5tb250aCgoaW5wdXQgLSAxKSAqIDMgKyB0aGlzLm1vbnRoKCkgJSAzKTtcbiAgICB9XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBhZGRGb3JtYXRUb2tlbignRCcsIFsnREQnLCAyXSwgJ0RvJywgJ2RhdGUnKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnZGF0ZScsICdEJyk7XG5cbiAgICAvLyBQUklPUklUWVxuICAgIGFkZFVuaXRQcmlvcml0eSgnZGF0ZScsIDkpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignRCcsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0REJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0RvJywgZnVuY3Rpb24gKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICAgICAgLy8gVE9ETzogUmVtb3ZlIFwib3JkaW5hbFBhcnNlXCIgZmFsbGJhY2sgaW4gbmV4dCBtYWpvciByZWxlYXNlLlxuICAgICAgICByZXR1cm4gaXNTdHJpY3QgP1xuICAgICAgICAgIChsb2NhbGUuX2RheU9mTW9udGhPcmRpbmFsUGFyc2UgfHwgbG9jYWxlLl9vcmRpbmFsUGFyc2UpIDpcbiAgICAgICAgICBsb2NhbGUuX2RheU9mTW9udGhPcmRpbmFsUGFyc2VMZW5pZW50O1xuICAgIH0pO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ0QnLCAnREQnXSwgREFURSk7XG4gICAgYWRkUGFyc2VUb2tlbignRG8nLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W0RBVEVdID0gdG9JbnQoaW5wdXQubWF0Y2gobWF0Y2gxdG8yKVswXSk7XG4gICAgfSk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICB2YXIgZ2V0U2V0RGF5T2ZNb250aCA9IG1ha2VHZXRTZXQoJ0RhdGUnLCB0cnVlKTtcblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKCdEREQnLCBbJ0REREQnLCAzXSwgJ0RERG8nLCAnZGF5T2ZZZWFyJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ2RheU9mWWVhcicsICdEREQnKTtcblxuICAgIC8vIFBSSU9SSVRZXG4gICAgYWRkVW5pdFByaW9yaXR5KCdkYXlPZlllYXInLCA0KTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ0RERCcsICBtYXRjaDF0bzMpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0REREQnLCBtYXRjaDMpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydEREQnLCAnRERERCddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl9kYXlPZlllYXIgPSB0b0ludChpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXREYXlPZlllYXIgKGlucHV0KSB7XG4gICAgICAgIHZhciBkYXlPZlllYXIgPSBNYXRoLnJvdW5kKCh0aGlzLmNsb25lKCkuc3RhcnRPZignZGF5JykgLSB0aGlzLmNsb25lKCkuc3RhcnRPZigneWVhcicpKSAvIDg2NGU1KSArIDE7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gZGF5T2ZZZWFyIDogdGhpcy5hZGQoKGlucHV0IC0gZGF5T2ZZZWFyKSwgJ2QnKTtcbiAgICB9XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBhZGRGb3JtYXRUb2tlbignbScsIFsnbW0nLCAyXSwgMCwgJ21pbnV0ZScpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdtaW51dGUnLCAnbScpO1xuXG4gICAgLy8gUFJJT1JJVFlcblxuICAgIGFkZFVuaXRQcmlvcml0eSgnbWludXRlJywgMTQpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignbScsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ21tJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydtJywgJ21tJ10sIE1JTlVURSk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICB2YXIgZ2V0U2V0TWludXRlID0gbWFrZUdldFNldCgnTWludXRlcycsIGZhbHNlKTtcblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKCdzJywgWydzcycsIDJdLCAwLCAnc2Vjb25kJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3NlY29uZCcsICdzJyk7XG5cbiAgICAvLyBQUklPUklUWVxuXG4gICAgYWRkVW5pdFByaW9yaXR5KCdzZWNvbmQnLCAxNSk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdzJywgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignc3MnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUGFyc2VUb2tlbihbJ3MnLCAnc3MnXSwgU0VDT05EKTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIHZhciBnZXRTZXRTZWNvbmQgPSBtYWtlR2V0U2V0KCdTZWNvbmRzJywgZmFsc2UpO1xuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ1MnLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB+fih0aGlzLm1pbGxpc2Vjb25kKCkgLyAxMDApO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTUycsIDJdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB+fih0aGlzLm1pbGxpc2Vjb25kKCkgLyAxMCk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1NTUycsIDNdLCAwLCAnbWlsbGlzZWNvbmQnKTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1NTU1MnLCA0XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTA7XG4gICAgfSk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTUycsIDVdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbGxpc2Vjb25kKCkgKiAxMDA7XG4gICAgfSk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTU1MnLCA2XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTAwMDtcbiAgICB9KTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1NTU1NTU1MnLCA3XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTAwMDA7XG4gICAgfSk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTU1NTUycsIDhdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbGxpc2Vjb25kKCkgKiAxMDAwMDA7XG4gICAgfSk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTU1NTU1MnLCA5XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTAwMDAwMDtcbiAgICB9KTtcblxuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdtaWxsaXNlY29uZCcsICdtcycpO1xuXG4gICAgLy8gUFJJT1JJVFlcblxuICAgIGFkZFVuaXRQcmlvcml0eSgnbWlsbGlzZWNvbmQnLCAxNik7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdTJywgICAgbWF0Y2gxdG8zLCBtYXRjaDEpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1NTJywgICBtYXRjaDF0bzMsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignU1NTJywgIG1hdGNoMXRvMywgbWF0Y2gzKTtcblxuICAgIHZhciB0b2tlbjtcbiAgICBmb3IgKHRva2VuID0gJ1NTU1MnOyB0b2tlbi5sZW5ndGggPD0gOTsgdG9rZW4gKz0gJ1MnKSB7XG4gICAgICAgIGFkZFJlZ2V4VG9rZW4odG9rZW4sIG1hdGNoVW5zaWduZWQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlTXMoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W01JTExJU0VDT05EXSA9IHRvSW50KCgnMC4nICsgaW5wdXQpICogMTAwMCk7XG4gICAgfVxuXG4gICAgZm9yICh0b2tlbiA9ICdTJzsgdG9rZW4ubGVuZ3RoIDw9IDk7IHRva2VuICs9ICdTJykge1xuICAgICAgICBhZGRQYXJzZVRva2VuKHRva2VuLCBwYXJzZU1zKTtcbiAgICB9XG4gICAgLy8gTU9NRU5UU1xuXG4gICAgdmFyIGdldFNldE1pbGxpc2Vjb25kID0gbWFrZUdldFNldCgnTWlsbGlzZWNvbmRzJywgZmFsc2UpO1xuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ3onLCAgMCwgMCwgJ3pvbmVBYmJyJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ3p6JywgMCwgMCwgJ3pvbmVOYW1lJyk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRab25lQWJiciAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc1VUQyA/ICdVVEMnIDogJyc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Wm9uZU5hbWUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgPyAnQ29vcmRpbmF0ZWQgVW5pdmVyc2FsIFRpbWUnIDogJyc7XG4gICAgfVxuXG4gICAgdmFyIHByb3RvID0gTW9tZW50LnByb3RvdHlwZTtcblxuICAgIHByb3RvLmFkZCAgICAgICAgICAgICAgID0gYWRkO1xuICAgIHByb3RvLmNhbGVuZGFyICAgICAgICAgID0gY2FsZW5kYXIkMTtcbiAgICBwcm90by5jbG9uZSAgICAgICAgICAgICA9IGNsb25lO1xuICAgIHByb3RvLmRpZmYgICAgICAgICAgICAgID0gZGlmZjtcbiAgICBwcm90by5lbmRPZiAgICAgICAgICAgICA9IGVuZE9mO1xuICAgIHByb3RvLmZvcm1hdCAgICAgICAgICAgID0gZm9ybWF0O1xuICAgIHByb3RvLmZyb20gICAgICAgICAgICAgID0gZnJvbTtcbiAgICBwcm90by5mcm9tTm93ICAgICAgICAgICA9IGZyb21Ob3c7XG4gICAgcHJvdG8udG8gICAgICAgICAgICAgICAgPSB0bztcbiAgICBwcm90by50b05vdyAgICAgICAgICAgICA9IHRvTm93O1xuICAgIHByb3RvLmdldCAgICAgICAgICAgICAgID0gc3RyaW5nR2V0O1xuICAgIHByb3RvLmludmFsaWRBdCAgICAgICAgID0gaW52YWxpZEF0O1xuICAgIHByb3RvLmlzQWZ0ZXIgICAgICAgICAgID0gaXNBZnRlcjtcbiAgICBwcm90by5pc0JlZm9yZSAgICAgICAgICA9IGlzQmVmb3JlO1xuICAgIHByb3RvLmlzQmV0d2VlbiAgICAgICAgID0gaXNCZXR3ZWVuO1xuICAgIHByb3RvLmlzU2FtZSAgICAgICAgICAgID0gaXNTYW1lO1xuICAgIHByb3RvLmlzU2FtZU9yQWZ0ZXIgICAgID0gaXNTYW1lT3JBZnRlcjtcbiAgICBwcm90by5pc1NhbWVPckJlZm9yZSAgICA9IGlzU2FtZU9yQmVmb3JlO1xuICAgIHByb3RvLmlzVmFsaWQgICAgICAgICAgID0gaXNWYWxpZCQyO1xuICAgIHByb3RvLmxhbmcgICAgICAgICAgICAgID0gbGFuZztcbiAgICBwcm90by5sb2NhbGUgICAgICAgICAgICA9IGxvY2FsZTtcbiAgICBwcm90by5sb2NhbGVEYXRhICAgICAgICA9IGxvY2FsZURhdGE7XG4gICAgcHJvdG8ubWF4ICAgICAgICAgICAgICAgPSBwcm90b3R5cGVNYXg7XG4gICAgcHJvdG8ubWluICAgICAgICAgICAgICAgPSBwcm90b3R5cGVNaW47XG4gICAgcHJvdG8ucGFyc2luZ0ZsYWdzICAgICAgPSBwYXJzaW5nRmxhZ3M7XG4gICAgcHJvdG8uc2V0ICAgICAgICAgICAgICAgPSBzdHJpbmdTZXQ7XG4gICAgcHJvdG8uc3RhcnRPZiAgICAgICAgICAgPSBzdGFydE9mO1xuICAgIHByb3RvLnN1YnRyYWN0ICAgICAgICAgID0gc3VidHJhY3Q7XG4gICAgcHJvdG8udG9BcnJheSAgICAgICAgICAgPSB0b0FycmF5O1xuICAgIHByb3RvLnRvT2JqZWN0ICAgICAgICAgID0gdG9PYmplY3Q7XG4gICAgcHJvdG8udG9EYXRlICAgICAgICAgICAgPSB0b0RhdGU7XG4gICAgcHJvdG8udG9JU09TdHJpbmcgICAgICAgPSB0b0lTT1N0cmluZztcbiAgICBwcm90by5pbnNwZWN0ICAgICAgICAgICA9IGluc3BlY3Q7XG4gICAgcHJvdG8udG9KU09OICAgICAgICAgICAgPSB0b0pTT047XG4gICAgcHJvdG8udG9TdHJpbmcgICAgICAgICAgPSB0b1N0cmluZztcbiAgICBwcm90by51bml4ICAgICAgICAgICAgICA9IHVuaXg7XG4gICAgcHJvdG8udmFsdWVPZiAgICAgICAgICAgPSB2YWx1ZU9mO1xuICAgIHByb3RvLmNyZWF0aW9uRGF0YSAgICAgID0gY3JlYXRpb25EYXRhO1xuICAgIHByb3RvLnllYXIgICAgICAgPSBnZXRTZXRZZWFyO1xuICAgIHByb3RvLmlzTGVhcFllYXIgPSBnZXRJc0xlYXBZZWFyO1xuICAgIHByb3RvLndlZWtZZWFyICAgID0gZ2V0U2V0V2Vla1llYXI7XG4gICAgcHJvdG8uaXNvV2Vla1llYXIgPSBnZXRTZXRJU09XZWVrWWVhcjtcbiAgICBwcm90by5xdWFydGVyID0gcHJvdG8ucXVhcnRlcnMgPSBnZXRTZXRRdWFydGVyO1xuICAgIHByb3RvLm1vbnRoICAgICAgID0gZ2V0U2V0TW9udGg7XG4gICAgcHJvdG8uZGF5c0luTW9udGggPSBnZXREYXlzSW5Nb250aDtcbiAgICBwcm90by53ZWVrICAgICAgICAgICA9IHByb3RvLndlZWtzICAgICAgICA9IGdldFNldFdlZWs7XG4gICAgcHJvdG8uaXNvV2VlayAgICAgICAgPSBwcm90by5pc29XZWVrcyAgICAgPSBnZXRTZXRJU09XZWVrO1xuICAgIHByb3RvLndlZWtzSW5ZZWFyICAgID0gZ2V0V2Vla3NJblllYXI7XG4gICAgcHJvdG8uaXNvV2Vla3NJblllYXIgPSBnZXRJU09XZWVrc0luWWVhcjtcbiAgICBwcm90by5kYXRlICAgICAgID0gZ2V0U2V0RGF5T2ZNb250aDtcbiAgICBwcm90by5kYXkgICAgICAgID0gcHJvdG8uZGF5cyAgICAgICAgICAgICA9IGdldFNldERheU9mV2VlaztcbiAgICBwcm90by53ZWVrZGF5ICAgID0gZ2V0U2V0TG9jYWxlRGF5T2ZXZWVrO1xuICAgIHByb3RvLmlzb1dlZWtkYXkgPSBnZXRTZXRJU09EYXlPZldlZWs7XG4gICAgcHJvdG8uZGF5T2ZZZWFyICA9IGdldFNldERheU9mWWVhcjtcbiAgICBwcm90by5ob3VyID0gcHJvdG8uaG91cnMgPSBnZXRTZXRIb3VyO1xuICAgIHByb3RvLm1pbnV0ZSA9IHByb3RvLm1pbnV0ZXMgPSBnZXRTZXRNaW51dGU7XG4gICAgcHJvdG8uc2Vjb25kID0gcHJvdG8uc2Vjb25kcyA9IGdldFNldFNlY29uZDtcbiAgICBwcm90by5taWxsaXNlY29uZCA9IHByb3RvLm1pbGxpc2Vjb25kcyA9IGdldFNldE1pbGxpc2Vjb25kO1xuICAgIHByb3RvLnV0Y09mZnNldCAgICAgICAgICAgID0gZ2V0U2V0T2Zmc2V0O1xuICAgIHByb3RvLnV0YyAgICAgICAgICAgICAgICAgID0gc2V0T2Zmc2V0VG9VVEM7XG4gICAgcHJvdG8ubG9jYWwgICAgICAgICAgICAgICAgPSBzZXRPZmZzZXRUb0xvY2FsO1xuICAgIHByb3RvLnBhcnNlWm9uZSAgICAgICAgICAgID0gc2V0T2Zmc2V0VG9QYXJzZWRPZmZzZXQ7XG4gICAgcHJvdG8uaGFzQWxpZ25lZEhvdXJPZmZzZXQgPSBoYXNBbGlnbmVkSG91ck9mZnNldDtcbiAgICBwcm90by5pc0RTVCAgICAgICAgICAgICAgICA9IGlzRGF5bGlnaHRTYXZpbmdUaW1lO1xuICAgIHByb3RvLmlzTG9jYWwgICAgICAgICAgICAgID0gaXNMb2NhbDtcbiAgICBwcm90by5pc1V0Y09mZnNldCAgICAgICAgICA9IGlzVXRjT2Zmc2V0O1xuICAgIHByb3RvLmlzVXRjICAgICAgICAgICAgICAgID0gaXNVdGM7XG4gICAgcHJvdG8uaXNVVEMgICAgICAgICAgICAgICAgPSBpc1V0YztcbiAgICBwcm90by56b25lQWJiciA9IGdldFpvbmVBYmJyO1xuICAgIHByb3RvLnpvbmVOYW1lID0gZ2V0Wm9uZU5hbWU7XG4gICAgcHJvdG8uZGF0ZXMgID0gZGVwcmVjYXRlKCdkYXRlcyBhY2Nlc3NvciBpcyBkZXByZWNhdGVkLiBVc2UgZGF0ZSBpbnN0ZWFkLicsIGdldFNldERheU9mTW9udGgpO1xuICAgIHByb3RvLm1vbnRocyA9IGRlcHJlY2F0ZSgnbW9udGhzIGFjY2Vzc29yIGlzIGRlcHJlY2F0ZWQuIFVzZSBtb250aCBpbnN0ZWFkJywgZ2V0U2V0TW9udGgpO1xuICAgIHByb3RvLnllYXJzICA9IGRlcHJlY2F0ZSgneWVhcnMgYWNjZXNzb3IgaXMgZGVwcmVjYXRlZC4gVXNlIHllYXIgaW5zdGVhZCcsIGdldFNldFllYXIpO1xuICAgIHByb3RvLnpvbmUgICA9IGRlcHJlY2F0ZSgnbW9tZW50KCkuem9uZSBpcyBkZXByZWNhdGVkLCB1c2UgbW9tZW50KCkudXRjT2Zmc2V0IGluc3RlYWQuIGh0dHA6Ly9tb21lbnRqcy5jb20vZ3VpZGVzLyMvd2FybmluZ3Mvem9uZS8nLCBnZXRTZXRab25lKTtcbiAgICBwcm90by5pc0RTVFNoaWZ0ZWQgPSBkZXByZWNhdGUoJ2lzRFNUU2hpZnRlZCBpcyBkZXByZWNhdGVkLiBTZWUgaHR0cDovL21vbWVudGpzLmNvbS9ndWlkZXMvIy93YXJuaW5ncy9kc3Qtc2hpZnRlZC8gZm9yIG1vcmUgaW5mb3JtYXRpb24nLCBpc0RheWxpZ2h0U2F2aW5nVGltZVNoaWZ0ZWQpO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlVW5peCAoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUxvY2FsKGlucHV0ICogMTAwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlSW5ab25lICgpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUxvY2FsLmFwcGx5KG51bGwsIGFyZ3VtZW50cykucGFyc2Vab25lKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJlUGFyc2VQb3N0Rm9ybWF0IChzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZztcbiAgICB9XG5cbiAgICB2YXIgcHJvdG8kMSA9IExvY2FsZS5wcm90b3R5cGU7XG5cbiAgICBwcm90byQxLmNhbGVuZGFyICAgICAgICA9IGNhbGVuZGFyO1xuICAgIHByb3RvJDEubG9uZ0RhdGVGb3JtYXQgID0gbG9uZ0RhdGVGb3JtYXQ7XG4gICAgcHJvdG8kMS5pbnZhbGlkRGF0ZSAgICAgPSBpbnZhbGlkRGF0ZTtcbiAgICBwcm90byQxLm9yZGluYWwgICAgICAgICA9IG9yZGluYWw7XG4gICAgcHJvdG8kMS5wcmVwYXJzZSAgICAgICAgPSBwcmVQYXJzZVBvc3RGb3JtYXQ7XG4gICAgcHJvdG8kMS5wb3N0Zm9ybWF0ICAgICAgPSBwcmVQYXJzZVBvc3RGb3JtYXQ7XG4gICAgcHJvdG8kMS5yZWxhdGl2ZVRpbWUgICAgPSByZWxhdGl2ZVRpbWU7XG4gICAgcHJvdG8kMS5wYXN0RnV0dXJlICAgICAgPSBwYXN0RnV0dXJlO1xuICAgIHByb3RvJDEuc2V0ICAgICAgICAgICAgID0gc2V0O1xuXG4gICAgcHJvdG8kMS5tb250aHMgICAgICAgICAgICA9ICAgICAgICBsb2NhbGVNb250aHM7XG4gICAgcHJvdG8kMS5tb250aHNTaG9ydCAgICAgICA9ICAgICAgICBsb2NhbGVNb250aHNTaG9ydDtcbiAgICBwcm90byQxLm1vbnRoc1BhcnNlICAgICAgID0gICAgICAgIGxvY2FsZU1vbnRoc1BhcnNlO1xuICAgIHByb3RvJDEubW9udGhzUmVnZXggICAgICAgPSBtb250aHNSZWdleDtcbiAgICBwcm90byQxLm1vbnRoc1Nob3J0UmVnZXggID0gbW9udGhzU2hvcnRSZWdleDtcbiAgICBwcm90byQxLndlZWsgPSBsb2NhbGVXZWVrO1xuICAgIHByb3RvJDEuZmlyc3REYXlPZlllYXIgPSBsb2NhbGVGaXJzdERheU9mWWVhcjtcbiAgICBwcm90byQxLmZpcnN0RGF5T2ZXZWVrID0gbG9jYWxlRmlyc3REYXlPZldlZWs7XG5cbiAgICBwcm90byQxLndlZWtkYXlzICAgICAgID0gICAgICAgIGxvY2FsZVdlZWtkYXlzO1xuICAgIHByb3RvJDEud2Vla2RheXNNaW4gICAgPSAgICAgICAgbG9jYWxlV2Vla2RheXNNaW47XG4gICAgcHJvdG8kMS53ZWVrZGF5c1Nob3J0ICA9ICAgICAgICBsb2NhbGVXZWVrZGF5c1Nob3J0O1xuICAgIHByb3RvJDEud2Vla2RheXNQYXJzZSAgPSAgICAgICAgbG9jYWxlV2Vla2RheXNQYXJzZTtcblxuICAgIHByb3RvJDEud2Vla2RheXNSZWdleCAgICAgICA9ICAgICAgICB3ZWVrZGF5c1JlZ2V4O1xuICAgIHByb3RvJDEud2Vla2RheXNTaG9ydFJlZ2V4ICA9ICAgICAgICB3ZWVrZGF5c1Nob3J0UmVnZXg7XG4gICAgcHJvdG8kMS53ZWVrZGF5c01pblJlZ2V4ICAgID0gICAgICAgIHdlZWtkYXlzTWluUmVnZXg7XG5cbiAgICBwcm90byQxLmlzUE0gPSBsb2NhbGVJc1BNO1xuICAgIHByb3RvJDEubWVyaWRpZW0gPSBsb2NhbGVNZXJpZGllbTtcblxuICAgIGZ1bmN0aW9uIGdldCQxIChmb3JtYXQsIGluZGV4LCBmaWVsZCwgc2V0dGVyKSB7XG4gICAgICAgIHZhciBsb2NhbGUgPSBnZXRMb2NhbGUoKTtcbiAgICAgICAgdmFyIHV0YyA9IGNyZWF0ZVVUQygpLnNldChzZXR0ZXIsIGluZGV4KTtcbiAgICAgICAgcmV0dXJuIGxvY2FsZVtmaWVsZF0odXRjLCBmb3JtYXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RNb250aHNJbXBsIChmb3JtYXQsIGluZGV4LCBmaWVsZCkge1xuICAgICAgICBpZiAoaXNOdW1iZXIoZm9ybWF0KSkge1xuICAgICAgICAgICAgaW5kZXggPSBmb3JtYXQ7XG4gICAgICAgICAgICBmb3JtYXQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBmb3JtYXQgPSBmb3JtYXQgfHwgJyc7XG5cbiAgICAgICAgaWYgKGluZGV4ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXQkMShmb3JtYXQsIGluZGV4LCBmaWVsZCwgJ21vbnRoJyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIG91dCA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTI7IGkrKykge1xuICAgICAgICAgICAgb3V0W2ldID0gZ2V0JDEoZm9ybWF0LCBpLCBmaWVsZCwgJ21vbnRoJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvLyAoKVxuICAgIC8vICg1KVxuICAgIC8vIChmbXQsIDUpXG4gICAgLy8gKGZtdClcbiAgICAvLyAodHJ1ZSlcbiAgICAvLyAodHJ1ZSwgNSlcbiAgICAvLyAodHJ1ZSwgZm10LCA1KVxuICAgIC8vICh0cnVlLCBmbXQpXG4gICAgZnVuY3Rpb24gbGlzdFdlZWtkYXlzSW1wbCAobG9jYWxlU29ydGVkLCBmb3JtYXQsIGluZGV4LCBmaWVsZCkge1xuICAgICAgICBpZiAodHlwZW9mIGxvY2FsZVNvcnRlZCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICBpZiAoaXNOdW1iZXIoZm9ybWF0KSkge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gZm9ybWF0O1xuICAgICAgICAgICAgICAgIGZvcm1hdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0IHx8ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9ybWF0ID0gbG9jYWxlU29ydGVkO1xuICAgICAgICAgICAgaW5kZXggPSBmb3JtYXQ7XG4gICAgICAgICAgICBsb2NhbGVTb3J0ZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKGlzTnVtYmVyKGZvcm1hdCkpIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGZvcm1hdDtcbiAgICAgICAgICAgICAgICBmb3JtYXQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdCB8fCAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsb2NhbGUgPSBnZXRMb2NhbGUoKSxcbiAgICAgICAgICAgIHNoaWZ0ID0gbG9jYWxlU29ydGVkID8gbG9jYWxlLl93ZWVrLmRvdyA6IDA7XG5cbiAgICAgICAgaWYgKGluZGV4ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXQkMShmb3JtYXQsIChpbmRleCArIHNoaWZ0KSAlIDcsIGZpZWxkLCAnZGF5Jyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIG91dCA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICBvdXRbaV0gPSBnZXQkMShmb3JtYXQsIChpICsgc2hpZnQpICUgNywgZmllbGQsICdkYXknKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RNb250aHMgKGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3RNb250aHNJbXBsKGZvcm1hdCwgaW5kZXgsICdtb250aHMnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0TW9udGhzU2hvcnQgKGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3RNb250aHNJbXBsKGZvcm1hdCwgaW5kZXgsICdtb250aHNTaG9ydCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RXZWVrZGF5cyAobG9jYWxlU29ydGVkLCBmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBsaXN0V2Vla2RheXNJbXBsKGxvY2FsZVNvcnRlZCwgZm9ybWF0LCBpbmRleCwgJ3dlZWtkYXlzJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdFdlZWtkYXlzU2hvcnQgKGxvY2FsZVNvcnRlZCwgZm9ybWF0LCBpbmRleCkge1xuICAgICAgICByZXR1cm4gbGlzdFdlZWtkYXlzSW1wbChsb2NhbGVTb3J0ZWQsIGZvcm1hdCwgaW5kZXgsICd3ZWVrZGF5c1Nob3J0Jyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdFdlZWtkYXlzTWluIChsb2NhbGVTb3J0ZWQsIGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3RXZWVrZGF5c0ltcGwobG9jYWxlU29ydGVkLCBmb3JtYXQsIGluZGV4LCAnd2Vla2RheXNNaW4nKTtcbiAgICB9XG5cbiAgICBnZXRTZXRHbG9iYWxMb2NhbGUoJ2VuJywge1xuICAgICAgICBkYXlPZk1vbnRoT3JkaW5hbFBhcnNlOiAvXFxkezEsMn0odGh8c3R8bmR8cmQpLyxcbiAgICAgICAgb3JkaW5hbCA6IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgICAgICAgICAgIHZhciBiID0gbnVtYmVyICUgMTAsXG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gKHRvSW50KG51bWJlciAlIDEwMCAvIDEwKSA9PT0gMSkgPyAndGgnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMSkgPyAnc3QnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMikgPyAnbmQnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMykgPyAncmQnIDogJ3RoJztcbiAgICAgICAgICAgIHJldHVybiBudW1iZXIgKyBvdXRwdXQ7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFNpZGUgZWZmZWN0IGltcG9ydHNcblxuICAgIGhvb2tzLmxhbmcgPSBkZXByZWNhdGUoJ21vbWVudC5sYW5nIGlzIGRlcHJlY2F0ZWQuIFVzZSBtb21lbnQubG9jYWxlIGluc3RlYWQuJywgZ2V0U2V0R2xvYmFsTG9jYWxlKTtcbiAgICBob29rcy5sYW5nRGF0YSA9IGRlcHJlY2F0ZSgnbW9tZW50LmxhbmdEYXRhIGlzIGRlcHJlY2F0ZWQuIFVzZSBtb21lbnQubG9jYWxlRGF0YSBpbnN0ZWFkLicsIGdldExvY2FsZSk7XG5cbiAgICB2YXIgbWF0aEFicyA9IE1hdGguYWJzO1xuXG4gICAgZnVuY3Rpb24gYWJzICgpIHtcbiAgICAgICAgdmFyIGRhdGEgICAgICAgICAgID0gdGhpcy5fZGF0YTtcblxuICAgICAgICB0aGlzLl9taWxsaXNlY29uZHMgPSBtYXRoQWJzKHRoaXMuX21pbGxpc2Vjb25kcyk7XG4gICAgICAgIHRoaXMuX2RheXMgICAgICAgICA9IG1hdGhBYnModGhpcy5fZGF5cyk7XG4gICAgICAgIHRoaXMuX21vbnRocyAgICAgICA9IG1hdGhBYnModGhpcy5fbW9udGhzKTtcblxuICAgICAgICBkYXRhLm1pbGxpc2Vjb25kcyAgPSBtYXRoQWJzKGRhdGEubWlsbGlzZWNvbmRzKTtcbiAgICAgICAgZGF0YS5zZWNvbmRzICAgICAgID0gbWF0aEFicyhkYXRhLnNlY29uZHMpO1xuICAgICAgICBkYXRhLm1pbnV0ZXMgICAgICAgPSBtYXRoQWJzKGRhdGEubWludXRlcyk7XG4gICAgICAgIGRhdGEuaG91cnMgICAgICAgICA9IG1hdGhBYnMoZGF0YS5ob3Vycyk7XG4gICAgICAgIGRhdGEubW9udGhzICAgICAgICA9IG1hdGhBYnMoZGF0YS5tb250aHMpO1xuICAgICAgICBkYXRhLnllYXJzICAgICAgICAgPSBtYXRoQWJzKGRhdGEueWVhcnMpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFN1YnRyYWN0JDEgKGR1cmF0aW9uLCBpbnB1dCwgdmFsdWUsIGRpcmVjdGlvbikge1xuICAgICAgICB2YXIgb3RoZXIgPSBjcmVhdGVEdXJhdGlvbihpbnB1dCwgdmFsdWUpO1xuXG4gICAgICAgIGR1cmF0aW9uLl9taWxsaXNlY29uZHMgKz0gZGlyZWN0aW9uICogb3RoZXIuX21pbGxpc2Vjb25kcztcbiAgICAgICAgZHVyYXRpb24uX2RheXMgICAgICAgICArPSBkaXJlY3Rpb24gKiBvdGhlci5fZGF5cztcbiAgICAgICAgZHVyYXRpb24uX21vbnRocyAgICAgICArPSBkaXJlY3Rpb24gKiBvdGhlci5fbW9udGhzO1xuXG4gICAgICAgIHJldHVybiBkdXJhdGlvbi5fYnViYmxlKCk7XG4gICAgfVxuXG4gICAgLy8gc3VwcG9ydHMgb25seSAyLjAtc3R5bGUgYWRkKDEsICdzJykgb3IgYWRkKGR1cmF0aW9uKVxuICAgIGZ1bmN0aW9uIGFkZCQxIChpbnB1dCwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGFkZFN1YnRyYWN0JDEodGhpcywgaW5wdXQsIHZhbHVlLCAxKTtcbiAgICB9XG5cbiAgICAvLyBzdXBwb3J0cyBvbmx5IDIuMC1zdHlsZSBzdWJ0cmFjdCgxLCAncycpIG9yIHN1YnRyYWN0KGR1cmF0aW9uKVxuICAgIGZ1bmN0aW9uIHN1YnRyYWN0JDEgKGlucHV0LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gYWRkU3VidHJhY3QkMSh0aGlzLCBpbnB1dCwgdmFsdWUsIC0xKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhYnNDZWlsIChudW1iZXIpIHtcbiAgICAgICAgaWYgKG51bWJlciA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKG51bWJlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKG51bWJlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBidWJibGUgKCkge1xuICAgICAgICB2YXIgbWlsbGlzZWNvbmRzID0gdGhpcy5fbWlsbGlzZWNvbmRzO1xuICAgICAgICB2YXIgZGF5cyAgICAgICAgID0gdGhpcy5fZGF5cztcbiAgICAgICAgdmFyIG1vbnRocyAgICAgICA9IHRoaXMuX21vbnRocztcbiAgICAgICAgdmFyIGRhdGEgICAgICAgICA9IHRoaXMuX2RhdGE7XG4gICAgICAgIHZhciBzZWNvbmRzLCBtaW51dGVzLCBob3VycywgeWVhcnMsIG1vbnRoc0Zyb21EYXlzO1xuXG4gICAgICAgIC8vIGlmIHdlIGhhdmUgYSBtaXggb2YgcG9zaXRpdmUgYW5kIG5lZ2F0aXZlIHZhbHVlcywgYnViYmxlIGRvd24gZmlyc3RcbiAgICAgICAgLy8gY2hlY2s6IGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8yMTY2XG4gICAgICAgIGlmICghKChtaWxsaXNlY29uZHMgPj0gMCAmJiBkYXlzID49IDAgJiYgbW9udGhzID49IDApIHx8XG4gICAgICAgICAgICAgICAgKG1pbGxpc2Vjb25kcyA8PSAwICYmIGRheXMgPD0gMCAmJiBtb250aHMgPD0gMCkpKSB7XG4gICAgICAgICAgICBtaWxsaXNlY29uZHMgKz0gYWJzQ2VpbChtb250aHNUb0RheXMobW9udGhzKSArIGRheXMpICogODY0ZTU7XG4gICAgICAgICAgICBkYXlzID0gMDtcbiAgICAgICAgICAgIG1vbnRocyA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGNvZGUgYnViYmxlcyB1cCB2YWx1ZXMsIHNlZSB0aGUgdGVzdHMgZm9yXG4gICAgICAgIC8vIGV4YW1wbGVzIG9mIHdoYXQgdGhhdCBtZWFucy5cbiAgICAgICAgZGF0YS5taWxsaXNlY29uZHMgPSBtaWxsaXNlY29uZHMgJSAxMDAwO1xuXG4gICAgICAgIHNlY29uZHMgICAgICAgICAgID0gYWJzRmxvb3IobWlsbGlzZWNvbmRzIC8gMTAwMCk7XG4gICAgICAgIGRhdGEuc2Vjb25kcyAgICAgID0gc2Vjb25kcyAlIDYwO1xuXG4gICAgICAgIG1pbnV0ZXMgICAgICAgICAgID0gYWJzRmxvb3Ioc2Vjb25kcyAvIDYwKTtcbiAgICAgICAgZGF0YS5taW51dGVzICAgICAgPSBtaW51dGVzICUgNjA7XG5cbiAgICAgICAgaG91cnMgICAgICAgICAgICAgPSBhYnNGbG9vcihtaW51dGVzIC8gNjApO1xuICAgICAgICBkYXRhLmhvdXJzICAgICAgICA9IGhvdXJzICUgMjQ7XG5cbiAgICAgICAgZGF5cyArPSBhYnNGbG9vcihob3VycyAvIDI0KTtcblxuICAgICAgICAvLyBjb252ZXJ0IGRheXMgdG8gbW9udGhzXG4gICAgICAgIG1vbnRoc0Zyb21EYXlzID0gYWJzRmxvb3IoZGF5c1RvTW9udGhzKGRheXMpKTtcbiAgICAgICAgbW9udGhzICs9IG1vbnRoc0Zyb21EYXlzO1xuICAgICAgICBkYXlzIC09IGFic0NlaWwobW9udGhzVG9EYXlzKG1vbnRoc0Zyb21EYXlzKSk7XG5cbiAgICAgICAgLy8gMTIgbW9udGhzIC0+IDEgeWVhclxuICAgICAgICB5ZWFycyA9IGFic0Zsb29yKG1vbnRocyAvIDEyKTtcbiAgICAgICAgbW9udGhzICU9IDEyO1xuXG4gICAgICAgIGRhdGEuZGF5cyAgID0gZGF5cztcbiAgICAgICAgZGF0YS5tb250aHMgPSBtb250aHM7XG4gICAgICAgIGRhdGEueWVhcnMgID0geWVhcnM7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGF5c1RvTW9udGhzIChkYXlzKSB7XG4gICAgICAgIC8vIDQwMCB5ZWFycyBoYXZlIDE0NjA5NyBkYXlzICh0YWtpbmcgaW50byBhY2NvdW50IGxlYXAgeWVhciBydWxlcylcbiAgICAgICAgLy8gNDAwIHllYXJzIGhhdmUgMTIgbW9udGhzID09PSA0ODAwXG4gICAgICAgIHJldHVybiBkYXlzICogNDgwMCAvIDE0NjA5NztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb250aHNUb0RheXMgKG1vbnRocykge1xuICAgICAgICAvLyB0aGUgcmV2ZXJzZSBvZiBkYXlzVG9Nb250aHNcbiAgICAgICAgcmV0dXJuIG1vbnRocyAqIDE0NjA5NyAvIDQ4MDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXMgKHVuaXRzKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRheXM7XG4gICAgICAgIHZhciBtb250aHM7XG4gICAgICAgIHZhciBtaWxsaXNlY29uZHMgPSB0aGlzLl9taWxsaXNlY29uZHM7XG5cbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG5cbiAgICAgICAgaWYgKHVuaXRzID09PSAnbW9udGgnIHx8IHVuaXRzID09PSAneWVhcicpIHtcbiAgICAgICAgICAgIGRheXMgICA9IHRoaXMuX2RheXMgICArIG1pbGxpc2Vjb25kcyAvIDg2NGU1O1xuICAgICAgICAgICAgbW9udGhzID0gdGhpcy5fbW9udGhzICsgZGF5c1RvTW9udGhzKGRheXMpO1xuICAgICAgICAgICAgcmV0dXJuIHVuaXRzID09PSAnbW9udGgnID8gbW9udGhzIDogbW9udGhzIC8gMTI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBoYW5kbGUgbWlsbGlzZWNvbmRzIHNlcGFyYXRlbHkgYmVjYXVzZSBvZiBmbG9hdGluZyBwb2ludCBtYXRoIGVycm9ycyAoaXNzdWUgIzE4NjcpXG4gICAgICAgICAgICBkYXlzID0gdGhpcy5fZGF5cyArIE1hdGgucm91bmQobW9udGhzVG9EYXlzKHRoaXMuX21vbnRocykpO1xuICAgICAgICAgICAgc3dpdGNoICh1bml0cykge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3dlZWsnICAgOiByZXR1cm4gZGF5cyAvIDcgICAgICsgbWlsbGlzZWNvbmRzIC8gNjA0OGU1O1xuICAgICAgICAgICAgICAgIGNhc2UgJ2RheScgICAgOiByZXR1cm4gZGF5cyAgICAgICAgICsgbWlsbGlzZWNvbmRzIC8gODY0ZTU7XG4gICAgICAgICAgICAgICAgY2FzZSAnaG91cicgICA6IHJldHVybiBkYXlzICogMjQgICAgKyBtaWxsaXNlY29uZHMgLyAzNmU1O1xuICAgICAgICAgICAgICAgIGNhc2UgJ21pbnV0ZScgOiByZXR1cm4gZGF5cyAqIDE0NDAgICsgbWlsbGlzZWNvbmRzIC8gNmU0O1xuICAgICAgICAgICAgICAgIGNhc2UgJ3NlY29uZCcgOiByZXR1cm4gZGF5cyAqIDg2NDAwICsgbWlsbGlzZWNvbmRzIC8gMTAwMDtcbiAgICAgICAgICAgICAgICAvLyBNYXRoLmZsb29yIHByZXZlbnRzIGZsb2F0aW5nIHBvaW50IG1hdGggZXJyb3JzIGhlcmVcbiAgICAgICAgICAgICAgICBjYXNlICdtaWxsaXNlY29uZCc6IHJldHVybiBNYXRoLmZsb29yKGRheXMgKiA4NjRlNSkgKyBtaWxsaXNlY29uZHM7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHVuaXQgJyArIHVuaXRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRPRE86IFVzZSB0aGlzLmFzKCdtcycpP1xuICAgIGZ1bmN0aW9uIHZhbHVlT2YkMSAoKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHRoaXMuX21pbGxpc2Vjb25kcyArXG4gICAgICAgICAgICB0aGlzLl9kYXlzICogODY0ZTUgK1xuICAgICAgICAgICAgKHRoaXMuX21vbnRocyAlIDEyKSAqIDI1OTJlNiArXG4gICAgICAgICAgICB0b0ludCh0aGlzLl9tb250aHMgLyAxMikgKiAzMTUzNmU2XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUFzIChhbGlhcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXMoYWxpYXMpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBhc01pbGxpc2Vjb25kcyA9IG1ha2VBcygnbXMnKTtcbiAgICB2YXIgYXNTZWNvbmRzICAgICAgPSBtYWtlQXMoJ3MnKTtcbiAgICB2YXIgYXNNaW51dGVzICAgICAgPSBtYWtlQXMoJ20nKTtcbiAgICB2YXIgYXNIb3VycyAgICAgICAgPSBtYWtlQXMoJ2gnKTtcbiAgICB2YXIgYXNEYXlzICAgICAgICAgPSBtYWtlQXMoJ2QnKTtcbiAgICB2YXIgYXNXZWVrcyAgICAgICAgPSBtYWtlQXMoJ3cnKTtcbiAgICB2YXIgYXNNb250aHMgICAgICAgPSBtYWtlQXMoJ00nKTtcbiAgICB2YXIgYXNZZWFycyAgICAgICAgPSBtYWtlQXMoJ3knKTtcblxuICAgIGZ1bmN0aW9uIGNsb25lJDEgKCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlRHVyYXRpb24odGhpcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0JDIgKHVuaXRzKSB7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICByZXR1cm4gdGhpcy5pc1ZhbGlkKCkgPyB0aGlzW3VuaXRzICsgJ3MnXSgpIDogTmFOO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VHZXR0ZXIobmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCgpID8gdGhpcy5fZGF0YVtuYW1lXSA6IE5hTjtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgbWlsbGlzZWNvbmRzID0gbWFrZUdldHRlcignbWlsbGlzZWNvbmRzJyk7XG4gICAgdmFyIHNlY29uZHMgICAgICA9IG1ha2VHZXR0ZXIoJ3NlY29uZHMnKTtcbiAgICB2YXIgbWludXRlcyAgICAgID0gbWFrZUdldHRlcignbWludXRlcycpO1xuICAgIHZhciBob3VycyAgICAgICAgPSBtYWtlR2V0dGVyKCdob3VycycpO1xuICAgIHZhciBkYXlzICAgICAgICAgPSBtYWtlR2V0dGVyKCdkYXlzJyk7XG4gICAgdmFyIG1vbnRocyAgICAgICA9IG1ha2VHZXR0ZXIoJ21vbnRocycpO1xuICAgIHZhciB5ZWFycyAgICAgICAgPSBtYWtlR2V0dGVyKCd5ZWFycycpO1xuXG4gICAgZnVuY3Rpb24gd2Vla3MgKCkge1xuICAgICAgICByZXR1cm4gYWJzRmxvb3IodGhpcy5kYXlzKCkgLyA3KTtcbiAgICB9XG5cbiAgICB2YXIgcm91bmQgPSBNYXRoLnJvdW5kO1xuICAgIHZhciB0aHJlc2hvbGRzID0ge1xuICAgICAgICBzczogNDQsICAgICAgICAgLy8gYSBmZXcgc2Vjb25kcyB0byBzZWNvbmRzXG4gICAgICAgIHMgOiA0NSwgICAgICAgICAvLyBzZWNvbmRzIHRvIG1pbnV0ZVxuICAgICAgICBtIDogNDUsICAgICAgICAgLy8gbWludXRlcyB0byBob3VyXG4gICAgICAgIGggOiAyMiwgICAgICAgICAvLyBob3VycyB0byBkYXlcbiAgICAgICAgZCA6IDI2LCAgICAgICAgIC8vIGRheXMgdG8gbW9udGhcbiAgICAgICAgTSA6IDExICAgICAgICAgIC8vIG1vbnRocyB0byB5ZWFyXG4gICAgfTtcblxuICAgIC8vIGhlbHBlciBmdW5jdGlvbiBmb3IgbW9tZW50LmZuLmZyb20sIG1vbWVudC5mbi5mcm9tTm93LCBhbmQgbW9tZW50LmR1cmF0aW9uLmZuLmh1bWFuaXplXG4gICAgZnVuY3Rpb24gc3Vic3RpdHV0ZVRpbWVBZ28oc3RyaW5nLCBudW1iZXIsIHdpdGhvdXRTdWZmaXgsIGlzRnV0dXJlLCBsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS5yZWxhdGl2ZVRpbWUobnVtYmVyIHx8IDEsICEhd2l0aG91dFN1ZmZpeCwgc3RyaW5nLCBpc0Z1dHVyZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVsYXRpdmVUaW1lJDEgKHBvc05lZ0R1cmF0aW9uLCB3aXRob3V0U3VmZml4LCBsb2NhbGUpIHtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gY3JlYXRlRHVyYXRpb24ocG9zTmVnRHVyYXRpb24pLmFicygpO1xuICAgICAgICB2YXIgc2Vjb25kcyAgPSByb3VuZChkdXJhdGlvbi5hcygncycpKTtcbiAgICAgICAgdmFyIG1pbnV0ZXMgID0gcm91bmQoZHVyYXRpb24uYXMoJ20nKSk7XG4gICAgICAgIHZhciBob3VycyAgICA9IHJvdW5kKGR1cmF0aW9uLmFzKCdoJykpO1xuICAgICAgICB2YXIgZGF5cyAgICAgPSByb3VuZChkdXJhdGlvbi5hcygnZCcpKTtcbiAgICAgICAgdmFyIG1vbnRocyAgID0gcm91bmQoZHVyYXRpb24uYXMoJ00nKSk7XG4gICAgICAgIHZhciB5ZWFycyAgICA9IHJvdW5kKGR1cmF0aW9uLmFzKCd5JykpO1xuXG4gICAgICAgIHZhciBhID0gc2Vjb25kcyA8PSB0aHJlc2hvbGRzLnNzICYmIFsncycsIHNlY29uZHNdICB8fFxuICAgICAgICAgICAgICAgIHNlY29uZHMgPCB0aHJlc2hvbGRzLnMgICAmJiBbJ3NzJywgc2Vjb25kc10gfHxcbiAgICAgICAgICAgICAgICBtaW51dGVzIDw9IDEgICAgICAgICAgICAgJiYgWydtJ10gICAgICAgICAgIHx8XG4gICAgICAgICAgICAgICAgbWludXRlcyA8IHRocmVzaG9sZHMubSAgICYmIFsnbW0nLCBtaW51dGVzXSB8fFxuICAgICAgICAgICAgICAgIGhvdXJzICAgPD0gMSAgICAgICAgICAgICAmJiBbJ2gnXSAgICAgICAgICAgfHxcbiAgICAgICAgICAgICAgICBob3VycyAgIDwgdGhyZXNob2xkcy5oICAgJiYgWydoaCcsIGhvdXJzXSAgIHx8XG4gICAgICAgICAgICAgICAgZGF5cyAgICA8PSAxICAgICAgICAgICAgICYmIFsnZCddICAgICAgICAgICB8fFxuICAgICAgICAgICAgICAgIGRheXMgICAgPCB0aHJlc2hvbGRzLmQgICAmJiBbJ2RkJywgZGF5c10gICAgfHxcbiAgICAgICAgICAgICAgICBtb250aHMgIDw9IDEgICAgICAgICAgICAgJiYgWydNJ10gICAgICAgICAgIHx8XG4gICAgICAgICAgICAgICAgbW9udGhzICA8IHRocmVzaG9sZHMuTSAgICYmIFsnTU0nLCBtb250aHNdICB8fFxuICAgICAgICAgICAgICAgIHllYXJzICAgPD0gMSAgICAgICAgICAgICAmJiBbJ3knXSAgICAgICAgICAgfHwgWyd5eScsIHllYXJzXTtcblxuICAgICAgICBhWzJdID0gd2l0aG91dFN1ZmZpeDtcbiAgICAgICAgYVszXSA9ICtwb3NOZWdEdXJhdGlvbiA+IDA7XG4gICAgICAgIGFbNF0gPSBsb2NhbGU7XG4gICAgICAgIHJldHVybiBzdWJzdGl0dXRlVGltZUFnby5hcHBseShudWxsLCBhKTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGFsbG93cyB5b3UgdG8gc2V0IHRoZSByb3VuZGluZyBmdW5jdGlvbiBmb3IgcmVsYXRpdmUgdGltZSBzdHJpbmdzXG4gICAgZnVuY3Rpb24gZ2V0U2V0UmVsYXRpdmVUaW1lUm91bmRpbmcgKHJvdW5kaW5nRnVuY3Rpb24pIHtcbiAgICAgICAgaWYgKHJvdW5kaW5nRnVuY3Rpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJvdW5kO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Yocm91bmRpbmdGdW5jdGlvbikgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJvdW5kID0gcm91bmRpbmdGdW5jdGlvbjtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGFsbG93cyB5b3UgdG8gc2V0IGEgdGhyZXNob2xkIGZvciByZWxhdGl2ZSB0aW1lIHN0cmluZ3NcbiAgICBmdW5jdGlvbiBnZXRTZXRSZWxhdGl2ZVRpbWVUaHJlc2hvbGQgKHRocmVzaG9sZCwgbGltaXQpIHtcbiAgICAgICAgaWYgKHRocmVzaG9sZHNbdGhyZXNob2xkXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpbWl0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aHJlc2hvbGRzW3RocmVzaG9sZF07XG4gICAgICAgIH1cbiAgICAgICAgdGhyZXNob2xkc1t0aHJlc2hvbGRdID0gbGltaXQ7XG4gICAgICAgIGlmICh0aHJlc2hvbGQgPT09ICdzJykge1xuICAgICAgICAgICAgdGhyZXNob2xkcy5zcyA9IGxpbWl0IC0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBodW1hbml6ZSAod2l0aFN1ZmZpeCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsb2NhbGUgPSB0aGlzLmxvY2FsZURhdGEoKTtcbiAgICAgICAgdmFyIG91dHB1dCA9IHJlbGF0aXZlVGltZSQxKHRoaXMsICF3aXRoU3VmZml4LCBsb2NhbGUpO1xuXG4gICAgICAgIGlmICh3aXRoU3VmZml4KSB7XG4gICAgICAgICAgICBvdXRwdXQgPSBsb2NhbGUucGFzdEZ1dHVyZSgrdGhpcywgb3V0cHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsb2NhbGUucG9zdGZvcm1hdChvdXRwdXQpO1xuICAgIH1cblxuICAgIHZhciBhYnMkMSA9IE1hdGguYWJzO1xuXG4gICAgZnVuY3Rpb24gc2lnbih4KSB7XG4gICAgICAgIHJldHVybiAoKHggPiAwKSAtICh4IDwgMCkpIHx8ICt4O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvSVNPU3RyaW5nJDEoKSB7XG4gICAgICAgIC8vIGZvciBJU08gc3RyaW5ncyB3ZSBkbyBub3QgdXNlIHRoZSBub3JtYWwgYnViYmxpbmcgcnVsZXM6XG4gICAgICAgIC8vICAqIG1pbGxpc2Vjb25kcyBidWJibGUgdXAgdW50aWwgdGhleSBiZWNvbWUgaG91cnNcbiAgICAgICAgLy8gICogZGF5cyBkbyBub3QgYnViYmxlIGF0IGFsbFxuICAgICAgICAvLyAgKiBtb250aHMgYnViYmxlIHVwIHVudGlsIHRoZXkgYmVjb21lIHllYXJzXG4gICAgICAgIC8vIFRoaXMgaXMgYmVjYXVzZSB0aGVyZSBpcyBubyBjb250ZXh0LWZyZWUgY29udmVyc2lvbiBiZXR3ZWVuIGhvdXJzIGFuZCBkYXlzXG4gICAgICAgIC8vICh0aGluayBvZiBjbG9jayBjaGFuZ2VzKVxuICAgICAgICAvLyBhbmQgYWxzbyBub3QgYmV0d2VlbiBkYXlzIGFuZCBtb250aHMgKDI4LTMxIGRheXMgcGVyIG1vbnRoKVxuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzZWNvbmRzID0gYWJzJDEodGhpcy5fbWlsbGlzZWNvbmRzKSAvIDEwMDA7XG4gICAgICAgIHZhciBkYXlzICAgICAgICAgPSBhYnMkMSh0aGlzLl9kYXlzKTtcbiAgICAgICAgdmFyIG1vbnRocyAgICAgICA9IGFicyQxKHRoaXMuX21vbnRocyk7XG4gICAgICAgIHZhciBtaW51dGVzLCBob3VycywgeWVhcnM7XG5cbiAgICAgICAgLy8gMzYwMCBzZWNvbmRzIC0+IDYwIG1pbnV0ZXMgLT4gMSBob3VyXG4gICAgICAgIG1pbnV0ZXMgICAgICAgICAgID0gYWJzRmxvb3Ioc2Vjb25kcyAvIDYwKTtcbiAgICAgICAgaG91cnMgICAgICAgICAgICAgPSBhYnNGbG9vcihtaW51dGVzIC8gNjApO1xuICAgICAgICBzZWNvbmRzICU9IDYwO1xuICAgICAgICBtaW51dGVzICU9IDYwO1xuXG4gICAgICAgIC8vIDEyIG1vbnRocyAtPiAxIHllYXJcbiAgICAgICAgeWVhcnMgID0gYWJzRmxvb3IobW9udGhzIC8gMTIpO1xuICAgICAgICBtb250aHMgJT0gMTI7XG5cblxuICAgICAgICAvLyBpbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vZG9yZGlsbGUvbW9tZW50LWlzb2R1cmF0aW9uL2Jsb2IvbWFzdGVyL21vbWVudC5pc29kdXJhdGlvbi5qc1xuICAgICAgICB2YXIgWSA9IHllYXJzO1xuICAgICAgICB2YXIgTSA9IG1vbnRocztcbiAgICAgICAgdmFyIEQgPSBkYXlzO1xuICAgICAgICB2YXIgaCA9IGhvdXJzO1xuICAgICAgICB2YXIgbSA9IG1pbnV0ZXM7XG4gICAgICAgIHZhciBzID0gc2Vjb25kcyA/IHNlY29uZHMudG9GaXhlZCgzKS5yZXBsYWNlKC9cXC4/MCskLywgJycpIDogJyc7XG4gICAgICAgIHZhciB0b3RhbCA9IHRoaXMuYXNTZWNvbmRzKCk7XG5cbiAgICAgICAgaWYgKCF0b3RhbCkge1xuICAgICAgICAgICAgLy8gdGhpcyBpcyB0aGUgc2FtZSBhcyBDIydzIChOb2RhKSBhbmQgcHl0aG9uIChpc29kYXRlKS4uLlxuICAgICAgICAgICAgLy8gYnV0IG5vdCBvdGhlciBKUyAoZ29vZy5kYXRlKVxuICAgICAgICAgICAgcmV0dXJuICdQMEQnO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRvdGFsU2lnbiA9IHRvdGFsIDwgMCA/ICctJyA6ICcnO1xuICAgICAgICB2YXIgeW1TaWduID0gc2lnbih0aGlzLl9tb250aHMpICE9PSBzaWduKHRvdGFsKSA/ICctJyA6ICcnO1xuICAgICAgICB2YXIgZGF5c1NpZ24gPSBzaWduKHRoaXMuX2RheXMpICE9PSBzaWduKHRvdGFsKSA/ICctJyA6ICcnO1xuICAgICAgICB2YXIgaG1zU2lnbiA9IHNpZ24odGhpcy5fbWlsbGlzZWNvbmRzKSAhPT0gc2lnbih0b3RhbCkgPyAnLScgOiAnJztcblxuICAgICAgICByZXR1cm4gdG90YWxTaWduICsgJ1AnICtcbiAgICAgICAgICAgIChZID8geW1TaWduICsgWSArICdZJyA6ICcnKSArXG4gICAgICAgICAgICAoTSA/IHltU2lnbiArIE0gKyAnTScgOiAnJykgK1xuICAgICAgICAgICAgKEQgPyBkYXlzU2lnbiArIEQgKyAnRCcgOiAnJykgK1xuICAgICAgICAgICAgKChoIHx8IG0gfHwgcykgPyAnVCcgOiAnJykgK1xuICAgICAgICAgICAgKGggPyBobXNTaWduICsgaCArICdIJyA6ICcnKSArXG4gICAgICAgICAgICAobSA/IGhtc1NpZ24gKyBtICsgJ00nIDogJycpICtcbiAgICAgICAgICAgIChzID8gaG1zU2lnbiArIHMgKyAnUycgOiAnJyk7XG4gICAgfVxuXG4gICAgdmFyIHByb3RvJDIgPSBEdXJhdGlvbi5wcm90b3R5cGU7XG5cbiAgICBwcm90byQyLmlzVmFsaWQgICAgICAgID0gaXNWYWxpZCQxO1xuICAgIHByb3RvJDIuYWJzICAgICAgICAgICAgPSBhYnM7XG4gICAgcHJvdG8kMi5hZGQgICAgICAgICAgICA9IGFkZCQxO1xuICAgIHByb3RvJDIuc3VidHJhY3QgICAgICAgPSBzdWJ0cmFjdCQxO1xuICAgIHByb3RvJDIuYXMgICAgICAgICAgICAgPSBhcztcbiAgICBwcm90byQyLmFzTWlsbGlzZWNvbmRzID0gYXNNaWxsaXNlY29uZHM7XG4gICAgcHJvdG8kMi5hc1NlY29uZHMgICAgICA9IGFzU2Vjb25kcztcbiAgICBwcm90byQyLmFzTWludXRlcyAgICAgID0gYXNNaW51dGVzO1xuICAgIHByb3RvJDIuYXNIb3VycyAgICAgICAgPSBhc0hvdXJzO1xuICAgIHByb3RvJDIuYXNEYXlzICAgICAgICAgPSBhc0RheXM7XG4gICAgcHJvdG8kMi5hc1dlZWtzICAgICAgICA9IGFzV2Vla3M7XG4gICAgcHJvdG8kMi5hc01vbnRocyAgICAgICA9IGFzTW9udGhzO1xuICAgIHByb3RvJDIuYXNZZWFycyAgICAgICAgPSBhc1llYXJzO1xuICAgIHByb3RvJDIudmFsdWVPZiAgICAgICAgPSB2YWx1ZU9mJDE7XG4gICAgcHJvdG8kMi5fYnViYmxlICAgICAgICA9IGJ1YmJsZTtcbiAgICBwcm90byQyLmNsb25lICAgICAgICAgID0gY2xvbmUkMTtcbiAgICBwcm90byQyLmdldCAgICAgICAgICAgID0gZ2V0JDI7XG4gICAgcHJvdG8kMi5taWxsaXNlY29uZHMgICA9IG1pbGxpc2Vjb25kcztcbiAgICBwcm90byQyLnNlY29uZHMgICAgICAgID0gc2Vjb25kcztcbiAgICBwcm90byQyLm1pbnV0ZXMgICAgICAgID0gbWludXRlcztcbiAgICBwcm90byQyLmhvdXJzICAgICAgICAgID0gaG91cnM7XG4gICAgcHJvdG8kMi5kYXlzICAgICAgICAgICA9IGRheXM7XG4gICAgcHJvdG8kMi53ZWVrcyAgICAgICAgICA9IHdlZWtzO1xuICAgIHByb3RvJDIubW9udGhzICAgICAgICAgPSBtb250aHM7XG4gICAgcHJvdG8kMi55ZWFycyAgICAgICAgICA9IHllYXJzO1xuICAgIHByb3RvJDIuaHVtYW5pemUgICAgICAgPSBodW1hbml6ZTtcbiAgICBwcm90byQyLnRvSVNPU3RyaW5nICAgID0gdG9JU09TdHJpbmckMTtcbiAgICBwcm90byQyLnRvU3RyaW5nICAgICAgID0gdG9JU09TdHJpbmckMTtcbiAgICBwcm90byQyLnRvSlNPTiAgICAgICAgID0gdG9JU09TdHJpbmckMTtcbiAgICBwcm90byQyLmxvY2FsZSAgICAgICAgID0gbG9jYWxlO1xuICAgIHByb3RvJDIubG9jYWxlRGF0YSAgICAgPSBsb2NhbGVEYXRhO1xuXG4gICAgcHJvdG8kMi50b0lzb1N0cmluZyA9IGRlcHJlY2F0ZSgndG9Jc29TdHJpbmcoKSBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIHRvSVNPU3RyaW5nKCkgaW5zdGVhZCAobm90aWNlIHRoZSBjYXBpdGFscyknLCB0b0lTT1N0cmluZyQxKTtcbiAgICBwcm90byQyLmxhbmcgPSBsYW5nO1xuXG4gICAgLy8gU2lkZSBlZmZlY3QgaW1wb3J0c1xuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ1gnLCAwLCAwLCAndW5peCcpO1xuICAgIGFkZEZvcm1hdFRva2VuKCd4JywgMCwgMCwgJ3ZhbHVlT2YnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ3gnLCBtYXRjaFNpZ25lZCk7XG4gICAgYWRkUmVnZXhUb2tlbignWCcsIG1hdGNoVGltZXN0YW1wKTtcbiAgICBhZGRQYXJzZVRva2VuKCdYJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKHBhcnNlRmxvYXQoaW5wdXQsIDEwKSAqIDEwMDApO1xuICAgIH0pO1xuICAgIGFkZFBhcnNlVG9rZW4oJ3gnLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUodG9JbnQoaW5wdXQpKTtcbiAgICB9KTtcblxuICAgIC8vIFNpZGUgZWZmZWN0IGltcG9ydHNcblxuXG4gICAgaG9va3MudmVyc2lvbiA9ICcyLjIyLjInO1xuXG4gICAgc2V0SG9va0NhbGxiYWNrKGNyZWF0ZUxvY2FsKTtcblxuICAgIGhvb2tzLmZuICAgICAgICAgICAgICAgICAgICA9IHByb3RvO1xuICAgIGhvb2tzLm1pbiAgICAgICAgICAgICAgICAgICA9IG1pbjtcbiAgICBob29rcy5tYXggICAgICAgICAgICAgICAgICAgPSBtYXg7XG4gICAgaG9va3Mubm93ICAgICAgICAgICAgICAgICAgID0gbm93O1xuICAgIGhvb2tzLnV0YyAgICAgICAgICAgICAgICAgICA9IGNyZWF0ZVVUQztcbiAgICBob29rcy51bml4ICAgICAgICAgICAgICAgICAgPSBjcmVhdGVVbml4O1xuICAgIGhvb2tzLm1vbnRocyAgICAgICAgICAgICAgICA9IGxpc3RNb250aHM7XG4gICAgaG9va3MuaXNEYXRlICAgICAgICAgICAgICAgID0gaXNEYXRlO1xuICAgIGhvb2tzLmxvY2FsZSAgICAgICAgICAgICAgICA9IGdldFNldEdsb2JhbExvY2FsZTtcbiAgICBob29rcy5pbnZhbGlkICAgICAgICAgICAgICAgPSBjcmVhdGVJbnZhbGlkO1xuICAgIGhvb2tzLmR1cmF0aW9uICAgICAgICAgICAgICA9IGNyZWF0ZUR1cmF0aW9uO1xuICAgIGhvb2tzLmlzTW9tZW50ICAgICAgICAgICAgICA9IGlzTW9tZW50O1xuICAgIGhvb2tzLndlZWtkYXlzICAgICAgICAgICAgICA9IGxpc3RXZWVrZGF5cztcbiAgICBob29rcy5wYXJzZVpvbmUgICAgICAgICAgICAgPSBjcmVhdGVJblpvbmU7XG4gICAgaG9va3MubG9jYWxlRGF0YSAgICAgICAgICAgID0gZ2V0TG9jYWxlO1xuICAgIGhvb2tzLmlzRHVyYXRpb24gICAgICAgICAgICA9IGlzRHVyYXRpb247XG4gICAgaG9va3MubW9udGhzU2hvcnQgICAgICAgICAgID0gbGlzdE1vbnRoc1Nob3J0O1xuICAgIGhvb2tzLndlZWtkYXlzTWluICAgICAgICAgICA9IGxpc3RXZWVrZGF5c01pbjtcbiAgICBob29rcy5kZWZpbmVMb2NhbGUgICAgICAgICAgPSBkZWZpbmVMb2NhbGU7XG4gICAgaG9va3MudXBkYXRlTG9jYWxlICAgICAgICAgID0gdXBkYXRlTG9jYWxlO1xuICAgIGhvb2tzLmxvY2FsZXMgICAgICAgICAgICAgICA9IGxpc3RMb2NhbGVzO1xuICAgIGhvb2tzLndlZWtkYXlzU2hvcnQgICAgICAgICA9IGxpc3RXZWVrZGF5c1Nob3J0O1xuICAgIGhvb2tzLm5vcm1hbGl6ZVVuaXRzICAgICAgICA9IG5vcm1hbGl6ZVVuaXRzO1xuICAgIGhvb2tzLnJlbGF0aXZlVGltZVJvdW5kaW5nICA9IGdldFNldFJlbGF0aXZlVGltZVJvdW5kaW5nO1xuICAgIGhvb2tzLnJlbGF0aXZlVGltZVRocmVzaG9sZCA9IGdldFNldFJlbGF0aXZlVGltZVRocmVzaG9sZDtcbiAgICBob29rcy5jYWxlbmRhckZvcm1hdCAgICAgICAgPSBnZXRDYWxlbmRhckZvcm1hdDtcbiAgICBob29rcy5wcm90b3R5cGUgICAgICAgICAgICAgPSBwcm90bztcblxuICAgIC8vIGN1cnJlbnRseSBIVE1MNSBpbnB1dCB0eXBlIG9ubHkgc3VwcG9ydHMgMjQtaG91ciBmb3JtYXRzXG4gICAgaG9va3MuSFRNTDVfRk1UID0ge1xuICAgICAgICBEQVRFVElNRV9MT0NBTDogJ1lZWVktTU0tRERUSEg6bW0nLCAgICAgICAgICAgICAvLyA8aW5wdXQgdHlwZT1cImRhdGV0aW1lLWxvY2FsXCIgLz5cbiAgICAgICAgREFURVRJTUVfTE9DQUxfU0VDT05EUzogJ1lZWVktTU0tRERUSEg6bW06c3MnLCAgLy8gPGlucHV0IHR5cGU9XCJkYXRldGltZS1sb2NhbFwiIHN0ZXA9XCIxXCIgLz5cbiAgICAgICAgREFURVRJTUVfTE9DQUxfTVM6ICdZWVlZLU1NLUREVEhIOm1tOnNzLlNTUycsICAgLy8gPGlucHV0IHR5cGU9XCJkYXRldGltZS1sb2NhbFwiIHN0ZXA9XCIwLjAwMVwiIC8+XG4gICAgICAgIERBVEU6ICdZWVlZLU1NLUREJywgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDxpbnB1dCB0eXBlPVwiZGF0ZVwiIC8+XG4gICAgICAgIFRJTUU6ICdISDptbScsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDxpbnB1dCB0eXBlPVwidGltZVwiIC8+XG4gICAgICAgIFRJTUVfU0VDT05EUzogJ0hIOm1tOnNzJywgICAgICAgICAgICAgICAgICAgICAgIC8vIDxpbnB1dCB0eXBlPVwidGltZVwiIHN0ZXA9XCIxXCIgLz5cbiAgICAgICAgVElNRV9NUzogJ0hIOm1tOnNzLlNTUycsICAgICAgICAgICAgICAgICAgICAgICAgLy8gPGlucHV0IHR5cGU9XCJ0aW1lXCIgc3RlcD1cIjAuMDAxXCIgLz5cbiAgICAgICAgV0VFSzogJ1lZWVktW1ddV1cnLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPGlucHV0IHR5cGU9XCJ3ZWVrXCIgLz5cbiAgICAgICAgTU9OVEg6ICdZWVlZLU1NJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPGlucHV0IHR5cGU9XCJtb250aFwiIC8+XG4gICAgfTtcblxuICAgIHJldHVybiBob29rcztcblxufSkpKTtcbiIsIi8qIHNtb290aHNjcm9sbCB2MC40LjAgLSAyMDE4IC0gRHVzdGFuIEthc3RlbiwgSmVyZW1pYXMgTWVuaWNoZWxsaSAtIE1JVCBMaWNlbnNlICovXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gcG9seWZpbGxcbiAgZnVuY3Rpb24gcG9seWZpbGwoKSB7XG4gICAgLy8gYWxpYXNlc1xuICAgIHZhciB3ID0gd2luZG93O1xuICAgIHZhciBkID0gZG9jdW1lbnQ7XG5cbiAgICAvLyByZXR1cm4gaWYgc2Nyb2xsIGJlaGF2aW9yIGlzIHN1cHBvcnRlZCBhbmQgcG9seWZpbGwgaXMgbm90IGZvcmNlZFxuICAgIGlmIChcbiAgICAgICdzY3JvbGxCZWhhdmlvcicgaW4gZC5kb2N1bWVudEVsZW1lbnQuc3R5bGUgJiZcbiAgICAgIHcuX19mb3JjZVNtb290aFNjcm9sbFBvbHlmaWxsX18gIT09IHRydWVcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBnbG9iYWxzXG4gICAgdmFyIEVsZW1lbnQgPSB3LkhUTUxFbGVtZW50IHx8IHcuRWxlbWVudDtcbiAgICB2YXIgU0NST0xMX1RJTUUgPSA0Njg7XG5cbiAgICAvLyBvYmplY3QgZ2F0aGVyaW5nIG9yaWdpbmFsIHNjcm9sbCBtZXRob2RzXG4gICAgdmFyIG9yaWdpbmFsID0ge1xuICAgICAgc2Nyb2xsOiB3LnNjcm9sbCB8fCB3LnNjcm9sbFRvLFxuICAgICAgc2Nyb2xsQnk6IHcuc2Nyb2xsQnksXG4gICAgICBlbGVtZW50U2Nyb2xsOiBFbGVtZW50LnByb3RvdHlwZS5zY3JvbGwgfHwgc2Nyb2xsRWxlbWVudCxcbiAgICAgIHNjcm9sbEludG9WaWV3OiBFbGVtZW50LnByb3RvdHlwZS5zY3JvbGxJbnRvVmlld1xuICAgIH07XG5cbiAgICAvLyBkZWZpbmUgdGltaW5nIG1ldGhvZFxuICAgIHZhciBub3cgPVxuICAgICAgdy5wZXJmb3JtYW5jZSAmJiB3LnBlcmZvcm1hbmNlLm5vd1xuICAgICAgICA/IHcucGVyZm9ybWFuY2Uubm93LmJpbmQody5wZXJmb3JtYW5jZSlcbiAgICAgICAgOiBEYXRlLm5vdztcblxuICAgIC8qKlxuICAgICAqIGluZGljYXRlcyBpZiBhIHRoZSBjdXJyZW50IGJyb3dzZXIgaXMgbWFkZSBieSBNaWNyb3NvZnRcbiAgICAgKiBAbWV0aG9kIGlzTWljcm9zb2Z0QnJvd3NlclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1c2VyQWdlbnRcbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc01pY3Jvc29mdEJyb3dzZXIodXNlckFnZW50KSB7XG4gICAgICB2YXIgdXNlckFnZW50UGF0dGVybnMgPSBbJ01TSUUgJywgJ1RyaWRlbnQvJywgJ0VkZ2UvJ107XG5cbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKHVzZXJBZ2VudFBhdHRlcm5zLmpvaW4oJ3wnKSkudGVzdCh1c2VyQWdlbnQpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogSUUgaGFzIHJvdW5kaW5nIGJ1ZyByb3VuZGluZyBkb3duIGNsaWVudEhlaWdodCBhbmQgY2xpZW50V2lkdGggYW5kXG4gICAgICogcm91bmRpbmcgdXAgc2Nyb2xsSGVpZ2h0IGFuZCBzY3JvbGxXaWR0aCBjYXVzaW5nIGZhbHNlIHBvc2l0aXZlc1xuICAgICAqIG9uIGhhc1Njcm9sbGFibGVTcGFjZVxuICAgICAqL1xuICAgIHZhciBST1VORElOR19UT0xFUkFOQ0UgPSBpc01pY3Jvc29mdEJyb3dzZXIody5uYXZpZ2F0b3IudXNlckFnZW50KSA/IDEgOiAwO1xuXG4gICAgLyoqXG4gICAgICogY2hhbmdlcyBzY3JvbGwgcG9zaXRpb24gaW5zaWRlIGFuIGVsZW1lbnRcbiAgICAgKiBAbWV0aG9kIHNjcm9sbEVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB5XG4gICAgICogQHJldHVybnMge3VuZGVmaW5lZH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzY3JvbGxFbGVtZW50KHgsIHkpIHtcbiAgICAgIHRoaXMuc2Nyb2xsTGVmdCA9IHg7XG4gICAgICB0aGlzLnNjcm9sbFRvcCA9IHk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyByZXN1bHQgb2YgYXBwbHlpbmcgZWFzZSBtYXRoIGZ1bmN0aW9uIHRvIGEgbnVtYmVyXG4gICAgICogQG1ldGhvZCBlYXNlXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGtcbiAgICAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGVhc2Uoaykge1xuICAgICAgcmV0dXJuIDAuNSAqICgxIC0gTWF0aC5jb3MoTWF0aC5QSSAqIGspKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBpbmRpY2F0ZXMgaWYgYSBzbW9vdGggYmVoYXZpb3Igc2hvdWxkIGJlIGFwcGxpZWRcbiAgICAgKiBAbWV0aG9kIHNob3VsZEJhaWxPdXRcbiAgICAgKiBAcGFyYW0ge051bWJlcnxPYmplY3R9IGZpcnN0QXJnXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAgICovXG4gICAgZnVuY3Rpb24gc2hvdWxkQmFpbE91dChmaXJzdEFyZykge1xuICAgICAgaWYgKFxuICAgICAgICBmaXJzdEFyZyA9PT0gbnVsbCB8fFxuICAgICAgICB0eXBlb2YgZmlyc3RBcmcgIT09ICdvYmplY3QnIHx8XG4gICAgICAgIGZpcnN0QXJnLmJlaGF2aW9yID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgZmlyc3RBcmcuYmVoYXZpb3IgPT09ICdhdXRvJyB8fFxuICAgICAgICBmaXJzdEFyZy5iZWhhdmlvciA9PT0gJ2luc3RhbnQnXG4gICAgICApIHtcbiAgICAgICAgLy8gZmlyc3QgYXJndW1lbnQgaXMgbm90IGFuIG9iamVjdC9udWxsXG4gICAgICAgIC8vIG9yIGJlaGF2aW9yIGlzIGF1dG8sIGluc3RhbnQgb3IgdW5kZWZpbmVkXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGZpcnN0QXJnID09PSAnb2JqZWN0JyAmJiBmaXJzdEFyZy5iZWhhdmlvciA9PT0gJ3Ntb290aCcpIHtcbiAgICAgICAgLy8gZmlyc3QgYXJndW1lbnQgaXMgYW4gb2JqZWN0IGFuZCBiZWhhdmlvciBpcyBzbW9vdGhcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICAvLyB0aHJvdyBlcnJvciB3aGVuIGJlaGF2aW9yIGlzIG5vdCBzdXBwb3J0ZWRcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICdiZWhhdmlvciBtZW1iZXIgb2YgU2Nyb2xsT3B0aW9ucyAnICtcbiAgICAgICAgICBmaXJzdEFyZy5iZWhhdmlvciArXG4gICAgICAgICAgJyBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgZW51bWVyYXRpb24gU2Nyb2xsQmVoYXZpb3IuJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBpbmRpY2F0ZXMgaWYgYW4gZWxlbWVudCBoYXMgc2Nyb2xsYWJsZSBzcGFjZSBpbiB0aGUgcHJvdmlkZWQgYXhpc1xuICAgICAqIEBtZXRob2QgaGFzU2Nyb2xsYWJsZVNwYWNlXG4gICAgICogQHBhcmFtIHtOb2RlfSBlbFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBheGlzXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAgICovXG4gICAgZnVuY3Rpb24gaGFzU2Nyb2xsYWJsZVNwYWNlKGVsLCBheGlzKSB7XG4gICAgICBpZiAoYXhpcyA9PT0gJ1knKSB7XG4gICAgICAgIHJldHVybiBlbC5jbGllbnRIZWlnaHQgKyBST1VORElOR19UT0xFUkFOQ0UgPCBlbC5zY3JvbGxIZWlnaHQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChheGlzID09PSAnWCcpIHtcbiAgICAgICAgcmV0dXJuIGVsLmNsaWVudFdpZHRoICsgUk9VTkRJTkdfVE9MRVJBTkNFIDwgZWwuc2Nyb2xsV2lkdGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogaW5kaWNhdGVzIGlmIGFuIGVsZW1lbnQgaGFzIGEgc2Nyb2xsYWJsZSBvdmVyZmxvdyBwcm9wZXJ0eSBpbiB0aGUgYXhpc1xuICAgICAqIEBtZXRob2QgY2FuT3ZlcmZsb3dcbiAgICAgKiBAcGFyYW0ge05vZGV9IGVsXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF4aXNcbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjYW5PdmVyZmxvdyhlbCwgYXhpcykge1xuICAgICAgdmFyIG92ZXJmbG93VmFsdWUgPSB3LmdldENvbXB1dGVkU3R5bGUoZWwsIG51bGwpWydvdmVyZmxvdycgKyBheGlzXTtcblxuICAgICAgcmV0dXJuIG92ZXJmbG93VmFsdWUgPT09ICdhdXRvJyB8fCBvdmVyZmxvd1ZhbHVlID09PSAnc2Nyb2xsJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBpbmRpY2F0ZXMgaWYgYW4gZWxlbWVudCBjYW4gYmUgc2Nyb2xsZWQgaW4gZWl0aGVyIGF4aXNcbiAgICAgKiBAbWV0aG9kIGlzU2Nyb2xsYWJsZVxuICAgICAqIEBwYXJhbSB7Tm9kZX0gZWxcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXhpc1xuICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzU2Nyb2xsYWJsZShlbCkge1xuICAgICAgdmFyIGlzU2Nyb2xsYWJsZVkgPSBoYXNTY3JvbGxhYmxlU3BhY2UoZWwsICdZJykgJiYgY2FuT3ZlcmZsb3coZWwsICdZJyk7XG4gICAgICB2YXIgaXNTY3JvbGxhYmxlWCA9IGhhc1Njcm9sbGFibGVTcGFjZShlbCwgJ1gnKSAmJiBjYW5PdmVyZmxvdyhlbCwgJ1gnKTtcblxuICAgICAgcmV0dXJuIGlzU2Nyb2xsYWJsZVkgfHwgaXNTY3JvbGxhYmxlWDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBmaW5kcyBzY3JvbGxhYmxlIHBhcmVudCBvZiBhbiBlbGVtZW50XG4gICAgICogQG1ldGhvZCBmaW5kU2Nyb2xsYWJsZVBhcmVudFxuICAgICAqIEBwYXJhbSB7Tm9kZX0gZWxcbiAgICAgKiBAcmV0dXJucyB7Tm9kZX0gZWxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmaW5kU2Nyb2xsYWJsZVBhcmVudChlbCkge1xuICAgICAgdmFyIGlzQm9keTtcblxuICAgICAgZG8ge1xuICAgICAgICBlbCA9IGVsLnBhcmVudE5vZGU7XG5cbiAgICAgICAgaXNCb2R5ID0gZWwgPT09IGQuYm9keTtcbiAgICAgIH0gd2hpbGUgKGlzQm9keSA9PT0gZmFsc2UgJiYgaXNTY3JvbGxhYmxlKGVsKSA9PT0gZmFsc2UpO1xuXG4gICAgICBpc0JvZHkgPSBudWxsO1xuXG4gICAgICByZXR1cm4gZWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2VsZiBpbnZva2VkIGZ1bmN0aW9uIHRoYXQsIGdpdmVuIGEgY29udGV4dCwgc3RlcHMgdGhyb3VnaCBzY3JvbGxpbmdcbiAgICAgKiBAbWV0aG9kIHN0ZXBcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dFxuICAgICAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gICAgICovXG4gICAgZnVuY3Rpb24gc3RlcChjb250ZXh0KSB7XG4gICAgICB2YXIgdGltZSA9IG5vdygpO1xuICAgICAgdmFyIHZhbHVlO1xuICAgICAgdmFyIGN1cnJlbnRYO1xuICAgICAgdmFyIGN1cnJlbnRZO1xuICAgICAgdmFyIGVsYXBzZWQgPSAodGltZSAtIGNvbnRleHQuc3RhcnRUaW1lKSAvIFNDUk9MTF9USU1FO1xuXG4gICAgICAvLyBhdm9pZCBlbGFwc2VkIHRpbWVzIGhpZ2hlciB0aGFuIG9uZVxuICAgICAgZWxhcHNlZCA9IGVsYXBzZWQgPiAxID8gMSA6IGVsYXBzZWQ7XG5cbiAgICAgIC8vIGFwcGx5IGVhc2luZyB0byBlbGFwc2VkIHRpbWVcbiAgICAgIHZhbHVlID0gZWFzZShlbGFwc2VkKTtcblxuICAgICAgY3VycmVudFggPSBjb250ZXh0LnN0YXJ0WCArIChjb250ZXh0LnggLSBjb250ZXh0LnN0YXJ0WCkgKiB2YWx1ZTtcbiAgICAgIGN1cnJlbnRZID0gY29udGV4dC5zdGFydFkgKyAoY29udGV4dC55IC0gY29udGV4dC5zdGFydFkpICogdmFsdWU7XG5cbiAgICAgIGNvbnRleHQubWV0aG9kLmNhbGwoY29udGV4dC5zY3JvbGxhYmxlLCBjdXJyZW50WCwgY3VycmVudFkpO1xuXG4gICAgICAvLyBzY3JvbGwgbW9yZSBpZiB3ZSBoYXZlIG5vdCByZWFjaGVkIG91ciBkZXN0aW5hdGlvblxuICAgICAgaWYgKGN1cnJlbnRYICE9PSBjb250ZXh0LnggfHwgY3VycmVudFkgIT09IGNvbnRleHQueSkge1xuICAgICAgICB3LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwLmJpbmQodywgY29udGV4dCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNjcm9sbHMgd2luZG93IG9yIGVsZW1lbnQgd2l0aCBhIHNtb290aCBiZWhhdmlvclxuICAgICAqIEBtZXRob2Qgc21vb3RoU2Nyb2xsXG4gICAgICogQHBhcmFtIHtPYmplY3R8Tm9kZX0gZWxcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB5XG4gICAgICogQHJldHVybnMge3VuZGVmaW5lZH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzbW9vdGhTY3JvbGwoZWwsIHgsIHkpIHtcbiAgICAgIHZhciBzY3JvbGxhYmxlO1xuICAgICAgdmFyIHN0YXJ0WDtcbiAgICAgIHZhciBzdGFydFk7XG4gICAgICB2YXIgbWV0aG9kO1xuICAgICAgdmFyIHN0YXJ0VGltZSA9IG5vdygpO1xuXG4gICAgICAvLyBkZWZpbmUgc2Nyb2xsIGNvbnRleHRcbiAgICAgIGlmIChlbCA9PT0gZC5ib2R5KSB7XG4gICAgICAgIHNjcm9sbGFibGUgPSB3O1xuICAgICAgICBzdGFydFggPSB3LnNjcm9sbFggfHwgdy5wYWdlWE9mZnNldDtcbiAgICAgICAgc3RhcnRZID0gdy5zY3JvbGxZIHx8IHcucGFnZVlPZmZzZXQ7XG4gICAgICAgIG1ldGhvZCA9IG9yaWdpbmFsLnNjcm9sbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNjcm9sbGFibGUgPSBlbDtcbiAgICAgICAgc3RhcnRYID0gZWwuc2Nyb2xsTGVmdDtcbiAgICAgICAgc3RhcnRZID0gZWwuc2Nyb2xsVG9wO1xuICAgICAgICBtZXRob2QgPSBzY3JvbGxFbGVtZW50O1xuICAgICAgfVxuXG4gICAgICAvLyBzY3JvbGwgbG9vcGluZyBvdmVyIGEgZnJhbWVcbiAgICAgIHN0ZXAoe1xuICAgICAgICBzY3JvbGxhYmxlOiBzY3JvbGxhYmxlLFxuICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgc3RhcnRUaW1lOiBzdGFydFRpbWUsXG4gICAgICAgIHN0YXJ0WDogc3RhcnRYLFxuICAgICAgICBzdGFydFk6IHN0YXJ0WSxcbiAgICAgICAgeDogeCxcbiAgICAgICAgeTogeVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gT1JJR0lOQUwgTUVUSE9EUyBPVkVSUklERVNcbiAgICAvLyB3LnNjcm9sbCBhbmQgdy5zY3JvbGxUb1xuICAgIHcuc2Nyb2xsID0gdy5zY3JvbGxUbyA9IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gYXZvaWQgYWN0aW9uIHdoZW4gbm8gYXJndW1lbnRzIGFyZSBwYXNzZWRcbiAgICAgIGlmIChhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIGF2b2lkIHNtb290aCBiZWhhdmlvciBpZiBub3QgcmVxdWlyZWRcbiAgICAgIGlmIChzaG91bGRCYWlsT3V0KGFyZ3VtZW50c1swXSkgPT09IHRydWUpIHtcbiAgICAgICAgb3JpZ2luYWwuc2Nyb2xsLmNhbGwoXG4gICAgICAgICAgdyxcbiAgICAgICAgICBhcmd1bWVudHNbMF0ubGVmdCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICA/IGFyZ3VtZW50c1swXS5sZWZ0XG4gICAgICAgICAgICA6IHR5cGVvZiBhcmd1bWVudHNbMF0gIT09ICdvYmplY3QnXG4gICAgICAgICAgICAgID8gYXJndW1lbnRzWzBdXG4gICAgICAgICAgICAgIDogdy5zY3JvbGxYIHx8IHcucGFnZVhPZmZzZXQsXG4gICAgICAgICAgLy8gdXNlIHRvcCBwcm9wLCBzZWNvbmQgYXJndW1lbnQgaWYgcHJlc2VudCBvciBmYWxsYmFjayB0byBzY3JvbGxZXG4gICAgICAgICAgYXJndW1lbnRzWzBdLnRvcCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICA/IGFyZ3VtZW50c1swXS50b3BcbiAgICAgICAgICAgIDogYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgPyBhcmd1bWVudHNbMV1cbiAgICAgICAgICAgICAgOiB3LnNjcm9sbFkgfHwgdy5wYWdlWU9mZnNldFxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gTEVUIFRIRSBTTU9PVEhORVNTIEJFR0lOIVxuICAgICAgc21vb3RoU2Nyb2xsLmNhbGwoXG4gICAgICAgIHcsXG4gICAgICAgIGQuYm9keSxcbiAgICAgICAgYXJndW1lbnRzWzBdLmxlZnQgIT09IHVuZGVmaW5lZFxuICAgICAgICAgID8gfn5hcmd1bWVudHNbMF0ubGVmdFxuICAgICAgICAgIDogdy5zY3JvbGxYIHx8IHcucGFnZVhPZmZzZXQsXG4gICAgICAgIGFyZ3VtZW50c1swXS50b3AgIT09IHVuZGVmaW5lZFxuICAgICAgICAgID8gfn5hcmd1bWVudHNbMF0udG9wXG4gICAgICAgICAgOiB3LnNjcm9sbFkgfHwgdy5wYWdlWU9mZnNldFxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgLy8gdy5zY3JvbGxCeVxuICAgIHcuc2Nyb2xsQnkgPSBmdW5jdGlvbigpIHtcbiAgICAgIC8vIGF2b2lkIGFjdGlvbiB3aGVuIG5vIGFyZ3VtZW50cyBhcmUgcGFzc2VkXG4gICAgICBpZiAoYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBhdm9pZCBzbW9vdGggYmVoYXZpb3IgaWYgbm90IHJlcXVpcmVkXG4gICAgICBpZiAoc2hvdWxkQmFpbE91dChhcmd1bWVudHNbMF0pKSB7XG4gICAgICAgIG9yaWdpbmFsLnNjcm9sbEJ5LmNhbGwoXG4gICAgICAgICAgdyxcbiAgICAgICAgICBhcmd1bWVudHNbMF0ubGVmdCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICA/IGFyZ3VtZW50c1swXS5sZWZ0XG4gICAgICAgICAgICA6IHR5cGVvZiBhcmd1bWVudHNbMF0gIT09ICdvYmplY3QnID8gYXJndW1lbnRzWzBdIDogMCxcbiAgICAgICAgICBhcmd1bWVudHNbMF0udG9wICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgID8gYXJndW1lbnRzWzBdLnRvcFxuICAgICAgICAgICAgOiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IDBcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIExFVCBUSEUgU01PT1RITkVTUyBCRUdJTiFcbiAgICAgIHNtb290aFNjcm9sbC5jYWxsKFxuICAgICAgICB3LFxuICAgICAgICBkLmJvZHksXG4gICAgICAgIH5+YXJndW1lbnRzWzBdLmxlZnQgKyAody5zY3JvbGxYIHx8IHcucGFnZVhPZmZzZXQpLFxuICAgICAgICB+fmFyZ3VtZW50c1swXS50b3AgKyAody5zY3JvbGxZIHx8IHcucGFnZVlPZmZzZXQpXG4gICAgICApO1xuICAgIH07XG5cbiAgICAvLyBFbGVtZW50LnByb3RvdHlwZS5zY3JvbGwgYW5kIEVsZW1lbnQucHJvdG90eXBlLnNjcm9sbFRvXG4gICAgRWxlbWVudC5wcm90b3R5cGUuc2Nyb2xsID0gRWxlbWVudC5wcm90b3R5cGUuc2Nyb2xsVG8gPSBmdW5jdGlvbigpIHtcbiAgICAgIC8vIGF2b2lkIGFjdGlvbiB3aGVuIG5vIGFyZ3VtZW50cyBhcmUgcGFzc2VkXG4gICAgICBpZiAoYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBhdm9pZCBzbW9vdGggYmVoYXZpb3IgaWYgbm90IHJlcXVpcmVkXG4gICAgICBpZiAoc2hvdWxkQmFpbE91dChhcmd1bWVudHNbMF0pID09PSB0cnVlKSB7XG4gICAgICAgIC8vIGlmIG9uZSBudW1iZXIgaXMgcGFzc2VkLCB0aHJvdyBlcnJvciB0byBtYXRjaCBGaXJlZm94IGltcGxlbWVudGF0aW9uXG4gICAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnbnVtYmVyJyAmJiBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignVmFsdWUgY291bGQgbm90IGJlIGNvbnZlcnRlZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgb3JpZ2luYWwuZWxlbWVudFNjcm9sbC5jYWxsKFxuICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgLy8gdXNlIGxlZnQgcHJvcCwgZmlyc3QgbnVtYmVyIGFyZ3VtZW50IG9yIGZhbGxiYWNrIHRvIHNjcm9sbExlZnRcbiAgICAgICAgICBhcmd1bWVudHNbMF0ubGVmdCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICA/IH5+YXJndW1lbnRzWzBdLmxlZnRcbiAgICAgICAgICAgIDogdHlwZW9mIGFyZ3VtZW50c1swXSAhPT0gJ29iamVjdCcgPyB+fmFyZ3VtZW50c1swXSA6IHRoaXMuc2Nyb2xsTGVmdCxcbiAgICAgICAgICAvLyB1c2UgdG9wIHByb3AsIHNlY29uZCBhcmd1bWVudCBvciBmYWxsYmFjayB0byBzY3JvbGxUb3BcbiAgICAgICAgICBhcmd1bWVudHNbMF0udG9wICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgID8gfn5hcmd1bWVudHNbMF0udG9wXG4gICAgICAgICAgICA6IGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gfn5hcmd1bWVudHNbMV0gOiB0aGlzLnNjcm9sbFRvcFxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGxlZnQgPSBhcmd1bWVudHNbMF0ubGVmdDtcbiAgICAgIHZhciB0b3AgPSBhcmd1bWVudHNbMF0udG9wO1xuXG4gICAgICAvLyBMRVQgVEhFIFNNT09USE5FU1MgQkVHSU4hXG4gICAgICBzbW9vdGhTY3JvbGwuY2FsbChcbiAgICAgICAgdGhpcyxcbiAgICAgICAgdGhpcyxcbiAgICAgICAgdHlwZW9mIGxlZnQgPT09ICd1bmRlZmluZWQnID8gdGhpcy5zY3JvbGxMZWZ0IDogfn5sZWZ0LFxuICAgICAgICB0eXBlb2YgdG9wID09PSAndW5kZWZpbmVkJyA/IHRoaXMuc2Nyb2xsVG9wIDogfn50b3BcbiAgICAgICk7XG4gICAgfTtcblxuICAgIC8vIEVsZW1lbnQucHJvdG90eXBlLnNjcm9sbEJ5XG4gICAgRWxlbWVudC5wcm90b3R5cGUuc2Nyb2xsQnkgPSBmdW5jdGlvbigpIHtcbiAgICAgIC8vIGF2b2lkIGFjdGlvbiB3aGVuIG5vIGFyZ3VtZW50cyBhcmUgcGFzc2VkXG4gICAgICBpZiAoYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBhdm9pZCBzbW9vdGggYmVoYXZpb3IgaWYgbm90IHJlcXVpcmVkXG4gICAgICBpZiAoc2hvdWxkQmFpbE91dChhcmd1bWVudHNbMF0pID09PSB0cnVlKSB7XG4gICAgICAgIG9yaWdpbmFsLmVsZW1lbnRTY3JvbGwuY2FsbChcbiAgICAgICAgICB0aGlzLFxuICAgICAgICAgIGFyZ3VtZW50c1swXS5sZWZ0ICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgID8gfn5hcmd1bWVudHNbMF0ubGVmdCArIHRoaXMuc2Nyb2xsTGVmdFxuICAgICAgICAgICAgOiB+fmFyZ3VtZW50c1swXSArIHRoaXMuc2Nyb2xsTGVmdCxcbiAgICAgICAgICBhcmd1bWVudHNbMF0udG9wICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgID8gfn5hcmd1bWVudHNbMF0udG9wICsgdGhpcy5zY3JvbGxUb3BcbiAgICAgICAgICAgIDogfn5hcmd1bWVudHNbMV0gKyB0aGlzLnNjcm9sbFRvcFxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zY3JvbGwoe1xuICAgICAgICBsZWZ0OiB+fmFyZ3VtZW50c1swXS5sZWZ0ICsgdGhpcy5zY3JvbGxMZWZ0LFxuICAgICAgICB0b3A6IH5+YXJndW1lbnRzWzBdLnRvcCArIHRoaXMuc2Nyb2xsVG9wLFxuICAgICAgICBiZWhhdmlvcjogYXJndW1lbnRzWzBdLmJlaGF2aW9yXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gRWxlbWVudC5wcm90b3R5cGUuc2Nyb2xsSW50b1ZpZXdcbiAgICBFbGVtZW50LnByb3RvdHlwZS5zY3JvbGxJbnRvVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gYXZvaWQgc21vb3RoIGJlaGF2aW9yIGlmIG5vdCByZXF1aXJlZFxuICAgICAgaWYgKHNob3VsZEJhaWxPdXQoYXJndW1lbnRzWzBdKSA9PT0gdHJ1ZSkge1xuICAgICAgICBvcmlnaW5hbC5zY3JvbGxJbnRvVmlldy5jYWxsKFxuICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB0cnVlIDogYXJndW1lbnRzWzBdXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBMRVQgVEhFIFNNT09USE5FU1MgQkVHSU4hXG4gICAgICB2YXIgc2Nyb2xsYWJsZVBhcmVudCA9IGZpbmRTY3JvbGxhYmxlUGFyZW50KHRoaXMpO1xuICAgICAgdmFyIHBhcmVudFJlY3RzID0gc2Nyb2xsYWJsZVBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIHZhciBjbGllbnRSZWN0cyA9IHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgIGlmIChzY3JvbGxhYmxlUGFyZW50ICE9PSBkLmJvZHkpIHtcbiAgICAgICAgLy8gcmV2ZWFsIGVsZW1lbnQgaW5zaWRlIHBhcmVudFxuICAgICAgICBzbW9vdGhTY3JvbGwuY2FsbChcbiAgICAgICAgICB0aGlzLFxuICAgICAgICAgIHNjcm9sbGFibGVQYXJlbnQsXG4gICAgICAgICAgc2Nyb2xsYWJsZVBhcmVudC5zY3JvbGxMZWZ0ICsgY2xpZW50UmVjdHMubGVmdCAtIHBhcmVudFJlY3RzLmxlZnQsXG4gICAgICAgICAgc2Nyb2xsYWJsZVBhcmVudC5zY3JvbGxUb3AgKyBjbGllbnRSZWN0cy50b3AgLSBwYXJlbnRSZWN0cy50b3BcbiAgICAgICAgKTtcblxuICAgICAgICAvLyByZXZlYWwgcGFyZW50IGluIHZpZXdwb3J0IHVubGVzcyBpcyBmaXhlZFxuICAgICAgICBpZiAody5nZXRDb21wdXRlZFN0eWxlKHNjcm9sbGFibGVQYXJlbnQpLnBvc2l0aW9uICE9PSAnZml4ZWQnKSB7XG4gICAgICAgICAgdy5zY3JvbGxCeSh7XG4gICAgICAgICAgICBsZWZ0OiBwYXJlbnRSZWN0cy5sZWZ0LFxuICAgICAgICAgICAgdG9wOiBwYXJlbnRSZWN0cy50b3AsXG4gICAgICAgICAgICBiZWhhdmlvcjogJ3Ntb290aCdcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gcmV2ZWFsIGVsZW1lbnQgaW4gdmlld3BvcnRcbiAgICAgICAgdy5zY3JvbGxCeSh7XG4gICAgICAgICAgbGVmdDogY2xpZW50UmVjdHMubGVmdCxcbiAgICAgICAgICB0b3A6IGNsaWVudFJlY3RzLnRvcCxcbiAgICAgICAgICBiZWhhdmlvcjogJ3Ntb290aCdcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBjb21tb25qc1xuICAgIG1vZHVsZS5leHBvcnRzID0geyBwb2x5ZmlsbDogcG9seWZpbGwgfTtcbiAgfSBlbHNlIHtcbiAgICAvLyBnbG9iYWxcbiAgICBwb2x5ZmlsbCgpO1xuICB9XG5cbn0oKSk7XG4iLCJtb2R1bGUuZXhwb3J0cz1bXHJcbiAge1xyXG4gICAgXCJuYW1lXCI6IFwiQWdlbmNlIEZBUlwiLFxyXG4gICAgXCJhZGRyZXNzXCI6IFwiNDggQVYgZGVzIGZvcmNlcyBhcm1lZSByb3lhbGVzXCIsXHJcbiAgICBcImNpdHlcIjogXCJjYXNhYmxhbmNhXCIsXHJcbiAgICBcInR5cGVcIjogXCJhZ2VuY2VcIixcclxuICAgIFwiY29vcmRzXCI6IHtcclxuICAgICAgXCJlbWFpbFwiOiBcImpob25kb2VAZ21haWwuY29tXCIsXHJcbiAgICAgIFwicGhvbmVcIjogXCIwNjE4NjYxODY2XCIsXHJcbiAgICAgIFwiZmF4XCI6IFwiMDYxODY2MTg2NlwiLFxyXG4gICAgICBcImdwc1wiOiB7XHJcbiAgICAgICAgXCJsYW5nXCI6IDMzLjU1MTk1NTYsXHJcbiAgICAgICAgXCJsYXRcIjogLTcuNjkxMzY0NFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJleHRlbnNpb25cIjoge1xyXG4gICAgICBcIm5hbWVcIjogXCJBbC1ib3VjaHJhIENhc2FuZWFyc2hvcmVcIixcclxuICAgICAgXCJhZGRyZXNzXCI6IFwiNDggQVYgZGVzIGZvcmNlcyBhcm1lZSByb3lhbGVzXCJcclxuICAgIH0sXHJcbiAgICBcInRpbWV0YWJsZVwiOiB7XHJcbiAgICAgIFwibW9uZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcInR1ZXNkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwid2VkbmVzZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcInRodXJzZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcImZyaWRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJzYXR1cmRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJzdW5kYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCJcclxuICAgIH1cclxuICB9LFxyXG4gIHtcclxuICAgIFwibmFtZVwiOiBcIkFnZW5jZSBTRUlaRSAoMTYpIE5PVkVNQlJFXCIsXHJcbiAgICBcImFkZHJlc3NcIjogXCIzIFBsYWNlIGR1IDE2IG5vdmVtYnJlXCIsXHJcbiAgICBcImNpdHlcIjogXCJjYXNhYmxhbmNhXCIsXHJcbiAgICBcInR5cGVcIjogXCJhZ2VuY2VcIixcclxuICAgIFwiY29vcmRzXCI6IHtcclxuICAgICAgXCJlbWFpbFwiOiBcImpob25kb2VAZ21haWwuY29tXCIsXHJcbiAgICAgIFwicGhvbmVcIjogXCIwNjE4NjYxODY2XCIsXHJcbiAgICAgIFwiZmF4XCI6IFwiMDYxODY2MTg2NlwiLFxyXG4gICAgICBcImdwc1wiOiB7XHJcbiAgICAgICAgXCJsYW5nXCI6IDMzLjU2MTExMSxcclxuICAgICAgICBcImxhdFwiOiAtNy42NDg3OTI0XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImV4dGVuc2lvblwiOiB7XHJcbiAgICAgIFwibmFtZVwiOiBcIkFsLWJvdWNocmEgQ2FzYW5lYXJzaG9yZVwiLFxyXG4gICAgICBcImFkZHJlc3NcIjogXCI0OCBBViBkZXMgZm9yY2VzIGFybWVlIHJveWFsZXNcIlxyXG4gICAgfSxcclxuICAgIFwidGltZXRhYmxlXCI6IHtcclxuICAgICAgXCJtb25kYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwidHVlc2RheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJ3ZWRuZXNkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwidGh1cnNkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwiZnJpZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcInNhdHVyZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcInN1bmRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIlxyXG4gICAgfVxyXG4gIH0sXHJcbiAge1xyXG4gICAgXCJuYW1lXCI6IFwiQWdlbmNlIEZBUlwiLFxyXG4gICAgXCJhZGRyZXNzXCI6IFwiQWdlbmNlIFpFUktUT1VOSVwiLFxyXG4gICAgXCJjaXR5XCI6IFwiY2FzYWJsYW5jYVwiLFxyXG4gICAgXCJ0eXBlXCI6IFwiY2VudHJlcy1hZmZhaXJlc1wiLFxyXG4gICAgXCJjb29yZHNcIjoge1xyXG4gICAgICBcImVtYWlsXCI6IFwiamhvbmRvZUBnbWFpbC5jb21cIixcclxuICAgICAgXCJwaG9uZVwiOiBcIjA2MTg2NjE4NjZcIixcclxuICAgICAgXCJmYXhcIjogXCIwNjE4NjYxODY2XCIsXHJcbiAgICAgIFwiZ3BzXCI6IHtcclxuICAgICAgICBcImxhbmdcIjogMzMuNTg0NTY3MixcclxuICAgICAgICBcImxhdFwiOiAtNy42Mjk5MDk2XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImV4dGVuc2lvblwiOiB7XHJcbiAgICAgIFwibmFtZVwiOiBcIkFsLWJvdWNocmEgQ2FzYW5lYXJzaG9yZVwiLFxyXG4gICAgICBcImFkZHJlc3NcIjogXCI0OCBBViBkZXMgZm9yY2VzIGFybWVlIHJveWFsZXNcIlxyXG4gICAgfSxcclxuICAgIFwidGltZXRhYmxlXCI6IHtcclxuICAgICAgXCJtb25kYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwidHVlc2RheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJ3ZWRuZXNkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwidGh1cnNkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwiZnJpZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcInNhdHVyZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcInN1bmRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIlxyXG4gICAgfVxyXG4gIH0sXHJcbiAge1xyXG4gICAgXCJuYW1lXCI6IFwiQWdlbmNlIFJPTUFORElFXCIsXHJcbiAgICBcImFkZHJlc3NcIjogXCIzIGV0IDQsSW1tIFJvbWFuZGllIElJIGJvdWx2YXJkIEJpciBhbnphcmFuZVwiLFxyXG4gICAgXCJjaXR5XCI6IFwiY2FzYWJsYW5jYVwiLFxyXG4gICAgXCJ0eXBlXCI6IFwiYWdlbmNlXCIsXHJcbiAgICBcImNvb3Jkc1wiOiB7XHJcbiAgICAgIFwiZW1haWxcIjogXCJqaG9uZG9lQGdtYWlsLmNvbVwiLFxyXG4gICAgICBcInBob25lXCI6IFwiMDYxODY2MTg2NlwiLFxyXG4gICAgICBcImZheFwiOiBcIjA2MTg2NjE4NjZcIixcclxuICAgICAgXCJncHNcIjoge1xyXG4gICAgICAgIFwibGFuZ1wiOiAzMy41NzIyNjc4LFxyXG4gICAgICAgIFwibGF0XCI6IC03LjYyOTIyM1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJleHRlbnNpb25cIjoge1xyXG4gICAgICBcIm5hbWVcIjogXCJBbC1ib3VjaHJhIENhc2FuZWFyc2hvcmVcIixcclxuICAgICAgXCJhZGRyZXNzXCI6IFwiNDggQVYgZGVzIGZvcmNlcyBhcm1lZSByb3lhbGVzXCJcclxuICAgIH0sXHJcbiAgICBcInRpbWV0YWJsZVwiOiB7XHJcbiAgICAgIFwibW9uZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcInR1ZXNkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwid2VkbmVzZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcInRodXJzZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcImZyaWRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJzYXR1cmRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJzdW5kYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCJcclxuICAgIH1cclxuICB9LFxyXG4gIHtcclxuICAgIFwibmFtZVwiOiBcIkFnZW5jZSBIQUogT01BUiBBQkRFTEpBTElMXCIsXHJcbiAgICBcImFkZHJlc3NcIjogXCJLTSA3LCAzIFJvdXRlIGRlIFJhYmF0IEFpbiBzYmFhXCIsXHJcbiAgICBcImNpdHlcIjogXCJjYXNhYmxhbmNhXCIsXHJcbiAgICBcInR5cGVcIjogXCJyZXNlYXUtZXRyYW5nZXJcIixcclxuICAgIFwiY29vcmRzXCI6IHtcclxuICAgICAgXCJlbWFpbFwiOiBcImpob25kb2VAZ21haWwuY29tXCIsXHJcbiAgICAgIFwicGhvbmVcIjogXCIwNjE4NjYxODY2XCIsXHJcbiAgICAgIFwiZmF4XCI6IFwiMDYxODY2MTg2NlwiLFxyXG4gICAgICBcImdwc1wiOiB7XHJcbiAgICAgICAgXCJsYW5nXCI6IDMzLjU4MTAzMzYsXHJcbiAgICAgICAgXCJsYXRcIjogLTcuNTgxNDAxNVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJleHRlbnNpb25cIjoge1xyXG4gICAgICBcIm5hbWVcIjogXCJBbC1ib3VjaHJhIENhc2FuZWFyc2hvcmVcIixcclxuICAgICAgXCJhZGRyZXNzXCI6IFwiNDggQVYgZGVzIGZvcmNlcyBhcm1lZSByb3lhbGVzXCJcclxuICAgIH0sXHJcbiAgICBcInRpbWV0YWJsZVwiOiB7XHJcbiAgICAgIFwibW9uZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcInR1ZXNkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwid2VkbmVzZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcInRodXJzZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcImZyaWRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJzYXR1cmRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJzdW5kYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCJcclxuICAgIH1cclxuICB9LFxyXG4gIHtcclxuICAgIFwibmFtZVwiOiBcIkFnZW5jZSBQT1JURSBE4oCZQU5GQVwiLFxyXG4gICAgXCJhZGRyZXNzXCI6IFwiTsKwIDQgQU5HIEJEIETigJlhbmZhIGV0IHJ1ZSBtb3VsYXkgcmFjaGlkIEJQIDI0NVwiLFxyXG4gICAgXCJjaXR5XCI6IFwiY2FzYWJsYW5jYVwiLFxyXG4gICAgXCJ0eXBlXCI6IFwiYWdlbmNlXCIsXHJcbiAgICBcImNvb3Jkc1wiOiB7XHJcbiAgICAgIFwiZW1haWxcIjogXCJqaG9uZG9lQGdtYWlsLmNvbVwiLFxyXG4gICAgICBcInBob25lXCI6IFwiMDYxODY2MTg2NlwiLFxyXG4gICAgICBcImZheFwiOiBcIjA2MTg2NjE4NjZcIixcclxuICAgICAgXCJncHNcIjoge1xyXG4gICAgICAgIFwibGFuZ1wiOiAzMy41NzMwOSxcclxuICAgICAgICBcImxhdFwiOiAtNy42Mjg2OTc5XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImV4dGVuc2lvblwiOiB7XHJcbiAgICAgIFwibmFtZVwiOiBcIkFsLWJvdWNocmEgQ2FzYW5lYXJzaG9yZVwiLFxyXG4gICAgICBcImFkZHJlc3NcIjogXCI0OCBBViBkZXMgZm9yY2VzIGFybWVlIHJveWFsZXNcIlxyXG4gICAgfSxcclxuICAgIFwidGltZXRhYmxlXCI6IHtcclxuICAgICAgXCJtb25kYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwidHVlc2RheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJ3ZWRuZXNkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwidGh1cnNkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwiZnJpZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcInNhdHVyZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcInN1bmRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIlxyXG4gICAgfVxyXG4gIH0sXHJcbiAge1xyXG4gICAgXCJuYW1lXCI6IFwiQWdlbmNlIE9tYXJcIixcclxuICAgIFwiYWRkcmVzc1wiOiBcIjMgZXQgNCxJbW0gUm9tYW5kaWUgSUkgYm91bHZhcmQgQmlyIGFuemFyYW5lXCIsXHJcbiAgICBcImNpdHlcIjogXCJjYXNhYmxhbmNhXCIsXHJcbiAgICBcInR5cGVcIjogXCJnYWJcIixcclxuICAgIFwiY29vcmRzXCI6IHtcclxuICAgICAgXCJlbWFpbFwiOiBcImpob25kb2VAZ21haWwuY29tXCIsXHJcbiAgICAgIFwicGhvbmVcIjogXCIwNjE4NjYxODY2XCIsXHJcbiAgICAgIFwiZmF4XCI6IFwiMDYxODY2MTg2NlwiLFxyXG4gICAgICBcImdwc1wiOiB7XHJcbiAgICAgICAgXCJsYW5nXCI6IDMzLjU2MTc2MjMsXHJcbiAgICAgICAgXCJsYXRcIjogLTcuNjI0ODEzNlxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJleHRlbnNpb25cIjoge1xyXG4gICAgICBcIm5hbWVcIjogXCJBbC1ib3VjaHJhIENhc2FuZWFyc2hvcmVcIixcclxuICAgICAgXCJhZGRyZXNzXCI6IFwiNDggQVYgZGVzIGZvcmNlcyBhcm1lZSByb3lhbGVzXCJcclxuICAgIH0sXHJcbiAgICBcInRpbWV0YWJsZVwiOiB7XHJcbiAgICAgIFwibW9uZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcInR1ZXNkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwid2VkbmVzZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcInRodXJzZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcImZyaWRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJzYXR1cmRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJzdW5kYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCJcclxuICAgIH1cclxuICB9LFxyXG4gIHtcclxuICAgIFwibmFtZVwiOiBcIkFnZW5jZSBIQUogT01BUiBcIixcclxuICAgIFwiYWRkcmVzc1wiOiBcIktNIDcsIDMgUm91dGUgZGUgUmFiYXQgQWluIHNiYWFcIixcclxuICAgIFwiY2l0eVwiOiBcInJhYmF0XCIsXHJcbiAgICBcInR5cGVcIjogXCJnYWJcIixcclxuICAgIFwiY29vcmRzXCI6IHtcclxuICAgICAgXCJlbWFpbFwiOiBcImpob25kb2VAZ21haWwuY29tXCIsXHJcbiAgICAgIFwicGhvbmVcIjogXCIwNjE4NjYxODY2XCIsXHJcbiAgICAgIFwiZmF4XCI6IFwiMDYxODY2MTg2NlwiLFxyXG4gICAgICBcImdwc1wiOiB7XHJcbiAgICAgICAgXCJsYW5nXCI6IDMzLjU4NTYyOTcsXHJcbiAgICAgICAgXCJsYXRcIjogLTcuNjIxNjU3N1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJleHRlbnNpb25cIjoge1xyXG4gICAgICBcIm5hbWVcIjogXCJBbC1ib3VjaHJhIENhc2FuZWFyc2hvcmVcIixcclxuICAgICAgXCJhZGRyZXNzXCI6IFwiNDggQVYgZGVzIGZvcmNlcyBhcm1lZSByb3lhbGVzXCJcclxuICAgIH0sXHJcbiAgICBcInRpbWV0YWJsZVwiOiB7XHJcbiAgICAgIFwibW9uZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcInR1ZXNkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwid2VkbmVzZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcInRodXJzZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcImZyaWRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJzYXR1cmRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJzdW5kYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCJcclxuICAgIH1cclxuICB9LFxyXG4gIHtcclxuICAgIFwibmFtZVwiOiBcIkFnZW5jZSBQT1JURSBSYWJhdFwiLFxyXG4gICAgXCJhZGRyZXNzXCI6IFwiTsKwIDQgQU5HIEJEIETigJlhbmZhIGV0IHJ1ZSBtb3VsYXkgcmFjaGlkIEJQIDI0NVwiLFxyXG4gICAgXCJjaXR5XCI6IFwidGFuZ2VyXCIsXHJcbiAgICBcInR5cGVcIjogXCJjZW50cmVzLWFmZmFpcmVzXCIsXHJcbiAgICBcImNvb3Jkc1wiOiB7XHJcbiAgICAgIFwiZW1haWxcIjogXCJqaG9uZG9lQGdtYWlsLmNvbVwiLFxyXG4gICAgICBcInBob25lXCI6IFwiMDYxODY2MTg2NlwiLFxyXG4gICAgICBcImZheFwiOiBcIjA2MTg2NjE4NjZcIixcclxuICAgICAgXCJncHNcIjoge1xyXG4gICAgICAgIFwibGFuZ1wiOiAzMy41OTU1Mzg5LFxyXG4gICAgICAgIFwibGF0XCI6IC03LjY0NTkzNDNcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwidGltZXRhYmxlXCI6IHtcclxuICAgICAgXCJtb25kYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwidHVlc2RheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJ3ZWRuZXNkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwidGh1cnNkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwiZnJpZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcInNhdHVyZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcInN1bmRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIlxyXG4gICAgfSxcclxuICAgIFwiZXh0ZW5zaW9uXCI6IHtcclxuICAgICAgXCJuYW1lXCI6IFwiQWwtYm91Y2hyYSBDYXNhbmVhcnNob3JlXCIsXHJcbiAgICAgIFwiYWRkcmVzc1wiOiBcIjQ4IEFWIGRlcyBmb3JjZXMgYXJtZWUgcm95YWxlc1wiXHJcbiAgICB9XHJcbiAgfVxyXG5dXHJcbiIsImltcG9ydCBzZWxlY3QgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9zZWxlY3QtZmlsdGVyL2luZGV4LmpzJ1xyXG5pbXBvcnQgdG9wSGVhZGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvdG9wLWhlYWRlci9pbmRleC5qcydcclxuaW1wb3J0IGhlYWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL2hlYWRlci9pbmRleC5qcydcclxuaW1wb3J0IGZvb3RlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL2Zvb3Rlci9pbmRleC5qcydcclxuaW1wb3J0IGNhcmRTbGlkZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9jYXJkL2NhcmQtc2xpZGVyLmpzJ1xyXG5pbXBvcnQgZGF0ZVNsaWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL2RhdGUtc2xpZGVyL2RhdGUtc2xpZGVyLmpzJ1xyXG5pbXBvcnQgbG9nb1NsaWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL2xvZ28tc2xpZGVyL2luZGV4LmpzJ1xyXG5pbXBvcnQgZmluYW5jZSBmcm9tICcuLi8uLi9jb21wb25lbnRzL2ZpbmFuY2UvaW5kZXguanMnXHJcbmltcG9ydCBmaW5hbmNlRmlsdGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvZmluYW5jZS9maWx0ZXIuanMnXHJcbmltcG9ydCBiYW5xdWVzU2xpZGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvbm9zLWJhbnF1ZXMvaW5kZXguanMnXHJcbmltcG9ydCBob21lU2xpZGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvaG9tZS1zbGlkZXIvaW5kZXguanMnXHJcbmltcG9ydCBiZXNvaW5BaWRlIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvYmVzb2luLWFpZGUvaW5kZXguanMnXHJcbmltcG9ydCBzd2lwZWJveCBmcm9tICcuLi8uLi9jb21wb25lbnRzL3N3aXBlYm94L2luZGV4LmpzJ1xyXG5pbXBvcnQgYXJ0aWNsZVNsaWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL2FydGljbGUtc2xpZGVyL2luZGV4LmpzJ1xyXG5pbXBvcnQgY2FyZFJhcHBvcnQgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9jYXJkL2NhcmQtcmFwcG9ydC9jYXJkLXJhcHBvcnQuanMnXHJcbmltcG9ydCBwb3B1cFNlYXJjaCBmcm9tICcuLi8uLi9jb21wb25lbnRzL3BvcHVwLXNlYXJjaC9pbmRleC5qcydcclxuaW1wb3J0IHBvcHVwU2VhcmNoRmlsdGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvcG9wdXAtc2VhcmNoL2ZpbHRlci5qcydcclxuaW1wb3J0IHBvcHVwVmlkZW8gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9wb3B1cC12aWRlby9pbmRleC5qcydcclxuaW1wb3J0IGFjdHVhbGl0ZVNsaWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL2FjdHVhbGl0ZS1zbGlkZXIvaW5kZXguanMnXHJcbmltcG9ydCBwdWJTbGlkZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9wdWItc2xpZGVyL2luZGV4LmpzJ1xyXG5pbXBvcnQgZm9ybVZhbGlkYXRpb24gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9mb3JtL2Zvcm0tdmFsaWRhdGlvbi5qcydcclxuaW1wb3J0IGZvcm1VcGxvYWQgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9mb3JtL2Zvcm0tdXBsb2FkLmpzJ1xyXG5pbXBvcnQgY2FyZEFjdHVTbGlkZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9jYXJkL2NhcmQtYWN0dWFsaXRlcy5qcydcclxuaW1wb3J0IGNhcmRIaXN0b2lyZVNsaWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL2NhcmQvY2FyZC1oaXN0b2lyZS5qcydcclxuaW1wb3J0IGFwcGVsT2ZmZXJlcyBmcm9tICcuLi8uLi9jb21wb25lbnRzL2FwcGVsLW9mZnJlcy9pbmRleC5qcydcclxuaW1wb3J0IG1hcCBmcm9tICcuLi8uLi9jb21wb25lbnRzL21hcC9pbmRleC5qcydcclxuaW1wb3J0IHRpbWVsaW5lIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvdGltZWxpbmUvaW5kZXguanMnXHJcbmltcG9ydCB7XHJcbiAgbWFwQ29udHJvbCxcclxuICB0b2dnbGVDb250cm9sXHJcbn0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9tYXAtY29udHJvbC9pbmRleC5qcydcclxuaW1wb3J0IHNtb290aHNjcm9sbCBmcm9tICdzbW9vdGhzY3JvbGwtcG9seWZpbGwnXHJcbmltcG9ydCBhY3R1YWxpdGVGaWx0ZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9hY3R1YWxpdGVzL2luZGV4LmpzJ1xyXG5pbXBvcnQgbWVkaWFjZW50ZXJGaWx0ZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9tZWRpYWNlbnRlci9pbmRleC5qcydcclxuaW1wb3J0IGNvbW11bmlxdWVzRmlsdGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvY29tbXVuaXF1ZXMvaW5kZXguanMnXHJcbmltcG9ydCByZXN1bHRGaWx0ZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9yZXN1bHQvaW5kZXguanMnXHJcbmltcG9ydCBtZWRpYUdhbGxlcnkgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9tZWRpYS1nYWxsZXJ5L2luZGV4LmpzJ1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gIHNtb290aHNjcm9sbC5wb2x5ZmlsbCgpXHJcblxyXG4gIGlmICh0eXBlb2YgTm9kZUxpc3QucHJvdG90eXBlLmZvckVhY2ggIT09ICdmdW5jdGlvbicpIHtcclxuICAgIE5vZGVMaXN0LnByb3RvdHlwZS5mb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2hcclxuICB9XHJcblxyXG4gIGlmICghU3RyaW5nLnByb3RvdHlwZS5pbmNsdWRlcykge1xyXG4gICAgQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzID0gZnVuY3Rpb24gKHNlYXJjaCwgc3RhcnQpIHtcclxuICAgICAgaWYgKHR5cGVvZiBzdGFydCAhPT0gJ251bWJlcicpIHtcclxuICAgICAgICBzdGFydCA9IDBcclxuICAgICAgfVxyXG4gICAgICBpZiAoc3RhcnQgKyBzZWFyY2gubGVuZ3RoID4gdGhpcy5sZW5ndGgpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbmRleE9mKHNlYXJjaCwgc3RhcnQpICE9PSAtMVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZWxlY3QoKVxyXG4gIHRvcEhlYWRlcigpXHJcbiAgaGVhZGVyKClcclxuICBmb290ZXIoKVxyXG4gIGNhcmRTbGlkZXIoKVxyXG4gIGZpbmFuY2VGaWx0ZXIoKVxyXG4gIGRhdGVTbGlkZXIoKVxyXG4gIGxvZ29TbGlkZXIoKVxyXG4gIGZpbmFuY2UoKVxyXG4gIGJhbnF1ZXNTbGlkZXIoKVxyXG4gIGhvbWVTbGlkZXIoKVxyXG4gIGJlc29pbkFpZGUoKVxyXG4gIHN3aXBlYm94KClcclxuICBhcnRpY2xlU2xpZGVyKClcclxuICBjYXJkUmFwcG9ydCgpXHJcbiAgcG9wdXBTZWFyY2goKVxyXG4gIHBvcHVwVmlkZW8oKVxyXG4gIGFjdHVhbGl0ZVNsaWRlcigpXHJcbiAgcHViU2xpZGVyKClcclxuICBmb3JtVmFsaWRhdGlvbigpXHJcbiAgZm9ybVVwbG9hZCgpXHJcbiAgY2FyZEFjdHVTbGlkZXIoKVxyXG4gIGNhcmRIaXN0b2lyZVNsaWRlcigpXHJcbiAgbWFwKClcclxuICBtYXBDb250cm9sKClcclxuICB0b2dnbGVDb250cm9sKClcclxuICB0aW1lbGluZSgpXHJcbiAgYWN0dWFsaXRlRmlsdGVyKClcclxuICBhcHBlbE9mZmVyZXMoKVxyXG4gIG1lZGlhY2VudGVyRmlsdGVyKClcclxuICBjb21tdW5pcXVlc0ZpbHRlcigpXHJcbiAgcG9wdXBTZWFyY2hGaWx0ZXIoKVxyXG4gIHJlc3VsdEZpbHRlcigpXHJcbiAgbWVkaWFHYWxsZXJ5KClcclxufSlcclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG4gIGlmICgkKCcuYWN0dWFsaXRlLXNsaWRlcicpLmxlbmd0aCkge1xyXG5cclxuICAgIHZhciBydGwgPSAkKCdodG1sJykuYXR0cignZGlyJykgPT0gJ3J0bCc7XHJcblxyXG4gICAgaWYgKCQod2luZG93KS53aWR0aCgpID4gOTkxKSB7XHJcbiAgICAgIGFydGljbGVTbGlkZXIoMCwgcnRsKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYXJ0aWNsZVNsaWRlcigwLCBydGwpXHJcbiAgICB9XHJcblxyXG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDk5MSkge1xyXG4gICAgICAgIGFydGljbGVTbGlkZXIoMCwgcnRsKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFydGljbGVTbGlkZXIoMCwgcnRsKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYXJ0aWNsZVNsaWRlciAoc3RhZ2VQYWRkaW5nLCBydGwpIHtcclxuICAgICQoJy5hY3R1YWxpdGUtc2xpZGVyLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKHtcclxuICAgICAgc3RhZ2VQYWRkaW5nOiBzdGFnZVBhZGRpbmcsXHJcbiAgICAgIG1hcmdpbjogMTgsXHJcbiAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgIG5hdjogdHJ1ZSxcclxuICAgICAgbWVyZ2U6IHRydWUsXHJcbiAgICAgIGxvb3A6IHRydWUsXHJcbiAgICAgIHJ0bDogcnRsLFxyXG4gICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgMDoge1xyXG4gICAgICAgICAgaXRlbXM6IDFcclxuICAgICAgICB9LFxyXG4gICAgICAgIDk5Mjoge1xyXG4gICAgICAgICAgaXRlbXM6IDNcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBEYXRlRmlsdGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvZGF0ZS1maWx0ZXIvaW5kZXguanMnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IHRhZ0ZpbHRlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjYWN0dWFsaXRlLWZpbHRlcnMgYScpXHJcbiAgbGV0IGFjdHVhbGl0ZUhvbGRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhY3R1YWxpdGUtaG9sZGVyJylcclxuICBsZXQgc3RhcnREYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN0YXJ0JylcclxuICBsZXQgZW5kRGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lbmQnKVxyXG4gIGxldCBhbGxGaWx0ZXJCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYWN0dWFsaXRlLWZpbHRlci1hbGwnKVxyXG5cclxuICBpZiAodGFnRmlsdGVycy5sZW5ndGggPD0gMCB8fCAhYWN0dWFsaXRlSG9sZGVyKSByZXR1cm5cclxuXHJcbiAgbGV0IHN0YXRlID0ge1xyXG4gICAgZmlsdGVyczogW10sXHJcbiAgICBkYXRlRmlsdGVyOiB7XHJcbiAgICAgIGZyb206ICcnLFxyXG4gICAgICB0bzogJydcclxuICAgIH0sXHJcbiAgICBvcmRlcjogJ2Rlc2MnLFxyXG4gICAgbWF4OiAzLFxyXG4gICAgZGF0YTogW1xyXG4gICAgICB7XHJcbiAgICAgICAgdHlwZTogJ2FydGljbGUtaW1nJyxcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJywgJ0VOVFJFUFJFTkFSSUFUJ10sXHJcbiAgICAgICAgZGF0ZTogJzIxLzA3LzIwMTcnLFxyXG4gICAgICAgIHRpdGxlOiAndW5lIGFtYmlhbmNlIGZlc3RpdmUgZXQgZmFtaWxpYWxlIHF1ZSBz4oCZZXN0IGTDqXJvdWzDqScsXHJcbiAgICAgICAgY29udGVudDogJ0xlIEdyb3VwZSBCQ1AsIGFjdGV1ciBwYW5hZnJpY2FpbiBkZSByw6lmw6lyZW5jZSwgZXQgbGEgU29jacOpdMOpIEZpbmFUbmNpw6hyZSBJbnRlcm5hdGlvbmFsZSAoSUZDKS4uLicsXHJcbiAgICAgICAgaW1hZ2U6ICdhc3NldHMvaW1nL2FjdHUtMi5wbmcnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0eXBlOiAnYW5ub25jZScsXHJcbiAgICAgICAgdGFnczogWydSU0UnXSxcclxuICAgICAgICBkYXRlOiAnMjkvMDcvMjAxNycsXHJcbiAgICAgICAgY29udGVudDogYEEgbOKAmW9jY2FzaW9uIGRlIGxhIEpvdXJuw6llIEludGVybmF0aW9uYWxlIGRlIGxhIEZlbW1lLCBsYSA8YSBocmVmPVwiaHR0cHM6Ly90d2l0dGVyLmNvbS9oYXNodGFnL0JhbnF1ZV9Qb3B1bGFpcmVcIiB0YXJnZXQ9XCJfYmxhbmtcIj4jQmFucXVlX1BvcHVsYWlyZTwvYT4gcHLDqXNlbnRlIMOgIHRvdXRlcyBsZXMgZmVtbWVzIHNlcyB2xZN1eCBsZXMgcGx1cyBzaW5jw6hyZXMgZGUgcsOpdXNzaXRlIGV0IGRlIHByb3Nww6lyaXTDqS4gPGEgaHJlZj1cImh0dHBzOi8vdHdpdHRlci5jb20vaGFzaHRhZy84bWFyc1wiICB0YXJnZXQ9XCJfYmxhbmtcIj4jOG1hcnM8L2E+IDxhIGhyZWY9XCJodHRwczovL3R3aXR0ZXIuY29tL2hhc2h0YWcvY29ycG9cIiAgdGFyZ2V0PVwiX2JsYW5rXCI+I2NvcnBvPC9hPlxyXG4gICAgICAgIGBcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHR5cGU6ICdhcnRpY2xlJyxcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdFTlRSRVBSRU5BUklBVCddLFxyXG4gICAgICAgIGRhdGU6ICcyMi8wNy8yMDE3JyxcclxuICAgICAgICB0aXRsZTogJ3VuZSBhbWJpYW5jZSBmZXN0aXZlIGV0IGZhbWlsaWFsZSBxdWUgc+KAmWVzdCBkw6lyb3Vsw6knLFxyXG4gICAgICAgIGNvbnRlbnQ6ICdMZSBHcm91cGUgQkNQLCBhY3RldXIgcGFuYWZyaWNhaW4gZGUgcsOpZsOpcmVuY2UsIGV0IGxhIFNvY2nDqXTDqSBGaW5hVG5jacOocmUgSW50ZXJuYXRpb25hbGUgKElGQykuLi4nXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0eXBlOiAnYXJ0aWNsZScsXHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnREVWRUxPUFBFTUVOVCBEVVJBQkxFJ10sXHJcbiAgICAgICAgZGF0ZTogJzIzLzA3LzIwMTcnLFxyXG4gICAgICAgIHRpdGxlOiAndW5lIGFtYmlhbmNlIGZlc3RpdmUgZXQgZmFtaWxpYWxlIHF1ZSBz4oCZZXN0IGTDqXJvdWzDqScsXHJcbiAgICAgICAgY29udGVudDogJ0xlIEdyb3VwZSBCQ1AsIGFjdGV1ciBwYW5hZnJpY2FpbiBkZSByw6lmw6lyZW5jZSwgZXQgbGEgU29jacOpdMOpIEZpbmFUbmNpw6hyZSBJbnRlcm5hdGlvbmFsZSAoSUZDKS4uLidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHR5cGU6ICdhcnRpY2xlJyxcclxuICAgICAgICB0YWdzOiBbJ1JTRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8wNy8yMDE3JyxcclxuICAgICAgICB0aXRsZTogJ3VuZSBhbWJpYW5jZSBmZXN0aXZlIGV0IGZhbWlsaWFsZSBxdWUgc+KAmWVzdCBkw6lyb3Vsw6knLFxyXG4gICAgICAgIGNvbnRlbnQ6ICdMZSBHcm91cGUgQkNQLCBhY3RldXIgcGFuYWZyaWNhaW4gZGUgcsOpZsOpcmVuY2UsIGV0IGxhIFNvY2nDqXTDqSBGaW5hVG5jacOocmUgSW50ZXJuYXRpb25hbGUgKElGQykuLi4nXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0eXBlOiAnYXJ0aWNsZScsXHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgIGRhdGU6ICcyNC8wNy8yMDE3JyxcclxuICAgICAgICB0aXRsZTogJ3VuZSBhbWJpYW5jZSBmZXN0aXZlIGV0IGZhbWlsaWFsZSBxdWUgc+KAmWVzdCBkw6lyb3Vsw6knLFxyXG4gICAgICAgIGNvbnRlbnQ6ICdMZSBHcm91cGUgQkNQLCBhY3RldXIgcGFuYWZyaWNhaW4gZGUgcsOpZsOpcmVuY2UsIGV0IGxhIFNvY2nDqXTDqSBGaW5hVG5jacOocmUgSW50ZXJuYXRpb25hbGUgKElGQykuLi4nXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0eXBlOiAnYXJ0aWNsZS1pbWcnLFxyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0ZJTkFOQ0UnXSxcclxuICAgICAgICBkYXRlOiAnMjUvMDcvMjAxNycsXHJcbiAgICAgICAgdGl0bGU6ICd1bmUgYW1iaWFuY2UgZmVzdGl2ZSBldCBmYW1pbGlhbGUgcXVlIHPigJllc3QgZMOpcm91bMOpJyxcclxuICAgICAgICBjb250ZW50OiAnTGUgR3JvdXBlIEJDUCwgYWN0ZXVyIHBhbmFmcmljYWluIGRlIHLDqWbDqXJlbmNlLCBldCBsYSBTb2Npw6l0w6kgRmluYVRuY2nDqHJlIEludGVybmF0aW9uYWxlIChJRkMpLi4uJyxcclxuICAgICAgICBpbWFnZTogJ2Fzc2V0cy9pbWcvYWN0dS0xLnBuZydcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHR5cGU6ICdhcnRpY2xlJyxcclxuICAgICAgICB0YWdzOiBbJ1JTRSddLFxyXG4gICAgICAgIGRhdGU6ICcyNi8wNy8yMDE3JyxcclxuICAgICAgICB0aXRsZTogJ3VuZSBhbWJpYW5jZSBmZXN0aXZlIGV0IGZhbWlsaWFsZSBxdWUgc+KAmWVzdCBkw6lyb3Vsw6knLFxyXG4gICAgICAgIGNvbnRlbnQ6ICdMZSBHcm91cGUgQkNQLCBhY3RldXIgcGFuYWZyaWNhaW4gZGUgcsOpZsOpcmVuY2UsIGV0IGxhIFNvY2nDqXTDqSBGaW5hVG5jacOocmUgSW50ZXJuYXRpb25hbGUgKElGQykuLi4nXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0eXBlOiAnYXJ0aWNsZScsXHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8wNy8yMDE3JyxcclxuICAgICAgICB0aXRsZTogJ3VuZSBhbWJpYW5jZSBmZXN0aXZlIGV0IGZhbWlsaWFsZSBxdWUgc+KAmWVzdCBkw6lyb3Vsw6knLFxyXG4gICAgICAgIGNvbnRlbnQ6ICdMZSBHcm91cGUgQkNQLCBhY3RldXIgcGFuYWZyaWNhaW4gZGUgcsOpZsOpcmVuY2UsIGV0IGxhIFNvY2nDqXTDqSBGaW5hVG5jacOocmUgSW50ZXJuYXRpb25hbGUgKElGQykuLi4nXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0eXBlOiAnYXJ0aWNsZS1pbWcnLFxyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0ZJTkFOQ0UnXSxcclxuICAgICAgICBkYXRlOiAnMjEvMDgvMjAxNycsXHJcbiAgICAgICAgdGl0bGU6ICd1bmUgYW1iaWFuY2UgZmVzdGl2ZSBldCBmYW1pbGlhbGUgcXVlIHPigJllc3QgZMOpcm91bMOpJyxcclxuICAgICAgICBjb250ZW50OiAnTGUgR3JvdXBlIEJDUCwgYWN0ZXVyIHBhbmFmcmljYWluIGRlIHLDqWbDqXJlbmNlLCBldCBsYSBTb2Npw6l0w6kgRmluYVRuY2nDqHJlIEludGVybmF0aW9uYWxlIChJRkMpLi4uJyxcclxuICAgICAgICBpbWFnZTogJ2Fzc2V0cy9pbWcvYWN0dS0xLnBuZydcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHR5cGU6ICdhcnRpY2xlJyxcclxuICAgICAgICB0YWdzOiBbJ1JTRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMi8wOC8yMDE2JyxcclxuICAgICAgICB0aXRsZTogJ3VuZSBhbWJpYW5jZSBmZXN0aXZlIGV0IGZhbWlsaWFsZSBxdWUgc+KAmWVzdCBkw6lyb3Vsw6knLFxyXG4gICAgICAgIGNvbnRlbnQ6ICdMZSBHcm91cGUgQkNQLCBhY3RldXIgcGFuYWZyaWNhaW4gZGUgcsOpZsOpcmVuY2UsIGV0IGxhIFNvY2nDqXTDqSBGaW5hVG5jacOocmUgSW50ZXJuYXRpb25hbGUgKElGQykuLi4nXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0eXBlOiAnYXJ0aWNsZScsXHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8wOS8yMDE3JyxcclxuICAgICAgICB0aXRsZTogJ3VuZSBhbWJpYW5jZSBmZXN0aXZlIGV0IGZhbWlsaWFsZSBxdWUgc+KAmWVzdCBkw6lyb3Vsw6knLFxyXG4gICAgICAgIGNvbnRlbnQ6ICdMZSBHcm91cGUgQkNQLCBhY3RldXIgcGFuYWZyaWNhaW4gZGUgcsOpZsOpcmVuY2UsIGV0IGxhIFNvY2nDqXTDqSBGaW5hVG5jacOocmUgSW50ZXJuYXRpb25hbGUgKElGQykuLi4nXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0eXBlOiAnYXJ0aWNsZS1pbWcnLFxyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0ZJTkFOQ0UnXSxcclxuICAgICAgICBkYXRlOiAnMjEvMTAvMjAxNycsXHJcbiAgICAgICAgdGl0bGU6ICd1bmUgYW1iaWFuY2UgZmVzdGl2ZSBldCBmYW1pbGlhbGUgcXVlIHPigJllc3QgZMOpcm91bMOpJyxcclxuICAgICAgICBjb250ZW50OiAnTGUgR3JvdXBlIEJDUCwgYWN0ZXVyIHBhbmFmcmljYWluIGRlIHLDqWbDqXJlbmNlLCBldCBsYSBTb2Npw6l0w6kgRmluYVRuY2nDqHJlIEludGVybmF0aW9uYWxlIChJRkMpLi4uJyxcclxuICAgICAgICBpbWFnZTogJ2Fzc2V0cy9pbWcvYWN0dS0xLnBuZydcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHR5cGU6ICdhcnRpY2xlJyxcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJ10sXHJcbiAgICAgICAgZGF0ZTogJzIxLzA3LzIwMTgnLFxyXG4gICAgICAgIHRpdGxlOiAndW5lIGFtYmlhbmNlIGZlc3RpdmUgZXQgZmFtaWxpYWxlIHF1ZSBz4oCZZXN0IGTDqXJvdWzDqScsXHJcbiAgICAgICAgY29udGVudDogJ0xlIEdyb3VwZSBCQ1AsIGFjdGV1ciBwYW5hZnJpY2FpbiBkZSByw6lmw6lyZW5jZSwgZXQgbGEgU29jacOpdMOpIEZpbmFUbmNpw6hyZSBJbnRlcm5hdGlvbmFsZSAoSUZDKS4uLidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHR5cGU6ICdhcnRpY2xlLWltZycsXHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8wNy8yMDE4JyxcclxuICAgICAgICB0aXRsZTogJ3VuZSBhbWJpYW5jZSBmZXN0aXZlIGV0IGZhbWlsaWFsZSBxdWUgc+KAmWVzdCBkw6lyb3Vsw6knLFxyXG4gICAgICAgIGNvbnRlbnQ6ICdMZSBHcm91cGUgQkNQLCBhY3RldXIgcGFuYWZyaWNhaW4gZGUgcsOpZsOpcmVuY2UsIGV0IGxhIFNvY2nDqXTDqSBGaW5hVG5jacOocmUgSW50ZXJuYXRpb25hbGUgKElGQykuLi4nLFxyXG4gICAgICAgIGltYWdlOiAnYXNzZXRzL2ltZy9hY3R1LTEucG5nJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdHlwZTogJ2FydGljbGUnLFxyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0ZJTkFOQ0UnXSxcclxuICAgICAgICBkYXRlOiAnMjEvMDcvMjAxOScsXHJcbiAgICAgICAgdGl0bGU6ICd1bmUgYW1iaWFuY2UgZmVzdGl2ZSBldCBmYW1pbGlhbGUgcXVlIHPigJllc3QgZMOpcm91bMOpJyxcclxuICAgICAgICBjb250ZW50OiAnTGUgR3JvdXBlIEJDUCwgYWN0ZXVyIHBhbmFmcmljYWluIGRlIHLDqWbDqXJlbmNlLCBldCBsYSBTb2Npw6l0w6kgRmluYVRuY2nDqHJlIEludGVybmF0aW9uYWxlIChJRkMpLi4uJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdHlwZTogJ2FydGljbGUtaW1nJyxcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJ10sXHJcbiAgICAgICAgZGF0ZTogJzIxLzA3LzIwMjAnLFxyXG4gICAgICAgIHRpdGxlOiAndW5lIGFtYmlhbmNlIGZlc3RpdmUgZXQgZmFtaWxpYWxlIHF1ZSBz4oCZZXN0IGTDqXJvdWzDqScsXHJcbiAgICAgICAgY29udGVudDogJ0xlIEdyb3VwZSBCQ1AsIGFjdGV1ciBwYW5hZnJpY2FpbiBkZSByw6lmw6lyZW5jZSwgZXQgbGEgU29jacOpdMOpIEZpbmFUbmNpw6hyZSBJbnRlcm5hdGlvbmFsZSAoSUZDKS4uLicsXHJcbiAgICAgICAgaW1hZ2U6ICdhc3NldHMvaW1nL2FjdHUtMS5wbmcnXHJcbiAgICAgIH1cclxuICAgIF1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNsZWFuVGFnICh0YWdGaWx0ZXIpIHtcclxuICAgIHRhZ0ZpbHRlciA9IHRhZ0ZpbHRlci50cmltKCkudG9Mb3dlckNhc2UoKVxyXG4gICAgaWYgKHRhZ0ZpbHRlclswXSA9PSAnIycpIHtcclxuICAgICAgcmV0dXJuIHRhZ0ZpbHRlci5zbGljZSgxKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0YWdGaWx0ZXJcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG1ha2VEYXRlT2JqZWN0IChkYXRlU3RyaW5nKSB7XHJcbiAgICBsZXQgW2RheSwgbW9udGgsIHllYXJdID0gZGF0ZVN0cmluZy5zcGxpdCgnLycpXHJcblxyXG4gICAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoIC0gMSwgZGF5KVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYXBwbHlGaWx0ZXJzICgpIHtcclxuICAgIGxldCBkYXRhID0gc3RhdGUuZGF0YVxyXG4gICAgaWYgKHN0YXRlLmZpbHRlcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICBkYXRhID0gZGF0YS5maWx0ZXIocG9zdCA9PiB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGF0ZS5maWx0ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAocG9zdC50YWdzLmluY2x1ZGVzKHN0YXRlLmZpbHRlcnNbaV0udG9VcHBlckNhc2UoKSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHN0YXRlLmRhdGVGaWx0ZXIuZnJvbSAmJiBzdGF0ZS5kYXRlRmlsdGVyLnRvKSB7XHJcbiAgICAgIGRhdGEgPSBkYXRhLmZpbHRlcihwb3N0ID0+IHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICBtYWtlRGF0ZU9iamVjdChwb3N0LmRhdGUpIC0gbWFrZURhdGVPYmplY3Qoc3RhdGUuZGF0ZUZpbHRlci5mcm9tKSA+PVxyXG4gICAgICAgICAgICAwICYmXHJcbiAgICAgICAgICBtYWtlRGF0ZU9iamVjdChwb3N0LmRhdGUpIC0gbWFrZURhdGVPYmplY3Qoc3RhdGUuZGF0ZUZpbHRlci50bykgPD0gMFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGRhdGEgPSBkYXRhLnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgcmV0dXJuIHN0YXRlLm9yZGVyID09ICdkZXNjJ1xyXG4gICAgICAgID8gbWFrZURhdGVPYmplY3QoYi5kYXRlKSAtIG1ha2VEYXRlT2JqZWN0KGEuZGF0ZSlcclxuICAgICAgICA6IG1ha2VEYXRlT2JqZWN0KGEuZGF0ZSkgLSBtYWtlRGF0ZU9iamVjdChiLmRhdGUpXHJcbiAgICB9KVxyXG5cclxuICAgIHNob3dTZWxlY3RlZChkYXRhKVxyXG4gIH1cclxuICBmdW5jdGlvbiBjaGFuZ2VGaWx0ZXJzIChlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuXHJcbiAgICB0aGlzLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpXHJcblxyXG4gICAgc3RhdGUuZmlsdGVycyA9IFtdXHJcblxyXG4gICAgdGFnRmlsdGVycy5mb3JFYWNoKGZ1bmN0aW9uICh0YWcpIHtcclxuICAgICAgaWYgKCQodGFnKS5oYXNDbGFzcygnYWN0aXZlJykpIHtcclxuICAgICAgICBzdGF0ZS5maWx0ZXJzLnB1c2goY2xlYW5UYWcodGFnLmlubmVyVGV4dCkpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgaWYgKHN0YXRlLmZpbHRlcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICBhbGxGaWx0ZXJCdG4uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFsbEZpbHRlckJ0bi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5RmlsdGVycygpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzaG93U2VsZWN0ZWQgKGRhdGEpIHtcclxuICAgIGxldCBzZWxlY3RlZERhdGEgPSBkYXRhLnNsaWNlKDAsIHN0YXRlLm1heCAqIDMpXHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coZGF0YS5sZW5ndGgpXHJcbiAgICAvLyBjb25zb2xlLmxvZyhzZWxlY3RlZERhdGEubGVuZ3RoKVxyXG5cclxuICAgIGlmIChzZWxlY3RlZERhdGEubGVuZ3RoID49IGRhdGEubGVuZ3RoKSB7XHJcbiAgICAgICQoJyNtb3JlLWFjdHVhbGl0ZScpLmhpZGUoKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgnI21vcmUtYWN0dWFsaXRlJykuc2hvdygpXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHNlbGVjdGVkRGF0YSlcclxuICB9XHJcblxyXG4gIGFwcGx5RmlsdGVycygpXHJcblxyXG4gICQoJyNtb3JlLWFjdHVhbGl0ZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIHN0YXRlLm1heCsrXHJcbiAgICBhcHBseUZpbHRlcnMoKVxyXG5cclxuICAgIHRoaXMuc2Nyb2xsSW50b1ZpZXcoe1xyXG4gICAgICBiZWhhdmlvcjogJ3Ntb290aCcsXHJcbiAgICAgIGlubGluZTogJ2VuZCdcclxuICAgIH0pXHJcbiAgICBpZiAoc3RhdGUubWF4ICsgMSA+IHN0YXRlLmRhdGEubGVuZ3RoIC8gMykgJCh0aGlzKS5oaWRlKClcclxuICB9KVxyXG5cclxuICBmdW5jdGlvbiByZW5kZXIgKGRhdGEpIHtcclxuICAgIGFjdHVhbGl0ZUhvbGRlci5pbm5lckhUTUwgPSBkYXRhXHJcbiAgICAgIC5tYXAocG9zdCA9PiB7XHJcbiAgICAgICAgaWYgKHBvc3QudHlwZSA9PT0gJ2FydGljbGUnKSB7XHJcbiAgICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBjb2wtbGctNCBtYi0yXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBjYXJkLS1hY3R1YWxpdGVzXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZF90YWdzXCI+XHJcbiAgICAgICAgICAgICR7cG9zdC50YWdzXHJcbiAgICAgICAgICAgIC5tYXAodGFnID0+IHtcclxuICAgICAgICAgICAgICByZXR1cm4gYDxhIGNsYXNzPVwiYnRuIGJ0bi0tdGFnIGJ0bi0tb3JhbmdlIG1yLTFcIiBocmVmPVwiL2dicC1mcm9udC9hY3R1YWxpdGVzLmh0bWxcIj5cclxuICAgICAgICAgICAgICAgICAgICAjJHt0YWd9XHJcbiAgICAgICAgICAgICAgICAgIDwvYT5gXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5qb2luKCcnKX1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPHAgY2xhc3M9XCJjYXJkX2RhdGVcIj5cclxuICAgICAgICAgICAgICAke3Bvc3QuZGF0ZX1cclxuICAgICAgICAgIDwvcD5cclxuICAgICAgICAgIDxhIGNsYXNzPVwiY2FyZF90aXRsZVwiIGhyZWY9XCIvZ2JwLWZyb250L25ld3MtZGV0YWlsLmh0bWxcIj5cclxuICAgICAgICAgICR7cG9zdC50aXRsZX1cclxuICAgICAgICA8L2E+XHJcbiAgICAgICAgICA8cCBjbGFzcz1cImNhcmRfZGVzY1wiPlxyXG4gICAgICAgICAgICAke3Bvc3QuY29udGVudH1cclxuICAgICAgICAgIDwvcD5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJjbGVhcmZpeCBwb3NpdGlvbi1yZWxhdGl2ZVwiPlxyXG4gICAgICAgICAgICAgIDxhIGNsYXNzPVwiY2FyZF9saW5rXCIgaHJlZj1cIi9nYnAtZnJvbnQvbmV3cy1kZXRhaWwuaHRtbFwiPlxyXG4gICAgICAgICAgICBlbiBzYXZvaXIgcGx1c1xyXG4gICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgIDxhIGNsYXNzPVwiY2FyZF9zaGFyZVwiIGhyZWY9XCIvZGlzdC9uZXdzLWRldGFpbC5odG1sXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxzdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi1zaGFyZS1zeW1ib2xcIj48L3VzZT5cclxuICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgIDx1bCBjbGFzcz1cInNoYXJlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9zaGFyZS5waHA/dT1cIiBvbmNsaWNrPVwiamF2YXNjcmlwdDp3aW5kb3cub3Blbih0aGlzLmhyZWYsJycsICdtZW51YmFyPW5vLHRvb2xiYXI9bm8scmVzaXphYmxlPXllcyxzY3JvbGxiYXJzPXllcyxoZWlnaHQ9NjAwLHdpZHRoPTYwMCcpO3JldHVybiBmYWxzZTtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyBjbGFzcz1cImZiXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi1mYWNlYm9va1wiPjwvdXNlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJodHRwczovL3R3aXR0ZXIuY29tL2ludGVudC90d2VldD90ZXh0PXRleHQtcGFydGFnZSZhbXA7dXJsPVwiIG9uY2xpY2s9XCJqYXZhc2NyaXB0OndpbmRvdy5vcGVuKHRoaXMuaHJlZiwnJywgJ21lbnViYXI9bm8sdG9vbGJhcj1ubyxyZXNpemFibGU9eWVzLHNjcm9sbGJhcnM9eWVzLGhlaWdodD02MDAsd2lkdGg9NjAwJyk7cmV0dXJuIGZhbHNlO1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIGNsYXNzPVwidHdpdHRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPVwiI2ljb24tdHdpdHRlclwiPjwvdXNlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJodHRwczovL3BsdXMuZ29vZ2xlLmNvbS9zaGFyZT91cmw9aHR0cHM6Ly9wbHVzLmdvb2dsZS5jb21cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2Zz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj1cIiNpY29uLWdvb2dsZS1wbHVzXCI+PC91c2U+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cImh0dHBzOi8vYXBpLndoYXRzYXBwLmNvbS9zZW5kP3RleHQ9dGV4dC13aGF0c2FwcCZhbXA7dXJsPVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPVwiI2ljb24td2hhdHNhcHBcIj48L3VzZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgYFxyXG4gICAgICAgIH0gZWxzZSBpZiAocG9zdC50eXBlID09PSAnYXJ0aWNsZS1pbWcnKSB7XHJcbiAgICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBjb2wtbGctOCBtYi0yXCI+PGRpdiBjbGFzcz1cImNhcmQgY2FyZC0tYWN0dWFsaXRlcyBjYXJkLS1hY3R1YWxpdGVzLWltZyBjbGVhcmZpeFwiPlxyXG4gICAgICAgICAgPGEgY2xhc3M9XCJpbWctd3JhcHBlclwiIGhyZWY9XCIvZ2JwLWZyb250L25ld3MtZGV0YWlsLmh0bWxcIj5cclxuICAgICAgICAgICAgICA8aW1nIHNyYz1cIiR7cG9zdC5pbWFnZX1cIiBhbHQ9XCJcIj5cclxuICAgICAgICAgIDwvYT5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3cmFwcGVyXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmRfdGFnc1wiPlxyXG4gICAgICAgICAgICAgICR7cG9zdC50YWdzXHJcbiAgICAgICAgICAgIC5tYXAodGFnID0+IHtcclxuICAgICAgICAgICAgICByZXR1cm4gYDxhIGNsYXNzPVwiYnRuIGJ0bi0tdGFnIGJ0bi0tb3JhbmdlIG1yLTFcIiBocmVmPVwiL2dicC1mcm9udC9hY3R1YWxpdGVzLmh0bWxcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgIyR7dGFnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9hPmBcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmpvaW4oJycpfVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxwIGNsYXNzPVwiY2FyZF9kYXRlXCI+XHJcbiAgICAgICAgICAgICAgICAgICR7cG9zdC5kYXRlfVxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8YSBjbGFzcz1cImNhcmRfdGl0bGVcIiBocmVmPVwiL2dicC1mcm9udC9uZXdzLWRldGFpbC5odG1sXCI+XHJcbiAgICAgICAgICAgICAgICAke3Bvc3QudGl0bGV9XHJcbiAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgPHAgY2xhc3M9XCJjYXJkX2Rlc2NcIj5cclxuICAgICAgICAgICAgICAke3Bvc3QuY29udGVudH1cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNsZWFyZml4IHBvc2l0aW9uLXJlbGF0aXZlXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwiY2FyZF9saW5rXCIgaHJlZj1cIi9nYnAtZnJvbnQvbmV3cy1kZXRhaWwuaHRtbFwiPlxyXG4gICAgICAgICAgICAgIGVuIHNhdm9pciBwbHVzXHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJjYXJkX3NoYXJlXCIgaHJlZj1cIiNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPVwiI2ljb24tc2hhcmUtc3ltYm9sXCI+PC91c2U+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJzaGFyZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vc2hhcmUucGhwP3U9XCIgb25jbGljaz1cImphdmFzY3JpcHQ6d2luZG93Lm9wZW4odGhpcy5ocmVmLCcnLCAnbWVudWJhcj1ubyx0b29sYmFyPW5vLHJlc2l6YWJsZT15ZXMsc2Nyb2xsYmFycz15ZXMsaGVpZ2h0PTYwMCx3aWR0aD02MDAnKTtyZXR1cm4gZmFsc2U7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgY2xhc3M9XCJmYlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPVwiI2ljb24tZmFjZWJvb2tcIj48L3VzZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiaHR0cHM6Ly90d2l0dGVyLmNvbS9pbnRlbnQvdHdlZXQ/dGV4dD10ZXh0LXBhcnRhZ2UmYW1wO3VybD1cIiBvbmNsaWNrPVwiamF2YXNjcmlwdDp3aW5kb3cub3Blbih0aGlzLmhyZWYsJycsICdtZW51YmFyPW5vLHRvb2xiYXI9bm8scmVzaXphYmxlPXllcyxzY3JvbGxiYXJzPXllcyxoZWlnaHQ9NjAwLHdpZHRoPTYwMCcpO3JldHVybiBmYWxzZTtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyBjbGFzcz1cInR3aXR0ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj1cIiNpY29uLXR3aXR0ZXJcIj48L3VzZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiaHR0cHM6Ly9wbHVzLmdvb2dsZS5jb20vc2hhcmU/dXJsPWh0dHBzOi8vcGx1cy5nb29nbGUuY29tXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi1nb29nbGUtcGx1c1wiPjwvdXNlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJodHRwczovL2FwaS53aGF0c2FwcC5jb20vc2VuZD90ZXh0PXRleHQtd2hhdHNhcHAmYW1wO3VybD1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2Zz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj1cIiNpY29uLXdoYXRzYXBwXCI+PC91c2U+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+PC9kaXY+XHJcbiAgICAgICAgICBgXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGNvbC1sZy00IG1iLTJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgY2FyZC0tYWN0dWFsaXRlcyBjYXJkLS1hY3R1YWxpdGVzLWFubm9uY2VcIj5cclxuICAgICAgICAgICAgICA8aW1nIHNyYz1cImFzc2V0cy9pbWcvdHdpdHRlci5wbmdcIiBhbHQ9XCJcIj5cclxuICAgICAgICAgICAgICA8cCBjbGFzcz1cImNhcmRfZGVzY1wiPlxyXG4gICAgICAgICAgICAgICAgJHtwb3N0LmNvbnRlbnR9XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxhIGNsYXNzPVwiY2FyZF9saW5rXCIgaHJlZj1cImh0dHA6Ly93d3cudHdpdHRlci5jb20vQlBfTWFyb2NcIiB0YXJnZXQ9XCJfYmxhbmtcIj5cclxuICAgICAgICAgICAgICAgIFR3aXR0ZXIuY29tL0JQX01hcm9jXHJcbiAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICBgXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuam9pbignJylcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGRhdGVGb3JtYXQgKGRhdGUpIHtcclxuICAgIHJldHVybiBgMS8ke2RhdGUubW9udGgoKSArIDF9LyR7ZGF0ZS55ZWFyKCl9YFxyXG4gIH1cclxuXHJcbiAgbGV0IHN0YXJ0RmlsdGVyID0gbmV3IERhdGVGaWx0ZXIoc3RhcnREYXRlLCBmYWxzZSwgZnVuY3Rpb24gKHN0YXJ0KSB7XHJcbiAgICBzdGF0ZS5kYXRlRmlsdGVyLmZyb20gPSBkYXRlRm9ybWF0KHN0YXJ0KVxyXG4gICAgYXBwbHlGaWx0ZXJzKClcclxuICB9KVxyXG4gIHN0YXJ0RmlsdGVyLmluaXQoKVxyXG5cclxuICBsZXQgZW5kRmlsdGVyID0gbmV3IERhdGVGaWx0ZXIoZW5kRGF0ZSwgdHJ1ZSwgZnVuY3Rpb24gKGVuZCkge1xyXG4gICAgc3RhdGUuZGF0ZUZpbHRlci50byA9IGRhdGVGb3JtYXQoZW5kKVxyXG4gICAgYXBwbHlGaWx0ZXJzKClcclxuICB9KVxyXG4gIGVuZEZpbHRlci5pbml0KClcclxuXHJcbiAgJCgnI2FjdHVhbGl0ZS1zZWxlY3QtZmlsdGVyJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBzZWxlY3RlZCA9ICQoJyNhY3R1YWxpdGUtc2VsZWN0LWZpbHRlcicpLm5leHQoKS5maW5kKCcuY3VycmVudCcpLnRleHQoKVxyXG4gICAgc2VsZWN0ZWQgPSBzZWxlY3RlZC50b0xvd2VyQ2FzZSgpXHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coc2VsZWN0ZWQpXHJcblxyXG4gICAgJCgnI2RhdGUtZmlsdGVyJykuYWRkQ2xhc3MoJ2QtZmxleCcpXHJcbiAgICAkKCcjZGF0ZS1maWx0ZXInKS5zaG93KClcclxuXHJcbiAgICBpZiAoc2VsZWN0ZWQgIT09ICdww6lyaW9kZScpIHtcclxuICAgICAgJCgnI2RhdGUtZmlsdGVyJykucmVtb3ZlQ2xhc3MoJ2QtZmxleCcpXHJcbiAgICAgICQoJyNkYXRlLWZpbHRlcicpLmhpZGUoKVxyXG4gICAgICBzdGF0ZS5vcmRlciA9ICdkZXNjJ1xyXG4gICAgICBzdGF0ZS5kYXRlRmlsdGVyLmZyb20gPSAnJ1xyXG4gICAgICBzdGF0ZS5kYXRlRmlsdGVyLnRvID0gJydcclxuICAgICAgc3RhcnRGaWx0ZXIuY2xlYXIoKVxyXG4gICAgICBlbmRGaWx0ZXIuY2xlYXIoKVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChzZWxlY3RlZCA9PT0gJ3BsdXMgYW5jaWVucycpIHtcclxuICAgICAgc3RhdGUub3JkZXIgPSAnYXNjJ1xyXG4gICAgICBhcHBseUZpbHRlcnMoKVxyXG4gICAgfSBlbHNlIGlmIChzZWxlY3RlZCA9PT0gJ3BsdXMgcsOpY2VudHMnKSB7XHJcbiAgICAgIGFwcGx5RmlsdGVycygpXHJcbiAgICAgIHN0YXRlLm9yZGVyID0gJ2Rlc2MnXHJcbiAgICB9XHJcbiAgfSlcclxuXHJcbiAgYWxsRmlsdGVyQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgc3RhdGUuZmlsdGVycyA9IFtdXHJcbiAgICB0YWdGaWx0ZXJzLmZvckVhY2godGFnID0+IHtcclxuICAgICAgdGFnLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICB9KVxyXG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgYXBwbHlGaWx0ZXJzKClcclxuICB9KVxyXG4gIHRhZ0ZpbHRlcnMuZm9yRWFjaCh0YWcgPT4ge1xyXG4gICAgdGFnLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2hhbmdlRmlsdGVycylcclxuICB9KVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgYXBwZWxPZmZyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYXBwZWwtb2ZmcmVzJylcclxuXHJcbiAgaWYgKCFhcHBlbE9mZnJlcykgcmV0dXJuXHJcblxyXG4gIGxldCBzdGF0ZSA9IHtcclxuICAgIG9yZ2FuaXNtZTogJycsXHJcbiAgICBuYXR1cmU6ICcnLFxyXG4gICAgZGF0YTogW1xyXG4gICAgICB7XHJcbiAgICAgICAgb3JnYW5pc21lOiAnb3JnYW5pc21lMScsXHJcbiAgICAgICAgbmF0dXJlOiAnbmF0dXJlMScsXHJcbiAgICAgICAgZGF0ZXM6IHtcclxuICAgICAgICAgIHB1YjogJzEyLzEyLzIwMjAnLFxyXG4gICAgICAgICAgZGVwbzogJzEyLzEyLzIwMjInXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0aXRsZTogJ0xhIEJhbnF1ZSBDZW50cmFsZSBQb3B1bGFpcmUgbGFuY2UgdW4gYXBwZWwgZOKAmW9mZnJlcyBvdXZlcnQgcmVsYXRpZiBhdSDCqyBNQVJDSEUgQ0FEUkUgQUNRVUlTSVRJT04gREUgU1RZTE9TIFBST01PVElPTk5FTFMgwrsuJyxcclxuICAgICAgICBudW1lcm86ICdOwrAgOiBBTyAwMTQtMTggLSBQcm9yb2dhdGlvbidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG9yZ2FuaXNtZTogJ29yZ2FuaXNtZTEnLFxyXG4gICAgICAgIG5hdHVyZTogJ25hdHVyZTEnLFxyXG4gICAgICAgIGRhdGVzOiB7XHJcbiAgICAgICAgICBwdWI6ICcxMi8xMi8yMDIwJyxcclxuICAgICAgICAgIGRlcG86ICcxMi8xMi8yMDIyJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGl0bGU6ICdMYSBCYW5xdWUgQ2VudHJhbGUgUG9wdWxhaXJlIGxhbmNlIHVuIGFwcGVsIGTigJlvZmZyZXMgb3V2ZXJ0IHJlbGF0aWYgYXUgwqsgTUFSQ0hFIENBRFJFIEFDUVVJU0lUSU9OIERFIFNUWUxPUyBQUk9NT1RJT05ORUxTIMK7LicsXHJcbiAgICAgICAgbnVtZXJvOiAnTsKwIDogQU8gMDE0LTE4IC0gUHJvcm9nYXRpb24nXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBvcmdhbmlzbWU6ICdvcmdhbmlzbWUyJyxcclxuICAgICAgICBuYXR1cmU6ICduYXR1cmUxJyxcclxuICAgICAgICBkYXRlczoge1xyXG4gICAgICAgICAgcHViOiAnMTIvMTIvMjAyMCcsXHJcbiAgICAgICAgICBkZXBvOiAnMTIvMTIvMjAyMidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRpdGxlOiAnTGEgQmFucXVlIENlbnRyYWxlIFBvcHVsYWlyZSBsYW5jZSB1biBhcHBlbCBk4oCZb2ZmcmVzIG91dmVydCByZWxhdGlmIGF1IMKrIE1BUkNIRSBDQURSRSBBQ1FVSVNJVElPTiBERSBTVFlMT1MgUFJPTU9USU9OTkVMUyDCuy4nLFxyXG4gICAgICAgIG51bWVybzogJ07CsCA6IEFPIDAxNC0xOCAtIFByb3JvZ2F0aW9uJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgb3JnYW5pc21lOiAnb3JnYW5pc21lMScsXHJcbiAgICAgICAgbmF0dXJlOiAnbmF0dXJlMScsXHJcbiAgICAgICAgZGF0ZXM6IHtcclxuICAgICAgICAgIHB1YjogJzEyLzEyLzIwMjAnLFxyXG4gICAgICAgICAgZGVwbzogJzEyLzEyLzIwMjInXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0aXRsZTogJ0xhIEJhbnF1ZSBDZW50cmFsZSBQb3B1bGFpcmUgbGFuY2UgdW4gYXBwZWwgZOKAmW9mZnJlcyBvdXZlcnQgcmVsYXRpZiBhdSDCqyBNQVJDSEUgQ0FEUkUgQUNRVUlTSVRJT04gREUgU1RZTE9TIFBST01PVElPTk5FTFMgwrsuJyxcclxuICAgICAgICBudW1lcm86ICdOwrAgOiBBTyAwMTQtMTggLSBQcm9yb2dhdGlvbidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG9yZ2FuaXNtZTogJ29yZ2FuaXNtZTEnLFxyXG4gICAgICAgIG5hdHVyZTogJ25hdHVyZTEnLFxyXG4gICAgICAgIGRhdGVzOiB7XHJcbiAgICAgICAgICBwdWI6ICcxMi8xMi8yMDIwJyxcclxuICAgICAgICAgIGRlcG86ICcxMi8xMi8yMDIyJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGl0bGU6ICdMYSBCYW5xdWUgQ2VudHJhbGUgUG9wdWxhaXJlIGxhbmNlIHVuIGFwcGVsIGTigJlvZmZyZXMgb3V2ZXJ0IHJlbGF0aWYgYXUgwqsgTUFSQ0hFIENBRFJFIEFDUVVJU0lUSU9OIERFIFNUWUxPUyBQUk9NT1RJT05ORUxTIMK7LicsXHJcbiAgICAgICAgbnVtZXJvOiAnTsKwIDogQU8gMDE0LTE4IC0gUHJvcm9nYXRpb24nXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBvcmdhbmlzbWU6ICdvcmdhbmlzbWUyJyxcclxuICAgICAgICBuYXR1cmU6ICduYXR1cmUxJyxcclxuICAgICAgICBkYXRlczoge1xyXG4gICAgICAgICAgcHViOiAnMTIvMTIvMjAyMCcsXHJcbiAgICAgICAgICBkZXBvOiAnMTIvMTIvMjAyMidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRpdGxlOiAnTGEgQmFucXVlIENlbnRyYWxlIFBvcHVsYWlyZSBsYW5jZSB1biBhcHBlbCBk4oCZb2ZmcmVzIG91dmVydCByZWxhdGlmIGF1IMKrIE1BUkNIRSBDQURSRSBBQ1FVSVNJVElPTiBERSBTVFlMT1MgUFJPTU9USU9OTkVMUyDCuy4nLFxyXG4gICAgICAgIG51bWVybzogJ07CsCA6IEFPIDAxNC0xOCAtIFByb3JvZ2F0aW9uJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgb3JnYW5pc21lOiAnb3JnYW5pc21lMicsXHJcbiAgICAgICAgbmF0dXJlOiAnbmF0dXJlMScsXHJcbiAgICAgICAgZGF0ZXM6IHtcclxuICAgICAgICAgIHB1YjogJzEyLzEyLzIwMjAnLFxyXG4gICAgICAgICAgZGVwbzogJzEyLzEyLzIwMjInXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0aXRsZTogJ0xhIEJhbnF1ZSBDZW50cmFsZSBQb3B1bGFpcmUgbGFuY2UgdW4gYXBwZWwgZOKAmW9mZnJlcyBvdXZlcnQgcmVsYXRpZiBhdSDCqyBNQVJDSEUgQ0FEUkUgQUNRVUlTSVRJT04gREUgU1RZTE9TIFBST01PVElPTk5FTFMgwrsuJyxcclxuICAgICAgICBudW1lcm86ICdOwrAgOiBBTyAwMTQtMTggLSBQcm9yb2dhdGlvbidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG9yZ2FuaXNtZTogJ29yZ2FuaXNtZTMnLFxyXG4gICAgICAgIG5hdHVyZTogJ25hdHVyZTInLFxyXG4gICAgICAgIGRhdGVzOiB7XHJcbiAgICAgICAgICBwdWI6ICcxMi8xMi8yMDIwJyxcclxuICAgICAgICAgIGRlcG86ICcxMi8xMi8yMDIyJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGl0bGU6ICdMYSBCYW5xdWUgQ2VudHJhbGUgUG9wdWxhaXJlIGxhbmNlIHVuIGFwcGVsIGTigJlvZmZyZXMgb3V2ZXJ0IHJlbGF0aWYgYXUgwqsgTUFSQ0hFIENBRFJFIEFDUVVJU0lUSU9OIERFIFNUWUxPUyBQUk9NT1RJT05ORUxTIMK7LicsXHJcbiAgICAgICAgbnVtZXJvOiAnTsKwIDogQU8gMDE0LTE4IC0gUHJvcm9nYXRpb24nXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBvcmdhbmlzbWU6ICdvcmdhbmlzbWU0JyxcclxuICAgICAgICBuYXR1cmU6ICduYXR1cmUxJyxcclxuICAgICAgICBkYXRlczoge1xyXG4gICAgICAgICAgcHViOiAnMTIvMTIvMjAyMCcsXHJcbiAgICAgICAgICBkZXBvOiAnMTIvMTIvMjAyMidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRpdGxlOiAnTGEgQmFucXVlIENlbnRyYWxlIFBvcHVsYWlyZSBsYW5jZSB1biBhcHBlbCBk4oCZb2ZmcmVzIG91dmVydCByZWxhdGlmIGF1IMKrIE1BUkNIRSBDQURSRSBBQ1FVSVNJVElPTiBERSBTVFlMT1MgUFJPTU9USU9OTkVMUyDCuy4nLFxyXG4gICAgICAgIG51bWVybzogJ07CsCA6IEFPIDAxNC0xOCAtIFByb3JvZ2F0aW9uJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgb3JnYW5pc21lOiAnb3JnYW5pc21lNCcsXHJcbiAgICAgICAgbmF0dXJlOiAnbmF0dXJlMScsXHJcbiAgICAgICAgZGF0ZXM6IHtcclxuICAgICAgICAgIHB1YjogJzEyLzEyLzIwMjAnLFxyXG4gICAgICAgICAgZGVwbzogJzEyLzEyLzIwMjInXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0aXRsZTogJ0xhIEJhbnF1ZSBDZW50cmFsZSBQb3B1bGFpcmUgbGFuY2UgdW4gYXBwZWwgZOKAmW9mZnJlcyBvdXZlcnQgcmVsYXRpZiBhdSDCqyBNQVJDSEUgQ0FEUkUgQUNRVUlTSVRJT04gREUgU1RZTE9TIFBST01PVElPTk5FTFMgwrsuJyxcclxuICAgICAgICBudW1lcm86ICdOwrAgOiBBTyAwMTQtMTggLSBQcm9yb2dhdGlvbidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG9yZ2FuaXNtZTogJ29yZ2FuaXNtZTUnLFxyXG4gICAgICAgIG5hdHVyZTogJ25hdHVyZTEnLFxyXG4gICAgICAgIGRhdGVzOiB7XHJcbiAgICAgICAgICBwdWI6ICcxMi8xMi8yMDIwJyxcclxuICAgICAgICAgIGRlcG86ICcxMi8xMi8yMDIyJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGl0bGU6ICdMYSBCYW5xdWUgQ2VudHJhbGUgUG9wdWxhaXJlIGxhbmNlIHVuIGFwcGVsIGTigJlvZmZyZXMgb3V2ZXJ0IHJlbGF0aWYgYXUgwqsgTUFSQ0hFIENBRFJFIEFDUVVJU0lUSU9OIERFIFNUWUxPUyBQUk9NT1RJT05ORUxTIMK7LicsXHJcbiAgICAgICAgbnVtZXJvOiAnTsKwIDogQU8gMDE0LTE4IC0gUHJvcm9nYXRpb24nXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBvcmdhbmlzbWU6ICdvcmdhbmlzbWUzJyxcclxuICAgICAgICBuYXR1cmU6ICduYXR1cmUxJyxcclxuICAgICAgICBkYXRlczoge1xyXG4gICAgICAgICAgcHViOiAnMTIvMTIvMjAyMCcsXHJcbiAgICAgICAgICBkZXBvOiAnMTIvMTIvMjAyMidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRpdGxlOiAnTGEgQmFucXVlIENlbnRyYWxlIFBvcHVsYWlyZSBsYW5jZSB1biBhcHBlbCBk4oCZb2ZmcmVzIG91dmVydCByZWxhdGlmIGF1IMKrIE1BUkNIRSBDQURSRSBBQ1FVSVNJVElPTiBERSBTVFlMT1MgUFJPTU9USU9OTkVMUyDCuy4nLFxyXG4gICAgICAgIG51bWVybzogJ07CsCA6IEFPIDAxNC0xOCAtIFByb3JvZ2F0aW9uJ1xyXG4gICAgICB9XHJcbiAgICBdXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhcHBseUZpbHRlciAoKSB7XHJcbiAgICBsZXQgZGF0YSA9IHN0YXRlLmRhdGEuZmlsdGVyKG9mZmVyID0+IHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICBzdGF0ZS5vcmdhbmlzbWUgPT09IG9mZmVyLm9yZ2FuaXNtZSAmJiBzdGF0ZS5uYXR1cmUgPT09IG9mZmVyLm5hdHVyZVxyXG4gICAgICApXHJcbiAgICB9KVxyXG5cclxuICAgIHJlbmRlcihkYXRhKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVuZGVyIChkYXRhKSB7XHJcbiAgICBhcHBlbE9mZnJlcy5pbm5lckhUTUwgPSBkYXRhXHJcbiAgICAgIC5tYXAob2ZmZXIgPT4ge1xyXG4gICAgICAgIHJldHVybiBgPGEgY2xhc3M9XCJuZXdzXCIgaHJlZj1cIi9nYnAtZnJvbnQvbmV3cy1kZXRhaWwuaHRtbFwiPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibmV3c19ib3JkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJuZXdzX2NvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibmV3c19kYXRlIGNsZWFyZml4XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInB1YmxpY2F0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIERhdGUgZGUgcHVibGljYXRpb24gIDogJHtvZmZlci5kYXRlcy5wdWJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cImxpbWl0ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRlIGxpbWl0ZSBkZSBkw6lwb3QgZGUgZG9zc2llciA6ICR7b2ZmZXIuZGF0ZXMuZGVwb31cclxuICAgICAgICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8aDIgY2xhc3M9XCJuZXdzX3RpdGxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgJHtvZmZlci50aXRsZX1cclxuICAgICAgICAgICAgICAgICAgICA8L2gyPlxyXG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwibmV3c190eHRcIj5cclxuICAgICAgICAgICAgICAgICAgICAke29mZmVyLm51bWVyb31cclxuICAgICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9hPmBcclxuICAgICAgfSlcclxuICAgICAgLmpvaW4oJycpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpbml0ICgpIHtcclxuICAgIHN0YXRlLm9yZ2FuaXNtZSA9ICQoJyNhcHBlbC1vZmZyZXMtc2VsZWN0X29yZ2FuaXNtZScpXHJcbiAgICAgIC5uZXh0KClcclxuICAgICAgLmZpbmQoJy5jdXJyZW50JylcclxuICAgICAgLnRleHQoKVxyXG4gICAgICAudG9Mb3dlckNhc2UoKVxyXG4gICAgc3RhdGUubmF0dXJlID0gJCgnI2FwcGVsLW9mZnJlcy1zZWxlY3RfbmF0dXJlJylcclxuICAgICAgLm5leHQoKVxyXG4gICAgICAuZmluZCgnLmN1cnJlbnQnKVxyXG4gICAgICAudGV4dCgpXHJcbiAgICAgIC50b0xvd2VyQ2FzZSgpXHJcbiAgICBhcHBseUZpbHRlcigpXHJcbiAgfVxyXG4gIGluaXQoKVxyXG5cclxuICAkKCcjYXBwZWwtb2ZmcmVzLXNlbGVjdF9vcmdhbmlzbWUnKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgc3RhdGUub3JnYW5pc21lID0gJCgnI2FwcGVsLW9mZnJlcy1zZWxlY3Rfb3JnYW5pc21lJylcclxuICAgICAgLm5leHQoKVxyXG4gICAgICAuZmluZCgnLmN1cnJlbnQnKVxyXG4gICAgICAudGV4dCgpXHJcbiAgICAgIC50b0xvd2VyQ2FzZSgpXHJcbiAgICBhcHBseUZpbHRlcigpXHJcbiAgfSlcclxuICAkKCcjYXBwZWwtb2ZmcmVzLXNlbGVjdF9uYXR1cmUnKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgc3RhdGUubmF0dXJlID0gJCgnI2FwcGVsLW9mZnJlcy1zZWxlY3RfbmF0dXJlJylcclxuICAgICAgLm5leHQoKVxyXG4gICAgICAuZmluZCgnLmN1cnJlbnQnKVxyXG4gICAgICAudGV4dCgpXHJcbiAgICAgIC50b0xvd2VyQ2FzZSgpXHJcbiAgICBhcHBseUZpbHRlcigpXHJcbiAgfSlcclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcclxuXHRpZiAoJCgnLmFydGljbGUtc2xpZGVyJykubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgIHZhciBydGwgPSAkKCdodG1sJykuYXR0cignZGlyJykgPT0gJ3J0bCc7XHJcblxyXG5cdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gOTkxKSB7XHJcblx0XHRcdGFydGljbGVTbGlkZXIoMCwgcnRsKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGFydGljbGVTbGlkZXIoMzIsIHJ0bCk7XHJcblx0XHR9XHJcblxyXG5cdFx0JCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDk5MSkge1xyXG5cdFx0XHRcdGFydGljbGVTbGlkZXIoMCwgcnRsKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRhcnRpY2xlU2xpZGVyKDMyLCBydGwpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBhcnRpY2xlU2xpZGVyKHN0YWdlUGFkZGluZywgcnRsKSB7XHJcbiAgICAgICAgJCgnLmFydGljbGUtc2xpZGVyLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgc3RhZ2VQYWRkaW5nOiBzdGFnZVBhZGRpbmcsXHJcbiAgICAgICAgICAgIG1hcmdpbjogMTAsXHJcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgIG5hdjogdHJ1ZSxcclxuICAgICAgICAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICAgICAgIHJ0bDogcnRsLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDFcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA5OTI6IHtcclxuICAgICAgICAgICAgICAgIFx0aXRlbXM6IDNcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoJCgnLmJlc29pbi1haWRlJykubGVuZ3RoKSB7XHJcblxyXG5cdFx0JCgnLmJlc29pbi1haWRlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHQkKCcucXVlc3Rpb25zJykudG9nZ2xlQ2xhc3MoJ2Qtbm9uZScpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG5cclxuXHRpZiAoJCgnLmNhcmQtYWN0dWFsaXRlcy1zbGlkZXInKS5sZW5ndGgpIHtcclxuXHJcbiAgICAgICAgdmFyIHJ0bCA9ICQoJ2h0bWwnKS5hdHRyKCdkaXInKSA9PSAncnRsJztcclxuXHJcblx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPD0gOTkxKSB7XHJcbiAgICAgICAgICAgIFxyXG5cdFx0XHRjYXJkQWN0dVNsaWRlcig0OCwgcnRsKTtcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgJCgnLmNhcmQtYWN0dWFsaXRlcy1zbGlkZXInKS5vd2xDYXJvdXNlbCgnZGVzdHJveScpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG5cdFx0JCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA8PSA5OTEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAkKCcuY2FyZC1hY3R1YWxpdGVzLXNsaWRlcicpLm93bENhcm91c2VsKCdkZXN0cm95Jyk7XHJcblx0XHRcdFx0Y2FyZEFjdHVTbGlkZXIoNDgsIHJ0bCk7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICQoJy5jYXJkLWFjdHVhbGl0ZXMtc2xpZGVyJykub3dsQ2Fyb3VzZWwoJ2Rlc3Ryb3knKTtcclxuICAgICAgICAgICAgfVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjYXJkQWN0dVNsaWRlcihzdGFnZVBhZGRpbmcsIHJ0bCkge1xyXG4gICAgICAgICQoJy5jYXJkLWFjdHVhbGl0ZXMtc2xpZGVyLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgc3RhZ2VQYWRkaW5nOiBzdGFnZVBhZGRpbmcsXHJcbiAgICAgICAgICAgIG1hcmdpbjogMTYsXHJcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgIG5hdjogZmFsc2UsXHJcbiAgICAgICAgICAgIHJ0bDogcnRsLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0aWYgKCQoJy5jYXJkLWhpc3RvaXJlLXNsaWRlcicpLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgdmFyIHJ0bCA9ICQoJ2h0bWwnKS5hdHRyKCdkaXInKSA9PSAncnRsJztcclxuXHJcblx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPD0gNzY4KSB7XHJcblxyXG5cdFx0XHRjYXJkSGlzdG9pcmVTbGlkZXIoNDgsIHJ0bCk7XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCgnLmNhcmQtaGlzdG9pcmUtc2xpZGVyJykub3dsQ2Fyb3VzZWwoJ2Rlc3Ryb3knKTtcclxuXHRcdH1cclxuXHJcblx0XHQkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKCQod2luZG93KS53aWR0aCgpIDw9IDc2OCkge1xyXG5cclxuXHRcdFx0XHRjYXJkSGlzdG9pcmVTbGlkZXIoNDgsIHJ0bCk7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCQoJy5jYXJkLWhpc3RvaXJlLXNsaWRlcicpLm93bENhcm91c2VsKCdkZXN0cm95Jyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY2FyZEhpc3RvaXJlU2xpZGVyKHN0YWdlUGFkZGluZywgcnRsKSB7XHJcbiAgICAgICAgJCgnLmNhcmQtaGlzdG9pcmUtc2xpZGVyLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgc3RhZ2VQYWRkaW5nOiBzdGFnZVBhZGRpbmcsXHJcbiAgICAgICAgICAgIG1hcmdpbjogNSxcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgbmF2OiBmYWxzZSxcclxuICAgICAgICAgICAgcnRsOiBydGwsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHtcclxuICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogMVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG5cdGlmICgkKCcuY2FyZC0tcmFwcG9ydC1yaWdodCcpLmxlbmd0aCkge1xyXG5cclxuXHRcdHZhciBydGwgPSAkKCdodG1sJykuYXR0cignZGlyJykgPT0gJ3J0bCc7XHJcblxyXG5cdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblx0XHRcdHJhcHBvcnRTbGlkZXIoMCwgcnRsKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJhcHBvcnRTbGlkZXIoMCwgcnRsKTtcclxuXHRcdH1cclxuXHJcblx0XHQkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblx0XHRcdFx0cmFwcG9ydFNsaWRlcigwLCBydGwpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJhcHBvcnRTbGlkZXIoMCwgcnRsKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcmFwcG9ydFNsaWRlcihzdGFnZVBhZGRpbmcsIHJ0bCkge1xyXG4gICAgICAgIHZhciBvd2wgPSAkKCcuY2FyZC0tcmFwcG9ydC1yaWdodC5vd2wtY2Fyb3VzZWwnKS5vd2xDYXJvdXNlbCh7XHJcbiAgICAgICAgICAgIHN0YWdlUGFkZGluZzogc3RhZ2VQYWRkaW5nLFxyXG4gICAgICAgICAgICBtYXJnaW46IDAsXHJcbiAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICBuYXY6IGZhbHNlLFxyXG4gICAgICAgICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgICAgICAgcnRsOiBydGwsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHtcclxuICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogMVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcuY2FyZC0tcmFwcG9ydC1yaWdodCAud3JhcHBlcl9idG4gLm5leHQnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdCAgICBvd2wudHJpZ2dlcignbmV4dC5vd2wuY2Fyb3VzZWwnKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIEdvIHRvIHRoZSBwcmV2aW91cyBpdGVtXHJcblx0XHQkKCcuY2FyZC0tcmFwcG9ydC1yaWdodCAud3JhcHBlcl9idG4gLnByZXYnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdCAgICAvLyBXaXRoIG9wdGlvbmFsIHNwZWVkIHBhcmFtZXRlclxyXG5cdFx0ICAgIC8vIFBhcmFtZXRlcnMgaGFzIHRvIGJlIGluIHNxdWFyZSBicmFja2V0ICdbXSdcclxuXHRcdCAgICBvd2wudHJpZ2dlcigncHJldi5vd2wuY2Fyb3VzZWwnKTtcclxuXHRcdH0pO1xyXG5cclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0aWYgKCQoJy5jYXJkLXNsaWRlci13cmFwcGVyJykubGVuZ3RoKSB7XHJcblxyXG5cdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblx0XHRcdGNhcmRTbGlkZXJQYWdlKDE2KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNhcmRTbGlkZXJQYWdlKDApO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuXHRcdFx0XHRjYXJkU2xpZGVyUGFnZSgxNik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y2FyZFNsaWRlclBhZ2UoMCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY2FyZFNsaWRlclBhZ2Uoc3RhZ2VQYWRkaW5nKSB7XHJcbiAgICAgICAgJCgnLmNhcmQtc2xpZGVyLXdyYXBwZXIub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBzdGFnZVBhZGRpbmc6IHN0YWdlUGFkZGluZyxcclxuICAgICAgICAgICAgbWFyZ2luOiAxNixcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgbmF2OiB0cnVlLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDFcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA3Njg6IHtcclxuICAgICAgICAgICAgICAgIFx0aXRlbXM6IDJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA5OTI6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogNFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IERhdGVGaWx0ZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9kYXRlLWZpbHRlci9pbmRleC5qcydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgdGFnRmlsdGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNjb21tdW5pcXVlcy1maWx0ZXJzIGEnKVxyXG4gIGxldCBjb21tdW5pcXVlc0hvbGRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb21tdW5pcXVlcy1ob2xkZXInKVxyXG4gIGxldCBzdGFydERhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3RhcnQnKVxyXG4gIGxldCBlbmREYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVuZCcpXHJcbiAgbGV0IGFsbEZpbHRlckJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb21tdW5pcXVlcy1maWx0ZXItYWxsJylcclxuXHJcbiAgaWYgKHRhZ0ZpbHRlcnMubGVuZ3RoIDw9IDAgfHwgIWNvbW11bmlxdWVzSG9sZGVyKSByZXR1cm5cclxuXHJcbiAgbGV0IHN0YXRlID0ge1xyXG4gICAgZmlsdGVyczogW10sXHJcbiAgICBkYXRlRmlsdGVyOiB7XHJcbiAgICAgIGZyb206ICcnLFxyXG4gICAgICB0bzogJydcclxuICAgIH0sXHJcbiAgICBvcmRlcjogJ2Rlc2MnLFxyXG4gICAgbWF4OiAzLFxyXG4gICAgZGF0YTogW1xyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRScsICdFTlRSRVBSRU5BUklBVCddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8wNy8yMDE3JyxcclxuICAgICAgICB0aXRsZTogJ0xlIEdyb3VwZSBCQ1AgbGFuY2UgbGEgcHIgZW1pw6hyZSBiYW5xdWUgbWFyb2NhaW5lIGTDqWRpw6llIMOgIGzigJlhY3Rpdml0w6kg4oCcdGl0cmVz4oCdJyxcclxuICAgICAgICBzaXplOiA0NTAsXHJcbiAgICAgICAgdHlwZTogJ3BkZidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRhZ3M6IFsnUlNFJ10sXHJcbiAgICAgICAgdGl0bGU6ICdMZSBHcm91cGUgQkNQIGxhbmNlIGxhIHByIGVtacOocmUgYmFucXVlIG1hcm9jYWluZSBkw6lkacOpZSDDoCBs4oCZYWN0aXZpdMOpIOKAnHRpdHJlc+KAnScsXHJcbiAgICAgICAgZGF0ZTogJzI5LzA3LzIwMTcnLFxyXG4gICAgICAgIHNpemU6IDQ1MCxcclxuICAgICAgICB0eXBlOiAncGRmJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRU5UUkVQUkVOQVJJQVQnXSxcclxuICAgICAgICBkYXRlOiAnMjIvMDcvMjAxNycsXHJcbiAgICAgICAgdGl0bGU6ICdMZSBHcm91cGUgQkNQIGxhbmNlIGxhIHByZW1pw6hyZSBiYW5xdWUgbWFyb2NhaW5lIGTDqWRpw6llIMOgIGzigJlhY3Rpdml0w6kg4oCcdGl0cmVz4oCdJyxcclxuICAgICAgICBzaXplOiA0NTAsXHJcbiAgICAgICAgdHlwZTogJ3BkZidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0RFVkVMT1BQRU1FTlQgRFVSQUJMRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMy8wNy8yMDE3JyxcclxuICAgICAgICB0aXRsZTogJ0xlIEdyb3VwZSBCQ1AgbGFuY2UgbGEgcHJlbWnDqHJlIGJhbnF1ZSBtYXJvY2FpbmUgZMOpZGnDqWUgw6AgbOKAmWFjdGl2aXTDqSDigJx0aXRyZXPigJ0nLFxyXG4gICAgICAgIHNpemU6IDQ1MCxcclxuICAgICAgICB0eXBlOiAncGRmJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnXSxcclxuICAgICAgICBkYXRlOiAnMjEvMDcvMjAxNycsXHJcbiAgICAgICAgdGl0bGU6ICdMZSBHcm91cGUgQkNQIGxhbmNlIGxhIHByZW1pw6hyZSBiYW5xdWUgbWFyb2NhaW5lIGTDqWRpw6llIMOgIGzigJlhY3Rpdml0w6kg4oCcdGl0cmVz4oCdJyxcclxuICAgICAgICBzaXplOiA0NTAsXHJcbiAgICAgICAgdHlwZTogJ3BkZidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0ZJTkFOQ0UnXSxcclxuICAgICAgICBkYXRlOiAnMjQvMDcvMjAxNycsXHJcbiAgICAgICAgdGl0bGU6ICdMZSBHcm91cGUgQkNQIGxhbmNlIGxhIHByZW1pw6hyZSBiYW5xdWUgbWFyb2NhaW5lIGTDqWRpw6llIMOgIGzigJlhY3Rpdml0w6kg4oCcdGl0cmVz4oCdJyxcclxuICAgICAgICBzaXplOiA0NTAsXHJcbiAgICAgICAgdHlwZTogJ3BkZidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0ZJTkFOQ0UnXSxcclxuICAgICAgICBkYXRlOiAnMjUvMDcvMjAxNycsXHJcbiAgICAgICAgdGl0bGU6ICdMZSBHcm91cGUgQkNQIGxhbmNlIGxhIHByZW1pw6hyZSBiYW5xdWUgbWFyb2NhaW5lIGTDqWRpw6llIMOgIGzigJlhY3Rpdml0w6kg4oCcdGl0cmVz4oCdJyxcclxuICAgICAgICBzaXplOiA0NTAsXHJcbiAgICAgICAgdHlwZTogJ3BkZidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRhZ3M6IFsnUlNFJ10sXHJcbiAgICAgICAgZGF0ZTogJzI2LzA3LzIwMTcnLFxyXG4gICAgICAgIHRpdGxlOiAnTGUgR3JvdXBlIEJDUCBsYW5jZSBsYSBwcmVtacOocmUgYmFucXVlIG1hcm9jYWluZSBkw6lkacOpZSDDoCBs4oCZYWN0aXZpdMOpIOKAnHRpdHJlc+KAnScsXHJcbiAgICAgICAgc2l6ZTogNDUwLFxyXG4gICAgICAgIHR5cGU6ICdwZGYnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJ10sXHJcbiAgICAgICAgZGF0ZTogJzIxLzA3LzIwMTcnLFxyXG4gICAgICAgIHRpdGxlOiAnTGUgR3JvdXBlIEJDUCBsYW5jZSBsYSBwcmVtacOocmUgYmFucXVlIG1hcm9jYWluZSBkw6lkacOpZSDDoCBs4oCZYWN0aXZpdMOpIOKAnHRpdHJlc+KAnScsXHJcbiAgICAgICAgc2l6ZTogNDUwLFxyXG4gICAgICAgIHR5cGU6ICdwZGYnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJ10sXHJcbiAgICAgICAgZGF0ZTogJzIxLzA4LzIwMTcnLFxyXG4gICAgICAgIHRpdGxlOiAnTGUgR3JvdXBlIEJDUCBsYW5jZSBsYSBwcmVtacOocmUgYmFucXVlIG1hcm9jYWluZSBkw6lkacOpZSDDoCBs4oCZYWN0aXZpdMOpIOKAnHRpdHJlc+KAnScsXHJcbiAgICAgICAgc2l6ZTogNDUwLFxyXG4gICAgICAgIHR5cGU6ICdwZGYnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0YWdzOiBbJ1JTRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMi8wOC8yMDE2JyxcclxuICAgICAgICB0aXRsZTogJ0xlIEdyb3VwZSBCQ1AgbGFuY2UgbGEgcHJlbWnDqHJlIGJhbnF1ZSBtYXJvY2FpbmUgZMOpZGnDqWUgw6AgbOKAmWFjdGl2aXTDqSDigJx0aXRyZXPigJ0nLFxyXG4gICAgICAgIHNpemU6IDQ1MCxcclxuICAgICAgICB0eXBlOiAncGRmJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8wOS8yMDE3JyxcclxuICAgICAgICB0aXRsZTogJ0xlIEdyb3VwZSBCQ1AgbGFuY2UgbGEgcHJlbWnDqHJlIGJhbnF1ZSBtYXJvY2FpbmUgZMOpZGnDqWUgw6AgbOKAmWFjdGl2aXTDqSDigJx0aXRyZXPigJ0nLFxyXG4gICAgICAgIHNpemU6IDQ1MCxcclxuICAgICAgICB0eXBlOiAncGRmJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8xMC8yMDE3JyxcclxuICAgICAgICB0aXRsZTogJ0xlIEdyb3VwZSBCQ1AgbGFuY2UgbGEgcHJlbWnDqHJlIGJhbnF1ZSBtYXJvY2FpbmUgZMOpZGnDqWUgw6AgbOKAmWFjdGl2aXTDqSDigJx0aXRyZXPigJ0nLFxyXG4gICAgICAgIHNpemU6IDQ1MCxcclxuICAgICAgICB0eXBlOiAncGRmJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8wNy8yMDE4JyxcclxuICAgICAgICB0aXRsZTogJ0xlIEdyb3VwZSBCQ1AgbGFuY2UgbGEgcHJlbWnDqHJlIGJhbnF1ZSBtYXJvY2FpbmUgZMOpZGnDqWUgw6AgbOKAmWFjdGl2aXTDqSDigJx0aXRyZXPigJ0nLFxyXG4gICAgICAgIHNpemU6IDQ1MCxcclxuICAgICAgICB0eXBlOiAncGRmJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8wNy8yMDE4JyxcclxuICAgICAgICB0aXRsZTogJ0xlIEdyb3VwZSBCQ1AgbGFuY2UgbGEgcHJlbWnDqHJlIGJhbnF1ZSBtYXJvY2FpbmUgZMOpZGnDqWUgw6AgbOKAmWFjdGl2aXTDqSDigJx0aXRyZXPigJ0nLFxyXG4gICAgICAgIHNpemU6IDQ1MCxcclxuICAgICAgICB0eXBlOiAncGRmJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8wNy8yMDE5JyxcclxuICAgICAgICB0aXRsZTogJ0xlIEdyb3VwZSBCQ1AgbGFuY2UgbGEgcHJlbWnDqHJlIGJhbnF1ZSBtYXJvY2FpbmUgZMOpZGnDqWUgw6AgbOKAmWFjdGl2aXTDqSDigJx0aXRyZXPigJ0nLFxyXG4gICAgICAgIHNpemU6IDQ1MCxcclxuICAgICAgICB0eXBlOiAncGRmJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8wNy8yMDIwJyxcclxuICAgICAgICB0aXRsZTogJ0xlIEdyb3VwZSBCQ1AgbGFuY2UgbGEgcHJlbWnDqHJlIGJhbnF1ZSBtYXJvY2FpbmUgZMOpZGnDqWUgw6AgbOKAmWFjdGl2aXTDqSDigJx0aXRyZXPigJ0nLFxyXG4gICAgICAgIHNpemU6IDQ1MCxcclxuICAgICAgICB0eXBlOiAncGRmJ1xyXG4gICAgICB9XHJcbiAgICBdXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjbGVhblRhZyAodGFnRmlsdGVyKSB7XHJcbiAgICB0YWdGaWx0ZXIgPSB0YWdGaWx0ZXIudG9Mb3dlckNhc2UoKVxyXG4gICAgaWYgKHRhZ0ZpbHRlclswXSA9PSAnIycpIHtcclxuICAgICAgdGFnRmlsdGVyID0gdGFnRmlsdGVyLnNsaWNlKDEpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRhZ0ZpbHRlclxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbWFrZURhdGVPYmplY3QgKGRhdGVTdHJpbmcpIHtcclxuICAgIGxldCBbZGF5LCBtb250aCwgeWVhcl0gPSBkYXRlU3RyaW5nLnNwbGl0KCcvJylcclxuXHJcbiAgICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGggLSAxLCBkYXkpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhcHBseUZpbHRlcnMgKCkge1xyXG4gICAgbGV0IGRhdGEgPSBzdGF0ZS5kYXRhXHJcbiAgICBpZiAoc3RhdGUuZmlsdGVycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGRhdGEgPSBkYXRhLmZpbHRlcihwb3N0ID0+IHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXRlLmZpbHRlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGlmIChwb3N0LnRhZ3MuaW5jbHVkZXMoc3RhdGUuZmlsdGVyc1tpXS50b1VwcGVyQ2FzZSgpKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc3RhdGUuZGF0ZUZpbHRlci5mcm9tICYmIHN0YXRlLmRhdGVGaWx0ZXIudG8pIHtcclxuICAgICAgZGF0YSA9IGRhdGEuZmlsdGVyKHBvc3QgPT4ge1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgIG1ha2VEYXRlT2JqZWN0KHBvc3QuZGF0ZSkgLSBtYWtlRGF0ZU9iamVjdChzdGF0ZS5kYXRlRmlsdGVyLmZyb20pID49XHJcbiAgICAgICAgICAgIDAgJiZcclxuICAgICAgICAgIG1ha2VEYXRlT2JqZWN0KHBvc3QuZGF0ZSkgLSBtYWtlRGF0ZU9iamVjdChzdGF0ZS5kYXRlRmlsdGVyLnRvKSA8PSAwXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZGF0YSA9IGRhdGEuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICByZXR1cm4gc3RhdGUub3JkZXIgPT0gJ2Rlc2MnXHJcbiAgICAgICAgPyBtYWtlRGF0ZU9iamVjdChiLmRhdGUpIC0gbWFrZURhdGVPYmplY3QoYS5kYXRlKVxyXG4gICAgICAgIDogbWFrZURhdGVPYmplY3QoYS5kYXRlKSAtIG1ha2VEYXRlT2JqZWN0KGIuZGF0ZSlcclxuICAgIH0pXHJcblxyXG4gICAgc2hvd1NlbGVjdGVkKGRhdGEpXHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGNoYW5nZUZpbHRlcnMgKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG5cclxuICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJylcclxuXHJcbiAgICBzdGF0ZS5maWx0ZXJzID0gW11cclxuXHJcbiAgICB0YWdGaWx0ZXJzLmZvckVhY2goZnVuY3Rpb24gKHRhZykge1xyXG4gICAgICBpZiAoJCh0YWcpLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xyXG4gICAgICAgIHN0YXRlLmZpbHRlcnMucHVzaChjbGVhblRhZyh0YWcuaW5uZXJUZXh0KSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICBpZiAoc3RhdGUuZmlsdGVycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGFsbEZpbHRlckJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYWxsRmlsdGVyQnRuLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlGaWx0ZXJzKClcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNob3dTZWxlY3RlZCAoZGF0YSkge1xyXG4gICAgbGV0IHNlbGVjdGVkRGF0YSA9IGRhdGEuc2xpY2UoMCwgc3RhdGUubWF4ICogMylcclxuXHJcbiAgICBjb25zb2xlLmxvZyhkYXRhLmxlbmd0aClcclxuICAgIGNvbnNvbGUubG9nKHNlbGVjdGVkRGF0YS5sZW5ndGgpXHJcblxyXG4gICAgaWYgKHNlbGVjdGVkRGF0YS5sZW5ndGggPj0gZGF0YS5sZW5ndGgpIHtcclxuICAgICAgJCgnI21vcmUtY29tbXVuaXF1ZXMnKS5oaWRlKClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoJyNtb3JlLWNvbW11bmlxdWVzJykuc2hvdygpXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHNlbGVjdGVkRGF0YSlcclxuICB9XHJcblxyXG4gIGFwcGx5RmlsdGVycygpXHJcblxyXG4gICQoJyNtb3JlLWNvbW11bmlxdWVzJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgc3RhdGUubWF4KytcclxuICAgIGFwcGx5RmlsdGVycygpXHJcblxyXG4gICAgdGhpcy5zY3JvbGxJbnRvVmlldyh7XHJcbiAgICAgIGJlaGF2aW9yOiAnc21vb3RoJyxcclxuICAgICAgaW5saW5lOiAnZW5kJ1xyXG4gICAgfSlcclxuICAgIGlmIChzdGF0ZS5tYXggKyAxID4gc3RhdGUuZGF0YS5sZW5ndGggLyAzKSAkKHRoaXMpLmhpZGUoKVxyXG4gIH0pXHJcblxyXG4gIGZ1bmN0aW9uIHJlbmRlciAoZGF0YSkge1xyXG4gICAgY29tbXVuaXF1ZXNIb2xkZXIuaW5uZXJIVE1MID0gZGF0YVxyXG4gICAgICAubWFwKHBvc3QgPT4ge1xyXG4gICAgICAgIHJldHVybiBgPGEgY2xhc3M9XCJuZXdzIG5ld3MtLWNvbW11bmlxdWVzXCIgaHJlZj1cIiNcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibmV3c19ib3JkZXJcIj5cclxuICAgICAgICAgIDxzdmcgY2xhc3M9XCJpY29uLXBkZlwiPlxyXG4gICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi1wZGZcIj48L3VzZT5cclxuICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgIFTDqWzDqWNoYXJnZXJcclxuICAgICAgICAgIDwvcD5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibmV3c19jb250ZW50XCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibmV3c19kYXRlIGNsZWFyZml4XCI+XHJcbiAgICAgICAgICAgIDxwIGNsYXNzPVwicHVibGljYXRpb25cIj5cclxuICAgICAgICAgICAgICAke3Bvc3QuZGF0ZX1cclxuICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8aDIgY2xhc3M9XCJuZXdzX3RpdGxlXCI+XHJcbiAgICAgICAgICAgICR7cG9zdC50aXRsZX1cclxuICAgICAgICAgIDwvaDI+XHJcbiAgICAgICAgICA8cCBjbGFzcz1cIm5ld3NfdHh0XCI+XHJcbiAgICAgICAgICAgIC4ke3Bvc3QudHlwZX0gLSAke3Bvc3Quc2l6ZX0gS0JcclxuICAgICAgICAgIDwvcD5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9hPmBcclxuICAgICAgfSlcclxuICAgICAgLmpvaW4oJycpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBkYXRlRm9ybWF0IChkYXRlKSB7XHJcbiAgICByZXR1cm4gYDEvJHtkYXRlLm1vbnRoKCkgKyAxfS8ke2RhdGUueWVhcigpfWBcclxuICB9XHJcblxyXG4gIGxldCBzdGFydEZpbHRlciA9IG5ldyBEYXRlRmlsdGVyKHN0YXJ0RGF0ZSwgZmFsc2UsIGZ1bmN0aW9uIChzdGFydCkge1xyXG4gICAgc3RhdGUuZGF0ZUZpbHRlci5mcm9tID0gZGF0ZUZvcm1hdChzdGFydClcclxuICAgIGFwcGx5RmlsdGVycygpXHJcbiAgfSlcclxuICBzdGFydEZpbHRlci5pbml0KClcclxuXHJcbiAgbGV0IGVuZEZpbHRlciA9IG5ldyBEYXRlRmlsdGVyKGVuZERhdGUsIHRydWUsIGZ1bmN0aW9uIChlbmQpIHtcclxuICAgIHN0YXRlLmRhdGVGaWx0ZXIudG8gPSBkYXRlRm9ybWF0KGVuZClcclxuICAgIGFwcGx5RmlsdGVycygpXHJcbiAgfSlcclxuICBlbmRGaWx0ZXIuaW5pdCgpXHJcblxyXG4gICQoJyNjb21tdW5pcXVlcy1zZWxlY3QtZmlsdGVyJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBzZWxlY3RlZCA9ICQoJyNjb21tdW5pcXVlcy1zZWxlY3QtZmlsdGVyJylcclxuICAgICAgLm5leHQoKVxyXG4gICAgICAuZmluZCgnLmN1cnJlbnQnKVxyXG4gICAgICAudGV4dCgpXHJcbiAgICBzZWxlY3RlZCA9IHNlbGVjdGVkLnRvTG93ZXJDYXNlKClcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZyhzZWxlY3RlZClcclxuXHJcbiAgICAkKCcjZGF0ZS1maWx0ZXInKS5hZGRDbGFzcygnZC1mbGV4JylcclxuICAgICQoJyNkYXRlLWZpbHRlcicpLnNob3coKVxyXG5cclxuICAgIGlmIChzZWxlY3RlZCAhPT0gJ3DDqXJpb2RlJykge1xyXG4gICAgICAkKCcjZGF0ZS1maWx0ZXInKS5yZW1vdmVDbGFzcygnZC1mbGV4JylcclxuICAgICAgJCgnI2RhdGUtZmlsdGVyJykuaGlkZSgpXHJcbiAgICAgIHN0YXRlLm9yZGVyID0gJ2Rlc2MnXHJcbiAgICAgIHN0YXRlLmRhdGVGaWx0ZXIuZnJvbSA9ICcnXHJcbiAgICAgIHN0YXRlLmRhdGVGaWx0ZXIudG8gPSAnJ1xyXG4gICAgICBzdGFydEZpbHRlci5jbGVhcigpXHJcbiAgICAgIGVuZEZpbHRlci5jbGVhcigpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNlbGVjdGVkID09PSAncGx1cyBhbmNpZW5zJykge1xyXG4gICAgICBzdGF0ZS5vcmRlciA9ICdhc2MnXHJcbiAgICAgIGFwcGx5RmlsdGVycygpXHJcbiAgICB9IGVsc2UgaWYgKHNlbGVjdGVkID09PSAncGx1cyByw6ljZW50cycpIHtcclxuICAgICAgYXBwbHlGaWx0ZXJzKClcclxuICAgICAgc3RhdGUub3JkZXIgPSAnZGVzYydcclxuICAgIH1cclxuICB9KVxyXG5cclxuICBhbGxGaWx0ZXJCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICBzdGF0ZS5maWx0ZXJzID0gW11cclxuICAgIHRhZ0ZpbHRlcnMuZm9yRWFjaCh0YWcgPT4ge1xyXG4gICAgICB0YWcuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgIH0pXHJcbiAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICBhcHBseUZpbHRlcnMoKVxyXG4gIH0pXHJcbiAgdGFnRmlsdGVycy5mb3JFYWNoKHRhZyA9PiB7XHJcbiAgICB0YWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjaGFuZ2VGaWx0ZXJzKVxyXG4gIH0pXHJcbn1cclxuIiwiaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAocGFyZW50LCBlbXB0eSwgY2FsbGJhY2spIHtcclxuICBsZXQgY3VycmVudERhdGUgPSBtb21lbnQoKVxyXG5cclxuICBsZXQgaW5jRGF0ZSA9IHBhcmVudC5xdWVyeVNlbGVjdG9yKCcuaW5jcmVtZW50LWRhdGUnKVxyXG4gIGxldCBkZWNEYXRlID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZWNyZW1lbnQtZGF0ZScpXHJcbiAgbGV0IG1vbnRoc0lucHV0ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3IoJy5kYXRlLWZpbHRlcl9tb250aCBpbnB1dCcpXHJcbiAgbGV0IHllYXJzSW5wdXQgPSBwYXJlbnQucXVlcnlTZWxlY3RvcignLmRhdGUtZmlsdGVyX3llYXIgaW5wdXQnKVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVEYXRlICgpIHtcclxuICAgIGxldCBjdXJyZW50TW9udGggPSBjdXJyZW50RGF0ZS5tb250aCgpICsgMVxyXG4gICAgbGV0IGN1cnJlbnRZZWFyID0gY3VycmVudERhdGUueWVhcigpLnRvU3RyaW5nKClcclxuICAgIG1vbnRoc0lucHV0LnZhbHVlID0gY3VycmVudE1vbnRoXHJcbiAgICB5ZWFyc0lucHV0LnZhbHVlID0gY3VycmVudFllYXJcclxuICAgIGNhbGxiYWNrKGN1cnJlbnREYXRlKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYmluZEV2ZW50cyAoKSB7XHJcbiAgICBpbmNEYXRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgIGN1cnJlbnREYXRlID0gbW9tZW50KGN1cnJlbnREYXRlKS5hZGQoMSwgJ21vbnRocycpXHJcbiAgICAgIHVwZGF0ZURhdGUoKVxyXG4gICAgfSlcclxuICAgIGRlY0RhdGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgY3VycmVudERhdGUgPSBtb21lbnQoY3VycmVudERhdGUpLnN1YnRyYWN0KDEsICdtb250aHMnKVxyXG4gICAgICB1cGRhdGVEYXRlKClcclxuICAgIH0pXHJcbiAgICBtb250aHNJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKHBhcnNlSW50KHRoaXMudmFsdWUpID4gMCAmJiBwYXJzZUludCh0aGlzLnZhbHVlKSA8PSAzMSkge1xyXG4gICAgICAgIGN1cnJlbnREYXRlLm1vbnRoKHRoaXMudmFsdWUgLSAxKVxyXG4gICAgICAgIHVwZGF0ZURhdGUoKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgeWVhcnNJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKHBhcnNlSW50KHRoaXMudmFsdWUpID4gMCkge1xyXG4gICAgICAgIGN1cnJlbnREYXRlLnllYXIodGhpcy52YWx1ZSlcclxuICAgICAgICB1cGRhdGVEYXRlKClcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHRoaXMuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBtb250aHNJbnB1dC52YWx1ZSA9IHllYXJzSW5wdXQudmFsdWUgPSAnJ1xyXG4gIH1cclxuXHJcbiAgdGhpcy5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgYmluZEV2ZW50cygpXHJcbiAgICBpZiAoIWVtcHR5KSB1cGRhdGVEYXRlKClcclxuICB9XHJcblxyXG4gIHRoaXMuc2VsZWN0ZWREYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIGN1cnJlbnREYXRlXHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoJCgnLmRhdGUtc2xpZGVyJykubGVuZ3RoKSB7XHJcblxyXG5cdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblx0XHRcdGRhdGVTbGlkZXJQYWdlKDApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZGF0ZVNsaWRlclBhZ2UoMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0JCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG5cdFx0XHRcdGRhdGVTbGlkZXJQYWdlKDApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGRhdGVTbGlkZXJQYWdlKDApO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBkYXRlU2xpZGVyUGFnZShzdGFnZVBhZGRpbmcpIHtcclxuICAgICAgICAkKCcuZGF0ZS1zbGlkZXIub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBzdGFnZVBhZGRpbmc6IHN0YWdlUGFkZGluZyxcclxuICAgICAgICAgICAgbWFyZ2luOiA1LFxyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBuYXY6IHRydWUsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHtcclxuICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogNFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIDc2ODoge1xyXG4gICAgICAgICAgICAgICAgXHRpdGVtczogMTBcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA5OTI6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogMTVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgdGFnRmlsdGVycyxcclxuICAgIGZpbmFuY2VzRGF0ZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZmluYW5jZS1kYXRlcycpLFxyXG4gICAgZmluYW5jZVBvc3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2ZpbmFuY2UtcG9zdHMnKVxyXG5cclxuICBpZiAoIWZpbmFuY2VQb3N0cykgcmV0dXJuXHJcblxyXG4gIGxldCBzdGF0ZSA9IHtcclxuICAgIGZpbHRlcjogJzIwMTgnLFxyXG4gICAgZGF0YTogW1xyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTcnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTgnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTYnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzE5OTQnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTInLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTgnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzE5OTYnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzE5OTEnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMDAnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTUnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTQnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTMnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTAnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTgnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTgnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTcnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTgnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTgnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMDEnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMDMnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMDUnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMDInLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzE5OTknLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzE5ODUnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICBdXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhcHBseUZpbHRlcnMgKCkge1xyXG4gICAgbGV0IGRhdGEgPSBzdGF0ZS5kYXRhXHJcbiAgICBpZiAoc3RhdGUuZmlsdGVyKSB7XHJcbiAgICAgIGRhdGEgPSBkYXRhLmZpbHRlcihwb3N0ID0+IHtcclxuICAgICAgICBpZiAoc3RhdGUuZmlsdGVyLnRyaW0oKSA9PT0gcG9zdC5kYXRlLnNwbGl0KCcvJylbMl0pIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcihkYXRhKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY2hhbmdlRmlsdGVyIChlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuXHJcbiAgICB0YWdGaWx0ZXJzLmZvckVhY2goZnVuY3Rpb24gKHRhZykge1xyXG4gICAgICB0YWcuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgIH0pXHJcblxyXG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG5cclxuICAgIHN0YXRlLmZpbHRlciA9IHRoaXMuaW5uZXJUZXh0XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coc3RhdGUuZmlsdGVycylcclxuICAgIGFwcGx5RmlsdGVycygpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBiaW5kRXZlbnRzICgpIHtcclxuICAgICQoJy5maW5hbmNlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgY3VycmVudEl0ZW0gPSAkKHRoaXMpXHJcbiAgICAgIGNvbnNvbGUubG9nKCdjbGlja2VkJylcclxuICAgICAgJCgnLmZpbmFuY2UnKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWwpIHtcclxuICAgICAgICBpZiAoJChlbClbMF0gIT09IGN1cnJlbnRJdGVtWzBdKSB7XHJcbiAgICAgICAgICAkKGVsKS5yZW1vdmVDbGFzcygnb3BlbicpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnb3BlbicpXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVuZGVyIChkYXRhKSB7XHJcbiAgICBmaW5hbmNlUG9zdHMuaW5uZXJIVE1MID0gZGF0YVxyXG4gICAgICAubWFwKChwb3N0LCBpbmRleCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgJHtpbmRleCA9PSAwICYmIGRhdGEubGVuZ3RoID4gMSA/ICc8ZGl2IGNsYXNzPVwiY29sLTEyIGNvbC1sZy04IG1iLWxnLTMgbWItMlwiPjxkaXYgY2xhc3M9XCJmaW5hbmNlIGZpbmFuY2UtLWxnIGNsZWFyZml4XCI+JyA6ICc8ZGl2IGNsYXNzPVwiY29sLTEyIGNvbC1sZy00IG1iLWxnLTMgbWItMlwiPjxkaXYgY2xhc3M9XCJmaW5hbmNlIGNsZWFyZml4XCI+J31cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8aW1nIHNyYz1cImFzc2V0cy9pbWcvZmluYW5jZS5wbmdcIiBhbHQ9XCJcIj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaW5hbmNlX3RpdGxlXCI+XHJcbiAgICAgICAgICAgICAgPGgzIGNsYXNzPVwiZmlyc3RcIj5cclxuICAgICAgICAgICAgICAgICR7cG9zdC50aXRsZS5maXJzdH1cclxuICAgICAgICAgICAgICAgIDwvaDM+XHJcbiAgICAgICAgICAgICAgICA8aDMgY2xhc3M9XCJsYXN0XCI+XHJcbiAgICAgICAgICAgICAgICAke3Bvc3QudGl0bGUubGFzdH1cclxuICAgICAgICAgICAgICAgIDwvaDM+XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwiZmluYW5jZV9kYXRlXCI+XHJcbiAgICAgICAgICAgICAgICAke3Bvc3QuZGF0ZX1cclxuICAgICAgICAgICAgICA8L3A+XHJcblxyXG4gICAgICAgICAgICAgIDxwIGNsYXNzPVwiZG93bmxvYWRcIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNoZWNrYm94XCI+XHJcbiAgICAgICAgICAgICAgICAgIENvbXB0ZXMgc29jaWF1eCBkZSBsYSBCYW5xdWUgXHJcbiAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjaGVja21hcmtcIj5cclxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNoZWNrYm94XCI+XHJcbiAgICAgICAgICAgICAgICAgIENlbnRyYWxlIFBvcHVsYWlyZVxyXG4gICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjaGVja21hcmtcIj5cclxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNoZWNrYm94XCI+XHJcbiAgICAgICAgICAgICAgICAgIENvbW11bmlxdcOpIGRlIHByZXNzZS0gVkFcclxuICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2hlY2ttYXJrXCI+XHJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjaGVja2JveFwiPlxyXG4gICAgICAgICAgICAgICAgICBDb21tdW5pcXXDqSBkZSBwcmVzc2UtIFZGXHJcbiAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNoZWNrbWFya1wiPlxyXG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLS1kb3dubG9hZFwiPlxyXG4gICAgICAgICAgICAgICAgICB0ZWxlY2hhcmdlclxyXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgYFxyXG4gICAgICB9KVxyXG4gICAgICAuam9pbignJylcclxuXHJcbiAgICBiaW5kRXZlbnRzKClcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQgKCkge1xyXG4gICAgbGV0IGRpc3RpbmN0VGFncyA9IFtdXHJcblxyXG4gICAgZmluYW5jZXNEYXRlcy5pbm5lckhUTUwgPSBzdGF0ZS5kYXRhXHJcbiAgICAgIC5maWx0ZXIocG9zdCA9PiB7XHJcbiAgICAgICAgaWYgKCFkaXN0aW5jdFRhZ3MuaW5jbHVkZXMocG9zdC5kYXRlKSkge1xyXG4gICAgICAgICAgZGlzdGluY3RUYWdzLnB1c2gocG9zdC5kYXRlKVxyXG4gICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICB9KVxyXG4gICAgICAuc29ydCgocHksIG55KSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIG55LmRhdGUuc3BsaXQoJy8nKVsyXSAtIHB5LmRhdGUuc3BsaXQoJy8nKVsyXVxyXG4gICAgICB9KVxyXG4gICAgICAubWFwKChwb3N0LCBpbmRleCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBgPGEgaHJlZj1cIiNcIiBjbGFzcz1cImJ0biBidG4tLXRhZyAke2luZGV4ID09IDAgPyAnYWN0aXZlJyA6ICcnfSBcIj5cclxuICAgICAgICAgICAgICAgICAgJHtwb3N0LmRhdGUuc3BsaXQoJy8nKVsyXX1cclxuICAgICAgICAgICAgICAgIDwvYT5gXHJcbiAgICAgIH0pXHJcbiAgICAgIC5qb2luKCcnKVxyXG5cclxuICAgIHRhZ0ZpbHRlcnMgPSBmaW5hbmNlc0RhdGVzLnF1ZXJ5U2VsZWN0b3JBbGwoJ2EnKVxyXG5cclxuICAgIHRhZ0ZpbHRlcnMuZm9yRWFjaCh0YWcgPT4ge1xyXG4gICAgICB0YWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjaGFuZ2VGaWx0ZXIpXHJcbiAgICB9KVxyXG5cclxuICAgIGFwcGx5RmlsdGVycygpXHJcbiAgICBiaW5kRXZlbnRzKClcclxuICB9XHJcblxyXG4gIGluaXQoKVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoJCgnLmZpbmFuY2UubGVuZ3RoJykpIHtcclxuXHJcblx0XHQkKCcuZmluYW5jZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdHZhciBjdXJyZW50SXRlbSA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHQkKCcuZmluYW5jZScpLmVhY2goZnVuY3Rpb24gKGluZGV4LCBlbCkge1xyXG5cclxuXHRcdFx0XHRcdGlmICgkKGVsKVswXSAhPT0gY3VycmVudEl0ZW1bMF0pIHtcclxuXHRcdFx0XHRcdFx0JChlbCkucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkKHRoaXMpLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcblx0aWYgKCQoJy5mb290ZXJfdGl0bGUnKS5sZW5ndGgpIHtcclxuXHJcblx0XHQkKCcuZm9vdGVyX3RpdGxlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoJCh0aGlzKS5uZXh0KCd1bCcpLmNzcygnZGlzcGxheScpID09PSAnbm9uZScpIHtcclxuXHJcblx0XHRcdFx0JCgnLmZvb3Rlcl90aXRsZSArIHVsLm9wZW4nKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG5cdFx0XHRcdCQoJy5mb290ZXJfdGl0bGUgKyB1bC5vcGVuJykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuXHJcblx0XHRcdFx0JCh0aGlzKS5uZXh0KCd1bCcpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG5cdFx0XHRcdCQodGhpcykubmV4dCgndWwnKS5hZGRDbGFzcygnb3BlbicpO1xyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0JCh0aGlzKS5uZXh0KCd1bCcpLmNzcygnZGlzcGxheScsICdub25lJyk7XHJcblx0XHRcdFx0JCh0aGlzKS5uZXh0KCd1bCcpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdCQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoICQod2luZG93KS53aWR0aCgpID4gNzY4ICkge1xyXG5cdFx0XHRcdCQoJy5mb290ZXJfdGl0bGUgKyB1bCcpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG5cdFx0XHRcdCQoJy5mb290ZXJfdGl0bGUgKyB1bC5vcGVuJykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkKCcuZm9vdGVyX3RpdGxlICsgdWwnKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcclxuXHJcblx0LyogVmFyaWFibGVzICovXHJcblxyXG4gICAgdmFyICRmb3JtID0gJCgnLmZvcm0tc3RhZ2UnKTtcclxuICAgIHZhciAkZm9ybURyb3AgPSAkKCcuZm9ybV9kcm9wJyk7XHJcbiAgICB2YXIgJGlucHV0ID0gJGZvcm0uZmluZCgnaW5wdXRbdHlwZT1maWxlXScpO1xyXG4gICAgdmFyIGRyb3BwZWRGaWxlcyA9IGZhbHNlO1xyXG5cclxuXHJcbiAgICAvKiBGdW5jdGlvbnMgKi9cclxuXHJcbiAgICB2YXIgaXNBZHZhbmNlZFVwbG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICByZXR1cm4gKCgnZHJhZ2dhYmxlJyBpbiBkaXYpIHx8ICgnb25kcmFnc3RhcnQnIGluIGRpdiAmJiAnb25kcm9wJyBpbiBkaXYpKSAmJiAnRm9ybURhdGEnIGluIHdpbmRvdyAmJiAnRmlsZVJlYWRlcicgaW4gd2luZG93O1xyXG4gICAgfSgpO1xyXG5cclxuICAgIHZhciBhZGRmaWxlRG9tID0gZnVuY3Rpb24oZmlsZSkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coZmlsZSk7XHJcblxyXG4gICAgICAgIHZhciBodG1sID0gYDxkaXYgY2xhc3M9XCJjb2wtMTIgY29sLW1kLTYgbWItMlwiPlxyXG5cdCAgICAgICAgXHRcdFx0PGRpdiBjbGFzcz1cImZvcm1fZmlsZVwiIGlkPVwiJHtmaWxlLm5hbWUgKyBwYXJzZUludChmaWxlLnNpemUgLyAxMDI0KX1cIj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3cmFwcGVyIGQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtYmV0d2VlbiBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNoZWNrIGQtbm9uZVwiPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2Zz5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi1jaGVjay1maWxlXCI+PC91c2U+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBkZlwiPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2Zz5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi1wZGYtZmlsZVwiPjwvdXNlPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cIm5hbWVcIj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2ZpbGUubmFtZX1cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwic2l6ZVwiPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7cGFyc2VJbnQoZmlsZS5zaXplIC8gMTAyNCl9S0JcclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicmVtb3ZlIGQtbm9uZVwiPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2Zz5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi1yZW1vdmUtZmlsZVwiPjwvdXNlPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJsb2FkaW5nXCI+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBDaGFyZ2VtZW50IGVuIGNvdXJzIDxzcGFuIGNsYXNzPVwicGVyY2VudGFnZVwiPjwvc3Bhbj4gJVxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY3Jvc3NcIj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmc+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPVwiI2ljb24tY3Jvc3MtZmlsZVwiPjwvdXNlPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiIHN0eWxlPVwid2lkdGg6IDAlXCI+PC9kaXY+XHJcblx0XHRcdCAgICAgICAgICAgIDwvZGl2PlxyXG5cdFx0XHQgICAgICAgIDwvZGl2PmA7XHJcblxyXG5cdFx0JCgnLmZvcm1fZmlsZXMnKS5hcHBlbmQoaHRtbCk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgc2VuZEZpbGVzID0gZnVuY3Rpb24oZmlsZXMpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGZpbGVzKTtcclxuXHJcbiAgICAgICAgdmFyIGFqYXhEYXRhID0gbmV3IEZvcm1EYXRhKCRmb3JtLmdldCgwKSk7XHJcblxyXG4gICAgICAgICQuZWFjaChkcm9wcGVkRmlsZXMsIGZ1bmN0aW9uKGksIGZpbGUpIHtcclxuXHJcbiAgICAgICAgXHR2YXIgZmlsZUlkID0gZmlsZS5uYW1lICsgcGFyc2VJbnQoZmlsZS5zaXplIC8gMTAyNCk7XHJcbiAgICAgICAgICAgIGFqYXhEYXRhLmFwcGVuZChmaWxlSWQsIGZpbGUpO1xyXG5cclxuICAgICAgICAgICAgYWRkZmlsZURvbShmaWxlKTtcclxuXHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB4aHI6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgeGhyID0gbmV3IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB4aHIudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoXCJwcm9ncmVzc1wiLCBmdW5jdGlvbihldnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2dC5sZW5ndGhDb21wdXRhYmxlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBlcmNlbnRDb21wbGV0ZSA9IGV2dC5sb2FkZWQgLyBldnQudG90YWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZUlkID0gZmlsZS5uYW1lICsgcGFyc2VJbnQoZmlsZS5zaXplIC8gMTAyNCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZURvbSA9ICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZmlsZUlkKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGVyY2VudGFnZURvbSA9ICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZmlsZUlkKSkuZmluZCgnLnBlcmNlbnRhZ2UnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9ncmVzc0JhciA9ICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZmlsZUlkKSkuZmluZCgnLnByb2dyZXNzLWJhcicpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcmNlbnRDb21wbGV0ZSA9IHBhcnNlSW50KHBlcmNlbnRDb21wbGV0ZSAqIDEwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyY2VudGFnZURvbS5hcHBlbmQocGVyY2VudENvbXBsZXRlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzQmFyLmNzcygnd2lkdGgnLCBwZXJjZW50Q29tcGxldGUgKyAnJScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHBlcmNlbnRDb21wbGV0ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBlcmNlbnRDb21wbGV0ZSA9PT0gMTAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHRcdGZpbGVEb20uZmluZCgnLnByb2dyZXNzLWJhcicpLnRvZ2dsZUNsYXNzKCdkLW5vbmUnKTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHRmaWxlRG9tLmZpbmQoJy5sb2FkaW5nJykudG9nZ2xlQ2xhc3MoJ2Qtbm9uZScpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdGZpbGVEb20uZmluZCgnLnJlbW92ZScpLnRvZ2dsZUNsYXNzKCdkLW5vbmUnKTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHRmaWxlRG9tLmZpbmQoJy5jcm9zcycpLnRvZ2dsZUNsYXNzKCdkLW5vbmUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdH0sIDMwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHhocjtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdhY3Rpb24vdXBsb2FkZmlsZScsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAkZm9ybS5hdHRyKCdtZXRob2QnKSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGFqYXhEYXRhLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAkZm9ybS5yZW1vdmVDbGFzcygnaXMtdXBsb2FkaW5nJyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRmb3JtLmFkZENsYXNzKGRhdGEuc3VjY2VzcyA9PSB0cnVlID8gJ2lzLXN1Y2Nlc3MnIDogJ2lzLWVycm9yJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkYXRhLnN1Y2Nlc3MpIGNvbnNvbGUubG9nKCd1cGxvYWQgZXJyb3InKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTG9nIHRoZSBlcnJvciwgc2hvdyBhbiBhbGVydCwgd2hhdGV2ZXIgd29ya3MgZm9yIHlvdVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICQoJy5yZW1vdmUnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblx0XHQgICAgXHR2YXIgcmVtb3ZlSWQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5mb3JtX2ZpbGUnKS5hdHRyKCdpZCcpO1xyXG5cclxuXHRcdCAgICBcdHJlbW92ZUZpbGUocmVtb3ZlSWQpO1xyXG5cdFx0ICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgcmVtb3ZlRmlsZSA9IGZ1bmN0aW9uKGlkKSB7XHJcbiAgICBcdHZhciBmaWxlID0gJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkpLnBhcmVudCgpO1xyXG4gICAgXHRmaWxlLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuXHQvKiBEcmFnIGFuZCBkcm9wIExpc3RlbmVyICovXHJcblxyXG4gICAgaWYgKGlzQWR2YW5jZWRVcGxvYWQpIHtcclxuICAgICAgICAvLyBCcm93c2VyIHN1cHBvcnQgRHJhZyBhbmQgRHJvcFxyXG5cclxuICAgICAgICAkZm9ybURyb3Aub24oJ2RyYWcgZHJhZ3N0YXJ0IGRyYWdlbmQgZHJhZ292ZXIgZHJhZ2VudGVyIGRyYWdsZWF2ZSBkcm9wJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm9uKCdkcmFnb3ZlciBkcmFnZW50ZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICRmb3JtRHJvcC5hZGRDbGFzcygnaXMtZHJhZ292ZXInKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm9uKCdkcmFnbGVhdmUgZHJhZ2VuZCBkcm9wJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkZm9ybURyb3AucmVtb3ZlQ2xhc3MoJ2lzLWRyYWdvdmVyJyk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbignZHJvcCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGRyb3BwZWRGaWxlcyA9IGUub3JpZ2luYWxFdmVudC5kYXRhVHJhbnNmZXIuZmlsZXM7XHJcbiAgICAgICAgICAgICAgICBzZW5kRmlsZXMoZHJvcHBlZEZpbGVzKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRpbnB1dC5vbignY2hhbmdlJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIFx0ZHJvcHBlZEZpbGVzID0gZS50YXJnZXQuZmlsZXM7XHJcbiAgICAgICAgICAgIHNlbmRGaWxlcyhlLnRhcmdldC5maWxlcyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy9mYWxsYmFjayBmb3IgSUU5LSBicm93c2Vyc1xyXG4gICAgfVxyXG5cclxuICAgIC8qIFN1Ym1pdCBMaXN0ZW5lciAqL1xyXG5cclxuICAgICRmb3JtLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgaWYgKCRmb3JtLmhhc0NsYXNzKCdpcy11cGxvYWRpbmcnKSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICAkZm9ybS5hZGRDbGFzcygnaXMtdXBsb2FkaW5nJykucmVtb3ZlQ2xhc3MoJ2lzLWVycm9yJyk7XHJcblxyXG4gICAgICAgIGlmIChpc0FkdmFuY2VkVXBsb2FkKSB7XHJcbiAgICAgICAgICAgIC8vIGFqYXggZm9yIG1vZGVybiBicm93c2Vyc1xyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgLy8gRm9ybSBJbnB1dCBEYXRhXHJcbiAgICAgICAgICAgIHZhciBhamF4RGF0YSA9IHt9O1xyXG5cclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHVybDogJGZvcm0uYXR0cignYWN0aW9uJyksXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAkZm9ybS5hdHRyKCdtZXRob2QnKSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGFqYXhEYXRhLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTG9nIHRoZSBlcnJvciwgc2hvdyBhbiBhbGVydCwgd2hhdGV2ZXIgd29ya3MgZm9yIHlvdVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gYWpheCBmb3IgSUU5LSBicm93c2Vyc1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xyXG4gICAgJChcImZvcm1bbmFtZT0nZm9ybS1zdGFnZSddXCIpLnZhbGlkYXRlKHtcclxuXHJcbiAgICAgICAgLy8gU3BlY2lmeSB2YWxpZGF0aW9uIHJ1bGVzXHJcbiAgICAgICAgcnVsZXM6IHtcclxuICAgICAgICAgICAgZmlyc3RuYW1lOiAncmVxdWlyZWQnLFxyXG4gICAgICAgICAgICBsYXN0bmFtZTogJ3JlcXVpcmVkJyxcclxuICAgICAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZW1haWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGVsOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGRpZ2l0czogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJ2aWNlOiAncmVxdWlyZWQnLFxyXG4gICAgICAgICAgICBmb3JtYXRpb246ICdyZXF1aXJlZCcsXHJcbiAgICAgICAgICAgIHN0YWdlOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3R5cGUtZm9ybWF0aW9uJzoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gU3BlY2lmeSB2YWxpZGF0aW9uIGVycm9yIG1lc3NhZ2VzXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgZmlyc3RuYW1lOiAnVmV1aWxsZXogZW50cmVyIHZvdHJlIHByw6lub20nLFxyXG4gICAgICAgICAgICBsYXN0bmFtZTogJ1ZldWlsbGV6IGVudHJlciB2b3RyZSBub20nLFxyXG4gICAgICAgICAgICBlbWFpbDogJ1ZldWlsbGV6IGVudHJlciB1biBlbWFpbCB2YWxpZGUnLFxyXG4gICAgICAgICAgICB0ZWw6ICdWZXVpbGxleiBlbnRyZXIgdW4gbnVtw6lybyBkZSB0w6lsw6lwaG9uZSB2YWxpZGUgKDEwIGNhcmFjdMOocmVzIG1pbiknLFxyXG4gICAgICAgICAgICAndHlwZS1mb3JtYXRpb24nOiAnVmV1aWxsZXogZW50cmVyIHVuIHR5cGUgZGUgZm9ybWF0aW9uJyxcclxuICAgICAgICAgICAgJ2NvbmRpdGlvbnMnOiAnVmV1aWxsZXogYWNjZXB0ZXogbGVzIGNvbmRpdGlvbnMgZ8OpbsOpcmFsZXMgZFxcJ3V0aWxpc2F0aW9uJyxcclxuICAgICAgICAgICAgJ3NlcnZpY2UnOiAnVmV1aWxsZXogY2hvaXNpciB1biBzZXJ2aWNlJyxcclxuICAgICAgICAgICAgJ2Zvcm1hdGlvbic6ICdWZXVpbGxleiBjaG9pc2lyIHVuZSBmb3JtYXRpb24nLFxyXG4gICAgICAgICAgICAnc3RhZ2UnOiAnVmV1aWxsZXogY2hvaXNpciB1biB0eXBlIGRlIHN0YWdlJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXJyb3JQbGFjZW1lbnQ6IGZ1bmN0aW9uKGVycm9yLCBlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGlmICgoZWxlbWVudC5hdHRyKCd0eXBlJykgPT0gJ3JhZGlvJyB8fCBlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PSAnY2hlY2tib3gnKSAmJiBlbGVtZW50LmF0dHIoJ25hbWUnKSAhPSAnY29uZGl0aW9ucycpIHtcclxuICAgICAgICAgICAgXHRlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50LnBhcmVudCgpLnBhcmVudCgpKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZihlbGVtZW50LmF0dHIoJ25hbWUnKSA9PSAnY29uZGl0aW9ucycpe1xyXG4gICAgICAgICAgICBcdGVycm9yLmluc2VydEFmdGVyKGVsZW1lbnQucGFyZW50KCkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIGZvcm0gaXMgc3VibWl0dGVkIHRvIHRoZSBkZXN0aW5hdGlvbiBkZWZpbmVkXHJcbiAgICAgICAgLy8gaW4gdGhlIFwiYWN0aW9uXCIgYXR0cmlidXRlIG9mIHRoZSBmb3JtIHdoZW4gdmFsaWRcclxuICAgICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbihmb3JtKSB7XHJcbiAgICAgICAgICAgIGZvcm0uc3VibWl0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcblx0aWYgKCQoJy5oZWFkZXJfbW9iaWxlLW1lbnUnKS5sZW5ndGgpIHtcclxuXHRcdCQoJy5oZWFkZXJfbW9iaWxlLW1lbnUnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICgkKCcuaGVhZGVyX21lbnUnKS5jc3MoJ2Rpc3BsYXknKSA9PSAnYmxvY2snKSB7XHJcblx0XHRcdFx0JCgnLmhlYWRlcl9tZW51JykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkKCcuaGVhZGVyX21lbnUnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDk5MSkge1xyXG5cdFx0XHRpZiAoJCgnLmhlYWRlcl9tZW51JykuY3NzKCdkaXNwbGF5JykgPT0gJ25vbmUnKSB7XHJcblx0XHRcdFx0JCgnLmhlYWRlcl9tZW51JykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoJCgnLmhvbWUtc2xpZGVyJykubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgIHZhciBydGwgPSAkKCdodG1sJykuYXR0cignZGlyJykgPT0gJ3J0bCc7XHJcblxyXG5cdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblxyXG5cdFx0XHRzZXRIZWlnaHRTbGlkZXIoKTtcclxuICAgICAgICAgICAgaG9tZVNsaWRlcigwLCBydGwpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBob21lU2xpZGVyKDAsIHJ0bCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuaG9tZS1zbGlkZXInKS5vd2xDYXJvdXNlbCgnZGVzdHJveScpO1xyXG4gICAgICAgICAgICAgICAgaG9tZVNsaWRlcigwLCBydGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJCgnLmhvbWUtc2xpZGVyJykub3dsQ2Fyb3VzZWwoJ2Rlc3Ryb3knKTtcclxuICAgICAgICAgICAgICAgIGhvbWVTbGlkZXIoMCwgcnRsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0SGVpZ2h0U2xpZGVyKCkge1xyXG5cdFx0dmFyIHdpbmRvd0hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcclxuXHRcdHZhciB0b3BIZWFkZXJIZWlnaHQgPSAkKCcudG9wLWhlYWRlcicpLmhlaWdodCgpO1xyXG5cdFx0dmFyIGhlYWRlckhlaWdodCA9ICQoJy5oZWFkZXInKS5oZWlnaHQoKTtcclxuXHJcblx0XHR2YXIgc2xpZGVySGVpZ2h0ID0gd2luZG93SGVpZ2h0IC0gdG9wSGVhZGVySGVpZ2h0IC0gaGVhZGVySGVpZ2h0O1xyXG5cclxuXHRcdHZhciBzbGlkZXIgPSAkKCcuaG9tZS1zbGlkZXInKTtcclxuXHRcdHZhciBzbGlkZXJJdGVtID0gJCgnLmhvbWUtc2xpZGVyX2l0ZW0nKTtcclxuXHJcblx0XHRzbGlkZXIuY3NzKCdtYXgtaGVpZ2h0Jywgc2xpZGVySGVpZ2h0KTtcclxuXHRcdHNsaWRlckl0ZW0uY3NzKCdtYXgtaGVpZ2h0Jywgc2xpZGVySGVpZ2h0KTtcclxuXHRcdFxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gaG9tZVNsaWRlcihzdGFnZVBhZGRpbmcsIHJ0bCkge1xyXG5cdFx0dmFyIG93bCA9ICQoJy5ob21lLXNsaWRlci5vd2wtY2Fyb3VzZWwnKS5vd2xDYXJvdXNlbCh7XHJcbiAgICAgICAgICAgIHN0YWdlUGFkZGluZzogc3RhZ2VQYWRkaW5nLFxyXG4gICAgICAgICAgICBtYXJnaW46IDAsXHJcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgIG5hdjogZmFsc2UsXHJcbiAgICAgICAgICAgIGxvb3A6IHRydWUsXHJcbiAgICAgICAgICAgIG5hdlNwZWVkOiA0MDAsXHJcbiAgICAgICAgICAgIC8vYXV0b3BsYXk6IHRydWUsXHJcblx0XHRcdGF1dG9wbGF5VGltZW91dDo1MDAwLFxyXG4gICAgICAgICAgICBydGw6IHJ0bCxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZToge1xyXG4gICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAxXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgNzY4OiB7XHJcbiAgICAgICAgICAgICAgICBcdGl0ZW1zOiAxLFxyXG4gICAgICAgICAgICAgICAgXHRkb3RzRGF0YTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG5cdH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoJCgnLmxvZ28tc2xpZGVyJykubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgIHZhciBydGwgPSAkKCdodG1sJykuYXR0cignZGlyJykgPT0gJ3J0bCc7XHJcblxyXG5cdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblx0XHRcdGxvZ29TbGlkZXIoMCwgcnRsKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxvZ29TbGlkZXIoMCwgcnRsKTtcclxuXHRcdH1cclxuXHJcblx0XHQkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblx0XHRcdFx0bG9nb1NsaWRlcigwLCBydGwpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxvZ29TbGlkZXIoMCwgcnRsKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gbG9nb1NsaWRlcihzdGFnZVBhZGRpbmcsIHJ0bCkge1xyXG4gICAgICAgICQoJy5sb2dvLXNsaWRlci5vd2wtY2Fyb3VzZWwnKS5vd2xDYXJvdXNlbCh7XHJcbiAgICAgICAgICAgIHN0YWdlUGFkZGluZzogc3RhZ2VQYWRkaW5nLFxyXG4gICAgICAgICAgICBtYXJnaW46IDQ1LFxyXG4gICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgbmF2OiB0cnVlLFxyXG4gICAgICAgICAgICBsb29wOiB0cnVlLFxyXG4gICAgICAgICAgICBydGw6IHJ0bCxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZToge1xyXG4gICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAyLjVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA3Njg6IHtcclxuICAgICAgICAgICAgICAgIFx0aXRlbXM6IDRcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA5OTI6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogNVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IGRhdGEgZnJvbSAnLi4vLi4vYXNzZXRzL2pzL2RhdGEuanNvbidcclxuXHJcbmV4cG9ydCBsZXQgbWFwQ29udHJvbCA9IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgcHJvY2Vzc0RhdGEgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgbGV0IGlucHV0ZWRTZWFyY2ggPSAkKCcjaW5wdXRlZC1zZWFyY2gnKVxyXG4gICAgbGV0IHNlYXJjaFJlc3VsdCA9ICQoJyNzZWFyY2gtcmVzdWx0JylcclxuICAgIGxldCBzdWdnZXN0aW9uSG9sZGVyID0gJCgnI3N1Z2dlc3Rpb25zLWhvbGRlcicpXHJcbiAgICBsZXQgc2VhcmNoSW5wdXQgPSAkKCcjc2VhcmNoLWlucHV0JylcclxuICAgIGxldCBzdWdnZXN0aW9uc0NvbnRhaW5lciA9ICQoJyNzdWdnZXN0aW9ucy1jb250YWluZXInKVxyXG4gICAgbGV0IHNlbGVjdGVkQ29udGFpbmVyID0gJCgnI3NlbGVjdGVkLWNvbnRhaW5lcicpXHJcbiAgICBsZXQgbWFwQ29udHJvbENvbnRhaW5lciA9ICQoJy5tYXBjb250cm9sX2NvbnRhaW5lcicpXHJcbiAgICBsZXQgZmlsdGVycyA9ICQoJy5tYXBjb250cm9sX29wdGlvbnMgPiAuYnRuJylcclxuICAgIGxldCBzZWxlY3RlZEVsZW1lbnRcclxuXHJcbiAgICBsZXQgc3RhdGUgPSB7XHJcbiAgICAgIHVzZXJJbnB1dDogJycsXHJcbiAgICAgIGZpbHRlcnM6IFtdLFxyXG4gICAgICBmaWx0cmVkRGF0YTogW11cclxuICAgIH1cclxuXHJcbiAgICBsZXQgY2hlY2tTdWdnZXN0aW9uc1N0YXR1cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKHN0YXRlLmZpbHRyZWREYXRhLmxlbmd0aCA8PSAwKSB7XHJcbiAgICAgICAgbWFwQ29udHJvbENvbnRhaW5lci5jc3MoJ2hlaWdodCcsICcxODZweCcpXHJcbiAgICAgICAgc3VnZ2VzdGlvbnNDb250YWluZXIuaGlkZSgpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbWFwQ29udHJvbENvbnRhaW5lci5jc3MoJ2hlaWdodCcsICcyNDVweCcpXHJcbiAgICAgICAgc3VnZ2VzdGlvbnNDb250YWluZXIuc2hvdygpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZXQgYXBwbHlGaWx0ZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAvLyBmaWx0ZXIgZGF0YSBieSB1c2VyIGlucHV0XHJcbiAgICAgIHN0YXRlLmZpbHRyZWREYXRhID0gZGF0YS5maWx0ZXIoZWxlbWVudCA9PiB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgIChlbGVtZW50Lm5hbWUudG9Mb2NhbGVMb3dlckNhc2UoKS5pbmNsdWRlcyhzdGF0ZS51c2VySW5wdXQpIHx8XHJcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkcmVzcy50b0xvY2FsZUxvd2VyQ2FzZSgpLmluY2x1ZGVzKHN0YXRlLnVzZXJJbnB1dHQpIHx8XHJcbiAgICAgICAgICAgIGVsZW1lbnQuY2l0eS50b0xvY2FsZUxvd2VyQ2FzZSgpLmluY2x1ZGVzKHN0YXRlLnVzZXJJbnB1dCkpICYmXHJcbiAgICAgICAgICBzdGF0ZS51c2VySW5wdXQgIT0gJydcclxuICAgICAgICApXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICAvLyBGaWx0ZXIgZGF0YSBieSB0eXBlXHJcbiAgICAgIHN0YXRlLmZpbHRlcnMuZm9yRWFjaChmaWx0ZXIgPT4ge1xyXG4gICAgICAgIHN0YXRlLmZpbHRyZWREYXRhID0gc3RhdGUuZmlsdHJlZERhdGEuZmlsdGVyKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIGVsZW1lbnQudHlwZSA9PT0gZmlsdGVyXHJcbiAgICAgICAgfSlcclxuICAgICAgfSlcclxuXHJcbiAgICAgIC8vIHJlbmRlciBmaWx0cmVkIGRhdGFcclxuICAgICAgcmVuZGVyKClcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZmlsdGVyQ2hhbmdlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnYWN0aXZlJykgLy8gY2hhbmdlIHRoZSBzdHlsZSBvZiB0aGUgdGFnXHJcbiAgICAgIHN0YXRlLmZpbHRlcnMgPSBbXVxyXG5cclxuICAgICAgZmlsdGVycy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygnYWN0aXZlJykpIHtcclxuICAgICAgICAgIHN0YXRlLmZpbHRlcnMucHVzaCgkKHRoaXMpLmRhdGEoJ3ZhbHVlJykpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgYXBwbHlGaWx0ZXJzKClcclxuICAgIH1cclxuXHJcbiAgICBsZXQgaW5wdXRDaGFuZ2VzID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgc3RhdGUudXNlcklucHV0ID0gZS50YXJnZXQudmFsdWUudG9Mb2NhbGVMb3dlckNhc2UoKVxyXG4gICAgICBhcHBseUZpbHRlcnMoKVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBzaG93U2VsZWN0ZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGxldCBzZWxlY3RlZE5hbWUgPSAkKHRoaXMpLmZpbmQoJ2gzJykudGV4dCgpXHJcblxyXG4gICAgICBzZWxlY3RlZEVsZW1lbnQgPSBzdGF0ZS5maWx0cmVkRGF0YVxyXG4gICAgICAgIC5maWx0ZXIoZWxlbWVudCA9PiBlbGVtZW50Lm5hbWUgPT09IHNlbGVjdGVkTmFtZSlcclxuICAgICAgICAucmVkdWNlKHByZXYgPT4gcHJldilcclxuXHJcbiAgICAgIGxldCBzZWxlY3RlZEhUTUwgPSBidWlsZE1hcENhcmRJbmZvKHNlbGVjdGVkRWxlbWVudClcclxuXHJcbiAgICAgIHNlbGVjdGVkQ29udGFpbmVyLmh0bWwoc2VsZWN0ZWRIVE1MKVxyXG4gICAgICAkKCcjc2VsZWN0ZWQtY29udGFpbmVyLS1jbG9zZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgcmVuZGVyKClcclxuICAgICAgfSlcclxuICAgICAgJCgnI3NlbGVjdGVkLWNvbnRhaW5lci0tZGlyZWN0aW9uJykub24oJ2NsaWNrJywgZGlzcGxheURpcmVjdGlvbilcclxuICAgICAgc2VsZWN0ZWRDb250YWluZXIuZmFkZUluKClcclxuICAgICAgc3VnZ2VzdGlvbnNDb250YWluZXIuaGlkZSgpXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGlzcGxheURpcmVjdGlvbiAoZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgY29uc29sZS5sb2coc2VsZWN0ZWRFbGVtZW50KVxyXG4gICAgICBjYWxjdWxhdGVBbmREaXNwbGF5Um91dGUoXHJcbiAgICAgICAgd2luZG93Lm1hcCxcclxuICAgICAgICBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKFxyXG4gICAgICAgICAgc2VsZWN0ZWRFbGVtZW50LmNvb3Jkcy5ncHMubGFuZyxcclxuICAgICAgICAgIHNlbGVjdGVkRWxlbWVudC5jb29yZHMuZ3BzLmxhdFxyXG4gICAgICAgIClcclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGxldCByZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIC8vIGhpZGUgc2VsZWN0ZWQgY29udGFpbmVyXHJcbiAgICAgIHNlbGVjdGVkQ29udGFpbmVyLmhpZGUoKVxyXG5cclxuICAgICAgLy8gQ2hlY2sgd2V0aGVyIHRvIGRpc3BsYXkgc3VnZ2VzdGlvbnMgb2Ygbm90XHJcbiAgICAgIGNoZWNrU3VnZ2VzdGlvbnNTdGF0dXMoKVxyXG5cclxuICAgICAgLy8gdXBkYXRlIGlucHV0ZWQgc2VhcmNoXHJcbiAgICAgIGlucHV0ZWRTZWFyY2gudGV4dChzdGF0ZS51c2VySW5wdXQpXHJcbiAgICAgIC8vIHVwZGF0ZSBzZWFyY2ggUmVzdWx0XHJcbiAgICAgIHNlYXJjaFJlc3VsdC50ZXh0KGAoICR7c3RhdGUuZmlsdHJlZERhdGEubGVuZ3RofSBhZ2VuY2VzIHRyb3V2w6llcyApYClcclxuXHJcbiAgICAgIGxldCBjb250ZW50ID0gc3RhdGUuZmlsdHJlZERhdGFcclxuICAgICAgICAubWFwKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwic3VnZ2VzdGlvbnNfZWxlbWVudFwiPlxyXG4gICAgICAgICAgICAgICAgICA8aDM+JHtlbGVtZW50Lm5hbWV9PC9oMz5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4+JHtlbGVtZW50LmFkZHJlc3N9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+YFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmpvaW4oJycpXHJcblxyXG4gICAgICBzdWdnZXN0aW9uSG9sZGVyLmh0bWwoY29udGVudClcclxuXHJcbiAgICAgICQoJy5zdWdnZXN0aW9uc19lbGVtZW50JykuY2xpY2soc2hvd1NlbGVjdGVkKVxyXG4gICAgfVxyXG5cclxuICAgIHNlYXJjaElucHV0Lm9uKCdpbnB1dCcsIGlucHV0Q2hhbmdlcylcclxuICAgIGZpbHRlcnMub24oJ2NsaWNrJywgZmlsdGVyQ2hhbmdlcylcclxuICB9XHJcblxyXG4gIC8vICQuZ2V0SlNPTignaHR0cDovL2xvY2FsaG9zdDo5MDAwL2RhdGEuanNvbicsIHByb2Nlc3NEYXRhKVxyXG5cclxuICBwcm9jZXNzRGF0YShkYXRhKVxyXG59XHJcblxyXG5leHBvcnQgbGV0IHRvZ2dsZUNvbnRyb2wgPSBmdW5jdGlvbiAoKSB7XHJcbiAgJCgnLm1hcGNvbnRyb2xfdG9nZ2xlJykuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgJCgnLm1hcGNvbnRyb2wnKS50b2dnbGVDbGFzcygnbWFwY29udHJvbC0taGlkZScpXHJcbiAgfSlcclxufVxyXG5cclxuZXhwb3J0IGxldCBjYWxjdWxhdGVBbmREaXNwbGF5Um91dGUgPSBmdW5jdGlvbiAobWFwLCBkZXN0aW5hdGlvbikge1xyXG4gIHZhciBkaXJlY3Rpb25zU2VydmljZSA9IG5ldyBnb29nbGUubWFwcy5EaXJlY3Rpb25zU2VydmljZSgpXHJcbiAgd2luZG93LmRpcmVjdGlvbnNEaXNwbGF5ID1cclxuICAgIHdpbmRvdy5kaXJlY3Rpb25zRGlzcGxheSB8fCBuZXcgZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1JlbmRlcmVyKClcclxuICB3aW5kb3cuZGlyZWN0aW9uc0Rpc3BsYXkuc2V0TWFwKG1hcClcclxuXHJcbiAgZGlyZWN0aW9uc1NlcnZpY2Uucm91dGUoXHJcbiAgICB7XHJcbiAgICAgIG9yaWdpbjogbWFwLmdldENlbnRlcigpLFxyXG4gICAgICBkZXN0aW5hdGlvbjogZGVzdGluYXRpb24sXHJcbiAgICAgIHRyYXZlbE1vZGU6ICdEUklWSU5HJ1xyXG4gICAgfSxcclxuICAgIGZ1bmN0aW9uIChyZXNwb25zZSwgc3RhdHVzKSB7XHJcbiAgICAgIGlmIChzdGF0dXMgPT09ICdPSycpIHtcclxuICAgICAgICB3aW5kb3cuZGlyZWN0aW9uc0Rpc3BsYXkuc2V0RGlyZWN0aW9ucyhyZXNwb25zZSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB3aW5kb3cuYWxlcnQoJ0RpcmVjdGlvbnMgcmVxdWVzdCBmYWlsZWQgZHVlIHRvICcgKyBzdGF0dXMpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICApXHJcbn1cclxuXHJcbmV4cG9ydCBsZXQgYnVpbGRNYXBDYXJkSW5mbyA9IGZ1bmN0aW9uIChzZWxlY3RlZEVsZW1lbnQpIHtcclxuICByZXR1cm4gYDxkaXYgY2xhc3M9XCJtb3JlaW5mb19jb250ZW50XCI+XHJcbiAgPGRpdiBjbGFzcz1cIm1vcmVpbmZvX2hlYWRcIj5cclxuICAgIDxoMyBjbGFzcz1cIm1vcmVpbmZvX3RpdGxlXCIgaWQ9XCJpbmZvLW5hbWVcIj4ke3NlbGVjdGVkRWxlbWVudC5uYW1lfTwvaDM+XHJcbiAgICA8cCBjbGFzcz1cIm1vcmVpbmZvX2FkZHJlc3NcIiBpZD1cImluZm8tYWRkcmVzc1wiPiR7c2VsZWN0ZWRFbGVtZW50LmFkZHJlc3N9PC9wPlxyXG4gICAgPGRpdiBjbGFzcz1cIm1vcmVpbmZvX2FjdGlvbnNcIj5cclxuICAgICAgPGEgaHJlZj1cIiNcIiBpZD1cInNlbGVjdGVkLWNvbnRhaW5lci0tZGlyZWN0aW9uXCIgPkfDiU7DiVJFUiBVTiBJVElOw4lSQUlSRTwvYT5cclxuICAgICAgPGEgaHJlZj1cIiNcIiBpZD1cInNlbGVjdGVkLWNvbnRhaW5lci0tY2xvc2VcIj5SRVRPVVJORVI8L2E+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuICA8ZGl2IGNsYXNzPVwibW9yZWluZm9fYm9keVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cIm1vcmVpbmZvX3NlY3Rpb25cIj5cclxuICAgICAgPGg0PkNvb3Jkb25uw6llczwvaDQ+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJtb3JlaW5mb19saXN0XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vcmVpbmZvX2xpc3QtaXRlbVwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImxlZnRcIj5cclxuICAgICAgICAgICAgPHNwYW4+RW1haWw8L3NwYW4+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyaWdodFwiPlxyXG4gICAgICAgICAgICA8c3BhbiBpZD1cImluZm8tZW1haWxcIj4ke3NlbGVjdGVkRWxlbWVudC5jb29yZHMuZW1haWx9PC9zcGFuPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vcmVpbmZvX2xpc3QtaXRlbVwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImxlZnRcIj5cclxuICAgICAgICAgICAgPHNwYW4+VMOpbMOpcGhvbmU8L3NwYW4+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyaWdodFwiPlxyXG4gICAgICAgICAgICA8c3BhbiBpZD1cImluZm8tcGhvbmVcIj4ke3NlbGVjdGVkRWxlbWVudC5jb29yZHMucGhvbmV9PC9zcGFuPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vcmVpbmZvX2xpc3QtaXRlbVwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImxlZnRcIj5cclxuICAgICAgICAgICAgPHNwYW4+RmF4PC9zcGFuPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicmlnaHRcIj5cclxuICAgICAgICAgICAgPHNwYW4gaWQ9XCJpbmZvLWZheFwiPiR7c2VsZWN0ZWRFbGVtZW50LmNvb3Jkcy5mYXh9PC9zcGFuPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vcmVpbmZvX2xpc3QtaXRlbVwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImxlZnRcIj5cclxuICAgICAgICAgICAgPHNwYW4+Q29vcmRzIEdQUzwvc3Bhbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJpZ2h0XCI+XHJcbiAgICAgICAgICAgIDxzcGFuPlxyXG4gICAgICAgICAgICAgIDxib2xkPlxyXG4gICAgICAgICAgICAgICAgTGF0aXR1ZGVcclxuICAgICAgICAgICAgICA8L2JvbGQ+IDogJHtzZWxlY3RlZEVsZW1lbnQuY29vcmRzLmdwcy5sYXR9IHxcclxuICAgICAgICAgICAgICA8Ym9sZD5cclxuICAgICAgICAgICAgICAgIExvbmdpdHVkZVxyXG4gICAgICAgICAgICAgIDwvYm9sZD4gOiAke3NlbGVjdGVkRWxlbWVudC5jb29yZHMuZ3BzLmxhbmd9IDwvc3Bhbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cIm1vcmVpbmZvX3NlY3Rpb25cIj5cclxuICAgICAgPGg0PkFnZW5jZSBsacOpZTwvaDQ+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJtb3JlaW5mb19jb250YWluZXJcIj5cclxuICAgICAgICA8aDU+JHtzZWxlY3RlZEVsZW1lbnQuZXh0ZW5zaW9uLm5hbWV9PC9oNT5cclxuICAgICAgICA8cCBjbGFzcz1cIm1vcmVpbmZvX2FkZHJlc3NcIj4ke3NlbGVjdGVkRWxlbWVudC5leHRlbnNpb24uYWRkcmVzc308L3A+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwibW9yZWluZm9fc2VjdGlvblwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwibW9yZWluZm9fbGlzdFwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb3JlaW5mb19saXN0LWl0ZW1cIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJsZWZ0XCI+XHJcbiAgICAgICAgICAgIDxzcGFuPkx1bmRpPC9zcGFuPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicmlnaHRcIj5cclxuICAgICAgICAgICAgPHNwYW4+JHtzZWxlY3RlZEVsZW1lbnQudGltZXRhYmxlLm1vbmRheX08L3NwYW4+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9yZWluZm9fbGlzdC1pdGVtXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibGVmdFwiPlxyXG4gICAgICAgICAgICA8c3Bhbj5NYXJkaTwvc3Bhbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJpZ2h0XCI+XHJcbiAgICAgICAgICAgIDxzcGFuPiR7c2VsZWN0ZWRFbGVtZW50LnRpbWV0YWJsZS50dWVzZGF5fTwvc3Bhbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb3JlaW5mb19saXN0LWl0ZW1cIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJsZWZ0XCI+XHJcbiAgICAgICAgICAgIDxzcGFuPk1lcmNyZWRpPC9zcGFuPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicmlnaHRcIj5cclxuICAgICAgICAgICAgPHNwYW4+JHtzZWxlY3RlZEVsZW1lbnQudGltZXRhYmxlLndlZG5lc2RheX08L3NwYW4+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9yZWluZm9fbGlzdC1pdGVtXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibGVmdFwiPlxyXG4gICAgICAgICAgICA8c3Bhbj5KZXVkaTwvc3Bhbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJpZ2h0XCI+XHJcbiAgICAgICAgICAgIDxzcGFuPiR7c2VsZWN0ZWRFbGVtZW50LnRpbWV0YWJsZS50aHVyc2RheX08L3NwYW4+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9yZWluZm9fbGlzdC1pdGVtXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibGVmdFwiPlxyXG4gICAgICAgICAgICA8c3Bhbj5WZW5kcmVkaTwvc3Bhbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJpZ2h0XCI+XHJcbiAgICAgICAgICAgIDxzcGFuPiR7c2VsZWN0ZWRFbGVtZW50LnRpbWV0YWJsZS5mcmlkYXl9PC9zcGFuPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vcmVpbmZvX2xpc3QtaXRlbVwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImxlZnRcIj5cclxuICAgICAgICAgICAgPHNwYW4+U2FtZWRpPC9zcGFuPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicmlnaHRcIj5cclxuICAgICAgICAgICAgPHNwYW4+JHtzZWxlY3RlZEVsZW1lbnQudGltZXRhYmxlLnNhdHVyZGF5fTwvc3Bhbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb3JlaW5mb19saXN0LWl0ZW1cIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJsZWZ0XCI+XHJcbiAgICAgICAgICAgIDxzcGFuPkRpYW1hbmNoZTwvc3Bhbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJpZ2h0XCI+XHJcbiAgICAgICAgICAgIDxzcGFuPiR7c2VsZWN0ZWRFbGVtZW50LnRpbWV0YWJsZS5zdW5kYXl9PC9zcGFuPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbjwvZGl2PmBcclxufVxyXG4iLCJpbXBvcnQgeyBidWlsZE1hcENhcmRJbmZvIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9tYXAtY29udHJvbC9pbmRleC5qcydcclxuaW1wb3J0IHsgY2FsY3VsYXRlQW5kRGlzcGxheVJvdXRlIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9tYXAtY29udHJvbC9pbmRleC5qcydcclxuaW1wb3J0IGRhdGEgZnJvbSAnLi4vLi4vYXNzZXRzL2pzL2RhdGEuanNvbidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgbWFwQ29udHJvbENvbnRhaW5lciA9ICQoJy5tYXBjb250cm9sX2NvbnRhaW5lcicpXHJcbiAgbGV0IG1hcENvbnRyb2wgPSAkKCcubWFwY29udHJvbCcpXHJcbiAgbGV0IHNlbGVjdGVkQ29udGFpbmVyID0gJCgnI3NlbGVjdGVkLWNvbnRhaW5lcicpXHJcbiAgbGV0IHN1Z2dlc3Rpb25zQ29udGFpbmVyID0gJCgnI3N1Z2dlc3Rpb25zLWNvbnRhaW5lcicpXHJcblxyXG4gIGxldCBiaW5kTWFya2VycyA9IGZ1bmN0aW9uIChtYXAsIGxvY2F0aW9ucykge1xyXG4gICAgbGV0IG1hcmtlciwgbGF0bG5nXHJcblxyXG4gICAgbG9jYXRpb25zLmZvckVhY2goZnVuY3Rpb24gKGxvY2F0aW9uKSB7XHJcbiAgICAgIGxhdGxuZyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoXHJcbiAgICAgICAgbG9jYXRpb24uY29vcmRzLmdwcy5sYW5nLFxyXG4gICAgICAgIGxvY2F0aW9uLmNvb3Jkcy5ncHMubGF0XHJcbiAgICAgIClcclxuICAgICAgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcbiAgICAgICAgcG9zaXRpb246IGxhdGxuZyxcclxuICAgICAgICBpY29uOiAnYXNzZXRzL2ltZy9waW4ucG5nJ1xyXG4gICAgICB9KVxyXG4gICAgICBtYXJrZXIuc2V0TWFwKG1hcClcclxuXHJcbiAgICAgIC8vIGJpZGluZyB0aGUgY2xpY2sgZXZlbnQgd2l0aCBlYWNoIG1hcmtlclxyXG4gICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBtYXBDb250cm9sLnJlbW92ZUNsYXNzKCdtYXBjb250cm9sLS1oaWRlJylcclxuICAgICAgICBtYXBDb250cm9sQ29udGFpbmVyLmNzcygnaGVpZ2h0JywgJzI0NXB4JylcclxuICAgICAgICBsZXQgc2VsZWN0ZWRIVE1MID0gYnVpbGRNYXBDYXJkSW5mbyhsb2NhdGlvbilcclxuICAgICAgICBzZWxlY3RlZENvbnRhaW5lci5odG1sKHNlbGVjdGVkSFRNTClcclxuICAgICAgICAkKCcjc2VsZWN0ZWQtY29udGFpbmVyLS1jbG9zZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICAgIG1hcENvbnRyb2xDb250YWluZXIuY3NzKCdoZWlnaHQnLCAnMTg2cHgnKVxyXG4gICAgICAgICAgc2VsZWN0ZWRDb250YWluZXIuaGlkZSgpXHJcbiAgICAgICAgfSlcclxuICAgICAgICAkKCcjc2VsZWN0ZWQtY29udGFpbmVyLS1kaXJlY3Rpb24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICBjYWxjdWxhdGVBbmREaXNwbGF5Um91dGUoXHJcbiAgICAgICAgICAgIHdpbmRvdy5tYXAsXHJcbiAgICAgICAgICAgIG5ldyBnb29nbGUubWFwcy5MYXRMbmcoXHJcbiAgICAgICAgICAgICAgbG9jYXRpb24uY29vcmRzLmdwcy5sYW5nLFxyXG4gICAgICAgICAgICAgIGxvY2F0aW9uLmNvb3Jkcy5ncHMubGF0XHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgIClcclxuICAgICAgICB9KVxyXG4gICAgICAgIHN1Z2dlc3Rpb25zQ29udGFpbmVyLmhpZGUoKVxyXG4gICAgICAgIHNlbGVjdGVkQ29udGFpbmVyLnNob3coKVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGxldCBhanVzdE1hcFNpemUgPSBmdW5jdGlvbiAobWFwSG9sZGVyKSB7XHJcbiAgICAvLyBEZWZpbmUgdGhlIGhlaWdodCBvZiB0aGUgbWFwXHJcbiAgICBjb25zdCB0b3BIZWFkZXJIZWlnaHQgPSA1MVxyXG4gICAgbGV0IG1hcEhlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKVxyXG4gICAgbWFwSG9sZGVyLnN0eWxlLmhlaWdodCA9IGAke21hcEhlaWdodCAtIHRvcEhlYWRlckhlaWdodH1weGBcclxuICB9XHJcbiAgZnVuY3Rpb24gcHJvY2Vzc01hcCAoZGF0YSkge1xyXG4gICAgJC5nZXRTY3JpcHQoXHJcbiAgICAgICdodHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvanM/a2V5PUFJemFTeURDV0RfcTVOb0V5VmJsQzFtdFMyYmwwOGt1a3JuekRRcyZyZWdpb249TUEnLFxyXG4gICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbGV0IG1hcEhvbGRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKVxyXG4gICAgICAgIGlmIChtYXBIb2xkZXIpIHtcclxuICAgICAgICAgIGFqdXN0TWFwU2l6ZShtYXBIb2xkZXIpXHJcblxyXG4gICAgICAgICAgdmFyIG1hcFByb3AgPSB7XHJcbiAgICAgICAgICAgIGNlbnRlcjogbmV3IGdvb2dsZS5tYXBzLkxhdExuZygzMy41NzMwOSwgLTcuNjI4Njk3OSksXHJcbiAgICAgICAgICAgIG1hcFR5cGVJZDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLlJPQURNQVAsXHJcbiAgICAgICAgICAgIHpvb206IDE0LFxyXG4gICAgICAgICAgICBtYXBUeXBlQ29udHJvbDogZmFsc2UsXHJcbiAgICAgICAgICAgIGZ1bGxzY3JlZW5Db250cm9sOiBmYWxzZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgd2luZG93Lm1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAobWFwSG9sZGVyLCBtYXBQcm9wKVxyXG5cclxuICAgICAgICAgIGJpbmRNYXJrZXJzKG1hcCwgZGF0YSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIClcclxuICB9XHJcblxyXG4gIC8vICQuZ2V0SlNPTignaHR0cDovL2xvY2FsaG9zdDo5MDAwL2RhdGEuanNvbicsIHByb2Nlc3NNYXApXHJcbiAgcHJvY2Vzc01hcChkYXRhKVxyXG59XHJcbiIsImV4cG9ydCBsZXQgZ3JpZFNldHVwID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiAkKCcuZ2FsbGVyeS1ncmlkJykubWFzb25yeSh7XHJcbiAgICBpdGVtU2VsZWN0b3I6ICcuZ3JpZC1pdGVtJyxcclxuICAgIGNvbHVtbldpZHRoOiAnLmdyaWQtc2l6ZXInLFxyXG4gICAgcGVyY2VudFBvc2l0aW9uOiB0cnVlXHJcbiAgfSlcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG4gIGxldCB0YWdGaWx0ZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI21lZGlhY2VudGVyLWRldGFpbC1maWx0ZXJzIGEnKVxyXG4gIGxldCBhbGxGaWx0ZXJCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWVkaWFjZW50ZXItZGV0YWlsLWZpbHRlci1hbGwnKVxyXG4gIGxldCBtZWRpYUNlbnRlckhvbGRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtZWRpYWNlbnRlci1kZXRhaWwtaG9sZGVyJylcclxuXHJcbiAgaWYgKCFtZWRpYUNlbnRlckhvbGRlcikgcmV0dXJuXHJcblxyXG4gIGxldCBzdGF0ZSA9IHtcclxuICAgIGZpbHRlcnM6IFtdLFxyXG4gICAgZGF0YTogW1xyXG4gICAgICB7XHJcbiAgICAgICAgdHlwZTogJ2F1ZGlvJyxcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJywgJ0VOVFJFUFJFTkFSSUFUJ10sXHJcbiAgICAgICAgbWVkaWE6ICdhc3NldHMvaW1nL21lZGlhLWltZy5wbmcnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0ZJTkFOQ0UnLCAnRU5UUkVQUkVOQVJJQVQnLCAnREVWRUxPUFBFTUVOVCBEVVJBQkxFJ10sXHJcbiAgICAgICAgbWVkaWE6ICdhc3NldHMvaW1nL21lZGlhLWltZy5wbmcnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0eXBlOiAndmlkZW8nLFxyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0ZJTkFOQ0UnLCAnRU5UUkVQUkVOQVJJQVQnLCAnREVWRUxPUFBFTUVOVCBEVVJBQkxFJ10sXHJcbiAgICAgICAgbWVkaWE6ICdhc3NldHMvaW1nL3Jlcy0yLnBuZydcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHR5cGU6ICdhdWRpbycsXHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnREVWRUxPUFBFTUVOVCBEVVJBQkxFJ10sXHJcbiAgICAgICAgbWVkaWE6ICdhc3NldHMvaW1nL21lZGlhLWltZy5wbmcnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0eXBlOiAndmlkZW8nLFxyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0ZJTkFOQ0UnLCAnREVWRUxPUFBFTUVOVCBEVVJBQkxFJ10sXHJcbiAgICAgICAgbWVkaWE6ICdhc3NldHMvaW1nL3Jlcy0yLnBuZydcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHR5cGU6ICdpbWFnZScsXHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRScsICdFTlRSRVBSRU5BUklBVCcsICdERVZFTE9QUEVNRU5UIERVUkFCTEUnXSxcclxuICAgICAgICBtZWRpYTogJ2Fzc2V0cy9pbWcvbWVkaWEtaW1nLnBuZydcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHR5cGU6ICdpbWFnZScsXHJcbiAgICAgICAgdGFnczogWydSU0UnXSxcclxuICAgICAgICBtZWRpYTogJ2Fzc2V0cy9pbWcvbWVkaWEtaW1nLnBuZydcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHR5cGU6ICdhdWRpbycsXHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRScsICdFTlRSRVBSRU5BUklBVCddLFxyXG4gICAgICAgIG1lZGlhOiAnYXNzZXRzL2ltZy9tZWRpYS1pbWcucG5nJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdHlwZTogJ2ltYWdlJyxcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJywgJ0VOVFJFUFJFTkFSSUFUJywgJ0RFVkVMT1BQRU1FTlQgRFVSQUJMRSddLFxyXG4gICAgICAgIG1lZGlhOiAnYXNzZXRzL2ltZy9tZWRpYS1pbWcucG5nJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdHlwZTogJ3ZpZGVvJyxcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJywgJ0VOVFJFUFJFTkFSSUFUJywgJ0RFVkVMT1BQRU1FTlQgRFVSQUJMRSddLFxyXG4gICAgICAgIG1lZGlhOiAnYXNzZXRzL2ltZy9yZXMtMi5wbmcnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0eXBlOiAnYXVkaW8nLFxyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0RFVkVMT1BQRU1FTlQgRFVSQUJMRSddLFxyXG4gICAgICAgIG1lZGlhOiAnYXNzZXRzL2ltZy9tZWRpYS1pbWcucG5nJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdHlwZTogJ3ZpZGVvJyxcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJywgJ0RFVkVMT1BQRU1FTlQgRFVSQUJMRSddLFxyXG4gICAgICAgIG1lZGlhOiAnYXNzZXRzL2ltZy9yZXMtMi5wbmcnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0ZJTkFOQ0UnLCAnRU5UUkVQUkVOQVJJQVQnLCAnREVWRUxPUFBFTUVOVCBEVVJBQkxFJ10sXHJcbiAgICAgICAgbWVkaWE6ICdhc3NldHMvaW1nL21lZGlhLWltZy5wbmcnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxyXG4gICAgICAgIHRhZ3M6IFsnUlNFJ10sXHJcbiAgICAgICAgbWVkaWE6ICdhc3NldHMvaW1nL21lZGlhLWltZy5wbmcnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0eXBlOiAnYXVkaW8nLFxyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0ZJTkFOQ0UnLCAnRU5UUkVQUkVOQVJJQVQnXSxcclxuICAgICAgICBtZWRpYTogJ2Fzc2V0cy9pbWcvbWVkaWEtaW1nLnBuZydcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHR5cGU6ICdpbWFnZScsXHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRScsICdFTlRSRVBSRU5BUklBVCcsICdERVZFTE9QUEVNRU5UIERVUkFCTEUnXSxcclxuICAgICAgICBtZWRpYTogJ2Fzc2V0cy9pbWcvbWVkaWEtaW1nLnBuZydcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHR5cGU6ICd2aWRlbycsXHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRScsICdFTlRSRVBSRU5BUklBVCcsICdERVZFTE9QUEVNRU5UIERVUkFCTEUnXSxcclxuICAgICAgICBtZWRpYTogJ2Fzc2V0cy9pbWcvcmVzLTIucG5nJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdHlwZTogJ2F1ZGlvJyxcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdERVZFTE9QUEVNRU5UIERVUkFCTEUnXSxcclxuICAgICAgICBtZWRpYTogJ2Fzc2V0cy9pbWcvbWVkaWEtaW1nLnBuZydcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHR5cGU6ICd2aWRlbycsXHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRScsICdERVZFTE9QUEVNRU5UIERVUkFCTEUnXSxcclxuICAgICAgICBtZWRpYTogJ2Fzc2V0cy9pbWcvcmVzLTIucG5nJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdHlwZTogJ2ltYWdlJyxcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJywgJ0VOVFJFUFJFTkFSSUFUJywgJ0RFVkVMT1BQRU1FTlQgRFVSQUJMRSddLFxyXG4gICAgICAgIG1lZGlhOiAnYXNzZXRzL2ltZy9tZWRpYS1pbWcucG5nJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdHlwZTogJ2ltYWdlJyxcclxuICAgICAgICB0YWdzOiBbJ1JTRSddLFxyXG4gICAgICAgIG1lZGlhOiAnYXNzZXRzL2ltZy9tZWRpYS1pbWcucG5nJ1xyXG4gICAgICB9XHJcbiAgICBdXHJcbiAgfVxyXG5cclxuICBsZXQgJGdyaWRcclxuXHJcbiAgZnVuY3Rpb24gY2xlYW5UYWcgKHRhZ0ZpbHRlcikge1xyXG4gICAgdGFnRmlsdGVyID0gdGFnRmlsdGVyLnRyaW0oKS50b0xvd2VyQ2FzZSgpXHJcbiAgICBpZiAodGFnRmlsdGVyWzBdID09ICcjJykge1xyXG4gICAgICByZXR1cm4gdGFnRmlsdGVyLnNsaWNlKDEpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRhZ0ZpbHRlclxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYXBwbHlGaWx0ZXJzICgpIHtcclxuICAgICQoJy5nYWxsZXJ5LWdyaWQgPiAuZ3JpZC1pdGVtJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGxldCBub3RGb3VuZCA9IHRydWVcclxuICAgICAgJCh0aGlzKS5maW5kKCcuZ2FsbGVyeS1ncmlkX3RhZ3MgPiBhJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgc3RhdGUuZmlsdGVycy5pbmNsdWRlcygkKHRoaXMpLnRleHQoKS50cmltKCkuc2xpY2UoMSkudG9Mb3dlckNhc2UoKSlcclxuICAgICAgICApIHtcclxuICAgICAgICAgIG5vdEZvdW5kID0gZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIGlmIChub3RGb3VuZCkge1xyXG4gICAgICAgICQodGhpcykuaGlkZSgpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJCh0aGlzKS5zaG93KClcclxuICAgICAgfVxyXG4gICAgICBjb25zb2xlLmxvZyhub3RGb3VuZClcclxuICAgICAgJGdyaWQubWFzb25yeSgnbGF5b3V0JylcclxuICAgIH0pXHJcblxyXG4gICAgaWYgKHN0YXRlLmZpbHRlcnMubGVuZ3RoIDw9IDApIHtcclxuICAgICAgJCgnLmdhbGxlcnktZ3JpZCA+IC5ncmlkLWl0ZW0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKHRoaXMpLnNob3coKVxyXG4gICAgICAgICRncmlkLm1hc29ucnkoJ2xheW91dCcpXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjaGFuZ2VGaWx0ZXJzIChlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuXHJcbiAgICB0aGlzLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpXHJcblxyXG4gICAgc3RhdGUuZmlsdGVycyA9IFtdXHJcblxyXG4gICAgJCgnI21lZGlhY2VudGVyLWRldGFpbC1maWx0ZXJzIGEnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgc3RhdGUuZmlsdGVycy5wdXNoKGNsZWFuVGFnKCQodGhpcykudGV4dCgpKSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICBpZiAoc3RhdGUuZmlsdGVycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGFsbEZpbHRlckJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYWxsRmlsdGVyQnRuLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlGaWx0ZXJzKClcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQgKCkge1xyXG4gICAgbGV0IG5ld0l0ZW1zID0gc3RhdGUuZGF0YS5tYXAocG9zdCA9PiB7XHJcbiAgICAgIGlmIChwb3N0LnR5cGUgPT0gJ2F1ZGlvJykge1xyXG4gICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cImdyaWQtaXRlbVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJnYWxsZXJ5LWdyaWRfZWxlbWVudCBnYWxsZXJ5LWdyaWRfZWxlbWVudC0tZW1wdHlcIj5cclxuICAgICAgICAgICAgPGEgY2xhc3M9XCJzd2lwZWJveCBzd2lwZWJveC0tYXVkaW9cIiBocmVmPVwiJHtwb3N0Lm1lZGlhfVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnRcIj48L2Rpdj5cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FsbGVyeS1ncmlkX3RhZ3NcIj5cclxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJidG4gYnRuLS10YWcgbWItcyBtci1zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgI0lOU1RJVFVUSU9OTkVMTEVcclxuICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJidG4gYnRuLS10YWcgbWItcyBtci1zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgI1BBUlRJQ1VMSUVSU1xyXG4gICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PmBcclxuICAgICAgfSBlbHNlIGlmIChwb3N0LnR5cGUgPT0gJ3ZpZGVvJykge1xyXG4gICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cImdyaWQtaXRlbVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJnYWxsZXJ5LWdyaWRfZWxlbWVudCBnYWxsZXJ5LWdyaWRfZWxlbWVudC0tMlwiPlxyXG4gICAgICAgICAgICA8YSBjbGFzcz1cInN3aXBlYm94IHN3aXBlYm94LS12aWRlb1wiIGhyZWY9XCIke3Bvc3QubWVkaWF9XCI+XHJcbiAgICAgICAgICAgICAgICA8aW1nIHNyYz1cIiR7cG9zdC5tZWRpYX1cIiBhbHQ9XCJcIj5cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FsbGVyeS1ncmlkX3RhZ3NcIj5cclxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJidG4gYnRuLS10YWcgbWItcyBtci1zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgI0lOU1RJVFVUSU9OTkVMTEVcclxuICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJidG4gYnRuLS10YWcgbWItcyBtci1zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgI1BBUlRJQ1VMSUVSU1xyXG4gICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PmBcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJncmlkLWl0ZW1cIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FsbGVyeS1ncmlkX2VsZW1lbnQgZ2FsbGVyeS1ncmlkX2VsZW1lbnQtLTJcIj5cclxuICAgICAgICAgICAgPGEgY2xhc3M9XCJzd2lwZWJveCBzd2lwZWJveC0taW1nXCIgaHJlZj1cIiR7cG9zdC5tZWRpYX1cIj5cclxuICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHtwb3N0Lm1lZGlhfVwiIGFsdD1cIlwiPlxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJnYWxsZXJ5LWdyaWRfdGFnc1wiPlxyXG4gICAgICAgICAgICAke3Bvc3QudGFnc1xyXG4gICAgICAgICAgLm1hcCh0YWcgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gYDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJidG4gYnRuLS10YWcgbWItcyBtci1zXCI+XHJcbiAgICAgICAgICAgICAgIyR7dGFnfVxyXG4gICAgICAgICAgICA8L2E+YFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5qb2luKCcnKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5gXHJcbiAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgbWVkaWFDZW50ZXJIb2xkZXIuaW5uZXJIVE1MID0gW1xyXG4gICAgICAnPGRpdiBjbGFzcz1cImdyaWQtc2l6ZXJcIj48L2Rpdj4nLFxyXG4gICAgICAuLi5uZXdJdGVtc1xyXG4gICAgXS5qb2luKCcnKVxyXG5cclxuICAgICQod2luZG93KS5vbignbG9hZCcsICgpID0+IHtcclxuICAgICAgJGdyaWQgPSBncmlkU2V0dXAoKVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIC8vICAgJGdyaWQgPSBncmlkU2V0dXAoKVxyXG4gICAgLy8gICBjb25zb2xlLmxvZygnd2UgYXJlIGluJylcclxuICAgIC8vIH0sIDMwMDApXHJcbiAgfVxyXG5cclxuICBpbml0KClcclxuXHJcbiAgYWxsRmlsdGVyQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgc3RhdGUuZmlsdGVycyA9IFtdXHJcbiAgICAkKCcjbWVkaWFjZW50ZXItZGV0YWlsLWZpbHRlcnMgYScpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCcuYWN0aXZlJylcclxuICAgIH0pXHJcbiAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICBhcHBseUZpbHRlcnMoKVxyXG4gIH0pXHJcblxyXG4gICQoJyNtZWRpYWNlbnRlci1kZXRhaWwtZmlsdGVycyBhJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAkKHRoaXMpLm9uKCdjbGljaycsIGNoYW5nZUZpbHRlcnMpXHJcbiAgfSlcclxufVxyXG4iLCJpbXBvcnQgRGF0ZUZpbHRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL2RhdGUtZmlsdGVyL2luZGV4LmpzJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG4gIGxldCB0YWdGaWx0ZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI21lZGlhY2VudGVyLWZpbHRlcnMgYScpXHJcbiAgbGV0IG1lZGlhY2VudGVySG9sZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21lZGlhY2VudGVyLWhvbGRlcicpXHJcbiAgbGV0IHN0YXJ0RGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdGFydCcpXHJcbiAgbGV0IGVuZERhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZW5kJylcclxuICBsZXQgYWxsRmlsdGVyQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21lZGlhY2VudGVyLWZpbHRlci1hbGwnKVxyXG5cclxuICBpZiAodGFnRmlsdGVycy5sZW5ndGggPD0gMCB8fCAhbWVkaWFjZW50ZXJIb2xkZXIpIHJldHVyblxyXG5cclxuICBsZXQgc3RhdGUgPSB7XHJcbiAgICBmaWx0ZXJzOiBbXSxcclxuICAgIGRhdGVGaWx0ZXI6IHtcclxuICAgICAgZnJvbTogJycsXHJcbiAgICAgIHRvOiAnJ1xyXG4gICAgfSxcclxuICAgIG9yZGVyOiAnZGVzYycsXHJcbiAgICBtYXg6IDMsXHJcbiAgICBkYXRhOiBbXHJcbiAgICAgIHtcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJywgJ0VOVFJFUFJFTkFSSUFUJ10sXHJcbiAgICAgICAgZGF0ZTogJzIxLzA3LzIwMTcnLFxyXG4gICAgICAgIHRpdGxlOiAnSElTVE9JUkVTIFBPUFVMQUlSRVMnLFxyXG4gICAgICAgIGNvbnRlbnQ6IGBMYSBjYW1wYWduZSDigJxIaXN0b2lyZXMgcG9wdWxhaXJlc+KAnSBhZG9wdGUgdW5lIGTDqW1hcmNoZSBlbmNvcmUgcGx1cyBwcm9jaGUgZGVzIHByw6lvY2N1cGF0aW9ucyBkZXMgZ2VucyA6IGNlIHNvbnQgZGVzIGhpc3RvaXJlc1xyXG4gICAgICAgICAgICAgICAgcsOpZWxsZXMgZGUgTWFyb2NhaW5zIGlzc3VzIGRlIHRvdXRlcyBsZXMgY2xhc3NlcyBzb2NpYWxlcyBldCBxdWkgb250IHLDqXVzc2kgw6AgYXR0ZWluZHJlIGxldXJzIG9iamVjdGlmcyBkYW5zXHJcbiAgICAgICAgICAgICAgICBkaWZmw6lyZW50cyBzZWN0ZXVycyBkZSBsYSB2aWUgZ3LDomNlIGF1IHNvdXRpZW4gZGUgbGV1ciBiYW5xdWUuYCxcclxuICAgICAgICBpbWFnZTogJ2Fzc2V0cy9pbWcvbWVkaWEtaW1nLnBuZydcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRpdGxlOiAnSElTVE9JUkVTIFBPUFVMQUlSRVMnLFxyXG4gICAgICAgIHRhZ3M6IFsnUlNFJ10sXHJcbiAgICAgICAgZGF0ZTogJzI5LzA3LzIwMTcnLFxyXG4gICAgICAgIGNvbnRlbnQ6IGBMYSBjYW1wYWduZSDigJxIaXN0b2lyZXMgcG9wdWxhaXJlc+KAnSBhZG9wdGUgdW5lIGTDqW1hcmNoZSBlbmNvcmUgcGx1cyBwcm9jaGUgZGVzIHByw6lvY2N1cGF0aW9ucyBkZXMgZ2VucyA6IGNlIHNvbnQgZGVzIGhpc3RvaXJlc1xyXG4gICAgICAgIHLDqWVsbGVzIGRlIE1hcm9jYWlucyBpc3N1cyBkZSB0b3V0ZXMgbGVzIGNsYXNzZXMgc29jaWFsZXMgZXQgcXVpIG9udCByw6l1c3NpIMOgIGF0dGVpbmRyZSBsZXVycyBvYmplY3RpZnMgZGFuc1xyXG4gICAgICAgIGRpZmbDqXJlbnRzIHNlY3RldXJzIGRlIGxhIHZpZSBncsOiY2UgYXUgc291dGllbiBkZSBsZXVyIGJhbnF1ZS5gLFxyXG4gICAgICAgIGltYWdlOiAnYXNzZXRzL2ltZy9tZWRpYS1pbWcucG5nJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRU5UUkVQUkVOQVJJQVQnXSxcclxuICAgICAgICBkYXRlOiAnMjIvMDcvMjAxNycsXHJcbiAgICAgICAgdGl0bGU6ICdISVNUT0lSRVMgUE9QVUxBSVJFUycsXHJcbiAgICAgICAgY29udGVudDogYExhIGNhbXBhZ25lIOKAnEhpc3RvaXJlcyBwb3B1bGFpcmVz4oCdIGFkb3B0ZSB1bmUgZMOpbWFyY2hlIGVuY29yZSBwbHVzIHByb2NoZSBkZXMgcHLDqW9jY3VwYXRpb25zIGRlcyBnZW5zIDogY2Ugc29udCBkZXMgaGlzdG9pcmVzXHJcbiAgICAgICAgICAgICAgICByw6llbGxlcyBkZSBNYXJvY2FpbnMgaXNzdXMgZGUgdG91dGVzIGxlcyBjbGFzc2VzIHNvY2lhbGVzIGV0IHF1aSBvbnQgcsOpdXNzaSDDoCBhdHRlaW5kcmUgbGV1cnMgb2JqZWN0aWZzIGRhbnNcclxuICAgICAgICAgICAgICAgIGRpZmbDqXJlbnRzIHNlY3RldXJzIGRlIGxhIHZpZSBncsOiY2UgYXUgc291dGllbiBkZSBsZXVyIGJhbnF1ZS5gLFxyXG4gICAgICAgIGltYWdlOiAnYXNzZXRzL2ltZy9tZWRpYS1pbWcucG5nJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnREVWRUxPUFBFTUVOVCBEVVJBQkxFJ10sXHJcbiAgICAgICAgZGF0ZTogJzIzLzA3LzIwMTcnLFxyXG4gICAgICAgIHRpdGxlOiAnSElTVE9JUkVTIFBPUFVMQUlSRVMnLFxyXG4gICAgICAgIGNvbnRlbnQ6IGBMYSBjYW1wYWduZSDigJxIaXN0b2lyZXMgcG9wdWxhaXJlc+KAnSBhZG9wdGUgdW5lIGTDqW1hcmNoZSBlbmNvcmUgcGx1cyBwcm9jaGUgZGVzIHByw6lvY2N1cGF0aW9ucyBkZXMgZ2VucyA6IGNlIHNvbnQgZGVzIGhpc3RvaXJlc1xyXG4gICAgICAgICAgICAgICAgcsOpZWxsZXMgZGUgTWFyb2NhaW5zIGlzc3VzIGRlIHRvdXRlcyBsZXMgY2xhc3NlcyBzb2NpYWxlcyBldCBxdWkgb250IHLDqXVzc2kgw6AgYXR0ZWluZHJlIGxldXJzIG9iamVjdGlmcyBkYW5zXHJcbiAgICAgICAgICAgICAgICBkaWZmw6lyZW50cyBzZWN0ZXVycyBkZSBsYSB2aWUgZ3LDomNlIGF1IHNvdXRpZW4gZGUgbGV1ciBiYW5xdWUuYCxcclxuICAgICAgICBpbWFnZTogJ2Fzc2V0cy9pbWcvbWVkaWEtaW1nLnBuZydcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRhZ3M6IFsnUlNFJ10sXHJcbiAgICAgICAgZGF0ZTogJzIxLzA3LzIwMTcnLFxyXG4gICAgICAgIHRpdGxlOiAnSElTVE9JUkVTIFBPUFVMQUlSRVMnLFxyXG4gICAgICAgIGNvbnRlbnQ6IGBMYSBjYW1wYWduZSDigJxIaXN0b2lyZXMgcG9wdWxhaXJlc+KAnSBhZG9wdGUgdW5lIGTDqW1hcmNoZSBlbmNvcmUgcGx1cyBwcm9jaGUgZGVzIHByw6lvY2N1cGF0aW9ucyBkZXMgZ2VucyA6IGNlIHNvbnQgZGVzIGhpc3RvaXJlc1xyXG4gICAgICAgICAgICAgICAgcsOpZWxsZXMgZGUgTWFyb2NhaW5zIGlzc3VzIGRlIHRvdXRlcyBsZXMgY2xhc3NlcyBzb2NpYWxlcyBldCBxdWkgb250IHLDqXVzc2kgw6AgYXR0ZWluZHJlIGxldXJzIG9iamVjdGlmcyBkYW5zXHJcbiAgICAgICAgICAgICAgICBkaWZmw6lyZW50cyBzZWN0ZXVycyBkZSBsYSB2aWUgZ3LDomNlIGF1IHNvdXRpZW4gZGUgbGV1ciBiYW5xdWUuYCxcclxuICAgICAgICBpbWFnZTogJ2Fzc2V0cy9pbWcvbWVkaWEtaW1nLnBuZydcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0ZJTkFOQ0UnXSxcclxuICAgICAgICBkYXRlOiAnMjQvMDcvMjAxNycsXHJcbiAgICAgICAgdGl0bGU6ICdISVNUT0lSRVMgUE9QVUxBSVJFUycsXHJcbiAgICAgICAgY29udGVudDogYExhIGNhbXBhZ25lIOKAnEhpc3RvaXJlcyBwb3B1bGFpcmVz4oCdIGFkb3B0ZSB1bmUgZMOpbWFyY2hlIGVuY29yZSBwbHVzIHByb2NoZSBkZXMgcHLDqW9jY3VwYXRpb25zIGRlcyBnZW5zIDogY2Ugc29udCBkZXMgaGlzdG9pcmVzXHJcbiAgICAgICAgICAgICAgICByw6llbGxlcyBkZSBNYXJvY2FpbnMgaXNzdXMgZGUgdG91dGVzIGxlcyBjbGFzc2VzIHNvY2lhbGVzIGV0IHF1aSBvbnQgcsOpdXNzaSDDoCBhdHRlaW5kcmUgbGV1cnMgb2JqZWN0aWZzIGRhbnNcclxuICAgICAgICAgICAgICAgIGRpZmbDqXJlbnRzIHNlY3RldXJzIGRlIGxhIHZpZSBncsOiY2UgYXUgc291dGllbiBkZSBsZXVyIGJhbnF1ZS5gLFxyXG4gICAgICAgIGltYWdlOiAnYXNzZXRzL2ltZy9tZWRpYS1pbWcucG5nJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgIGRhdGU6ICcyNS8wNy8yMDE3JyxcclxuICAgICAgICB0aXRsZTogJ0hJU1RPSVJFUyBQT1BVTEFJUkVTJyxcclxuICAgICAgICBjb250ZW50OiBgTGEgY2FtcGFnbmUg4oCcSGlzdG9pcmVzIHBvcHVsYWlyZXPigJ0gYWRvcHRlIHVuZSBkw6ltYXJjaGUgZW5jb3JlIHBsdXMgcHJvY2hlIGRlcyBwcsOpb2NjdXBhdGlvbnMgZGVzIGdlbnMgOiBjZSBzb250IGRlcyBoaXN0b2lyZXNcclxuICAgICAgICAgICAgICAgIHLDqWVsbGVzIGRlIE1hcm9jYWlucyBpc3N1cyBkZSB0b3V0ZXMgbGVzIGNsYXNzZXMgc29jaWFsZXMgZXQgcXVpIG9udCByw6l1c3NpIMOgIGF0dGVpbmRyZSBsZXVycyBvYmplY3RpZnMgZGFuc1xyXG4gICAgICAgICAgICAgICAgZGlmZsOpcmVudHMgc2VjdGV1cnMgZGUgbGEgdmllIGdyw6JjZSBhdSBzb3V0aWVuIGRlIGxldXIgYmFucXVlLmAsXHJcbiAgICAgICAgaW1hZ2U6ICdhc3NldHMvaW1nL21lZGlhLWltZy5wbmcnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0YWdzOiBbJ1JTRSddLFxyXG4gICAgICAgIGRhdGU6ICcyNi8wNy8yMDE3JyxcclxuICAgICAgICB0aXRsZTogJ0hJU1RPSVJFUyBQT1BVTEFJUkVTJyxcclxuICAgICAgICBjb250ZW50OiBgTGEgY2FtcGFnbmUg4oCcSGlzdG9pcmVzIHBvcHVsYWlyZXPigJ0gYWRvcHRlIHVuZSBkw6ltYXJjaGUgZW5jb3JlIHBsdXMgcHJvY2hlIGRlcyBwcsOpb2NjdXBhdGlvbnMgZGVzIGdlbnMgOiBjZSBzb250IGRlcyBoaXN0b2lyZXNcclxuICAgICAgICAgICAgICAgIHLDqWVsbGVzIGRlIE1hcm9jYWlucyBpc3N1cyBkZSB0b3V0ZXMgbGVzIGNsYXNzZXMgc29jaWFsZXMgZXQgcXVpIG9udCByw6l1c3NpIMOgIGF0dGVpbmRyZSBsZXVycyBvYmplY3RpZnMgZGFuc1xyXG4gICAgICAgICAgICAgICAgZGlmZsOpcmVudHMgc2VjdGV1cnMgZGUgbGEgdmllIGdyw6JjZSBhdSBzb3V0aWVuIGRlIGxldXIgYmFucXVlLmAsXHJcbiAgICAgICAgaW1hZ2U6ICdhc3NldHMvaW1nL21lZGlhLWltZy5wbmcnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJ10sXHJcbiAgICAgICAgZGF0ZTogJzIxLzA3LzIwMTcnLFxyXG4gICAgICAgIHRpdGxlOiAnSElTVE9JUkVTIFBPUFVMQUlSRVMnLFxyXG4gICAgICAgIGNvbnRlbnQ6IGBMYSBjYW1wYWduZSDigJxIaXN0b2lyZXMgcG9wdWxhaXJlc+KAnSBhZG9wdGUgdW5lIGTDqW1hcmNoZSBlbmNvcmUgcGx1cyBwcm9jaGUgZGVzIHByw6lvY2N1cGF0aW9ucyBkZXMgZ2VucyA6IGNlIHNvbnQgZGVzIGhpc3RvaXJlc1xyXG4gICAgICAgICAgICAgICAgcsOpZWxsZXMgZGUgTWFyb2NhaW5zIGlzc3VzIGRlIHRvdXRlcyBsZXMgY2xhc3NlcyBzb2NpYWxlcyBldCBxdWkgb250IHLDqXVzc2kgw6AgYXR0ZWluZHJlIGxldXJzIG9iamVjdGlmcyBkYW5zXHJcbiAgICAgICAgICAgICAgICBkaWZmw6lyZW50cyBzZWN0ZXVycyBkZSBsYSB2aWUgZ3LDomNlIGF1IHNvdXRpZW4gZGUgbGV1ciBiYW5xdWUuYCxcclxuICAgICAgICBpbWFnZTogJ2Fzc2V0cy9pbWcvbWVkaWEtaW1nLnBuZydcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0ZJTkFOQ0UnXSxcclxuICAgICAgICBkYXRlOiAnMjEvMDgvMjAxNycsXHJcbiAgICAgICAgdGl0bGU6ICdISVNUT0lSRVMgUE9QVUxBSVJFUycsXHJcbiAgICAgICAgY29udGVudDogYExhIGNhbXBhZ25lIOKAnEhpc3RvaXJlcyBwb3B1bGFpcmVz4oCdIGFkb3B0ZSB1bmUgZMOpbWFyY2hlIGVuY29yZSBwbHVzIHByb2NoZSBkZXMgcHLDqW9jY3VwYXRpb25zIGRlcyBnZW5zIDogY2Ugc29udCBkZXMgaGlzdG9pcmVzXHJcbiAgICAgICAgICAgICAgICByw6llbGxlcyBkZSBNYXJvY2FpbnMgaXNzdXMgZGUgdG91dGVzIGxlcyBjbGFzc2VzIHNvY2lhbGVzIGV0IHF1aSBvbnQgcsOpdXNzaSDDoCBhdHRlaW5kcmUgbGV1cnMgb2JqZWN0aWZzIGRhbnNcclxuICAgICAgICAgICAgICAgIGRpZmbDqXJlbnRzIHNlY3RldXJzIGRlIGxhIHZpZSBncsOiY2UgYXUgc291dGllbiBkZSBsZXVyIGJhbnF1ZS5gLFxyXG4gICAgICAgIGltYWdlOiAnYXNzZXRzL2ltZy9tZWRpYS1pbWcucG5nJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnXSxcclxuICAgICAgICBkYXRlOiAnMjIvMDgvMjAxNicsXHJcbiAgICAgICAgdGl0bGU6ICdISVNUT0lSRVMgUE9QVUxBSVJFUycsXHJcbiAgICAgICAgY29udGVudDogYExhIGNhbXBhZ25lIOKAnEhpc3RvaXJlcyBwb3B1bGFpcmVz4oCdIGFkb3B0ZSB1bmUgZMOpbWFyY2hlIGVuY29yZSBwbHVzIHByb2NoZSBkZXMgcHLDqW9jY3VwYXRpb25zIGRlcyBnZW5zIDogY2Ugc29udCBkZXMgaGlzdG9pcmVzXHJcbiAgICAgICAgICAgICAgICByw6llbGxlcyBkZSBNYXJvY2FpbnMgaXNzdXMgZGUgdG91dGVzIGxlcyBjbGFzc2VzIHNvY2lhbGVzIGV0IHF1aSBvbnQgcsOpdXNzaSDDoCBhdHRlaW5kcmUgbGV1cnMgb2JqZWN0aWZzIGRhbnNcclxuICAgICAgICAgICAgICAgIGRpZmbDqXJlbnRzIHNlY3RldXJzIGRlIGxhIHZpZSBncsOiY2UgYXUgc291dGllbiBkZSBsZXVyIGJhbnF1ZS5gLFxyXG4gICAgICAgIGltYWdlOiAnYXNzZXRzL2ltZy9tZWRpYS1pbWcucG5nJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8wOS8yMDE3JyxcclxuICAgICAgICB0aXRsZTogJ0hJU1RPSVJFUyBQT1BVTEFJUkVTJyxcclxuICAgICAgICBjb250ZW50OiBgTGEgY2FtcGFnbmUg4oCcSGlzdG9pcmVzIHBvcHVsYWlyZXPigJ0gYWRvcHRlIHVuZSBkw6ltYXJjaGUgZW5jb3JlIHBsdXMgcHJvY2hlIGRlcyBwcsOpb2NjdXBhdGlvbnMgZGVzIGdlbnMgOiBjZSBzb250IGRlcyBoaXN0b2lyZXNcclxuICAgICAgICAgICAgICAgIHLDqWVsbGVzIGRlIE1hcm9jYWlucyBpc3N1cyBkZSB0b3V0ZXMgbGVzIGNsYXNzZXMgc29jaWFsZXMgZXQgcXVpIG9udCByw6l1c3NpIMOgIGF0dGVpbmRyZSBsZXVycyBvYmplY3RpZnMgZGFuc1xyXG4gICAgICAgICAgICAgICAgZGlmZsOpcmVudHMgc2VjdGV1cnMgZGUgbGEgdmllIGdyw6JjZSBhdSBzb3V0aWVuIGRlIGxldXIgYmFucXVlLmAsXHJcbiAgICAgICAgaW1hZ2U6ICdhc3NldHMvaW1nL21lZGlhLWltZy5wbmcnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJ10sXHJcbiAgICAgICAgZGF0ZTogJzIxLzEwLzIwMTcnLFxyXG4gICAgICAgIHRpdGxlOiAnSElTVE9JUkVTIFBPUFVMQUlSRVMnLFxyXG4gICAgICAgIGNvbnRlbnQ6IGBMYSBjYW1wYWduZSDigJxIaXN0b2lyZXMgcG9wdWxhaXJlc+KAnSBhZG9wdGUgdW5lIGTDqW1hcmNoZSBlbmNvcmUgcGx1cyBwcm9jaGUgZGVzIHByw6lvY2N1cGF0aW9ucyBkZXMgZ2VucyA6IGNlIHNvbnQgZGVzIGhpc3RvaXJlc1xyXG4gICAgICAgICAgICAgICAgcsOpZWxsZXMgZGUgTWFyb2NhaW5zIGlzc3VzIGRlIHRvdXRlcyBsZXMgY2xhc3NlcyBzb2NpYWxlcyBldCBxdWkgb250IHLDqXVzc2kgw6AgYXR0ZWluZHJlIGxldXJzIG9iamVjdGlmcyBkYW5zXHJcbiAgICAgICAgICAgICAgICBkaWZmw6lyZW50cyBzZWN0ZXVycyBkZSBsYSB2aWUgZ3LDomNlIGF1IHNvdXRpZW4gZGUgbGV1ciBiYW5xdWUuYCxcclxuICAgICAgICBpbWFnZTogJ2Fzc2V0cy9pbWcvbWVkaWEtaW1nLnBuZydcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0ZJTkFOQ0UnXSxcclxuICAgICAgICBkYXRlOiAnMjEvMDcvMjAxOCcsXHJcbiAgICAgICAgdGl0bGU6ICdISVNUT0lSRVMgUE9QVUxBSVJFUycsXHJcbiAgICAgICAgY29udGVudDogYExhIGNhbXBhZ25lIOKAnEhpc3RvaXJlcyBwb3B1bGFpcmVz4oCdIGFkb3B0ZSB1bmUgZMOpbWFyY2hlIGVuY29yZSBwbHVzIHByb2NoZSBkZXMgcHLDqW9jY3VwYXRpb25zIGRlcyBnZW5zIDogY2Ugc29udCBkZXMgaGlzdG9pcmVzXHJcbiAgICAgICAgICAgICAgICByw6llbGxlcyBkZSBNYXJvY2FpbnMgaXNzdXMgZGUgdG91dGVzIGxlcyBjbGFzc2VzIHNvY2lhbGVzIGV0IHF1aSBvbnQgcsOpdXNzaSDDoCBhdHRlaW5kcmUgbGV1cnMgb2JqZWN0aWZzIGRhbnNcclxuICAgICAgICAgICAgICAgIGRpZmbDqXJlbnRzIHNlY3RldXJzIGRlIGxhIHZpZSBncsOiY2UgYXUgc291dGllbiBkZSBsZXVyIGJhbnF1ZS5gLFxyXG4gICAgICAgIGltYWdlOiAnYXNzZXRzL2ltZy9tZWRpYS1pbWcucG5nJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8wNy8yMDE4JyxcclxuICAgICAgICB0aXRsZTogJ0hJU1RPSVJFUyBQT1BVTEFJUkVTJyxcclxuICAgICAgICBjb250ZW50OiBgTGEgY2FtcGFnbmUg4oCcSGlzdG9pcmVzIHBvcHVsYWlyZXPigJ0gYWRvcHRlIHVuZSBkw6ltYXJjaGUgZW5jb3JlIHBsdXMgcHJvY2hlIGRlcyBwcsOpb2NjdXBhdGlvbnMgZGVzIGdlbnMgOiBjZSBzb250IGRlcyBoaXN0b2lyZXNcclxuICAgICAgICAgICAgICAgIHLDqWVsbGVzIGRlIE1hcm9jYWlucyBpc3N1cyBkZSB0b3V0ZXMgbGVzIGNsYXNzZXMgc29jaWFsZXMgZXQgcXVpIG9udCByw6l1c3NpIMOgIGF0dGVpbmRyZSBsZXVycyBvYmplY3RpZnMgZGFuc1xyXG4gICAgICAgICAgICAgICAgZGlmZsOpcmVudHMgc2VjdGV1cnMgZGUgbGEgdmllIGdyw6JjZSBhdSBzb3V0aWVuIGRlIGxldXIgYmFucXVlLmAsXHJcbiAgICAgICAgaW1hZ2U6ICdhc3NldHMvaW1nL21lZGlhLWltZy5wbmcnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJ10sXHJcbiAgICAgICAgZGF0ZTogJzIxLzA3LzIwMTknLFxyXG4gICAgICAgIHRpdGxlOiAnSElTVE9JUkVTIFBPUFVMQUlSRVMnLFxyXG4gICAgICAgIGNvbnRlbnQ6IGBMYSBjYW1wYWduZSDigJxIaXN0b2lyZXMgcG9wdWxhaXJlc+KAnSBhZG9wdGUgdW5lIGTDqW1hcmNoZSBlbmNvcmUgcGx1cyBwcm9jaGUgZGVzIHByw6lvY2N1cGF0aW9ucyBkZXMgZ2VucyA6IGNlIHNvbnQgZGVzIGhpc3RvaXJlc1xyXG4gICAgICAgICAgICAgICAgcsOpZWxsZXMgZGUgTWFyb2NhaW5zIGlzc3VzIGRlIHRvdXRlcyBsZXMgY2xhc3NlcyBzb2NpYWxlcyBldCBxdWkgb250IHLDqXVzc2kgw6AgYXR0ZWluZHJlIGxldXJzIG9iamVjdGlmcyBkYW5zXHJcbiAgICAgICAgICAgICAgICBkaWZmw6lyZW50cyBzZWN0ZXVycyBkZSBsYSB2aWUgZ3LDomNlIGF1IHNvdXRpZW4gZGUgbGV1ciBiYW5xdWUuYCxcclxuICAgICAgICBpbWFnZTogJ2Fzc2V0cy9pbWcvbWVkaWEtaW1nLnBuZydcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0ZJTkFOQ0UnXSxcclxuICAgICAgICBkYXRlOiAnMjEvMDcvMjAyMCcsXHJcbiAgICAgICAgdGl0bGU6ICdISVNUT0lSRVMgUE9QVUxBSVJFUycsXHJcbiAgICAgICAgY29udGVudDogYExhIGNhbXBhZ25lIOKAnEhpc3RvaXJlcyBwb3B1bGFpcmVz4oCdIGFkb3B0ZSB1bmUgZMOpbWFyY2hlIGVuY29yZSBwbHVzIHByb2NoZSBkZXMgcHLDqW9jY3VwYXRpb25zIGRlcyBnZW5zIDogY2Ugc29udCBkZXMgaGlzdG9pcmVzXHJcbiAgICAgICAgICAgICAgICByw6llbGxlcyBkZSBNYXJvY2FpbnMgaXNzdXMgZGUgdG91dGVzIGxlcyBjbGFzc2VzIHNvY2lhbGVzIGV0IHF1aSBvbnQgcsOpdXNzaSDDoCBhdHRlaW5kcmUgbGV1cnMgb2JqZWN0aWZzIGRhbnNcclxuICAgICAgICAgICAgICAgIGRpZmbDqXJlbnRzIHNlY3RldXJzIGRlIGxhIHZpZSBncsOiY2UgYXUgc291dGllbiBkZSBsZXVyIGJhbnF1ZS5gLFxyXG4gICAgICAgIGltYWdlOiAnYXNzZXRzL2ltZy9tZWRpYS1pbWcucG5nJ1xyXG4gICAgICB9XHJcbiAgICBdXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjbGVhblRhZyAodGFnRmlsdGVyKSB7XHJcbiAgICB0YWdGaWx0ZXIgPSB0YWdGaWx0ZXIudG9Mb3dlckNhc2UoKVxyXG4gICAgaWYgKHRhZ0ZpbHRlclswXSA9PSAnIycpIHtcclxuICAgICAgdGFnRmlsdGVyID0gdGFnRmlsdGVyLnNsaWNlKDEpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRhZ0ZpbHRlclxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbWFrZURhdGVPYmplY3QgKGRhdGVTdHJpbmcpIHtcclxuICAgIGxldCBbZGF5LCBtb250aCwgeWVhcl0gPSBkYXRlU3RyaW5nLnNwbGl0KCcvJylcclxuXHJcbiAgICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGggLSAxLCBkYXkpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhcHBseUZpbHRlcnMgKCkge1xyXG4gICAgbGV0IGRhdGEgPSBzdGF0ZS5kYXRhXHJcbiAgICBpZiAoc3RhdGUuZmlsdGVycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGRhdGEgPSBkYXRhLmZpbHRlcihwb3N0ID0+IHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXRlLmZpbHRlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGlmIChwb3N0LnRhZ3MuaW5jbHVkZXMoc3RhdGUuZmlsdGVyc1tpXS50b1VwcGVyQ2FzZSgpKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc3RhdGUuZGF0ZUZpbHRlci5mcm9tICYmIHN0YXRlLmRhdGVGaWx0ZXIudG8pIHtcclxuICAgICAgZGF0YSA9IGRhdGEuZmlsdGVyKHBvc3QgPT4ge1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgIG1ha2VEYXRlT2JqZWN0KHBvc3QuZGF0ZSkgLSBtYWtlRGF0ZU9iamVjdChzdGF0ZS5kYXRlRmlsdGVyLmZyb20pID49XHJcbiAgICAgICAgICAgIDAgJiZcclxuICAgICAgICAgIG1ha2VEYXRlT2JqZWN0KHBvc3QuZGF0ZSkgLSBtYWtlRGF0ZU9iamVjdChzdGF0ZS5kYXRlRmlsdGVyLnRvKSA8PSAwXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZGF0YSA9IGRhdGEuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICByZXR1cm4gc3RhdGUub3JkZXIgPT0gJ2Rlc2MnXHJcbiAgICAgICAgPyBtYWtlRGF0ZU9iamVjdChiLmRhdGUpIC0gbWFrZURhdGVPYmplY3QoYS5kYXRlKVxyXG4gICAgICAgIDogbWFrZURhdGVPYmplY3QoYS5kYXRlKSAtIG1ha2VEYXRlT2JqZWN0KGIuZGF0ZSlcclxuICAgIH0pXHJcblxyXG4gICAgc2hvd1NlbGVjdGVkKGRhdGEpXHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGNoYW5nZUZpbHRlcnMgKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG5cclxuICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJylcclxuXHJcbiAgICBzdGF0ZS5maWx0ZXJzID0gW11cclxuXHJcbiAgICB0YWdGaWx0ZXJzLmZvckVhY2goZnVuY3Rpb24gKHRhZykge1xyXG4gICAgICBpZiAoJCh0YWcpLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xyXG4gICAgICAgIHN0YXRlLmZpbHRlcnMucHVzaChjbGVhblRhZyh0YWcuaW5uZXJUZXh0KSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICBpZiAoc3RhdGUuZmlsdGVycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGFsbEZpbHRlckJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYWxsRmlsdGVyQnRuLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlGaWx0ZXJzKClcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNob3dTZWxlY3RlZCAoZGF0YSkge1xyXG4gICAgbGV0IHNlbGVjdGVkRGF0YSA9IGRhdGEuc2xpY2UoMCwgc3RhdGUubWF4ICogMylcclxuXHJcbiAgICBjb25zb2xlLmxvZyhkYXRhLmxlbmd0aClcclxuICAgIGNvbnNvbGUubG9nKHNlbGVjdGVkRGF0YS5sZW5ndGgpXHJcblxyXG4gICAgaWYgKHNlbGVjdGVkRGF0YS5sZW5ndGggPj0gZGF0YS5sZW5ndGgpIHtcclxuICAgICAgJCgnI21vcmUtbWVkaWFjZW50ZXInKS5oaWRlKClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoJyNtb3JlLW1lZGlhY2VudGVyJykuc2hvdygpXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHNlbGVjdGVkRGF0YSlcclxuICB9XHJcblxyXG4gIGFwcGx5RmlsdGVycygpXHJcblxyXG4gICQoJyNtb3JlLW1lZGlhY2VudGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgc3RhdGUubWF4KytcclxuICAgIGFwcGx5RmlsdGVycygpXHJcblxyXG4gICAgdGhpcy5zY3JvbGxJbnRvVmlldyh7XHJcbiAgICAgIGJlaGF2aW9yOiAnc21vb3RoJyxcclxuICAgICAgaW5saW5lOiAnZW5kJ1xyXG4gICAgfSlcclxuICAgIGlmIChzdGF0ZS5tYXggKyAxID4gc3RhdGUuZGF0YS5sZW5ndGggLyAzKSAkKHRoaXMpLmhpZGUoKVxyXG4gIH0pXHJcblxyXG4gIGZ1bmN0aW9uIHJlbmRlciAoZGF0YSkge1xyXG4gICAgbWVkaWFjZW50ZXJIb2xkZXIuaW5uZXJIVE1MID0gZGF0YVxyXG4gICAgICAubWFwKChwb3N0LCBpbmRleCkgPT4ge1xyXG4gICAgICAgIGlmIChpbmRleCAlIDIgPT09IDApIHtcclxuICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cIm1lZGlhLWNhcmQgbXktOCBcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwiY29sLW1kLTUgbWVkaWEtY2FyZF9faW1nc2lkZVwiIGhyZWY9XCIvZ2JwLWZyb250L21lZGlhY2VudGVyLWRldGFpbC5odG1sXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzPVwibWVkaWEtY2FyZF9faW1nXCIgc3JjPVwiJHtwb3N0LmltYWdlfVwiIGFsdD1cIm1lZGlhIGltYWdlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC03IG1lZGlhLWNhcmRfX2NvbnRlbnRzaWRlIFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQtbWVkaWFfX3RhZyBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7cG9zdC50YWdzXHJcbiAgICAgICAgICAgIC5tYXAoXHJcbiAgICAgICAgICAgICAgdGFnID0+XHJcbiAgICAgICAgICAgICAgICBgPGEgY2xhc3M9XCJidG4gYnRuLS10YWcgYnRuLS1vcmFuZ2UgYWN0aXZlIG1yLTFcIiBocmVmPVwiL2dicC1mcm9udC9tZWRpYWNlbnRlci5odG1sXCI+ICMke3RhZ308L2E+YFxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgIC5qb2luKCcnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzPVwibWVkaWEtY2FyZF9fdGl0bGVcIj4ke3Bvc3QudGl0bGV9PC9oMj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwibWVkaWEtY2FyZF9fY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7cG9zdC5jb250ZW50fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhLWNhcmRfX2Zvb3RlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWZvb3Rlcl9fbWV0YWRhdGFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZyBjbGFzcz1cImNhcmQtZm9vdGVyX19kYXRldGl0bGVcIj5EYXRlIGRlIGxhbmNlbWVudDwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNhcmQtZm9vdGVyX19kYXRlXCI+JHtwb3N0LmRhdGV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWZvb3Rlcl9fYWN0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIvZ2JwLWZyb250L21lZGlhY2VudGVyLWRldGFpbC5odG1sXCI+RMOJQ09VVlJJUjwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PmBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwibWVkaWEtY2FyZCBtZWRpYS1jYXJkLS1yZXZlcnNlIG15LThcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTcgbWVkaWEtY2FyZF9fY29udGVudHNpZGVcIj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQtbWVkaWFfX3RhZyBcIj5cclxuICAgICAgICAgICAgICAgICAgJHtwb3N0LnRhZ3NcclxuICAgICAgICAgICAgLm1hcChcclxuICAgICAgICAgICAgICB0YWcgPT5cclxuICAgICAgICAgICAgICAgIGA8YSBjbGFzcz1cImJ0biBidG4tLXRhZyBidG4tLW9yYW5nZSBhY3RpdmUgbXItMVwiIGhyZWY9XCIvZ2JwLWZyb250L21lZGlhY2VudGVyLmh0bWxcIj4gIyR7dGFnfTwvYT5gXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgLmpvaW4oJycpfVxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzPVwibWVkaWEtY2FyZF9fdGl0bGVcIj4ke3Bvc3QudGl0bGV9PC9oMj5cclxuICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJtZWRpYS1jYXJkX19jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICR7cG9zdC5jb250ZW50fVxyXG4gICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYS1jYXJkX19mb290ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWZvb3Rlcl9fbWV0YWRhdGFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nIGNsYXNzPVwiY2FyZC1mb290ZXJfX2RhdGV0aXRsZVwiPkRhdGUgZGUgbGFuY2VtZW50PC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjYXJkLWZvb3Rlcl9fZGF0ZVwiPiR7cG9zdC5kYXRlfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQtZm9vdGVyX19hY3Rpb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiL2dicC1mcm9udC9tZWRpYWNlbnRlci1kZXRhaWwuaHRtbFwiPkTDiUNPVVZSSVI8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGEgY2xhc3M9XCJjb2wtbWQtNSBtZWRpYS1jYXJkX19pbWdzaWRlXCIgaHJlZj1cIi9nYnAtZnJvbnQvbWVkaWFjZW50ZXItZGV0YWlsLmh0bWxcIj5cclxuICAgICAgICAgICAgICAgICAgPGltZyBjbGFzcz1cIm1lZGlhLWNhcmRfX2ltZ1wiIHNyYz1cIiR7cG9zdC5pbWFnZX1cIiBhbHQ9XCJtZWRpYSBpbWFnZVwiPlxyXG4gICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5gXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuam9pbignJylcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGRhdGVGb3JtYXQgKGRhdGUpIHtcclxuICAgIHJldHVybiBgMS8ke2RhdGUubW9udGgoKSArIDF9LyR7ZGF0ZS55ZWFyKCl9YFxyXG4gIH1cclxuXHJcbiAgbGV0IHN0YXJ0RmlsdGVyID0gbmV3IERhdGVGaWx0ZXIoc3RhcnREYXRlLCBmYWxzZSwgZnVuY3Rpb24gKHN0YXJ0KSB7XHJcbiAgICBzdGF0ZS5kYXRlRmlsdGVyLmZyb20gPSBkYXRlRm9ybWF0KHN0YXJ0KVxyXG4gICAgYXBwbHlGaWx0ZXJzKClcclxuICB9KVxyXG4gIHN0YXJ0RmlsdGVyLmluaXQoKVxyXG5cclxuICBsZXQgZW5kRmlsdGVyID0gbmV3IERhdGVGaWx0ZXIoZW5kRGF0ZSwgdHJ1ZSwgZnVuY3Rpb24gKGVuZCkge1xyXG4gICAgc3RhdGUuZGF0ZUZpbHRlci50byA9IGRhdGVGb3JtYXQoZW5kKVxyXG4gICAgYXBwbHlGaWx0ZXJzKClcclxuICB9KVxyXG4gIGVuZEZpbHRlci5pbml0KClcclxuXHJcbiAgJCgnI21lZGlhY2VudGVyLXNlbGVjdC1maWx0ZXInKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IHNlbGVjdGVkID0gJCgnI21lZGlhY2VudGVyLXNlbGVjdC1maWx0ZXInKVxyXG4gICAgICAubmV4dCgpXHJcbiAgICAgIC5maW5kKCcuY3VycmVudCcpXHJcbiAgICAgIC50ZXh0KClcclxuICAgIHNlbGVjdGVkID0gc2VsZWN0ZWQudG9Mb3dlckNhc2UoKVxyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKHNlbGVjdGVkKVxyXG5cclxuICAgICQoJyNkYXRlLWZpbHRlcicpLmFkZENsYXNzKCdkLWZsZXgnKVxyXG4gICAgJCgnI2RhdGUtZmlsdGVyJykuc2hvdygpXHJcblxyXG4gICAgaWYgKHNlbGVjdGVkICE9PSAncMOpcmlvZGUnKSB7XHJcbiAgICAgICQoJyNkYXRlLWZpbHRlcicpLnJlbW92ZUNsYXNzKCdkLWZsZXgnKVxyXG4gICAgICAkKCcjZGF0ZS1maWx0ZXInKS5oaWRlKClcclxuICAgICAgc3RhdGUub3JkZXIgPSAnZGVzYydcclxuICAgICAgc3RhdGUuZGF0ZUZpbHRlci5mcm9tID0gJydcclxuICAgICAgc3RhdGUuZGF0ZUZpbHRlci50byA9ICcnXHJcbiAgICAgIHN0YXJ0RmlsdGVyLmNsZWFyKClcclxuICAgICAgZW5kRmlsdGVyLmNsZWFyKClcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2VsZWN0ZWQgPT09ICdwbHVzIGFuY2llbnMnKSB7XHJcbiAgICAgIHN0YXRlLm9yZGVyID0gJ2FzYydcclxuICAgICAgYXBwbHlGaWx0ZXJzKClcclxuICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWQgPT09ICdwbHVzIHLDqWNlbnRzJykge1xyXG4gICAgICBhcHBseUZpbHRlcnMoKVxyXG4gICAgICBzdGF0ZS5vcmRlciA9ICdkZXNjJ1xyXG4gICAgfVxyXG4gIH0pXHJcblxyXG4gIGFsbEZpbHRlckJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIHN0YXRlLmZpbHRlcnMgPSBbXVxyXG4gICAgdGFnRmlsdGVycy5mb3JFYWNoKHRhZyA9PiB7XHJcbiAgICAgIHRhZy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgfSlcclxuICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgIGFwcGx5RmlsdGVycygpXHJcbiAgfSlcclxuICB0YWdGaWx0ZXJzLmZvckVhY2godGFnID0+IHtcclxuICAgIHRhZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNoYW5nZUZpbHRlcnMpXHJcbiAgfSlcclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgc2xpZGVySW5kZXg7XHJcblxyXG4gICAgaWYgKCQoJy5ub3MtYmFucXVlcycpLmxlbmd0aCkge1xyXG4gICAgICAgIGhhbmRsZUV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCQoJy5ub3MtYmFucXVlcyAub3dsLWNhcm91c2VsJykubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgIHZhciBydGwgPSAkKCdodG1sJykuYXR0cignZGlyJykgPT0gJ3J0bCc7XHJcblxyXG4gICAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG4gICAgICAgICAgICAkKCcubm9zLWJhbnF1ZXMgLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgICAgIGJhbnF1ZXNTbGlkZXIoMCAscnRsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKCcubm9zLWJhbnF1ZXMgLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgICAgIGJhbnF1ZXNTbGlkZXIoMCwgcnRsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuICAgICAgICAgICAgICAgICQoJy5ub3MtYmFucXVlcyAub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoJ2Rlc3Ryb3knKTtcclxuICAgICAgICAgICAgICAgIGJhbnF1ZXNTbGlkZXIoMCwgcnRsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoJy5ub3MtYmFucXVlcyAub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoJ2Rlc3Ryb3knKTtcclxuICAgICAgICAgICAgICAgIGJhbnF1ZXNTbGlkZXIoMCwgcnRsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZW1vdmVIYXNoICgpIHsgXHJcbiAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUoJycsIGRvY3VtZW50LnRpdGxlLCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBiYW5xdWVzU2xpZGVyKHN0YWdlUGFkZGluZywgcnRsKSB7XHJcbiAgICAgICAgdmFyIG93bCA9ICQoJy5ub3MtYmFucXVlcyAub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBzdGFnZVBhZGRpbmc6IHN0YWdlUGFkZGluZyxcclxuICAgICAgICAgICAgbWFyZ2luOiAwLFxyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBuYXY6IHRydWUsXHJcbiAgICAgICAgICAgIGxvb3A6IHRydWUsXHJcbiAgICAgICAgICAgIFVSTGhhc2hMaXN0ZW5lcjogdHJ1ZSxcclxuICAgICAgICAgICAgbmF2U3BlZWQ6IDEwMDAsXHJcbiAgICAgICAgICAgIHJ0bDogcnRsLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgb3dsLm9uKFwiZHJhZy5vd2wuY2Fyb3VzZWxcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChldmVudC5yZWxhdGVkVGFyZ2V0WydfZHJhZyddWydkaXJlY3Rpb24nXSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpbmRleEJlZm9yZUNoYW5nZSA9IGV2ZW50LnBhZ2UuaW5kZXg7XHJcblxyXG4gICAgICAgICAgICAgICAgc2xpZGVySW5kZXggPSBpbmRleEJlZm9yZUNoYW5nZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgb3dsLm9uKFwiZHJhZ2dlZC5vd2wuY2Fyb3VzZWxcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBpbmRleEFmdGVyQ2hhbmdlID0gZXZlbnQucGFnZS5pbmRleDtcclxuXHJcbiAgICAgICAgICAgIGlmIChldmVudC5yZWxhdGVkVGFyZ2V0WydfZHJhZyddWydkaXJlY3Rpb24nXSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpbmRleEFmdGVyQ2hhbmdlICE9PSBzbGlkZXJJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5yZWxhdGVkVGFyZ2V0WydfZHJhZyddWydkaXJlY3Rpb24nXSA9PT0gXCJsZWZ0XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXYoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZXZlbnQpXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcub3dsLW5leHQnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcub3dsLXByZXYnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcHJldigpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBuZXh0KCkge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudEl0ZW0gPSAkKCcubm9zLWJhbnF1ZXNfbGlua3MgLml0ZW0uYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgICBjdXJyZW50SXRlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudEl0ZW0uaXMoJzpsYXN0LWNoaWxkJykpIHtcclxuICAgICAgICAgICAgICAgICQoJy5ub3MtYmFucXVlc19saW5rcyAuaXRlbTpmaXJzdC1jaGlsZCcpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRJdGVtLm5leHQoKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHByZXYoKSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50SXRlbSA9ICQoJy5ub3MtYmFucXVlc19saW5rcyAuaXRlbS5hY3RpdmUnKTtcclxuXHJcbiAgICAgICAgICAgIGN1cnJlbnRJdGVtLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50SXRlbS5pcygnOmZpcnN0LWNoaWxkJykpIHtcclxuICAgICAgICAgICAgICAgICQoJy5ub3MtYmFucXVlc19saW5rcyAuaXRlbTpsYXN0LWNoaWxkJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEl0ZW0ucHJldigpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaGFuZGxlRXZlbnRMaXN0ZW5lcnMoKSB7XHJcblxyXG4gICAgICAgICQoJy5ub3MtYmFucXVlc19saW5rcyAuaXRlbTpmaXJzdC1jaGlsZCcpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICAgICAgJCgnLm5vcy1iYW5xdWVzX2xpbmtzIC5pdGVtJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgY2xpY2tlZEl0ZW0gPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFjbGlja2VkSXRlbS5oYXNDbGFzcygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgICAgICQoJy5ub3MtYmFucXVlc19saW5rcyAuaXRlbS5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICBjbGlja2VkSXRlbS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgc2VhcmNoSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcG9wdXAtc2VhcmNoLWlucHV0JylcclxuICBsZXQgdGFnRmlsdGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wb3B1cC1zZWFyY2hfdGFnJylcclxuICBsZXQgYWxsRmlsdGVyQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBvcHVwLXNlYXJjaF90YWctLWFsbCcpXHJcblxyXG4gIGlmICghc2VhcmNoSW5wdXQpIHJldHVyblxyXG5cclxuICBsZXQgc3RhdGUgPSB7XHJcbiAgICBzZWFyY2g6ICcnLFxyXG4gICAgZmlsdGVyczogW10sXHJcbiAgICBkYXRhOiBbXHJcbiAgICAgIHtcclxuICAgICAgICBjYXRlZ29yeTogJ0FDVFVBTElURVMnLFxyXG4gICAgICAgIHRhZ3M6IFsnYXJ0aWNsZXMnLCAndmlkZW9zJ10sXHJcbiAgICAgICAgdGV4dDogJ0xvcmVtMSBpcHN1bSBkb2xvciBzZXQgYW1ldCdcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGNhdGVnb3J5OiAnQUNUVUFMSVRFUycsXHJcbiAgICAgICAgdGFnczogWydhcnRpY2xlcycsICd2aWRlb3MnXSxcclxuICAgICAgICB0ZXh0OiAnTG9yZW0yIGlwc3VtIGRvbG9yIHNldCBhbWV0J1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgY2F0ZWdvcnk6ICdBQ1RVQUxJVEVTJyxcclxuICAgICAgICB0YWdzOiBbJ2FydGljbGVzJywgJ3ZpZGVvcycsICdpbWFnZXMnXSxcclxuICAgICAgICB0ZXh0OiAnTG9yZW0xIGlwc3VtIGRvbG9yIHNldCBhbWV0J1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgY2F0ZWdvcnk6ICdBQ1RVQUxJVEVTJyxcclxuICAgICAgICB0YWdzOiBbJ2FydGljbGVzJywgJ3ZpZGVvcyddLFxyXG4gICAgICAgIHRleHQ6ICdMb3JlbTMgaXBzdW0gZG9sb3Igc2V0IGFtZXQnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBjYXRlZ29yeTogJ0NPTU1VTklRVcOJUycsXHJcbiAgICAgICAgdGFnczogWydhcnRpY2xlcycsICd2aWRlb3MnLCAnaW1hZ2VzJ10sXHJcbiAgICAgICAgdGV4dDogJ0xvcmVtMSBpcHN1bSBkb2xvciBzZXQgYW1ldCdcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGNhdGVnb3J5OiAnQ09NTVVOSVFVw4lTJyxcclxuICAgICAgICB0YWdzOiBbJ2FydGljbGVzJywgJ3ZpZGVvcyddLFxyXG4gICAgICAgIHRleHQ6ICdMb3JlbTEgaXBzdW0gZG9sb3Igc2V0IGFtZXQnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBjYXRlZ29yeTogJ0NPTU1VTklRVcOJUycsXHJcbiAgICAgICAgdGFnczogWydhcnRpY2xlcycsICd2aWRlb3MnLCAnaW1hZ2VzJ10sXHJcbiAgICAgICAgdGV4dDogJ0xvcmVtMiBpcHN1bSBkb2xvciBzZXQgYW1ldCdcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGNhdGVnb3J5OiAnQ09NTVVOSVFVw4lTJyxcclxuICAgICAgICB0YWdzOiBbJ2FydGljbGVzJywgJ3ZpZGVvcyddLFxyXG4gICAgICAgIHRleHQ6ICdMb3JlbTEgaXBzdW0gZG9sb3Igc2V0IGFtZXQnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBjYXRlZ29yeTogJ0NPTU1VTklRVcOJUycsXHJcbiAgICAgICAgdGFnczogWydhcnRpY2xlcycsICd2aWRlb3MnXSxcclxuICAgICAgICB0ZXh0OiAnTG9yZW0zIGlwc3VtIGRvbG9yIHNldCBhbWV0J1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgY2F0ZWdvcnk6ICdQUkVTU0UnLFxyXG4gICAgICAgIHRhZ3M6IFsnYXJ0aWNsZXMnLCAndmlkZW9zJywgJ2ltYWdlcyddLFxyXG4gICAgICAgIHRleHQ6ICdMb3JlbTIgaXBzdW0gZG9sb3Igc2V0IGFtZXQnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBjYXRlZ29yeTogJ1BSRVNTRScsXHJcbiAgICAgICAgdGFnczogWydhcnRpY2xlcycsICd2aWRlb3MnXSxcclxuICAgICAgICB0ZXh0OiAnTG9yZW0xIGlwc3VtIGRvbG9yIHNldCBhbWV0J1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgY2F0ZWdvcnk6ICdQUkVTU0UnLFxyXG4gICAgICAgIHRhZ3M6IFsnYXJ0aWNsZXMnLCAndmlkZW9zJ10sXHJcbiAgICAgICAgdGV4dDogJ0xvcmVtMyBpcHN1bSBkb2xvciBzZXQgYW1ldCdcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGNhdGVnb3J5OiAnQ09NUEFHTkVTIFBVQicsXHJcbiAgICAgICAgdGFnczogWydhcnRpY2xlcycsICd2aWRlb3MnLCAnaW1hZ2VzJ10sXHJcbiAgICAgICAgdGV4dDogJ0xvcmVtMiBpcHN1bSBkb2xvciBzZXQgYW1ldCdcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGNhdGVnb3J5OiAnQ09NUEFHTkVTIFBVQicsXHJcbiAgICAgICAgdGFnczogWydhcnRpY2xlcycsICd2aWRlb3MnXSxcclxuICAgICAgICB0ZXh0OiAnTG9yZW0xIGlwc3VtIGRvbG9yIHNldCBhbWV0J1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgY2F0ZWdvcnk6ICdSQVBQT1JUUyBGSU5BTkNJRVJTJyxcclxuICAgICAgICB0YWdzOiBbJ2FydGljbGVzJywgJ3ZpZGVvcyddLFxyXG4gICAgICAgIHRleHQ6ICdMb3JlbTMgaXBzdW0gZG9sb3Igc2V0IGFtZXQnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBjYXRlZ29yeTogJ1JBUFBPUlRTIEZJTkFOQ0lFUlMnLFxyXG4gICAgICAgIHRhZ3M6IFsnYXJ0aWNsZXMnLCAndmlkZW9zJywgJ2ltYWdlcyddLFxyXG4gICAgICAgIHRleHQ6ICdMb3JlbTIgaXBzdW0gZG9sb3Igc2V0IGFtZXQnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBjYXRlZ29yeTogJ1JBUFBPUlRTIEZJTkFOQ0lFUlMnLFxyXG4gICAgICAgIHRhZ3M6IFsnYXJ0aWNsZXMnLCAndmlkZW9zJ10sXHJcbiAgICAgICAgdGV4dDogJ0xvcmVtMSBpcHN1bSBkb2xvciBzZXQgYW1ldCdcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGNhdGVnb3J5OiAnUkFQUE9SVFMgRklOQU5DSUVSUycsXHJcbiAgICAgICAgdGFnczogWydhcnRpY2xlcycsICd2aWRlb3MnXSxcclxuICAgICAgICB0ZXh0OiAnTG9yZW0zIGlwc3VtIGRvbG9yIHNldCBhbWV0J1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgY2F0ZWdvcnk6ICdBVVRSRVMnLFxyXG4gICAgICAgIHRhZ3M6IFsnYXJ0aWNsZXMnLCAndmlkZW9zJywgJ2ltYWdlcyddLFxyXG4gICAgICAgIHRleHQ6ICdMb3JlbTIgaXBzdW0gZG9sb3Igc2V0IGFtZXQnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBjYXRlZ29yeTogJ0FVVFJFUycsXHJcbiAgICAgICAgdGFnczogWydhcnRpY2xlcycsICd2aWRlb3MnXSxcclxuICAgICAgICB0ZXh0OiAnTG9yZW0xIGlwc3VtIGRvbG9yIHNldCBhbWV0J1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgY2F0ZWdvcnk6ICdBVVRSRVMnLFxyXG4gICAgICAgIHRhZ3M6IFsnYXJ0aWNsZXMnLCAndmlkZW9zJ10sXHJcbiAgICAgICAgdGV4dDogJ0xvcmVtMyBpcHN1bSBkb2xvciBzZXQgYW1ldCdcclxuICAgICAgfVxyXG4gICAgXVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY2xlYW5UYWcgKHRhZ0ZpbHRlcikge1xyXG4gICAgdGFnRmlsdGVyID0gdGFnRmlsdGVyLnRyaW0oKS50b0xvd2VyQ2FzZSgpXHJcbiAgICBpZiAodGFnRmlsdGVyWzBdID09ICcjJykge1xyXG4gICAgICB0YWdGaWx0ZXIgPSB0YWdGaWx0ZXIuc2xpY2UoMSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGFnRmlsdGVyXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBtYXRjaFRhZ3MgKHRhZ3MsIGZpbHRlcnMpIHtcclxuICAgIHJldHVybiB0YWdzLnNvbWUodGFnID0+IHtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWx0ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHRhZy5pbmNsdWRlcyhmaWx0ZXJzW2ldKSkgcmV0dXJuIHRydWVcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY2hlY2tTZWFyY2hSZXN1bHQgKCkge1xyXG4gICAgaWYgKHN0YXRlLnNlYXJjaCkge1xyXG4gICAgICAkKCcucG9wdXAtc2VhcmNoX3Jlc3VsdCcpLnNob3coKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgnLnBvcHVwLXNlYXJjaF9yZXN1bHQnKS5oaWRlKClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFwcGx5RmlsdGVycyAoKSB7XHJcbiAgICBsZXQgZGF0YSA9IHN0YXRlLmRhdGFcclxuXHJcbiAgICBpZiAoc3RhdGUuc2VhcmNoKSB7XHJcbiAgICAgIGRhdGEgPSBkYXRhXHJcbiAgICAgICAgLmZpbHRlcihwb3N0ID0+IHtcclxuICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgcG9zdC50ZXh0LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc3RhdGUuc2VhcmNoLnRvTG93ZXJDYXNlKCkpICYmXHJcbiAgICAgICAgICAgIChtYXRjaFRhZ3MocG9zdC50YWdzLCBzdGF0ZS5maWx0ZXJzKSB8fCBzdGF0ZS5maWx0ZXJzLmxlbmd0aCA8PSAwKVxyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5tYXAocG9zdCA9PiB7XHJcbiAgICAgICAgICBsZXQgcmVnZXhwID0gbmV3IFJlZ0V4cChgKCR7c3RhdGUuc2VhcmNofSlgLCAnaScpXHJcblxyXG4gICAgICAgICAgbGV0IHRleHQgPSBwb3N0LnRleHQucmVwbGFjZShyZWdleHAsICc8c3BhbiBjbGFzcz1cImZvdW5kXCIgPiQxPC9zcGFuPicpXHJcblxyXG4gICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY2F0ZWdvcnk6IHBvc3QuY2F0ZWdvcnksXHJcbiAgICAgICAgICAgIHRhZ3M6IFsuLi5wb3N0LnRhZ3NdLFxyXG4gICAgICAgICAgICB0ZXh0OiB0ZXh0XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBjaGVja1NlYXJjaFJlc3VsdCgpXHJcblxyXG4gICAgcmVuZGVyKGRhdGEpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBmaWx0ZXJBbmRNYXAgKGVsZW0sIGRhdGEsIGNhdGVnb3J5KSB7XHJcbiAgICBsZXQgZm91bmRSZXN1bHQgPSBkYXRhXHJcbiAgICAgIC5maWx0ZXIocG9zdCA9PiB7XHJcbiAgICAgICAgaWYgKHBvc3QuY2F0ZWdvcnkgPT09ICdDT01NVU5JUVXDiVMnKSByZXR1cm4gdHJ1ZVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgfSlcclxuICAgICAgLm1hcChwb3N0ID0+IHtcclxuICAgICAgICBsZXQgdGV4dCA9IHBvc3QudGV4dFxyXG4gICAgICAgIHJldHVybiBgPGxpIGNsYXNzPVwiaXRlbVwiPlxyXG4gICAgICAgICAgICAgIDxhIGhyZWY9XCIvZ2JwLWZyb250L25ld3MtZGV0YWlsLmh0bWxcIj5cclxuICAgICAgICAgICAgICAgICAgJHt0ZXh0fVxyXG4gICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgIDwvbGk+YFxyXG4gICAgICB9KVxyXG5cclxuICAgIGVsZW0uZmluZCgndWwnKS5odG1sKGZvdW5kUmVzdWx0LmpvaW4oJycpKVxyXG4gICAgZWxlbS5maW5kKCcucG9wdXAtbWVudV9sZW5ndGgnKS50ZXh0KGZvdW5kUmVzdWx0Lmxlbmd0aClcclxuICAgIGlmIChmb3VuZFJlc3VsdC5sZW5ndGggPD0gMCkge1xyXG4gICAgICBlbGVtLmZpbmQoJy5pdGVtLXBsdXMnKS5oaWRlKClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGVsZW0uZmluZCgnLml0ZW0tcGx1cycpLnNob3coKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVuZGVyIChkYXRhKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhkYXRhKVxyXG5cclxuICAgIC8vIENPTU1VTklRVcOJU1xyXG4gICAgZmlsdGVyQW5kTWFwKCQoJyNzZWFyY2gtY29tbXVuaXF1ZXMnKSwgZGF0YSwgJ0NPTU1VTklRVcOJUycpXHJcbiAgICAvLyBBQ1RVQUxJVEVTXHJcbiAgICBmaWx0ZXJBbmRNYXAoJCgnI3NlYXJjaC1hY3R1YWxpdGVzJyksIGRhdGEsICdBQ1RVQUxJVEVTJylcclxuICAgIC8vIFJBUFBPUlRTIEZJTkFOQ0lFUlNcclxuICAgIGZpbHRlckFuZE1hcCgkKCcjc2VhcmNoLXJhcHBvcnRzJyksIGRhdGEsICdSQVBQT1JUUyBGSU5BTkNJRVJTJylcclxuICAgIC8vIEFVVFJFU1xyXG4gICAgZmlsdGVyQW5kTWFwKCQoJyNzZWFyY2gtYXV0cmVzJyksIGRhdGEsICdBVVRSRVMnKVxyXG4gICAgLy8gUFJFU1NFXHJcbiAgICBmaWx0ZXJBbmRNYXAoJCgnI3NlYXJjaC1wcmVzc2UnKSwgZGF0YSwgJ1BSRVNTRScpXHJcbiAgICAvLyBDT01QQUdORVMgUFVCXHJcbiAgICBmaWx0ZXJBbmRNYXAoJCgnI3NlYXJjaC1jb21wYWduZXMnKSwgZGF0YSwgJ0NPTVBBR05FUyBQVUInKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY2hhbmdlRmlsdGVycyAoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcblxyXG4gICAgdGhpcy5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKVxyXG5cclxuICAgIHN0YXRlLmZpbHRlcnMgPSBbXVxyXG5cclxuICAgIHRhZ0ZpbHRlcnMuZm9yRWFjaChmdW5jdGlvbiAodGFnKSB7XHJcbiAgICAgIGlmICgkKHRhZykuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgc3RhdGUuZmlsdGVycy5wdXNoKGNsZWFuVGFnKHRhZy5pbm5lclRleHQpKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKHN0YXRlLmZpbHRlcnMpXHJcblxyXG4gICAgaWYgKHN0YXRlLmZpbHRlcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICBhbGxGaWx0ZXJCdG4uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFsbEZpbHRlckJ0bi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5RmlsdGVycygpXHJcbiAgfVxyXG5cclxuICBhbGxGaWx0ZXJCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICBzdGF0ZS5maWx0ZXJzID0gW11cclxuICAgIHRhZ0ZpbHRlcnMuZm9yRWFjaCh0YWcgPT4ge1xyXG4gICAgICB0YWcuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgIH0pXHJcbiAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICBhcHBseUZpbHRlcnMoKVxyXG4gIH0pXHJcblxyXG4gIHRhZ0ZpbHRlcnMuZm9yRWFjaCh0YWcgPT4ge1xyXG4gICAgdGFnLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2hhbmdlRmlsdGVycylcclxuICB9KVxyXG5cclxuICBzZWFyY2hJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcclxuICAgIHN0YXRlLnNlYXJjaCA9IHRoaXMudmFsdWVcclxuICAgIGFwcGx5RmlsdGVycygpXHJcbiAgfSlcclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKCQoJy5oZWFkZXJfc2VhcmNoJykubGVuZ3RoKSB7XHJcbiAgICBhZGRFdmVudExpc3RlbmVycygpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhZGRFdmVudExpc3RlbmVycyAoKSB7XHJcbiAgICAkKCcuaGVhZGVyX3NlYXJjaC1wb3AsIC5oZWFkZXJfbW9iaWxlLXNlYXJjaCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgJCgnLnBhZ2UtY29udGVudCcpLmFkZENsYXNzKCdkLW5vbmUnKVxyXG4gICAgICAkKCcucG9wdXAtc2VhcmNoJykucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpXHJcbiAgICB9KVxyXG5cclxuICAgICQoJy5jbG9zZS13cmFwcGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCcucGFnZS1jb250ZW50JykucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpXHJcbiAgICAgICQoJy5wb3B1cC1zZWFyY2gnKS5hZGRDbGFzcygnZC1ub25lJylcclxuICAgIH0pXHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHRpZigkKCcuc3dpcGVib3gtLXZpZGVvJykubGVuZ3RoKSB7XHJcblx0XHRhZGRFdmVudExpc3RlbmVycygpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcnMgKCkge1xyXG5cdFx0JCgnLnN3aXBlYm94LS12aWRlbycpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0JCgnLnBhZ2UtY29udGVudCcpLmFkZENsYXNzKCdkLW5vbmUnKTtcclxuXHRcdFx0JCgnLnBvcHVwLXZpZGVvJykucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0JCgnLmNsb3NlLXdyYXBwZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCQoJy5wYWdlLWNvbnRlbnQnKS5yZW1vdmVDbGFzcygnZC1ub25lJyk7XHJcblx0XHRcdCQoJy5wb3B1cC12aWRlb19zZWN0aW9uIGlmcmFtZScpLnJlbW92ZSgpO1xyXG5cdFx0XHQkKCcucG9wdXAtdmlkZW8nKS5hZGRDbGFzcygnZC1ub25lJyk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQkKCcuc3dpcGVib3gtLXZpZGVvJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0dmFyIHl0YklkID0gJCh0aGlzKS5hdHRyKCdocmVmJyk7XHJcblxyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdHBsYXlWaWRlbyh5dGJJZCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQkKCcucG9wdXAtdmlkZW9fc2xpZGVyIC5zd2lwZWJveC0tdmlkZW8nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHR2YXIgeXRiSWQgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcclxuXHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0cGxheVZpZGVvKHl0YklkKTtcclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHBsYXlWaWRlbyh5dGJJZCkge1xyXG5cdFx0XHJcblxyXG5cdFx0dmFyIGh0bWwgPSBgPGlmcmFtZSAgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiNDAwXCIgXHJcblx0XHRcdFx0XHRcdHNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkLyR7eXRiSWR9P2F1dG9wbGF5PTFcIiBcclxuXHRcdFx0XHRcdFx0ZnJhbWVib3JkZXI9XCIwXCIgYWxsb3c9XCJhdXRvcGxheTsgZW5jcnlwdGVkLW1lZGlhXCIgYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPmA7XHJcblxyXG5cdFx0JCgnLnBvcHVwLXZpZGVvX3NlY3Rpb24gaWZyYW1lJykucmVtb3ZlKCk7XHJcblxyXG5cdFx0JCgnLnBvcHVwLXZpZGVvX3NlY3Rpb24nKS5wcmVwZW5kKGh0bWwpO1xyXG5cdH1cclxuXHJcblx0Ly8gY2Fyb3VzZWwgdmlkZW9cclxuXHRpZigkKCcucG9wdXAtdmlkZW9fc2xpZGVyJykubGVuZ3RoKSB7XHJcblxyXG5cdFx0dmFyIHJ0bCA9ICQoJ2h0bWwnKS5hdHRyKCdkaXInKSA9PSAncnRsJztcclxuXHJcblx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuXHRcdFx0cG9wdXBWaWRlb1NsaWRlcigwLCBydGwpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cG9wdXBWaWRlb1NsaWRlcigyMCwgcnRsKTtcclxuXHRcdH1cclxuXHJcblx0XHQkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblx0XHRcdFx0cG9wdXBWaWRlb1NsaWRlcigwLCBydGwpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHBvcHVwVmlkZW9TbGlkZXIoMjAsIHJ0bCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcG9wdXBWaWRlb1NsaWRlcihzdGFnZVBhZGRpbmcsIHJ0bCkge1xyXG4gICAgICAgICQoJy5wb3B1cC12aWRlb19zbGlkZXIub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBzdGFnZVBhZGRpbmc6IHN0YWdlUGFkZGluZyxcclxuICAgICAgICAgICAgbWFyZ2luOiAxMCxcclxuICAgICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgICAgIG5hdjogZmFsc2UsXHJcbiAgICAgICAgICAgIGxvb3A6IGZhbHNlLFxyXG4gICAgICAgICAgICBydGw6IHJ0bCxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZToge1xyXG4gICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAxXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgNzY4OiB7XHJcbiAgICAgICAgICAgICAgICBcdGl0ZW1zOiA1XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKCQoJy5wdWItc2xpZGVyJykubGVuZ3RoKSB7XHJcbiAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA5OTEpIHtcclxuICAgICAgYXJ0aWNsZVNsaWRlcigwKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYXJ0aWNsZVNsaWRlcigwKVxyXG4gICAgfVxyXG5cclxuICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA5OTEpIHtcclxuICAgICAgICBhcnRpY2xlU2xpZGVyKDApXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYXJ0aWNsZVNsaWRlcigwKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYXJ0aWNsZVNsaWRlciAoc3RhZ2VQYWRkaW5nKSB7XHJcbiAgICAkKCcucHViLXNsaWRlci5vd2wtY2Fyb3VzZWwnKS5vd2xDYXJvdXNlbCh7XHJcbiAgICAgIHN0YWdlUGFkZGluZzogc3RhZ2VQYWRkaW5nLFxyXG4gICAgICBtYXJnaW46IDE4LFxyXG4gICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICBuYXY6IHRydWUsXHJcbiAgICAgIGxvb3A6IHRydWUsXHJcbiAgICAgIHJlc3BvbnNpdmU6IHtcclxuICAgICAgICAwOiB7XHJcbiAgICAgICAgICBpdGVtczogMVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgOTkyOiB7XHJcbiAgICAgICAgICBpdGVtczogMVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG4gIGxldCB0YWdGaWx0ZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI3Jlc3VsdC1maWx0ZXJzIGEnKVxyXG4gIGxldCBhbGxGaWx0ZXJCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmVzdWx0LWZpbHRlci1hbGwnKVxyXG4gIGxldCBhY3VhbGl0ZXNIb2xkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmVzdWx0LWFjdWFsaXRlcy1ob2xkZXInKVxyXG5cclxuICBpZiAoIWFjdWFsaXRlc0hvbGRlcikgcmV0dXJuXHJcblxyXG4gIGxldCBzdGF0ZSA9IHtcclxuICAgIGZpbHRlcnM6IFtdLFxyXG4gICAgc2VhcmNoOiAnJyxcclxuICAgIHR5cGU6ICdkb2N1bWVudHMnLFxyXG4gICAgZGF0YToge1xyXG4gICAgICBhY3R1YWxpdGVzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogJ2FydGljbGUtaW1nJyxcclxuICAgICAgICAgIHRhZ3M6IFsnUlNFJywgJ0ZJTkFOQ0UnLCAnRU5UUkVQUkVOQVJJQVQnXSxcclxuICAgICAgICAgIGRhdGU6ICcyMS8wNy8yMDE3JyxcclxuICAgICAgICAgIHRpdGxlOiAndW5lIGFtYmlhbmNlIGZlc3RpdmUgZXQgZmFtaWxpYWxlIHF1ZSBz4oCZZXN0IGTDqXJvdWzDqScsXHJcbiAgICAgICAgICBjb250ZW50OiAnTGUgR3JvdXBlIEJDUCwgYWN0ZXVyIHBhbmFmcmljYWluIGRlIHLDqWbDqXJlbmNlLCBldCBsYSBTb2Npw6l0w6kgRmluYVRuY2nDqHJlIEludGVybmF0aW9uYWxlIChJRkMpLi4uJyxcclxuICAgICAgICAgIGltYWdlOiAnYXNzZXRzL2ltZy9hY3R1LTIucG5nJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogJ2FydGljbGUnLFxyXG4gICAgICAgICAgdGFnczogWydSU0UnLCAnRU5UUkVQUkVOQVJJQVQnXSxcclxuICAgICAgICAgIGRhdGU6ICcyMi8wNy8yMDE3JyxcclxuICAgICAgICAgIHRpdGxlOiAndW5lIGFtYmlhbmNlIGZlc3RpdmUgZXQgZmFtaWxpYWxlIHF1ZSBz4oCZZXN0IGTDqXJvdWzDqScsXHJcbiAgICAgICAgICBjb250ZW50OiAnTGUgR3JvdXBlIEJDUCwgYWN0ZXVyIHBhbmFmcmljYWluIGRlIHLDqWbDqXJlbmNlLCBldCBsYSBTb2Npw6l0w6kgRmluYVRuY2nDqHJlIEludGVybmF0aW9uYWxlIChJRkMpLi4uJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogJ2FydGljbGUnLFxyXG4gICAgICAgICAgdGFnczogWydSU0UnLCAnREVWRUxPUFBFTUVOVCBEVVJBQkxFJ10sXHJcbiAgICAgICAgICBkYXRlOiAnMjMvMDcvMjAxNycsXHJcbiAgICAgICAgICB0aXRsZTogJ3VuZSBhbWJpYW5jZSBmZXN0aXZlIGV0IGZhbWlsaWFsZSBxdWUgc+KAmWVzdCBkw6lyb3Vsw6knLFxyXG4gICAgICAgICAgY29udGVudDogJ0xlIEdyb3VwZSBCQ1AsIGFjdGV1ciBwYW5hZnJpY2FpbiBkZSByw6lmw6lyZW5jZSwgZXQgbGEgU29jacOpdMOpIEZpbmFUbmNpw6hyZSBJbnRlcm5hdGlvbmFsZSAoSUZDKS4uLidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHR5cGU6ICdhcnRpY2xlJyxcclxuICAgICAgICAgIHRhZ3M6IFsnUlNFJ10sXHJcbiAgICAgICAgICBkYXRlOiAnMjEvMDcvMjAxNycsXHJcbiAgICAgICAgICB0aXRsZTogJ3VuZSBhbWJpYW5jZSBmZXN0aXZlIGV0IGZhbWlsaWFsZSBxdWUgc+KAmWVzdCBkw6lyb3Vsw6knLFxyXG4gICAgICAgICAgY29udGVudDogJ0xlIEdyb3VwZSBCQ1AsIGFjdGV1ciBwYW5hZnJpY2FpbiBkZSByw6lmw6lyZW5jZSwgZXQgbGEgU29jacOpdMOpIEZpbmFUbmNpw6hyZSBJbnRlcm5hdGlvbmFsZSAoSUZDKS4uLidcclxuICAgICAgICB9XHJcbiAgICAgIF0sXHJcbiAgICAgIGNvbW11bmlxdWVzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgICAgZGF0ZTogJzIxLzA3LzIwMTgnLFxyXG4gICAgICAgICAgdGl0bGU6ICdMZSBHcm91cGUgQkNQIGxhbmNlIGxhIHByZW1pw6hyZSBiYW5xdWUgbWFyb2NhaW5lIGTDqWRpw6llIMOgIGzigJlhY3Rpdml0w6kg4oCcdGl0cmVz4oCdJyxcclxuICAgICAgICAgIHNpemU6IDQ1MCxcclxuICAgICAgICAgIHR5cGU6ICdwZGYnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJ10sXHJcbiAgICAgICAgICBkYXRlOiAnMjEvMDcvMjAxOCcsXHJcbiAgICAgICAgICB0aXRsZTogJ0xlIEdyb3VwZSBCQ1AgbGFuY2UgbGEgcHJlbWnDqHJlIGJhbnF1ZSBtYXJvY2FpbmUgZMOpZGnDqWUgw6AgbOKAmWFjdGl2aXTDqSDigJx0aXRyZXPigJ0nLFxyXG4gICAgICAgICAgc2l6ZTogNDUwLFxyXG4gICAgICAgICAgdHlwZTogJ3BkZidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRhZ3M6IFsnUlNFJywgJ0ZJTkFOQ0UnXSxcclxuICAgICAgICAgIGRhdGU6ICcyMS8wNy8yMDE5JyxcclxuICAgICAgICAgIHRpdGxlOiAnTGUgR3JvdXBlIEJDUCBsYW5jZSBsYSBwcmVtacOocmUgYmFucXVlIG1hcm9jYWluZSBkw6lkacOpZSDDoCBs4oCZYWN0aXZpdMOpIOKAnHRpdHJlc+KAnScsXHJcbiAgICAgICAgICBzaXplOiA0NTAsXHJcbiAgICAgICAgICB0eXBlOiAncGRmJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgICAgZGF0ZTogJzIxLzA3LzIwMjAnLFxyXG4gICAgICAgICAgdGl0bGU6ICdMZSBHcm91cGUgQkNQIGxhbmNlIGxhIHByZW1pw6hyZSBiYW5xdWUgbWFyb2NhaW5lIGTDqWRpw6llIMOgIGzigJlhY3Rpdml0w6kg4oCcdGl0cmVz4oCdJyxcclxuICAgICAgICAgIHNpemU6IDQ1MCxcclxuICAgICAgICAgIHR5cGU6ICdwZGYnXHJcbiAgICAgICAgfVxyXG4gICAgICBdLFxyXG4gICAgICBjb21wYWduZXM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJ10sXHJcbiAgICAgICAgICBkYXRlOiAnMjEvMDcvMjAxOCcsXHJcbiAgICAgICAgICB0aXRsZTogJ0hJU1RPSVJFUyBQT1BVTEFJUkVTJyxcclxuICAgICAgICAgIGNvbnRlbnQ6IGBMYSBjYW1wYWduZSDigJxIaXN0b2lyZXMgcG9wdWxhaXJlc+KAnSBhZG9wdGUgdW5lIGTDqW1hcmNoZSBlbmNvcmUgcGx1cyBwcm9jaGUgZGVzIHByw6lvY2N1cGF0aW9ucyBkZXMgZ2VucyA6IGNlIHNvbnQgZGVzIGhpc3RvaXJlc1xyXG4gICAgICAgICAgICAgICAgcsOpZWxsZXMgZGUgTWFyb2NhaW5zIGlzc3VzIGRlIHRvdXRlcyBsZXMgY2xhc3NlcyBzb2NpYWxlcyBldCBxdWkgb250IHLDqXVzc2kgw6AgYXR0ZWluZHJlIGxldXJzIG9iamVjdGlmcyBkYW5zXHJcbiAgICAgICAgICAgICAgICBkaWZmw6lyZW50cyBzZWN0ZXVycyBkZSBsYSB2aWUgZ3LDomNlIGF1IHNvdXRpZW4gZGUgbGV1ciBiYW5xdWUuYCxcclxuICAgICAgICAgIGltYWdlOiAnYXNzZXRzL2ltZy9tZWRpYS1pbWcucG5nJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgICAgZGF0ZTogJzIxLzA3LzIwMTgnLFxyXG4gICAgICAgICAgdGl0bGU6ICdISVNUT0lSRVMgUE9QVUxBSVJFUycsXHJcbiAgICAgICAgICBjb250ZW50OiBgTGEgY2FtcGFnbmUg4oCcSGlzdG9pcmVzIHBvcHVsYWlyZXPigJ0gYWRvcHRlIHVuZSBkw6ltYXJjaGUgZW5jb3JlIHBsdXMgcHJvY2hlIGRlcyBwcsOpb2NjdXBhdGlvbnMgZGVzIGdlbnMgOiBjZSBzb250IGRlcyBoaXN0b2lyZXNcclxuICAgICAgICAgICAgICAgIHLDqWVsbGVzIGRlIE1hcm9jYWlucyBpc3N1cyBkZSB0b3V0ZXMgbGVzIGNsYXNzZXMgc29jaWFsZXMgZXQgcXVpIG9udCByw6l1c3NpIMOgIGF0dGVpbmRyZSBsZXVycyBvYmplY3RpZnMgZGFuc1xyXG4gICAgICAgICAgICAgICAgZGlmZsOpcmVudHMgc2VjdGV1cnMgZGUgbGEgdmllIGdyw6JjZSBhdSBzb3V0aWVuIGRlIGxldXIgYmFucXVlLmAsXHJcbiAgICAgICAgICBpbWFnZTogJ2Fzc2V0cy9pbWcvbWVkaWEtaW1nLnBuZydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRhZ3M6IFsnUlNFJywgJ0ZJTkFOQ0UnXSxcclxuICAgICAgICAgIGRhdGU6ICcyMS8wNy8yMDE5JyxcclxuICAgICAgICAgIHRpdGxlOiAnSElTVE9JUkVTIFBPUFVMQUlSRVMnLFxyXG4gICAgICAgICAgY29udGVudDogYExhIGNhbXBhZ25lIOKAnEhpc3RvaXJlcyBwb3B1bGFpcmVz4oCdIGFkb3B0ZSB1bmUgZMOpbWFyY2hlIGVuY29yZSBwbHVzIHByb2NoZSBkZXMgcHLDqW9jY3VwYXRpb25zIGRlcyBnZW5zIDogY2Ugc29udCBkZXMgaGlzdG9pcmVzXHJcbiAgICAgICAgICAgICAgICByw6llbGxlcyBkZSBNYXJvY2FpbnMgaXNzdXMgZGUgdG91dGVzIGxlcyBjbGFzc2VzIHNvY2lhbGVzIGV0IHF1aSBvbnQgcsOpdXNzaSDDoCBhdHRlaW5kcmUgbGV1cnMgb2JqZWN0aWZzIGRhbnNcclxuICAgICAgICAgICAgICAgIGRpZmbDqXJlbnRzIHNlY3RldXJzIGRlIGxhIHZpZSBncsOiY2UgYXUgc291dGllbiBkZSBsZXVyIGJhbnF1ZS5gLFxyXG4gICAgICAgICAgaW1hZ2U6ICdhc3NldHMvaW1nL21lZGlhLWltZy5wbmcnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJ10sXHJcbiAgICAgICAgICBkYXRlOiAnMjEvMDcvMjAyMCcsXHJcbiAgICAgICAgICB0aXRsZTogJ0hJU1RPSVJFUyBQT1BVTEFJUkVTJyxcclxuICAgICAgICAgIGNvbnRlbnQ6IGBMYSBjYW1wYWduZSDigJxIaXN0b2lyZXMgcG9wdWxhaXJlc+KAnSBhZG9wdGUgdW5lIGTDqW1hcmNoZSBlbmNvcmUgcGx1cyBwcm9jaGUgZGVzIHByw6lvY2N1cGF0aW9ucyBkZXMgZ2VucyA6IGNlIHNvbnQgZGVzIGhpc3RvaXJlc1xyXG4gICAgICAgICAgICAgICAgcsOpZWxsZXMgZGUgTWFyb2NhaW5zIGlzc3VzIGRlIHRvdXRlcyBsZXMgY2xhc3NlcyBzb2NpYWxlcyBldCBxdWkgb250IHLDqXVzc2kgw6AgYXR0ZWluZHJlIGxldXJzIG9iamVjdGlmcyBkYW5zXHJcbiAgICAgICAgICAgICAgICBkaWZmw6lyZW50cyBzZWN0ZXVycyBkZSBsYSB2aWUgZ3LDomNlIGF1IHNvdXRpZW4gZGUgbGV1ciBiYW5xdWUuYCxcclxuICAgICAgICAgIGltYWdlOiAnYXNzZXRzL2ltZy9tZWRpYS1pbWcucG5nJ1xyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYXBwbHlGaWx0ZXJzICgpIHtcclxuICAgICQoJy5oZWFkZXItc2VjdGlvbl9zZWFyY2gtcmVzdWx0JykudGV4dChzdGF0ZS5zZWFyY2gpXHJcblxyXG4gICAgbGV0IGRhdGEgPSBzdGF0ZS5kYXRhXHJcbiAgICBpZiAoc3RhdGUuZmlsdGVycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGRhdGEuYWN0dWFsaXRlcyA9IHN0YXRlLmRhdGEuYWN0dWFsaXRlcy5maWx0ZXIocG9zdCA9PiB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGF0ZS5maWx0ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAocG9zdC50YWdzLmluY2x1ZGVzKHN0YXRlLmZpbHRlcnNbaV0udG9VcHBlckNhc2UoKSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgICByZW5kZXIoZGF0YSlcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJlbmRlciAoZGF0YSkge31cclxuXHJcbiAgZnVuY3Rpb24gY2xlYW5UYWcgKHRhZ0ZpbHRlcikge1xyXG4gICAgdGFnRmlsdGVyID0gdGFnRmlsdGVyLnRyaW0oKS50b0xvd2VyQ2FzZSgpXHJcbiAgICBpZiAodGFnRmlsdGVyWzBdID09ICcjJykge1xyXG4gICAgICByZXR1cm4gdGFnRmlsdGVyLnNsaWNlKDEpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRhZ0ZpbHRlclxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY2hhbmdlRmlsdGVycyAoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcblxyXG4gICAgdGhpcy5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKVxyXG5cclxuICAgIHN0YXRlLmZpbHRlcnMgPSBbXVxyXG5cclxuICAgIHRhZ0ZpbHRlcnMuZm9yRWFjaChmdW5jdGlvbiAodGFnKSB7XHJcbiAgICAgIGlmICgkKHRhZykuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgc3RhdGUuZmlsdGVycy5wdXNoKGNsZWFuVGFnKHRhZy5pbm5lclRleHQpKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIGlmIChzdGF0ZS5maWx0ZXJzLmxlbmd0aCA+IDApIHtcclxuICAgICAgYWxsRmlsdGVyQnRuLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhbGxGaWx0ZXJCdG4uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgIH1cclxuXHJcbiAgICBhcHBseUZpbHRlcnMoKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc3VibWl0Rm9ybSAoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICBzdGF0ZS5zZWFyY2ggPSAkKCcjcmVzdWx0LXNlYXJjaCcpLnZhbCgpXHJcbiAgICBhcHBseUZpbHRlcnMoKVxyXG4gIH1cclxuXHJcbiAgYWxsRmlsdGVyQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgc3RhdGUuZmlsdGVycyA9IFtdXHJcbiAgICB0YWdGaWx0ZXJzLmZvckVhY2godGFnID0+IHtcclxuICAgICAgdGFnLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICB9KVxyXG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgYXBwbHlGaWx0ZXJzKClcclxuICB9KVxyXG5cclxuICB0YWdGaWx0ZXJzLmZvckVhY2godGFnID0+IHtcclxuICAgIHRhZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNoYW5nZUZpbHRlcnMpXHJcbiAgfSlcclxuXHJcbiAgJCgnI3Jlc3VsdC1zZWxlY3QtdHlwZScpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBzdGF0ZS50eXBlID0gJCh0aGlzKS5uZXh0KCkuZmluZCgnLmN1cnJlbnQnKS50ZXh0KCkudG9Mb3dlckNhc2UoKVxyXG4gICAgYXBwbHlGaWx0ZXJzKClcclxuICB9KVxyXG5cclxuICAkKCcjcmVzdWx0LXNlYXJjaC1idG4nKS5vbignY2xpY2snLCBzdWJtaXRGb3JtKVxyXG4gICQoJyNzZWFyY2gtZm9ybScpLm9uKCdzdWJtaXQnLCBzdWJtaXRGb3JtKVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHQkKCdzZWxlY3QubmljZS1zZWxlY3QnKS5uaWNlU2VsZWN0KCk7XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcblx0aWYgKCQoJy5zd2lwZWJveCcpLmxlbmd0aCkge1xyXG5cdFx0Ly8kKCcuc3dpcGVib3gnKS5zd2lwZWJveCgpO1xyXG5cdH1cclxuXHRcclxufSIsImV4cG9ydCBmdW5jdGlvbiB0cmFja2VyIChjYWxsYmFjaykge1xyXG4gIGxldCBlbG1udCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aW1lbGluZS1zZWxlY3RvcicpXHJcblxyXG4gIGlmICghZWxtbnQpIHJldHVybiBudWxsXHJcblxyXG4gIGxldCBkb3RzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbGluZV9kb3QnKVxyXG5cclxuICBjb25zdCBTSVpFID0gMTE0MCAvLyBzZXQgdGhlIHdpZHRoIG9mIHRoZSB0cmFja2VyXHJcblxyXG4gIGxldCBzdGVwID0gU0laRSAvIGRvdHMubGVuZ3RoXHJcbiAgY29uc3QgQkxPQ0tTSVpFID0gc3RlcFxyXG5cclxuICAkKCcubGluZV9kb3QnKS5jc3MoJ3dpZHRoJywgc3RlcCArICdweCcpXHJcbiAgJCgnI3RpbWVsaW5lLXNlbGVjdG9yJykuY3NzKCdsZWZ0Jywgc3RlcCAvIDIgLSAyMCArICdweCcpXHJcbiAgJCgnLnRpbWVsaW5lX2xpbmUgLmNvbnRhaW5lcicpLmFwcGVuZChcclxuICAgICc8ZGl2IGNsYXNzPVwidGltZWxpbmVfbGluZS1wcm9ncmVzc1wiPjxkaXYgY2xhc3M9XCJ0aW1lbGluZV9saW5lLWZpbGxcIj48L2Rpdj48L2Rpdj4nXHJcbiAgKVxyXG4gICQoJy50aW1lbGluZV9saW5lLXByb2dyZXNzJykuY3NzKCd3aWR0aCcsIFNJWkUgLSBCTE9DS1NJWkUgKyAncHgnKVxyXG5cclxuICBsZXQgcG9zMSA9IDAsIHBvczMgPSAwLCBwb3NpdGlvbiA9IDBcclxuICBlbG1udC5vbm1vdXNlZG93biA9IGRyYWdNb3VzZURvd25cclxuXHJcbiAgZnVuY3Rpb24gZHJhZ01vdXNlRG93biAoZSkge1xyXG4gICAgZSA9IGUgfHwgd2luZG93LmV2ZW50XHJcbiAgICAvLyBnZXQgdGhlIG1vdXNlIGN1cnNvciBwb3NpdGlvbiBhdCBzdGFydHVwOlxyXG4gICAgcG9zMyA9IGUuY2xpZW50WFxyXG4gICAgZG9jdW1lbnQub25tb3VzZXVwID0gY2xvc2VEcmFnRWxlbWVudFxyXG4gICAgLy8gY2FsbCBhIGZ1bmN0aW9uIHdoZW5ldmVyIHRoZSBjdXJzb3IgbW92ZXM6XHJcbiAgICBkb2N1bWVudC5vbm1vdXNlbW92ZSA9IGVsZW1lbnREcmFnXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBlbGVtZW50RHJhZyAoZSkge1xyXG4gICAgZSA9IGUgfHwgd2luZG93LmV2ZW50XHJcbiAgICAvLyBjYWxjdWxhdGUgdGhlIG5ldyBjdXJzb3IgcG9zaXRpb246XHJcbiAgICBwb3MxID0gcG9zMyAtIGUuY2xpZW50WFxyXG4gICAgcG9zMyA9IGUuY2xpZW50WFxyXG4gICAgLy8gc2V0IHRoZSBlbGVtZW50J3MgbmV3IHBvc2l0aW9uOlxyXG4gICAgbGV0IG5ld1Bvc2l0aW9uID0gZWxtbnQub2Zmc2V0TGVmdCAtIHBvczFcclxuICAgIGlmIChcclxuICAgICAgbmV3UG9zaXRpb24gPj0gQkxPQ0tTSVpFIC8gMiAtIDIwICYmXHJcbiAgICAgIG5ld1Bvc2l0aW9uIDwgU0laRSAtIEJMT0NLU0laRSAvIDIgLSAyMFxyXG4gICAgKSB7XHJcbiAgICAgIGVsbW50LnN0eWxlLmxlZnQgPSBuZXdQb3NpdGlvbiArICdweCdcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRvY3VtZW50Lm9ubW91c2V1cCA9IGNsb3NlRHJhZ0VsZW1lbnRcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNldFByb3BlclBvc2l0aW9uICgpIHtcclxuICAgIHBvc2l0aW9uID0gTWF0aC5yb3VuZCgocGFyc2VGbG9hdChlbG1udC5zdHlsZS5sZWZ0KSAtIDUwKSAvIHN0ZXApXHJcbiAgICBsZXQgbmV3UG9zaXRpb24gPSBwb3NpdGlvbiAqIEJMT0NLU0laRSArIEJMT0NLU0laRSAvIDIgLSAyMFxyXG4gICAgZWxtbnQuc3R5bGUubGVmdCA9IG5ld1Bvc2l0aW9uICsgJ3B4J1xyXG4gICAgdXBkYXRlQWN0aXZlRG90cygpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVBY3RpdmVEb3RzICgpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZG90cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBkb3RzW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ2xpbmVfZG90LS1hY3RpdmUnKVxyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb3NpdGlvbjsgaSsrKSB7XHJcbiAgICAgIGRvdHNbaV0uY2xhc3NMaXN0LmFkZCgnbGluZV9kb3QtLWFjdGl2ZScpXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlUHJvZ3Jlc3MoKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlUHJvZ3Jlc3MgKCkge1xyXG4gICAgbGV0IHdpZHRoID0gcG9zaXRpb24gKiBCTE9DS1NJWkVcclxuICAgICQoJy50aW1lbGluZV9saW5lLWZpbGwnKS5jc3MoJ3dpZHRoJywgd2lkdGggKyAncHgnKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY2xvc2VEcmFnRWxlbWVudCAoKSB7XHJcbiAgICBzZXRQcm9wZXJQb3NpdGlvbigpXHJcbiAgICBjYWxsYmFjayhwb3NpdGlvbiArIDEpXHJcbiAgICAvKiBzdG9wIG1vdmluZyB3aGVuIG1vdXNlIGJ1dHRvbiBpcyByZWxlYXNlZDogKi9cclxuICAgIGRvY3VtZW50Lm9ubW91c2V1cCA9IG51bGxcclxuICAgIGRvY3VtZW50Lm9ubW91c2Vtb3ZlID0gbnVsbFxyXG4gIH1cclxuXHJcbiAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChkb3RzLCBmdW5jdGlvbiAoZG90LCBpbmRleCkge1xyXG4gICAgZG90LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICB1cGRhdGVQb3NpdGlvbihpbmRleClcclxuICAgICAgY2FsbGJhY2socG9zaXRpb24gKyAxKVxyXG4gICAgfSlcclxuICB9KVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVQb3NpdGlvbiAocG9zaXRpb24pIHtcclxuICAgIGVsbW50LnN0eWxlLmxlZnQgPSBwb3NpdGlvbiAqIEJMT0NLU0laRSArICdweCdcclxuICAgIHNldFByb3BlclBvc2l0aW9uKClcclxuICB9XHJcbiAgcmV0dXJuIHVwZGF0ZVBvc2l0aW9uXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgZGF0YSA9IHtcclxuICAgIHBlcmlvZHM6IFtcclxuICAgICAge1xyXG4gICAgICAgIHllYXI6IDIwMTgsXHJcbiAgICAgICAgYWN0aW9uczoge1xyXG4gICAgICAgICAgbGVmdDogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAxLTIwMTgnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBEaWduaXNzaW1vcywgc3VzY2lwaXQhJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAyLTIwMTgnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBEaWduaXNzaW1vcywgc3VzY2lwaXQhJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAzLTIwMTgnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnRElTVElOQ1RJT05TPGJyPiAmVFJPUEjDiUVTJyxcclxuICAgICAgICAgICAgICBjb250ZW50OiBgPHNwYW4gY2xhc3M9XCJ0aW1lbGluZV9jYXJkX3NtYWxsdGl0bGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgQWZyaWNhbiBCYW5rZXIgQXdhcmRzIDIwMTVcclxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIFRyb3Bow6llIMKrIEJhbnF1ZSBBZnJpY2FpbmUgZGUgbOKAmUFubsOpZSDCuyBkw6ljZXJuw6kgYXUgR3JvdXBlIEJhbnF1ZSBDZW50cmFsZSBQb3B1bGFpcmUgVHJvcGjDqWUgwqsgSW5jbHVzaW9uIEZpbmFuY2nDqHJlIMK7IHJlbXBvcnTDqVxyXG4gICAgICAgICAgICAgICAgICAgICAgcGFyIGxhIGZpbGlhbGUgQXR0YXdmaXEgTWljcm8tRmluYW5jZS4gQ2FydGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpbWVsaW5lX2NhcmRfc21hbGx0aXRsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBZnJpcXVlIEF3YXJkcyAyMDE1XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICBPYnRlbnRpb24gZHUgdHJvcGjDqWUgwqsgQmVzdCBJbm5vdmF0aXZlIENhcmQgUHJvZ3JhbW1lIMK7IGF0dHJpYnXDqSDDoCDCqyBHbG9iYWxDYXJkIMK7LCB1bmUgY2FydGUgbW9uw6l0aXF1ZSBwcsOpcGF5w6llIGRlc3RpbsOpZVxyXG4gICAgICAgICAgICAgICAgICAgICAgYXV4IHZveWFnZXVycyBkZSBwYXNzYWdlIGF1IE1hcm9jIGV0IHF1aSBjb25zdGl0dWUgdW4gbW95ZW4gZGUgc3Vic3RpdHV0aW9uIMOgIGxhIG1vbm5haWUgZmlkdWNpYWlyZS5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGltZWxpbmVfY2FyZF9zbWFsbHRpdGxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1vcm9jY28gTWFzdGVyQ2FyZCBDdXN0b21lcnMgTWVldGluZ3MgMjAxNVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgTGUgR3JvdXBlIEJhbnF1ZSBDZW50cmFsZSBQb3B1bGFpcmUgYSByZW1wb3J0w6kgw6AgY2V0dGUgb2NjYXNpb24gbGUgdHJvcGjDqWUgZGUgY2hhbXBpb24gbmF0aW9uYWwgZOKAmWFjdGl2YXRpb24gZGVzIGNhcnRlcyBkZVxyXG4gICAgICAgICAgICAgICAgICAgICAgcGFpZW1lbnQgVFBFIMKrIFBvcyBVc2FnZSBBY3RpdmF0aW9uIENoYW1waW9uIMK7LmBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXSxcclxuICAgICAgICAgIHJpZ2h0OiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkYXRlOiAnMTEtMDMtMjAxOCcsXHJcbiAgICAgICAgICAgICAgY29udGVudDogJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0IGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQuIERpZ25pc3NpbW9zLCBzdXNjaXBpdCEnLFxyXG4gICAgICAgICAgICAgIG1lZGlhOiAnYXNzZXRzL2ltZy9yZXMtMi5wbmcnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkYXRlOiAnMTEtMDMtMjAxOCcsXHJcbiAgICAgICAgICAgICAgY29udGVudDogJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0IGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQuIERpZ25pc3NpbW9zLCBzdXNjaXBpdCEnLFxyXG4gICAgICAgICAgICAgIG1lZGlhOiAnYXNzZXRzL2ltZy9leHBsb3Jlci1tZXRpZXJzMi5wbmcnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB5ZWFyOiAyMDE3LFxyXG4gICAgICAgIGFjdGlvbnM6IHtcclxuICAgICAgICAgIGxlZnQ6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGU6ICcxMS0wMS0yMDE4JyxcclxuICAgICAgICAgICAgICBjb250ZW50OiAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gRGlnbmlzc2ltb3MsIHN1c2NpcGl0ISdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGU6ICcxMS0wMi0yMDE4JyxcclxuICAgICAgICAgICAgICBjb250ZW50OiAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gRGlnbmlzc2ltb3MsIHN1c2NpcGl0ISdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGU6ICcxMS0wMy0yMDE4JyxcclxuICAgICAgICAgICAgICB0aXRsZTogJ0RJU1RJTkNUSU9OUzxicj4gJlRST1BIw4lFUycsXHJcbiAgICAgICAgICAgICAgY29udGVudDogYDxzcGFuIGNsYXNzPVwidGltZWxpbmVfY2FyZF9zbWFsbHRpdGxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFmcmljYW4gQmFua2VyIEF3YXJkcyAyMDE1XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICBUcm9waMOpZSDCqyBCYW5xdWUgQWZyaWNhaW5lIGRlIGzigJlBbm7DqWUgwrsgZMOpY2VybsOpIGF1IEdyb3VwZSBCYW5xdWUgQ2VudHJhbGUgUG9wdWxhaXJlIFRyb3Bow6llIMKrIEluY2x1c2lvbiBGaW5hbmNpw6hyZSDCuyByZW1wb3J0w6lcclxuICAgICAgICAgICAgICAgICAgICAgIHBhciBsYSBmaWxpYWxlIEF0dGF3ZmlxIE1pY3JvLUZpbmFuY2UuIENhcnRlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aW1lbGluZV9jYXJkX3NtYWxsdGl0bGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgQWZyaXF1ZSBBd2FyZHMgMjAxNVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgT2J0ZW50aW9uIGR1IHRyb3Bow6llIMKrIEJlc3QgSW5ub3ZhdGl2ZSBDYXJkIFByb2dyYW1tZSDCuyBhdHRyaWJ1w6kgw6AgwqsgR2xvYmFsQ2FyZCDCuywgdW5lIGNhcnRlIG1vbsOpdGlxdWUgcHLDqXBhecOpZSBkZXN0aW7DqWVcclxuICAgICAgICAgICAgICAgICAgICAgIGF1eCB2b3lhZ2V1cnMgZGUgcGFzc2FnZSBhdSBNYXJvYyBldCBxdWkgY29uc3RpdHVlIHVuIG1veWVuIGRlIHN1YnN0aXR1dGlvbiDDoCBsYSBtb25uYWllIGZpZHVjaWFpcmUuXHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpbWVsaW5lX2NhcmRfc21hbGx0aXRsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBNb3JvY2NvIE1hc3RlckNhcmQgQ3VzdG9tZXJzIE1lZXRpbmdzIDIwMTVcclxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIExlIEdyb3VwZSBCYW5xdWUgQ2VudHJhbGUgUG9wdWxhaXJlIGEgcmVtcG9ydMOpIMOgIGNldHRlIG9jY2FzaW9uIGxlIHRyb3Bow6llIGRlIGNoYW1waW9uIG5hdGlvbmFsIGTigJlhY3RpdmF0aW9uIGRlcyBjYXJ0ZXMgZGVcclxuICAgICAgICAgICAgICAgICAgICAgIHBhaWVtZW50IFRQRSDCqyBQb3MgVXNhZ2UgQWN0aXZhdGlvbiBDaGFtcGlvbiDCuy5gXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICByaWdodDogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAzLTIwMTgnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBEaWduaXNzaW1vcywgc3VzY2lwaXQhJyxcclxuICAgICAgICAgICAgICBtZWRpYTogJ2Fzc2V0cy9pbWcvcmVzLTIucG5nJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAzLTIwMTgnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBEaWduaXNzaW1vcywgc3VzY2lwaXQhJyxcclxuICAgICAgICAgICAgICBtZWRpYTogJ2Fzc2V0cy9pbWcvZXhwbG9yZXItbWV0aWVyczIucG5nJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgeWVhcjogMjAxNixcclxuICAgICAgICBhY3Rpb25zOiB7XHJcbiAgICAgICAgICBsZWZ0OiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkYXRlOiAnMTEtMDEtMjAxOCcsXHJcbiAgICAgICAgICAgICAgY29udGVudDogJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0IGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQuIERpZ25pc3NpbW9zLCBzdXNjaXBpdCEnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkYXRlOiAnMTEtMDItMjAxOCcsXHJcbiAgICAgICAgICAgICAgY29udGVudDogJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0IGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQuIERpZ25pc3NpbW9zLCBzdXNjaXBpdCEnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkYXRlOiAnMTEtMDMtMjAxOCcsXHJcbiAgICAgICAgICAgICAgdGl0bGU6ICdESVNUSU5DVElPTlM8YnI+ICZUUk9QSMOJRVMnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6IGA8c3BhbiBjbGFzcz1cInRpbWVsaW5lX2NhcmRfc21hbGx0aXRsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBZnJpY2FuIEJhbmtlciBBd2FyZHMgMjAxNVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgVHJvcGjDqWUgwqsgQmFucXVlIEFmcmljYWluZSBkZSBs4oCZQW5uw6llIMK7IGTDqWNlcm7DqSBhdSBHcm91cGUgQmFucXVlIENlbnRyYWxlIFBvcHVsYWlyZSBUcm9waMOpZSDCqyBJbmNsdXNpb24gRmluYW5jacOocmUgwrsgcmVtcG9ydMOpXHJcbiAgICAgICAgICAgICAgICAgICAgICBwYXIgbGEgZmlsaWFsZSBBdHRhd2ZpcSBNaWNyby1GaW5hbmNlLiBDYXJ0ZXNcclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGltZWxpbmVfY2FyZF9zbWFsbHRpdGxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFmcmlxdWUgQXdhcmRzIDIwMTVcclxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIE9idGVudGlvbiBkdSB0cm9waMOpZSDCqyBCZXN0IElubm92YXRpdmUgQ2FyZCBQcm9ncmFtbWUgwrsgYXR0cmlidcOpIMOgIMKrIEdsb2JhbENhcmQgwrssIHVuZSBjYXJ0ZSBtb27DqXRpcXVlIHByw6lwYXnDqWUgZGVzdGluw6llXHJcbiAgICAgICAgICAgICAgICAgICAgICBhdXggdm95YWdldXJzIGRlIHBhc3NhZ2UgYXUgTWFyb2MgZXQgcXVpIGNvbnN0aXR1ZSB1biBtb3llbiBkZSBzdWJzdGl0dXRpb24gw6AgbGEgbW9ubmFpZSBmaWR1Y2lhaXJlLlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aW1lbGluZV9jYXJkX3NtYWxsdGl0bGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgTW9yb2NjbyBNYXN0ZXJDYXJkIEN1c3RvbWVycyBNZWV0aW5ncyAyMDE1XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICBMZSBHcm91cGUgQmFucXVlIENlbnRyYWxlIFBvcHVsYWlyZSBhIHJlbXBvcnTDqSDDoCBjZXR0ZSBvY2Nhc2lvbiBsZSB0cm9waMOpZSBkZSBjaGFtcGlvbiBuYXRpb25hbCBk4oCZYWN0aXZhdGlvbiBkZXMgY2FydGVzIGRlXHJcbiAgICAgICAgICAgICAgICAgICAgICBwYWllbWVudCBUUEUgwqsgUG9zIFVzYWdlIEFjdGl2YXRpb24gQ2hhbXBpb24gwrsuYFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgcmlnaHQ6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGU6ICcxMS0wMy0yMDE4JyxcclxuICAgICAgICAgICAgICBjb250ZW50OiAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gRGlnbmlzc2ltb3MsIHN1c2NpcGl0IScsXHJcbiAgICAgICAgICAgICAgbWVkaWE6ICdhc3NldHMvaW1nL3Jlcy0yLnBuZydcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGU6ICcxMS0wMy0yMDE4JyxcclxuICAgICAgICAgICAgICBjb250ZW50OiAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gRGlnbmlzc2ltb3MsIHN1c2NpcGl0IScsXHJcbiAgICAgICAgICAgICAgbWVkaWE6ICdhc3NldHMvaW1nL2V4cGxvcmVyLW1ldGllcnMyLnBuZydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHllYXI6IDIwMTUsXHJcbiAgICAgICAgYWN0aW9uczoge1xyXG4gICAgICAgICAgbGVmdDogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAxLTIwMTgnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBEaWduaXNzaW1vcywgc3VzY2lwaXQhJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAyLTIwMTgnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBEaWduaXNzaW1vcywgc3VzY2lwaXQhJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAzLTIwMTgnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnRElTVElOQ1RJT05TPGJyPiAmVFJPUEjDiUVTJyxcclxuICAgICAgICAgICAgICBjb250ZW50OiBgPHNwYW4gY2xhc3M9XCJ0aW1lbGluZV9jYXJkX3NtYWxsdGl0bGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgQWZyaWNhbiBCYW5rZXIgQXdhcmRzIDIwMTVcclxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIFRyb3Bow6llIMKrIEJhbnF1ZSBBZnJpY2FpbmUgZGUgbOKAmUFubsOpZSDCuyBkw6ljZXJuw6kgYXUgR3JvdXBlIEJhbnF1ZSBDZW50cmFsZSBQb3B1bGFpcmUgVHJvcGjDqWUgwqsgSW5jbHVzaW9uIEZpbmFuY2nDqHJlIMK7IHJlbXBvcnTDqVxyXG4gICAgICAgICAgICAgICAgICAgICAgcGFyIGxhIGZpbGlhbGUgQXR0YXdmaXEgTWljcm8tRmluYW5jZS4gQ2FydGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpbWVsaW5lX2NhcmRfc21hbGx0aXRsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBZnJpcXVlIEF3YXJkcyAyMDE1XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICBPYnRlbnRpb24gZHUgdHJvcGjDqWUgwqsgQmVzdCBJbm5vdmF0aXZlIENhcmQgUHJvZ3JhbW1lIMK7IGF0dHJpYnXDqSDDoCDCqyBHbG9iYWxDYXJkIMK7LCB1bmUgY2FydGUgbW9uw6l0aXF1ZSBwcsOpcGF5w6llIGRlc3RpbsOpZVxyXG4gICAgICAgICAgICAgICAgICAgICAgYXV4IHZveWFnZXVycyBkZSBwYXNzYWdlIGF1IE1hcm9jIGV0IHF1aSBjb25zdGl0dWUgdW4gbW95ZW4gZGUgc3Vic3RpdHV0aW9uIMOgIGxhIG1vbm5haWUgZmlkdWNpYWlyZS5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGltZWxpbmVfY2FyZF9zbWFsbHRpdGxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1vcm9jY28gTWFzdGVyQ2FyZCBDdXN0b21lcnMgTWVldGluZ3MgMjAxNVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgTGUgR3JvdXBlIEJhbnF1ZSBDZW50cmFsZSBQb3B1bGFpcmUgYSByZW1wb3J0w6kgw6AgY2V0dGUgb2NjYXNpb24gbGUgdHJvcGjDqWUgZGUgY2hhbXBpb24gbmF0aW9uYWwgZOKAmWFjdGl2YXRpb24gZGVzIGNhcnRlcyBkZVxyXG4gICAgICAgICAgICAgICAgICAgICAgcGFpZW1lbnQgVFBFIMKrIFBvcyBVc2FnZSBBY3RpdmF0aW9uIENoYW1waW9uIMK7LmBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXSxcclxuICAgICAgICAgIHJpZ2h0OiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkYXRlOiAnMTEtMDMtMjAxOCcsXHJcbiAgICAgICAgICAgICAgY29udGVudDogJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0IGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQuIERpZ25pc3NpbW9zLCBzdXNjaXBpdCEnLFxyXG4gICAgICAgICAgICAgIG1lZGlhOiAnYXNzZXRzL2ltZy9yZXMtMi5wbmcnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkYXRlOiAnMTEtMDMtMjAxOCcsXHJcbiAgICAgICAgICAgICAgY29udGVudDogJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0IGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQuIERpZ25pc3NpbW9zLCBzdXNjaXBpdCEnLFxyXG4gICAgICAgICAgICAgIG1lZGlhOiAnYXNzZXRzL2ltZy9leHBsb3Jlci1tZXRpZXJzMi5wbmcnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB5ZWFyOiAyMDE0LFxyXG4gICAgICAgIGFjdGlvbnM6IHtcclxuICAgICAgICAgIGxlZnQ6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGU6ICcxMS0wMS0yMDE4JyxcclxuICAgICAgICAgICAgICBjb250ZW50OiAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gRGlnbmlzc2ltb3MsIHN1c2NpcGl0ISdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGU6ICcxMS0wMi0yMDE4JyxcclxuICAgICAgICAgICAgICBjb250ZW50OiAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gRGlnbmlzc2ltb3MsIHN1c2NpcGl0ISdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGU6ICcxMS0wMy0yMDE4JyxcclxuICAgICAgICAgICAgICB0aXRsZTogJ0RJU1RJTkNUSU9OUzxicj4gJlRST1BIw4lFUycsXHJcbiAgICAgICAgICAgICAgY29udGVudDogYDxzcGFuIGNsYXNzPVwidGltZWxpbmVfY2FyZF9zbWFsbHRpdGxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFmcmljYW4gQmFua2VyIEF3YXJkcyAyMDE1XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICBUcm9waMOpZSDCqyBCYW5xdWUgQWZyaWNhaW5lIGRlIGzigJlBbm7DqWUgwrsgZMOpY2VybsOpIGF1IEdyb3VwZSBCYW5xdWUgQ2VudHJhbGUgUG9wdWxhaXJlIFRyb3Bow6llIMKrIEluY2x1c2lvbiBGaW5hbmNpw6hyZSDCuyByZW1wb3J0w6lcclxuICAgICAgICAgICAgICAgICAgICAgIHBhciBsYSBmaWxpYWxlIEF0dGF3ZmlxIE1pY3JvLUZpbmFuY2UuIENhcnRlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aW1lbGluZV9jYXJkX3NtYWxsdGl0bGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgQWZyaXF1ZSBBd2FyZHMgMjAxNVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgT2J0ZW50aW9uIGR1IHRyb3Bow6llIMKrIEJlc3QgSW5ub3ZhdGl2ZSBDYXJkIFByb2dyYW1tZSDCuyBhdHRyaWJ1w6kgw6AgwqsgR2xvYmFsQ2FyZCDCuywgdW5lIGNhcnRlIG1vbsOpdGlxdWUgcHLDqXBhecOpZSBkZXN0aW7DqWVcclxuICAgICAgICAgICAgICAgICAgICAgIGF1eCB2b3lhZ2V1cnMgZGUgcGFzc2FnZSBhdSBNYXJvYyBldCBxdWkgY29uc3RpdHVlIHVuIG1veWVuIGRlIHN1YnN0aXR1dGlvbiDDoCBsYSBtb25uYWllIGZpZHVjaWFpcmUuXHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpbWVsaW5lX2NhcmRfc21hbGx0aXRsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBNb3JvY2NvIE1hc3RlckNhcmQgQ3VzdG9tZXJzIE1lZXRpbmdzIDIwMTVcclxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIExlIEdyb3VwZSBCYW5xdWUgQ2VudHJhbGUgUG9wdWxhaXJlIGEgcmVtcG9ydMOpIMOgIGNldHRlIG9jY2FzaW9uIGxlIHRyb3Bow6llIGRlIGNoYW1waW9uIG5hdGlvbmFsIGTigJlhY3RpdmF0aW9uIGRlcyBjYXJ0ZXMgZGVcclxuICAgICAgICAgICAgICAgICAgICAgIHBhaWVtZW50IFRQRSDCqyBQb3MgVXNhZ2UgQWN0aXZhdGlvbiBDaGFtcGlvbiDCuy5gXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICByaWdodDogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAzLTIwMTgnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBEaWduaXNzaW1vcywgc3VzY2lwaXQhJyxcclxuICAgICAgICAgICAgICBtZWRpYTogJ2Fzc2V0cy9pbWcvcmVzLTIucG5nJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAzLTIwMTgnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBEaWduaXNzaW1vcywgc3VzY2lwaXQhJyxcclxuICAgICAgICAgICAgICBtZWRpYTogJ2Fzc2V0cy9pbWcvZXhwbG9yZXItbWV0aWVyczIucG5nJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgeWVhcjogMjAxMyxcclxuICAgICAgICBhY3Rpb25zOiB7XHJcbiAgICAgICAgICBsZWZ0OiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkYXRlOiAnMTEtMDEtMjAxOCcsXHJcbiAgICAgICAgICAgICAgY29udGVudDogJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0IGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQuIERpZ25pc3NpbW9zLCBzdXNjaXBpdCEnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkYXRlOiAnMTEtMDItMjAxOCcsXHJcbiAgICAgICAgICAgICAgY29udGVudDogJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0IGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQuIERpZ25pc3NpbW9zLCBzdXNjaXBpdCEnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkYXRlOiAnMTEtMDMtMjAxOCcsXHJcbiAgICAgICAgICAgICAgdGl0bGU6ICdESVNUSU5DVElPTlM8YnI+ICZUUk9QSMOJRVMnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6IGA8c3BhbiBjbGFzcz1cInRpbWVsaW5lX2NhcmRfc21hbGx0aXRsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBZnJpY2FuIEJhbmtlciBBd2FyZHMgMjAxNVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgVHJvcGjDqWUgwqsgQmFucXVlIEFmcmljYWluZSBkZSBs4oCZQW5uw6llIMK7IGTDqWNlcm7DqSBhdSBHcm91cGUgQmFucXVlIENlbnRyYWxlIFBvcHVsYWlyZSBUcm9waMOpZSDCqyBJbmNsdXNpb24gRmluYW5jacOocmUgwrsgcmVtcG9ydMOpXHJcbiAgICAgICAgICAgICAgICAgICAgICBwYXIgbGEgZmlsaWFsZSBBdHRhd2ZpcSBNaWNyby1GaW5hbmNlLiBDYXJ0ZXNcclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGltZWxpbmVfY2FyZF9zbWFsbHRpdGxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFmcmlxdWUgQXdhcmRzIDIwMTVcclxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIE9idGVudGlvbiBkdSB0cm9waMOpZSDCqyBCZXN0IElubm92YXRpdmUgQ2FyZCBQcm9ncmFtbWUgwrsgYXR0cmlidcOpIMOgIMKrIEdsb2JhbENhcmQgwrssIHVuZSBjYXJ0ZSBtb27DqXRpcXVlIHByw6lwYXnDqWUgZGVzdGluw6llXHJcbiAgICAgICAgICAgICAgICAgICAgICBhdXggdm95YWdldXJzIGRlIHBhc3NhZ2UgYXUgTWFyb2MgZXQgcXVpIGNvbnN0aXR1ZSB1biBtb3llbiBkZSBzdWJzdGl0dXRpb24gw6AgbGEgbW9ubmFpZSBmaWR1Y2lhaXJlLlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aW1lbGluZV9jYXJkX3NtYWxsdGl0bGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgTW9yb2NjbyBNYXN0ZXJDYXJkIEN1c3RvbWVycyBNZWV0aW5ncyAyMDE1XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICBMZSBHcm91cGUgQmFucXVlIENlbnRyYWxlIFBvcHVsYWlyZSBhIHJlbXBvcnTDqSDDoCBjZXR0ZSBvY2Nhc2lvbiBsZSB0cm9waMOpZSBkZSBjaGFtcGlvbiBuYXRpb25hbCBk4oCZYWN0aXZhdGlvbiBkZXMgY2FydGVzIGRlXHJcbiAgICAgICAgICAgICAgICAgICAgICBwYWllbWVudCBUUEUgwqsgUG9zIFVzYWdlIEFjdGl2YXRpb24gQ2hhbXBpb24gwrsuYFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgcmlnaHQ6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGU6ICcxMS0wMy0yMDE4JyxcclxuICAgICAgICAgICAgICBjb250ZW50OiAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gRGlnbmlzc2ltb3MsIHN1c2NpcGl0IScsXHJcbiAgICAgICAgICAgICAgbWVkaWE6ICdhc3NldHMvaW1nL3Jlcy0yLnBuZydcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGU6ICcxMS0wMy0yMDE4JyxcclxuICAgICAgICAgICAgICBjb250ZW50OiAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gRGlnbmlzc2ltb3MsIHN1c2NpcGl0IScsXHJcbiAgICAgICAgICAgICAgbWVkaWE6ICdhc3NldHMvaW1nL2V4cGxvcmVyLW1ldGllcnMyLnBuZydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHllYXI6IDIwMTIsXHJcbiAgICAgICAgYWN0aW9uczoge1xyXG4gICAgICAgICAgbGVmdDogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAxLTIwMTgnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBEaWduaXNzaW1vcywgc3VzY2lwaXQhJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAyLTIwMTgnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBEaWduaXNzaW1vcywgc3VzY2lwaXQhJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAzLTIwMTgnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnRElTVElOQ1RJT05TPGJyPiAmVFJPUEjDiUVTJyxcclxuICAgICAgICAgICAgICBjb250ZW50OiBgPHNwYW4gY2xhc3M9XCJ0aW1lbGluZV9jYXJkX3NtYWxsdGl0bGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgQWZyaWNhbiBCYW5rZXIgQXdhcmRzIDIwMTVcclxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIFRyb3Bow6llIMKrIEJhbnF1ZSBBZnJpY2FpbmUgZGUgbOKAmUFubsOpZSDCuyBkw6ljZXJuw6kgYXUgR3JvdXBlIEJhbnF1ZSBDZW50cmFsZSBQb3B1bGFpcmUgVHJvcGjDqWUgwqsgSW5jbHVzaW9uIEZpbmFuY2nDqHJlIMK7IHJlbXBvcnTDqVxyXG4gICAgICAgICAgICAgICAgICAgICAgcGFyIGxhIGZpbGlhbGUgQXR0YXdmaXEgTWljcm8tRmluYW5jZS4gQ2FydGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpbWVsaW5lX2NhcmRfc21hbGx0aXRsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBZnJpcXVlIEF3YXJkcyAyMDE1XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICBPYnRlbnRpb24gZHUgdHJvcGjDqWUgwqsgQmVzdCBJbm5vdmF0aXZlIENhcmQgUHJvZ3JhbW1lIMK7IGF0dHJpYnXDqSDDoCDCqyBHbG9iYWxDYXJkIMK7LCB1bmUgY2FydGUgbW9uw6l0aXF1ZSBwcsOpcGF5w6llIGRlc3RpbsOpZVxyXG4gICAgICAgICAgICAgICAgICAgICAgYXV4IHZveWFnZXVycyBkZSBwYXNzYWdlIGF1IE1hcm9jIGV0IHF1aSBjb25zdGl0dWUgdW4gbW95ZW4gZGUgc3Vic3RpdHV0aW9uIMOgIGxhIG1vbm5haWUgZmlkdWNpYWlyZS5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGltZWxpbmVfY2FyZF9zbWFsbHRpdGxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1vcm9jY28gTWFzdGVyQ2FyZCBDdXN0b21lcnMgTWVldGluZ3MgMjAxNVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgTGUgR3JvdXBlIEJhbnF1ZSBDZW50cmFsZSBQb3B1bGFpcmUgYSByZW1wb3J0w6kgw6AgY2V0dGUgb2NjYXNpb24gbGUgdHJvcGjDqWUgZGUgY2hhbXBpb24gbmF0aW9uYWwgZOKAmWFjdGl2YXRpb24gZGVzIGNhcnRlcyBkZVxyXG4gICAgICAgICAgICAgICAgICAgICAgcGFpZW1lbnQgVFBFIMKrIFBvcyBVc2FnZSBBY3RpdmF0aW9uIENoYW1waW9uIMK7LmBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXSxcclxuICAgICAgICAgIHJpZ2h0OiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkYXRlOiAnMTEtMDMtMjAxOCcsXHJcbiAgICAgICAgICAgICAgY29udGVudDogJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0IGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQuIERpZ25pc3NpbW9zLCBzdXNjaXBpdCEnLFxyXG4gICAgICAgICAgICAgIG1lZGlhOiAnYXNzZXRzL2ltZy9yZXMtMi5wbmcnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkYXRlOiAnMTEtMDMtMjAxOCcsXHJcbiAgICAgICAgICAgICAgY29udGVudDogJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0IGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQuIERpZ25pc3NpbW9zLCBzdXNjaXBpdCEnLFxyXG4gICAgICAgICAgICAgIG1lZGlhOiAnYXNzZXRzL2ltZy9leHBsb3Jlci1tZXRpZXJzMi5wbmcnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB5ZWFyOiAyMDExLFxyXG4gICAgICAgIGFjdGlvbnM6IHtcclxuICAgICAgICAgIGxlZnQ6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGU6ICcxMS0wMS0yMDE4JyxcclxuICAgICAgICAgICAgICBjb250ZW50OiAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gRGlnbmlzc2ltb3MsIHN1c2NpcGl0ISdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGU6ICcxMS0wMi0yMDE4JyxcclxuICAgICAgICAgICAgICBjb250ZW50OiAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gRGlnbmlzc2ltb3MsIHN1c2NpcGl0ISdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGU6ICcxMS0wMy0yMDE4JyxcclxuICAgICAgICAgICAgICB0aXRsZTogJ0RJU1RJTkNUSU9OUzxicj4gJlRST1BIw4lFUycsXHJcbiAgICAgICAgICAgICAgY29udGVudDogYDxzcGFuIGNsYXNzPVwidGltZWxpbmVfY2FyZF9zbWFsbHRpdGxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFmcmljYW4gQmFua2VyIEF3YXJkcyAyMDE1XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICBUcm9waMOpZSDCqyBCYW5xdWUgQWZyaWNhaW5lIGRlIGzigJlBbm7DqWUgwrsgZMOpY2VybsOpIGF1IEdyb3VwZSBCYW5xdWUgQ2VudHJhbGUgUG9wdWxhaXJlIFRyb3Bow6llIMKrIEluY2x1c2lvbiBGaW5hbmNpw6hyZSDCuyByZW1wb3J0w6lcclxuICAgICAgICAgICAgICAgICAgICAgIHBhciBsYSBmaWxpYWxlIEF0dGF3ZmlxIE1pY3JvLUZpbmFuY2UuIENhcnRlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aW1lbGluZV9jYXJkX3NtYWxsdGl0bGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgQWZyaXF1ZSBBd2FyZHMgMjAxNVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgT2J0ZW50aW9uIGR1IHRyb3Bow6llIMKrIEJlc3QgSW5ub3ZhdGl2ZSBDYXJkIFByb2dyYW1tZSDCuyBhdHRyaWJ1w6kgw6AgwqsgR2xvYmFsQ2FyZCDCuywgdW5lIGNhcnRlIG1vbsOpdGlxdWUgcHLDqXBhecOpZSBkZXN0aW7DqWVcclxuICAgICAgICAgICAgICAgICAgICAgIGF1eCB2b3lhZ2V1cnMgZGUgcGFzc2FnZSBhdSBNYXJvYyBldCBxdWkgY29uc3RpdHVlIHVuIG1veWVuIGRlIHN1YnN0aXR1dGlvbiDDoCBsYSBtb25uYWllIGZpZHVjaWFpcmUuXHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpbWVsaW5lX2NhcmRfc21hbGx0aXRsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBNb3JvY2NvIE1hc3RlckNhcmQgQ3VzdG9tZXJzIE1lZXRpbmdzIDIwMTVcclxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIExlIEdyb3VwZSBCYW5xdWUgQ2VudHJhbGUgUG9wdWxhaXJlIGEgcmVtcG9ydMOpIMOgIGNldHRlIG9jY2FzaW9uIGxlIHRyb3Bow6llIGRlIGNoYW1waW9uIG5hdGlvbmFsIGTigJlhY3RpdmF0aW9uIGRlcyBjYXJ0ZXMgZGVcclxuICAgICAgICAgICAgICAgICAgICAgIHBhaWVtZW50IFRQRSDCqyBQb3MgVXNhZ2UgQWN0aXZhdGlvbiBDaGFtcGlvbiDCuy5gXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICByaWdodDogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAzLTIwMTgnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBEaWduaXNzaW1vcywgc3VzY2lwaXQhJyxcclxuICAgICAgICAgICAgICBtZWRpYTogJ2Fzc2V0cy9pbWcvcmVzLTIucG5nJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAzLTIwMTgnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBEaWduaXNzaW1vcywgc3VzY2lwaXQhJyxcclxuICAgICAgICAgICAgICBtZWRpYTogJ2Fzc2V0cy9pbWcvZXhwbG9yZXItbWV0aWVyczIucG5nJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICBdXHJcbiAgfVxyXG5cclxuICBsZXQgZGF0YUluZGV4ID0gMVxyXG5cclxuICBsZXQgbWFwcGVkRGF0YSA9IGRhdGEucGVyaW9kcy5tYXAocGVyaW9kID0+IHtcclxuICAgIHJldHVybiBgPGRpdiBjbGFzcz1cInRpbWVsaW5lX3BlcmlvZFwiPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGltZWxpbmVfcGVyaW9kX2RhdGVcIj4ke3BlcmlvZC55ZWFyfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtNiBtdC0zXCI+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICR7cGVyaW9kLmFjdGlvbnMubGVmdFxyXG4gICAgICAubWFwKGFjdGlvbiA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwidGltZWxpbmVfY2FyZCB0aW1lbGluZV9jYXJkLWxlZnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpbWVsaW5lX2NhcmRfY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJ0aW1lbGluZV9jYXJkX2RhdGVcIj4ke2FjdGlvbi5kYXRlfTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7YWN0aW9uLnRpdGxlID8gJzxoMiBjbGFzcz1cInRpbWVsaW5lX2NhcmRfdGl0bGVcIj4nICsgYWN0aW9uLnRpdGxlICsgJzwvaDI+JyA6ICcnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJ0aW1lbGluZV9jYXJkX3RleHRcIj4ke2FjdGlvbi5jb250ZW50fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR7YWN0aW9uLm1lZGlhID8gYDxhIGNsYXNzPVwic3dpcGVib3ggc3dpcGVib3gtLXZpZGVvXCIgaHJlZj1cIiR7YWN0aW9uLm1lZGlhfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHthY3Rpb24ubWVkaWF9XCIgYWx0PVwiXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5gIDogJyd9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+YFxyXG4gICAgICB9KVxyXG4gICAgICAuam9pbignJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC02IG10LTNcIj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHtwZXJpb2QuYWN0aW9ucy5yaWdodFxyXG4gICAgICAubWFwKGFjdGlvbiA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwidGltZWxpbmVfY2FyZCB0aW1lbGluZV9jYXJkLXJpZ2h0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aW1lbGluZV9jYXJkX2NvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwidGltZWxpbmVfY2FyZF9kYXRlXCI+JHthY3Rpb24uZGF0ZX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2FjdGlvbi50aXRsZSA/ICc8aDIgY2xhc3M9XCJ0aW1lbGluZV9jYXJkX3RpdGxlXCI+JyArIGFjdGlvbi50aXRsZSArICc8L2gyPicgOiAnJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwidGltZWxpbmVfY2FyZF90ZXh0XCI+JHthY3Rpb24uY29udGVudH08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAke2FjdGlvbi5tZWRpYSA/IGA8YSBjbGFzcz1cInN3aXBlYm94IHN3aXBlYm94LS12aWRlb1wiIGhyZWY9XCIke2FjdGlvbi5tZWRpYX1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cIiR7YWN0aW9uLm1lZGlhfVwiIGFsdD1cIlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+YCA6ICcnfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PmBcclxuICAgICAgfSlcclxuICAgICAgLmpvaW4oJycpfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+YFxyXG4gIH0pXHJcblxyXG4gIGxldCB1cGRhdGVQb3NpdGlvbiA9IHRyYWNrZXIoZnVuY3Rpb24gKHBvc2l0aW9uKSB7XHJcbiAgICBkYXRhSW5kZXggPSBwb3NpdGlvblxyXG4gICAgcmVuZGVyKClcclxuICAgIGlmIChkYXRhSW5kZXggKyAxID4gbWFwcGVkRGF0YS5sZW5ndGgpIHtcclxuICAgICAgJCgnLnRpbWVsaW5lX2FjdGlvbnMtcGx1cycpLmNzcygnZGlzcGxheScsICdub25lJylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoJy50aW1lbGluZV9hY3Rpb25zLXBsdXMnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKVxyXG4gICAgfVxyXG4gIH0pIC8vIGluaXQgdGhlIHRyYWNrYmFyXHJcblxyXG4gIGZ1bmN0aW9uIHJlbmRlciAoKSB7XHJcbiAgICBsZXQgdG9SZW5kZXIgPSAnJ1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhSW5kZXg7IGkrKykge1xyXG4gICAgICB0b1JlbmRlciArPSBtYXBwZWREYXRhW2ldXHJcbiAgICB9XHJcbiAgICBsZXQgYWN0aW9uc0hvbGRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aW1lbGluZV9hY3Rpb25zJylcclxuICAgIGlmIChhY3Rpb25zSG9sZGVyKSB7XHJcbiAgICAgIGFjdGlvbnNIb2xkZXIuaW5uZXJIVE1MID0gdG9SZW5kZXJcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGluY3JlbWVudCAoKSB7XHJcbiAgICBkYXRhSW5kZXgrK1xyXG4gICAgaWYgKGRhdGFJbmRleCArIDEgPiBtYXBwZWREYXRhLmxlbmd0aCkge1xyXG4gICAgICAkKCcudGltZWxpbmVfYWN0aW9ucy1wbHVzJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKVxyXG4gICAgfVxyXG4gICAgdXBkYXRlUG9zaXRpb24oZGF0YUluZGV4IC0gMSlcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNjcm9sbFRvTGFzdCAoKSB7XHJcbiAgICBsZXQgYWN0aW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50aW1lbGluZV9wZXJpb2QnKVxyXG4gICAgYWN0aW9uc1thY3Rpb25zLmxlbmd0aCAtIDFdLnNjcm9sbEludG9WaWV3KHtcclxuICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyKClcclxuXHJcbiAgJCgnLnRpbWVsaW5lX2FjdGlvbnMtcGx1cycpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgIGluY3JlbWVudCgpXHJcbiAgICByZW5kZXIoKVxyXG4gICAgc2Nyb2xsVG9MYXN0KClcclxuICB9KVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xyXG4gICAgJCgnLnRvcC1oZWFkZXJfbGlzdCAubGlzdCwgLnRvcC1oZWFkZXJfbGlzdCAubGFuZycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoISQoZS50YXJnZXQpLmNsb3Nlc3QoJy5kcm9wZG93bicpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgJCh0aGlzKS5maW5kKCcuZHJvcGRvd24nKS50b2dnbGVDbGFzcygnZC1ub25lJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCcqJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG5cclxuICAgICAgICBpZiAoISQuY29udGFpbnMoJCgnLnRvcC1oZWFkZXJfbGlzdCcpWzBdLCAkKGUudGFyZ2V0KVswXSkgJiYgXHJcbiAgICAgICAgICAgICgkKCcubGFuZycpLmhhc0NsYXNzKCdvcGVuJykgfHxcclxuICAgICAgICAgICAgJCgnLmxpc3QnKS5oYXNDbGFzcygnb3BlbicpKSApIHtcclxuXHJcbiAgICAgICAgICAgIGNsb3NlRHJvcGRvd25zKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gY2xvc2VEcm9wZG93bnMoKSB7XHJcbiAgICAgICAgaWYgKCQoJy50b3AtaGVhZGVyX2xpc3QgLmxpc3QnKS5oYXNDbGFzcygnb3BlbicpKSB7XHJcbiAgICAgICAgICAgICQoJy50b3AtaGVhZGVyX2xpc3QgLmxpc3QnKS50b2dnbGVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICAgICAkKCcudG9wLWhlYWRlcl9saXN0IC5saXN0JykuZmluZCgnLmRyb3Bkb3duJykudG9nZ2xlQ2xhc3MoJ2Qtbm9uZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCQoJy50b3AtaGVhZGVyX2xpc3QgLmxhbmcnKS5oYXNDbGFzcygnb3BlbicpKSB7XHJcbiAgICAgICAgICAgICQoJy50b3AtaGVhZGVyX2xpc3QgLmxhbmcnKS50b2dnbGVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICAgICAkKCcudG9wLWhlYWRlcl9saXN0IC5sYW5nJykuZmluZCgnLmRyb3Bkb3duJykudG9nZ2xlQ2xhc3MoJ2Qtbm9uZScpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdfQ==
