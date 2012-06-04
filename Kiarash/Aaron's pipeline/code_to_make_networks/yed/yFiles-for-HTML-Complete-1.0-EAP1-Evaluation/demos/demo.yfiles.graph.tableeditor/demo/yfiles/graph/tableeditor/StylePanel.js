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
yfiles.module("demo.yfiles.graph.tableeditor", function(exports) {

  /*private*/ exports.StylePanel = new yfiles.ClassDefinition(function() {
    return {
      '$extends': yworks.canvas.drawing.headless.Control,
      'constructor': function() {
        yworks.canvas.drawing.headless.Control.call(this);
      },
      'init': function(/*HTMLDivElement*/ div) {
        demo.yfiles.graph.tableeditor.StylePanel.$super.init.call(this, div);
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
        css.setProperty("width", (nodeLayout.width + 2 * margin) + "px", null);
        css.setProperty("height", (nodeLayout.height + 2 * margin) + "px", null);
        div.appendChild(svgElement);

        new demo.yfiles.graph.tableeditor.NodeDragControl(div, node);

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

        var /*yworks.canvas.drawing.IRenderContext*/ renderContext = graphControl.createRenderContext();
        var /*yworks.canvas.drawing.headless.Visual*/ visualContent = graphControl.createVisualContent(renderContext);
        return visualContent;
      },
      '$CreateNodes$3': function() {
        // Create a new Graph in which the palette nodes live
        var /*yworks.yfiles.ui.model.DefaultGraph*/ nodeContainer = new yworks.yfiles.ui.model.DefaultGraph();

        //Dummy table that serves to hold only a sample row
        var /*yworks.yfiles.ui.model.ITable*/ rowSampleTable = new yworks.yfiles.ui.model.Table();
        //Dummy table that serves to hold only a sample column
        var /*yworks.yfiles.ui.model.ITable*/ columnSampleTable = new yworks.yfiles.ui.model.Table();

        //Configure the defaults for the row sample table
        //We use a node control style and pass the style specific instance b a custom messenger object (e.g. StripeDescriptor)
        var /*demo.yfiles.graph.tableeditor.style.AlternatingLeafStripeStyle*/ newInstance = new demo.yfiles.graph.tableeditor.style.AlternatingLeafStripeStyle();
        {
          var /*demo.yfiles.graph.tableeditor.style.StripeDescriptor*/ newInstance1 = new demo.yfiles.graph.tableeditor.style.StripeDescriptor();
          {
            newInstance1.backgroundBrush = new yworks.canvas.drawing.headless.SolidColorBrush(yworks.canvas.drawing.headless.Color.fromArgb(255, 171, 200, 226));
            newInstance1.insetBrush = new yworks.canvas.drawing.headless.SolidColorBrush(yworks.canvas.drawing.headless.Color.fromArgb(255, 240, 248, 255));
          }
          newInstance.evenLeafDescriptor = newInstance1;
          var /*demo.yfiles.graph.tableeditor.style.StripeDescriptor*/ newInstance2 = new demo.yfiles.graph.tableeditor.style.StripeDescriptor();
          {
            newInstance2.backgroundBrush = new yworks.canvas.drawing.headless.SolidColorBrush(yworks.canvas.drawing.headless.Color.fromArgb(255, 171, 200, 226));
            newInstance2.insetBrush = new yworks.canvas.drawing.headless.SolidColorBrush(yworks.canvas.drawing.headless.Color.fromArgb(255, 240, 248, 255));
          }
          newInstance.oddLeafDescriptor = newInstance2;
          var /*demo.yfiles.graph.tableeditor.style.StripeDescriptor*/ newInstance3 = new demo.yfiles.graph.tableeditor.style.StripeDescriptor();
          {
            newInstance3.backgroundBrush = yworks.support.windows.Brushes.transparent;
            newInstance3.insetBrush = new yworks.canvas.drawing.headless.SolidColorBrush(yworks.canvas.drawing.headless.Color.fromArgb(255, 113, 146, 178));
          }
          newInstance.parentDescriptor = newInstance3;
        }
        rowSampleTable.rowDefaults.style = newInstance;

        //Create the sample row
        var /*yworks.yfiles.ui.model.IRow*/ rowSampleRow = rowSampleTable.createRootRow();
        //Create an invisible sample column in this table so that we will see something.
        var /*yworks.yfiles.ui.model.IColumn*/ rowSampleColumn = rowSampleTable.createRootColumnWithSizeAndStyle(200, yworks.yfiles.ui.drawing.common.VoidNodeStyle.INSTANCE);
        //The sample row uses empty insets
        rowSampleTable.setInsets(rowSampleColumn, new yworks.canvas.geometry.structs.InsetsD.createDefault());
        rowSampleTable.addLabel(rowSampleRow, "Row");

        var /*yworks.yfiles.ui.model.IRow*/ columnSampleRow = columnSampleTable.createRootRowWithSizeAndStyle(200, yworks.yfiles.ui.drawing.common.VoidNodeStyle.INSTANCE);
        var /*demo.yfiles.graph.tableeditor.style.AlternatingLeafStripeStyle*/ newInstance4 = new demo.yfiles.graph.tableeditor.style.AlternatingLeafStripeStyle();
        {
          var /*demo.yfiles.graph.tableeditor.style.StripeDescriptor*/ newInstance5 = new demo.yfiles.graph.tableeditor.style.StripeDescriptor();
          {
            newInstance5.backgroundBrush = new yworks.canvas.drawing.headless.SolidColorBrush(yworks.canvas.drawing.headless.Color.fromArgb(255, 171, 200, 226));
            newInstance5.insetBrush = new yworks.canvas.drawing.headless.SolidColorBrush(yworks.canvas.drawing.headless.Color.fromArgb(255, 240, 248, 255));
          }
          newInstance4.evenLeafDescriptor = newInstance5;
          var /*demo.yfiles.graph.tableeditor.style.StripeDescriptor*/ newInstance6 = new demo.yfiles.graph.tableeditor.style.StripeDescriptor();
          {
            newInstance6.backgroundBrush = new yworks.canvas.drawing.headless.SolidColorBrush(yworks.canvas.drawing.headless.Color.fromArgb(255, 171, 200, 226));
            newInstance6.insetBrush = new yworks.canvas.drawing.headless.SolidColorBrush(yworks.canvas.drawing.headless.Color.fromArgb(255, 240, 248, 255));
          }
          newInstance4.oddLeafDescriptor = newInstance6;
          var /*demo.yfiles.graph.tableeditor.style.StripeDescriptor*/ newInstance7 = new demo.yfiles.graph.tableeditor.style.StripeDescriptor();
          {
            newInstance7.backgroundBrush = yworks.support.windows.Brushes.transparent;
            newInstance7.insetBrush = new yworks.canvas.drawing.headless.SolidColorBrush(yworks.canvas.drawing.headless.Color.fromArgb(255, 113, 146, 178));
          }
          newInstance4.parentDescriptor = newInstance7;
        }
        var /*yworks.yfiles.ui.model.IColumn*/ columnSampleColumn = columnSampleTable.createRootColumnWithSizeAndStyle(200, newInstance4);
        columnSampleTable.setInsets(columnSampleRow, new yworks.canvas.geometry.structs.InsetsD.createDefault());
        columnSampleTable.addLabel(columnSampleColumn, "Column");

        //Table for a complete sample table node
        var /*yworks.yfiles.ui.model.Table*/ newInstance8 = new yworks.yfiles.ui.model.Table();
        {
          newInstance8.insets = new yworks.canvas.geometry.structs.InsetsD.FromLeftTopRightAndBottom(0, 30, 0, 0);
        }
        var /*yworks.yfiles.ui.model.Table*/ sampleTable = newInstance8;
        //Configure the defaults for the row sample table
        sampleTable.columnDefaults.minimumSize = sampleTable.rowDefaults.minimumSize = 50;

        //Setup defaults for the complete sample table
        //We use a custom style that alternates the stripe colors and uses a special style for all parent stripes.
        var /*demo.yfiles.graph.tableeditor.style.AlternatingLeafStripeStyle*/ newInstance9 = new demo.yfiles.graph.tableeditor.style.AlternatingLeafStripeStyle();
        {
          var /*demo.yfiles.graph.tableeditor.style.StripeDescriptor*/ newInstance10 = new demo.yfiles.graph.tableeditor.style.StripeDescriptor();
          {
            newInstance10.backgroundBrush = new yworks.canvas.drawing.headless.SolidColorBrush(yworks.canvas.drawing.headless.Color.fromArgb(255, 196, 215, 237));
            newInstance10.insetBrush = new yworks.canvas.drawing.headless.SolidColorBrush(yworks.canvas.drawing.headless.Color.fromArgb(255, 196, 215, 237));
          }
          newInstance9.evenLeafDescriptor = newInstance10;
          var /*demo.yfiles.graph.tableeditor.style.StripeDescriptor*/ newInstance11 = new demo.yfiles.graph.tableeditor.style.StripeDescriptor();
          {
            newInstance11.backgroundBrush = new yworks.canvas.drawing.headless.SolidColorBrush(yworks.canvas.drawing.headless.Color.fromArgb(255, 171, 200, 226));
            newInstance11.insetBrush = new yworks.canvas.drawing.headless.SolidColorBrush(yworks.canvas.drawing.headless.Color.fromArgb(255, 171, 200, 226));
          }
          newInstance9.oddLeafDescriptor = newInstance11;
          var /*demo.yfiles.graph.tableeditor.style.StripeDescriptor*/ newInstance12 = new demo.yfiles.graph.tableeditor.style.StripeDescriptor();
          {
            newInstance12.backgroundBrush = new yworks.canvas.drawing.headless.SolidColorBrush(yworks.canvas.drawing.headless.Color.fromArgb(255, 113, 146, 178));
            newInstance12.insetBrush = new yworks.canvas.drawing.headless.SolidColorBrush(yworks.canvas.drawing.headless.Color.fromArgb(255, 113, 146, 178));
          }
          newInstance9.parentDescriptor = newInstance12;
        }
        sampleTable.rowDefaults.style = newInstance9;

        //The style for the columns is simpler, we use a node control style that only points the header insets.
        var /*demo.yfiles.graph.tableeditor.style.AlternatingLeafStripeStyle*/ newInstance13 = new demo.yfiles.graph.tableeditor.style.AlternatingLeafStripeStyle();
        {
          var /*demo.yfiles.graph.tableeditor.style.StripeDescriptor*/ newInstance14 = new demo.yfiles.graph.tableeditor.style.StripeDescriptor();
          {
            newInstance14.backgroundBrush = yworks.support.windows.Brushes.transparent;
            newInstance14.insetBrush = new yworks.canvas.drawing.headless.SolidColorBrush(yworks.canvas.drawing.headless.Color.fromArgb(255, 113, 146, 178));
          }
          newInstance13.evenLeafDescriptor = newInstance14;
          var /*demo.yfiles.graph.tableeditor.style.StripeDescriptor*/ newInstance15 = new demo.yfiles.graph.tableeditor.style.StripeDescriptor();
          {
            newInstance15.backgroundBrush = yworks.support.windows.Brushes.transparent;
            newInstance15.insetBrush = new yworks.canvas.drawing.headless.SolidColorBrush(yworks.canvas.drawing.headless.Color.fromArgb(255, 113, 146, 178));
          }
          newInstance13.oddLeafDescriptor = newInstance15;
          var /*demo.yfiles.graph.tableeditor.style.StripeDescriptor*/ newInstance16 = new demo.yfiles.graph.tableeditor.style.StripeDescriptor();
          {
            newInstance16.backgroundBrush = yworks.support.windows.Brushes.transparent;
            newInstance16.insetBrush = yworks.support.windows.Brushes.transparent;
          }
          newInstance13.parentDescriptor = newInstance16;
        }
        sampleTable.columnDefaults.style = columnSampleTable.columnDefaults.style = newInstance13;

        //Create a row and a column in the sample table
        sampleTable.createGrid(1, 1);
        //Use twice the default width for this sample column (looks nicer in the preview...)
        sampleTable.setSize(yfiles.system.collections.EnumerableExtensions./*<yworks.yfiles.ui.model.IColumn>*/first(sampleTable.columns), yfiles.system.collections.EnumerableExtensions./*<yworks.yfiles.ui.model.IColumn>*/first(sampleTable.columns).getActualSize() * 2);
        //Bind the table to a dummy node which is used for drag & drop
        //Binding the table is performed through a TableNodeStyle instance.
        //Among other things, this also makes the table instance available in the node's lookup (use INode.Get<ITable>()...)
        //Add the sample node for the table
        var /*yworks.yfiles.ui.drawing.TableNodeStyle*/ newInstance17 = new yworks.yfiles.ui.drawing.TableNodeStyle.TableNodeStyle(sampleTable);
        {
          newInstance17.tableRenderingOrder = yworks.yfiles.ui.drawing.TableRenderingOrder.ROWS_FIRST;
          var /*yworks.yfiles.ui.drawing.ShapeNodeStyle*/ newInstance18 = new yworks.yfiles.ui.drawing.ShapeNodeStyle();
          {
            newInstance18.brush = new yworks.canvas.drawing.headless.SolidColorBrush(yworks.canvas.drawing.headless.Color.fromArgb(255, 236, 245, 255));
          }
          newInstance17.backgroundStyle = newInstance18;
        }
        nodeContainer.createNodeWithBoundsAndStyle(sampleTable.layout.toRectD(), newInstance17);

        //Add sample rows and columns
        //We use dummy nodes to hold the associated stripe instances - this makes the style panel easier to use
        nodeContainer.createNodeWithBoundsStyleAndTag(columnSampleTable.layout.toRectD(), new yworks.yfiles.ui.drawing.TableNodeStyle.TableNodeStyle(columnSampleTable), yfiles.system.collections.EnumerableExtensions./*<yworks.yfiles.ui.model.IColumn>*/first(columnSampleTable.rootColumn.columns));

        //Add sample rows and columns
        //We use dummy nodes to hold the associated stripe instances - this makes the style panel easier to use
        nodeContainer.createNodeWithBoundsStyleAndTag(rowSampleTable.layout.toRectD(), new yworks.yfiles.ui.drawing.TableNodeStyle.TableNodeStyle(rowSampleTable), yfiles.system.collections.EnumerableExtensions./*<yworks.yfiles.ui.model.IRow>*/first(rowSampleTable.rootRow.rows));

        //Add normal sample leaf and group nodes
        var /*yworks.yfiles.ui.drawing.ShinyPlateNodeStyle*/ newInstance19 = new yworks.yfiles.ui.drawing.ShinyPlateNodeStyle.WithColor(yworks.support.windows.Colors.orange);
        {
          newInstance19.radius = 0;
        }
        nodeContainer.createNodeWithBoundsAndStyle(new yworks.canvas.geometry.structs.RectD.FromTopLeftAndSize(yworks.canvas.geometry.structs.PointD.origin, new yworks.canvas.geometry.structs.SizeD(80, 50)), newInstance19);

        var /*yworks.yfiles.ui.drawing.ShapeNodeStyle*/ newInstance20 = new yworks.yfiles.ui.drawing.ShapeNodeStyle();
        {
          newInstance20.shape = yworks.yfiles.ui.drawing.ShapeNodeShape.ROUND_RECTANGLE;
          newInstance20.brush = yworks.support.windows.Brushes.transparent;
          var /*yworks.support.windows.Pen*/ newInstance21 = new yworks.support.windows.Pen.FromBrushAndThickness(yworks.support.windows.Brushes.black, 1);
          {
            newInstance21.dashStyle = yworks.support.windows.DashStyles.dashDot;
          }
          newInstance20.pen = newInstance21;
        }
        nodeContainer.createNodeWithBoundsStyleAndTag(new yworks.canvas.geometry.structs.RectD.FromTopLeftAndSize(yworks.canvas.geometry.structs.PointD.origin, new yworks.canvas.geometry.structs.SizeD(80, 50)), newInstance20, "GroupNode");

        return nodeContainer;
      },
      '$CreateGraphControl$3': function() {
        var /*yworks.yfiles.ui.GraphControl*/ graphControl = new yworks.yfiles.ui.GraphControl();
        return graphControl;
      }
    };
  })


});});
