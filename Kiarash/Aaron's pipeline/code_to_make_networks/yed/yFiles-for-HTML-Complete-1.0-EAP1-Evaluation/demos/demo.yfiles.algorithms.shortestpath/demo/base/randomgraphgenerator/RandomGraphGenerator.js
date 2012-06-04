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
yfiles.module("demo.base.randomgraphgenerator", function(exports) {

  /**
   *  A class that creates random graphs. The size of the graph and other options
   *  may be specified. These options influence the properties of the created
   *  graph.
   */
  /*public*/ exports.RandomGraphGenerator = new yfiles.ClassDefinition(function() {
    return {
      'constructor': {
        'default': function() {
          demo.base.randomgraphgenerator.RandomGraphGenerator.FromSeed.call(this, yfiles.system.YDateTime.now.millisecond);
        },
        'FromSeed': function(/*int*/ seed) {
          this.$random$0 = new yfiles.system.Random.WithSeed(seed);
          this.$nodeCount$0 = 30;
          this.$edgeCount$0 = 40;
          this.$allowSelfLoops$0 = false;
          this.$allowCycles$0 = true;
          this.$allowMultipleEdges$0 = false;
        }
      },
      '$nodeCount$0': 0,
      '$edgeCount$0': 0,
      '$allowCycles$0': false,
      '$allowSelfLoops$0': false,
      '$allowMultipleEdges$0': false,
      '$random$0': null,
      /**
       *  Gets or sets the node count of the graph to be generated.
       *  The default value is 30.
       */
      'nodeCount': {
        'get': function() {
          return this.$nodeCount$0;
        },
        'set': function(/*int*/ value) {
          this.$nodeCount$0 = value;
        }
      },
      /**
       *  Gets or sets the edge count of the graph to be generated.
       *  The default value is 40. If the edge count is 
       *  higher than it is theoretically possible by the 
       *  generator options set, then the highest possible
       *  edge count is applied instead.
       */
      'edgeCount': {
        'get': function() {
          return this.$edgeCount$0;
        },
        'set': function(/*int*/ value) {
          this.$edgeCount$0 = value;
        }
      },
      /**
       *  Whether or not to allow the generation of cyclic graphs, i.e. 
       *  graphs that contain directed cyclic paths. If allowed 
       *  it still could happen by chance that the generated
       *  graph is acyclic. By default allowed.
       */
      'allowCycles': {
        'get': function() {
          return this.$allowCycles$0;
        },
        'set': function(/*boolean*/ value) {
          this.$allowCycles$0 = value;
        }
      },
      /**
       *  Whether or not to allow the generation of selfloops, i.e.
       *  edges with same source and target nodes.
       *  If allowed it still could happen by chance that
       *  the generated graph contains no selfloops.
       *  By default disallowed.
       */
      'allowSelfLoops': {
        'get': function() {
          return this.$allowSelfLoops$0;
        },
        'set': function(/*boolean*/ value) {
          this.$allowSelfLoops$0 = value;
        }
      },
      /**
       *  Whether or not to allow the generation of graphs that contain multiple
       *  edges, i.e. graphs that has more than one edge that connect the same pair
       *  of nodes. If allowed it still could happen by chance that
       *  the generated graph does not contain multiple edges.
       *  By default disallowed.
       */
      'allowMultipleEdges': {
        'get': function() {
          return this.$allowMultipleEdges$0;
        },
        'set': function(/*boolean*/ value) {
          this.$allowMultipleEdges$0 = value;
        }
      },
      'generateGraph': function() {
        var /*yworks.yfiles.ui.model.IGraph*/ graph = new yworks.yfiles.ui.model.DefaultGraph();
        this.generateGraphWithGraph(graph);
        return graph;
      },
      'generateGraphWithGraph': function(/*yworks.yfiles.ui.model.IGraph*/ graph) {
        if (this.allowMultipleEdges) {
          this.$GenerateMultipleGraph$0(graph);
        } else if (this.nodeCount > 1 && this.edgeCount > 10 && Math.log(this.nodeCount) * this.nodeCount < this.edgeCount) {
          this.$GenerateDenseGraph$0(graph);
        } else {
          this.$GenerateSparseGraph$0(graph);
        }
      },
      '$GenerateMultipleGraph$0': function(/*yworks.yfiles.ui.model.IGraph*/ G) {
        var /*int*/ n = this.nodeCount;
        var /*int*/ m = this.edgeCount;
        var /*yworks.canvas.model.IMapper<yworks.yfiles.ui.model.IPortOwner, yfiles.lang.Number>*/ index = new yworks.canvas.model.DictionaryMapper/*<yworks.yfiles.ui.model.IPortOwner, yfiles.lang.Number>*/();

        var /*int[]*/ deg = yfiles.system.ArrayExtensions./*<int>*/createintArray(n);
        var /*yworks.yfiles.ui.model.INode[]*/ V = yfiles.system.ArrayExtensions./*<yworks.yfiles.ui.model.INode>*/createObjectArray(n);
        for (var /*int*/ i = 0; i < n; i++) {
          V[i] = G.createNode();
          yworks.canvas.model.MapperExtensions.put(index, V[i], i);
        }

        for (var /*int*/ i = 0; i < m; i++) {
          deg[this.$random$0.nextInt(n)]++;
        }

        for (var /*int*/ i = 0; i < n; i++) {
          var /*yworks.yfiles.ui.model.INode*/ v = V[i];
          var /*int*/ d = deg[i];
          while (d > 0) {
            var /*int*/ j = this.$random$0.nextInt(n);
            if (j === i && (!this.allowCycles || !this.allowSelfLoops)) {
              continue;
            }
            G.createEdge(v, V[j]);
            d--;
          }
        }

        if (!this.allowCycles) {
          var /*yfiles.util.IEnumerator*/ tmpEnumerator = G.edges.getEnumerator();
          while (tmpEnumerator.moveNext()) {
            var /*yworks.yfiles.ui.model.IEdge*/ edge = tmpEnumerator.current;
            {
              var /*yworks.yfiles.ui.model.IPort*/ sourcePort = edge.sourcePort;
              var /*yworks.yfiles.ui.model.IPort*/ targetPort = edge.targetPort;
              if (yworks.canvas.model.MapperExtensions.get(index, sourcePort.owner) > yworks.canvas.model.MapperExtensions.get(index, targetPort.owner)) {
                G.setPorts(edge, targetPort, sourcePort);
              }
            }
          }
        }
      },
      '$GenerateDenseGraph$0': function(/*yworks.yfiles.ui.model.IGraph*/ g) {
        g.clear();
        var /*yworks.yfiles.ui.model.INode[]*/ nodes = yfiles.system.ArrayExtensions./*<yworks.yfiles.ui.model.INode>*/createObjectArray(this.nodeCount);

        for (var /*int*/ i = 0; i < this.nodeCount; i++) {
          nodes[i] = g.createNode();
        }

        demo.base.randomgraphgenerator.RandomSupport.permutate(this.$random$0, nodes);

        var /*int*/ m = Math.min(this.$GetMaxEdges$0(), this.edgeCount);
        var /*int*/ n = this.nodeCount;

        var /*int*/ adder = (this.allowSelfLoops && this.allowCycles) ? 0 : 1;

        var /*boolean[]*/ edgeWanted = demo.base.randomgraphgenerator.RandomSupport.getBoolArray(this.$random$0, this.$GetMaxEdges$0(), m);
        for (var /*int*/ i = 0, k = 0; i < n; i++) {
          for (var /*int*/ j = i + adder; j < n; j++, k++) {
            if (edgeWanted[k]) {
              if (this.allowCycles && this.$random$0.nextDouble() > 0.5) {
                g.createEdge(nodes[j], nodes[i]);
              } else {
                g.createEdge(nodes[i], nodes[j]);
              }
            }
          }
        }
      },
      '$GenerateSparseGraph$0': function(/*yworks.yfiles.ui.model.IGraph*/ G) {
        G.clear();
        var /*yworks.canvas.model.IMapper<yworks.yfiles.ui.model.IPortOwner, yfiles.lang.Number>*/ index = new yworks.canvas.model.DictionaryMapper/*<yworks.yfiles.ui.model.IPortOwner, yfiles.lang.Number>*/();

        var /*int*/ n = this.nodeCount;

        var /*int*/ m = Math.min(this.$GetMaxEdges$0(), this.edgeCount);

        var /*yworks.yfiles.ui.model.INode[]*/ V = yfiles.system.ArrayExtensions./*<yworks.yfiles.ui.model.INode>*/createObjectArray(n);

        for (var /*int*/ i = 0; i < n; i++) {
          V[i] = G.createNode();
          yworks.canvas.model.MapperExtensions.put(index, V[i], i);
        }

        demo.base.randomgraphgenerator.RandomSupport.permutate(this.$random$0, V);

        var /*int*/ count = m;
        while (count > 0) {
          var /*int*/ vi = this.$random$0.nextInt(n);
          var /*yworks.yfiles.ui.model.INode*/ v = V[vi];
          var /*yworks.yfiles.ui.model.INode*/ w = V[this.$random$0.nextInt(n)];

          if (G.getEdgeAtOwners(v, w) !== null || (v === w && (!this.allowSelfLoops || !this.allowCycles))) {
            continue;
          }
          G.createEdge(v, w);
          count--;
        }

        if (!this.allowCycles) {
          var /*yfiles.util.IEnumerator*/ tmpEnumerator = G.edges.getEnumerator();
          while (tmpEnumerator.moveNext()) {
            var /*yworks.yfiles.ui.model.IEdge*/ edge = tmpEnumerator.current;
            {
              var /*yworks.yfiles.ui.model.IPort*/ sourcePort = edge.sourcePort;
              var /*yworks.yfiles.ui.model.IPort*/ targetPort = edge.targetPort;
              if (yworks.canvas.model.MapperExtensions.get(index, sourcePort.owner) > yworks.canvas.model.MapperExtensions.get(index, targetPort.owner)) {
                G.setPorts(edge, targetPort, sourcePort);
              }
            }
          }
        }
      },
      '$GetMaxEdges$0': function() {
        if (this.allowMultipleEdges) {
          return yfiles.system.Math.INT32_MAX_VALUE;
        }
        var /*int*/ maxEdges = (this.nodeCount * (this.nodeCount - 1) / 2 | 0);
        if (this.allowCycles && this.allowSelfLoops) {
          maxEdges += this.nodeCount;
        }
        return maxEdges;
      }
    };
  })


});});
