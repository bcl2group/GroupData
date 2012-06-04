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
yfiles.module("demo.yfiles.graph.simplecustomstyle", function(exports) {

  /*public*/ exports.SimpleCustomStyleDemo = new yfiles.ClassDefinition(function() {
    return {
      '$extends': yfiles.demo.Application,
      'constructor': function() {
        yfiles.demo.Application.call(this);
        this.$$init$1();
      },
      'initializeGraph': function() {
        var /*yworks.yfiles.ui.model.IGraph*/ graph = this.graphControl.graph;

        // Create a new style and use it as default port style
        graph.nodeDefaults.ports.style = new demo.yfiles.graph.simplecustomstyle.MySimplePortStyle();

        // Create a new style and use it as default node style
        graph.nodeDefaults.style = new demo.yfiles.graph.simplecustomstyle.MySimpleNodeStyle();
        // Create a new style and use it as default edge style
        graph.edgeDefaults.style = new demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle();
        // Create a new style and use it as default label style
        graph.nodeDefaults.labels.style = new demo.yfiles.graph.simplecustomstyle.MySimpleLabelStyle();
        graph.nodeDefaults.labels.labelModelParameter = yworks.yfiles.ui.labelmodels.ExteriorLabelModel.NORTH;
        graph.edgeDefaults.labels.style = new demo.yfiles.graph.simplecustomstyle.MySimpleLabelStyle();

        graph.nodeDefaults.size = new yworks.canvas.geometry.structs.SizeD(50, 50);

        // Create some graph elements with the above defined styles.
        this.$CreateSampleGraph$1();
      },
      // #region Initialization
      'initialize': function() {
        // initialize the graph
        this.initializeGraph();

        // initialize the input mode
        this.graphControl.inputMode = this.createEditorMode();

        this.graphControl.fitGraphBounds();
      },
      'createEditorMode': function() {
        var /*yworks.yfiles.ui.input.GraphEditorInputMode*/ newInstance = new yworks.yfiles.ui.input.GraphEditorInputMode();
        {
          newInstance.labelEditingAllowed = true;
        }
        var /*yworks.yfiles.ui.input.GraphEditorInputMode*/ mode = newInstance;
        return mode;
      },
      // #endregion 
      // #region Graph creation
      '$CreateSampleGraph$1': function() {
        var /*yworks.yfiles.ui.model.IGraph*/ graph = this.graphControl.graph;
        var /*yworks.yfiles.ui.model.INode*/ n0 = graph.createNodeAtLocationAndTag(new yworks.canvas.geometry.structs.PointD(291, 433), yworks.canvas.drawing.headless.Color.fromArgb(0xFF, 0x6C, 0x00, 0xFF));
        var /*yworks.yfiles.ui.model.INode*/ n1 = graph.createNodeAtLocationAndTag(new yworks.canvas.geometry.structs.PointD(396.80134541264516, 398.62305898749059), yworks.canvas.drawing.headless.Color.fromArgb(0xFF, 0xD2, 0xFF, 0x00));
        var /*yworks.yfiles.ui.model.INode*/ n2 = graph.createNodeAtLocationAndTag(new yworks.canvas.geometry.structs.PointD(462.19017293312766, 308.62305898749054), yworks.canvas.drawing.headless.Color.fromArgb(0xFF, 0x00, 0x48, 0xFF));
        var /*yworks.yfiles.ui.model.INode*/ n3 = graph.createNodeAtLocationAndTag(new yworks.canvas.geometry.structs.PointD(462.19017293312766, 197.37694101250946), yworks.canvas.drawing.headless.Color.fromArgb(0xFF, 0xFF, 0x00, 0x54));
        var /*yworks.yfiles.ui.model.INode*/ n4 = graph.createNodeAtLocationAndTag(new yworks.canvas.geometry.structs.PointD(396.80134541264522, 107.37694101250952), yworks.canvas.drawing.headless.Color.fromArgb(0xFF, 0xFF, 0x1E, 0x00));
        var /*yworks.yfiles.ui.model.INode*/ n5 = graph.createNodeAtLocationAndTag(new yworks.canvas.geometry.structs.PointD(291, 73), yworks.canvas.drawing.headless.Color.fromArgb(0xFF, 0x00, 0x2A, 0xFF));
        var /*yworks.yfiles.ui.model.INode*/ n6 = graph.createNodeAtLocationAndTag(new yworks.canvas.geometry.structs.PointD(185.19865458735484, 107.37694101250941), yworks.canvas.drawing.headless.Color.fromArgb(0xFF, 0x72, 0xFF, 0x00));
        var /*yworks.yfiles.ui.model.INode*/ n7 = graph.createNodeAtLocationAndTag(new yworks.canvas.geometry.structs.PointD(119.80982706687237, 197.37694101250941), yworks.canvas.drawing.headless.Color.fromArgb(0xFF, 0xD8, 0x00, 0xFF));
        var /*yworks.yfiles.ui.model.INode*/ n8 = graph.createNodeAtLocationAndTag(new yworks.canvas.geometry.structs.PointD(119.80982706687234, 308.62305898749048), yworks.canvas.drawing.headless.Color.fromArgb(0xFF, 0x24, 0xFF, 0x00));
        var /*yworks.yfiles.ui.model.INode*/ n9 = graph.createNodeAtLocationAndTag(new yworks.canvas.geometry.structs.PointD(185.19865458735478, 398.62305898749048), yworks.canvas.drawing.headless.Color.fromArgb(0xFF, 0xD8, 0x00, 0xFF));

        var /*yworks.yfiles.ui.labelmodels.ExteriorLabelModel*/ newInstance = new yworks.yfiles.ui.labelmodels.ExteriorLabelModel();
        {
          newInstance.insets = new yworks.canvas.geometry.structs.InsetsD(15);
        }
        var /*yworks.yfiles.ui.labelmodels.ExteriorLabelModel*/ labelModel = newInstance;
        graph.addLabelWithParameter(n0, labelModel.createParameter(yworks.yfiles.ui.labelmodels.ExteriorLabelModel.Position.SOUTH), "Node 0");
        graph.addLabelWithParameter(n1, labelModel.createParameter(yworks.yfiles.ui.labelmodels.ExteriorLabelModel.Position.SOUTH_EAST), "Node 1");
        graph.addLabelWithParameter(n2, labelModel.createParameter(yworks.yfiles.ui.labelmodels.ExteriorLabelModel.Position.EAST), "Node 2");
        graph.addLabelWithParameter(n3, labelModel.createParameter(yworks.yfiles.ui.labelmodels.ExteriorLabelModel.Position.EAST), "Node 3");
        graph.addLabelWithParameter(n4, labelModel.createParameter(yworks.yfiles.ui.labelmodels.ExteriorLabelModel.Position.NORTH_EAST), "Node 4");
        graph.addLabelWithParameter(n5, labelModel.createParameter(yworks.yfiles.ui.labelmodels.ExteriorLabelModel.Position.NORTH), "Node 5");
        graph.addLabelWithParameter(n6, labelModel.createParameter(yworks.yfiles.ui.labelmodels.ExteriorLabelModel.Position.NORTH_WEST), "Node 6");
        graph.addLabelWithParameter(n7, labelModel.createParameter(yworks.yfiles.ui.labelmodels.ExteriorLabelModel.Position.WEST), "Node 7");
        graph.addLabelWithParameter(n8, labelModel.createParameter(yworks.yfiles.ui.labelmodels.ExteriorLabelModel.Position.WEST), "Node 8");
        graph.addLabelWithParameter(n9, labelModel.createParameter(yworks.yfiles.ui.labelmodels.ExteriorLabelModel.Position.SOUTH_WEST), "Node 9");

        graph.createEdge(n0, n4);
        graph.createEdge(n6, n0);
        graph.createEdge(n6, n5);
        graph.createEdge(n5, n2);
        graph.createEdge(n3, n7);
        graph.createEdge(n9, n4);
      },
      // #endregion 
      '$graphControl$1': null,
      'graphControl': {
        'get': function() {
          return this.$graphControl$1;
        },
        'set': function(/*yworks.yfiles.ui.GraphControl*/ value) {
          this.$graphControl$1 = value;
        }
      },
      'loaded': function() {
        this.$CreateTitle$1("Simple Custom Styles Demo [yFiles for HTML]");
        this.initialize();
      },
      '$CreateTitle$1': function(/*yfiles.lang.String*/ title) {
        document.title = title;
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
        this.setProperty("ModifyColors", new yfiles.demo.ActionCommand(yfiles.lang.delegate(this.modifyColors, this)));
      },
      '$random$1': null,
      'modifyColors': function() {
        // modify the tag
        var /*yfiles.util.IEnumerator*/ tmpEnumerator = this.graphControl.selection.selectedNodes.getEnumerator();
        while (tmpEnumerator.moveNext()) {
          var /*yworks.yfiles.ui.model.INode*/ node = tmpEnumerator.current;
          {
            node.tag = yworks.canvas.drawing.ImageSupport.fromHSB(this.$random$1.nextDouble(), 1, 1, 1);
          }
        }
        // and invalidate the view as the graph cannot know that we changed the styles
        this.graphControl.invalidate();
      },
      '$$init$1': function() {
        this.$random$1 = new yfiles.system.Random();
      }
    };
  })


});});
