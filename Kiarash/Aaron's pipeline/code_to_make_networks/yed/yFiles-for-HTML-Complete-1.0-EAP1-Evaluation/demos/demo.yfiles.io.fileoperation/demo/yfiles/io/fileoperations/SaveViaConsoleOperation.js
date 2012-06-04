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
   * Saves the given string to the console.
   */
  /*public*/ exports.SaveViaConsoleOperation = new yfiles.ClassDefinition(function() {
    return {
      '$extends': demo.yfiles.io.fileoperations.SaveOperation,
      'constructor': function() {
        demo.yfiles.io.fileoperations.SaveOperation.call(this);
      },
      'save': function(/*yfiles.lang.String*/ fileContent, /*yfiles.lang.String*/ fileName) {
        console.log(fileContent);
        this.onSuccess(new demo.yfiles.io.fileoperations.FileEventArgs());
      }
    };
  })


});});
