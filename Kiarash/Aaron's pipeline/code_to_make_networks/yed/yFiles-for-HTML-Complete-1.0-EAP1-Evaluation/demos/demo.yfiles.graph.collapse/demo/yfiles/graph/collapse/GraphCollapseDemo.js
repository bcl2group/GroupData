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
yfiles.module("demo.yfiles.graph.collapse", function(exports) {

  /**
   * A form that demonstrates the wrapping and decorating of {@link yworks.yfiles.ui.model.IGraph} instances.
   * This demo shows a collapsible tree structure. Subtrees can be collapsed or expanded by clicking on 
   * their root nodes.
   * @see yworks.yfiles.ui.model.FilteredGraphWrapper
   */
  /*public*/ exports.GraphCollapseDemo = new yfiles.ClassDefinition(function() {
    return {
      '$extends': yfiles.demo.Application,
      'constructor': function() {
        yfiles.demo.Application.call(this);
        this.$$init$1();
        window["collapsedemo"] = new yfiles.lang.Object();
        window["collapsedemo"]["backgroundconverter"] = new demo.yfiles.graph.collapse.BackgroundConverter();
        window["collapsedemo"]["iconconverter"] = new demo.yfiles.graph.collapse.IconConverter();
      },
      // list that stores collapsed nodes
      '$collapsedNodes$1': null,
      // graph that contains visible nodes
      '$filteredGraph$1': null,
      // graph containing all nodes
      '$fullGraph$1': null,
      '$leafNodeStyle$1': null,
      // currently selected layouter
      '$currentLayouter$1': null,
      // list of all layouters
      '$layouters$1': null,
      // mapper for mapping layouters to their string representation in the combobox
      '$layouterMapper$1': null,
      // the node that has just been toggled and should stay fixed.
      '$toggledNode$1': null,
      '$w$1': null,
      /**
       * Returns all available layouters.
       */
      'layouters': {
        '$meta': function() {
          return [yfiles.system.reflect.TypeAttribute(yfiles.system.collections.generic.List.$class)];
        },
        'get': function() {
          return this.$layouters$1;
        }
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
      '$layoutChooserBox$1': null,
      'layoutChooserBox': {
        '$meta': function() {
          return [yfiles.system.reflect.TypeAttribute(yfiles.demo.IComboBox.$class)];
        },
        'get': function() {
          return this.$layoutChooserBox$1;
        },
        'set': function(/*yfiles.demo.IComboBox*/ value) {
          this.$layoutChooserBox$1 = value;
        }
      },
      'registerCommands': function() {
        this.setProperty("FitContent", new yfiles.demo.ApplicationCommand(yworks.yfiles.ui.GraphControl.FIT_GRAPH_BOUNDS_COMMAND, this.graphControl));
        this.setProperty("ZoomIn", new yfiles.demo.ApplicationCommand(yworks.support.windows.NavigationCommands.increaseZoom, this.graphControl));
        this.setProperty("ZoomOut", new yfiles.demo.ApplicationCommand(yworks.support.windows.NavigationCommands.decreaseZoom, this.graphControl));
        var /*yfiles.demo.ApplicationCommand*/ newInstance = new yfiles.demo.ApplicationCommand(yworks.support.windows.NavigationCommands.zoom, this.graphControl);
        {
          newInstance.parameter = 1.0;
        }
        this.setProperty("ZoomOriginal", newInstance);
        this.setProperty("SelectLayout", new yfiles.demo.ActionCommand((function() {
          this.$layouterComboBox_SelectedIndexChanged$1(this.graphControl, null);
        }).bind(this)));
      },
      // #region Handling Expand/Collapse Clicks
      'toggleChildrenExecuted': function(/*yfiles.lang.Object*/ sender, /*yworks.support.windows.ExecutedRoutedEventArgs*/ e) {
        var /*yfiles.lang.Object*/ tmp;
        var /*yfiles.lang.Object*/ tmp1 = ((tmp = (e.parameter)) !== null ? tmp : this.graphControl.currentItem);
        var /*yworks.yfiles.ui.model.INode*/ node = (yworks.yfiles.ui.model.INode.isInstance(tmp1)) ? /*(yworks.yfiles.ui.model.INode)*/tmp1 : null;
        if (node !== null) {
          var /*boolean*/ canExpand = this.$filteredGraph$1.outDegree(node) !== this.$filteredGraph$1.fullGraph.outDegree(node);
          if (canExpand) {
            this.$Expand$1(node);
          } else {
            this.$Collapse$1(node);
          }
        }
      },
      '$Expand$1': function(/*yworks.yfiles.ui.model.INode*/ node) {
        if (this.$collapsedNodes$1.contains(node)) {
          this.$toggledNode$1 = node;
          this.$SetCollapsedTag$1(node, false);
          this.$AlignChildren$1(node);
          this.$collapsedNodes$1.remove(node);
          this.$filteredGraph$1.nodePredicateChanged();
          this.$RunLayout$1(false);
        }
      },
      '$Collapse$1': function(/*yworks.yfiles.ui.model.INode*/ node) {
        if (!this.$collapsedNodes$1.contains(node)) {
          this.$toggledNode$1 = node;
          this.$SetCollapsedTag$1(node, true);
          this.$collapsedNodes$1.add(node);
          this.$filteredGraph$1.nodePredicateChanged();
          this.$RunLayout$1(false);
        }
      },
      '$AlignChildren$1': function(/*yworks.yfiles.ui.model.INode*/ node) {
        // This method is used to set the initial positions of the children
        // of a node which gets expanded to the position of the expanded node.
        // This looks nicer in the following animated layout. Try commenting
        // out the method body to see the difference.
        var /*yworks.canvas.geometry.structs.PointD*/ center = node.layout.getRectangleCenter();
        var /*yfiles.util.IEnumerator*/ tmpEnumerator = this.$fullGraph$1.edgesAtOwner(node).getEnumerator();
        while (tmpEnumerator.moveNext()) {
          var /*yworks.yfiles.ui.model.IEdge*/ edge = tmpEnumerator.current;
          {
            if (edge.sourcePort.owner === node) {
              this.$fullGraph$1.clearBends(edge);
              var /*yworks.yfiles.ui.model.INode*/ child = /*(yworks.yfiles.ui.model.INode)*/edge.targetPort.owner;
              this.$fullGraph$1.setCenter(child, center.clone());
              this.$AlignChildren$1(child);
            }
          }
        }
      },
      '$SetCollapsedTag$1': function(/*yworks.yfiles.ui.model.INode*/ node, /*boolean*/ collapsed) {
        var /*yfiles.lang.Object*/ tmp = node.style;
        var /*yworks.yfiles.ui.drawing.TemplateNodeStyle*/ style = (tmp instanceof yworks.yfiles.ui.drawing.TemplateNodeStyle) ? /*(yworks.yfiles.ui.drawing.TemplateNodeStyle)*/tmp : null;
        if (style !== null) {
          style.styleTag = collapsed;
        }
      },
      // #endregion 
      '$BuildTree$1': function(/*yworks.yfiles.ui.model.IGraph*/ graph, /*int*/ children, /*int*/ levels, /*int*/ collapseLevel) {
        var /*yworks.yfiles.ui.model.INode*/ root = graph.createNodeAtLocation(new yworks.canvas.geometry.structs.PointD(20, 20));
        this.$SetCollapsedTag$1(root, false);
        this.$AddChildren$1(levels, graph, root, children, collapseLevel);
        this.graphControl.invalidate();
      },
      '$random$1': null,
      '$AddChildren$1': function(/*int*/ level, /*yworks.yfiles.ui.model.IGraph*/ graph, /*yworks.yfiles.ui.model.INode*/ root, /*int*/ childCount, /*int*/ collapseLevel) {
        var /*int*/ actualChildCount = this.$random$1.nextIntInRange(1, childCount + 1);
        for (var /*int*/ i = 0; i < actualChildCount; i++) {
          var /*yworks.yfiles.ui.model.INode*/ child = graph.createNodeAtLocation(new yworks.canvas.geometry.structs.PointD(20, 20));
          graph.createEdge(root, child);
          if (level < collapseLevel) {
            this.$collapsedNodes$1.add(child);
            this.$SetCollapsedTag$1(child, true);
          } else {
            this.$SetCollapsedTag$1(child, false);
          }
          if (level > 0) {
            this.$AddChildren$1(level - 1, graph, child, 4, 2);
          } else {
            graph.setNodeStyle(child, this.$leafNodeStyle$1);
          }
        }
      },
      '$EdgePredicate$1': function(/*yworks.yfiles.ui.model.IEdge*/ obj) {
        // return true for any edge
        return true;
      },
      '$NodePredicate$1': function(/*yworks.yfiles.ui.model.INode*/ node) {
        // return true if none of the parent nodes is collapsed
        var /*yfiles.util.IEnumerator*/ tmpEnumerator = this.$fullGraph$1.inEdgesAt(node).getEnumerator();
        while (tmpEnumerator.moveNext()) {
          var /*yworks.yfiles.ui.model.IEdge*/ edge = tmpEnumerator.current;
          {
            var /*yworks.yfiles.ui.model.INode*/ parent = /*(yworks.yfiles.ui.model.INode)*/edge.sourcePort.owner;
            return !this.$collapsedNodes$1.contains(parent) && this.$NodePredicate$1(parent);
          }
        }
        return true;
      },
      // #region Initialization
      'initialize': function() {
        this.graphControl.commandBindings.add(new yworks.support.windows.CommandBinding.WithCommandAndHandler(demo.yfiles.graph.collapse.GraphCollapseDemo.TOGGLE_CHILDREN_COMMAND, yfiles.lang.delegate(this.toggleChildrenExecuted, this)));
        // initialize the input mode
        this.initializeInputModes();

        // initialize the graph
        this.initializeGraph();
      },
      'initializeGraph': function() {
        // Create the graph instance that will hold the complete graph.
        this.$fullGraph$1 = new yworks.yfiles.ui.model.DefaultGraph();

        // Create a nice default style for the nodes
        this.$fullGraph$1.nodeDefaults.style = new yworks.yfiles.ui.drawing.TemplateNodeStyle.TemplateNodeStyle("InnerNodeStyleTemplate");
        this.$fullGraph$1.nodeDefaults.size = new yworks.canvas.geometry.structs.SizeD(60, 30);
        this.$fullGraph$1.nodeDefaults.shareStyleInstance = false;


        // and a style for the labels
        var /*yworks.yfiles.ui.drawing.SimpleLabelStyle*/ labelStyle = new yworks.yfiles.ui.drawing.SimpleLabelStyle();
        this.$fullGraph$1.nodeDefaults.labels.style = labelStyle;


        // now build a simple sample tree
        this.$BuildTree$1(this.$fullGraph$1, 3, 3, 3);

        // create a view of the graph that contains only non-collapsed subtrees.
        // use a predicate method to decide what nodes should be part of the graph.
        this.$filteredGraph$1 = new yworks.yfiles.ui.model.FilteredGraphWrapper(this.$fullGraph$1, yfiles.lang.delegate(this.$NodePredicate$1, this), yfiles.lang.delegate(this.$EdgePredicate$1, this));

        // add a mapper for the FocusNodeStage
        yworks.yfiles.ui.model.MapperRegistryExtensions.addMapperGetter(yworks.yfiles.ui.model.INode.$class, yfiles.lang.Boolean.$class, this.$filteredGraph$1.mapperRegistry, yworks.yfiles.layout.FixNodeLayoutStage.FIXED_NODE_DP_KEY, (function(/*yworks.yfiles.ui.model.INode*/ node) {
          return node === this.$toggledNode$1;
        }).bind(this));

        // display the filtered graph in our control.
        //      GraphControl.Graph = filteredGraph;
        this.graphControl.graph = this.$filteredGraph$1;

        // create layouters
        this.$SetupLayouters$1();
        // calculate and run the initial layout.
        this.$RunLayout$1(true);
      },
      'initializeInputModes': function() {
        // Create a multiplexing input mode and that uses a MoveViewportInputMode and add a 
        // wait input mode that will be used by the animator to block user input during 
        // animations automatically.
        var /*yworks.yfiles.ui.input.GraphViewerInputMode*/ graphViewerInputMode = new yworks.yfiles.ui.input.GraphViewerInputMode();
        graphViewerInputMode.selectableItems = yworks.yfiles.ui.model.GraphItemTypes.NONE;
        graphViewerInputMode.clickableItems = yworks.yfiles.ui.model.GraphItemTypes.NODE;
        graphViewerInputMode.addItemClickedListener((function(/*yfiles.lang.Object*/ sender, /*yworks.support.ItemInputEventArgs<yworks.canvas.model.IModelItem>*/ args) {
          if (yworks.yfiles.ui.model.INode.isInstance(args.item)) {
            // toggle the collapsed state of the clicked node
            demo.yfiles.graph.collapse.GraphCollapseDemo.TOGGLE_CHILDREN_COMMAND.executeOnTarget(args.item, this.graphControl);
          }
        }).bind(this));
        this.graphControl.inputMode = graphViewerInputMode;

        this.graphControl.selectionPaintManager.enabled = false;
        this.graphControl.focusPaintManager.enabled = false;
        this.graphControl.highlightPaintManager.enabled = false;
      },
      '$SetupLayouters$1': function() {
        // create TreeLayouter
        var /*yworks.yfiles.layout.tree.TreeLayouter*/ newInstance = new yworks.yfiles.layout.tree.TreeLayouter();
        {
          newInstance.comparator = new yworks.yfiles.layout.tree.XCoordComparator();
          newInstance.layoutOrientation = yworks.yfiles.layout.LayoutOrientation.LEFT_TO_RIGHT;
          newInstance.layoutStyle = yworks.yfiles.layout.tree.EdgeLayoutStyle.ORTHOGONAL;
        }
        var /*yworks.yfiles.layout.tree.TreeLayouter*/ treeLayouter = newInstance;
        treeLayouter.prependStage(new yworks.yfiles.layout.FixNodeLayoutStage());

        this.layoutChooserBox.items = yfiles.system.collections.generic.List.fromArray(["Tree", "Balloon", "Organic", "Generic Tree"]);

        // set it as initial value
        this.$currentLayouter$1 = treeLayouter;
        this.$layouters$1.add(treeLayouter);
        this.$layouterMapper$1.setItem("Tree", treeLayouter);

        // create BalloonLayouter
        var /*yworks.yfiles.layout.tree.BalloonLayouter*/ newInstance1 = new yworks.yfiles.layout.tree.BalloonLayouter();
        {
          newInstance1.fromSketchMode = true;
          newInstance1.compactnessFactor = 1.0;
          newInstance1.allowOverlaps = true;
        }
        var /*yworks.yfiles.layout.tree.BalloonLayouter*/ balloonLayouter = newInstance1;
        balloonLayouter.prependStage(new yworks.yfiles.layout.FixNodeLayoutStage());
        this.$layouters$1.add(balloonLayouter);
        this.$layouterMapper$1.setItem("Balloon", balloonLayouter);

        // create OrganicLayouter
        var /*yworks.yfiles.layout.organic.OrganicLayouter*/ newInstance2 = new yworks.yfiles.layout.organic.OrganicLayouter();
        {
          newInstance2.initialPlacement = yworks.yfiles.layout.organic.InitialPlacement.AS_IS;
        }
        var /*yworks.yfiles.layout.organic.OrganicLayouter*/ organicLayouter = newInstance2;
        organicLayouter.prependStage(new yworks.yfiles.layout.FixNodeLayoutStage());
        this.$layouters$1.add(organicLayouter);
        this.$layouterMapper$1.setItem("Organic", organicLayouter);

        // create GenericLayouter
        var /*yworks.yfiles.layout.tree.GenericTreeLayouter*/ genericTreeLayouter = new yworks.yfiles.layout.tree.GenericTreeLayouter();
        genericTreeLayouter.prependStage(new yworks.yfiles.layout.FixNodeLayoutStage());
        this.$layouters$1.add(genericTreeLayouter);
        this.$layouterMapper$1.setItem("Generic Tree", genericTreeLayouter);
      },
      // #endregion 
      // indicates whether a layout is currently in calculation
      '$runningLayout$1': false,
      '$RunLayout$1': function(/*boolean*/ animateViewport) {
        if (this.$currentLayouter$1 !== null && !this.$runningLayout$1) {
          this.$runningLayout$1 = true;
          var /*yworks.yfiles.ui.model.LayoutExecutor*/ newInstance = new yworks.yfiles.ui.model.LayoutExecutor.FromControlAndLayouter(this.graphControl, this.$currentLayouter$1);
          {
            newInstance.updateContentRect = true;
            newInstance.animateViewport = animateViewport;
            newInstance.duration = yfiles.system.TimeSpan.fromSeconds(0.3);
            newInstance.finishHandler = (function(/*yfiles.lang.Object*/ sender, /*yfiles.system.EventArgs*/ args) {
              this.$runningLayout$1 = false;
              this.$toggledNode$1 = null;
            }).bind(this);
          }
          newInstance.start();
        }
      },
      '$layouterComboBox_SelectedIndexChanged$1': function(/*yfiles.lang.Object*/ sender, /*yfiles.system.EventArgs*/ e) {
        this.$currentLayouter$1 = this.$layouterMapper$1.getItem(this.layoutChooserBox.selectedItem);
        this.$RunLayout$1(true);
      },
      'loaded': function() {
        this.$CreateTitle$1("Collapsible Tree Demo [yFiles for HTML]");
        this.initialize();
      },
      '$CreateTitle$1': function(/*yfiles.lang.String*/ title) {
        document.title = title;
      },
      '$$init$1': function() {
        this.$collapsedNodes$1 = new yfiles.system.collections.generic.List/*<yworks.yfiles.ui.model.INode>*/();
        this.$leafNodeStyle$1 = new yworks.yfiles.ui.drawing.TemplateNodeStyle.TemplateNodeStyle("LeafNodeStyleTemplate");
        this.$layouters$1 = new yfiles.system.collections.generic.List/*<yworks.yfiles.layout.ILayouter>*/();
        this.$layouterMapper$1 = new yworks.canvas.model.DictionaryMapper/*<yfiles.lang.String, yworks.yfiles.layout.ILayouter>*/();
        this.$w$1 = window;
        this.$random$1 = new yfiles.system.Random.WithSeed(666);
      },
      '$static': {
        'TOGGLE_CHILDREN_COMMAND': {
          '$meta': function() {
            return [yfiles.system.reflect.TypeAttribute(yworks.support.windows.RoutedCommand.$class)];
          },
          'value': null
        },
        '$clinit': function() {
          demo.yfiles.graph.collapse.GraphCollapseDemo.TOGGLE_CHILDREN_COMMAND = new yworks.support.windows.RoutedUICommand.FromNameTypeAndInputGestures("Toggle Children", "ToggleChildren", demo.yfiles.graph.collapse.GraphCollapseDemo.$class);
        }
      }
    };
  })


});});
