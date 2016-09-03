'use strict';

/**
 * @ngdoc function
 * @name washery.controller:LoginctrCtrl
 * @description
 * # LoginctrCtrl
 * Controller of the washery
 */
angular.module('washery')
    .controller('LoginCtr', function ($scope,userSessionService,ngToast,$state) {
		$scope.user = {
			username:'',
			password:''
		};

		$scope.loading = false;

		if(userSessionService.isLoggedIn()){
			$state.go('page.dashboard');
		}

		$scope.login = function(){
			$scope.loading = true;
			userSessionService.login($scope.user,function(success){
				if(success){
					$state.go('page.dashboard');
				} else {
					console.log("failed");
				}
				$scope.loading = false;
			});
		};
	});