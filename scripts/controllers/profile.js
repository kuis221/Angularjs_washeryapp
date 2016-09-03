'use strict';

/**
 * @ngdoc function
 * @name washery.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the washery
 */
angular.module('washery')
  .controller('ProfileCtrl', function ($scope,userSessionService,$uibModal,WasheryApi,ngToast,ErrorService) {
		$scope.session = angular.copy(userSessionService.getSession());
		
		$scope.saveProfil=function(){
			WasheryApi.user.update(filter(userSessionService.getSession(),$scope.session)).then(function(){
				ngToast.create({className:'success',content:'Profil Information updated'});
				userSessionService.setSession($scope.session);
			},function(err){
				ErrorService.handle(err);
			});
			$scope.edit=false;
		};
		$scope.updateNoftifications = function(){
			WasheryApi.user.updateNotificationSettings($scope.session.pushnot,$scope.session.mailnot,$scope.session.smsnot).then(function(){
				userSessionService.setSession($scope.session);
			},function(err){
				ErrorService.handle(err);
			});
		};
		$scope.updatePassword = function(){
			if($scope.cngPassword.new === $scope.cngPassword.check){
				WasheryApi.user.changePassword($scope.cngPassword.old,$scope.cngPassword.new).then(function(){
					ngToast.create({className:'success',content:'Password changed'});
				},function(){
					ngToast.create({className:'danger',content:'Error while changing password'});
				});
			} else {
				ErrorService.customError('The repeated password is wrong!');
			}
			
		};
		$scope.changeProfilImage = function(){
			$uibModal.open({
				animation: true,
				templateUrl: 'views/common/image_upload.html',
				controller: function($scope,$uibModalInstance){
					$scope.newFile = null;
					$scope.loaded=0;
					$scope.onNewFile = function(file){
						WasheryApi.user.uploadImage(file,$scope.loaded,function(){
							ngToast.create({className:'success',content:'Profil image updated'});
							$uibModalInstance.close();
						},function(){
							ngToast.create({className:'danger',content:'Something went wrong ...'});
							$uibModalInstance.dismiss();
						});
					};
				},
				size: 'md',
				resolve: {
					items: function () {
						return $scope.items;
					}
				}
			});
		};
		function filter(obj1, obj2) {
			var result = {};
			for(var key in obj1) {
				if(obj2[key] !== obj1[key]){
					result[key] = obj2[key];
				}
				if(obj2[key] instanceof Array && obj1[key] instanceof Array) {
					result[key] = filter(obj1[key], obj2[key]);
				}
				if(typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
					result[key] = filter(obj1[key], obj2[key]);
				}
			}
			return result;
		}
  });
