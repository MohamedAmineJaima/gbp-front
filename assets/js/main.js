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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$(document).ready(function () {
  _smoothscrollPolyfill2.default.polyfill();
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
});

},{"../../components/actualite-slider/index.js":5,"../../components/actualites/index.js":6,"../../components/appel-offres/index.js":7,"../../components/article-slider/index.js":8,"../../components/besoin-aide/index.js":9,"../../components/card/card-actualites.js":10,"../../components/card/card-histoire.js":11,"../../components/card/card-rapport/card-rapport.js":12,"../../components/card/card-slider.js":13,"../../components/communiques/index.js":14,"../../components/date-slider/date-slider.js":16,"../../components/finance/filter.js":17,"../../components/finance/index.js":18,"../../components/footer/index.js":19,"../../components/form/form-upload.js":20,"../../components/form/form-validation.js":21,"../../components/header/index.js":22,"../../components/home-slider/index.js":23,"../../components/logo-slider/index.js":24,"../../components/map-control/index.js":25,"../../components/map/index.js":26,"../../components/mediacenter/index.js":27,"../../components/nos-banques/index.js":28,"../../components/popup-search/index.js":29,"../../components/popup-video/index.js":30,"../../components/pub-slider/index.js":31,"../../components/select-filter/index.js":32,"../../components/swipebox/index.js":33,"../../components/timeline/index.js":34,"../../components/top-header/index.js":35,"smoothscroll-polyfill":2}],5:[function(require,module,exports){
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
      date: '29/07/2017',
      title: 'Le Groupe BCP lance la pr emière banque marocaine dédiée à l’activité “titres”',
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
    if (state.filter.length > 0) {
      data = data.filter(function (post) {
        if (state.filter === post.date.split('/')[2]) {
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
exports.buildMapCardInfo = exports.toggleControl = exports.mapControl = undefined;

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

      var selectedElement = state.filtredData.filter(function (element) {
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
      selectedContainer.fadeIn();
      suggestionsContainer.hide();
    };

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

var buildMapCardInfo = exports.buildMapCardInfo = function buildMapCardInfo(selectedElement) {
  return '<div class="moreinfo_content">\n  <div class="moreinfo_head">\n    <h3 class="moreinfo_title" id="info-name">' + selectedElement.name + '</h3>\n    <p class="moreinfo_address" id="info-address">' + selectedElement.address + '</p>\n    <div class="moreinfo_actions">\n      <a href="#">G\xC9N\xC9RER UN ITIN\xC9RAIRE</a>\n      <a href="#" id="selected-container--close">RETOURNER</a>\n    </div>\n  </div>\n  <div class="moreinfo_body">\n    <div class="moreinfo_section">\n      <h4>Coordonn\xE9es</h4>\n      <div class="moreinfo_list">\n        <div class="moreinfo_list-item">\n          <div class="left">\n            <span>Email</span>\n          </div>\n          <div class="right">\n            <span id="info-email">' + selectedElement.coords.email + '</span>\n          </div>\n        </div>\n        <div class="moreinfo_list-item">\n          <div class="left">\n            <span>T\xE9l\xE9phone</span>\n          </div>\n          <div class="right">\n            <span id="info-phone">' + selectedElement.coords.phone + '</span>\n          </div>\n        </div>\n        <div class="moreinfo_list-item">\n          <div class="left">\n            <span>Fax</span>\n          </div>\n          <div class="right">\n            <span id="info-fax">' + selectedElement.coords.fax + '</span>\n          </div>\n        </div>\n        <div class="moreinfo_list-item">\n          <div class="left">\n            <span>Coords GPS</span>\n          </div>\n          <div class="right">\n            <span>\n              <bold>\n                Latitude\n              </bold> : ' + selectedElement.coords.gps.lat + ' |\n              <bold>\n                Longitude\n              </bold> : ' + selectedElement.coords.gps.lang + ' </span>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class="moreinfo_section">\n      <h4>Agence li\xE9e</h4>\n      <div class="moreinfo_container">\n        <h5>' + selectedElement.extension.name + '</h5>\n        <p class="moreinfo_address">' + selectedElement.extension.address + '</p>\n      </div>\n    </div>\n    <div class="moreinfo_section">\n      <div class="moreinfo_list">\n        <div class="moreinfo_list-item">\n          <div class="left">\n            <span>Lundi</span>\n          </div>\n          <div class="right">\n            <span>' + selectedElement.timetable.monday + '</span>\n          </div>\n        </div>\n        <div class="moreinfo_list-item">\n          <div class="left">\n            <span>Mardi</span>\n          </div>\n          <div class="right">\n            <span>' + selectedElement.timetable.tuesday + '</span>\n          </div>\n        </div>\n        <div class="moreinfo_list-item">\n          <div class="left">\n            <span>Mercredi</span>\n          </div>\n          <div class="right">\n            <span>' + selectedElement.timetable.wednesday + '</span>\n          </div>\n        </div>\n        <div class="moreinfo_list-item">\n          <div class="left">\n            <span>Jeudi</span>\n          </div>\n          <div class="right">\n            <span>' + selectedElement.timetable.thursday + '</span>\n          </div>\n        </div>\n        <div class="moreinfo_list-item">\n          <div class="left">\n            <span>Vendredi</span>\n          </div>\n          <div class="right">\n            <span>' + selectedElement.timetable.friday + '</span>\n          </div>\n        </div>\n        <div class="moreinfo_list-item">\n          <div class="left">\n            <span>Samedi</span>\n          </div>\n          <div class="right">\n            <span>' + selectedElement.timetable.saturday + '</span>\n          </div>\n        </div>\n        <div class="moreinfo_list-item">\n          <div class="left">\n            <span>Diamanche</span>\n          </div>\n          <div class="right">\n            <span>' + selectedElement.timetable.sunday + '</span>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>';
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
        var map = new google.maps.Map(mapHolder, mapProp);

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

},{"../../components/date-filter/index.js":15}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if ($('.header_search').length) {
		addEventListeners();
	}

	function addEventListeners() {
		$('.header_search, .header_mobile-search').on('click', function () {
			$('.page-content').addClass('d-none');
			$('.popup-search').removeClass('d-none');
		});

		$('.close-wrapper').on('click', function () {
			$('.page-content').removeClass('d-none');
			$('.popup-search').addClass('d-none');
		});

		$('.popup-search .btn--tag').on('click', function () {

			if ($(this).is(':first-child')) {
				$('.popup-search .btn--tag:not(:first-child)').removeClass('active');
				$(this).toggleClass('active');
			} else {
				$('.popup-search .btn--tag:first-child').removeClass('active');
				$(this).toggleClass('active');
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

},{}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	$('select.nice-select').niceSelect();
};

},{}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if ($('.swipebox').length) {
		//$('.swipebox').swipebox();
	}
};

},{}],34:[function(require,module,exports){
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

},{}],35:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbW9tZW50L21vbWVudC5qcyIsIm5vZGVfbW9kdWxlcy9zbW9vdGhzY3JvbGwtcG9seWZpbGwvZGlzdC9zbW9vdGhzY3JvbGwuanMiLCJzcmMvYXNzZXRzL2pzL2RhdGEuanNvbiIsInNyYy9hc3NldHMvanMvbWFpbi5qcyIsInNyYy9jb21wb25lbnRzL2FjdHVhbGl0ZS1zbGlkZXIvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9hY3R1YWxpdGVzL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvYXBwZWwtb2ZmcmVzL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvYXJ0aWNsZS1zbGlkZXIvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9iZXNvaW4tYWlkZS9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2NhcmQvY2FyZC1hY3R1YWxpdGVzLmpzIiwic3JjL2NvbXBvbmVudHMvY2FyZC9jYXJkLWhpc3RvaXJlLmpzIiwic3JjL2NvbXBvbmVudHMvY2FyZC9jYXJkLXJhcHBvcnQvY2FyZC1yYXBwb3J0LmpzIiwic3JjL2NvbXBvbmVudHMvY2FyZC9jYXJkLXNsaWRlci5qcyIsInNyYy9jb21wb25lbnRzL2NvbW11bmlxdWVzL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvZGF0ZS1maWx0ZXIvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9kYXRlLXNsaWRlci9kYXRlLXNsaWRlci5qcyIsInNyYy9jb21wb25lbnRzL2ZpbmFuY2UvZmlsdGVyLmpzIiwic3JjL2NvbXBvbmVudHMvZmluYW5jZS9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2Zvb3Rlci9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2Zvcm0vZm9ybS11cGxvYWQuanMiLCJzcmMvY29tcG9uZW50cy9mb3JtL2Zvcm0tdmFsaWRhdGlvbi5qcyIsInNyYy9jb21wb25lbnRzL2hlYWRlci9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2hvbWUtc2xpZGVyL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvbG9nby1zbGlkZXIvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9tYXAtY29udHJvbC9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL21hcC9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL21lZGlhY2VudGVyL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvbm9zLWJhbnF1ZXMvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9wb3B1cC1zZWFyY2gvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9wb3B1cC12aWRlby9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL3B1Yi1zbGlkZXIvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9zZWxlY3QtZmlsdGVyL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvc3dpcGVib3gvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy90aW1lbGluZS9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL3RvcC1oZWFkZXIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxNUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdmJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzlQQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBSUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLEVBQUUsUUFBRixFQUFZLEtBQVosQ0FBa0IsWUFBWTtBQUM1QixpQ0FBYSxRQUFiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRCxDQWpDRDs7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d0JBQUYsRUFBNEIsSUFBNUIsQ0FBaUMsV0FBakMsRUFBOEMsV0FBOUMsQ0FBMEQsUUFBMUQ7QUFDSDtBQUNKO0FBQ0osQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vISBtb21lbnQuanNcblxuOyhmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICAgIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gICAgZ2xvYmFsLm1vbWVudCA9IGZhY3RvcnkoKVxufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgaG9va0NhbGxiYWNrO1xuXG4gICAgZnVuY3Rpb24gaG9va3MgKCkge1xuICAgICAgICByZXR1cm4gaG9va0NhbGxiYWNrLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBpcyBkb25lIHRvIHJlZ2lzdGVyIHRoZSBtZXRob2QgY2FsbGVkIHdpdGggbW9tZW50KClcbiAgICAvLyB3aXRob3V0IGNyZWF0aW5nIGNpcmN1bGFyIGRlcGVuZGVuY2llcy5cbiAgICBmdW5jdGlvbiBzZXRIb29rQ2FsbGJhY2sgKGNhbGxiYWNrKSB7XG4gICAgICAgIGhvb2tDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQXJyYXkoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0IGluc3RhbmNlb2YgQXJyYXkgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc09iamVjdChpbnB1dCkge1xuICAgICAgICAvLyBJRTggd2lsbCB0cmVhdCB1bmRlZmluZWQgYW5kIG51bGwgYXMgb2JqZWN0IGlmIGl0IHdhc24ndCBmb3JcbiAgICAgICAgLy8gaW5wdXQgIT0gbnVsbFxuICAgICAgICByZXR1cm4gaW5wdXQgIT0gbnVsbCAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBPYmplY3RdJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc09iamVjdEVtcHR5KG9iaikge1xuICAgICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMpIHtcbiAgICAgICAgICAgIHJldHVybiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKS5sZW5ndGggPT09IDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGs7XG4gICAgICAgICAgICBmb3IgKGsgaW4gb2JqKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1VuZGVmaW5lZChpbnB1dCkge1xuICAgICAgICByZXR1cm4gaW5wdXQgPT09IHZvaWQgMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc051bWJlcihpbnB1dCkge1xuICAgICAgICByZXR1cm4gdHlwZW9mIGlucHV0ID09PSAnbnVtYmVyJyB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBOdW1iZXJdJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0RhdGUoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0IGluc3RhbmNlb2YgRGF0ZSB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBEYXRlXSc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFwKGFyciwgZm4pIHtcbiAgICAgICAgdmFyIHJlcyA9IFtdLCBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICByZXMucHVzaChmbihhcnJbaV0sIGkpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhc093blByb3AoYSwgYikge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGEsIGIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4dGVuZChhLCBiKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gYikge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3AoYiwgaSkpIHtcbiAgICAgICAgICAgICAgICBhW2ldID0gYltpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNPd25Qcm9wKGIsICd0b1N0cmluZycpKSB7XG4gICAgICAgICAgICBhLnRvU3RyaW5nID0gYi50b1N0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNPd25Qcm9wKGIsICd2YWx1ZU9mJykpIHtcbiAgICAgICAgICAgIGEudmFsdWVPZiA9IGIudmFsdWVPZjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZVVUQyAoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUxvY2FsT3JVVEMoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QsIHRydWUpLnV0YygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlZmF1bHRQYXJzaW5nRmxhZ3MoKSB7XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gZGVlcCBjbG9uZSB0aGlzIG9iamVjdC5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVtcHR5ICAgICAgICAgICA6IGZhbHNlLFxuICAgICAgICAgICAgdW51c2VkVG9rZW5zICAgIDogW10sXG4gICAgICAgICAgICB1bnVzZWRJbnB1dCAgICAgOiBbXSxcbiAgICAgICAgICAgIG92ZXJmbG93ICAgICAgICA6IC0yLFxuICAgICAgICAgICAgY2hhcnNMZWZ0T3ZlciAgIDogMCxcbiAgICAgICAgICAgIG51bGxJbnB1dCAgICAgICA6IGZhbHNlLFxuICAgICAgICAgICAgaW52YWxpZE1vbnRoICAgIDogbnVsbCxcbiAgICAgICAgICAgIGludmFsaWRGb3JtYXQgICA6IGZhbHNlLFxuICAgICAgICAgICAgdXNlckludmFsaWRhdGVkIDogZmFsc2UsXG4gICAgICAgICAgICBpc28gICAgICAgICAgICAgOiBmYWxzZSxcbiAgICAgICAgICAgIHBhcnNlZERhdGVQYXJ0cyA6IFtdLFxuICAgICAgICAgICAgbWVyaWRpZW0gICAgICAgIDogbnVsbCxcbiAgICAgICAgICAgIHJmYzI4MjIgICAgICAgICA6IGZhbHNlLFxuICAgICAgICAgICAgd2Vla2RheU1pc21hdGNoIDogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQYXJzaW5nRmxhZ3MobSkge1xuICAgICAgICBpZiAobS5fcGYgPT0gbnVsbCkge1xuICAgICAgICAgICAgbS5fcGYgPSBkZWZhdWx0UGFyc2luZ0ZsYWdzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG0uX3BmO1xuICAgIH1cblxuICAgIHZhciBzb21lO1xuICAgIGlmIChBcnJheS5wcm90b3R5cGUuc29tZSkge1xuICAgICAgICBzb21lID0gQXJyYXkucHJvdG90eXBlLnNvbWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc29tZSA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICAgICAgICAgIHZhciB0ID0gT2JqZWN0KHRoaXMpO1xuICAgICAgICAgICAgdmFyIGxlbiA9IHQubGVuZ3RoID4+PiAwO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgaW4gdCAmJiBmdW4uY2FsbCh0aGlzLCB0W2ldLCBpLCB0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1ZhbGlkKG0pIHtcbiAgICAgICAgaWYgKG0uX2lzVmFsaWQgPT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIGZsYWdzID0gZ2V0UGFyc2luZ0ZsYWdzKG0pO1xuICAgICAgICAgICAgdmFyIHBhcnNlZFBhcnRzID0gc29tZS5jYWxsKGZsYWdzLnBhcnNlZERhdGVQYXJ0cywgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaSAhPSBudWxsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgaXNOb3dWYWxpZCA9ICFpc05hTihtLl9kLmdldFRpbWUoKSkgJiZcbiAgICAgICAgICAgICAgICBmbGFncy5vdmVyZmxvdyA8IDAgJiZcbiAgICAgICAgICAgICAgICAhZmxhZ3MuZW1wdHkgJiZcbiAgICAgICAgICAgICAgICAhZmxhZ3MuaW52YWxpZE1vbnRoICYmXG4gICAgICAgICAgICAgICAgIWZsYWdzLmludmFsaWRXZWVrZGF5ICYmXG4gICAgICAgICAgICAgICAgIWZsYWdzLndlZWtkYXlNaXNtYXRjaCAmJlxuICAgICAgICAgICAgICAgICFmbGFncy5udWxsSW5wdXQgJiZcbiAgICAgICAgICAgICAgICAhZmxhZ3MuaW52YWxpZEZvcm1hdCAmJlxuICAgICAgICAgICAgICAgICFmbGFncy51c2VySW52YWxpZGF0ZWQgJiZcbiAgICAgICAgICAgICAgICAoIWZsYWdzLm1lcmlkaWVtIHx8IChmbGFncy5tZXJpZGllbSAmJiBwYXJzZWRQYXJ0cykpO1xuXG4gICAgICAgICAgICBpZiAobS5fc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgaXNOb3dWYWxpZCA9IGlzTm93VmFsaWQgJiZcbiAgICAgICAgICAgICAgICAgICAgZmxhZ3MuY2hhcnNMZWZ0T3ZlciA9PT0gMCAmJlxuICAgICAgICAgICAgICAgICAgICBmbGFncy51bnVzZWRUb2tlbnMubGVuZ3RoID09PSAwICYmXG4gICAgICAgICAgICAgICAgICAgIGZsYWdzLmJpZ0hvdXIgPT09IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKE9iamVjdC5pc0Zyb3plbiA9PSBudWxsIHx8ICFPYmplY3QuaXNGcm96ZW4obSkpIHtcbiAgICAgICAgICAgICAgICBtLl9pc1ZhbGlkID0gaXNOb3dWYWxpZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBpc05vd1ZhbGlkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtLl9pc1ZhbGlkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUludmFsaWQgKGZsYWdzKSB7XG4gICAgICAgIHZhciBtID0gY3JlYXRlVVRDKE5hTik7XG4gICAgICAgIGlmIChmbGFncyAhPSBudWxsKSB7XG4gICAgICAgICAgICBleHRlbmQoZ2V0UGFyc2luZ0ZsYWdzKG0pLCBmbGFncyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MobSkudXNlckludmFsaWRhdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH1cblxuICAgIC8vIFBsdWdpbnMgdGhhdCBhZGQgcHJvcGVydGllcyBzaG91bGQgYWxzbyBhZGQgdGhlIGtleSBoZXJlIChudWxsIHZhbHVlKSxcbiAgICAvLyBzbyB3ZSBjYW4gcHJvcGVybHkgY2xvbmUgb3Vyc2VsdmVzLlxuICAgIHZhciBtb21lbnRQcm9wZXJ0aWVzID0gaG9va3MubW9tZW50UHJvcGVydGllcyA9IFtdO1xuXG4gICAgZnVuY3Rpb24gY29weUNvbmZpZyh0bywgZnJvbSkge1xuICAgICAgICB2YXIgaSwgcHJvcCwgdmFsO1xuXG4gICAgICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5faXNBTW9tZW50T2JqZWN0KSkge1xuICAgICAgICAgICAgdG8uX2lzQU1vbWVudE9iamVjdCA9IGZyb20uX2lzQU1vbWVudE9iamVjdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX2kpKSB7XG4gICAgICAgICAgICB0by5faSA9IGZyb20uX2k7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl9mKSkge1xuICAgICAgICAgICAgdG8uX2YgPSBmcm9tLl9mO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5fbCkpIHtcbiAgICAgICAgICAgIHRvLl9sID0gZnJvbS5fbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX3N0cmljdCkpIHtcbiAgICAgICAgICAgIHRvLl9zdHJpY3QgPSBmcm9tLl9zdHJpY3Q7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl90em0pKSB7XG4gICAgICAgICAgICB0by5fdHptID0gZnJvbS5fdHptO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5faXNVVEMpKSB7XG4gICAgICAgICAgICB0by5faXNVVEMgPSBmcm9tLl9pc1VUQztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX29mZnNldCkpIHtcbiAgICAgICAgICAgIHRvLl9vZmZzZXQgPSBmcm9tLl9vZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl9wZikpIHtcbiAgICAgICAgICAgIHRvLl9wZiA9IGdldFBhcnNpbmdGbGFncyhmcm9tKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX2xvY2FsZSkpIHtcbiAgICAgICAgICAgIHRvLl9sb2NhbGUgPSBmcm9tLl9sb2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobW9tZW50UHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbW9tZW50UHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHByb3AgPSBtb21lbnRQcm9wZXJ0aWVzW2ldO1xuICAgICAgICAgICAgICAgIHZhbCA9IGZyb21bcHJvcF07XG4gICAgICAgICAgICAgICAgaWYgKCFpc1VuZGVmaW5lZCh2YWwpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvW3Byb3BdID0gdmFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0bztcbiAgICB9XG5cbiAgICB2YXIgdXBkYXRlSW5Qcm9ncmVzcyA9IGZhbHNlO1xuXG4gICAgLy8gTW9tZW50IHByb3RvdHlwZSBvYmplY3RcbiAgICBmdW5jdGlvbiBNb21lbnQoY29uZmlnKSB7XG4gICAgICAgIGNvcHlDb25maWcodGhpcywgY29uZmlnKTtcbiAgICAgICAgdGhpcy5fZCA9IG5ldyBEYXRlKGNvbmZpZy5fZCAhPSBudWxsID8gY29uZmlnLl9kLmdldFRpbWUoKSA6IE5hTik7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2QgPSBuZXcgRGF0ZShOYU4pO1xuICAgICAgICB9XG4gICAgICAgIC8vIFByZXZlbnQgaW5maW5pdGUgbG9vcCBpbiBjYXNlIHVwZGF0ZU9mZnNldCBjcmVhdGVzIG5ldyBtb21lbnRcbiAgICAgICAgLy8gb2JqZWN0cy5cbiAgICAgICAgaWYgKHVwZGF0ZUluUHJvZ3Jlc3MgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICB1cGRhdGVJblByb2dyZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgIGhvb2tzLnVwZGF0ZU9mZnNldCh0aGlzKTtcbiAgICAgICAgICAgIHVwZGF0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTW9tZW50IChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIE1vbWVudCB8fCAob2JqICE9IG51bGwgJiYgb2JqLl9pc0FNb21lbnRPYmplY3QgIT0gbnVsbCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWJzRmxvb3IgKG51bWJlcikge1xuICAgICAgICBpZiAobnVtYmVyIDwgMCkge1xuICAgICAgICAgICAgLy8gLTAgLT4gMFxuICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbChudW1iZXIpIHx8IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihudW1iZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9JbnQoYXJndW1lbnRGb3JDb2VyY2lvbikge1xuICAgICAgICB2YXIgY29lcmNlZE51bWJlciA9ICthcmd1bWVudEZvckNvZXJjaW9uLFxuICAgICAgICAgICAgdmFsdWUgPSAwO1xuXG4gICAgICAgIGlmIChjb2VyY2VkTnVtYmVyICE9PSAwICYmIGlzRmluaXRlKGNvZXJjZWROdW1iZXIpKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGFic0Zsb29yKGNvZXJjZWROdW1iZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIC8vIGNvbXBhcmUgdHdvIGFycmF5cywgcmV0dXJuIHRoZSBudW1iZXIgb2YgZGlmZmVyZW5jZXNcbiAgICBmdW5jdGlvbiBjb21wYXJlQXJyYXlzKGFycmF5MSwgYXJyYXkyLCBkb250Q29udmVydCkge1xuICAgICAgICB2YXIgbGVuID0gTWF0aC5taW4oYXJyYXkxLmxlbmd0aCwgYXJyYXkyLmxlbmd0aCksXG4gICAgICAgICAgICBsZW5ndGhEaWZmID0gTWF0aC5hYnMoYXJyYXkxLmxlbmd0aCAtIGFycmF5Mi5sZW5ndGgpLFxuICAgICAgICAgICAgZGlmZnMgPSAwLFxuICAgICAgICAgICAgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoKGRvbnRDb252ZXJ0ICYmIGFycmF5MVtpXSAhPT0gYXJyYXkyW2ldKSB8fFxuICAgICAgICAgICAgICAgICghZG9udENvbnZlcnQgJiYgdG9JbnQoYXJyYXkxW2ldKSAhPT0gdG9JbnQoYXJyYXkyW2ldKSkpIHtcbiAgICAgICAgICAgICAgICBkaWZmcysrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaWZmcyArIGxlbmd0aERpZmY7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd2Fybihtc2cpIHtcbiAgICAgICAgaWYgKGhvb2tzLnN1cHByZXNzRGVwcmVjYXRpb25XYXJuaW5ncyA9PT0gZmFsc2UgJiZcbiAgICAgICAgICAgICAgICAodHlwZW9mIGNvbnNvbGUgIT09ICAndW5kZWZpbmVkJykgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0RlcHJlY2F0aW9uIHdhcm5pbmc6ICcgKyBtc2cpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVwcmVjYXRlKG1zZywgZm4pIHtcbiAgICAgICAgdmFyIGZpcnN0VGltZSA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuIGV4dGVuZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoaG9va3MuZGVwcmVjYXRpb25IYW5kbGVyICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBob29rcy5kZXByZWNhdGlvbkhhbmRsZXIobnVsbCwgbXNnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmaXJzdFRpbWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBhcmc7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzW2ldID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJnICs9ICdcXG5bJyArIGkgKyAnXSAnO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGFyZ3VtZW50c1swXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZyArPSBrZXkgKyAnOiAnICsgYXJndW1lbnRzWzBdW2tleV0gKyAnLCAnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnLnNsaWNlKDAsIC0yKTsgLy8gUmVtb3ZlIHRyYWlsaW5nIGNvbW1hIGFuZCBzcGFjZVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGFyZ3MucHVzaChhcmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3YXJuKG1zZyArICdcXG5Bcmd1bWVudHM6ICcgKyBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzKS5qb2luKCcnKSArICdcXG4nICsgKG5ldyBFcnJvcigpKS5zdGFjayk7XG4gICAgICAgICAgICAgICAgZmlyc3RUaW1lID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSwgZm4pO1xuICAgIH1cblxuICAgIHZhciBkZXByZWNhdGlvbnMgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGRlcHJlY2F0ZVNpbXBsZShuYW1lLCBtc2cpIHtcbiAgICAgICAgaWYgKGhvb2tzLmRlcHJlY2F0aW9uSGFuZGxlciAhPSBudWxsKSB7XG4gICAgICAgICAgICBob29rcy5kZXByZWNhdGlvbkhhbmRsZXIobmFtZSwgbXNnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWRlcHJlY2F0aW9uc1tuYW1lXSkge1xuICAgICAgICAgICAgd2Fybihtc2cpO1xuICAgICAgICAgICAgZGVwcmVjYXRpb25zW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhvb2tzLnN1cHByZXNzRGVwcmVjYXRpb25XYXJuaW5ncyA9IGZhbHNlO1xuICAgIGhvb2tzLmRlcHJlY2F0aW9uSGFuZGxlciA9IG51bGw7XG5cbiAgICBmdW5jdGlvbiBpc0Z1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBpbnB1dCBpbnN0YW5jZW9mIEZ1bmN0aW9uIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0IChjb25maWcpIHtcbiAgICAgICAgdmFyIHByb3AsIGk7XG4gICAgICAgIGZvciAoaSBpbiBjb25maWcpIHtcbiAgICAgICAgICAgIHByb3AgPSBjb25maWdbaV07XG4gICAgICAgICAgICBpZiAoaXNGdW5jdGlvbihwcm9wKSkge1xuICAgICAgICAgICAgICAgIHRoaXNbaV0gPSBwcm9wO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzWydfJyArIGldID0gcHJvcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jb25maWcgPSBjb25maWc7XG4gICAgICAgIC8vIExlbmllbnQgb3JkaW5hbCBwYXJzaW5nIGFjY2VwdHMganVzdCBhIG51bWJlciBpbiBhZGRpdGlvbiB0b1xuICAgICAgICAvLyBudW1iZXIgKyAocG9zc2libHkpIHN0dWZmIGNvbWluZyBmcm9tIF9kYXlPZk1vbnRoT3JkaW5hbFBhcnNlLlxuICAgICAgICAvLyBUT0RPOiBSZW1vdmUgXCJvcmRpbmFsUGFyc2VcIiBmYWxsYmFjayBpbiBuZXh0IG1ham9yIHJlbGVhc2UuXG4gICAgICAgIHRoaXMuX2RheU9mTW9udGhPcmRpbmFsUGFyc2VMZW5pZW50ID0gbmV3IFJlZ0V4cChcbiAgICAgICAgICAgICh0aGlzLl9kYXlPZk1vbnRoT3JkaW5hbFBhcnNlLnNvdXJjZSB8fCB0aGlzLl9vcmRpbmFsUGFyc2Uuc291cmNlKSArXG4gICAgICAgICAgICAgICAgJ3wnICsgKC9cXGR7MSwyfS8pLnNvdXJjZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWVyZ2VDb25maWdzKHBhcmVudENvbmZpZywgY2hpbGRDb25maWcpIHtcbiAgICAgICAgdmFyIHJlcyA9IGV4dGVuZCh7fSwgcGFyZW50Q29uZmlnKSwgcHJvcDtcbiAgICAgICAgZm9yIChwcm9wIGluIGNoaWxkQ29uZmlnKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcChjaGlsZENvbmZpZywgcHJvcCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNPYmplY3QocGFyZW50Q29uZmlnW3Byb3BdKSAmJiBpc09iamVjdChjaGlsZENvbmZpZ1twcm9wXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzW3Byb3BdID0ge307XG4gICAgICAgICAgICAgICAgICAgIGV4dGVuZChyZXNbcHJvcF0sIHBhcmVudENvbmZpZ1twcm9wXSk7XG4gICAgICAgICAgICAgICAgICAgIGV4dGVuZChyZXNbcHJvcF0sIGNoaWxkQ29uZmlnW3Byb3BdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkQ29uZmlnW3Byb3BdICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzW3Byb3BdID0gY2hpbGRDb25maWdbcHJvcF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHJlc1twcm9wXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChwcm9wIGluIHBhcmVudENvbmZpZykge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3AocGFyZW50Q29uZmlnLCBwcm9wKSAmJlxuICAgICAgICAgICAgICAgICAgICAhaGFzT3duUHJvcChjaGlsZENvbmZpZywgcHJvcCkgJiZcbiAgICAgICAgICAgICAgICAgICAgaXNPYmplY3QocGFyZW50Q29uZmlnW3Byb3BdKSkge1xuICAgICAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSBjaGFuZ2VzIHRvIHByb3BlcnRpZXMgZG9uJ3QgbW9kaWZ5IHBhcmVudCBjb25maWdcbiAgICAgICAgICAgICAgICByZXNbcHJvcF0gPSBleHRlbmQoe30sIHJlc1twcm9wXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBMb2NhbGUoY29uZmlnKSB7XG4gICAgICAgIGlmIChjb25maWcgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5zZXQoY29uZmlnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBrZXlzO1xuXG4gICAgaWYgKE9iamVjdC5rZXlzKSB7XG4gICAgICAgIGtleXMgPSBPYmplY3Qua2V5cztcbiAgICB9IGVsc2Uge1xuICAgICAgICBrZXlzID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgdmFyIGksIHJlcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChpIGluIG9iaikge1xuICAgICAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wKG9iaiwgaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdENhbGVuZGFyID0ge1xuICAgICAgICBzYW1lRGF5IDogJ1tUb2RheSBhdF0gTFQnLFxuICAgICAgICBuZXh0RGF5IDogJ1tUb21vcnJvdyBhdF0gTFQnLFxuICAgICAgICBuZXh0V2VlayA6ICdkZGRkIFthdF0gTFQnLFxuICAgICAgICBsYXN0RGF5IDogJ1tZZXN0ZXJkYXkgYXRdIExUJyxcbiAgICAgICAgbGFzdFdlZWsgOiAnW0xhc3RdIGRkZGQgW2F0XSBMVCcsXG4gICAgICAgIHNhbWVFbHNlIDogJ0wnXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGNhbGVuZGFyIChrZXksIG1vbSwgbm93KSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLl9jYWxlbmRhcltrZXldIHx8IHRoaXMuX2NhbGVuZGFyWydzYW1lRWxzZSddO1xuICAgICAgICByZXR1cm4gaXNGdW5jdGlvbihvdXRwdXQpID8gb3V0cHV0LmNhbGwobW9tLCBub3cpIDogb3V0cHV0O1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9uZ0RhdGVGb3JtYXQgPSB7XG4gICAgICAgIExUUyAgOiAnaDptbTpzcyBBJyxcbiAgICAgICAgTFQgICA6ICdoOm1tIEEnLFxuICAgICAgICBMICAgIDogJ01NL0REL1lZWVknLFxuICAgICAgICBMTCAgIDogJ01NTU0gRCwgWVlZWScsXG4gICAgICAgIExMTCAgOiAnTU1NTSBELCBZWVlZIGg6bW0gQScsXG4gICAgICAgIExMTEwgOiAnZGRkZCwgTU1NTSBELCBZWVlZIGg6bW0gQSdcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbG9uZ0RhdGVGb3JtYXQgKGtleSkge1xuICAgICAgICB2YXIgZm9ybWF0ID0gdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5XSxcbiAgICAgICAgICAgIGZvcm1hdFVwcGVyID0gdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5LnRvVXBwZXJDYXNlKCldO1xuXG4gICAgICAgIGlmIChmb3JtYXQgfHwgIWZvcm1hdFVwcGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5XSA9IGZvcm1hdFVwcGVyLnJlcGxhY2UoL01NTU18TU18RER8ZGRkZC9nLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsLnNsaWNlKDEpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5XTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdEludmFsaWREYXRlID0gJ0ludmFsaWQgZGF0ZSc7XG5cbiAgICBmdW5jdGlvbiBpbnZhbGlkRGF0ZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZhbGlkRGF0ZTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdE9yZGluYWwgPSAnJWQnO1xuICAgIHZhciBkZWZhdWx0RGF5T2ZNb250aE9yZGluYWxQYXJzZSA9IC9cXGR7MSwyfS87XG5cbiAgICBmdW5jdGlvbiBvcmRpbmFsIChudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29yZGluYWwucmVwbGFjZSgnJWQnLCBudW1iZXIpO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0UmVsYXRpdmVUaW1lID0ge1xuICAgICAgICBmdXR1cmUgOiAnaW4gJXMnLFxuICAgICAgICBwYXN0ICAgOiAnJXMgYWdvJyxcbiAgICAgICAgcyAgOiAnYSBmZXcgc2Vjb25kcycsXG4gICAgICAgIHNzIDogJyVkIHNlY29uZHMnLFxuICAgICAgICBtICA6ICdhIG1pbnV0ZScsXG4gICAgICAgIG1tIDogJyVkIG1pbnV0ZXMnLFxuICAgICAgICBoICA6ICdhbiBob3VyJyxcbiAgICAgICAgaGggOiAnJWQgaG91cnMnLFxuICAgICAgICBkICA6ICdhIGRheScsXG4gICAgICAgIGRkIDogJyVkIGRheXMnLFxuICAgICAgICBNICA6ICdhIG1vbnRoJyxcbiAgICAgICAgTU0gOiAnJWQgbW9udGhzJyxcbiAgICAgICAgeSAgOiAnYSB5ZWFyJyxcbiAgICAgICAgeXkgOiAnJWQgeWVhcnMnXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHJlbGF0aXZlVGltZSAobnVtYmVyLCB3aXRob3V0U3VmZml4LCBzdHJpbmcsIGlzRnV0dXJlKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLl9yZWxhdGl2ZVRpbWVbc3RyaW5nXTtcbiAgICAgICAgcmV0dXJuIChpc0Z1bmN0aW9uKG91dHB1dCkpID9cbiAgICAgICAgICAgIG91dHB1dChudW1iZXIsIHdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpIDpcbiAgICAgICAgICAgIG91dHB1dC5yZXBsYWNlKC8lZC9pLCBudW1iZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhc3RGdXR1cmUgKGRpZmYsIG91dHB1dCkge1xuICAgICAgICB2YXIgZm9ybWF0ID0gdGhpcy5fcmVsYXRpdmVUaW1lW2RpZmYgPiAwID8gJ2Z1dHVyZScgOiAncGFzdCddO1xuICAgICAgICByZXR1cm4gaXNGdW5jdGlvbihmb3JtYXQpID8gZm9ybWF0KG91dHB1dCkgOiBmb3JtYXQucmVwbGFjZSgvJXMvaSwgb3V0cHV0KTtcbiAgICB9XG5cbiAgICB2YXIgYWxpYXNlcyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gYWRkVW5pdEFsaWFzICh1bml0LCBzaG9ydGhhbmQpIHtcbiAgICAgICAgdmFyIGxvd2VyQ2FzZSA9IHVuaXQudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgYWxpYXNlc1tsb3dlckNhc2VdID0gYWxpYXNlc1tsb3dlckNhc2UgKyAncyddID0gYWxpYXNlc1tzaG9ydGhhbmRdID0gdW5pdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3JtYWxpemVVbml0cyh1bml0cykge1xuICAgICAgICByZXR1cm4gdHlwZW9mIHVuaXRzID09PSAnc3RyaW5nJyA/IGFsaWFzZXNbdW5pdHNdIHx8IGFsaWFzZXNbdW5pdHMudG9Mb3dlckNhc2UoKV0gOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplT2JqZWN0VW5pdHMoaW5wdXRPYmplY3QpIHtcbiAgICAgICAgdmFyIG5vcm1hbGl6ZWRJbnB1dCA9IHt9LFxuICAgICAgICAgICAgbm9ybWFsaXplZFByb3AsXG4gICAgICAgICAgICBwcm9wO1xuXG4gICAgICAgIGZvciAocHJvcCBpbiBpbnB1dE9iamVjdCkge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3AoaW5wdXRPYmplY3QsIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgbm9ybWFsaXplZFByb3AgPSBub3JtYWxpemVVbml0cyhwcm9wKTtcbiAgICAgICAgICAgICAgICBpZiAobm9ybWFsaXplZFByb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsaXplZElucHV0W25vcm1hbGl6ZWRQcm9wXSA9IGlucHV0T2JqZWN0W3Byb3BdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub3JtYWxpemVkSW5wdXQ7XG4gICAgfVxuXG4gICAgdmFyIHByaW9yaXRpZXMgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGFkZFVuaXRQcmlvcml0eSh1bml0LCBwcmlvcml0eSkge1xuICAgICAgICBwcmlvcml0aWVzW3VuaXRdID0gcHJpb3JpdHk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UHJpb3JpdGl6ZWRVbml0cyh1bml0c09iaikge1xuICAgICAgICB2YXIgdW5pdHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgdSBpbiB1bml0c09iaikge1xuICAgICAgICAgICAgdW5pdHMucHVzaCh7dW5pdDogdSwgcHJpb3JpdHk6IHByaW9yaXRpZXNbdV19KTtcbiAgICAgICAgfVxuICAgICAgICB1bml0cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYS5wcmlvcml0eSAtIGIucHJpb3JpdHk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdW5pdHM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gemVyb0ZpbGwobnVtYmVyLCB0YXJnZXRMZW5ndGgsIGZvcmNlU2lnbikge1xuICAgICAgICB2YXIgYWJzTnVtYmVyID0gJycgKyBNYXRoLmFicyhudW1iZXIpLFxuICAgICAgICAgICAgemVyb3NUb0ZpbGwgPSB0YXJnZXRMZW5ndGggLSBhYnNOdW1iZXIubGVuZ3RoLFxuICAgICAgICAgICAgc2lnbiA9IG51bWJlciA+PSAwO1xuICAgICAgICByZXR1cm4gKHNpZ24gPyAoZm9yY2VTaWduID8gJysnIDogJycpIDogJy0nKSArXG4gICAgICAgICAgICBNYXRoLnBvdygxMCwgTWF0aC5tYXgoMCwgemVyb3NUb0ZpbGwpKS50b1N0cmluZygpLnN1YnN0cigxKSArIGFic051bWJlcjtcbiAgICB9XG5cbiAgICB2YXIgZm9ybWF0dGluZ1Rva2VucyA9IC8oXFxbW15cXFtdKlxcXSl8KFxcXFwpPyhbSGhdbW0oc3MpP3xNb3xNTT9NP00/fERvfERERG98REQ/RD9EP3xkZGQ/ZD98ZG8/fHdbb3x3XT98V1tvfFddP3xRbz98WVlZWVlZfFlZWVlZfFlZWVl8WVl8Z2coZ2dnPyk/fEdHKEdHRz8pP3xlfEV8YXxBfGhoP3xISD98a2s/fG1tP3xzcz98U3sxLDl9fHh8WHx6ej98Wlo/fC4pL2c7XG5cbiAgICB2YXIgbG9jYWxGb3JtYXR0aW5nVG9rZW5zID0gLyhcXFtbXlxcW10qXFxdKXwoXFxcXCk/KExUU3xMVHxMTD9MP0w/fGx7MSw0fSkvZztcblxuICAgIHZhciBmb3JtYXRGdW5jdGlvbnMgPSB7fTtcblxuICAgIHZhciBmb3JtYXRUb2tlbkZ1bmN0aW9ucyA9IHt9O1xuXG4gICAgLy8gdG9rZW46ICAgICdNJ1xuICAgIC8vIHBhZGRlZDogICBbJ01NJywgMl1cbiAgICAvLyBvcmRpbmFsOiAgJ01vJ1xuICAgIC8vIGNhbGxiYWNrOiBmdW5jdGlvbiAoKSB7IHRoaXMubW9udGgoKSArIDEgfVxuICAgIGZ1bmN0aW9uIGFkZEZvcm1hdFRva2VuICh0b2tlbiwgcGFkZGVkLCBvcmRpbmFsLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgZnVuYyA9IGNhbGxiYWNrO1xuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1tjYWxsYmFja10oKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9uc1t0b2tlbl0gPSBmdW5jO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYWRkZWQpIHtcbiAgICAgICAgICAgIGZvcm1hdFRva2VuRnVuY3Rpb25zW3BhZGRlZFswXV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHplcm9GaWxsKGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSwgcGFkZGVkWzFdLCBwYWRkZWRbMl0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3JkaW5hbCkge1xuICAgICAgICAgICAgZm9ybWF0VG9rZW5GdW5jdGlvbnNbb3JkaW5hbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm9yZGluYWwoZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCB0b2tlbik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlRm9ybWF0dGluZ1Rva2VucyhpbnB1dCkge1xuICAgICAgICBpZiAoaW5wdXQubWF0Y2goL1xcW1tcXHNcXFNdLykpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC9eXFxbfFxcXSQvZywgJycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC9cXFxcL2csICcnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlRm9ybWF0RnVuY3Rpb24oZm9ybWF0KSB7XG4gICAgICAgIHZhciBhcnJheSA9IGZvcm1hdC5tYXRjaChmb3JtYXR0aW5nVG9rZW5zKSwgaSwgbGVuZ3RoO1xuXG4gICAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZm9ybWF0VG9rZW5GdW5jdGlvbnNbYXJyYXlbaV1dKSB7XG4gICAgICAgICAgICAgICAgYXJyYXlbaV0gPSBmb3JtYXRUb2tlbkZ1bmN0aW9uc1thcnJheVtpXV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFycmF5W2ldID0gcmVtb3ZlRm9ybWF0dGluZ1Rva2VucyhhcnJheVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1vbSkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9ICcnLCBpO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9IGlzRnVuY3Rpb24oYXJyYXlbaV0pID8gYXJyYXlbaV0uY2FsbChtb20sIGZvcm1hdCkgOiBhcnJheVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gZm9ybWF0IGRhdGUgdXNpbmcgbmF0aXZlIGRhdGUgb2JqZWN0XG4gICAgZnVuY3Rpb24gZm9ybWF0TW9tZW50KG0sIGZvcm1hdCkge1xuICAgICAgICBpZiAoIW0uaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbS5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcm1hdCA9IGV4cGFuZEZvcm1hdChmb3JtYXQsIG0ubG9jYWxlRGF0YSgpKTtcbiAgICAgICAgZm9ybWF0RnVuY3Rpb25zW2Zvcm1hdF0gPSBmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XSB8fCBtYWtlRm9ybWF0RnVuY3Rpb24oZm9ybWF0KTtcblxuICAgICAgICByZXR1cm4gZm9ybWF0RnVuY3Rpb25zW2Zvcm1hdF0obSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXhwYW5kRm9ybWF0KGZvcm1hdCwgbG9jYWxlKSB7XG4gICAgICAgIHZhciBpID0gNTtcblxuICAgICAgICBmdW5jdGlvbiByZXBsYWNlTG9uZ0RhdGVGb3JtYXRUb2tlbnMoaW5wdXQpIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbGUubG9uZ0RhdGVGb3JtYXQoaW5wdXQpIHx8IGlucHV0O1xuICAgICAgICB9XG5cbiAgICAgICAgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLmxhc3RJbmRleCA9IDA7XG4gICAgICAgIHdoaWxlIChpID49IDAgJiYgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLnRlc3QoZm9ybWF0KSkge1xuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UobG9jYWxGb3JtYXR0aW5nVG9rZW5zLCByZXBsYWNlTG9uZ0RhdGVGb3JtYXRUb2tlbnMpO1xuICAgICAgICAgICAgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICBpIC09IDE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZm9ybWF0O1xuICAgIH1cblxuICAgIHZhciBtYXRjaDEgICAgICAgICA9IC9cXGQvOyAgICAgICAgICAgIC8vICAgICAgIDAgLSA5XG4gICAgdmFyIG1hdGNoMiAgICAgICAgID0gL1xcZFxcZC87ICAgICAgICAgIC8vICAgICAgMDAgLSA5OVxuICAgIHZhciBtYXRjaDMgICAgICAgICA9IC9cXGR7M30vOyAgICAgICAgIC8vICAgICAwMDAgLSA5OTlcbiAgICB2YXIgbWF0Y2g0ICAgICAgICAgPSAvXFxkezR9LzsgICAgICAgICAvLyAgICAwMDAwIC0gOTk5OVxuICAgIHZhciBtYXRjaDYgICAgICAgICA9IC9bKy1dP1xcZHs2fS87ICAgIC8vIC05OTk5OTkgLSA5OTk5OTlcbiAgICB2YXIgbWF0Y2gxdG8yICAgICAgPSAvXFxkXFxkPy87ICAgICAgICAgLy8gICAgICAgMCAtIDk5XG4gICAgdmFyIG1hdGNoM3RvNCAgICAgID0gL1xcZFxcZFxcZFxcZD8vOyAgICAgLy8gICAgIDk5OSAtIDk5OTlcbiAgICB2YXIgbWF0Y2g1dG82ICAgICAgPSAvXFxkXFxkXFxkXFxkXFxkXFxkPy87IC8vICAgOTk5OTkgLSA5OTk5OTlcbiAgICB2YXIgbWF0Y2gxdG8zICAgICAgPSAvXFxkezEsM30vOyAgICAgICAvLyAgICAgICAwIC0gOTk5XG4gICAgdmFyIG1hdGNoMXRvNCAgICAgID0gL1xcZHsxLDR9LzsgICAgICAgLy8gICAgICAgMCAtIDk5OTlcbiAgICB2YXIgbWF0Y2gxdG82ICAgICAgPSAvWystXT9cXGR7MSw2fS87ICAvLyAtOTk5OTk5IC0gOTk5OTk5XG5cbiAgICB2YXIgbWF0Y2hVbnNpZ25lZCAgPSAvXFxkKy87ICAgICAgICAgICAvLyAgICAgICAwIC0gaW5mXG4gICAgdmFyIG1hdGNoU2lnbmVkICAgID0gL1srLV0/XFxkKy87ICAgICAgLy8gICAgLWluZiAtIGluZlxuXG4gICAgdmFyIG1hdGNoT2Zmc2V0ICAgID0gL1p8WystXVxcZFxcZDo/XFxkXFxkL2dpOyAvLyArMDA6MDAgLTAwOjAwICswMDAwIC0wMDAwIG9yIFpcbiAgICB2YXIgbWF0Y2hTaG9ydE9mZnNldCA9IC9afFsrLV1cXGRcXGQoPzo6P1xcZFxcZCk/L2dpOyAvLyArMDAgLTAwICswMDowMCAtMDA6MDAgKzAwMDAgLTAwMDAgb3IgWlxuXG4gICAgdmFyIG1hdGNoVGltZXN0YW1wID0gL1srLV0/XFxkKyhcXC5cXGR7MSwzfSk/LzsgLy8gMTIzNDU2Nzg5IDEyMzQ1Njc4OS4xMjNcblxuICAgIC8vIGFueSB3b3JkIChvciB0d28pIGNoYXJhY3RlcnMgb3IgbnVtYmVycyBpbmNsdWRpbmcgdHdvL3RocmVlIHdvcmQgbW9udGggaW4gYXJhYmljLlxuICAgIC8vIGluY2x1ZGVzIHNjb3R0aXNoIGdhZWxpYyB0d28gd29yZCBhbmQgaHlwaGVuYXRlZCBtb250aHNcbiAgICB2YXIgbWF0Y2hXb3JkID0gL1swLTldezAsMjU2fVsnYS16XFx1MDBBMC1cXHUwNUZGXFx1MDcwMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRjA3XFx1RkYxMC1cXHVGRkVGXXsxLDI1Nn18W1xcdTA2MDAtXFx1MDZGRlxcL117MSwyNTZ9KFxccyo/W1xcdTA2MDAtXFx1MDZGRl17MSwyNTZ9KXsxLDJ9L2k7XG5cbiAgICB2YXIgcmVnZXhlcyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gYWRkUmVnZXhUb2tlbiAodG9rZW4sIHJlZ2V4LCBzdHJpY3RSZWdleCkge1xuICAgICAgICByZWdleGVzW3Rva2VuXSA9IGlzRnVuY3Rpb24ocmVnZXgpID8gcmVnZXggOiBmdW5jdGlvbiAoaXNTdHJpY3QsIGxvY2FsZURhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiAoaXNTdHJpY3QgJiYgc3RyaWN0UmVnZXgpID8gc3RyaWN0UmVnZXggOiByZWdleDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQYXJzZVJlZ2V4Rm9yVG9rZW4gKHRva2VuLCBjb25maWcpIHtcbiAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHJlZ2V4ZXMsIHRva2VuKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAodW5lc2NhcGVGb3JtYXQodG9rZW4pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZWdleGVzW3Rva2VuXShjb25maWcuX3N0cmljdCwgY29uZmlnLl9sb2NhbGUpO1xuICAgIH1cblxuICAgIC8vIENvZGUgZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM1NjE0OTMvaXMtdGhlcmUtYS1yZWdleHAtZXNjYXBlLWZ1bmN0aW9uLWluLWphdmFzY3JpcHRcbiAgICBmdW5jdGlvbiB1bmVzY2FwZUZvcm1hdChzKSB7XG4gICAgICAgIHJldHVybiByZWdleEVzY2FwZShzLnJlcGxhY2UoJ1xcXFwnLCAnJykucmVwbGFjZSgvXFxcXChcXFspfFxcXFwoXFxdKXxcXFsoW15cXF1cXFtdKilcXF18XFxcXCguKS9nLCBmdW5jdGlvbiAobWF0Y2hlZCwgcDEsIHAyLCBwMywgcDQpIHtcbiAgICAgICAgICAgIHJldHVybiBwMSB8fCBwMiB8fCBwMyB8fCBwNDtcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlZ2V4RXNjYXBlKHMpIHtcbiAgICAgICAgcmV0dXJuIHMucmVwbGFjZSgvWy1cXC9cXFxcXiQqKz8uKCl8W1xcXXt9XS9nLCAnXFxcXCQmJyk7XG4gICAgfVxuXG4gICAgdmFyIHRva2VucyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gYWRkUGFyc2VUb2tlbiAodG9rZW4sIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBpLCBmdW5jID0gY2FsbGJhY2s7XG4gICAgICAgIGlmICh0eXBlb2YgdG9rZW4gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0b2tlbiA9IFt0b2tlbl07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTnVtYmVyKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgZnVuYyA9IGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgICAgICAgICBhcnJheVtjYWxsYmFja10gPSB0b0ludChpbnB1dCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0b2tlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdG9rZW5zW3Rva2VuW2ldXSA9IGZ1bmM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRXZWVrUGFyc2VUb2tlbiAodG9rZW4sIGNhbGxiYWNrKSB7XG4gICAgICAgIGFkZFBhcnNlVG9rZW4odG9rZW4sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgICAgIGNvbmZpZy5fdyA9IGNvbmZpZy5fdyB8fCB7fTtcbiAgICAgICAgICAgIGNhbGxiYWNrKGlucHV0LCBjb25maWcuX3csIGNvbmZpZywgdG9rZW4pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRUaW1lVG9BcnJheUZyb21Ub2tlbih0b2tlbiwgaW5wdXQsIGNvbmZpZykge1xuICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCAmJiBoYXNPd25Qcm9wKHRva2VucywgdG9rZW4pKSB7XG4gICAgICAgICAgICB0b2tlbnNbdG9rZW5dKGlucHV0LCBjb25maWcuX2EsIGNvbmZpZywgdG9rZW4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIFlFQVIgPSAwO1xuICAgIHZhciBNT05USCA9IDE7XG4gICAgdmFyIERBVEUgPSAyO1xuICAgIHZhciBIT1VSID0gMztcbiAgICB2YXIgTUlOVVRFID0gNDtcbiAgICB2YXIgU0VDT05EID0gNTtcbiAgICB2YXIgTUlMTElTRUNPTkQgPSA2O1xuICAgIHZhciBXRUVLID0gNztcbiAgICB2YXIgV0VFS0RBWSA9IDg7XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBhZGRGb3JtYXRUb2tlbignWScsIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHkgPSB0aGlzLnllYXIoKTtcbiAgICAgICAgcmV0dXJuIHkgPD0gOTk5OSA/ICcnICsgeSA6ICcrJyArIHk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1lZJywgMl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueWVhcigpICUgMTAwO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydZWVlZJywgICA0XSwgICAgICAgMCwgJ3llYXInKTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1lZWVlZJywgIDVdLCAgICAgICAwLCAneWVhcicpO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnWVlZWVlZJywgNiwgdHJ1ZV0sIDAsICd5ZWFyJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3llYXInLCAneScpO1xuXG4gICAgLy8gUFJJT1JJVElFU1xuXG4gICAgYWRkVW5pdFByaW9yaXR5KCd5ZWFyJywgMSk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdZJywgICAgICBtYXRjaFNpZ25lZCk7XG4gICAgYWRkUmVnZXhUb2tlbignWVknLCAgICAgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1lZWVknLCAgIG1hdGNoMXRvNCwgbWF0Y2g0KTtcbiAgICBhZGRSZWdleFRva2VuKCdZWVlZWScsICBtYXRjaDF0bzYsIG1hdGNoNik7XG4gICAgYWRkUmVnZXhUb2tlbignWVlZWVlZJywgbWF0Y2gxdG82LCBtYXRjaDYpO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ1lZWVlZJywgJ1lZWVlZWSddLCBZRUFSKTtcbiAgICBhZGRQYXJzZVRva2VuKCdZWVlZJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtZRUFSXSA9IGlucHV0Lmxlbmd0aCA9PT0gMiA/IGhvb2tzLnBhcnNlVHdvRGlnaXRZZWFyKGlucHV0KSA6IHRvSW50KGlucHV0KTtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKCdZWScsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbWUVBUl0gPSBob29rcy5wYXJzZVR3b0RpZ2l0WWVhcihpbnB1dCk7XG4gICAgfSk7XG4gICAgYWRkUGFyc2VUb2tlbignWScsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbWUVBUl0gPSBwYXJzZUludChpbnB1dCwgMTApO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgZnVuY3Rpb24gZGF5c0luWWVhcih5ZWFyKSB7XG4gICAgICAgIHJldHVybiBpc0xlYXBZZWFyKHllYXIpID8gMzY2IDogMzY1O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTGVhcFllYXIoeWVhcikge1xuICAgICAgICByZXR1cm4gKHllYXIgJSA0ID09PSAwICYmIHllYXIgJSAxMDAgIT09IDApIHx8IHllYXIgJSA0MDAgPT09IDA7XG4gICAgfVxuXG4gICAgLy8gSE9PS1NcblxuICAgIGhvb2tzLnBhcnNlVHdvRGlnaXRZZWFyID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgIHJldHVybiB0b0ludChpbnB1dCkgKyAodG9JbnQoaW5wdXQpID4gNjggPyAxOTAwIDogMjAwMCk7XG4gICAgfTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIHZhciBnZXRTZXRZZWFyID0gbWFrZUdldFNldCgnRnVsbFllYXInLCB0cnVlKTtcblxuICAgIGZ1bmN0aW9uIGdldElzTGVhcFllYXIgKCkge1xuICAgICAgICByZXR1cm4gaXNMZWFwWWVhcih0aGlzLnllYXIoKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUdldFNldCAodW5pdCwga2VlcFRpbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBzZXQkMSh0aGlzLCB1bml0LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgaG9va3MudXBkYXRlT2Zmc2V0KHRoaXMsIGtlZXBUaW1lKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldCh0aGlzLCB1bml0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXQgKG1vbSwgdW5pdCkge1xuICAgICAgICByZXR1cm4gbW9tLmlzVmFsaWQoKSA/XG4gICAgICAgICAgICBtb20uX2RbJ2dldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgdW5pdF0oKSA6IE5hTjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXQkMSAobW9tLCB1bml0LCB2YWx1ZSkge1xuICAgICAgICBpZiAobW9tLmlzVmFsaWQoKSAmJiAhaXNOYU4odmFsdWUpKSB7XG4gICAgICAgICAgICBpZiAodW5pdCA9PT0gJ0Z1bGxZZWFyJyAmJiBpc0xlYXBZZWFyKG1vbS55ZWFyKCkpICYmIG1vbS5tb250aCgpID09PSAxICYmIG1vbS5kYXRlKCkgPT09IDI5KSB7XG4gICAgICAgICAgICAgICAgbW9tLl9kWydzZXQnICsgKG1vbS5faXNVVEMgPyAnVVRDJyA6ICcnKSArIHVuaXRdKHZhbHVlLCBtb20ubW9udGgoKSwgZGF5c0luTW9udGgodmFsdWUsIG1vbS5tb250aCgpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBtb20uX2RbJ3NldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgdW5pdF0odmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gc3RyaW5nR2V0ICh1bml0cykge1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgaWYgKGlzRnVuY3Rpb24odGhpc1t1bml0c10pKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1t1bml0c10oKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIHN0cmluZ1NldCAodW5pdHMsIHZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdW5pdHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZU9iamVjdFVuaXRzKHVuaXRzKTtcbiAgICAgICAgICAgIHZhciBwcmlvcml0aXplZCA9IGdldFByaW9yaXRpemVkVW5pdHModW5pdHMpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmlvcml0aXplZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXNbcHJpb3JpdGl6ZWRbaV0udW5pdF0odW5pdHNbcHJpb3JpdGl6ZWRbaV0udW5pdF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgICAgICBpZiAoaXNGdW5jdGlvbih0aGlzW3VuaXRzXSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1t1bml0c10odmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vZChuLCB4KSB7XG4gICAgICAgIHJldHVybiAoKG4gJSB4KSArIHgpICUgeDtcbiAgICB9XG5cbiAgICB2YXIgaW5kZXhPZjtcblxuICAgIGlmIChBcnJheS5wcm90b3R5cGUuaW5kZXhPZikge1xuICAgICAgICBpbmRleE9mID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2Y7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaW5kZXhPZiA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICAgICAgICAvLyBJIGtub3dcbiAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpc1tpXSA9PT0gbykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGF5c0luTW9udGgoeWVhciwgbW9udGgpIHtcbiAgICAgICAgaWYgKGlzTmFOKHllYXIpIHx8IGlzTmFOKG1vbnRoKSkge1xuICAgICAgICAgICAgcmV0dXJuIE5hTjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbW9kTW9udGggPSBtb2QobW9udGgsIDEyKTtcbiAgICAgICAgeWVhciArPSAobW9udGggLSBtb2RNb250aCkgLyAxMjtcbiAgICAgICAgcmV0dXJuIG1vZE1vbnRoID09PSAxID8gKGlzTGVhcFllYXIoeWVhcikgPyAyOSA6IDI4KSA6ICgzMSAtIG1vZE1vbnRoICUgNyAlIDIpO1xuICAgIH1cblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKCdNJywgWydNTScsIDJdLCAnTW8nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vbnRoKCkgKyAxO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ01NTScsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm1vbnRoc1Nob3J0KHRoaXMsIGZvcm1hdCk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignTU1NTScsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm1vbnRocyh0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdtb250aCcsICdNJyk7XG5cbiAgICAvLyBQUklPUklUWVxuXG4gICAgYWRkVW5pdFByaW9yaXR5KCdtb250aCcsIDgpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignTScsICAgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignTU0nLCAgIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdNTU0nLCAgZnVuY3Rpb24gKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS5tb250aHNTaG9ydFJlZ2V4KGlzU3RyaWN0KTtcbiAgICB9KTtcbiAgICBhZGRSZWdleFRva2VuKCdNTU1NJywgZnVuY3Rpb24gKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS5tb250aHNSZWdleChpc1N0cmljdCk7XG4gICAgfSk7XG5cbiAgICBhZGRQYXJzZVRva2VuKFsnTScsICdNTSddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W01PTlRIXSA9IHRvSW50KGlucHV0KSAtIDE7XG4gICAgfSk7XG5cbiAgICBhZGRQYXJzZVRva2VuKFsnTU1NJywgJ01NTU0nXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnLCB0b2tlbikge1xuICAgICAgICB2YXIgbW9udGggPSBjb25maWcuX2xvY2FsZS5tb250aHNQYXJzZShpbnB1dCwgdG9rZW4sIGNvbmZpZy5fc3RyaWN0KTtcbiAgICAgICAgLy8gaWYgd2UgZGlkbid0IGZpbmQgYSBtb250aCBuYW1lLCBtYXJrIHRoZSBkYXRlIGFzIGludmFsaWQuXG4gICAgICAgIGlmIChtb250aCAhPSBudWxsKSB7XG4gICAgICAgICAgICBhcnJheVtNT05USF0gPSBtb250aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmludmFsaWRNb250aCA9IGlucHV0O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBMT0NBTEVTXG5cbiAgICB2YXIgTU9OVEhTX0lOX0ZPUk1BVCA9IC9EW29EXT8oXFxbW15cXFtcXF1dKlxcXXxcXHMpK01NTU0/LztcbiAgICB2YXIgZGVmYXVsdExvY2FsZU1vbnRocyA9ICdKYW51YXJ5X0ZlYnJ1YXJ5X01hcmNoX0FwcmlsX01heV9KdW5lX0p1bHlfQXVndXN0X1NlcHRlbWJlcl9PY3RvYmVyX05vdmVtYmVyX0RlY2VtYmVyJy5zcGxpdCgnXycpO1xuICAgIGZ1bmN0aW9uIGxvY2FsZU1vbnRocyAobSwgZm9ybWF0KSB7XG4gICAgICAgIGlmICghbSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzQXJyYXkodGhpcy5fbW9udGhzKSA/IHRoaXMuX21vbnRocyA6XG4gICAgICAgICAgICAgICAgdGhpcy5fbW9udGhzWydzdGFuZGFsb25lJ107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzQXJyYXkodGhpcy5fbW9udGhzKSA/IHRoaXMuX21vbnRoc1ttLm1vbnRoKCldIDpcbiAgICAgICAgICAgIHRoaXMuX21vbnRoc1sodGhpcy5fbW9udGhzLmlzRm9ybWF0IHx8IE1PTlRIU19JTl9GT1JNQVQpLnRlc3QoZm9ybWF0KSA/ICdmb3JtYXQnIDogJ3N0YW5kYWxvbmUnXVttLm1vbnRoKCldO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9jYWxlTW9udGhzU2hvcnQgPSAnSmFuX0ZlYl9NYXJfQXByX01heV9KdW5fSnVsX0F1Z19TZXBfT2N0X05vdl9EZWMnLnNwbGl0KCdfJyk7XG4gICAgZnVuY3Rpb24gbG9jYWxlTW9udGhzU2hvcnQgKG0sIGZvcm1hdCkge1xuICAgICAgICBpZiAoIW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpc0FycmF5KHRoaXMuX21vbnRoc1Nob3J0KSA/IHRoaXMuX21vbnRoc1Nob3J0IDpcbiAgICAgICAgICAgICAgICB0aGlzLl9tb250aHNTaG9ydFsnc3RhbmRhbG9uZSddO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc0FycmF5KHRoaXMuX21vbnRoc1Nob3J0KSA/IHRoaXMuX21vbnRoc1Nob3J0W20ubW9udGgoKV0gOlxuICAgICAgICAgICAgdGhpcy5fbW9udGhzU2hvcnRbTU9OVEhTX0lOX0ZPUk1BVC50ZXN0KGZvcm1hdCkgPyAnZm9ybWF0JyA6ICdzdGFuZGFsb25lJ11bbS5tb250aCgpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVTdHJpY3RQYXJzZShtb250aE5hbWUsIGZvcm1hdCwgc3RyaWN0KSB7XG4gICAgICAgIHZhciBpLCBpaSwgbW9tLCBsbGMgPSBtb250aE5hbWUudG9Mb2NhbGVMb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKCF0aGlzLl9tb250aHNQYXJzZSkge1xuICAgICAgICAgICAgLy8gdGhpcyBpcyBub3QgdXNlZFxuICAgICAgICAgICAgdGhpcy5fbW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX2xvbmdNb250aHNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fc2hvcnRNb250aHNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IDEyOyArK2kpIHtcbiAgICAgICAgICAgICAgICBtb20gPSBjcmVhdGVVVEMoWzIwMDAsIGldKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zaG9ydE1vbnRoc1BhcnNlW2ldID0gdGhpcy5tb250aHNTaG9ydChtb20sICcnKS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvbmdNb250aHNQYXJzZVtpXSA9IHRoaXMubW9udGhzKG1vbSwgJycpLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAgICAgICBpZiAoZm9ybWF0ID09PSAnTU1NJykge1xuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3Nob3J0TW9udGhzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fbG9uZ01vbnRoc1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZm9ybWF0ID09PSAnTU1NJykge1xuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3Nob3J0TW9udGhzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgaWYgKGlpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaWk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX2xvbmdNb250aHNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9sb25nTW9udGhzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgaWYgKGlpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaWk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3Nob3J0TW9udGhzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZU1vbnRoc1BhcnNlIChtb250aE5hbWUsIGZvcm1hdCwgc3RyaWN0KSB7XG4gICAgICAgIHZhciBpLCBtb20sIHJlZ2V4O1xuXG4gICAgICAgIGlmICh0aGlzLl9tb250aHNQYXJzZUV4YWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlU3RyaWN0UGFyc2UuY2FsbCh0aGlzLCBtb250aE5hbWUsIGZvcm1hdCwgc3RyaWN0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5fbW9udGhzUGFyc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX21vbnRoc1BhcnNlID0gW107XG4gICAgICAgICAgICB0aGlzLl9sb25nTW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX3Nob3J0TW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE86IGFkZCBzb3J0aW5nXG4gICAgICAgIC8vIFNvcnRpbmcgbWFrZXMgc3VyZSBpZiBvbmUgbW9udGggKG9yIGFiYnIpIGlzIGEgcHJlZml4IG9mIGFub3RoZXJcbiAgICAgICAgLy8gc2VlIHNvcnRpbmcgaW4gY29tcHV0ZU1vbnRoc1BhcnNlXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG4gICAgICAgICAgICAvLyBtYWtlIHRoZSByZWdleCBpZiB3ZSBkb24ndCBoYXZlIGl0IGFscmVhZHlcbiAgICAgICAgICAgIG1vbSA9IGNyZWF0ZVVUQyhbMjAwMCwgaV0pO1xuICAgICAgICAgICAgaWYgKHN0cmljdCAmJiAhdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cCgnXicgKyB0aGlzLm1vbnRocyhtb20sICcnKS5yZXBsYWNlKCcuJywgJycpICsgJyQnLCAnaScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Nob3J0TW9udGhzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKCdeJyArIHRoaXMubW9udGhzU2hvcnQobW9tLCAnJykucmVwbGFjZSgnLicsICcnKSArICckJywgJ2knKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghc3RyaWN0ICYmICF0aGlzLl9tb250aHNQYXJzZVtpXSkge1xuICAgICAgICAgICAgICAgIHJlZ2V4ID0gJ14nICsgdGhpcy5tb250aHMobW9tLCAnJykgKyAnfF4nICsgdGhpcy5tb250aHNTaG9ydChtb20sICcnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb250aHNQYXJzZVtpXSA9IG5ldyBSZWdFeHAocmVnZXgucmVwbGFjZSgnLicsICcnKSwgJ2knKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRlc3QgdGhlIHJlZ2V4XG4gICAgICAgICAgICBpZiAoc3RyaWN0ICYmIGZvcm1hdCA9PT0gJ01NTU0nICYmIHRoaXMuX2xvbmdNb250aHNQYXJzZVtpXS50ZXN0KG1vbnRoTmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RyaWN0ICYmIGZvcm1hdCA9PT0gJ01NTScgJiYgdGhpcy5fc2hvcnRNb250aHNQYXJzZVtpXS50ZXN0KG1vbnRoTmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXN0cmljdCAmJiB0aGlzLl9tb250aHNQYXJzZVtpXS50ZXN0KG1vbnRoTmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIHNldE1vbnRoIChtb20sIHZhbHVlKSB7XG4gICAgICAgIHZhciBkYXlPZk1vbnRoO1xuXG4gICAgICAgIGlmICghbW9tLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgLy8gTm8gb3BcbiAgICAgICAgICAgIHJldHVybiBtb207XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaWYgKC9eXFxkKyQvLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0b0ludCh2YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gbW9tLmxvY2FsZURhdGEoKS5tb250aHNQYXJzZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgLy8gVE9ETzogQW5vdGhlciBzaWxlbnQgZmFpbHVyZT9cbiAgICAgICAgICAgICAgICBpZiAoIWlzTnVtYmVyKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbW9tO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGRheU9mTW9udGggPSBNYXRoLm1pbihtb20uZGF0ZSgpLCBkYXlzSW5Nb250aChtb20ueWVhcigpLCB2YWx1ZSkpO1xuICAgICAgICBtb20uX2RbJ3NldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgJ01vbnRoJ10odmFsdWUsIGRheU9mTW9udGgpO1xuICAgICAgICByZXR1cm4gbW9tO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldE1vbnRoICh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgc2V0TW9udGgodGhpcywgdmFsdWUpO1xuICAgICAgICAgICAgaG9va3MudXBkYXRlT2Zmc2V0KHRoaXMsIHRydWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0KHRoaXMsICdNb250aCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RGF5c0luTW9udGggKCkge1xuICAgICAgICByZXR1cm4gZGF5c0luTW9udGgodGhpcy55ZWFyKCksIHRoaXMubW9udGgoKSk7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRNb250aHNTaG9ydFJlZ2V4ID0gbWF0Y2hXb3JkO1xuICAgIGZ1bmN0aW9uIG1vbnRoc1Nob3J0UmVnZXggKGlzU3RyaWN0KSB7XG4gICAgICAgIGlmICh0aGlzLl9tb250aHNQYXJzZUV4YWN0KSB7XG4gICAgICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ19tb250aHNSZWdleCcpKSB7XG4gICAgICAgICAgICAgICAgY29tcHV0ZU1vbnRoc1BhcnNlLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNTdHJpY3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzU2hvcnRTdHJpY3RSZWdleDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21vbnRoc1Nob3J0UmVnZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ19tb250aHNTaG9ydFJlZ2V4JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb250aHNTaG9ydFJlZ2V4ID0gZGVmYXVsdE1vbnRoc1Nob3J0UmVnZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzU2hvcnRTdHJpY3RSZWdleCAmJiBpc1N0cmljdCA/XG4gICAgICAgICAgICAgICAgdGhpcy5fbW9udGhzU2hvcnRTdHJpY3RSZWdleCA6IHRoaXMuX21vbnRoc1Nob3J0UmVnZXg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdE1vbnRoc1JlZ2V4ID0gbWF0Y2hXb3JkO1xuICAgIGZ1bmN0aW9uIG1vbnRoc1JlZ2V4IChpc1N0cmljdCkge1xuICAgICAgICBpZiAodGhpcy5fbW9udGhzUGFyc2VFeGFjdCkge1xuICAgICAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfbW9udGhzUmVnZXgnKSkge1xuICAgICAgICAgICAgICAgIGNvbXB1dGVNb250aHNQYXJzZS5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzU3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21vbnRoc1N0cmljdFJlZ2V4O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzUmVnZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ19tb250aHNSZWdleCcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbW9udGhzUmVnZXggPSBkZWZhdWx0TW9udGhzUmVnZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzU3RyaWN0UmVnZXggJiYgaXNTdHJpY3QgP1xuICAgICAgICAgICAgICAgIHRoaXMuX21vbnRoc1N0cmljdFJlZ2V4IDogdGhpcy5fbW9udGhzUmVnZXg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21wdXRlTW9udGhzUGFyc2UgKCkge1xuICAgICAgICBmdW5jdGlvbiBjbXBMZW5SZXYoYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGIubGVuZ3RoIC0gYS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2hvcnRQaWVjZXMgPSBbXSwgbG9uZ1BpZWNlcyA9IFtdLCBtaXhlZFBpZWNlcyA9IFtdLFxuICAgICAgICAgICAgaSwgbW9tO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTI7IGkrKykge1xuICAgICAgICAgICAgLy8gbWFrZSB0aGUgcmVnZXggaWYgd2UgZG9uJ3QgaGF2ZSBpdCBhbHJlYWR5XG4gICAgICAgICAgICBtb20gPSBjcmVhdGVVVEMoWzIwMDAsIGldKTtcbiAgICAgICAgICAgIHNob3J0UGllY2VzLnB1c2godGhpcy5tb250aHNTaG9ydChtb20sICcnKSk7XG4gICAgICAgICAgICBsb25nUGllY2VzLnB1c2godGhpcy5tb250aHMobW9tLCAnJykpO1xuICAgICAgICAgICAgbWl4ZWRQaWVjZXMucHVzaCh0aGlzLm1vbnRocyhtb20sICcnKSk7XG4gICAgICAgICAgICBtaXhlZFBpZWNlcy5wdXNoKHRoaXMubW9udGhzU2hvcnQobW9tLCAnJykpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNvcnRpbmcgbWFrZXMgc3VyZSBpZiBvbmUgbW9udGggKG9yIGFiYnIpIGlzIGEgcHJlZml4IG9mIGFub3RoZXIgaXRcbiAgICAgICAgLy8gd2lsbCBtYXRjaCB0aGUgbG9uZ2VyIHBpZWNlLlxuICAgICAgICBzaG9ydFBpZWNlcy5zb3J0KGNtcExlblJldik7XG4gICAgICAgIGxvbmdQaWVjZXMuc29ydChjbXBMZW5SZXYpO1xuICAgICAgICBtaXhlZFBpZWNlcy5zb3J0KGNtcExlblJldik7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG4gICAgICAgICAgICBzaG9ydFBpZWNlc1tpXSA9IHJlZ2V4RXNjYXBlKHNob3J0UGllY2VzW2ldKTtcbiAgICAgICAgICAgIGxvbmdQaWVjZXNbaV0gPSByZWdleEVzY2FwZShsb25nUGllY2VzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMjQ7IGkrKykge1xuICAgICAgICAgICAgbWl4ZWRQaWVjZXNbaV0gPSByZWdleEVzY2FwZShtaXhlZFBpZWNlc1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9tb250aHNSZWdleCA9IG5ldyBSZWdFeHAoJ14oJyArIG1peGVkUGllY2VzLmpvaW4oJ3wnKSArICcpJywgJ2knKTtcbiAgICAgICAgdGhpcy5fbW9udGhzU2hvcnRSZWdleCA9IHRoaXMuX21vbnRoc1JlZ2V4O1xuICAgICAgICB0aGlzLl9tb250aHNTdHJpY3RSZWdleCA9IG5ldyBSZWdFeHAoJ14oJyArIGxvbmdQaWVjZXMuam9pbignfCcpICsgJyknLCAnaScpO1xuICAgICAgICB0aGlzLl9tb250aHNTaG9ydFN0cmljdFJlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgc2hvcnRQaWVjZXMuam9pbignfCcpICsgJyknLCAnaScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZURhdGUgKHksIG0sIGQsIGgsIE0sIHMsIG1zKSB7XG4gICAgICAgIC8vIGNhbid0IGp1c3QgYXBwbHkoKSB0byBjcmVhdGUgYSBkYXRlOlxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3EvMTgxMzQ4XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoeSwgbSwgZCwgaCwgTSwgcywgbXMpO1xuXG4gICAgICAgIC8vIHRoZSBkYXRlIGNvbnN0cnVjdG9yIHJlbWFwcyB5ZWFycyAwLTk5IHRvIDE5MDAtMTk5OVxuICAgICAgICBpZiAoeSA8IDEwMCAmJiB5ID49IDAgJiYgaXNGaW5pdGUoZGF0ZS5nZXRGdWxsWWVhcigpKSkge1xuICAgICAgICAgICAgZGF0ZS5zZXRGdWxsWWVhcih5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVVVENEYXRlICh5KSB7XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoRGF0ZS5VVEMuYXBwbHkobnVsbCwgYXJndW1lbnRzKSk7XG5cbiAgICAgICAgLy8gdGhlIERhdGUuVVRDIGZ1bmN0aW9uIHJlbWFwcyB5ZWFycyAwLTk5IHRvIDE5MDAtMTk5OVxuICAgICAgICBpZiAoeSA8IDEwMCAmJiB5ID49IDAgJiYgaXNGaW5pdGUoZGF0ZS5nZXRVVENGdWxsWWVhcigpKSkge1xuICAgICAgICAgICAgZGF0ZS5zZXRVVENGdWxsWWVhcih5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG5cbiAgICAvLyBzdGFydC1vZi1maXJzdC13ZWVrIC0gc3RhcnQtb2YteWVhclxuICAgIGZ1bmN0aW9uIGZpcnN0V2Vla09mZnNldCh5ZWFyLCBkb3csIGRveSkge1xuICAgICAgICB2YXIgLy8gZmlyc3Qtd2VlayBkYXkgLS0gd2hpY2ggamFudWFyeSBpcyBhbHdheXMgaW4gdGhlIGZpcnN0IHdlZWsgKDQgZm9yIGlzbywgMSBmb3Igb3RoZXIpXG4gICAgICAgICAgICBmd2QgPSA3ICsgZG93IC0gZG95LFxuICAgICAgICAgICAgLy8gZmlyc3Qtd2VlayBkYXkgbG9jYWwgd2Vla2RheSAtLSB3aGljaCBsb2NhbCB3ZWVrZGF5IGlzIGZ3ZFxuICAgICAgICAgICAgZndkbHcgPSAoNyArIGNyZWF0ZVVUQ0RhdGUoeWVhciwgMCwgZndkKS5nZXRVVENEYXkoKSAtIGRvdykgJSA3O1xuXG4gICAgICAgIHJldHVybiAtZndkbHcgKyBmd2QgLSAxO1xuICAgIH1cblxuICAgIC8vIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0lTT193ZWVrX2RhdGUjQ2FsY3VsYXRpbmdfYV9kYXRlX2dpdmVuX3RoZV95ZWFyLjJDX3dlZWtfbnVtYmVyX2FuZF93ZWVrZGF5XG4gICAgZnVuY3Rpb24gZGF5T2ZZZWFyRnJvbVdlZWtzKHllYXIsIHdlZWssIHdlZWtkYXksIGRvdywgZG95KSB7XG4gICAgICAgIHZhciBsb2NhbFdlZWtkYXkgPSAoNyArIHdlZWtkYXkgLSBkb3cpICUgNyxcbiAgICAgICAgICAgIHdlZWtPZmZzZXQgPSBmaXJzdFdlZWtPZmZzZXQoeWVhciwgZG93LCBkb3kpLFxuICAgICAgICAgICAgZGF5T2ZZZWFyID0gMSArIDcgKiAod2VlayAtIDEpICsgbG9jYWxXZWVrZGF5ICsgd2Vla09mZnNldCxcbiAgICAgICAgICAgIHJlc1llYXIsIHJlc0RheU9mWWVhcjtcblxuICAgICAgICBpZiAoZGF5T2ZZZWFyIDw9IDApIHtcbiAgICAgICAgICAgIHJlc1llYXIgPSB5ZWFyIC0gMTtcbiAgICAgICAgICAgIHJlc0RheU9mWWVhciA9IGRheXNJblllYXIocmVzWWVhcikgKyBkYXlPZlllYXI7XG4gICAgICAgIH0gZWxzZSBpZiAoZGF5T2ZZZWFyID4gZGF5c0luWWVhcih5ZWFyKSkge1xuICAgICAgICAgICAgcmVzWWVhciA9IHllYXIgKyAxO1xuICAgICAgICAgICAgcmVzRGF5T2ZZZWFyID0gZGF5T2ZZZWFyIC0gZGF5c0luWWVhcih5ZWFyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc1llYXIgPSB5ZWFyO1xuICAgICAgICAgICAgcmVzRGF5T2ZZZWFyID0gZGF5T2ZZZWFyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHllYXI6IHJlc1llYXIsXG4gICAgICAgICAgICBkYXlPZlllYXI6IHJlc0RheU9mWWVhclxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdlZWtPZlllYXIobW9tLCBkb3csIGRveSkge1xuICAgICAgICB2YXIgd2Vla09mZnNldCA9IGZpcnN0V2Vla09mZnNldChtb20ueWVhcigpLCBkb3csIGRveSksXG4gICAgICAgICAgICB3ZWVrID0gTWF0aC5mbG9vcigobW9tLmRheU9mWWVhcigpIC0gd2Vla09mZnNldCAtIDEpIC8gNykgKyAxLFxuICAgICAgICAgICAgcmVzV2VlaywgcmVzWWVhcjtcblxuICAgICAgICBpZiAod2VlayA8IDEpIHtcbiAgICAgICAgICAgIHJlc1llYXIgPSBtb20ueWVhcigpIC0gMTtcbiAgICAgICAgICAgIHJlc1dlZWsgPSB3ZWVrICsgd2Vla3NJblllYXIocmVzWWVhciwgZG93LCBkb3kpO1xuICAgICAgICB9IGVsc2UgaWYgKHdlZWsgPiB3ZWVrc0luWWVhcihtb20ueWVhcigpLCBkb3csIGRveSkpIHtcbiAgICAgICAgICAgIHJlc1dlZWsgPSB3ZWVrIC0gd2Vla3NJblllYXIobW9tLnllYXIoKSwgZG93LCBkb3kpO1xuICAgICAgICAgICAgcmVzWWVhciA9IG1vbS55ZWFyKCkgKyAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzWWVhciA9IG1vbS55ZWFyKCk7XG4gICAgICAgICAgICByZXNXZWVrID0gd2VlaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3ZWVrOiByZXNXZWVrLFxuICAgICAgICAgICAgeWVhcjogcmVzWWVhclxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdlZWtzSW5ZZWFyKHllYXIsIGRvdywgZG95KSB7XG4gICAgICAgIHZhciB3ZWVrT2Zmc2V0ID0gZmlyc3RXZWVrT2Zmc2V0KHllYXIsIGRvdywgZG95KSxcbiAgICAgICAgICAgIHdlZWtPZmZzZXROZXh0ID0gZmlyc3RXZWVrT2Zmc2V0KHllYXIgKyAxLCBkb3csIGRveSk7XG4gICAgICAgIHJldHVybiAoZGF5c0luWWVhcih5ZWFyKSAtIHdlZWtPZmZzZXQgKyB3ZWVrT2Zmc2V0TmV4dCkgLyA3O1xuICAgIH1cblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKCd3JywgWyd3dycsIDJdLCAnd28nLCAnd2VlaycpO1xuICAgIGFkZEZvcm1hdFRva2VuKCdXJywgWydXVycsIDJdLCAnV28nLCAnaXNvV2VlaycpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCd3ZWVrJywgJ3cnKTtcbiAgICBhZGRVbml0QWxpYXMoJ2lzb1dlZWsnLCAnVycpO1xuXG4gICAgLy8gUFJJT1JJVElFU1xuXG4gICAgYWRkVW5pdFByaW9yaXR5KCd3ZWVrJywgNSk7XG4gICAgYWRkVW5pdFByaW9yaXR5KCdpc29XZWVrJywgNSk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCd3JywgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignd3cnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignVycsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1dXJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuXG4gICAgYWRkV2Vla1BhcnNlVG9rZW4oWyd3JywgJ3d3JywgJ1cnLCAnV1cnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIHdlZWtbdG9rZW4uc3Vic3RyKDAsIDEpXSA9IHRvSW50KGlucHV0KTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIC8vIExPQ0FMRVNcblxuICAgIGZ1bmN0aW9uIGxvY2FsZVdlZWsgKG1vbSkge1xuICAgICAgICByZXR1cm4gd2Vla09mWWVhcihtb20sIHRoaXMuX3dlZWsuZG93LCB0aGlzLl93ZWVrLmRveSkud2VlaztcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZVdlZWsgPSB7XG4gICAgICAgIGRvdyA6IDAsIC8vIFN1bmRheSBpcyB0aGUgZmlyc3QgZGF5IG9mIHRoZSB3ZWVrLlxuICAgICAgICBkb3kgOiA2ICAvLyBUaGUgd2VlayB0aGF0IGNvbnRhaW5zIEphbiAxc3QgaXMgdGhlIGZpcnN0IHdlZWsgb2YgdGhlIHllYXIuXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGxvY2FsZUZpcnN0RGF5T2ZXZWVrICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWsuZG93O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZUZpcnN0RGF5T2ZZZWFyICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWsuZG95O1xuICAgIH1cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIGdldFNldFdlZWsgKGlucHV0KSB7XG4gICAgICAgIHZhciB3ZWVrID0gdGhpcy5sb2NhbGVEYXRhKCkud2Vlayh0aGlzKTtcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB3ZWVrIDogdGhpcy5hZGQoKGlucHV0IC0gd2VlaykgKiA3LCAnZCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldElTT1dlZWsgKGlucHV0KSB7XG4gICAgICAgIHZhciB3ZWVrID0gd2Vla09mWWVhcih0aGlzLCAxLCA0KS53ZWVrO1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHdlZWsgOiB0aGlzLmFkZCgoaW5wdXQgLSB3ZWVrKSAqIDcsICdkJyk7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2QnLCAwLCAnZG8nLCAnZGF5Jyk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignZGQnLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS53ZWVrZGF5c01pbih0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2RkZCcsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLndlZWtkYXlzU2hvcnQodGhpcywgZm9ybWF0KTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdkZGRkJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkud2Vla2RheXModGhpcywgZm9ybWF0KTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdlJywgMCwgMCwgJ3dlZWtkYXknKTtcbiAgICBhZGRGb3JtYXRUb2tlbignRScsIDAsIDAsICdpc29XZWVrZGF5Jyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ2RheScsICdkJyk7XG4gICAgYWRkVW5pdEFsaWFzKCd3ZWVrZGF5JywgJ2UnKTtcbiAgICBhZGRVbml0QWxpYXMoJ2lzb1dlZWtkYXknLCAnRScpO1xuXG4gICAgLy8gUFJJT1JJVFlcbiAgICBhZGRVbml0UHJpb3JpdHkoJ2RheScsIDExKTtcbiAgICBhZGRVbml0UHJpb3JpdHkoJ3dlZWtkYXknLCAxMSk7XG4gICAgYWRkVW5pdFByaW9yaXR5KCdpc29XZWVrZGF5JywgMTEpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignZCcsICAgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignZScsICAgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignRScsICAgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignZGQnLCAgIGZ1bmN0aW9uIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUud2Vla2RheXNNaW5SZWdleChpc1N0cmljdCk7XG4gICAgfSk7XG4gICAgYWRkUmVnZXhUb2tlbignZGRkJywgICBmdW5jdGlvbiAoaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gbG9jYWxlLndlZWtkYXlzU2hvcnRSZWdleChpc1N0cmljdCk7XG4gICAgfSk7XG4gICAgYWRkUmVnZXhUb2tlbignZGRkZCcsICAgZnVuY3Rpb24gKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS53ZWVrZGF5c1JlZ2V4KGlzU3RyaWN0KTtcbiAgICB9KTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsnZGQnLCAnZGRkJywgJ2RkZGQnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIHZhciB3ZWVrZGF5ID0gY29uZmlnLl9sb2NhbGUud2Vla2RheXNQYXJzZShpbnB1dCwgdG9rZW4sIGNvbmZpZy5fc3RyaWN0KTtcbiAgICAgICAgLy8gaWYgd2UgZGlkbid0IGdldCBhIHdlZWtkYXkgbmFtZSwgbWFyayB0aGUgZGF0ZSBhcyBpbnZhbGlkXG4gICAgICAgIGlmICh3ZWVrZGF5ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHdlZWsuZCA9IHdlZWtkYXk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pbnZhbGlkV2Vla2RheSA9IGlucHV0O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhZGRXZWVrUGFyc2VUb2tlbihbJ2QnLCAnZScsICdFJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnLCB0b2tlbikge1xuICAgICAgICB3ZWVrW3Rva2VuXSA9IHRvSW50KGlucHV0KTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIGZ1bmN0aW9uIHBhcnNlV2Vla2RheShpbnB1dCwgbG9jYWxlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzTmFOKGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KGlucHV0LCAxMCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnB1dCA9IGxvY2FsZS53ZWVrZGF5c1BhcnNlKGlucHV0KTtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlSXNvV2Vla2RheShpbnB1dCwgbG9jYWxlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gbG9jYWxlLndlZWtkYXlzUGFyc2UoaW5wdXQpICUgNyB8fCA3O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc05hTihpbnB1dCkgPyBudWxsIDogaW5wdXQ7XG4gICAgfVxuXG4gICAgLy8gTE9DQUxFU1xuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVXZWVrZGF5cyA9ICdTdW5kYXlfTW9uZGF5X1R1ZXNkYXlfV2VkbmVzZGF5X1RodXJzZGF5X0ZyaWRheV9TYXR1cmRheScuc3BsaXQoJ18nKTtcbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrZGF5cyAobSwgZm9ybWF0KSB7XG4gICAgICAgIGlmICghbSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzQXJyYXkodGhpcy5fd2Vla2RheXMpID8gdGhpcy5fd2Vla2RheXMgOlxuICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzWydzdGFuZGFsb25lJ107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzQXJyYXkodGhpcy5fd2Vla2RheXMpID8gdGhpcy5fd2Vla2RheXNbbS5kYXkoKV0gOlxuICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNbdGhpcy5fd2Vla2RheXMuaXNGb3JtYXQudGVzdChmb3JtYXQpID8gJ2Zvcm1hdCcgOiAnc3RhbmRhbG9uZSddW20uZGF5KCldO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9jYWxlV2Vla2RheXNTaG9ydCA9ICdTdW5fTW9uX1R1ZV9XZWRfVGh1X0ZyaV9TYXQnLnNwbGl0KCdfJyk7XG4gICAgZnVuY3Rpb24gbG9jYWxlV2Vla2RheXNTaG9ydCAobSkge1xuICAgICAgICByZXR1cm4gKG0pID8gdGhpcy5fd2Vla2RheXNTaG9ydFttLmRheSgpXSA6IHRoaXMuX3dlZWtkYXlzU2hvcnQ7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVXZWVrZGF5c01pbiA9ICdTdV9Nb19UdV9XZV9UaF9Gcl9TYScuc3BsaXQoJ18nKTtcbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrZGF5c01pbiAobSkge1xuICAgICAgICByZXR1cm4gKG0pID8gdGhpcy5fd2Vla2RheXNNaW5bbS5kYXkoKV0gOiB0aGlzLl93ZWVrZGF5c01pbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVTdHJpY3RQYXJzZSQxKHdlZWtkYXlOYW1lLCBmb3JtYXQsIHN0cmljdCkge1xuICAgICAgICB2YXIgaSwgaWksIG1vbSwgbGxjID0gd2Vla2RheU5hbWUudG9Mb2NhbGVMb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKCF0aGlzLl93ZWVrZGF5c1BhcnNlKSB7XG4gICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1BhcnNlID0gW107XG4gICAgICAgICAgICB0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX21pbldlZWtkYXlzUGFyc2UgPSBbXTtcblxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IDc7ICsraSkge1xuICAgICAgICAgICAgICAgIG1vbSA9IGNyZWF0ZVVUQyhbMjAwMCwgMV0pLmRheShpKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9taW5XZWVrZGF5c1BhcnNlW2ldID0gdGhpcy53ZWVrZGF5c01pbihtb20sICcnKS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZVtpXSA9IHRoaXMud2Vla2RheXNTaG9ydChtb20sICcnKS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzUGFyc2VbaV0gPSB0aGlzLndlZWtkYXlzKG1vbSwgJycpLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAgICAgICBpZiAoZm9ybWF0ID09PSAnZGRkZCcpIHtcbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl93ZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdCA9PT0gJ2RkZCcpIHtcbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fbWluV2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGZvcm1hdCA9PT0gJ2RkZGQnKSB7XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fd2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICBpZiAoaWkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fc2hvcnRXZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIGlmIChpaSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9taW5XZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdCA9PT0gJ2RkZCcpIHtcbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgaWYgKGlpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaWk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3dlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgaWYgKGlpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaWk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX21pbldlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fbWluV2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICBpZiAoaWkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fd2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICBpZiAoaWkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fc2hvcnRXZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrZGF5c1BhcnNlICh3ZWVrZGF5TmFtZSwgZm9ybWF0LCBzdHJpY3QpIHtcbiAgICAgICAgdmFyIGksIG1vbSwgcmVnZXg7XG5cbiAgICAgICAgaWYgKHRoaXMuX3dlZWtkYXlzUGFyc2VFeGFjdCkge1xuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZVN0cmljdFBhcnNlJDEuY2FsbCh0aGlzLCB3ZWVrZGF5TmFtZSwgZm9ybWF0LCBzdHJpY3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLl93ZWVrZGF5c1BhcnNlKSB7XG4gICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1BhcnNlID0gW107XG4gICAgICAgICAgICB0aGlzLl9taW5XZWVrZGF5c1BhcnNlID0gW107XG4gICAgICAgICAgICB0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX2Z1bGxXZWVrZGF5c1BhcnNlID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICAvLyBtYWtlIHRoZSByZWdleCBpZiB3ZSBkb24ndCBoYXZlIGl0IGFscmVhZHlcblxuICAgICAgICAgICAgbW9tID0gY3JlYXRlVVRDKFsyMDAwLCAxXSkuZGF5KGkpO1xuICAgICAgICAgICAgaWYgKHN0cmljdCAmJiAhdGhpcy5fZnVsbFdlZWtkYXlzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9mdWxsV2Vla2RheXNQYXJzZVtpXSA9IG5ldyBSZWdFeHAoJ14nICsgdGhpcy53ZWVrZGF5cyhtb20sICcnKS5yZXBsYWNlKCcuJywgJ1xcXFwuPycpICsgJyQnLCAnaScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZVtpXSA9IG5ldyBSZWdFeHAoJ14nICsgdGhpcy53ZWVrZGF5c1Nob3J0KG1vbSwgJycpLnJlcGxhY2UoJy4nLCAnXFxcXC4/JykgKyAnJCcsICdpJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWluV2Vla2RheXNQYXJzZVtpXSA9IG5ldyBSZWdFeHAoJ14nICsgdGhpcy53ZWVrZGF5c01pbihtb20sICcnKS5yZXBsYWNlKCcuJywgJ1xcXFwuPycpICsgJyQnLCAnaScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLl93ZWVrZGF5c1BhcnNlW2ldKSB7XG4gICAgICAgICAgICAgICAgcmVnZXggPSAnXicgKyB0aGlzLndlZWtkYXlzKG1vbSwgJycpICsgJ3xeJyArIHRoaXMud2Vla2RheXNTaG9ydChtb20sICcnKSArICd8XicgKyB0aGlzLndlZWtkYXlzTWluKG1vbSwgJycpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKHJlZ2V4LnJlcGxhY2UoJy4nLCAnJyksICdpJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0ZXN0IHRoZSByZWdleFxuICAgICAgICAgICAgaWYgKHN0cmljdCAmJiBmb3JtYXQgPT09ICdkZGRkJyAmJiB0aGlzLl9mdWxsV2Vla2RheXNQYXJzZVtpXS50ZXN0KHdlZWtkYXlOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdHJpY3QgJiYgZm9ybWF0ID09PSAnZGRkJyAmJiB0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2VbaV0udGVzdCh3ZWVrZGF5TmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RyaWN0ICYmIGZvcm1hdCA9PT0gJ2RkJyAmJiB0aGlzLl9taW5XZWVrZGF5c1BhcnNlW2ldLnRlc3Qod2Vla2RheU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzdHJpY3QgJiYgdGhpcy5fd2Vla2RheXNQYXJzZVtpXS50ZXN0KHdlZWtkYXlOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0RGF5T2ZXZWVrIChpbnB1dCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQgIT0gbnVsbCA/IHRoaXMgOiBOYU47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRheSA9IHRoaXMuX2lzVVRDID8gdGhpcy5fZC5nZXRVVENEYXkoKSA6IHRoaXMuX2QuZ2V0RGF5KCk7XG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpbnB1dCA9IHBhcnNlV2Vla2RheShpbnB1dCwgdGhpcy5sb2NhbGVEYXRhKCkpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRkKGlucHV0IC0gZGF5LCAnZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGRheTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldExvY2FsZURheU9mV2VlayAoaW5wdXQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0ICE9IG51bGwgPyB0aGlzIDogTmFOO1xuICAgICAgICB9XG4gICAgICAgIHZhciB3ZWVrZGF5ID0gKHRoaXMuZGF5KCkgKyA3IC0gdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWsuZG93KSAlIDc7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gd2Vla2RheSA6IHRoaXMuYWRkKGlucHV0IC0gd2Vla2RheSwgJ2QnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXRJU09EYXlPZldlZWsgKGlucHV0KSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCAhPSBudWxsID8gdGhpcyA6IE5hTjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGJlaGF2ZXMgdGhlIHNhbWUgYXMgbW9tZW50I2RheSBleGNlcHRcbiAgICAgICAgLy8gYXMgYSBnZXR0ZXIsIHJldHVybnMgNyBpbnN0ZWFkIG9mIDAgKDEtNyByYW5nZSBpbnN0ZWFkIG9mIDAtNilcbiAgICAgICAgLy8gYXMgYSBzZXR0ZXIsIHN1bmRheSBzaG91bGQgYmVsb25nIHRvIHRoZSBwcmV2aW91cyB3ZWVrLlxuXG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgd2Vla2RheSA9IHBhcnNlSXNvV2Vla2RheShpbnB1dCwgdGhpcy5sb2NhbGVEYXRhKCkpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF5KHRoaXMuZGF5KCkgJSA3ID8gd2Vla2RheSA6IHdlZWtkYXkgLSA3KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRheSgpIHx8IDc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdFdlZWtkYXlzUmVnZXggPSBtYXRjaFdvcmQ7XG4gICAgZnVuY3Rpb24gd2Vla2RheXNSZWdleCAoaXNTdHJpY3QpIHtcbiAgICAgICAgaWYgKHRoaXMuX3dlZWtkYXlzUGFyc2VFeGFjdCkge1xuICAgICAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfd2Vla2RheXNSZWdleCcpKSB7XG4gICAgICAgICAgICAgICAgY29tcHV0ZVdlZWtkYXlzUGFyc2UuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc1N0cmljdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1N0cmljdFJlZ2V4O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNSZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX3dlZWtkYXlzUmVnZXgnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzUmVnZXggPSBkZWZhdWx0V2Vla2RheXNSZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1N0cmljdFJlZ2V4ICYmIGlzU3RyaWN0ID9cbiAgICAgICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1N0cmljdFJlZ2V4IDogdGhpcy5fd2Vla2RheXNSZWdleDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBkZWZhdWx0V2Vla2RheXNTaG9ydFJlZ2V4ID0gbWF0Y2hXb3JkO1xuICAgIGZ1bmN0aW9uIHdlZWtkYXlzU2hvcnRSZWdleCAoaXNTdHJpY3QpIHtcbiAgICAgICAgaWYgKHRoaXMuX3dlZWtkYXlzUGFyc2VFeGFjdCkge1xuICAgICAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfd2Vla2RheXNSZWdleCcpKSB7XG4gICAgICAgICAgICAgICAgY29tcHV0ZVdlZWtkYXlzUGFyc2UuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc1N0cmljdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1Nob3J0U3RyaWN0UmVnZXg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1Nob3J0UmVnZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ193ZWVrZGF5c1Nob3J0UmVnZXgnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzU2hvcnRSZWdleCA9IGRlZmF1bHRXZWVrZGF5c1Nob3J0UmVnZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNTaG9ydFN0cmljdFJlZ2V4ICYmIGlzU3RyaWN0ID9cbiAgICAgICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1Nob3J0U3RyaWN0UmVnZXggOiB0aGlzLl93ZWVrZGF5c1Nob3J0UmVnZXg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdFdlZWtkYXlzTWluUmVnZXggPSBtYXRjaFdvcmQ7XG4gICAgZnVuY3Rpb24gd2Vla2RheXNNaW5SZWdleCAoaXNTdHJpY3QpIHtcbiAgICAgICAgaWYgKHRoaXMuX3dlZWtkYXlzUGFyc2VFeGFjdCkge1xuICAgICAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfd2Vla2RheXNSZWdleCcpKSB7XG4gICAgICAgICAgICAgICAgY29tcHV0ZVdlZWtkYXlzUGFyc2UuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc1N0cmljdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c01pblN0cmljdFJlZ2V4O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNNaW5SZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX3dlZWtkYXlzTWluUmVnZXgnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzTWluUmVnZXggPSBkZWZhdWx0V2Vla2RheXNNaW5SZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c01pblN0cmljdFJlZ2V4ICYmIGlzU3RyaWN0ID9cbiAgICAgICAgICAgICAgICB0aGlzLl93ZWVrZGF5c01pblN0cmljdFJlZ2V4IDogdGhpcy5fd2Vla2RheXNNaW5SZWdleDtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gY29tcHV0ZVdlZWtkYXlzUGFyc2UgKCkge1xuICAgICAgICBmdW5jdGlvbiBjbXBMZW5SZXYoYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGIubGVuZ3RoIC0gYS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbWluUGllY2VzID0gW10sIHNob3J0UGllY2VzID0gW10sIGxvbmdQaWVjZXMgPSBbXSwgbWl4ZWRQaWVjZXMgPSBbXSxcbiAgICAgICAgICAgIGksIG1vbSwgbWlucCwgc2hvcnRwLCBsb25ncDtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgICAgICAgLy8gbWFrZSB0aGUgcmVnZXggaWYgd2UgZG9uJ3QgaGF2ZSBpdCBhbHJlYWR5XG4gICAgICAgICAgICBtb20gPSBjcmVhdGVVVEMoWzIwMDAsIDFdKS5kYXkoaSk7XG4gICAgICAgICAgICBtaW5wID0gdGhpcy53ZWVrZGF5c01pbihtb20sICcnKTtcbiAgICAgICAgICAgIHNob3J0cCA9IHRoaXMud2Vla2RheXNTaG9ydChtb20sICcnKTtcbiAgICAgICAgICAgIGxvbmdwID0gdGhpcy53ZWVrZGF5cyhtb20sICcnKTtcbiAgICAgICAgICAgIG1pblBpZWNlcy5wdXNoKG1pbnApO1xuICAgICAgICAgICAgc2hvcnRQaWVjZXMucHVzaChzaG9ydHApO1xuICAgICAgICAgICAgbG9uZ1BpZWNlcy5wdXNoKGxvbmdwKTtcbiAgICAgICAgICAgIG1peGVkUGllY2VzLnB1c2gobWlucCk7XG4gICAgICAgICAgICBtaXhlZFBpZWNlcy5wdXNoKHNob3J0cCk7XG4gICAgICAgICAgICBtaXhlZFBpZWNlcy5wdXNoKGxvbmdwKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTb3J0aW5nIG1ha2VzIHN1cmUgaWYgb25lIHdlZWtkYXkgKG9yIGFiYnIpIGlzIGEgcHJlZml4IG9mIGFub3RoZXIgaXRcbiAgICAgICAgLy8gd2lsbCBtYXRjaCB0aGUgbG9uZ2VyIHBpZWNlLlxuICAgICAgICBtaW5QaWVjZXMuc29ydChjbXBMZW5SZXYpO1xuICAgICAgICBzaG9ydFBpZWNlcy5zb3J0KGNtcExlblJldik7XG4gICAgICAgIGxvbmdQaWVjZXMuc29ydChjbXBMZW5SZXYpO1xuICAgICAgICBtaXhlZFBpZWNlcy5zb3J0KGNtcExlblJldik7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgIHNob3J0UGllY2VzW2ldID0gcmVnZXhFc2NhcGUoc2hvcnRQaWVjZXNbaV0pO1xuICAgICAgICAgICAgbG9uZ1BpZWNlc1tpXSA9IHJlZ2V4RXNjYXBlKGxvbmdQaWVjZXNbaV0pO1xuICAgICAgICAgICAgbWl4ZWRQaWVjZXNbaV0gPSByZWdleEVzY2FwZShtaXhlZFBpZWNlc1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl93ZWVrZGF5c1JlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgbWl4ZWRQaWVjZXMuam9pbignfCcpICsgJyknLCAnaScpO1xuICAgICAgICB0aGlzLl93ZWVrZGF5c1Nob3J0UmVnZXggPSB0aGlzLl93ZWVrZGF5c1JlZ2V4O1xuICAgICAgICB0aGlzLl93ZWVrZGF5c01pblJlZ2V4ID0gdGhpcy5fd2Vla2RheXNSZWdleDtcblxuICAgICAgICB0aGlzLl93ZWVrZGF5c1N0cmljdFJlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgbG9uZ1BpZWNlcy5qb2luKCd8JykgKyAnKScsICdpJyk7XG4gICAgICAgIHRoaXMuX3dlZWtkYXlzU2hvcnRTdHJpY3RSZWdleCA9IG5ldyBSZWdFeHAoJ14oJyArIHNob3J0UGllY2VzLmpvaW4oJ3wnKSArICcpJywgJ2knKTtcbiAgICAgICAgdGhpcy5fd2Vla2RheXNNaW5TdHJpY3RSZWdleCA9IG5ldyBSZWdFeHAoJ14oJyArIG1pblBpZWNlcy5qb2luKCd8JykgKyAnKScsICdpJyk7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgZnVuY3Rpb24gaEZvcm1hdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaG91cnMoKSAlIDEyIHx8IDEyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGtGb3JtYXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhvdXJzKCkgfHwgMjQ7XG4gICAgfVxuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ0gnLCBbJ0hIJywgMl0sIDAsICdob3VyJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ2gnLCBbJ2hoJywgMl0sIDAsIGhGb3JtYXQpO1xuICAgIGFkZEZvcm1hdFRva2VuKCdrJywgWydraycsIDJdLCAwLCBrRm9ybWF0KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdobW0nLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAnJyArIGhGb3JtYXQuYXBwbHkodGhpcykgKyB6ZXJvRmlsbCh0aGlzLm1pbnV0ZXMoKSwgMik7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignaG1tc3MnLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAnJyArIGhGb3JtYXQuYXBwbHkodGhpcykgKyB6ZXJvRmlsbCh0aGlzLm1pbnV0ZXMoKSwgMikgK1xuICAgICAgICAgICAgemVyb0ZpbGwodGhpcy5zZWNvbmRzKCksIDIpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ0htbScsIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICcnICsgdGhpcy5ob3VycygpICsgemVyb0ZpbGwodGhpcy5taW51dGVzKCksIDIpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ0htbXNzJywgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJycgKyB0aGlzLmhvdXJzKCkgKyB6ZXJvRmlsbCh0aGlzLm1pbnV0ZXMoKSwgMikgK1xuICAgICAgICAgICAgemVyb0ZpbGwodGhpcy5zZWNvbmRzKCksIDIpO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gbWVyaWRpZW0gKHRva2VuLCBsb3dlcmNhc2UpIHtcbiAgICAgICAgYWRkRm9ybWF0VG9rZW4odG9rZW4sIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5tZXJpZGllbSh0aGlzLmhvdXJzKCksIHRoaXMubWludXRlcygpLCBsb3dlcmNhc2UpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBtZXJpZGllbSgnYScsIHRydWUpO1xuICAgIG1lcmlkaWVtKCdBJywgZmFsc2UpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdob3VyJywgJ2gnKTtcblxuICAgIC8vIFBSSU9SSVRZXG4gICAgYWRkVW5pdFByaW9yaXR5KCdob3VyJywgMTMpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgZnVuY3Rpb24gbWF0Y2hNZXJpZGllbSAoaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gbG9jYWxlLl9tZXJpZGllbVBhcnNlO1xuICAgIH1cblxuICAgIGFkZFJlZ2V4VG9rZW4oJ2EnLCAgbWF0Y2hNZXJpZGllbSk7XG4gICAgYWRkUmVnZXhUb2tlbignQScsICBtYXRjaE1lcmlkaWVtKTtcbiAgICBhZGRSZWdleFRva2VuKCdIJywgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignaCcsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2snLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdISCcsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdoaCcsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdraycsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ2htbScsIG1hdGNoM3RvNCk7XG4gICAgYWRkUmVnZXhUb2tlbignaG1tc3MnLCBtYXRjaDV0bzYpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0htbScsIG1hdGNoM3RvNCk7XG4gICAgYWRkUmVnZXhUb2tlbignSG1tc3MnLCBtYXRjaDV0bzYpO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ0gnLCAnSEgnXSwgSE9VUik7XG4gICAgYWRkUGFyc2VUb2tlbihbJ2snLCAna2snXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIHZhciBrSW5wdXQgPSB0b0ludChpbnB1dCk7XG4gICAgICAgIGFycmF5W0hPVVJdID0ga0lucHV0ID09PSAyNCA/IDAgOiBrSW5wdXQ7XG4gICAgfSk7XG4gICAgYWRkUGFyc2VUb2tlbihbJ2EnLCAnQSddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl9pc1BtID0gY29uZmlnLl9sb2NhbGUuaXNQTShpbnB1dCk7XG4gICAgICAgIGNvbmZpZy5fbWVyaWRpZW0gPSBpbnB1dDtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKFsnaCcsICdoaCddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgYXJyYXlbSE9VUl0gPSB0b0ludChpbnB1dCk7XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmJpZ0hvdXIgPSB0cnVlO1xuICAgIH0pO1xuICAgIGFkZFBhcnNlVG9rZW4oJ2htbScsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICB2YXIgcG9zID0gaW5wdXQubGVuZ3RoIC0gMjtcbiAgICAgICAgYXJyYXlbSE9VUl0gPSB0b0ludChpbnB1dC5zdWJzdHIoMCwgcG9zKSk7XG4gICAgICAgIGFycmF5W01JTlVURV0gPSB0b0ludChpbnB1dC5zdWJzdHIocG9zKSk7XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmJpZ0hvdXIgPSB0cnVlO1xuICAgIH0pO1xuICAgIGFkZFBhcnNlVG9rZW4oJ2htbXNzJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIHZhciBwb3MxID0gaW5wdXQubGVuZ3RoIC0gNDtcbiAgICAgICAgdmFyIHBvczIgPSBpbnB1dC5sZW5ndGggLSAyO1xuICAgICAgICBhcnJheVtIT1VSXSA9IHRvSW50KGlucHV0LnN1YnN0cigwLCBwb3MxKSk7XG4gICAgICAgIGFycmF5W01JTlVURV0gPSB0b0ludChpbnB1dC5zdWJzdHIocG9zMSwgMikpO1xuICAgICAgICBhcnJheVtTRUNPTkRdID0gdG9JbnQoaW5wdXQuc3Vic3RyKHBvczIpKTtcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuYmlnSG91ciA9IHRydWU7XG4gICAgfSk7XG4gICAgYWRkUGFyc2VUb2tlbignSG1tJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIHZhciBwb3MgPSBpbnB1dC5sZW5ndGggLSAyO1xuICAgICAgICBhcnJheVtIT1VSXSA9IHRvSW50KGlucHV0LnN1YnN0cigwLCBwb3MpKTtcbiAgICAgICAgYXJyYXlbTUlOVVRFXSA9IHRvSW50KGlucHV0LnN1YnN0cihwb3MpKTtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKCdIbW1zcycsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICB2YXIgcG9zMSA9IGlucHV0Lmxlbmd0aCAtIDQ7XG4gICAgICAgIHZhciBwb3MyID0gaW5wdXQubGVuZ3RoIC0gMjtcbiAgICAgICAgYXJyYXlbSE9VUl0gPSB0b0ludChpbnB1dC5zdWJzdHIoMCwgcG9zMSkpO1xuICAgICAgICBhcnJheVtNSU5VVEVdID0gdG9JbnQoaW5wdXQuc3Vic3RyKHBvczEsIDIpKTtcbiAgICAgICAgYXJyYXlbU0VDT05EXSA9IHRvSW50KGlucHV0LnN1YnN0cihwb3MyKSk7XG4gICAgfSk7XG5cbiAgICAvLyBMT0NBTEVTXG5cbiAgICBmdW5jdGlvbiBsb2NhbGVJc1BNIChpbnB1dCkge1xuICAgICAgICAvLyBJRTggUXVpcmtzIE1vZGUgJiBJRTcgU3RhbmRhcmRzIE1vZGUgZG8gbm90IGFsbG93IGFjY2Vzc2luZyBzdHJpbmdzIGxpa2UgYXJyYXlzXG4gICAgICAgIC8vIFVzaW5nIGNoYXJBdCBzaG91bGQgYmUgbW9yZSBjb21wYXRpYmxlLlxuICAgICAgICByZXR1cm4gKChpbnB1dCArICcnKS50b0xvd2VyQ2FzZSgpLmNoYXJBdCgwKSA9PT0gJ3AnKTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZU1lcmlkaWVtUGFyc2UgPSAvW2FwXVxcLj9tP1xcLj8vaTtcbiAgICBmdW5jdGlvbiBsb2NhbGVNZXJpZGllbSAoaG91cnMsIG1pbnV0ZXMsIGlzTG93ZXIpIHtcbiAgICAgICAgaWYgKGhvdXJzID4gMTEpIHtcbiAgICAgICAgICAgIHJldHVybiBpc0xvd2VyID8gJ3BtJyA6ICdQTSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaXNMb3dlciA/ICdhbScgOiAnQU0nO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICAvLyBTZXR0aW5nIHRoZSBob3VyIHNob3VsZCBrZWVwIHRoZSB0aW1lLCBiZWNhdXNlIHRoZSB1c2VyIGV4cGxpY2l0bHlcbiAgICAvLyBzcGVjaWZpZWQgd2hpY2ggaG91ciB0aGV5IHdhbnQuIFNvIHRyeWluZyB0byBtYWludGFpbiB0aGUgc2FtZSBob3VyIChpblxuICAgIC8vIGEgbmV3IHRpbWV6b25lKSBtYWtlcyBzZW5zZS4gQWRkaW5nL3N1YnRyYWN0aW5nIGhvdXJzIGRvZXMgbm90IGZvbGxvd1xuICAgIC8vIHRoaXMgcnVsZS5cbiAgICB2YXIgZ2V0U2V0SG91ciA9IG1ha2VHZXRTZXQoJ0hvdXJzJywgdHJ1ZSk7XG5cbiAgICB2YXIgYmFzZUNvbmZpZyA9IHtcbiAgICAgICAgY2FsZW5kYXI6IGRlZmF1bHRDYWxlbmRhcixcbiAgICAgICAgbG9uZ0RhdGVGb3JtYXQ6IGRlZmF1bHRMb25nRGF0ZUZvcm1hdCxcbiAgICAgICAgaW52YWxpZERhdGU6IGRlZmF1bHRJbnZhbGlkRGF0ZSxcbiAgICAgICAgb3JkaW5hbDogZGVmYXVsdE9yZGluYWwsXG4gICAgICAgIGRheU9mTW9udGhPcmRpbmFsUGFyc2U6IGRlZmF1bHREYXlPZk1vbnRoT3JkaW5hbFBhcnNlLFxuICAgICAgICByZWxhdGl2ZVRpbWU6IGRlZmF1bHRSZWxhdGl2ZVRpbWUsXG5cbiAgICAgICAgbW9udGhzOiBkZWZhdWx0TG9jYWxlTW9udGhzLFxuICAgICAgICBtb250aHNTaG9ydDogZGVmYXVsdExvY2FsZU1vbnRoc1Nob3J0LFxuXG4gICAgICAgIHdlZWs6IGRlZmF1bHRMb2NhbGVXZWVrLFxuXG4gICAgICAgIHdlZWtkYXlzOiBkZWZhdWx0TG9jYWxlV2Vla2RheXMsXG4gICAgICAgIHdlZWtkYXlzTWluOiBkZWZhdWx0TG9jYWxlV2Vla2RheXNNaW4sXG4gICAgICAgIHdlZWtkYXlzU2hvcnQ6IGRlZmF1bHRMb2NhbGVXZWVrZGF5c1Nob3J0LFxuXG4gICAgICAgIG1lcmlkaWVtUGFyc2U6IGRlZmF1bHRMb2NhbGVNZXJpZGllbVBhcnNlXG4gICAgfTtcblxuICAgIC8vIGludGVybmFsIHN0b3JhZ2UgZm9yIGxvY2FsZSBjb25maWcgZmlsZXNcbiAgICB2YXIgbG9jYWxlcyA9IHt9O1xuICAgIHZhciBsb2NhbGVGYW1pbGllcyA9IHt9O1xuICAgIHZhciBnbG9iYWxMb2NhbGU7XG5cbiAgICBmdW5jdGlvbiBub3JtYWxpemVMb2NhbGUoa2V5KSB7XG4gICAgICAgIHJldHVybiBrZXkgPyBrZXkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCdfJywgJy0nKSA6IGtleTtcbiAgICB9XG5cbiAgICAvLyBwaWNrIHRoZSBsb2NhbGUgZnJvbSB0aGUgYXJyYXlcbiAgICAvLyB0cnkgWydlbi1hdScsICdlbi1nYiddIGFzICdlbi1hdScsICdlbi1nYicsICdlbicsIGFzIGluIG1vdmUgdGhyb3VnaCB0aGUgbGlzdCB0cnlpbmcgZWFjaFxuICAgIC8vIHN1YnN0cmluZyBmcm9tIG1vc3Qgc3BlY2lmaWMgdG8gbGVhc3QsIGJ1dCBtb3ZlIHRvIHRoZSBuZXh0IGFycmF5IGl0ZW0gaWYgaXQncyBhIG1vcmUgc3BlY2lmaWMgdmFyaWFudCB0aGFuIHRoZSBjdXJyZW50IHJvb3RcbiAgICBmdW5jdGlvbiBjaG9vc2VMb2NhbGUobmFtZXMpIHtcbiAgICAgICAgdmFyIGkgPSAwLCBqLCBuZXh0LCBsb2NhbGUsIHNwbGl0O1xuXG4gICAgICAgIHdoaWxlIChpIDwgbmFtZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBzcGxpdCA9IG5vcm1hbGl6ZUxvY2FsZShuYW1lc1tpXSkuc3BsaXQoJy0nKTtcbiAgICAgICAgICAgIGogPSBzcGxpdC5sZW5ndGg7XG4gICAgICAgICAgICBuZXh0ID0gbm9ybWFsaXplTG9jYWxlKG5hbWVzW2kgKyAxXSk7XG4gICAgICAgICAgICBuZXh0ID0gbmV4dCA/IG5leHQuc3BsaXQoJy0nKSA6IG51bGw7XG4gICAgICAgICAgICB3aGlsZSAoaiA+IDApIHtcbiAgICAgICAgICAgICAgICBsb2NhbGUgPSBsb2FkTG9jYWxlKHNwbGl0LnNsaWNlKDAsIGopLmpvaW4oJy0nKSk7XG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9jYWxlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobmV4dCAmJiBuZXh0Lmxlbmd0aCA+PSBqICYmIGNvbXBhcmVBcnJheXMoc3BsaXQsIG5leHQsIHRydWUpID49IGogLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vdGhlIG5leHQgYXJyYXkgaXRlbSBpcyBiZXR0ZXIgdGhhbiBhIHNoYWxsb3dlciBzdWJzdHJpbmcgb2YgdGhpcyBvbmVcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGotLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ2xvYmFsTG9jYWxlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvYWRMb2NhbGUobmFtZSkge1xuICAgICAgICB2YXIgb2xkTG9jYWxlID0gbnVsbDtcbiAgICAgICAgLy8gVE9ETzogRmluZCBhIGJldHRlciB3YXkgdG8gcmVnaXN0ZXIgYW5kIGxvYWQgYWxsIHRoZSBsb2NhbGVzIGluIE5vZGVcbiAgICAgICAgaWYgKCFsb2NhbGVzW25hbWVdICYmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykgJiZcbiAgICAgICAgICAgICAgICBtb2R1bGUgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgb2xkTG9jYWxlID0gZ2xvYmFsTG9jYWxlLl9hYmJyO1xuICAgICAgICAgICAgICAgIHZhciBhbGlhc2VkUmVxdWlyZSA9IHJlcXVpcmU7XG4gICAgICAgICAgICAgICAgYWxpYXNlZFJlcXVpcmUoJy4vbG9jYWxlLycgKyBuYW1lKTtcbiAgICAgICAgICAgICAgICBnZXRTZXRHbG9iYWxMb2NhbGUob2xkTG9jYWxlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxvY2FsZXNbbmFtZV07XG4gICAgfVxuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGxvYWQgbG9jYWxlIGFuZCB0aGVuIHNldCB0aGUgZ2xvYmFsIGxvY2FsZS4gIElmXG4gICAgLy8gbm8gYXJndW1lbnRzIGFyZSBwYXNzZWQgaW4sIGl0IHdpbGwgc2ltcGx5IHJldHVybiB0aGUgY3VycmVudCBnbG9iYWxcbiAgICAvLyBsb2NhbGUga2V5LlxuICAgIGZ1bmN0aW9uIGdldFNldEdsb2JhbExvY2FsZSAoa2V5LCB2YWx1ZXMpIHtcbiAgICAgICAgdmFyIGRhdGE7XG4gICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgIGlmIChpc1VuZGVmaW5lZCh2YWx1ZXMpKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGdldExvY2FsZShrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGRlZmluZUxvY2FsZShrZXksIHZhbHVlcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgLy8gbW9tZW50LmR1cmF0aW9uLl9sb2NhbGUgPSBtb21lbnQuX2xvY2FsZSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgZ2xvYmFsTG9jYWxlID0gZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICgodHlwZW9mIGNvbnNvbGUgIT09ICAndW5kZWZpbmVkJykgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vd2FybiB1c2VyIGlmIGFyZ3VtZW50cyBhcmUgcGFzc2VkIGJ1dCB0aGUgbG9jYWxlIGNvdWxkIG5vdCBiZSBzZXRcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdMb2NhbGUgJyArIGtleSArICAnIG5vdCBmb3VuZC4gRGlkIHlvdSBmb3JnZXQgdG8gbG9hZCBpdD8nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZ2xvYmFsTG9jYWxlLl9hYmJyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlZmluZUxvY2FsZSAobmFtZSwgY29uZmlnKSB7XG4gICAgICAgIGlmIChjb25maWcgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBsb2NhbGUsIHBhcmVudENvbmZpZyA9IGJhc2VDb25maWc7XG4gICAgICAgICAgICBjb25maWcuYWJiciA9IG5hbWU7XG4gICAgICAgICAgICBpZiAobG9jYWxlc1tuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZGVwcmVjYXRlU2ltcGxlKCdkZWZpbmVMb2NhbGVPdmVycmlkZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAndXNlIG1vbWVudC51cGRhdGVMb2NhbGUobG9jYWxlTmFtZSwgY29uZmlnKSB0byBjaGFuZ2UgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnYW4gZXhpc3RpbmcgbG9jYWxlLiBtb21lbnQuZGVmaW5lTG9jYWxlKGxvY2FsZU5hbWUsICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZykgc2hvdWxkIG9ubHkgYmUgdXNlZCBmb3IgY3JlYXRpbmcgYSBuZXcgbG9jYWxlICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1NlZSBodHRwOi8vbW9tZW50anMuY29tL2d1aWRlcy8jL3dhcm5pbmdzL2RlZmluZS1sb2NhbGUvIGZvciBtb3JlIGluZm8uJyk7XG4gICAgICAgICAgICAgICAgcGFyZW50Q29uZmlnID0gbG9jYWxlc1tuYW1lXS5fY29uZmlnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb25maWcucGFyZW50TG9jYWxlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAobG9jYWxlc1tjb25maWcucGFyZW50TG9jYWxlXSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudENvbmZpZyA9IGxvY2FsZXNbY29uZmlnLnBhcmVudExvY2FsZV0uX2NvbmZpZztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbGUgPSBsb2FkTG9jYWxlKGNvbmZpZy5wYXJlbnRMb2NhbGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWxlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudENvbmZpZyA9IGxvY2FsZS5fY29uZmlnO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFsb2NhbGVGYW1pbGllc1tjb25maWcucGFyZW50TG9jYWxlXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZUZhbWlsaWVzW2NvbmZpZy5wYXJlbnRMb2NhbGVdID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGVGYW1pbGllc1tjb25maWcucGFyZW50TG9jYWxlXS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbG9jYWxlc1tuYW1lXSA9IG5ldyBMb2NhbGUobWVyZ2VDb25maWdzKHBhcmVudENvbmZpZywgY29uZmlnKSk7XG5cbiAgICAgICAgICAgIGlmIChsb2NhbGVGYW1pbGllc1tuYW1lXSkge1xuICAgICAgICAgICAgICAgIGxvY2FsZUZhbWlsaWVzW25hbWVdLmZvckVhY2goZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmaW5lTG9jYWxlKHgubmFtZSwgeC5jb25maWcpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBiYWNrd2FyZHMgY29tcGF0IGZvciBub3c6IGFsc28gc2V0IHRoZSBsb2NhbGVcbiAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSB3ZSBzZXQgdGhlIGxvY2FsZSBBRlRFUiBhbGwgY2hpbGQgbG9jYWxlcyBoYXZlIGJlZW5cbiAgICAgICAgICAgIC8vIGNyZWF0ZWQsIHNvIHdlIHdvbid0IGVuZCB1cCB3aXRoIHRoZSBjaGlsZCBsb2NhbGUgc2V0LlxuICAgICAgICAgICAgZ2V0U2V0R2xvYmFsTG9jYWxlKG5hbWUpO1xuXG5cbiAgICAgICAgICAgIHJldHVybiBsb2NhbGVzW25hbWVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdXNlZnVsIGZvciB0ZXN0aW5nXG4gICAgICAgICAgICBkZWxldGUgbG9jYWxlc1tuYW1lXTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlTG9jYWxlKG5hbWUsIGNvbmZpZykge1xuICAgICAgICBpZiAoY29uZmlnICE9IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBsb2NhbGUsIHRtcExvY2FsZSwgcGFyZW50Q29uZmlnID0gYmFzZUNvbmZpZztcbiAgICAgICAgICAgIC8vIE1FUkdFXG4gICAgICAgICAgICB0bXBMb2NhbGUgPSBsb2FkTG9jYWxlKG5hbWUpO1xuICAgICAgICAgICAgaWYgKHRtcExvY2FsZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50Q29uZmlnID0gdG1wTG9jYWxlLl9jb25maWc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25maWcgPSBtZXJnZUNvbmZpZ3MocGFyZW50Q29uZmlnLCBjb25maWcpO1xuICAgICAgICAgICAgbG9jYWxlID0gbmV3IExvY2FsZShjb25maWcpO1xuICAgICAgICAgICAgbG9jYWxlLnBhcmVudExvY2FsZSA9IGxvY2FsZXNbbmFtZV07XG4gICAgICAgICAgICBsb2NhbGVzW25hbWVdID0gbG9jYWxlO1xuXG4gICAgICAgICAgICAvLyBiYWNrd2FyZHMgY29tcGF0IGZvciBub3c6IGFsc28gc2V0IHRoZSBsb2NhbGVcbiAgICAgICAgICAgIGdldFNldEdsb2JhbExvY2FsZShuYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHBhc3MgbnVsbCBmb3IgY29uZmlnIHRvIHVudXBkYXRlLCB1c2VmdWwgZm9yIHRlc3RzXG4gICAgICAgICAgICBpZiAobG9jYWxlc1tuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsZXNbbmFtZV0ucGFyZW50TG9jYWxlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxlc1tuYW1lXSA9IGxvY2FsZXNbbmFtZV0ucGFyZW50TG9jYWxlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobG9jYWxlc1tuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBsb2NhbGVzW25hbWVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG9jYWxlc1tuYW1lXTtcbiAgICB9XG5cbiAgICAvLyByZXR1cm5zIGxvY2FsZSBkYXRhXG4gICAgZnVuY3Rpb24gZ2V0TG9jYWxlIChrZXkpIHtcbiAgICAgICAgdmFyIGxvY2FsZTtcblxuICAgICAgICBpZiAoa2V5ICYmIGtleS5fbG9jYWxlICYmIGtleS5fbG9jYWxlLl9hYmJyKSB7XG4gICAgICAgICAgICBrZXkgPSBrZXkuX2xvY2FsZS5fYWJicjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsTG9jYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc0FycmF5KGtleSkpIHtcbiAgICAgICAgICAgIC8vc2hvcnQtY2lyY3VpdCBldmVyeXRoaW5nIGVsc2VcbiAgICAgICAgICAgIGxvY2FsZSA9IGxvYWRMb2NhbGUoa2V5KTtcbiAgICAgICAgICAgIGlmIChsb2NhbGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbG9jYWxlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga2V5ID0gW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2hvb3NlTG9jYWxlKGtleSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdExvY2FsZXMoKSB7XG4gICAgICAgIHJldHVybiBrZXlzKGxvY2FsZXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrT3ZlcmZsb3cgKG0pIHtcbiAgICAgICAgdmFyIG92ZXJmbG93O1xuICAgICAgICB2YXIgYSA9IG0uX2E7XG5cbiAgICAgICAgaWYgKGEgJiYgZ2V0UGFyc2luZ0ZsYWdzKG0pLm92ZXJmbG93ID09PSAtMikge1xuICAgICAgICAgICAgb3ZlcmZsb3cgPVxuICAgICAgICAgICAgICAgIGFbTU9OVEhdICAgICAgIDwgMCB8fCBhW01PTlRIXSAgICAgICA+IDExICA/IE1PTlRIIDpcbiAgICAgICAgICAgICAgICBhW0RBVEVdICAgICAgICA8IDEgfHwgYVtEQVRFXSAgICAgICAgPiBkYXlzSW5Nb250aChhW1lFQVJdLCBhW01PTlRIXSkgPyBEQVRFIDpcbiAgICAgICAgICAgICAgICBhW0hPVVJdICAgICAgICA8IDAgfHwgYVtIT1VSXSAgICAgICAgPiAyNCB8fCAoYVtIT1VSXSA9PT0gMjQgJiYgKGFbTUlOVVRFXSAhPT0gMCB8fCBhW1NFQ09ORF0gIT09IDAgfHwgYVtNSUxMSVNFQ09ORF0gIT09IDApKSA/IEhPVVIgOlxuICAgICAgICAgICAgICAgIGFbTUlOVVRFXSAgICAgIDwgMCB8fCBhW01JTlVURV0gICAgICA+IDU5ICA/IE1JTlVURSA6XG4gICAgICAgICAgICAgICAgYVtTRUNPTkRdICAgICAgPCAwIHx8IGFbU0VDT05EXSAgICAgID4gNTkgID8gU0VDT05EIDpcbiAgICAgICAgICAgICAgICBhW01JTExJU0VDT05EXSA8IDAgfHwgYVtNSUxMSVNFQ09ORF0gPiA5OTkgPyBNSUxMSVNFQ09ORCA6XG4gICAgICAgICAgICAgICAgLTE7XG5cbiAgICAgICAgICAgIGlmIChnZXRQYXJzaW5nRmxhZ3MobSkuX292ZXJmbG93RGF5T2ZZZWFyICYmIChvdmVyZmxvdyA8IFlFQVIgfHwgb3ZlcmZsb3cgPiBEQVRFKSkge1xuICAgICAgICAgICAgICAgIG92ZXJmbG93ID0gREFURTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChnZXRQYXJzaW5nRmxhZ3MobSkuX292ZXJmbG93V2Vla3MgJiYgb3ZlcmZsb3cgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgb3ZlcmZsb3cgPSBXRUVLO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGdldFBhcnNpbmdGbGFncyhtKS5fb3ZlcmZsb3dXZWVrZGF5ICYmIG92ZXJmbG93ID09PSAtMSkge1xuICAgICAgICAgICAgICAgIG92ZXJmbG93ID0gV0VFS0RBWTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKG0pLm92ZXJmbG93ID0gb3ZlcmZsb3c7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9XG5cbiAgICAvLyBQaWNrIHRoZSBmaXJzdCBkZWZpbmVkIG9mIHR3byBvciB0aHJlZSBhcmd1bWVudHMuXG4gICAgZnVuY3Rpb24gZGVmYXVsdHMoYSwgYiwgYykge1xuICAgICAgICBpZiAoYSAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYiAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gYjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjdXJyZW50RGF0ZUFycmF5KGNvbmZpZykge1xuICAgICAgICAvLyBob29rcyBpcyBhY3R1YWxseSB0aGUgZXhwb3J0ZWQgbW9tZW50IG9iamVjdFxuICAgICAgICB2YXIgbm93VmFsdWUgPSBuZXcgRGF0ZShob29rcy5ub3coKSk7XG4gICAgICAgIGlmIChjb25maWcuX3VzZVVUQykge1xuICAgICAgICAgICAgcmV0dXJuIFtub3dWYWx1ZS5nZXRVVENGdWxsWWVhcigpLCBub3dWYWx1ZS5nZXRVVENNb250aCgpLCBub3dWYWx1ZS5nZXRVVENEYXRlKCldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbbm93VmFsdWUuZ2V0RnVsbFllYXIoKSwgbm93VmFsdWUuZ2V0TW9udGgoKSwgbm93VmFsdWUuZ2V0RGF0ZSgpXTtcbiAgICB9XG5cbiAgICAvLyBjb252ZXJ0IGFuIGFycmF5IHRvIGEgZGF0ZS5cbiAgICAvLyB0aGUgYXJyYXkgc2hvdWxkIG1pcnJvciB0aGUgcGFyYW1ldGVycyBiZWxvd1xuICAgIC8vIG5vdGU6IGFsbCB2YWx1ZXMgcGFzdCB0aGUgeWVhciBhcmUgb3B0aW9uYWwgYW5kIHdpbGwgZGVmYXVsdCB0byB0aGUgbG93ZXN0IHBvc3NpYmxlIHZhbHVlLlxuICAgIC8vIFt5ZWFyLCBtb250aCwgZGF5ICwgaG91ciwgbWludXRlLCBzZWNvbmQsIG1pbGxpc2Vjb25kXVxuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21BcnJheSAoY29uZmlnKSB7XG4gICAgICAgIHZhciBpLCBkYXRlLCBpbnB1dCA9IFtdLCBjdXJyZW50RGF0ZSwgZXhwZWN0ZWRXZWVrZGF5LCB5ZWFyVG9Vc2U7XG5cbiAgICAgICAgaWYgKGNvbmZpZy5fZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudERhdGUgPSBjdXJyZW50RGF0ZUFycmF5KGNvbmZpZyk7XG5cbiAgICAgICAgLy9jb21wdXRlIGRheSBvZiB0aGUgeWVhciBmcm9tIHdlZWtzIGFuZCB3ZWVrZGF5c1xuICAgICAgICBpZiAoY29uZmlnLl93ICYmIGNvbmZpZy5fYVtEQVRFXSA9PSBudWxsICYmIGNvbmZpZy5fYVtNT05USF0gPT0gbnVsbCkge1xuICAgICAgICAgICAgZGF5T2ZZZWFyRnJvbVdlZWtJbmZvKGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICAvL2lmIHRoZSBkYXkgb2YgdGhlIHllYXIgaXMgc2V0LCBmaWd1cmUgb3V0IHdoYXQgaXQgaXNcbiAgICAgICAgaWYgKGNvbmZpZy5fZGF5T2ZZZWFyICE9IG51bGwpIHtcbiAgICAgICAgICAgIHllYXJUb1VzZSA9IGRlZmF1bHRzKGNvbmZpZy5fYVtZRUFSXSwgY3VycmVudERhdGVbWUVBUl0pO1xuXG4gICAgICAgICAgICBpZiAoY29uZmlnLl9kYXlPZlllYXIgPiBkYXlzSW5ZZWFyKHllYXJUb1VzZSkgfHwgY29uZmlnLl9kYXlPZlllYXIgPT09IDApIHtcbiAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5fb3ZlcmZsb3dEYXlPZlllYXIgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkYXRlID0gY3JlYXRlVVRDRGF0ZSh5ZWFyVG9Vc2UsIDAsIGNvbmZpZy5fZGF5T2ZZZWFyKTtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtNT05USF0gPSBkYXRlLmdldFVUQ01vbnRoKCk7XG4gICAgICAgICAgICBjb25maWcuX2FbREFURV0gPSBkYXRlLmdldFVUQ0RhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERlZmF1bHQgdG8gY3VycmVudCBkYXRlLlxuICAgICAgICAvLyAqIGlmIG5vIHllYXIsIG1vbnRoLCBkYXkgb2YgbW9udGggYXJlIGdpdmVuLCBkZWZhdWx0IHRvIHRvZGF5XG4gICAgICAgIC8vICogaWYgZGF5IG9mIG1vbnRoIGlzIGdpdmVuLCBkZWZhdWx0IG1vbnRoIGFuZCB5ZWFyXG4gICAgICAgIC8vICogaWYgbW9udGggaXMgZ2l2ZW4sIGRlZmF1bHQgb25seSB5ZWFyXG4gICAgICAgIC8vICogaWYgeWVhciBpcyBnaXZlbiwgZG9uJ3QgZGVmYXVsdCBhbnl0aGluZ1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMyAmJiBjb25maWcuX2FbaV0gPT0gbnVsbDsgKytpKSB7XG4gICAgICAgICAgICBjb25maWcuX2FbaV0gPSBpbnB1dFtpXSA9IGN1cnJlbnREYXRlW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gWmVybyBvdXQgd2hhdGV2ZXIgd2FzIG5vdCBkZWZhdWx0ZWQsIGluY2x1ZGluZyB0aW1lXG4gICAgICAgIGZvciAoOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICBjb25maWcuX2FbaV0gPSBpbnB1dFtpXSA9IChjb25maWcuX2FbaV0gPT0gbnVsbCkgPyAoaSA9PT0gMiA/IDEgOiAwKSA6IGNvbmZpZy5fYVtpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIGZvciAyNDowMDowMC4wMDBcbiAgICAgICAgaWYgKGNvbmZpZy5fYVtIT1VSXSA9PT0gMjQgJiZcbiAgICAgICAgICAgICAgICBjb25maWcuX2FbTUlOVVRFXSA9PT0gMCAmJlxuICAgICAgICAgICAgICAgIGNvbmZpZy5fYVtTRUNPTkRdID09PSAwICYmXG4gICAgICAgICAgICAgICAgY29uZmlnLl9hW01JTExJU0VDT05EXSA9PT0gMCkge1xuICAgICAgICAgICAgY29uZmlnLl9uZXh0RGF5ID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtIT1VSXSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWcuX2QgPSAoY29uZmlnLl91c2VVVEMgPyBjcmVhdGVVVENEYXRlIDogY3JlYXRlRGF0ZSkuYXBwbHkobnVsbCwgaW5wdXQpO1xuICAgICAgICBleHBlY3RlZFdlZWtkYXkgPSBjb25maWcuX3VzZVVUQyA/IGNvbmZpZy5fZC5nZXRVVENEYXkoKSA6IGNvbmZpZy5fZC5nZXREYXkoKTtcblxuICAgICAgICAvLyBBcHBseSB0aW1lem9uZSBvZmZzZXQgZnJvbSBpbnB1dC4gVGhlIGFjdHVhbCB1dGNPZmZzZXQgY2FuIGJlIGNoYW5nZWRcbiAgICAgICAgLy8gd2l0aCBwYXJzZVpvbmUuXG4gICAgICAgIGlmIChjb25maWcuX3R6bSAhPSBudWxsKSB7XG4gICAgICAgICAgICBjb25maWcuX2Quc2V0VVRDTWludXRlcyhjb25maWcuX2QuZ2V0VVRDTWludXRlcygpIC0gY29uZmlnLl90em0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZy5fbmV4dERheSkge1xuICAgICAgICAgICAgY29uZmlnLl9hW0hPVVJdID0gMjQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjaGVjayBmb3IgbWlzbWF0Y2hpbmcgZGF5IG9mIHdlZWtcbiAgICAgICAgaWYgKGNvbmZpZy5fdyAmJiB0eXBlb2YgY29uZmlnLl93LmQgIT09ICd1bmRlZmluZWQnICYmIGNvbmZpZy5fdy5kICE9PSBleHBlY3RlZFdlZWtkYXkpIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLndlZWtkYXlNaXNtYXRjaCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYXlPZlllYXJGcm9tV2Vla0luZm8oY29uZmlnKSB7XG4gICAgICAgIHZhciB3LCB3ZWVrWWVhciwgd2Vlaywgd2Vla2RheSwgZG93LCBkb3ksIHRlbXAsIHdlZWtkYXlPdmVyZmxvdztcblxuICAgICAgICB3ID0gY29uZmlnLl93O1xuICAgICAgICBpZiAody5HRyAhPSBudWxsIHx8IHcuVyAhPSBudWxsIHx8IHcuRSAhPSBudWxsKSB7XG4gICAgICAgICAgICBkb3cgPSAxO1xuICAgICAgICAgICAgZG95ID0gNDtcblxuICAgICAgICAgICAgLy8gVE9ETzogV2UgbmVlZCB0byB0YWtlIHRoZSBjdXJyZW50IGlzb1dlZWtZZWFyLCBidXQgdGhhdCBkZXBlbmRzIG9uXG4gICAgICAgICAgICAvLyBob3cgd2UgaW50ZXJwcmV0IG5vdyAobG9jYWwsIHV0YywgZml4ZWQgb2Zmc2V0KS4gU28gY3JlYXRlXG4gICAgICAgICAgICAvLyBhIG5vdyB2ZXJzaW9uIG9mIGN1cnJlbnQgY29uZmlnICh0YWtlIGxvY2FsL3V0Yy9vZmZzZXQgZmxhZ3MsIGFuZFxuICAgICAgICAgICAgLy8gY3JlYXRlIG5vdykuXG4gICAgICAgICAgICB3ZWVrWWVhciA9IGRlZmF1bHRzKHcuR0csIGNvbmZpZy5fYVtZRUFSXSwgd2Vla09mWWVhcihjcmVhdGVMb2NhbCgpLCAxLCA0KS55ZWFyKTtcbiAgICAgICAgICAgIHdlZWsgPSBkZWZhdWx0cyh3LlcsIDEpO1xuICAgICAgICAgICAgd2Vla2RheSA9IGRlZmF1bHRzKHcuRSwgMSk7XG4gICAgICAgICAgICBpZiAod2Vla2RheSA8IDEgfHwgd2Vla2RheSA+IDcpIHtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5T3ZlcmZsb3cgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG93ID0gY29uZmlnLl9sb2NhbGUuX3dlZWsuZG93O1xuICAgICAgICAgICAgZG95ID0gY29uZmlnLl9sb2NhbGUuX3dlZWsuZG95O1xuXG4gICAgICAgICAgICB2YXIgY3VyV2VlayA9IHdlZWtPZlllYXIoY3JlYXRlTG9jYWwoKSwgZG93LCBkb3kpO1xuXG4gICAgICAgICAgICB3ZWVrWWVhciA9IGRlZmF1bHRzKHcuZ2csIGNvbmZpZy5fYVtZRUFSXSwgY3VyV2Vlay55ZWFyKTtcblxuICAgICAgICAgICAgLy8gRGVmYXVsdCB0byBjdXJyZW50IHdlZWsuXG4gICAgICAgICAgICB3ZWVrID0gZGVmYXVsdHMody53LCBjdXJXZWVrLndlZWspO1xuXG4gICAgICAgICAgICBpZiAody5kICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyB3ZWVrZGF5IC0tIGxvdyBkYXkgbnVtYmVycyBhcmUgY29uc2lkZXJlZCBuZXh0IHdlZWtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5ID0gdy5kO1xuICAgICAgICAgICAgICAgIGlmICh3ZWVrZGF5IDwgMCB8fCB3ZWVrZGF5ID4gNikge1xuICAgICAgICAgICAgICAgICAgICB3ZWVrZGF5T3ZlcmZsb3cgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAody5lICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyBsb2NhbCB3ZWVrZGF5IC0tIGNvdW50aW5nIHN0YXJ0cyBmcm9tIGJlZ2luaW5nIG9mIHdlZWtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5ID0gdy5lICsgZG93O1xuICAgICAgICAgICAgICAgIGlmICh3LmUgPCAwIHx8IHcuZSA+IDYpIHtcbiAgICAgICAgICAgICAgICAgICAgd2Vla2RheU92ZXJmbG93ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgdG8gYmVnaW5pbmcgb2Ygd2Vla1xuICAgICAgICAgICAgICAgIHdlZWtkYXkgPSBkb3c7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHdlZWsgPCAxIHx8IHdlZWsgPiB3ZWVrc0luWWVhcih3ZWVrWWVhciwgZG93LCBkb3kpKSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5fb3ZlcmZsb3dXZWVrcyA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAod2Vla2RheU92ZXJmbG93ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLl9vdmVyZmxvd1dlZWtkYXkgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGVtcCA9IGRheU9mWWVhckZyb21XZWVrcyh3ZWVrWWVhciwgd2Vlaywgd2Vla2RheSwgZG93LCBkb3kpO1xuICAgICAgICAgICAgY29uZmlnLl9hW1lFQVJdID0gdGVtcC55ZWFyO1xuICAgICAgICAgICAgY29uZmlnLl9kYXlPZlllYXIgPSB0ZW1wLmRheU9mWWVhcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGlzbyA4NjAxIHJlZ2V4XG4gICAgLy8gMDAwMC0wMC0wMCAwMDAwLVcwMCBvciAwMDAwLVcwMC0wICsgVCArIDAwIG9yIDAwOjAwIG9yIDAwOjAwOjAwIG9yIDAwOjAwOjAwLjAwMCArICswMDowMCBvciArMDAwMCBvciArMDApXG4gICAgdmFyIGV4dGVuZGVkSXNvUmVnZXggPSAvXlxccyooKD86WystXVxcZHs2fXxcXGR7NH0pLSg/OlxcZFxcZC1cXGRcXGR8V1xcZFxcZC1cXGR8V1xcZFxcZHxcXGRcXGRcXGR8XFxkXFxkKSkoPzooVHwgKShcXGRcXGQoPzo6XFxkXFxkKD86OlxcZFxcZCg/OlsuLF1cXGQrKT8pPyk/KShbXFwrXFwtXVxcZFxcZCg/Ojo/XFxkXFxkKT98XFxzKlopPyk/JC87XG4gICAgdmFyIGJhc2ljSXNvUmVnZXggPSAvXlxccyooKD86WystXVxcZHs2fXxcXGR7NH0pKD86XFxkXFxkXFxkXFxkfFdcXGRcXGRcXGR8V1xcZFxcZHxcXGRcXGRcXGR8XFxkXFxkKSkoPzooVHwgKShcXGRcXGQoPzpcXGRcXGQoPzpcXGRcXGQoPzpbLixdXFxkKyk/KT8pPykoW1xcK1xcLV1cXGRcXGQoPzo6P1xcZFxcZCk/fFxccypaKT8pPyQvO1xuXG4gICAgdmFyIHR6UmVnZXggPSAvWnxbKy1dXFxkXFxkKD86Oj9cXGRcXGQpPy87XG5cbiAgICB2YXIgaXNvRGF0ZXMgPSBbXG4gICAgICAgIFsnWVlZWVlZLU1NLUREJywgL1srLV1cXGR7Nn0tXFxkXFxkLVxcZFxcZC9dLFxuICAgICAgICBbJ1lZWVktTU0tREQnLCAvXFxkezR9LVxcZFxcZC1cXGRcXGQvXSxcbiAgICAgICAgWydHR0dHLVtXXVdXLUUnLCAvXFxkezR9LVdcXGRcXGQtXFxkL10sXG4gICAgICAgIFsnR0dHRy1bV11XVycsIC9cXGR7NH0tV1xcZFxcZC8sIGZhbHNlXSxcbiAgICAgICAgWydZWVlZLURERCcsIC9cXGR7NH0tXFxkezN9L10sXG4gICAgICAgIFsnWVlZWS1NTScsIC9cXGR7NH0tXFxkXFxkLywgZmFsc2VdLFxuICAgICAgICBbJ1lZWVlZWU1NREQnLCAvWystXVxcZHsxMH0vXSxcbiAgICAgICAgWydZWVlZTU1ERCcsIC9cXGR7OH0vXSxcbiAgICAgICAgLy8gWVlZWU1NIGlzIE5PVCBhbGxvd2VkIGJ5IHRoZSBzdGFuZGFyZFxuICAgICAgICBbJ0dHR0dbV11XV0UnLCAvXFxkezR9V1xcZHszfS9dLFxuICAgICAgICBbJ0dHR0dbV11XVycsIC9cXGR7NH1XXFxkezJ9LywgZmFsc2VdLFxuICAgICAgICBbJ1lZWVlEREQnLCAvXFxkezd9L11cbiAgICBdO1xuXG4gICAgLy8gaXNvIHRpbWUgZm9ybWF0cyBhbmQgcmVnZXhlc1xuICAgIHZhciBpc29UaW1lcyA9IFtcbiAgICAgICAgWydISDptbTpzcy5TU1NTJywgL1xcZFxcZDpcXGRcXGQ6XFxkXFxkXFwuXFxkKy9dLFxuICAgICAgICBbJ0hIOm1tOnNzLFNTU1MnLCAvXFxkXFxkOlxcZFxcZDpcXGRcXGQsXFxkKy9dLFxuICAgICAgICBbJ0hIOm1tOnNzJywgL1xcZFxcZDpcXGRcXGQ6XFxkXFxkL10sXG4gICAgICAgIFsnSEg6bW0nLCAvXFxkXFxkOlxcZFxcZC9dLFxuICAgICAgICBbJ0hIbW1zcy5TU1NTJywgL1xcZFxcZFxcZFxcZFxcZFxcZFxcLlxcZCsvXSxcbiAgICAgICAgWydISG1tc3MsU1NTUycsIC9cXGRcXGRcXGRcXGRcXGRcXGQsXFxkKy9dLFxuICAgICAgICBbJ0hIbW1zcycsIC9cXGRcXGRcXGRcXGRcXGRcXGQvXSxcbiAgICAgICAgWydISG1tJywgL1xcZFxcZFxcZFxcZC9dLFxuICAgICAgICBbJ0hIJywgL1xcZFxcZC9dXG4gICAgXTtcblxuICAgIHZhciBhc3BOZXRKc29uUmVnZXggPSAvXlxcLz9EYXRlXFwoKFxcLT9cXGQrKS9pO1xuXG4gICAgLy8gZGF0ZSBmcm9tIGlzbyBmb3JtYXRcbiAgICBmdW5jdGlvbiBjb25maWdGcm9tSVNPKGNvbmZpZykge1xuICAgICAgICB2YXIgaSwgbCxcbiAgICAgICAgICAgIHN0cmluZyA9IGNvbmZpZy5faSxcbiAgICAgICAgICAgIG1hdGNoID0gZXh0ZW5kZWRJc29SZWdleC5leGVjKHN0cmluZykgfHwgYmFzaWNJc29SZWdleC5leGVjKHN0cmluZyksXG4gICAgICAgICAgICBhbGxvd1RpbWUsIGRhdGVGb3JtYXQsIHRpbWVGb3JtYXQsIHR6Rm9ybWF0O1xuXG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuaXNvID0gdHJ1ZTtcblxuICAgICAgICAgICAgZm9yIChpID0gMCwgbCA9IGlzb0RhdGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpc29EYXRlc1tpXVsxXS5leGVjKG1hdGNoWzFdKSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRlRm9ybWF0ID0gaXNvRGF0ZXNbaV1bMF07XG4gICAgICAgICAgICAgICAgICAgIGFsbG93VGltZSA9IGlzb0RhdGVzW2ldWzJdICE9PSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRhdGVGb3JtYXQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYXRjaFszXSkge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGwgPSBpc29UaW1lcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzb1RpbWVzW2ldWzFdLmV4ZWMobWF0Y2hbM10pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYXRjaFsyXSBzaG91bGQgYmUgJ1QnIG9yIHNwYWNlXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lRm9ybWF0ID0gKG1hdGNoWzJdIHx8ICcgJykgKyBpc29UaW1lc1tpXVswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aW1lRm9ybWF0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWFsbG93VGltZSAmJiB0aW1lRm9ybWF0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWF0Y2hbNF0pIHtcbiAgICAgICAgICAgICAgICBpZiAodHpSZWdleC5leGVjKG1hdGNoWzRdKSkge1xuICAgICAgICAgICAgICAgICAgICB0ekZvcm1hdCA9ICdaJztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbmZpZy5fZiA9IGRhdGVGb3JtYXQgKyAodGltZUZvcm1hdCB8fCAnJykgKyAodHpGb3JtYXQgfHwgJycpO1xuICAgICAgICAgICAgY29uZmlnRnJvbVN0cmluZ0FuZEZvcm1hdChjb25maWcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uZmlnLl9pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSRkMgMjgyMiByZWdleDogRm9yIGRldGFpbHMgc2VlIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMyODIyI3NlY3Rpb24tMy4zXG4gICAgdmFyIHJmYzI4MjIgPSAvXig/OihNb258VHVlfFdlZHxUaHV8RnJpfFNhdHxTdW4pLD9cXHMpPyhcXGR7MSwyfSlcXHMoSmFufEZlYnxNYXJ8QXByfE1heXxKdW58SnVsfEF1Z3xTZXB8T2N0fE5vdnxEZWMpXFxzKFxcZHsyLDR9KVxccyhcXGRcXGQpOihcXGRcXGQpKD86OihcXGRcXGQpKT9cXHMoPzooVVR8R01UfFtFQ01QXVtTRF1UKXwoW1p6XSl8KFsrLV1cXGR7NH0pKSQvO1xuXG4gICAgZnVuY3Rpb24gZXh0cmFjdEZyb21SRkMyODIyU3RyaW5ncyh5ZWFyU3RyLCBtb250aFN0ciwgZGF5U3RyLCBob3VyU3RyLCBtaW51dGVTdHIsIHNlY29uZFN0cikge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW1xuICAgICAgICAgICAgdW50cnVuY2F0ZVllYXIoeWVhclN0ciksXG4gICAgICAgICAgICBkZWZhdWx0TG9jYWxlTW9udGhzU2hvcnQuaW5kZXhPZihtb250aFN0ciksXG4gICAgICAgICAgICBwYXJzZUludChkYXlTdHIsIDEwKSxcbiAgICAgICAgICAgIHBhcnNlSW50KGhvdXJTdHIsIDEwKSxcbiAgICAgICAgICAgIHBhcnNlSW50KG1pbnV0ZVN0ciwgMTApXG4gICAgICAgIF07XG5cbiAgICAgICAgaWYgKHNlY29uZFN0cikge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2gocGFyc2VJbnQoc2Vjb25kU3RyLCAxMCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1bnRydW5jYXRlWWVhcih5ZWFyU3RyKSB7XG4gICAgICAgIHZhciB5ZWFyID0gcGFyc2VJbnQoeWVhclN0ciwgMTApO1xuICAgICAgICBpZiAoeWVhciA8PSA0OSkge1xuICAgICAgICAgICAgcmV0dXJuIDIwMDAgKyB5ZWFyO1xuICAgICAgICB9IGVsc2UgaWYgKHllYXIgPD0gOTk5KSB7XG4gICAgICAgICAgICByZXR1cm4gMTkwMCArIHllYXI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHllYXI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJlcHJvY2Vzc1JGQzI4MjIocykge1xuICAgICAgICAvLyBSZW1vdmUgY29tbWVudHMgYW5kIGZvbGRpbmcgd2hpdGVzcGFjZSBhbmQgcmVwbGFjZSBtdWx0aXBsZS1zcGFjZXMgd2l0aCBhIHNpbmdsZSBzcGFjZVxuICAgICAgICByZXR1cm4gcy5yZXBsYWNlKC9cXChbXildKlxcKXxbXFxuXFx0XS9nLCAnICcpLnJlcGxhY2UoLyhcXHNcXHMrKS9nLCAnICcpLnJlcGxhY2UoL15cXHNcXHMqLywgJycpLnJlcGxhY2UoL1xcc1xccyokLywgJycpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrV2Vla2RheSh3ZWVrZGF5U3RyLCBwYXJzZWRJbnB1dCwgY29uZmlnKSB7XG4gICAgICAgIGlmICh3ZWVrZGF5U3RyKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBSZXBsYWNlIHRoZSB2YW5pbGxhIEpTIERhdGUgb2JqZWN0IHdpdGggYW4gaW5kZXBlbnRlbnQgZGF5LW9mLXdlZWsgY2hlY2suXG4gICAgICAgICAgICB2YXIgd2Vla2RheVByb3ZpZGVkID0gZGVmYXVsdExvY2FsZVdlZWtkYXlzU2hvcnQuaW5kZXhPZih3ZWVrZGF5U3RyKSxcbiAgICAgICAgICAgICAgICB3ZWVrZGF5QWN0dWFsID0gbmV3IERhdGUocGFyc2VkSW5wdXRbMF0sIHBhcnNlZElucHV0WzFdLCBwYXJzZWRJbnB1dFsyXSkuZ2V0RGF5KCk7XG4gICAgICAgICAgICBpZiAod2Vla2RheVByb3ZpZGVkICE9PSB3ZWVrZGF5QWN0dWFsKSB7XG4gICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykud2Vla2RheU1pc21hdGNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdmFyIG9ic09mZnNldHMgPSB7XG4gICAgICAgIFVUOiAwLFxuICAgICAgICBHTVQ6IDAsXG4gICAgICAgIEVEVDogLTQgKiA2MCxcbiAgICAgICAgRVNUOiAtNSAqIDYwLFxuICAgICAgICBDRFQ6IC01ICogNjAsXG4gICAgICAgIENTVDogLTYgKiA2MCxcbiAgICAgICAgTURUOiAtNiAqIDYwLFxuICAgICAgICBNU1Q6IC03ICogNjAsXG4gICAgICAgIFBEVDogLTcgKiA2MCxcbiAgICAgICAgUFNUOiAtOCAqIDYwXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZU9mZnNldChvYnNPZmZzZXQsIG1pbGl0YXJ5T2Zmc2V0LCBudW1PZmZzZXQpIHtcbiAgICAgICAgaWYgKG9ic09mZnNldCkge1xuICAgICAgICAgICAgcmV0dXJuIG9ic09mZnNldHNbb2JzT2Zmc2V0XTtcbiAgICAgICAgfSBlbHNlIGlmIChtaWxpdGFyeU9mZnNldCkge1xuICAgICAgICAgICAgLy8gdGhlIG9ubHkgYWxsb3dlZCBtaWxpdGFyeSB0eiBpcyBaXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBobSA9IHBhcnNlSW50KG51bU9mZnNldCwgMTApO1xuICAgICAgICAgICAgdmFyIG0gPSBobSAlIDEwMCwgaCA9IChobSAtIG0pIC8gMTAwO1xuICAgICAgICAgICAgcmV0dXJuIGggKiA2MCArIG07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkYXRlIGFuZCB0aW1lIGZyb20gcmVmIDI4MjIgZm9ybWF0XG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbVJGQzI4MjIoY29uZmlnKSB7XG4gICAgICAgIHZhciBtYXRjaCA9IHJmYzI4MjIuZXhlYyhwcmVwcm9jZXNzUkZDMjgyMihjb25maWcuX2kpKTtcbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICB2YXIgcGFyc2VkQXJyYXkgPSBleHRyYWN0RnJvbVJGQzI4MjJTdHJpbmdzKG1hdGNoWzRdLCBtYXRjaFszXSwgbWF0Y2hbMl0sIG1hdGNoWzVdLCBtYXRjaFs2XSwgbWF0Y2hbN10pO1xuICAgICAgICAgICAgaWYgKCFjaGVja1dlZWtkYXkobWF0Y2hbMV0sIHBhcnNlZEFycmF5LCBjb25maWcpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25maWcuX2EgPSBwYXJzZWRBcnJheTtcbiAgICAgICAgICAgIGNvbmZpZy5fdHptID0gY2FsY3VsYXRlT2Zmc2V0KG1hdGNoWzhdLCBtYXRjaFs5XSwgbWF0Y2hbMTBdKTtcblxuICAgICAgICAgICAgY29uZmlnLl9kID0gY3JlYXRlVVRDRGF0ZS5hcHBseShudWxsLCBjb25maWcuX2EpO1xuICAgICAgICAgICAgY29uZmlnLl9kLnNldFVUQ01pbnV0ZXMoY29uZmlnLl9kLmdldFVUQ01pbnV0ZXMoKSAtIGNvbmZpZy5fdHptKTtcblxuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykucmZjMjgyMiA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGRhdGUgZnJvbSBpc28gZm9ybWF0IG9yIGZhbGxiYWNrXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbVN0cmluZyhjb25maWcpIHtcbiAgICAgICAgdmFyIG1hdGNoZWQgPSBhc3BOZXRKc29uUmVnZXguZXhlYyhjb25maWcuX2kpO1xuXG4gICAgICAgIGlmIChtYXRjaGVkICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZSgrbWF0Y2hlZFsxXSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWdGcm9tSVNPKGNvbmZpZyk7XG4gICAgICAgIGlmIChjb25maWcuX2lzVmFsaWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBkZWxldGUgY29uZmlnLl9pc1ZhbGlkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlnRnJvbVJGQzI4MjIoY29uZmlnKTtcbiAgICAgICAgaWYgKGNvbmZpZy5faXNWYWxpZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjb25maWcuX2lzVmFsaWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGaW5hbCBhdHRlbXB0LCB1c2UgSW5wdXQgRmFsbGJhY2tcbiAgICAgICAgaG9va3MuY3JlYXRlRnJvbUlucHV0RmFsbGJhY2soY29uZmlnKTtcbiAgICB9XG5cbiAgICBob29rcy5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayA9IGRlcHJlY2F0ZShcbiAgICAgICAgJ3ZhbHVlIHByb3ZpZGVkIGlzIG5vdCBpbiBhIHJlY29nbml6ZWQgUkZDMjgyMiBvciBJU08gZm9ybWF0LiBtb21lbnQgY29uc3RydWN0aW9uIGZhbGxzIGJhY2sgdG8ganMgRGF0ZSgpLCAnICtcbiAgICAgICAgJ3doaWNoIGlzIG5vdCByZWxpYWJsZSBhY3Jvc3MgYWxsIGJyb3dzZXJzIGFuZCB2ZXJzaW9ucy4gTm9uIFJGQzI4MjIvSVNPIGRhdGUgZm9ybWF0cyBhcmUgJyArXG4gICAgICAgICdkaXNjb3VyYWdlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIGFuIHVwY29taW5nIG1ham9yIHJlbGVhc2UuIFBsZWFzZSByZWZlciB0byAnICtcbiAgICAgICAgJ2h0dHA6Ly9tb21lbnRqcy5jb20vZ3VpZGVzLyMvd2FybmluZ3MvanMtZGF0ZS8gZm9yIG1vcmUgaW5mby4nLFxuICAgICAgICBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShjb25maWcuX2kgKyAoY29uZmlnLl91c2VVVEMgPyAnIFVUQycgOiAnJykpO1xuICAgICAgICB9XG4gICAgKTtcblxuICAgIC8vIGNvbnN0YW50IHRoYXQgcmVmZXJzIHRvIHRoZSBJU08gc3RhbmRhcmRcbiAgICBob29rcy5JU09fODYwMSA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgLy8gY29uc3RhbnQgdGhhdCByZWZlcnMgdG8gdGhlIFJGQyAyODIyIGZvcm1cbiAgICBob29rcy5SRkNfMjgyMiA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgLy8gZGF0ZSBmcm9tIHN0cmluZyBhbmQgZm9ybWF0IHN0cmluZ1xuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21TdHJpbmdBbmRGb3JtYXQoY29uZmlnKSB7XG4gICAgICAgIC8vIFRPRE86IE1vdmUgdGhpcyB0byBhbm90aGVyIHBhcnQgb2YgdGhlIGNyZWF0aW9uIGZsb3cgdG8gcHJldmVudCBjaXJjdWxhciBkZXBzXG4gICAgICAgIGlmIChjb25maWcuX2YgPT09IGhvb2tzLklTT184NjAxKSB7XG4gICAgICAgICAgICBjb25maWdGcm9tSVNPKGNvbmZpZyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbmZpZy5fZiA9PT0gaG9va3MuUkZDXzI4MjIpIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21SRkMyODIyKGNvbmZpZyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uZmlnLl9hID0gW107XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmVtcHR5ID0gdHJ1ZTtcblxuICAgICAgICAvLyBUaGlzIGFycmF5IGlzIHVzZWQgdG8gbWFrZSBhIERhdGUsIGVpdGhlciB3aXRoIGBuZXcgRGF0ZWAgb3IgYERhdGUuVVRDYFxuICAgICAgICB2YXIgc3RyaW5nID0gJycgKyBjb25maWcuX2ksXG4gICAgICAgICAgICBpLCBwYXJzZWRJbnB1dCwgdG9rZW5zLCB0b2tlbiwgc2tpcHBlZCxcbiAgICAgICAgICAgIHN0cmluZ0xlbmd0aCA9IHN0cmluZy5sZW5ndGgsXG4gICAgICAgICAgICB0b3RhbFBhcnNlZElucHV0TGVuZ3RoID0gMDtcblxuICAgICAgICB0b2tlbnMgPSBleHBhbmRGb3JtYXQoY29uZmlnLl9mLCBjb25maWcuX2xvY2FsZSkubWF0Y2goZm9ybWF0dGluZ1Rva2VucykgfHwgW107XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdG9rZW4gPSB0b2tlbnNbaV07XG4gICAgICAgICAgICBwYXJzZWRJbnB1dCA9IChzdHJpbmcubWF0Y2goZ2V0UGFyc2VSZWdleEZvclRva2VuKHRva2VuLCBjb25maWcpKSB8fCBbXSlbMF07XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygndG9rZW4nLCB0b2tlbiwgJ3BhcnNlZElucHV0JywgcGFyc2VkSW5wdXQsXG4gICAgICAgICAgICAvLyAgICAgICAgICdyZWdleCcsIGdldFBhcnNlUmVnZXhGb3JUb2tlbih0b2tlbiwgY29uZmlnKSk7XG4gICAgICAgICAgICBpZiAocGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICBza2lwcGVkID0gc3RyaW5nLnN1YnN0cigwLCBzdHJpbmcuaW5kZXhPZihwYXJzZWRJbnB1dCkpO1xuICAgICAgICAgICAgICAgIGlmIChza2lwcGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykudW51c2VkSW5wdXQucHVzaChza2lwcGVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3RyaW5nID0gc3RyaW5nLnNsaWNlKHN0cmluZy5pbmRleE9mKHBhcnNlZElucHV0KSArIHBhcnNlZElucHV0Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgdG90YWxQYXJzZWRJbnB1dExlbmd0aCArPSBwYXJzZWRJbnB1dC5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBkb24ndCBwYXJzZSBpZiBpdCdzIG5vdCBhIGtub3duIHRva2VuXG4gICAgICAgICAgICBpZiAoZm9ybWF0VG9rZW5GdW5jdGlvbnNbdG9rZW5dKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlZElucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmVtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS51bnVzZWRUb2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFkZFRpbWVUb0FycmF5RnJvbVRva2VuKHRva2VuLCBwYXJzZWRJbnB1dCwgY29uZmlnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbmZpZy5fc3RyaWN0ICYmICFwYXJzZWRJbnB1dCkge1xuICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnVudXNlZFRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFkZCByZW1haW5pbmcgdW5wYXJzZWQgaW5wdXQgbGVuZ3RoIHRvIHRoZSBzdHJpbmdcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuY2hhcnNMZWZ0T3ZlciA9IHN0cmluZ0xlbmd0aCAtIHRvdGFsUGFyc2VkSW5wdXRMZW5ndGg7XG4gICAgICAgIGlmIChzdHJpbmcubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykudW51c2VkSW5wdXQucHVzaChzdHJpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2xlYXIgXzEyaCBmbGFnIGlmIGhvdXIgaXMgPD0gMTJcbiAgICAgICAgaWYgKGNvbmZpZy5fYVtIT1VSXSA8PSAxMiAmJlxuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuYmlnSG91ciA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgY29uZmlnLl9hW0hPVVJdID4gMCkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuYmlnSG91ciA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnBhcnNlZERhdGVQYXJ0cyA9IGNvbmZpZy5fYS5zbGljZSgwKTtcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykubWVyaWRpZW0gPSBjb25maWcuX21lcmlkaWVtO1xuICAgICAgICAvLyBoYW5kbGUgbWVyaWRpZW1cbiAgICAgICAgY29uZmlnLl9hW0hPVVJdID0gbWVyaWRpZW1GaXhXcmFwKGNvbmZpZy5fbG9jYWxlLCBjb25maWcuX2FbSE9VUl0sIGNvbmZpZy5fbWVyaWRpZW0pO1xuXG4gICAgICAgIGNvbmZpZ0Zyb21BcnJheShjb25maWcpO1xuICAgICAgICBjaGVja092ZXJmbG93KGNvbmZpZyk7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBtZXJpZGllbUZpeFdyYXAgKGxvY2FsZSwgaG91ciwgbWVyaWRpZW0pIHtcbiAgICAgICAgdmFyIGlzUG07XG5cbiAgICAgICAgaWYgKG1lcmlkaWVtID09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIG5vdGhpbmcgdG8gZG9cbiAgICAgICAgICAgIHJldHVybiBob3VyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb2NhbGUubWVyaWRpZW1Ib3VyICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbGUubWVyaWRpZW1Ib3VyKGhvdXIsIG1lcmlkaWVtKTtcbiAgICAgICAgfSBlbHNlIGlmIChsb2NhbGUuaXNQTSAhPSBudWxsKSB7XG4gICAgICAgICAgICAvLyBGYWxsYmFja1xuICAgICAgICAgICAgaXNQbSA9IGxvY2FsZS5pc1BNKG1lcmlkaWVtKTtcbiAgICAgICAgICAgIGlmIChpc1BtICYmIGhvdXIgPCAxMikge1xuICAgICAgICAgICAgICAgIGhvdXIgKz0gMTI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzUG0gJiYgaG91ciA9PT0gMTIpIHtcbiAgICAgICAgICAgICAgICBob3VyID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBob3VyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGhpcyBpcyBub3Qgc3VwcG9zZWQgdG8gaGFwcGVuXG4gICAgICAgICAgICByZXR1cm4gaG91cjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGRhdGUgZnJvbSBzdHJpbmcgYW5kIGFycmF5IG9mIGZvcm1hdCBzdHJpbmdzXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbVN0cmluZ0FuZEFycmF5KGNvbmZpZykge1xuICAgICAgICB2YXIgdGVtcENvbmZpZyxcbiAgICAgICAgICAgIGJlc3RNb21lbnQsXG5cbiAgICAgICAgICAgIHNjb3JlVG9CZWF0LFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZTtcblxuICAgICAgICBpZiAoY29uZmlnLl9mLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuaW52YWxpZEZvcm1hdCA9IHRydWU7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShOYU4pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNvbmZpZy5fZi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY3VycmVudFNjb3JlID0gMDtcbiAgICAgICAgICAgIHRlbXBDb25maWcgPSBjb3B5Q29uZmlnKHt9LCBjb25maWcpO1xuICAgICAgICAgICAgaWYgKGNvbmZpZy5fdXNlVVRDICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0ZW1wQ29uZmlnLl91c2VVVEMgPSBjb25maWcuX3VzZVVUQztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlbXBDb25maWcuX2YgPSBjb25maWcuX2ZbaV07XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KHRlbXBDb25maWcpO1xuXG4gICAgICAgICAgICBpZiAoIWlzVmFsaWQodGVtcENvbmZpZykpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgYW55IGlucHV0IHRoYXQgd2FzIG5vdCBwYXJzZWQgYWRkIGEgcGVuYWx0eSBmb3IgdGhhdCBmb3JtYXRcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZSArPSBnZXRQYXJzaW5nRmxhZ3ModGVtcENvbmZpZykuY2hhcnNMZWZ0T3ZlcjtcblxuICAgICAgICAgICAgLy9vciB0b2tlbnNcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZSArPSBnZXRQYXJzaW5nRmxhZ3ModGVtcENvbmZpZykudW51c2VkVG9rZW5zLmxlbmd0aCAqIDEwO1xuXG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3ModGVtcENvbmZpZykuc2NvcmUgPSBjdXJyZW50U2NvcmU7XG5cbiAgICAgICAgICAgIGlmIChzY29yZVRvQmVhdCA9PSBudWxsIHx8IGN1cnJlbnRTY29yZSA8IHNjb3JlVG9CZWF0KSB7XG4gICAgICAgICAgICAgICAgc2NvcmVUb0JlYXQgPSBjdXJyZW50U2NvcmU7XG4gICAgICAgICAgICAgICAgYmVzdE1vbWVudCA9IHRlbXBDb25maWc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHRlbmQoY29uZmlnLCBiZXN0TW9tZW50IHx8IHRlbXBDb25maWcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21PYmplY3QoY29uZmlnKSB7XG4gICAgICAgIGlmIChjb25maWcuX2QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpID0gbm9ybWFsaXplT2JqZWN0VW5pdHMoY29uZmlnLl9pKTtcbiAgICAgICAgY29uZmlnLl9hID0gbWFwKFtpLnllYXIsIGkubW9udGgsIGkuZGF5IHx8IGkuZGF0ZSwgaS5ob3VyLCBpLm1pbnV0ZSwgaS5zZWNvbmQsIGkubWlsbGlzZWNvbmRdLCBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqICYmIHBhcnNlSW50KG9iaiwgMTApO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25maWdGcm9tQXJyYXkoY29uZmlnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVGcm9tQ29uZmlnIChjb25maWcpIHtcbiAgICAgICAgdmFyIHJlcyA9IG5ldyBNb21lbnQoY2hlY2tPdmVyZmxvdyhwcmVwYXJlQ29uZmlnKGNvbmZpZykpKTtcbiAgICAgICAgaWYgKHJlcy5fbmV4dERheSkge1xuICAgICAgICAgICAgLy8gQWRkaW5nIGlzIHNtYXJ0IGVub3VnaCBhcm91bmQgRFNUXG4gICAgICAgICAgICByZXMuYWRkKDEsICdkJyk7XG4gICAgICAgICAgICByZXMuX25leHREYXkgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByZXBhcmVDb25maWcgKGNvbmZpZykge1xuICAgICAgICB2YXIgaW5wdXQgPSBjb25maWcuX2ksXG4gICAgICAgICAgICBmb3JtYXQgPSBjb25maWcuX2Y7XG5cbiAgICAgICAgY29uZmlnLl9sb2NhbGUgPSBjb25maWcuX2xvY2FsZSB8fCBnZXRMb2NhbGUoY29uZmlnLl9sKTtcblxuICAgICAgICBpZiAoaW5wdXQgPT09IG51bGwgfHwgKGZvcm1hdCA9PT0gdW5kZWZpbmVkICYmIGlucHV0ID09PSAnJykpIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVJbnZhbGlkKHtudWxsSW5wdXQ6IHRydWV9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBjb25maWcuX2kgPSBpbnB1dCA9IGNvbmZpZy5fbG9jYWxlLnByZXBhcnNlKGlucHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc01vbWVudChpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTW9tZW50KGNoZWNrT3ZlcmZsb3coaW5wdXQpKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0RhdGUoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBpbnB1dDtcbiAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5KGZvcm1hdCkpIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21TdHJpbmdBbmRBcnJheShjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdCkge1xuICAgICAgICAgICAgY29uZmlnRnJvbVN0cmluZ0FuZEZvcm1hdChjb25maWcpO1xuICAgICAgICB9ICBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21JbnB1dChjb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc1ZhbGlkKGNvbmZpZykpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29uZmlnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21JbnB1dChjb25maWcpIHtcbiAgICAgICAgdmFyIGlucHV0ID0gY29uZmlnLl9pO1xuICAgICAgICBpZiAoaXNVbmRlZmluZWQoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShob29rcy5ub3coKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNEYXRlKGlucHV0KSkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoaW5wdXQudmFsdWVPZigpKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nKGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShpbnB1dCkpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYSA9IG1hcChpbnB1dC5zbGljZSgwKSwgZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludChvYmosIDEwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uZmlnRnJvbUFycmF5KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3QoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWdGcm9tT2JqZWN0KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNOdW1iZXIoaW5wdXQpKSB7XG4gICAgICAgICAgICAvLyBmcm9tIG1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoaW5wdXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaG9va3MuY3JlYXRlRnJvbUlucHV0RmFsbGJhY2soY29uZmlnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUxvY2FsT3JVVEMgKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0LCBpc1VUQykge1xuICAgICAgICB2YXIgYyA9IHt9O1xuXG4gICAgICAgIGlmIChsb2NhbGUgPT09IHRydWUgfHwgbG9jYWxlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgc3RyaWN0ID0gbG9jYWxlO1xuICAgICAgICAgICAgbG9jYWxlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKChpc09iamVjdChpbnB1dCkgJiYgaXNPYmplY3RFbXB0eShpbnB1dCkpIHx8XG4gICAgICAgICAgICAgICAgKGlzQXJyYXkoaW5wdXQpICYmIGlucHV0Lmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgICAgICAgIGlucHV0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIC8vIG9iamVjdCBjb25zdHJ1Y3Rpb24gbXVzdCBiZSBkb25lIHRoaXMgd2F5LlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTQyM1xuICAgICAgICBjLl9pc0FNb21lbnRPYmplY3QgPSB0cnVlO1xuICAgICAgICBjLl91c2VVVEMgPSBjLl9pc1VUQyA9IGlzVVRDO1xuICAgICAgICBjLl9sID0gbG9jYWxlO1xuICAgICAgICBjLl9pID0gaW5wdXQ7XG4gICAgICAgIGMuX2YgPSBmb3JtYXQ7XG4gICAgICAgIGMuX3N0cmljdCA9IHN0cmljdDtcblxuICAgICAgICByZXR1cm4gY3JlYXRlRnJvbUNvbmZpZyhjKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVMb2NhbCAoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUxvY2FsT3JVVEMoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QsIGZhbHNlKTtcbiAgICB9XG5cbiAgICB2YXIgcHJvdG90eXBlTWluID0gZGVwcmVjYXRlKFxuICAgICAgICAnbW9tZW50KCkubWluIGlzIGRlcHJlY2F0ZWQsIHVzZSBtb21lbnQubWF4IGluc3RlYWQuIGh0dHA6Ly9tb21lbnRqcy5jb20vZ3VpZGVzLyMvd2FybmluZ3MvbWluLW1heC8nLFxuICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgb3RoZXIgPSBjcmVhdGVMb2NhbC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNWYWxpZCgpICYmIG90aGVyLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvdGhlciA8IHRoaXMgPyB0aGlzIDogb3RoZXI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVJbnZhbGlkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgdmFyIHByb3RvdHlwZU1heCA9IGRlcHJlY2F0ZShcbiAgICAgICAgJ21vbWVudCgpLm1heCBpcyBkZXByZWNhdGVkLCB1c2UgbW9tZW50Lm1pbiBpbnN0ZWFkLiBodHRwOi8vbW9tZW50anMuY29tL2d1aWRlcy8jL3dhcm5pbmdzL21pbi1tYXgvJyxcbiAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG90aGVyID0gY3JlYXRlTG9jYWwuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzVmFsaWQoKSAmJiBvdGhlci5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3RoZXIgPiB0aGlzID8gdGhpcyA6IG90aGVyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlSW52YWxpZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgKTtcblxuICAgIC8vIFBpY2sgYSBtb21lbnQgbSBmcm9tIG1vbWVudHMgc28gdGhhdCBtW2ZuXShvdGhlcikgaXMgdHJ1ZSBmb3IgYWxsXG4gICAgLy8gb3RoZXIuIFRoaXMgcmVsaWVzIG9uIHRoZSBmdW5jdGlvbiBmbiB0byBiZSB0cmFuc2l0aXZlLlxuICAgIC8vXG4gICAgLy8gbW9tZW50cyBzaG91bGQgZWl0aGVyIGJlIGFuIGFycmF5IG9mIG1vbWVudCBvYmplY3RzIG9yIGFuIGFycmF5LCB3aG9zZVxuICAgIC8vIGZpcnN0IGVsZW1lbnQgaXMgYW4gYXJyYXkgb2YgbW9tZW50IG9iamVjdHMuXG4gICAgZnVuY3Rpb24gcGlja0J5KGZuLCBtb21lbnRzKSB7XG4gICAgICAgIHZhciByZXMsIGk7XG4gICAgICAgIGlmIChtb21lbnRzLmxlbmd0aCA9PT0gMSAmJiBpc0FycmF5KG1vbWVudHNbMF0pKSB7XG4gICAgICAgICAgICBtb21lbnRzID0gbW9tZW50c1swXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW1vbWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlTG9jYWwoKTtcbiAgICAgICAgfVxuICAgICAgICByZXMgPSBtb21lbnRzWzBdO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbW9tZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgaWYgKCFtb21lbnRzW2ldLmlzVmFsaWQoKSB8fCBtb21lbnRzW2ldW2ZuXShyZXMpKSB7XG4gICAgICAgICAgICAgICAgcmVzID0gbW9tZW50c1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIC8vIFRPRE86IFVzZSBbXS5zb3J0IGluc3RlYWQ/XG4gICAgZnVuY3Rpb24gbWluICgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG5cbiAgICAgICAgcmV0dXJuIHBpY2tCeSgnaXNCZWZvcmUnLCBhcmdzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXggKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICByZXR1cm4gcGlja0J5KCdpc0FmdGVyJywgYXJncyk7XG4gICAgfVxuXG4gICAgdmFyIG5vdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIERhdGUubm93ID8gRGF0ZS5ub3coKSA6ICsobmV3IERhdGUoKSk7XG4gICAgfTtcblxuICAgIHZhciBvcmRlcmluZyA9IFsneWVhcicsICdxdWFydGVyJywgJ21vbnRoJywgJ3dlZWsnLCAnZGF5JywgJ2hvdXInLCAnbWludXRlJywgJ3NlY29uZCcsICdtaWxsaXNlY29uZCddO1xuXG4gICAgZnVuY3Rpb24gaXNEdXJhdGlvblZhbGlkKG0pIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG0pIHtcbiAgICAgICAgICAgIGlmICghKGluZGV4T2YuY2FsbChvcmRlcmluZywga2V5KSAhPT0gLTEgJiYgKG1ba2V5XSA9PSBudWxsIHx8ICFpc05hTihtW2tleV0pKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdW5pdEhhc0RlY2ltYWwgPSBmYWxzZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvcmRlcmluZy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgaWYgKG1bb3JkZXJpbmdbaV1dKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVuaXRIYXNEZWNpbWFsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gb25seSBhbGxvdyBub24taW50ZWdlcnMgZm9yIHNtYWxsZXN0IHVuaXRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlRmxvYXQobVtvcmRlcmluZ1tpXV0pICE9PSB0b0ludChtW29yZGVyaW5nW2ldXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdW5pdEhhc0RlY2ltYWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzVmFsaWQkMSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzVmFsaWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlSW52YWxpZCQxKCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlRHVyYXRpb24oTmFOKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBEdXJhdGlvbiAoZHVyYXRpb24pIHtcbiAgICAgICAgdmFyIG5vcm1hbGl6ZWRJbnB1dCA9IG5vcm1hbGl6ZU9iamVjdFVuaXRzKGR1cmF0aW9uKSxcbiAgICAgICAgICAgIHllYXJzID0gbm9ybWFsaXplZElucHV0LnllYXIgfHwgMCxcbiAgICAgICAgICAgIHF1YXJ0ZXJzID0gbm9ybWFsaXplZElucHV0LnF1YXJ0ZXIgfHwgMCxcbiAgICAgICAgICAgIG1vbnRocyA9IG5vcm1hbGl6ZWRJbnB1dC5tb250aCB8fCAwLFxuICAgICAgICAgICAgd2Vla3MgPSBub3JtYWxpemVkSW5wdXQud2VlayB8fCAwLFxuICAgICAgICAgICAgZGF5cyA9IG5vcm1hbGl6ZWRJbnB1dC5kYXkgfHwgMCxcbiAgICAgICAgICAgIGhvdXJzID0gbm9ybWFsaXplZElucHV0LmhvdXIgfHwgMCxcbiAgICAgICAgICAgIG1pbnV0ZXMgPSBub3JtYWxpemVkSW5wdXQubWludXRlIHx8IDAsXG4gICAgICAgICAgICBzZWNvbmRzID0gbm9ybWFsaXplZElucHV0LnNlY29uZCB8fCAwLFxuICAgICAgICAgICAgbWlsbGlzZWNvbmRzID0gbm9ybWFsaXplZElucHV0Lm1pbGxpc2Vjb25kIHx8IDA7XG5cbiAgICAgICAgdGhpcy5faXNWYWxpZCA9IGlzRHVyYXRpb25WYWxpZChub3JtYWxpemVkSW5wdXQpO1xuXG4gICAgICAgIC8vIHJlcHJlc2VudGF0aW9uIGZvciBkYXRlQWRkUmVtb3ZlXG4gICAgICAgIHRoaXMuX21pbGxpc2Vjb25kcyA9ICttaWxsaXNlY29uZHMgK1xuICAgICAgICAgICAgc2Vjb25kcyAqIDFlMyArIC8vIDEwMDBcbiAgICAgICAgICAgIG1pbnV0ZXMgKiA2ZTQgKyAvLyAxMDAwICogNjBcbiAgICAgICAgICAgIGhvdXJzICogMTAwMCAqIDYwICogNjA7IC8vdXNpbmcgMTAwMCAqIDYwICogNjAgaW5zdGVhZCBvZiAzNmU1IHRvIGF2b2lkIGZsb2F0aW5nIHBvaW50IHJvdW5kaW5nIGVycm9ycyBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMjk3OFxuICAgICAgICAvLyBCZWNhdXNlIG9mIGRhdGVBZGRSZW1vdmUgdHJlYXRzIDI0IGhvdXJzIGFzIGRpZmZlcmVudCBmcm9tIGFcbiAgICAgICAgLy8gZGF5IHdoZW4gd29ya2luZyBhcm91bmQgRFNULCB3ZSBuZWVkIHRvIHN0b3JlIHRoZW0gc2VwYXJhdGVseVxuICAgICAgICB0aGlzLl9kYXlzID0gK2RheXMgK1xuICAgICAgICAgICAgd2Vla3MgKiA3O1xuICAgICAgICAvLyBJdCBpcyBpbXBvc3NpYmxlIHRvIHRyYW5zbGF0ZSBtb250aHMgaW50byBkYXlzIHdpdGhvdXQga25vd2luZ1xuICAgICAgICAvLyB3aGljaCBtb250aHMgeW91IGFyZSBhcmUgdGFsa2luZyBhYm91dCwgc28gd2UgaGF2ZSB0byBzdG9yZVxuICAgICAgICAvLyBpdCBzZXBhcmF0ZWx5LlxuICAgICAgICB0aGlzLl9tb250aHMgPSArbW9udGhzICtcbiAgICAgICAgICAgIHF1YXJ0ZXJzICogMyArXG4gICAgICAgICAgICB5ZWFycyAqIDEyO1xuXG4gICAgICAgIHRoaXMuX2RhdGEgPSB7fTtcblxuICAgICAgICB0aGlzLl9sb2NhbGUgPSBnZXRMb2NhbGUoKTtcblxuICAgICAgICB0aGlzLl9idWJibGUoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0R1cmF0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIER1cmF0aW9uO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFic1JvdW5kIChudW1iZXIpIHtcbiAgICAgICAgaWYgKG51bWJlciA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKC0xICogbnVtYmVyKSAqIC0xO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQobnVtYmVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGZ1bmN0aW9uIG9mZnNldCAodG9rZW4sIHNlcGFyYXRvcikge1xuICAgICAgICBhZGRGb3JtYXRUb2tlbih0b2tlbiwgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMudXRjT2Zmc2V0KCk7XG4gICAgICAgICAgICB2YXIgc2lnbiA9ICcrJztcbiAgICAgICAgICAgIGlmIChvZmZzZXQgPCAwKSB7XG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gLW9mZnNldDtcbiAgICAgICAgICAgICAgICBzaWduID0gJy0nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNpZ24gKyB6ZXJvRmlsbCh+fihvZmZzZXQgLyA2MCksIDIpICsgc2VwYXJhdG9yICsgemVyb0ZpbGwofn4ob2Zmc2V0KSAlIDYwLCAyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb2Zmc2V0KCdaJywgJzonKTtcbiAgICBvZmZzZXQoJ1paJywgJycpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignWicsICBtYXRjaFNob3J0T2Zmc2V0KTtcbiAgICBhZGRSZWdleFRva2VuKCdaWicsIG1hdGNoU2hvcnRPZmZzZXQpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydaJywgJ1paJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBjb25maWcuX3VzZVVUQyA9IHRydWU7XG4gICAgICAgIGNvbmZpZy5fdHptID0gb2Zmc2V0RnJvbVN0cmluZyhtYXRjaFNob3J0T2Zmc2V0LCBpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICAvLyB0aW1lem9uZSBjaHVua2VyXG4gICAgLy8gJysxMDowMCcgPiBbJzEwJywgICcwMCddXG4gICAgLy8gJy0xNTMwJyAgPiBbJy0xNScsICczMCddXG4gICAgdmFyIGNodW5rT2Zmc2V0ID0gLyhbXFwrXFwtXXxcXGRcXGQpL2dpO1xuXG4gICAgZnVuY3Rpb24gb2Zmc2V0RnJvbVN0cmluZyhtYXRjaGVyLCBzdHJpbmcpIHtcbiAgICAgICAgdmFyIG1hdGNoZXMgPSAoc3RyaW5nIHx8ICcnKS5tYXRjaChtYXRjaGVyKTtcblxuICAgICAgICBpZiAobWF0Y2hlcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2h1bmsgICA9IG1hdGNoZXNbbWF0Y2hlcy5sZW5ndGggLSAxXSB8fCBbXTtcbiAgICAgICAgdmFyIHBhcnRzICAgPSAoY2h1bmsgKyAnJykubWF0Y2goY2h1bmtPZmZzZXQpIHx8IFsnLScsIDAsIDBdO1xuICAgICAgICB2YXIgbWludXRlcyA9ICsocGFydHNbMV0gKiA2MCkgKyB0b0ludChwYXJ0c1syXSk7XG5cbiAgICAgICAgcmV0dXJuIG1pbnV0ZXMgPT09IDAgP1xuICAgICAgICAgIDAgOlxuICAgICAgICAgIHBhcnRzWzBdID09PSAnKycgPyBtaW51dGVzIDogLW1pbnV0ZXM7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGEgbW9tZW50IGZyb20gaW5wdXQsIHRoYXQgaXMgbG9jYWwvdXRjL3pvbmUgZXF1aXZhbGVudCB0byBtb2RlbC5cbiAgICBmdW5jdGlvbiBjbG9uZVdpdGhPZmZzZXQoaW5wdXQsIG1vZGVsKSB7XG4gICAgICAgIHZhciByZXMsIGRpZmY7XG4gICAgICAgIGlmIChtb2RlbC5faXNVVEMpIHtcbiAgICAgICAgICAgIHJlcyA9IG1vZGVsLmNsb25lKCk7XG4gICAgICAgICAgICBkaWZmID0gKGlzTW9tZW50KGlucHV0KSB8fCBpc0RhdGUoaW5wdXQpID8gaW5wdXQudmFsdWVPZigpIDogY3JlYXRlTG9jYWwoaW5wdXQpLnZhbHVlT2YoKSkgLSByZXMudmFsdWVPZigpO1xuICAgICAgICAgICAgLy8gVXNlIGxvdy1sZXZlbCBhcGksIGJlY2F1c2UgdGhpcyBmbiBpcyBsb3ctbGV2ZWwgYXBpLlxuICAgICAgICAgICAgcmVzLl9kLnNldFRpbWUocmVzLl9kLnZhbHVlT2YoKSArIGRpZmYpO1xuICAgICAgICAgICAgaG9va3MudXBkYXRlT2Zmc2V0KHJlcywgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVMb2NhbChpbnB1dCkubG9jYWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldERhdGVPZmZzZXQgKG0pIHtcbiAgICAgICAgLy8gT24gRmlyZWZveC4yNCBEYXRlI2dldFRpbWV6b25lT2Zmc2V0IHJldHVybnMgYSBmbG9hdGluZyBwb2ludC5cbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvcHVsbC8xODcxXG4gICAgICAgIHJldHVybiAtTWF0aC5yb3VuZChtLl9kLmdldFRpbWV6b25lT2Zmc2V0KCkgLyAxNSkgKiAxNTtcbiAgICB9XG5cbiAgICAvLyBIT09LU1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuZXZlciBhIG1vbWVudCBpcyBtdXRhdGVkLlxuICAgIC8vIEl0IGlzIGludGVuZGVkIHRvIGtlZXAgdGhlIG9mZnNldCBpbiBzeW5jIHdpdGggdGhlIHRpbWV6b25lLlxuICAgIGhvb2tzLnVwZGF0ZU9mZnNldCA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgLy8ga2VlcExvY2FsVGltZSA9IHRydWUgbWVhbnMgb25seSBjaGFuZ2UgdGhlIHRpbWV6b25lLCB3aXRob3V0XG4gICAgLy8gYWZmZWN0aW5nIHRoZSBsb2NhbCBob3VyLiBTbyA1OjMxOjI2ICswMzAwIC0tW3V0Y09mZnNldCgyLCB0cnVlKV0tLT5cbiAgICAvLyA1OjMxOjI2ICswMjAwIEl0IGlzIHBvc3NpYmxlIHRoYXQgNTozMToyNiBkb2Vzbid0IGV4aXN0IHdpdGggb2Zmc2V0XG4gICAgLy8gKzAyMDAsIHNvIHdlIGFkanVzdCB0aGUgdGltZSBhcyBuZWVkZWQsIHRvIGJlIHZhbGlkLlxuICAgIC8vXG4gICAgLy8gS2VlcGluZyB0aGUgdGltZSBhY3R1YWxseSBhZGRzL3N1YnRyYWN0cyAob25lIGhvdXIpXG4gICAgLy8gZnJvbSB0aGUgYWN0dWFsIHJlcHJlc2VudGVkIHRpbWUuIFRoYXQgaXMgd2h5IHdlIGNhbGwgdXBkYXRlT2Zmc2V0XG4gICAgLy8gYSBzZWNvbmQgdGltZS4gSW4gY2FzZSBpdCB3YW50cyB1cyB0byBjaGFuZ2UgdGhlIG9mZnNldCBhZ2FpblxuICAgIC8vIF9jaGFuZ2VJblByb2dyZXNzID09IHRydWUgY2FzZSwgdGhlbiB3ZSBoYXZlIHRvIGFkanVzdCwgYmVjYXVzZVxuICAgIC8vIHRoZXJlIGlzIG5vIHN1Y2ggdGltZSBpbiB0aGUgZ2l2ZW4gdGltZXpvbmUuXG4gICAgZnVuY3Rpb24gZ2V0U2V0T2Zmc2V0IChpbnB1dCwga2VlcExvY2FsVGltZSwga2VlcE1pbnV0ZXMpIHtcbiAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMuX29mZnNldCB8fCAwLFxuICAgICAgICAgICAgbG9jYWxBZGp1c3Q7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCAhPSBudWxsID8gdGhpcyA6IE5hTjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IG9mZnNldEZyb21TdHJpbmcobWF0Y2hTaG9ydE9mZnNldCwgaW5wdXQpO1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKE1hdGguYWJzKGlucHV0KSA8IDE2ICYmICFrZWVwTWludXRlcykge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQgKiA2MDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5faXNVVEMgJiYga2VlcExvY2FsVGltZSkge1xuICAgICAgICAgICAgICAgIGxvY2FsQWRqdXN0ID0gZ2V0RGF0ZU9mZnNldCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX29mZnNldCA9IGlucHV0O1xuICAgICAgICAgICAgdGhpcy5faXNVVEMgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKGxvY2FsQWRqdXN0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZChsb2NhbEFkanVzdCwgJ20nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvZmZzZXQgIT09IGlucHV0KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFrZWVwTG9jYWxUaW1lIHx8IHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkU3VidHJhY3QodGhpcywgY3JlYXRlRHVyYXRpb24oaW5wdXQgLSBvZmZzZXQsICdtJyksIDEsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9jaGFuZ2VJblByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBob29rcy51cGRhdGVPZmZzZXQodGhpcywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gb2Zmc2V0IDogZ2V0RGF0ZU9mZnNldCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldFpvbmUgKGlucHV0LCBrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gLWlucHV0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldChpbnB1dCwga2VlcExvY2FsVGltZSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIC10aGlzLnV0Y09mZnNldCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0T2Zmc2V0VG9VVEMgKGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXRjT2Zmc2V0KDAsIGtlZXBMb2NhbFRpbWUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldE9mZnNldFRvTG9jYWwgKGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzVVRDKSB7XG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldCgwLCBrZWVwTG9jYWxUaW1lKTtcbiAgICAgICAgICAgIHRoaXMuX2lzVVRDID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmIChrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdWJ0cmFjdChnZXREYXRlT2Zmc2V0KHRoaXMpLCAnbScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldE9mZnNldFRvUGFyc2VkT2Zmc2V0ICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3R6bSAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldCh0aGlzLl90em0sIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5faSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhciB0Wm9uZSA9IG9mZnNldEZyb21TdHJpbmcobWF0Y2hPZmZzZXQsIHRoaXMuX2kpO1xuICAgICAgICAgICAgaWYgKHRab25lICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnV0Y09mZnNldCh0Wm9uZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnV0Y09mZnNldCgwLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYXNBbGlnbmVkSG91ck9mZnNldCAoaW5wdXQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlucHV0ID0gaW5wdXQgPyBjcmVhdGVMb2NhbChpbnB1dCkudXRjT2Zmc2V0KCkgOiAwO1xuXG4gICAgICAgIHJldHVybiAodGhpcy51dGNPZmZzZXQoKSAtIGlucHV0KSAlIDYwID09PSAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRGF5bGlnaHRTYXZpbmdUaW1lICgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KCkgPiB0aGlzLmNsb25lKCkubW9udGgoMCkudXRjT2Zmc2V0KCkgfHxcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KCkgPiB0aGlzLmNsb25lKCkubW9udGgoNSkudXRjT2Zmc2V0KClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0RheWxpZ2h0U2F2aW5nVGltZVNoaWZ0ZWQgKCkge1xuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX2lzRFNUU2hpZnRlZCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pc0RTVFNoaWZ0ZWQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYyA9IHt9O1xuXG4gICAgICAgIGNvcHlDb25maWcoYywgdGhpcyk7XG4gICAgICAgIGMgPSBwcmVwYXJlQ29uZmlnKGMpO1xuXG4gICAgICAgIGlmIChjLl9hKSB7XG4gICAgICAgICAgICB2YXIgb3RoZXIgPSBjLl9pc1VUQyA/IGNyZWF0ZVVUQyhjLl9hKSA6IGNyZWF0ZUxvY2FsKGMuX2EpO1xuICAgICAgICAgICAgdGhpcy5faXNEU1RTaGlmdGVkID0gdGhpcy5pc1ZhbGlkKCkgJiZcbiAgICAgICAgICAgICAgICBjb21wYXJlQXJyYXlzKGMuX2EsIG90aGVyLnRvQXJyYXkoKSkgPiAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5faXNEU1RTaGlmdGVkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5faXNEU1RTaGlmdGVkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTG9jYWwgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc1ZhbGlkKCkgPyAhdGhpcy5faXNVVEMgOiBmYWxzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1V0Y09mZnNldCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSA/IHRoaXMuX2lzVVRDIDogZmFsc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNVdGMgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc1ZhbGlkKCkgPyB0aGlzLl9pc1VUQyAmJiB0aGlzLl9vZmZzZXQgPT09IDAgOiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBBU1AuTkVUIGpzb24gZGF0ZSBmb3JtYXQgcmVnZXhcbiAgICB2YXIgYXNwTmV0UmVnZXggPSAvXihcXC18XFwrKT8oPzooXFxkKilbLiBdKT8oXFxkKylcXDooXFxkKykoPzpcXDooXFxkKykoXFwuXFxkKik/KT8kLztcblxuICAgIC8vIGZyb20gaHR0cDovL2RvY3MuY2xvc3VyZS1saWJyYXJ5Lmdvb2dsZWNvZGUuY29tL2dpdC9jbG9zdXJlX2dvb2dfZGF0ZV9kYXRlLmpzLnNvdXJjZS5odG1sXG4gICAgLy8gc29tZXdoYXQgbW9yZSBpbiBsaW5lIHdpdGggNC40LjMuMiAyMDA0IHNwZWMsIGJ1dCBhbGxvd3MgZGVjaW1hbCBhbnl3aGVyZVxuICAgIC8vIGFuZCBmdXJ0aGVyIG1vZGlmaWVkIHRvIGFsbG93IGZvciBzdHJpbmdzIGNvbnRhaW5pbmcgYm90aCB3ZWVrIGFuZCBkYXlcbiAgICB2YXIgaXNvUmVnZXggPSAvXigtfFxcKyk/UCg/OihbLStdP1swLTksLl0qKVkpPyg/OihbLStdP1swLTksLl0qKU0pPyg/OihbLStdP1swLTksLl0qKVcpPyg/OihbLStdP1swLTksLl0qKUQpPyg/OlQoPzooWy0rXT9bMC05LC5dKilIKT8oPzooWy0rXT9bMC05LC5dKilNKT8oPzooWy0rXT9bMC05LC5dKilTKT8pPyQvO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlRHVyYXRpb24gKGlucHV0LCBrZXkpIHtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gaW5wdXQsXG4gICAgICAgICAgICAvLyBtYXRjaGluZyBhZ2FpbnN0IHJlZ2V4cCBpcyBleHBlbnNpdmUsIGRvIGl0IG9uIGRlbWFuZFxuICAgICAgICAgICAgbWF0Y2ggPSBudWxsLFxuICAgICAgICAgICAgc2lnbixcbiAgICAgICAgICAgIHJldCxcbiAgICAgICAgICAgIGRpZmZSZXM7XG5cbiAgICAgICAgaWYgKGlzRHVyYXRpb24oaW5wdXQpKSB7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICBtcyA6IGlucHV0Ll9taWxsaXNlY29uZHMsXG4gICAgICAgICAgICAgICAgZCAgOiBpbnB1dC5fZGF5cyxcbiAgICAgICAgICAgICAgICBNICA6IGlucHV0Ll9tb250aHNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAoaXNOdW1iZXIoaW5wdXQpKSB7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHt9O1xuICAgICAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uW2tleV0gPSBpbnB1dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb24ubWlsbGlzZWNvbmRzID0gaW5wdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoISEobWF0Y2ggPSBhc3BOZXRSZWdleC5leGVjKGlucHV0KSkpIHtcbiAgICAgICAgICAgIHNpZ24gPSAobWF0Y2hbMV0gPT09ICctJykgPyAtMSA6IDE7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICB5ICA6IDAsXG4gICAgICAgICAgICAgICAgZCAgOiB0b0ludChtYXRjaFtEQVRFXSkgICAgICAgICAgICAgICAgICAgICAgICAgKiBzaWduLFxuICAgICAgICAgICAgICAgIGggIDogdG9JbnQobWF0Y2hbSE9VUl0pICAgICAgICAgICAgICAgICAgICAgICAgICogc2lnbixcbiAgICAgICAgICAgICAgICBtICA6IHRvSW50KG1hdGNoW01JTlVURV0pICAgICAgICAgICAgICAgICAgICAgICAqIHNpZ24sXG4gICAgICAgICAgICAgICAgcyAgOiB0b0ludChtYXRjaFtTRUNPTkRdKSAgICAgICAgICAgICAgICAgICAgICAgKiBzaWduLFxuICAgICAgICAgICAgICAgIG1zIDogdG9JbnQoYWJzUm91bmQobWF0Y2hbTUlMTElTRUNPTkRdICogMTAwMCkpICogc2lnbiAvLyB0aGUgbWlsbGlzZWNvbmQgZGVjaW1hbCBwb2ludCBpcyBpbmNsdWRlZCBpbiB0aGUgbWF0Y2hcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAoISEobWF0Y2ggPSBpc29SZWdleC5leGVjKGlucHV0KSkpIHtcbiAgICAgICAgICAgIHNpZ24gPSAobWF0Y2hbMV0gPT09ICctJykgPyAtMSA6IChtYXRjaFsxXSA9PT0gJysnKSA/IDEgOiAxO1xuICAgICAgICAgICAgZHVyYXRpb24gPSB7XG4gICAgICAgICAgICAgICAgeSA6IHBhcnNlSXNvKG1hdGNoWzJdLCBzaWduKSxcbiAgICAgICAgICAgICAgICBNIDogcGFyc2VJc28obWF0Y2hbM10sIHNpZ24pLFxuICAgICAgICAgICAgICAgIHcgOiBwYXJzZUlzbyhtYXRjaFs0XSwgc2lnbiksXG4gICAgICAgICAgICAgICAgZCA6IHBhcnNlSXNvKG1hdGNoWzVdLCBzaWduKSxcbiAgICAgICAgICAgICAgICBoIDogcGFyc2VJc28obWF0Y2hbNl0sIHNpZ24pLFxuICAgICAgICAgICAgICAgIG0gOiBwYXJzZUlzbyhtYXRjaFs3XSwgc2lnbiksXG4gICAgICAgICAgICAgICAgcyA6IHBhcnNlSXNvKG1hdGNoWzhdLCBzaWduKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmIChkdXJhdGlvbiA9PSBudWxsKSB7Ly8gY2hlY2tzIGZvciBudWxsIG9yIHVuZGVmaW5lZFxuICAgICAgICAgICAgZHVyYXRpb24gPSB7fTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZHVyYXRpb24gPT09ICdvYmplY3QnICYmICgnZnJvbScgaW4gZHVyYXRpb24gfHwgJ3RvJyBpbiBkdXJhdGlvbikpIHtcbiAgICAgICAgICAgIGRpZmZSZXMgPSBtb21lbnRzRGlmZmVyZW5jZShjcmVhdGVMb2NhbChkdXJhdGlvbi5mcm9tKSwgY3JlYXRlTG9jYWwoZHVyYXRpb24udG8pKTtcblxuICAgICAgICAgICAgZHVyYXRpb24gPSB7fTtcbiAgICAgICAgICAgIGR1cmF0aW9uLm1zID0gZGlmZlJlcy5taWxsaXNlY29uZHM7XG4gICAgICAgICAgICBkdXJhdGlvbi5NID0gZGlmZlJlcy5tb250aHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXQgPSBuZXcgRHVyYXRpb24oZHVyYXRpb24pO1xuXG4gICAgICAgIGlmIChpc0R1cmF0aW9uKGlucHV0KSAmJiBoYXNPd25Qcm9wKGlucHV0LCAnX2xvY2FsZScpKSB7XG4gICAgICAgICAgICByZXQuX2xvY2FsZSA9IGlucHV0Ll9sb2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGNyZWF0ZUR1cmF0aW9uLmZuID0gRHVyYXRpb24ucHJvdG90eXBlO1xuICAgIGNyZWF0ZUR1cmF0aW9uLmludmFsaWQgPSBjcmVhdGVJbnZhbGlkJDE7XG5cbiAgICBmdW5jdGlvbiBwYXJzZUlzbyAoaW5wLCBzaWduKSB7XG4gICAgICAgIC8vIFdlJ2Qgbm9ybWFsbHkgdXNlIH5+aW5wIGZvciB0aGlzLCBidXQgdW5mb3J0dW5hdGVseSBpdCBhbHNvXG4gICAgICAgIC8vIGNvbnZlcnRzIGZsb2F0cyB0byBpbnRzLlxuICAgICAgICAvLyBpbnAgbWF5IGJlIHVuZGVmaW5lZCwgc28gY2FyZWZ1bCBjYWxsaW5nIHJlcGxhY2Ugb24gaXQuXG4gICAgICAgIHZhciByZXMgPSBpbnAgJiYgcGFyc2VGbG9hdChpbnAucmVwbGFjZSgnLCcsICcuJykpO1xuICAgICAgICAvLyBhcHBseSBzaWduIHdoaWxlIHdlJ3JlIGF0IGl0XG4gICAgICAgIHJldHVybiAoaXNOYU4ocmVzKSA/IDAgOiByZXMpICogc2lnbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwb3NpdGl2ZU1vbWVudHNEaWZmZXJlbmNlKGJhc2UsIG90aGVyKSB7XG4gICAgICAgIHZhciByZXMgPSB7bWlsbGlzZWNvbmRzOiAwLCBtb250aHM6IDB9O1xuXG4gICAgICAgIHJlcy5tb250aHMgPSBvdGhlci5tb250aCgpIC0gYmFzZS5tb250aCgpICtcbiAgICAgICAgICAgIChvdGhlci55ZWFyKCkgLSBiYXNlLnllYXIoKSkgKiAxMjtcbiAgICAgICAgaWYgKGJhc2UuY2xvbmUoKS5hZGQocmVzLm1vbnRocywgJ00nKS5pc0FmdGVyKG90aGVyKSkge1xuICAgICAgICAgICAgLS1yZXMubW9udGhzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzLm1pbGxpc2Vjb25kcyA9ICtvdGhlciAtICsoYmFzZS5jbG9uZSgpLmFkZChyZXMubW9udGhzLCAnTScpKTtcblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vbWVudHNEaWZmZXJlbmNlKGJhc2UsIG90aGVyKSB7XG4gICAgICAgIHZhciByZXM7XG4gICAgICAgIGlmICghKGJhc2UuaXNWYWxpZCgpICYmIG90aGVyLmlzVmFsaWQoKSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7bWlsbGlzZWNvbmRzOiAwLCBtb250aHM6IDB9O1xuICAgICAgICB9XG5cbiAgICAgICAgb3RoZXIgPSBjbG9uZVdpdGhPZmZzZXQob3RoZXIsIGJhc2UpO1xuICAgICAgICBpZiAoYmFzZS5pc0JlZm9yZShvdGhlcikpIHtcbiAgICAgICAgICAgIHJlcyA9IHBvc2l0aXZlTW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzID0gcG9zaXRpdmVNb21lbnRzRGlmZmVyZW5jZShvdGhlciwgYmFzZSk7XG4gICAgICAgICAgICByZXMubWlsbGlzZWNvbmRzID0gLXJlcy5taWxsaXNlY29uZHM7XG4gICAgICAgICAgICByZXMubW9udGhzID0gLXJlcy5tb250aHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIC8vIFRPRE86IHJlbW92ZSAnbmFtZScgYXJnIGFmdGVyIGRlcHJlY2F0aW9uIGlzIHJlbW92ZWRcbiAgICBmdW5jdGlvbiBjcmVhdGVBZGRlcihkaXJlY3Rpb24sIG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWwsIHBlcmlvZCkge1xuICAgICAgICAgICAgdmFyIGR1ciwgdG1wO1xuICAgICAgICAgICAgLy9pbnZlcnQgdGhlIGFyZ3VtZW50cywgYnV0IGNvbXBsYWluIGFib3V0IGl0XG4gICAgICAgICAgICBpZiAocGVyaW9kICE9PSBudWxsICYmICFpc05hTigrcGVyaW9kKSkge1xuICAgICAgICAgICAgICAgIGRlcHJlY2F0ZVNpbXBsZShuYW1lLCAnbW9tZW50KCkuJyArIG5hbWUgICsgJyhwZXJpb2QsIG51bWJlcikgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSBtb21lbnQoKS4nICsgbmFtZSArICcobnVtYmVyLCBwZXJpb2QpLiAnICtcbiAgICAgICAgICAgICAgICAnU2VlIGh0dHA6Ly9tb21lbnRqcy5jb20vZ3VpZGVzLyMvd2FybmluZ3MvYWRkLWludmVydGVkLXBhcmFtLyBmb3IgbW9yZSBpbmZvLicpO1xuICAgICAgICAgICAgICAgIHRtcCA9IHZhbDsgdmFsID0gcGVyaW9kOyBwZXJpb2QgPSB0bXA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhbCA9IHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnID8gK3ZhbCA6IHZhbDtcbiAgICAgICAgICAgIGR1ciA9IGNyZWF0ZUR1cmF0aW9uKHZhbCwgcGVyaW9kKTtcbiAgICAgICAgICAgIGFkZFN1YnRyYWN0KHRoaXMsIGR1ciwgZGlyZWN0aW9uKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFN1YnRyYWN0IChtb20sIGR1cmF0aW9uLCBpc0FkZGluZywgdXBkYXRlT2Zmc2V0KSB7XG4gICAgICAgIHZhciBtaWxsaXNlY29uZHMgPSBkdXJhdGlvbi5fbWlsbGlzZWNvbmRzLFxuICAgICAgICAgICAgZGF5cyA9IGFic1JvdW5kKGR1cmF0aW9uLl9kYXlzKSxcbiAgICAgICAgICAgIG1vbnRocyA9IGFic1JvdW5kKGR1cmF0aW9uLl9tb250aHMpO1xuXG4gICAgICAgIGlmICghbW9tLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgLy8gTm8gb3BcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZU9mZnNldCA9IHVwZGF0ZU9mZnNldCA9PSBudWxsID8gdHJ1ZSA6IHVwZGF0ZU9mZnNldDtcblxuICAgICAgICBpZiAobW9udGhzKSB7XG4gICAgICAgICAgICBzZXRNb250aChtb20sIGdldChtb20sICdNb250aCcpICsgbW9udGhzICogaXNBZGRpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXlzKSB7XG4gICAgICAgICAgICBzZXQkMShtb20sICdEYXRlJywgZ2V0KG1vbSwgJ0RhdGUnKSArIGRheXMgKiBpc0FkZGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1pbGxpc2Vjb25kcykge1xuICAgICAgICAgICAgbW9tLl9kLnNldFRpbWUobW9tLl9kLnZhbHVlT2YoKSArIG1pbGxpc2Vjb25kcyAqIGlzQWRkaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXBkYXRlT2Zmc2V0KSB7XG4gICAgICAgICAgICBob29rcy51cGRhdGVPZmZzZXQobW9tLCBkYXlzIHx8IG1vbnRocyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgYWRkICAgICAgPSBjcmVhdGVBZGRlcigxLCAnYWRkJyk7XG4gICAgdmFyIHN1YnRyYWN0ID0gY3JlYXRlQWRkZXIoLTEsICdzdWJ0cmFjdCcpO1xuXG4gICAgZnVuY3Rpb24gZ2V0Q2FsZW5kYXJGb3JtYXQobXlNb21lbnQsIG5vdykge1xuICAgICAgICB2YXIgZGlmZiA9IG15TW9tZW50LmRpZmYobm93LCAnZGF5cycsIHRydWUpO1xuICAgICAgICByZXR1cm4gZGlmZiA8IC02ID8gJ3NhbWVFbHNlJyA6XG4gICAgICAgICAgICAgICAgZGlmZiA8IC0xID8gJ2xhc3RXZWVrJyA6XG4gICAgICAgICAgICAgICAgZGlmZiA8IDAgPyAnbGFzdERheScgOlxuICAgICAgICAgICAgICAgIGRpZmYgPCAxID8gJ3NhbWVEYXknIDpcbiAgICAgICAgICAgICAgICBkaWZmIDwgMiA/ICduZXh0RGF5JyA6XG4gICAgICAgICAgICAgICAgZGlmZiA8IDcgPyAnbmV4dFdlZWsnIDogJ3NhbWVFbHNlJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYWxlbmRhciQxICh0aW1lLCBmb3JtYXRzKSB7XG4gICAgICAgIC8vIFdlIHdhbnQgdG8gY29tcGFyZSB0aGUgc3RhcnQgb2YgdG9kYXksIHZzIHRoaXMuXG4gICAgICAgIC8vIEdldHRpbmcgc3RhcnQtb2YtdG9kYXkgZGVwZW5kcyBvbiB3aGV0aGVyIHdlJ3JlIGxvY2FsL3V0Yy9vZmZzZXQgb3Igbm90LlxuICAgICAgICB2YXIgbm93ID0gdGltZSB8fCBjcmVhdGVMb2NhbCgpLFxuICAgICAgICAgICAgc29kID0gY2xvbmVXaXRoT2Zmc2V0KG5vdywgdGhpcykuc3RhcnRPZignZGF5JyksXG4gICAgICAgICAgICBmb3JtYXQgPSBob29rcy5jYWxlbmRhckZvcm1hdCh0aGlzLCBzb2QpIHx8ICdzYW1lRWxzZSc7XG5cbiAgICAgICAgdmFyIG91dHB1dCA9IGZvcm1hdHMgJiYgKGlzRnVuY3Rpb24oZm9ybWF0c1tmb3JtYXRdKSA/IGZvcm1hdHNbZm9ybWF0XS5jYWxsKHRoaXMsIG5vdykgOiBmb3JtYXRzW2Zvcm1hdF0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmZvcm1hdChvdXRwdXQgfHwgdGhpcy5sb2NhbGVEYXRhKCkuY2FsZW5kYXIoZm9ybWF0LCB0aGlzLCBjcmVhdGVMb2NhbChub3cpKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvbmUgKCkge1xuICAgICAgICByZXR1cm4gbmV3IE1vbWVudCh0aGlzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0FmdGVyIChpbnB1dCwgdW5pdHMpIHtcbiAgICAgICAgdmFyIGxvY2FsSW5wdXQgPSBpc01vbWVudChpbnB1dCkgPyBpbnB1dCA6IGNyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICAgICAgaWYgKCEodGhpcy5pc1ZhbGlkKCkgJiYgbG9jYWxJbnB1dC5pc1ZhbGlkKCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyghaXNVbmRlZmluZWQodW5pdHMpID8gdW5pdHMgOiAnbWlsbGlzZWNvbmQnKTtcbiAgICAgICAgaWYgKHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZU9mKCkgPiBsb2NhbElucHV0LnZhbHVlT2YoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbElucHV0LnZhbHVlT2YoKSA8IHRoaXMuY2xvbmUoKS5zdGFydE9mKHVuaXRzKS52YWx1ZU9mKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0JlZm9yZSAoaW5wdXQsIHVuaXRzKSB7XG4gICAgICAgIHZhciBsb2NhbElucHV0ID0gaXNNb21lbnQoaW5wdXQpID8gaW5wdXQgOiBjcmVhdGVMb2NhbChpbnB1dCk7XG4gICAgICAgIGlmICghKHRoaXMuaXNWYWxpZCgpICYmIGxvY2FsSW5wdXQuaXNWYWxpZCgpKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHMoIWlzVW5kZWZpbmVkKHVuaXRzKSA/IHVuaXRzIDogJ21pbGxpc2Vjb25kJyk7XG4gICAgICAgIGlmICh1bml0cyA9PT0gJ21pbGxpc2Vjb25kJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVPZigpIDwgbG9jYWxJbnB1dC52YWx1ZU9mKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmVuZE9mKHVuaXRzKS52YWx1ZU9mKCkgPCBsb2NhbElucHV0LnZhbHVlT2YoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQmV0d2VlbiAoZnJvbSwgdG8sIHVuaXRzLCBpbmNsdXNpdml0eSkge1xuICAgICAgICBpbmNsdXNpdml0eSA9IGluY2x1c2l2aXR5IHx8ICcoKSc7XG4gICAgICAgIHJldHVybiAoaW5jbHVzaXZpdHlbMF0gPT09ICcoJyA/IHRoaXMuaXNBZnRlcihmcm9tLCB1bml0cykgOiAhdGhpcy5pc0JlZm9yZShmcm9tLCB1bml0cykpICYmXG4gICAgICAgICAgICAoaW5jbHVzaXZpdHlbMV0gPT09ICcpJyA/IHRoaXMuaXNCZWZvcmUodG8sIHVuaXRzKSA6ICF0aGlzLmlzQWZ0ZXIodG8sIHVuaXRzKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNTYW1lIChpbnB1dCwgdW5pdHMpIHtcbiAgICAgICAgdmFyIGxvY2FsSW5wdXQgPSBpc01vbWVudChpbnB1dCkgPyBpbnB1dCA6IGNyZWF0ZUxvY2FsKGlucHV0KSxcbiAgICAgICAgICAgIGlucHV0TXM7XG4gICAgICAgIGlmICghKHRoaXMuaXNWYWxpZCgpICYmIGxvY2FsSW5wdXQuaXNWYWxpZCgpKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMgfHwgJ21pbGxpc2Vjb25kJyk7XG4gICAgICAgIGlmICh1bml0cyA9PT0gJ21pbGxpc2Vjb25kJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVPZigpID09PSBsb2NhbElucHV0LnZhbHVlT2YoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlucHV0TXMgPSBsb2NhbElucHV0LnZhbHVlT2YoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuc3RhcnRPZih1bml0cykudmFsdWVPZigpIDw9IGlucHV0TXMgJiYgaW5wdXRNcyA8PSB0aGlzLmNsb25lKCkuZW5kT2YodW5pdHMpLnZhbHVlT2YoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzU2FtZU9yQWZ0ZXIgKGlucHV0LCB1bml0cykge1xuICAgICAgICByZXR1cm4gdGhpcy5pc1NhbWUoaW5wdXQsIHVuaXRzKSB8fCB0aGlzLmlzQWZ0ZXIoaW5wdXQsdW5pdHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzU2FtZU9yQmVmb3JlIChpbnB1dCwgdW5pdHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNTYW1lKGlucHV0LCB1bml0cykgfHwgdGhpcy5pc0JlZm9yZShpbnB1dCx1bml0cyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGlmZiAoaW5wdXQsIHVuaXRzLCBhc0Zsb2F0KSB7XG4gICAgICAgIHZhciB0aGF0LFxuICAgICAgICAgICAgem9uZURlbHRhLFxuICAgICAgICAgICAgb3V0cHV0O1xuXG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cblxuICAgICAgICB0aGF0ID0gY2xvbmVXaXRoT2Zmc2V0KGlucHV0LCB0aGlzKTtcblxuICAgICAgICBpZiAoIXRoYXQuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG5cbiAgICAgICAgem9uZURlbHRhID0gKHRoYXQudXRjT2Zmc2V0KCkgLSB0aGlzLnV0Y09mZnNldCgpKSAqIDZlNDtcblxuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcblxuICAgICAgICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgICAgICAgICBjYXNlICd5ZWFyJzogb3V0cHV0ID0gbW9udGhEaWZmKHRoaXMsIHRoYXQpIC8gMTI7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW9udGgnOiBvdXRwdXQgPSBtb250aERpZmYodGhpcywgdGhhdCk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncXVhcnRlcic6IG91dHB1dCA9IG1vbnRoRGlmZih0aGlzLCB0aGF0KSAvIDM7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc2Vjb25kJzogb3V0cHV0ID0gKHRoaXMgLSB0aGF0KSAvIDFlMzsgYnJlYWs7IC8vIDEwMDBcbiAgICAgICAgICAgIGNhc2UgJ21pbnV0ZSc6IG91dHB1dCA9ICh0aGlzIC0gdGhhdCkgLyA2ZTQ7IGJyZWFrOyAvLyAxMDAwICogNjBcbiAgICAgICAgICAgIGNhc2UgJ2hvdXInOiBvdXRwdXQgPSAodGhpcyAtIHRoYXQpIC8gMzZlNTsgYnJlYWs7IC8vIDEwMDAgKiA2MCAqIDYwXG4gICAgICAgICAgICBjYXNlICdkYXknOiBvdXRwdXQgPSAodGhpcyAtIHRoYXQgLSB6b25lRGVsdGEpIC8gODY0ZTU7IGJyZWFrOyAvLyAxMDAwICogNjAgKiA2MCAqIDI0LCBuZWdhdGUgZHN0XG4gICAgICAgICAgICBjYXNlICd3ZWVrJzogb3V0cHV0ID0gKHRoaXMgLSB0aGF0IC0gem9uZURlbHRhKSAvIDYwNDhlNTsgYnJlYWs7IC8vIDEwMDAgKiA2MCAqIDYwICogMjQgKiA3LCBuZWdhdGUgZHN0XG4gICAgICAgICAgICBkZWZhdWx0OiBvdXRwdXQgPSB0aGlzIC0gdGhhdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhc0Zsb2F0ID8gb3V0cHV0IDogYWJzRmxvb3Iob3V0cHV0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb250aERpZmYgKGEsIGIpIHtcbiAgICAgICAgLy8gZGlmZmVyZW5jZSBpbiBtb250aHNcbiAgICAgICAgdmFyIHdob2xlTW9udGhEaWZmID0gKChiLnllYXIoKSAtIGEueWVhcigpKSAqIDEyKSArIChiLm1vbnRoKCkgLSBhLm1vbnRoKCkpLFxuICAgICAgICAgICAgLy8gYiBpcyBpbiAoYW5jaG9yIC0gMSBtb250aCwgYW5jaG9yICsgMSBtb250aClcbiAgICAgICAgICAgIGFuY2hvciA9IGEuY2xvbmUoKS5hZGQod2hvbGVNb250aERpZmYsICdtb250aHMnKSxcbiAgICAgICAgICAgIGFuY2hvcjIsIGFkanVzdDtcblxuICAgICAgICBpZiAoYiAtIGFuY2hvciA8IDApIHtcbiAgICAgICAgICAgIGFuY2hvcjIgPSBhLmNsb25lKCkuYWRkKHdob2xlTW9udGhEaWZmIC0gMSwgJ21vbnRocycpO1xuICAgICAgICAgICAgLy8gbGluZWFyIGFjcm9zcyB0aGUgbW9udGhcbiAgICAgICAgICAgIGFkanVzdCA9IChiIC0gYW5jaG9yKSAvIChhbmNob3IgLSBhbmNob3IyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFuY2hvcjIgPSBhLmNsb25lKCkuYWRkKHdob2xlTW9udGhEaWZmICsgMSwgJ21vbnRocycpO1xuICAgICAgICAgICAgLy8gbGluZWFyIGFjcm9zcyB0aGUgbW9udGhcbiAgICAgICAgICAgIGFkanVzdCA9IChiIC0gYW5jaG9yKSAvIChhbmNob3IyIC0gYW5jaG9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vY2hlY2sgZm9yIG5lZ2F0aXZlIHplcm8sIHJldHVybiB6ZXJvIGlmIG5lZ2F0aXZlIHplcm9cbiAgICAgICAgcmV0dXJuIC0od2hvbGVNb250aERpZmYgKyBhZGp1c3QpIHx8IDA7XG4gICAgfVxuXG4gICAgaG9va3MuZGVmYXVsdEZvcm1hdCA9ICdZWVlZLU1NLUREVEhIOm1tOnNzWic7XG4gICAgaG9va3MuZGVmYXVsdEZvcm1hdFV0YyA9ICdZWVlZLU1NLUREVEhIOm1tOnNzW1pdJztcblxuICAgIGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sb2NhbGUoJ2VuJykuZm9ybWF0KCdkZGQgTU1NIEREIFlZWVkgSEg6bW06c3MgW0dNVF1aWicpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvSVNPU3RyaW5nKGtlZXBPZmZzZXQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHV0YyA9IGtlZXBPZmZzZXQgIT09IHRydWU7XG4gICAgICAgIHZhciBtID0gdXRjID8gdGhpcy5jbG9uZSgpLnV0YygpIDogdGhpcztcbiAgICAgICAgaWYgKG0ueWVhcigpIDwgMCB8fCBtLnllYXIoKSA+IDk5OTkpIHtcbiAgICAgICAgICAgIHJldHVybiBmb3JtYXRNb21lbnQobSwgdXRjID8gJ1lZWVlZWS1NTS1ERFtUXUhIOm1tOnNzLlNTU1taXScgOiAnWVlZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTWicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKERhdGUucHJvdG90eXBlLnRvSVNPU3RyaW5nKSkge1xuICAgICAgICAgICAgLy8gbmF0aXZlIGltcGxlbWVudGF0aW9uIGlzIH41MHggZmFzdGVyLCB1c2UgaXQgd2hlbiB3ZSBjYW5cbiAgICAgICAgICAgIGlmICh1dGMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50b0RhdGUoKS50b0lTT1N0cmluZygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUodGhpcy52YWx1ZU9mKCkgKyB0aGlzLnV0Y09mZnNldCgpICogNjAgKiAxMDAwKS50b0lTT1N0cmluZygpLnJlcGxhY2UoJ1onLCBmb3JtYXRNb21lbnQobSwgJ1onKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZvcm1hdE1vbWVudChtLCB1dGMgPyAnWVlZWS1NTS1ERFtUXUhIOm1tOnNzLlNTU1taXScgOiAnWVlZWS1NTS1ERFtUXUhIOm1tOnNzLlNTU1onKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gYSBodW1hbiByZWFkYWJsZSByZXByZXNlbnRhdGlvbiBvZiBhIG1vbWVudCB0aGF0IGNhblxuICAgICAqIGFsc28gYmUgZXZhbHVhdGVkIHRvIGdldCBhIG5ldyBtb21lbnQgd2hpY2ggaXMgdGhlIHNhbWVcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHBzOi8vbm9kZWpzLm9yZy9kaXN0L2xhdGVzdC9kb2NzL2FwaS91dGlsLmh0bWwjdXRpbF9jdXN0b21faW5zcGVjdF9mdW5jdGlvbl9vbl9vYmplY3RzXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW5zcGVjdCAoKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiAnbW9tZW50LmludmFsaWQoLyogJyArIHRoaXMuX2kgKyAnICovKSc7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZ1bmMgPSAnbW9tZW50JztcbiAgICAgICAgdmFyIHpvbmUgPSAnJztcbiAgICAgICAgaWYgKCF0aGlzLmlzTG9jYWwoKSkge1xuICAgICAgICAgICAgZnVuYyA9IHRoaXMudXRjT2Zmc2V0KCkgPT09IDAgPyAnbW9tZW50LnV0YycgOiAnbW9tZW50LnBhcnNlWm9uZSc7XG4gICAgICAgICAgICB6b25lID0gJ1onO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwcmVmaXggPSAnWycgKyBmdW5jICsgJyhcIl0nO1xuICAgICAgICB2YXIgeWVhciA9ICgwIDw9IHRoaXMueWVhcigpICYmIHRoaXMueWVhcigpIDw9IDk5OTkpID8gJ1lZWVknIDogJ1lZWVlZWSc7XG4gICAgICAgIHZhciBkYXRldGltZSA9ICctTU0tRERbVF1ISDptbTpzcy5TU1MnO1xuICAgICAgICB2YXIgc3VmZml4ID0gem9uZSArICdbXCIpXSc7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0KHByZWZpeCArIHllYXIgKyBkYXRldGltZSArIHN1ZmZpeCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0IChpbnB1dFN0cmluZykge1xuICAgICAgICBpZiAoIWlucHV0U3RyaW5nKSB7XG4gICAgICAgICAgICBpbnB1dFN0cmluZyA9IHRoaXMuaXNVdGMoKSA/IGhvb2tzLmRlZmF1bHRGb3JtYXRVdGMgOiBob29rcy5kZWZhdWx0Rm9ybWF0O1xuICAgICAgICB9XG4gICAgICAgIHZhciBvdXRwdXQgPSBmb3JtYXRNb21lbnQodGhpcywgaW5wdXRTdHJpbmcpO1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkucG9zdGZvcm1hdChvdXRwdXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZyb20gKHRpbWUsIHdpdGhvdXRTdWZmaXgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWYWxpZCgpICYmXG4gICAgICAgICAgICAgICAgKChpc01vbWVudCh0aW1lKSAmJiB0aW1lLmlzVmFsaWQoKSkgfHxcbiAgICAgICAgICAgICAgICAgY3JlYXRlTG9jYWwodGltZSkuaXNWYWxpZCgpKSkge1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUR1cmF0aW9uKHt0bzogdGhpcywgZnJvbTogdGltZX0pLmxvY2FsZSh0aGlzLmxvY2FsZSgpKS5odW1hbml6ZSghd2l0aG91dFN1ZmZpeCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZyb21Ob3cgKHdpdGhvdXRTdWZmaXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZnJvbShjcmVhdGVMb2NhbCgpLCB3aXRob3V0U3VmZml4KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0byAodGltZSwgd2l0aG91dFN1ZmZpeCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZhbGlkKCkgJiZcbiAgICAgICAgICAgICAgICAoKGlzTW9tZW50KHRpbWUpICYmIHRpbWUuaXNWYWxpZCgpKSB8fFxuICAgICAgICAgICAgICAgICBjcmVhdGVMb2NhbCh0aW1lKS5pc1ZhbGlkKCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlRHVyYXRpb24oe2Zyb206IHRoaXMsIHRvOiB0aW1lfSkubG9jYWxlKHRoaXMubG9jYWxlKCkpLmh1bWFuaXplKCF3aXRob3V0U3VmZml4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5pbnZhbGlkRGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9Ob3cgKHdpdGhvdXRTdWZmaXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG8oY3JlYXRlTG9jYWwoKSwgd2l0aG91dFN1ZmZpeCk7XG4gICAgfVxuXG4gICAgLy8gSWYgcGFzc2VkIGEgbG9jYWxlIGtleSwgaXQgd2lsbCBzZXQgdGhlIGxvY2FsZSBmb3IgdGhpc1xuICAgIC8vIGluc3RhbmNlLiAgT3RoZXJ3aXNlLCBpdCB3aWxsIHJldHVybiB0aGUgbG9jYWxlIGNvbmZpZ3VyYXRpb25cbiAgICAvLyB2YXJpYWJsZXMgZm9yIHRoaXMgaW5zdGFuY2UuXG4gICAgZnVuY3Rpb24gbG9jYWxlIChrZXkpIHtcbiAgICAgICAgdmFyIG5ld0xvY2FsZURhdGE7XG5cbiAgICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlLl9hYmJyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3TG9jYWxlRGF0YSA9IGdldExvY2FsZShrZXkpO1xuICAgICAgICAgICAgaWYgKG5ld0xvY2FsZURhdGEgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvY2FsZSA9IG5ld0xvY2FsZURhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsYW5nID0gZGVwcmVjYXRlKFxuICAgICAgICAnbW9tZW50KCkubGFuZygpIGlzIGRlcHJlY2F0ZWQuIEluc3RlYWQsIHVzZSBtb21lbnQoKS5sb2NhbGVEYXRhKCkgdG8gZ2V0IHRoZSBsYW5ndWFnZSBjb25maWd1cmF0aW9uLiBVc2UgbW9tZW50KCkubG9jYWxlKCkgdG8gY2hhbmdlIGxhbmd1YWdlcy4nLFxuICAgICAgICBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZShrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgKTtcblxuICAgIGZ1bmN0aW9uIGxvY2FsZURhdGEgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0YXJ0T2YgKHVuaXRzKSB7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICAvLyB0aGUgZm9sbG93aW5nIHN3aXRjaCBpbnRlbnRpb25hbGx5IG9taXRzIGJyZWFrIGtleXdvcmRzXG4gICAgICAgIC8vIHRvIHV0aWxpemUgZmFsbGluZyB0aHJvdWdoIHRoZSBjYXNlcy5cbiAgICAgICAgc3dpdGNoICh1bml0cykge1xuICAgICAgICAgICAgY2FzZSAneWVhcic6XG4gICAgICAgICAgICAgICAgdGhpcy5tb250aCgwKTtcbiAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICBjYXNlICdxdWFydGVyJzpcbiAgICAgICAgICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGUoMSk7XG4gICAgICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICAgICAgY2FzZSAnd2Vlayc6XG4gICAgICAgICAgICBjYXNlICdpc29XZWVrJzpcbiAgICAgICAgICAgIGNhc2UgJ2RheSc6XG4gICAgICAgICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgICAgICAgICB0aGlzLmhvdXJzKDApO1xuICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgIGNhc2UgJ2hvdXInOlxuICAgICAgICAgICAgICAgIHRoaXMubWludXRlcygwKTtcbiAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICBjYXNlICdtaW51dGUnOlxuICAgICAgICAgICAgICAgIHRoaXMuc2Vjb25kcygwKTtcbiAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICBjYXNlICdzZWNvbmQnOlxuICAgICAgICAgICAgICAgIHRoaXMubWlsbGlzZWNvbmRzKDApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2Vla3MgYXJlIGEgc3BlY2lhbCBjYXNlXG4gICAgICAgIGlmICh1bml0cyA9PT0gJ3dlZWsnKSB7XG4gICAgICAgICAgICB0aGlzLndlZWtkYXkoMCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVuaXRzID09PSAnaXNvV2VlaycpIHtcbiAgICAgICAgICAgIHRoaXMuaXNvV2Vla2RheSgxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHF1YXJ0ZXJzIGFyZSBhbHNvIHNwZWNpYWxcbiAgICAgICAgaWYgKHVuaXRzID09PSAncXVhcnRlcicpIHtcbiAgICAgICAgICAgIHRoaXMubW9udGgoTWF0aC5mbG9vcih0aGlzLm1vbnRoKCkgLyAzKSAqIDMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW5kT2YgKHVuaXRzKSB7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICBpZiAodW5pdHMgPT09IHVuZGVmaW5lZCB8fCB1bml0cyA9PT0gJ21pbGxpc2Vjb25kJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAnZGF0ZScgaXMgYW4gYWxpYXMgZm9yICdkYXknLCBzbyBpdCBzaG91bGQgYmUgY29uc2lkZXJlZCBhcyBzdWNoLlxuICAgICAgICBpZiAodW5pdHMgPT09ICdkYXRlJykge1xuICAgICAgICAgICAgdW5pdHMgPSAnZGF5JztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnN0YXJ0T2YodW5pdHMpLmFkZCgxLCAodW5pdHMgPT09ICdpc29XZWVrJyA/ICd3ZWVrJyA6IHVuaXRzKSkuc3VidHJhY3QoMSwgJ21zJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsdWVPZiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kLnZhbHVlT2YoKSAtICgodGhpcy5fb2Zmc2V0IHx8IDApICogNjAwMDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVuaXggKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcih0aGlzLnZhbHVlT2YoKSAvIDEwMDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvRGF0ZSAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSh0aGlzLnZhbHVlT2YoKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9BcnJheSAoKSB7XG4gICAgICAgIHZhciBtID0gdGhpcztcbiAgICAgICAgcmV0dXJuIFttLnllYXIoKSwgbS5tb250aCgpLCBtLmRhdGUoKSwgbS5ob3VyKCksIG0ubWludXRlKCksIG0uc2Vjb25kKCksIG0ubWlsbGlzZWNvbmQoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9PYmplY3QgKCkge1xuICAgICAgICB2YXIgbSA9IHRoaXM7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB5ZWFyczogbS55ZWFyKCksXG4gICAgICAgICAgICBtb250aHM6IG0ubW9udGgoKSxcbiAgICAgICAgICAgIGRhdGU6IG0uZGF0ZSgpLFxuICAgICAgICAgICAgaG91cnM6IG0uaG91cnMoKSxcbiAgICAgICAgICAgIG1pbnV0ZXM6IG0ubWludXRlcygpLFxuICAgICAgICAgICAgc2Vjb25kczogbS5zZWNvbmRzKCksXG4gICAgICAgICAgICBtaWxsaXNlY29uZHM6IG0ubWlsbGlzZWNvbmRzKClcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0pTT04gKCkge1xuICAgICAgICAvLyBuZXcgRGF0ZShOYU4pLnRvSlNPTigpID09PSBudWxsXG4gICAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSA/IHRoaXMudG9JU09TdHJpbmcoKSA6IG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNWYWxpZCQyICgpIHtcbiAgICAgICAgcmV0dXJuIGlzVmFsaWQodGhpcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2luZ0ZsYWdzICgpIHtcbiAgICAgICAgcmV0dXJuIGV4dGVuZCh7fSwgZ2V0UGFyc2luZ0ZsYWdzKHRoaXMpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnZhbGlkQXQgKCkge1xuICAgICAgICByZXR1cm4gZ2V0UGFyc2luZ0ZsYWdzKHRoaXMpLm92ZXJmbG93O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0aW9uRGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlucHV0OiB0aGlzLl9pLFxuICAgICAgICAgICAgZm9ybWF0OiB0aGlzLl9mLFxuICAgICAgICAgICAgbG9jYWxlOiB0aGlzLl9sb2NhbGUsXG4gICAgICAgICAgICBpc1VUQzogdGhpcy5faXNVVEMsXG4gICAgICAgICAgICBzdHJpY3Q6IHRoaXMuX3N0cmljdFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnZ2cnLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy53ZWVrWWVhcigpICUgMTAwO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydHRycsIDJdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzb1dlZWtZZWFyKCkgJSAxMDA7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBhZGRXZWVrWWVhckZvcm1hdFRva2VuICh0b2tlbiwgZ2V0dGVyKSB7XG4gICAgICAgIGFkZEZvcm1hdFRva2VuKDAsIFt0b2tlbiwgdG9rZW4ubGVuZ3RoXSwgMCwgZ2V0dGVyKTtcbiAgICB9XG5cbiAgICBhZGRXZWVrWWVhckZvcm1hdFRva2VuKCdnZ2dnJywgICAgICd3ZWVrWWVhcicpO1xuICAgIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4oJ2dnZ2dnJywgICAgJ3dlZWtZZWFyJyk7XG4gICAgYWRkV2Vla1llYXJGb3JtYXRUb2tlbignR0dHRycsICAnaXNvV2Vla1llYXInKTtcbiAgICBhZGRXZWVrWWVhckZvcm1hdFRva2VuKCdHR0dHRycsICdpc29XZWVrWWVhcicpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCd3ZWVrWWVhcicsICdnZycpO1xuICAgIGFkZFVuaXRBbGlhcygnaXNvV2Vla1llYXInLCAnR0cnKTtcblxuICAgIC8vIFBSSU9SSVRZXG5cbiAgICBhZGRVbml0UHJpb3JpdHkoJ3dlZWtZZWFyJywgMSk7XG4gICAgYWRkVW5pdFByaW9yaXR5KCdpc29XZWVrWWVhcicsIDEpO1xuXG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdHJywgICAgICBtYXRjaFNpZ25lZCk7XG4gICAgYWRkUmVnZXhUb2tlbignZycsICAgICAgbWF0Y2hTaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0dHJywgICAgIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdnZycsICAgICBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignR0dHRycsICAgbWF0Y2gxdG80LCBtYXRjaDQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2dnZ2cnLCAgIG1hdGNoMXRvNCwgbWF0Y2g0KTtcbiAgICBhZGRSZWdleFRva2VuKCdHR0dHRycsICBtYXRjaDF0bzYsIG1hdGNoNik7XG4gICAgYWRkUmVnZXhUb2tlbignZ2dnZ2cnLCAgbWF0Y2gxdG82LCBtYXRjaDYpO1xuXG4gICAgYWRkV2Vla1BhcnNlVG9rZW4oWydnZ2dnJywgJ2dnZ2dnJywgJ0dHR0cnLCAnR0dHR0cnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIHdlZWtbdG9rZW4uc3Vic3RyKDAsIDIpXSA9IHRvSW50KGlucHV0KTtcbiAgICB9KTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsnZ2cnLCAnR0cnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIHdlZWtbdG9rZW5dID0gaG9va3MucGFyc2VUd29EaWdpdFllYXIoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0V2Vla1llYXIgKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBnZXRTZXRXZWVrWWVhckhlbHBlci5jYWxsKHRoaXMsXG4gICAgICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICAgICAgdGhpcy53ZWVrKCksXG4gICAgICAgICAgICAgICAgdGhpcy53ZWVrZGF5KCksXG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWsuZG93LFxuICAgICAgICAgICAgICAgIHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrLmRveSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0SVNPV2Vla1llYXIgKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBnZXRTZXRXZWVrWWVhckhlbHBlci5jYWxsKHRoaXMsXG4gICAgICAgICAgICAgICAgaW5wdXQsIHRoaXMuaXNvV2VlaygpLCB0aGlzLmlzb1dlZWtkYXkoKSwgMSwgNCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0SVNPV2Vla3NJblllYXIgKCkge1xuICAgICAgICByZXR1cm4gd2Vla3NJblllYXIodGhpcy55ZWFyKCksIDEsIDQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFdlZWtzSW5ZZWFyICgpIHtcbiAgICAgICAgdmFyIHdlZWtJbmZvID0gdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWs7XG4gICAgICAgIHJldHVybiB3ZWVrc0luWWVhcih0aGlzLnllYXIoKSwgd2Vla0luZm8uZG93LCB3ZWVrSW5mby5kb3kpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldFdlZWtZZWFySGVscGVyKGlucHV0LCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSkge1xuICAgICAgICB2YXIgd2Vla3NUYXJnZXQ7XG4gICAgICAgIGlmIChpbnB1dCA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gd2Vla09mWWVhcih0aGlzLCBkb3csIGRveSkueWVhcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdlZWtzVGFyZ2V0ID0gd2Vla3NJblllYXIoaW5wdXQsIGRvdywgZG95KTtcbiAgICAgICAgICAgIGlmICh3ZWVrID4gd2Vla3NUYXJnZXQpIHtcbiAgICAgICAgICAgICAgICB3ZWVrID0gd2Vla3NUYXJnZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2V0V2Vla0FsbC5jYWxsKHRoaXMsIGlucHV0LCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRXZWVrQWxsKHdlZWtZZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSkge1xuICAgICAgICB2YXIgZGF5T2ZZZWFyRGF0YSA9IGRheU9mWWVhckZyb21XZWVrcyh3ZWVrWWVhciwgd2Vlaywgd2Vla2RheSwgZG93LCBkb3kpLFxuICAgICAgICAgICAgZGF0ZSA9IGNyZWF0ZVVUQ0RhdGUoZGF5T2ZZZWFyRGF0YS55ZWFyLCAwLCBkYXlPZlllYXJEYXRhLmRheU9mWWVhcik7XG5cbiAgICAgICAgdGhpcy55ZWFyKGRhdGUuZ2V0VVRDRnVsbFllYXIoKSk7XG4gICAgICAgIHRoaXMubW9udGgoZGF0ZS5nZXRVVENNb250aCgpKTtcbiAgICAgICAgdGhpcy5kYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ1EnLCAwLCAnUW8nLCAncXVhcnRlcicpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdxdWFydGVyJywgJ1EnKTtcblxuICAgIC8vIFBSSU9SSVRZXG5cbiAgICBhZGRVbml0UHJpb3JpdHkoJ3F1YXJ0ZXInLCA3KTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ1EnLCBtYXRjaDEpO1xuICAgIGFkZFBhcnNlVG9rZW4oJ1EnLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W01PTlRIXSA9ICh0b0ludChpbnB1dCkgLSAxKSAqIDM7XG4gICAgfSk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXRRdWFydGVyIChpbnB1dCkge1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IE1hdGguY2VpbCgodGhpcy5tb250aCgpICsgMSkgLyAzKSA6IHRoaXMubW9udGgoKGlucHV0IC0gMSkgKiAzICsgdGhpcy5tb250aCgpICUgMyk7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ0QnLCBbJ0REJywgMl0sICdEbycsICdkYXRlJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ2RhdGUnLCAnRCcpO1xuXG4gICAgLy8gUFJJT1JJVFlcbiAgICBhZGRVbml0UHJpb3JpdHkoJ2RhdGUnLCA5KTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ0QnLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdERCcsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdEbycsIGZ1bmN0aW9uIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgICAgIC8vIFRPRE86IFJlbW92ZSBcIm9yZGluYWxQYXJzZVwiIGZhbGxiYWNrIGluIG5leHQgbWFqb3IgcmVsZWFzZS5cbiAgICAgICAgcmV0dXJuIGlzU3RyaWN0ID9cbiAgICAgICAgICAobG9jYWxlLl9kYXlPZk1vbnRoT3JkaW5hbFBhcnNlIHx8IGxvY2FsZS5fb3JkaW5hbFBhcnNlKSA6XG4gICAgICAgICAgbG9jYWxlLl9kYXlPZk1vbnRoT3JkaW5hbFBhcnNlTGVuaWVudDtcbiAgICB9KTtcblxuICAgIGFkZFBhcnNlVG9rZW4oWydEJywgJ0REJ10sIERBVEUpO1xuICAgIGFkZFBhcnNlVG9rZW4oJ0RvJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtEQVRFXSA9IHRvSW50KGlucHV0Lm1hdGNoKG1hdGNoMXRvMilbMF0pO1xuICAgIH0pO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgdmFyIGdldFNldERheU9mTW9udGggPSBtYWtlR2V0U2V0KCdEYXRlJywgdHJ1ZSk7XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBhZGRGb3JtYXRUb2tlbignREREJywgWydEREREJywgM10sICdERERvJywgJ2RheU9mWWVhcicpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdkYXlPZlllYXInLCAnREREJyk7XG5cbiAgICAvLyBQUklPUklUWVxuICAgIGFkZFVuaXRQcmlvcml0eSgnZGF5T2ZZZWFyJywgNCk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdEREQnLCAgbWF0Y2gxdG8zKTtcbiAgICBhZGRSZWdleFRva2VuKCdEREREJywgbWF0Y2gzKTtcbiAgICBhZGRQYXJzZVRva2VuKFsnREREJywgJ0REREQnXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5fZGF5T2ZZZWFyID0gdG9JbnQoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0RGF5T2ZZZWFyIChpbnB1dCkge1xuICAgICAgICB2YXIgZGF5T2ZZZWFyID0gTWF0aC5yb3VuZCgodGhpcy5jbG9uZSgpLnN0YXJ0T2YoJ2RheScpIC0gdGhpcy5jbG9uZSgpLnN0YXJ0T2YoJ3llYXInKSkgLyA4NjRlNSkgKyAxO1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IGRheU9mWWVhciA6IHRoaXMuYWRkKChpbnB1dCAtIGRheU9mWWVhciksICdkJyk7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ20nLCBbJ21tJywgMl0sIDAsICdtaW51dGUnKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnbWludXRlJywgJ20nKTtcblxuICAgIC8vIFBSSU9SSVRZXG5cbiAgICBhZGRVbml0UHJpb3JpdHkoJ21pbnV0ZScsIDE0KTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ20nLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdtbScsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRQYXJzZVRva2VuKFsnbScsICdtbSddLCBNSU5VVEUpO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgdmFyIGdldFNldE1pbnV0ZSA9IG1ha2VHZXRTZXQoJ01pbnV0ZXMnLCBmYWxzZSk7XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBhZGRGb3JtYXRUb2tlbigncycsIFsnc3MnLCAyXSwgMCwgJ3NlY29uZCcpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdzZWNvbmQnLCAncycpO1xuXG4gICAgLy8gUFJJT1JJVFlcblxuICAgIGFkZFVuaXRQcmlvcml0eSgnc2Vjb25kJywgMTUpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbigncycsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ3NzJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydzJywgJ3NzJ10sIFNFQ09ORCk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICB2YXIgZ2V0U2V0U2Vjb25kID0gbWFrZUdldFNldCgnU2Vjb25kcycsIGZhbHNlKTtcblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKCdTJywgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gfn4odGhpcy5taWxsaXNlY29uZCgpIC8gMTAwKTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1MnLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gfn4odGhpcy5taWxsaXNlY29uZCgpIC8gMTApO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1MnLCAzXSwgMCwgJ21pbGxpc2Vjb25kJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTJywgNF0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwO1xuICAgIH0pO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1NTU1MnLCA1XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTAwO1xuICAgIH0pO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1NTU1NTJywgNl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwMDA7XG4gICAgfSk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTU1NTJywgN10sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwMDAwO1xuICAgIH0pO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1NTU1NTU1MnLCA4XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTAwMDAwO1xuICAgIH0pO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1NTU1NTU1NTJywgOV0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwMDAwMDA7XG4gICAgfSk7XG5cblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnbWlsbGlzZWNvbmQnLCAnbXMnKTtcblxuICAgIC8vIFBSSU9SSVRZXG5cbiAgICBhZGRVbml0UHJpb3JpdHkoJ21pbGxpc2Vjb25kJywgMTYpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignUycsICAgIG1hdGNoMXRvMywgbWF0Y2gxKTtcbiAgICBhZGRSZWdleFRva2VuKCdTUycsICAgbWF0Y2gxdG8zLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1NTUycsICBtYXRjaDF0bzMsIG1hdGNoMyk7XG5cbiAgICB2YXIgdG9rZW47XG4gICAgZm9yICh0b2tlbiA9ICdTU1NTJzsgdG9rZW4ubGVuZ3RoIDw9IDk7IHRva2VuICs9ICdTJykge1xuICAgICAgICBhZGRSZWdleFRva2VuKHRva2VuLCBtYXRjaFVuc2lnbmVkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZU1zKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtNSUxMSVNFQ09ORF0gPSB0b0ludCgoJzAuJyArIGlucHV0KSAqIDEwMDApO1xuICAgIH1cblxuICAgIGZvciAodG9rZW4gPSAnUyc7IHRva2VuLmxlbmd0aCA8PSA5OyB0b2tlbiArPSAnUycpIHtcbiAgICAgICAgYWRkUGFyc2VUb2tlbih0b2tlbiwgcGFyc2VNcyk7XG4gICAgfVxuICAgIC8vIE1PTUVOVFNcblxuICAgIHZhciBnZXRTZXRNaWxsaXNlY29uZCA9IG1ha2VHZXRTZXQoJ01pbGxpc2Vjb25kcycsIGZhbHNlKTtcblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKCd6JywgIDAsIDAsICd6b25lQWJicicpO1xuICAgIGFkZEZvcm1hdFRva2VuKCd6eicsIDAsIDAsICd6b25lTmFtZScpO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0Wm9uZUFiYnIgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgPyAnVVRDJyA6ICcnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFpvbmVOYW1lICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gJ0Nvb3JkaW5hdGVkIFVuaXZlcnNhbCBUaW1lJyA6ICcnO1xuICAgIH1cblxuICAgIHZhciBwcm90byA9IE1vbWVudC5wcm90b3R5cGU7XG5cbiAgICBwcm90by5hZGQgICAgICAgICAgICAgICA9IGFkZDtcbiAgICBwcm90by5jYWxlbmRhciAgICAgICAgICA9IGNhbGVuZGFyJDE7XG4gICAgcHJvdG8uY2xvbmUgICAgICAgICAgICAgPSBjbG9uZTtcbiAgICBwcm90by5kaWZmICAgICAgICAgICAgICA9IGRpZmY7XG4gICAgcHJvdG8uZW5kT2YgICAgICAgICAgICAgPSBlbmRPZjtcbiAgICBwcm90by5mb3JtYXQgICAgICAgICAgICA9IGZvcm1hdDtcbiAgICBwcm90by5mcm9tICAgICAgICAgICAgICA9IGZyb207XG4gICAgcHJvdG8uZnJvbU5vdyAgICAgICAgICAgPSBmcm9tTm93O1xuICAgIHByb3RvLnRvICAgICAgICAgICAgICAgID0gdG87XG4gICAgcHJvdG8udG9Ob3cgICAgICAgICAgICAgPSB0b05vdztcbiAgICBwcm90by5nZXQgICAgICAgICAgICAgICA9IHN0cmluZ0dldDtcbiAgICBwcm90by5pbnZhbGlkQXQgICAgICAgICA9IGludmFsaWRBdDtcbiAgICBwcm90by5pc0FmdGVyICAgICAgICAgICA9IGlzQWZ0ZXI7XG4gICAgcHJvdG8uaXNCZWZvcmUgICAgICAgICAgPSBpc0JlZm9yZTtcbiAgICBwcm90by5pc0JldHdlZW4gICAgICAgICA9IGlzQmV0d2VlbjtcbiAgICBwcm90by5pc1NhbWUgICAgICAgICAgICA9IGlzU2FtZTtcbiAgICBwcm90by5pc1NhbWVPckFmdGVyICAgICA9IGlzU2FtZU9yQWZ0ZXI7XG4gICAgcHJvdG8uaXNTYW1lT3JCZWZvcmUgICAgPSBpc1NhbWVPckJlZm9yZTtcbiAgICBwcm90by5pc1ZhbGlkICAgICAgICAgICA9IGlzVmFsaWQkMjtcbiAgICBwcm90by5sYW5nICAgICAgICAgICAgICA9IGxhbmc7XG4gICAgcHJvdG8ubG9jYWxlICAgICAgICAgICAgPSBsb2NhbGU7XG4gICAgcHJvdG8ubG9jYWxlRGF0YSAgICAgICAgPSBsb2NhbGVEYXRhO1xuICAgIHByb3RvLm1heCAgICAgICAgICAgICAgID0gcHJvdG90eXBlTWF4O1xuICAgIHByb3RvLm1pbiAgICAgICAgICAgICAgID0gcHJvdG90eXBlTWluO1xuICAgIHByb3RvLnBhcnNpbmdGbGFncyAgICAgID0gcGFyc2luZ0ZsYWdzO1xuICAgIHByb3RvLnNldCAgICAgICAgICAgICAgID0gc3RyaW5nU2V0O1xuICAgIHByb3RvLnN0YXJ0T2YgICAgICAgICAgID0gc3RhcnRPZjtcbiAgICBwcm90by5zdWJ0cmFjdCAgICAgICAgICA9IHN1YnRyYWN0O1xuICAgIHByb3RvLnRvQXJyYXkgICAgICAgICAgID0gdG9BcnJheTtcbiAgICBwcm90by50b09iamVjdCAgICAgICAgICA9IHRvT2JqZWN0O1xuICAgIHByb3RvLnRvRGF0ZSAgICAgICAgICAgID0gdG9EYXRlO1xuICAgIHByb3RvLnRvSVNPU3RyaW5nICAgICAgID0gdG9JU09TdHJpbmc7XG4gICAgcHJvdG8uaW5zcGVjdCAgICAgICAgICAgPSBpbnNwZWN0O1xuICAgIHByb3RvLnRvSlNPTiAgICAgICAgICAgID0gdG9KU09OO1xuICAgIHByb3RvLnRvU3RyaW5nICAgICAgICAgID0gdG9TdHJpbmc7XG4gICAgcHJvdG8udW5peCAgICAgICAgICAgICAgPSB1bml4O1xuICAgIHByb3RvLnZhbHVlT2YgICAgICAgICAgID0gdmFsdWVPZjtcbiAgICBwcm90by5jcmVhdGlvbkRhdGEgICAgICA9IGNyZWF0aW9uRGF0YTtcbiAgICBwcm90by55ZWFyICAgICAgID0gZ2V0U2V0WWVhcjtcbiAgICBwcm90by5pc0xlYXBZZWFyID0gZ2V0SXNMZWFwWWVhcjtcbiAgICBwcm90by53ZWVrWWVhciAgICA9IGdldFNldFdlZWtZZWFyO1xuICAgIHByb3RvLmlzb1dlZWtZZWFyID0gZ2V0U2V0SVNPV2Vla1llYXI7XG4gICAgcHJvdG8ucXVhcnRlciA9IHByb3RvLnF1YXJ0ZXJzID0gZ2V0U2V0UXVhcnRlcjtcbiAgICBwcm90by5tb250aCAgICAgICA9IGdldFNldE1vbnRoO1xuICAgIHByb3RvLmRheXNJbk1vbnRoID0gZ2V0RGF5c0luTW9udGg7XG4gICAgcHJvdG8ud2VlayAgICAgICAgICAgPSBwcm90by53ZWVrcyAgICAgICAgPSBnZXRTZXRXZWVrO1xuICAgIHByb3RvLmlzb1dlZWsgICAgICAgID0gcHJvdG8uaXNvV2Vla3MgICAgID0gZ2V0U2V0SVNPV2VlaztcbiAgICBwcm90by53ZWVrc0luWWVhciAgICA9IGdldFdlZWtzSW5ZZWFyO1xuICAgIHByb3RvLmlzb1dlZWtzSW5ZZWFyID0gZ2V0SVNPV2Vla3NJblllYXI7XG4gICAgcHJvdG8uZGF0ZSAgICAgICA9IGdldFNldERheU9mTW9udGg7XG4gICAgcHJvdG8uZGF5ICAgICAgICA9IHByb3RvLmRheXMgICAgICAgICAgICAgPSBnZXRTZXREYXlPZldlZWs7XG4gICAgcHJvdG8ud2Vla2RheSAgICA9IGdldFNldExvY2FsZURheU9mV2VlaztcbiAgICBwcm90by5pc29XZWVrZGF5ID0gZ2V0U2V0SVNPRGF5T2ZXZWVrO1xuICAgIHByb3RvLmRheU9mWWVhciAgPSBnZXRTZXREYXlPZlllYXI7XG4gICAgcHJvdG8uaG91ciA9IHByb3RvLmhvdXJzID0gZ2V0U2V0SG91cjtcbiAgICBwcm90by5taW51dGUgPSBwcm90by5taW51dGVzID0gZ2V0U2V0TWludXRlO1xuICAgIHByb3RvLnNlY29uZCA9IHByb3RvLnNlY29uZHMgPSBnZXRTZXRTZWNvbmQ7XG4gICAgcHJvdG8ubWlsbGlzZWNvbmQgPSBwcm90by5taWxsaXNlY29uZHMgPSBnZXRTZXRNaWxsaXNlY29uZDtcbiAgICBwcm90by51dGNPZmZzZXQgICAgICAgICAgICA9IGdldFNldE9mZnNldDtcbiAgICBwcm90by51dGMgICAgICAgICAgICAgICAgICA9IHNldE9mZnNldFRvVVRDO1xuICAgIHByb3RvLmxvY2FsICAgICAgICAgICAgICAgID0gc2V0T2Zmc2V0VG9Mb2NhbDtcbiAgICBwcm90by5wYXJzZVpvbmUgICAgICAgICAgICA9IHNldE9mZnNldFRvUGFyc2VkT2Zmc2V0O1xuICAgIHByb3RvLmhhc0FsaWduZWRIb3VyT2Zmc2V0ID0gaGFzQWxpZ25lZEhvdXJPZmZzZXQ7XG4gICAgcHJvdG8uaXNEU1QgICAgICAgICAgICAgICAgPSBpc0RheWxpZ2h0U2F2aW5nVGltZTtcbiAgICBwcm90by5pc0xvY2FsICAgICAgICAgICAgICA9IGlzTG9jYWw7XG4gICAgcHJvdG8uaXNVdGNPZmZzZXQgICAgICAgICAgPSBpc1V0Y09mZnNldDtcbiAgICBwcm90by5pc1V0YyAgICAgICAgICAgICAgICA9IGlzVXRjO1xuICAgIHByb3RvLmlzVVRDICAgICAgICAgICAgICAgID0gaXNVdGM7XG4gICAgcHJvdG8uem9uZUFiYnIgPSBnZXRab25lQWJicjtcbiAgICBwcm90by56b25lTmFtZSA9IGdldFpvbmVOYW1lO1xuICAgIHByb3RvLmRhdGVzICA9IGRlcHJlY2F0ZSgnZGF0ZXMgYWNjZXNzb3IgaXMgZGVwcmVjYXRlZC4gVXNlIGRhdGUgaW5zdGVhZC4nLCBnZXRTZXREYXlPZk1vbnRoKTtcbiAgICBwcm90by5tb250aHMgPSBkZXByZWNhdGUoJ21vbnRocyBhY2Nlc3NvciBpcyBkZXByZWNhdGVkLiBVc2UgbW9udGggaW5zdGVhZCcsIGdldFNldE1vbnRoKTtcbiAgICBwcm90by55ZWFycyAgPSBkZXByZWNhdGUoJ3llYXJzIGFjY2Vzc29yIGlzIGRlcHJlY2F0ZWQuIFVzZSB5ZWFyIGluc3RlYWQnLCBnZXRTZXRZZWFyKTtcbiAgICBwcm90by56b25lICAgPSBkZXByZWNhdGUoJ21vbWVudCgpLnpvbmUgaXMgZGVwcmVjYXRlZCwgdXNlIG1vbWVudCgpLnV0Y09mZnNldCBpbnN0ZWFkLiBodHRwOi8vbW9tZW50anMuY29tL2d1aWRlcy8jL3dhcm5pbmdzL3pvbmUvJywgZ2V0U2V0Wm9uZSk7XG4gICAgcHJvdG8uaXNEU1RTaGlmdGVkID0gZGVwcmVjYXRlKCdpc0RTVFNoaWZ0ZWQgaXMgZGVwcmVjYXRlZC4gU2VlIGh0dHA6Ly9tb21lbnRqcy5jb20vZ3VpZGVzLyMvd2FybmluZ3MvZHN0LXNoaWZ0ZWQvIGZvciBtb3JlIGluZm9ybWF0aW9uJywgaXNEYXlsaWdodFNhdmluZ1RpbWVTaGlmdGVkKTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZVVuaXggKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVMb2NhbChpbnB1dCAqIDEwMDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUluWm9uZSAoKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVMb2NhbC5hcHBseShudWxsLCBhcmd1bWVudHMpLnBhcnNlWm9uZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByZVBhcnNlUG9zdEZvcm1hdCAoc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgfVxuXG4gICAgdmFyIHByb3RvJDEgPSBMb2NhbGUucHJvdG90eXBlO1xuXG4gICAgcHJvdG8kMS5jYWxlbmRhciAgICAgICAgPSBjYWxlbmRhcjtcbiAgICBwcm90byQxLmxvbmdEYXRlRm9ybWF0ICA9IGxvbmdEYXRlRm9ybWF0O1xuICAgIHByb3RvJDEuaW52YWxpZERhdGUgICAgID0gaW52YWxpZERhdGU7XG4gICAgcHJvdG8kMS5vcmRpbmFsICAgICAgICAgPSBvcmRpbmFsO1xuICAgIHByb3RvJDEucHJlcGFyc2UgICAgICAgID0gcHJlUGFyc2VQb3N0Rm9ybWF0O1xuICAgIHByb3RvJDEucG9zdGZvcm1hdCAgICAgID0gcHJlUGFyc2VQb3N0Rm9ybWF0O1xuICAgIHByb3RvJDEucmVsYXRpdmVUaW1lICAgID0gcmVsYXRpdmVUaW1lO1xuICAgIHByb3RvJDEucGFzdEZ1dHVyZSAgICAgID0gcGFzdEZ1dHVyZTtcbiAgICBwcm90byQxLnNldCAgICAgICAgICAgICA9IHNldDtcblxuICAgIHByb3RvJDEubW9udGhzICAgICAgICAgICAgPSAgICAgICAgbG9jYWxlTW9udGhzO1xuICAgIHByb3RvJDEubW9udGhzU2hvcnQgICAgICAgPSAgICAgICAgbG9jYWxlTW9udGhzU2hvcnQ7XG4gICAgcHJvdG8kMS5tb250aHNQYXJzZSAgICAgICA9ICAgICAgICBsb2NhbGVNb250aHNQYXJzZTtcbiAgICBwcm90byQxLm1vbnRoc1JlZ2V4ICAgICAgID0gbW9udGhzUmVnZXg7XG4gICAgcHJvdG8kMS5tb250aHNTaG9ydFJlZ2V4ICA9IG1vbnRoc1Nob3J0UmVnZXg7XG4gICAgcHJvdG8kMS53ZWVrID0gbG9jYWxlV2VlaztcbiAgICBwcm90byQxLmZpcnN0RGF5T2ZZZWFyID0gbG9jYWxlRmlyc3REYXlPZlllYXI7XG4gICAgcHJvdG8kMS5maXJzdERheU9mV2VlayA9IGxvY2FsZUZpcnN0RGF5T2ZXZWVrO1xuXG4gICAgcHJvdG8kMS53ZWVrZGF5cyAgICAgICA9ICAgICAgICBsb2NhbGVXZWVrZGF5cztcbiAgICBwcm90byQxLndlZWtkYXlzTWluICAgID0gICAgICAgIGxvY2FsZVdlZWtkYXlzTWluO1xuICAgIHByb3RvJDEud2Vla2RheXNTaG9ydCAgPSAgICAgICAgbG9jYWxlV2Vla2RheXNTaG9ydDtcbiAgICBwcm90byQxLndlZWtkYXlzUGFyc2UgID0gICAgICAgIGxvY2FsZVdlZWtkYXlzUGFyc2U7XG5cbiAgICBwcm90byQxLndlZWtkYXlzUmVnZXggICAgICAgPSAgICAgICAgd2Vla2RheXNSZWdleDtcbiAgICBwcm90byQxLndlZWtkYXlzU2hvcnRSZWdleCAgPSAgICAgICAgd2Vla2RheXNTaG9ydFJlZ2V4O1xuICAgIHByb3RvJDEud2Vla2RheXNNaW5SZWdleCAgICA9ICAgICAgICB3ZWVrZGF5c01pblJlZ2V4O1xuXG4gICAgcHJvdG8kMS5pc1BNID0gbG9jYWxlSXNQTTtcbiAgICBwcm90byQxLm1lcmlkaWVtID0gbG9jYWxlTWVyaWRpZW07XG5cbiAgICBmdW5jdGlvbiBnZXQkMSAoZm9ybWF0LCBpbmRleCwgZmllbGQsIHNldHRlcikge1xuICAgICAgICB2YXIgbG9jYWxlID0gZ2V0TG9jYWxlKCk7XG4gICAgICAgIHZhciB1dGMgPSBjcmVhdGVVVEMoKS5zZXQoc2V0dGVyLCBpbmRleCk7XG4gICAgICAgIHJldHVybiBsb2NhbGVbZmllbGRdKHV0YywgZm9ybWF0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0TW9udGhzSW1wbCAoZm9ybWF0LCBpbmRleCwgZmllbGQpIHtcbiAgICAgICAgaWYgKGlzTnVtYmVyKGZvcm1hdCkpIHtcbiAgICAgICAgICAgIGluZGV4ID0gZm9ybWF0O1xuICAgICAgICAgICAgZm9ybWF0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9ybWF0ID0gZm9ybWF0IHx8ICcnO1xuXG4gICAgICAgIGlmIChpbmRleCAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0JDEoZm9ybWF0LCBpbmRleCwgZmllbGQsICdtb250aCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBvdXQgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDEyOyBpKyspIHtcbiAgICAgICAgICAgIG91dFtpXSA9IGdldCQxKGZvcm1hdCwgaSwgZmllbGQsICdtb250aCcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLy8gKClcbiAgICAvLyAoNSlcbiAgICAvLyAoZm10LCA1KVxuICAgIC8vIChmbXQpXG4gICAgLy8gKHRydWUpXG4gICAgLy8gKHRydWUsIDUpXG4gICAgLy8gKHRydWUsIGZtdCwgNSlcbiAgICAvLyAodHJ1ZSwgZm10KVxuICAgIGZ1bmN0aW9uIGxpc3RXZWVrZGF5c0ltcGwgKGxvY2FsZVNvcnRlZCwgZm9ybWF0LCBpbmRleCwgZmllbGQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBsb2NhbGVTb3J0ZWQgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgaWYgKGlzTnVtYmVyKGZvcm1hdCkpIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGZvcm1hdDtcbiAgICAgICAgICAgICAgICBmb3JtYXQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdCB8fCAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvcm1hdCA9IGxvY2FsZVNvcnRlZDtcbiAgICAgICAgICAgIGluZGV4ID0gZm9ybWF0O1xuICAgICAgICAgICAgbG9jYWxlU29ydGVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmIChpc051bWJlcihmb3JtYXQpKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBmb3JtYXQ7XG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQgfHwgJyc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbG9jYWxlID0gZ2V0TG9jYWxlKCksXG4gICAgICAgICAgICBzaGlmdCA9IGxvY2FsZVNvcnRlZCA/IGxvY2FsZS5fd2Vlay5kb3cgOiAwO1xuXG4gICAgICAgIGlmIChpbmRleCAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0JDEoZm9ybWF0LCAoaW5kZXggKyBzaGlmdCkgJSA3LCBmaWVsZCwgJ2RheScpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBvdXQgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgICAgICAgb3V0W2ldID0gZ2V0JDEoZm9ybWF0LCAoaSArIHNoaWZ0KSAlIDcsIGZpZWxkLCAnZGF5Jyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0TW9udGhzIChmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBsaXN0TW9udGhzSW1wbChmb3JtYXQsIGluZGV4LCAnbW9udGhzJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdE1vbnRoc1Nob3J0IChmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBsaXN0TW9udGhzSW1wbChmb3JtYXQsIGluZGV4LCAnbW9udGhzU2hvcnQnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0V2Vla2RheXMgKGxvY2FsZVNvcnRlZCwgZm9ybWF0LCBpbmRleCkge1xuICAgICAgICByZXR1cm4gbGlzdFdlZWtkYXlzSW1wbChsb2NhbGVTb3J0ZWQsIGZvcm1hdCwgaW5kZXgsICd3ZWVrZGF5cycpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RXZWVrZGF5c1Nob3J0IChsb2NhbGVTb3J0ZWQsIGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3RXZWVrZGF5c0ltcGwobG9jYWxlU29ydGVkLCBmb3JtYXQsIGluZGV4LCAnd2Vla2RheXNTaG9ydCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RXZWVrZGF5c01pbiAobG9jYWxlU29ydGVkLCBmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBsaXN0V2Vla2RheXNJbXBsKGxvY2FsZVNvcnRlZCwgZm9ybWF0LCBpbmRleCwgJ3dlZWtkYXlzTWluJyk7XG4gICAgfVxuXG4gICAgZ2V0U2V0R2xvYmFsTG9jYWxlKCdlbicsIHtcbiAgICAgICAgZGF5T2ZNb250aE9yZGluYWxQYXJzZTogL1xcZHsxLDJ9KHRofHN0fG5kfHJkKS8sXG4gICAgICAgIG9yZGluYWwgOiBmdW5jdGlvbiAobnVtYmVyKSB7XG4gICAgICAgICAgICB2YXIgYiA9IG51bWJlciAlIDEwLFxuICAgICAgICAgICAgICAgIG91dHB1dCA9ICh0b0ludChudW1iZXIgJSAxMDAgLyAxMCkgPT09IDEpID8gJ3RoJyA6XG4gICAgICAgICAgICAgICAgKGIgPT09IDEpID8gJ3N0JyA6XG4gICAgICAgICAgICAgICAgKGIgPT09IDIpID8gJ25kJyA6XG4gICAgICAgICAgICAgICAgKGIgPT09IDMpID8gJ3JkJyA6ICd0aCc7XG4gICAgICAgICAgICByZXR1cm4gbnVtYmVyICsgb3V0cHV0O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBTaWRlIGVmZmVjdCBpbXBvcnRzXG5cbiAgICBob29rcy5sYW5nID0gZGVwcmVjYXRlKCdtb21lbnQubGFuZyBpcyBkZXByZWNhdGVkLiBVc2UgbW9tZW50LmxvY2FsZSBpbnN0ZWFkLicsIGdldFNldEdsb2JhbExvY2FsZSk7XG4gICAgaG9va3MubGFuZ0RhdGEgPSBkZXByZWNhdGUoJ21vbWVudC5sYW5nRGF0YSBpcyBkZXByZWNhdGVkLiBVc2UgbW9tZW50LmxvY2FsZURhdGEgaW5zdGVhZC4nLCBnZXRMb2NhbGUpO1xuXG4gICAgdmFyIG1hdGhBYnMgPSBNYXRoLmFicztcblxuICAgIGZ1bmN0aW9uIGFicyAoKSB7XG4gICAgICAgIHZhciBkYXRhICAgICAgICAgICA9IHRoaXMuX2RhdGE7XG5cbiAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzID0gbWF0aEFicyh0aGlzLl9taWxsaXNlY29uZHMpO1xuICAgICAgICB0aGlzLl9kYXlzICAgICAgICAgPSBtYXRoQWJzKHRoaXMuX2RheXMpO1xuICAgICAgICB0aGlzLl9tb250aHMgICAgICAgPSBtYXRoQWJzKHRoaXMuX21vbnRocyk7XG5cbiAgICAgICAgZGF0YS5taWxsaXNlY29uZHMgID0gbWF0aEFicyhkYXRhLm1pbGxpc2Vjb25kcyk7XG4gICAgICAgIGRhdGEuc2Vjb25kcyAgICAgICA9IG1hdGhBYnMoZGF0YS5zZWNvbmRzKTtcbiAgICAgICAgZGF0YS5taW51dGVzICAgICAgID0gbWF0aEFicyhkYXRhLm1pbnV0ZXMpO1xuICAgICAgICBkYXRhLmhvdXJzICAgICAgICAgPSBtYXRoQWJzKGRhdGEuaG91cnMpO1xuICAgICAgICBkYXRhLm1vbnRocyAgICAgICAgPSBtYXRoQWJzKGRhdGEubW9udGhzKTtcbiAgICAgICAgZGF0YS55ZWFycyAgICAgICAgID0gbWF0aEFicyhkYXRhLnllYXJzKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRTdWJ0cmFjdCQxIChkdXJhdGlvbiwgaW5wdXQsIHZhbHVlLCBkaXJlY3Rpb24pIHtcbiAgICAgICAgdmFyIG90aGVyID0gY3JlYXRlRHVyYXRpb24oaW5wdXQsIHZhbHVlKTtcblxuICAgICAgICBkdXJhdGlvbi5fbWlsbGlzZWNvbmRzICs9IGRpcmVjdGlvbiAqIG90aGVyLl9taWxsaXNlY29uZHM7XG4gICAgICAgIGR1cmF0aW9uLl9kYXlzICAgICAgICAgKz0gZGlyZWN0aW9uICogb3RoZXIuX2RheXM7XG4gICAgICAgIGR1cmF0aW9uLl9tb250aHMgICAgICAgKz0gZGlyZWN0aW9uICogb3RoZXIuX21vbnRocztcblxuICAgICAgICByZXR1cm4gZHVyYXRpb24uX2J1YmJsZSgpO1xuICAgIH1cblxuICAgIC8vIHN1cHBvcnRzIG9ubHkgMi4wLXN0eWxlIGFkZCgxLCAncycpIG9yIGFkZChkdXJhdGlvbilcbiAgICBmdW5jdGlvbiBhZGQkMSAoaW5wdXQsIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBhZGRTdWJ0cmFjdCQxKHRoaXMsIGlucHV0LCB2YWx1ZSwgMSk7XG4gICAgfVxuXG4gICAgLy8gc3VwcG9ydHMgb25seSAyLjAtc3R5bGUgc3VidHJhY3QoMSwgJ3MnKSBvciBzdWJ0cmFjdChkdXJhdGlvbilcbiAgICBmdW5jdGlvbiBzdWJ0cmFjdCQxIChpbnB1dCwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGFkZFN1YnRyYWN0JDEodGhpcywgaW5wdXQsIHZhbHVlLCAtMSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWJzQ2VpbCAobnVtYmVyKSB7XG4gICAgICAgIGlmIChudW1iZXIgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihudW1iZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbChudW1iZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYnViYmxlICgpIHtcbiAgICAgICAgdmFyIG1pbGxpc2Vjb25kcyA9IHRoaXMuX21pbGxpc2Vjb25kcztcbiAgICAgICAgdmFyIGRheXMgICAgICAgICA9IHRoaXMuX2RheXM7XG4gICAgICAgIHZhciBtb250aHMgICAgICAgPSB0aGlzLl9tb250aHM7XG4gICAgICAgIHZhciBkYXRhICAgICAgICAgPSB0aGlzLl9kYXRhO1xuICAgICAgICB2YXIgc2Vjb25kcywgbWludXRlcywgaG91cnMsIHllYXJzLCBtb250aHNGcm9tRGF5cztcblxuICAgICAgICAvLyBpZiB3ZSBoYXZlIGEgbWl4IG9mIHBvc2l0aXZlIGFuZCBuZWdhdGl2ZSB2YWx1ZXMsIGJ1YmJsZSBkb3duIGZpcnN0XG4gICAgICAgIC8vIGNoZWNrOiBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMjE2NlxuICAgICAgICBpZiAoISgobWlsbGlzZWNvbmRzID49IDAgJiYgZGF5cyA+PSAwICYmIG1vbnRocyA+PSAwKSB8fFxuICAgICAgICAgICAgICAgIChtaWxsaXNlY29uZHMgPD0gMCAmJiBkYXlzIDw9IDAgJiYgbW9udGhzIDw9IDApKSkge1xuICAgICAgICAgICAgbWlsbGlzZWNvbmRzICs9IGFic0NlaWwobW9udGhzVG9EYXlzKG1vbnRocykgKyBkYXlzKSAqIDg2NGU1O1xuICAgICAgICAgICAgZGF5cyA9IDA7XG4gICAgICAgICAgICBtb250aHMgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBjb2RlIGJ1YmJsZXMgdXAgdmFsdWVzLCBzZWUgdGhlIHRlc3RzIGZvclxuICAgICAgICAvLyBleGFtcGxlcyBvZiB3aGF0IHRoYXQgbWVhbnMuXG4gICAgICAgIGRhdGEubWlsbGlzZWNvbmRzID0gbWlsbGlzZWNvbmRzICUgMTAwMDtcblxuICAgICAgICBzZWNvbmRzICAgICAgICAgICA9IGFic0Zsb29yKG1pbGxpc2Vjb25kcyAvIDEwMDApO1xuICAgICAgICBkYXRhLnNlY29uZHMgICAgICA9IHNlY29uZHMgJSA2MDtcblxuICAgICAgICBtaW51dGVzICAgICAgICAgICA9IGFic0Zsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgICAgIGRhdGEubWludXRlcyAgICAgID0gbWludXRlcyAlIDYwO1xuXG4gICAgICAgIGhvdXJzICAgICAgICAgICAgID0gYWJzRmxvb3IobWludXRlcyAvIDYwKTtcbiAgICAgICAgZGF0YS5ob3VycyAgICAgICAgPSBob3VycyAlIDI0O1xuXG4gICAgICAgIGRheXMgKz0gYWJzRmxvb3IoaG91cnMgLyAyNCk7XG5cbiAgICAgICAgLy8gY29udmVydCBkYXlzIHRvIG1vbnRoc1xuICAgICAgICBtb250aHNGcm9tRGF5cyA9IGFic0Zsb29yKGRheXNUb01vbnRocyhkYXlzKSk7XG4gICAgICAgIG1vbnRocyArPSBtb250aHNGcm9tRGF5cztcbiAgICAgICAgZGF5cyAtPSBhYnNDZWlsKG1vbnRoc1RvRGF5cyhtb250aHNGcm9tRGF5cykpO1xuXG4gICAgICAgIC8vIDEyIG1vbnRocyAtPiAxIHllYXJcbiAgICAgICAgeWVhcnMgPSBhYnNGbG9vcihtb250aHMgLyAxMik7XG4gICAgICAgIG1vbnRocyAlPSAxMjtcblxuICAgICAgICBkYXRhLmRheXMgICA9IGRheXM7XG4gICAgICAgIGRhdGEubW9udGhzID0gbW9udGhzO1xuICAgICAgICBkYXRhLnllYXJzICA9IHllYXJzO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRheXNUb01vbnRocyAoZGF5cykge1xuICAgICAgICAvLyA0MDAgeWVhcnMgaGF2ZSAxNDYwOTcgZGF5cyAodGFraW5nIGludG8gYWNjb3VudCBsZWFwIHllYXIgcnVsZXMpXG4gICAgICAgIC8vIDQwMCB5ZWFycyBoYXZlIDEyIG1vbnRocyA9PT0gNDgwMFxuICAgICAgICByZXR1cm4gZGF5cyAqIDQ4MDAgLyAxNDYwOTc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9udGhzVG9EYXlzIChtb250aHMpIHtcbiAgICAgICAgLy8gdGhlIHJldmVyc2Ugb2YgZGF5c1RvTW9udGhzXG4gICAgICAgIHJldHVybiBtb250aHMgKiAxNDYwOTcgLyA0ODAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFzICh1bml0cykge1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkYXlzO1xuICAgICAgICB2YXIgbW9udGhzO1xuICAgICAgICB2YXIgbWlsbGlzZWNvbmRzID0gdGhpcy5fbWlsbGlzZWNvbmRzO1xuXG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuXG4gICAgICAgIGlmICh1bml0cyA9PT0gJ21vbnRoJyB8fCB1bml0cyA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgICBkYXlzICAgPSB0aGlzLl9kYXlzICAgKyBtaWxsaXNlY29uZHMgLyA4NjRlNTtcbiAgICAgICAgICAgIG1vbnRocyA9IHRoaXMuX21vbnRocyArIGRheXNUb01vbnRocyhkYXlzKTtcbiAgICAgICAgICAgIHJldHVybiB1bml0cyA9PT0gJ21vbnRoJyA/IG1vbnRocyA6IG1vbnRocyAvIDEyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaGFuZGxlIG1pbGxpc2Vjb25kcyBzZXBhcmF0ZWx5IGJlY2F1c2Ugb2YgZmxvYXRpbmcgcG9pbnQgbWF0aCBlcnJvcnMgKGlzc3VlICMxODY3KVxuICAgICAgICAgICAgZGF5cyA9IHRoaXMuX2RheXMgKyBNYXRoLnJvdW5kKG1vbnRoc1RvRGF5cyh0aGlzLl9tb250aHMpKTtcbiAgICAgICAgICAgIHN3aXRjaCAodW5pdHMpIHtcbiAgICAgICAgICAgICAgICBjYXNlICd3ZWVrJyAgIDogcmV0dXJuIGRheXMgLyA3ICAgICArIG1pbGxpc2Vjb25kcyAvIDYwNDhlNTtcbiAgICAgICAgICAgICAgICBjYXNlICdkYXknICAgIDogcmV0dXJuIGRheXMgICAgICAgICArIG1pbGxpc2Vjb25kcyAvIDg2NGU1O1xuICAgICAgICAgICAgICAgIGNhc2UgJ2hvdXInICAgOiByZXR1cm4gZGF5cyAqIDI0ICAgICsgbWlsbGlzZWNvbmRzIC8gMzZlNTtcbiAgICAgICAgICAgICAgICBjYXNlICdtaW51dGUnIDogcmV0dXJuIGRheXMgKiAxNDQwICArIG1pbGxpc2Vjb25kcyAvIDZlNDtcbiAgICAgICAgICAgICAgICBjYXNlICdzZWNvbmQnIDogcmV0dXJuIGRheXMgKiA4NjQwMCArIG1pbGxpc2Vjb25kcyAvIDEwMDA7XG4gICAgICAgICAgICAgICAgLy8gTWF0aC5mbG9vciBwcmV2ZW50cyBmbG9hdGluZyBwb2ludCBtYXRoIGVycm9ycyBoZXJlXG4gICAgICAgICAgICAgICAgY2FzZSAnbWlsbGlzZWNvbmQnOiByZXR1cm4gTWF0aC5mbG9vcihkYXlzICogODY0ZTUpICsgbWlsbGlzZWNvbmRzO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcignVW5rbm93biB1bml0ICcgKyB1bml0cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUT0RPOiBVc2UgdGhpcy5hcygnbXMnKT9cbiAgICBmdW5jdGlvbiB2YWx1ZU9mJDEgKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0aGlzLl9taWxsaXNlY29uZHMgK1xuICAgICAgICAgICAgdGhpcy5fZGF5cyAqIDg2NGU1ICtcbiAgICAgICAgICAgICh0aGlzLl9tb250aHMgJSAxMikgKiAyNTkyZTYgK1xuICAgICAgICAgICAgdG9JbnQodGhpcy5fbW9udGhzIC8gMTIpICogMzE1MzZlNlxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VBcyAoYWxpYXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFzKGFsaWFzKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgYXNNaWxsaXNlY29uZHMgPSBtYWtlQXMoJ21zJyk7XG4gICAgdmFyIGFzU2Vjb25kcyAgICAgID0gbWFrZUFzKCdzJyk7XG4gICAgdmFyIGFzTWludXRlcyAgICAgID0gbWFrZUFzKCdtJyk7XG4gICAgdmFyIGFzSG91cnMgICAgICAgID0gbWFrZUFzKCdoJyk7XG4gICAgdmFyIGFzRGF5cyAgICAgICAgID0gbWFrZUFzKCdkJyk7XG4gICAgdmFyIGFzV2Vla3MgICAgICAgID0gbWFrZUFzKCd3Jyk7XG4gICAgdmFyIGFzTW9udGhzICAgICAgID0gbWFrZUFzKCdNJyk7XG4gICAgdmFyIGFzWWVhcnMgICAgICAgID0gbWFrZUFzKCd5Jyk7XG5cbiAgICBmdW5jdGlvbiBjbG9uZSQxICgpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUR1cmF0aW9uKHRoaXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldCQyICh1bml0cykge1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCgpID8gdGhpc1t1bml0cyArICdzJ10oKSA6IE5hTjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlR2V0dGVyKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSA/IHRoaXMuX2RhdGFbbmFtZV0gOiBOYU47XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIG1pbGxpc2Vjb25kcyA9IG1ha2VHZXR0ZXIoJ21pbGxpc2Vjb25kcycpO1xuICAgIHZhciBzZWNvbmRzICAgICAgPSBtYWtlR2V0dGVyKCdzZWNvbmRzJyk7XG4gICAgdmFyIG1pbnV0ZXMgICAgICA9IG1ha2VHZXR0ZXIoJ21pbnV0ZXMnKTtcbiAgICB2YXIgaG91cnMgICAgICAgID0gbWFrZUdldHRlcignaG91cnMnKTtcbiAgICB2YXIgZGF5cyAgICAgICAgID0gbWFrZUdldHRlcignZGF5cycpO1xuICAgIHZhciBtb250aHMgICAgICAgPSBtYWtlR2V0dGVyKCdtb250aHMnKTtcbiAgICB2YXIgeWVhcnMgICAgICAgID0gbWFrZUdldHRlcigneWVhcnMnKTtcblxuICAgIGZ1bmN0aW9uIHdlZWtzICgpIHtcbiAgICAgICAgcmV0dXJuIGFic0Zsb29yKHRoaXMuZGF5cygpIC8gNyk7XG4gICAgfVxuXG4gICAgdmFyIHJvdW5kID0gTWF0aC5yb3VuZDtcbiAgICB2YXIgdGhyZXNob2xkcyA9IHtcbiAgICAgICAgc3M6IDQ0LCAgICAgICAgIC8vIGEgZmV3IHNlY29uZHMgdG8gc2Vjb25kc1xuICAgICAgICBzIDogNDUsICAgICAgICAgLy8gc2Vjb25kcyB0byBtaW51dGVcbiAgICAgICAgbSA6IDQ1LCAgICAgICAgIC8vIG1pbnV0ZXMgdG8gaG91clxuICAgICAgICBoIDogMjIsICAgICAgICAgLy8gaG91cnMgdG8gZGF5XG4gICAgICAgIGQgOiAyNiwgICAgICAgICAvLyBkYXlzIHRvIG1vbnRoXG4gICAgICAgIE0gOiAxMSAgICAgICAgICAvLyBtb250aHMgdG8geWVhclxuICAgIH07XG5cbiAgICAvLyBoZWxwZXIgZnVuY3Rpb24gZm9yIG1vbWVudC5mbi5mcm9tLCBtb21lbnQuZm4uZnJvbU5vdywgYW5kIG1vbWVudC5kdXJhdGlvbi5mbi5odW1hbml6ZVxuICAgIGZ1bmN0aW9uIHN1YnN0aXR1dGVUaW1lQWdvKHN0cmluZywgbnVtYmVyLCB3aXRob3V0U3VmZml4LCBpc0Z1dHVyZSwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUucmVsYXRpdmVUaW1lKG51bWJlciB8fCAxLCAhIXdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbGF0aXZlVGltZSQxIChwb3NOZWdEdXJhdGlvbiwgd2l0aG91dFN1ZmZpeCwgbG9jYWxlKSB7XG4gICAgICAgIHZhciBkdXJhdGlvbiA9IGNyZWF0ZUR1cmF0aW9uKHBvc05lZ0R1cmF0aW9uKS5hYnMoKTtcbiAgICAgICAgdmFyIHNlY29uZHMgID0gcm91bmQoZHVyYXRpb24uYXMoJ3MnKSk7XG4gICAgICAgIHZhciBtaW51dGVzICA9IHJvdW5kKGR1cmF0aW9uLmFzKCdtJykpO1xuICAgICAgICB2YXIgaG91cnMgICAgPSByb3VuZChkdXJhdGlvbi5hcygnaCcpKTtcbiAgICAgICAgdmFyIGRheXMgICAgID0gcm91bmQoZHVyYXRpb24uYXMoJ2QnKSk7XG4gICAgICAgIHZhciBtb250aHMgICA9IHJvdW5kKGR1cmF0aW9uLmFzKCdNJykpO1xuICAgICAgICB2YXIgeWVhcnMgICAgPSByb3VuZChkdXJhdGlvbi5hcygneScpKTtcblxuICAgICAgICB2YXIgYSA9IHNlY29uZHMgPD0gdGhyZXNob2xkcy5zcyAmJiBbJ3MnLCBzZWNvbmRzXSAgfHxcbiAgICAgICAgICAgICAgICBzZWNvbmRzIDwgdGhyZXNob2xkcy5zICAgJiYgWydzcycsIHNlY29uZHNdIHx8XG4gICAgICAgICAgICAgICAgbWludXRlcyA8PSAxICAgICAgICAgICAgICYmIFsnbSddICAgICAgICAgICB8fFxuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPCB0aHJlc2hvbGRzLm0gICAmJiBbJ21tJywgbWludXRlc10gfHxcbiAgICAgICAgICAgICAgICBob3VycyAgIDw9IDEgICAgICAgICAgICAgJiYgWydoJ10gICAgICAgICAgIHx8XG4gICAgICAgICAgICAgICAgaG91cnMgICA8IHRocmVzaG9sZHMuaCAgICYmIFsnaGgnLCBob3Vyc10gICB8fFxuICAgICAgICAgICAgICAgIGRheXMgICAgPD0gMSAgICAgICAgICAgICAmJiBbJ2QnXSAgICAgICAgICAgfHxcbiAgICAgICAgICAgICAgICBkYXlzICAgIDwgdGhyZXNob2xkcy5kICAgJiYgWydkZCcsIGRheXNdICAgIHx8XG4gICAgICAgICAgICAgICAgbW9udGhzICA8PSAxICAgICAgICAgICAgICYmIFsnTSddICAgICAgICAgICB8fFxuICAgICAgICAgICAgICAgIG1vbnRocyAgPCB0aHJlc2hvbGRzLk0gICAmJiBbJ01NJywgbW9udGhzXSAgfHxcbiAgICAgICAgICAgICAgICB5ZWFycyAgIDw9IDEgICAgICAgICAgICAgJiYgWyd5J10gICAgICAgICAgIHx8IFsneXknLCB5ZWFyc107XG5cbiAgICAgICAgYVsyXSA9IHdpdGhvdXRTdWZmaXg7XG4gICAgICAgIGFbM10gPSArcG9zTmVnRHVyYXRpb24gPiAwO1xuICAgICAgICBhWzRdID0gbG9jYWxlO1xuICAgICAgICByZXR1cm4gc3Vic3RpdHV0ZVRpbWVBZ28uYXBwbHkobnVsbCwgYSk7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBhbGxvd3MgeW91IHRvIHNldCB0aGUgcm91bmRpbmcgZnVuY3Rpb24gZm9yIHJlbGF0aXZlIHRpbWUgc3RyaW5nc1xuICAgIGZ1bmN0aW9uIGdldFNldFJlbGF0aXZlVGltZVJvdW5kaW5nIChyb3VuZGluZ0Z1bmN0aW9uKSB7XG4gICAgICAgIGlmIChyb3VuZGluZ0Z1bmN0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiByb3VuZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mKHJvdW5kaW5nRnVuY3Rpb24pID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByb3VuZCA9IHJvdW5kaW5nRnVuY3Rpb247XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBhbGxvd3MgeW91IHRvIHNldCBhIHRocmVzaG9sZCBmb3IgcmVsYXRpdmUgdGltZSBzdHJpbmdzXG4gICAgZnVuY3Rpb24gZ2V0U2V0UmVsYXRpdmVUaW1lVGhyZXNob2xkICh0aHJlc2hvbGQsIGxpbWl0KSB7XG4gICAgICAgIGlmICh0aHJlc2hvbGRzW3RocmVzaG9sZF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsaW1pdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhyZXNob2xkc1t0aHJlc2hvbGRdO1xuICAgICAgICB9XG4gICAgICAgIHRocmVzaG9sZHNbdGhyZXNob2xkXSA9IGxpbWl0O1xuICAgICAgICBpZiAodGhyZXNob2xkID09PSAncycpIHtcbiAgICAgICAgICAgIHRocmVzaG9sZHMuc3MgPSBsaW1pdCAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaHVtYW5pemUgKHdpdGhTdWZmaXgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLmludmFsaWREYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbG9jYWxlID0gdGhpcy5sb2NhbGVEYXRhKCk7XG4gICAgICAgIHZhciBvdXRwdXQgPSByZWxhdGl2ZVRpbWUkMSh0aGlzLCAhd2l0aFN1ZmZpeCwgbG9jYWxlKTtcblxuICAgICAgICBpZiAod2l0aFN1ZmZpeCkge1xuICAgICAgICAgICAgb3V0cHV0ID0gbG9jYWxlLnBhc3RGdXR1cmUoK3RoaXMsIG91dHB1dCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbG9jYWxlLnBvc3Rmb3JtYXQob3V0cHV0KTtcbiAgICB9XG5cbiAgICB2YXIgYWJzJDEgPSBNYXRoLmFicztcblxuICAgIGZ1bmN0aW9uIHNpZ24oeCkge1xuICAgICAgICByZXR1cm4gKCh4ID4gMCkgLSAoeCA8IDApKSB8fCAreDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0lTT1N0cmluZyQxKCkge1xuICAgICAgICAvLyBmb3IgSVNPIHN0cmluZ3Mgd2UgZG8gbm90IHVzZSB0aGUgbm9ybWFsIGJ1YmJsaW5nIHJ1bGVzOlxuICAgICAgICAvLyAgKiBtaWxsaXNlY29uZHMgYnViYmxlIHVwIHVudGlsIHRoZXkgYmVjb21lIGhvdXJzXG4gICAgICAgIC8vICAqIGRheXMgZG8gbm90IGJ1YmJsZSBhdCBhbGxcbiAgICAgICAgLy8gICogbW9udGhzIGJ1YmJsZSB1cCB1bnRpbCB0aGV5IGJlY29tZSB5ZWFyc1xuICAgICAgICAvLyBUaGlzIGlzIGJlY2F1c2UgdGhlcmUgaXMgbm8gY29udGV4dC1mcmVlIGNvbnZlcnNpb24gYmV0d2VlbiBob3VycyBhbmQgZGF5c1xuICAgICAgICAvLyAodGhpbmsgb2YgY2xvY2sgY2hhbmdlcylcbiAgICAgICAgLy8gYW5kIGFsc28gbm90IGJldHdlZW4gZGF5cyBhbmQgbW9udGhzICgyOC0zMSBkYXlzIHBlciBtb250aClcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLmludmFsaWREYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2Vjb25kcyA9IGFicyQxKHRoaXMuX21pbGxpc2Vjb25kcykgLyAxMDAwO1xuICAgICAgICB2YXIgZGF5cyAgICAgICAgID0gYWJzJDEodGhpcy5fZGF5cyk7XG4gICAgICAgIHZhciBtb250aHMgICAgICAgPSBhYnMkMSh0aGlzLl9tb250aHMpO1xuICAgICAgICB2YXIgbWludXRlcywgaG91cnMsIHllYXJzO1xuXG4gICAgICAgIC8vIDM2MDAgc2Vjb25kcyAtPiA2MCBtaW51dGVzIC0+IDEgaG91clxuICAgICAgICBtaW51dGVzICAgICAgICAgICA9IGFic0Zsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgICAgIGhvdXJzICAgICAgICAgICAgID0gYWJzRmxvb3IobWludXRlcyAvIDYwKTtcbiAgICAgICAgc2Vjb25kcyAlPSA2MDtcbiAgICAgICAgbWludXRlcyAlPSA2MDtcblxuICAgICAgICAvLyAxMiBtb250aHMgLT4gMSB5ZWFyXG4gICAgICAgIHllYXJzICA9IGFic0Zsb29yKG1vbnRocyAvIDEyKTtcbiAgICAgICAgbW9udGhzICU9IDEyO1xuXG5cbiAgICAgICAgLy8gaW5zcGlyZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL2RvcmRpbGxlL21vbWVudC1pc29kdXJhdGlvbi9ibG9iL21hc3Rlci9tb21lbnQuaXNvZHVyYXRpb24uanNcbiAgICAgICAgdmFyIFkgPSB5ZWFycztcbiAgICAgICAgdmFyIE0gPSBtb250aHM7XG4gICAgICAgIHZhciBEID0gZGF5cztcbiAgICAgICAgdmFyIGggPSBob3VycztcbiAgICAgICAgdmFyIG0gPSBtaW51dGVzO1xuICAgICAgICB2YXIgcyA9IHNlY29uZHMgPyBzZWNvbmRzLnRvRml4ZWQoMykucmVwbGFjZSgvXFwuPzArJC8sICcnKSA6ICcnO1xuICAgICAgICB2YXIgdG90YWwgPSB0aGlzLmFzU2Vjb25kcygpO1xuXG4gICAgICAgIGlmICghdG90YWwpIHtcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgdGhlIHNhbWUgYXMgQyMncyAoTm9kYSkgYW5kIHB5dGhvbiAoaXNvZGF0ZSkuLi5cbiAgICAgICAgICAgIC8vIGJ1dCBub3Qgb3RoZXIgSlMgKGdvb2cuZGF0ZSlcbiAgICAgICAgICAgIHJldHVybiAnUDBEJztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0b3RhbFNpZ24gPSB0b3RhbCA8IDAgPyAnLScgOiAnJztcbiAgICAgICAgdmFyIHltU2lnbiA9IHNpZ24odGhpcy5fbW9udGhzKSAhPT0gc2lnbih0b3RhbCkgPyAnLScgOiAnJztcbiAgICAgICAgdmFyIGRheXNTaWduID0gc2lnbih0aGlzLl9kYXlzKSAhPT0gc2lnbih0b3RhbCkgPyAnLScgOiAnJztcbiAgICAgICAgdmFyIGhtc1NpZ24gPSBzaWduKHRoaXMuX21pbGxpc2Vjb25kcykgIT09IHNpZ24odG90YWwpID8gJy0nIDogJyc7XG5cbiAgICAgICAgcmV0dXJuIHRvdGFsU2lnbiArICdQJyArXG4gICAgICAgICAgICAoWSA/IHltU2lnbiArIFkgKyAnWScgOiAnJykgK1xuICAgICAgICAgICAgKE0gPyB5bVNpZ24gKyBNICsgJ00nIDogJycpICtcbiAgICAgICAgICAgIChEID8gZGF5c1NpZ24gKyBEICsgJ0QnIDogJycpICtcbiAgICAgICAgICAgICgoaCB8fCBtIHx8IHMpID8gJ1QnIDogJycpICtcbiAgICAgICAgICAgIChoID8gaG1zU2lnbiArIGggKyAnSCcgOiAnJykgK1xuICAgICAgICAgICAgKG0gPyBobXNTaWduICsgbSArICdNJyA6ICcnKSArXG4gICAgICAgICAgICAocyA/IGhtc1NpZ24gKyBzICsgJ1MnIDogJycpO1xuICAgIH1cblxuICAgIHZhciBwcm90byQyID0gRHVyYXRpb24ucHJvdG90eXBlO1xuXG4gICAgcHJvdG8kMi5pc1ZhbGlkICAgICAgICA9IGlzVmFsaWQkMTtcbiAgICBwcm90byQyLmFicyAgICAgICAgICAgID0gYWJzO1xuICAgIHByb3RvJDIuYWRkICAgICAgICAgICAgPSBhZGQkMTtcbiAgICBwcm90byQyLnN1YnRyYWN0ICAgICAgID0gc3VidHJhY3QkMTtcbiAgICBwcm90byQyLmFzICAgICAgICAgICAgID0gYXM7XG4gICAgcHJvdG8kMi5hc01pbGxpc2Vjb25kcyA9IGFzTWlsbGlzZWNvbmRzO1xuICAgIHByb3RvJDIuYXNTZWNvbmRzICAgICAgPSBhc1NlY29uZHM7XG4gICAgcHJvdG8kMi5hc01pbnV0ZXMgICAgICA9IGFzTWludXRlcztcbiAgICBwcm90byQyLmFzSG91cnMgICAgICAgID0gYXNIb3VycztcbiAgICBwcm90byQyLmFzRGF5cyAgICAgICAgID0gYXNEYXlzO1xuICAgIHByb3RvJDIuYXNXZWVrcyAgICAgICAgPSBhc1dlZWtzO1xuICAgIHByb3RvJDIuYXNNb250aHMgICAgICAgPSBhc01vbnRocztcbiAgICBwcm90byQyLmFzWWVhcnMgICAgICAgID0gYXNZZWFycztcbiAgICBwcm90byQyLnZhbHVlT2YgICAgICAgID0gdmFsdWVPZiQxO1xuICAgIHByb3RvJDIuX2J1YmJsZSAgICAgICAgPSBidWJibGU7XG4gICAgcHJvdG8kMi5jbG9uZSAgICAgICAgICA9IGNsb25lJDE7XG4gICAgcHJvdG8kMi5nZXQgICAgICAgICAgICA9IGdldCQyO1xuICAgIHByb3RvJDIubWlsbGlzZWNvbmRzICAgPSBtaWxsaXNlY29uZHM7XG4gICAgcHJvdG8kMi5zZWNvbmRzICAgICAgICA9IHNlY29uZHM7XG4gICAgcHJvdG8kMi5taW51dGVzICAgICAgICA9IG1pbnV0ZXM7XG4gICAgcHJvdG8kMi5ob3VycyAgICAgICAgICA9IGhvdXJzO1xuICAgIHByb3RvJDIuZGF5cyAgICAgICAgICAgPSBkYXlzO1xuICAgIHByb3RvJDIud2Vla3MgICAgICAgICAgPSB3ZWVrcztcbiAgICBwcm90byQyLm1vbnRocyAgICAgICAgID0gbW9udGhzO1xuICAgIHByb3RvJDIueWVhcnMgICAgICAgICAgPSB5ZWFycztcbiAgICBwcm90byQyLmh1bWFuaXplICAgICAgID0gaHVtYW5pemU7XG4gICAgcHJvdG8kMi50b0lTT1N0cmluZyAgICA9IHRvSVNPU3RyaW5nJDE7XG4gICAgcHJvdG8kMi50b1N0cmluZyAgICAgICA9IHRvSVNPU3RyaW5nJDE7XG4gICAgcHJvdG8kMi50b0pTT04gICAgICAgICA9IHRvSVNPU3RyaW5nJDE7XG4gICAgcHJvdG8kMi5sb2NhbGUgICAgICAgICA9IGxvY2FsZTtcbiAgICBwcm90byQyLmxvY2FsZURhdGEgICAgID0gbG9jYWxlRGF0YTtcblxuICAgIHByb3RvJDIudG9Jc29TdHJpbmcgPSBkZXByZWNhdGUoJ3RvSXNvU3RyaW5nKCkgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSB0b0lTT1N0cmluZygpIGluc3RlYWQgKG5vdGljZSB0aGUgY2FwaXRhbHMpJywgdG9JU09TdHJpbmckMSk7XG4gICAgcHJvdG8kMi5sYW5nID0gbGFuZztcblxuICAgIC8vIFNpZGUgZWZmZWN0IGltcG9ydHNcblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKCdYJywgMCwgMCwgJ3VuaXgnKTtcbiAgICBhZGRGb3JtYXRUb2tlbigneCcsIDAsIDAsICd2YWx1ZU9mJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCd4JywgbWF0Y2hTaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1gnLCBtYXRjaFRpbWVzdGFtcCk7XG4gICAgYWRkUGFyc2VUb2tlbignWCcsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShwYXJzZUZsb2F0KGlucHV0LCAxMCkgKiAxMDAwKTtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKCd4JywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKHRvSW50KGlucHV0KSk7XG4gICAgfSk7XG5cbiAgICAvLyBTaWRlIGVmZmVjdCBpbXBvcnRzXG5cblxuICAgIGhvb2tzLnZlcnNpb24gPSAnMi4yMi4yJztcblxuICAgIHNldEhvb2tDYWxsYmFjayhjcmVhdGVMb2NhbCk7XG5cbiAgICBob29rcy5mbiAgICAgICAgICAgICAgICAgICAgPSBwcm90bztcbiAgICBob29rcy5taW4gICAgICAgICAgICAgICAgICAgPSBtaW47XG4gICAgaG9va3MubWF4ICAgICAgICAgICAgICAgICAgID0gbWF4O1xuICAgIGhvb2tzLm5vdyAgICAgICAgICAgICAgICAgICA9IG5vdztcbiAgICBob29rcy51dGMgICAgICAgICAgICAgICAgICAgPSBjcmVhdGVVVEM7XG4gICAgaG9va3MudW5peCAgICAgICAgICAgICAgICAgID0gY3JlYXRlVW5peDtcbiAgICBob29rcy5tb250aHMgICAgICAgICAgICAgICAgPSBsaXN0TW9udGhzO1xuICAgIGhvb2tzLmlzRGF0ZSAgICAgICAgICAgICAgICA9IGlzRGF0ZTtcbiAgICBob29rcy5sb2NhbGUgICAgICAgICAgICAgICAgPSBnZXRTZXRHbG9iYWxMb2NhbGU7XG4gICAgaG9va3MuaW52YWxpZCAgICAgICAgICAgICAgID0gY3JlYXRlSW52YWxpZDtcbiAgICBob29rcy5kdXJhdGlvbiAgICAgICAgICAgICAgPSBjcmVhdGVEdXJhdGlvbjtcbiAgICBob29rcy5pc01vbWVudCAgICAgICAgICAgICAgPSBpc01vbWVudDtcbiAgICBob29rcy53ZWVrZGF5cyAgICAgICAgICAgICAgPSBsaXN0V2Vla2RheXM7XG4gICAgaG9va3MucGFyc2Vab25lICAgICAgICAgICAgID0gY3JlYXRlSW5ab25lO1xuICAgIGhvb2tzLmxvY2FsZURhdGEgICAgICAgICAgICA9IGdldExvY2FsZTtcbiAgICBob29rcy5pc0R1cmF0aW9uICAgICAgICAgICAgPSBpc0R1cmF0aW9uO1xuICAgIGhvb2tzLm1vbnRoc1Nob3J0ICAgICAgICAgICA9IGxpc3RNb250aHNTaG9ydDtcbiAgICBob29rcy53ZWVrZGF5c01pbiAgICAgICAgICAgPSBsaXN0V2Vla2RheXNNaW47XG4gICAgaG9va3MuZGVmaW5lTG9jYWxlICAgICAgICAgID0gZGVmaW5lTG9jYWxlO1xuICAgIGhvb2tzLnVwZGF0ZUxvY2FsZSAgICAgICAgICA9IHVwZGF0ZUxvY2FsZTtcbiAgICBob29rcy5sb2NhbGVzICAgICAgICAgICAgICAgPSBsaXN0TG9jYWxlcztcbiAgICBob29rcy53ZWVrZGF5c1Nob3J0ICAgICAgICAgPSBsaXN0V2Vla2RheXNTaG9ydDtcbiAgICBob29rcy5ub3JtYWxpemVVbml0cyAgICAgICAgPSBub3JtYWxpemVVbml0cztcbiAgICBob29rcy5yZWxhdGl2ZVRpbWVSb3VuZGluZyAgPSBnZXRTZXRSZWxhdGl2ZVRpbWVSb3VuZGluZztcbiAgICBob29rcy5yZWxhdGl2ZVRpbWVUaHJlc2hvbGQgPSBnZXRTZXRSZWxhdGl2ZVRpbWVUaHJlc2hvbGQ7XG4gICAgaG9va3MuY2FsZW5kYXJGb3JtYXQgICAgICAgID0gZ2V0Q2FsZW5kYXJGb3JtYXQ7XG4gICAgaG9va3MucHJvdG90eXBlICAgICAgICAgICAgID0gcHJvdG87XG5cbiAgICAvLyBjdXJyZW50bHkgSFRNTDUgaW5wdXQgdHlwZSBvbmx5IHN1cHBvcnRzIDI0LWhvdXIgZm9ybWF0c1xuICAgIGhvb2tzLkhUTUw1X0ZNVCA9IHtcbiAgICAgICAgREFURVRJTUVfTE9DQUw6ICdZWVlZLU1NLUREVEhIOm1tJywgICAgICAgICAgICAgLy8gPGlucHV0IHR5cGU9XCJkYXRldGltZS1sb2NhbFwiIC8+XG4gICAgICAgIERBVEVUSU1FX0xPQ0FMX1NFQ09ORFM6ICdZWVlZLU1NLUREVEhIOm1tOnNzJywgIC8vIDxpbnB1dCB0eXBlPVwiZGF0ZXRpbWUtbG9jYWxcIiBzdGVwPVwiMVwiIC8+XG4gICAgICAgIERBVEVUSU1FX0xPQ0FMX01TOiAnWVlZWS1NTS1ERFRISDptbTpzcy5TU1MnLCAgIC8vIDxpbnB1dCB0eXBlPVwiZGF0ZXRpbWUtbG9jYWxcIiBzdGVwPVwiMC4wMDFcIiAvPlxuICAgICAgICBEQVRFOiAnWVlZWS1NTS1ERCcsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8aW5wdXQgdHlwZT1cImRhdGVcIiAvPlxuICAgICAgICBUSU1FOiAnSEg6bW0nLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8aW5wdXQgdHlwZT1cInRpbWVcIiAvPlxuICAgICAgICBUSU1FX1NFQ09ORFM6ICdISDptbTpzcycsICAgICAgICAgICAgICAgICAgICAgICAvLyA8aW5wdXQgdHlwZT1cInRpbWVcIiBzdGVwPVwiMVwiIC8+XG4gICAgICAgIFRJTUVfTVM6ICdISDptbTpzcy5TU1MnLCAgICAgICAgICAgICAgICAgICAgICAgIC8vIDxpbnB1dCB0eXBlPVwidGltZVwiIHN0ZXA9XCIwLjAwMVwiIC8+XG4gICAgICAgIFdFRUs6ICdZWVlZLVtXXVdXJywgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDxpbnB1dCB0eXBlPVwid2Vla1wiIC8+XG4gICAgICAgIE1PTlRIOiAnWVlZWS1NTScgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDxpbnB1dCB0eXBlPVwibW9udGhcIiAvPlxuICAgIH07XG5cbiAgICByZXR1cm4gaG9va3M7XG5cbn0pKSk7XG4iLCIvKiBzbW9vdGhzY3JvbGwgdjAuNC4wIC0gMjAxOCAtIER1c3RhbiBLYXN0ZW4sIEplcmVtaWFzIE1lbmljaGVsbGkgLSBNSVQgTGljZW5zZSAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIHBvbHlmaWxsXG4gIGZ1bmN0aW9uIHBvbHlmaWxsKCkge1xuICAgIC8vIGFsaWFzZXNcbiAgICB2YXIgdyA9IHdpbmRvdztcbiAgICB2YXIgZCA9IGRvY3VtZW50O1xuXG4gICAgLy8gcmV0dXJuIGlmIHNjcm9sbCBiZWhhdmlvciBpcyBzdXBwb3J0ZWQgYW5kIHBvbHlmaWxsIGlzIG5vdCBmb3JjZWRcbiAgICBpZiAoXG4gICAgICAnc2Nyb2xsQmVoYXZpb3InIGluIGQuZG9jdW1lbnRFbGVtZW50LnN0eWxlICYmXG4gICAgICB3Ll9fZm9yY2VTbW9vdGhTY3JvbGxQb2x5ZmlsbF9fICE9PSB0cnVlXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gZ2xvYmFsc1xuICAgIHZhciBFbGVtZW50ID0gdy5IVE1MRWxlbWVudCB8fCB3LkVsZW1lbnQ7XG4gICAgdmFyIFNDUk9MTF9USU1FID0gNDY4O1xuXG4gICAgLy8gb2JqZWN0IGdhdGhlcmluZyBvcmlnaW5hbCBzY3JvbGwgbWV0aG9kc1xuICAgIHZhciBvcmlnaW5hbCA9IHtcbiAgICAgIHNjcm9sbDogdy5zY3JvbGwgfHwgdy5zY3JvbGxUbyxcbiAgICAgIHNjcm9sbEJ5OiB3LnNjcm9sbEJ5LFxuICAgICAgZWxlbWVudFNjcm9sbDogRWxlbWVudC5wcm90b3R5cGUuc2Nyb2xsIHx8IHNjcm9sbEVsZW1lbnQsXG4gICAgICBzY3JvbGxJbnRvVmlldzogRWxlbWVudC5wcm90b3R5cGUuc2Nyb2xsSW50b1ZpZXdcbiAgICB9O1xuXG4gICAgLy8gZGVmaW5lIHRpbWluZyBtZXRob2RcbiAgICB2YXIgbm93ID1cbiAgICAgIHcucGVyZm9ybWFuY2UgJiYgdy5wZXJmb3JtYW5jZS5ub3dcbiAgICAgICAgPyB3LnBlcmZvcm1hbmNlLm5vdy5iaW5kKHcucGVyZm9ybWFuY2UpXG4gICAgICAgIDogRGF0ZS5ub3c7XG5cbiAgICAvKipcbiAgICAgKiBpbmRpY2F0ZXMgaWYgYSB0aGUgY3VycmVudCBicm93c2VyIGlzIG1hZGUgYnkgTWljcm9zb2Z0XG4gICAgICogQG1ldGhvZCBpc01pY3Jvc29mdEJyb3dzZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXNlckFnZW50XG4gICAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNNaWNyb3NvZnRCcm93c2VyKHVzZXJBZ2VudCkge1xuICAgICAgdmFyIHVzZXJBZ2VudFBhdHRlcm5zID0gWydNU0lFICcsICdUcmlkZW50LycsICdFZGdlLyddO1xuXG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cCh1c2VyQWdlbnRQYXR0ZXJucy5qb2luKCd8JykpLnRlc3QodXNlckFnZW50KTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIElFIGhhcyByb3VuZGluZyBidWcgcm91bmRpbmcgZG93biBjbGllbnRIZWlnaHQgYW5kIGNsaWVudFdpZHRoIGFuZFxuICAgICAqIHJvdW5kaW5nIHVwIHNjcm9sbEhlaWdodCBhbmQgc2Nyb2xsV2lkdGggY2F1c2luZyBmYWxzZSBwb3NpdGl2ZXNcbiAgICAgKiBvbiBoYXNTY3JvbGxhYmxlU3BhY2VcbiAgICAgKi9cbiAgICB2YXIgUk9VTkRJTkdfVE9MRVJBTkNFID0gaXNNaWNyb3NvZnRCcm93c2VyKHcubmF2aWdhdG9yLnVzZXJBZ2VudCkgPyAxIDogMDtcblxuICAgIC8qKlxuICAgICAqIGNoYW5nZXMgc2Nyb2xsIHBvc2l0aW9uIGluc2lkZSBhbiBlbGVtZW50XG4gICAgICogQG1ldGhvZCBzY3JvbGxFbGVtZW50XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geVxuICAgICAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gICAgICovXG4gICAgZnVuY3Rpb24gc2Nyb2xsRWxlbWVudCh4LCB5KSB7XG4gICAgICB0aGlzLnNjcm9sbExlZnQgPSB4O1xuICAgICAgdGhpcy5zY3JvbGxUb3AgPSB5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgcmVzdWx0IG9mIGFwcGx5aW5nIGVhc2UgbWF0aCBmdW5jdGlvbiB0byBhIG51bWJlclxuICAgICAqIEBtZXRob2QgZWFzZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBrXG4gICAgICogQHJldHVybnMge051bWJlcn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBlYXNlKGspIHtcbiAgICAgIHJldHVybiAwLjUgKiAoMSAtIE1hdGguY29zKE1hdGguUEkgKiBrKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogaW5kaWNhdGVzIGlmIGEgc21vb3RoIGJlaGF2aW9yIHNob3VsZCBiZSBhcHBsaWVkXG4gICAgICogQG1ldGhvZCBzaG91bGRCYWlsT3V0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ8T2JqZWN0fSBmaXJzdEFyZ1xuICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNob3VsZEJhaWxPdXQoZmlyc3RBcmcpIHtcbiAgICAgIGlmIChcbiAgICAgICAgZmlyc3RBcmcgPT09IG51bGwgfHxcbiAgICAgICAgdHlwZW9mIGZpcnN0QXJnICE9PSAnb2JqZWN0JyB8fFxuICAgICAgICBmaXJzdEFyZy5iZWhhdmlvciA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgIGZpcnN0QXJnLmJlaGF2aW9yID09PSAnYXV0bycgfHxcbiAgICAgICAgZmlyc3RBcmcuYmVoYXZpb3IgPT09ICdpbnN0YW50J1xuICAgICAgKSB7XG4gICAgICAgIC8vIGZpcnN0IGFyZ3VtZW50IGlzIG5vdCBhbiBvYmplY3QvbnVsbFxuICAgICAgICAvLyBvciBiZWhhdmlvciBpcyBhdXRvLCBpbnN0YW50IG9yIHVuZGVmaW5lZFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBmaXJzdEFyZyA9PT0gJ29iamVjdCcgJiYgZmlyc3RBcmcuYmVoYXZpb3IgPT09ICdzbW9vdGgnKSB7XG4gICAgICAgIC8vIGZpcnN0IGFyZ3VtZW50IGlzIGFuIG9iamVjdCBhbmQgYmVoYXZpb3IgaXMgc21vb3RoXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy8gdGhyb3cgZXJyb3Igd2hlbiBiZWhhdmlvciBpcyBub3Qgc3VwcG9ydGVkXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAnYmVoYXZpb3IgbWVtYmVyIG9mIFNjcm9sbE9wdGlvbnMgJyArXG4gICAgICAgICAgZmlyc3RBcmcuYmVoYXZpb3IgK1xuICAgICAgICAgICcgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIGVudW1lcmF0aW9uIFNjcm9sbEJlaGF2aW9yLidcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogaW5kaWNhdGVzIGlmIGFuIGVsZW1lbnQgaGFzIHNjcm9sbGFibGUgc3BhY2UgaW4gdGhlIHByb3ZpZGVkIGF4aXNcbiAgICAgKiBAbWV0aG9kIGhhc1Njcm9sbGFibGVTcGFjZVxuICAgICAqIEBwYXJhbSB7Tm9kZX0gZWxcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXhpc1xuICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGhhc1Njcm9sbGFibGVTcGFjZShlbCwgYXhpcykge1xuICAgICAgaWYgKGF4aXMgPT09ICdZJykge1xuICAgICAgICByZXR1cm4gZWwuY2xpZW50SGVpZ2h0ICsgUk9VTkRJTkdfVE9MRVJBTkNFIDwgZWwuc2Nyb2xsSGVpZ2h0O1xuICAgICAgfVxuXG4gICAgICBpZiAoYXhpcyA9PT0gJ1gnKSB7XG4gICAgICAgIHJldHVybiBlbC5jbGllbnRXaWR0aCArIFJPVU5ESU5HX1RPTEVSQU5DRSA8IGVsLnNjcm9sbFdpZHRoO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGluZGljYXRlcyBpZiBhbiBlbGVtZW50IGhhcyBhIHNjcm9sbGFibGUgb3ZlcmZsb3cgcHJvcGVydHkgaW4gdGhlIGF4aXNcbiAgICAgKiBAbWV0aG9kIGNhbk92ZXJmbG93XG4gICAgICogQHBhcmFtIHtOb2RlfSBlbFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBheGlzXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAgICovXG4gICAgZnVuY3Rpb24gY2FuT3ZlcmZsb3coZWwsIGF4aXMpIHtcbiAgICAgIHZhciBvdmVyZmxvd1ZhbHVlID0gdy5nZXRDb21wdXRlZFN0eWxlKGVsLCBudWxsKVsnb3ZlcmZsb3cnICsgYXhpc107XG5cbiAgICAgIHJldHVybiBvdmVyZmxvd1ZhbHVlID09PSAnYXV0bycgfHwgb3ZlcmZsb3dWYWx1ZSA9PT0gJ3Njcm9sbCc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogaW5kaWNhdGVzIGlmIGFuIGVsZW1lbnQgY2FuIGJlIHNjcm9sbGVkIGluIGVpdGhlciBheGlzXG4gICAgICogQG1ldGhvZCBpc1Njcm9sbGFibGVcbiAgICAgKiBAcGFyYW0ge05vZGV9IGVsXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF4aXNcbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc1Njcm9sbGFibGUoZWwpIHtcbiAgICAgIHZhciBpc1Njcm9sbGFibGVZID0gaGFzU2Nyb2xsYWJsZVNwYWNlKGVsLCAnWScpICYmIGNhbk92ZXJmbG93KGVsLCAnWScpO1xuICAgICAgdmFyIGlzU2Nyb2xsYWJsZVggPSBoYXNTY3JvbGxhYmxlU3BhY2UoZWwsICdYJykgJiYgY2FuT3ZlcmZsb3coZWwsICdYJyk7XG5cbiAgICAgIHJldHVybiBpc1Njcm9sbGFibGVZIHx8IGlzU2Nyb2xsYWJsZVg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZmluZHMgc2Nyb2xsYWJsZSBwYXJlbnQgb2YgYW4gZWxlbWVudFxuICAgICAqIEBtZXRob2QgZmluZFNjcm9sbGFibGVQYXJlbnRcbiAgICAgKiBAcGFyYW0ge05vZGV9IGVsXG4gICAgICogQHJldHVybnMge05vZGV9IGVsXG4gICAgICovXG4gICAgZnVuY3Rpb24gZmluZFNjcm9sbGFibGVQYXJlbnQoZWwpIHtcbiAgICAgIHZhciBpc0JvZHk7XG5cbiAgICAgIGRvIHtcbiAgICAgICAgZWwgPSBlbC5wYXJlbnROb2RlO1xuXG4gICAgICAgIGlzQm9keSA9IGVsID09PSBkLmJvZHk7XG4gICAgICB9IHdoaWxlIChpc0JvZHkgPT09IGZhbHNlICYmIGlzU2Nyb2xsYWJsZShlbCkgPT09IGZhbHNlKTtcblxuICAgICAgaXNCb2R5ID0gbnVsbDtcblxuICAgICAgcmV0dXJuIGVsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNlbGYgaW52b2tlZCBmdW5jdGlvbiB0aGF0LCBnaXZlbiBhIGNvbnRleHQsIHN0ZXBzIHRocm91Z2ggc2Nyb2xsaW5nXG4gICAgICogQG1ldGhvZCBzdGVwXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHRcbiAgICAgKiBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHN0ZXAoY29udGV4dCkge1xuICAgICAgdmFyIHRpbWUgPSBub3coKTtcbiAgICAgIHZhciB2YWx1ZTtcbiAgICAgIHZhciBjdXJyZW50WDtcbiAgICAgIHZhciBjdXJyZW50WTtcbiAgICAgIHZhciBlbGFwc2VkID0gKHRpbWUgLSBjb250ZXh0LnN0YXJ0VGltZSkgLyBTQ1JPTExfVElNRTtcblxuICAgICAgLy8gYXZvaWQgZWxhcHNlZCB0aW1lcyBoaWdoZXIgdGhhbiBvbmVcbiAgICAgIGVsYXBzZWQgPSBlbGFwc2VkID4gMSA/IDEgOiBlbGFwc2VkO1xuXG4gICAgICAvLyBhcHBseSBlYXNpbmcgdG8gZWxhcHNlZCB0aW1lXG4gICAgICB2YWx1ZSA9IGVhc2UoZWxhcHNlZCk7XG5cbiAgICAgIGN1cnJlbnRYID0gY29udGV4dC5zdGFydFggKyAoY29udGV4dC54IC0gY29udGV4dC5zdGFydFgpICogdmFsdWU7XG4gICAgICBjdXJyZW50WSA9IGNvbnRleHQuc3RhcnRZICsgKGNvbnRleHQueSAtIGNvbnRleHQuc3RhcnRZKSAqIHZhbHVlO1xuXG4gICAgICBjb250ZXh0Lm1ldGhvZC5jYWxsKGNvbnRleHQuc2Nyb2xsYWJsZSwgY3VycmVudFgsIGN1cnJlbnRZKTtcblxuICAgICAgLy8gc2Nyb2xsIG1vcmUgaWYgd2UgaGF2ZSBub3QgcmVhY2hlZCBvdXIgZGVzdGluYXRpb25cbiAgICAgIGlmIChjdXJyZW50WCAhPT0gY29udGV4dC54IHx8IGN1cnJlbnRZICE9PSBjb250ZXh0LnkpIHtcbiAgICAgICAgdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcC5iaW5kKHcsIGNvbnRleHQpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzY3JvbGxzIHdpbmRvdyBvciBlbGVtZW50IHdpdGggYSBzbW9vdGggYmVoYXZpb3JcbiAgICAgKiBAbWV0aG9kIHNtb290aFNjcm9sbFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fE5vZGV9IGVsXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geVxuICAgICAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gICAgICovXG4gICAgZnVuY3Rpb24gc21vb3RoU2Nyb2xsKGVsLCB4LCB5KSB7XG4gICAgICB2YXIgc2Nyb2xsYWJsZTtcbiAgICAgIHZhciBzdGFydFg7XG4gICAgICB2YXIgc3RhcnRZO1xuICAgICAgdmFyIG1ldGhvZDtcbiAgICAgIHZhciBzdGFydFRpbWUgPSBub3coKTtcblxuICAgICAgLy8gZGVmaW5lIHNjcm9sbCBjb250ZXh0XG4gICAgICBpZiAoZWwgPT09IGQuYm9keSkge1xuICAgICAgICBzY3JvbGxhYmxlID0gdztcbiAgICAgICAgc3RhcnRYID0gdy5zY3JvbGxYIHx8IHcucGFnZVhPZmZzZXQ7XG4gICAgICAgIHN0YXJ0WSA9IHcuc2Nyb2xsWSB8fCB3LnBhZ2VZT2Zmc2V0O1xuICAgICAgICBtZXRob2QgPSBvcmlnaW5hbC5zY3JvbGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzY3JvbGxhYmxlID0gZWw7XG4gICAgICAgIHN0YXJ0WCA9IGVsLnNjcm9sbExlZnQ7XG4gICAgICAgIHN0YXJ0WSA9IGVsLnNjcm9sbFRvcDtcbiAgICAgICAgbWV0aG9kID0gc2Nyb2xsRWxlbWVudDtcbiAgICAgIH1cblxuICAgICAgLy8gc2Nyb2xsIGxvb3Bpbmcgb3ZlciBhIGZyYW1lXG4gICAgICBzdGVwKHtcbiAgICAgICAgc2Nyb2xsYWJsZTogc2Nyb2xsYWJsZSxcbiAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgIHN0YXJ0VGltZTogc3RhcnRUaW1lLFxuICAgICAgICBzdGFydFg6IHN0YXJ0WCxcbiAgICAgICAgc3RhcnRZOiBzdGFydFksXG4gICAgICAgIHg6IHgsXG4gICAgICAgIHk6IHlcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIE9SSUdJTkFMIE1FVEhPRFMgT1ZFUlJJREVTXG4gICAgLy8gdy5zY3JvbGwgYW5kIHcuc2Nyb2xsVG9cbiAgICB3LnNjcm9sbCA9IHcuc2Nyb2xsVG8gPSBmdW5jdGlvbigpIHtcbiAgICAgIC8vIGF2b2lkIGFjdGlvbiB3aGVuIG5vIGFyZ3VtZW50cyBhcmUgcGFzc2VkXG4gICAgICBpZiAoYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBhdm9pZCBzbW9vdGggYmVoYXZpb3IgaWYgbm90IHJlcXVpcmVkXG4gICAgICBpZiAoc2hvdWxkQmFpbE91dChhcmd1bWVudHNbMF0pID09PSB0cnVlKSB7XG4gICAgICAgIG9yaWdpbmFsLnNjcm9sbC5jYWxsKFxuICAgICAgICAgIHcsXG4gICAgICAgICAgYXJndW1lbnRzWzBdLmxlZnQgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgPyBhcmd1bWVudHNbMF0ubGVmdFxuICAgICAgICAgICAgOiB0eXBlb2YgYXJndW1lbnRzWzBdICE9PSAnb2JqZWN0J1xuICAgICAgICAgICAgICA/IGFyZ3VtZW50c1swXVxuICAgICAgICAgICAgICA6IHcuc2Nyb2xsWCB8fCB3LnBhZ2VYT2Zmc2V0LFxuICAgICAgICAgIC8vIHVzZSB0b3AgcHJvcCwgc2Vjb25kIGFyZ3VtZW50IGlmIHByZXNlbnQgb3IgZmFsbGJhY2sgdG8gc2Nyb2xsWVxuICAgICAgICAgIGFyZ3VtZW50c1swXS50b3AgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgPyBhcmd1bWVudHNbMF0udG9wXG4gICAgICAgICAgICA6IGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgID8gYXJndW1lbnRzWzFdXG4gICAgICAgICAgICAgIDogdy5zY3JvbGxZIHx8IHcucGFnZVlPZmZzZXRcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIExFVCBUSEUgU01PT1RITkVTUyBCRUdJTiFcbiAgICAgIHNtb290aFNjcm9sbC5jYWxsKFxuICAgICAgICB3LFxuICAgICAgICBkLmJvZHksXG4gICAgICAgIGFyZ3VtZW50c1swXS5sZWZ0ICE9PSB1bmRlZmluZWRcbiAgICAgICAgICA/IH5+YXJndW1lbnRzWzBdLmxlZnRcbiAgICAgICAgICA6IHcuc2Nyb2xsWCB8fCB3LnBhZ2VYT2Zmc2V0LFxuICAgICAgICBhcmd1bWVudHNbMF0udG9wICE9PSB1bmRlZmluZWRcbiAgICAgICAgICA/IH5+YXJndW1lbnRzWzBdLnRvcFxuICAgICAgICAgIDogdy5zY3JvbGxZIHx8IHcucGFnZVlPZmZzZXRcbiAgICAgICk7XG4gICAgfTtcblxuICAgIC8vIHcuc2Nyb2xsQnlcbiAgICB3LnNjcm9sbEJ5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAvLyBhdm9pZCBhY3Rpb24gd2hlbiBubyBhcmd1bWVudHMgYXJlIHBhc3NlZFxuICAgICAgaWYgKGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gYXZvaWQgc21vb3RoIGJlaGF2aW9yIGlmIG5vdCByZXF1aXJlZFxuICAgICAgaWYgKHNob3VsZEJhaWxPdXQoYXJndW1lbnRzWzBdKSkge1xuICAgICAgICBvcmlnaW5hbC5zY3JvbGxCeS5jYWxsKFxuICAgICAgICAgIHcsXG4gICAgICAgICAgYXJndW1lbnRzWzBdLmxlZnQgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgPyBhcmd1bWVudHNbMF0ubGVmdFxuICAgICAgICAgICAgOiB0eXBlb2YgYXJndW1lbnRzWzBdICE9PSAnb2JqZWN0JyA/IGFyZ3VtZW50c1swXSA6IDAsXG4gICAgICAgICAgYXJndW1lbnRzWzBdLnRvcCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICA/IGFyZ3VtZW50c1swXS50b3BcbiAgICAgICAgICAgIDogYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAwXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBMRVQgVEhFIFNNT09USE5FU1MgQkVHSU4hXG4gICAgICBzbW9vdGhTY3JvbGwuY2FsbChcbiAgICAgICAgdyxcbiAgICAgICAgZC5ib2R5LFxuICAgICAgICB+fmFyZ3VtZW50c1swXS5sZWZ0ICsgKHcuc2Nyb2xsWCB8fCB3LnBhZ2VYT2Zmc2V0KSxcbiAgICAgICAgfn5hcmd1bWVudHNbMF0udG9wICsgKHcuc2Nyb2xsWSB8fCB3LnBhZ2VZT2Zmc2V0KVxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgLy8gRWxlbWVudC5wcm90b3R5cGUuc2Nyb2xsIGFuZCBFbGVtZW50LnByb3RvdHlwZS5zY3JvbGxUb1xuICAgIEVsZW1lbnQucHJvdG90eXBlLnNjcm9sbCA9IEVsZW1lbnQucHJvdG90eXBlLnNjcm9sbFRvID0gZnVuY3Rpb24oKSB7XG4gICAgICAvLyBhdm9pZCBhY3Rpb24gd2hlbiBubyBhcmd1bWVudHMgYXJlIHBhc3NlZFxuICAgICAgaWYgKGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gYXZvaWQgc21vb3RoIGJlaGF2aW9yIGlmIG5vdCByZXF1aXJlZFxuICAgICAgaWYgKHNob3VsZEJhaWxPdXQoYXJndW1lbnRzWzBdKSA9PT0gdHJ1ZSkge1xuICAgICAgICAvLyBpZiBvbmUgbnVtYmVyIGlzIHBhc3NlZCwgdGhyb3cgZXJyb3IgdG8gbWF0Y2ggRmlyZWZveCBpbXBsZW1lbnRhdGlvblxuICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ251bWJlcicgJiYgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ1ZhbHVlIGNvdWxkIG5vdCBiZSBjb252ZXJ0ZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9yaWdpbmFsLmVsZW1lbnRTY3JvbGwuY2FsbChcbiAgICAgICAgICB0aGlzLFxuICAgICAgICAgIC8vIHVzZSBsZWZ0IHByb3AsIGZpcnN0IG51bWJlciBhcmd1bWVudCBvciBmYWxsYmFjayB0byBzY3JvbGxMZWZ0XG4gICAgICAgICAgYXJndW1lbnRzWzBdLmxlZnQgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgPyB+fmFyZ3VtZW50c1swXS5sZWZ0XG4gICAgICAgICAgICA6IHR5cGVvZiBhcmd1bWVudHNbMF0gIT09ICdvYmplY3QnID8gfn5hcmd1bWVudHNbMF0gOiB0aGlzLnNjcm9sbExlZnQsXG4gICAgICAgICAgLy8gdXNlIHRvcCBwcm9wLCBzZWNvbmQgYXJndW1lbnQgb3IgZmFsbGJhY2sgdG8gc2Nyb2xsVG9wXG4gICAgICAgICAgYXJndW1lbnRzWzBdLnRvcCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICA/IH5+YXJndW1lbnRzWzBdLnRvcFxuICAgICAgICAgICAgOiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IH5+YXJndW1lbnRzWzFdIDogdGhpcy5zY3JvbGxUb3BcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBsZWZ0ID0gYXJndW1lbnRzWzBdLmxlZnQ7XG4gICAgICB2YXIgdG9wID0gYXJndW1lbnRzWzBdLnRvcDtcblxuICAgICAgLy8gTEVUIFRIRSBTTU9PVEhORVNTIEJFR0lOIVxuICAgICAgc21vb3RoU2Nyb2xsLmNhbGwoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIHRoaXMsXG4gICAgICAgIHR5cGVvZiBsZWZ0ID09PSAndW5kZWZpbmVkJyA/IHRoaXMuc2Nyb2xsTGVmdCA6IH5+bGVmdCxcbiAgICAgICAgdHlwZW9mIHRvcCA9PT0gJ3VuZGVmaW5lZCcgPyB0aGlzLnNjcm9sbFRvcCA6IH5+dG9wXG4gICAgICApO1xuICAgIH07XG5cbiAgICAvLyBFbGVtZW50LnByb3RvdHlwZS5zY3JvbGxCeVxuICAgIEVsZW1lbnQucHJvdG90eXBlLnNjcm9sbEJ5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAvLyBhdm9pZCBhY3Rpb24gd2hlbiBubyBhcmd1bWVudHMgYXJlIHBhc3NlZFxuICAgICAgaWYgKGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gYXZvaWQgc21vb3RoIGJlaGF2aW9yIGlmIG5vdCByZXF1aXJlZFxuICAgICAgaWYgKHNob3VsZEJhaWxPdXQoYXJndW1lbnRzWzBdKSA9PT0gdHJ1ZSkge1xuICAgICAgICBvcmlnaW5hbC5lbGVtZW50U2Nyb2xsLmNhbGwoXG4gICAgICAgICAgdGhpcyxcbiAgICAgICAgICBhcmd1bWVudHNbMF0ubGVmdCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICA/IH5+YXJndW1lbnRzWzBdLmxlZnQgKyB0aGlzLnNjcm9sbExlZnRcbiAgICAgICAgICAgIDogfn5hcmd1bWVudHNbMF0gKyB0aGlzLnNjcm9sbExlZnQsXG4gICAgICAgICAgYXJndW1lbnRzWzBdLnRvcCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICA/IH5+YXJndW1lbnRzWzBdLnRvcCArIHRoaXMuc2Nyb2xsVG9wXG4gICAgICAgICAgICA6IH5+YXJndW1lbnRzWzFdICsgdGhpcy5zY3JvbGxUb3BcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2Nyb2xsKHtcbiAgICAgICAgbGVmdDogfn5hcmd1bWVudHNbMF0ubGVmdCArIHRoaXMuc2Nyb2xsTGVmdCxcbiAgICAgICAgdG9wOiB+fmFyZ3VtZW50c1swXS50b3AgKyB0aGlzLnNjcm9sbFRvcCxcbiAgICAgICAgYmVoYXZpb3I6IGFyZ3VtZW50c1swXS5iZWhhdmlvclxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIEVsZW1lbnQucHJvdG90eXBlLnNjcm9sbEludG9WaWV3XG4gICAgRWxlbWVudC5wcm90b3R5cGUuc2Nyb2xsSW50b1ZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICAgIC8vIGF2b2lkIHNtb290aCBiZWhhdmlvciBpZiBub3QgcmVxdWlyZWRcbiAgICAgIGlmIChzaG91bGRCYWlsT3V0KGFyZ3VtZW50c1swXSkgPT09IHRydWUpIHtcbiAgICAgICAgb3JpZ2luYWwuc2Nyb2xsSW50b1ZpZXcuY2FsbChcbiAgICAgICAgICB0aGlzLFxuICAgICAgICAgIGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IGFyZ3VtZW50c1swXVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gTEVUIFRIRSBTTU9PVEhORVNTIEJFR0lOIVxuICAgICAgdmFyIHNjcm9sbGFibGVQYXJlbnQgPSBmaW5kU2Nyb2xsYWJsZVBhcmVudCh0aGlzKTtcbiAgICAgIHZhciBwYXJlbnRSZWN0cyA9IHNjcm9sbGFibGVQYXJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICB2YXIgY2xpZW50UmVjdHMgPSB0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICBpZiAoc2Nyb2xsYWJsZVBhcmVudCAhPT0gZC5ib2R5KSB7XG4gICAgICAgIC8vIHJldmVhbCBlbGVtZW50IGluc2lkZSBwYXJlbnRcbiAgICAgICAgc21vb3RoU2Nyb2xsLmNhbGwoXG4gICAgICAgICAgdGhpcyxcbiAgICAgICAgICBzY3JvbGxhYmxlUGFyZW50LFxuICAgICAgICAgIHNjcm9sbGFibGVQYXJlbnQuc2Nyb2xsTGVmdCArIGNsaWVudFJlY3RzLmxlZnQgLSBwYXJlbnRSZWN0cy5sZWZ0LFxuICAgICAgICAgIHNjcm9sbGFibGVQYXJlbnQuc2Nyb2xsVG9wICsgY2xpZW50UmVjdHMudG9wIC0gcGFyZW50UmVjdHMudG9wXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gcmV2ZWFsIHBhcmVudCBpbiB2aWV3cG9ydCB1bmxlc3MgaXMgZml4ZWRcbiAgICAgICAgaWYgKHcuZ2V0Q29tcHV0ZWRTdHlsZShzY3JvbGxhYmxlUGFyZW50KS5wb3NpdGlvbiAhPT0gJ2ZpeGVkJykge1xuICAgICAgICAgIHcuc2Nyb2xsQnkoe1xuICAgICAgICAgICAgbGVmdDogcGFyZW50UmVjdHMubGVmdCxcbiAgICAgICAgICAgIHRvcDogcGFyZW50UmVjdHMudG9wLFxuICAgICAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHJldmVhbCBlbGVtZW50IGluIHZpZXdwb3J0XG4gICAgICAgIHcuc2Nyb2xsQnkoe1xuICAgICAgICAgIGxlZnQ6IGNsaWVudFJlY3RzLmxlZnQsXG4gICAgICAgICAgdG9wOiBjbGllbnRSZWN0cy50b3AsXG4gICAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gY29tbW9uanNcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHsgcG9seWZpbGw6IHBvbHlmaWxsIH07XG4gIH0gZWxzZSB7XG4gICAgLy8gZ2xvYmFsXG4gICAgcG9seWZpbGwoKTtcbiAgfVxuXG59KCkpO1xuIiwibW9kdWxlLmV4cG9ydHM9W1xyXG4gIHtcclxuICAgIFwibmFtZVwiOiBcIkFnZW5jZSBGQVJcIixcclxuICAgIFwiYWRkcmVzc1wiOiBcIjQ4IEFWIGRlcyBmb3JjZXMgYXJtZWUgcm95YWxlc1wiLFxyXG4gICAgXCJjaXR5XCI6IFwiY2FzYWJsYW5jYVwiLFxyXG4gICAgXCJ0eXBlXCI6IFwiYWdlbmNlXCIsXHJcbiAgICBcImNvb3Jkc1wiOiB7XHJcbiAgICAgIFwiZW1haWxcIjogXCJqaG9uZG9lQGdtYWlsLmNvbVwiLFxyXG4gICAgICBcInBob25lXCI6IFwiMDYxODY2MTg2NlwiLFxyXG4gICAgICBcImZheFwiOiBcIjA2MTg2NjE4NjZcIixcclxuICAgICAgXCJncHNcIjoge1xyXG4gICAgICAgIFwibGFuZ1wiOiAzMy41NTE5NTU2LFxyXG4gICAgICAgIFwibGF0XCI6IC03LjY5MTM2NDRcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiZXh0ZW5zaW9uXCI6IHtcclxuICAgICAgXCJuYW1lXCI6IFwiQWwtYm91Y2hyYSBDYXNhbmVhcnNob3JlXCIsXHJcbiAgICAgIFwiYWRkcmVzc1wiOiBcIjQ4IEFWIGRlcyBmb3JjZXMgYXJtZWUgcm95YWxlc1wiXHJcbiAgICB9LFxyXG4gICAgXCJ0aW1ldGFibGVcIjoge1xyXG4gICAgICBcIm1vbmRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJ0dWVzZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcIndlZG5lc2RheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJ0aHVyc2RheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJmcmlkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwic2F0dXJkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwic3VuZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiXHJcbiAgICB9XHJcbiAgfSxcclxuICB7XHJcbiAgICBcIm5hbWVcIjogXCJBZ2VuY2UgU0VJWkUgKDE2KSBOT1ZFTUJSRVwiLFxyXG4gICAgXCJhZGRyZXNzXCI6IFwiMyBQbGFjZSBkdSAxNiBub3ZlbWJyZVwiLFxyXG4gICAgXCJjaXR5XCI6IFwiY2FzYWJsYW5jYVwiLFxyXG4gICAgXCJ0eXBlXCI6IFwiYWdlbmNlXCIsXHJcbiAgICBcImNvb3Jkc1wiOiB7XHJcbiAgICAgIFwiZW1haWxcIjogXCJqaG9uZG9lQGdtYWlsLmNvbVwiLFxyXG4gICAgICBcInBob25lXCI6IFwiMDYxODY2MTg2NlwiLFxyXG4gICAgICBcImZheFwiOiBcIjA2MTg2NjE4NjZcIixcclxuICAgICAgXCJncHNcIjoge1xyXG4gICAgICAgIFwibGFuZ1wiOiAzMy41NjExMTEsXHJcbiAgICAgICAgXCJsYXRcIjogLTcuNjQ4NzkyNFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJleHRlbnNpb25cIjoge1xyXG4gICAgICBcIm5hbWVcIjogXCJBbC1ib3VjaHJhIENhc2FuZWFyc2hvcmVcIixcclxuICAgICAgXCJhZGRyZXNzXCI6IFwiNDggQVYgZGVzIGZvcmNlcyBhcm1lZSByb3lhbGVzXCJcclxuICAgIH0sXHJcbiAgICBcInRpbWV0YWJsZVwiOiB7XHJcbiAgICAgIFwibW9uZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcInR1ZXNkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwid2VkbmVzZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcInRodXJzZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcImZyaWRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJzYXR1cmRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJzdW5kYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCJcclxuICAgIH1cclxuICB9LFxyXG4gIHtcclxuICAgIFwibmFtZVwiOiBcIkFnZW5jZSBGQVJcIixcclxuICAgIFwiYWRkcmVzc1wiOiBcIkFnZW5jZSBaRVJLVE9VTklcIixcclxuICAgIFwiY2l0eVwiOiBcImNhc2FibGFuY2FcIixcclxuICAgIFwidHlwZVwiOiBcImNlbnRyZXMtYWZmYWlyZXNcIixcclxuICAgIFwiY29vcmRzXCI6IHtcclxuICAgICAgXCJlbWFpbFwiOiBcImpob25kb2VAZ21haWwuY29tXCIsXHJcbiAgICAgIFwicGhvbmVcIjogXCIwNjE4NjYxODY2XCIsXHJcbiAgICAgIFwiZmF4XCI6IFwiMDYxODY2MTg2NlwiLFxyXG4gICAgICBcImdwc1wiOiB7XHJcbiAgICAgICAgXCJsYW5nXCI6IDMzLjU4NDU2NzIsXHJcbiAgICAgICAgXCJsYXRcIjogLTcuNjI5OTA5NlxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJleHRlbnNpb25cIjoge1xyXG4gICAgICBcIm5hbWVcIjogXCJBbC1ib3VjaHJhIENhc2FuZWFyc2hvcmVcIixcclxuICAgICAgXCJhZGRyZXNzXCI6IFwiNDggQVYgZGVzIGZvcmNlcyBhcm1lZSByb3lhbGVzXCJcclxuICAgIH0sXHJcbiAgICBcInRpbWV0YWJsZVwiOiB7XHJcbiAgICAgIFwibW9uZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcInR1ZXNkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwid2VkbmVzZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcInRodXJzZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcImZyaWRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJzYXR1cmRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJzdW5kYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCJcclxuICAgIH1cclxuICB9LFxyXG4gIHtcclxuICAgIFwibmFtZVwiOiBcIkFnZW5jZSBST01BTkRJRVwiLFxyXG4gICAgXCJhZGRyZXNzXCI6IFwiMyBldCA0LEltbSBSb21hbmRpZSBJSSBib3VsdmFyZCBCaXIgYW56YXJhbmVcIixcclxuICAgIFwiY2l0eVwiOiBcImNhc2FibGFuY2FcIixcclxuICAgIFwidHlwZVwiOiBcImFnZW5jZVwiLFxyXG4gICAgXCJjb29yZHNcIjoge1xyXG4gICAgICBcImVtYWlsXCI6IFwiamhvbmRvZUBnbWFpbC5jb21cIixcclxuICAgICAgXCJwaG9uZVwiOiBcIjA2MTg2NjE4NjZcIixcclxuICAgICAgXCJmYXhcIjogXCIwNjE4NjYxODY2XCIsXHJcbiAgICAgIFwiZ3BzXCI6IHtcclxuICAgICAgICBcImxhbmdcIjogMzMuNTcyMjY3OCxcclxuICAgICAgICBcImxhdFwiOiAtNy42MjkyMjNcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiZXh0ZW5zaW9uXCI6IHtcclxuICAgICAgXCJuYW1lXCI6IFwiQWwtYm91Y2hyYSBDYXNhbmVhcnNob3JlXCIsXHJcbiAgICAgIFwiYWRkcmVzc1wiOiBcIjQ4IEFWIGRlcyBmb3JjZXMgYXJtZWUgcm95YWxlc1wiXHJcbiAgICB9LFxyXG4gICAgXCJ0aW1ldGFibGVcIjoge1xyXG4gICAgICBcIm1vbmRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJ0dWVzZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcIndlZG5lc2RheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJ0aHVyc2RheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJmcmlkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwic2F0dXJkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwic3VuZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiXHJcbiAgICB9XHJcbiAgfSxcclxuICB7XHJcbiAgICBcIm5hbWVcIjogXCJBZ2VuY2UgSEFKIE9NQVIgQUJERUxKQUxJTFwiLFxyXG4gICAgXCJhZGRyZXNzXCI6IFwiS00gNywgMyBSb3V0ZSBkZSBSYWJhdCBBaW4gc2JhYVwiLFxyXG4gICAgXCJjaXR5XCI6IFwiY2FzYWJsYW5jYVwiLFxyXG4gICAgXCJ0eXBlXCI6IFwicmVzZWF1LWV0cmFuZ2VyXCIsXHJcbiAgICBcImNvb3Jkc1wiOiB7XHJcbiAgICAgIFwiZW1haWxcIjogXCJqaG9uZG9lQGdtYWlsLmNvbVwiLFxyXG4gICAgICBcInBob25lXCI6IFwiMDYxODY2MTg2NlwiLFxyXG4gICAgICBcImZheFwiOiBcIjA2MTg2NjE4NjZcIixcclxuICAgICAgXCJncHNcIjoge1xyXG4gICAgICAgIFwibGFuZ1wiOiAzMy41ODEwMzM2LFxyXG4gICAgICAgIFwibGF0XCI6IC03LjU4MTQwMTVcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiZXh0ZW5zaW9uXCI6IHtcclxuICAgICAgXCJuYW1lXCI6IFwiQWwtYm91Y2hyYSBDYXNhbmVhcnNob3JlXCIsXHJcbiAgICAgIFwiYWRkcmVzc1wiOiBcIjQ4IEFWIGRlcyBmb3JjZXMgYXJtZWUgcm95YWxlc1wiXHJcbiAgICB9LFxyXG4gICAgXCJ0aW1ldGFibGVcIjoge1xyXG4gICAgICBcIm1vbmRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJ0dWVzZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcIndlZG5lc2RheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJ0aHVyc2RheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJmcmlkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwic2F0dXJkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwic3VuZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiXHJcbiAgICB9XHJcbiAgfSxcclxuICB7XHJcbiAgICBcIm5hbWVcIjogXCJBZ2VuY2UgUE9SVEUgROKAmUFORkFcIixcclxuICAgIFwiYWRkcmVzc1wiOiBcIk7CsCA0IEFORyBCRCBE4oCZYW5mYSBldCBydWUgbW91bGF5IHJhY2hpZCBCUCAyNDVcIixcclxuICAgIFwiY2l0eVwiOiBcImNhc2FibGFuY2FcIixcclxuICAgIFwidHlwZVwiOiBcImFnZW5jZVwiLFxyXG4gICAgXCJjb29yZHNcIjoge1xyXG4gICAgICBcImVtYWlsXCI6IFwiamhvbmRvZUBnbWFpbC5jb21cIixcclxuICAgICAgXCJwaG9uZVwiOiBcIjA2MTg2NjE4NjZcIixcclxuICAgICAgXCJmYXhcIjogXCIwNjE4NjYxODY2XCIsXHJcbiAgICAgIFwiZ3BzXCI6IHtcclxuICAgICAgICBcImxhbmdcIjogMzMuNTczMDksXHJcbiAgICAgICAgXCJsYXRcIjogLTcuNjI4Njk3OVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJleHRlbnNpb25cIjoge1xyXG4gICAgICBcIm5hbWVcIjogXCJBbC1ib3VjaHJhIENhc2FuZWFyc2hvcmVcIixcclxuICAgICAgXCJhZGRyZXNzXCI6IFwiNDggQVYgZGVzIGZvcmNlcyBhcm1lZSByb3lhbGVzXCJcclxuICAgIH0sXHJcbiAgICBcInRpbWV0YWJsZVwiOiB7XHJcbiAgICAgIFwibW9uZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcInR1ZXNkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwid2VkbmVzZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcInRodXJzZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcImZyaWRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJzYXR1cmRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJzdW5kYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCJcclxuICAgIH1cclxuICB9LFxyXG4gIHtcclxuICAgIFwibmFtZVwiOiBcIkFnZW5jZSBPbWFyXCIsXHJcbiAgICBcImFkZHJlc3NcIjogXCIzIGV0IDQsSW1tIFJvbWFuZGllIElJIGJvdWx2YXJkIEJpciBhbnphcmFuZVwiLFxyXG4gICAgXCJjaXR5XCI6IFwiY2FzYWJsYW5jYVwiLFxyXG4gICAgXCJ0eXBlXCI6IFwiZ2FiXCIsXHJcbiAgICBcImNvb3Jkc1wiOiB7XHJcbiAgICAgIFwiZW1haWxcIjogXCJqaG9uZG9lQGdtYWlsLmNvbVwiLFxyXG4gICAgICBcInBob25lXCI6IFwiMDYxODY2MTg2NlwiLFxyXG4gICAgICBcImZheFwiOiBcIjA2MTg2NjE4NjZcIixcclxuICAgICAgXCJncHNcIjoge1xyXG4gICAgICAgIFwibGFuZ1wiOiAzMy41NjE3NjIzLFxyXG4gICAgICAgIFwibGF0XCI6IC03LjYyNDgxMzZcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiZXh0ZW5zaW9uXCI6IHtcclxuICAgICAgXCJuYW1lXCI6IFwiQWwtYm91Y2hyYSBDYXNhbmVhcnNob3JlXCIsXHJcbiAgICAgIFwiYWRkcmVzc1wiOiBcIjQ4IEFWIGRlcyBmb3JjZXMgYXJtZWUgcm95YWxlc1wiXHJcbiAgICB9LFxyXG4gICAgXCJ0aW1ldGFibGVcIjoge1xyXG4gICAgICBcIm1vbmRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJ0dWVzZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcIndlZG5lc2RheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJ0aHVyc2RheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJmcmlkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwic2F0dXJkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwic3VuZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiXHJcbiAgICB9XHJcbiAgfSxcclxuICB7XHJcbiAgICBcIm5hbWVcIjogXCJBZ2VuY2UgSEFKIE9NQVIgXCIsXHJcbiAgICBcImFkZHJlc3NcIjogXCJLTSA3LCAzIFJvdXRlIGRlIFJhYmF0IEFpbiBzYmFhXCIsXHJcbiAgICBcImNpdHlcIjogXCJyYWJhdFwiLFxyXG4gICAgXCJ0eXBlXCI6IFwiZ2FiXCIsXHJcbiAgICBcImNvb3Jkc1wiOiB7XHJcbiAgICAgIFwiZW1haWxcIjogXCJqaG9uZG9lQGdtYWlsLmNvbVwiLFxyXG4gICAgICBcInBob25lXCI6IFwiMDYxODY2MTg2NlwiLFxyXG4gICAgICBcImZheFwiOiBcIjA2MTg2NjE4NjZcIixcclxuICAgICAgXCJncHNcIjoge1xyXG4gICAgICAgIFwibGFuZ1wiOiAzMy41ODU2Mjk3LFxyXG4gICAgICAgIFwibGF0XCI6IC03LjYyMTY1NzdcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiZXh0ZW5zaW9uXCI6IHtcclxuICAgICAgXCJuYW1lXCI6IFwiQWwtYm91Y2hyYSBDYXNhbmVhcnNob3JlXCIsXHJcbiAgICAgIFwiYWRkcmVzc1wiOiBcIjQ4IEFWIGRlcyBmb3JjZXMgYXJtZWUgcm95YWxlc1wiXHJcbiAgICB9LFxyXG4gICAgXCJ0aW1ldGFibGVcIjoge1xyXG4gICAgICBcIm1vbmRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJ0dWVzZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcIndlZG5lc2RheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJ0aHVyc2RheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJmcmlkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwic2F0dXJkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwic3VuZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiXHJcbiAgICB9XHJcbiAgfSxcclxuICB7XHJcbiAgICBcIm5hbWVcIjogXCJBZ2VuY2UgUE9SVEUgUmFiYXRcIixcclxuICAgIFwiYWRkcmVzc1wiOiBcIk7CsCA0IEFORyBCRCBE4oCZYW5mYSBldCBydWUgbW91bGF5IHJhY2hpZCBCUCAyNDVcIixcclxuICAgIFwiY2l0eVwiOiBcInRhbmdlclwiLFxyXG4gICAgXCJ0eXBlXCI6IFwiY2VudHJlcy1hZmZhaXJlc1wiLFxyXG4gICAgXCJjb29yZHNcIjoge1xyXG4gICAgICBcImVtYWlsXCI6IFwiamhvbmRvZUBnbWFpbC5jb21cIixcclxuICAgICAgXCJwaG9uZVwiOiBcIjA2MTg2NjE4NjZcIixcclxuICAgICAgXCJmYXhcIjogXCIwNjE4NjYxODY2XCIsXHJcbiAgICAgIFwiZ3BzXCI6IHtcclxuICAgICAgICBcImxhbmdcIjogMzMuNTk1NTM4OSxcclxuICAgICAgICBcImxhdFwiOiAtNy42NDU5MzQzXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInRpbWV0YWJsZVwiOiB7XHJcbiAgICAgIFwibW9uZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcInR1ZXNkYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCIsXHJcbiAgICAgIFwid2VkbmVzZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcInRodXJzZGF5XCI6IFwiMDg6MDUtMTI6MDUgfCAxNDowMC0xNzoxNVwiLFxyXG4gICAgICBcImZyaWRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJzYXR1cmRheVwiOiBcIjA4OjA1LTEyOjA1IHwgMTQ6MDAtMTc6MTVcIixcclxuICAgICAgXCJzdW5kYXlcIjogXCIwODowNS0xMjowNSB8IDE0OjAwLTE3OjE1XCJcclxuICAgIH0sXHJcbiAgICBcImV4dGVuc2lvblwiOiB7XHJcbiAgICAgIFwibmFtZVwiOiBcIkFsLWJvdWNocmEgQ2FzYW5lYXJzaG9yZVwiLFxyXG4gICAgICBcImFkZHJlc3NcIjogXCI0OCBBViBkZXMgZm9yY2VzIGFybWVlIHJveWFsZXNcIlxyXG4gICAgfVxyXG4gIH1cclxuXVxyXG4iLCJpbXBvcnQgc2VsZWN0IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvc2VsZWN0LWZpbHRlci9pbmRleC5qcydcclxuaW1wb3J0IHRvcEhlYWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL3RvcC1oZWFkZXIvaW5kZXguanMnXHJcbmltcG9ydCBoZWFkZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9oZWFkZXIvaW5kZXguanMnXHJcbmltcG9ydCBmb290ZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9mb290ZXIvaW5kZXguanMnXHJcbmltcG9ydCBjYXJkU2xpZGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvY2FyZC9jYXJkLXNsaWRlci5qcydcclxuaW1wb3J0IGRhdGVTbGlkZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9kYXRlLXNsaWRlci9kYXRlLXNsaWRlci5qcydcclxuaW1wb3J0IGxvZ29TbGlkZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9sb2dvLXNsaWRlci9pbmRleC5qcydcclxuaW1wb3J0IGZpbmFuY2UgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9maW5hbmNlL2luZGV4LmpzJ1xyXG5pbXBvcnQgZmluYW5jZUZpbHRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL2ZpbmFuY2UvZmlsdGVyLmpzJ1xyXG5pbXBvcnQgYmFucXVlc1NsaWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL25vcy1iYW5xdWVzL2luZGV4LmpzJ1xyXG5pbXBvcnQgaG9tZVNsaWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL2hvbWUtc2xpZGVyL2luZGV4LmpzJ1xyXG5pbXBvcnQgYmVzb2luQWlkZSBmcm9tICcuLi8uLi9jb21wb25lbnRzL2Jlc29pbi1haWRlL2luZGV4LmpzJ1xyXG5pbXBvcnQgc3dpcGVib3ggZnJvbSAnLi4vLi4vY29tcG9uZW50cy9zd2lwZWJveC9pbmRleC5qcydcclxuaW1wb3J0IGFydGljbGVTbGlkZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9hcnRpY2xlLXNsaWRlci9pbmRleC5qcydcclxuaW1wb3J0IGNhcmRSYXBwb3J0IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvY2FyZC9jYXJkLXJhcHBvcnQvY2FyZC1yYXBwb3J0LmpzJ1xyXG5pbXBvcnQgcG9wdXBTZWFyY2ggZnJvbSAnLi4vLi4vY29tcG9uZW50cy9wb3B1cC1zZWFyY2gvaW5kZXguanMnXHJcbmltcG9ydCBwb3B1cFZpZGVvIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvcG9wdXAtdmlkZW8vaW5kZXguanMnXHJcbmltcG9ydCBhY3R1YWxpdGVTbGlkZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9hY3R1YWxpdGUtc2xpZGVyL2luZGV4LmpzJ1xyXG5pbXBvcnQgcHViU2xpZGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvcHViLXNsaWRlci9pbmRleC5qcydcclxuaW1wb3J0IGZvcm1WYWxpZGF0aW9uIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvZm9ybS9mb3JtLXZhbGlkYXRpb24uanMnXHJcbmltcG9ydCBmb3JtVXBsb2FkIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvZm9ybS9mb3JtLXVwbG9hZC5qcydcclxuaW1wb3J0IGNhcmRBY3R1U2xpZGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvY2FyZC9jYXJkLWFjdHVhbGl0ZXMuanMnXHJcbmltcG9ydCBjYXJkSGlzdG9pcmVTbGlkZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9jYXJkL2NhcmQtaGlzdG9pcmUuanMnXHJcbmltcG9ydCBhcHBlbE9mZmVyZXMgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9hcHBlbC1vZmZyZXMvaW5kZXguanMnXHJcbmltcG9ydCBtYXAgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9tYXAvaW5kZXguanMnXHJcbmltcG9ydCB0aW1lbGluZSBmcm9tICcuLi8uLi9jb21wb25lbnRzL3RpbWVsaW5lL2luZGV4LmpzJ1xyXG5pbXBvcnQge1xyXG4gIG1hcENvbnRyb2wsXHJcbiAgdG9nZ2xlQ29udHJvbFxyXG59IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvbWFwLWNvbnRyb2wvaW5kZXguanMnXHJcbmltcG9ydCBzbW9vdGhzY3JvbGwgZnJvbSAnc21vb3Roc2Nyb2xsLXBvbHlmaWxsJ1xyXG5pbXBvcnQgYWN0dWFsaXRlRmlsdGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvYWN0dWFsaXRlcy9pbmRleC5qcydcclxuaW1wb3J0IG1lZGlhY2VudGVyRmlsdGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvbWVkaWFjZW50ZXIvaW5kZXguanMnXHJcbmltcG9ydCBjb21tdW5pcXVlc0ZpbHRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL2NvbW11bmlxdWVzL2luZGV4LmpzJ1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gIHNtb290aHNjcm9sbC5wb2x5ZmlsbCgpXHJcbiAgc2VsZWN0KClcclxuICB0b3BIZWFkZXIoKVxyXG4gIGhlYWRlcigpXHJcbiAgZm9vdGVyKClcclxuICBjYXJkU2xpZGVyKClcclxuICBmaW5hbmNlRmlsdGVyKClcclxuICBkYXRlU2xpZGVyKClcclxuICBsb2dvU2xpZGVyKClcclxuICBmaW5hbmNlKClcclxuICBiYW5xdWVzU2xpZGVyKClcclxuICBob21lU2xpZGVyKClcclxuICBiZXNvaW5BaWRlKClcclxuICBzd2lwZWJveCgpXHJcbiAgYXJ0aWNsZVNsaWRlcigpXHJcbiAgY2FyZFJhcHBvcnQoKVxyXG4gIHBvcHVwU2VhcmNoKClcclxuICBwb3B1cFZpZGVvKClcclxuICBhY3R1YWxpdGVTbGlkZXIoKVxyXG4gIHB1YlNsaWRlcigpXHJcbiAgZm9ybVZhbGlkYXRpb24oKVxyXG4gIGZvcm1VcGxvYWQoKVxyXG4gIGNhcmRBY3R1U2xpZGVyKClcclxuICBjYXJkSGlzdG9pcmVTbGlkZXIoKVxyXG4gIG1hcCgpXHJcbiAgbWFwQ29udHJvbCgpXHJcbiAgdG9nZ2xlQ29udHJvbCgpXHJcbiAgdGltZWxpbmUoKVxyXG4gIGFjdHVhbGl0ZUZpbHRlcigpXHJcbiAgYXBwZWxPZmZlcmVzKClcclxuICBtZWRpYWNlbnRlckZpbHRlcigpXHJcbiAgY29tbXVuaXF1ZXNGaWx0ZXIoKVxyXG59KVxyXG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKCQoJy5hY3R1YWxpdGUtc2xpZGVyJykubGVuZ3RoKSB7XHJcblxyXG4gICAgdmFyIHJ0bCA9ICQoJ2h0bWwnKS5hdHRyKCdkaXInKSA9PSAncnRsJztcclxuXHJcbiAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA5OTEpIHtcclxuICAgICAgYXJ0aWNsZVNsaWRlcigwLCBydGwpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhcnRpY2xlU2xpZGVyKDAsIHJ0bClcclxuICAgIH1cclxuXHJcbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpID4gOTkxKSB7XHJcbiAgICAgICAgYXJ0aWNsZVNsaWRlcigwLCBydGwpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYXJ0aWNsZVNsaWRlcigwLCBydGwpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhcnRpY2xlU2xpZGVyIChzdGFnZVBhZGRpbmcsIHJ0bCkge1xyXG4gICAgJCgnLmFjdHVhbGl0ZS1zbGlkZXIub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICBzdGFnZVBhZGRpbmc6IHN0YWdlUGFkZGluZyxcclxuICAgICAgbWFyZ2luOiAxOCxcclxuICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgbmF2OiB0cnVlLFxyXG4gICAgICBtZXJnZTogdHJ1ZSxcclxuICAgICAgbG9vcDogdHJ1ZSxcclxuICAgICAgcnRsOiBydGwsXHJcbiAgICAgIHJlc3BvbnNpdmU6IHtcclxuICAgICAgICAwOiB7XHJcbiAgICAgICAgICBpdGVtczogMVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgOTkyOiB7XHJcbiAgICAgICAgICBpdGVtczogM1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IERhdGVGaWx0ZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9kYXRlLWZpbHRlci9pbmRleC5qcydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgdGFnRmlsdGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNhY3R1YWxpdGUtZmlsdGVycyBhJylcclxuICBsZXQgYWN0dWFsaXRlSG9sZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FjdHVhbGl0ZS1ob2xkZXInKVxyXG4gIGxldCBzdGFydERhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3RhcnQnKVxyXG4gIGxldCBlbmREYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVuZCcpXHJcbiAgbGV0IGFsbEZpbHRlckJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhY3R1YWxpdGUtZmlsdGVyLWFsbCcpXHJcblxyXG4gIGlmICh0YWdGaWx0ZXJzLmxlbmd0aCA8PSAwIHx8ICFhY3R1YWxpdGVIb2xkZXIpIHJldHVyblxyXG5cclxuICBsZXQgc3RhdGUgPSB7XHJcbiAgICBmaWx0ZXJzOiBbXSxcclxuICAgIGRhdGVGaWx0ZXI6IHtcclxuICAgICAgZnJvbTogJycsXHJcbiAgICAgIHRvOiAnJ1xyXG4gICAgfSxcclxuICAgIG9yZGVyOiAnZGVzYycsXHJcbiAgICBtYXg6IDMsXHJcbiAgICBkYXRhOiBbXHJcbiAgICAgIHtcclxuICAgICAgICB0eXBlOiAnYXJ0aWNsZS1pbWcnLFxyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0ZJTkFOQ0UnLCAnRU5UUkVQUkVOQVJJQVQnXSxcclxuICAgICAgICBkYXRlOiAnMjEvMDcvMjAxNycsXHJcbiAgICAgICAgdGl0bGU6ICd1bmUgYW1iaWFuY2UgZmVzdGl2ZSBldCBmYW1pbGlhbGUgcXVlIHPigJllc3QgZMOpcm91bMOpJyxcclxuICAgICAgICBjb250ZW50OiAnTGUgR3JvdXBlIEJDUCwgYWN0ZXVyIHBhbmFmcmljYWluIGRlIHLDqWbDqXJlbmNlLCBldCBsYSBTb2Npw6l0w6kgRmluYVRuY2nDqHJlIEludGVybmF0aW9uYWxlIChJRkMpLi4uJyxcclxuICAgICAgICBpbWFnZTogJ2Fzc2V0cy9pbWcvYWN0dS0yLnBuZydcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHR5cGU6ICdhbm5vbmNlJyxcclxuICAgICAgICB0YWdzOiBbJ1JTRSddLFxyXG4gICAgICAgIGRhdGU6ICcyOS8wNy8yMDE3JyxcclxuICAgICAgICBjb250ZW50OiBgQSBs4oCZb2NjYXNpb24gZGUgbGEgSm91cm7DqWUgSW50ZXJuYXRpb25hbGUgZGUgbGEgRmVtbWUsIGxhIDxhIGhyZWY9XCJodHRwczovL3R3aXR0ZXIuY29tL2hhc2h0YWcvQmFucXVlX1BvcHVsYWlyZVwiIHRhcmdldD1cIl9ibGFua1wiPiNCYW5xdWVfUG9wdWxhaXJlPC9hPiBwcsOpc2VudGUgw6AgdG91dGVzIGxlcyBmZW1tZXMgc2VzIHbFk3V4IGxlcyBwbHVzIHNpbmPDqHJlcyBkZSByw6l1c3NpdGUgZXQgZGUgcHJvc3DDqXJpdMOpLiA8YSBocmVmPVwiaHR0cHM6Ly90d2l0dGVyLmNvbS9oYXNodGFnLzhtYXJzXCIgIHRhcmdldD1cIl9ibGFua1wiPiM4bWFyczwvYT4gPGEgaHJlZj1cImh0dHBzOi8vdHdpdHRlci5jb20vaGFzaHRhZy9jb3Jwb1wiICB0YXJnZXQ9XCJfYmxhbmtcIj4jY29ycG88L2E+XHJcbiAgICAgICAgYFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdHlwZTogJ2FydGljbGUnLFxyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0VOVFJFUFJFTkFSSUFUJ10sXHJcbiAgICAgICAgZGF0ZTogJzIyLzA3LzIwMTcnLFxyXG4gICAgICAgIHRpdGxlOiAndW5lIGFtYmlhbmNlIGZlc3RpdmUgZXQgZmFtaWxpYWxlIHF1ZSBz4oCZZXN0IGTDqXJvdWzDqScsXHJcbiAgICAgICAgY29udGVudDogJ0xlIEdyb3VwZSBCQ1AsIGFjdGV1ciBwYW5hZnJpY2FpbiBkZSByw6lmw6lyZW5jZSwgZXQgbGEgU29jacOpdMOpIEZpbmFUbmNpw6hyZSBJbnRlcm5hdGlvbmFsZSAoSUZDKS4uLidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHR5cGU6ICdhcnRpY2xlJyxcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdERVZFTE9QUEVNRU5UIERVUkFCTEUnXSxcclxuICAgICAgICBkYXRlOiAnMjMvMDcvMjAxNycsXHJcbiAgICAgICAgdGl0bGU6ICd1bmUgYW1iaWFuY2UgZmVzdGl2ZSBldCBmYW1pbGlhbGUgcXVlIHPigJllc3QgZMOpcm91bMOpJyxcclxuICAgICAgICBjb250ZW50OiAnTGUgR3JvdXBlIEJDUCwgYWN0ZXVyIHBhbmFmcmljYWluIGRlIHLDqWbDqXJlbmNlLCBldCBsYSBTb2Npw6l0w6kgRmluYVRuY2nDqHJlIEludGVybmF0aW9uYWxlIChJRkMpLi4uJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdHlwZTogJ2FydGljbGUnLFxyXG4gICAgICAgIHRhZ3M6IFsnUlNFJ10sXHJcbiAgICAgICAgZGF0ZTogJzIxLzA3LzIwMTcnLFxyXG4gICAgICAgIHRpdGxlOiAndW5lIGFtYmlhbmNlIGZlc3RpdmUgZXQgZmFtaWxpYWxlIHF1ZSBz4oCZZXN0IGTDqXJvdWzDqScsXHJcbiAgICAgICAgY29udGVudDogJ0xlIEdyb3VwZSBCQ1AsIGFjdGV1ciBwYW5hZnJpY2FpbiBkZSByw6lmw6lyZW5jZSwgZXQgbGEgU29jacOpdMOpIEZpbmFUbmNpw6hyZSBJbnRlcm5hdGlvbmFsZSAoSUZDKS4uLidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHR5cGU6ICdhcnRpY2xlJyxcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJ10sXHJcbiAgICAgICAgZGF0ZTogJzI0LzA3LzIwMTcnLFxyXG4gICAgICAgIHRpdGxlOiAndW5lIGFtYmlhbmNlIGZlc3RpdmUgZXQgZmFtaWxpYWxlIHF1ZSBz4oCZZXN0IGTDqXJvdWzDqScsXHJcbiAgICAgICAgY29udGVudDogJ0xlIEdyb3VwZSBCQ1AsIGFjdGV1ciBwYW5hZnJpY2FpbiBkZSByw6lmw6lyZW5jZSwgZXQgbGEgU29jacOpdMOpIEZpbmFUbmNpw6hyZSBJbnRlcm5hdGlvbmFsZSAoSUZDKS4uLidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHR5cGU6ICdhcnRpY2xlLWltZycsXHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgIGRhdGU6ICcyNS8wNy8yMDE3JyxcclxuICAgICAgICB0aXRsZTogJ3VuZSBhbWJpYW5jZSBmZXN0aXZlIGV0IGZhbWlsaWFsZSBxdWUgc+KAmWVzdCBkw6lyb3Vsw6knLFxyXG4gICAgICAgIGNvbnRlbnQ6ICdMZSBHcm91cGUgQkNQLCBhY3RldXIgcGFuYWZyaWNhaW4gZGUgcsOpZsOpcmVuY2UsIGV0IGxhIFNvY2nDqXTDqSBGaW5hVG5jacOocmUgSW50ZXJuYXRpb25hbGUgKElGQykuLi4nLFxyXG4gICAgICAgIGltYWdlOiAnYXNzZXRzL2ltZy9hY3R1LTEucG5nJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdHlwZTogJ2FydGljbGUnLFxyXG4gICAgICAgIHRhZ3M6IFsnUlNFJ10sXHJcbiAgICAgICAgZGF0ZTogJzI2LzA3LzIwMTcnLFxyXG4gICAgICAgIHRpdGxlOiAndW5lIGFtYmlhbmNlIGZlc3RpdmUgZXQgZmFtaWxpYWxlIHF1ZSBz4oCZZXN0IGTDqXJvdWzDqScsXHJcbiAgICAgICAgY29udGVudDogJ0xlIEdyb3VwZSBCQ1AsIGFjdGV1ciBwYW5hZnJpY2FpbiBkZSByw6lmw6lyZW5jZSwgZXQgbGEgU29jacOpdMOpIEZpbmFUbmNpw6hyZSBJbnRlcm5hdGlvbmFsZSAoSUZDKS4uLidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHR5cGU6ICdhcnRpY2xlJyxcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJ10sXHJcbiAgICAgICAgZGF0ZTogJzIxLzA3LzIwMTcnLFxyXG4gICAgICAgIHRpdGxlOiAndW5lIGFtYmlhbmNlIGZlc3RpdmUgZXQgZmFtaWxpYWxlIHF1ZSBz4oCZZXN0IGTDqXJvdWzDqScsXHJcbiAgICAgICAgY29udGVudDogJ0xlIEdyb3VwZSBCQ1AsIGFjdGV1ciBwYW5hZnJpY2FpbiBkZSByw6lmw6lyZW5jZSwgZXQgbGEgU29jacOpdMOpIEZpbmFUbmNpw6hyZSBJbnRlcm5hdGlvbmFsZSAoSUZDKS4uLidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHR5cGU6ICdhcnRpY2xlLWltZycsXHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8wOC8yMDE3JyxcclxuICAgICAgICB0aXRsZTogJ3VuZSBhbWJpYW5jZSBmZXN0aXZlIGV0IGZhbWlsaWFsZSBxdWUgc+KAmWVzdCBkw6lyb3Vsw6knLFxyXG4gICAgICAgIGNvbnRlbnQ6ICdMZSBHcm91cGUgQkNQLCBhY3RldXIgcGFuYWZyaWNhaW4gZGUgcsOpZsOpcmVuY2UsIGV0IGxhIFNvY2nDqXTDqSBGaW5hVG5jacOocmUgSW50ZXJuYXRpb25hbGUgKElGQykuLi4nLFxyXG4gICAgICAgIGltYWdlOiAnYXNzZXRzL2ltZy9hY3R1LTEucG5nJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdHlwZTogJ2FydGljbGUnLFxyXG4gICAgICAgIHRhZ3M6IFsnUlNFJ10sXHJcbiAgICAgICAgZGF0ZTogJzIyLzA4LzIwMTYnLFxyXG4gICAgICAgIHRpdGxlOiAndW5lIGFtYmlhbmNlIGZlc3RpdmUgZXQgZmFtaWxpYWxlIHF1ZSBz4oCZZXN0IGTDqXJvdWzDqScsXHJcbiAgICAgICAgY29udGVudDogJ0xlIEdyb3VwZSBCQ1AsIGFjdGV1ciBwYW5hZnJpY2FpbiBkZSByw6lmw6lyZW5jZSwgZXQgbGEgU29jacOpdMOpIEZpbmFUbmNpw6hyZSBJbnRlcm5hdGlvbmFsZSAoSUZDKS4uLidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHR5cGU6ICdhcnRpY2xlJyxcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJ10sXHJcbiAgICAgICAgZGF0ZTogJzIxLzA5LzIwMTcnLFxyXG4gICAgICAgIHRpdGxlOiAndW5lIGFtYmlhbmNlIGZlc3RpdmUgZXQgZmFtaWxpYWxlIHF1ZSBz4oCZZXN0IGTDqXJvdWzDqScsXHJcbiAgICAgICAgY29udGVudDogJ0xlIEdyb3VwZSBCQ1AsIGFjdGV1ciBwYW5hZnJpY2FpbiBkZSByw6lmw6lyZW5jZSwgZXQgbGEgU29jacOpdMOpIEZpbmFUbmNpw6hyZSBJbnRlcm5hdGlvbmFsZSAoSUZDKS4uLidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHR5cGU6ICdhcnRpY2xlLWltZycsXHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8xMC8yMDE3JyxcclxuICAgICAgICB0aXRsZTogJ3VuZSBhbWJpYW5jZSBmZXN0aXZlIGV0IGZhbWlsaWFsZSBxdWUgc+KAmWVzdCBkw6lyb3Vsw6knLFxyXG4gICAgICAgIGNvbnRlbnQ6ICdMZSBHcm91cGUgQkNQLCBhY3RldXIgcGFuYWZyaWNhaW4gZGUgcsOpZsOpcmVuY2UsIGV0IGxhIFNvY2nDqXTDqSBGaW5hVG5jacOocmUgSW50ZXJuYXRpb25hbGUgKElGQykuLi4nLFxyXG4gICAgICAgIGltYWdlOiAnYXNzZXRzL2ltZy9hY3R1LTEucG5nJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdHlwZTogJ2FydGljbGUnLFxyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0ZJTkFOQ0UnXSxcclxuICAgICAgICBkYXRlOiAnMjEvMDcvMjAxOCcsXHJcbiAgICAgICAgdGl0bGU6ICd1bmUgYW1iaWFuY2UgZmVzdGl2ZSBldCBmYW1pbGlhbGUgcXVlIHPigJllc3QgZMOpcm91bMOpJyxcclxuICAgICAgICBjb250ZW50OiAnTGUgR3JvdXBlIEJDUCwgYWN0ZXVyIHBhbmFmcmljYWluIGRlIHLDqWbDqXJlbmNlLCBldCBsYSBTb2Npw6l0w6kgRmluYVRuY2nDqHJlIEludGVybmF0aW9uYWxlIChJRkMpLi4uJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdHlwZTogJ2FydGljbGUtaW1nJyxcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJ10sXHJcbiAgICAgICAgZGF0ZTogJzIxLzA3LzIwMTgnLFxyXG4gICAgICAgIHRpdGxlOiAndW5lIGFtYmlhbmNlIGZlc3RpdmUgZXQgZmFtaWxpYWxlIHF1ZSBz4oCZZXN0IGTDqXJvdWzDqScsXHJcbiAgICAgICAgY29udGVudDogJ0xlIEdyb3VwZSBCQ1AsIGFjdGV1ciBwYW5hZnJpY2FpbiBkZSByw6lmw6lyZW5jZSwgZXQgbGEgU29jacOpdMOpIEZpbmFUbmNpw6hyZSBJbnRlcm5hdGlvbmFsZSAoSUZDKS4uLicsXHJcbiAgICAgICAgaW1hZ2U6ICdhc3NldHMvaW1nL2FjdHUtMS5wbmcnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0eXBlOiAnYXJ0aWNsZScsXHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8wNy8yMDE5JyxcclxuICAgICAgICB0aXRsZTogJ3VuZSBhbWJpYW5jZSBmZXN0aXZlIGV0IGZhbWlsaWFsZSBxdWUgc+KAmWVzdCBkw6lyb3Vsw6knLFxyXG4gICAgICAgIGNvbnRlbnQ6ICdMZSBHcm91cGUgQkNQLCBhY3RldXIgcGFuYWZyaWNhaW4gZGUgcsOpZsOpcmVuY2UsIGV0IGxhIFNvY2nDqXTDqSBGaW5hVG5jacOocmUgSW50ZXJuYXRpb25hbGUgKElGQykuLi4nXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0eXBlOiAnYXJ0aWNsZS1pbWcnLFxyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0ZJTkFOQ0UnXSxcclxuICAgICAgICBkYXRlOiAnMjEvMDcvMjAyMCcsXHJcbiAgICAgICAgdGl0bGU6ICd1bmUgYW1iaWFuY2UgZmVzdGl2ZSBldCBmYW1pbGlhbGUgcXVlIHPigJllc3QgZMOpcm91bMOpJyxcclxuICAgICAgICBjb250ZW50OiAnTGUgR3JvdXBlIEJDUCwgYWN0ZXVyIHBhbmFmcmljYWluIGRlIHLDqWbDqXJlbmNlLCBldCBsYSBTb2Npw6l0w6kgRmluYVRuY2nDqHJlIEludGVybmF0aW9uYWxlIChJRkMpLi4uJyxcclxuICAgICAgICBpbWFnZTogJ2Fzc2V0cy9pbWcvYWN0dS0xLnBuZydcclxuICAgICAgfVxyXG4gICAgXVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY2xlYW5UYWcgKHRhZ0ZpbHRlcikge1xyXG4gICAgdGFnRmlsdGVyID0gdGFnRmlsdGVyLnRvTG93ZXJDYXNlKClcclxuICAgIGlmICh0YWdGaWx0ZXJbMF0gPT0gJyMnKSB7XHJcbiAgICAgIHRhZ0ZpbHRlciA9IHRhZ0ZpbHRlci5zbGljZSgxKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0YWdGaWx0ZXJcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG1ha2VEYXRlT2JqZWN0IChkYXRlU3RyaW5nKSB7XHJcbiAgICBsZXQgW2RheSwgbW9udGgsIHllYXJdID0gZGF0ZVN0cmluZy5zcGxpdCgnLycpXHJcblxyXG4gICAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoIC0gMSwgZGF5KVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYXBwbHlGaWx0ZXJzICgpIHtcclxuICAgIGxldCBkYXRhID0gc3RhdGUuZGF0YVxyXG4gICAgaWYgKHN0YXRlLmZpbHRlcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICBkYXRhID0gZGF0YS5maWx0ZXIocG9zdCA9PiB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGF0ZS5maWx0ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAocG9zdC50YWdzLmluY2x1ZGVzKHN0YXRlLmZpbHRlcnNbaV0udG9VcHBlckNhc2UoKSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHN0YXRlLmRhdGVGaWx0ZXIuZnJvbSAmJiBzdGF0ZS5kYXRlRmlsdGVyLnRvKSB7XHJcbiAgICAgIGRhdGEgPSBkYXRhLmZpbHRlcihwb3N0ID0+IHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICBtYWtlRGF0ZU9iamVjdChwb3N0LmRhdGUpIC0gbWFrZURhdGVPYmplY3Qoc3RhdGUuZGF0ZUZpbHRlci5mcm9tKSA+PVxyXG4gICAgICAgICAgICAwICYmXHJcbiAgICAgICAgICBtYWtlRGF0ZU9iamVjdChwb3N0LmRhdGUpIC0gbWFrZURhdGVPYmplY3Qoc3RhdGUuZGF0ZUZpbHRlci50bykgPD0gMFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGRhdGEgPSBkYXRhLnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgcmV0dXJuIHN0YXRlLm9yZGVyID09ICdkZXNjJ1xyXG4gICAgICAgID8gbWFrZURhdGVPYmplY3QoYi5kYXRlKSAtIG1ha2VEYXRlT2JqZWN0KGEuZGF0ZSlcclxuICAgICAgICA6IG1ha2VEYXRlT2JqZWN0KGEuZGF0ZSkgLSBtYWtlRGF0ZU9iamVjdChiLmRhdGUpXHJcbiAgICB9KVxyXG5cclxuICAgIHNob3dTZWxlY3RlZChkYXRhKVxyXG4gIH1cclxuICBmdW5jdGlvbiBjaGFuZ2VGaWx0ZXJzIChlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuXHJcbiAgICB0aGlzLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpXHJcblxyXG4gICAgc3RhdGUuZmlsdGVycyA9IFtdXHJcblxyXG4gICAgdGFnRmlsdGVycy5mb3JFYWNoKGZ1bmN0aW9uICh0YWcpIHtcclxuICAgICAgaWYgKCQodGFnKS5oYXNDbGFzcygnYWN0aXZlJykpIHtcclxuICAgICAgICBzdGF0ZS5maWx0ZXJzLnB1c2goY2xlYW5UYWcodGFnLmlubmVyVGV4dCkpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgaWYgKHN0YXRlLmZpbHRlcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICBhbGxGaWx0ZXJCdG4uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFsbEZpbHRlckJ0bi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5RmlsdGVycygpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzaG93U2VsZWN0ZWQgKGRhdGEpIHtcclxuICAgIGxldCBzZWxlY3RlZERhdGEgPSBkYXRhLnNsaWNlKDAsIHN0YXRlLm1heCAqIDMpXHJcblxyXG4gICAgY29uc29sZS5sb2coZGF0YS5sZW5ndGgpXHJcbiAgICBjb25zb2xlLmxvZyhzZWxlY3RlZERhdGEubGVuZ3RoKVxyXG5cclxuICAgIGlmIChzZWxlY3RlZERhdGEubGVuZ3RoID49IGRhdGEubGVuZ3RoKSB7XHJcbiAgICAgICQoJyNtb3JlLWFjdHVhbGl0ZScpLmhpZGUoKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgnI21vcmUtYWN0dWFsaXRlJykuc2hvdygpXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHNlbGVjdGVkRGF0YSlcclxuICB9XHJcblxyXG4gIGFwcGx5RmlsdGVycygpXHJcblxyXG4gICQoJyNtb3JlLWFjdHVhbGl0ZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIHN0YXRlLm1heCsrXHJcbiAgICBhcHBseUZpbHRlcnMoKVxyXG5cclxuICAgIHRoaXMuc2Nyb2xsSW50b1ZpZXcoe1xyXG4gICAgICBiZWhhdmlvcjogJ3Ntb290aCcsXHJcbiAgICAgIGlubGluZTogJ2VuZCdcclxuICAgIH0pXHJcbiAgICBpZiAoc3RhdGUubWF4ICsgMSA+IHN0YXRlLmRhdGEubGVuZ3RoIC8gMykgJCh0aGlzKS5oaWRlKClcclxuICB9KVxyXG5cclxuICBmdW5jdGlvbiByZW5kZXIgKGRhdGEpIHtcclxuICAgIGFjdHVhbGl0ZUhvbGRlci5pbm5lckhUTUwgPSBkYXRhXHJcbiAgICAgIC5tYXAocG9zdCA9PiB7XHJcbiAgICAgICAgaWYgKHBvc3QudHlwZSA9PT0gJ2FydGljbGUnKSB7XHJcbiAgICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBjb2wtbGctNCBtYi0yXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBjYXJkLS1hY3R1YWxpdGVzXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZF90YWdzXCI+XHJcbiAgICAgICAgICAgICR7cG9zdC50YWdzXHJcbiAgICAgICAgICAgIC5tYXAodGFnID0+IHtcclxuICAgICAgICAgICAgICByZXR1cm4gYDxhIGNsYXNzPVwiYnRuIGJ0bi0tdGFnIGJ0bi0tb3JhbmdlIG1yLTFcIiBocmVmPVwiL2dicC1mcm9udC9hY3R1YWxpdGVzLmh0bWxcIj5cclxuICAgICAgICAgICAgICAgICAgICAjJHt0YWd9XHJcbiAgICAgICAgICAgICAgICAgIDwvYT5gXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5qb2luKCcnKX1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPHAgY2xhc3M9XCJjYXJkX2RhdGVcIj5cclxuICAgICAgICAgICAgICAke3Bvc3QuZGF0ZX1cclxuICAgICAgICAgIDwvcD5cclxuICAgICAgICAgIDxhIGNsYXNzPVwiY2FyZF90aXRsZVwiIGhyZWY9XCIvZ2JwLWZyb250L25ld3MtZGV0YWlsLmh0bWxcIj5cclxuICAgICAgICAgICR7cG9zdC50aXRsZX1cclxuICAgICAgICA8L2E+XHJcbiAgICAgICAgICA8cCBjbGFzcz1cImNhcmRfZGVzY1wiPlxyXG4gICAgICAgICAgICAke3Bvc3QuY29udGVudH1cclxuICAgICAgICAgIDwvcD5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJjbGVhcmZpeCBwb3NpdGlvbi1yZWxhdGl2ZVwiPlxyXG4gICAgICAgICAgICAgIDxhIGNsYXNzPVwiY2FyZF9saW5rXCIgaHJlZj1cIi9nYnAtZnJvbnQvbmV3cy1kZXRhaWwuaHRtbFwiPlxyXG4gICAgICAgICAgICBlbiBzYXZvaXIgcGx1c1xyXG4gICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgIDxhIGNsYXNzPVwiY2FyZF9zaGFyZVwiIGhyZWY9XCIvZGlzdC9uZXdzLWRldGFpbC5odG1sXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxzdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi1zaGFyZS1zeW1ib2xcIj48L3VzZT5cclxuICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgIDx1bCBjbGFzcz1cInNoYXJlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9zaGFyZS5waHA/dT1cIiBvbmNsaWNrPVwiamF2YXNjcmlwdDp3aW5kb3cub3Blbih0aGlzLmhyZWYsJycsICdtZW51YmFyPW5vLHRvb2xiYXI9bm8scmVzaXphYmxlPXllcyxzY3JvbGxiYXJzPXllcyxoZWlnaHQ9NjAwLHdpZHRoPTYwMCcpO3JldHVybiBmYWxzZTtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyBjbGFzcz1cImZiXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi1mYWNlYm9va1wiPjwvdXNlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJodHRwczovL3R3aXR0ZXIuY29tL2ludGVudC90d2VldD90ZXh0PXRleHQtcGFydGFnZSZhbXA7dXJsPVwiIG9uY2xpY2s9XCJqYXZhc2NyaXB0OndpbmRvdy5vcGVuKHRoaXMuaHJlZiwnJywgJ21lbnViYXI9bm8sdG9vbGJhcj1ubyxyZXNpemFibGU9eWVzLHNjcm9sbGJhcnM9eWVzLGhlaWdodD02MDAsd2lkdGg9NjAwJyk7cmV0dXJuIGZhbHNlO1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIGNsYXNzPVwidHdpdHRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPVwiI2ljb24tdHdpdHRlclwiPjwvdXNlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJodHRwczovL3BsdXMuZ29vZ2xlLmNvbS9zaGFyZT91cmw9aHR0cHM6Ly9wbHVzLmdvb2dsZS5jb21cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2Zz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj1cIiNpY29uLWdvb2dsZS1wbHVzXCI+PC91c2U+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cImh0dHBzOi8vYXBpLndoYXRzYXBwLmNvbS9zZW5kP3RleHQ9dGV4dC13aGF0c2FwcCZhbXA7dXJsPVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPVwiI2ljb24td2hhdHNhcHBcIj48L3VzZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgYFxyXG4gICAgICAgIH0gZWxzZSBpZiAocG9zdC50eXBlID09PSAnYXJ0aWNsZS1pbWcnKSB7XHJcbiAgICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBjb2wtbGctOCBtYi0yXCI+PGRpdiBjbGFzcz1cImNhcmQgY2FyZC0tYWN0dWFsaXRlcyBjYXJkLS1hY3R1YWxpdGVzLWltZyBjbGVhcmZpeFwiPlxyXG4gICAgICAgICAgPGEgY2xhc3M9XCJpbWctd3JhcHBlclwiIGhyZWY9XCIvZ2JwLWZyb250L25ld3MtZGV0YWlsLmh0bWxcIj5cclxuICAgICAgICAgICAgICA8aW1nIHNyYz1cIiR7cG9zdC5pbWFnZX1cIiBhbHQ9XCJcIj5cclxuICAgICAgICAgIDwvYT5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3cmFwcGVyXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmRfdGFnc1wiPlxyXG4gICAgICAgICAgICAgICR7cG9zdC50YWdzXHJcbiAgICAgICAgICAgIC5tYXAodGFnID0+IHtcclxuICAgICAgICAgICAgICByZXR1cm4gYDxhIGNsYXNzPVwiYnRuIGJ0bi0tdGFnIGJ0bi0tb3JhbmdlIG1yLTFcIiBocmVmPVwiL2dicC1mcm9udC9hY3R1YWxpdGVzLmh0bWxcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgIyR7dGFnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9hPmBcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmpvaW4oJycpfVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxwIGNsYXNzPVwiY2FyZF9kYXRlXCI+XHJcbiAgICAgICAgICAgICAgICAgICR7cG9zdC5kYXRlfVxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8YSBjbGFzcz1cImNhcmRfdGl0bGVcIiBocmVmPVwiL2dicC1mcm9udC9uZXdzLWRldGFpbC5odG1sXCI+XHJcbiAgICAgICAgICAgICAgICAke3Bvc3QudGl0bGV9XHJcbiAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgPHAgY2xhc3M9XCJjYXJkX2Rlc2NcIj5cclxuICAgICAgICAgICAgICAke3Bvc3QuY29udGVudH1cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNsZWFyZml4IHBvc2l0aW9uLXJlbGF0aXZlXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwiY2FyZF9saW5rXCIgaHJlZj1cIi9nYnAtZnJvbnQvbmV3cy1kZXRhaWwuaHRtbFwiPlxyXG4gICAgICAgICAgICAgIGVuIHNhdm9pciBwbHVzXHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJjYXJkX3NoYXJlXCIgaHJlZj1cIiNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPVwiI2ljb24tc2hhcmUtc3ltYm9sXCI+PC91c2U+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJzaGFyZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vc2hhcmUucGhwP3U9XCIgb25jbGljaz1cImphdmFzY3JpcHQ6d2luZG93Lm9wZW4odGhpcy5ocmVmLCcnLCAnbWVudWJhcj1ubyx0b29sYmFyPW5vLHJlc2l6YWJsZT15ZXMsc2Nyb2xsYmFycz15ZXMsaGVpZ2h0PTYwMCx3aWR0aD02MDAnKTtyZXR1cm4gZmFsc2U7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgY2xhc3M9XCJmYlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPVwiI2ljb24tZmFjZWJvb2tcIj48L3VzZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiaHR0cHM6Ly90d2l0dGVyLmNvbS9pbnRlbnQvdHdlZXQ/dGV4dD10ZXh0LXBhcnRhZ2UmYW1wO3VybD1cIiBvbmNsaWNrPVwiamF2YXNjcmlwdDp3aW5kb3cub3Blbih0aGlzLmhyZWYsJycsICdtZW51YmFyPW5vLHRvb2xiYXI9bm8scmVzaXphYmxlPXllcyxzY3JvbGxiYXJzPXllcyxoZWlnaHQ9NjAwLHdpZHRoPTYwMCcpO3JldHVybiBmYWxzZTtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyBjbGFzcz1cInR3aXR0ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj1cIiNpY29uLXR3aXR0ZXJcIj48L3VzZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiaHR0cHM6Ly9wbHVzLmdvb2dsZS5jb20vc2hhcmU/dXJsPWh0dHBzOi8vcGx1cy5nb29nbGUuY29tXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi1nb29nbGUtcGx1c1wiPjwvdXNlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJodHRwczovL2FwaS53aGF0c2FwcC5jb20vc2VuZD90ZXh0PXRleHQtd2hhdHNhcHAmYW1wO3VybD1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2Zz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj1cIiNpY29uLXdoYXRzYXBwXCI+PC91c2U+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+PC9kaXY+XHJcbiAgICAgICAgICBgXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGNvbC1sZy00IG1iLTJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgY2FyZC0tYWN0dWFsaXRlcyBjYXJkLS1hY3R1YWxpdGVzLWFubm9uY2VcIj5cclxuICAgICAgICAgICAgICA8aW1nIHNyYz1cImFzc2V0cy9pbWcvdHdpdHRlci5wbmdcIiBhbHQ9XCJcIj5cclxuICAgICAgICAgICAgICA8cCBjbGFzcz1cImNhcmRfZGVzY1wiPlxyXG4gICAgICAgICAgICAgICAgJHtwb3N0LmNvbnRlbnR9XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxhIGNsYXNzPVwiY2FyZF9saW5rXCIgaHJlZj1cImh0dHA6Ly93d3cudHdpdHRlci5jb20vQlBfTWFyb2NcIiB0YXJnZXQ9XCJfYmxhbmtcIj5cclxuICAgICAgICAgICAgICAgIFR3aXR0ZXIuY29tL0JQX01hcm9jXHJcbiAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICBgXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuam9pbignJylcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGRhdGVGb3JtYXQgKGRhdGUpIHtcclxuICAgIHJldHVybiBgMS8ke2RhdGUubW9udGgoKSArIDF9LyR7ZGF0ZS55ZWFyKCl9YFxyXG4gIH1cclxuXHJcbiAgbGV0IHN0YXJ0RmlsdGVyID0gbmV3IERhdGVGaWx0ZXIoc3RhcnREYXRlLCBmYWxzZSwgZnVuY3Rpb24gKHN0YXJ0KSB7XHJcbiAgICBzdGF0ZS5kYXRlRmlsdGVyLmZyb20gPSBkYXRlRm9ybWF0KHN0YXJ0KVxyXG4gICAgYXBwbHlGaWx0ZXJzKClcclxuICB9KVxyXG4gIHN0YXJ0RmlsdGVyLmluaXQoKVxyXG5cclxuICBsZXQgZW5kRmlsdGVyID0gbmV3IERhdGVGaWx0ZXIoZW5kRGF0ZSwgdHJ1ZSwgZnVuY3Rpb24gKGVuZCkge1xyXG4gICAgc3RhdGUuZGF0ZUZpbHRlci50byA9IGRhdGVGb3JtYXQoZW5kKVxyXG4gICAgYXBwbHlGaWx0ZXJzKClcclxuICB9KVxyXG4gIGVuZEZpbHRlci5pbml0KClcclxuXHJcbiAgJCgnI2FjdHVhbGl0ZS1zZWxlY3QtZmlsdGVyJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBzZWxlY3RlZCA9ICQoJyNhY3R1YWxpdGUtc2VsZWN0LWZpbHRlcicpLm5leHQoKS5maW5kKCcuY3VycmVudCcpLnRleHQoKVxyXG4gICAgc2VsZWN0ZWQgPSBzZWxlY3RlZC50b0xvd2VyQ2FzZSgpXHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coc2VsZWN0ZWQpXHJcblxyXG4gICAgJCgnI2RhdGUtZmlsdGVyJykuYWRkQ2xhc3MoJ2QtZmxleCcpXHJcbiAgICAkKCcjZGF0ZS1maWx0ZXInKS5zaG93KClcclxuXHJcbiAgICBpZiAoc2VsZWN0ZWQgIT09ICdww6lyaW9kZScpIHtcclxuICAgICAgJCgnI2RhdGUtZmlsdGVyJykucmVtb3ZlQ2xhc3MoJ2QtZmxleCcpXHJcbiAgICAgICQoJyNkYXRlLWZpbHRlcicpLmhpZGUoKVxyXG4gICAgICBzdGF0ZS5vcmRlciA9ICdkZXNjJ1xyXG4gICAgICBzdGF0ZS5kYXRlRmlsdGVyLmZyb20gPSAnJ1xyXG4gICAgICBzdGF0ZS5kYXRlRmlsdGVyLnRvID0gJydcclxuICAgICAgc3RhcnRGaWx0ZXIuY2xlYXIoKVxyXG4gICAgICBlbmRGaWx0ZXIuY2xlYXIoKVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChzZWxlY3RlZCA9PT0gJ3BsdXMgYW5jaWVucycpIHtcclxuICAgICAgc3RhdGUub3JkZXIgPSAnYXNjJ1xyXG4gICAgICBhcHBseUZpbHRlcnMoKVxyXG4gICAgfSBlbHNlIGlmIChzZWxlY3RlZCA9PT0gJ3BsdXMgcsOpY2VudHMnKSB7XHJcbiAgICAgIGFwcGx5RmlsdGVycygpXHJcbiAgICAgIHN0YXRlLm9yZGVyID0gJ2Rlc2MnXHJcbiAgICB9XHJcbiAgfSlcclxuXHJcbiAgYWxsRmlsdGVyQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgc3RhdGUuZmlsdGVycyA9IFtdXHJcbiAgICB0YWdGaWx0ZXJzLmZvckVhY2godGFnID0+IHtcclxuICAgICAgdGFnLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICB9KVxyXG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgYXBwbHlGaWx0ZXJzKClcclxuICB9KVxyXG4gIHRhZ0ZpbHRlcnMuZm9yRWFjaCh0YWcgPT4ge1xyXG4gICAgdGFnLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2hhbmdlRmlsdGVycylcclxuICB9KVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgYXBwZWxPZmZyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYXBwZWwtb2ZmcmVzJylcclxuXHJcbiAgaWYgKCFhcHBlbE9mZnJlcykgcmV0dXJuXHJcblxyXG4gIGxldCBzdGF0ZSA9IHtcclxuICAgIG9yZ2FuaXNtZTogJycsXHJcbiAgICBuYXR1cmU6ICcnLFxyXG4gICAgZGF0YTogW1xyXG4gICAgICB7XHJcbiAgICAgICAgb3JnYW5pc21lOiAnb3JnYW5pc21lMScsXHJcbiAgICAgICAgbmF0dXJlOiAnbmF0dXJlMScsXHJcbiAgICAgICAgZGF0ZXM6IHtcclxuICAgICAgICAgIHB1YjogJzEyLzEyLzIwMjAnLFxyXG4gICAgICAgICAgZGVwbzogJzEyLzEyLzIwMjInXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0aXRsZTogJ0xhIEJhbnF1ZSBDZW50cmFsZSBQb3B1bGFpcmUgbGFuY2UgdW4gYXBwZWwgZOKAmW9mZnJlcyBvdXZlcnQgcmVsYXRpZiBhdSDCqyBNQVJDSEUgQ0FEUkUgQUNRVUlTSVRJT04gREUgU1RZTE9TIFBST01PVElPTk5FTFMgwrsuJyxcclxuICAgICAgICBudW1lcm86ICdOwrAgOiBBTyAwMTQtMTggLSBQcm9yb2dhdGlvbidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG9yZ2FuaXNtZTogJ29yZ2FuaXNtZTEnLFxyXG4gICAgICAgIG5hdHVyZTogJ25hdHVyZTEnLFxyXG4gICAgICAgIGRhdGVzOiB7XHJcbiAgICAgICAgICBwdWI6ICcxMi8xMi8yMDIwJyxcclxuICAgICAgICAgIGRlcG86ICcxMi8xMi8yMDIyJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGl0bGU6ICdMYSBCYW5xdWUgQ2VudHJhbGUgUG9wdWxhaXJlIGxhbmNlIHVuIGFwcGVsIGTigJlvZmZyZXMgb3V2ZXJ0IHJlbGF0aWYgYXUgwqsgTUFSQ0hFIENBRFJFIEFDUVVJU0lUSU9OIERFIFNUWUxPUyBQUk9NT1RJT05ORUxTIMK7LicsXHJcbiAgICAgICAgbnVtZXJvOiAnTsKwIDogQU8gMDE0LTE4IC0gUHJvcm9nYXRpb24nXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBvcmdhbmlzbWU6ICdvcmdhbmlzbWUyJyxcclxuICAgICAgICBuYXR1cmU6ICduYXR1cmUxJyxcclxuICAgICAgICBkYXRlczoge1xyXG4gICAgICAgICAgcHViOiAnMTIvMTIvMjAyMCcsXHJcbiAgICAgICAgICBkZXBvOiAnMTIvMTIvMjAyMidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRpdGxlOiAnTGEgQmFucXVlIENlbnRyYWxlIFBvcHVsYWlyZSBsYW5jZSB1biBhcHBlbCBk4oCZb2ZmcmVzIG91dmVydCByZWxhdGlmIGF1IMKrIE1BUkNIRSBDQURSRSBBQ1FVSVNJVElPTiBERSBTVFlMT1MgUFJPTU9USU9OTkVMUyDCuy4nLFxyXG4gICAgICAgIG51bWVybzogJ07CsCA6IEFPIDAxNC0xOCAtIFByb3JvZ2F0aW9uJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgb3JnYW5pc21lOiAnb3JnYW5pc21lMScsXHJcbiAgICAgICAgbmF0dXJlOiAnbmF0dXJlMScsXHJcbiAgICAgICAgZGF0ZXM6IHtcclxuICAgICAgICAgIHB1YjogJzEyLzEyLzIwMjAnLFxyXG4gICAgICAgICAgZGVwbzogJzEyLzEyLzIwMjInXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0aXRsZTogJ0xhIEJhbnF1ZSBDZW50cmFsZSBQb3B1bGFpcmUgbGFuY2UgdW4gYXBwZWwgZOKAmW9mZnJlcyBvdXZlcnQgcmVsYXRpZiBhdSDCqyBNQVJDSEUgQ0FEUkUgQUNRVUlTSVRJT04gREUgU1RZTE9TIFBST01PVElPTk5FTFMgwrsuJyxcclxuICAgICAgICBudW1lcm86ICdOwrAgOiBBTyAwMTQtMTggLSBQcm9yb2dhdGlvbidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG9yZ2FuaXNtZTogJ29yZ2FuaXNtZTEnLFxyXG4gICAgICAgIG5hdHVyZTogJ25hdHVyZTEnLFxyXG4gICAgICAgIGRhdGVzOiB7XHJcbiAgICAgICAgICBwdWI6ICcxMi8xMi8yMDIwJyxcclxuICAgICAgICAgIGRlcG86ICcxMi8xMi8yMDIyJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGl0bGU6ICdMYSBCYW5xdWUgQ2VudHJhbGUgUG9wdWxhaXJlIGxhbmNlIHVuIGFwcGVsIGTigJlvZmZyZXMgb3V2ZXJ0IHJlbGF0aWYgYXUgwqsgTUFSQ0hFIENBRFJFIEFDUVVJU0lUSU9OIERFIFNUWUxPUyBQUk9NT1RJT05ORUxTIMK7LicsXHJcbiAgICAgICAgbnVtZXJvOiAnTsKwIDogQU8gMDE0LTE4IC0gUHJvcm9nYXRpb24nXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBvcmdhbmlzbWU6ICdvcmdhbmlzbWUyJyxcclxuICAgICAgICBuYXR1cmU6ICduYXR1cmUxJyxcclxuICAgICAgICBkYXRlczoge1xyXG4gICAgICAgICAgcHViOiAnMTIvMTIvMjAyMCcsXHJcbiAgICAgICAgICBkZXBvOiAnMTIvMTIvMjAyMidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRpdGxlOiAnTGEgQmFucXVlIENlbnRyYWxlIFBvcHVsYWlyZSBsYW5jZSB1biBhcHBlbCBk4oCZb2ZmcmVzIG91dmVydCByZWxhdGlmIGF1IMKrIE1BUkNIRSBDQURSRSBBQ1FVSVNJVElPTiBERSBTVFlMT1MgUFJPTU9USU9OTkVMUyDCuy4nLFxyXG4gICAgICAgIG51bWVybzogJ07CsCA6IEFPIDAxNC0xOCAtIFByb3JvZ2F0aW9uJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgb3JnYW5pc21lOiAnb3JnYW5pc21lMicsXHJcbiAgICAgICAgbmF0dXJlOiAnbmF0dXJlMScsXHJcbiAgICAgICAgZGF0ZXM6IHtcclxuICAgICAgICAgIHB1YjogJzEyLzEyLzIwMjAnLFxyXG4gICAgICAgICAgZGVwbzogJzEyLzEyLzIwMjInXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0aXRsZTogJ0xhIEJhbnF1ZSBDZW50cmFsZSBQb3B1bGFpcmUgbGFuY2UgdW4gYXBwZWwgZOKAmW9mZnJlcyBvdXZlcnQgcmVsYXRpZiBhdSDCqyBNQVJDSEUgQ0FEUkUgQUNRVUlTSVRJT04gREUgU1RZTE9TIFBST01PVElPTk5FTFMgwrsuJyxcclxuICAgICAgICBudW1lcm86ICdOwrAgOiBBTyAwMTQtMTggLSBQcm9yb2dhdGlvbidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG9yZ2FuaXNtZTogJ29yZ2FuaXNtZTMnLFxyXG4gICAgICAgIG5hdHVyZTogJ25hdHVyZTInLFxyXG4gICAgICAgIGRhdGVzOiB7XHJcbiAgICAgICAgICBwdWI6ICcxMi8xMi8yMDIwJyxcclxuICAgICAgICAgIGRlcG86ICcxMi8xMi8yMDIyJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGl0bGU6ICdMYSBCYW5xdWUgQ2VudHJhbGUgUG9wdWxhaXJlIGxhbmNlIHVuIGFwcGVsIGTigJlvZmZyZXMgb3V2ZXJ0IHJlbGF0aWYgYXUgwqsgTUFSQ0hFIENBRFJFIEFDUVVJU0lUSU9OIERFIFNUWUxPUyBQUk9NT1RJT05ORUxTIMK7LicsXHJcbiAgICAgICAgbnVtZXJvOiAnTsKwIDogQU8gMDE0LTE4IC0gUHJvcm9nYXRpb24nXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBvcmdhbmlzbWU6ICdvcmdhbmlzbWU0JyxcclxuICAgICAgICBuYXR1cmU6ICduYXR1cmUxJyxcclxuICAgICAgICBkYXRlczoge1xyXG4gICAgICAgICAgcHViOiAnMTIvMTIvMjAyMCcsXHJcbiAgICAgICAgICBkZXBvOiAnMTIvMTIvMjAyMidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRpdGxlOiAnTGEgQmFucXVlIENlbnRyYWxlIFBvcHVsYWlyZSBsYW5jZSB1biBhcHBlbCBk4oCZb2ZmcmVzIG91dmVydCByZWxhdGlmIGF1IMKrIE1BUkNIRSBDQURSRSBBQ1FVSVNJVElPTiBERSBTVFlMT1MgUFJPTU9USU9OTkVMUyDCuy4nLFxyXG4gICAgICAgIG51bWVybzogJ07CsCA6IEFPIDAxNC0xOCAtIFByb3JvZ2F0aW9uJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgb3JnYW5pc21lOiAnb3JnYW5pc21lNCcsXHJcbiAgICAgICAgbmF0dXJlOiAnbmF0dXJlMScsXHJcbiAgICAgICAgZGF0ZXM6IHtcclxuICAgICAgICAgIHB1YjogJzEyLzEyLzIwMjAnLFxyXG4gICAgICAgICAgZGVwbzogJzEyLzEyLzIwMjInXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0aXRsZTogJ0xhIEJhbnF1ZSBDZW50cmFsZSBQb3B1bGFpcmUgbGFuY2UgdW4gYXBwZWwgZOKAmW9mZnJlcyBvdXZlcnQgcmVsYXRpZiBhdSDCqyBNQVJDSEUgQ0FEUkUgQUNRVUlTSVRJT04gREUgU1RZTE9TIFBST01PVElPTk5FTFMgwrsuJyxcclxuICAgICAgICBudW1lcm86ICdOwrAgOiBBTyAwMTQtMTggLSBQcm9yb2dhdGlvbidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG9yZ2FuaXNtZTogJ29yZ2FuaXNtZTUnLFxyXG4gICAgICAgIG5hdHVyZTogJ25hdHVyZTEnLFxyXG4gICAgICAgIGRhdGVzOiB7XHJcbiAgICAgICAgICBwdWI6ICcxMi8xMi8yMDIwJyxcclxuICAgICAgICAgIGRlcG86ICcxMi8xMi8yMDIyJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGl0bGU6ICdMYSBCYW5xdWUgQ2VudHJhbGUgUG9wdWxhaXJlIGxhbmNlIHVuIGFwcGVsIGTigJlvZmZyZXMgb3V2ZXJ0IHJlbGF0aWYgYXUgwqsgTUFSQ0hFIENBRFJFIEFDUVVJU0lUSU9OIERFIFNUWUxPUyBQUk9NT1RJT05ORUxTIMK7LicsXHJcbiAgICAgICAgbnVtZXJvOiAnTsKwIDogQU8gMDE0LTE4IC0gUHJvcm9nYXRpb24nXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBvcmdhbmlzbWU6ICdvcmdhbmlzbWUzJyxcclxuICAgICAgICBuYXR1cmU6ICduYXR1cmUxJyxcclxuICAgICAgICBkYXRlczoge1xyXG4gICAgICAgICAgcHViOiAnMTIvMTIvMjAyMCcsXHJcbiAgICAgICAgICBkZXBvOiAnMTIvMTIvMjAyMidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRpdGxlOiAnTGEgQmFucXVlIENlbnRyYWxlIFBvcHVsYWlyZSBsYW5jZSB1biBhcHBlbCBk4oCZb2ZmcmVzIG91dmVydCByZWxhdGlmIGF1IMKrIE1BUkNIRSBDQURSRSBBQ1FVSVNJVElPTiBERSBTVFlMT1MgUFJPTU9USU9OTkVMUyDCuy4nLFxyXG4gICAgICAgIG51bWVybzogJ07CsCA6IEFPIDAxNC0xOCAtIFByb3JvZ2F0aW9uJ1xyXG4gICAgICB9XHJcbiAgICBdXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhcHBseUZpbHRlciAoKSB7XHJcbiAgICBsZXQgZGF0YSA9IHN0YXRlLmRhdGEuZmlsdGVyKG9mZmVyID0+IHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICBzdGF0ZS5vcmdhbmlzbWUgPT09IG9mZmVyLm9yZ2FuaXNtZSAmJiBzdGF0ZS5uYXR1cmUgPT09IG9mZmVyLm5hdHVyZVxyXG4gICAgICApXHJcbiAgICB9KVxyXG5cclxuICAgIHJlbmRlcihkYXRhKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVuZGVyIChkYXRhKSB7XHJcbiAgICBhcHBlbE9mZnJlcy5pbm5lckhUTUwgPSBkYXRhXHJcbiAgICAgIC5tYXAob2ZmZXIgPT4ge1xyXG4gICAgICAgIHJldHVybiBgPGEgY2xhc3M9XCJuZXdzXCIgaHJlZj1cIi9nYnAtZnJvbnQvbmV3cy1kZXRhaWwuaHRtbFwiPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibmV3c19ib3JkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJuZXdzX2NvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibmV3c19kYXRlIGNsZWFyZml4XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInB1YmxpY2F0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIERhdGUgZGUgcHVibGljYXRpb24gIDogJHtvZmZlci5kYXRlcy5wdWJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cImxpbWl0ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRlIGxpbWl0ZSBkZSBkw6lwb3QgZGUgZG9zc2llciA6ICR7b2ZmZXIuZGF0ZXMuZGVwb31cclxuICAgICAgICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8aDIgY2xhc3M9XCJuZXdzX3RpdGxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgJHtvZmZlci50aXRsZX1cclxuICAgICAgICAgICAgICAgICAgICA8L2gyPlxyXG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwibmV3c190eHRcIj5cclxuICAgICAgICAgICAgICAgICAgICAke29mZmVyLm51bWVyb31cclxuICAgICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9hPmBcclxuICAgICAgfSlcclxuICAgICAgLmpvaW4oJycpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpbml0ICgpIHtcclxuICAgIHN0YXRlLm9yZ2FuaXNtZSA9ICQoJyNhcHBlbC1vZmZyZXMtc2VsZWN0X29yZ2FuaXNtZScpXHJcbiAgICAgIC5uZXh0KClcclxuICAgICAgLmZpbmQoJy5jdXJyZW50JylcclxuICAgICAgLnRleHQoKVxyXG4gICAgICAudG9Mb3dlckNhc2UoKVxyXG4gICAgc3RhdGUubmF0dXJlID0gJCgnI2FwcGVsLW9mZnJlcy1zZWxlY3RfbmF0dXJlJylcclxuICAgICAgLm5leHQoKVxyXG4gICAgICAuZmluZCgnLmN1cnJlbnQnKVxyXG4gICAgICAudGV4dCgpXHJcbiAgICAgIC50b0xvd2VyQ2FzZSgpXHJcbiAgICBhcHBseUZpbHRlcigpXHJcbiAgfVxyXG4gIGluaXQoKVxyXG5cclxuICAkKCcjYXBwZWwtb2ZmcmVzLXNlbGVjdF9vcmdhbmlzbWUnKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgc3RhdGUub3JnYW5pc21lID0gJCgnI2FwcGVsLW9mZnJlcy1zZWxlY3Rfb3JnYW5pc21lJylcclxuICAgICAgLm5leHQoKVxyXG4gICAgICAuZmluZCgnLmN1cnJlbnQnKVxyXG4gICAgICAudGV4dCgpXHJcbiAgICAgIC50b0xvd2VyQ2FzZSgpXHJcbiAgICBhcHBseUZpbHRlcigpXHJcbiAgfSlcclxuICAkKCcjYXBwZWwtb2ZmcmVzLXNlbGVjdF9uYXR1cmUnKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgc3RhdGUubmF0dXJlID0gJCgnI2FwcGVsLW9mZnJlcy1zZWxlY3RfbmF0dXJlJylcclxuICAgICAgLm5leHQoKVxyXG4gICAgICAuZmluZCgnLmN1cnJlbnQnKVxyXG4gICAgICAudGV4dCgpXHJcbiAgICAgIC50b0xvd2VyQ2FzZSgpXHJcbiAgICBhcHBseUZpbHRlcigpXHJcbiAgfSlcclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcclxuXHRpZiAoJCgnLmFydGljbGUtc2xpZGVyJykubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgIHZhciBydGwgPSAkKCdodG1sJykuYXR0cignZGlyJykgPT0gJ3J0bCc7XHJcblxyXG5cdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gOTkxKSB7XHJcblx0XHRcdGFydGljbGVTbGlkZXIoMCwgcnRsKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGFydGljbGVTbGlkZXIoMzIsIHJ0bCk7XHJcblx0XHR9XHJcblxyXG5cdFx0JCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDk5MSkge1xyXG5cdFx0XHRcdGFydGljbGVTbGlkZXIoMCwgcnRsKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRhcnRpY2xlU2xpZGVyKDMyLCBydGwpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBhcnRpY2xlU2xpZGVyKHN0YWdlUGFkZGluZywgcnRsKSB7XHJcbiAgICAgICAgJCgnLmFydGljbGUtc2xpZGVyLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgc3RhZ2VQYWRkaW5nOiBzdGFnZVBhZGRpbmcsXHJcbiAgICAgICAgICAgIG1hcmdpbjogMTAsXHJcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgIG5hdjogdHJ1ZSxcclxuICAgICAgICAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICAgICAgIHJ0bDogcnRsLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDFcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA5OTI6IHtcclxuICAgICAgICAgICAgICAgIFx0aXRlbXM6IDNcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoJCgnLmJlc29pbi1haWRlJykubGVuZ3RoKSB7XHJcblxyXG5cdFx0JCgnLmJlc29pbi1haWRlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHQkKCcucXVlc3Rpb25zJykudG9nZ2xlQ2xhc3MoJ2Qtbm9uZScpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG5cclxuXHRpZiAoJCgnLmNhcmQtYWN0dWFsaXRlcy1zbGlkZXInKS5sZW5ndGgpIHtcclxuXHJcbiAgICAgICAgdmFyIHJ0bCA9ICQoJ2h0bWwnKS5hdHRyKCdkaXInKSA9PSAncnRsJztcclxuXHJcblx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPD0gOTkxKSB7XHJcbiAgICAgICAgICAgIFxyXG5cdFx0XHRjYXJkQWN0dVNsaWRlcig0OCwgcnRsKTtcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgJCgnLmNhcmQtYWN0dWFsaXRlcy1zbGlkZXInKS5vd2xDYXJvdXNlbCgnZGVzdHJveScpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG5cdFx0JCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA8PSA5OTEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAkKCcuY2FyZC1hY3R1YWxpdGVzLXNsaWRlcicpLm93bENhcm91c2VsKCdkZXN0cm95Jyk7XHJcblx0XHRcdFx0Y2FyZEFjdHVTbGlkZXIoNDgsIHJ0bCk7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICQoJy5jYXJkLWFjdHVhbGl0ZXMtc2xpZGVyJykub3dsQ2Fyb3VzZWwoJ2Rlc3Ryb3knKTtcclxuICAgICAgICAgICAgfVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjYXJkQWN0dVNsaWRlcihzdGFnZVBhZGRpbmcsIHJ0bCkge1xyXG4gICAgICAgICQoJy5jYXJkLWFjdHVhbGl0ZXMtc2xpZGVyLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgc3RhZ2VQYWRkaW5nOiBzdGFnZVBhZGRpbmcsXHJcbiAgICAgICAgICAgIG1hcmdpbjogMTYsXHJcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgIG5hdjogZmFsc2UsXHJcbiAgICAgICAgICAgIHJ0bDogcnRsLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0aWYgKCQoJy5jYXJkLWhpc3RvaXJlLXNsaWRlcicpLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgdmFyIHJ0bCA9ICQoJ2h0bWwnKS5hdHRyKCdkaXInKSA9PSAncnRsJztcclxuXHJcblx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPD0gNzY4KSB7XHJcblxyXG5cdFx0XHRjYXJkSGlzdG9pcmVTbGlkZXIoNDgsIHJ0bCk7XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCgnLmNhcmQtaGlzdG9pcmUtc2xpZGVyJykub3dsQ2Fyb3VzZWwoJ2Rlc3Ryb3knKTtcclxuXHRcdH1cclxuXHJcblx0XHQkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKCQod2luZG93KS53aWR0aCgpIDw9IDc2OCkge1xyXG5cclxuXHRcdFx0XHRjYXJkSGlzdG9pcmVTbGlkZXIoNDgsIHJ0bCk7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCQoJy5jYXJkLWhpc3RvaXJlLXNsaWRlcicpLm93bENhcm91c2VsKCdkZXN0cm95Jyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY2FyZEhpc3RvaXJlU2xpZGVyKHN0YWdlUGFkZGluZywgcnRsKSB7XHJcbiAgICAgICAgJCgnLmNhcmQtaGlzdG9pcmUtc2xpZGVyLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgc3RhZ2VQYWRkaW5nOiBzdGFnZVBhZGRpbmcsXHJcbiAgICAgICAgICAgIG1hcmdpbjogNSxcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgbmF2OiBmYWxzZSxcclxuICAgICAgICAgICAgcnRsOiBydGwsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHtcclxuICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogMVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG5cdGlmICgkKCcuY2FyZC0tcmFwcG9ydC1yaWdodCcpLmxlbmd0aCkge1xyXG5cclxuXHRcdHZhciBydGwgPSAkKCdodG1sJykuYXR0cignZGlyJykgPT0gJ3J0bCc7XHJcblxyXG5cdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblx0XHRcdHJhcHBvcnRTbGlkZXIoMCwgcnRsKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJhcHBvcnRTbGlkZXIoMCwgcnRsKTtcclxuXHRcdH1cclxuXHJcblx0XHQkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblx0XHRcdFx0cmFwcG9ydFNsaWRlcigwLCBydGwpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJhcHBvcnRTbGlkZXIoMCwgcnRsKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcmFwcG9ydFNsaWRlcihzdGFnZVBhZGRpbmcsIHJ0bCkge1xyXG4gICAgICAgIHZhciBvd2wgPSAkKCcuY2FyZC0tcmFwcG9ydC1yaWdodC5vd2wtY2Fyb3VzZWwnKS5vd2xDYXJvdXNlbCh7XHJcbiAgICAgICAgICAgIHN0YWdlUGFkZGluZzogc3RhZ2VQYWRkaW5nLFxyXG4gICAgICAgICAgICBtYXJnaW46IDAsXHJcbiAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICBuYXY6IGZhbHNlLFxyXG4gICAgICAgICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgICAgICAgcnRsOiBydGwsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHtcclxuICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogMVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcuY2FyZC0tcmFwcG9ydC1yaWdodCAud3JhcHBlcl9idG4gLm5leHQnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdCAgICBvd2wudHJpZ2dlcignbmV4dC5vd2wuY2Fyb3VzZWwnKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIEdvIHRvIHRoZSBwcmV2aW91cyBpdGVtXHJcblx0XHQkKCcuY2FyZC0tcmFwcG9ydC1yaWdodCAud3JhcHBlcl9idG4gLnByZXYnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdCAgICAvLyBXaXRoIG9wdGlvbmFsIHNwZWVkIHBhcmFtZXRlclxyXG5cdFx0ICAgIC8vIFBhcmFtZXRlcnMgaGFzIHRvIGJlIGluIHNxdWFyZSBicmFja2V0ICdbXSdcclxuXHRcdCAgICBvd2wudHJpZ2dlcigncHJldi5vd2wuY2Fyb3VzZWwnKTtcclxuXHRcdH0pO1xyXG5cclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0aWYgKCQoJy5jYXJkLXNsaWRlci13cmFwcGVyJykubGVuZ3RoKSB7XHJcblxyXG5cdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblx0XHRcdGNhcmRTbGlkZXJQYWdlKDE2KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNhcmRTbGlkZXJQYWdlKDApO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuXHRcdFx0XHRjYXJkU2xpZGVyUGFnZSgxNik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y2FyZFNsaWRlclBhZ2UoMCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY2FyZFNsaWRlclBhZ2Uoc3RhZ2VQYWRkaW5nKSB7XHJcbiAgICAgICAgJCgnLmNhcmQtc2xpZGVyLXdyYXBwZXIub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBzdGFnZVBhZGRpbmc6IHN0YWdlUGFkZGluZyxcclxuICAgICAgICAgICAgbWFyZ2luOiAxNixcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgbmF2OiB0cnVlLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDFcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA3Njg6IHtcclxuICAgICAgICAgICAgICAgIFx0aXRlbXM6IDJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA5OTI6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogNFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IERhdGVGaWx0ZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9kYXRlLWZpbHRlci9pbmRleC5qcydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgdGFnRmlsdGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNjb21tdW5pcXVlcy1maWx0ZXJzIGEnKVxyXG4gIGxldCBjb21tdW5pcXVlc0hvbGRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb21tdW5pcXVlcy1ob2xkZXInKVxyXG4gIGxldCBzdGFydERhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3RhcnQnKVxyXG4gIGxldCBlbmREYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVuZCcpXHJcbiAgbGV0IGFsbEZpbHRlckJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb21tdW5pcXVlcy1maWx0ZXItYWxsJylcclxuXHJcbiAgaWYgKHRhZ0ZpbHRlcnMubGVuZ3RoIDw9IDAgfHwgIWNvbW11bmlxdWVzSG9sZGVyKSByZXR1cm5cclxuXHJcbiAgbGV0IHN0YXRlID0ge1xyXG4gICAgZmlsdGVyczogW10sXHJcbiAgICBkYXRlRmlsdGVyOiB7XHJcbiAgICAgIGZyb206ICcnLFxyXG4gICAgICB0bzogJydcclxuICAgIH0sXHJcbiAgICBvcmRlcjogJ2Rlc2MnLFxyXG4gICAgbWF4OiAzLFxyXG4gICAgZGF0YTogW1xyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRScsICdFTlRSRVBSRU5BUklBVCddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8wNy8yMDE3JyxcclxuICAgICAgICB0aXRsZTogJ0xlIEdyb3VwZSBCQ1AgbGFuY2UgbGEgcHIgZW1pw6hyZSBiYW5xdWUgbWFyb2NhaW5lIGTDqWRpw6llIMOgIGzigJlhY3Rpdml0w6kg4oCcdGl0cmVz4oCdJyxcclxuICAgICAgICBzaXplOiA0NTAsXHJcbiAgICAgICAgdHlwZTogJ3BkZidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRhZ3M6IFsnUlNFJ10sXHJcbiAgICAgICAgZGF0ZTogJzI5LzA3LzIwMTcnLFxyXG4gICAgICAgIHRpdGxlOiAnTGUgR3JvdXBlIEJDUCBsYW5jZSBsYSBwciBlbWnDqHJlIGJhbnF1ZSBtYXJvY2FpbmUgZMOpZGnDqWUgw6AgbOKAmWFjdGl2aXTDqSDigJx0aXRyZXPigJ0nLFxyXG4gICAgICAgIHNpemU6IDQ1MCxcclxuICAgICAgICB0eXBlOiAncGRmJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRU5UUkVQUkVOQVJJQVQnXSxcclxuICAgICAgICBkYXRlOiAnMjIvMDcvMjAxNycsXHJcbiAgICAgICAgdGl0bGU6ICdMZSBHcm91cGUgQkNQIGxhbmNlIGxhIHByZW1pw6hyZSBiYW5xdWUgbWFyb2NhaW5lIGTDqWRpw6llIMOgIGzigJlhY3Rpdml0w6kg4oCcdGl0cmVz4oCdJyxcclxuICAgICAgICBzaXplOiA0NTAsXHJcbiAgICAgICAgdHlwZTogJ3BkZidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0RFVkVMT1BQRU1FTlQgRFVSQUJMRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMy8wNy8yMDE3JyxcclxuICAgICAgICB0aXRsZTogJ0xlIEdyb3VwZSBCQ1AgbGFuY2UgbGEgcHJlbWnDqHJlIGJhbnF1ZSBtYXJvY2FpbmUgZMOpZGnDqWUgw6AgbOKAmWFjdGl2aXTDqSDigJx0aXRyZXPigJ0nLFxyXG4gICAgICAgIHNpemU6IDQ1MCxcclxuICAgICAgICB0eXBlOiAncGRmJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnXSxcclxuICAgICAgICBkYXRlOiAnMjEvMDcvMjAxNycsXHJcbiAgICAgICAgdGl0bGU6ICdMZSBHcm91cGUgQkNQIGxhbmNlIGxhIHByZW1pw6hyZSBiYW5xdWUgbWFyb2NhaW5lIGTDqWRpw6llIMOgIGzigJlhY3Rpdml0w6kg4oCcdGl0cmVz4oCdJyxcclxuICAgICAgICBzaXplOiA0NTAsXHJcbiAgICAgICAgdHlwZTogJ3BkZidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0ZJTkFOQ0UnXSxcclxuICAgICAgICBkYXRlOiAnMjQvMDcvMjAxNycsXHJcbiAgICAgICAgdGl0bGU6ICdMZSBHcm91cGUgQkNQIGxhbmNlIGxhIHByZW1pw6hyZSBiYW5xdWUgbWFyb2NhaW5lIGTDqWRpw6llIMOgIGzigJlhY3Rpdml0w6kg4oCcdGl0cmVz4oCdJyxcclxuICAgICAgICBzaXplOiA0NTAsXHJcbiAgICAgICAgdHlwZTogJ3BkZidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0ZJTkFOQ0UnXSxcclxuICAgICAgICBkYXRlOiAnMjUvMDcvMjAxNycsXHJcbiAgICAgICAgdGl0bGU6ICdMZSBHcm91cGUgQkNQIGxhbmNlIGxhIHByZW1pw6hyZSBiYW5xdWUgbWFyb2NhaW5lIGTDqWRpw6llIMOgIGzigJlhY3Rpdml0w6kg4oCcdGl0cmVz4oCdJyxcclxuICAgICAgICBzaXplOiA0NTAsXHJcbiAgICAgICAgdHlwZTogJ3BkZidcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRhZ3M6IFsnUlNFJ10sXHJcbiAgICAgICAgZGF0ZTogJzI2LzA3LzIwMTcnLFxyXG4gICAgICAgIHRpdGxlOiAnTGUgR3JvdXBlIEJDUCBsYW5jZSBsYSBwcmVtacOocmUgYmFucXVlIG1hcm9jYWluZSBkw6lkacOpZSDDoCBs4oCZYWN0aXZpdMOpIOKAnHRpdHJlc+KAnScsXHJcbiAgICAgICAgc2l6ZTogNDUwLFxyXG4gICAgICAgIHR5cGU6ICdwZGYnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJ10sXHJcbiAgICAgICAgZGF0ZTogJzIxLzA3LzIwMTcnLFxyXG4gICAgICAgIHRpdGxlOiAnTGUgR3JvdXBlIEJDUCBsYW5jZSBsYSBwcmVtacOocmUgYmFucXVlIG1hcm9jYWluZSBkw6lkacOpZSDDoCBs4oCZYWN0aXZpdMOpIOKAnHRpdHJlc+KAnScsXHJcbiAgICAgICAgc2l6ZTogNDUwLFxyXG4gICAgICAgIHR5cGU6ICdwZGYnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJ10sXHJcbiAgICAgICAgZGF0ZTogJzIxLzA4LzIwMTcnLFxyXG4gICAgICAgIHRpdGxlOiAnTGUgR3JvdXBlIEJDUCBsYW5jZSBsYSBwcmVtacOocmUgYmFucXVlIG1hcm9jYWluZSBkw6lkacOpZSDDoCBs4oCZYWN0aXZpdMOpIOKAnHRpdHJlc+KAnScsXHJcbiAgICAgICAgc2l6ZTogNDUwLFxyXG4gICAgICAgIHR5cGU6ICdwZGYnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0YWdzOiBbJ1JTRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMi8wOC8yMDE2JyxcclxuICAgICAgICB0aXRsZTogJ0xlIEdyb3VwZSBCQ1AgbGFuY2UgbGEgcHJlbWnDqHJlIGJhbnF1ZSBtYXJvY2FpbmUgZMOpZGnDqWUgw6AgbOKAmWFjdGl2aXTDqSDigJx0aXRyZXPigJ0nLFxyXG4gICAgICAgIHNpemU6IDQ1MCxcclxuICAgICAgICB0eXBlOiAncGRmJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8wOS8yMDE3JyxcclxuICAgICAgICB0aXRsZTogJ0xlIEdyb3VwZSBCQ1AgbGFuY2UgbGEgcHJlbWnDqHJlIGJhbnF1ZSBtYXJvY2FpbmUgZMOpZGnDqWUgw6AgbOKAmWFjdGl2aXTDqSDigJx0aXRyZXPigJ0nLFxyXG4gICAgICAgIHNpemU6IDQ1MCxcclxuICAgICAgICB0eXBlOiAncGRmJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8xMC8yMDE3JyxcclxuICAgICAgICB0aXRsZTogJ0xlIEdyb3VwZSBCQ1AgbGFuY2UgbGEgcHJlbWnDqHJlIGJhbnF1ZSBtYXJvY2FpbmUgZMOpZGnDqWUgw6AgbOKAmWFjdGl2aXTDqSDigJx0aXRyZXPigJ0nLFxyXG4gICAgICAgIHNpemU6IDQ1MCxcclxuICAgICAgICB0eXBlOiAncGRmJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8wNy8yMDE4JyxcclxuICAgICAgICB0aXRsZTogJ0xlIEdyb3VwZSBCQ1AgbGFuY2UgbGEgcHJlbWnDqHJlIGJhbnF1ZSBtYXJvY2FpbmUgZMOpZGnDqWUgw6AgbOKAmWFjdGl2aXTDqSDigJx0aXRyZXPigJ0nLFxyXG4gICAgICAgIHNpemU6IDQ1MCxcclxuICAgICAgICB0eXBlOiAncGRmJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8wNy8yMDE4JyxcclxuICAgICAgICB0aXRsZTogJ0xlIEdyb3VwZSBCQ1AgbGFuY2UgbGEgcHJlbWnDqHJlIGJhbnF1ZSBtYXJvY2FpbmUgZMOpZGnDqWUgw6AgbOKAmWFjdGl2aXTDqSDigJx0aXRyZXPigJ0nLFxyXG4gICAgICAgIHNpemU6IDQ1MCxcclxuICAgICAgICB0eXBlOiAncGRmJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8wNy8yMDE5JyxcclxuICAgICAgICB0aXRsZTogJ0xlIEdyb3VwZSBCQ1AgbGFuY2UgbGEgcHJlbWnDqHJlIGJhbnF1ZSBtYXJvY2FpbmUgZMOpZGnDqWUgw6AgbOKAmWFjdGl2aXTDqSDigJx0aXRyZXPigJ0nLFxyXG4gICAgICAgIHNpemU6IDQ1MCxcclxuICAgICAgICB0eXBlOiAncGRmJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8wNy8yMDIwJyxcclxuICAgICAgICB0aXRsZTogJ0xlIEdyb3VwZSBCQ1AgbGFuY2UgbGEgcHJlbWnDqHJlIGJhbnF1ZSBtYXJvY2FpbmUgZMOpZGnDqWUgw6AgbOKAmWFjdGl2aXTDqSDigJx0aXRyZXPigJ0nLFxyXG4gICAgICAgIHNpemU6IDQ1MCxcclxuICAgICAgICB0eXBlOiAncGRmJ1xyXG4gICAgICB9XHJcbiAgICBdXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjbGVhblRhZyAodGFnRmlsdGVyKSB7XHJcbiAgICB0YWdGaWx0ZXIgPSB0YWdGaWx0ZXIudG9Mb3dlckNhc2UoKVxyXG4gICAgaWYgKHRhZ0ZpbHRlclswXSA9PSAnIycpIHtcclxuICAgICAgdGFnRmlsdGVyID0gdGFnRmlsdGVyLnNsaWNlKDEpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRhZ0ZpbHRlclxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbWFrZURhdGVPYmplY3QgKGRhdGVTdHJpbmcpIHtcclxuICAgIGxldCBbZGF5LCBtb250aCwgeWVhcl0gPSBkYXRlU3RyaW5nLnNwbGl0KCcvJylcclxuXHJcbiAgICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGggLSAxLCBkYXkpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhcHBseUZpbHRlcnMgKCkge1xyXG4gICAgbGV0IGRhdGEgPSBzdGF0ZS5kYXRhXHJcbiAgICBpZiAoc3RhdGUuZmlsdGVycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGRhdGEgPSBkYXRhLmZpbHRlcihwb3N0ID0+IHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXRlLmZpbHRlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGlmIChwb3N0LnRhZ3MuaW5jbHVkZXMoc3RhdGUuZmlsdGVyc1tpXS50b1VwcGVyQ2FzZSgpKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc3RhdGUuZGF0ZUZpbHRlci5mcm9tICYmIHN0YXRlLmRhdGVGaWx0ZXIudG8pIHtcclxuICAgICAgZGF0YSA9IGRhdGEuZmlsdGVyKHBvc3QgPT4ge1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgIG1ha2VEYXRlT2JqZWN0KHBvc3QuZGF0ZSkgLSBtYWtlRGF0ZU9iamVjdChzdGF0ZS5kYXRlRmlsdGVyLmZyb20pID49XHJcbiAgICAgICAgICAgIDAgJiZcclxuICAgICAgICAgIG1ha2VEYXRlT2JqZWN0KHBvc3QuZGF0ZSkgLSBtYWtlRGF0ZU9iamVjdChzdGF0ZS5kYXRlRmlsdGVyLnRvKSA8PSAwXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZGF0YSA9IGRhdGEuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICByZXR1cm4gc3RhdGUub3JkZXIgPT0gJ2Rlc2MnXHJcbiAgICAgICAgPyBtYWtlRGF0ZU9iamVjdChiLmRhdGUpIC0gbWFrZURhdGVPYmplY3QoYS5kYXRlKVxyXG4gICAgICAgIDogbWFrZURhdGVPYmplY3QoYS5kYXRlKSAtIG1ha2VEYXRlT2JqZWN0KGIuZGF0ZSlcclxuICAgIH0pXHJcblxyXG4gICAgc2hvd1NlbGVjdGVkKGRhdGEpXHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGNoYW5nZUZpbHRlcnMgKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG5cclxuICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJylcclxuXHJcbiAgICBzdGF0ZS5maWx0ZXJzID0gW11cclxuXHJcbiAgICB0YWdGaWx0ZXJzLmZvckVhY2goZnVuY3Rpb24gKHRhZykge1xyXG4gICAgICBpZiAoJCh0YWcpLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xyXG4gICAgICAgIHN0YXRlLmZpbHRlcnMucHVzaChjbGVhblRhZyh0YWcuaW5uZXJUZXh0KSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICBpZiAoc3RhdGUuZmlsdGVycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGFsbEZpbHRlckJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYWxsRmlsdGVyQnRuLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlGaWx0ZXJzKClcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNob3dTZWxlY3RlZCAoZGF0YSkge1xyXG4gICAgbGV0IHNlbGVjdGVkRGF0YSA9IGRhdGEuc2xpY2UoMCwgc3RhdGUubWF4ICogMylcclxuXHJcbiAgICBjb25zb2xlLmxvZyhkYXRhLmxlbmd0aClcclxuICAgIGNvbnNvbGUubG9nKHNlbGVjdGVkRGF0YS5sZW5ndGgpXHJcblxyXG4gICAgaWYgKHNlbGVjdGVkRGF0YS5sZW5ndGggPj0gZGF0YS5sZW5ndGgpIHtcclxuICAgICAgJCgnI21vcmUtY29tbXVuaXF1ZXMnKS5oaWRlKClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoJyNtb3JlLWNvbW11bmlxdWVzJykuc2hvdygpXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHNlbGVjdGVkRGF0YSlcclxuICB9XHJcblxyXG4gIGFwcGx5RmlsdGVycygpXHJcblxyXG4gICQoJyNtb3JlLWNvbW11bmlxdWVzJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgc3RhdGUubWF4KytcclxuICAgIGFwcGx5RmlsdGVycygpXHJcblxyXG4gICAgdGhpcy5zY3JvbGxJbnRvVmlldyh7XHJcbiAgICAgIGJlaGF2aW9yOiAnc21vb3RoJyxcclxuICAgICAgaW5saW5lOiAnZW5kJ1xyXG4gICAgfSlcclxuICAgIGlmIChzdGF0ZS5tYXggKyAxID4gc3RhdGUuZGF0YS5sZW5ndGggLyAzKSAkKHRoaXMpLmhpZGUoKVxyXG4gIH0pXHJcblxyXG4gIGZ1bmN0aW9uIHJlbmRlciAoZGF0YSkge1xyXG4gICAgY29tbXVuaXF1ZXNIb2xkZXIuaW5uZXJIVE1MID0gZGF0YVxyXG4gICAgICAubWFwKHBvc3QgPT4ge1xyXG4gICAgICAgIHJldHVybiBgPGEgY2xhc3M9XCJuZXdzIG5ld3MtLWNvbW11bmlxdWVzXCIgaHJlZj1cIiNcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibmV3c19ib3JkZXJcIj5cclxuICAgICAgICAgIDxzdmcgY2xhc3M9XCJpY29uLXBkZlwiPlxyXG4gICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi1wZGZcIj48L3VzZT5cclxuICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgIFTDqWzDqWNoYXJnZXJcclxuICAgICAgICAgIDwvcD5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibmV3c19jb250ZW50XCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibmV3c19kYXRlIGNsZWFyZml4XCI+XHJcbiAgICAgICAgICAgIDxwIGNsYXNzPVwicHVibGljYXRpb25cIj5cclxuICAgICAgICAgICAgICAke3Bvc3QuZGF0ZX1cclxuICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8aDIgY2xhc3M9XCJuZXdzX3RpdGxlXCI+XHJcbiAgICAgICAgICAgICR7cG9zdC50aXRsZX1cclxuICAgICAgICAgIDwvaDI+XHJcbiAgICAgICAgICA8cCBjbGFzcz1cIm5ld3NfdHh0XCI+XHJcbiAgICAgICAgICAgIC4ke3Bvc3QudHlwZX0gLSAke3Bvc3Quc2l6ZX0gS0JcclxuICAgICAgICAgIDwvcD5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9hPmBcclxuICAgICAgfSlcclxuICAgICAgLmpvaW4oJycpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBkYXRlRm9ybWF0IChkYXRlKSB7XHJcbiAgICByZXR1cm4gYDEvJHtkYXRlLm1vbnRoKCkgKyAxfS8ke2RhdGUueWVhcigpfWBcclxuICB9XHJcblxyXG4gIGxldCBzdGFydEZpbHRlciA9IG5ldyBEYXRlRmlsdGVyKHN0YXJ0RGF0ZSwgZmFsc2UsIGZ1bmN0aW9uIChzdGFydCkge1xyXG4gICAgc3RhdGUuZGF0ZUZpbHRlci5mcm9tID0gZGF0ZUZvcm1hdChzdGFydClcclxuICAgIGFwcGx5RmlsdGVycygpXHJcbiAgfSlcclxuICBzdGFydEZpbHRlci5pbml0KClcclxuXHJcbiAgbGV0IGVuZEZpbHRlciA9IG5ldyBEYXRlRmlsdGVyKGVuZERhdGUsIHRydWUsIGZ1bmN0aW9uIChlbmQpIHtcclxuICAgIHN0YXRlLmRhdGVGaWx0ZXIudG8gPSBkYXRlRm9ybWF0KGVuZClcclxuICAgIGFwcGx5RmlsdGVycygpXHJcbiAgfSlcclxuICBlbmRGaWx0ZXIuaW5pdCgpXHJcblxyXG4gICQoJyNjb21tdW5pcXVlcy1zZWxlY3QtZmlsdGVyJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBzZWxlY3RlZCA9ICQoJyNjb21tdW5pcXVlcy1zZWxlY3QtZmlsdGVyJylcclxuICAgICAgLm5leHQoKVxyXG4gICAgICAuZmluZCgnLmN1cnJlbnQnKVxyXG4gICAgICAudGV4dCgpXHJcbiAgICBzZWxlY3RlZCA9IHNlbGVjdGVkLnRvTG93ZXJDYXNlKClcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZyhzZWxlY3RlZClcclxuXHJcbiAgICAkKCcjZGF0ZS1maWx0ZXInKS5hZGRDbGFzcygnZC1mbGV4JylcclxuICAgICQoJyNkYXRlLWZpbHRlcicpLnNob3coKVxyXG5cclxuICAgIGlmIChzZWxlY3RlZCAhPT0gJ3DDqXJpb2RlJykge1xyXG4gICAgICAkKCcjZGF0ZS1maWx0ZXInKS5yZW1vdmVDbGFzcygnZC1mbGV4JylcclxuICAgICAgJCgnI2RhdGUtZmlsdGVyJykuaGlkZSgpXHJcbiAgICAgIHN0YXRlLm9yZGVyID0gJ2Rlc2MnXHJcbiAgICAgIHN0YXRlLmRhdGVGaWx0ZXIuZnJvbSA9ICcnXHJcbiAgICAgIHN0YXRlLmRhdGVGaWx0ZXIudG8gPSAnJ1xyXG4gICAgICBzdGFydEZpbHRlci5jbGVhcigpXHJcbiAgICAgIGVuZEZpbHRlci5jbGVhcigpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNlbGVjdGVkID09PSAncGx1cyBhbmNpZW5zJykge1xyXG4gICAgICBzdGF0ZS5vcmRlciA9ICdhc2MnXHJcbiAgICAgIGFwcGx5RmlsdGVycygpXHJcbiAgICB9IGVsc2UgaWYgKHNlbGVjdGVkID09PSAncGx1cyByw6ljZW50cycpIHtcclxuICAgICAgYXBwbHlGaWx0ZXJzKClcclxuICAgICAgc3RhdGUub3JkZXIgPSAnZGVzYydcclxuICAgIH1cclxuICB9KVxyXG5cclxuICBhbGxGaWx0ZXJCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICBzdGF0ZS5maWx0ZXJzID0gW11cclxuICAgIHRhZ0ZpbHRlcnMuZm9yRWFjaCh0YWcgPT4ge1xyXG4gICAgICB0YWcuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgIH0pXHJcbiAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICBhcHBseUZpbHRlcnMoKVxyXG4gIH0pXHJcbiAgdGFnRmlsdGVycy5mb3JFYWNoKHRhZyA9PiB7XHJcbiAgICB0YWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjaGFuZ2VGaWx0ZXJzKVxyXG4gIH0pXHJcbn1cclxuIiwiaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAocGFyZW50LCBlbXB0eSwgY2FsbGJhY2spIHtcclxuICBsZXQgY3VycmVudERhdGUgPSBtb21lbnQoKVxyXG5cclxuICBsZXQgaW5jRGF0ZSA9IHBhcmVudC5xdWVyeVNlbGVjdG9yKCcuaW5jcmVtZW50LWRhdGUnKVxyXG4gIGxldCBkZWNEYXRlID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZWNyZW1lbnQtZGF0ZScpXHJcbiAgbGV0IG1vbnRoc0lucHV0ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3IoJy5kYXRlLWZpbHRlcl9tb250aCBpbnB1dCcpXHJcbiAgbGV0IHllYXJzSW5wdXQgPSBwYXJlbnQucXVlcnlTZWxlY3RvcignLmRhdGUtZmlsdGVyX3llYXIgaW5wdXQnKVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVEYXRlICgpIHtcclxuICAgIGxldCBjdXJyZW50TW9udGggPSBjdXJyZW50RGF0ZS5tb250aCgpICsgMVxyXG4gICAgbGV0IGN1cnJlbnRZZWFyID0gY3VycmVudERhdGUueWVhcigpLnRvU3RyaW5nKClcclxuICAgIG1vbnRoc0lucHV0LnZhbHVlID0gY3VycmVudE1vbnRoXHJcbiAgICB5ZWFyc0lucHV0LnZhbHVlID0gY3VycmVudFllYXJcclxuICAgIGNhbGxiYWNrKGN1cnJlbnREYXRlKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYmluZEV2ZW50cyAoKSB7XHJcbiAgICBpbmNEYXRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgIGN1cnJlbnREYXRlID0gbW9tZW50KGN1cnJlbnREYXRlKS5hZGQoMSwgJ21vbnRocycpXHJcbiAgICAgIHVwZGF0ZURhdGUoKVxyXG4gICAgfSlcclxuICAgIGRlY0RhdGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgY3VycmVudERhdGUgPSBtb21lbnQoY3VycmVudERhdGUpLnN1YnRyYWN0KDEsICdtb250aHMnKVxyXG4gICAgICB1cGRhdGVEYXRlKClcclxuICAgIH0pXHJcbiAgICBtb250aHNJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKHBhcnNlSW50KHRoaXMudmFsdWUpID4gMCAmJiBwYXJzZUludCh0aGlzLnZhbHVlKSA8PSAzMSkge1xyXG4gICAgICAgIGN1cnJlbnREYXRlLm1vbnRoKHRoaXMudmFsdWUgLSAxKVxyXG4gICAgICAgIHVwZGF0ZURhdGUoKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgeWVhcnNJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKHBhcnNlSW50KHRoaXMudmFsdWUpID4gMCkge1xyXG4gICAgICAgIGN1cnJlbnREYXRlLnllYXIodGhpcy52YWx1ZSlcclxuICAgICAgICB1cGRhdGVEYXRlKClcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHRoaXMuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBtb250aHNJbnB1dC52YWx1ZSA9IHllYXJzSW5wdXQudmFsdWUgPSAnJ1xyXG4gIH1cclxuXHJcbiAgdGhpcy5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgYmluZEV2ZW50cygpXHJcbiAgICBpZiAoIWVtcHR5KSB1cGRhdGVEYXRlKClcclxuICB9XHJcblxyXG4gIHRoaXMuc2VsZWN0ZWREYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIGN1cnJlbnREYXRlXHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoJCgnLmRhdGUtc2xpZGVyJykubGVuZ3RoKSB7XHJcblxyXG5cdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblx0XHRcdGRhdGVTbGlkZXJQYWdlKDApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZGF0ZVNsaWRlclBhZ2UoMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0JCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG5cdFx0XHRcdGRhdGVTbGlkZXJQYWdlKDApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGRhdGVTbGlkZXJQYWdlKDApO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBkYXRlU2xpZGVyUGFnZShzdGFnZVBhZGRpbmcpIHtcclxuICAgICAgICAkKCcuZGF0ZS1zbGlkZXIub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBzdGFnZVBhZGRpbmc6IHN0YWdlUGFkZGluZyxcclxuICAgICAgICAgICAgbWFyZ2luOiA1LFxyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBuYXY6IHRydWUsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHtcclxuICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogNFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIDc2ODoge1xyXG4gICAgICAgICAgICAgICAgXHRpdGVtczogMTBcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA5OTI6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogMTVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgdGFnRmlsdGVycyxcclxuICAgIGZpbmFuY2VzRGF0ZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZmluYW5jZS1kYXRlcycpLFxyXG4gICAgZmluYW5jZVBvc3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2ZpbmFuY2UtcG9zdHMnKVxyXG5cclxuICBpZiAoIWZpbmFuY2VQb3N0cykgcmV0dXJuXHJcblxyXG4gIGxldCBzdGF0ZSA9IHtcclxuICAgIGZpbHRlcjogJzIwMTgnLFxyXG4gICAgZGF0YTogW1xyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTcnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTgnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTYnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzE5OTQnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTInLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTgnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzE5OTYnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzE5OTEnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMDAnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTUnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTQnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTMnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTAnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTgnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTgnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTcnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTgnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMTgnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMDEnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMDMnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMDUnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzIwMDInLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzE5OTknLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGF0ZTogJzIyLzEyLzE5ODUnLFxyXG4gICAgICAgIGltZzogJ2Fzc2V0cy9pbWcvZmluYW5jZS5wbmcnLFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBmaXJzdDogJ1LDqXN1bHRhdHMnLFxyXG4gICAgICAgICAgbGFzdDogJ0ZpbmFuY2llcnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICBdXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhcHBseUZpbHRlcnMgKCkge1xyXG4gICAgbGV0IGRhdGEgPSBzdGF0ZS5kYXRhXHJcbiAgICBpZiAoc3RhdGUuZmlsdGVyLmxlbmd0aCA+IDApIHtcclxuICAgICAgZGF0YSA9IGRhdGEuZmlsdGVyKHBvc3QgPT4ge1xyXG4gICAgICAgIGlmIChzdGF0ZS5maWx0ZXIgPT09IHBvc3QuZGF0ZS5zcGxpdCgnLycpWzJdKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoZGF0YSlcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNoYW5nZUZpbHRlciAoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcblxyXG4gICAgdGFnRmlsdGVycy5mb3JFYWNoKGZ1bmN0aW9uICh0YWcpIHtcclxuICAgICAgdGFnLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICB9KVxyXG5cclxuICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuXHJcbiAgICBzdGF0ZS5maWx0ZXIgPSB0aGlzLmlubmVyVGV4dFxyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKHN0YXRlLmZpbHRlcnMpXHJcbiAgICBhcHBseUZpbHRlcnMoKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYmluZEV2ZW50cyAoKSB7XHJcbiAgICAkKCcuZmluYW5jZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGN1cnJlbnRJdGVtID0gJCh0aGlzKVxyXG4gICAgICBjb25zb2xlLmxvZygnY2xpY2tlZCcpXHJcbiAgICAgICQoJy5maW5hbmNlJykuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsKSB7XHJcbiAgICAgICAgaWYgKCQoZWwpWzBdICE9PSBjdXJyZW50SXRlbVswXSkge1xyXG4gICAgICAgICAgJChlbCkucmVtb3ZlQ2xhc3MoJ29wZW4nKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuXHJcbiAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ29wZW4nKVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJlbmRlciAoZGF0YSkge1xyXG4gICAgZmluYW5jZVBvc3RzLmlubmVySFRNTCA9IGRhdGFcclxuICAgICAgLm1hcCgocG9zdCwgaW5kZXgpID0+IHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICR7aW5kZXggPT0gMCAmJiBkYXRhLmxlbmd0aCA+IDEgPyAnPGRpdiBjbGFzcz1cImNvbC0xMiBjb2wtbGctOCBtYi1sZy0zIG1iLTJcIj48ZGl2IGNsYXNzPVwiZmluYW5jZSBmaW5hbmNlLS1sZyBjbGVhcmZpeFwiPicgOiAnPGRpdiBjbGFzcz1cImNvbC0xMiBjb2wtbGctNCBtYi1sZy0zIG1iLTJcIj48ZGl2IGNsYXNzPVwiZmluYW5jZSBjbGVhcmZpeFwiPid9XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGltZyBzcmM9XCJhc3NldHMvaW1nL2ZpbmFuY2UucG5nXCIgYWx0PVwiXCI+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmluYW5jZV90aXRsZVwiPlxyXG4gICAgICAgICAgICAgIDxoMyBjbGFzcz1cImZpcnN0XCI+XHJcbiAgICAgICAgICAgICAgICAke3Bvc3QudGl0bGUuZmlyc3R9XHJcbiAgICAgICAgICAgICAgICA8L2gzPlxyXG4gICAgICAgICAgICAgICAgPGgzIGNsYXNzPVwibGFzdFwiPlxyXG4gICAgICAgICAgICAgICAgJHtwb3N0LnRpdGxlLmxhc3R9XHJcbiAgICAgICAgICAgICAgICA8L2gzPlxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cImZpbmFuY2VfZGF0ZVwiPlxyXG4gICAgICAgICAgICAgICAgJHtwb3N0LmRhdGV9XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG5cclxuICAgICAgICAgICAgICA8cCBjbGFzcz1cImRvd25sb2FkXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjaGVja2JveFwiPlxyXG4gICAgICAgICAgICAgICAgICBDb21wdGVzIHNvY2lhdXggZGUgbGEgQmFucXVlIFxyXG4gICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCI+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2hlY2ttYXJrXCI+XHJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjaGVja2JveFwiPlxyXG4gICAgICAgICAgICAgICAgICBDZW50cmFsZSBQb3B1bGFpcmVcclxuICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2hlY2ttYXJrXCI+XHJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjaGVja2JveFwiPlxyXG4gICAgICAgICAgICAgICAgICBDb21tdW5pcXXDqSBkZSBwcmVzc2UtIFZBXHJcbiAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNoZWNrbWFya1wiPlxyXG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY2hlY2tib3hcIj5cclxuICAgICAgICAgICAgICAgICAgQ29tbXVuaXF1w6kgZGUgcHJlc3NlLSBWRlxyXG4gICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjaGVja21hcmtcIj5cclxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi0tZG93bmxvYWRcIj5cclxuICAgICAgICAgICAgICAgICAgdGVsZWNoYXJnZXJcclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIGBcclxuICAgICAgfSlcclxuICAgICAgLmpvaW4oJycpXHJcblxyXG4gICAgYmluZEV2ZW50cygpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpbml0ICgpIHtcclxuICAgIGxldCBkaXN0aW5jdFRhZ3MgPSBbXVxyXG5cclxuICAgIGZpbmFuY2VzRGF0ZXMuaW5uZXJIVE1MID0gc3RhdGUuZGF0YVxyXG4gICAgICAuZmlsdGVyKHBvc3QgPT4ge1xyXG4gICAgICAgIGlmICghZGlzdGluY3RUYWdzLmluY2x1ZGVzKHBvc3QuZGF0ZSkpIHtcclxuICAgICAgICAgIGRpc3RpbmN0VGFncy5wdXNoKHBvc3QuZGF0ZSlcclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgfSlcclxuICAgICAgLnNvcnQoKHB5LCBueSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBueS5kYXRlLnNwbGl0KCcvJylbMl0gLSBweS5kYXRlLnNwbGl0KCcvJylbMl1cclxuICAgICAgfSlcclxuICAgICAgLm1hcCgocG9zdCwgaW5kZXgpID0+IHtcclxuICAgICAgICByZXR1cm4gYDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJidG4gYnRuLS10YWcgJHtpbmRleCA9PSAwID8gJ2FjdGl2ZScgOiAnJ30gXCI+XHJcbiAgICAgICAgICAgICAgICAgICR7cG9zdC5kYXRlLnNwbGl0KCcvJylbMl19XHJcbiAgICAgICAgICAgICAgICA8L2E+YFxyXG4gICAgICB9KVxyXG4gICAgICAuam9pbignJylcclxuXHJcbiAgICB0YWdGaWx0ZXJzID0gZmluYW5jZXNEYXRlcy5xdWVyeVNlbGVjdG9yQWxsKCdhJylcclxuXHJcbiAgICB0YWdGaWx0ZXJzLmZvckVhY2godGFnID0+IHtcclxuICAgICAgdGFnLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2hhbmdlRmlsdGVyKVxyXG4gICAgfSlcclxuXHJcbiAgICBhcHBseUZpbHRlcnMoKVxyXG4gICAgYmluZEV2ZW50cygpXHJcbiAgfVxyXG5cclxuICBpbml0KClcclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcblx0aWYgKCQoJy5maW5hbmNlLmxlbmd0aCcpKSB7XHJcblxyXG5cdFx0JCgnLmZpbmFuY2UnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHR2YXIgY3VycmVudEl0ZW0gPSAkKHRoaXMpO1xyXG5cclxuXHRcdFx0JCgnLmZpbmFuY2UnKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWwpIHtcclxuXHJcblx0XHRcdFx0XHRpZiAoJChlbClbMF0gIT09IGN1cnJlbnRJdGVtWzBdKSB7XHJcblx0XHRcdFx0XHRcdCQoZWwpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JCh0aGlzKS50b2dnbGVDbGFzcygnb3BlbicpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG5cdGlmICgkKCcuZm9vdGVyX3RpdGxlJykubGVuZ3RoKSB7XHJcblxyXG5cdFx0JCgnLmZvb3Rlcl90aXRsZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKCQodGhpcykubmV4dCgndWwnKS5jc3MoJ2Rpc3BsYXknKSA9PT0gJ25vbmUnKSB7XHJcblxyXG5cdFx0XHRcdCQoJy5mb290ZXJfdGl0bGUgKyB1bC5vcGVuJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuXHRcdFx0XHQkKCcuZm9vdGVyX3RpdGxlICsgdWwub3BlbicpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblxyXG5cdFx0XHRcdCQodGhpcykubmV4dCgndWwnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuXHRcdFx0XHQkKHRoaXMpLm5leHQoJ3VsJykuYWRkQ2xhc3MoJ29wZW4nKTtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdCQodGhpcykubmV4dCgndWwnKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG5cdFx0XHRcdCQodGhpcykubmV4dCgndWwnKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHQkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKCAkKHdpbmRvdykud2lkdGgoKSA+IDc2OCApIHtcclxuXHRcdFx0XHQkKCcuZm9vdGVyX3RpdGxlICsgdWwnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuXHRcdFx0XHQkKCcuZm9vdGVyX3RpdGxlICsgdWwub3BlbicpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JCgnLmZvb3Rlcl90aXRsZSArIHVsJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XHJcblxyXG5cdC8qIFZhcmlhYmxlcyAqL1xyXG5cclxuICAgIHZhciAkZm9ybSA9ICQoJy5mb3JtLXN0YWdlJyk7XHJcbiAgICB2YXIgJGZvcm1Ecm9wID0gJCgnLmZvcm1fZHJvcCcpO1xyXG4gICAgdmFyICRpbnB1dCA9ICRmb3JtLmZpbmQoJ2lucHV0W3R5cGU9ZmlsZV0nKTtcclxuICAgIHZhciBkcm9wcGVkRmlsZXMgPSBmYWxzZTtcclxuXHJcblxyXG4gICAgLyogRnVuY3Rpb25zICovXHJcblxyXG4gICAgdmFyIGlzQWR2YW5jZWRVcGxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgcmV0dXJuICgoJ2RyYWdnYWJsZScgaW4gZGl2KSB8fCAoJ29uZHJhZ3N0YXJ0JyBpbiBkaXYgJiYgJ29uZHJvcCcgaW4gZGl2KSkgJiYgJ0Zvcm1EYXRhJyBpbiB3aW5kb3cgJiYgJ0ZpbGVSZWFkZXInIGluIHdpbmRvdztcclxuICAgIH0oKTtcclxuXHJcbiAgICB2YXIgYWRkZmlsZURvbSA9IGZ1bmN0aW9uKGZpbGUpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGZpbGUpO1xyXG5cclxuICAgICAgICB2YXIgaHRtbCA9IGA8ZGl2IGNsYXNzPVwiY29sLTEyIGNvbC1tZC02IG1iLTJcIj5cclxuXHQgICAgICAgIFx0XHRcdDxkaXYgY2xhc3M9XCJmb3JtX2ZpbGVcIiBpZD1cIiR7ZmlsZS5uYW1lICsgcGFyc2VJbnQoZmlsZS5zaXplIC8gMTAyNCl9XCI+XHJcblx0XHRcdCAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid3JhcHBlciBkLWZsZXgganVzdGlmeS1jb250ZW50LWJldHdlZW4gYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjaGVjayBkLW5vbmVcIj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmc+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPVwiI2ljb24tY2hlY2stZmlsZVwiPjwvdXNlPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwZGZcIj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmc+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPVwiI2ljb24tcGRmLWZpbGVcIj48L3VzZT5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJuYW1lXCI+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtmaWxlLm5hbWV9XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInNpemVcIj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3BhcnNlSW50KGZpbGUuc2l6ZSAvIDEwMjQpfUtCXHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInJlbW92ZSBkLW5vbmVcIj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmc+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPVwiI2ljb24tcmVtb3ZlLWZpbGVcIj48L3VzZT5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibG9hZGluZ1wiPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hhcmdlbWVudCBlbiBjb3VycyA8c3BhbiBjbGFzcz1cInBlcmNlbnRhZ2VcIj48L3NwYW4+ICVcclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNyb3NzXCI+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj1cIiNpY29uLWNyb3NzLWZpbGVcIj48L3VzZT5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblx0XHRcdCAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1iYXJcIiBzdHlsZT1cIndpZHRoOiAwJVwiPjwvZGl2PlxyXG5cdFx0XHQgICAgICAgICAgICA8L2Rpdj5cclxuXHRcdFx0ICAgICAgICA8L2Rpdj5gO1xyXG5cclxuXHRcdCQoJy5mb3JtX2ZpbGVzJykuYXBwZW5kKGh0bWwpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgdmFyIHNlbmRGaWxlcyA9IGZ1bmN0aW9uKGZpbGVzKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhmaWxlcyk7XHJcblxyXG4gICAgICAgIHZhciBhamF4RGF0YSA9IG5ldyBGb3JtRGF0YSgkZm9ybS5nZXQoMCkpO1xyXG5cclxuICAgICAgICAkLmVhY2goZHJvcHBlZEZpbGVzLCBmdW5jdGlvbihpLCBmaWxlKSB7XHJcblxyXG4gICAgICAgIFx0dmFyIGZpbGVJZCA9IGZpbGUubmFtZSArIHBhcnNlSW50KGZpbGUuc2l6ZSAvIDEwMjQpO1xyXG4gICAgICAgICAgICBhamF4RGF0YS5hcHBlbmQoZmlsZUlkLCBmaWxlKTtcclxuXHJcbiAgICAgICAgICAgIGFkZGZpbGVEb20oZmlsZSk7XHJcblxyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgeGhyOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHhociA9IG5ldyB3aW5kb3cuWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgeGhyLnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKFwicHJvZ3Jlc3NcIiwgZnVuY3Rpb24oZXZ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldnQubGVuZ3RoQ29tcHV0YWJsZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwZXJjZW50Q29tcGxldGUgPSBldnQubG9hZGVkIC8gZXZ0LnRvdGFsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVJZCA9IGZpbGUubmFtZSArIHBhcnNlSW50KGZpbGUuc2l6ZSAvIDEwMjQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVEb20gPSAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGZpbGVJZCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBlcmNlbnRhZ2VEb20gPSAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGZpbGVJZCkpLmZpbmQoJy5wZXJjZW50YWdlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvZ3Jlc3NCYXIgPSAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGZpbGVJZCkpLmZpbmQoJy5wcm9ncmVzcy1iYXInKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJjZW50Q29tcGxldGUgPSBwYXJzZUludChwZXJjZW50Q29tcGxldGUgKiAxMDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcmNlbnRhZ2VEb20uYXBwZW5kKHBlcmNlbnRDb21wbGV0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmVzc0Jhci5jc3MoJ3dpZHRoJywgcGVyY2VudENvbXBsZXRlICsgJyUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhwZXJjZW50Q29tcGxldGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwZXJjZW50Q29tcGxldGUgPT09IDEwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx0XHRmaWxlRG9tLmZpbmQoJy5wcm9ncmVzcy1iYXInKS50b2dnbGVDbGFzcygnZC1ub25lJyk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx0ZmlsZURvbS5maW5kKCcubG9hZGluZycpLnRvZ2dsZUNsYXNzKCdkLW5vbmUnKTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHRmaWxlRG9tLmZpbmQoJy5yZW1vdmUnKS50b2dnbGVDbGFzcygnZC1ub25lJyk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx0ZmlsZURvbS5maW5kKCcuY3Jvc3MnKS50b2dnbGVDbGFzcygnZC1ub25lJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHR9LCAzMDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4aHI7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYWN0aW9uL3VwbG9hZGZpbGUnLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJGZvcm0uYXR0cignbWV0aG9kJyksXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBhamF4RGF0YSxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGZvcm0ucmVtb3ZlQ2xhc3MoJ2lzLXVwbG9hZGluZycpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAkZm9ybS5hZGRDbGFzcyhkYXRhLnN1Y2Nlc3MgPT0gdHJ1ZSA/ICdpcy1zdWNjZXNzJyA6ICdpcy1lcnJvcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZGF0YS5zdWNjZXNzKSBjb25zb2xlLmxvZygndXBsb2FkIGVycm9yJyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIExvZyB0aGUgZXJyb3IsIHNob3cgYW4gYWxlcnQsIHdoYXRldmVyIHdvcmtzIGZvciB5b3VcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkKCcucmVtb3ZlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0ICAgIFx0dmFyIHJlbW92ZUlkID0gJCh0aGlzKS5jbG9zZXN0KCcuZm9ybV9maWxlJykuYXR0cignaWQnKTtcclxuXHJcblx0XHQgICAgXHRyZW1vdmVGaWxlKHJlbW92ZUlkKTtcclxuXHRcdCAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIHJlbW92ZUZpbGUgPSBmdW5jdGlvbihpZCkge1xyXG4gICAgXHR2YXIgZmlsZSA9ICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpKS5wYXJlbnQoKTtcclxuICAgIFx0ZmlsZS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcblx0LyogRHJhZyBhbmQgZHJvcCBMaXN0ZW5lciAqL1xyXG5cclxuICAgIGlmIChpc0FkdmFuY2VkVXBsb2FkKSB7XHJcbiAgICAgICAgLy8gQnJvd3NlciBzdXBwb3J0IERyYWcgYW5kIERyb3BcclxuXHJcbiAgICAgICAgJGZvcm1Ecm9wLm9uKCdkcmFnIGRyYWdzdGFydCBkcmFnZW5kIGRyYWdvdmVyIGRyYWdlbnRlciBkcmFnbGVhdmUgZHJvcCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbignZHJhZ292ZXIgZHJhZ2VudGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkZm9ybURyb3AuYWRkQ2xhc3MoJ2lzLWRyYWdvdmVyJyk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbignZHJhZ2xlYXZlIGRyYWdlbmQgZHJvcCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJGZvcm1Ecm9wLnJlbW92ZUNsYXNzKCdpcy1kcmFnb3ZlcicpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oJ2Ryb3AnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBkcm9wcGVkRmlsZXMgPSBlLm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyLmZpbGVzO1xyXG4gICAgICAgICAgICAgICAgc2VuZEZpbGVzKGRyb3BwZWRGaWxlcyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkaW5wdXQub24oJ2NoYW5nZScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBcdGRyb3BwZWRGaWxlcyA9IGUudGFyZ2V0LmZpbGVzO1xyXG4gICAgICAgICAgICBzZW5kRmlsZXMoZS50YXJnZXQuZmlsZXMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vZmFsbGJhY2sgZm9yIElFOS0gYnJvd3NlcnNcclxuICAgIH1cclxuXHJcbiAgICAvKiBTdWJtaXQgTGlzdGVuZXIgKi9cclxuXHJcbiAgICAkZm9ybS5vbignc3VibWl0JywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGlmICgkZm9ybS5oYXNDbGFzcygnaXMtdXBsb2FkaW5nJykpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgJGZvcm0uYWRkQ2xhc3MoJ2lzLXVwbG9hZGluZycpLnJlbW92ZUNsYXNzKCdpcy1lcnJvcicpO1xyXG5cclxuICAgICAgICBpZiAoaXNBZHZhbmNlZFVwbG9hZCkge1xyXG4gICAgICAgICAgICAvLyBhamF4IGZvciBtb2Rlcm4gYnJvd3NlcnNcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEZvcm0gSW5wdXQgRGF0YVxyXG4gICAgICAgICAgICB2YXIgYWpheERhdGEgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICRmb3JtLmF0dHIoJ2FjdGlvbicpLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJGZvcm0uYXR0cignbWV0aG9kJyksXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBhamF4RGF0YSxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIExvZyB0aGUgZXJyb3IsIHNob3cgYW4gYWxlcnQsIHdoYXRldmVyIHdvcmtzIGZvciB5b3VcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGFqYXggZm9yIElFOS0gYnJvd3NlcnNcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcclxuICAgICQoXCJmb3JtW25hbWU9J2Zvcm0tc3RhZ2UnXVwiKS52YWxpZGF0ZSh7XHJcblxyXG4gICAgICAgIC8vIFNwZWNpZnkgdmFsaWRhdGlvbiBydWxlc1xyXG4gICAgICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgICAgIGZpcnN0bmFtZTogJ3JlcXVpcmVkJyxcclxuICAgICAgICAgICAgbGFzdG5hbWU6ICdyZXF1aXJlZCcsXHJcbiAgICAgICAgICAgIGVtYWlsOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGVtYWlsOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRlbDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBkaWdpdHM6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VydmljZTogJ3JlcXVpcmVkJyxcclxuICAgICAgICAgICAgZm9ybWF0aW9uOiAncmVxdWlyZWQnLFxyXG4gICAgICAgICAgICBzdGFnZToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd0eXBlLWZvcm1hdGlvbic6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIFNwZWNpZnkgdmFsaWRhdGlvbiBlcnJvciBtZXNzYWdlc1xyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIGZpcnN0bmFtZTogJ1ZldWlsbGV6IGVudHJlciB2b3RyZSBwcsOpbm9tJyxcclxuICAgICAgICAgICAgbGFzdG5hbWU6ICdWZXVpbGxleiBlbnRyZXIgdm90cmUgbm9tJyxcclxuICAgICAgICAgICAgZW1haWw6ICdWZXVpbGxleiBlbnRyZXIgdW4gZW1haWwgdmFsaWRlJyxcclxuICAgICAgICAgICAgdGVsOiAnVmV1aWxsZXogZW50cmVyIHVuIG51bcOpcm8gZGUgdMOpbMOpcGhvbmUgdmFsaWRlICgxMCBjYXJhY3TDqHJlcyBtaW4pJyxcclxuICAgICAgICAgICAgJ3R5cGUtZm9ybWF0aW9uJzogJ1ZldWlsbGV6IGVudHJlciB1biB0eXBlIGRlIGZvcm1hdGlvbicsXHJcbiAgICAgICAgICAgICdjb25kaXRpb25zJzogJ1ZldWlsbGV6IGFjY2VwdGV6IGxlcyBjb25kaXRpb25zIGfDqW7DqXJhbGVzIGRcXCd1dGlsaXNhdGlvbicsXHJcbiAgICAgICAgICAgICdzZXJ2aWNlJzogJ1ZldWlsbGV6IGNob2lzaXIgdW4gc2VydmljZScsXHJcbiAgICAgICAgICAgICdmb3JtYXRpb24nOiAnVmV1aWxsZXogY2hvaXNpciB1bmUgZm9ybWF0aW9uJyxcclxuICAgICAgICAgICAgJ3N0YWdlJzogJ1ZldWlsbGV6IGNob2lzaXIgdW4gdHlwZSBkZSBzdGFnZSdcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbihlcnJvciwgZWxlbWVudCkge1xyXG4gICAgICAgICAgICBpZiAoKGVsZW1lbnQuYXR0cigndHlwZScpID09ICdyYWRpbycgfHwgZWxlbWVudC5hdHRyKCd0eXBlJykgPT0gJ2NoZWNrYm94JykgJiYgZWxlbWVudC5hdHRyKCduYW1lJykgIT0gJ2NvbmRpdGlvbnMnKSB7XHJcbiAgICAgICAgICAgIFx0ZXJyb3IuaW5zZXJ0QWZ0ZXIoZWxlbWVudC5wYXJlbnQoKS5wYXJlbnQoKSk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYoZWxlbWVudC5hdHRyKCduYW1lJykgPT0gJ2NvbmRpdGlvbnMnKXtcclxuICAgICAgICAgICAgXHRlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50LnBhcmVudCgpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSBmb3JtIGlzIHN1Ym1pdHRlZCB0byB0aGUgZGVzdGluYXRpb24gZGVmaW5lZFxyXG4gICAgICAgIC8vIGluIHRoZSBcImFjdGlvblwiIGF0dHJpYnV0ZSBvZiB0aGUgZm9ybSB3aGVuIHZhbGlkXHJcbiAgICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24oZm9ybSkge1xyXG4gICAgICAgICAgICBmb3JtLnN1Ym1pdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG5cdGlmICgkKCcuaGVhZGVyX21vYmlsZS1tZW51JykubGVuZ3RoKSB7XHJcblx0XHQkKCcuaGVhZGVyX21vYmlsZS1tZW51Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoJCgnLmhlYWRlcl9tZW51JykuY3NzKCdkaXNwbGF5JykgPT0gJ2Jsb2NrJykge1xyXG5cdFx0XHRcdCQoJy5oZWFkZXJfbWVudScpLmNzcygnZGlzcGxheScsICdub25lJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JCgnLmhlYWRlcl9tZW51JykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0JCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA5OTEpIHtcclxuXHRcdFx0aWYgKCQoJy5oZWFkZXJfbWVudScpLmNzcygnZGlzcGxheScpID09ICdub25lJykge1xyXG5cdFx0XHRcdCQoJy5oZWFkZXJfbWVudScpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSk7XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcblx0aWYgKCQoJy5ob21lLXNsaWRlcicpLmxlbmd0aCkge1xyXG5cclxuICAgICAgICB2YXIgcnRsID0gJCgnaHRtbCcpLmF0dHIoJ2RpcicpID09ICdydGwnO1xyXG5cclxuXHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG5cclxuXHRcdFx0c2V0SGVpZ2h0U2xpZGVyKCk7XHJcbiAgICAgICAgICAgIGhvbWVTbGlkZXIoMCwgcnRsKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaG9tZVNsaWRlcigwLCBydGwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG4gICAgICAgICAgICAgICAgJCgnLmhvbWUtc2xpZGVyJykub3dsQ2Fyb3VzZWwoJ2Rlc3Ryb3knKTtcclxuICAgICAgICAgICAgICAgIGhvbWVTbGlkZXIoMCwgcnRsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoJy5ob21lLXNsaWRlcicpLm93bENhcm91c2VsKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgICAgICAgICBob21lU2xpZGVyKDAsIHJ0bCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEhlaWdodFNsaWRlcigpIHtcclxuXHRcdHZhciB3aW5kb3dIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XHJcblx0XHR2YXIgdG9wSGVhZGVySGVpZ2h0ID0gJCgnLnRvcC1oZWFkZXInKS5oZWlnaHQoKTtcclxuXHRcdHZhciBoZWFkZXJIZWlnaHQgPSAkKCcuaGVhZGVyJykuaGVpZ2h0KCk7XHJcblxyXG5cdFx0dmFyIHNsaWRlckhlaWdodCA9IHdpbmRvd0hlaWdodCAtIHRvcEhlYWRlckhlaWdodCAtIGhlYWRlckhlaWdodDtcclxuXHJcblx0XHR2YXIgc2xpZGVyID0gJCgnLmhvbWUtc2xpZGVyJyk7XHJcblx0XHR2YXIgc2xpZGVySXRlbSA9ICQoJy5ob21lLXNsaWRlcl9pdGVtJyk7XHJcblxyXG5cdFx0c2xpZGVyLmNzcygnbWF4LWhlaWdodCcsIHNsaWRlckhlaWdodCk7XHJcblx0XHRzbGlkZXJJdGVtLmNzcygnbWF4LWhlaWdodCcsIHNsaWRlckhlaWdodCk7XHJcblx0XHRcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGhvbWVTbGlkZXIoc3RhZ2VQYWRkaW5nLCBydGwpIHtcclxuXHRcdHZhciBvd2wgPSAkKCcuaG9tZS1zbGlkZXIub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBzdGFnZVBhZGRpbmc6IHN0YWdlUGFkZGluZyxcclxuICAgICAgICAgICAgbWFyZ2luOiAwLFxyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBuYXY6IGZhbHNlLFxyXG4gICAgICAgICAgICBsb29wOiB0cnVlLFxyXG4gICAgICAgICAgICBuYXZTcGVlZDogNDAwLFxyXG4gICAgICAgICAgICAvL2F1dG9wbGF5OiB0cnVlLFxyXG5cdFx0XHRhdXRvcGxheVRpbWVvdXQ6NTAwMCxcclxuICAgICAgICAgICAgcnRsOiBydGwsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHtcclxuICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogMVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIDc2ODoge1xyXG4gICAgICAgICAgICAgICAgXHRpdGVtczogMSxcclxuICAgICAgICAgICAgICAgIFx0ZG90c0RhdGE6IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuXHR9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcblx0aWYgKCQoJy5sb2dvLXNsaWRlcicpLmxlbmd0aCkge1xyXG5cclxuICAgICAgICB2YXIgcnRsID0gJCgnaHRtbCcpLmF0dHIoJ2RpcicpID09ICdydGwnO1xyXG5cclxuXHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG5cdFx0XHRsb2dvU2xpZGVyKDAsIHJ0bCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsb2dvU2xpZGVyKDAsIHJ0bCk7XHJcblx0XHR9XHJcblxyXG5cdFx0JCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG5cdFx0XHRcdGxvZ29TbGlkZXIoMCwgcnRsKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsb2dvU2xpZGVyKDAsIHJ0bCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGxvZ29TbGlkZXIoc3RhZ2VQYWRkaW5nLCBydGwpIHtcclxuICAgICAgICAkKCcubG9nby1zbGlkZXIub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBzdGFnZVBhZGRpbmc6IHN0YWdlUGFkZGluZyxcclxuICAgICAgICAgICAgbWFyZ2luOiA0NSxcclxuICAgICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgICAgIG5hdjogdHJ1ZSxcclxuICAgICAgICAgICAgbG9vcDogdHJ1ZSxcclxuICAgICAgICAgICAgcnRsOiBydGwsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHtcclxuICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogMi41XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgNzY4OiB7XHJcbiAgICAgICAgICAgICAgICBcdGl0ZW1zOiA0XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgOTkyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImltcG9ydCBkYXRhIGZyb20gJy4uLy4uL2Fzc2V0cy9qcy9kYXRhLmpzb24nXHJcblxyXG5leHBvcnQgbGV0IG1hcENvbnRyb2wgPSBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IHByb2Nlc3NEYXRhID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgIGxldCBpbnB1dGVkU2VhcmNoID0gJCgnI2lucHV0ZWQtc2VhcmNoJylcclxuICAgIGxldCBzZWFyY2hSZXN1bHQgPSAkKCcjc2VhcmNoLXJlc3VsdCcpXHJcbiAgICBsZXQgc3VnZ2VzdGlvbkhvbGRlciA9ICQoJyNzdWdnZXN0aW9ucy1ob2xkZXInKVxyXG4gICAgbGV0IHNlYXJjaElucHV0ID0gJCgnI3NlYXJjaC1pbnB1dCcpXHJcbiAgICBsZXQgc3VnZ2VzdGlvbnNDb250YWluZXIgPSAkKCcjc3VnZ2VzdGlvbnMtY29udGFpbmVyJylcclxuICAgIGxldCBzZWxlY3RlZENvbnRhaW5lciA9ICQoJyNzZWxlY3RlZC1jb250YWluZXInKVxyXG4gICAgbGV0IG1hcENvbnRyb2xDb250YWluZXIgPSAkKCcubWFwY29udHJvbF9jb250YWluZXInKVxyXG4gICAgbGV0IGZpbHRlcnMgPSAkKCcubWFwY29udHJvbF9vcHRpb25zID4gLmJ0bicpXHJcblxyXG4gICAgbGV0IHN0YXRlID0ge1xyXG4gICAgICB1c2VySW5wdXQ6ICcnLFxyXG4gICAgICBmaWx0ZXJzOiBbXSxcclxuICAgICAgZmlsdHJlZERhdGE6IFtdXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGNoZWNrU3VnZ2VzdGlvbnNTdGF0dXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmIChzdGF0ZS5maWx0cmVkRGF0YS5sZW5ndGggPD0gMCkge1xyXG4gICAgICAgIG1hcENvbnRyb2xDb250YWluZXIuY3NzKCdoZWlnaHQnLCAnMTg2cHgnKVxyXG4gICAgICAgIHN1Z2dlc3Rpb25zQ29udGFpbmVyLmhpZGUoKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG1hcENvbnRyb2xDb250YWluZXIuY3NzKCdoZWlnaHQnLCAnMjQ1cHgnKVxyXG4gICAgICAgIHN1Z2dlc3Rpb25zQ29udGFpbmVyLnNob3coKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGFwcGx5RmlsdGVycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy8gZmlsdGVyIGRhdGEgYnkgdXNlciBpbnB1dFxyXG4gICAgICBzdGF0ZS5maWx0cmVkRGF0YSA9IGRhdGEuZmlsdGVyKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAoZWxlbWVudC5uYW1lLnRvTG9jYWxlTG93ZXJDYXNlKCkuaW5jbHVkZXMoc3RhdGUudXNlcklucHV0KSB8fFxyXG4gICAgICAgICAgICBlbGVtZW50LmFkZHJlc3MudG9Mb2NhbGVMb3dlckNhc2UoKS5pbmNsdWRlcyhzdGF0ZS51c2VySW5wdXR0KSB8fFxyXG4gICAgICAgICAgICBlbGVtZW50LmNpdHkudG9Mb2NhbGVMb3dlckNhc2UoKS5pbmNsdWRlcyhzdGF0ZS51c2VySW5wdXQpKSAmJlxyXG4gICAgICAgICAgc3RhdGUudXNlcklucHV0ICE9ICcnXHJcbiAgICAgICAgKVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgLy8gRmlsdGVyIGRhdGEgYnkgdHlwZVxyXG4gICAgICBzdGF0ZS5maWx0ZXJzLmZvckVhY2goZmlsdGVyID0+IHtcclxuICAgICAgICBzdGF0ZS5maWx0cmVkRGF0YSA9IHN0YXRlLmZpbHRyZWREYXRhLmZpbHRlcihlbGVtZW50ID0+IHtcclxuICAgICAgICAgIHJldHVybiBlbGVtZW50LnR5cGUgPT09IGZpbHRlclxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICAvLyByZW5kZXIgZmlsdHJlZCBkYXRhXHJcbiAgICAgIHJlbmRlcigpXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGZpbHRlckNoYW5nZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpIC8vIGNoYW5nZSB0aGUgc3R5bGUgb2YgdGhlIHRhZ1xyXG4gICAgICBzdGF0ZS5maWx0ZXJzID0gW11cclxuXHJcbiAgICAgIGZpbHRlcnMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICBzdGF0ZS5maWx0ZXJzLnB1c2goJCh0aGlzKS5kYXRhKCd2YWx1ZScpKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuXHJcbiAgICAgIGFwcGx5RmlsdGVycygpXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGlucHV0Q2hhbmdlcyA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIHN0YXRlLnVzZXJJbnB1dCA9IGUudGFyZ2V0LnZhbHVlLnRvTG9jYWxlTG93ZXJDYXNlKClcclxuICAgICAgYXBwbHlGaWx0ZXJzKClcclxuICAgIH1cclxuXHJcbiAgICBsZXQgc2hvd1NlbGVjdGVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBsZXQgc2VsZWN0ZWROYW1lID0gJCh0aGlzKS5maW5kKCdoMycpLnRleHQoKVxyXG5cclxuICAgICAgbGV0IHNlbGVjdGVkRWxlbWVudCA9IHN0YXRlLmZpbHRyZWREYXRhXHJcbiAgICAgICAgLmZpbHRlcihlbGVtZW50ID0+IGVsZW1lbnQubmFtZSA9PT0gc2VsZWN0ZWROYW1lKVxyXG4gICAgICAgIC5yZWR1Y2UocHJldiA9PiBwcmV2KVxyXG5cclxuICAgICAgbGV0IHNlbGVjdGVkSFRNTCA9IGJ1aWxkTWFwQ2FyZEluZm8oc2VsZWN0ZWRFbGVtZW50KVxyXG5cclxuICAgICAgc2VsZWN0ZWRDb250YWluZXIuaHRtbChzZWxlY3RlZEhUTUwpXHJcbiAgICAgICQoJyNzZWxlY3RlZC1jb250YWluZXItLWNsb3NlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICByZW5kZXIoKVxyXG4gICAgICB9KVxyXG4gICAgICBzZWxlY3RlZENvbnRhaW5lci5mYWRlSW4oKVxyXG4gICAgICBzdWdnZXN0aW9uc0NvbnRhaW5lci5oaWRlKClcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcmVuZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAvLyBoaWRlIHNlbGVjdGVkIGNvbnRhaW5lclxyXG4gICAgICBzZWxlY3RlZENvbnRhaW5lci5oaWRlKClcclxuXHJcbiAgICAgIC8vIENoZWNrIHdldGhlciB0byBkaXNwbGF5IHN1Z2dlc3Rpb25zIG9mIG5vdFxyXG4gICAgICBjaGVja1N1Z2dlc3Rpb25zU3RhdHVzKClcclxuXHJcbiAgICAgIC8vIHVwZGF0ZSBpbnB1dGVkIHNlYXJjaFxyXG4gICAgICBpbnB1dGVkU2VhcmNoLnRleHQoc3RhdGUudXNlcklucHV0KVxyXG4gICAgICAvLyB1cGRhdGUgc2VhcmNoIFJlc3VsdFxyXG4gICAgICBzZWFyY2hSZXN1bHQudGV4dChgKCAke3N0YXRlLmZpbHRyZWREYXRhLmxlbmd0aH0gYWdlbmNlcyB0cm91dsOpZXMgKWApXHJcblxyXG4gICAgICBsZXQgY29udGVudCA9IHN0YXRlLmZpbHRyZWREYXRhXHJcbiAgICAgICAgLm1hcChlbGVtZW50ID0+IHtcclxuICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cInN1Z2dlc3Rpb25zX2VsZW1lbnRcIj5cclxuICAgICAgICAgICAgICAgICAgPGgzPiR7ZWxlbWVudC5uYW1lfTwvaDM+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuPiR7ZWxlbWVudC5hZGRyZXNzfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PmBcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5qb2luKCcnKVxyXG5cclxuICAgICAgc3VnZ2VzdGlvbkhvbGRlci5odG1sKGNvbnRlbnQpXHJcblxyXG4gICAgICAkKCcuc3VnZ2VzdGlvbnNfZWxlbWVudCcpLmNsaWNrKHNob3dTZWxlY3RlZClcclxuICAgIH1cclxuXHJcbiAgICBzZWFyY2hJbnB1dC5vbignaW5wdXQnLCBpbnB1dENoYW5nZXMpXHJcbiAgICBmaWx0ZXJzLm9uKCdjbGljaycsIGZpbHRlckNoYW5nZXMpXHJcbiAgfVxyXG5cclxuICAvLyAkLmdldEpTT04oJ2h0dHA6Ly9sb2NhbGhvc3Q6OTAwMC9kYXRhLmpzb24nLCBwcm9jZXNzRGF0YSlcclxuXHJcbiAgcHJvY2Vzc0RhdGEoZGF0YSlcclxufVxyXG5cclxuZXhwb3J0IGxldCB0b2dnbGVDb250cm9sID0gZnVuY3Rpb24gKCkge1xyXG4gICQoJy5tYXBjb250cm9sX3RvZ2dsZScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICQoJy5tYXBjb250cm9sJykudG9nZ2xlQ2xhc3MoJ21hcGNvbnRyb2wtLWhpZGUnKVxyXG4gIH0pXHJcbn1cclxuXHJcbmV4cG9ydCBsZXQgYnVpbGRNYXBDYXJkSW5mbyA9IGZ1bmN0aW9uIChzZWxlY3RlZEVsZW1lbnQpIHtcclxuICByZXR1cm4gYDxkaXYgY2xhc3M9XCJtb3JlaW5mb19jb250ZW50XCI+XHJcbiAgPGRpdiBjbGFzcz1cIm1vcmVpbmZvX2hlYWRcIj5cclxuICAgIDxoMyBjbGFzcz1cIm1vcmVpbmZvX3RpdGxlXCIgaWQ9XCJpbmZvLW5hbWVcIj4ke3NlbGVjdGVkRWxlbWVudC5uYW1lfTwvaDM+XHJcbiAgICA8cCBjbGFzcz1cIm1vcmVpbmZvX2FkZHJlc3NcIiBpZD1cImluZm8tYWRkcmVzc1wiPiR7c2VsZWN0ZWRFbGVtZW50LmFkZHJlc3N9PC9wPlxyXG4gICAgPGRpdiBjbGFzcz1cIm1vcmVpbmZvX2FjdGlvbnNcIj5cclxuICAgICAgPGEgaHJlZj1cIiNcIj5Hw4lOw4lSRVIgVU4gSVRJTsOJUkFJUkU8L2E+XHJcbiAgICAgIDxhIGhyZWY9XCIjXCIgaWQ9XCJzZWxlY3RlZC1jb250YWluZXItLWNsb3NlXCI+UkVUT1VSTkVSPC9hPlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbiAgPGRpdiBjbGFzcz1cIm1vcmVpbmZvX2JvZHlcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJtb3JlaW5mb19zZWN0aW9uXCI+XHJcbiAgICAgIDxoND5Db29yZG9ubsOpZXM8L2g0PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwibW9yZWluZm9fbGlzdFwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb3JlaW5mb19saXN0LWl0ZW1cIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJsZWZ0XCI+XHJcbiAgICAgICAgICAgIDxzcGFuPkVtYWlsPC9zcGFuPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicmlnaHRcIj5cclxuICAgICAgICAgICAgPHNwYW4gaWQ9XCJpbmZvLWVtYWlsXCI+JHtzZWxlY3RlZEVsZW1lbnQuY29vcmRzLmVtYWlsfTwvc3Bhbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb3JlaW5mb19saXN0LWl0ZW1cIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJsZWZ0XCI+XHJcbiAgICAgICAgICAgIDxzcGFuPlTDqWzDqXBob25lPC9zcGFuPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicmlnaHRcIj5cclxuICAgICAgICAgICAgPHNwYW4gaWQ9XCJpbmZvLXBob25lXCI+JHtzZWxlY3RlZEVsZW1lbnQuY29vcmRzLnBob25lfTwvc3Bhbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb3JlaW5mb19saXN0LWl0ZW1cIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJsZWZ0XCI+XHJcbiAgICAgICAgICAgIDxzcGFuPkZheDwvc3Bhbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJpZ2h0XCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGlkPVwiaW5mby1mYXhcIj4ke3NlbGVjdGVkRWxlbWVudC5jb29yZHMuZmF4fTwvc3Bhbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb3JlaW5mb19saXN0LWl0ZW1cIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJsZWZ0XCI+XHJcbiAgICAgICAgICAgIDxzcGFuPkNvb3JkcyBHUFM8L3NwYW4+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyaWdodFwiPlxyXG4gICAgICAgICAgICA8c3Bhbj5cclxuICAgICAgICAgICAgICA8Ym9sZD5cclxuICAgICAgICAgICAgICAgIExhdGl0dWRlXHJcbiAgICAgICAgICAgICAgPC9ib2xkPiA6ICR7c2VsZWN0ZWRFbGVtZW50LmNvb3Jkcy5ncHMubGF0fSB8XHJcbiAgICAgICAgICAgICAgPGJvbGQ+XHJcbiAgICAgICAgICAgICAgICBMb25naXR1ZGVcclxuICAgICAgICAgICAgICA8L2JvbGQ+IDogJHtzZWxlY3RlZEVsZW1lbnQuY29vcmRzLmdwcy5sYW5nfSA8L3NwYW4+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJtb3JlaW5mb19zZWN0aW9uXCI+XHJcbiAgICAgIDxoND5BZ2VuY2UgbGnDqWU8L2g0PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwibW9yZWluZm9fY29udGFpbmVyXCI+XHJcbiAgICAgICAgPGg1PiR7c2VsZWN0ZWRFbGVtZW50LmV4dGVuc2lvbi5uYW1lfTwvaDU+XHJcbiAgICAgICAgPHAgY2xhc3M9XCJtb3JlaW5mb19hZGRyZXNzXCI+JHtzZWxlY3RlZEVsZW1lbnQuZXh0ZW5zaW9uLmFkZHJlc3N9PC9wPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cIm1vcmVpbmZvX3NlY3Rpb25cIj5cclxuICAgICAgPGRpdiBjbGFzcz1cIm1vcmVpbmZvX2xpc3RcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9yZWluZm9fbGlzdC1pdGVtXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibGVmdFwiPlxyXG4gICAgICAgICAgICA8c3Bhbj5MdW5kaTwvc3Bhbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJpZ2h0XCI+XHJcbiAgICAgICAgICAgIDxzcGFuPiR7c2VsZWN0ZWRFbGVtZW50LnRpbWV0YWJsZS5tb25kYXl9PC9zcGFuPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vcmVpbmZvX2xpc3QtaXRlbVwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImxlZnRcIj5cclxuICAgICAgICAgICAgPHNwYW4+TWFyZGk8L3NwYW4+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyaWdodFwiPlxyXG4gICAgICAgICAgICA8c3Bhbj4ke3NlbGVjdGVkRWxlbWVudC50aW1ldGFibGUudHVlc2RheX08L3NwYW4+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9yZWluZm9fbGlzdC1pdGVtXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibGVmdFwiPlxyXG4gICAgICAgICAgICA8c3Bhbj5NZXJjcmVkaTwvc3Bhbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJpZ2h0XCI+XHJcbiAgICAgICAgICAgIDxzcGFuPiR7c2VsZWN0ZWRFbGVtZW50LnRpbWV0YWJsZS53ZWRuZXNkYXl9PC9zcGFuPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vcmVpbmZvX2xpc3QtaXRlbVwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImxlZnRcIj5cclxuICAgICAgICAgICAgPHNwYW4+SmV1ZGk8L3NwYW4+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyaWdodFwiPlxyXG4gICAgICAgICAgICA8c3Bhbj4ke3NlbGVjdGVkRWxlbWVudC50aW1ldGFibGUudGh1cnNkYXl9PC9zcGFuPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vcmVpbmZvX2xpc3QtaXRlbVwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImxlZnRcIj5cclxuICAgICAgICAgICAgPHNwYW4+VmVuZHJlZGk8L3NwYW4+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyaWdodFwiPlxyXG4gICAgICAgICAgICA8c3Bhbj4ke3NlbGVjdGVkRWxlbWVudC50aW1ldGFibGUuZnJpZGF5fTwvc3Bhbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb3JlaW5mb19saXN0LWl0ZW1cIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJsZWZ0XCI+XHJcbiAgICAgICAgICAgIDxzcGFuPlNhbWVkaTwvc3Bhbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJpZ2h0XCI+XHJcbiAgICAgICAgICAgIDxzcGFuPiR7c2VsZWN0ZWRFbGVtZW50LnRpbWV0YWJsZS5zYXR1cmRheX08L3NwYW4+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9yZWluZm9fbGlzdC1pdGVtXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibGVmdFwiPlxyXG4gICAgICAgICAgICA8c3Bhbj5EaWFtYW5jaGU8L3NwYW4+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyaWdodFwiPlxyXG4gICAgICAgICAgICA8c3Bhbj4ke3NlbGVjdGVkRWxlbWVudC50aW1ldGFibGUuc3VuZGF5fTwvc3Bhbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG48L2Rpdj5gXHJcbn1cclxuIiwiaW1wb3J0IHsgYnVpbGRNYXBDYXJkSW5mbyB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvbWFwLWNvbnRyb2wvaW5kZXguanMnXHJcbmltcG9ydCBkYXRhIGZyb20gJy4uLy4uL2Fzc2V0cy9qcy9kYXRhLmpzb24nXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IG1hcENvbnRyb2xDb250YWluZXIgPSAkKCcubWFwY29udHJvbF9jb250YWluZXInKVxyXG4gIGxldCBtYXBDb250cm9sID0gJCgnLm1hcGNvbnRyb2wnKVxyXG4gIGxldCBzZWxlY3RlZENvbnRhaW5lciA9ICQoJyNzZWxlY3RlZC1jb250YWluZXInKVxyXG4gIGxldCBzdWdnZXN0aW9uc0NvbnRhaW5lciA9ICQoJyNzdWdnZXN0aW9ucy1jb250YWluZXInKVxyXG5cclxuICBsZXQgYmluZE1hcmtlcnMgPSBmdW5jdGlvbiAobWFwLCBsb2NhdGlvbnMpIHtcclxuICAgIGxldCBtYXJrZXIsIGxhdGxuZ1xyXG5cclxuICAgIGxvY2F0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChsb2NhdGlvbikge1xyXG4gICAgICBsYXRsbmcgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKFxyXG4gICAgICAgIGxvY2F0aW9uLmNvb3Jkcy5ncHMubGFuZyxcclxuICAgICAgICBsb2NhdGlvbi5jb29yZHMuZ3BzLmxhdFxyXG4gICAgICApXHJcbiAgICAgIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xyXG4gICAgICAgIHBvc2l0aW9uOiBsYXRsbmcsXHJcbiAgICAgICAgaWNvbjogJ2Fzc2V0cy9pbWcvcGluLnBuZydcclxuICAgICAgfSlcclxuICAgICAgbWFya2VyLnNldE1hcChtYXApXHJcblxyXG4gICAgICAvLyBiaWRpbmcgdGhlIGNsaWNrIGV2ZW50IHdpdGggZWFjaCBtYXJrZXJcclxuICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbWFwQ29udHJvbC5yZW1vdmVDbGFzcygnbWFwY29udHJvbC0taGlkZScpXHJcbiAgICAgICAgbWFwQ29udHJvbENvbnRhaW5lci5jc3MoJ2hlaWdodCcsICcyNDVweCcpXHJcbiAgICAgICAgbGV0IHNlbGVjdGVkSFRNTCA9IGJ1aWxkTWFwQ2FyZEluZm8obG9jYXRpb24pXHJcbiAgICAgICAgc2VsZWN0ZWRDb250YWluZXIuaHRtbChzZWxlY3RlZEhUTUwpXHJcbiAgICAgICAgJCgnI3NlbGVjdGVkLWNvbnRhaW5lci0tY2xvc2UnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICBtYXBDb250cm9sQ29udGFpbmVyLmNzcygnaGVpZ2h0JywgJzE4NnB4JylcclxuICAgICAgICAgIHNlbGVjdGVkQ29udGFpbmVyLmhpZGUoKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgc3VnZ2VzdGlvbnNDb250YWluZXIuaGlkZSgpXHJcbiAgICAgICAgc2VsZWN0ZWRDb250YWluZXIuc2hvdygpXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgbGV0IGFqdXN0TWFwU2l6ZSA9IGZ1bmN0aW9uIChtYXBIb2xkZXIpIHtcclxuICAgIC8vIERlZmluZSB0aGUgaGVpZ2h0IG9mIHRoZSBtYXBcclxuICAgIGNvbnN0IHRvcEhlYWRlckhlaWdodCA9IDUxXHJcbiAgICBsZXQgbWFwSGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpXHJcbiAgICBtYXBIb2xkZXIuc3R5bGUuaGVpZ2h0ID0gYCR7bWFwSGVpZ2h0IC0gdG9wSGVhZGVySGVpZ2h0fXB4YFxyXG4gIH1cclxuICBmdW5jdGlvbiBwcm9jZXNzTWFwIChkYXRhKSB7XHJcbiAgICAkLmdldFNjcmlwdChcclxuICAgICAgJ2h0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9qcz9rZXk9QUl6YVN5RENXRF9xNU5vRXlWYmxDMW10UzJibDA4a3Vrcm56RFFzJnJlZ2lvbj1NQScsXHJcbiAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsZXQgbWFwSG9sZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpXHJcbiAgICAgICAgaWYgKG1hcEhvbGRlcikge1xyXG4gICAgICAgICAgYWp1c3RNYXBTaXplKG1hcEhvbGRlcilcclxuXHJcbiAgICAgICAgICB2YXIgbWFwUHJvcCA9IHtcclxuICAgICAgICAgICAgY2VudGVyOiBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKDMzLjU3MzA5LCAtNy42Mjg2OTc5KSxcclxuICAgICAgICAgICAgbWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQuUk9BRE1BUCxcclxuICAgICAgICAgICAgem9vbTogMTQsXHJcbiAgICAgICAgICAgIG1hcFR5cGVDb250cm9sOiBmYWxzZSxcclxuICAgICAgICAgICAgZnVsbHNjcmVlbkNvbnRyb2w6IGZhbHNlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB2YXIgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChtYXBIb2xkZXIsIG1hcFByb3ApXHJcblxyXG4gICAgICAgICAgYmluZE1hcmtlcnMobWFwLCBkYXRhKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgLy8gJC5nZXRKU09OKCdodHRwOi8vbG9jYWxob3N0OjkwMDAvZGF0YS5qc29uJywgcHJvY2Vzc01hcClcclxuICBwcm9jZXNzTWFwKGRhdGEpXHJcbn1cclxuIiwiaW1wb3J0IERhdGVGaWx0ZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9kYXRlLWZpbHRlci9pbmRleC5qcydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgdGFnRmlsdGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNtZWRpYWNlbnRlci1maWx0ZXJzIGEnKVxyXG4gIGxldCBtZWRpYWNlbnRlckhvbGRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtZWRpYWNlbnRlci1ob2xkZXInKVxyXG4gIGxldCBzdGFydERhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3RhcnQnKVxyXG4gIGxldCBlbmREYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVuZCcpXHJcbiAgbGV0IGFsbEZpbHRlckJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtZWRpYWNlbnRlci1maWx0ZXItYWxsJylcclxuXHJcbiAgaWYgKHRhZ0ZpbHRlcnMubGVuZ3RoIDw9IDAgfHwgIW1lZGlhY2VudGVySG9sZGVyKSByZXR1cm5cclxuXHJcbiAgbGV0IHN0YXRlID0ge1xyXG4gICAgZmlsdGVyczogW10sXHJcbiAgICBkYXRlRmlsdGVyOiB7XHJcbiAgICAgIGZyb206ICcnLFxyXG4gICAgICB0bzogJydcclxuICAgIH0sXHJcbiAgICBvcmRlcjogJ2Rlc2MnLFxyXG4gICAgbWF4OiAzLFxyXG4gICAgZGF0YTogW1xyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRScsICdFTlRSRVBSRU5BUklBVCddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8wNy8yMDE3JyxcclxuICAgICAgICB0aXRsZTogJ0hJU1RPSVJFUyBQT1BVTEFJUkVTJyxcclxuICAgICAgICBjb250ZW50OiBgTGEgY2FtcGFnbmUg4oCcSGlzdG9pcmVzIHBvcHVsYWlyZXPigJ0gYWRvcHRlIHVuZSBkw6ltYXJjaGUgZW5jb3JlIHBsdXMgcHJvY2hlIGRlcyBwcsOpb2NjdXBhdGlvbnMgZGVzIGdlbnMgOiBjZSBzb250IGRlcyBoaXN0b2lyZXNcclxuICAgICAgICAgICAgICAgIHLDqWVsbGVzIGRlIE1hcm9jYWlucyBpc3N1cyBkZSB0b3V0ZXMgbGVzIGNsYXNzZXMgc29jaWFsZXMgZXQgcXVpIG9udCByw6l1c3NpIMOgIGF0dGVpbmRyZSBsZXVycyBvYmplY3RpZnMgZGFuc1xyXG4gICAgICAgICAgICAgICAgZGlmZsOpcmVudHMgc2VjdGV1cnMgZGUgbGEgdmllIGdyw6JjZSBhdSBzb3V0aWVuIGRlIGxldXIgYmFucXVlLmAsXHJcbiAgICAgICAgaW1hZ2U6ICdhc3NldHMvaW1nL21lZGlhLWltZy5wbmcnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0aXRsZTogJ0hJU1RPSVJFUyBQT1BVTEFJUkVTJyxcclxuICAgICAgICB0YWdzOiBbJ1JTRSddLFxyXG4gICAgICAgIGRhdGU6ICcyOS8wNy8yMDE3JyxcclxuICAgICAgICBjb250ZW50OiBgTGEgY2FtcGFnbmUg4oCcSGlzdG9pcmVzIHBvcHVsYWlyZXPigJ0gYWRvcHRlIHVuZSBkw6ltYXJjaGUgZW5jb3JlIHBsdXMgcHJvY2hlIGRlcyBwcsOpb2NjdXBhdGlvbnMgZGVzIGdlbnMgOiBjZSBzb250IGRlcyBoaXN0b2lyZXNcclxuICAgICAgICByw6llbGxlcyBkZSBNYXJvY2FpbnMgaXNzdXMgZGUgdG91dGVzIGxlcyBjbGFzc2VzIHNvY2lhbGVzIGV0IHF1aSBvbnQgcsOpdXNzaSDDoCBhdHRlaW5kcmUgbGV1cnMgb2JqZWN0aWZzIGRhbnNcclxuICAgICAgICBkaWZmw6lyZW50cyBzZWN0ZXVycyBkZSBsYSB2aWUgZ3LDomNlIGF1IHNvdXRpZW4gZGUgbGV1ciBiYW5xdWUuYCxcclxuICAgICAgICBpbWFnZTogJ2Fzc2V0cy9pbWcvbWVkaWEtaW1nLnBuZydcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0VOVFJFUFJFTkFSSUFUJ10sXHJcbiAgICAgICAgZGF0ZTogJzIyLzA3LzIwMTcnLFxyXG4gICAgICAgIHRpdGxlOiAnSElTVE9JUkVTIFBPUFVMQUlSRVMnLFxyXG4gICAgICAgIGNvbnRlbnQ6IGBMYSBjYW1wYWduZSDigJxIaXN0b2lyZXMgcG9wdWxhaXJlc+KAnSBhZG9wdGUgdW5lIGTDqW1hcmNoZSBlbmNvcmUgcGx1cyBwcm9jaGUgZGVzIHByw6lvY2N1cGF0aW9ucyBkZXMgZ2VucyA6IGNlIHNvbnQgZGVzIGhpc3RvaXJlc1xyXG4gICAgICAgICAgICAgICAgcsOpZWxsZXMgZGUgTWFyb2NhaW5zIGlzc3VzIGRlIHRvdXRlcyBsZXMgY2xhc3NlcyBzb2NpYWxlcyBldCBxdWkgb250IHLDqXVzc2kgw6AgYXR0ZWluZHJlIGxldXJzIG9iamVjdGlmcyBkYW5zXHJcbiAgICAgICAgICAgICAgICBkaWZmw6lyZW50cyBzZWN0ZXVycyBkZSBsYSB2aWUgZ3LDomNlIGF1IHNvdXRpZW4gZGUgbGV1ciBiYW5xdWUuYCxcclxuICAgICAgICBpbWFnZTogJ2Fzc2V0cy9pbWcvbWVkaWEtaW1nLnBuZydcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0RFVkVMT1BQRU1FTlQgRFVSQUJMRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMy8wNy8yMDE3JyxcclxuICAgICAgICB0aXRsZTogJ0hJU1RPSVJFUyBQT1BVTEFJUkVTJyxcclxuICAgICAgICBjb250ZW50OiBgTGEgY2FtcGFnbmUg4oCcSGlzdG9pcmVzIHBvcHVsYWlyZXPigJ0gYWRvcHRlIHVuZSBkw6ltYXJjaGUgZW5jb3JlIHBsdXMgcHJvY2hlIGRlcyBwcsOpb2NjdXBhdGlvbnMgZGVzIGdlbnMgOiBjZSBzb250IGRlcyBoaXN0b2lyZXNcclxuICAgICAgICAgICAgICAgIHLDqWVsbGVzIGRlIE1hcm9jYWlucyBpc3N1cyBkZSB0b3V0ZXMgbGVzIGNsYXNzZXMgc29jaWFsZXMgZXQgcXVpIG9udCByw6l1c3NpIMOgIGF0dGVpbmRyZSBsZXVycyBvYmplY3RpZnMgZGFuc1xyXG4gICAgICAgICAgICAgICAgZGlmZsOpcmVudHMgc2VjdGV1cnMgZGUgbGEgdmllIGdyw6JjZSBhdSBzb3V0aWVuIGRlIGxldXIgYmFucXVlLmAsXHJcbiAgICAgICAgaW1hZ2U6ICdhc3NldHMvaW1nL21lZGlhLWltZy5wbmcnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0YWdzOiBbJ1JTRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8wNy8yMDE3JyxcclxuICAgICAgICB0aXRsZTogJ0hJU1RPSVJFUyBQT1BVTEFJUkVTJyxcclxuICAgICAgICBjb250ZW50OiBgTGEgY2FtcGFnbmUg4oCcSGlzdG9pcmVzIHBvcHVsYWlyZXPigJ0gYWRvcHRlIHVuZSBkw6ltYXJjaGUgZW5jb3JlIHBsdXMgcHJvY2hlIGRlcyBwcsOpb2NjdXBhdGlvbnMgZGVzIGdlbnMgOiBjZSBzb250IGRlcyBoaXN0b2lyZXNcclxuICAgICAgICAgICAgICAgIHLDqWVsbGVzIGRlIE1hcm9jYWlucyBpc3N1cyBkZSB0b3V0ZXMgbGVzIGNsYXNzZXMgc29jaWFsZXMgZXQgcXVpIG9udCByw6l1c3NpIMOgIGF0dGVpbmRyZSBsZXVycyBvYmplY3RpZnMgZGFuc1xyXG4gICAgICAgICAgICAgICAgZGlmZsOpcmVudHMgc2VjdGV1cnMgZGUgbGEgdmllIGdyw6JjZSBhdSBzb3V0aWVuIGRlIGxldXIgYmFucXVlLmAsXHJcbiAgICAgICAgaW1hZ2U6ICdhc3NldHMvaW1nL21lZGlhLWltZy5wbmcnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJ10sXHJcbiAgICAgICAgZGF0ZTogJzI0LzA3LzIwMTcnLFxyXG4gICAgICAgIHRpdGxlOiAnSElTVE9JUkVTIFBPUFVMQUlSRVMnLFxyXG4gICAgICAgIGNvbnRlbnQ6IGBMYSBjYW1wYWduZSDigJxIaXN0b2lyZXMgcG9wdWxhaXJlc+KAnSBhZG9wdGUgdW5lIGTDqW1hcmNoZSBlbmNvcmUgcGx1cyBwcm9jaGUgZGVzIHByw6lvY2N1cGF0aW9ucyBkZXMgZ2VucyA6IGNlIHNvbnQgZGVzIGhpc3RvaXJlc1xyXG4gICAgICAgICAgICAgICAgcsOpZWxsZXMgZGUgTWFyb2NhaW5zIGlzc3VzIGRlIHRvdXRlcyBsZXMgY2xhc3NlcyBzb2NpYWxlcyBldCBxdWkgb250IHLDqXVzc2kgw6AgYXR0ZWluZHJlIGxldXJzIG9iamVjdGlmcyBkYW5zXHJcbiAgICAgICAgICAgICAgICBkaWZmw6lyZW50cyBzZWN0ZXVycyBkZSBsYSB2aWUgZ3LDomNlIGF1IHNvdXRpZW4gZGUgbGV1ciBiYW5xdWUuYCxcclxuICAgICAgICBpbWFnZTogJ2Fzc2V0cy9pbWcvbWVkaWEtaW1nLnBuZydcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0ZJTkFOQ0UnXSxcclxuICAgICAgICBkYXRlOiAnMjUvMDcvMjAxNycsXHJcbiAgICAgICAgdGl0bGU6ICdISVNUT0lSRVMgUE9QVUxBSVJFUycsXHJcbiAgICAgICAgY29udGVudDogYExhIGNhbXBhZ25lIOKAnEhpc3RvaXJlcyBwb3B1bGFpcmVz4oCdIGFkb3B0ZSB1bmUgZMOpbWFyY2hlIGVuY29yZSBwbHVzIHByb2NoZSBkZXMgcHLDqW9jY3VwYXRpb25zIGRlcyBnZW5zIDogY2Ugc29udCBkZXMgaGlzdG9pcmVzXHJcbiAgICAgICAgICAgICAgICByw6llbGxlcyBkZSBNYXJvY2FpbnMgaXNzdXMgZGUgdG91dGVzIGxlcyBjbGFzc2VzIHNvY2lhbGVzIGV0IHF1aSBvbnQgcsOpdXNzaSDDoCBhdHRlaW5kcmUgbGV1cnMgb2JqZWN0aWZzIGRhbnNcclxuICAgICAgICAgICAgICAgIGRpZmbDqXJlbnRzIHNlY3RldXJzIGRlIGxhIHZpZSBncsOiY2UgYXUgc291dGllbiBkZSBsZXVyIGJhbnF1ZS5gLFxyXG4gICAgICAgIGltYWdlOiAnYXNzZXRzL2ltZy9tZWRpYS1pbWcucG5nJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnXSxcclxuICAgICAgICBkYXRlOiAnMjYvMDcvMjAxNycsXHJcbiAgICAgICAgdGl0bGU6ICdISVNUT0lSRVMgUE9QVUxBSVJFUycsXHJcbiAgICAgICAgY29udGVudDogYExhIGNhbXBhZ25lIOKAnEhpc3RvaXJlcyBwb3B1bGFpcmVz4oCdIGFkb3B0ZSB1bmUgZMOpbWFyY2hlIGVuY29yZSBwbHVzIHByb2NoZSBkZXMgcHLDqW9jY3VwYXRpb25zIGRlcyBnZW5zIDogY2Ugc29udCBkZXMgaGlzdG9pcmVzXHJcbiAgICAgICAgICAgICAgICByw6llbGxlcyBkZSBNYXJvY2FpbnMgaXNzdXMgZGUgdG91dGVzIGxlcyBjbGFzc2VzIHNvY2lhbGVzIGV0IHF1aSBvbnQgcsOpdXNzaSDDoCBhdHRlaW5kcmUgbGV1cnMgb2JqZWN0aWZzIGRhbnNcclxuICAgICAgICAgICAgICAgIGRpZmbDqXJlbnRzIHNlY3RldXJzIGRlIGxhIHZpZSBncsOiY2UgYXUgc291dGllbiBkZSBsZXVyIGJhbnF1ZS5gLFxyXG4gICAgICAgIGltYWdlOiAnYXNzZXRzL2ltZy9tZWRpYS1pbWcucG5nJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8wNy8yMDE3JyxcclxuICAgICAgICB0aXRsZTogJ0hJU1RPSVJFUyBQT1BVTEFJUkVTJyxcclxuICAgICAgICBjb250ZW50OiBgTGEgY2FtcGFnbmUg4oCcSGlzdG9pcmVzIHBvcHVsYWlyZXPigJ0gYWRvcHRlIHVuZSBkw6ltYXJjaGUgZW5jb3JlIHBsdXMgcHJvY2hlIGRlcyBwcsOpb2NjdXBhdGlvbnMgZGVzIGdlbnMgOiBjZSBzb250IGRlcyBoaXN0b2lyZXNcclxuICAgICAgICAgICAgICAgIHLDqWVsbGVzIGRlIE1hcm9jYWlucyBpc3N1cyBkZSB0b3V0ZXMgbGVzIGNsYXNzZXMgc29jaWFsZXMgZXQgcXVpIG9udCByw6l1c3NpIMOgIGF0dGVpbmRyZSBsZXVycyBvYmplY3RpZnMgZGFuc1xyXG4gICAgICAgICAgICAgICAgZGlmZsOpcmVudHMgc2VjdGV1cnMgZGUgbGEgdmllIGdyw6JjZSBhdSBzb3V0aWVuIGRlIGxldXIgYmFucXVlLmAsXHJcbiAgICAgICAgaW1hZ2U6ICdhc3NldHMvaW1nL21lZGlhLWltZy5wbmcnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJ10sXHJcbiAgICAgICAgZGF0ZTogJzIxLzA4LzIwMTcnLFxyXG4gICAgICAgIHRpdGxlOiAnSElTVE9JUkVTIFBPUFVMQUlSRVMnLFxyXG4gICAgICAgIGNvbnRlbnQ6IGBMYSBjYW1wYWduZSDigJxIaXN0b2lyZXMgcG9wdWxhaXJlc+KAnSBhZG9wdGUgdW5lIGTDqW1hcmNoZSBlbmNvcmUgcGx1cyBwcm9jaGUgZGVzIHByw6lvY2N1cGF0aW9ucyBkZXMgZ2VucyA6IGNlIHNvbnQgZGVzIGhpc3RvaXJlc1xyXG4gICAgICAgICAgICAgICAgcsOpZWxsZXMgZGUgTWFyb2NhaW5zIGlzc3VzIGRlIHRvdXRlcyBsZXMgY2xhc3NlcyBzb2NpYWxlcyBldCBxdWkgb250IHLDqXVzc2kgw6AgYXR0ZWluZHJlIGxldXJzIG9iamVjdGlmcyBkYW5zXHJcbiAgICAgICAgICAgICAgICBkaWZmw6lyZW50cyBzZWN0ZXVycyBkZSBsYSB2aWUgZ3LDomNlIGF1IHNvdXRpZW4gZGUgbGV1ciBiYW5xdWUuYCxcclxuICAgICAgICBpbWFnZTogJ2Fzc2V0cy9pbWcvbWVkaWEtaW1nLnBuZydcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRhZ3M6IFsnUlNFJ10sXHJcbiAgICAgICAgZGF0ZTogJzIyLzA4LzIwMTYnLFxyXG4gICAgICAgIHRpdGxlOiAnSElTVE9JUkVTIFBPUFVMQUlSRVMnLFxyXG4gICAgICAgIGNvbnRlbnQ6IGBMYSBjYW1wYWduZSDigJxIaXN0b2lyZXMgcG9wdWxhaXJlc+KAnSBhZG9wdGUgdW5lIGTDqW1hcmNoZSBlbmNvcmUgcGx1cyBwcm9jaGUgZGVzIHByw6lvY2N1cGF0aW9ucyBkZXMgZ2VucyA6IGNlIHNvbnQgZGVzIGhpc3RvaXJlc1xyXG4gICAgICAgICAgICAgICAgcsOpZWxsZXMgZGUgTWFyb2NhaW5zIGlzc3VzIGRlIHRvdXRlcyBsZXMgY2xhc3NlcyBzb2NpYWxlcyBldCBxdWkgb250IHLDqXVzc2kgw6AgYXR0ZWluZHJlIGxldXJzIG9iamVjdGlmcyBkYW5zXHJcbiAgICAgICAgICAgICAgICBkaWZmw6lyZW50cyBzZWN0ZXVycyBkZSBsYSB2aWUgZ3LDomNlIGF1IHNvdXRpZW4gZGUgbGV1ciBiYW5xdWUuYCxcclxuICAgICAgICBpbWFnZTogJ2Fzc2V0cy9pbWcvbWVkaWEtaW1nLnBuZydcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0ZJTkFOQ0UnXSxcclxuICAgICAgICBkYXRlOiAnMjEvMDkvMjAxNycsXHJcbiAgICAgICAgdGl0bGU6ICdISVNUT0lSRVMgUE9QVUxBSVJFUycsXHJcbiAgICAgICAgY29udGVudDogYExhIGNhbXBhZ25lIOKAnEhpc3RvaXJlcyBwb3B1bGFpcmVz4oCdIGFkb3B0ZSB1bmUgZMOpbWFyY2hlIGVuY29yZSBwbHVzIHByb2NoZSBkZXMgcHLDqW9jY3VwYXRpb25zIGRlcyBnZW5zIDogY2Ugc29udCBkZXMgaGlzdG9pcmVzXHJcbiAgICAgICAgICAgICAgICByw6llbGxlcyBkZSBNYXJvY2FpbnMgaXNzdXMgZGUgdG91dGVzIGxlcyBjbGFzc2VzIHNvY2lhbGVzIGV0IHF1aSBvbnQgcsOpdXNzaSDDoCBhdHRlaW5kcmUgbGV1cnMgb2JqZWN0aWZzIGRhbnNcclxuICAgICAgICAgICAgICAgIGRpZmbDqXJlbnRzIHNlY3RldXJzIGRlIGxhIHZpZSBncsOiY2UgYXUgc291dGllbiBkZSBsZXVyIGJhbnF1ZS5gLFxyXG4gICAgICAgIGltYWdlOiAnYXNzZXRzL2ltZy9tZWRpYS1pbWcucG5nJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8xMC8yMDE3JyxcclxuICAgICAgICB0aXRsZTogJ0hJU1RPSVJFUyBQT1BVTEFJUkVTJyxcclxuICAgICAgICBjb250ZW50OiBgTGEgY2FtcGFnbmUg4oCcSGlzdG9pcmVzIHBvcHVsYWlyZXPigJ0gYWRvcHRlIHVuZSBkw6ltYXJjaGUgZW5jb3JlIHBsdXMgcHJvY2hlIGRlcyBwcsOpb2NjdXBhdGlvbnMgZGVzIGdlbnMgOiBjZSBzb250IGRlcyBoaXN0b2lyZXNcclxuICAgICAgICAgICAgICAgIHLDqWVsbGVzIGRlIE1hcm9jYWlucyBpc3N1cyBkZSB0b3V0ZXMgbGVzIGNsYXNzZXMgc29jaWFsZXMgZXQgcXVpIG9udCByw6l1c3NpIMOgIGF0dGVpbmRyZSBsZXVycyBvYmplY3RpZnMgZGFuc1xyXG4gICAgICAgICAgICAgICAgZGlmZsOpcmVudHMgc2VjdGV1cnMgZGUgbGEgdmllIGdyw6JjZSBhdSBzb3V0aWVuIGRlIGxldXIgYmFucXVlLmAsXHJcbiAgICAgICAgaW1hZ2U6ICdhc3NldHMvaW1nL21lZGlhLWltZy5wbmcnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJ10sXHJcbiAgICAgICAgZGF0ZTogJzIxLzA3LzIwMTgnLFxyXG4gICAgICAgIHRpdGxlOiAnSElTVE9JUkVTIFBPUFVMQUlSRVMnLFxyXG4gICAgICAgIGNvbnRlbnQ6IGBMYSBjYW1wYWduZSDigJxIaXN0b2lyZXMgcG9wdWxhaXJlc+KAnSBhZG9wdGUgdW5lIGTDqW1hcmNoZSBlbmNvcmUgcGx1cyBwcm9jaGUgZGVzIHByw6lvY2N1cGF0aW9ucyBkZXMgZ2VucyA6IGNlIHNvbnQgZGVzIGhpc3RvaXJlc1xyXG4gICAgICAgICAgICAgICAgcsOpZWxsZXMgZGUgTWFyb2NhaW5zIGlzc3VzIGRlIHRvdXRlcyBsZXMgY2xhc3NlcyBzb2NpYWxlcyBldCBxdWkgb250IHLDqXVzc2kgw6AgYXR0ZWluZHJlIGxldXJzIG9iamVjdGlmcyBkYW5zXHJcbiAgICAgICAgICAgICAgICBkaWZmw6lyZW50cyBzZWN0ZXVycyBkZSBsYSB2aWUgZ3LDomNlIGF1IHNvdXRpZW4gZGUgbGV1ciBiYW5xdWUuYCxcclxuICAgICAgICBpbWFnZTogJ2Fzc2V0cy9pbWcvbWVkaWEtaW1nLnBuZydcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRhZ3M6IFsnUlNFJywgJ0ZJTkFOQ0UnXSxcclxuICAgICAgICBkYXRlOiAnMjEvMDcvMjAxOCcsXHJcbiAgICAgICAgdGl0bGU6ICdISVNUT0lSRVMgUE9QVUxBSVJFUycsXHJcbiAgICAgICAgY29udGVudDogYExhIGNhbXBhZ25lIOKAnEhpc3RvaXJlcyBwb3B1bGFpcmVz4oCdIGFkb3B0ZSB1bmUgZMOpbWFyY2hlIGVuY29yZSBwbHVzIHByb2NoZSBkZXMgcHLDqW9jY3VwYXRpb25zIGRlcyBnZW5zIDogY2Ugc29udCBkZXMgaGlzdG9pcmVzXHJcbiAgICAgICAgICAgICAgICByw6llbGxlcyBkZSBNYXJvY2FpbnMgaXNzdXMgZGUgdG91dGVzIGxlcyBjbGFzc2VzIHNvY2lhbGVzIGV0IHF1aSBvbnQgcsOpdXNzaSDDoCBhdHRlaW5kcmUgbGV1cnMgb2JqZWN0aWZzIGRhbnNcclxuICAgICAgICAgICAgICAgIGRpZmbDqXJlbnRzIHNlY3RldXJzIGRlIGxhIHZpZSBncsOiY2UgYXUgc291dGllbiBkZSBsZXVyIGJhbnF1ZS5gLFxyXG4gICAgICAgIGltYWdlOiAnYXNzZXRzL2ltZy9tZWRpYS1pbWcucG5nJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFnczogWydSU0UnLCAnRklOQU5DRSddLFxyXG4gICAgICAgIGRhdGU6ICcyMS8wNy8yMDE5JyxcclxuICAgICAgICB0aXRsZTogJ0hJU1RPSVJFUyBQT1BVTEFJUkVTJyxcclxuICAgICAgICBjb250ZW50OiBgTGEgY2FtcGFnbmUg4oCcSGlzdG9pcmVzIHBvcHVsYWlyZXPigJ0gYWRvcHRlIHVuZSBkw6ltYXJjaGUgZW5jb3JlIHBsdXMgcHJvY2hlIGRlcyBwcsOpb2NjdXBhdGlvbnMgZGVzIGdlbnMgOiBjZSBzb250IGRlcyBoaXN0b2lyZXNcclxuICAgICAgICAgICAgICAgIHLDqWVsbGVzIGRlIE1hcm9jYWlucyBpc3N1cyBkZSB0b3V0ZXMgbGVzIGNsYXNzZXMgc29jaWFsZXMgZXQgcXVpIG9udCByw6l1c3NpIMOgIGF0dGVpbmRyZSBsZXVycyBvYmplY3RpZnMgZGFuc1xyXG4gICAgICAgICAgICAgICAgZGlmZsOpcmVudHMgc2VjdGV1cnMgZGUgbGEgdmllIGdyw6JjZSBhdSBzb3V0aWVuIGRlIGxldXIgYmFucXVlLmAsXHJcbiAgICAgICAgaW1hZ2U6ICdhc3NldHMvaW1nL21lZGlhLWltZy5wbmcnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0YWdzOiBbJ1JTRScsICdGSU5BTkNFJ10sXHJcbiAgICAgICAgZGF0ZTogJzIxLzA3LzIwMjAnLFxyXG4gICAgICAgIHRpdGxlOiAnSElTVE9JUkVTIFBPUFVMQUlSRVMnLFxyXG4gICAgICAgIGNvbnRlbnQ6IGBMYSBjYW1wYWduZSDigJxIaXN0b2lyZXMgcG9wdWxhaXJlc+KAnSBhZG9wdGUgdW5lIGTDqW1hcmNoZSBlbmNvcmUgcGx1cyBwcm9jaGUgZGVzIHByw6lvY2N1cGF0aW9ucyBkZXMgZ2VucyA6IGNlIHNvbnQgZGVzIGhpc3RvaXJlc1xyXG4gICAgICAgICAgICAgICAgcsOpZWxsZXMgZGUgTWFyb2NhaW5zIGlzc3VzIGRlIHRvdXRlcyBsZXMgY2xhc3NlcyBzb2NpYWxlcyBldCBxdWkgb250IHLDqXVzc2kgw6AgYXR0ZWluZHJlIGxldXJzIG9iamVjdGlmcyBkYW5zXHJcbiAgICAgICAgICAgICAgICBkaWZmw6lyZW50cyBzZWN0ZXVycyBkZSBsYSB2aWUgZ3LDomNlIGF1IHNvdXRpZW4gZGUgbGV1ciBiYW5xdWUuYCxcclxuICAgICAgICBpbWFnZTogJ2Fzc2V0cy9pbWcvbWVkaWEtaW1nLnBuZydcclxuICAgICAgfVxyXG4gICAgXVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY2xlYW5UYWcgKHRhZ0ZpbHRlcikge1xyXG4gICAgdGFnRmlsdGVyID0gdGFnRmlsdGVyLnRvTG93ZXJDYXNlKClcclxuICAgIGlmICh0YWdGaWx0ZXJbMF0gPT0gJyMnKSB7XHJcbiAgICAgIHRhZ0ZpbHRlciA9IHRhZ0ZpbHRlci5zbGljZSgxKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0YWdGaWx0ZXJcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG1ha2VEYXRlT2JqZWN0IChkYXRlU3RyaW5nKSB7XHJcbiAgICBsZXQgW2RheSwgbW9udGgsIHllYXJdID0gZGF0ZVN0cmluZy5zcGxpdCgnLycpXHJcblxyXG4gICAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoIC0gMSwgZGF5KVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYXBwbHlGaWx0ZXJzICgpIHtcclxuICAgIGxldCBkYXRhID0gc3RhdGUuZGF0YVxyXG4gICAgaWYgKHN0YXRlLmZpbHRlcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICBkYXRhID0gZGF0YS5maWx0ZXIocG9zdCA9PiB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGF0ZS5maWx0ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAocG9zdC50YWdzLmluY2x1ZGVzKHN0YXRlLmZpbHRlcnNbaV0udG9VcHBlckNhc2UoKSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHN0YXRlLmRhdGVGaWx0ZXIuZnJvbSAmJiBzdGF0ZS5kYXRlRmlsdGVyLnRvKSB7XHJcbiAgICAgIGRhdGEgPSBkYXRhLmZpbHRlcihwb3N0ID0+IHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICBtYWtlRGF0ZU9iamVjdChwb3N0LmRhdGUpIC0gbWFrZURhdGVPYmplY3Qoc3RhdGUuZGF0ZUZpbHRlci5mcm9tKSA+PVxyXG4gICAgICAgICAgICAwICYmXHJcbiAgICAgICAgICBtYWtlRGF0ZU9iamVjdChwb3N0LmRhdGUpIC0gbWFrZURhdGVPYmplY3Qoc3RhdGUuZGF0ZUZpbHRlci50bykgPD0gMFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGRhdGEgPSBkYXRhLnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgcmV0dXJuIHN0YXRlLm9yZGVyID09ICdkZXNjJ1xyXG4gICAgICAgID8gbWFrZURhdGVPYmplY3QoYi5kYXRlKSAtIG1ha2VEYXRlT2JqZWN0KGEuZGF0ZSlcclxuICAgICAgICA6IG1ha2VEYXRlT2JqZWN0KGEuZGF0ZSkgLSBtYWtlRGF0ZU9iamVjdChiLmRhdGUpXHJcbiAgICB9KVxyXG5cclxuICAgIHNob3dTZWxlY3RlZChkYXRhKVxyXG4gIH1cclxuICBmdW5jdGlvbiBjaGFuZ2VGaWx0ZXJzIChlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuXHJcbiAgICB0aGlzLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpXHJcblxyXG4gICAgc3RhdGUuZmlsdGVycyA9IFtdXHJcblxyXG4gICAgdGFnRmlsdGVycy5mb3JFYWNoKGZ1bmN0aW9uICh0YWcpIHtcclxuICAgICAgaWYgKCQodGFnKS5oYXNDbGFzcygnYWN0aXZlJykpIHtcclxuICAgICAgICBzdGF0ZS5maWx0ZXJzLnB1c2goY2xlYW5UYWcodGFnLmlubmVyVGV4dCkpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgaWYgKHN0YXRlLmZpbHRlcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICBhbGxGaWx0ZXJCdG4uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFsbEZpbHRlckJ0bi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5RmlsdGVycygpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzaG93U2VsZWN0ZWQgKGRhdGEpIHtcclxuICAgIGxldCBzZWxlY3RlZERhdGEgPSBkYXRhLnNsaWNlKDAsIHN0YXRlLm1heCAqIDMpXHJcblxyXG4gICAgY29uc29sZS5sb2coZGF0YS5sZW5ndGgpXHJcbiAgICBjb25zb2xlLmxvZyhzZWxlY3RlZERhdGEubGVuZ3RoKVxyXG5cclxuICAgIGlmIChzZWxlY3RlZERhdGEubGVuZ3RoID49IGRhdGEubGVuZ3RoKSB7XHJcbiAgICAgICQoJyNtb3JlLW1lZGlhY2VudGVyJykuaGlkZSgpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkKCcjbW9yZS1tZWRpYWNlbnRlcicpLnNob3coKVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcihzZWxlY3RlZERhdGEpXHJcbiAgfVxyXG5cclxuICBhcHBseUZpbHRlcnMoKVxyXG5cclxuICAkKCcjbW9yZS1tZWRpYWNlbnRlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIHN0YXRlLm1heCsrXHJcbiAgICBhcHBseUZpbHRlcnMoKVxyXG5cclxuICAgIHRoaXMuc2Nyb2xsSW50b1ZpZXcoe1xyXG4gICAgICBiZWhhdmlvcjogJ3Ntb290aCcsXHJcbiAgICAgIGlubGluZTogJ2VuZCdcclxuICAgIH0pXHJcbiAgICBpZiAoc3RhdGUubWF4ICsgMSA+IHN0YXRlLmRhdGEubGVuZ3RoIC8gMykgJCh0aGlzKS5oaWRlKClcclxuICB9KVxyXG5cclxuICBmdW5jdGlvbiByZW5kZXIgKGRhdGEpIHtcclxuICAgIG1lZGlhY2VudGVySG9sZGVyLmlubmVySFRNTCA9IGRhdGFcclxuICAgICAgLm1hcCgocG9zdCwgaW5kZXgpID0+IHtcclxuICAgICAgICBpZiAoaW5kZXggJSAyID09PSAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJtZWRpYS1jYXJkIG15LTggXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImNvbC1tZC01IG1lZGlhLWNhcmRfX2ltZ3NpZGVcIiBocmVmPVwiL2dicC1mcm9udC9tZWRpYWNlbnRlci1kZXRhaWwuaHRtbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBjbGFzcz1cIm1lZGlhLWNhcmRfX2ltZ1wiIHNyYz1cIiR7cG9zdC5pbWFnZX1cIiBhbHQ9XCJtZWRpYSBpbWFnZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtNyBtZWRpYS1jYXJkX19jb250ZW50c2lkZSBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLW1lZGlhX190YWcgXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3Bvc3QudGFnc1xyXG4gICAgICAgICAgICAubWFwKFxyXG4gICAgICAgICAgICAgIHRhZyA9PlxyXG4gICAgICAgICAgICAgICAgYDxhIGNsYXNzPVwiYnRuIGJ0bi0tdGFnIGJ0bi0tb3JhbmdlIGFjdGl2ZSBtci0xXCIgaHJlZj1cIi9nYnAtZnJvbnQvbWVkaWFjZW50ZXIuaHRtbFwiPiAjJHt0YWd9PC9hPmBcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAuam9pbignJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMiBjbGFzcz1cIm1lZGlhLWNhcmRfX3RpdGxlXCI+JHtwb3N0LnRpdGxlfTwvaDI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cIm1lZGlhLWNhcmRfX2NvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3Bvc3QuY29udGVudH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYS1jYXJkX19mb290ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1mb290ZXJfX21ldGFkYXRhXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmcgY2xhc3M9XCJjYXJkLWZvb3Rlcl9fZGF0ZXRpdGxlXCI+RGF0ZSBkZSBsYW5jZW1lbnQ8L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjYXJkLWZvb3Rlcl9fZGF0ZVwiPiR7cG9zdC5kYXRlfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1mb290ZXJfX2FjdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiL2dicC1mcm9udC9tZWRpYWNlbnRlci1kZXRhaWwuaHRtbFwiPkTDiUNPVVZSSVI8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5gXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cIm1lZGlhLWNhcmQgbWVkaWEtY2FyZC0tcmV2ZXJzZSBteS04XCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC03IG1lZGlhLWNhcmRfX2NvbnRlbnRzaWRlXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLW1lZGlhX190YWcgXCI+XHJcbiAgICAgICAgICAgICAgICAgICR7cG9zdC50YWdzXHJcbiAgICAgICAgICAgIC5tYXAoXHJcbiAgICAgICAgICAgICAgdGFnID0+XHJcbiAgICAgICAgICAgICAgICBgPGEgY2xhc3M9XCJidG4gYnRuLS10YWcgYnRuLS1vcmFuZ2UgYWN0aXZlIG1yLTFcIiBocmVmPVwiL2dicC1mcm9udC9tZWRpYWNlbnRlci5odG1sXCI+ICMke3RhZ308L2E+YFxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgIC5qb2luKCcnKX1cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxoMiBjbGFzcz1cIm1lZGlhLWNhcmRfX3RpdGxlXCI+JHtwb3N0LnRpdGxlfTwvaDI+XHJcbiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwibWVkaWEtY2FyZF9fY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAke3Bvc3QuY29udGVudH1cclxuICAgICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWEtY2FyZF9fZm9vdGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1mb290ZXJfX21ldGFkYXRhXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZyBjbGFzcz1cImNhcmQtZm9vdGVyX19kYXRldGl0bGVcIj5EYXRlIGRlIGxhbmNlbWVudDwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2FyZC1mb290ZXJfX2RhdGVcIj4ke3Bvc3QuZGF0ZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWZvb3Rlcl9fYWN0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIi9nYnAtZnJvbnQvbWVkaWFjZW50ZXItZGV0YWlsLmh0bWxcIj5Ew4lDT1VWUklSPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxhIGNsYXNzPVwiY29sLW1kLTUgbWVkaWEtY2FyZF9faW1nc2lkZVwiIGhyZWY9XCIvZ2JwLWZyb250L21lZGlhY2VudGVyLWRldGFpbC5odG1sXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3M9XCJtZWRpYS1jYXJkX19pbWdcIiBzcmM9XCIke3Bvc3QuaW1hZ2V9XCIgYWx0PVwibWVkaWEgaW1hZ2VcIj5cclxuICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+YFxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLmpvaW4oJycpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBkYXRlRm9ybWF0IChkYXRlKSB7XHJcbiAgICByZXR1cm4gYDEvJHtkYXRlLm1vbnRoKCkgKyAxfS8ke2RhdGUueWVhcigpfWBcclxuICB9XHJcblxyXG4gIGxldCBzdGFydEZpbHRlciA9IG5ldyBEYXRlRmlsdGVyKHN0YXJ0RGF0ZSwgZmFsc2UsIGZ1bmN0aW9uIChzdGFydCkge1xyXG4gICAgc3RhdGUuZGF0ZUZpbHRlci5mcm9tID0gZGF0ZUZvcm1hdChzdGFydClcclxuICAgIGFwcGx5RmlsdGVycygpXHJcbiAgfSlcclxuICBzdGFydEZpbHRlci5pbml0KClcclxuXHJcbiAgbGV0IGVuZEZpbHRlciA9IG5ldyBEYXRlRmlsdGVyKGVuZERhdGUsIHRydWUsIGZ1bmN0aW9uIChlbmQpIHtcclxuICAgIHN0YXRlLmRhdGVGaWx0ZXIudG8gPSBkYXRlRm9ybWF0KGVuZClcclxuICAgIGFwcGx5RmlsdGVycygpXHJcbiAgfSlcclxuICBlbmRGaWx0ZXIuaW5pdCgpXHJcblxyXG4gICQoJyNtZWRpYWNlbnRlci1zZWxlY3QtZmlsdGVyJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBzZWxlY3RlZCA9ICQoJyNtZWRpYWNlbnRlci1zZWxlY3QtZmlsdGVyJylcclxuICAgICAgLm5leHQoKVxyXG4gICAgICAuZmluZCgnLmN1cnJlbnQnKVxyXG4gICAgICAudGV4dCgpXHJcbiAgICBzZWxlY3RlZCA9IHNlbGVjdGVkLnRvTG93ZXJDYXNlKClcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZyhzZWxlY3RlZClcclxuXHJcbiAgICAkKCcjZGF0ZS1maWx0ZXInKS5hZGRDbGFzcygnZC1mbGV4JylcclxuICAgICQoJyNkYXRlLWZpbHRlcicpLnNob3coKVxyXG5cclxuICAgIGlmIChzZWxlY3RlZCAhPT0gJ3DDqXJpb2RlJykge1xyXG4gICAgICAkKCcjZGF0ZS1maWx0ZXInKS5yZW1vdmVDbGFzcygnZC1mbGV4JylcclxuICAgICAgJCgnI2RhdGUtZmlsdGVyJykuaGlkZSgpXHJcbiAgICAgIHN0YXRlLm9yZGVyID0gJ2Rlc2MnXHJcbiAgICAgIHN0YXRlLmRhdGVGaWx0ZXIuZnJvbSA9ICcnXHJcbiAgICAgIHN0YXRlLmRhdGVGaWx0ZXIudG8gPSAnJ1xyXG4gICAgICBzdGFydEZpbHRlci5jbGVhcigpXHJcbiAgICAgIGVuZEZpbHRlci5jbGVhcigpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNlbGVjdGVkID09PSAncGx1cyBhbmNpZW5zJykge1xyXG4gICAgICBzdGF0ZS5vcmRlciA9ICdhc2MnXHJcbiAgICAgIGFwcGx5RmlsdGVycygpXHJcbiAgICB9IGVsc2UgaWYgKHNlbGVjdGVkID09PSAncGx1cyByw6ljZW50cycpIHtcclxuICAgICAgYXBwbHlGaWx0ZXJzKClcclxuICAgICAgc3RhdGUub3JkZXIgPSAnZGVzYydcclxuICAgIH1cclxuICB9KVxyXG5cclxuICBhbGxGaWx0ZXJCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICBzdGF0ZS5maWx0ZXJzID0gW11cclxuICAgIHRhZ0ZpbHRlcnMuZm9yRWFjaCh0YWcgPT4ge1xyXG4gICAgICB0YWcuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgIH0pXHJcbiAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICBhcHBseUZpbHRlcnMoKVxyXG4gIH0pXHJcbiAgdGFnRmlsdGVycy5mb3JFYWNoKHRhZyA9PiB7XHJcbiAgICB0YWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjaGFuZ2VGaWx0ZXJzKVxyXG4gIH0pXHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgdmFyIHNsaWRlckluZGV4O1xyXG5cclxuICAgIGlmICgkKCcubm9zLWJhbnF1ZXMnKS5sZW5ndGgpIHtcclxuICAgICAgICBoYW5kbGVFdmVudExpc3RlbmVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkKCcubm9zLWJhbnF1ZXMgLm93bC1jYXJvdXNlbCcpLmxlbmd0aCkge1xyXG5cclxuICAgICAgICB2YXIgcnRsID0gJCgnaHRtbCcpLmF0dHIoJ2RpcicpID09ICdydGwnO1xyXG5cclxuICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA3NjgpIHtcclxuICAgICAgICAgICAgJCgnLm5vcy1iYW5xdWVzIC5vd2wtY2Fyb3VzZWwnKS5vd2xDYXJvdXNlbCgnZGVzdHJveScpO1xyXG4gICAgICAgICAgICBiYW5xdWVzU2xpZGVyKDAgLHJ0bCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJCgnLm5vcy1iYW5xdWVzIC5vd2wtY2Fyb3VzZWwnKS5vd2xDYXJvdXNlbCgnZGVzdHJveScpO1xyXG4gICAgICAgICAgICBiYW5xdWVzU2xpZGVyKDAsIHJ0bCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcbiAgICAgICAgICAgICAgICAkKCcubm9zLWJhbnF1ZXMgLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgICAgICAgICBiYW5xdWVzU2xpZGVyKDAsIHJ0bCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKCcubm9zLWJhbnF1ZXMgLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgICAgICAgICBiYW5xdWVzU2xpZGVyKDAsIHJ0bCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVtb3ZlSGFzaCAoKSB7IFxyXG4gICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKCcnLCBkb2N1bWVudC50aXRsZSwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYmFucXVlc1NsaWRlcihzdGFnZVBhZGRpbmcsIHJ0bCkge1xyXG4gICAgICAgIHZhciBvd2wgPSAkKCcubm9zLWJhbnF1ZXMgLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgc3RhZ2VQYWRkaW5nOiBzdGFnZVBhZGRpbmcsXHJcbiAgICAgICAgICAgIG1hcmdpbjogMCxcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgbmF2OiB0cnVlLFxyXG4gICAgICAgICAgICBsb29wOiB0cnVlLFxyXG4gICAgICAgICAgICBVUkxoYXNoTGlzdGVuZXI6IHRydWUsXHJcbiAgICAgICAgICAgIG5hdlNwZWVkOiAxMDAwLFxyXG4gICAgICAgICAgICBydGw6IHJ0bCxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZToge1xyXG4gICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAxXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG93bC5vbihcImRyYWcub3dsLmNhcm91c2VsXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoZXZlbnQucmVsYXRlZFRhcmdldFsnX2RyYWcnXVsnZGlyZWN0aW9uJ10pIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXhCZWZvcmVDaGFuZ2UgPSBldmVudC5wYWdlLmluZGV4O1xyXG5cclxuICAgICAgICAgICAgICAgIHNsaWRlckluZGV4ID0gaW5kZXhCZWZvcmVDaGFuZ2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG93bC5vbihcImRyYWdnZWQub3dsLmNhcm91c2VsXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgaW5kZXhBZnRlckNoYW5nZSA9IGV2ZW50LnBhZ2UuaW5kZXg7XHJcblxyXG4gICAgICAgICAgICBpZiAoZXZlbnQucmVsYXRlZFRhcmdldFsnX2RyYWcnXVsnZGlyZWN0aW9uJ10pIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXhBZnRlckNoYW5nZSAhPT0gc2xpZGVySW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQucmVsYXRlZFRhcmdldFsnX2RyYWcnXVsnZGlyZWN0aW9uJ10gPT09IFwibGVmdFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGV2ZW50KVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCgnLm93bC1uZXh0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIG5leHQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCgnLm93bC1wcmV2Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHByZXYoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbmV4dCgpIHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRJdGVtID0gJCgnLm5vcy1iYW5xdWVzX2xpbmtzIC5pdGVtLmFjdGl2ZScpO1xyXG5cclxuICAgICAgICAgICAgY3VycmVudEl0ZW0ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRJdGVtLmlzKCc6bGFzdC1jaGlsZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcubm9zLWJhbnF1ZXNfbGlua3MgLml0ZW06Zmlyc3QtY2hpbGQnKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50SXRlbS5uZXh0KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwcmV2KCkge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudEl0ZW0gPSAkKCcubm9zLWJhbnF1ZXNfbGlua3MgLml0ZW0uYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgICBjdXJyZW50SXRlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudEl0ZW0uaXMoJzpmaXJzdC1jaGlsZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcubm9zLWJhbnF1ZXNfbGlua3MgLml0ZW06bGFzdC1jaGlsZCcpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRJdGVtLnByZXYoKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGhhbmRsZUV2ZW50TGlzdGVuZXJzKCkge1xyXG5cclxuICAgICAgICAkKCcubm9zLWJhbnF1ZXNfbGlua3MgLml0ZW06Zmlyc3QtY2hpbGQnKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICQoJy5ub3MtYmFucXVlc19saW5rcyAuaXRlbScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIGNsaWNrZWRJdGVtID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghY2xpY2tlZEl0ZW0uaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcubm9zLWJhbnF1ZXNfbGlua3MgLml0ZW0uYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgY2xpY2tlZEl0ZW0uYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcblx0aWYoJCgnLmhlYWRlcl9zZWFyY2gnKS5sZW5ndGgpIHtcclxuXHRcdGFkZEV2ZW50TGlzdGVuZXJzKCk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBhZGRFdmVudExpc3RlbmVycyAoKSB7XHJcblx0XHQkKCcuaGVhZGVyX3NlYXJjaCwgLmhlYWRlcl9tb2JpbGUtc2VhcmNoJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHQkKCcucGFnZS1jb250ZW50JykuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xyXG5cdFx0XHQkKCcucG9wdXAtc2VhcmNoJykucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0JCgnLmNsb3NlLXdyYXBwZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCQoJy5wYWdlLWNvbnRlbnQnKS5yZW1vdmVDbGFzcygnZC1ub25lJyk7XHJcblx0XHRcdCQoJy5wb3B1cC1zZWFyY2gnKS5hZGRDbGFzcygnZC1ub25lJyk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQkKCcucG9wdXAtc2VhcmNoIC5idG4tLXRhZycpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdGlmKCQodGhpcykuaXMoJzpmaXJzdC1jaGlsZCcpKSB7XHJcblx0XHRcdFx0JCgnLnBvcHVwLXNlYXJjaCAuYnRuLS10YWc6bm90KDpmaXJzdC1jaGlsZCknKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdFx0JCh0aGlzKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JCgnLnBvcHVwLXNlYXJjaCAuYnRuLS10YWc6Zmlyc3QtY2hpbGQnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdFx0JCh0aGlzKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHR9KTtcclxuXHR9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcblx0aWYoJCgnLnN3aXBlYm94LS12aWRlbycpLmxlbmd0aCkge1xyXG5cdFx0YWRkRXZlbnRMaXN0ZW5lcnMoKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXJzICgpIHtcclxuXHRcdCQoJy5zd2lwZWJveC0tdmlkZW8nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCQoJy5wYWdlLWNvbnRlbnQnKS5hZGRDbGFzcygnZC1ub25lJyk7XHJcblx0XHRcdCQoJy5wb3B1cC12aWRlbycpLnJlbW92ZUNsYXNzKCdkLW5vbmUnKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdCQoJy5jbG9zZS13cmFwcGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHQkKCcucGFnZS1jb250ZW50JykucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpO1xyXG5cdFx0XHQkKCcucG9wdXAtdmlkZW9fc2VjdGlvbiBpZnJhbWUnKS5yZW1vdmUoKTtcclxuXHRcdFx0JCgnLnBvcHVwLXZpZGVvJykuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0JCgnLnN3aXBlYm94LS12aWRlbycpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdHZhciB5dGJJZCA9ICQodGhpcykuYXR0cignaHJlZicpO1xyXG5cclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRwbGF5VmlkZW8oeXRiSWQpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0JCgnLnBvcHVwLXZpZGVvX3NsaWRlciAuc3dpcGVib3gtLXZpZGVvJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0dmFyIHl0YklkID0gJCh0aGlzKS5hdHRyKCdocmVmJyk7XHJcblxyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdHBsYXlWaWRlbyh5dGJJZCk7XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBwbGF5VmlkZW8oeXRiSWQpIHtcclxuXHRcdFxyXG5cclxuXHRcdHZhciBodG1sID0gYDxpZnJhbWUgIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjQwMFwiIFxyXG5cdFx0XHRcdFx0XHRzcmM9XCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC8ke3l0YklkfT9hdXRvcGxheT0xXCIgXHJcblx0XHRcdFx0XHRcdGZyYW1lYm9yZGVyPVwiMFwiIGFsbG93PVwiYXV0b3BsYXk7IGVuY3J5cHRlZC1tZWRpYVwiIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT5gO1xyXG5cclxuXHRcdCQoJy5wb3B1cC12aWRlb19zZWN0aW9uIGlmcmFtZScpLnJlbW92ZSgpO1xyXG5cclxuXHRcdCQoJy5wb3B1cC12aWRlb19zZWN0aW9uJykucHJlcGVuZChodG1sKTtcclxuXHR9XHJcblxyXG5cdC8vIGNhcm91c2VsIHZpZGVvXHJcblx0aWYoJCgnLnBvcHVwLXZpZGVvX3NsaWRlcicpLmxlbmd0aCkge1xyXG5cclxuXHRcdHZhciBydGwgPSAkKCdodG1sJykuYXR0cignZGlyJykgPT0gJ3J0bCc7XHJcblxyXG5cdFx0aWYgKCQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XHJcblx0XHRcdHBvcHVwVmlkZW9TbGlkZXIoMCwgcnRsKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHBvcHVwVmlkZW9TbGlkZXIoMjAsIHJ0bCk7XHJcblx0XHR9XHJcblxyXG5cdFx0JCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xyXG5cdFx0XHRcdHBvcHVwVmlkZW9TbGlkZXIoMCwgcnRsKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRwb3B1cFZpZGVvU2xpZGVyKDIwLCBydGwpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHBvcHVwVmlkZW9TbGlkZXIoc3RhZ2VQYWRkaW5nLCBydGwpIHtcclxuICAgICAgICAkKCcucG9wdXAtdmlkZW9fc2xpZGVyLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgc3RhZ2VQYWRkaW5nOiBzdGFnZVBhZGRpbmcsXHJcbiAgICAgICAgICAgIG1hcmdpbjogMTAsXHJcbiAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICBuYXY6IGZhbHNlLFxyXG4gICAgICAgICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgICAgICAgcnRsOiBydGwsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHtcclxuICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogMVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIDc2ODoge1xyXG4gICAgICAgICAgICAgICAgXHRpdGVtczogNVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xyXG4gIGlmICgkKCcucHViLXNsaWRlcicpLmxlbmd0aCkge1xyXG4gICAgaWYgKCQod2luZG93KS53aWR0aCgpID4gOTkxKSB7XHJcbiAgICAgIGFydGljbGVTbGlkZXIoMClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFydGljbGVTbGlkZXIoMClcclxuICAgIH1cclxuXHJcbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpID4gOTkxKSB7XHJcbiAgICAgICAgYXJ0aWNsZVNsaWRlcigwKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFydGljbGVTbGlkZXIoMClcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFydGljbGVTbGlkZXIgKHN0YWdlUGFkZGluZykge1xyXG4gICAgJCgnLnB1Yi1zbGlkZXIub3dsLWNhcm91c2VsJykub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICBzdGFnZVBhZGRpbmc6IHN0YWdlUGFkZGluZyxcclxuICAgICAgbWFyZ2luOiAxOCxcclxuICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgbmF2OiB0cnVlLFxyXG4gICAgICBsb29wOiB0cnVlLFxyXG4gICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgMDoge1xyXG4gICAgICAgICAgaXRlbXM6IDFcclxuICAgICAgICB9LFxyXG4gICAgICAgIDk5Mjoge1xyXG4gICAgICAgICAgaXRlbXM6IDFcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuXHQkKCdzZWxlY3QubmljZS1zZWxlY3QnKS5uaWNlU2VsZWN0KCk7XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcblx0aWYgKCQoJy5zd2lwZWJveCcpLmxlbmd0aCkge1xyXG5cdFx0Ly8kKCcuc3dpcGVib3gnKS5zd2lwZWJveCgpO1xyXG5cdH1cclxuXHRcclxufSIsImV4cG9ydCBmdW5jdGlvbiB0cmFja2VyIChjYWxsYmFjaykge1xyXG4gIGxldCBlbG1udCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aW1lbGluZS1zZWxlY3RvcicpXHJcblxyXG4gIGlmICghZWxtbnQpIHJldHVybiBudWxsXHJcblxyXG4gIGxldCBkb3RzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbGluZV9kb3QnKVxyXG5cclxuICBjb25zdCBTSVpFID0gMTE0MCAvLyBzZXQgdGhlIHdpZHRoIG9mIHRoZSB0cmFja2VyXHJcblxyXG4gIGxldCBzdGVwID0gU0laRSAvIGRvdHMubGVuZ3RoXHJcbiAgY29uc3QgQkxPQ0tTSVpFID0gc3RlcFxyXG5cclxuICAkKCcubGluZV9kb3QnKS5jc3MoJ3dpZHRoJywgc3RlcCArICdweCcpXHJcbiAgJCgnI3RpbWVsaW5lLXNlbGVjdG9yJykuY3NzKCdsZWZ0Jywgc3RlcCAvIDIgLSAyMCArICdweCcpXHJcbiAgJCgnLnRpbWVsaW5lX2xpbmUgLmNvbnRhaW5lcicpLmFwcGVuZChcclxuICAgICc8ZGl2IGNsYXNzPVwidGltZWxpbmVfbGluZS1wcm9ncmVzc1wiPjxkaXYgY2xhc3M9XCJ0aW1lbGluZV9saW5lLWZpbGxcIj48L2Rpdj48L2Rpdj4nXHJcbiAgKVxyXG4gICQoJy50aW1lbGluZV9saW5lLXByb2dyZXNzJykuY3NzKCd3aWR0aCcsIFNJWkUgLSBCTE9DS1NJWkUgKyAncHgnKVxyXG5cclxuICBsZXQgcG9zMSA9IDAsIHBvczMgPSAwLCBwb3NpdGlvbiA9IDBcclxuICBlbG1udC5vbm1vdXNlZG93biA9IGRyYWdNb3VzZURvd25cclxuXHJcbiAgZnVuY3Rpb24gZHJhZ01vdXNlRG93biAoZSkge1xyXG4gICAgZSA9IGUgfHwgd2luZG93LmV2ZW50XHJcbiAgICAvLyBnZXQgdGhlIG1vdXNlIGN1cnNvciBwb3NpdGlvbiBhdCBzdGFydHVwOlxyXG4gICAgcG9zMyA9IGUuY2xpZW50WFxyXG4gICAgZG9jdW1lbnQub25tb3VzZXVwID0gY2xvc2VEcmFnRWxlbWVudFxyXG4gICAgLy8gY2FsbCBhIGZ1bmN0aW9uIHdoZW5ldmVyIHRoZSBjdXJzb3IgbW92ZXM6XHJcbiAgICBkb2N1bWVudC5vbm1vdXNlbW92ZSA9IGVsZW1lbnREcmFnXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBlbGVtZW50RHJhZyAoZSkge1xyXG4gICAgZSA9IGUgfHwgd2luZG93LmV2ZW50XHJcbiAgICAvLyBjYWxjdWxhdGUgdGhlIG5ldyBjdXJzb3IgcG9zaXRpb246XHJcbiAgICBwb3MxID0gcG9zMyAtIGUuY2xpZW50WFxyXG4gICAgcG9zMyA9IGUuY2xpZW50WFxyXG4gICAgLy8gc2V0IHRoZSBlbGVtZW50J3MgbmV3IHBvc2l0aW9uOlxyXG4gICAgbGV0IG5ld1Bvc2l0aW9uID0gZWxtbnQub2Zmc2V0TGVmdCAtIHBvczFcclxuICAgIGlmIChcclxuICAgICAgbmV3UG9zaXRpb24gPj0gQkxPQ0tTSVpFIC8gMiAtIDIwICYmXHJcbiAgICAgIG5ld1Bvc2l0aW9uIDwgU0laRSAtIEJMT0NLU0laRSAvIDIgLSAyMFxyXG4gICAgKSB7XHJcbiAgICAgIGVsbW50LnN0eWxlLmxlZnQgPSBuZXdQb3NpdGlvbiArICdweCdcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRvY3VtZW50Lm9ubW91c2V1cCA9IGNsb3NlRHJhZ0VsZW1lbnRcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNldFByb3BlclBvc2l0aW9uICgpIHtcclxuICAgIHBvc2l0aW9uID0gTWF0aC5yb3VuZCgocGFyc2VGbG9hdChlbG1udC5zdHlsZS5sZWZ0KSAtIDUwKSAvIHN0ZXApXHJcbiAgICBsZXQgbmV3UG9zaXRpb24gPSBwb3NpdGlvbiAqIEJMT0NLU0laRSArIEJMT0NLU0laRSAvIDIgLSAyMFxyXG4gICAgZWxtbnQuc3R5bGUubGVmdCA9IG5ld1Bvc2l0aW9uICsgJ3B4J1xyXG4gICAgdXBkYXRlQWN0aXZlRG90cygpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVBY3RpdmVEb3RzICgpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZG90cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBkb3RzW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ2xpbmVfZG90LS1hY3RpdmUnKVxyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb3NpdGlvbjsgaSsrKSB7XHJcbiAgICAgIGRvdHNbaV0uY2xhc3NMaXN0LmFkZCgnbGluZV9kb3QtLWFjdGl2ZScpXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlUHJvZ3Jlc3MoKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlUHJvZ3Jlc3MgKCkge1xyXG4gICAgbGV0IHdpZHRoID0gcG9zaXRpb24gKiBCTE9DS1NJWkVcclxuICAgICQoJy50aW1lbGluZV9saW5lLWZpbGwnKS5jc3MoJ3dpZHRoJywgd2lkdGggKyAncHgnKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY2xvc2VEcmFnRWxlbWVudCAoKSB7XHJcbiAgICBzZXRQcm9wZXJQb3NpdGlvbigpXHJcbiAgICBjYWxsYmFjayhwb3NpdGlvbiArIDEpXHJcbiAgICAvKiBzdG9wIG1vdmluZyB3aGVuIG1vdXNlIGJ1dHRvbiBpcyByZWxlYXNlZDogKi9cclxuICAgIGRvY3VtZW50Lm9ubW91c2V1cCA9IG51bGxcclxuICAgIGRvY3VtZW50Lm9ubW91c2Vtb3ZlID0gbnVsbFxyXG4gIH1cclxuXHJcbiAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChkb3RzLCBmdW5jdGlvbiAoZG90LCBpbmRleCkge1xyXG4gICAgZG90LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICB1cGRhdGVQb3NpdGlvbihpbmRleClcclxuICAgICAgY2FsbGJhY2socG9zaXRpb24gKyAxKVxyXG4gICAgfSlcclxuICB9KVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVQb3NpdGlvbiAocG9zaXRpb24pIHtcclxuICAgIGVsbW50LnN0eWxlLmxlZnQgPSBwb3NpdGlvbiAqIEJMT0NLU0laRSArICdweCdcclxuICAgIHNldFByb3BlclBvc2l0aW9uKClcclxuICB9XHJcbiAgcmV0dXJuIHVwZGF0ZVBvc2l0aW9uXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgZGF0YSA9IHtcclxuICAgIHBlcmlvZHM6IFtcclxuICAgICAge1xyXG4gICAgICAgIHllYXI6IDIwMTgsXHJcbiAgICAgICAgYWN0aW9uczoge1xyXG4gICAgICAgICAgbGVmdDogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAxLTIwMTgnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBEaWduaXNzaW1vcywgc3VzY2lwaXQhJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAyLTIwMTgnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBEaWduaXNzaW1vcywgc3VzY2lwaXQhJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAzLTIwMTgnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnRElTVElOQ1RJT05TPGJyPiAmVFJPUEjDiUVTJyxcclxuICAgICAgICAgICAgICBjb250ZW50OiBgPHNwYW4gY2xhc3M9XCJ0aW1lbGluZV9jYXJkX3NtYWxsdGl0bGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgQWZyaWNhbiBCYW5rZXIgQXdhcmRzIDIwMTVcclxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIFRyb3Bow6llIMKrIEJhbnF1ZSBBZnJpY2FpbmUgZGUgbOKAmUFubsOpZSDCuyBkw6ljZXJuw6kgYXUgR3JvdXBlIEJhbnF1ZSBDZW50cmFsZSBQb3B1bGFpcmUgVHJvcGjDqWUgwqsgSW5jbHVzaW9uIEZpbmFuY2nDqHJlIMK7IHJlbXBvcnTDqVxyXG4gICAgICAgICAgICAgICAgICAgICAgcGFyIGxhIGZpbGlhbGUgQXR0YXdmaXEgTWljcm8tRmluYW5jZS4gQ2FydGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpbWVsaW5lX2NhcmRfc21hbGx0aXRsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBZnJpcXVlIEF3YXJkcyAyMDE1XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICBPYnRlbnRpb24gZHUgdHJvcGjDqWUgwqsgQmVzdCBJbm5vdmF0aXZlIENhcmQgUHJvZ3JhbW1lIMK7IGF0dHJpYnXDqSDDoCDCqyBHbG9iYWxDYXJkIMK7LCB1bmUgY2FydGUgbW9uw6l0aXF1ZSBwcsOpcGF5w6llIGRlc3RpbsOpZVxyXG4gICAgICAgICAgICAgICAgICAgICAgYXV4IHZveWFnZXVycyBkZSBwYXNzYWdlIGF1IE1hcm9jIGV0IHF1aSBjb25zdGl0dWUgdW4gbW95ZW4gZGUgc3Vic3RpdHV0aW9uIMOgIGxhIG1vbm5haWUgZmlkdWNpYWlyZS5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGltZWxpbmVfY2FyZF9zbWFsbHRpdGxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1vcm9jY28gTWFzdGVyQ2FyZCBDdXN0b21lcnMgTWVldGluZ3MgMjAxNVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgTGUgR3JvdXBlIEJhbnF1ZSBDZW50cmFsZSBQb3B1bGFpcmUgYSByZW1wb3J0w6kgw6AgY2V0dGUgb2NjYXNpb24gbGUgdHJvcGjDqWUgZGUgY2hhbXBpb24gbmF0aW9uYWwgZOKAmWFjdGl2YXRpb24gZGVzIGNhcnRlcyBkZVxyXG4gICAgICAgICAgICAgICAgICAgICAgcGFpZW1lbnQgVFBFIMKrIFBvcyBVc2FnZSBBY3RpdmF0aW9uIENoYW1waW9uIMK7LmBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXSxcclxuICAgICAgICAgIHJpZ2h0OiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkYXRlOiAnMTEtMDMtMjAxOCcsXHJcbiAgICAgICAgICAgICAgY29udGVudDogJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0IGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQuIERpZ25pc3NpbW9zLCBzdXNjaXBpdCEnLFxyXG4gICAgICAgICAgICAgIG1lZGlhOiAnYXNzZXRzL2ltZy9yZXMtMi5wbmcnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkYXRlOiAnMTEtMDMtMjAxOCcsXHJcbiAgICAgICAgICAgICAgY29udGVudDogJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0IGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQuIERpZ25pc3NpbW9zLCBzdXNjaXBpdCEnLFxyXG4gICAgICAgICAgICAgIG1lZGlhOiAnYXNzZXRzL2ltZy9leHBsb3Jlci1tZXRpZXJzMi5wbmcnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB5ZWFyOiAyMDE3LFxyXG4gICAgICAgIGFjdGlvbnM6IHtcclxuICAgICAgICAgIGxlZnQ6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGU6ICcxMS0wMS0yMDE4JyxcclxuICAgICAgICAgICAgICBjb250ZW50OiAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gRGlnbmlzc2ltb3MsIHN1c2NpcGl0ISdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGU6ICcxMS0wMi0yMDE4JyxcclxuICAgICAgICAgICAgICBjb250ZW50OiAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gRGlnbmlzc2ltb3MsIHN1c2NpcGl0ISdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGU6ICcxMS0wMy0yMDE4JyxcclxuICAgICAgICAgICAgICB0aXRsZTogJ0RJU1RJTkNUSU9OUzxicj4gJlRST1BIw4lFUycsXHJcbiAgICAgICAgICAgICAgY29udGVudDogYDxzcGFuIGNsYXNzPVwidGltZWxpbmVfY2FyZF9zbWFsbHRpdGxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFmcmljYW4gQmFua2VyIEF3YXJkcyAyMDE1XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICBUcm9waMOpZSDCqyBCYW5xdWUgQWZyaWNhaW5lIGRlIGzigJlBbm7DqWUgwrsgZMOpY2VybsOpIGF1IEdyb3VwZSBCYW5xdWUgQ2VudHJhbGUgUG9wdWxhaXJlIFRyb3Bow6llIMKrIEluY2x1c2lvbiBGaW5hbmNpw6hyZSDCuyByZW1wb3J0w6lcclxuICAgICAgICAgICAgICAgICAgICAgIHBhciBsYSBmaWxpYWxlIEF0dGF3ZmlxIE1pY3JvLUZpbmFuY2UuIENhcnRlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aW1lbGluZV9jYXJkX3NtYWxsdGl0bGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgQWZyaXF1ZSBBd2FyZHMgMjAxNVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgT2J0ZW50aW9uIGR1IHRyb3Bow6llIMKrIEJlc3QgSW5ub3ZhdGl2ZSBDYXJkIFByb2dyYW1tZSDCuyBhdHRyaWJ1w6kgw6AgwqsgR2xvYmFsQ2FyZCDCuywgdW5lIGNhcnRlIG1vbsOpdGlxdWUgcHLDqXBhecOpZSBkZXN0aW7DqWVcclxuICAgICAgICAgICAgICAgICAgICAgIGF1eCB2b3lhZ2V1cnMgZGUgcGFzc2FnZSBhdSBNYXJvYyBldCBxdWkgY29uc3RpdHVlIHVuIG1veWVuIGRlIHN1YnN0aXR1dGlvbiDDoCBsYSBtb25uYWllIGZpZHVjaWFpcmUuXHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpbWVsaW5lX2NhcmRfc21hbGx0aXRsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBNb3JvY2NvIE1hc3RlckNhcmQgQ3VzdG9tZXJzIE1lZXRpbmdzIDIwMTVcclxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIExlIEdyb3VwZSBCYW5xdWUgQ2VudHJhbGUgUG9wdWxhaXJlIGEgcmVtcG9ydMOpIMOgIGNldHRlIG9jY2FzaW9uIGxlIHRyb3Bow6llIGRlIGNoYW1waW9uIG5hdGlvbmFsIGTigJlhY3RpdmF0aW9uIGRlcyBjYXJ0ZXMgZGVcclxuICAgICAgICAgICAgICAgICAgICAgIHBhaWVtZW50IFRQRSDCqyBQb3MgVXNhZ2UgQWN0aXZhdGlvbiBDaGFtcGlvbiDCuy5gXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICByaWdodDogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAzLTIwMTgnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBEaWduaXNzaW1vcywgc3VzY2lwaXQhJyxcclxuICAgICAgICAgICAgICBtZWRpYTogJ2Fzc2V0cy9pbWcvcmVzLTIucG5nJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAzLTIwMTgnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBEaWduaXNzaW1vcywgc3VzY2lwaXQhJyxcclxuICAgICAgICAgICAgICBtZWRpYTogJ2Fzc2V0cy9pbWcvZXhwbG9yZXItbWV0aWVyczIucG5nJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgeWVhcjogMjAxNixcclxuICAgICAgICBhY3Rpb25zOiB7XHJcbiAgICAgICAgICBsZWZ0OiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkYXRlOiAnMTEtMDEtMjAxOCcsXHJcbiAgICAgICAgICAgICAgY29udGVudDogJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0IGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQuIERpZ25pc3NpbW9zLCBzdXNjaXBpdCEnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkYXRlOiAnMTEtMDItMjAxOCcsXHJcbiAgICAgICAgICAgICAgY29udGVudDogJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0IGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQuIERpZ25pc3NpbW9zLCBzdXNjaXBpdCEnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkYXRlOiAnMTEtMDMtMjAxOCcsXHJcbiAgICAgICAgICAgICAgdGl0bGU6ICdESVNUSU5DVElPTlM8YnI+ICZUUk9QSMOJRVMnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6IGA8c3BhbiBjbGFzcz1cInRpbWVsaW5lX2NhcmRfc21hbGx0aXRsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBZnJpY2FuIEJhbmtlciBBd2FyZHMgMjAxNVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgVHJvcGjDqWUgwqsgQmFucXVlIEFmcmljYWluZSBkZSBs4oCZQW5uw6llIMK7IGTDqWNlcm7DqSBhdSBHcm91cGUgQmFucXVlIENlbnRyYWxlIFBvcHVsYWlyZSBUcm9waMOpZSDCqyBJbmNsdXNpb24gRmluYW5jacOocmUgwrsgcmVtcG9ydMOpXHJcbiAgICAgICAgICAgICAgICAgICAgICBwYXIgbGEgZmlsaWFsZSBBdHRhd2ZpcSBNaWNyby1GaW5hbmNlLiBDYXJ0ZXNcclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGltZWxpbmVfY2FyZF9zbWFsbHRpdGxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFmcmlxdWUgQXdhcmRzIDIwMTVcclxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIE9idGVudGlvbiBkdSB0cm9waMOpZSDCqyBCZXN0IElubm92YXRpdmUgQ2FyZCBQcm9ncmFtbWUgwrsgYXR0cmlidcOpIMOgIMKrIEdsb2JhbENhcmQgwrssIHVuZSBjYXJ0ZSBtb27DqXRpcXVlIHByw6lwYXnDqWUgZGVzdGluw6llXHJcbiAgICAgICAgICAgICAgICAgICAgICBhdXggdm95YWdldXJzIGRlIHBhc3NhZ2UgYXUgTWFyb2MgZXQgcXVpIGNvbnN0aXR1ZSB1biBtb3llbiBkZSBzdWJzdGl0dXRpb24gw6AgbGEgbW9ubmFpZSBmaWR1Y2lhaXJlLlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aW1lbGluZV9jYXJkX3NtYWxsdGl0bGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgTW9yb2NjbyBNYXN0ZXJDYXJkIEN1c3RvbWVycyBNZWV0aW5ncyAyMDE1XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICBMZSBHcm91cGUgQmFucXVlIENlbnRyYWxlIFBvcHVsYWlyZSBhIHJlbXBvcnTDqSDDoCBjZXR0ZSBvY2Nhc2lvbiBsZSB0cm9waMOpZSBkZSBjaGFtcGlvbiBuYXRpb25hbCBk4oCZYWN0aXZhdGlvbiBkZXMgY2FydGVzIGRlXHJcbiAgICAgICAgICAgICAgICAgICAgICBwYWllbWVudCBUUEUgwqsgUG9zIFVzYWdlIEFjdGl2YXRpb24gQ2hhbXBpb24gwrsuYFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgcmlnaHQ6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGU6ICcxMS0wMy0yMDE4JyxcclxuICAgICAgICAgICAgICBjb250ZW50OiAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gRGlnbmlzc2ltb3MsIHN1c2NpcGl0IScsXHJcbiAgICAgICAgICAgICAgbWVkaWE6ICdhc3NldHMvaW1nL3Jlcy0yLnBuZydcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGU6ICcxMS0wMy0yMDE4JyxcclxuICAgICAgICAgICAgICBjb250ZW50OiAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gRGlnbmlzc2ltb3MsIHN1c2NpcGl0IScsXHJcbiAgICAgICAgICAgICAgbWVkaWE6ICdhc3NldHMvaW1nL2V4cGxvcmVyLW1ldGllcnMyLnBuZydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHllYXI6IDIwMTUsXHJcbiAgICAgICAgYWN0aW9uczoge1xyXG4gICAgICAgICAgbGVmdDogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAxLTIwMTgnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBEaWduaXNzaW1vcywgc3VzY2lwaXQhJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAyLTIwMTgnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBEaWduaXNzaW1vcywgc3VzY2lwaXQhJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAzLTIwMTgnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnRElTVElOQ1RJT05TPGJyPiAmVFJPUEjDiUVTJyxcclxuICAgICAgICAgICAgICBjb250ZW50OiBgPHNwYW4gY2xhc3M9XCJ0aW1lbGluZV9jYXJkX3NtYWxsdGl0bGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgQWZyaWNhbiBCYW5rZXIgQXdhcmRzIDIwMTVcclxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIFRyb3Bow6llIMKrIEJhbnF1ZSBBZnJpY2FpbmUgZGUgbOKAmUFubsOpZSDCuyBkw6ljZXJuw6kgYXUgR3JvdXBlIEJhbnF1ZSBDZW50cmFsZSBQb3B1bGFpcmUgVHJvcGjDqWUgwqsgSW5jbHVzaW9uIEZpbmFuY2nDqHJlIMK7IHJlbXBvcnTDqVxyXG4gICAgICAgICAgICAgICAgICAgICAgcGFyIGxhIGZpbGlhbGUgQXR0YXdmaXEgTWljcm8tRmluYW5jZS4gQ2FydGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpbWVsaW5lX2NhcmRfc21hbGx0aXRsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBZnJpcXVlIEF3YXJkcyAyMDE1XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICBPYnRlbnRpb24gZHUgdHJvcGjDqWUgwqsgQmVzdCBJbm5vdmF0aXZlIENhcmQgUHJvZ3JhbW1lIMK7IGF0dHJpYnXDqSDDoCDCqyBHbG9iYWxDYXJkIMK7LCB1bmUgY2FydGUgbW9uw6l0aXF1ZSBwcsOpcGF5w6llIGRlc3RpbsOpZVxyXG4gICAgICAgICAgICAgICAgICAgICAgYXV4IHZveWFnZXVycyBkZSBwYXNzYWdlIGF1IE1hcm9jIGV0IHF1aSBjb25zdGl0dWUgdW4gbW95ZW4gZGUgc3Vic3RpdHV0aW9uIMOgIGxhIG1vbm5haWUgZmlkdWNpYWlyZS5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGltZWxpbmVfY2FyZF9zbWFsbHRpdGxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1vcm9jY28gTWFzdGVyQ2FyZCBDdXN0b21lcnMgTWVldGluZ3MgMjAxNVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgTGUgR3JvdXBlIEJhbnF1ZSBDZW50cmFsZSBQb3B1bGFpcmUgYSByZW1wb3J0w6kgw6AgY2V0dGUgb2NjYXNpb24gbGUgdHJvcGjDqWUgZGUgY2hhbXBpb24gbmF0aW9uYWwgZOKAmWFjdGl2YXRpb24gZGVzIGNhcnRlcyBkZVxyXG4gICAgICAgICAgICAgICAgICAgICAgcGFpZW1lbnQgVFBFIMKrIFBvcyBVc2FnZSBBY3RpdmF0aW9uIENoYW1waW9uIMK7LmBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXSxcclxuICAgICAgICAgIHJpZ2h0OiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkYXRlOiAnMTEtMDMtMjAxOCcsXHJcbiAgICAgICAgICAgICAgY29udGVudDogJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0IGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQuIERpZ25pc3NpbW9zLCBzdXNjaXBpdCEnLFxyXG4gICAgICAgICAgICAgIG1lZGlhOiAnYXNzZXRzL2ltZy9yZXMtMi5wbmcnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkYXRlOiAnMTEtMDMtMjAxOCcsXHJcbiAgICAgICAgICAgICAgY29udGVudDogJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0IGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQuIERpZ25pc3NpbW9zLCBzdXNjaXBpdCEnLFxyXG4gICAgICAgICAgICAgIG1lZGlhOiAnYXNzZXRzL2ltZy9leHBsb3Jlci1tZXRpZXJzMi5wbmcnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB5ZWFyOiAyMDE0LFxyXG4gICAgICAgIGFjdGlvbnM6IHtcclxuICAgICAgICAgIGxlZnQ6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGU6ICcxMS0wMS0yMDE4JyxcclxuICAgICAgICAgICAgICBjb250ZW50OiAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gRGlnbmlzc2ltb3MsIHN1c2NpcGl0ISdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGU6ICcxMS0wMi0yMDE4JyxcclxuICAgICAgICAgICAgICBjb250ZW50OiAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gRGlnbmlzc2ltb3MsIHN1c2NpcGl0ISdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGU6ICcxMS0wMy0yMDE4JyxcclxuICAgICAgICAgICAgICB0aXRsZTogJ0RJU1RJTkNUSU9OUzxicj4gJlRST1BIw4lFUycsXHJcbiAgICAgICAgICAgICAgY29udGVudDogYDxzcGFuIGNsYXNzPVwidGltZWxpbmVfY2FyZF9zbWFsbHRpdGxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFmcmljYW4gQmFua2VyIEF3YXJkcyAyMDE1XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICBUcm9waMOpZSDCqyBCYW5xdWUgQWZyaWNhaW5lIGRlIGzigJlBbm7DqWUgwrsgZMOpY2VybsOpIGF1IEdyb3VwZSBCYW5xdWUgQ2VudHJhbGUgUG9wdWxhaXJlIFRyb3Bow6llIMKrIEluY2x1c2lvbiBGaW5hbmNpw6hyZSDCuyByZW1wb3J0w6lcclxuICAgICAgICAgICAgICAgICAgICAgIHBhciBsYSBmaWxpYWxlIEF0dGF3ZmlxIE1pY3JvLUZpbmFuY2UuIENhcnRlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aW1lbGluZV9jYXJkX3NtYWxsdGl0bGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgQWZyaXF1ZSBBd2FyZHMgMjAxNVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgT2J0ZW50aW9uIGR1IHRyb3Bow6llIMKrIEJlc3QgSW5ub3ZhdGl2ZSBDYXJkIFByb2dyYW1tZSDCuyBhdHRyaWJ1w6kgw6AgwqsgR2xvYmFsQ2FyZCDCuywgdW5lIGNhcnRlIG1vbsOpdGlxdWUgcHLDqXBhecOpZSBkZXN0aW7DqWVcclxuICAgICAgICAgICAgICAgICAgICAgIGF1eCB2b3lhZ2V1cnMgZGUgcGFzc2FnZSBhdSBNYXJvYyBldCBxdWkgY29uc3RpdHVlIHVuIG1veWVuIGRlIHN1YnN0aXR1dGlvbiDDoCBsYSBtb25uYWllIGZpZHVjaWFpcmUuXHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpbWVsaW5lX2NhcmRfc21hbGx0aXRsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBNb3JvY2NvIE1hc3RlckNhcmQgQ3VzdG9tZXJzIE1lZXRpbmdzIDIwMTVcclxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIExlIEdyb3VwZSBCYW5xdWUgQ2VudHJhbGUgUG9wdWxhaXJlIGEgcmVtcG9ydMOpIMOgIGNldHRlIG9jY2FzaW9uIGxlIHRyb3Bow6llIGRlIGNoYW1waW9uIG5hdGlvbmFsIGTigJlhY3RpdmF0aW9uIGRlcyBjYXJ0ZXMgZGVcclxuICAgICAgICAgICAgICAgICAgICAgIHBhaWVtZW50IFRQRSDCqyBQb3MgVXNhZ2UgQWN0aXZhdGlvbiBDaGFtcGlvbiDCuy5gXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICByaWdodDogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAzLTIwMTgnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBEaWduaXNzaW1vcywgc3VzY2lwaXQhJyxcclxuICAgICAgICAgICAgICBtZWRpYTogJ2Fzc2V0cy9pbWcvcmVzLTIucG5nJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAzLTIwMTgnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBEaWduaXNzaW1vcywgc3VzY2lwaXQhJyxcclxuICAgICAgICAgICAgICBtZWRpYTogJ2Fzc2V0cy9pbWcvZXhwbG9yZXItbWV0aWVyczIucG5nJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgeWVhcjogMjAxMyxcclxuICAgICAgICBhY3Rpb25zOiB7XHJcbiAgICAgICAgICBsZWZ0OiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkYXRlOiAnMTEtMDEtMjAxOCcsXHJcbiAgICAgICAgICAgICAgY29udGVudDogJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0IGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQuIERpZ25pc3NpbW9zLCBzdXNjaXBpdCEnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkYXRlOiAnMTEtMDItMjAxOCcsXHJcbiAgICAgICAgICAgICAgY29udGVudDogJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0IGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQuIERpZ25pc3NpbW9zLCBzdXNjaXBpdCEnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkYXRlOiAnMTEtMDMtMjAxOCcsXHJcbiAgICAgICAgICAgICAgdGl0bGU6ICdESVNUSU5DVElPTlM8YnI+ICZUUk9QSMOJRVMnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6IGA8c3BhbiBjbGFzcz1cInRpbWVsaW5lX2NhcmRfc21hbGx0aXRsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBZnJpY2FuIEJhbmtlciBBd2FyZHMgMjAxNVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgVHJvcGjDqWUgwqsgQmFucXVlIEFmcmljYWluZSBkZSBs4oCZQW5uw6llIMK7IGTDqWNlcm7DqSBhdSBHcm91cGUgQmFucXVlIENlbnRyYWxlIFBvcHVsYWlyZSBUcm9waMOpZSDCqyBJbmNsdXNpb24gRmluYW5jacOocmUgwrsgcmVtcG9ydMOpXHJcbiAgICAgICAgICAgICAgICAgICAgICBwYXIgbGEgZmlsaWFsZSBBdHRhd2ZpcSBNaWNyby1GaW5hbmNlLiBDYXJ0ZXNcclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGltZWxpbmVfY2FyZF9zbWFsbHRpdGxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFmcmlxdWUgQXdhcmRzIDIwMTVcclxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIE9idGVudGlvbiBkdSB0cm9waMOpZSDCqyBCZXN0IElubm92YXRpdmUgQ2FyZCBQcm9ncmFtbWUgwrsgYXR0cmlidcOpIMOgIMKrIEdsb2JhbENhcmQgwrssIHVuZSBjYXJ0ZSBtb27DqXRpcXVlIHByw6lwYXnDqWUgZGVzdGluw6llXHJcbiAgICAgICAgICAgICAgICAgICAgICBhdXggdm95YWdldXJzIGRlIHBhc3NhZ2UgYXUgTWFyb2MgZXQgcXVpIGNvbnN0aXR1ZSB1biBtb3llbiBkZSBzdWJzdGl0dXRpb24gw6AgbGEgbW9ubmFpZSBmaWR1Y2lhaXJlLlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aW1lbGluZV9jYXJkX3NtYWxsdGl0bGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgTW9yb2NjbyBNYXN0ZXJDYXJkIEN1c3RvbWVycyBNZWV0aW5ncyAyMDE1XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICBMZSBHcm91cGUgQmFucXVlIENlbnRyYWxlIFBvcHVsYWlyZSBhIHJlbXBvcnTDqSDDoCBjZXR0ZSBvY2Nhc2lvbiBsZSB0cm9waMOpZSBkZSBjaGFtcGlvbiBuYXRpb25hbCBk4oCZYWN0aXZhdGlvbiBkZXMgY2FydGVzIGRlXHJcbiAgICAgICAgICAgICAgICAgICAgICBwYWllbWVudCBUUEUgwqsgUG9zIFVzYWdlIEFjdGl2YXRpb24gQ2hhbXBpb24gwrsuYFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgcmlnaHQ6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGU6ICcxMS0wMy0yMDE4JyxcclxuICAgICAgICAgICAgICBjb250ZW50OiAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gRGlnbmlzc2ltb3MsIHN1c2NpcGl0IScsXHJcbiAgICAgICAgICAgICAgbWVkaWE6ICdhc3NldHMvaW1nL3Jlcy0yLnBuZydcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGU6ICcxMS0wMy0yMDE4JyxcclxuICAgICAgICAgICAgICBjb250ZW50OiAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gRGlnbmlzc2ltb3MsIHN1c2NpcGl0IScsXHJcbiAgICAgICAgICAgICAgbWVkaWE6ICdhc3NldHMvaW1nL2V4cGxvcmVyLW1ldGllcnMyLnBuZydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHllYXI6IDIwMTIsXHJcbiAgICAgICAgYWN0aW9uczoge1xyXG4gICAgICAgICAgbGVmdDogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAxLTIwMTgnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBEaWduaXNzaW1vcywgc3VzY2lwaXQhJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAyLTIwMTgnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBEaWduaXNzaW1vcywgc3VzY2lwaXQhJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAzLTIwMTgnLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiAnRElTVElOQ1RJT05TPGJyPiAmVFJPUEjDiUVTJyxcclxuICAgICAgICAgICAgICBjb250ZW50OiBgPHNwYW4gY2xhc3M9XCJ0aW1lbGluZV9jYXJkX3NtYWxsdGl0bGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgQWZyaWNhbiBCYW5rZXIgQXdhcmRzIDIwMTVcclxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIFRyb3Bow6llIMKrIEJhbnF1ZSBBZnJpY2FpbmUgZGUgbOKAmUFubsOpZSDCuyBkw6ljZXJuw6kgYXUgR3JvdXBlIEJhbnF1ZSBDZW50cmFsZSBQb3B1bGFpcmUgVHJvcGjDqWUgwqsgSW5jbHVzaW9uIEZpbmFuY2nDqHJlIMK7IHJlbXBvcnTDqVxyXG4gICAgICAgICAgICAgICAgICAgICAgcGFyIGxhIGZpbGlhbGUgQXR0YXdmaXEgTWljcm8tRmluYW5jZS4gQ2FydGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpbWVsaW5lX2NhcmRfc21hbGx0aXRsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBZnJpcXVlIEF3YXJkcyAyMDE1XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICBPYnRlbnRpb24gZHUgdHJvcGjDqWUgwqsgQmVzdCBJbm5vdmF0aXZlIENhcmQgUHJvZ3JhbW1lIMK7IGF0dHJpYnXDqSDDoCDCqyBHbG9iYWxDYXJkIMK7LCB1bmUgY2FydGUgbW9uw6l0aXF1ZSBwcsOpcGF5w6llIGRlc3RpbsOpZVxyXG4gICAgICAgICAgICAgICAgICAgICAgYXV4IHZveWFnZXVycyBkZSBwYXNzYWdlIGF1IE1hcm9jIGV0IHF1aSBjb25zdGl0dWUgdW4gbW95ZW4gZGUgc3Vic3RpdHV0aW9uIMOgIGxhIG1vbm5haWUgZmlkdWNpYWlyZS5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGltZWxpbmVfY2FyZF9zbWFsbHRpdGxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1vcm9jY28gTWFzdGVyQ2FyZCBDdXN0b21lcnMgTWVldGluZ3MgMjAxNVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgTGUgR3JvdXBlIEJhbnF1ZSBDZW50cmFsZSBQb3B1bGFpcmUgYSByZW1wb3J0w6kgw6AgY2V0dGUgb2NjYXNpb24gbGUgdHJvcGjDqWUgZGUgY2hhbXBpb24gbmF0aW9uYWwgZOKAmWFjdGl2YXRpb24gZGVzIGNhcnRlcyBkZVxyXG4gICAgICAgICAgICAgICAgICAgICAgcGFpZW1lbnQgVFBFIMKrIFBvcyBVc2FnZSBBY3RpdmF0aW9uIENoYW1waW9uIMK7LmBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXSxcclxuICAgICAgICAgIHJpZ2h0OiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkYXRlOiAnMTEtMDMtMjAxOCcsXHJcbiAgICAgICAgICAgICAgY29udGVudDogJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0IGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQuIERpZ25pc3NpbW9zLCBzdXNjaXBpdCEnLFxyXG4gICAgICAgICAgICAgIG1lZGlhOiAnYXNzZXRzL2ltZy9yZXMtMi5wbmcnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkYXRlOiAnMTEtMDMtMjAxOCcsXHJcbiAgICAgICAgICAgICAgY29udGVudDogJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0IGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQuIERpZ25pc3NpbW9zLCBzdXNjaXBpdCEnLFxyXG4gICAgICAgICAgICAgIG1lZGlhOiAnYXNzZXRzL2ltZy9leHBsb3Jlci1tZXRpZXJzMi5wbmcnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB5ZWFyOiAyMDExLFxyXG4gICAgICAgIGFjdGlvbnM6IHtcclxuICAgICAgICAgIGxlZnQ6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGU6ICcxMS0wMS0yMDE4JyxcclxuICAgICAgICAgICAgICBjb250ZW50OiAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gRGlnbmlzc2ltb3MsIHN1c2NpcGl0ISdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGU6ICcxMS0wMi0yMDE4JyxcclxuICAgICAgICAgICAgICBjb250ZW50OiAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gRGlnbmlzc2ltb3MsIHN1c2NpcGl0ISdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGU6ICcxMS0wMy0yMDE4JyxcclxuICAgICAgICAgICAgICB0aXRsZTogJ0RJU1RJTkNUSU9OUzxicj4gJlRST1BIw4lFUycsXHJcbiAgICAgICAgICAgICAgY29udGVudDogYDxzcGFuIGNsYXNzPVwidGltZWxpbmVfY2FyZF9zbWFsbHRpdGxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFmcmljYW4gQmFua2VyIEF3YXJkcyAyMDE1XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICBUcm9waMOpZSDCqyBCYW5xdWUgQWZyaWNhaW5lIGRlIGzigJlBbm7DqWUgwrsgZMOpY2VybsOpIGF1IEdyb3VwZSBCYW5xdWUgQ2VudHJhbGUgUG9wdWxhaXJlIFRyb3Bow6llIMKrIEluY2x1c2lvbiBGaW5hbmNpw6hyZSDCuyByZW1wb3J0w6lcclxuICAgICAgICAgICAgICAgICAgICAgIHBhciBsYSBmaWxpYWxlIEF0dGF3ZmlxIE1pY3JvLUZpbmFuY2UuIENhcnRlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aW1lbGluZV9jYXJkX3NtYWxsdGl0bGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgQWZyaXF1ZSBBd2FyZHMgMjAxNVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgT2J0ZW50aW9uIGR1IHRyb3Bow6llIMKrIEJlc3QgSW5ub3ZhdGl2ZSBDYXJkIFByb2dyYW1tZSDCuyBhdHRyaWJ1w6kgw6AgwqsgR2xvYmFsQ2FyZCDCuywgdW5lIGNhcnRlIG1vbsOpdGlxdWUgcHLDqXBhecOpZSBkZXN0aW7DqWVcclxuICAgICAgICAgICAgICAgICAgICAgIGF1eCB2b3lhZ2V1cnMgZGUgcGFzc2FnZSBhdSBNYXJvYyBldCBxdWkgY29uc3RpdHVlIHVuIG1veWVuIGRlIHN1YnN0aXR1dGlvbiDDoCBsYSBtb25uYWllIGZpZHVjaWFpcmUuXHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpbWVsaW5lX2NhcmRfc21hbGx0aXRsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBNb3JvY2NvIE1hc3RlckNhcmQgQ3VzdG9tZXJzIE1lZXRpbmdzIDIwMTVcclxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIExlIEdyb3VwZSBCYW5xdWUgQ2VudHJhbGUgUG9wdWxhaXJlIGEgcmVtcG9ydMOpIMOgIGNldHRlIG9jY2FzaW9uIGxlIHRyb3Bow6llIGRlIGNoYW1waW9uIG5hdGlvbmFsIGTigJlhY3RpdmF0aW9uIGRlcyBjYXJ0ZXMgZGVcclxuICAgICAgICAgICAgICAgICAgICAgIHBhaWVtZW50IFRQRSDCqyBQb3MgVXNhZ2UgQWN0aXZhdGlvbiBDaGFtcGlvbiDCuy5gXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICByaWdodDogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAzLTIwMTgnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBEaWduaXNzaW1vcywgc3VzY2lwaXQhJyxcclxuICAgICAgICAgICAgICBtZWRpYTogJ2Fzc2V0cy9pbWcvcmVzLTIucG5nJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgZGF0ZTogJzExLTAzLTIwMTgnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBEaWduaXNzaW1vcywgc3VzY2lwaXQhJyxcclxuICAgICAgICAgICAgICBtZWRpYTogJ2Fzc2V0cy9pbWcvZXhwbG9yZXItbWV0aWVyczIucG5nJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICBdXHJcbiAgfVxyXG5cclxuICBsZXQgZGF0YUluZGV4ID0gMVxyXG5cclxuICBsZXQgbWFwcGVkRGF0YSA9IGRhdGEucGVyaW9kcy5tYXAocGVyaW9kID0+IHtcclxuICAgIHJldHVybiBgPGRpdiBjbGFzcz1cInRpbWVsaW5lX3BlcmlvZFwiPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGltZWxpbmVfcGVyaW9kX2RhdGVcIj4ke3BlcmlvZC55ZWFyfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtNiBtdC0zXCI+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICR7cGVyaW9kLmFjdGlvbnMubGVmdFxyXG4gICAgICAubWFwKGFjdGlvbiA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwidGltZWxpbmVfY2FyZCB0aW1lbGluZV9jYXJkLWxlZnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpbWVsaW5lX2NhcmRfY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJ0aW1lbGluZV9jYXJkX2RhdGVcIj4ke2FjdGlvbi5kYXRlfTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7YWN0aW9uLnRpdGxlID8gJzxoMiBjbGFzcz1cInRpbWVsaW5lX2NhcmRfdGl0bGVcIj4nICsgYWN0aW9uLnRpdGxlICsgJzwvaDI+JyA6ICcnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJ0aW1lbGluZV9jYXJkX3RleHRcIj4ke2FjdGlvbi5jb250ZW50fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR7YWN0aW9uLm1lZGlhID8gYDxhIGNsYXNzPVwic3dpcGVib3ggc3dpcGVib3gtLXZpZGVvXCIgaHJlZj1cIiR7YWN0aW9uLm1lZGlhfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHthY3Rpb24ubWVkaWF9XCIgYWx0PVwiXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5gIDogJyd9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+YFxyXG4gICAgICB9KVxyXG4gICAgICAuam9pbignJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC02IG10LTNcIj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHtwZXJpb2QuYWN0aW9ucy5yaWdodFxyXG4gICAgICAubWFwKGFjdGlvbiA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwidGltZWxpbmVfY2FyZCB0aW1lbGluZV9jYXJkLXJpZ2h0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aW1lbGluZV9jYXJkX2NvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwidGltZWxpbmVfY2FyZF9kYXRlXCI+JHthY3Rpb24uZGF0ZX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2FjdGlvbi50aXRsZSA/ICc8aDIgY2xhc3M9XCJ0aW1lbGluZV9jYXJkX3RpdGxlXCI+JyArIGFjdGlvbi50aXRsZSArICc8L2gyPicgOiAnJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwidGltZWxpbmVfY2FyZF90ZXh0XCI+JHthY3Rpb24uY29udGVudH08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAke2FjdGlvbi5tZWRpYSA/IGA8YSBjbGFzcz1cInN3aXBlYm94IHN3aXBlYm94LS12aWRlb1wiIGhyZWY9XCIke2FjdGlvbi5tZWRpYX1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cIiR7YWN0aW9uLm1lZGlhfVwiIGFsdD1cIlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+YCA6ICcnfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PmBcclxuICAgICAgfSlcclxuICAgICAgLmpvaW4oJycpfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+YFxyXG4gIH0pXHJcblxyXG4gIGxldCB1cGRhdGVQb3NpdGlvbiA9IHRyYWNrZXIoZnVuY3Rpb24gKHBvc2l0aW9uKSB7XHJcbiAgICBkYXRhSW5kZXggPSBwb3NpdGlvblxyXG4gICAgcmVuZGVyKClcclxuICAgIGlmIChkYXRhSW5kZXggKyAxID4gbWFwcGVkRGF0YS5sZW5ndGgpIHtcclxuICAgICAgJCgnLnRpbWVsaW5lX2FjdGlvbnMtcGx1cycpLmNzcygnZGlzcGxheScsICdub25lJylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoJy50aW1lbGluZV9hY3Rpb25zLXBsdXMnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKVxyXG4gICAgfVxyXG4gIH0pIC8vIGluaXQgdGhlIHRyYWNrYmFyXHJcblxyXG4gIGZ1bmN0aW9uIHJlbmRlciAoKSB7XHJcbiAgICBsZXQgdG9SZW5kZXIgPSAnJ1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhSW5kZXg7IGkrKykge1xyXG4gICAgICB0b1JlbmRlciArPSBtYXBwZWREYXRhW2ldXHJcbiAgICB9XHJcbiAgICBsZXQgYWN0aW9uc0hvbGRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aW1lbGluZV9hY3Rpb25zJylcclxuICAgIGlmIChhY3Rpb25zSG9sZGVyKSB7XHJcbiAgICAgIGFjdGlvbnNIb2xkZXIuaW5uZXJIVE1MID0gdG9SZW5kZXJcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGluY3JlbWVudCAoKSB7XHJcbiAgICBkYXRhSW5kZXgrK1xyXG4gICAgaWYgKGRhdGFJbmRleCArIDEgPiBtYXBwZWREYXRhLmxlbmd0aCkge1xyXG4gICAgICAkKCcudGltZWxpbmVfYWN0aW9ucy1wbHVzJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKVxyXG4gICAgfVxyXG4gICAgdXBkYXRlUG9zaXRpb24oZGF0YUluZGV4IC0gMSlcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNjcm9sbFRvTGFzdCAoKSB7XHJcbiAgICBsZXQgYWN0aW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50aW1lbGluZV9wZXJpb2QnKVxyXG4gICAgYWN0aW9uc1thY3Rpb25zLmxlbmd0aCAtIDFdLnNjcm9sbEludG9WaWV3KHtcclxuICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyKClcclxuXHJcbiAgJCgnLnRpbWVsaW5lX2FjdGlvbnMtcGx1cycpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgIGluY3JlbWVudCgpXHJcbiAgICByZW5kZXIoKVxyXG4gICAgc2Nyb2xsVG9MYXN0KClcclxuICB9KVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xyXG4gICAgJCgnLnRvcC1oZWFkZXJfbGlzdCAubGlzdCwgLnRvcC1oZWFkZXJfbGlzdCAubGFuZycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoISQoZS50YXJnZXQpLmNsb3Nlc3QoJy5kcm9wZG93bicpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgJCh0aGlzKS5maW5kKCcuZHJvcGRvd24nKS50b2dnbGVDbGFzcygnZC1ub25lJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCcqJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG5cclxuICAgICAgICBpZiAoISQuY29udGFpbnMoJCgnLnRvcC1oZWFkZXJfbGlzdCcpWzBdLCAkKGUudGFyZ2V0KVswXSkgJiYgXHJcbiAgICAgICAgICAgICgkKCcubGFuZycpLmhhc0NsYXNzKCdvcGVuJykgfHxcclxuICAgICAgICAgICAgJCgnLmxpc3QnKS5oYXNDbGFzcygnb3BlbicpKSApIHtcclxuXHJcbiAgICAgICAgICAgIGNsb3NlRHJvcGRvd25zKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gY2xvc2VEcm9wZG93bnMoKSB7XHJcbiAgICAgICAgaWYgKCQoJy50b3AtaGVhZGVyX2xpc3QgLmxpc3QnKS5oYXNDbGFzcygnb3BlbicpKSB7XHJcbiAgICAgICAgICAgICQoJy50b3AtaGVhZGVyX2xpc3QgLmxpc3QnKS50b2dnbGVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICAgICAkKCcudG9wLWhlYWRlcl9saXN0IC5saXN0JykuZmluZCgnLmRyb3Bkb3duJykudG9nZ2xlQ2xhc3MoJ2Qtbm9uZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCQoJy50b3AtaGVhZGVyX2xpc3QgLmxhbmcnKS5oYXNDbGFzcygnb3BlbicpKSB7XHJcbiAgICAgICAgICAgICQoJy50b3AtaGVhZGVyX2xpc3QgLmxhbmcnKS50b2dnbGVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICAgICAkKCcudG9wLWhlYWRlcl9saXN0IC5sYW5nJykuZmluZCgnLmRyb3Bkb3duJykudG9nZ2xlQ2xhc3MoJ2Qtbm9uZScpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdfQ==
