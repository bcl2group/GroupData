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

  /*public*/ exports.DragAndDropApplication = new yfiles.ClassDefinition(function() {
    return {
      '$extends': yfiles.demo.Application,
      'constructor': function() {
        yfiles.demo.Application.call(this);
      },
      '$nodeDropInputMode$1': null,
      '$graphControl$1': null,
      'graphControl': {
        'get': function() {
          return this.$graphControl$1;
        },
        'set': function(/*yworks.yfiles.ui.GraphControl*/ value) {
          this.$graphControl$1 = value;
        }
      },
      '$functionsBox$1': null,
      'functionsBox': {
        'get': function() {
          return this.$functionsBox$1;
        },
        'set': function(/*yfiles.demo.IComboBox*/ value) {
          this.$functionsBox$1 = value;
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
        this.setProperty("FunctionsChanged", new yfiles.demo.ActionCommand(yfiles.lang.delegate(this.$FunctionsBox_SelectedIndexChanged$1, this)));
      },
      '$FunctionsBox_SelectedIndexChanged$1': function() {
        var /*int*/ selectedIndex = this.functionsBox.selectedIndex;

        switch (selectedIndex) {
          case 0:
            this.$nodeDropInputMode$1.snappingEnabled = true;
            this.$nodeDropInputMode$1.showNodePreview = true;
            break;
          case 1:
            this.$nodeDropInputMode$1.snappingEnabled = false;
            this.$nodeDropInputMode$1.showNodePreview = true;
            break;
          case 2:
            this.$nodeDropInputMode$1.snappingEnabled = false;
            this.$nodeDropInputMode$1.showNodePreview = false;
            break;
        }
      },
      'loaded': function() {
        this.$EnableGrouping$1();

        // Create and configure a GraphSnapContext to enable snapping
        var /*yworks.yfiles.ui.input.GraphSnapContext*/ newInstance = new yworks.yfiles.ui.input.GraphSnapContext();
        {
          newInstance.nodeToNodeDistance = 30;
          newInstance.nodeToEdgeDistance = 20;
          newInstance.snapOrthogonalMovement = false;
          newInstance.snapDistance = 10;
          newInstance.snapSegmentsToSnapLines = true;
          newInstance.snapBendsToSnapLines = true;
          newInstance.gridSnapType = yworks.canvas.GridSnapType.ALL;
        }
        var /*yworks.yfiles.ui.input.GraphSnapContext*/ snapContext = newInstance;

        // Create and register a graph editor input mode for editing the graph
        // in the canvas.
        var /*yworks.yfiles.ui.input.GraphEditorInputMode*/ editorInputMode = new yworks.yfiles.ui.input.GraphEditorInputMode();
        editorInputMode.snapContext = snapContext;
        editorInputMode.orthogonalEdgeEditingContext = new yworks.yfiles.ui.input.OrthogonalEdgeEditingContext();

        // Obtain an input mode for handling dropped nodes for the GraphEditorInputMode.
        this.$nodeDropInputMode$1 = editorInputMode.nodeDropInputMode;
        // by default the mode available in GraphEditorInputMode is disabled, so first enable it
        this.$nodeDropInputMode$1.enabled = true;
        // we want nodes that have a PanelNodeStyle assigned to be created as group nodes.
        this.$nodeDropInputMode$1.isGroupNodePredicate = (function(/*yworks.yfiles.ui.model.INode*/ draggedNode) {
          return draggedNode.style instanceof yworks.yfiles.ui.drawing.PanelNodeStyle;
        }).bind(this);
        this.$nodeDropInputMode$1.showNodePreview = true;

        // use the mode in our control
        this.graphControl.inputModes.add(editorInputMode);
      },
      '$EnableGrouping$1': function() {
        var /*yworks.yfiles.ui.model.DefaultGraph*/ defaultGraph = this.graphControl.graph.lookup(yworks.yfiles.ui.model.DefaultGraph.$class);
        if (defaultGraph !== null) {
          defaultGraph.groupingSupported = true;
          defaultGraph.undoEngineEnabled = true;
        } else {
          new yworks.yfiles.ui.model.GroupedGraph.ForGraph(this.graphControl.graph);
        }
      }
    };
  })


});});
