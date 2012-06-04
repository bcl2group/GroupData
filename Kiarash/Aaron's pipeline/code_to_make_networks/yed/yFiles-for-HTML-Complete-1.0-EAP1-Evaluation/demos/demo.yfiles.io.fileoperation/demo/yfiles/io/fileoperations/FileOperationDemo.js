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
yfiles.module("demo.yfiles.io.fileoperations", function(exports) {

  /**
   * Shows various ways to open from and save to a file.
   * For opening files, we demonstrate using
   * the FileReader API of HTML 5,
   * the FileSystem object of Internet Explorer, and
   * a dedicated server which returns the content of any file input element submitted to it.
   * For saving files, we show 
   * logging to the browser's console and
   * using a dedicated server which provides the content of a request as file download.
   */
  /*public*/ exports.FileOperationDemo = new yfiles.ClassDefinition(function() {
    return {
      '$extends': yfiles.demo.Application,
      'constructor': function() {
        yfiles.demo.Application.call(this);
      },
      // #region Create application
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
      'registerCommands': function() {
        this.setProperty("New", new yfiles.demo.ActionCommand(yfiles.lang.delegate(this.$NewButtonClick$1, this)));
        this.setProperty("OpenViaFileReader", new yfiles.demo.ActionCommand((function() {
          this.$OpenButtonClick$1(this.$openFileReaderOperation$1);
        }).bind(this)));
        this.setProperty("OpenViaFileSystemObject", new yfiles.demo.ActionCommand((function() {
          this.$OpenButtonClick$1(this.$openFileSystemObjectOperation$1);
        }).bind(this)));
        this.setProperty("OpenViaServer", new yfiles.demo.ActionCommand((function() {
          this.$OpenButtonClick$1(this.$openServerOperation$1);
        }).bind(this)));
        this.setProperty("SaveViaServer", new yfiles.demo.ActionCommand((function() {
          this.$SaveButtonClick$1(this.$saveServerOperation$1);
        }).bind(this)));
        this.setProperty("SaveViaConsole", new yfiles.demo.ActionCommand((function() {
          this.$SaveButtonClick$1(this.$saveConsoleOperation$1);
        }).bind(this)));
      },
      'loaded': function() {
        this.setTitle("File Operation Demo [yFiles for HTML]");

        this.$InitializeFileOperations$1();
        this.initializeGraph();
        this.initializeInputModes();
        this.graphControl.fitGraphBounds();

        this.overviewControl.graphControl = this.graphControl;
      },
      // #endregion 
      // #region Configure application
      'initializeInputModes': function() {
        this.graphControl.inputMode = this.createEditorMode();
      },
      'createEditorMode': function() {
        var /*yworks.yfiles.ui.input.GraphEditorInputMode*/ mode = new yworks.yfiles.ui.input.GraphEditorInputMode();

        // make bend creation more important than moving of selected edges
        // this has the effect that dragging a selected edge (not its bends)
        // will create a new bend instead of moving all bends
        // This is especially nicer in conjunction with orthogonal
        // edge editing because this creates additional bends every time
        // the edge is moved otherwise
        mode.createBendModePriority = mode.moveModePriority - 1;
        return mode;
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
          {
            newInstance1.textAlignment = yworks.canvas.drawing.headless.TextAlignment.LEFT;
          }
          groupedGraph.groupNodeDefaults.labels.style = newInstance1;
          groupedGraph.groupNodeDefaults.labels.labelModelParameter = yworks.yfiles.ui.labelmodels.InteriorStretchLabelModel.NORTH;
        }

        // #endregion 

        // #region Configure graph defaults

        view.graph.nodeDefaults.style = new yworks.yfiles.ui.drawing.ShinyPlateNodeStyle.WithColor(yworks.support.windows.Colors.darkOrange);

        // #endregion 

        view.graph.getDecorator().nodeDecorator.editLabelHelperDecorator.setFactory((function(/*yworks.yfiles.ui.model.INode*/ item) {
          return new yworks.yfiles.ui.input.EditLabelHelper.ForLabelOwner(item);
        }).bind(this));
      },
      '$NewButtonClick$1': function() {
        this.graphControl.graph.clear();
        yworks.yfiles.ui.GraphControl.FIT_GRAPH_BOUNDS_COMMAND.executeOnTarget(null, this.graphControl);
      },
      // #endregion 
      // #region File operations
      '$openFileReaderOperation$1': null,
      '$openFileSystemObjectOperation$1': null,
      '$openServerOperation$1': null,
      '$saveServerOperation$1': null,
      '$saveConsoleOperation$1': null,
      '$InitializeFileOperations$1': function() {
        if (demo.yfiles.io.fileoperations.OpenViaReaderOperation.isAvailable()) {
          this.$openFileReaderOperation$1 = new demo.yfiles.io.fileoperations.OpenViaReaderOperation();
          this.$InitializeOpenOperation$1(this.$openFileReaderOperation$1);
        } else {
          (/*(yfiles.demo.IButton)*/this.getProperty("openFileReaderButton")).enabled = false;
        }

        if (demo.yfiles.io.fileoperations.OpenViaFileSystemObjectOperation.isAvailable()) {
          this.$openFileSystemObjectOperation$1 = new demo.yfiles.io.fileoperations.OpenViaFileSystemObjectOperation();
          this.$InitializeOpenOperation$1(this.$openFileSystemObjectOperation$1);
        } else {
          (/*(yfiles.demo.IButton)*/this.getProperty("openFileSystemObjectButton")).enabled = false;
        }

        var /*demo.yfiles.io.fileoperations.OpenViaServerOperation*/ newInstance = new demo.yfiles.io.fileoperations.OpenViaServerOperation();
        {
          newInstance.serverOrigin = demo.yfiles.io.fileoperations.FileOperationDemo.FILE_SERVER_ORIGIN;
          newInstance.serverUrl = demo.yfiles.io.fileoperations.FileOperationDemo.FILE_SERVER_URL;
        }
        this.$openServerOperation$1 = newInstance;
        this.$InitializeOpenOperation$1(this.$openServerOperation$1);

        this.$saveConsoleOperation$1 = new demo.yfiles.io.fileoperations.SaveViaConsoleOperation();
        this.$InitializeSaveOperation$1(this.$saveConsoleOperation$1);

        var /*demo.yfiles.io.fileoperations.SaveViaServerOperation*/ newInstance1 = new demo.yfiles.io.fileoperations.SaveViaServerOperation();
        {
          newInstance1.serverUrl = demo.yfiles.io.fileoperations.FileOperationDemo.FILE_SERVER_URL;
        }
        this.$saveServerOperation$1 = newInstance1;
        this.$InitializeSaveOperation$1(this.$saveServerOperation$1);
      },
      '$InitializeOpenOperation$1': function(/*demo.yfiles.io.fileoperations.OpenOperation*/ operation) {
        operation.addFailedListener((function(/*yfiles.lang.Object*/ sender, /*yfiles.system.EventArgs*/ args) {
          alert((/*(demo.yfiles.io.fileoperations.FileEventArgs)*/args).data);
        }).bind(this));
        operation.addSucceededListener((function(/*yfiles.lang.Object*/ sender, /*yfiles.system.EventArgs*/ args) {
          this.$ParseGraphML$1WithText((/*(demo.yfiles.io.fileoperations.FileEventArgs)*/args).data);
        }).bind(this));
      },
      '$InitializeSaveOperation$1': function(/*demo.yfiles.io.fileoperations.SaveOperation*/ operation) {
        operation.addFailedListener((function(/*yfiles.lang.Object*/ sender, /*yfiles.system.EventArgs*/ args) {
          alert((/*(demo.yfiles.io.fileoperations.FileEventArgs)*/args).data);
        }).bind(this));
      },
      '$OpenButtonClick$1': function(/*demo.yfiles.io.fileoperations.OpenOperation*/ operation) {
        if (operation !== null) {
          operation.open();
        }
      },
      '$SaveButtonClick$1': function(/*demo.yfiles.io.fileoperations.SaveOperation*/ operation) {
        if (operation !== null) {
          operation.save(this.$WriteGraphML$1(), "unnamed.graphml");
        }
      },
      '$WriteGraphML$1': function() {
        var /*yworks.yfiles.graphml.GraphMLIOHandler*/ handler = this.$CreateGraphMLIOHandler$1();
        var /*yfiles.system.text.StringWriter*/ stringWriter = new yfiles.system.text.StringWriter();
        handler.write(this.graphControl.graph, stringWriter);
        return stringWriter.toString();
      },
      '$ParseGraphML$1WithText': function(/*yfiles.lang.String*/ text) {
        var /*Document*/ doc = new DOMParser().parseFromString(text, "text/xml");
        if ("parsererror".equals(doc.documentElement.nodeName)) {
          alert("Error parsing XML.");
          return;
        }

        this.$ParseGraphML$1(/*(Document)*/doc);
      },
      '$ParseGraphML$1': function(/*Document*/ doc) {
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
      '$static': {
        'FILE_SERVER_URL': "http://localhost:8080/yFilesJS/graphs",
        'FILE_SERVER_ORIGIN': "http://localhost:8080"
      }
    };
  })


});});
