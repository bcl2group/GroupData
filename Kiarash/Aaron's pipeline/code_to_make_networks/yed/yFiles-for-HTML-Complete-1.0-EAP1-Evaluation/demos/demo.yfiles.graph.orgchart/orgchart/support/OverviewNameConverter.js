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

  /*private*/ exports.OverviewNameConverter = new yfiles.ClassDefinition(function() {
    return {
      '$with': [yworks.support.IValueConverter],
      'convert': function(/*yfiles.lang.Object*/ value, /*yfiles.lang.Object*/ parameter) {
        if (yfiles.lang.String.$class.isInstance(value)) {
          var /*yfiles.lang.String[]*/ strings = yfiles.system.text.StringExtensions.split((/*(yfiles.lang.String)*/value), [' ']);
          var /*yfiles.lang.String*/ converted = strings[0].substr(0, 1) + ".";
          for (var /*int*/ i = 1; i < strings.length; i++) {
            converted += " " + strings[i];
          }
          return converted;
        }
        return "";
      },
      'convertBack': function(/*yfiles.lang.Object*/ value, /*yfiles.lang.Object*/ parameter) {
        throw new yfiles.system.NotImplementedException();
      }
    };
  })


});});
