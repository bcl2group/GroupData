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
yfiles.module("demo.yfiles.graph.viewer", function(exports) {

  /*public*/ exports.PropertiesView = new yfiles.ClassDefinition(function() {
    return {
      'constructor': function(/*HTMLElement*/ element) {
        this.element = element;
      },
      '$element$0': null,
      'element': {
        'get': function() {
          return this.$element$0;
        },
        'set': function(/*HTMLElement*/ value) {
          this.$element$0 = value;
        }
      },
      'clear': function() {
        yfiles.demo.Application.removeAllChildren(this.element);
      },
      'addTextItem': function(/*yfiles.lang.String*/ label, /*yfiles.lang.String*/ content) {
        this.element.appendChild(demo.yfiles.graph.viewer.PropertiesView.createElement("h4", label));
        this.element.appendChild(demo.yfiles.graph.viewer.PropertiesView.createElement("p", content));
      },
      'addLinkItem': function(/*yfiles.lang.String*/ label, /*yfiles.lang.String*/ content, /*yfiles.lang.String*/ url) {
        this.element.appendChild(demo.yfiles.graph.viewer.PropertiesView.createElement("h4", label));
        var /*HTMLAnchorElement*/ anchorElement = /*(HTMLAnchorElement)*/demo.yfiles.graph.viewer.PropertiesView.createElement("a", content);
        anchorElement.href = url;
        anchorElement.target = "_blank";

        var /*Element*/ parElement = document.createElement("p");
        parElement.appendChild(anchorElement);
        this.element.appendChild(parElement);
      },
      '$static': {
        'createElement': function(/*yfiles.lang.String*/ tagName, /*yfiles.lang.String*/ textContent) {
          var /*Element*/ element = document.createElement(tagName);
          element.textContent = textContent;
          return element;
        }
      }
    };
  })


});});
