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
   * This class is an example of a custom port style based on the {@link yworks.yfiles.ui.drawing.SimpleAbstractPortStyle} class.
   * The port is rendered as a circle.
   */
  /*public*/ exports.MySimplePortStyle = new yfiles.ClassDefinition(function() {
    return {
      '$extends': yworks.yfiles.ui.drawing.SimpleAbstractPortStyle,
      'constructor': function() {
        yworks.yfiles.ui.drawing.SimpleAbstractPortStyle.call(this, yworks.canvas.drawing.headless.EllipseVisual.$class);
        yworks.yfiles.ui.drawing.SimpleAbstractPortStyle.call(this, yworks.canvas.drawing.headless.EllipseVisual.$class);
      },
      // the size of the port rendering - immutable
      'createVisual': function(/*yworks.yfiles.ui.model.IPort*/ port, /*yworks.canvas.drawing.IRenderContext*/ renderContext) {
        // create the ellipse
        var /*yworks.canvas.drawing.headless.EllipseVisual*/ visual = new yworks.canvas.drawing.headless.EllipseVisual.FromRectangleBounds(new yworks.canvas.geometry.Rectangle(0, 0, demo.yfiles.graph.simplecustomstyle.MySimplePortStyle.WIDTH, demo.yfiles.graph.simplecustomstyle.MySimplePortStyle.HEIGHT));
        visual.setBrush(null, renderContext);
        visual.setPen(demo.yfiles.graph.simplecustomstyle.MySimplePortStyle.ELLIPSE_STROKE, renderContext);
        // and arrange it
        var /*yworks.canvas.geometry.structs.PointD*/ location = yworks.canvas.geometry.structs.PointD.add(port.location.toPoint(), new yworks.canvas.geometry.structs.PointD(-demo.yfiles.graph.simplecustomstyle.MySimplePortStyle.WIDTH * 0.5, -demo.yfiles.graph.simplecustomstyle.MySimplePortStyle.HEIGHT * 0.5));
        visual.transform = new yworks.canvas.geometry.Matrix2D.FromValues(1, 0, 0, 1, location.$x, location.$y);
        return visual;
      },
      'updateVisual': function(/*yworks.yfiles.ui.model.IPort*/ port, /*yworks.canvas.drawing.IRenderContext*/ renderContext, /*yworks.canvas.drawing.headless.EllipseVisual*/ oldVisual) {
        // arrange the old ellipse
        var /*yworks.canvas.geometry.structs.PointD*/ location = yworks.canvas.geometry.structs.PointD.add(port.location.toPoint(), new yworks.canvas.geometry.structs.PointD(-demo.yfiles.graph.simplecustomstyle.MySimplePortStyle.WIDTH * 0.5, -demo.yfiles.graph.simplecustomstyle.MySimplePortStyle.HEIGHT * 0.5));
        oldVisual.transform = new yworks.canvas.geometry.Matrix2D.FromValues(1, 0, 0, 1, location.$x, location.$y);
        return oldVisual;
      },
      'getBounds': function(/*yworks.yfiles.ui.model.IPort*/ port, /*yworks.canvas.ICanvasContext*/ canvasContext) {
        return yworks.canvas.geometry.structs.RectD.fromCenter(port.location.toPoint(), new yworks.canvas.geometry.structs.SizeD(demo.yfiles.graph.simplecustomstyle.MySimplePortStyle.WIDTH, demo.yfiles.graph.simplecustomstyle.MySimplePortStyle.HEIGHT));
      },
      '$static': {
        'ELLIPSE_STROKE': null,
        'WIDTH': 4,
        'HEIGHT': 4,
        '$clinit': function() {
          demo.yfiles.graph.simplecustomstyle.MySimplePortStyle.ELLIPSE_STROKE = new yworks.support.windows.Pen.FromBrush(new yworks.canvas.drawing.headless.SolidColorBrush(yworks.canvas.drawing.headless.Color.fromArgb(80, 255, 255, 255)));
        }
      }
    };
  })


});});
