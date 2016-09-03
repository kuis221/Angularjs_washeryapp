'use strict';

/**
 * @ngdoc directive
 * @name washery.directive:dropzone
 * @description
 * # dropzone
 */
angular.module('washery')
  .directive('dropzone', function () {
    return {
      restrict: 'A',
	  scope: {
            ondropclass: '=onDropClass',
			maxFileSize: '=maxFilesize',
			file: '=imagefile',
			onChange: '=onChange'
       },
      link: function postLink(scope, element, attrs) {
			attrs = scope;
			element.bind('dragenter dragover', function(e){
				if (e.preventDefault) {e.preventDefault();}
				if (e.stopPropagation) {e.stopPropagation();}
				element.addClass(scope.ondropclass);
			});
			  //EVENT: drag exit
			element.bind('dragleave dragexit', function(e){
				if (e.preventDefault) {e.preventDefault();}
				if (e.stopPropagation) {e.stopPropagation();}
				element.removeClass(scope.ondropclass);
			});
			element.bind('drop', function(e) {
				e.dataTransfer.effectAllowed = 'copy';
				if (e.preventDefault) {e.preventDefault();}
				if (e.stopPropagation) {e.stopPropagation();}
				element.removeClass(scope.ondropclass);
				var file = e.dataTransfer.files[0];
				if(file.size > (scope.maxFileSize||'7168')){
					console.log('File is to big');
					return;
				}
				if(file.type.split('/')[0] !=='image'){
					console.log('File is no image');
					return;
				}
				scope.file = file;
				if(scope.onChange){scope.onChange(file);}
				return false;
			});
      }
    };
  })
  .directive('fileChange', [function() {

    return {
      restrict: 'A',
	  scope: {
			maxFileSize: '=maxFilesize',
			fileChange:'=fileChange',
	  },
      link: function ($scope, element) {
        var handler = function (e) {
			if($scope.maxFileSize<e.target.files[0]){
				console.log('File is to big');
				return;
			}
			if(e.target.files[0].type.split('/')[0]!=='image'){
				console.log('File is no image');
				return;
			}
			$scope.$apply(function () {
				if($scope.fileChange){$scope.fileChange(e.target.files[0]);}
			});
        };
        element[0].addEventListener('change', handler, false);
      }
    };
  }]);
