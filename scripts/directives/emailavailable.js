'use strict';

/**
 * @ngdoc directive
 * @name washery.directive:EmailAvailable
 * @description
 * # EmailAvailable
 */
angular.module('washery')
  .directive('emailAvailable', function (WasheryApi,$timeout) {
    return {
    restrict: 'AE',
    require: 'ngModel',
    link: function(scope, elem, attrs, model) { 
			model.$asyncValidators.emailExists = function() {
				return WasheryApi.user.emailExists(elem.val()).then(function(){
					model.$setValidity('emailExists', true);
					model.$setValidity('emailValid', true);
				},function(res){
					console.log(res);
					$timeout(function(){
						if(res.data.error.message.email[0] === 'The email has already been taken.')	{
							model.$setValidity('emailExists', false);
						} else {
							model.$setValidity('emailValid', false);
						}
					});
				});        
			};
		}
	}; 
  });
