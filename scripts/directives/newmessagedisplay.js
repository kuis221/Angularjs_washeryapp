'use strict';

/**
 * @ngdoc directive
 * @name washery.directive:newMessageDisplay
 * @description
 * # newMessageDisplay
 */
angular.module('washery')
  .directive('newMessageDisplay', function (MessageService) {
    return {
      template: '<span ng-if="newMsgs>0">{{newMsgs}}</span>',
      restrict: 'A',
      link: function (scope) {
			scope.newMsgs = MessageService.newMessages();
			scope.$on('message:update',function(){
				scope.newMsgs = MessageService.newMessages();
			});
      }
    };
  });
