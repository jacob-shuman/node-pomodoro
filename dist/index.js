"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NPTimer = exports.isValidPeriod = void 0;
var models_1 = require("./models");
exports.isValidPeriod = function (period) {
    return (period.duration.hours > 0 ||
        period.duration.minutes > 0 ||
        period.duration.seconds > 0);
};
var NPTimer = /** @class */ (function () {
    function NPTimer(options) {
        this.period = 0;
        this.periods = [];
        this.periodChanged = false;
        this.periodCounter = { hours: 0, minutes: 0, seconds: 0 };
        this.running = false;
        var periods = options.periods, startImmediately = options.startImmediately, onPeriodChange = options.onPeriodChange;
        if (periods.length < 1) {
            throw Error(models_1.NPError.MISSING_PERIODS);
        }
        else if (periods.some(function (p) { return !exports.isValidPeriod(p); })) {
            throw Error(models_1.NPError.INVALID_PERIOD);
        }
        this.periods = periods;
        this.onPeriodChange = onPeriodChange;
        this.periodCounter = __assign({}, this.periods[this.period].duration);
        if (startImmediately) {
            this.start();
        }
    }
    NPTimer.prototype.start = function () {
        var _this = this;
        if (!this.running) {
            this.intervalId = setInterval(function () {
                if (_this.periodChanged && _this.onPeriodChange) {
                    _this.periodChanged = false;
                    var nextPeriod = _this.period < _this.periods.length - 1 ? _this.period + 1 : 0;
                    var prevPeriod = _this.period > 0 ? _this.period - 1 : _this.periods.length - 1;
                    _this.onPeriodChange(_this.periods[_this.period], _this.periods[nextPeriod], _this.periods[prevPeriod]);
                }
                if (_this.periods[_this.period].onHour && _this.periodCounter.hours > 0) {
                    _this.periods[_this.period].onHour(_this.periodCounter.hours);
                }
                if (_this.periods[_this.period].onMinute &&
                    _this.periodCounter.minutes > 0) {
                    _this.periods[_this.period].onMinute(_this.periodCounter.minutes);
                }
                if (_this.periods[_this.period].onSecond &&
                    _this.periodCounter.seconds > 0) {
                    _this.periods[_this.period].onSecond(_this.periodCounter.seconds);
                }
                if (_this.periodCounter.seconds > 1) {
                    _this.periodCounter.seconds--;
                }
                else if (_this.periodCounter.minutes > 1) {
                    _this.periodCounter.minutes--;
                    _this.periodCounter.seconds = 59;
                }
                else if (_this.periodCounter.hours > 1) {
                    _this.periodCounter.hours--;
                    _this.periodCounter.minutes = 59;
                    _this.periodCounter.seconds = 59;
                }
                else if (_this.periodCounter.hours < 2 &&
                    _this.periodCounter.minutes < 2 &&
                    _this.periodCounter.seconds < 2) {
                    if (_this.period < _this.periods.length - 1) {
                        _this.period++;
                    }
                    else {
                        _this.period = 0;
                    }
                    _this.periodCounter = __assign({}, _this.periods[_this.period].duration);
                    _this.periodChanged = true;
                }
            }, 1000);
            this.running = true;
            if (this.onStart) {
                this.onStart();
            }
        }
    };
    NPTimer.prototype.stop = function () {
        if (this.running) {
            clearInterval(this.intervalId);
            this.running = false;
            if (this.onStop) {
                this.onStop();
            }
        }
    };
    NPTimer.prototype.reset = function () {
        if (this.running) {
            this.stop();
        }
        this.period = 0;
        if (this.onReset) {
            this.onReset();
        }
    };
    NPTimer.prototype.toggleState = function () {
        if (this.running) {
            this.stop();
        }
        else {
            this.start();
        }
    };
    NPTimer.prototype.addPeriod = function (period) {
        this.periods.push(period);
    };
    return NPTimer;
}());
exports.NPTimer = NPTimer;
exports.default = NPTimer;
