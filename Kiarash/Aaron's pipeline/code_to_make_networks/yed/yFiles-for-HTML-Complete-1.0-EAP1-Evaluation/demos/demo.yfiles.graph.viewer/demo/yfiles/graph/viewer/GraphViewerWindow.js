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
   * This demo shows how to display a graph with the GraphViewer component.
   */
  /*public*/ exports.GraphViewerWindow = new yfiles.ClassDefinition(function() {
    return {
      '$extends': yfiles.demo.Application,
      'constructor': function() {
        yfiles.demo.Application.call(this);
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
      '$nextButton$1': null,
      'nextButton': {
        '$meta': function() {
          return [yfiles.system.reflect.TypeAttribute(yfiles.demo.IButton.$class)];
        },
        'get': function() {
          return this.$nextButton$1;
        },
        'set': function(/*yfiles.demo.IButton*/ value) {
          this.$nextButton$1 = value;
        }
      },
      '$previousButton$1': null,
      'previousButton': {
        '$meta': function() {
          return [yfiles.system.reflect.TypeAttribute(yfiles.demo.IButton.$class)];
        },
        'get': function() {
          return this.$previousButton$1;
        },
        'set': function(/*yfiles.demo.IButton*/ value) {
          this.$previousButton$1 = value;
        }
      },
      '$graphChooserBox$1': null,
      'graphChooserBox': {
        '$meta': function() {
          return [yfiles.system.reflect.TypeAttribute(yfiles.demo.IComboBox.$class)];
        },
        'get': function() {
          return this.$graphChooserBox$1;
        },
        'set': function(/*yfiles.demo.IComboBox*/ value) {
          this.$graphChooserBox$1 = value;
        }
      },
      '$graphDescriptionMapper$1': null,
      'graphDescriptionMapper': {
        'get': function() {
          return this.$graphDescriptionMapper$1;
        },
        'set': function(/*yworks.canvas.model.IMapper<yworks.yfiles.ui.model.IGraph, yfiles.lang.String>*/ value) {
          this.$graphDescriptionMapper$1 = value;
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

        this.setProperty("Open", new yfiles.demo.ActionCommand((function() {
          alert("Open file command not implemented");
        }).bind(this)));
        this.setProperty("PreviousFile", new yfiles.demo.ActionCommand((function() {
          this.$PreviousButton_Click$1(null, null);
        }).bind(this)));
        this.setProperty("NextFile", new yfiles.demo.ActionCommand((function() {
          this.$NextButton_Click$1(null, null);
        }).bind(this)));
        this.setProperty("SelectedFileChanged", new yfiles.demo.ActionCommand((function() {
          this.$GraphChooserBox_SelectedIndexChanged$1(null, null);
        }).bind(this)));
      },
      'loaded': function() {
        this.setTitle("Graph Viewer [yFiles for HTML]");
        (/*(yfiles.demo.IButton)*/this.getProperty("OpenButton")).enabled = false;

        this.$CreateAdditionalComponents$1();
        this.$InitializeGraphControl$1();
        this.$InitializeInputMode$1();

        this.graphChooserBox.items = yfiles.system.collections.generic.List.fromArray(["computer-network", "movies", "family-tree", "hierarchy", "nesting", "social-network", "uml-diagram"]);
        // the combobox selects the first element automatically => no need to set an initial graph

        this.$OnCurrentItemChanged$1(this, null);// reset the node info view

      },
      // #endregion 
      '$manager$1': null,
      '$graphDescriptionElement$1': null,
      '$propertiesView$1': null,
      '$CreateAdditionalComponents$1': function() {
        this.$graphDescriptionElement$1 = /*(HTMLElement)*/document.createElement("p");
        var /*HTMLElement*/ graphInfoPane = /*(HTMLElement)*/document.getElementById("graphInfoContent");
        yfiles.demo.Application.removeAllChildren(graphInfoPane);
        graphInfoPane.appendChild(this.$graphDescriptionElement$1);

        this.$propertiesView$1 = new demo.yfiles.graph.viewer.PropertiesView(/*(HTMLElement)*/document.getElementById("nodeInfoContent"));
      },
      '$InitializeGraphControl$1': function() {
        this.$EnableFolding$1();

        this.overviewControl.graphControl = this.graphControl;

        this.graphControl.fileOperationsEnabled = true;

        var /*yworks.yfiles.ui.model.IMapperRegistry*/ masterRegistry = this.graphControl.graph.getFoldedGraph().manager.masterGraph.mapperRegistry;
        yworks.yfiles.ui.model.MapperRegistryExtensions.addMapper(yworks.yfiles.ui.model.INode.$class, yfiles.lang.String.$class, masterRegistry, "ToolTip");
        yworks.yfiles.ui.model.MapperRegistryExtensions.addMapper(yworks.yfiles.ui.model.INode.$class, yfiles.lang.String.$class, masterRegistry, "Description");
        yworks.yfiles.ui.model.MapperRegistryExtensions.addMapper(yworks.yfiles.ui.model.INode.$class, yfiles.lang.String.$class, masterRegistry, "Url");
        yworks.yfiles.ui.model.MapperRegistryExtensions.addMapper(yworks.yfiles.ui.model.IGraph.$class, yfiles.lang.String.$class, masterRegistry, "GraphDescription");

        this.graphControl.addCurrentItemChangedListener(yfiles.lang.delegate(this.$OnCurrentItemChanged$1, this));
      },
      '$InitializeInputMode$1': function() {
        var /*yworks.yfiles.ui.input.GraphViewerInputMode*/ newInstance = new yworks.yfiles.ui.input.GraphViewerInputMode();
        {
          newInstance.toolTipItems = yworks.yfiles.ui.model.GraphItemTypes.LABELED_ITEM;
          newInstance.clickableItems = yworks.yfiles.ui.model.GraphItemTypes.NODE;
          newInstance.focusableItems = yworks.yfiles.ui.model.GraphItemTypes.NODE;
          newInstance.selectableItems = yworks.yfiles.ui.model.GraphItemTypes.NONE;
          newInstance.marqueeSelectableItems = yworks.yfiles.ui.model.GraphItemTypes.NONE;
        }
        var /*yworks.yfiles.ui.input.GraphViewerInputMode*/ graphViewerInputMode = newInstance;

        graphViewerInputMode.navigationInputMode.collapsingGroupsAllowed = true;
        graphViewerInputMode.navigationInputMode.expandingGroupsAllowed = true;
        graphViewerInputMode.navigationInputMode.useCurrentItemForCommands = true;
        graphViewerInputMode.navigationInputMode.fitContentAfterGroupActions = false;

        graphViewerInputMode.addQueryItemToolTipListener(yfiles.lang.delegate(this.$OnQueryItemToolTip$1, this));
        graphViewerInputMode.addItemClickedListener(yfiles.lang.delegate(this.$OnItemClicked$1, this));

        graphViewerInputMode.clickInputMode.addClickedListener(yfiles.lang.delegate(this.$OnClickInputModeOnClicked$1, this));

        this.graphControl.inputMode = graphViewerInputMode;
      },
      '$OnClickInputModeOnClicked$1': function(/*yfiles.lang.Object*/ sender, /*yworks.canvas.input.ClickEventArgs*/ args) {
        if (!this.graphControl.graphModelManager.enumerateHits(args.location).moveNext()) {
          // nothing hit
          if ((args.modifierState & (yworks.canvas.drawing.headless.ModifierKeys.SHIFT | yworks.canvas.drawing.headless.ModifierKeys.CONTROL)) === (yworks.canvas.drawing.headless.ModifierKeys.SHIFT | yworks.canvas.drawing.headless.ModifierKeys.CONTROL)) {
            if (yworks.yfiles.ui.input.GraphCommands.EXIT_GROUP_COMMAND.canExecuteOnTarget(null, this.graphControl) && !args.handled) {
              yworks.yfiles.ui.input.GraphCommands.EXIT_GROUP_COMMAND.executeOnTarget(null, this.graphControl);
              args.handled = true;
            }
          }
        }
      },
      '$EnableFolding$1': function() {
        // create the manager
        this.$manager$1 = new yworks.yfiles.ui.model.FoldingManager();
        // replace the displayed graph with a managed view
        this.graphControl.graph = this.$manager$1.createManagedView().graph;
        this.$WrapGroupNodeStyles$1();
      },
      '$WrapGroupNodeStyles$1': function() {
        var /*yworks.yfiles.ui.model.IFoldedGraph*/ foldedGraph = this.graphControl.graph.getFoldedGraph();
        if (foldedGraph !== null) {
          //PanelNodeStyle is a nice style especially suited for group nodes
          var /*yworks.yfiles.ui.drawing.PanelNodeStyle*/ style = new yworks.yfiles.ui.drawing.PanelNodeStyle.WithColor(yworks.support.windows.Colors.lightBlue);

          //Wrap the style with CollapsibleNodeStyleDecorator
          foldedGraph.groupedGraph.groupNodeDefaults.style = new yworks.yfiles.ui.drawing.CollapsibleNodeStyleDecorator.WithStyle(style);
        }
      },
      '$OnCurrentItemChanged$1': function(/*yfiles.lang.Object*/ sender, /*yfiles.system.EventArgs*/ propertyChangedEventArgs) {
        this.$propertiesView$1.clear();

        var /*yworks.canvas.model.IModelItem*/ currentItem = this.graphControl.currentItem;
        if (yworks.yfiles.ui.model.INode.isInstance(currentItem)) {
          var /*yworks.yfiles.ui.model.INode*/ node = /*(yworks.yfiles.ui.model.INode)*/currentItem;
          this.$propertiesView$1.addTextItem("Label", node.labels.count > 0 ? node.labels.getItem(0).text : "Empty");
          var /*yfiles.lang.String*/ tmp;
          this.$propertiesView$1.addTextItem("Description", (tmp = (this.descriptionMapper.getItem(node))) !== null ? tmp : "Empty");
          var /*yfiles.lang.String*/ url = this.urlMapper.getItem(node);
          if (url !== null) {
            this.$propertiesView$1.addLinkItem("Link", "External", url);
          } else {
            this.$propertiesView$1.addTextItem("Link", "None");
          }
        } else {
          this.$propertiesView$1.addTextItem("Label", "Empty");
          this.$propertiesView$1.addTextItem("Description", "Empty");
          this.$propertiesView$1.addTextItem("Link", "None");
        }
      },
      '$OnItemClicked$1': function(/*yfiles.lang.Object*/ sender, /*yworks.support.ItemInputEventArgs<yworks.canvas.model.IModelItem>*/ e) {
        if (yworks.yfiles.ui.model.INode.isInstance(e.item)) {
          this.graphControl.currentItem = e.item;
          if ((this.graphControl.lastMouse2DEvent.modifierState & (yworks.canvas.drawing.headless.ModifierKeys.SHIFT | yworks.canvas.drawing.headless.ModifierKeys.CONTROL)) === (yworks.canvas.drawing.headless.ModifierKeys.SHIFT | yworks.canvas.drawing.headless.ModifierKeys.CONTROL)) {
            if (yworks.yfiles.ui.input.GraphCommands.ENTER_GROUP_COMMAND.canExecuteOnTarget(e.item, this.graphControl)) {
              yworks.yfiles.ui.input.GraphCommands.ENTER_GROUP_COMMAND.executeOnTarget(e.item, this.graphControl);
              e.handled = true;
            }
          }
        }
      },
      '$OnQueryItemToolTip$1': function(/*yfiles.lang.Object*/ sender, /*yworks.canvas.input.QueryItemToolTipEventArgs<yworks.canvas.model.IModelItem>*/ queryItemToolTipEventArgs) {
        if (yworks.yfiles.ui.model.INode.isInstance(queryItemToolTipEventArgs.item) && !queryItemToolTipEventArgs.handled) {
          var /*yworks.yfiles.ui.model.INode*/ node = /*(yworks.yfiles.ui.model.INode)*/queryItemToolTipEventArgs.item;
          var /*yworks.canvas.model.IMapper<yworks.yfiles.ui.model.INode, yfiles.lang.String>*/ descriptionMapper = this.descriptionMapper;
          var /*yfiles.lang.String*/ tmp;
          var /*yfiles.lang.String*/ toolTip = (tmp = (this.toolTipMapper.getItem(node))) !== null ? tmp : (descriptionMapper !== null ? descriptionMapper.getItem(node) : null);
          if (toolTip !== null) {
            queryItemToolTipEventArgs.toolTip = toolTip;
            queryItemToolTipEventArgs.handled = true;
          }
        }
      },
      'descriptionMapper': {
        'get': function() {
          return this.graphControl.graph.mapperRegistry./*<yworks.yfiles.ui.model.INode, yfiles.lang.String>*/getMapper("Description");
        }
      },
      'toolTipMapper': {
        'get': function() {
          return this.graphControl.graph.mapperRegistry./*<yworks.yfiles.ui.model.INode, yfiles.lang.String>*/getMapper("ToolTip");
        }
      },
      'urlMapper': {
        'get': function() {
          return this.graphControl.graph.mapperRegistry./*<yworks.yfiles.ui.model.INode, yfiles.lang.String>*/getMapper("Url");
        }
      },
      '$ReadSampleGraph$1': function() {
        this.graphControl.graph.clear();
        this.graphDescriptionMapper = new yworks.canvas.model.DictionaryMapper/*<yworks.yfiles.ui.model.IGraph, yfiles.lang.String>*/();
        {
          var /*yfiles.lang.String*/ fileName = yfiles.system.text.StringExtensions.wrapAndFormat("resources/" + "{0}.graphml", this.graphChooserBox.selectedItem);
          var /*yworks.yfiles.graphml.GraphMLIOHandler*/ ioHandler = new yworks.yfiles.graphml.GraphMLIOHandler();
          ioHandler.addRegistryInputMapper(yworks.yfiles.ui.model.INode.$class, yfiles.lang.String.$class, "Description");
          ioHandler.addRegistryInputMapper(yworks.yfiles.ui.model.INode.$class, yfiles.lang.String.$class, "ToolTip");
          ioHandler.addRegistryInputMapper(yworks.yfiles.ui.model.INode.$class, yfiles.lang.String.$class, "Url");
          ioHandler.addInputMapperWithName(yworks.yfiles.ui.model.IGraph.$class, yfiles.lang.String.$class, "GraphDescription", this.graphDescriptionMapper);
          ioHandler.addParsedListener((function(/*yfiles.lang.Object*/ sender, /*yworks.yfiles.graphml.parser.ParseEventArgs*/ args) {
            yworks.yfiles.ui.GraphControl.FIT_GRAPH_BOUNDS_COMMAND.executeOnTarget(null, this.graphControl);
            var /*yfiles.lang.String*/ tmp;
            this.$graphDescriptionElement$1.textContent = (tmp = (this.graphDescriptionMapper.getItem(this.graphControl.graph.getFoldedGraph().manager.masterGraph))) !== null ? tmp : "";
          }).bind(this));
          try {
            ioHandler.readFromURI(this.graphControl.graph, fileName);
          } catch ( /*yfiles.lang.Exception*/ e ) {
            {
              var /*yfiles.lang.Object*/ o = e;
              var /*Object*/ jsObject = /*(Object)*/o;
              var /*yfiles.lang.String*/ msg = "Unable to open the graph.\nPerhaps your browser does not allow handling cross domain HTTP requests. Please see the demo readme for details.";
              if (jsObject["message"] !== undefined) {
                msg += "\n" + jsObject["message"] + "\n";
              }
              alert(msg);
            }
          }
        }
      },
      '$UpdateButtons$1': function() {
        this.nextButton.enabled = this.graphChooserBox.selectedIndex < this.graphChooserBox.length - 1;
        this.previousButton.enabled = this.graphChooserBox.selectedIndex > 0;
      },
      '$PreviousButton_Click$1': function(/*yfiles.lang.Object*/ sender, /*yfiles.system.EventArgs*/ e) {
        this.graphChooserBox.selectedIndex--;
        this.$UpdateButtons$1();
      },
      '$NextButton_Click$1': function(/*yfiles.lang.Object*/ sender, /*yfiles.system.EventArgs*/ e) {
        this.graphChooserBox.selectedIndex++;
        this.$UpdateButtons$1();
      },
      '$GraphChooserBox_SelectedIndexChanged$1': function(/*yfiles.lang.Object*/ sender, /*yfiles.system.EventArgs*/ e) {
        this.$ReadSampleGraph$1();
        this.$UpdateButtons$1();
      }
    };
  })


});});
