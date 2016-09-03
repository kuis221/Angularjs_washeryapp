'use strict';

/**
 * @ngdoc function
 * @name washery.controller:VehiclesCtrl
 * @description
 * # VehiclesCtrl
 * Controller of the washery
 */
angular.module('washery')
  .controller('VehiclesCtrl', function ($scope,WasheryApi,ErrorService,$uibModal,$filter) {
		$scope.vehicles = null;
		$scope.itemsPerPage = 5;
		$scope.currentPage = 1;
		$scope.totalItems = 0;
		$scope.searchquery = '';
		$scope.loading = true;
		function loadVehicles(){
			$scope.loading = true;
			WasheryApi.vehicle.getList().then(function(response){
				$scope.vehicles = response.data.data;
				$scope.pageChanged();
				$scope.loading = false;
			},function(err){
				ErrorService.handle(err.data);
				$scope.loading = false;
			});	
		}
		loadVehicles();
		$scope.vehiclesTypes = WasheryApi.vehicle.vehicleTypes();
		
		$scope.pageChanged = function(){
			if(!$scope.vehicles){
				return;
			}
			var filteredList = $filter('filter')($scope.vehicles, $scope.searchquery);
			var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
			end = begin + $scope.itemsPerPage;
			$scope.filteredVehicles = filteredList.slice(begin, end);
			$scope.totalItems = filteredList.length;
		};
		$scope.$watch('searchquery',$scope.pageChanged);
		$scope.editVehicle = function(vehicle){
			$uibModal.open({
				animation: true,
				templateUrl: 'views/page/modals/modal_vehicle.html',
				controller: function($scope,$uibModalInstance,vTypes,vehicle){
					$scope.vehiclesTypes = vTypes;
					$scope.car = vehicle;
					$scope.close = function(){
						$uibModalInstance.dismiss();
					};
					$scope.done = function(){
						$uibModalInstance.close($scope.car);
					};
				},
				size: 'md',
				resolve:{
					vTypes:function(){
						return $scope.vehiclesTypes;
					},
					vehicle:function(){
						return vehicle;
					}
				}
			}).result.then(function (result) {
				WasheryApi.vehicle.update(result).then(function(){
					loadVehicles();
				},function(res){
					ErrorService.handle(res.data);
				
				});
			}, function () {});
		};
		$scope.deleteVehicle = function(vehicle){
			$uibModal.open({
				animation: true,
				templateUrl: 'views/common/confirm.html',
				controller: function($scope,$uibModalInstance,text,data){
					$scope.text = text;
					$scope.close = function(){
						$uibModalInstance.dismiss();
					};
					$scope.done = function(){
						$uibModalInstance.close(data);
					};
				},
				size: 'sm',
				resolve:{
					text:function(){return 'Delete Vehicle?';},
					data:function(){return vehicle;}
				}
			}).result.then(function (res) {
				WasheryApi.vehicle.delete(res).then(function(){
					loadVehicles();
				},function(res){
					ErrorService.handle(res.data);
				});
			}, function () {});
		};
		$scope.addVehicle = function(){
			$uibModal.open({
				animation: true,
				templateUrl: 'views/page/modals/modal_vehicle.html',
				controller: function($scope,$uibModalInstance,vTypes){
					$scope.vehiclesTypes = vTypes;
					$scope.newFile = null;
					$scope.onNewFile = function(file){
						$scope.newFile = file;
						var reader = new FileReader();
						reader.onload = function (e) {
							$scope.newFile.src = e.target.result;
							$scope.$apply();
						};
						reader.readAsDataURL(file);
					};
					$scope.close = function(){
						$uibModalInstance.dismiss();
					};
					$scope.done = function(){
						$uibModalInstance.close({car:$scope.car,image:$scope.newFile});
					};
					
				},
				size: 'md',
				resolve:{
					vTypes:function(){
						return $scope.vehiclesTypes;
					}
				}
			}).result.then(function (result) {
				$scope.loading = true;
				WasheryApi.vehicle.create(result.car).then(function(){
					WasheryApi.vehicle.getList().then(function(response){						
						WasheryApi.vehicle.setImage(result.image,response.data.data[response.data.data.length-1].id,function(){
							console.log('Vehicle Image Uploaded');
							$scope.loading = false;
							loadVehicles();
						},function(){
							console.log('Vehicle Image Upload Error');
							$scope.loading = false;
						});
					},function(err){
						ErrorService.handle(err.data);
						$scope.loading = false;
					});	
				},function(res){
					ErrorService.handle(res.data);
					$scope.loading = false;
				});
				
			}, function () {});
		};
		
  });
