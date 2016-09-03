'use strict';

/**
 * @ngdoc overview
 * @name washery
 * @description
 * # washery
 *
 * Main module of the application.
 */
angular
  .module('washery', [
	'ui.router',
	'ngToast',
  'ngSanitize',
	'uiGmapgoogle-maps',
  'ngTouch',
	'vcRecaptcha',
	'ngResource',
	'ngGeolocation',
	'google.places',
	'angular-ladda',
	'ui.bootstrap',
	'ngStorage',
  'angulartics',
//    'angulartics.google.analytics',
//    'stripe'
  ])
  .config(function($stateProvider,$urlRouterProvider,laddaProvider,$httpProvider) {
//		Stripe.setPublishableKey('pk_test_VpwpT59IXjM9zCnKsWBNcN33');
		laddaProvider.setOption({
			spinnerSize: 35,
			spinnerColor: '#222'
		});
		$httpProvider.defaults.useXDomain = true;
		$urlRouterProvider.otherwise('/login');
		$stateProvider
			.state('access', {
				templateUrl: 'views/access.html',
				abstract:true
			})
			.state('access.login', {
				templateUrl: 'views/access/login.html',
				controller: 'LoginCtr',
				url:'/login'
			})
			.state('access.recover-password', {
				templateUrl: 'views/access/recover-password.html',
				controller: 'PasswordrecoveryCtrl',
				url:'/recover'
			})
			.state('access.reset-password', {
				templateUrl: 'views/access/reset-password.html',
				controller: 'PasswordrecoveryCtrl',
				url:'/reset?code='
			})
			.state('access.register', {
				templateUrl: 'views/access/register.html',
				controller: 'RegisterCtrl',
				url:'/register'
			})
			.state('access.registerwasher', {
				templateUrl: 'views/access/register_washer.html',
				controller: 'RegisterCtrl',
				url:'/register/washer'
			})
			.state('access.activate', {
				templateUrl: 'views/access/activate-account.html',
				controller: 'RegisterCtrl',
				url:'/confirm?code&username'
			})
			// Resticted Area
			.state('page', {
				templateUrl: 'views/page.html',
				abstract:true
			})
			.state('page.dashboard', {
				templateUrl: 'views/page/dashboard.html',
				controller: 'DashboardCtrl',
				url:'/l/dashboard',
				data: {auth:'USER'}
			})
			.state('page.profil', {
				templateUrl: 'views/page/profil.html',
				controller: 'ProfileCtrl',
				url:'/l/profil',
				data: {auth:'USER'}
			})
			.state('page.viewprofil', {
				templateUrl: 'views/page/viewprofil.html',
				controller: 'ViewprofileCtrl',
				url:'/l/viewprofil?uname=',
				data: {auth:'USER'}
			})
			.state('page.bookings', {
				templateUrl: 'views/page/bookings.html',
				controller: 'BookingsCtrl',
				url:'/l/bookings',
				data: {auth:'USER'}
			})
			.state('page.messages', {
				templateUrl: 'views/page/messages.html',
				controller: 'MessagesCtrl',
				abstract:true
			})
			.state('page.messages.new', {
				templateUrl: 'views/page/messages/message_inbox.html',
				url:'/l/messages/new',
				data: {auth:'USER'}
			})
			.state('page.messages.archive', {
				templateUrl: 'views/page/messages/message_archive.html',
				url:'/l/messages/achive',
				data: {auth:'USER'}
			})
			.state('page.messages.send', {
				templateUrl: 'views/page/messages/message_outbox.html',
				url:'/l/messages/send',
				data: {auth:'USER'}
			})
			.state('page.messages.deleted', {
				templateUrl: 'views/page/messages/message_trash.html',
				url:'/l/messages/deleted',
				data: {auth:'USER'}
			})
			.state('page.locations', {
				templateUrl: 'views/page/locations.html',
				controller: 'LocationsCtrl',
				abstract:true,
			})
			.state('page.locations.all', {
				templateUrl: 'views/page/locations/all.html',
				url:'/l/locations/all',
				data: {auth:'USER'}
			})
			.state('page.locations.new', {
				templateUrl: 'views/page/locations/new.html',
				url:'/l/locations/new',
				data: {auth:'USER'}
			})
			.state('page.vehicles', {
				templateUrl: 'views/page/vehicles.html',
				controller: 'VehiclesCtrl',
				url:'/l/vehicles',
				data: {auth:'USER'}
			})
			.state('page.payments', {
				templateUrl: 'views/page/payments.html',
				controller: 'PaymentsCtrl',
				url:'/l/payments',
				data: {auth:'USER'}
			})
			.state('page.support', {
				templateUrl: 'views/page/support.html',
				controller: 'SupportCtrl',
				url:'/l/help',
				data: {auth:'USER'}
			})
			.state('page.washer', {
				templateUrl: 'views/page/washer.html',
				controller: 'WasherCtrl',
				url:'/l/washer',
				data: {auth:'WASHER'}
			});
  })
   .controller('BaseCtrl', function ($scope,userSessionService,MessageService,PollingService,$window) {
	   $scope.logout = function(){
			console.log('logout');
			userSessionService.logout();
	   };
	   PollingService.register(MessageService.reloadCount,1000*60*5);

	   $scope.amountNewMessages = function(){
			return MessageService.newMessages();
	   };

	   // For now
	   $scope.getProfileImage = function(){
		    return userSessionService.getProfileImage();
	   };
	   $scope.getName = function(){
		   return userSessionService.getName();
	   };
	   $scope.isUser = function(){
		   return userSessionService.getSession().level == 'USER';
	   };
       $scope.isWasher = function(){
		   return userSessionService.getSession().level == 'WASHER';
	   };
       $scope.isStaff = function(){
		   return userSessionService.getSession().level == 'STAFF';
	   }

     $scope.$window = $window;
     $scope.toggleSearch = function () {
       $scope.expand = !$scope.expand;
       if ($scope.expand) {
         $scope.$window.onclick = function (event) {
           closeSidebar(event, $scope.toggleSearch);
         };
       } else {
         $scope.expand = false;
         $scope.$window.onclick = null;
         $scope.$apply();
       }
     };
     function closeSidebar(event, callbackOnClose) {

       var clickedElement = event.target;
       if (!clickedElement) return;

       var clickedOnDrawerButton = clickedElement.className.indexOf("icon  wb-close")>-1 || clickedElement.className.indexOf("btn btn-default toggle-button on-md")>-1;
       if(clickedOnDrawerButton){
         return;
       }
       callbackOnClose();
       return;

     }
   });