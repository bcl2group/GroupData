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

  /**
   * A very simple implementation of an {@link yworks.yfiles.ui.drawing.INodeStyle}
   * that uses the convenience class {@link yworks.yfiles.ui.drawing.SimpleAbstractNodeStyle}
   * as the base class.
   */
  /*public*/ exports.MySimpleNodeStyle = new yfiles.ClassDefinition(function() {
    return {
      '$extends': yworks.yfiles.ui.drawing.SimpleAbstractNodeStyle,
      'constructor': function() {
        yworks.yfiles.ui.drawing.SimpleAbstractNodeStyle.call(this, yworks.canvas.CanvasContainer.$class);
        this.nodeColor = yworks.canvas.drawing.headless.Color.fromArgb(0xc8, 0x00, 0x82, 0xb4);
      },
      // support instance that handles the defs element of the pre-rendered dropshadow image;
      // #region Node Color
      '$nodeColor$1': null,
      /**
       * Gets or sets the fill color of the node.
       */
      'nodeColor': {
        '$meta': function() {
          return [yworks.util.annotation.DefaultValueAttribute.DefaultValueAttribute1(yworks.canvas.drawing.headless.Color.$class, "#C80082B4")];
        },
        'get': function() {
          return this.$nodeColor$1;
        },
        'set': function(/*yworks.canvas.drawing.headless.Color*/ value) {
          this.$nodeColor$1 = value;
        }
      },
      'getNodeColor': function(/*yworks.yfiles.ui.model.INode*/ node) {
        // the color can be obtained from the "business data" that can be associated with
        // each node, or use the value from this instance.
        return node.tag instanceof yworks.canvas.drawing.headless.Color ? /*(yworks.canvas.drawing.headless.Color)*/node.tag : this.nodeColor;
      },
      // #endregion 
      // #region Constructor
      '$CreateDropShadow$1': function(/*yworks.canvas.ICanvasContext*/ ctx) {
        var /*HTMLCanvasElement*/ canvas = /*(HTMLCanvasElement)*/window.document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 64;
        var /*CanvasContext*/ context = canvas.getContext("2d");
        context.fillStyle = "rgb(0, 0, 0)";
        context.globalAlpha = 0.5;
        context.beginPath();
        context.arc(32, 32, 16, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();

        yworks.canvas.drawing.ImageSupport.gaussianBlurWithhetaAndSize(canvas, 2, 9);

        var /*stubs.imageType*/ image = window.document.createElementNS("http://www.w3.org/2000/svg", "image");
        image.setAttribute("width", "64");
        image.setAttribute("height", "64");
        image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", canvas.toDataURL("image/png"));

        demo.yfiles.graph.simplecustomstyle.MySimpleNodeStyle.dropShadowDefsSupport = new demo.yfiles.graph.simplecustomstyle.MySimpleNodeStyle.DropShadowDefsSupport(image);
      },
      // #endregion 
      // #region Rendering
      'createVisual': function(/*yworks.yfiles.ui.model.INode*/ node, /*yworks.canvas.drawing.IRenderContext*/ renderContext) {
        if (demo.yfiles.graph.simplecustomstyle.MySimpleNodeStyle.dropShadowDefsSupport === null) {
          this.$CreateDropShadow$1(renderContext);
        }
        // This implementation creates a CanvasContainer and uses it for the rendering of the node.
        var /*yworks.canvas.CanvasContainer*/ visual = new yworks.canvas.CanvasContainer();
        // Get the necessary data for rendering of the edge
        var /*demo.yfiles.graph.simplecustomstyle.MySimpleNodeStyle.RenderDataCache*/ cache = this.$CreateRenderDataCache$1(renderContext, node);
        // Render the node
        this.$Render$1(renderContext, node, visual, cache);
        // set the location
        visual.transform = new yworks.canvas.geometry.Matrix2D.FromValues(1, 0, 0, 1, node.layout.x, node.layout.y);
        return visual;
      },
      'updateVisual': function(/*yworks.yfiles.ui.model.INode*/ node, /*yworks.canvas.drawing.IRenderContext*/ renderContext, /*yworks.canvas.CanvasContainer*/ oldVisual) {
        // get the data with wich the oldvisual was created
        var /*demo.yfiles.graph.simplecustomstyle.MySimpleNodeStyle.RenderDataCache*/ oldCache = yworks.canvas.svg.SVGExtensions.getRenderDataCache(demo.yfiles.graph.simplecustomstyle.MySimpleNodeStyle.RenderDataCache.$class, oldVisual);
        // get the data for the new visual
        var /*demo.yfiles.graph.simplecustomstyle.MySimpleNodeStyle.RenderDataCache*/ newCache = this.$CreateRenderDataCache$1(renderContext, node);

        // check if something changed except for the location of the node
        if (!newCache.$Equals$0(oldCache)) {
          // something changed - re-render the visual
          oldVisual.children.clear();
          this.$Render$1(renderContext, node, oldVisual, newCache);
        }
        // make sure that the location is up to date
        oldVisual.transform = new yworks.canvas.geometry.Matrix2D.FromValues(1, 0, 0, 1, node.layout.x, node.layout.y);
        return oldVisual;
      },
      '$CreateRenderDataCache$1': function(/*yworks.canvas.drawing.IRenderContext*/ renderContext, /*yworks.yfiles.ui.model.INode*/ node) {
        // If Tag is set to a Color, use it as background color of the node
        var /*yworks.canvas.drawing.headless.Color*/ c = (node.tag instanceof yworks.canvas.drawing.headless.Color) ? /*(yworks.canvas.drawing.headless.Color)*/node.tag : yworks.canvas.drawing.headless.Color.fromArgb(200, 0, 130, 180);

        var /*yfiles.system.collections.generic.List<yworks.canvas.geometry.structs.PointD>*/ labelLocations = new yfiles.system.collections.generic.List/*<yworks.canvas.geometry.structs.PointD>*/();
        // Remember center points of labels to draw label edges, relative the node's top left corner
        var /*yfiles.util.IEnumerator*/ tmpEnumerator = node.labels.getEnumerator();
        while (tmpEnumerator.moveNext()) {
          var /*yworks.yfiles.ui.model.ILabel*/ label = tmpEnumerator.current;
          {
            var /*yworks.canvas.geometry.structs.PointD*/ labelCenter = label.layout.getCenter();
            labelLocations.add(yworks.canvas.geometry.structs.PointD.subtract(labelCenter, node.layout.getTopLeft()));
          }
        }
        return new demo.yfiles.graph.simplecustomstyle.MySimpleNodeStyle.RenderDataCache(c, node.layout.toSize(), labelLocations);
      },
      '$Render$1': function(/*yworks.canvas.drawing.IRenderContext*/ renderContext, /*yworks.yfiles.ui.model.INode*/ node, /*yworks.canvas.CanvasContainer*/ container, /*demo.yfiles.graph.simplecustomstyle.MySimpleNodeStyle.RenderDataCache*/ cache) {
        // store information with the visual on how we created it
        container.setRenderDataCache(cache);

        // draw the dropshadow
        this.$DrawShadow$1(renderContext, container, cache.size);
        // draw edges to node labels
        this.$RenderLabelEdges$1(node, renderContext, container, cache);

        // Create inner container for node visualizations
        var /*yworks.canvas.CanvasContainer*/ nodeContainer = new yworks.canvas.CanvasContainer();
        container.children.add(nodeContainer);

        // determine the color to use for the rendering
        var /*yworks.canvas.drawing.headless.Color*/ color = this.getNodeColor(node);

        // the size of node
        var /*yworks.canvas.geometry.structs.SizeD*/ nodeSize = cache.size;

        var /*yworks.canvas.drawing.headless.EllipseVisual*/ shape = new yworks.canvas.drawing.headless.EllipseVisual.FromRectangleBounds(new yworks.canvas.geometry.Rectangle(0, 0, nodeSize.$width, nodeSize.$height));

        // max and min needed for reflection effect calculation
        var /*double*/ max = Math.max(nodeSize.$width, nodeSize.$height);
        var /*double*/ min = Math.min(nodeSize.$width, nodeSize.$height);
        // Create Background gradient from specified background color
        var /*yworks.canvas.drawing.headless.LinearGradientBrush*/ newInstance = new yworks.canvas.drawing.headless.LinearGradientBrush();
        {
          var /*yworks.canvas.drawing.headless.GradientStop*/ newInstance1 = new yworks.canvas.drawing.headless.GradientStop();
          {
            newInstance1.color = yworks.canvas.drawing.headless.Color.fromArgb(((/*(byte)*/Math.max(0, color.a - 50)) | 0), ((/*(byte)*/Math.min(255, color.r * 1.4)) | 0), ((/*(byte)*/Math.min(255, color.g * 1.4)) | 0), ((/*(byte)*/Math.min(255, color.b * 1.4)) | 0));
            newInstance1.offset = 0;
          }
          newInstance.gradientStops.add(newInstance1);
          var /*yworks.canvas.drawing.headless.GradientStop*/ newInstance2 = new yworks.canvas.drawing.headless.GradientStop();
          {
            newInstance2.color = color;
            newInstance2.offset = 0.5;
          }
          newInstance.gradientStops.add(newInstance2);
          var /*yworks.canvas.drawing.headless.GradientStop*/ newInstance3 = new yworks.canvas.drawing.headless.GradientStop();
          {
            newInstance3.color = yworks.canvas.drawing.headless.Color.fromArgb(((/*(int)*/Math.max(0, color.a - 50)) | 0), ((/*(int)*/Math.min(255, color.r * 1.7)) | 0), ((/*(int)*/Math.min(255, color.g * 1.7)) | 0), ((/*(int)*/Math.min(255, color.b * 1.7)) | 0));
            newInstance3.offset = 1;
          }
          newInstance.gradientStops.add(newInstance3);
          newInstance.startPoint = new yworks.canvas.geometry.structs.PointD(0, 0);
          newInstance.endPoint = new yworks.canvas.geometry.structs.PointD(0.5 / (nodeSize.$width / max), 1 / (nodeSize.$height / max));
          newInstance.spreadMethod = yworks.canvas.drawing.headless.GradientSpreadMethod.PAD;
        }
        shape.setBrush(newInstance, renderContext);

        // Create light reflection effects
        var /*yworks.canvas.drawing.headless.EllipseVisual*/ reflection1 = new yworks.canvas.drawing.headless.EllipseVisual.FromRectangleBounds(new yworks.canvas.geometry.Rectangle(0, 0, min / 10, min / 10));
        reflection1.setBrush(yworks.support.windows.Brushes.white, renderContext);
        var /*yworks.canvas.drawing.headless.EllipseVisual*/ reflection2 = new yworks.canvas.drawing.headless.EllipseVisual.FromRectangleBounds(new yworks.canvas.geometry.Rectangle(0, 0, min / 7, min / 7));
        reflection2.setBrush(yworks.support.windows.Brushes.aliceBlue, renderContext);

        var /*yworks.canvas.drawing.GeneralPath*/ reflection3Path = new yworks.canvas.drawing.GeneralPath();
        var /*yworks.canvas.geometry.Point*/ startPoint = new yworks.canvas.geometry.Point(nodeSize.$width / 2.5, nodeSize.$height / 10 * 9);
        var /*yworks.canvas.geometry.Point*/ endPoint = new yworks.canvas.geometry.Point(nodeSize.$width / 10 * 9, nodeSize.$height / 2.5);
        var /*yworks.canvas.geometry.Point*/ ctrlPoint1 = new yworks.canvas.geometry.Point(startPoint.x + (endPoint.x - startPoint.x) / 2, nodeSize.$height);
        var /*yworks.canvas.geometry.Point*/ ctrlPoint2 = new yworks.canvas.geometry.Point(nodeSize.$width, startPoint.y + (endPoint.y - startPoint.y) / 2);
        var /*yworks.canvas.geometry.Point*/ ctrlPoint3 = new yworks.canvas.geometry.Point(ctrlPoint1.x, ctrlPoint1.y - nodeSize.$height / 10);
        var /*yworks.canvas.geometry.Point*/ ctrlPoint4 = new yworks.canvas.geometry.Point(ctrlPoint2.x - nodeSize.$width / 10, ctrlPoint2.y);

        reflection3Path.moveToPoint(startPoint);
        reflection3Path.cubicToPoints(ctrlPoint1, ctrlPoint2, endPoint);
        reflection3Path.cubicToPoints(ctrlPoint4, ctrlPoint3, startPoint);

        var /*yworks.canvas.drawing.headless.PathVisual*/ reflection3 = new yworks.canvas.drawing.headless.PathVisual.FromPathTransformAndFillMode(reflection3Path, null, yworks.canvas.drawing.FillMode.ALWAYS);

        reflection3.setBrush(yworks.support.windows.Brushes.aliceBlue, renderContext);

        // place the reflections
        reflection1.transform = new yworks.canvas.geometry.Matrix2D.FromValues(1, 0, 0, 1, nodeSize.$width / 5, nodeSize.$height / 5);
        reflection2.transform = new yworks.canvas.geometry.Matrix2D.FromValues(1, 0, 0, 1, nodeSize.$width / 4.9, nodeSize.$height / 4.9);
        // and add all to the container for the node
        nodeContainer.children.add(shape);
        nodeContainer.children.add(reflection2);
        nodeContainer.children.add(reflection1);
        nodeContainer.children.add(reflection3);
      },
      '$DrawShadow$1': function(/*yworks.canvas.ICanvasContext*/ ctx, /*yworks.canvas.CanvasContainer*/ visual, /*yworks.canvas.geometry.structs.SizeD*/ size) {
        /*final*/ var /*int*/ tileSize = 32;
        /*final*/ var /*int*/ tileSize2 = 16;
        /*final*/ var /*int*/ offsetY = 2;
        /*final*/ var /*int*/ offsetX = 2;

        var /*double*/ xScaleFactor = size.$width / tileSize;
        var /*double*/ yScaleFactor = size.$height / tileSize;

        var /*yfiles.lang.String*/ defsId = ctx.getDefsId(demo.yfiles.graph.simplecustomstyle.MySimpleNodeStyle.dropShadowDefsSupport);
        var /*yworks.canvas.drawing.headless.UseVisual*/ imageCompleteImage = new yworks.canvas.drawing.headless.UseVisual.WithId(defsId);
        imageCompleteImage.transform = new yworks.canvas.geometry.Matrix2D.FromValues(xScaleFactor, 0, 0, yScaleFactor, offsetX - tileSize2 * xScaleFactor, offsetY - tileSize2 * yScaleFactor);
        visual.add(imageCompleteImage);
      },
      '$RenderLabelEdges$1': function(/*yworks.yfiles.ui.model.INode*/ node, /*yworks.canvas.drawing.IRenderContext*/ renderContext, /*yworks.canvas.CanvasContainer*/ container, /*demo.yfiles.graph.simplecustomstyle.MySimpleNodeStyle.RenderDataCache*/ cache) {
        if (node.labels.count > 0) {
          var /*yworks.yfiles.ui.model.BendList*/ bends = new yworks.yfiles.ui.model.BendList();
          // Create a SimpleEdge which will be used as a dummy for the rendering
          var /*yworks.yfiles.ui.model.SimpleEdge*/ simpleEdge = new yworks.yfiles.ui.model.SimpleEdge.FromLabelsPortsAndBends(yworks.support.EmptyListEnumerable.INSTANCE, null, null, bends);
          // Assign the style
          var /*demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle*/ newInstance = new demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle();
          {
            newInstance.pathThickness = 2;
          }
          simpleEdge.style = newInstance;

          // Create a SimpleNode which provides the sourceport for the edge but won't be drawn itself
          var /*yworks.yfiles.ui.model.SimpleNode*/ newInstance1 = new yworks.yfiles.ui.model.SimpleNode.WithLabelsLayoutAndPorts(yworks.support.EmptyListEnumerable.INSTANCE, yworks.canvas.geometry.ImmutableRectangle.EMPTY, yworks.support.EmptyListEnumerable.INSTANCE);
          {
            newInstance1.layout = new yworks.canvas.geometry.structs.RectD(0, 0, node.layout.width, node.layout.height);
            newInstance1.style = node.style;
          }
          var /*yworks.yfiles.ui.model.SimpleNode*/ sourceDummyNode = newInstance1;


          // Set sourceport to the port of the node using a dummy node that is located at the origin.
          simpleEdge.sourcePort = new yworks.yfiles.ui.model.SimplePort.WithParameterAndOwner(yworks.yfiles.ui.portlocationmodels.NodeScaledPortLocationModel.NODE_CENTER_ANCHORED, sourceDummyNode);

          // Create a SimpleNode which provides the targetport for the edge but won't be drawn itself
          var /*yworks.yfiles.ui.model.SimpleNode*/ targetDummyNode = new yworks.yfiles.ui.model.SimpleNode.WithLabelsLayoutAndPorts(yworks.support.EmptyListEnumerable.INSTANCE, yworks.canvas.geometry.ImmutableRectangle.EMPTY, yworks.support.EmptyListEnumerable.INSTANCE);

          // Create port on targetDummynode for the label target
          targetDummyNode.ports = new yworks.support.SingletonList/*<yworks.yfiles.ui.model.IPort>*/(new yworks.yfiles.ui.model.SimplePort.WithParameterAndOwner(yworks.yfiles.ui.portlocationmodels.NodeScaledPortLocationModel.NODE_CENTER_ANCHORED, targetDummyNode));
          simpleEdge.targetPort = new yworks.yfiles.ui.model.SimplePort.WithParameterAndOwner(yworks.yfiles.ui.portlocationmodels.NodeScaledPortLocationModel.NODE_CENTER_ANCHORED, targetDummyNode);

          // Render one edge for each label
          var /*yfiles.util.IEnumerator*/ tmpEnumerator = cache.labelLocations.getListEnumerator();
          while (tmpEnumerator.moveNext()) {
            var /*yworks.canvas.geometry.structs.PointD*/ labelLocation = tmpEnumerator.current;
            {
              // move the dummy node to the location of the label
              targetDummyNode.layout = yworks.canvas.geometry.Rectangle.create(labelLocation.$x, labelLocation.$y, 0, 0);

              // now create the visual using the style interface:
              var /*yworks.yfiles.ui.drawing.IEdgeStyleRenderer*/ renderer = simpleEdge.style.renderer;
              var /*yworks.canvas.drawing.IVisualCreator*/ creator = renderer.getVisualCreator(simpleEdge, simpleEdge.style);
              var /*yworks.canvas.drawing.headless.Visual*/ element = creator.createVisual(renderContext);
              if (element !== null) {
                container.add(element);
              }
            }
          }
        }
      },
      // #endregion 
      // #region Rendering Helper Methods
      'getOutline': function(/*yworks.yfiles.ui.model.INode*/ node) {
        var /*yworks.canvas.geometry.structs.RectD*/ rect = node.layout.toRectD();
        var /*yworks.canvas.drawing.GeneralPath*/ outline = new yworks.canvas.drawing.GeneralPath();
        outline.appendEllipse(rect.rectDtoRect(), false);
        return outline;
      },
      'getBounds': function(/*yworks.yfiles.ui.model.INode*/ node, /*yworks.canvas.ICanvasContext*/ canvasContext) {
        var /*yworks.canvas.geometry.structs.RectD*/ bounds = node.layout.toRectD();
        // expand bounds to include dropshadow
        bounds.width = bounds.$width + 3;
        bounds.height = bounds.$height + 3;
        return bounds.clone();
      },
      'isVisible': function(/*yworks.yfiles.ui.model.INode*/ node, /*yworks.canvas.geometry.structs.RectD*/ clip, /*yworks.canvas.ICanvasContext*/ canvasContext) {
        if (demo.yfiles.graph.simplecustomstyle.MySimpleNodeStyle.$super.isVisible.call(this, node, clip.clone(), canvasContext)) {
          return true;
        }
        // check for labels connection lines 
        clip = clip.getEnlarged(10);
        var /*yfiles.util.IEnumerator*/ tmpEnumerator = node.labels.getEnumerator();
        while (tmpEnumerator.moveNext()) {
          var /*yworks.yfiles.ui.model.ILabel*/ label = tmpEnumerator.current;
          {
            if (clip.intersectsLine(node.layout.getRectangleCenter(), label.layout.getCenter())) {
              return true;
            }
          }
        }
        return false;
      },
      'isHit': function(/*yworks.yfiles.ui.model.INode*/ node, /*yworks.canvas.geometry.structs.PointD*/ p, /*yworks.canvas.ICanvasContext*/ canvasContext) {
        return yworks.canvas.geometry.GeomSupport.ellipseContains(node.layout.toRectD(), p.clone(), canvasContext.hitTestRadius);
      },
      'isInBox': function(/*yworks.yfiles.ui.model.INode*/ node, /*yworks.canvas.geometry.structs.RectD*/ box, /*yworks.canvas.ICanvasContext*/ canvasContext) {
        // early exit if not even the bounds are contained in the box
        if (!demo.yfiles.graph.simplecustomstyle.MySimpleNodeStyle.$super.isInBox.call(this, node, box.clone(), canvasContext)) {
          return false;
        }

        var /*double*/ eps = canvasContext.hitTestRadius;

        var /*yworks.canvas.drawing.GeneralPath*/ outline = this.getOutline(node);
        if (outline === null) return false;

        if (outline.intersects(box.clone(), eps)) {
          return true;
        }
        if (outline.pathContains(box.topLeft, eps) && outline.pathContains(box.bottomRight, eps)) {
          return true;
        }
        return (box.containsPointDWithPointD(node.layout.toRectD().topLeft) && box.containsPointDWithPointD(node.layout.toRectD().bottomRight));
      },
      'isInside': function(/*yworks.yfiles.ui.model.INode*/ node, /*yworks.canvas.geometry.structs.PointD*/ point) {
        return yworks.canvas.geometry.GeomSupport.ellipseContains(node.layout.toRectD(), point.clone(), 0);
      },
      // #endregion 
      '$static': {
        'dropShadowDefsSupport': null,
        'DropShadowDefsSupport': new yfiles.ClassDefinition(function() {
          return {
            '$with': [yworks.canvas.drawing.headless.IDefsSupport],
            'constructor': function(/*Element*/ image) {
              this.$image$0 = image;
            },
            '$image$0': null,
            'createDefsElement': function(/*yworks.canvas.ICanvasContext*/ context) {
              return /*(Element)*/this.$image$0;
            },
            'accept': function(/*yworks.canvas.ICanvasContext*/ ctx, /*Node*/ node, /*yfiles.lang.String*/ id) {
              if (node instanceof Element) {
                yworks.canvas.input.SvgDefsUtil.isUseReference(/*(Element)*/node, id);
              }
              return false;
            },
            'updateDefsElement': function(/*Element*/ oldElement, /*yworks.canvas.ICanvasContext*/ context) {}
          };
        }),
        'RenderDataCache': new yfiles.ClassDefinition(function() {
          return {
            'constructor': function(/*yworks.canvas.drawing.headless.Color*/ color, /*yworks.canvas.geometry.structs.SizeD*/ size, /*yfiles.system.collections.generic.List<yworks.canvas.geometry.structs.PointD>*/ labelLocations) {
              this.$$init$0();
              this.color = color;
              this.size = size.clone();
              this.labelLocations = labelLocations;
            },
            '$color$0': null,
            'color': {
              'get': function() {
                return this.$color$0;
              },
              'set': function(/*yworks.canvas.drawing.headless.Color*/ value) {
                this.$color$0 = value;
              }
            },
            '$size$0': null,
            'size': {
              'get': function() {
                return this.$size$0;
              },
              'set': function(/*yworks.canvas.geometry.structs.SizeD*/ value) {
                this.$size$0 = value;
              }
            },
            // Center points of the node's labels relative to the node's top left corner
            '$labelLocations$0': null,
            'labelLocations': {
              'get': function() {
                return this.$labelLocations$0;
              },
              'set': function(/*yfiles.system.collections.generic.List<yworks.canvas.geometry.structs.PointD>*/ value) {
                this.$labelLocations$0 = value;
              }
            },
            '$Equals$0': function(/*demo.yfiles.graph.simplecustomstyle.MySimpleNodeStyle.RenderDataCache*/ other) {
              return yworks.canvas.drawing.headless.Color.equals(other.color, this.color) && other.size.equalsSizeD(this.size) && this.$ListsAreEqual$0(this.labelLocations, other.labelLocations);
            },
            '$ListsAreEqual$0': function(/*yfiles.system.collections.generic.List<T>*/ list1, /*yfiles.system.collections.generic.List<T>*/ list2) {
              if (list1.count !== list2.count) {
                return false;
              }
              for (var /*int*/ i = 0; i < list1.count; i++) {
                if (!yfiles.lang.Object.equals(list1.get(i), list2.get(i))) {
                  return false;
                }
              }
              return true;
            },
            'equals': function(/*yfiles.lang.Object*/ obj) {
              if (yfiles.lang.Object.referenceEquals(null, obj)) {
                return false;
              }
              if (yfiles.lang.getType(obj) !== demo.yfiles.graph.simplecustomstyle.MySimpleNodeStyle.RenderDataCache.$class) {
                return false;
              }
              return this.$Equals$0(/*(demo.yfiles.graph.simplecustomstyle.MySimpleNodeStyle.RenderDataCache)*/obj);
            },
            '$$init$0': function() {
              this.$size$0 = yworks.canvas.geometry.structs.SizeD.createDefault();
            }
          };
        })
      }
    };
  })


});});
