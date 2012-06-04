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
yfiles.module("demo.yfiles.graph.input.draganddrop", function(exports) {

  /*private*/ exports.NodeDragControl = new yfiles.ClassDefinition(function() {
    return {
      '$extends': yworks.canvas.drawing.headless.Control,
      'constructor': function(/*HTMLDivElement*/ div, /*yworks.yfiles.ui.model.INode*/ node) {
        yworks.canvas.drawing.headless.Control.FromDiv.call(this, div);
        this.$node$3 = node;
      },
      '$node$3': null,
      'onMouseDown': function(/*yworks.canvas.drawing.headless.MouseEventArgs*/ args) {
        if (args.button === yworks.canvas.MouseButtons.LEFT) {
          yworks.support.DragDrop.doDragDrop(this.div, this.$node$3, yworks.canvas.drawing.headless.DragDropEffects.ALL);
        }
      }
    };
  })


});});
