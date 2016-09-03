'use strict';
// jscs:disable
// jshint ignore: start
/**
 * @ngdoc function
 * @name washery.controller:BookingsCtrl
 * @description
 * # BookingsCtrl
 * Controller of the washery
 */
angular.module('washery')
  .controller('BookingsCtrl', function ($scope,WasheryApi,ErrorService,$filter) {
		$scope.bookings = null;
		$scope.itemsPerPage = 10;
		$scope.currentPage = 1;

		$scope.loading = {
			vehicles:true,
			locations:true,
			bookings:true,
			all:true
		};
		var vehicles = null;
		var locations = null;

		function load(){
			$scope.loading = {
					vehicles:true,
					locations:true,
					bookings:true,
					all:true
				};
			WasheryApi.vehicle.getList().then(function(res){
				vehicles = res.data.data;
				$scope.loading.vehicles=false;
				if(!$scope.loading.vehicles && !$scope.loading.locations && !$scope.loading.bookings){
					joinLists();
				}
			},function(err){
				ErrorService.handle(err);
			});
			WasheryApi.place.getList().then(function(res){
				locations = res.data.data;
				$scope.loading.locations=false;
				if(!$scope.loading.vehicles && !$scope.loading.locations && !$scope.loading.bookings){
					joinLists();
				}
			},function(err){
				ErrorService.handle(err);
			});
			WasheryApi.booking.getHistory().then(function(response){
				$scope.bookings = response.data.data;
				$scope.loading.bookings=false;
				if(!$scope.loading.vehicles && !$scope.loading.locations && !$scope.loading.bookings){
					joinLists();
				}
			},function(err){
				ErrorService.handle(err);
			});
		}
		load();

		function find(id,array){
			for(var idx in array){
				if(array[idx].id == id){
					return array[idx];
				}
			}
			console.log('Cant find the searched item');
		}
		function joinLists(){
			console.log(vehicles,locations);
			angular.forEach($scope.bookings,function(item){
				item.vehicle = find(item.vehicle_id,vehicles);
				item.location = find(item.place_id,locations);
				WasheryApi.utils.washingTypes(item.vehicle.vehicletype_id).then(function(res){
					item.washingtype=find(item.washingtype_id,res.data.data);
				},function(err){
				});
			});
			$scope.loading.all=false;
			$scope.pageChanged();
		}

		$scope.reportAbuse = function(booking){
			WasheryApi.booking.reportAbuse(booking.id).then(function(){
				ngToast.create({className:'success',context:'Booking canceled'});
			},function(err){
				ErrorService.handle(err);
			});
		};
		$scope.cancelBooking = function(booking){
			WasheryApi.booking.cancel(booking.id).then(function(){
				load();
			},function(err){
				ErrorService.handle(err);
			});
		};

		$scope.pageChanged = function(){
			if(!$scope.bookings){
				return;
			}
			var filteredList = $filter('filter')($filter('orderBy')($scope.bookings,'status'), $scope.searchquery);
			var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
			end = begin + $scope.itemsPerPage;
			$scope.filteredBookings = filteredList.slice(begin, end);
			$scope.totalItems = filteredList.length;
		};
  });
