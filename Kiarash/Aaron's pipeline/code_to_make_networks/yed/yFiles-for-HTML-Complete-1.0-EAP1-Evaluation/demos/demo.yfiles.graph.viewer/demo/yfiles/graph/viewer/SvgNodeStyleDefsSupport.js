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

  /**
   * Support class for creating and updating the SVG template element that is added
   * to the canvas <pre>defs</pre> element. The SVGNodeStyle instances are rendered by a 
   * <pre>use</pre> element that references this element. 
   */
  /*private*/ exports.SvgNodeStyleDefsSupport = new yfiles.ClassDefinition(function() {
    return {
      '$with': [yworks.canvas.drawing.headless.IDefsSupport],
      'constructor': function(/*Element*/ element) {
        this.$element$0 = element;
      },
      '$element$0': null,
      'createDefsElement': function(/*yworks.canvas.ICanvasContext*/ context) {
        return /*(Element)*/this.$element$0;
      },
      'accept': function(/*yworks.canvas.ICanvasContext*/ ctx, /*Node*/ node, /*yfiles.lang.String*/ id) {
        if (node instanceof Element) {
          return yworks.canvas.input.SvgDefsUtil.isUseReference(/*(Element)*/node, id);
        }
        return false;
      },
      'updateDefsElement': function(/*Element*/ oldElement, /*yworks.canvas.ICanvasContext*/ context) {}
    };
  })


});});
