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
   * Opens files using the FileSystemObject API of Internet Explorer.
   * Due to limitations of the FileSystemObject, this works only for ASCII encoded files. Especially, files
   * with byte order mark are not handled correctly.
   */
  /*public*/ exports.OpenViaFileSystemObjectOperation = new yfiles.ClassDefinition(function() {
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
        if (fileInputElement === null || fileInputElement.value === null) {
          return;
        }

        var /*FileSystemObject*/ fso = /*(FileSystemObject)*/new ActiveXObject("Scripting.FileSystemObject");
        var /*TextStream*/ a = null;
        try {
          a = fso.openTextFile(fileInputElement.value, 1);
          var /*yfiles.lang.String*/ content = a.readAll();
          this.onSuccess(new demo.yfiles.io.fileoperations.FileEventArgs.FromString(content));
        } finally {
          if (a !== null) {
            a.close();
          }
        }
      },
      '$static': {
        'isAvailable': function() {
          return window.ActiveXObject !== undefined;
        }
      }
    };
  })


});});
