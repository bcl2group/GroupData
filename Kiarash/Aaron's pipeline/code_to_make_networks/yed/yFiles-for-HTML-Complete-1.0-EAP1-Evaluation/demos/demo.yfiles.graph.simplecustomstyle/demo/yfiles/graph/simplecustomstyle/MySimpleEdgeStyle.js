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
   * This class is an example for a custom edge style based on {@link yworks.yfiles.ui.drawing.SimpleAbstractEdgeStyle}.
   * The s created by this instance are of type {@link yworks.canvas.CanvasContainer}
   * so this is used as the generic type parameter.
   */
  /*public*/ exports.MySimpleEdgeStyle = new yfiles.ClassDefinition(function() {
    return {
      '$extends': yworks.yfiles.ui.drawing.SimpleAbstractEdgeStyle,
      'constructor': function() {
        yworks.yfiles.ui.drawing.SimpleAbstractEdgeStyle.call(this, yworks.canvas.CanvasContainer.$class);
        this.arrows = new demo.yfiles.graph.simplecustomstyle.MySimpleArrow();
        this.pathThickness = 3;
      },
      // the default stroke for rendering the path
      // #region Constructor
      // #endregion 
      // #region Properties
      '$pathThickness$1': 0,
      /**
       * Gets or sets the thickness of the edge
       */
      'pathThickness': {
        '$meta': [yworks.util.annotation.DefaultValueAttribute.DefaultValueAttribute(3.0)],
        'get': function() {
          return this.$pathThickness$1;
        },
        'set': function(/*double*/ value) {
          this.$pathThickness$1 = value;
        }
      },
      '$arrows$1': null,
      /**
       * Gets or sets the arrows drawn at the beginning and at the end of the edge.
       */
      'arrows': {
        'get': function() {
          return this.$arrows$1;
        },
        'set': function(/*yworks.yfiles.ui.drawing.IArrow*/ value) {
          this.$arrows$1 = value;
        }
      },
      // #endregion 
      // #region Rendering
      'createVisual': function(/*yworks.yfiles.ui.model.IEdge*/ edge, /*yworks.canvas.drawing.IRenderContext*/ renderContext) {
        // This implementation creates a CanvasContainer and uses it for the rendering of the edge.
        var /*yworks.canvas.CanvasContainer*/ visual = new yworks.canvas.CanvasContainer();
        // Get the necessary data for rendering of the edge
        var /*demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle.RenderDataCache*/ cache = this.$CreateRenderDataCache$1(renderContext, edge);
        // Render the edge
        this.$Render$1(renderContext, edge, visual, cache);
        return visual;
      },
      'updateVisual': function(/*yworks.yfiles.ui.model.IEdge*/ edge, /*yworks.canvas.drawing.IRenderContext*/ renderContext, /*yworks.canvas.CanvasContainer*/ oldVisual) {
        // get the data with wich the oldvisual was created
        var /*demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle.RenderDataCache*/ oldCache = yworks.canvas.svg.SVGExtensions.getRenderDataCache(demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle.RenderDataCache.$class, oldVisual);
        // get the data for the new visual
        var /*demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle.RenderDataCache*/ newCache = this.$CreateRenderDataCache$1(renderContext, edge);

        // check if something changed
        if (newCache.$Equals$0(oldCache)) {
          // nothing changed, return the old visual
          return oldVisual;
        }
        // something changed - re-render the visual
        oldVisual.children.clear();
        this.$Render$1(renderContext, edge, oldVisual, newCache);
        return oldVisual;
      },
      '$CreateRenderDataCache$1': function(/*yworks.canvas.drawing.IRenderContext*/ context, /*yworks.yfiles.ui.model.IEdge*/ edge) {
        var /*yworks.yfiles.ui.model.IGraphSelection*/ selection = context.canvas !== null ? context.canvas.lookup(yworks.yfiles.ui.model.IGraphSelection.$class) : null;
        var /*boolean*/ selected = selection !== null && selection.isSelected(edge);
        return new demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle.RenderDataCache(this.pathThickness, selected, this.getPath(edge), this.arrows);
      },
      '$Render$1': function(/*yworks.canvas.drawing.IRenderContext*/ context, /*yworks.yfiles.ui.model.IEdge*/ edge, /*yworks.canvas.CanvasContainer*/ container, /*demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle.RenderDataCache*/ cache) {
        // store information with the visual on how we created it
        container.setRenderDataCache(cache);

        var /*yworks.canvas.drawing.GeneralPath*/ gp = /*(yworks.canvas.drawing.GeneralPath)*/cache.generalPath.clone();
        var /*yworks.canvas.drawing.headless.PathVisual*/ path = new yworks.canvas.drawing.headless.PathVisual.FromPathTransformAndFillMode(gp, null, yworks.canvas.drawing.FillMode.NEVER);

        demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle.ANIMATED_PATH_STROKE.thickness = cache.pathThickness;
        demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle.ANIMATED_PATH_STROKE.lineJoin = yworks.canvas.drawing.headless.PenLineJoin.ROUND;
        demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle.PATH_STROKE.thickness = cache.pathThickness;
        demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle.PATH_STROKE.lineJoin = yworks.canvas.drawing.headless.PenLineJoin.ROUND;
        if (cache.selected) {
          // Fill for selected state
          path.setPen(demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle.ANIMATED_PATH_STROKE, context);
        } else {
          // Fill for non-selected state
          path.setPen(demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle.PATH_STROKE, context);
        }

        container.add(path);

        // add the arrows to the container
        demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle.$super.addArrows.call(this, context, container, edge, gp, cache.arrows, cache.arrows);
      },
      // #endregion 
      // #region Rendering Helper Methods
      'getPath': function(/*yworks.yfiles.ui.model.IEdge*/ edge) {
        // Create a general path from the locations of the ports and the bends of the edge.
        /*final*/ var /*yfiles.lang.Reference<yworks.canvas.drawing.GeneralPath>*/ path = {
          'value': new yworks.canvas.drawing.GeneralPath()
        };
        path.value.moveToPoint(edge.sourcePort.location);
        var /*yfiles.util.IEnumerator*/ tmpEnumerator = edge.bends.getEnumerator();
        while (tmpEnumerator.moveNext()) {
          var /*yworks.yfiles.ui.model.IBend*/ bend = tmpEnumerator.current;
          {
            path.value.lineToPoint(bend.location);
          }
        }
        path.value.lineToPoint(edge.targetPort.location);

        // shorten the path in order to provide room for drawing the arrows.
        demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle.$super.cropPath.call(this, edge, this.arrows, this.arrows, path);
        return path.value;
      },
      'isHit': function(/*yworks.yfiles.ui.model.IEdge*/ edge, /*yworks.canvas.geometry.structs.PointD*/ p, /*yworks.canvas.ICanvasContext*/ canvasContext) {
        // Use the convenience method in GeneralPath
        return this.getPath(edge).pathContains(p.clone(), canvasContext.hitTestRadius + this.pathThickness * 0.5);
      },
      // #endregion 
      'lookup': function(/*yworks.yfiles.ui.model.IEdge*/ edge, /*yfiles.lang.Class*/ type) {
        if (type === yworks.canvas.model.ISelectionInstaller.$class) {
          return new demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle.MySelectionInstaller();
        } else {
          return demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle.$super.lookup.call(this, edge, type);
        }
      },
      '$static': {
        'PATH_STROKE': null,
        'ANIMATED_PATH_STROKE': null,
        'MySelectionInstaller': new yfiles.ClassDefinition(function() {
          return {
            '$extends': yworks.yfiles.ui.drawing.EdgeSelectionRenderer,
            'constructor': function() {
              yworks.yfiles.ui.drawing.EdgeSelectionRenderer.call(this);
            },
            'getPen': function(/*yworks.canvas.model.IInstallerContext*/ context, /*yworks.yfiles.ui.model.IEdge*/ edge) {
              return null;
            }
          };
        }),
        'RenderDataCache': new yfiles.ClassDefinition(function() {
          return {
            'constructor': function(/*double*/ pathThickness, /*boolean*/ selected, /*yworks.canvas.drawing.GeneralPath*/ generalPath, /*yworks.yfiles.ui.drawing.IArrow*/ arrows) {
              this.pathThickness = pathThickness;
              this.selected = selected;
              this.generalPath = generalPath;
              this.arrows = arrows;
            },
            '$pathThickness$0': 0,
            'pathThickness': {
              'get': function() {
                return this.$pathThickness$0;
              },
              'set': function(/*double*/ value) {
                this.$pathThickness$0 = value;
              }
            },
            '$selected$0': false,
            'selected': {
              'get': function() {
                return this.$selected$0;
              },
              'set': function(/*boolean*/ value) {
                this.$selected$0 = value;
              }
            },
            '$generalPath$0': null,
            'generalPath': {
              'get': function() {
                return this.$generalPath$0;
              },
              'set': function(/*yworks.canvas.drawing.GeneralPath*/ value) {
                this.$generalPath$0 = value;
              }
            },
            '$arrows$0': null,
            'arrows': {
              'get': function() {
                return this.$arrows$0;
              },
              'set': function(/*yworks.yfiles.ui.drawing.IArrow*/ value) {
                this.$arrows$0 = value;
              }
            },
            '$Equals$0': function(/*demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle.RenderDataCache*/ other) {
              return other.pathThickness === this.pathThickness && other.selected === this.selected && yfiles.lang.Object.equals(other.arrows, this.arrows) && (/*(yfiles.system.IEquatable<yworks.canvas.drawing.GeneralPath>)*/other.generalPath).equalsTyped(this.generalPath);
            },
            'equals': function(/*yfiles.lang.Object*/ obj) {
              if (yfiles.lang.Object.referenceEquals(null, obj)) {
                return false;
              }
              if (yfiles.lang.getType(obj) !== demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle.RenderDataCache.$class) {
                return false;
              }
              return this.$Equals$0(/*(demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle.RenderDataCache)*/obj);
            }
          };
        }),
        '$clinit': function() {
          demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle.PATH_STROKE = new yworks.support.windows.Pen.FromBrush(new yworks.canvas.drawing.headless.SolidColorBrush(yworks.canvas.drawing.headless.Color.fromArgb(200, 0, 130, 180)));
          demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle.ANIMATED_PATH_STROKE = new yworks.support.windows.Pen.FromBrush(new yworks.canvas.drawing.headless.SolidColorBrush(yworks.canvas.drawing.headless.Color.fromArgb(255, 255, 245, 30)));
        }
      }
    };
  })


});});
