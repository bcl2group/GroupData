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

  /*public*/ exports.TreeDataBuilder = new yfiles.ClassDefinition(function() {
    return {
      '$static': {
        'createItems': function(/*yworks.yfiles.ui.model.IGraph*/ graph) {
          var /*yfiles.system.collections.generic.List<yfiles.lang.Object>*/ items = new yfiles.system.collections.generic.List/*<yfiles.lang.Object>*/();

          var /*yfiles.util.IEnumerator*/ tmpEnumerator = graph.nodes.getEnumerator();
          while (tmpEnumerator.moveNext()) {
            var /*yworks.yfiles.ui.model.INode*/ node = tmpEnumerator.current;
            {
              items.add(orgchart.TreeDataBuilder.createItem(graph, node));
            }
          }

          return items.toArray();
        },
        'createItem': function(/*yworks.yfiles.ui.model.IGraph*/ graph, /*yworks.yfiles.ui.model.INode*/ node) {
          var /*int*/ outDegree = graph.outDegree(node);
          var /*orgchart.LeafDataItem*/ item = outDegree > 0 ? new orgchart.ParentDataItem() : new orgchart.LeafDataItem();
          item.node = node;
          item.name = (/*(orgchart.stubs.Employee)*/node.tag).name;
          item.nodeId = (/*(orgchart.stubs.Employee)*/node.tag).name;

          if (graph.inDegree(node) > 0) {
            var /*yworks.yfiles.ui.model.INode*/ parent = yworks.yfiles.ui.model.GraphExtensions.first(graph.inEdgesAt(node)).getSourceNode();
            item.parentId = (/*(orgchart.stubs.Employee)*/parent.tag).name;
          }

          if (outDegree > 0) {
            var /*yfiles.lang.Object[]*/ children = yfiles.system.ArrayExtensions./*<yfiles.lang.Object>*/createObjectArray(outDegree);
            (/*(orgchart.ParentDataItem)*/item).children = children;

            var /*int*/ i = 0;
            var /*yfiles.util.IEnumerator*/ tmpEnumerator = graph.outEdgesAt(node).getEnumerator();
            while (tmpEnumerator.moveNext()) {
              var /*yworks.yfiles.ui.model.IEdge*/ outEdge = tmpEnumerator.current;
              {
                var /*orgchart.ReferenceStructure*/ structure = new orgchart.ReferenceStructure();
                structure._reference = (/*(orgchart.stubs.Employee)*/outEdge.getTargetNode().tag).name;
                children[i++] = structure;
              }
            }
          }

          return item;
        }
      }
    };
  })


});});
