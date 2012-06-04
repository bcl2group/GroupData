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
   * Opens files using the FileReader API.
   * Most browsers prevent the usage of the FileReader APIs for scripts that run locally (via file:). 
   */
  /*public*/ exports.OpenViaReaderOperation = new yfiles.ClassDefinition(function() {
    return {
      '$extends': demo.yfiles.io.fileoperations.OpenOperation,
      'constructor': function() {
        demo.yfiles.io.fileoperations.OpenOperation.call(this);
        this.$Initialize$2();
      },
      '$Initialize$2': function() {
        var /*HTMLInputElement*/ inputElement = this.createInputElement();
        var /*HTMLElement*/ body = /*(HTMLElement)*/document.getElementsByTagName("body")[0];
        body.appendChild(inputElement);
        this.inputElement = inputElement;
      },
      'fileInputChanged': function(/*Event*/ ev) {
        var /*HTMLInputElement*/ fileInputElement = this.inputElement;
        if (fileInputElement === null || fileInputElement.files === null || fileInputElement.files.length <= 0) {
          return;
        }

        var /*FileReader*/ newInstance = new FileReader();
        {
          newInstance.onloadend = /*(EventListener)*/yfiles.lang.delegate(this.$LoadEnd$2, this);
        }
        var /*FileReader*/ reader = newInstance;
        reader.readAsText(/*(Blob)*/fileInputElement.files[0]);// TODO set the correct encoding, default is UTF-8
      },
      '$LoadEnd$2': function(/*Event*/ evt) {
        var /*FileReader*/ fileReader = /*(FileReader)*/evt.target;
        if (fileReader.error === null) {
          this.onSuccess(new demo.yfiles.io.fileoperations.FileEventArgs.FromString(/*(yfiles.lang.String)*/fileReader.result));
        } else {
          this.onFail(new demo.yfiles.io.fileoperations.FileEventArgs.FromString(fileReader.error.toString()));
        }
      },
      '$static': {
        'isAvailable': function() {
          return window.Blob !== undefined && window.File !== undefined && window.FileReader !== undefined;
        }
      }
    };
  })


});});
