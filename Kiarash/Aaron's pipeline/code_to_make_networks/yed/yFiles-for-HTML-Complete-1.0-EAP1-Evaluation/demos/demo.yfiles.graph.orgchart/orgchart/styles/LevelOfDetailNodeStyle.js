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
yfiles.module("orgchart.styles", function(exports) {

  /*public*/ exports.LevelOfDetailNodeStyle = new yfiles.ClassDefinition(function() {
    return {
      '$extends': yworks.yfiles.ui.drawing.SimpleAbstractNodeStyle,
      'constructor': function(/*yworks.yfiles.ui.drawing.INodeStyle*/ detailNodeStyle, /*yworks.yfiles.ui.drawing.INodeStyle*/ intermediateNodeStyle, /*yworks.yfiles.ui.drawing.INodeStyle*/ overviewNodeStyle) {
        yworks.yfiles.ui.drawing.SimpleAbstractNodeStyle.call(this, yworks.canvas.drawing.headless.Visual.$class);
        this.$detailNodeStyle$1 = detailNodeStyle;
        this.$intermediateNodeStyle$1 = intermediateNodeStyle;
        this.$overviewNodeStyle$1 = overviewNodeStyle;
      },
      '$detailNodeStyle$1': null,
      '$intermediateNodeStyle$1': null,
      '$overviewNodeStyle$1': null,
      '$detailThreshold$1': 0.7,
      '$intermediateThreshold$1': 0.4,
      'detailThreshold': {
        'get': function() {
          return this.$detailThreshold$1;
        },
        'set': function(/*double*/ value) {
          this.$detailThreshold$1 = value;
        }
      },
      'intermediateThreshold': {
        'get': function() {
          return this.$intermediateThreshold$1;
        },
        'set': function(/*double*/ value) {
          this.$intermediateThreshold$1 = value;
        }
      },
      'detailNodeStyle': {
        'get': function() {
          return this.$detailNodeStyle$1;
        },
        'set': function(/*yworks.yfiles.ui.drawing.INodeStyle*/ value) {
          this.$detailNodeStyle$1 = value;
        }
      },
      'intermediateNodeStyle': {
        'get': function() {
          return this.$intermediateNodeStyle$1;
        },
        'set': function(/*yworks.yfiles.ui.drawing.INodeStyle*/ value) {
          this.$intermediateNodeStyle$1 = value;
        }
      },
      'overviewNodeStyle': {
        'get': function() {
          return this.$overviewNodeStyle$1;
        },
        'set': function(/*yworks.yfiles.ui.drawing.INodeStyle*/ value) {
          this.$overviewNodeStyle$1 = value;
        }
      },
      'createVisual': function(/*yworks.yfiles.ui.model.INode*/ node, /*yworks.canvas.drawing.IRenderContext*/ renderContext) {
        var /*double*/ zoom = renderContext.zoom;
        var /*yworks.canvas.CanvasContainer*/ container = new yworks.canvas.CanvasContainer();
        if (zoom >= this.$detailThreshold$1) {
          container.add(this.$detailNodeStyle$1.renderer.getVisualCreator(node, this.$detailNodeStyle$1).createVisual(renderContext));
          container.setRenderDataCache(this.$detailNodeStyle$1.renderer);
        } else if (zoom >= this.$intermediateThreshold$1) {
          container.add(this.$intermediateNodeStyle$1.renderer.getVisualCreator(node, this.$intermediateNodeStyle$1).createVisual(renderContext));
          container.setRenderDataCache(this.$intermediateNodeStyle$1.renderer);
        } else {
          container.add(this.$overviewNodeStyle$1.renderer.getVisualCreator(node, this.$overviewNodeStyle$1).createVisual(renderContext));
          container.setRenderDataCache(this.$overviewNodeStyle$1.renderer);
        }
        return container;
      },
      'updateVisual': function(/*yworks.yfiles.ui.model.INode*/ node, /*yworks.canvas.drawing.IRenderContext*/ renderContext, /*yworks.canvas.drawing.headless.Visual*/ oldVisual) {
        var /*double*/ zoom = renderContext.zoom;
        var /*yworks.canvas.CanvasContainer*/ container = (oldVisual instanceof yworks.canvas.CanvasContainer) ? /*(yworks.canvas.CanvasContainer)*/oldVisual : null;
        if (container === null) {
          return this.createVisual(node, renderContext);
        }
        var /*yworks.canvas.drawing.headless.Visual*/ oldInnerVisual = container.children.get(0);
        var /*yworks.yfiles.ui.drawing.INodeStyleRenderer*/ cache = yworks.canvas.svg.SVGExtensions.getRenderDataCache(yworks.yfiles.ui.drawing.INodeStyleRenderer.$class, container);
        if (zoom >= this.$detailThreshold$1 && cache === this.$detailNodeStyle$1.renderer) {
          container.children.set(0, this.$detailNodeStyle$1.renderer.getVisualCreator(node, this.$detailNodeStyle$1).updateVisual(renderContext, oldInnerVisual));
          return container;
        } else if (zoom >= this.$intermediateThreshold$1 && zoom <= this.$detailThreshold$1 && cache === this.$intermediateNodeStyle$1.renderer) {
          container.children.set(0, this.$intermediateNodeStyle$1.renderer.getVisualCreator(node, this.$intermediateNodeStyle$1).updateVisual(renderContext, oldInnerVisual));
          return container;
        } else if (zoom <= this.$intermediateThreshold$1 && cache === this.$overviewNodeStyle$1.renderer) {
          container.children.set(0, this.$overviewNodeStyle$1.renderer.getVisualCreator(node, this.$overviewNodeStyle$1).updateVisual(renderContext, oldInnerVisual));
          return container;
        }
        return this.createVisual(node, renderContext);
      }
    };
  })


});});
