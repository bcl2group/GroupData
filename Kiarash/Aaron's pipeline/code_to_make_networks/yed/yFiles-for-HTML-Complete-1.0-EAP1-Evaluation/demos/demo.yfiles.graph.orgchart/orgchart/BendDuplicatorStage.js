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
yfiles.module("orgchart", function(exports) {

  /**
   * LayoutStage that duplicates bends that share a common bus.
   */
  /*private*/ exports.BendDuplicatorStage = new yfiles.ClassDefinition(function() {
    return {
      '$extends': yworks.yfiles.layout.AbstractLayoutStage,
      'constructor': {
        'default': function() {
          yworks.yfiles.layout.AbstractLayoutStage.call(this);
        },
        'WithCore': function(/*yworks.yfiles.layout.ILayouter*/ coreLayouter) {
          yworks.yfiles.layout.AbstractLayoutStage.WithCoreLayouter.call(this, coreLayouter);
        }
      },
      'canLayout': function(/*yworks.yfiles.layout.LayoutGraph*/ graph) {
        return true;
      },
      'doLayoutWithLayoutGraph': function(/*yworks.yfiles.layout.LayoutGraph*/ graph) {
        this.doLayoutCore(graph);

        var /*yfiles.util.IEnumerator*/ tmpEnumerator = graph.nodes.getEnumerator();
        while (tmpEnumerator.moveNext()) {
          var /*yworks.yfiles.algorithms.Node*/ n = tmpEnumerator.current;
          {
            var /*yfiles.util.IEnumerator*/ tmpEnumerator1 = n.outEdges.getEnumerator();
            while (tmpEnumerator1.moveNext()) {
              var /*yworks.yfiles.algorithms.Edge*/ e = tmpEnumerator1.current;
              {
                var /*boolean*/ lastSegmentOverlap = false;
                var /*yworks.yfiles.layout.IEdgeLayout*/ er = graph.getEdgeLayout(e);
                if (er.pointCount() > 0) {
                  // last bend point
                  var /*yworks.yfiles.algorithms.geometry.YPoint*/ bendPoint = er.getPoint(er.pointCount() - 1);

                  var /*yfiles.system.collections.generic.IEnumerator<yworks.yfiles.algorithms.Edge>*/ ecc = n.outEdges.getEnumerator();
                  while (ecc.moveNext()) {
                    var /*yworks.yfiles.algorithms.Edge*/ eccEdge = ecc.current;
                    if (eccEdge !== e) {
                      var /*yworks.yfiles.algorithms.geometry.YPointPath*/ path = graph.getPath(eccEdge);
                      for (var /*yworks.yfiles.algorithms.geometry.ILineSegmentCursor*/ lc = path.lineSegments(); lc.ok; lc.next()) {
                        var /*yworks.yfiles.algorithms.geometry.LineSegment*/ seg = lc.lineSegment;
                        if (seg.contains(bendPoint)) {
                          lastSegmentOverlap = true;
                          break;
                        }
                      }
                    }
                  }
                }


                var /*yworks.yfiles.algorithms.YList*/ points = graph.getPointList(e);
                for (var /*yworks.yfiles.algorithms.ListCell*/ c = points.firstCell; c !== null; c = c.succ()) {
                  var /*yworks.yfiles.algorithms.geometry.YPoint*/ p = /*(yworks.yfiles.algorithms.geometry.YPoint)*/c.info;
                  if (c.succ() === null && !lastSegmentOverlap) {
                    break;
                  }

                  var /*yworks.yfiles.algorithms.geometry.YPoint*/ p0 = /*(yworks.yfiles.algorithms.geometry.YPoint)*/(c.pred() === null ? graph.getSourcePointAbs(e) : c.pred().info);
                  var /*yworks.yfiles.algorithms.geometry.YPoint*/ p2;
                  if (Math.abs(p0.x - p.x) < 0.01) {
                    p2 = new yworks.yfiles.algorithms.geometry.YPoint(p.x, p.y - 0.001);
                  } else {
                    p2 = new yworks.yfiles.algorithms.geometry.YPoint(p.x - 0.001, p.y);
                  }

                  points.insertBefore(p2, c);
                }
                graph.setPointsWithPointList(e, points);
              }
            }
          }
        }
      }
    };
  })


});});
