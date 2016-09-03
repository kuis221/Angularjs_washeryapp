'use strict';

/**
 * @ngdoc function
 * @name washery.controller:PasswordrecoveryCtrl
 * @description
 * # PasswordrecoveryCtrl
 * Controller of the washery
 */
angular.module('washery')
  .controller('PasswordrecoveryCtrl', function ($scope,WasheryApi,ngToast,$stateParams,$state,ErrorService) {
		$scope.recover = function(){
			WasheryApi.user.recoverPassword($scope.mail).then(function(response){
				if(response.status !== 200){
					ErrorService.handle(response.data);
				}else {
					ngToast.create({
						className: 'success',
						content: 'An Email was sent to your address.'
					});
					$state.go('access.login');
				}
				
			},function(response){
				ErrorService.handle(response.data);
			});
		};
		$scope.changePassword = function(){
			WasheryApi.user.changePassword($stateParams.code, $scope.password).then(function(response){
				if(response.status === 200){
					ngToast.create({
						className: 'danger',
						content: 'Password changed'
					});
					$state.go('access.login');
				} else {
					ngToast.create({
						className: 'danger',
						content: 'Somthing went wrong ...'
					});	
				}
			},function(){
				ngToast.create({
					className: 'danger',
					content: 'Somthing went wrong ...'
				});	
				$state.go('access.login');
			});
		};
  });
