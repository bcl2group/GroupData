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
   * Base class for file operations that open a file.
   * If a file was read successful this class sends a Succeeded event and sets the file content
   * to its {@link demo.yfiles.io.fileoperations.FileEventArgs}. 
   * Typically, an open operation has a input element of type 'file' to present a file chooser
   * to the user. Using the function 'click' on a hidden input element, one can create Open menu
   * items and toolbar buttons.
   */
  /*public*/ /*abstract*/ exports.OpenOperation = new yfiles.ClassDefinition(function() {
    return {
      '$extends': demo.yfiles.io.fileoperations.FileOperation,
      '$abstract': true,
      'constructor': function() {
        demo.yfiles.io.fileoperations.FileOperation.call(this);
      },
      '$inputElement$1': null,
      'inputElement': {
        'get': function() {
          return this.$inputElement$1;
        },
        'set': function(/*HTMLInputElement*/ value) {
          this.$inputElement$1 = value;
        }
      },
      'open': function() {
        var /*HTMLInputElement*/ element = this.inputElement;
        if (element !== null) {
          element.click();
        }
      },
      'createInputElement': function() {
        var /*HTMLInputElement*/ inputElement = /*(HTMLInputElement)*/document.createElement("input");
        inputElement.type = "file";
        // fileInputElement.accept = "text/xml";
        inputElement.addEventListener("change", yfiles.lang.delegate(this.fileInputChanged, this), false);
        demo.yfiles.io.fileoperations.FileOperation.setElementInvisible(inputElement, true);
        return inputElement;
      },
      'fileInputChanged': yfiles.lang.Abstract
    };
  })


});});
