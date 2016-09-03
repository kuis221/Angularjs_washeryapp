'use strict';

/**
 * @ngdoc service
 * @name washery.PollingService
 * @description
 * # PollingService
 * Service in the washery.
 */
angular.module('washery')
  .service('PollingService', function ($rootScope,$interval) {
		var polls = {};
		
		$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams, options){
			event = toParams = fromParams = options;
			if(polls[toState.name]){
				for(var idx in polls[toState.name]){
					polls[toState.name][idx].id = $interval(polls[toState.name][idx].toCall,polls[toState.name][idx].interval);
					console.log('start polling');
				}
			}
			if(polls[fromState.name]){
				for(var idx2 in polls[fromState.name]){
					$interval.cancel(polls[fromState.name][idx2].id);
					console.log('stop polling');
				}
			}
		});
	  
		return {
			register:function(func,interval,sitedependency){
				if(!sitedependency){
					sitedependency = 'none';
				}
				if(!polls[sitedependency]){
					polls[sitedependency] = [];
				}
				var polling = {
					toCall:func,
					id:-1,
					interval:interval
				};
				polling.id = $interval(polling.toCall,polling.interval);
				polls[sitedependency].push(polling);	
			}
		};
  });
