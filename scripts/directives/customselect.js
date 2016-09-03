'use strict';

/**
 * @ngdoc directive
 * @name washery.directive:CustomSelect
 * @description
 * # CustomSelect
 */
angular.module('washery')
  .directive('customSelect', function () {
    return {
      template: '<div class="customSelect"><div class="display" ng-include="templateDisplay" ng-click="toggleDisplay()"></div><div class="items" style="position:relative;" ng-if="show"><div class="item" ng-repeat="item in items" ng-include="template" ng-click="select(item)"></div></div></div>',
      require: 'ngModel',
      scope: {
        template: '=template',
        templateDisplay: '=templateDisplay',
        model: '=ngModel',
        items: '=items',
        init: '=init',
        run: '=toRun'
      },
      restrict: 'E',
      link: function postLink(scope) {
        scope.show=false;
        if(scope.init){
         scope.item = scope.init;
        scope.model = scope.init;
        }
        scope.$watch('model',function(){
        if(scope.item !== scope.model){
          scope.item = scope.model;
        }
        });

        scope.toggleDisplay = function(){
          scope.show = !scope.show;
        };
        scope.select=function(item){
          scope.model=item;
          scope.item=item;
          scope.show = false;
        };
      }
    };
  });