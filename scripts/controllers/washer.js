'use strict';

/**
 * @ngdoc function
 * @name washery.controller:WasherCtrl
 * @description
 * # WasherCtrl
 * Controller of the washery
 */
angular.module('washery')
  .controller('WasherCtrl', function ($scope,WasheryApi,ErrorService,$geolocation) {
		$scope.openWashings = [];
		$scope.area = {radius:1000};
		$scope.map = { center: { latitude: 41.9102415, longitude: 12.3959118 }, zoom: 8 };
		WasheryApi.washer.getList().then(function(res){
			$scope.openWashings = res.data.data;
			angular.forEach($scope.openWashings,function(item){
				if(item.status!=="34"){
					WasheryApi.place.getById(item.place_id).then(function(res){
						item.place = res.data.data[0];
						$scope.map = { center: { latitude: item.place.latitude, longitude: item.place.longitude }, zoom: 16 };
					},function(err){ErrorService.handle(err);});
					item.events = {
						click:function(){
							$scope.loadWashing(item);
						}
					};
				}
				
			});
		},function(err){
			ErrorService.handle(err);
		});
		
		$scope.loadWashing = function(washing){
			if(washing.show){
				washing.show=false;
				return;
			}
			angular.forEach($scope.openWashings,function(item){item.show=false;});
			if(!washing.loaded){
				WasheryApi.vehicle.getById(washing.vehicle_id).then(function(res){
					washing.vehicle = res.data.data[0];
					WasheryApi.utils.washingTypes( washing.vehicle.vehicletype_id).then(function(res){
						angular.forEach(res.data.data,function(item){
							if(item.id==washing.washingtype_id){
								washing.washing = item
							}
						});
						washing.loaded=true;
					},function(err){ErrorService.handle(err);})
				},function(err){ErrorService.handle(err);});
				WasheryApi.profil.getProfilById(washing.user_id).then(function(res){
					washing.user = res.data.data;
				},function(err){ErrorService.handle(err);});
				
			}
			$scope.map = { center: { latitude: washing.place.latitude, longitude: washing.place.longitude }, zoom: 16 };
			washing.show=true;
		};
		$scope.areaChanged = function(){
			$scope.map.center = {
				longitude:$scope.area.longitude,
				latitude:$scope.area.latitude
			};
			$scope.map.zoom = 10;
		};
		$scope.setServedZone = function(){
			WasheryApi.washer.setZone($scope.area.longitude,$scope.area.latitude,$scope.area.radius).then(function(){
				
			},function(err){
				ErrorService.handle(err);
			});
		}
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
					$scope.area.longitude=res.coords.longitude;
					$scope.area.latitude=res.coords.latitude;
					$scope.map.zoom = 15;
				});
		};
		
		function loadWashings(){
			WasheryApi.washer.getList().then(function(res){
				$scope.openWashings = res.data.data;
				angular.forEach($scope.openWashings,function(item){
					if(item.status!=="34"){
						WasheryApi.locations.getLocation(item.place_id).then(function(res){
							item.place = res.data.data[0];
							$scope.map = { center: { latitude: item.place.latitude, longitude: item.place.longitude }, zoom: 16 };
						},function(err){ErrorService.handle(err);});
						item.events = {
							click:function(){
								$scope.loadWashing(item);
							}
						};
					}
					
				});
			},function(err){
				ErrorService.handle(err);
			});
		}
		
		$scope.completeWashing = function(booking){
			WasheryApi.washer.completeWashing(booking.id).then(function(res){
				loadWashings();
			},function(err){
				ErrorService.handle(err);
			});
		}
		
		$scope.acceptWashing = function(washing){
			WasheryApi.washer.createWashing(washing.id).then(function(res){
				loadWashings();
			},function(err){
				ErrorService.handle(err);
			});
		};
  });
