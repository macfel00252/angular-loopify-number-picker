angular
    .module('angular-loopify-number-picker', [])
    .run(['$templateCache', function ($templateCache) {
        'use strict';
        $templateCache.put('template/loopify/numberpicker.html', '<table class="loopify-number-picker">' +
            '<tbody>' +
            '<tr class="text-center">' +
            '<td><a ng-click="incrementValue()" ng-class="{disabled: !canUp}" class="btn btn-link" ng-disabled="!canUp"><span class="glyphicon glyphicon-chevron-up"></span></a></td>' +
            '</tr>' +
            '<tr>' +
            '<td class="form-group" ng-class="{\'has-max\': isMaxValue, \'has-min\': isMinValue}">' +
            '<input style="width:68px;" type="text" ng-model="value" class="form-control text-center" ng-disabled="disabled" ng-readonly="enter" id="{{id}}">' +
            '</td>' +
            '<td ng-if="label">' +
            '<button type="button" class="btn btn-gray text-center" ng-click="togglePercentageValue()" ng-if="percent">{{percentLabel}}</button>' +
            '<label for="{{id}}" class="control-label" ng-if="!percent">{{label}}</label>' +
            '</td>' +
            '</tr>' +
            '<tr class="text-center">' +
            '<td><a ng-click="decrementValue()" ng-class="{disabled: !canDown}" class="btn btn-link" ng-disabled="!canDown"><span class="glyphicon glyphicon-chevron-down"></span></a></td>' +
            '</tr>' +
            '</tbody>' +
            '</table>');
    }])
    .directive('loopifyNumberPicker', [function () {
        'use strict';

        var config = {
                min: 0,
                max: Infinity,
                step: 1,
                enter: false,
                percent: false,
                label: undefined,
                methodRound: false
            },
            service = {
                index: 0,
                assignExtend: function (dest, src) {
                    var o = {};

                    for (var key in src) {
                        if (dest[key]) {
                            o[key] = dest[key];
                        }
                        else {
                            o[key] = src[key];
                            dest[key] = src[key];
                        }
                    }
                    return o;
                },
                isNumber: function (value) {
                    var val = Number(value);
                    return !isNaN(val) && val == value;
                },
                toNumber: function (value) {
                    return Number(value);
                },
                checkNumber: function (value) {
                    var self = this,
                    //count no numbers
                        cnn = 0;

                    if (angular.isArray(value)) {
                        angular.forEach(value, function (v) {
                            if (!self.isNumber(v)) {
                                cnn++;
                            }
                        });
                        if (cnn > 0) {
                            return false;
                        }
                        return true;
                    }
                    else {
                        if (!this.isNumber(value)) {
                            return false;
                        }
                        return true;
                    }
                },
                transform: function (opts) {
                    for (var key in opts) {
                        opts[key] = this.toNumber(opts[key]);
                    }
                },
                getId: function () {
                    return 'number-picker-' + (++this.index);
                }
            },
            base = {
                restrict: 'E',
                scope: {
                    'value': '=',
                    'min': '@',
                    'max': '@',
                    'step': '@',
                    'enter': '@',
                    'percent': '@',
                    'label': '@',
                    'methodRound': '@'
                }
            };
        return angular.extend(base, {
            //check if number
            link: function (scope, element) {
                var opts = service.assignExtend(scope, config);
                if (!service.checkNumber([opts.min, opts.max, opts.step])) {
                    throw new Error('some value: (min, max or step) is not a valid number');
                }

                if (scope.percent) {
                    scope.percentLabel = '%';
                }

                if (scope.percent) {
                    scope.isPercent = true;
                }

                scope.id = service.getId();

                //transform string to number
                service.transform(opts);

                //check if current value on start is not bigger than min value
                if (opts.min > scope.value) {
                    scope.value = opts.min;
                }

                scope.incrementValue = function () {
                    if (scope.value >= (scope.isPercent ? 100 : opts.max)) {
                        return;
                    }
                    scope.value += opts.step;
                };
                scope.decrementValue = function () {
                    if (scope.value <= (scope.isPercent ? 0 : opts.min)) {
                        return;
                    }
                    scope.value -= opts.step;
                };
                scope.togglePercentageValue = function () {
                    scope.isPercent = !scope.isPercent;
                    if (scope.isPercent) {
                        scope.percentLabel = '%';
                    }
                    else {
                        scope.percentLabel = scope.label;
                    }
                };

                //watch for disabled buttons
                scope.$watch('value', function (newValue, oldValue) {
                    var min = scope.isPercent ? 0 : opts.min,
                        max = scope.isPercent ? 100 : opts.max;

                    scope.canDown = newValue > min;
                    scope.canUp = newValue < max;
                    scope.isMaxValue = !scope.canUp;
                    scope.isMinValue = !scope.canDown;

                    if (!service.checkNumber(newValue) || newValue > max || newValue < min) {
                        //set oldValue or min value if oldValue isn't number when newValue isn't a number or newValue more than max or newValue less than min
                        scope.value = service.checkNumber(oldValue) ? oldValue : opts.min;
                    }
                });

                scope.$watch('percentLabel', function () {
                    if (scope.isPercent) {
                        scope.value = scope.methodRound ? Math[scope.methodRound](scope.value / scope.max * 100) : scope.value / scope.max * 100;
                    }
                    else {
                        scope.value = scope.methodRound ? Math[scope.methodRound](scope.max * scope.value / 100) : scope.max * scope.value / 100;
                    }
                });
            },
            templateUrl: 'template/loopify/numberpicker.html'
        });
    }]);