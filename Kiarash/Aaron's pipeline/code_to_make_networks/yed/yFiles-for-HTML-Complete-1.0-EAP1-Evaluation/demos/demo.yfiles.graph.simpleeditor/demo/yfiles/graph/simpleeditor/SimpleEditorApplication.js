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
yfiles.module("demo.yfiles.graph.simpleeditor", function(exports) {

  /**
   * Simple demo that hosts a {@link demo.yfiles.graph.simpleeditor.SimpleEditorApplication#getGraphControl}
   * which enables graph editing via the default {@link yworks.yfiles.ui.input.GraphEditorInputMode} 
   * input mode for editing graphs.
   * This demo also supports grouped graphs, i.e., selected nodes can be grouped 
   * in so-called group nodes using CTRL-G, and again be ungrouped using CTRL-U. 
   * To move sets of nodes into and out of group nodes using the mouse, hold down 
   * the SHIFT key while dragging.
   * <p>
   * Apart from graph editing, the demo demonstrates various basic features that are already
   * present on <code>GraphControl</code> (either as predefined commands or as simple method calls), e.g.
   * load/save/export.
   * </p>
   * <p>
   * In addition to the <code>GraphControl</code> itself, the demo also shows how to use the <code>GraphOverviewControl</code>.
   * </p>
   */
  /*public*/ exports.SimpleEditorApplication = new yfiles.ClassDefinition(function() {
    return {
      '$extends': yfiles.demo.Application,
      'constructor': function() {
        yfiles.demo.Application.call(this);
        this.$$init$1();
      },
      // #region application
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
      '$overviewControl$1': null,
      'overviewControl': {
        '$meta': function() {
          return [yfiles.system.reflect.TypeAttribute(yworks.yfiles.ui.GraphOverviewControl.$class)];
        },
        'get': function() {
          return this.$overviewControl$1;
        },
        'set': function(/*yworks.yfiles.ui.GraphOverviewControl*/ value) {
          this.$overviewControl$1 = value;
        }
      },
      '$orthogonalEditingButton$1': null,
      'orthogonalEditingButton': {
        '$meta': function() {
          return [yfiles.system.reflect.TypeAttribute(yfiles.demo.IToggleButton.$class)];
        },
        'get': function() {
          return this.$orthogonalEditingButton$1;
        },
        'set': function(/*yfiles.demo.IToggleButton*/ value) {
          this.$orthogonalEditingButton$1 = value;
        }
      },
      '$snappingButton$1': null,
      'snappingButton': {
        '$meta': function() {
          return [yfiles.system.reflect.TypeAttribute(yfiles.demo.IToggleButton.$class)];
        },
        'get': function() {
          return this.$snappingButton$1;
        },
        'set': function(/*yfiles.demo.IToggleButton*/ value) {
          this.$snappingButton$1 = value;
        }
      },
      '$enterGroupButton$1': null,
      'enterGroupButton': {
        '$meta': function() {
          return [yfiles.system.reflect.TypeAttribute(yfiles.demo.IButton.$class)];
        },
        'get': function() {
          return this.$enterGroupButton$1;
        },
        'set': function(/*yfiles.demo.IButton*/ value) {
          this.$enterGroupButton$1 = value;
        }
      },
      '$exitGroupButton$1': null,
      'exitGroupButton': {
        '$meta': function() {
          return [yfiles.system.reflect.TypeAttribute(yfiles.demo.IButton.$class)];
        },
        'get': function() {
          return this.$exitGroupButton$1;
        },
        'set': function(/*yfiles.demo.IButton*/ value) {
          this.$exitGroupButton$1 = value;
        }
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
      'registerCommands': function() {
        this.setProperty("New", new yfiles.demo.ActionCommand(yfiles.lang.delegate(this.$NewButton_Click$1, this)));
        this.setProperty("Open", new yfiles.demo.ActionCommand(yfiles.lang.delegate(this.$OpenButtonClick$1, this)));
        this.setProperty("Save", new yfiles.demo.ActionCommand(yfiles.lang.delegate(this.$SaveButtonClick$1, this)));
        this.setProperty("Print", new yfiles.demo.ActionCommand((function() {
          alert("Command not implemented");
        }).bind(this)));

        this.setProperty("FitContent", new yfiles.demo.ApplicationCommand(yworks.yfiles.ui.GraphControl.FIT_GRAPH_BOUNDS_COMMAND, this.graphControl));
        this.setProperty("ZoomIn", new yfiles.demo.ApplicationCommand(yworks.support.windows.NavigationCommands.increaseZoom, this.graphControl));
        this.setProperty("ZoomOut", new yfiles.demo.ApplicationCommand(yworks.support.windows.NavigationCommands.decreaseZoom, this.graphControl));
        var /*yfiles.demo.ApplicationCommand*/ newInstance = new yfiles.demo.ApplicationCommand(yworks.support.windows.NavigationCommands.zoom, this.graphControl);
        {
          newInstance.parameter = 1.0;
        }
        this.setProperty("ZoomOriginal", newInstance);

        this.setProperty("Cut", new yfiles.demo.ApplicationCommand(yworks.support.windows.ApplicationCommands.cut, this.graphControl));
        this.setProperty("Copy", new yfiles.demo.ApplicationCommand(yworks.support.windows.ApplicationCommands.copy, this.graphControl));
        this.setProperty("Paste", new yfiles.demo.ApplicationCommand(yworks.support.windows.ApplicationCommands.paste, this.graphControl));
        this.setProperty("Delete", new yfiles.demo.ApplicationCommand(yworks.support.windows.ApplicationCommands.del, this.graphControl));

        this.setProperty("Undo", new yfiles.demo.ApplicationCommand(yworks.support.windows.ApplicationCommands.undo, this.graphControl));
        this.setProperty("Redo", new yfiles.demo.ApplicationCommand(yworks.support.windows.ApplicationCommands.redo, this.graphControl));

        this.setProperty("GroupSelection", new yfiles.demo.ApplicationCommand(yworks.yfiles.ui.input.GraphCommands.GROUP_SELECTION_COMMAND, this.graphControl));
        this.setProperty("UngroupSelection", new yfiles.demo.ApplicationCommand(yworks.yfiles.ui.input.GraphCommands.UNGROUP_SELECTION_COMMAND, this.graphControl));
        this.setProperty("EnterGroup", new yfiles.demo.ApplicationCommand(yworks.yfiles.ui.input.GraphCommands.ENTER_GROUP_COMMAND, this.graphControl));
        this.setProperty("ExitGroup", new yfiles.demo.ApplicationCommand(yworks.yfiles.ui.input.GraphCommands.EXIT_GROUP_COMMAND, this.graphControl));

        this.setProperty("ToggleSnapping", new yfiles.demo.ActionCommand(yfiles.lang.delegate(this.$SnappingButton_Click$1, this)));
        this.setProperty("ToggleOrthogonalEditing", new yfiles.demo.ActionCommand(yfiles.lang.delegate(this.$OrthogonalEditingButton_Click$1, this)));

        this.setProperty("LayoutCommand", new yfiles.demo.ActionCommand(yfiles.lang.delegate(this.$ApplyLayout$1, this)));
        this.setProperty("LayoutSelectionChanged", new yfiles.demo.ActionCommand(yfiles.lang.delegate(this.layoutComboBox_SelectedIndexChanged, this)));
      },
      'loaded': function() {
        this.setTitle("Simple Editor [yFiles for HTML]");

        (/*(yfiles.demo.IButton)*/this.getProperty("printButton")).enabled = false;

        this.$InitializeFileOperations$1();
        this.initializeGraph();
        this.$InitialzeLayoutAlgorithms$1();
        this.$InitializeGrid$1();
        this.initializeSnapContext();
        this.initializeInputModes();
        this.graphControl.fitGraphBounds();

        this.overviewControl.graphControl = this.graphControl;
      },
      // #endregion 
      '$snapContext$1': null,
      //    private GridVisualCreator grid;
      '$gridInfo$1': null,
      '$InitializeGrid$1': function() {},
      'initializeSnapContext': function() {
        var /*yworks.yfiles.ui.input.GraphSnapContext*/ newInstance = new yworks.yfiles.ui.input.GraphSnapContext();
        {
          newInstance.enabled = false;
          newInstance.gridSnapType = yworks.canvas.GridSnapType.NONE;
          newInstance.nodeGridConstraintProvider = new yworks.canvas.input.SimpleGridConstraintProvider/*<yworks.yfiles.ui.model.INode>*/.FromGridInfo(this.$gridInfo$1);
          newInstance.bendGridConstraintProvider = new yworks.canvas.input.SimpleGridConstraintProvider/*<yworks.yfiles.ui.model.IBend>*/.FromGridInfo(this.$gridInfo$1);
          newInstance.portGridConstraintProvider = new yworks.canvas.input.SimpleGridConstraintProvider/*<yworks.yfiles.ui.model.IPort>*/.FromGridInfo(this.$gridInfo$1);
        }
        this.$snapContext$1 = newInstance;
      },
      'initializeInputModes': function() {
        this.graphControl.inputMode = this.createEditorMode();
      },
      'createEditorMode': function() {
        var /*yworks.yfiles.ui.input.GraphEditorInputMode*/ newInstance = new yworks.yfiles.ui.input.GraphEditorInputMode();
        {
          newInstance.snapContext = this.$snapContext$1;
          var /*yworks.yfiles.ui.input.OrthogonalEdgeEditingContext*/ newInstance1 = new yworks.yfiles.ui.input.OrthogonalEdgeEditingContext();
          {
            newInstance1.orthogonalEdgeEditing = false;
          }
          newInstance.orthogonalEdgeEditingContext = newInstance1;
        }
        var /*yworks.yfiles.ui.input.GraphEditorInputMode*/ mode = newInstance;
        mode.navigationInputMode.addGroupEnteredListener(yfiles.lang.delegate(this.$OnGroupChanged$1, this));
        mode.navigationInputMode.addGroupExitedListener(yfiles.lang.delegate(this.$OnGroupChanged$1, this));

        // make bend creation more important than moving of selected edges
        // this has the effect that dragging a selected edge (not its bends)
        // will create a new bend instead of moving all bends
        // This is especially nicer in conjunction with orthogonal
        // edge editing because this creates additional bends every time
        // the edge is moved otherwise
        mode.createBendModePriority = mode.moveModePriority - 1;
        return mode;
      },
      '$OnGroupChanged$1': function(/*yfiles.lang.Object*/ source, /*yworks.canvas.model.ItemEventArgs<yworks.yfiles.ui.model.INode>*/ evt) {
        this.enterGroupButton.enabled = yworks.yfiles.ui.input.GraphCommands.ENTER_GROUP_COMMAND.canExecuteOnTarget(null, this.graphControl);
        this.exitGroupButton.enabled = yworks.yfiles.ui.input.GraphCommands.EXIT_GROUP_COMMAND.canExecuteOnTarget(null, this.graphControl);
      },
      'initializeGraph': function() {
        //Enable folding
        var /*yworks.yfiles.ui.model.IFoldedGraph*/ view = new yworks.yfiles.ui.model.FoldingManager().createManagedView();
        this.graphControl.graph = view.graph;

        // #region Enable undoability

        // Get the master graph instance and enable undoability support.
        var /*yworks.yfiles.ui.model.DefaultGraph*/ defaultGraph = yworks.support.extensions.LookupExtensions.safeGet(yworks.yfiles.ui.model.DefaultGraph.$class, view.manager.masterGraph);
        defaultGraph.undoEngineEnabled = true;

        // #endregion 

        // #region Configure grouping

        // get a hold of the IGroupedGraph
        var /*yworks.yfiles.ui.model.IGroupedGraph*/ groupedGraph = view.groupedGraph;

        // configure the group node style.
        if (groupedGraph !== null) {
          //PanelNodeStyle is a nice style especially suited for group nodes
          var /*yworks.canvas.drawing.headless.Color*/ groupNodeColor = yworks.canvas.drawing.headless.Color.fromArgb(255, 214, 229, 248);
          var /*yworks.yfiles.ui.drawing.PanelNodeStyle*/ newInstance = new yworks.yfiles.ui.drawing.PanelNodeStyle.WithColor(groupNodeColor);
          {
            newInstance.insets = new yworks.canvas.geometry.structs.InsetsD.FromLeftTopRightAndBottom(5, 20, 5, 5);
            newInstance.labelInsetsColor = groupNodeColor;
          }
          groupedGraph.groupNodeDefaults.style = new yworks.yfiles.ui.drawing.CollapsibleNodeStyleDecorator.WithStyle(newInstance);

          // Set a different label style and parameter
          var /*yworks.yfiles.ui.drawing.SimpleLabelStyle*/ newInstance1 = new yworks.yfiles.ui.drawing.SimpleLabelStyle();
          {}
          groupedGraph.groupNodeDefaults.labels.style = newInstance1;
          groupedGraph.groupNodeDefaults.labels.labelModelParameter = yworks.yfiles.ui.labelmodels.InteriorStretchLabelModel.NORTH;
        }

        // #endregion 

        // #region Configure graph defaults

        view.graph.nodeDefaults.style = new yworks.yfiles.ui.drawing.ShinyPlateNodeStyle.WithColor(yworks.support.windows.Colors.darkOrange);

        // #endregion 

        this.graph.getDecorator().nodeDecorator.editLabelHelperDecorator.setFactory((function(/*yworks.yfiles.ui.model.INode*/ item) {
          return new yworks.yfiles.ui.input.EditLabelHelper.ForLabelOwner(item);
        }).bind(this));
      },
      /**
       * Gets the currently registered <code>IGraph</code> instance from the <code>GraphControl</code>.
       */
      'graph': {
        '$meta': function() {
          return [yfiles.system.reflect.TypeAttribute(yworks.yfiles.ui.model.IGraph.$class)];
        },
        'get': function() {
          return this.graphControl.graph;
        }
      },
      '$NewButton_Click$1': function() {
        this.$ClearGraph$1();
      },
      '$ClearGraph$1': function() {
        this.graphControl.graph.clear();
        yworks.yfiles.ui.GraphControl.FIT_GRAPH_BOUNDS_COMMAND.executeOnTarget(null, this.graphControl);
      },
      '$SnappingButton_Click$1': function() {
        (/*(yworks.yfiles.ui.input.GraphEditorInputMode)*/this.graphControl.inputMode).snapContext.enabled = this.snappingButton.isChecked;
      },
      '$OrthogonalEditingButton_Click$1': function() {
        var /*yworks.yfiles.ui.input.GraphEditorInputMode*/ inputMode = /*(yworks.yfiles.ui.input.GraphEditorInputMode)*/this.graphControl.inputMode;
        inputMode.orthogonalEdgeEditingContext.orthogonalEdgeEditing = this.orthogonalEditingButton.isChecked;
        inputMode.createEdgeInputMode.orthogonalEdgeCreation = this.orthogonalEditingButton.isChecked;
      },
      // #region Layout
      // holds all available layouters by name for the combo box
      '$availableLayouts$1': null,
      // holds the currently chosen layout
      '$currentLayout$1': null,
      // reentrant lock for layout
      '$layouting$1': false,
      '$InitialzeLayoutAlgorithms$1': function() {
        if (this.layoutComboBox === null) {
          return;
        }

        this.$availableLayouts$1.put("Hierarchic", new yworks.yfiles.layout.hierarchic.IncrementalHierarchicLayouter());
        var /*yworks.yfiles.layout.organic.SmartOrganicLayouter*/ newInstance = new yworks.yfiles.layout.organic.SmartOrganicLayouter();
        {
          newInstance.minimalNodeDistance = 40;
        }
        this.$availableLayouts$1.put("Organic", newInstance);
        this.$availableLayouts$1.put("Orthogonal", new yworks.yfiles.layout.orthogonal.OrthogonalLayouter());
        this.$availableLayouts$1.put("Circular", new yworks.yfiles.layout.circular.CircularLayouter());
        this.$availableLayouts$1.put("Tree", new yworks.yfiles.layout.tree.TreeLayouter());
        this.$availableLayouts$1.put("Generic Tree", new yworks.yfiles.layout.tree.GenericTreeLayouter());
        this.$availableLayouts$1.put("Balloon", new yworks.yfiles.layout.tree.BalloonLayouter());
        this.$availableLayouts$1.put("Random", new yworks.yfiles.layout.random.RandomLayouter());
        //      availableLayouts["Orthogonal Router"] = new OrthogonalEdgeRouter();
        this.$availableLayouts$1.put("Organic Router", new yworks.yfiles.layout.router.OrganicEdgeRouter());

        var /*yfiles.lang.String[]*/ items = yfiles.system.ArrayExtensions./*<yfiles.lang.String>*/createObjectArray(this.$availableLayouts$1.count);
        this.$availableLayouts$1.keys.copyToArrayAt(items, 0);
        this.layoutComboBox.items = yfiles.system.collections.generic.List.fromArray(items);
      },
      '$ApplyLayout$1': function() {
        if (this.$layouting$1 || this.$currentLayout$1 === null) {
          return;
        }

        this.$layouting$1 = true;
        this.graphControl.morphLayout(this.$currentLayout$1, yfiles.system.TimeSpan.fromSeconds(1), (function(/*yfiles.lang.Object*/ s, /*yfiles.system.EventArgs*/ args) {
          this.$layouting$1 = false;
        }).bind(this));
      },
      'layoutComboBox_SelectedIndexChanged': function() {
        if (this.layoutComboBox === null) {
          return;
        }
        var /*yfiles.lang.String*/ key = this.layoutComboBox.selectedItem;
        if (key !== null) {
          this.$currentLayout$1 = this.$availableLayouts$1.get(key);
          this.$ApplyLayout$1();
        }
      },
      // #endregion 
      // #region File operations
      '$openOperation$1': null,
      '$saveOperation$1': null,
      '$InitializeFileOperations$1': function() {
        if (demo.yfiles.io.fileoperations.OpenViaReaderOperation.isAvailable()) {
          var /*demo.yfiles.io.fileoperations.OpenViaReaderOperation*/ openSupport = new demo.yfiles.io.fileoperations.OpenViaReaderOperation();
          openSupport.addFailedListener((function(/*yfiles.lang.Object*/ sender, /*yfiles.system.EventArgs*/ args) {
            alert((/*(demo.yfiles.io.fileoperations.FileEventArgs)*/args).data);
          }).bind(this));
          openSupport.addSucceededListener((function(/*yfiles.lang.Object*/ sender, /*yfiles.system.EventArgs*/ args) {
            this.$ParseGraphML$1((/*(demo.yfiles.io.fileoperations.FileEventArgs)*/args).data);
          }).bind(this));
          this.$openOperation$1 = openSupport;
        } else {
          (/*(yfiles.demo.IButton)*/this.getProperty("openButton")).enabled = false;
        }


        this.$saveOperation$1 = new demo.yfiles.io.fileoperations.SaveViaConsoleOperation();
      },
      '$OpenButtonClick$1': function() {
        if (this.$openOperation$1 !== null) {
          this.$openOperation$1.open();
        }
      },
      '$SaveButtonClick$1': function() {
        if (this.$saveOperation$1 !== null) {
          this.$saveOperation$1.save(this.$WriteGraphML$1(), "unnamed.graphml");
        }
      },
      '$WriteGraphML$1': function() {
        var /*yworks.yfiles.graphml.GraphMLIOHandler*/ handler = this.$CreateGraphMLIOHandler$1();
        var /*yfiles.system.text.StringWriter*/ stringWriter = new yfiles.system.text.StringWriter();
        handler.write(this.graphControl.graph, stringWriter);
        return stringWriter.toString();
      },
      '$ParseGraphML$1': function(/*yfiles.lang.String*/ text) {
        var /*Document*/ doc = new DOMParser().parseFromString(text, "text/xml");
        if ("parsererror".equals(doc.documentElement.nodeName)) {
          alert("Error parsing XML.");
          return;
        }

        try {
          var /*yworks.yfiles.graphml.GraphMLIOHandler*/ ioHandler = this.$CreateGraphMLIOHandler$1();
          ioHandler.addParsedListener((function(/*yfiles.lang.Object*/ sender, /*yworks.yfiles.graphml.parser.ParseEventArgs*/ args) {
            yworks.yfiles.ui.GraphControl.FIT_GRAPH_BOUNDS_COMMAND.executeOnTarget(null, this.graphControl);
          }).bind(this));
          ioHandler.readFromDocument(this.graphControl.graph, /*(Document)*/doc);
        } catch ( /*yfiles.lang.Exception*/ e ) {
          {
            alert("Error parsing GraphML: " + e.message);
          }
        }
      },
      '$CreateGraphMLIOHandler$1': function() {
        return new yworks.yfiles.graphml.GraphMLIOHandler();
      },
      // #endregion 
      '$$init$1': function() {
        this.$gridInfo$1 = new yworks.canvas.GridInfo.FromGridSpacing(demo.yfiles.graph.simpleeditor.SimpleEditorApplication.GRID_SIZE);
        this.$availableLayouts$1 = new yfiles.system.collections.generic.Dictionary/*<yfiles.lang.String, yworks.yfiles.layout.ILayouter>*/();
      },
      '$static': {
        'GRID_SIZE': 50
      }
    };
  })


});});
