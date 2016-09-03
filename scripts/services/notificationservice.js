'use strict';

/**
 * @ngdoc service
 * @name washery.NotificationService
 * @description
 * # NotificationService
 * Service in the washery.
 */
angular.module('washery')
  .service('NotificationService', function () {
		var notifications = [];
		return {
			addNotification:function(title,text,date){
				notifications.push({title:title,text:text,date:date,isnew:true});
			},
			notifications:notifications
		};
  })
  .directive('notificationButton', function (NotificationService) {
    return {
      template: '<div class="notify-container" uib-collapse="display" ng-style="pos">'+
					'<h1 class="notify-header" >Notifications</h1>'+
					'<div class="notify-notification"  ng-repeat="notifi in notifications">'+
						'<h3 class="header" >{{notifi.title}}</h3>'+
						'<p  class="text">{{notifi.text}}</p>'+
						'<p  class="date">{{notifi.date}}</p>'+
					'</div>'+
					'<div ng-show="notifications.length<1">No Notification</div>'+
				'</div>',
      restrict: 'A',
      controller: function ($scope,$element) {
			$scope.notifications = NotificationService.notifications;
			$scope.display = true;
			$scope.pos={
				position:'absolute',
				right:'-17px',
				top:'35px',
			};
			$element.bind('click', function(){
				$scope.display=!$scope.display;
				console.log($scope.display);
				if (!$scope.$$phase && !$scope.$root.$$phase) {
					$scope.$apply();
				}
			});
      }
    };
  });
