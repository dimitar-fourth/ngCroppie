/*
Custom Ng Croppie
 */
(function () {
  'use strict';

  var module = angular.module('ngCroppie', []);

  module.directive('ngCroppie', function ($interval) {
    return {
      restrict: 'E',
      scope: {
        src: '=',
        viewport: '=',
        boundry: '=',
        type: '@',
      },
      require: 'ngModel',
      link: function (scope, elem, attr, ngModelCtrl) {

        var applyInterval;

        // viewport cannot be larger than the boundaries
        if (scope.viewport.w > scope.boundry.w) {
          scope.viewport.w = scope.boundry.w
        }
        if (scope.viewport.h > scope.boundry.h) {
          scope.viewport.h = scope.boundry.h
        }

        // define options
        var options = {
          viewport: {
            width: scope.viewport.w,
            height: scope.viewport.h,
            type: scope.type || 'circle'
          },
          boundary: {
            width: scope.boundry.w,
            height: scope.boundry.h
          },
          enableExif: true,
        };

        var c = new Croppie(elem[0], options);

        var srcWatch = scope.$watch('src', function (newValue) {
          if (newValue) {
            c.bind(newValue);
            applyInterval = $interval(function() {
              c.result('canvas').then(function (img) {
                ngModelCtrl.$setViewValue(img);
              });
            }, 100);
            srcWatch();
          }
        });

        scope.$on('destroy', function () {
          if (applyInterval) {
            $interval.cancel(applyInterval)
          }
        })

      }
    };
  });

}());
