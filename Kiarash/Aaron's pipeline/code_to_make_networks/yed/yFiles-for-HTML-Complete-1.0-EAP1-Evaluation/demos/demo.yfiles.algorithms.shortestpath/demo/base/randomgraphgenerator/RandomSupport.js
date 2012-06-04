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

  /*private*/ exports.RandomSupport = new yfiles.ClassDefinition(function() {
    return {
      '$static': {
        'permutate': function(/*yfiles.system.Random*/ rnd, /*yfiles.lang.Object[]*/ a) {
          // forth...
          for (var /*int*/ i = 0; i < a.length; i++) {
            var /*int*/ j = rnd.nextInt(a.length);
            var /*yfiles.lang.Object*/ tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
          }
          // back...
          for (var /*int*/ i = a.length - 1; i >= 0; i--) {
            var /*int*/ j = rnd.nextInt(a.length);
            var /*yfiles.lang.Object*/ tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
          }
        },
        'getUniqueArray': function(/*yfiles.system.Random*/ rnd, /*int*/ n, /*int*/ min, /*int*/ max) {
          max--;

          var /*int[]*/ ret = null;
          var /*int*/ l = max - min + 1;
          if (l >= n && n > 0) {
            var /*int[]*/ accu = yfiles.system.ArrayExtensions./*<int>*/createintArray(l);
            ret = yfiles.system.ArrayExtensions./*<int>*/createintArray(n);
            for (var /*int*/ i = 0, j = min; i < l; i++, j++) {
              accu[i] = j;
            }
            for (var /*int*/ j = 0, m = l - 1; j < n; j++, m--) {
              var /*int*/ r = rnd.nextInt(m + 1);
              ret[j] = accu[r];
              if (r < m) {
                accu[r] = accu[m];
              }
            }
          }
          return ret;
        },
        'getBoolArray': function(/*yfiles.system.Random*/ rnd, /*int*/ n, /*int*/ trueCount) {
          if (trueCount > n) {
            throw new yfiles.system.ArgumentException.FromMessage("RandomSupport.GetBoolArray( " + n + ", " + trueCount + " )");
          }

          var /*int[]*/ a = demo.base.randomgraphgenerator.RandomSupport.getUniqueArray(rnd, trueCount, 0, n);
          var /*boolean[]*/ b = yfiles.system.ArrayExtensions./*<boolean>*/createbooleanArray(n);
          if (a !== null) {
            for (var /*int*/ i = 0; i < a.length; i++) {
              b[a[i]] = true;
            }
          }
          return b;
        }
      }
    };
  })


});});
