'use strict';

/**
 * @ngdoc filter
 * @name washery.filter:bookingstate
 * @function
 * @description
 * # bookingstate
 * Filter in the washery.
 */
angular.module('washery')
  .filter('bookingstate', function () {
    return function (input) {
		var code = [];
		code['30'] = 'Added';
		code['31'] = 'Handeled';
		code['32'] = 'Reported abuse';
		code['33'] = 'Cancelled';
		code['34'] = 'Expired';
		code['35'] = 'Archieved';
		code['36'] = 'Handling';
		code['37'] = 'Abuse';
		return code[input] || input;
    };
  });
