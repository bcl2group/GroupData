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
yfiles.module("demo.yfiles.algorithms.shortestpath", function(exports) {

  /*public*/ exports.ShortestPathDemo = new yfiles.ClassDefinition(function() {
    return {
      '$extends': yfiles.demo.Application,
      'constructor': function() {
        yfiles.demo.Application.call(this);
        this.$$init$1();
        this.$CreateCommands$1();
        // initialize random graph generator
        var /*demo.base.randomgraphgenerator.RandomGraphGenerator*/ newInstance = new demo.base.randomgraphgenerator.RandomGraphGenerator();
        {
          newInstance.allowCycles = true;
          newInstance.allowMultipleEdges = true;
          newInstance.allowSelfLoops = false;
          newInstance.edgeCount = 40;
          newInstance.nodeCount = 30;
        }
        this.$randomGraphGenerator$1 = newInstance;
      },
      // #region Fields
      // holds all available layouters by name for the combo box
      '$layouts$1': null,
      // holds the currently chosen layouter
      '$currentLayouter$1': null,
      // reentrant lock for layout
      '$layouting$1': false,
      // the styles to use for source nodes, target nodes, and ordinary nodes
      '$defaultNodeStyle$1': null,
      '$targetNodeStyle$1': null,
      '$sourceNodeStyle$1': null,
      '$sourceAndTargetNodeStyle$1': null,
      // the style to use for ordinary edges and edges that lie on a shortest path
      '$defaultEdgeStyle$1': null,
      '$pathEdgeStyle$1': null,
      // the current source nodes
      '$sourceNodes$1': null,
      // the current target nodes
      '$targetNodes$1': null,
      // whether to use directed path calculation
      '$directed$1': true,
      // for creating sample graphs
      '$randomGraphGenerator$1': null,
      // the set of the edges that are currently part of the path
      '$pathEdges$1': null,
      //private LabelValueDialog labelValueForm;
      '$graphEditorInputMode$1': null,
      // #endregion 
      'loaded': function() {
        document.title = "Shortest Path Demo [yFiles for HTML]";
        this.$InitControl$1();
      },
      '$InitControl$1': function() {
        this.$sourceNodes$1 = new yfiles.system.collections.generic.List/*<yworks.yfiles.ui.model.INode>*/();
        this.$targetNodes$1 = new yfiles.system.collections.generic.List/*<yworks.yfiles.ui.model.INode>*/();
        this.$InitializeInputModes$1();
        this.$InitializeStyles$1();
        this.$InitializeGraph$1();
        this.$OnLoaded$1(this, null);
      },
      '$CreateCommands$1': function() {
        this.setProperty("NewGraph", new yfiles.demo.ActionCommand(yfiles.lang.delegate(this.$GenerateGraph$1, this)));
        this.setProperty("FitContent", new yfiles.demo.ActionCommand(yfiles.lang.delegate(this.fitContent, this)));
        this.setProperty("ZoomIn", new yfiles.demo.ActionCommand(yfiles.lang.delegate(this.zoomIn, this)));
        this.setProperty("ZoomOut", new yfiles.demo.ActionCommand(yfiles.lang.delegate(this.zoomOut, this)));
        this.setProperty("LayoutCommand", new yfiles.demo.ActionCommand(yfiles.lang.delegate(this.$ApplyLayout$1, this)));
        this.setProperty("MarkSource", new yfiles.demo.ActionCommand((function() {
          this.$MarkAsSource$1(yfiles.system.collections.EnumerableExtensions./*<yworks.yfiles.ui.model.INode>*/toList(this.graphControl.selection.selectedNodes));
        }).bind(this)));
        this.setProperty("MarkTarget", new yfiles.demo.ActionCommand((function() {
          this.$MarkAsTarget$1(yfiles.system.collections.EnumerableExtensions./*<yworks.yfiles.ui.model.INode>*/toList(this.graphControl.selection.selectedNodes));
        }).bind(this)));
        this.setProperty("SetUniformLabelValue", new yfiles.demo.ActionCommand(yfiles.lang.delegate(this.setLabelValues, this)));
        this.setProperty("DeleteAllLabels", new yfiles.demo.ActionCommand(yfiles.lang.delegate(this.deleteLabels, this)));
        this.setProperty("SetLayout", new yfiles.demo.ActionCommand(yfiles.lang.delegate(this.layoutComboBox_SelectedIndexChanged, this)));
        this.setProperty("SetDirection", new yfiles.demo.ActionCommand(yfiles.lang.delegate(this.$DirectedComboBox_SelectedIndexChanged$1, this)));
      },
      // #region Initialization
      '$contextMenu$1': null,
      '$InitializeInputModes$1': function() {
        // build an input mode and register for the various events
        // that could change the shortest path calculation
        var /*yworks.yfiles.ui.input.GraphEditorInputMode*/ editMode = new yworks.yfiles.ui.input.GraphEditorInputMode();
        // deletion
        editMode.addDeletedSelectionListener((function(/*yfiles.lang.Object*/ o, /*yworks.canvas.input.InputModeEventArgs*/ eventArgs) {
          this.$CalculateShortestPath$1();
        }).bind(this));
        // edge creation
        editMode.createEdgeInputMode.addEdgeCreatedListener((function(/*yfiles.lang.Object*/ sender, /*yworks.canvas.model.ItemEventArgs<yworks.yfiles.ui.model.IEdge>*/ args) {
          this.$CalculateShortestPath$1();
        }).bind(this));
        // movement of items
        editMode.moveInputMode.addDragFinishedListener((function(/*yfiles.lang.Object*/ sender, /*yworks.canvas.input.InputModeEventArgs*/ args) {
          this.$CalculateShortestPath$1();
        }).bind(this));
        // resizing of items
        editMode.handleInputMode.addDragFinishedListener((function(/*yfiles.lang.Object*/ sender, /*yworks.canvas.input.InputModeEventArgs*/ args) {
          this.$CalculateShortestPath$1();
        }).bind(this));
        // adding or changing labels
        editMode.addLabelAddedListener((function(/*yfiles.lang.Object*/ sender, /*yworks.canvas.model.ItemEventArgs<yworks.yfiles.ui.model.ILabel>*/ args) {
          this.$CalculateShortestPath$1();
        }).bind(this));
        editMode.addLabelTextChangedListener((function(/*yfiles.lang.Object*/ sender, /*yworks.canvas.model.ItemEventArgs<yworks.yfiles.ui.model.ILabel>*/ args) {
          this.$CalculateShortestPath$1();
        }).bind(this));

        // allow only numeric label texts
        //editMode.ValidateLabelText += EditModeOnValidateLabelText;

        // show weight tooltips
        editMode.toolTipItems = yworks.yfiles.ui.model.GraphItemTypes.EDGE;
        editMode.addQueryItemToolTipListener(yfiles.lang.delegate(this.$EditModeOnQueryItemToolTip$1, this));
        editMode.mouseHoverInputMode.toolTipLocationOffset = new yworks.canvas.geometry.structs.PointD(0, -20);

        this.graphControl.inputMode = editMode;
        this.$graphEditorInputMode$1 = editMode;

        this.$contextMenu$1 = new yfiles.demo.ContextMenu();
        this.$graphEditorInputMode$1.contextMenuInputMode.menu = this.$contextMenu$1;
        this.$contextMenu$1.install(this.graphControl.div);
        this.$contextMenu$1.addOpenedListener((function(/*yfiles.lang.Object*/ sender, /*yfiles.system.EventArgs*/ args) {
          var /*yfiles.system.componentmodel.CancelEventArgs*/ cancelEventArgs = new yfiles.system.componentmodel.CancelEventArgs();
          this.$graphEditorInputMode$1.contextMenuInputMode.menuOpening(cancelEventArgs);
          if (cancelEventArgs.cancel) {
            (/*(yfiles.demo.ContextMenu)*/sender).visible = false;
          }
        }).bind(this));
        this.$contextMenu$1.addClosedListener((function(/*yfiles.lang.Object*/ sender, /*yfiles.system.EventArgs*/ args) {
          this.$graphEditorInputMode$1.contextMenuInputMode.menuClosed();
        }).bind(this));
        this.$graphEditorInputMode$1.contextMenuInputMode.addCloseMenuListener((function(/*yfiles.lang.Object*/ o, /*yfiles.system.EventArgs*/ args) {
          this.$contextMenu$1.visible = false;
        }).bind(this));
        this.$RegisterContextMenuCallback$1();
      },
      '$OnPopulateItemContextMenu$1': function(/*yfiles.lang.Object*/ sender, /*yworks.canvas.input.PopulateItemContextMenuEventArgs<yworks.canvas.model.IModelItem>*/ e) {
        var /*yfiles.lang.Object*/ tmp = e.item;
        var /*yworks.yfiles.ui.model.INode*/ node = (yworks.yfiles.ui.model.INode.isInstance(tmp)) ? /*(yworks.yfiles.ui.model.INode)*/tmp : null;
        this.$UpdateSelection$1(node);

        if (this.graphControl.selection.selectedNodes.count > 0) {
          this.$contextMenu$1.createMenuItem("Mark as Source").addEventListener((function(/*Event*/ evt) {
            this.$MarkAsSource$1(yfiles.system.collections.EnumerableExtensions./*<yworks.yfiles.ui.model.INode>*/toList(this.graphControl.selection.selectedNodes));
          }).bind(this));
          this.$contextMenu$1.createMenuItem("Mark as Target").addEventListener((function(/*Event*/ evt) {
            this.$MarkAsTarget$1(yfiles.system.collections.EnumerableExtensions./*<yworks.yfiles.ui.model.INode>*/toList(this.graphControl.selection.selectedNodes));
          }).bind(this));
        }
      },
      '$UpdateSelection$1': function(/*yworks.yfiles.ui.model.INode*/ node) {
        if (node === null) {
          this.graphControl.selection.clear();
        } else {
          if (!this.graphControl.selection.selectedNodes.isSelected(node)) {
            this.graphControl.selection.clear();
            this.graphControl.selection.selectedNodes.setSelected(node, true);
            this.graphControl.currentItem = node;
          }
        }
      },
      // show the weight of the edge as a tooltip
      '$EditModeOnQueryItemToolTip$1': function(/*yfiles.lang.Object*/ sender, /*yworks.canvas.input.QueryItemToolTipEventArgs<yworks.canvas.model.IModelItem>*/ queryItemToolTipEventArgs) {
        var /*yfiles.lang.Object*/ tmp = queryItemToolTipEventArgs.item;
        var /*yworks.yfiles.ui.model.IEdge*/ edge = (yworks.yfiles.ui.model.IEdge.isInstance(tmp)) ? /*(yworks.yfiles.ui.model.IEdge)*/tmp : null;
        if (edge !== null) {
          queryItemToolTipEventArgs.toolTip = "Weight = " + this.$GetEdgeWeight$1(edge);
        }
      },
      '$InitializeStyles$1': function() {
        this.$defaultNodeStyle$1 = new yworks.yfiles.ui.drawing.ShinyPlateNodeStyle.WithColor(yworks.support.windows.Colors.darkOrange);
        this.$sourceNodeStyle$1 = new yworks.yfiles.ui.drawing.ShinyPlateNodeStyle.WithColor(yworks.support.windows.Colors.limeGreen);
        this.$targetNodeStyle$1 = new yworks.yfiles.ui.drawing.ShinyPlateNodeStyle.WithColor(yworks.support.windows.Colors.orangeRed);
        var /*yworks.canvas.drawing.headless.LinearGradientBrush*/ newInstance = new yworks.canvas.drawing.headless.LinearGradientBrush();
        {
          var /*yworks.canvas.drawing.headless.GradientStopCollection*/ newInstance1 = new yworks.canvas.drawing.headless.GradientStopCollection();
          {
            var /*yworks.canvas.drawing.headless.GradientStop*/ newInstance2 = new yworks.canvas.drawing.headless.GradientStop();
            {
              newInstance2.color = yworks.support.windows.Colors.green;
              newInstance2.offset = 0.49;
            }
            newInstance1.add(newInstance2);
            var /*yworks.canvas.drawing.headless.GradientStop*/ newInstance3 = new yworks.canvas.drawing.headless.GradientStop();
            {
              newInstance3.color = yworks.support.windows.Colors.red;
              newInstance3.offset = 0.51;
            }
            newInstance1.add(newInstance3);
          }
          newInstance.gradientStops = newInstance1;
          newInstance.spreadMethod = yworks.canvas.drawing.headless.GradientSpreadMethod.PAD;
        }
        this.$sourceAndTargetNodeStyle$1 = new yworks.yfiles.ui.drawing.ShinyPlateNodeStyle.WithBrush(newInstance);

        var /*yworks.yfiles.ui.drawing.PolylineEdgeStyle*/ newInstance4 = new yworks.yfiles.ui.drawing.PolylineEdgeStyle.WithPen(yworks.canvas.drawing.Pens.black);
        {
          newInstance4.targetArrow = this.$directed$1 ? yworks.yfiles.ui.drawing.DefaultArrow.DEFAULT : yworks.yfiles.ui.drawing.DefaultArrow.NONE;
        }
        this.$defaultEdgeStyle$1 = newInstance4;
        var /*yworks.yfiles.ui.drawing.PolylineEdgeStyle*/ newInstance5 = new yworks.yfiles.ui.drawing.PolylineEdgeStyle.WithPen(new yworks.support.windows.Pen.FromBrushAndThickness(yworks.support.windows.Brushes.red, 4.0));
        {
          newInstance5.targetArrow = this.$directed$1 ? yworks.yfiles.ui.drawing.DefaultArrow.DEFAULT : yworks.yfiles.ui.drawing.DefaultArrow.NONE;
        }
        this.$pathEdgeStyle$1 = newInstance5;
      },
      '$InitializeGraph$1': function() {
        this.graphControl.graph.nodeDefaults.style = this.$defaultNodeStyle$1;
        this.graphControl.graph.nodeDefaults.size = new yworks.canvas.geometry.structs.SizeD(30, 30);
        this.graphControl.graph.edgeDefaults.style = this.$defaultEdgeStyle$1;
        var /*yworks.yfiles.ui.drawing.SimpleLabelStyle*/ newInstance = new yworks.yfiles.ui.drawing.SimpleLabelStyle();
        {
          newInstance.backgroundBrush = yworks.support.windows.Brushes.white;
        }
        this.graphControl.graph.edgeDefaults.labels.style = newInstance;
      },
      '$OnLoaded$1': function(/*yfiles.lang.Object*/ sender, /*yfiles.system.EventArgs*/ e) {
        this.$GenerateGraph$1();
        this.$PopulateLayoutComboBox$1();
        this.$currentLayouter$1 = this.$layouts$1.get("Hierarchic");
        this.$ApplyLayout$1();
      },
      '$RegisterContextMenuCallback$1': function() {
        // Simple implementations with static context menus could just assign 
        // a static ContextMenu instance here

        // we use a more dynamic context menu here, however:
        this.$graphEditorInputMode$1.contextMenuItems = yworks.yfiles.ui.model.GraphItemTypes.NODE;
        this.$graphEditorInputMode$1.addPopulateItemContextMenuListener(yfiles.lang.delegate(this.$OnPopulateItemContextMenu$1, this));

      },
      // #endregion 
      // #region Menu Handlers
      '$DirectedComboBox_SelectedIndexChanged$1': function() {
        this.$directed$1 = yfiles.system.text.StringExtensions.stringEquals(this.directionComboBox.selectedItem, "Directed") ? true : false;
        this.$defaultEdgeStyle$1.targetArrow = this.$directed$1 ? yworks.yfiles.ui.drawing.DefaultArrow.DEFAULT : yworks.yfiles.ui.drawing.DefaultArrow.NONE;
        this.$pathEdgeStyle$1.targetArrow = this.$directed$1 ? yworks.yfiles.ui.drawing.DefaultArrow.DEFAULT : yworks.yfiles.ui.drawing.DefaultArrow.NONE;
        this.$CalculateShortestPath$1();
      },
      // #endregion 
      // #region Source and Target Node
      '$MarkAsSource$1': function(/*yfiles.system.collections.generic.List<yworks.yfiles.ui.model.INode>*/ nodes) {
        // Reset style of old source nodes
        var /*yfiles.util.IEnumerator*/ tmpEnumerator = this.$sourceNodes$1.getListEnumerator();
        while (tmpEnumerator.moveNext()) {
          var /*yworks.yfiles.ui.model.INode*/ sourceNode = tmpEnumerator.current;
          {
            if (this.graphControl.graph.contains(sourceNode)) {
              this.graphControl.graph.setNodeStyle(sourceNode, this.$defaultNodeStyle$1);
            }
          }
        }
        this.$sourceNodes$1 = nodes;

        this.$SetStyles$1();
        this.$CalculateShortestPath$1();
      },
      '$MarkAsTarget$1': function(/*yfiles.system.collections.generic.List<yworks.yfiles.ui.model.INode>*/ nodes) {
        // Reset style of old target nodes
        var /*yfiles.util.IEnumerator*/ tmpEnumerator = this.$targetNodes$1.getListEnumerator();
        while (tmpEnumerator.moveNext()) {
          var /*yworks.yfiles.ui.model.INode*/ targetNode = tmpEnumerator.current;
          {
            if (this.graphControl.graph.contains(targetNode)) {
              this.graphControl.graph.setNodeStyle(targetNode, this.$defaultNodeStyle$1);
            }
          }
        }
        this.$targetNodes$1 = nodes;

        this.$SetStyles$1();
        this.$CalculateShortestPath$1();
      },
      '$SetStyles$1': function() {
        // set target node styles
        var /*yfiles.util.IEnumerator*/ tmpEnumerator = this.$targetNodes$1.getListEnumerator();
        while (tmpEnumerator.moveNext()) {
          var /*yworks.yfiles.ui.model.INode*/ targetNode = tmpEnumerator.current;
          {
            this.graphControl.graph.setNodeStyle(targetNode, this.$targetNodeStyle$1);
          }
        }

        // set source node styles
        var /*yfiles.util.IEnumerator*/ tmpEnumerator1 = this.$sourceNodes$1.getListEnumerator();
        while (tmpEnumerator1.moveNext()) {
          var /*yworks.yfiles.ui.model.INode*/ sourceNode = tmpEnumerator1.current;
          {
            // check for nodes which are both - source and target
            if (this.$targetNodes$1.contains(sourceNode)) {
              this.graphControl.graph.setNodeStyle(sourceNode, this.$sourceAndTargetNodeStyle$1);
            } else {
              this.graphControl.graph.setNodeStyle(sourceNode, this.$sourceNodeStyle$1);
            }
          }
        }
      },
      // #endregion 
      // #region Layout
      '$PopulateLayoutComboBox$1': function() {
        this.$layouts$1.put("Hierarchic", new yworks.yfiles.layout.hierarchic.IncrementalHierarchicLayouter());
        var /*yworks.yfiles.layout.organic.SmartOrganicLayouter*/ newInstance = new yworks.yfiles.layout.organic.SmartOrganicLayouter();
        {
          newInstance.minimalNodeDistance = 40;
        }
        this.$layouts$1.put("Organic", newInstance);
        this.$layouts$1.put("Orthogonal", new yworks.yfiles.layout.orthogonal.OrthogonalLayouter());

        var /*yfiles.lang.String[]*/ items = yfiles.system.ArrayExtensions./*<yfiles.lang.String>*/createObjectArray(this.$layouts$1.count);
        this.$layouts$1.keys.copyToArrayAt(items, 0);
        yfiles.system.ArrayExtensions.sortTyped(yfiles.lang.String.$class, items);
        this.layoutComboBox.items = yfiles.system.collections.generic.List.fromArray(items);

        this.directionComboBox.items = yfiles.system.collections.generic.List.fromArray(["Directed", "Undirected"]);
      },
      '$layoutComboBox$1': null,
      'layoutComboBox': {
        '$meta': function() {
          return [yfiles.system.reflect.TypeAttribute(yfiles.demo.IComboBox.$class)];
        },
        'get': function() {
          return this.$layoutComboBox$1;
        },
        'set': function(/*yfiles.demo.IComboBox*/ value) {
          this.$layoutComboBox$1 = value;
        }
      },
      '$directionComboBox$1': null,
      'directionComboBox': {
        '$meta': function() {
          return [yfiles.system.reflect.TypeAttribute(yfiles.demo.IComboBox.$class)];
        },
        'get': function() {
          return this.$directionComboBox$1;
        },
        'set': function(/*yfiles.demo.IComboBox*/ value) {
          this.$directionComboBox$1 = value;
        }
      },
      '$ApplyLayout$1': function() {
        if (!this.$layouting$1 && this.$currentLayouter$1 !== null) {
          this.$layouting$1 = true;
          this.graphControl.morphLayout(this.$currentLayouter$1, yfiles.system.TimeSpan.fromSeconds(1), (function(/*yfiles.lang.Object*/ s, /*yfiles.system.EventArgs*/ args) {
            this.$layouting$1 = false;
            this.$CalculateShortestPath$1();
          }).bind(this));
        }
      },
      'layoutComboBox_SelectedIndexChanged': function() {
        var /*yfiles.lang.String*/ key = this.layoutComboBox.selectedItem;
        if (key !== null) {
          this.$currentLayouter$1 = this.$layouts$1.get(key);
        }
        this.$ApplyLayout$1();
      },
      // #endregion 
      // #region Graph Generation
      '$GenerateGraph$1': function() {
        this.graphControl.graph.clear();
        this.$randomGraphGenerator$1.generateGraphWithGraph(this.graphControl.graph);
        this.$ApplyLayout$1();
      },
      // #endregion 
      // #region Shortest Path Calculation
      '$CalculateShortestPath$1': function() {
        // reset old path edges
        var /*yfiles.util.IEnumerator*/ tmpEnumerator = this.$pathEdges$1.getEnumerator();
        while (tmpEnumerator.moveNext()) {
          var /*yworks.yfiles.ui.model.IEdge*/ edge = tmpEnumerator.current;
          {
            if (this.graphControl.graph.contains(edge)) {
              this.graphControl.graph.setEdgeStyle(edge, this.$defaultEdgeStyle$1);
            }
          }
        }
        this.$pathEdges$1.clear();

        // remove deleted nodes 
        var /*yworks.yfiles.ui.model.INode[]*/ arr;
        var /*int*/ i;
        for (i = 0, arr = this.$sourceNodes$1.toArray(); i < arr.length; i++) {
          var /*yworks.yfiles.ui.model.INode*/ sourceNode = arr[i];
          if (!this.graphControl.graph.contains(sourceNode)) {
            this.$sourceNodes$1.remove(sourceNode);
          }
        }
        var /*yworks.yfiles.ui.model.INode[]*/ arr1;
        var /*int*/ i1;
        for (i1 = 0, arr1 = this.$targetNodes$1.toArray(); i1 < arr1.length; i1++) {
          var /*yworks.yfiles.ui.model.INode*/ targetNode = arr1[i1];
          if (!this.graphControl.graph.contains(targetNode)) {
            this.$targetNodes$1.remove(targetNode);
          }
        }

        // alternative implementation for single source and target node
        if (this.$sourceNodes$1.count === 1 && this.$targetNodes$1.count === 1) {
          this.$CalculateShortestPathSingleSourceSingleSink$1(this.$sourceNodes$1.get(0), this.$targetNodes$1.get(0));
          return;
        }

        // create adapter
        var /*yworks.yfiles.ui.model.YGraphAdapter*/ adapter = new yworks.yfiles.ui.model.YGraphAdapter(this.graphControl.graph);

        // create node maps
        var /*yworks.yfiles.algorithms.INodeMap*/ resultMap = adapter.yGraph.createNodeMap();
        // node map which will provide the resulting edges
        var /*yworks.yfiles.algorithms.INodeMap*/ predecessorEdgeMap = adapter.yGraph.createNodeMap();

        // run algorithm for each source node 
        var /*yfiles.util.IEnumerator*/ tmpEnumerator1 = this.$sourceNodes$1.getListEnumerator();
        while (tmpEnumerator1.moveNext()) {
          var /*yworks.yfiles.ui.model.INode*/ sourceNode = tmpEnumerator1.current;
          {
            // run algorithm
            var /*yworks.yfiles.algorithms.IDataProvider*/ edgeWeightProvider = adapter.createDataProviderForDelegate(yworks.yfiles.ui.model.IEdge.$class, yfiles.lang.Number.$class, yfiles.lang.delegate(this.$GetEdgeWeight$1, this));
            yworks.yfiles.algorithms.ShortestPaths.singleSourceToMap(adapter.yGraph, adapter.getCopiedNode(sourceNode), this.$directed$1, edgeWeightProvider, resultMap, predecessorEdgeMap);
            // loop through target nodes to mark each path from the source node to a target node
            var /*yfiles.util.IEnumerator*/ tmpEnumerator2 = this.$targetNodes$1.getListEnumerator();
            while (tmpEnumerator2.moveNext()) {
              var /*yworks.yfiles.ui.model.INode*/ targetNode = tmpEnumerator2.current;
              {
                // get list of path edges from source to specific target node
                var /*yworks.yfiles.algorithms.EdgeList*/ edges = yworks.yfiles.algorithms.ShortestPaths.constructEdgePathToMap(adapter.getCopiedNode(sourceNode), adapter.getCopiedNode(targetNode), predecessorEdgeMap);
                // add edges to path edges set
                this.$pathEdges$1.unionWith(adapter.createEdgeEnumerable(edges));
              }
            }

          }
        }

        // mark path with path style
        this.$MarkShortestPath$1();

        this.graphControl.invalidate();
      },
      '$CalculateShortestPathSingleSourceSingleSink$1': function(/*yworks.yfiles.ui.model.INode*/ sourceNode, /*yworks.yfiles.ui.model.INode*/ targetNode) {
        // Check if graph contains source and target nodes
        if (sourceNode !== null && targetNode !== null && this.graphControl.graph.contains(sourceNode) && this.graphControl.graph.contains(targetNode)) {
          // create adapter
          var /*yworks.yfiles.ui.model.YGraphAdapter*/ adapter = new yworks.yfiles.ui.model.YGraphAdapter(this.graphControl.graph);
          // run algorithm
          var /*yworks.yfiles.algorithms.IDataProvider*/ edgeWeightProvider = adapter.createDataProviderForDelegate(yworks.yfiles.ui.model.IEdge.$class, yfiles.lang.Number.$class, yfiles.lang.delegate(this.$GetEdgeWeight$1, this));
          var /*yworks.yfiles.algorithms.EdgeList*/ resultsList = yworks.yfiles.algorithms.ShortestPaths.singleSourceSingleSinkWithCost(adapter.yGraph, adapter.getCopiedNode(sourceNode), adapter.getCopiedNode(targetNode), this.$directed$1, edgeWeightProvider);
          // add resulting edges to set
          this.$pathEdges$1.unionWith(adapter.createEdgeEnumerable(resultsList));

          // mark path with path style
          this.$MarkShortestPath$1();
        }
      },
      '$GetEdgeWeight$1': function(/*yworks.yfiles.ui.model.IEdge*/ edge) {
        // if edge has at least one label...
        if (edge.labels.count > 0) {
          // ..try to return it's value
          var /*double*/ edgeWeight = yfiles.system.Convert.stringToDouble(edge.labels.getItem(0).text);
          if (!yfiles.system.PrimitiveExtensions.isNaN(edgeWeight)) {
            return edgeWeight;
          }
        }

        // calculate geometric edge length
        var /*yworks.canvas.geometry.structs.PointD[]*/ edgePoints = yfiles.system.ArrayExtensions./*<yworks.canvas.geometry.structs.PointD>*/createObjectArray(edge.bends.count + 2);

        edgePoints[0] = edge.sourcePort.location.toPoint();
        edgePoints[edge.bends.count + 1] = edge.targetPort.location.toPoint();

        for (var /*int*/ i = 0; i < edge.bends.count; i++) {
          edgePoints[i + 1] = edge.bends.getItem(i).location.toPoint();
        }

        var /*double*/ totalEdgeLength = 0;
        for (var /*int*/ i = 0; i < edgePoints.length - 1; i++) {
          totalEdgeLength += edgePoints[i].distanceToPointD(edgePoints[i + 1].clone());
        }
        return totalEdgeLength;
      },
      '$MarkShortestPath$1': function() {
        var /*yfiles.util.IEnumerator*/ tmpEnumerator = this.$pathEdges$1.getEnumerator();
        while (tmpEnumerator.moveNext()) {
          var /*yworks.yfiles.ui.model.IEdge*/ edge = tmpEnumerator.current;
          {
            if (this.graphControl.graph.contains(edge)) {
              this.graphControl.graph.setEdgeStyle(edge, this.$pathEdgeStyle$1);
            }
          }
        }
      },
      // #endregion 
      'setLabelValues': function() {
        this.$CreatePopup$1();
      },
      '$CreatePopup$1': function() {
        var /*demo.yfiles.algorithms.shortestpath.ShortestPathDemo.LabelValueForm*/ popup = new demo.yfiles.algorithms.shortestpath.ShortestPathDemo.LabelValueForm(/*(HTMLDivElement)*/document.createElement("div"));
        this.graphControl.div.appendChild(popup.div);
        popup.addCanceledListener((function(/*yfiles.lang.Object*/ sender, /*yfiles.system.EventArgs*/ evt) {
          this.graphControl.div.removeChild(popup.div);
        }).bind(this));
        popup.addAcceptedListener((function(/*yfiles.lang.Object*/ sender, /*yfiles.system.EventArgs*/ e) {
          var /*yfiles.lang.String*/ i = popup.value;
          var /*yfiles.util.IEnumerator*/ tmpEnumerator = this.graphControl.graph.edges.getEnumerator();
          while (tmpEnumerator.moveNext()) {
            var /*yworks.yfiles.ui.model.IEdge*/ edge = tmpEnumerator.current;
            {
              if (edge.labels.count > 0) {
                this.graphControl.graph.setLabelText(edge.labels.getItem(0), i);
              } else {
                this.graphControl.graph.addLabel(edge, "" + i);
              }
            }
          }
          this.$CalculateShortestPath$1();
          this.graphControl.div.removeChild(popup.div);
        }).bind(this));
      },
      'deleteLabels': function() {
        var /*yworks.yfiles.ui.model.IEdge[]*/ arr;
        var /*int*/ i;
        for (i = 0, arr = yfiles.system.collections.EnumerableExtensions./*<yworks.yfiles.ui.model.IEdge>*/toArray(this.graphControl.graph.edges); i < arr.length; i++) {
          var /*yworks.yfiles.ui.model.IEdge*/ edge = arr[i];
          var /*yworks.yfiles.ui.model.ILabel[]*/ arr1;
          var /*int*/ i1;
          for (i1 = 0, arr1 = yfiles.system.collections.EnumerableExtensions./*<yworks.yfiles.ui.model.ILabel>*/toArray(edge.labels); i1 < arr1.length; i1++) {
            var /*yworks.yfiles.ui.model.ILabel*/ label = arr1[i1];
            this.graphControl.graph.removeLabel(label);
          }
        }
        this.$CalculateShortestPath$1();
      },
      '$graphControl$1': null,
      'graphControl': {
        '$meta': function() {
          return [yfiles.system.reflect.TypeAttribute(yworks.yfiles.ui.GraphControl.$class)];
        },
        'get': function() {
          return this.$graphControl$1;
        },
        'set': function(/*yworks.yfiles.ui.GraphControl*/ value) {
          this.$graphControl$1 = value;
        }
      },
      'graph': {
        '$meta': function() {
          return [yfiles.system.reflect.TypeAttribute(yworks.yfiles.ui.model.IGraph.$class)];
        },
        'get': function() {
          return this.graphControl.graph;
        }
      },
      // #region application action bindings
      'fitContent': function() {
        yworks.canvas.CanvasControl.FIT_CONTENT_COMMAND.executeOnTarget(null, this.graphControl);
      },
      'zoomIn': function() {
        yworks.support.windows.NavigationCommands.increaseZoom.executeOnTarget(null, this.graphControl);
      },
      'zoomOut': function() {
        yworks.support.windows.NavigationCommands.decreaseZoom.executeOnTarget(null, this.graphControl);
      },
      'zoomOriginal': function() {
        yworks.support.windows.NavigationCommands.zoom.executeOnTarget(1.0, this.graphControl);
      },
      // #endregion 
      '$$init$1': function() {
        this.$layouts$1 = new yfiles.system.collections.generic.Dictionary/*<yfiles.lang.String, yworks.yfiles.layout.ILayouter>*/();
        this.$pathEdges$1 = new yworks.support.HashSet/*<yworks.yfiles.ui.model.IEdge>*/();
      },
      '$static': {
        'LabelValueForm': new yfiles.ClassDefinition(function() {
          return {
            '$extends': yworks.canvas.drawing.headless.Control,
            'constructor': function(/*HTMLDivElement*/ popup) {
              yworks.canvas.drawing.headless.Control.FromDiv.call(this, popup);
              popup.style.setProperty("position", "absolute", "");
              popup.style.setProperty("background", "white", "");
              popup.style.setProperty("border-width", "3px", "");
              popup.style.setProperty("border-color", "red", "");
              popup.style.setProperty("border-style", "solid", "");
              popup.style.setProperty("left", "30px", "");
              popup.style.setProperty("top", "30px", "");
              popup.style.setProperty("font-family", "sans-serif", "");
              popup.style.setProperty("font-size", "10pt", "");
              popup.style.setProperty("padding", "5px", "");
              popup.appendChild(document.createTextNode("Enter Uniform Edge Weight:"));
              popup.appendChild(document.createElement("br"));

              this.$textArea$3 = /*(HTMLInputElement)*/document.createElement("input");
              this.$textArea$3.setAttribute("type", "text");
              this.$textArea$3.setAttribute("maxlength", "10");
              popup.appendChild(this.$textArea$3);
              popup.appendChild(document.createElement("br"));
              var /*Element*/ button = document.createElement("input");
              button.setAttribute("type", "button");
              button.setAttribute("value", "Apply");
              button.addEventListener("click", (function(/*Event*/ evt) {
                if (this.$accepted$3Event !== null) {
                  this.$accepted$3Event(this, new yfiles.system.EventArgs());
                }
              }).bind(this), false);
              popup.appendChild(button);
              var /*Element*/ cbutton = document.createElement("input");
              cbutton.setAttribute("type", "button");
              cbutton.setAttribute("value", "Cancel");
              cbutton.addEventListener("click", (function(/*Event*/ evt) {
                if (this.$canceled$3Event !== null) {
                  this.$canceled$3Event(this, new yfiles.system.EventArgs());
                }
              }).bind(this), false);

              popup.appendChild(cbutton);
              this.preventDefault = false;
              this.preventEventPropagation = true;
            },
            '$textArea$3': null,
            '$canceled$3Event': null,
            'addCanceledListener': function(/*system.EventHandler*/ $canceled$3Event) {
              this.$canceled$3Event = yfiles.lang.delegate.combine(this.$canceled$3Event, $canceled$3Event);
            },
            'removeCanceledListener': function(/*system.EventHandler*/ $canceled$3Event) {
              this.$canceled$3Event = yfiles.lang.delegate.remove(this.$canceled$3Event, $canceled$3Event);
            },
            '$accepted$3Event': null,
            'addAcceptedListener': function(/*system.EventHandler*/ $accepted$3Event) {
              this.$accepted$3Event = yfiles.lang.delegate.combine(this.$accepted$3Event, $accepted$3Event);
            },
            'removeAcceptedListener': function(/*system.EventHandler*/ $accepted$3Event) {
              this.$accepted$3Event = yfiles.lang.delegate.remove(this.$accepted$3Event, $accepted$3Event);
            },
            'value': {
              'get': function() {
                return this.$textArea$3.value;
              }
            }
          };
        })
      }
    };
  })


});});
