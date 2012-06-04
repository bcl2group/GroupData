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
yfiles.module("demo.yfiles.io.fileoperations", function(exports) {

  /**
   * {@link yfiles.system.EventArgs} used by the events of .
   */
  /*public*/ exports.FileEventArgs = new yfiles.ClassDefinition(function() {
    return {
      '$extends': yfiles.system.EventArgs,
      'constructor': {
        'default': function() {
          yfiles.system.EventArgs.call(this);
        },
        'FromString': function(/*yfiles.lang.String*/ data) {
          yfiles.system.EventArgs.call(this);
          this.data = data;
        }
      },
      '$data$1': null,
      'data': {
        'get': function() {
          return this.$data$1;
        },
        'set': function(/*yfiles.lang.String*/ value) {
          this.$data$1 = value;
        }
      },
      '$fileName$1': null,
      'fileName': {
        'get': function() {
          return this.$fileName$1;
        },
        'set': function(/*yfiles.lang.String*/ value) {
          this.$fileName$1 = value;
        }
      }
    };
  })


});});
