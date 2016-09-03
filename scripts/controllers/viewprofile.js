'use strict';

/**
 * @ngdoc function
 * @name washery.controller:ViewprofileCtrl
 * @description
 * # ViewprofileCtrl
 * Controller of the washery
 */
angular.module('washery')
  .controller('ViewprofileCtrl', function ($scope,WasheryApi,ErrorService,$stateParams,$uibModal,ngToast) {
		$scope.profil = null;
		$scope.profilLoading = true;
		WasheryApi.user.getByUname($stateParams.uname).then(function(response){
			$scope.profil=response.data.data;
			$scope.profilLoading = false;
		},function(err){
			ErrorService.handle(err);
		});
		$scope.sendMessage = function(){
			$uibModal.open({
				animation: true,
				templateUrl: 'views/page/messages/modal_message.html',
				controller: function($scope,$uibModalInstance,message){
					$scope.message = message;
					$scope.close = function(){
						$uibModalInstance.dismiss();
					};
					$scope.done = function(){
						$uibModalInstance.close($scope.message);
					};
				},
				size: 'md',
				resolve: {
					message: function () {
						return {to:$scope.profil.username};
					}
				}
			}).result.then(function (result) {
				WasheryApi.message.create(result.subject,result.body,result.to).then(function(){
					ngToast.create({className:'success',content:'Message send'});
				},function(err){
					ErrorService.handle(err);
				});
			}, function () {});
		};
  });
