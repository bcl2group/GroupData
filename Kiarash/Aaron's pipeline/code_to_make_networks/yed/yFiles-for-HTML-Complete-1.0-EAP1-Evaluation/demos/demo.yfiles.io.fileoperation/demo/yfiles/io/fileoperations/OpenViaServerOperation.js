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
   * Opens a file by submitting a file input element to a dedicated server which returns the 
   * content of the respective file.
   * In all browsers, submitting a form loads the server responses as new document. To prevent 
   * loosing the application page, the target of the form is set to an invisible iframe. After 
   * loading, this iframe sends the file content to the application by posting a message.
   */
  /*public*/ exports.OpenViaServerOperation = new yfiles.ClassDefinition(function() {
    return {
      '$extends': demo.yfiles.io.fileoperations.OpenOperation,
      'constructor': function() {
        demo.yfiles.io.fileoperations.OpenOperation.call(this);
        this.targetName = "y-demo-open-iframe";
        this.inputName = "y-demo-open-input";
        this.$Initialize$2();
      },
      '$formElement$2': null,
      '$iframeElement$2': null,
      '$messageListener$2': null,
      '$serverOrigin$2': null,
      'serverOrigin': {
        'get': function() {
          return this.$serverOrigin$2;
        },
        'set': function(/*yfiles.lang.String*/ value) {
          this.$serverOrigin$2 = value;
        }
      },
      '$serverUrl$2': null,
      'serverUrl': {
        'get': function() {
          return this.$serverUrl$2;
        },
        'set': function(/*yfiles.lang.String*/ value) {
          this.$serverUrl$2 = value;
        }
      },
      '$inputName$2': null,
      'inputName': {
        'get': function() {
          return this.$inputName$2;
        },
        'set': function(/*yfiles.lang.String*/ value) {
          this.$inputName$2 = value;
        }
      },
      '$targetName$2': null,
      'targetName': {
        'get': function() {
          return this.$targetName$2;
        },
        'set': function(/*yfiles.lang.String*/ value) {
          this.$targetName$2 = value;
        }
      },
      '$Initialize$2': function() {
        this.$iframeElement$2 = /*(HTMLIFrameElement)*/document.createElement("iframe");
        this.$iframeElement$2.name = this.targetName;// use attribute 'name' not 'id'!
        demo.yfiles.io.fileoperations.FileOperation.setElementInvisible(this.$iframeElement$2, false);

        this.$formElement$2 = /*(HTMLFormElement)*/document.createElement("form");
        this.$formElement$2.enctype = "multipart/form-data";
        this.$formElement$2.method = "POST";
        this.$formElement$2.target = this.targetName;
        demo.yfiles.io.fileoperations.FileOperation.setElementInvisible(this.$formElement$2, true);

        var /*HTMLInputElement*/ inputElement = this.createInputElement();
        inputElement.name = this.inputName;
        this.inputElement = inputElement;
        this.$formElement$2.appendChild(inputElement);

        var /*HTMLElement*/ body = /*(HTMLElement)*/document.getElementsByTagName("body")[0];
        body.appendChild(this.$iframeElement$2);
        body.appendChild(this.$formElement$2);
      },
      'fileInputChanged': function(/*Event*/ ev) {
        if (this.$formElement$2 !== null) {
          this.$SubmitForm$2();
        }
      },
      '$SubmitForm$2': function() {
        if (this.$messageListener$2 !== null) {
          window.removeEventListener("message", this.$messageListener$2, false);
        }

        // register listener for server result
        this.$messageListener$2 = (function(/*Event*/ e) {
          if (yfiles.system.text.StringExtensions.isEqual((/*(MessageEvent)*/e).origin, this.serverOrigin)) {
            this.$OnMessageReceived$2(e);
          }
        }).bind(this);
        window.addEventListener("message", this.$messageListener$2, false);

        // upload to server
        var /*HTMLFormElement*/ form = this.$formElement$2;
        form.action = this.serverUrl;
        form.submit();
      },
      '$OnMessageReceived$2': function(/*Event*/ e) {
        window.removeEventListener("message", this.$messageListener$2, false);

        var /*yfiles.lang.String*/ data = demo.yfiles.io.fileoperations.OpenViaServerOperation.decodeData((/*(MessageEvent)*/e).data);
        if (yfiles.system.text.StringExtensions.startsWith(data, "!ERROR!")) {
          this.onFail(new demo.yfiles.io.fileoperations.FileEventArgs.FromString(data));
        } else {
          this.onSuccess(new demo.yfiles.io.fileoperations.FileEventArgs.FromString(data));
        }
      },
      '$static': {
        'decodeData': function(/*yfiles.lang.String*/ text) {
          var /*yfiles.lang.String*/ data = yfiles.system.Regex.replace(text, "\\+", " ");
          data = decodeURIComponent(data);
          return data;
        }
      }
    };
  })


});});
