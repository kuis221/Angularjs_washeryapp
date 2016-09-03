'use strict';
// jscs:disable
/**
 * @ngdoc function
 * @name washery.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the washery
 */
angular.module('washery')
  .config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
      libraries: 'weather,geometry,visualization'
    });
  })
  .controller('DashboardCtrl', function ($scope,WasheryApi,ErrorService,$filter,userSessionService,$uibModal,$timeout,$sessionStorage, $state) {
    //Step
    $scope.currentStage = 0;
    $scope.nextStep = function(){
      $scope.currentStage++;
      if($scope.currentStage===1){
        $scope.triggerResize();
      }
      if($scope.currentStage===2){
        $scope.changeMethode(userSessionService.getSession().paymentprocessor_id);
      }
    };
    $scope.changeStage = function(selectedStage){
      if(selectedStage<$scope.currentStage){
        $scope.currentStage = selectedStage;
      }
    };
    $scope.setStep = function(step){
      $scope.currentStage = step;
    };
    $scope.previousStep = function(){
      $scope.currentStage--;
    };
    $scope.booking = {
      vehicle:null,
      washtype:500,
      price:0
    };
    $scope.loading = {
      price:false,
      washingtypes:false,
      vehicles:false,
      paypal:true
    };

    $scope.minDate = new Date();
    $scope.$watch('booking.vehicle + booking.washtype',function(){
      if($scope.booking.vehicle && $scope.booking.washtype){
        $scope.loading.price = true;
        WasheryApi.booking.getPrice($scope.booking.vehicle.vehicletype_id,$scope.booking.washtype).then(function(response){
          $scope.booking.price = response.data.response.message.price;
          $scope.loading.price = false;
        },function(err){
          ErrorService.handle(err);
          $scope.booking.price = 'Not available';
          $scope.loading.price = false;
        });
      }

    },true);
    $scope.$watch('booking.vehicle',function(){
      if($scope.booking.vehicle){
        $scope.loadVehicleWashtypes();
      }
    },true);

    $scope.$watch('booking.location',function(){
      if($scope.booking.location){
        $scope.map = { center: { latitude: $scope.booking.location.latitude, longitude: $scope.booking.location.longitude }, zoom: 15 };
      }
    });
    function loadPaypal(){
      $scope.loading.paypal = true;
      WasheryApi.booking.getPaypal($scope.booking.washtype).then(function(res){
        if(res.status === 302){
          console.log(res);
        }
        $scope.loading.paypal = false;
        $scope.paypalButton = res.data.response.message.url;
      },function(err){
        $scope.loading.paypal = false;
        ErrorService.handle(err);
      });
    }


    //paymentmethode
    $scope.paypalButton = null;
    $scope.stripeId = userSessionService.getSession().stripe_id;
    if($sessionStorage.booking){
      $scope.booking = JSON.parse($sessionStorage.booking.data);
      $scope.booking.displaydate = new Date($scope.booking.date);
      console.log("Restored booking",$scope.booking,JSON.parse($sessionStorage.booking.data));
      //$sessionStorage.booking=null;
      $scope.currentStage=2;
      $scope.paypalPaid = true;

    }
    $scope.paymentmethode = 302;
    $scope.changeMethode = function(n){
      if((n===301 || n==='301') && !$scope.paypalButton){
        console.log('htl');
        loadPaypal();
      }
      if(n!==$scope.paymentmethode){
        console.log('change methode');
        $scope.loading.paymentmethode = true;

      }
      $scope.paymentmethode=n;
    };
    $scope.changeMethode($scope.paymentmethode);
    $scope.gmapBooking = {};
    $scope.triggerResize = function(){
      console.log('Reload gm');
      $timeout(function() {
        $scope.gmapBooking.refresh();
      },500);
    }

    $scope.loadVehicleWashtypes = function(){
      $scope.loading.washtypes = true;
      WasheryApi.utils.washingTypes($scope.booking.vehicle.vehicletype_id).then(function(res){
        $scope.washtypes=res.data.data;
        $scope.loading.washtypes = false;
      },function(err){
        ErrorService.handle(err);
      });
    };
    $scope.map = { center: { latitude: 10, longitude: 10 }, zoom: 15 };
    $scope.loading.price = true;
    WasheryApi.vehicle.getList().then(function(response){
      $scope.vehicles = response.data.data;
      $scope.booking.vehicle = $scope.vehicles[0];
      $scope.loading.price = false;
    },function(err){
      ErrorService.handle(err);
    });
    WasheryApi.utils.getServedZones().then(function(response){
        $scope.serverdZones = response.data.data;
    },function(response){
      ErrorService.handle(response);
    });
    WasheryApi.place.getList().then(function(response){
        $scope.locations = response.data.data;
        angular.forEach($scope.locations,function(item){
          if(item.default==='1'){
            $scope.defLocation = item;
            $scope.map = { center: { latitude: item.latitude, longitude: item.longitude }, zoom: 15 };
          }
          item.options = {
            icon:'images/car_marker.png',
            draggable:false
          };
        });
        console.log($scope.locations);
    },function(response){
      ErrorService.handle(response);
    });

    $scope.createBooking = function(){
      $scope.booking.date = $filter('date')($scope.booking.displaydate,'MM/dd/yyyy');
      WasheryApi.user.paymentSetup($scope.paymentmethode).then(function(){
        $scope.loading.paymentmethode = false;
      },function(err){
        ErrorService.handle(err);
      });
      WasheryApi.booking.create($scope.booking.location.id,$scope.booking.vehicle.id,$scope.booking.washtype,$scope.booking.hour,$scope.booking.date,$scope.booking.note).then(function(response){
        if(response.data.error){
          ErrorService.customError(response.data.error.message);
        } else {
          //$scope.currentStage=0;
          //$scope.booking={};
          $state.go("page.bookings");
        }

      },function(err){
        ErrorService.handle(err);
      });
    };
    $scope.paypalPayment = function(){
      $scope.booking.date = $filter('date')($scope.booking.displaydate,'dd/MM/yyyy');
      $sessionStorage.booking = {data:JSON.stringify($scope.booking)};
    };
    $scope.stripePayment=function(){
      $scope.loading.stripe = true;
       Stripe.card.createToken( $('#stripe-form'), function(status,res){
        if(status!==200){
          console.log(res.error.message);
          $scope.stripeErrortext = res.error.message;
          $scope.loading.stripe = false;
        } else {
          WasheryApi.user.paymentSetup(300,res.id).then(function(){
            $scope.loading.stripe = false;
            $scope.stripeId=res.id;
            var session = userSessionService.getSession();
            session.stripe_id=res.id;
            userSessionService.setSession(session);
          },function(err){
            ErrorService.handle(err);
          });
          $scope.stripeErrortext = null;
        }


        $scope.$apply();
       });
    };
    $scope.addVehicle = function(){
      $uibModal.open({
        animation: true,
        templateUrl: 'views/page/modals/modal_vehicle.html',
        controller: function($scope,$uibModalInstance){
          $scope.vehiclesTypes = WasheryApi.vehicle.vehicleTypes();
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
        size: 'md'
      }).result.then(function (result) {
        WasheryApi.vehicle.create(result.car).then(function(){
          WasheryApi.vehicle.getList().then(function(response){
            WasheryApi.vehicle.getList().then(function(response){
              $scope.vehicles = response.data.data;
            },function(err){
              ErrorService.handle(err);
            });
            WasheryApi.vehicle.setImage(result.image,response.data.data[response.data.data.length-1].id,function(){

            },function(err){
              ErrorService.handle(err);
            });
          },function(err){
            ErrorService.handle(err);
          });
        },function(res){
          ErrorService.handle(res);
        });

      }, function () {});
    };
  });
