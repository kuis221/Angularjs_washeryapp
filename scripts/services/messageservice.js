'use strict';

/**
 * @ngdoc service
 * @name washery.MessageService
 * @description
 * # MessageService
 * Service in the washery.
 */
angular.module('washery')
  .service('MessageService', function (WasheryApi,$rootScope) {
		var msgCount = 0;
		WasheryApi.message.getNewMessagesCount().then(function(response){
			if(msgCount !== response.data.response.message){
				msgCount = response.data.response.message;
				$rootScope.$broadcast('message:update');
			}
		},function(response){
			console.log('Error',response);
		});
		return {
			 newMessages:function(){
				 return msgCount;
			 },
			 newMessagesCount: msgCount,
			 reloadCount:function(){
				WasheryApi.message.getNewMessagesCount().then(function(response){
					if(msgCount !== response.data.response.message){
						msgCount = response.data.response.message;
						$rootScope.$broadcast('message:update');
					}
				},function(response){
					console.log('Error',response);
				});
			 }
		};
  });