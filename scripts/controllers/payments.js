'use strict';

/**
 * @ngdoc function
 * @name washery.controller:PaymentsCtrl
 * @description
 * # PaymentsCtrl
 * Controller of the washery
 */
angular.module('washery')
  .controller('PaymentsCtrl', function ($scope,WasheryApi,ngToast) {
		$scope.payments = null;
		$scope.itemsPerPage = 15;
		$scope.currentPage = 1;
		WasheryApi.paymentaudit.getHistory().then(function(response){
			$scope.payments = response.data;
			$scope.pageChanged();
		},function(){
			ngToast.create({className:'danger',content:'Error while recieving Payments.'});
		});
		
		
		
		
		$scope.pageChanged = function(){
			var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
			end = begin + $scope.itemsPerPage;
			$scope.filteredPayments = $scope.payments.slice(begin, end);
		};
  });
