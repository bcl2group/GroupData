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
   * A node style that uses predefined SVG templates for the node visualization.
   * The SVG templates are referenced using a well-known key which is used to 
   * retrieve the template from the canvas. 
   */
  /*public*/ exports.SVGNodeStyle = new yfiles.ClassDefinition(function() {
    return {
      '$extends': yworks.yfiles.ui.drawing.SimpleAbstractNodeStyle,
      'constructor': function() {
        yworks.yfiles.ui.drawing.SimpleAbstractNodeStyle.call(this, yworks.canvas.CanvasContainer.$class);
        yworks.yfiles.ui.drawing.SimpleAbstractNodeStyle.call(this, yworks.canvas.CanvasContainer.$class);
      },
      // map that keeps track of the template keys that have been added to the canvas defs section.
      '$templateKey$1': null,
      'templateKey': {
        '$meta': function() {
          return [yfiles.system.reflect.TypeAttribute(yfiles.lang.String.$class)];
        },
        'get': function() {
          return this.$templateKey$1;
        },
        'set': function(/*yfiles.lang.String*/ value) {
          this.$templateKey$1 = value;
        }
      },
      'createVisual': function(/*yworks.yfiles.ui.model.INode*/ node, /*yworks.canvas.drawing.IRenderContext*/ renderContext) {
        var /*yworks.canvas.CanvasContainer*/ container = new yworks.canvas.CanvasContainer();
        this.$Render$1(container, node, renderContext);
        return container;
      },
      'updateVisual': function(/*yworks.yfiles.ui.model.INode*/ node, /*yworks.canvas.drawing.IRenderContext*/ renderContext, /*yworks.canvas.CanvasContainer*/ oldVisual) {
        var /*yworks.canvas.CanvasContainer*/ container = oldVisual;
        if (container !== null) {
          var /*yworks.canvas.geometry.structs.RectD*/ layout = node.layout.toRectD();
          container.transform = new yworks.canvas.geometry.Matrix2D.FromValues(layout.$width, 0, 0, layout.$height, layout.$x, layout.$y);
          return container;
        } else {
          return this.createVisual(node, renderContext);
        }
      },
      '$Render$1': function(/*yworks.canvas.CanvasContainer*/ container, /*yworks.yfiles.ui.model.INode*/ node, /*yworks.canvas.drawing.IRenderContext*/ context) {
        var /*yworks.canvas.geometry.structs.RectD*/ layout = node.layout.toRectD();

        var /*demo.yfiles.graph.viewer.SvgNodeStyleDefsSupport*/ defsSupport = demo.yfiles.graph.viewer.SVGNodeStyle.templateKeyToDefSupport.getItem(this.templateKey);
        var /*Element*/ svgElement = this.getTemplateElement(context, node);
        if (null === defsSupport && null !== svgElement) {
          defsSupport = new demo.yfiles.graph.viewer.SvgNodeStyleDefsSupport(svgElement);
          demo.yfiles.graph.viewer.SVGNodeStyle.templateKeyToDefSupport.setItem(this.templateKey, defsSupport);
        }

        if (defsSupport !== null && svgElement !== null) {
          // retrieve the id of the SVG template element in the canvas defs section.
          // the element will automatically be added to the defs section, if it hasn't been added yet.
          var /*yfiles.lang.String*/ defsId = context.getDefsId(defsSupport);
          var /*yworks.canvas.drawing.headless.UseVisual*/ a = new yworks.canvas.drawing.headless.UseVisual.WithId(defsId);

          // The use element is scaled down by the original size of the SVG template, so
          // we can just use the node's layout to properly scale the visual in UpdateVisual.
          var /*yworks.canvas.geometry.structs.SizeD*/ originalTemplateSize = this.getOriginalTemplateSize(svgElement);

          var /*double*/ width = originalTemplateSize.$width;
          var /*double*/ height = originalTemplateSize.$height;

          var /*double*/ scaleX = 1 / width;
          var /*double*/ scaleY = 1 / height;

          container.add(a);

          a.transform = new yworks.canvas.geometry.Matrix2D.FromValues(scaleX, 0, 0, scaleY, 0, 0);
        }

        var /*yworks.canvas.geometry.Matrix2D*/ matrix = new yworks.canvas.geometry.Matrix2D.FromValues(layout.$width, 0, 0, layout.$height, layout.$x, layout.$y);
        container.transform = matrix;
      },
      'getOriginalTemplateSize': function(/*Element*/ templateElement) {
        var /*yfiles.lang.String*/ widthAtt = templateElement.getAttribute("width");
        var /*yfiles.lang.String*/ heightAtt = templateElement.getAttribute("height");
        if (null !== widthAtt && null !== heightAtt) {
          var /*int*/ width = parseInt(widthAtt, 10);
          var /*int*/ height = parseInt(heightAtt, 10);
          return new yworks.canvas.geometry.structs.SizeD(width, height);
        }
        return new yworks.canvas.geometry.structs.SizeD(10, 10);

      },
      'getTemplateElement': function(/*yworks.canvas.drawing.IRenderContext*/ ctx, /*yworks.canvas.model.IModelItem*/ node) {
        if (this.templateKey !== null) {
          var /*Element*/ templateElement = null;
          if (ctx !== null) {
            var /*yfiles.lang.Object*/ tmp = ctx.canvas.tryFindResource(this.templateKey);
            templateElement = (tmp instanceof Element) ? /*(Element)*/tmp : null;
          }
          return templateElement;
        }
        return null;
      },
      '$static': {
        'templateKeyToDefSupport': null,
        '$clinit': function() {
          demo.yfiles.graph.viewer.SVGNodeStyle.templateKeyToDefSupport = new yworks.canvas.model.DictionaryMapper/*<yfiles.lang.String, demo.yfiles.graph.viewer.SvgNodeStyleDefsSupport>*/();
        }
      }
    };
  })


});});
