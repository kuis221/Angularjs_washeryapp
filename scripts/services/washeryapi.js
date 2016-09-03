'use strict';
// jscs:disable
/**
 * @ngdoc service
 * @name washery.WasheryApi
 * @description
 * # WasheryApi
 * Service in the washery.
 */
angular.module('washery')
  .service('WasheryApi', function ($http,$localStorage,$q) {
    var apiUrl = 'https://40.118.19.209/v1/';
    var apiKey = '';
    return {
      user:{
        login : function(user){
          return $http.post(apiUrl+ 'user/login', {username: user.username, password: user.password});
        },
        userExists:function(username){
          return $http.post(apiUrl+'user/checkuser', {username: username});
        },
        emailExists:function(email){
          return $http.post(apiUrl+'user/checkmail', {email: email});
        },
        create : function(user){
          return $http.post(apiUrl+'user/create', {name: user.name, surname: user.surname, telephone: user.telephone, email: user.email, username: user.username, password: user.password, 'g-recaptcha-response': user.gRecaptchaResponse});
        },
        confirm: function(code, username){
          return $http.post(apiUrl+'user/confirm', {code: code, username: username});
        },
        resetPassword : function(mail){
          return $http.post(apiUrl+ 'user/resetpswd',{email:mail});
        },
        recoverPassword: function (code, password){
          return $http.post('user/pswdrecovery/' + code, {token: token, username: username, password: password});
        },
        changePassword: function(old, newpw){
          return $http.post(apiUrl+'user/changepswd?Authorization='+apiKey,{old_password:old,password:newpw});
        },
        update:function(user){
          return $http.post(apiUrl+'user/update?Authorization='+apiKey, user);
        },
        delete:function(id){
          return $http.post(apiUrl+'user/delete?Authorization='+apiKey, {id: id});
        },
        uploadImage:function(file,progress,successcb,errorcb){
          var formData = new FormData();
          formData.append('img', file);
          var oXHR = new XMLHttpRequest();
          oXHR.upload.addEventListener('progress', function(ev){
            progress=(ev.loaded/ev.total)*100;
          }, false);
          oXHR.addEventListener('load',  function(ev){
            successcb(ev);
          }, false);
          oXHR.addEventListener('error', function(ev){
            errorcb(ev);
          }, false);
          oXHR.addEventListener('abort', function(){

          }, false);
          oXHR.open('POST', apiUrl+'user/setimg?Authorization='+apiKey);
          oXHR.send(formData);
        },
        updateNotificationSettings:function(push, email, sms){
          return $http.post(apiUrl+'user/settings?Authorization='+apiKey,{pushnot: push, mailnot: email, smsnot: sms});
        },
        getSelf:function(){
          return $http.post(apiUrl+'user/getself?Authorization='+apiKey);
        },
        getByUname:function(username){
          return $http.post(apiUrl+'user/getbyuname?Authorization='+apiKey, {username: username});
        },
        getById:function(id){
          return $http.post(apiUrl+'user/getbyid?Authorization='+apiKey, {id:id});
        },
        paymentSetup:function(id, stripe){
          return $http.post(apiUrl+'user/paymentsetup?Authorization='+apiKey, {payment_processor: id, nonce: stripe});
        },
        setApiKey:function(key){
          $http.defaults.headers.common.Authorization = key;
          apiKey = key;
        }
      },
      washer: {
        create : function(user){
          return $http.post(apiUrl+'washer/create', {name: user.name, surname: user.surname, telephone: user.telephone, email: user.email, username: user.username, password: user.password, address: user.address, birthdate: user.birthdate, city: user.city, province: user.province, sex: user.sex, cap: user.cap, cf: user.cf, 'g-recaptcha-response': user.gRecaptchaResponse});
        },
        confirmTel:function(code, username){
          return $http.post(apiUrl+'washer/confirm', {code: code, username: username});
        },
        update:function(washer){
          return $http.post(apiUrl+'washer/update?Authorization='+apiKey, washer);
        },
        delete:function(id){
          return $http.post(apiUrl+'washer/delete?Authorization='+apiKey, {id: id});
        },
        setZone:function(latitude, longitude, radius){
          return $http.post(apiUrl+'washer/setzone?Authorization='+apiKey, {latitude: latitude, longitude: longitude, radius: radius});
        },
        unsetZone:function(id){
          return $http.post(apiUrl+'washer/unsetzone?Authorization='+apiKey, {zone_id: id});
        },
        toggleZone:function(id){
          return $http.post(apiUrl+'washer/togglezone?Authorization='+apiKey, {zone_id: id});
        },
        getActiveZones:function(id){
          return $http.post(apiUrl+'washer/getactivezones?Authorization='+apiKey);
        },
        getSelf:function(id){
          return $http.post(apiUrl+'washer/getself?Authorization='+apiKey);
        }
      },
      booking: {
        create:function(pId, vId, wtId, hour, date, notes){
          return $http.post(apiUrl+'booking/create?Authorization='+apiKey, {place_id: pId, vehicle_id : vId, washingtype_id: wtId, hour: hour, date: date, notes: notes});
        },
        cancel:function(id){
          return $http.post(apiUrl+'booking/cancel?Authorization='+apiKey, {id: id});
        },
        reportAbuse:function(id){
          return $http.post(apiUrl+'booking/reportabuse?Authorization='+apiKey, {id: id});
        },
        getPaypal:function(wid){
          return $http.post(apiUrl+'booking/paypal?Authorization='+apiKey, {washingtype_id: wid});
        },
        getHistory:function(){
          return $http.post(apiUrl+'booking/getown?Authorization='+apiKey);
        },
        getOwnActive:function(){
          return $http.post(apiUrl+'booking/getownactive?Authorization='+apiKey);
        },
        getPrice:function(vId,wtId){
          return $http.post(apiUrl+'booking/getprice?Authorization='+apiKey,{washingtype_id: wtId, vehicletype_id: vId});
        },
        getWorkingHours:function(){
          return $http.post(apiUrl+'booking/getworkinghours?Authorization='+apiKey);
        },
        getActive:function(){
          return $http.post(apiUrl+'booking/getactive?Authorization='+apiKey);
        },
        getNearby:function(){
          return $http.post(apiUrl+'booking/getnearby?Authorization='+apiKey);
        },
        getByUserId:function(id){
          return $http.post(apiUrl+'booking/getbyuserid?Authorization='+apiKey, {user_id: id});
        },
        getByWashingType:function(id){
          return $http.post(apiUrl+'booking/getbywashingtype?Authorization='+apiKey, {washingtype_id: id});
        }
      },
      washing: {
        create:function(id){
          return $http.post(apiUrl+'washing/create?Authorization='+apiKey, {id: id});
        },
        complete:function(id){
          return $http.post(apiUrl+'washing/complete?Authorization='+apiKey, {id: id});
        },
        cancel:function(id){
          return $http.post(apiUrl+'washing/cancel?Authorization='+apiKey, {id: id});
        },
        delete:function(id){
          return $http.post(apiUrl+'washing/delete?Authorization='+apiKey, {id: id});
        },
        payWithCash: function(id){
          return $http.post(apiUrl+'washing/paid_cash?Authorization='+apiKey, {id: id});
        },
        getActive:function(){
          return $http.post(apiUrl+'washing/getactive?Authorization='+apiKey);
        },
        getList:function(){
          return $http.post(apiUrl+'washing/getlist?Authorization='+apiKey);
        }
      },
      message: {
        create : function (msg) {
          return $http.post(apiUrl+'message/create?Authorization='+apiKey, {subject: msg.subject, body: msg.body, to: msg.username});
        },
        reply : function (id, body) {
          return $http.post(apiUrl+'message/reply?Authorization='+apiKey, {id: id, body: body});
        },
        trash : function (id) {
          return $http.post(apiUrl+'message/trash?Authorization='+apiKey, {id: id});
        },
        delete : function (id) {
          return $http.post(apiUrl+'message/delete?Authorization='+apiKey, {id: id});
        },
        getById : function (id) {
          return $http.post(apiUrl+'message/getbyid?Authorization='+apiKey, {id: id});
        },
        getNewMessagesCount : function () {
          return $http.post(apiUrl+'message/getnew?Authorization='+apiKey);
        },
        getByStatus : function (status) {
          return $http.post(apiUrl+'message/getbystatus?Authorization='+apiKey, {status: status});
        },
        getSent : function () {
          return $http.post(apiUrl+'message/getsent?Authorization='+apiKey);
        }
      },
      place: {
        create:function(place){
          return $http.post(apiUrl+'place/create?Authorization='+apiKey,{name: place.name, latitude: place.latitude, longitude: place.longitude, default: place.default});
        },
        update:function(place){
          return $http.post(apiUrl+'place/update?Authorization='+apiKey,{id: place.id, name: place.name, latitude: place.latitude, longitude: place.longitude, default: place.default});
        },
        delete:function(id){
          return $http.post(apiUrl+'place/delete?Authorization='+apiKey, {id: id});
        },
        getDefault:function(){
           return $http.post(apiUrl+'place/getdefault?Authorization='+apiKey);
        },
        getList:function () {
          return $http.post(apiUrl+'place/getlist?Authorization='+apiKey);
        },
        getById:function (id) {
          return $http.post(apiUrl+'place/getbyid?Authorization='+apiKey, {id: id});
        }
      },
      vehicle: {
        getList:function(){
          return $http.post(apiUrl+'vehicle/getlist?Authorization='+apiKey);
        },
        getById:function(id){
          return $http.post(apiUrl+'vehicle/getbyid?Authorization='+apiKey, {id: id});
        },
        create:function(vehicle){
          return $http.post(apiUrl+'vehicle/create?Authorization='+apiKey, {color: vehicle.color, plate: vehicle.plate, model: vehicle.model, vehicletype_id: vehicle.vehicletype_id});
        },
        delete:function(id){
          return $http.post(apiUrl+'vehicle/delete?Authorization='+apiKey,{id:id});
        },
        setImage:function(file,id,successcb,errorcb,progress){
          var formData = new FormData();
          formData.append('img', file);
          var oXHR = new XMLHttpRequest();
          oXHR.upload.addEventListener('progress', function(ev){
            progress=(ev.loaded/ev.total)*100;
          }, false);
          oXHR.addEventListener('load', function(ev){
            successcb(ev);
          }, false);
          oXHR.addEventListener('error', function(ev){
            errorcb(ev);
          }, false);
          oXHR.addEventListener('abort', function(){

          }, false);
          oXHR.open('POST', apiUrl+'vehicle/setimg?id='+id+'&Authorization='+apiKey);
          oXHR.send(formData);
        },
        vehicleTypes:function(){
          var types = {
            '400':'Citycar',
            '401':'Stationwagon',
            '402':'Moto',
            '403':'Quad'
          };
          return types;
        }
      },
      utils: {
        checkStatuses:function(){
          return $http.post(apiUrl+'app/checkstatuses?Authorization='+apiKey);
        },
        checkPaymentProcessors:function(){
          return $http.post(apiUrl+'app/checkpaymentprocessors?Authorization='+apiKey);
        },
        checkVehicleTypes:function(){
          return $http.post(apiUrl+'app/checkvehicletypes?Authorization='+apiKey);
        },
        checkWashingTypes:function(){
          return $http.post(apiUrl+'app/checkwashingtypes?Authorization='+apiKey);
        },
        getStatuses:function(){
          return $http.post(apiUrl+'app/getstatuses?Authorization='+apiKey);
        },
        getPaymentProcessors:function(){
          return $http.post(apiUrl+'app/getpaymentprocessors?Authorization='+apiKey);
        },
        getVehicleTypes:function(){
          return $http.post(apiUrl+'app/getvehicletypes?Authorization='+apiKey);
        },
        getWashingTypes:function(){
          return $http.post(apiUrl+'app/getwashingtypes?Authorization='+apiKey);
        },
        checkServedAddress:function(){
          return $http.post(apiUrl+'app/checkservedaddress?Authorization='+apiKey);
        },
        checkServedCoords:function(){
          return $http.post(apiUrl+'app/checkservedcoords?Authorization='+apiKey);
        },
        getServedZones:function(){
          return $http.post(apiUrl+'app/getservedzones?Authorization='+apiKey);
        },
        washingTypes:function(id){
          if(!$localStorage.washingtype){
            $localStorage.washingtype = {};
          }
          if($localStorage.washingtype[id]){
            console.log('Load from memory');
            return $q(function(res,rej){
              res($localStorage.washingtype[id]);
            });
          } else {
            return $http.post(apiUrl+'app/getwashingtypes?Authorization='+apiKey,{vehicletype_id:id}).then(function(res){
              $localStorage.washingtype[id] = res;
              console.log('Save in memory',res);
              return $q(function(res,rej){
                res($localStorage.washingtype[id]);
              });
            },function(){console.log('Error while loading Washingtype');});
          }
        }
      },
      washer:{
        create:function(id){
          return $http.post(apiUrl+'washing/create?Authorization='+apiKey,{booking_id:id});
        },
        complete:function(id){
          return $http.post(apiUrl+'washing/complete?Authorization='+apiKey,{id:id});
        },
        cancel:function(id){
          return $http.post(apiUrl+'washing/cancel?Authorization='+apiKey,{id:id});
        },
        getNearby:function(){
          return $http.post(apiUrl+'booking/getnearby?Authorization='+apiKey);
        },
        getList:function(){
          return $http.post(apiUrl+'booking/getlist?Authorization='+apiKey);
        },
        getActiveZones:function(){
          return $http.post(apiUrl+'washer/getactivezones?Authorization='+apiKey);
        },
        getSelf:function(){
          return $http.post(apiUrl+'washer/getself?Authorization='+apiKey);
        },
        getActive:function(){
          return $http.post(apiUrl+'booking/getactive?Authorization='+apiKey);
        }
      },
      requestpool: {
        createRequest:function(){
          return $http.post(apiUrl+'requestspool/create?Authorization='+apiKey);
        },
        deleteRequest:function(){
          return $http.post(apiUrl+'requestspool/delete?Authorization='+apiKey);
        }
      },
      paymentaudit: {
        getHistory:function(){
          return $http.post(apiUrl+'paymentaudit/getself?Authorization='+apiKey);
        }
      }
    };
  });
