'use strict';

/**
 * @ngdoc function
 * @name washery.controller:MessagesCtrl
 * @description
 * # MessagesCtrl
 * Controller of the washery
 */
angular.module('washery')
  .controller('MessagesCtrl', function (MessageService,$scope,$uibModal,WasheryApi,ngToast,ErrorService) {
		$scope.newMessages = [];
		$scope.archiveMessages = [];
		$scope.outboxMessages = [];
		$scope.trashedMessages = [];
    
		var MESSAGE_STATUS = {
			new: 50,
			read: 51,
			trash: 52
		};
		
		var loadMessages= function(){
			WasheryApi.message.getByStatus(MESSAGE_STATUS.new).then(function(response){
				$scope.newMessages = response.data.data;
			});
			WasheryApi.message.getByStatus(MESSAGE_STATUS.read).then(function(response){
				$scope.archiveMessages = response.data.data;
			});
			WasheryApi.message.getByStatus(MESSAGE_STATUS.trash).then(function(response){
				$scope.trashedMessages = response.data.data;
			});
			WasheryApi.message.getSent().then(function(response){
				$scope.outboxMessages = response.data.data;
			});
			MessageService.reloadCount();
		};
		loadMessages();
	  
		$scope.deleteMessage = function(id,noreload){
			WasheryApi.message.trash(id).then(function(){
				if(!noreload) {loadMessages();}
			},function(err){
				ErrorService.handle(err);
				loadMessages();
			});
		};
		$scope.deleteSeclectedMessages = function(){
			for(var idx in $scope.newMessages){
				if($scope.newMessages[idx].selected){
					$scope.deleteMessage($scope.newMessages[idx].id,true);
				}
			}
			for(var idx1 in $scope.archiveMessages){
				if($scope.archiveMessages[idx1].selected){
					$scope.deleteMessage($scope.archiveMessages[idx1].id,true);
				}
			}
			for(var idx2 in $scope.outboxMessages){
				if($scope.outboxMessages[idx2].selected){
					$scope.deleteMessage($scope.outboxMessages[idx2].id,true);
				}
			}
			loadMessages();
		};
		$scope.newMessage = function(){
			 $uibModal.open({
				animation: true,
				templateUrl: 'views/page/messages/modal_message.html',
				controller: function($scope,$uibModalInstance){
					$scope.message = {};
					$scope.close = function(){
						$uibModalInstance.dismiss();
					};
					$scope.done = function(){
						$uibModalInstance.close($scope.message);
					};
				},
				size: 'md'
			}).result.then(function (result) {
				WasheryApi.message.create(result.subject,result.body,result.to).then(function(){
					ngToast.create({className:'success',content:'Message send'});
				},function(err){
					ErrorService.handle(err);
				});
			}, function () {});
		};
		$scope.readMessage = function(id){
			WasheryApi.message.getById(id).then(function(){
				console.log('Marked Message as read');
			},function(err){
				ErrorService.handle(err);
			});
		};
		$scope.reply = function(msg){
			//replyToMessage
			$uibModal.open({
				animation: true,
				templateUrl: 'views/page/messages/modal_message.html',
				controller: function($scope,$uibModalInstance,message){
					$scope.message = message;
					$scope.message.body = '';
					$scope.disableHeader = true;
					$scope.close = function(){
						$uibModalInstance.dismiss();
					};
					$scope.done = function(){
						$uibModalInstance.close($scope.message);
					};
				},
				size: 'md',
				resolve: {
					message: function () {
						return msg;
					}
				}
			}).result.then(function (result) {
				WasheryApi.message.reply(result.id,result.body).then(function(){
					ngToast.create({className:'success',content:'Message send'});
				},function(err){
					ErrorService.handle(err);
				});
			}, function () {});
		};
		$scope.reloadMessages = function(){
			loadMessages();
		};
		$scope.messageCount = function(){
			return MessageService.newMessages();
		};
  });