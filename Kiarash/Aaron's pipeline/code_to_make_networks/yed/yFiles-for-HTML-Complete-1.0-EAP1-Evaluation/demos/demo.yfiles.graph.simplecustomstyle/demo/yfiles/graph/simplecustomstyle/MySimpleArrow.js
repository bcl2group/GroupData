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

  /*public*/ exports.MySimpleArrow = new yfiles.ClassDefinition(function() {
    return {
      '$with': [yworks.yfiles.ui.drawing.IArrow, yworks.canvas.drawing.IVisualCreator, yworks.canvas.drawing.IBoundsProvider],
      'constructor': function() {
        this.$$init$0();
        this.thickness = 2.0;
      },
      // these variables hold the state for the flyweight pattern
      // they are populated in GetPaintable and used in the implementations of the IVisualCreator interface.
      '$anchor$0': null,
      '$direction$0': null,
      '$arrowFigure$0': null,
      '$thickness$0': 0,
      // #region Constructor
      // #endregion 
      // #region Properties
      /**
       * Returns the length of the arrow, i.e. the distance from the arrow's tip to
       * the position where the visual representation of the edge's path should begin.
       * Always returns 0
       */
      'length': {
        'get': function() {
          return 0;
        }
      },
      /**
       * Gets the cropping length associated with this instance.
       * Always returns 1
       * This value is used by {@link yworks.yfiles.ui.drawing.IEdgeStyle}s to let the
       * edge appear to end shortly before its actual target.
       */
      'cropLength': {
        'get': function() {
          return 1;
        }
      },
      '$thickness$01': 0,
      /**
       * Gets or sets the thickness of the arrow
       */
      'thickness': {
        '$meta': [yworks.util.annotation.DefaultValueAttribute.DefaultValueAttribute(2.0)],
        'get': function() {
          return this.$thickness$01;
        },
        'set': function(/*double*/ value) {
          this.$thickness$01 = value;
        }
      },
      // #endregion 
      // #region IArrow Members
      'getPaintable': function(/*yworks.yfiles.ui.model.IEdge*/ edge, /*boolean*/ atSource, /*yworks.canvas.geometry.structs.PointD*/ anchor, /*yworks.canvas.geometry.structs.PointD*/ direction) {
        this.$ConfigureThickness$0(edge);
        this.$anchor$0 = anchor.clone();
        this.$direction$0 = direction.clone();
        return this;
      },
      'getBoundsProvider': function(/*yworks.yfiles.ui.model.IEdge*/ edge, /*boolean*/ atSource, /*yworks.canvas.geometry.structs.PointD*/ anchor, /*yworks.canvas.geometry.structs.PointD*/ direction) {
        // Get the edge's thickness
        var /*yfiles.lang.Object*/ tmp = edge.style;
        var /*demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle*/ style = (tmp instanceof demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle) ? /*(demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle)*/tmp : null;

        if (style !== null) {
          this.$thickness$0 = style.pathThickness;
        } else {
          this.$thickness$0 = this.thickness;
        }
        this.$anchor$0 = anchor.clone();
        this.$direction$0 = direction.clone();
        return this;
      },
      // #endregion 
      // #region Rendering
      'createVisual': function(/*yworks.canvas.drawing.IRenderContext*/ ctx) {
        // Create a new Path to draw the arrow
        if (this.$arrowFigure$0 === null) {
          this.$arrowFigure$0 = new yworks.canvas.drawing.GeneralPath();
          this.$arrowFigure$0.moveTo(new yworks.canvas.geometry.structs.PointD(7, -this.$thickness$0 / 2));
          this.$arrowFigure$0.lineTo(new yworks.canvas.geometry.structs.PointD(7, this.$thickness$0 / 2));
          this.$arrowFigure$0.cubicTo(new yworks.canvas.geometry.structs.PointD(5, this.$thickness$0 / 2), new yworks.canvas.geometry.structs.PointD(1.5, this.$thickness$0 / 2), new yworks.canvas.geometry.structs.PointD(-1, this.$thickness$0 * 1.666));
          this.$arrowFigure$0.cubicTo(new yworks.canvas.geometry.structs.PointD(0, this.$thickness$0 * 0.833), new yworks.canvas.geometry.structs.PointD(0, -this.$thickness$0 * 0.833), new yworks.canvas.geometry.structs.PointD(-1, -this.$thickness$0 * 1.666));
          this.$arrowFigure$0.cubicTo(new yworks.canvas.geometry.structs.PointD(1.5, -this.$thickness$0 / 2), new yworks.canvas.geometry.structs.PointD(5, -this.$thickness$0 / 2), new yworks.canvas.geometry.structs.PointD(7, -this.$thickness$0 / 2));
          this.$arrowFigure$0.close();
        }

        var /*yworks.canvas.drawing.headless.PathVisual*/ p = new yworks.canvas.drawing.headless.PathVisual.FromPathTransformAndFillMode(this.$arrowFigure$0, null, yworks.canvas.drawing.FillMode.ALWAYS);
        p.setBrush(demo.yfiles.graph.simplecustomstyle.MySimpleArrow.PATH_FILL, ctx);

        // Remember thickness for update
        p.setRenderDataCache(new demo.yfiles.graph.simplecustomstyle.MySimpleArrow.RenderDataCache(this.$thickness$0));

        // Rotate arrow and move it to correct position
        //      p.Transform = new Matrix2D(direction.X, direction.Y, -direction.Y, direction.X, anchor.X, anchor.Y);
        p.transform = new yworks.canvas.geometry.Matrix2D.FromValues(-this.$direction$0.$x, this.$direction$0.$y, -this.$direction$0.$y, -this.$direction$0.$x, this.$anchor$0.$x, this.$anchor$0.$y);
        return p;
      },
      'updateVisual': function(/*yworks.canvas.drawing.IRenderContext*/ ctx, /*yworks.canvas.drawing.headless.Visual*/ oldVisual) {
        // get thickness of old arrow
        var /*double*/ oldThickness = yworks.canvas.svg.SVGExtensions.getRenderDataCache(demo.yfiles.graph.simplecustomstyle.MySimpleArrow.RenderDataCache.$class, oldVisual).value;
        // if thickness has changed
        if (oldThickness !== this.$thickness$0) {
          // re-render arrow
          return (/*(yworks.canvas.drawing.IVisualCreator)*/this).createVisual(ctx);
        } else {
          var /*yworks.canvas.drawing.headless.PathVisual*/ p = (oldVisual instanceof yworks.canvas.drawing.headless.PathVisual) ? /*(yworks.canvas.drawing.headless.PathVisual)*/oldVisual : null;
          if (p !== null) {
            p.transform = new yworks.canvas.geometry.Matrix2D.FromValues(this.$direction$0.$x, this.$direction$0.$y, -this.$direction$0.$y, this.$direction$0.$x, this.$anchor$0.$x, this.$anchor$0.$y);
            return p;
          }

          return (/*(yworks.canvas.drawing.IVisualCreator)*/this).createVisual(ctx);
        }
      },
      // #endregion 
      // #region Rendering Helper Methods
      'getBounds': function(/*yworks.canvas.ICanvasContext*/ ctx) {
        return new yworks.canvas.geometry.structs.RectD(this.$anchor$0.$x - 8 - this.$thickness$0, this.$anchor$0.$y - 8 - this.$thickness$0, 16 + this.$thickness$0 * 2, 16 + this.$thickness$0 * 2);
      },
      // #endregion 
      '$ConfigureThickness$0': function(/*yworks.yfiles.ui.model.IEdge*/ edge) {
        // Get the edge's thickness
        var /*yfiles.lang.Object*/ tmp = edge.style;
        var /*demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle*/ style = (tmp instanceof demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle) ? /*(demo.yfiles.graph.simplecustomstyle.MySimpleEdgeStyle)*/tmp : null;
        var /*double*/ oldThickness = this.$thickness$0;
        if (style !== null) {
          this.$thickness$0 = style.pathThickness;
        } else {
          this.$thickness$0 = this.thickness;
        }
        // see if the old arrow figure needs to be invalidated...
        if (this.$thickness$0 !== oldThickness) {
          this.$arrowFigure$0 = null;
        }
      },
      '$$init$0': function() {
        this.$anchor$0 = yworks.canvas.geometry.structs.PointD.createDefault();
        this.$direction$0 = yworks.canvas.geometry.structs.PointD.createDefault();
      },
      '$static': {
        'PATH_FILL': null,
        'RenderDataCache': new yfiles.ClassDefinition(function() {
          return {
            'constructor': function(/*double*/ d) {
              this.value = d;
            },
            '$value$0': 0,
            'value': {
              'get': function() {
                return this.$value$0;
              },
              'set': function(/*double*/ value) {
                this.$value$0 = value;
              }
            }
          };
        }),
        '$clinit': function() {
          var /*yworks.canvas.drawing.headless.LinearGradientBrush*/ newInstance = new yworks.canvas.drawing.headless.LinearGradientBrush();
          {
            newInstance.startPoint = new yworks.canvas.geometry.structs.PointD(0, 0);
            newInstance.endPoint = new yworks.canvas.geometry.structs.PointD(0, 1);
            newInstance.spreadMethod = yworks.canvas.drawing.headless.GradientSpreadMethod.REPEAT;
            var /*yworks.canvas.drawing.headless.GradientStop*/ newInstance1 = new yworks.canvas.drawing.headless.GradientStop();
            {
              newInstance1.color = yworks.canvas.drawing.headless.Color.fromArgb(255, 180, 180, 180);
              newInstance1.offset = 0;
            }
            newInstance.gradientStops.add(newInstance1);
            var /*yworks.canvas.drawing.headless.GradientStop*/ newInstance2 = new yworks.canvas.drawing.headless.GradientStop();
            {
              newInstance2.color = yworks.canvas.drawing.headless.Color.fromArgb(255, 50, 50, 50);
              newInstance2.offset = 0.5;
            }
            newInstance.gradientStops.add(newInstance2);
            var /*yworks.canvas.drawing.headless.GradientStop*/ newInstance3 = new yworks.canvas.drawing.headless.GradientStop();
            {
              newInstance3.color = yworks.canvas.drawing.headless.Color.fromArgb(255, 150, 150, 150);
              newInstance3.offset = 1;
            }
            newInstance.gradientStops.add(newInstance3);
          }
          demo.yfiles.graph.simplecustomstyle.MySimpleArrow.PATH_FILL = newInstance;
        }
      }
    };
  })


});});
