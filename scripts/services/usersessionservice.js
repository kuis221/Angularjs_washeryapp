'use strict';

/**
 * @ngdoc service
 * @name washery.userSessionService
 * @description
 * # userSessionService
 * Service in the washery.
 */

angular.module('washery')
  .service('userSessionService', function (WasheryApi,$http,$localStorage,$sessionStorage,$state,ErrorService) {
    var session = {};
    if($localStorage.session){
      console.log(new Date($localStorage.created));
      console.log(new Date());
      console.log(new Date($localStorage.created)<new Date().setTime( new Date().getTime() - 60 * 86400000 ));
      if(new Date($localStorage.created)<new Date().setTime( new Date().getTime() - 60 * 86400000 )){
        console.log('old login');
      } else {
        session = $localStorage.session;
        WasheryApi.user.setApiKey(session.apikey);
      }
    }
    if($sessionStorage.session){
      session = $sessionStorage.session;
      WasheryApi.user.setApiKey(session.apikey);
    }
    return {
      login:function(user,cb){
        WasheryApi.user.login(user).then(function(response){
          if(response.status === 200 && !response.data.error){
            session = response.data.data;
            WasheryApi.user.setApiKey(session.apikey);
            if(user.rememberme){
              $localStorage.session = session;
              $localStorage.created = new Date();
            } else {
              $sessionStorage.session = session;
            }
            cb(true);
          } else {
            cb(false);
            ErrorService.handle(response);
          }
        },function(err){
          cb(false);
          ErrorService.handle(err);
        });
      },
      logout:function(){
        session={};
        $http.defaults.headers.common.Authorization = '';
        $localStorage.$reset();
        $sessionStorage.$reset();
        $state.go('access.login');
      },
      isLoggedIn:function(){
        if(session.apikey){
          return true;
        }
        return false;
      },
      userHasPermission:function(required){
        if(session.level == required){
          return true;
        } else if (session.level == 'WASHER' && required == 'USER'){
          return true;
        }
        return false;
      },
      getApiKey:function(){
        if(!session.apikey){
          console.log('ApiKey not set');
        }
        return session.apikey;
      },
      getName:function(){
        if(session){
          return session.name || 'No name';
        } else {
          return 'No name';
        }
      },
      getProfileImage:function(){
        if(session){
          return session.img; //|| 'images/no-avatar.png';
        } else {
          return '';
        }
      },
      getSession:function(){
        return session;
      },
      setSession:function(s){
        session = s;
      }
    };
  })
  .config(['$httpProvider',function($httpProvider) {
  $httpProvider.interceptors.push(function($q,$rootScope) {
        return {
            'responseError': function(rejection){
                var defer = $q.defer();
                if(rejection.status === 401){
          $rootScope.$emit('401');
                }
                defer.reject(rejection);
                return defer.promise;
            }
        };
    });
  }])
  .run(function($rootScope,userSessionService,$window,$state,ngToast){
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    toParams = fromState = fromParams;
    if(toState.data && toState.data.auth){
      if(toState.data.auth && !userSessionService.userHasPermission(toState.data.auth)){
        event.preventDefault();
        console.log('Restricted access');
        userSessionService.logout();
      }
    }
    });
    //Correct !
    $rootScope.$on('4001',function(){
      ngToast.create({
        className:'danger',
        content:'Timed out ...'
      });
      $state.go('access.login');
    });
  });