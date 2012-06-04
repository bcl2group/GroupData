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

  /*private*/ exports.StylePanel = new yfiles.ClassDefinition(function() {
    return {
      '$extends': yworks.canvas.drawing.headless.Control,
      'constructor': function() {
        yworks.canvas.drawing.headless.Control.call(this);
      },
      'init': function(/*HTMLDivElement*/ div) {
        demo.yfiles.graph.input.draganddrop.StylePanel.$super.init.call(this, div);
        this.$InitVisual$3();
      },
      '$InitVisual$3': function() {
        var /*yworks.yfiles.ui.GraphControl*/ graphControl = this.$CreateGraphControl$3();
        var /*yworks.yfiles.ui.model.IGraph*/ nodeContainer = this.$CreateNodes$3();

        var /*yfiles.util.IEnumerator*/ tmpEnumerator = nodeContainer.nodes.getEnumerator();
        while (tmpEnumerator.moveNext()) {
          var /*yworks.yfiles.ui.model.INode*/ node = tmpEnumerator.current;
          {
            var /*yworks.canvas.drawing.headless.Visual*/ nodeVisual = this.$CreateNodeVisual$3(graphControl, node);
            var /*HTMLElement*/ wrapped = this.$WrapNodeVisual$3(node, nodeVisual);
            this.div.appendChild(wrapped);
          }
        }
      },
      '$WrapNodeVisual$3': function(/*yworks.yfiles.ui.model.INode*/ node, /*yworks.canvas.drawing.headless.Visual*/ nodeVisual) {
        var /*int*/ margin = 5;

        var /*HTMLDivElement*/ div = /*(HTMLDivElement)*/document.createElement("div");
        var /*stubs.svgType*/ svgElement = window.document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var /*yworks.canvas.geometry.IRectangle*/ nodeLayout = node.layout;
        svgElement.appendChild(nodeVisual.svgElement);
        yfiles.demo.ElementExtensions.addClass(div, "stylePanelItem");
        var /*CSSStyleDeclaration*/ css = div.style;
        var /*double*/ w = (nodeLayout.width + 2 * margin);
        css.setProperty("width", w + "px", null);
        var /*double*/ h = (nodeLayout.height + 2 * margin);
        css.setProperty("height", h + "px", null);
        svgElement.setAttribute("viewBox", (-margin) + " " + (-margin) + " " + w + " " + h);
        div.appendChild(svgElement);

        new demo.yfiles.graph.input.draganddrop.NodeDragControl(div, node);

        return div;
      },
      '$CreateNodeVisual$3': function(/*yworks.yfiles.ui.GraphControl*/ graphControl, /*yworks.yfiles.ui.model.INode*/ original) {
        graphControl.graph.clear();

        var /*yworks.yfiles.ui.model.INode*/ node = graphControl.graph.createNodeWithBoundsStyleAndTag(original.layout.toRectD(), original.style, original.tag);
        var /*yfiles.util.IEnumerator*/ tmpEnumerator = original.labels.getEnumerator();
        while (tmpEnumerator.moveNext()) {
          var /*yworks.yfiles.ui.model.ILabel*/ label = tmpEnumerator.current;
          {
            graphControl.graph.addLabelWithParameterStylePreferredSizeAndTag(node, label.labelModelParameter, label.style, label.text, label.preferredSize, label.tag);
          }
        }
        graphControl.fitGraphBounds();

        var /*yworks.canvas.drawing.IRenderContext*/ ctx = graphControl.createStandaloneRenderContext();
        var /*yworks.canvas.drawing.headless.Visual*/ visualContent = graphControl.createVisualContent(ctx);
        return visualContent;
      },
      '$CreateNodes$3': function() {
        var /*int*/ nodeSize = 30;

        // Create a new Graph in which the palette nodes live
        var /*yworks.yfiles.ui.model.DefaultGraph*/ nodeContainer = new yworks.yfiles.ui.model.DefaultGraph();
        // Create some nodes

        nodeContainer.createNodeWithBoundsAndStyle(new yworks.canvas.geometry.structs.RectD(0, 0, nodeSize, nodeSize), new yworks.yfiles.ui.drawing.ShapeNodeStyle.WithShapePenAndBrush(yworks.yfiles.ui.drawing.ShapeNodeShape.RECTANGLE, yworks.canvas.drawing.Pens.black, yworks.support.windows.Brushes.darkOrange));
        nodeContainer.createNodeWithBoundsAndStyle(new yworks.canvas.geometry.structs.RectD(0, 0, nodeSize, nodeSize), new yworks.yfiles.ui.drawing.ShapeNodeStyle.WithShapePenAndBrush(yworks.yfiles.ui.drawing.ShapeNodeShape.ROUND_RECTANGLE, yworks.canvas.drawing.Pens.black, yworks.support.windows.Brushes.darkOrange));
        nodeContainer.createNodeWithBoundsAndStyle(new yworks.canvas.geometry.structs.RectD(0, 0, nodeSize, nodeSize), new yworks.yfiles.ui.drawing.BevelNodeStyle.WithColor(yworks.support.windows.Colors.darkOrange));
        nodeContainer.createNodeWithBoundsAndStyle(new yworks.canvas.geometry.structs.RectD(0, 0, nodeSize, nodeSize), new yworks.yfiles.ui.drawing.ShinyPlateNodeStyle.WithColor(yworks.support.windows.Colors.darkOrange));

        var /*yworks.yfiles.ui.drawing.PanelNodeStyle*/ newInstance = new yworks.yfiles.ui.drawing.PanelNodeStyle.WithColor(yworks.support.windows.Colors.lightBlue);
        {
          newInstance.insets = new yworks.canvas.geometry.structs.InsetsD.FromLeftTopRightAndBottom(0, 15, 0, 0);
        }
        var /*yworks.yfiles.ui.model.INode*/ node = nodeContainer.createNodeWithBoundsAndStyle(new yworks.canvas.geometry.structs.RectD(0, 0, 70, 70), newInstance);
        nodeContainer.addLabelWithParameterAndStyle(node, yworks.yfiles.ui.labelmodels.InteriorStretchLabelModel.NORTH, new yworks.yfiles.ui.drawing.SimpleLabelStyle(), "Group Node");

        return nodeContainer;
      },
      '$CreateGraphControl$3': function() {
        var /*yworks.yfiles.ui.GraphControl*/ graphControl = new yworks.yfiles.ui.GraphControl();
        return graphControl;
      }
    };
  })


});});
