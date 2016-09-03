'use strict';

/**
 * @ngdoc function
 * @name washery.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the washery
 */
angular.module('washery')
  .controller('RegisterCtrl', function ($scope,WasheryApi,ngToast,$stateParams,$state,$uibModal,$filter,ErrorService) {
		$scope.createAccount = function (){
			WasheryApi.user.create($scope.user).then(function(response){
				if(response.status !== 200){
					ErrorService.handle(response);
				}else {
					ngToast.create({
						className: 'success',
						content: 'Account created'
					});
					$state.go('access.login');
				}
			},function(response){
				ErrorService.handle(response);
			});
		};
    
		$scope.createWasher = function (){
			$scope.user.birthdate = $filter('date')($scope.user.birthdate,'MM/dd/yyyy');
			$scope.user.telephone = Number($scope.user.telephone);
			WasheryApi.washer.create($scope.user).then(function(response){
				if(response.status !== 200){
					ErrorService.handle(response);
				}else {
					ngToast.create({
						className: 'success',
						content: 'Account created'
					});
					$state.go('access.login');
				}
			},function(response){
				ErrorService.handle(response);
			});
		};
    
		$scope.activateAccount = function(){
			WasheryApi.user.confirm($stateParams.code, $stateParams.username).then(function(response){
				if(response.status !== 200){
					ErrorService.handle(response);
				}else {
					ngToast.create({
						className: 'success',
						content: 'Account activated'
					});
				}
				$state.go('access.login');
			},function(response){
				ErrorService.handle(response);
				$state.go('access.login');
			});
		};
		
		$scope.displayTOS = function(){
			$uibModal.open({
				animation: true,
				templateUrl: 'views/common/tos.html',
				controller: function($scope,$uibModalInstance){
					$scope.close = function(){
						$uibModalInstance.close();
					};
				},
				size: 'md'
			});
		};
		
		$scope.dispayPrivacy = function(){
			$uibModal.open({
				animation: true,
				templateUrl: 'views/common/privacy.html',
				controller: function($scope,$uibModalInstance){
					$scope.close = function(){
						$uibModalInstance.close();
					};
				},
				size: 'md'
			});
		};
  });
