/****************************************************************************
 **
 ** This file is part of yFiles for HTML 1.0-EAP1.
 ** 
 ** yWorks proprietary/confidential. Use is subject to license terms.
 **
 ** Redistribution of this file or of an unauthorized byte-code version
 ** of this file is strictly forbidden.
 **
 ** Copyright (c) 2012 by yWorks GmbH, Vor dem Kreuzberg 28, 
 ** 72070 Tuebingen, Germany. All rights reserved.
 **
 ***************************************************************************/
(typeof define=='function'?define:(function(dependencies, fn){fn();}))(['yfiles/lang'],function(){
yfiles.module("orgchart.support", function(exports) {

  /*private*/ exports.BorderConverter = new yfiles.ClassDefinition(function() {
    return {
      '$with': [yworks.support.IValueConverter],
      'convert': function(/*yfiles.lang.Object*/ value, /*yfiles.lang.Object*/ parameter) {
        if (yfiles.lang.Boolean.$class.isInstance(value)) {
          return /*(yfiles.lang.Boolean)*/value ? "#FFA500" : "#249AE7";
        }
        return "";
      },
      'convertBack': function(/*yfiles.lang.Object*/ value, /*yfiles.lang.Object*/ parameter) {
        throw new yfiles.system.NotImplementedException();
      }
    };
  })


});});
