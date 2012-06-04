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
   * Helper class that can be used as StyleTag to bundle common visualization parameters for stripes
   */
  /*public*/ exports.StripeDescriptor = new yfiles.ClassDefinition(function() {
    return {
      'constructor': function() {
        this.$$init$0();
      },
      '$backgroundBrush$0': null,
      /**
       * The background brush for a stripe
       */
      'backgroundBrush': {
        '$meta': function() {
          return [yworks.util.annotation.DefaultValueAttribute.DefaultValueAttribute1(yworks.canvas.drawing.headless.Brush.$class, "Transparent")];
        },
        'get': function() {
          return this.$backgroundBrush$0;
        },
        'set': function(/*yworks.canvas.drawing.headless.Brush*/ value) {
          this.$backgroundBrush$0 = value;
        }
      },
      '$insetBrush$0': null,
      /**
       * The inset brush for a stripe
       */
      'insetBrush': {
        '$meta': function() {
          return [yworks.util.annotation.DefaultValueAttribute.DefaultValueAttribute1(yworks.canvas.drawing.headless.Brush.$class, "Transparent")];
        },
        'get': function() {
          return this.$insetBrush$0;
        },
        'set': function(/*yworks.canvas.drawing.headless.Brush*/ value) {
          this.$insetBrush$0 = value;
        }
      },
      '$borderBrush$0': null,
      /**
       * The border brush for a stripe
       */
      'borderBrush': {
        '$meta': function() {
          return [yworks.util.annotation.DefaultValueAttribute.DefaultValueAttribute1(yworks.canvas.drawing.headless.Brush.$class, "Black")];
        },
        'get': function() {
          return this.$borderBrush$0;
        },
        'set': function(/*yworks.canvas.drawing.headless.Brush*/ value) {
          this.$borderBrush$0 = value;
        }
      },
      '$borderThickness$0': null,
      /**
       * The border thickness for a stripe
       */
      'borderThickness': {
        '$meta': function() {
          return [yworks.util.annotation.DefaultValueAttribute.DefaultValueAttribute1(yworks.canvas.geometry.structs.InsetsD.$class, "1")];
        },
        'get': function() {
          return this.$borderThickness$0.clone();
        },
        'set': function(/*yworks.canvas.geometry.structs.InsetsD*/ value) {
          this.$borderThickness$0 = value.clone();
        }
      },
      'equalsWithOther': function(/*demo.yfiles.graph.tableeditor.style.StripeDescriptor*/ other) {
        if (yfiles.lang.Object.referenceEquals(null, other)) {
          return false;
        }
        if (yfiles.lang.Object.referenceEquals(this, other)) {
          return true;
        }
        return yfiles.lang.Object.equals(other.$backgroundBrush$0, this.$backgroundBrush$0) && yfiles.lang.Object.equals(other.$insetBrush$0, this.$insetBrush$0) && yfiles.lang.Object.equals(other.$borderBrush$0, this.$borderBrush$0) && other.$borderThickness$0.equalsInsets(this.$borderThickness$0.clone());
      },
      'equals': function(/*yfiles.lang.Object*/ obj) {
        if (yfiles.lang.Object.referenceEquals(null, obj)) {
          return false;
        }
        if (yfiles.lang.Object.referenceEquals(this, obj)) {
          return true;
        }
        if (yfiles.lang.getType(obj) !== demo.yfiles.graph.tableeditor.style.StripeDescriptor.$class) {
          return false;
        }
        return this.equalsWithOther(/*(demo.yfiles.graph.tableeditor.style.StripeDescriptor)*/obj);
      },
      '$$init$0': function() {
        this.$backgroundBrush$0 = yworks.support.windows.Brushes.transparent;
        this.$insetBrush$0 = yworks.support.windows.Brushes.transparent;
        this.$borderBrush$0 = yworks.support.windows.Brushes.black;
        this.$borderThickness$0 = new yworks.canvas.geometry.structs.InsetsD(1);
      },
      '$static': {
        'equals': function(/*demo.yfiles.graph.tableeditor.style.StripeDescriptor*/ p1, /*demo.yfiles.graph.tableeditor.style.StripeDescriptor*/ p2) {
          return p1.insetBrush === p2.insetBrush && p1.borderBrush === p2.borderBrush && p1.backgroundBrush === p2.backgroundBrush && yworks.canvas.geometry.structs.InsetsD.equals(p1.borderThickness, p2.borderThickness);
        },
        'notEquals': function(/*demo.yfiles.graph.tableeditor.style.StripeDescriptor*/ p1, /*demo.yfiles.graph.tableeditor.style.StripeDescriptor*/ p2) {
          return !(demo.yfiles.graph.tableeditor.style.StripeDescriptor.equals(p1, p2));
        }
      }
    };
  })


});});
