'use strict';

/**
 * @ngdoc service
 * @name washery.ErrorService
 * @description
 * # ErrorService
 * Service in the washery.
 */
angular.module('washery')
  .service('ErrorService', function (ngToast) {
	  var error = [];
	  error[0]='Unknown error.';
	  error[100]='BOOKING_ALREADY_CREATED_ERR';
	  error[101]='BOOKING_VEHICLE_NOT_OWNED_ERR';
	  error[102]='BOOKING_ALREADY_PROCESSED_ERR';
	  error[103]='BOOKING_WASHINGTYPE_ERR';
	  error[104]='BOOKING_EXPIRED_ERR';
	  error[105]='BOOKING_NO_PAYMENTPROCESSOR_ERR';
	  error[106]='BOOKING_TOO_LATE_ERR';
	  error[120]='UNSERVED_AREA_ERR';
	  error[121]='PLACE_ALREADY_CREATED_ERR';
	  error[122]='PLACE_MAX_DEFAULT_ERR';
	  error[123]='NO_WASHERS_AVAILABLE';
	  error[130]='USER_CONF_ERR';
	  error[131]='USER_MISMATCH_ERR';
	  error[132]='USER_OLDPASS_ERR';
	  error[133]='USER_STATUS_ERR';
	  error[134]='Username or password is incorrect';
	  error[135]='USER_PASSRESET_ALREADY_SENT_ERR';
	  error[140]='WASHER_CONF_CODE_ERR';
	  error[141]='WASHER_NOT_FOUND_ERR';
	  error[150]='WASHING_ALREADY_CREATED_ERR';
	  error[151]='WASHING_ALREADY_PROCESSED_ERR';
	  error[152]='WASHING_IMPOSSIBLE_CANCEL_ERR';
	  error[160]='STRIPE_CARD_DECLINED_ERR';
	  error[170]='ITEM_NOT_FOUND_ERR';
	  error[171]='NO_ITEMS_FOUND_ERR';
	  error[200]='ALREADY_EXISTS';
	  error[210]='PAYMENT_PROCESSOR_ERR';
	  error[220]='PRICE_MISMATCH_ERR';
	  
		return {
			handle:function(err){
				console.log(err);
				if(err.data.error && err.data.error.message){
					if(error[err.data.error.code]){
						ngToast.create({className:'danger',content:error[err.data.error.message]});
					} else {
						if(err.data.error.message instanceof Array || typeof err.data.error.message == 'object'){
							angular.forEach(err.data.error.message,function(item){
								ngToast.create({className:'danger',content:item});
							});
						} else {
							ngToast.create({className:'danger',content:err.data.error.message});
						}
					}
				} else {
					ngToast.create({className:'danger',content:error[0]});
				}
				
			},
			customError:function(text){
				ngToast.create({className:'danger',content:text});
			}
		};
  });