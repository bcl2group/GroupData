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

  /*private*/ exports.TableEditorDemo = new yfiles.ClassDefinition(function() {
    return {
      '$extends': yfiles.demo.Application,
      'constructor': function() {
        yfiles.demo.Application.call(this);
        this.$$init$1();
      },
      'loaded': function() {
        document.title = "Table Editor Demo [yFiles for HTML]";
        this.graphControl.preventEventPropagation = true;
        this.$Initialize$1();
      },
      '$graphControl$1': null,
      'graphControl': {
        'get': function() {
          return this.$graphControl$1;
        },
        'set': function(/*yworks.yfiles.ui.GraphControl*/ value) {
          this.$graphControl$1 = value;
        }
      },
      '$Initialize$1': function() {
        // initialize the input mode
        this.$ConfigureInputModes$1();
        // initialize the graph
        this.$InitializeGraph$1();
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
        this.setProperty("LayoutCommand", new yfiles.demo.ActionCommand(yfiles.lang.delegate(this.$ApplyLayout$1, this)));
      },
      '$tableEditorInputMode$1': null,
      '$graphEditorInputMode$1': null,
      '$defaultGroupNodeStyle$1': null,
      '$defaultNormalNodeStyle$1': null,
      '$defaultNodeSize$1': null,
      '$contextMenu$1': null,
      '$ConfigureInputModes$1': function() {
        var /*yworks.yfiles.ui.input.GraphEditorInputMode*/ newInstance = new yworks.yfiles.ui.input.GraphEditorInputMode();
        {
          var /*yworks.yfiles.ui.input.OrthogonalEdgeEditingContext*/ newInstance1 = new yworks.yfiles.ui.input.OrthogonalEdgeEditingContext();
          {
            newInstance1.orthogonalEdgeEditing = true;
          }
          newInstance.orthogonalEdgeEditingContext = newInstance1;
          newInstance.createEdgeInputMode.orthogonalEdgeCreation = true;
          var /*demo.yfiles.graph.tableeditor.TableEditorDemo.MyNodeDropInputMode*/ newInstance2 = new demo.yfiles.graph.tableeditor.TableEditorDemo.MyNodeDropInputMode();
          {
            newInstance2.showNodePreview = true;
            newInstance2.enabled = true;
            newInstance2.isGroupNodePredicate = (function(/*yworks.yfiles.ui.model.INode*/ draggedNode) {
              return draggedNode.lookup(yworks.yfiles.ui.model.ITable.$class) !== null || "GroupNode".equals(/*(yfiles.lang.String)*/draggedNode.tag);
            }).bind(this);
          }
          newInstance.nodeDropInputMode = newInstance2;
          newInstance.nodeCreationAllowed = false;
        }
        this.$graphEditorInputMode$1 = newInstance;
        //Register custom reparent handler that prevents reparenting of table nodes (i.e. they may only appear on root level)
        this.$graphEditorInputMode$1.reparentNodeHandler = new demo.yfiles.graph.tableeditor.TableEditorDemo.MyReparentHandler(this.$graphEditorInputMode$1.reparentNodeHandler);
        this.$ConfigureTableEditing$1();

        this.graphControl.inputMode = this.$graphEditorInputMode$1;
      },
      '$ConfigureTableEditing$1': function() {
        //Create a new TEIM instance which also allows drag and drop
        var /*yworks.yfiles.ui.input.TableEditorInputMode*/ newInstance = new yworks.yfiles.ui.input.TableEditorInputMode();
        {
          newInstance.stripeDropInputMode.enabled = true;
          var /*yworks.yfiles.ui.input.ReparentStripeHandler*/ newInstance1 = new yworks.yfiles.ui.input.ReparentStripeHandler();
          {
            newInstance1.maxColumnLevel = 2;
            newInstance1.maxRowLevel = 2;
          }
          newInstance.reparentStripeHandler = newInstance1;
        }
        this.$tableEditorInputMode$1 = newInstance;
        //Add to GEIM - we set the priority higher than for the handle input mode so that handles win if both gestures are possible
        this.$graphEditorInputMode$1.addConcurrentWithPriority(this.$tableEditorInputMode$1, this.$graphEditorInputMode$1.handleModePriority + 1);

        //Tooltip and context menu stuff for tables
        this.$graphEditorInputMode$1.mouseHoverInputMode.addQueryToolTipListener(yfiles.lang.delegate(this.$MouseHoverInputMode_QueryToolTip$1, this));


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
        this.$graphEditorInputMode$1.contextMenuItems = yworks.yfiles.ui.model.GraphItemTypes.NODE;
        this.$graphEditorInputMode$1.addPopulateItemContextMenuListener(yfiles.lang.delegate(this.$graphEditorInputMode_PopulateItemContextMenu$1, this));
        this.$graphEditorInputMode$1.addPopulateItemContextMenuListener(yfiles.lang.delegate(this.$graphEditorInputMode_PopulateNodeContextMenu$1, this));

      },
      '$MouseHoverInputMode_QueryToolTip$1': function(/*yfiles.lang.Object*/ sender, /*yworks.canvas.input.ToolTipQueryEventArgs*/ e) {
        if (!e.handled) {
          var /*yworks.yfiles.ui.model.StripeSubregionDescriptor*/ stripe = this.$GetStripe$1(e.queryLocation);
          if (stripe !== null) {
            e.toolTip = stripe.stripe.toString();
            e.handled = true;
          }
        }
      },
      '$graphEditorInputMode_PopulateItemContextMenu$1': function(/*yfiles.lang.Object*/ sender, /*yworks.canvas.input.PopulateItemContextMenuEventArgs<yworks.canvas.model.IModelItem>*/ e) {
        if (!e.handled) {
          var /*yworks.yfiles.ui.model.StripeSubregionDescriptor*/ stripe = this.$GetStripe$1(e.queryLocation);
          if (stripe !== null) {
            var /*yfiles.demo.IButton*/ menuItem = this.$contextMenu$1.createMenuItem("Delete " + stripe.stripe);
            menuItem.command = yworks.support.windows.ApplicationCommands.del;
            menuItem.commandParameter = stripe.stripe;
            menuItem.commandTarget = this.graphControl;

            this.$contextMenu$1.createMenuItem("Insert new stripe before " + stripe.stripe).addEventListener((function(/*Event*/ evt) {
              var /*yworks.yfiles.ui.model.IStripe*/ parent = stripe.stripe.getParent();
              var /*int*/ index = stripe.stripe.getIndex();
              this.$tableEditorInputMode$1.insertChild(parent, index);
            }).bind(this));
            this.$contextMenu$1.createMenuItem("Insert new stripe after " + stripe.stripe).addEventListener((function(/*Event*/ evt) {
              var /*yworks.yfiles.ui.model.IStripe*/ parent = stripe.stripe.getParent();
              var /*int*/ index = stripe.stripe.getIndex();
              this.$tableEditorInputMode$1.insertChild(parent, index + 1);
            }).bind(this));
            e.handled = true;
          }
        }
      },
      '$graphEditorInputMode_PopulateNodeContextMenu$1': function(/*yfiles.lang.Object*/ sender, /*yworks.canvas.input.PopulateItemContextMenuEventArgs<yworks.canvas.model.IModelItem>*/ e) {
        if (!e.handled) {
          var /*yworks.canvas.model.IModelItem*/ tableNode = this.$graphEditorInputMode$1.findItemFiltered(e.queryLocation, [yworks.yfiles.ui.model.GraphItemTypes.NODE], (function(/*yworks.canvas.model.IModelItem*/ item) {
            return item.lookup(yworks.yfiles.ui.model.ITable.$class) !== null;
          }).bind(this));
          if (tableNode !== null) {
            this.$contextMenu$1.createMenuItem("ContextMenu for " + tableNode);
            e.handled = true;
          }
        }
      },
      '$GetStripe$1': function(/*yworks.canvas.geometry.structs.PointD*/ location) {
        return this.$tableEditorInputMode$1.findStripe(location.clone(), yworks.yfiles.ui.model.StripeTypes.ALL, yworks.yfiles.ui.model.StripeSubregion.HEADER);
      },
      '$InitializeGraph$1': function() {
        this.graph.lookup(yworks.yfiles.ui.model.DefaultGraph.$class).groupingSupported = true;
        this.graph.nodeDefaults.style = this.$defaultNormalNodeStyle$1;
        this.graph.nodeDefaults.size = this.$defaultNodeSize$1.clone();
        this.graph.getGroupedGraph().groupNodeDefaults.style = this.$defaultGroupNodeStyle$1;
        this.graph.getGroupedGraph().groupNodeDefaults.size = this.$defaultNodeSize$1.clone();
        //We load a sample graph
        this.$ReadSampleGraph$1();
      },
      '$ReadSampleGraph$1': function() {
        this.graphControl.graph.clear();
        var /*yfiles.lang.String*/ fileName = "resources/sample.graphml";
        var /*yworks.yfiles.graphml.GraphMLIOHandler*/ ioHandler = new yworks.yfiles.graphml.GraphMLIOHandler();
        ioHandler.addParsedListener((function(/*yfiles.lang.Object*/ sender, /*yworks.yfiles.graphml.parser.ParseEventArgs*/ args) {
          this.$GraphLoaded$1();
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
      },
      '$GraphLoaded$1': function() {
        this.graphControl.fitGraphBounds();

        var /*yworks.yfiles.ui.model.DefaultGraph*/ defaultGraph = this.graphControl.graph.lookup(yworks.yfiles.ui.model.DefaultGraph.$class);
        if (defaultGraph !== null) {
          //Configure Undo...
          //Enable general undo support
          defaultGraph.undoEngineEnabled = true;
          //Use the undo support from the graph also for all future table instances
          yworks.yfiles.ui.model.Table.registerStaticUndoSupport(this.graph, this.graph.lookup(yworks.support.IUndoSupport.$class));
        }
      },
      'graph': {
        'get': function() {
          return this.graphControl.graph;
        }
      },
      '$ApplyLayout$1': function() {
        try {
          var /*yworks.yfiles.layout.hierarchic.IncrementalHierarchicLayouter*/ newInstance = new yworks.yfiles.layout.hierarchic.IncrementalHierarchicLayouter();
          {
            newInstance.componentLayouterEnabled = false;
            newInstance.layoutOrientation = yworks.yfiles.layout.LayoutOrientation.LEFT_TO_RIGHT;
            newInstance.orthogonalRouting = true;
            newInstance.recursiveGroupLayering = false;
          }
          var /*yworks.yfiles.layout.hierarchic.IncrementalHierarchicLayouter*/ ihl = newInstance;
          (/*(yworks.yfiles.layout.hierarchic.incremental.SimplexNodePlacer)*/ihl.nodePlacer).baryCenterMode = true;

          //We use Layout executor convenience method that already sets up the whole layout pipeline correctly
          var /*yworks.yfiles.ui.model.LayoutExecutor*/ newInstance1 = new yworks.yfiles.ui.model.LayoutExecutor.FromControlAndLayouter(this.graphControl, ihl);
          {
            newInstance1.configureTableNodeLayout = true;
            newInstance1.duration = yfiles.system.TimeSpan.fromMilliseconds(500);
            newInstance1.animateViewport = true;
            newInstance1.tableLayoutConfigurator.compactionEnabled = false;
          }
          var /*yworks.yfiles.ui.model.LayoutExecutor*/ layoutExecutor = newInstance1;
          layoutExecutor.start();
        } catch ( /*yfiles.lang.Exception*/ exception ) {
          {
            console.log(exception);
          }
        }
      },
      '$$init$1': function() {
        this.$defaultGroupNodeStyle$1 = demo.yfiles.graph.tableeditor.TableEditorDemo.initializer(new yworks.yfiles.ui.drawing.ShapeNodeStyle(), yworks.yfiles.ui.drawing.ShapeNodeShape.ROUND_RECTANGLE, yworks.support.windows.Brushes.transparent, demo.yfiles.graph.tableeditor.TableEditorDemo.initializer1(new yworks.support.windows.Pen.FromBrushAndThickness(yworks.support.windows.Brushes.black, 1), yworks.support.windows.DashStyles.dashDot));
        this.$defaultNormalNodeStyle$1 = demo.yfiles.graph.tableeditor.TableEditorDemo.initializer2(new yworks.yfiles.ui.drawing.ShinyPlateNodeStyle.WithColor(yworks.support.windows.Colors.orange));
        this.$defaultNodeSize$1 = new yworks.canvas.geometry.structs.SizeD(80, 50);
      },
      '$static': {
        'initializer': function(/*final yworks.yfiles.ui.drawing.ShapeNodeStyle*/ instance, /*yfiles.lang.Object*/ p1, /*yfiles.lang.Object*/ p2, /*yfiles.lang.Object*/ p3) {
          instance.shape = p1;
          instance.brush = p2;
          instance.pen = p3;
          return instance;
        },
        'initializer1': function(/*final yworks.support.windows.Pen*/ instance1, /*yfiles.lang.Object*/ p1) {
          instance1.dashStyle = p1;
          return instance1;
        },
        'initializer2': function(/*final yworks.yfiles.ui.drawing.ShinyPlateNodeStyle*/ instance2) {
          instance2.radius = 0;
          return instance2;
        },
        'MyNodeDropInputMode': new yfiles.ClassDefinition(function() {
          return {
            '$extends': yworks.yfiles.ui.input.NodeDropInputMode,
            'constructor': function() {
              yworks.yfiles.ui.input.NodeDropInputMode.call(this);
            },
            'getDropTargetParentNode': function(/*yworks.yfiles.ui.model.IGroupedGraph*/ groupedGraph) {
              //Ok, this node has a table associated - disallow dragging into a group node.
              if (this.getDraggedNode().lookup(yworks.yfiles.ui.model.ITable.$class) !== null) {
                return null;
              }
              return demo.yfiles.graph.tableeditor.TableEditorDemo.MyNodeDropInputMode.$super.getDropTargetParentNode.call(this, groupedGraph);
            }
          };
        }),
        'MyReparentHandler': new yfiles.ClassDefinition(function() {
          return {
            '$with': [yworks.yfiles.ui.input.IReparentNodeHandler],
            'constructor': function(/*yworks.yfiles.ui.input.IReparentNodeHandler*/ coreHandler) {
              this.$coreHandler$0 = coreHandler;
            },
            '$coreHandler$0': null,
            'isReparentGesture': function(/*yworks.canvas.input.IInputModeContext*/ context, /*yworks.yfiles.ui.model.INode*/ node) {
              return this.$coreHandler$0.isReparentGesture(context, node);
            },
            'canReparent': function(/*yworks.canvas.input.IInputModeContext*/ context, /*yworks.yfiles.ui.model.INode*/ node) {
              //Ok, this node has a table associated - disallow dragging into a group node.
              if (node.lookup(yworks.yfiles.ui.model.ITable.$class) !== null) {
                return false;
              }
              return this.$coreHandler$0.canReparent(context, node);
            },
            'isValidParent': function(/*yworks.canvas.input.IInputModeContext*/ context, /*yworks.yfiles.ui.model.INode*/ node, /*yworks.yfiles.ui.model.INode*/ newParent) {
              return this.$coreHandler$0.isValidParent(context, node, newParent);
            },
            'reparent': function(/*yworks.canvas.input.IInputModeContext*/ context, /*yworks.yfiles.ui.model.INode*/ node, /*yworks.yfiles.ui.model.INode*/ newParent) {
              this.$coreHandler$0.reparent(context, node, newParent);
            }
          };
        })
      }
    };
  })


});});
