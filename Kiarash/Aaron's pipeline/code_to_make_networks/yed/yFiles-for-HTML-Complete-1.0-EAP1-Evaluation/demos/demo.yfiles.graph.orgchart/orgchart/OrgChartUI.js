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
yfiles.module("orgchart", function(exports) {

  /*public*/ exports.OrgChartUI = new yfiles.ClassDefinition(function() {
    return {
      'constructor': function() {
        this.$hiddenNodesSet$0 = new yworks.support.HashSet/*<yworks.yfiles.ui.model.INode>*/();
        this.$CreateControl$0();
        this.$registerElementDefaults$0();

        // The orgchart.orgchartbinding object stores the converters that 
        // are used for template bindings to svg template attributes
        var /*Object*/ orgchartBinding = new yfiles.lang.Object();
        var /*Object*/ ns = window["orgchart"];
        ns["orgchartbinding"] = orgchartBinding;
        orgchartBinding["backgroundconverter"] = new orgchart.support.BackgroundConverter();
        orgchartBinding["overviewconverter"] = new orgchart.support.OverviewNameConverter();
      },
      '$graphControl$0': null,
      '$overviewControl$0': null,
      '$CreateControl$0': function() {
        this.$graphControl$0 = new yworks.yfiles.ui.GraphControl();

        var /*yworks.yfiles.ui.input.GraphViewerInputMode*/ newInstance = new yworks.yfiles.ui.input.GraphViewerInputMode();
        {
          newInstance.clickableItems = yworks.yfiles.ui.model.GraphItemTypes.NODE;
          newInstance.selectableItems = yworks.yfiles.ui.model.GraphItemTypes.NONE;
          newInstance.marqueeSelectableItems = yworks.yfiles.ui.model.GraphItemTypes.NONE;
          newInstance.toolTipItems = yworks.yfiles.ui.model.GraphItemTypes.NONE;
          newInstance.contextMenuItems = yworks.yfiles.ui.model.GraphItemTypes.NONE;
          newInstance.focusableItems = yworks.yfiles.ui.model.GraphItemTypes.NODE;
        }
        var /*yworks.yfiles.ui.input.GraphViewerInputMode*/ graphViewerInputMode = newInstance;
        graphViewerInputMode.addItemDoubleClickedListener(yfiles.lang.delegate(this.$OnItemDoubleClicked$0, this));
        this.$graphControl$0.inputMode = graphViewerInputMode;

        // Rely on Dojo resize callback to manually fire SizeChanged events 
        // for better responsiveness than the timer-based approach
        this.$graphControl$0.sizeChangedTimerEnabled = false;
        this.$graphControl$0.focusPaintManager.showFocusPolicy = yworks.canvas.model.ShowFocusPolicy.ALWAYS;

        // register command bindings
        this.$graphControl$0.commandBindings.add(new yworks.support.windows.CommandBinding(orgchart.OrgChartUI.HIDE_CHILDREN_COMMAND, yfiles.lang.delegate(this.$HideChildrenExecuted$0, this), yfiles.lang.delegate(this.$CanExecuteHideChildren$0, this)));
        this.$graphControl$0.commandBindings.add(new yworks.support.windows.CommandBinding(orgchart.OrgChartUI.SHOW_CHILDREN_COMMAND, yfiles.lang.delegate(this.showChildrenExecuted, this), yfiles.lang.delegate(this.canExecuteShowChildren, this)));
        this.$graphControl$0.commandBindings.add(new yworks.support.windows.CommandBinding(orgchart.OrgChartUI.HIDE_PARENT_COMMAND, yfiles.lang.delegate(this.$HideParentExecuted$0, this), yfiles.lang.delegate(this.$CanExecuteHideParent$0, this)));
        this.$graphControl$0.commandBindings.add(new yworks.support.windows.CommandBinding(orgchart.OrgChartUI.SHOW_PARENT_COMMAND, yfiles.lang.delegate(this.$ShowParentExecuted$0, this), yfiles.lang.delegate(this.$CanExecuteShowParent$0, this)));
        this.$graphControl$0.commandBindings.add(new yworks.support.windows.CommandBinding(orgchart.OrgChartUI.SHOW_ALL_COMMAND, yfiles.lang.delegate(this.$ShowAllExecuted$0, this), yfiles.lang.delegate(this.$CanExecuteShowAll$0, this)));

        this.graphControl.selectionPaintManager.enabled = false;
        this.graphControl.focusPaintManager.enabled = false;
        this.graphControl.highlightPaintManager.enabled = false;

        this.$overviewControl$0 = new yworks.yfiles.ui.GraphOverviewControl.ForMaster(this.$graphControl$0);
      },
      '$OnItemDoubleClicked$0': function(/*yfiles.lang.Object*/ sender, /*yworks.support.ItemInputEventArgs<yworks.canvas.model.IModelItem>*/ e) {
        this.$ZoomToCurrentItem$0();
      },
      '$registerElementDefaults$0': function() {
        var /*yworks.yfiles.ui.model.IGraph*/ graph = this.graphControl.graph;
        graph.nodeDefaults.style = new orgchart.styles.LevelOfDetailNodeStyle(new yworks.yfiles.ui.drawing.TemplateNodeStyle.TemplateNodeStyle("detailNodeStyleTemplate"), new yworks.yfiles.ui.drawing.TemplateNodeStyle.TemplateNodeStyle("intermediateNodeStyleTemplate"), new yworks.yfiles.ui.drawing.TemplateNodeStyle.TemplateNodeStyle("overviewNodeStyleTemplate"));
        graph.nodeDefaults.size = new yworks.canvas.geometry.structs.SizeD(250, 100);
        var /*yworks.yfiles.ui.drawing.PolylineEdgeStyle*/ newInstance = new yworks.yfiles.ui.drawing.PolylineEdgeStyle();
        {
          newInstance.pen = new yworks.support.windows.Pen.FromBrushAndThickness(yworks.support.windows.Brushes.darkBlue, 2);
          newInstance.targetArrow = yworks.yfiles.ui.drawing.DefaultArrow.NONE;
        }
        graph.edgeDefaults.style = newInstance;
      },
      'graphControl': {
        'get': function() {
          return this.$graphControl$0;
        }
      },
      'overviewControl': {
        'get': function() {
          return this.$overviewControl$0;
        }
      },
      'graph': {
        'get': function() {
          return this.graphControl.graph;
        }
      },
      'fitContent': function() {
        yworks.canvas.CanvasControl.FIT_CONTENT_COMMAND.executeOnTarget(null, this.graphControl);
      },
      'zoomOriginal': function() {
        yworks.support.windows.NavigationCommands.zoom.executeOnTarget(1.0, this.graphControl);
      },
      'zoomToCurrent': function() {
        this.$ZoomToCurrentItem$0();
      },
      'zoomIn': function() {
        yworks.support.windows.NavigationCommands.increaseZoom.executeOnTarget(null, this.graphControl);
      },
      'zoomOut': function() {
        yworks.support.windows.NavigationCommands.decreaseZoom.executeOnTarget(null, this.graphControl);
      },
      'hideParent': function() {
        orgchart.OrgChartUI.HIDE_PARENT_COMMAND.executeOnTarget(this.graphControl.currentItem, this.graphControl);
      },
      'showParent': function() {
        orgchart.OrgChartUI.SHOW_PARENT_COMMAND.executeOnTarget(this.graphControl.currentItem, this.graphControl);
      },
      'hideChildren': function() {
        orgchart.OrgChartUI.HIDE_CHILDREN_COMMAND.executeOnTarget(this.graphControl.currentItem, this.graphControl);
      },
      'showChildren': function() {
        orgchart.OrgChartUI.SHOW_CHILDREN_COMMAND.executeOnTarget(this.graphControl.currentItem, this.graphControl);
      },
      'showAll': function() {
        orgchart.OrgChartUI.SHOW_ALL_COMMAND.executeOnTarget(null, this.graphControl);
      },
      'selectAndCenterNode': function(/*yworks.yfiles.ui.model.INode*/ node) {
        this.graphControl.currentItem = node;
        this.$ZoomToCurrentItem$0();
        this.graphControl.focus();
      },
      'selectAndZoomToNode': function(/*yworks.yfiles.ui.model.INode*/ node) {
        this.graphControl.currentItem = node;
        this.$ZoomToCurrentItem$0();
        this.graphControl.focus();
      },
      'createGraph': function(/*orgchart.stubs.Employee*/ root) {
        this.$registerElementDefaults$0();

        this.$filteredGraphWrapper$0 = new yworks.yfiles.ui.model.FilteredGraphWrapper(this.graphControl.graph, yfiles.lang.delegate(this.$ShouldShowNode$0, this), (function(/*yworks.yfiles.ui.model.IEdge*/ e) {
          return true;
        }).bind(this));
        this.graphControl.graph = this.$filteredGraphWrapper$0;
        this.$filteredGraphWrapper$0.clear();

        orgchart.GraphBuilder.create(this.$filteredGraphWrapper$0, root);

        this.doLayout();

        this.graphControl.fitGraphBounds();
        this.$LimitViewport$0();
      },
      '$LimitViewport$0': function() {
        this.graphControl.updateContentRect();
        var /*yworks.canvas.ViewportLimiter*/ limiter = this.graphControl.viewportLimiter;
        limiter.honorBothDimensions = false;
        limiter.bounds = this.graphControl.contentRect.getEnlarged(100);
      },
      '$ShouldShowNode$0': function(/*yworks.yfiles.ui.model.INode*/ obj) {
        return !this.$hiddenNodesSet$0.contains(obj);
      },
      '$hiddenNodesSet$0': null,
      '$filteredGraphWrapper$0': null,
      '$doingLayout$0': false,
      // #region Tree Layout Configuration and initial execution
      'doLayout': function() {
        var /*yworks.yfiles.ui.model.IGraph*/ tree = this.$graphControl$0.graph;

        this.$ConfigureLayout$0(tree);
        new orgchart.BendDuplicatorStage.WithCore(new yworks.yfiles.layout.tree.GenericTreeLayouter()).doLayout(tree);
        this.$CleanUp$0(tree);
      },
      '$ConfigureLayout$0': function(/*yworks.yfiles.ui.model.IGraph*/ tree) {
        var /*yworks.yfiles.ui.model.IMapperRegistry*/ registry = tree.mapperRegistry;

        var /*yworks.canvas.model.DictionaryMapper<yworks.yfiles.ui.model.INode, yworks.yfiles.layout.tree.INodePlacer>*/ nodePlacerMapper = yworks.yfiles.ui.model.MapperRegistryExtensions.addDictionaryMapper(yworks.yfiles.ui.model.INode.$class, yworks.yfiles.layout.tree.INodePlacer.$class, registry, yworks.yfiles.layout.tree.GenericTreeLayouter.NODE_PLACER_DP_KEY);
        var /*yworks.canvas.model.DictionaryMapper<yworks.yfiles.ui.model.INode, yfiles.lang.Boolean>*/ assistantMapper = yworks.yfiles.ui.model.MapperRegistryExtensions.addDictionaryMapper(yworks.yfiles.ui.model.INode.$class, yfiles.lang.Boolean.$class, registry, yworks.yfiles.layout.tree.AssistantPlacer.ASSISTANT_DP_KEY);

        var /*yfiles.util.IEnumerator*/ tmpEnumerator = tree.nodes.getEnumerator();
        while (tmpEnumerator.moveNext()) {
          var /*yworks.yfiles.ui.model.INode*/ node = tmpEnumerator.current;
          {
            if (tree.inDegree(node) === 0) {
              this.$SetNodePlacers$0(node, nodePlacerMapper, assistantMapper, tree);
            }
          }
        }
      },
      '$SetNodePlacers$0': function(/*yworks.yfiles.ui.model.INode*/ rootNode, /*yworks.canvas.model.IMapper<yworks.yfiles.ui.model.INode, yworks.yfiles.layout.tree.INodePlacer>*/ nodePlacerMapper, /*yworks.canvas.model.IMapper<yworks.yfiles.ui.model.INode, yfiles.lang.Boolean>*/ assistantMapper, /*yworks.yfiles.ui.model.IGraph*/ tree) {
        var /*orgchart.stubs.Employee*/ employee = /*(orgchart.stubs.Employee)*/rootNode.tag;
        if (employee !== null) {
          var /*yfiles.lang.String*/ layout = employee.layout;
          var /*yworks.yfiles.layout.tree.DefaultNodePlacer*/ newInstance = new yworks.yfiles.layout.tree.DefaultNodePlacer.WithAlignmentAndDistance(yworks.yfiles.layout.tree.ChildPlacement.VERTICAL_TO_RIGHT, yworks.yfiles.layout.tree.RootAlignment.LEADING_ON_BUS, 30, 30);
          {
            newInstance.routingStyle = yworks.yfiles.layout.tree.RoutingStyle.FORK_AT_ROOT;
          }
          var /*yworks.yfiles.layout.tree.DefaultNodePlacer*/ newInstance1 = new yworks.yfiles.layout.tree.DefaultNodePlacer.WithAlignmentAndDistance(yworks.yfiles.layout.tree.ChildPlacement.VERTICAL_TO_LEFT, yworks.yfiles.layout.tree.RootAlignment.LEADING_ON_BUS, 30, 30);
          {
            newInstance1.routingStyle = yworks.yfiles.layout.tree.RoutingStyle.FORK_AT_ROOT;
          }
          var /*yworks.yfiles.layout.tree.LeftRightPlacer*/ newInstance2 = new yworks.yfiles.layout.tree.LeftRightPlacer();
          {
            newInstance2.placeLastOnBottom = false;
          }
          switch (layout) {
            case "rightHanging":
              nodePlacerMapper.setItem(rootNode, newInstance);
              break;
            case "leftHanging":
              nodePlacerMapper.setItem(rootNode, newInstance1);
              break;
            case "bothHanging":
              nodePlacerMapper.setItem(rootNode, newInstance2);
              break;
            default:
              nodePlacerMapper.setItem(rootNode, new yworks.yfiles.layout.tree.DefaultNodePlacer.WithAlignmentAndDistance(yworks.yfiles.layout.tree.ChildPlacement.HORIZONTAL_DOWNWARD, yworks.yfiles.layout.tree.RootAlignment.MEDIAN, 30, 30));
              break;
          }

          var /*boolean*/ assistant = employee.assistant;
          if (assistant && tree.inDegree(rootNode) > 0) {
            var /*yworks.yfiles.ui.model.IEdge*/ inEdge = tree.inEdgesAt(rootNode).getItem(0);
            var /*yworks.yfiles.ui.model.INode*/ parent = inEdge.getSourceNode();
            var /*yworks.yfiles.layout.tree.INodePlacer*/ oldParentPlacer = nodePlacerMapper.getItem(parent);
            var /*yworks.yfiles.layout.tree.AssistantPlacer*/ assistantPlacer = new yworks.yfiles.layout.tree.AssistantPlacer();
            assistantPlacer.childNodePlacer = oldParentPlacer;
            nodePlacerMapper.setItem(parent, assistantPlacer);
            assistantMapper.setItem(rootNode, true);
          }
        }

        var /*yfiles.util.IEnumerator*/ tmpEnumerator = tree.outEdgesAt(rootNode).getEnumerator();
        while (tmpEnumerator.moveNext()) {
          var /*yworks.yfiles.ui.model.IEdge*/ outEdge = tmpEnumerator.current;
          {
            var /*yworks.yfiles.ui.model.INode*/ child = /*(yworks.yfiles.ui.model.INode)*/outEdge.targetPort.owner;
            this.$SetNodePlacers$0(child, nodePlacerMapper, assistantMapper, tree);
          }
        }
      },
      '$CleanUp$0': function(/*yworks.yfiles.ui.model.IGraph*/ graph) {
        var /*yworks.yfiles.ui.model.IMapperRegistry*/ registry = graph.mapperRegistry;
        registry.removeMapper(yworks.yfiles.layout.tree.AssistantPlacer.ASSISTANT_DP_KEY);
        registry.removeMapper(yworks.yfiles.layout.tree.GenericTreeLayouter.NODE_PLACER_DP_KEY);
      },
      // #endregion 
      // #region Commands and command bindings
      // #endregion 
      // #region Command Binding Helper methods
      'canExecuteShowChildren': function(/*yfiles.lang.Object*/ sender, /*yworks.support.windows.CanExecuteRoutedEventArgs*/ e) {
        var /*yfiles.lang.Object*/ tmp;
        var /*yfiles.lang.Object*/ tmp1 = ((tmp = (e.parameter)) !== null ? tmp : this.$graphControl$0.currentItem);
        var /*yworks.yfiles.ui.model.INode*/ node = (yworks.yfiles.ui.model.INode.isInstance(tmp1)) ? /*(yworks.yfiles.ui.model.INode)*/tmp1 : null;
        if (node !== null && !this.$doingLayout$0 && this.$filteredGraphWrapper$0 !== null) {
          e.canExecute = this.$filteredGraphWrapper$0.outDegree(node) !== this.$filteredGraphWrapper$0.fullGraph.outDegree(node);
        } else {
          e.canExecute = false;
        }
        e.handled = true;
      },
      'showChildrenExecuted': function(/*yfiles.lang.Object*/ sender, /*yworks.support.windows.ExecutedRoutedEventArgs*/ e) {
        var /*yfiles.lang.Object*/ tmp;
        var /*yfiles.lang.Object*/ tmp1 = ((tmp = (e.parameter)) !== null ? tmp : this.$graphControl$0.currentItem);
        var /*yworks.yfiles.ui.model.INode*/ node = (yworks.yfiles.ui.model.INode.isInstance(tmp1)) ? /*(yworks.yfiles.ui.model.INode)*/tmp1 : null;
        if (node !== null && !this.$doingLayout$0) {
          var /*int*/ count = this.$hiddenNodesSet$0.count;
          var /*yfiles.util.IEnumerator*/ tmpEnumerator = this.$filteredGraphWrapper$0.fullGraph.outEdgesAt(node).getEnumerator();
          while (tmpEnumerator.moveNext()) {
            var /*yworks.yfiles.ui.model.IEdge*/ childEdge = tmpEnumerator.current;
            {
              var /*yworks.yfiles.ui.model.INode*/ child = childEdge.getTargetNode();
              if (this.$hiddenNodesSet$0.remove(child)) {
                this.$filteredGraphWrapper$0.fullGraph.setCenter(child, node.layout.getRectangleCenter());
                this.$filteredGraphWrapper$0.fullGraph.clearBends(childEdge);
              }
            }
          }
          this.$RefreshLayout$0(count, node);
        }
      },
      '$CanExecuteShowParent$0': function(/*yfiles.lang.Object*/ sender, /*yworks.support.windows.CanExecuteRoutedEventArgs*/ e) {
        var /*yfiles.lang.Object*/ tmp;
        var /*yfiles.lang.Object*/ tmp1 = ((tmp = (e.parameter)) !== null ? tmp : this.$graphControl$0.currentItem);
        var /*yworks.yfiles.ui.model.INode*/ node = (yworks.yfiles.ui.model.INode.isInstance(tmp1)) ? /*(yworks.yfiles.ui.model.INode)*/tmp1 : null;
        if (node !== null && !this.$doingLayout$0 && this.$filteredGraphWrapper$0 !== null) {
          e.canExecute = this.$filteredGraphWrapper$0.inDegree(node) === 0 && this.$filteredGraphWrapper$0.fullGraph.inDegree(node) > 0;
        } else {
          e.canExecute = false;
        }
        e.handled = true;
      },
      '$ShowParentExecuted$0': function(/*yfiles.lang.Object*/ sender, /*yworks.support.windows.ExecutedRoutedEventArgs*/ e) {
        var /*yfiles.lang.Object*/ tmp;
        var /*yfiles.lang.Object*/ tmp1 = ((tmp = (e.parameter)) !== null ? tmp : this.$graphControl$0.currentItem);
        var /*yworks.yfiles.ui.model.INode*/ node = (yworks.yfiles.ui.model.INode.isInstance(tmp1)) ? /*(yworks.yfiles.ui.model.INode)*/tmp1 : null;
        if (node !== null && !this.$doingLayout$0) {
          var /*int*/ count = this.$hiddenNodesSet$0.count;
          var /*yfiles.util.IEnumerator*/ tmpEnumerator = this.$filteredGraphWrapper$0.fullGraph.inEdgesAt(node).getEnumerator();
          while (tmpEnumerator.moveNext()) {
            var /*yworks.yfiles.ui.model.IEdge*/ parentEdge = tmpEnumerator.current;
            {
              var /*yworks.yfiles.ui.model.INode*/ parent = parentEdge.getSourceNode();
              if (this.$hiddenNodesSet$0.remove(parent)) {
                this.$filteredGraphWrapper$0.fullGraph.setCenter(parent, node.layout.getRectangleCenter());
                this.$filteredGraphWrapper$0.fullGraph.clearBends(parentEdge);
              }
            }
          }
          this.$RefreshLayout$0(count, node);
        }
      },
      '$CanExecuteHideParent$0': function(/*yfiles.lang.Object*/ sender, /*yworks.support.windows.CanExecuteRoutedEventArgs*/ e) {
        var /*yfiles.lang.Object*/ tmp;
        var /*yfiles.lang.Object*/ tmp1 = ((tmp = (e.parameter)) !== null ? tmp : this.$graphControl$0.currentItem);
        var /*yworks.yfiles.ui.model.INode*/ node = (yworks.yfiles.ui.model.INode.isInstance(tmp1)) ? /*(yworks.yfiles.ui.model.INode)*/tmp1 : null;
        if (node !== null && !this.$doingLayout$0 && this.$filteredGraphWrapper$0 !== null) {
          e.canExecute = this.$filteredGraphWrapper$0.inDegree(node) > 0;
        } else {
          e.canExecute = false;
        }
        e.handled = true;
      },
      '$HideParentExecuted$0': function(/*yfiles.lang.Object*/ sender, /*yworks.support.windows.ExecutedRoutedEventArgs*/ e) {
        var /*yfiles.lang.Object*/ tmp;
        var /*yfiles.lang.Object*/ tmp1 = ((tmp = (e.parameter)) !== null ? tmp : this.$graphControl$0.currentItem);
        var /*yworks.yfiles.ui.model.INode*/ node = (yworks.yfiles.ui.model.INode.isInstance(tmp1)) ? /*(yworks.yfiles.ui.model.INode)*/tmp1 : null;
        if (node !== null && !this.$doingLayout$0) {
          var /*int*/ count = this.$hiddenNodesSet$0.count;

          var /*yfiles.util.IEnumerator*/ tmpEnumerator = this.$filteredGraphWrapper$0.fullGraph.nodes.getEnumerator();
          while (tmpEnumerator.moveNext()) {
            var /*yworks.yfiles.ui.model.INode*/ testNode = tmpEnumerator.current;
            {
              if (testNode !== node && this.$filteredGraphWrapper$0.contains(testNode) && this.$filteredGraphWrapper$0.inDegree(testNode) === 0) {
                // this is a root node - remove it and all children unless 
                this.$HideAllExcept$0(testNode, node);
              }
            }
          }
          this.$RefreshLayout$0(count, node);
        }
      },
      '$CanExecuteHideChildren$0': function(/*yfiles.lang.Object*/ sender, /*yworks.support.windows.CanExecuteRoutedEventArgs*/ e) {
        var /*yfiles.lang.Object*/ tmp;
        var /*yfiles.lang.Object*/ tmp1 = ((tmp = (e.parameter)) !== null ? tmp : this.$graphControl$0.currentItem);
        var /*yworks.yfiles.ui.model.INode*/ node = (yworks.yfiles.ui.model.INode.isInstance(tmp1)) ? /*(yworks.yfiles.ui.model.INode)*/tmp1 : null;
        if (node !== null && !this.$doingLayout$0 && this.$filteredGraphWrapper$0 !== null) {
          e.canExecute = this.$filteredGraphWrapper$0.outDegree(node) > 0;
        } else {
          e.canExecute = false;
        }
        e.handled = true;
      },
      '$HideChildrenExecuted$0': function(/*yfiles.lang.Object*/ sender, /*yworks.support.windows.ExecutedRoutedEventArgs*/ e) {
        var /*yfiles.lang.Object*/ tmp;
        var /*yfiles.lang.Object*/ tmp1 = ((tmp = (e.parameter)) !== null ? tmp : this.$graphControl$0.currentItem);
        var /*yworks.yfiles.ui.model.INode*/ node = (yworks.yfiles.ui.model.INode.isInstance(tmp1)) ? /*(yworks.yfiles.ui.model.INode)*/tmp1 : null;
        if (node !== null && !this.$doingLayout$0) {
          var /*int*/ count = this.$hiddenNodesSet$0.count;
          var /*yfiles.util.IEnumerator*/ tmpEnumerator = this.$filteredGraphWrapper$0.outEdgesAt(node).getEnumerator();
          while (tmpEnumerator.moveNext()) {
            var /*yworks.yfiles.ui.model.IEdge*/ child = tmpEnumerator.current;
            {
              this.$HideAllExcept$0(/*(yworks.yfiles.ui.model.INode)*/child.targetPort.owner, node);
            }
          }
          this.$RefreshLayout$0(count, node);
        }
      },
      '$CanExecuteShowAll$0': function(/*yfiles.lang.Object*/ sender, /*yworks.support.windows.CanExecuteRoutedEventArgs*/ e) {
        e.canExecute = this.$filteredGraphWrapper$0 !== null && this.$hiddenNodesSet$0.count !== 0 && !this.$doingLayout$0;
        e.handled = true;
      },
      '$ShowAllExecuted$0': function(/*yfiles.lang.Object*/ sender, /*yworks.support.windows.ExecutedRoutedEventArgs*/ e) {
        if (!this.$doingLayout$0) {
          this.$hiddenNodesSet$0.clear();
          var /*yfiles.lang.Object*/ tmp = this.$graphControl$0.currentItem;
          this.$RefreshLayout$0(-1, (yworks.yfiles.ui.model.INode.isInstance(tmp)) ? /*(yworks.yfiles.ui.model.INode)*/tmp : null);
        }
      },
      '$RefreshLayout$0': function(/*int*/ count, /*yworks.yfiles.ui.model.INode*/ centerNode) {
        if (this.$doingLayout$0) {
          return;
        }
        this.$doingLayout$0 = true;
        if (count !== this.$hiddenNodesSet$0.count) {
          // tell our filter to refresh the graph
          this.$filteredGraphWrapper$0.nodePredicateChanged();
          // the commands CanExecute state might have changed - suggest a requery.
          yworks.support.windows.CommandManager.invalidateRequerySuggested();

          // now layout the graph in animated fashion
          var /*yworks.yfiles.ui.model.IGraph*/ tree = this.$graphControl$0.graph;
          // we mark a node as the center node
          yworks.yfiles.ui.model.MapperRegistryExtensions.addMapperGetter(yworks.yfiles.ui.model.INode.$class, yfiles.lang.Boolean.$class, this.$graphControl$0.graph.mapperRegistry, "CenterNode", (function(/*yworks.yfiles.ui.model.INode*/ node) {
            return node === centerNode;
          }).bind(this));

          // configure the tree layout
          this.$ConfigureLayout$0(tree);

          // create the layouter (with a stage that fixes the center node in the coordinate system
          var /*orgchart.BendDuplicatorStage*/ layouter = new orgchart.BendDuplicatorStage.WithCore(new orgchart.FixNodeLocationStage(new yworks.yfiles.layout.tree.GenericTreeLayouter()));

          // configure a LayoutExecutor
          var /*yworks.yfiles.ui.model.LayoutExecutor*/ newInstance = new yworks.yfiles.ui.model.LayoutExecutor.FromControlAndLayouter(this.$graphControl$0, layouter);
          {
            newInstance.animateViewport = centerNode === null;
            newInstance.easedAnimation = true;
            newInstance.runInThread = true;
            newInstance.updateContentRect = true;
            newInstance.duration = yfiles.system.TimeSpan.fromMilliseconds(500);
          }
          var /*yworks.yfiles.ui.model.LayoutExecutor*/ executor = newInstance;
          executor.start();
          // add hook for cleanup
          executor.finishHandler = (function(/*yfiles.lang.Object*/ sender, /*yfiles.system.EventArgs*/ e) {
            this.$graphControl$0.graph.mapperRegistry.removeMapper("CenterNode");
            this.$CleanUp$0(tree);
            this.$doingLayout$0 = false;
            this.$LimitViewport$0();
          }).bind(this);
        }
      },
      // #endregion 
      '$HideAllExcept$0': function(/*yworks.yfiles.ui.model.INode*/ nodeToHide, /*yworks.yfiles.ui.model.INode*/ exceptNode) {
        this.$hiddenNodesSet$0.add(nodeToHide);
        var /*yfiles.util.IEnumerator*/ tmpEnumerator = this.$filteredGraphWrapper$0.fullGraph.outEdgesAt(nodeToHide).getEnumerator();
        while (tmpEnumerator.moveNext()) {
          var /*yworks.yfiles.ui.model.IEdge*/ edge = tmpEnumerator.current;
          {
            var /*yworks.yfiles.ui.model.INode*/ child = /*(yworks.yfiles.ui.model.INode)*/edge.targetPort.owner;
            if (exceptNode !== child) {
              this.$HideAllExcept$0(child, exceptNode);
            }
          }
        }
      },
      '$ZoomToCurrentItem$0': function() {
        var /*yfiles.lang.Object*/ tmp = this.graphControl.currentItem;
        var /*yworks.yfiles.ui.model.INode*/ currentItem = (yworks.yfiles.ui.model.INode.isInstance(tmp)) ? /*(yworks.yfiles.ui.model.INode)*/tmp : null;
        // visible current item
        if (this.graphControl.graph.contains(currentItem)) {
          yworks.yfiles.ui.GraphControl.ZOOM_TO_CURRENT_ITEM_COMMAND.executeOnTarget(null, this.graphControl);
        } else {
          // see if it can be made visible
          if (this.$filteredGraphWrapper$0.fullGraph.nodes.contains(currentItem)) {
            // uhide all nodes...
            this.$hiddenNodesSet$0.clear();
            // except the node to be displayed and all its descendants
            var /*yfiles.util.IEnumerator*/ tmpEnumerator = this.$filteredGraphWrapper$0.fullGraph.nodes.getEnumerator();
            while (tmpEnumerator.moveNext()) {
              var /*yworks.yfiles.ui.model.INode*/ testNode = tmpEnumerator.current;
              {
                if (testNode !== currentItem && this.$filteredGraphWrapper$0.fullGraph.inDegree(testNode) === 0) {
                  this.$HideAllExcept$0(testNode, currentItem);
                }
              }
            }
            // reset the layout to make the animation nicer
            var /*yfiles.util.IEnumerator*/ tmpEnumerator1 = this.$filteredGraphWrapper$0.nodes.getEnumerator();
            while (tmpEnumerator1.moveNext()) {
              var /*yworks.yfiles.ui.model.INode*/ n = tmpEnumerator1.current;
              {
                this.$filteredGraphWrapper$0.setCenter(n, yworks.canvas.geometry.structs.PointD.origin);
              }
            }
            var /*yfiles.util.IEnumerator*/ tmpEnumerator2 = this.$filteredGraphWrapper$0.edges.getEnumerator();
            while (tmpEnumerator2.moveNext()) {
              var /*yworks.yfiles.ui.model.IEdge*/ edge = tmpEnumerator2.current;
              {
                this.$filteredGraphWrapper$0.clearBends(edge);
              }
            }
            this.$RefreshLayout$0(-1, null);
          }
        }
      },
      '$static': {
        'SHOW_PARENT_COMMAND': null,
        'HIDE_PARENT_COMMAND': null,
        'SHOW_CHILDREN_COMMAND': null,
        'HIDE_CHILDREN_COMMAND': null,
        'SHOW_ALL_COMMAND': null,
        'getRootNode': function(/*yworks.yfiles.ui.model.IGraph*/ graph) {
          var /*yfiles.util.IEnumerator*/ tmpEnumerator = graph.nodes.getEnumerator();
          while (tmpEnumerator.moveNext()) {
            var /*yworks.yfiles.ui.model.INode*/ node = tmpEnumerator.current;
            {
              if (graph.inDegree(node) === 0) {
                return node;
              }
            }
          }
          return null;
        },
        '$clinit': function() {
          orgchart.OrgChartUI.SHOW_PARENT_COMMAND = new yworks.support.windows.RoutedUICommand.FromNameTypeAndInputGestures("Show Parent", "ShowParent", orgchart.OrgChartUI.$class);
          orgchart.OrgChartUI.HIDE_PARENT_COMMAND = new yworks.support.windows.RoutedUICommand.FromNameTypeAndInputGestures("Hide Parent", "HideParent", orgchart.OrgChartUI.$class);
          orgchart.OrgChartUI.SHOW_CHILDREN_COMMAND = new yworks.support.windows.RoutedUICommand.FromNameTypeAndInputGestures("Show Children", "ShowChildren", orgchart.OrgChartUI.$class);
          orgchart.OrgChartUI.HIDE_CHILDREN_COMMAND = new yworks.support.windows.RoutedUICommand.FromNameTypeAndInputGestures("Hide Children", "HideChildren", orgchart.OrgChartUI.$class);
          orgchart.OrgChartUI.SHOW_ALL_COMMAND = new yworks.support.windows.RoutedUICommand.FromNameTypeAndInputGestures("Show All", "ShowAll", orgchart.OrgChartUI.$class);
        }
      }
    };
  })


});});
