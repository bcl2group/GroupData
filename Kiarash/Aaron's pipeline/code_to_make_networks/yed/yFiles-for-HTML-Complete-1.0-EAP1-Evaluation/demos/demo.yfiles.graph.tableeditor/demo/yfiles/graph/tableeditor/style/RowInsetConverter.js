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
yfiles.module("demo.yfiles.graph.tableeditor.style", function(exports) {

  /**
   * Convert a row to its header insets
   */
  /*public*/ exports.RowInsetConverter = new yfiles.ClassDefinition(function() {
    return {
      '$with': [yworks.support.IValueConverter],
      'convert': function(/*yfiles.lang.Object*/ value, /*yfiles.lang.Object*/ parameter) {
        var /*yworks.yfiles.ui.model.IStripe*/ stripe = (/*(yworks.yfiles.ui.model.INode)*/value).lookup(yworks.yfiles.ui.model.IStripe.$class);
        if (stripe !== null) {
          return new yworks.canvas.geometry.structs.InsetsD.FromLeftTopRightAndBottom(stripe.getActualInsets().$left, 0, stripe.getActualInsets().$right, 0);
        }
        return new yworks.canvas.geometry.structs.InsetsD.createDefault();
      },
      'convertBack': function(/*yfiles.lang.Object*/ value, /*yfiles.lang.Object*/ parameter) {
        throw new yfiles.system.NotImplementedException();
      }
    };
  })


});});
