'use strict';

/**
 * @ngdoc function
 * @name washery.controller:LocationsCtrl
 * @description
 * # LocationsCtrl
 * Controller of the washery
 */
angular.module('washery')
	.config(function(uiGmapGoogleMapApiProvider) {
		uiGmapGoogleMapApiProvider.configure({
			libraries: 'weather,geometry,visualization'
		});
	})
  .controller('LocationsCtrl', function ($scope,WasheryApi,$geolocation,$state,ErrorService,$uibModal) {
		$scope.map = { center: { latitude: 41.9102415, longitude: 12.3959118 }, zoom: 8 };
		$scope.serverdZones = [];
		$scope.locations = [];
		$scope.newLocation = {};
		$scope.loadLocations = false;
		function loadLocations(){
			$scope.loadLocations = true;
			WasheryApi.place.getList().then(function(response){
				$scope.locations = response.data.data;
				angular.forEach($scope.locations,function(item){
					item.options = {
						icon:'images/car_marker.png',
						draggable:true
					};
					item.events = {
						dragend:function(){
							WasheryApi.place.update(item).then(function(){
								loadLocations();
								console.log('Location updated');
							},function(response){
								loadLocations();
								ErrorService.handle(response);
							});
						}
					};
				});
				$scope.loadLocations = false;
			},function(response){
				ErrorService.handle(response);
				$scope.loadLocations = false;
			});
		}
		loadLocations();
		
		WasheryApi.utils.getServedZones().then(function(response){
				$scope.serverdZones = response.data.data;
				console.log($scope.serverdZones);
		},function(response){
			ErrorService.handle(response);
		});
		
		$scope.addLocation = function(){
			$scope.newLocation = {
				longitude:$scope.map.center.longitude,
				latitude:$scope.map.center.latitude,
				options :{
					draggable:true,
					icon:'images/car_marker.png'
				},
				events:{
					dragend:function(){
						WasheryApi.utils.checkServedCoords($scope.newLocation.latitude,$scope.newLocation.longitude).then(function(response){
							if(response.data.error){
								$scope.newLocation.isValid = false;
							} else {
								$scope.newLocation.isValid = true;
							}
							
						},function(response){
							ErrorService.handle(response);
						});
					}
				},
				default:'0',
				isValid:false
			};
			$state.go('page.locations.new');
		};
		$scope.saveNewLocation = function(){
			WasheryApi.place.create($scope.newLocation.name,$scope.newLocation.latitude,$scope.newLocation.longitude,$scope.newLocation.default).then(function(){
					loadLocations();
					$state.go('page.locations.all');
			},function(response){
				ErrorService.handle(response);
			});
		};
		$scope.cancelNewLocation = function(){
			$scope.newLocation = null;
			$state.go('page.locations.all');
		};
		$scope.deleteLocation = function(location){
			WasheryApi.place.delete(location.id).then(function(){
				loadLocations();
			},function(response){
				loadLocations();
				ErrorService.handle(response);
			});
		};
		$scope.setToDefault = function(newDefLoc){
			// Find old Default
			var oldDefLoc = null;
			for(var idx in $scope.locations){
				console.log($scope.locations[idx]);
				if($scope.locations[idx].default === '1'){
					oldDefLoc = $scope.locations[idx];
				}
			}
			console.log(oldDefLoc);
			if(oldDefLoc){
				$uibModal.open({
					animation: true,
					templateUrl: 'views/common/confirm.html',
					controller: function($scope,$uibModalInstance,text){
						$scope.text = text;
						$scope.close = function(){
							$uibModalInstance.dismiss();
						};
						$scope.done = function(){
							$uibModalInstance.close();
						};
					},
					size: 'sm',
					resolve:{
						text:function(){return 'Change default location to '+newDefLoc.name + '?';}
					}
				}).result.then(function () {
                    oldDefLoc.default = 0;
					WasheryApi.place.update(oldDefLoc).then(function(){
					
                       newDefLoc.default = 1; WasheryApi.place.update(newDefLoc).then(function(){
							loadLocations();
						},function(err){
							ErrorService.handle(err);
						});
					},function(err){
						ErrorService.handle(err);
					});
				});
			} else {
                newDefLoc.default = 1;
				WasheryApi.place.update(newDefLoc).then(function(){
					loadLocations();
				},function(err){
					ErrorService.handle(err);
				});
			}
			
		};
		$scope.selectedLocation = {};
		$scope.selectLocation = function(location){
			if($scope.selectedLocation.options) {$scope.selectedLocation.options.icon = 'images/car_marker.png';}
			$scope.selectedLocation = location;
			$scope.selectedLocation.options.icon = 'images/car_marker_selected.png';
			$scope.map.center = {
				longitude:$scope.selectedLocation.longitude,
				latitude:$scope.selectedLocation.latitude
			};
		};
		
		$scope.setToCurrentLocation = function(){
			$geolocation.getCurrentPosition({
					enableHighAccuracy:true,
					timeout:60000,
					maximumAge:250
				}).then(function(res){
					$scope.map.center = {
						longitude:res.coords.longitude,
						latitude:res.coords.latitude
					};
					$scope.newLocation.longitude=res.coords.longitude;
					$scope.newLocation.latitude=res.coords.latitude;
					$scope.map.zoom = 15;
				});
		};
  })
  .filter('num', function() {
		return function(input) {
		  return parseInt(input, 10);
		};
	});
