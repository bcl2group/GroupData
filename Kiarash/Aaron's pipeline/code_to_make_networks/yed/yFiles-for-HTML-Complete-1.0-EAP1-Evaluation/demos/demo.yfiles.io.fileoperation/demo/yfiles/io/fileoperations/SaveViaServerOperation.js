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
   */
  /*public*/ exports.SaveViaServerOperation = new yfiles.ClassDefinition(function() {
    return {
      '$extends': demo.yfiles.io.fileoperations.SaveOperation,
      'constructor': function() {
        demo.yfiles.io.fileoperations.SaveOperation.call(this);
        this.iFrameName = "y-demo-open-iframe";
        this.$Initialize$2();
      },
      '$iframeElement$2': null,
      '$iFrameName$2': null,
      'iFrameName': {
        'get': function() {
          return this.$iFrameName$2;
        },
        'set': function(/*yfiles.lang.String*/ value) {
          this.$iFrameName$2 = value;
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
      '$Initialize$2': function() {
        var /*HTMLIFrameElement*/ iframe = /*(HTMLIFrameElement)*/document.createElement("iframe");
        iframe.name = this.iFrameName;
        demo.yfiles.io.fileoperations.FileOperation.setElementInvisible(iframe, false);

        var /*HTMLElement*/ body = /*(HTMLElement)*/document.getElementsByTagName("body")[0];
        body.appendChild(iframe);
        this.$iframeElement$2 = iframe;
      },
      'save': function(/*yfiles.lang.String*/ fileContent, /*yfiles.lang.String*/ fileName) {
        // upload to server
        var /*yfiles.lang.String*/ id = demo.yfiles.io.fileoperations.SaveViaServerOperation.createUniqueID();
        var /*yfiles.lang.String*/ parameterList = "id=" + id;
        if (fileName !== null) {
          parameterList += "&fn=" + fileName;
        }

        var /*XMLHttpRequest*/ xhr = new XMLHttpRequest();
        xhr.onreadystatechange = /*(EventListener)*/((function(/*Event*/ evt) {
          this.$SaveUploadChanged$2(xhr, id);
        }).bind(this));
        xhr.open("POST", this.serverUrl + "?" + parameterList, true);
        xhr.send(fileContent);
      },
      '$SaveUploadChanged$2': function(/*XMLHttpRequest*/ xhr, /*yfiles.lang.String*/ id) {
        if (xhr.readyState !== yworks.util.xml.XmlLoader.READY_STATE_DONE) {
          return;
        }

        if (xhr.status === yworks.util.xml.XmlLoader.HTTP_STATUS_OK || xhr.status === yworks.util.xml.XmlLoader.FS_STATUS_OK) {
          if (this.$iframeElement$2 !== null) {
            this.$iframeElement$2.src = this.serverUrl + "?id=" + id;
            this.onSuccess(new demo.yfiles.io.fileoperations.FileEventArgs());
          }
        } else {
          this.onFail(new demo.yfiles.io.fileoperations.FileEventArgs.FromString(xhr.statusText));
        }
      },
      '$static': {
        'createUniqueID': function() {
          return "" + yfiles.system.YDateTime.now.toUniversalTime().ticks + "-" + new yfiles.system.Random().nextInt(0xffffff);
        }
      }
    };
  })


});});
