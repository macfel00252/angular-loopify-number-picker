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
                methodRound: undefined
            },
            service = {
                index: 0,
                assignExtend: function (dest, src) {
                    for (var i in src) {
                        if (dest[i] === undefined) {
                            dest[i] = src[i];
                        }
                    }
                },
                isNumber: function (value) {
                    var val = Number(value);
                    return !isNaN(val) && val === value;
                },
                toNumber: function (value) {
                    return Number(value);
                },
                checkNumber: function (value, scope) {
                    var self = this,
                    //count no numbers
                        cnn = 0;

                    if (angular.isArray(value)) {
                        angular.forEach(value, function (v) {
                            v = scope ? scope[v] : v;
                            if (!self.isNumber(v)) {
                                cnn += 1;
                            }
                        });
                        if (cnn > 0) {
                            return false;
                        }
                        return true;
                    }
                    //else
                    value = scope ? scope[value] : value;
                    if (!this.isNumber(value)) {
                        return false;
                    }
                    return true;
                },
                getId: function () {
                    this.index += 1;
                    return 'number-picker-' + this.index;
                }
            },
            base = {
                restrict: 'E',
                scope: {
                    'value': '=',
                    'min': '=',
                    'max': '=',
                    'step': '=',
                    'enter': '@',
                    'percent': '@',
                    'label': '@',
                    'methodRound': '@'
                }
            };
        return angular.extend(base, {
            //check if number
            link: function (scope) {
                var numbers = ['value', 'min', 'max', 'step'];

                scope.watchValue = function (newValue) {
                    var min = scope.isPercent ? 0 : scope.min,
                        max = scope.isPercent ? 100 : scope.max;

                    scope.canDown = newValue > min && +newValue - (+scope.step) >= min;
                    scope.canUp = newValue < max && +newValue + (+scope.step) <= max;

                    scope.isMaxValue = !scope.canUp;
                    scope.isMinValue = !scope.canDown;

                    if (!service.checkNumber(newValue) || newValue > max || newValue < min) {
                        //set oldValue or min value if oldValue isn't number when newValue isn't a number or newValue more than max or newValue less than min
                        scope.value = service.checkNumber(scope.oldValue) ? scope.oldValue : scope.min;
                    }
                    scope.oldValue = newValue;
                };

                service.assignExtend(scope, config);

                if (!service.checkNumber(numbers, scope)) {
                    throw new Error('some value: (min, max or step) is not a valid number');
                }

                if (scope.percent) {
                    scope.percentLabel = '%';
                }

                if (scope.percent) {
                    scope.isPercent = true;
                }

                scope.id = service.getId();

                //check if current value on start is not less than min value and not bigger than max value
                scope.checkEdge = function () {
                    if (scope.min > scope.value) {
                        scope.value = scope.min;
                    }
                    if (scope.max < scope.value) {
                        scope.value = scope.max;
                    }
                };
                scope.checkEdge();

                scope.incrementValue = function () {
                    if (scope.value >= (scope.isPercent ? 100 : scope.max)) {
                        return;
                    }

                    scope.value += +scope.step;
                    scope.watchValue(scope.value);
                };
                scope.decrementValue = function () {
                    if (scope.value <= (scope.isPercent ? 0 : scope.min)) {
                        return;
                    }

                    scope.value -= +scope.step;
                    scope.watchValue(scope.value);
                };
                scope.togglePercentageValue = function () {
                    scope.isPercent = !scope.isPercent;
                    if (scope.isPercent) {
                        scope.percentLabel = '%';
                    } else {
                        scope.percentLabel = scope.label;
                    }
                };


                scope.$watch('percentLabel', function () {
                    if (scope.isPercent) {
                        scope.value = scope.methodRound ? Math[scope.methodRound](scope.value / scope.max * 100) : scope.value / scope.max * 100;
                    } else {
                        scope.value = scope.methodRound ? Math[scope.methodRound](scope.max * scope.value / 100) : scope.max * scope.value / 100;
                    }
                });
                scope.$watchGroup(numbers, function () {
                    scope.checkEdge();
                    scope.watchValue(scope.value);
                });
            },
            templateUrl: 'template/loopify/numberpicker.html'
        });
    }]);