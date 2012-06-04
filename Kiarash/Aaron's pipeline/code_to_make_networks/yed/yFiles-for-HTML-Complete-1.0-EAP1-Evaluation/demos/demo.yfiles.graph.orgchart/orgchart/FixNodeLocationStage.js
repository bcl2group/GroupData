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
   * An {@link yworks.yfiles.layout.AbstractLayoutStage} that uses a {@link yworks.yfiles.algorithms.IDataProvider}/{@link yworks.canvas.model.IMapper}
   * to determine a node whose location should not be changed during the layout.
   */
  /*private*/ /*final*/ exports.FixNodeLocationStage = new yfiles.ClassDefinition(function() {
    return {
      '$extends': yworks.yfiles.layout.AbstractLayoutStage,
      'constructor': function(/*yworks.yfiles.layout.ILayouter*/ layouter) {
        yworks.yfiles.layout.AbstractLayoutStage.WithCoreLayouter.call(this, layouter);
      },
      'canLayout': function(/*yworks.yfiles.layout.LayoutGraph*/ graph) {
        return graph !== null;
      },
      'doLayoutWithLayoutGraph': function(/*yworks.yfiles.layout.LayoutGraph*/ graph) {
        // determine the single node to keep at the center.
        var /*yworks.yfiles.algorithms.IDataProvider*/ provider = graph.getDataProvider("CenterNode");
        var /*yworks.yfiles.algorithms.Node*/ centerNode = null;
        if (provider !== null) {
          centerNode = yfiles.system.collections.EnumerableExtensions./*<yworks.yfiles.algorithms.Node>*/firstOrDefaultFiltered(graph.nodes, yfiles.lang.delegate(provider.getBool, provider));
        }
        if (this.coreLayouter !== null) {
          if (centerNode !== null) {
            // remember old center
            var /*yworks.yfiles.algorithms.geometry.YPoint*/ center = graph.getCenter(centerNode);
            // run layout
            this.coreLayouter.doLayoutWithLayoutGraph(graph);
            // obtain new center
            var /*yworks.yfiles.algorithms.geometry.YPoint*/ newCenter = graph.getCenter(centerNode);
            // and adjust the layout
            yworks.yfiles.layout.LayoutTool.moveSubgraph(graph, graph.getNodeCursor(), center.x - newCenter.x, center.y - newCenter.y);
          } else {
            this.coreLayouter.doLayoutWithLayoutGraph(graph);
          }
        }
      }
    };
  })


});});
