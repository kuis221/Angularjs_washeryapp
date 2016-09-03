'use strict';

/**
 * @ngdoc directive
 * @name washery.directive:UsernameAvailable
 * @description
 * # UsernameAvailable
 */
angular.module('washery')
  .directive('usernameAvailable', function (WasheryApi,$timeout) {
    return {
    restrict: 'AE',
    require: 'ngModel',
    link: function(scope, elem, attrs, model) { 
			model.$asyncValidators.unameExists = function() {
				return WasheryApi.user.userExists(elem.val()).then(function(){
					model.$setValidity('unameExists', true);
				},function(res){
					$timeout(function(){
						if(res.data.error.message.username[0] === 'The username has already been taken.')	{
							model.$setValidity('unameExists', false);
						}
					});
				});        
			};
		}
	}; 
  });
