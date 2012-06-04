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

  /*public*/ exports.GraphBuilder = new yfiles.ClassDefinition(function() {
    return {
      '$static': {
        'create': function(/*yworks.yfiles.ui.model.IGraph*/ graph, /*orgchart.stubs.Employee*/ root) {
          orgchart.GraphBuilder.createWithRoot(graph, null, root);
        },
        'createWithRoot': function(/*yworks.yfiles.ui.model.IGraph*/ graph, /*yworks.yfiles.ui.model.INode*/ rootNode, /*orgchart.stubs.Employee*/ employee) {
          var /*yworks.yfiles.ui.model.INode*/ n = graph.createNode();
          n.tag = employee;

          if (rootNode !== null) {
            graph.createEdge(rootNode, n);
          }
          if (employee.subordinates !== null && employee.subordinates !== undefined) {
            var /*orgchart.stubs.Employee[]*/ arr;
            var /*int*/ i;
            for (i = 0, arr = employee.subordinates; i < arr.length; i++) {
              var /*orgchart.stubs.Employee*/ subordinate = arr[i];
              orgchart.GraphBuilder.createWithRoot(graph, n, subordinate);
            }
          }
        }
      }
    };
  })


});});
