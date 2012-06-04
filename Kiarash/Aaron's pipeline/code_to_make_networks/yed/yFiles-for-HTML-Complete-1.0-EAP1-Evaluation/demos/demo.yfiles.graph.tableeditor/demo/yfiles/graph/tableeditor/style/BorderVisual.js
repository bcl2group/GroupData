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
   * A visual representing a border with a variable thickness 
   * that can be different for each side.
   * A border visual consists of four rectangles for each side 
   * and a background rectangle that are grouped inside a g element.
   */
  /*private*/ exports.BorderVisual = new yfiles.ClassDefinition(function() {
    return {
      '$extends': yworks.canvas.drawing.headless.Visual,
      'constructor': {
        'default': function() {
          yworks.canvas.drawing.headless.Visual.call(this);
          this.$$init$1();
          // create all svg elements
          this.$group$1 = window.document.createElementNS("http://www.w3.org/2000/svg", "g");
          this.$backgroundRectangle$1 = window.document.createElementNS("http://www.w3.org/2000/svg", "rect");
          this.$leftRectangle$1 = window.document.createElementNS("http://www.w3.org/2000/svg", "rect");
          this.$topRectangle$1 = window.document.createElementNS("http://www.w3.org/2000/svg", "rect");
          this.$rightRectangle$1 = window.document.createElementNS("http://www.w3.org/2000/svg", "rect");
          this.$bottomRectangle$1 = window.document.createElementNS("http://www.w3.org/2000/svg", "rect");
          // reset stroke and fill
          this.$backgroundRectangle$1.setAttributeNS(null, "fill", "none");
          this.$backgroundRectangle$1.setAttributeNS(null, "stroke", "none");
          this.$leftRectangle$1.setAttributeNS(null, "fill", "none");
          this.$leftRectangle$1.setAttributeNS(null, "stroke", "none");
          this.$topRectangle$1.setAttributeNS(null, "fill", "none");
          this.$topRectangle$1.setAttributeNS(null, "stroke", "none");
          this.$rightRectangle$1.setAttributeNS(null, "fill", "none");
          this.$rightRectangle$1.setAttributeNS(null, "stroke", "none");
          this.$bottomRectangle$1.setAttributeNS(null, "fill", "none");
          this.$bottomRectangle$1.setAttributeNS(null, "stroke", "none");
          // group rectangles
          this.$group$1.appendChild(this.$backgroundRectangle$1);
          this.$group$1.appendChild(this.$leftRectangle$1);
          this.$group$1.appendChild(this.$topRectangle$1);
          this.$group$1.appendChild(this.$rightRectangle$1);
          this.$group$1.appendChild(this.$bottomRectangle$1);
        },
        'FromRectangle': function(/*yworks.canvas.geometry.IRectangle*/ layout) {
          demo.yfiles.graph.tableeditor.style.BorderVisual.call(this);
          this.$UpdateLayout$1(layout);
        }
      },
      '$group$1': null,
      '$backgroundRectangle$1': null,
      '$leftRectangle$1': null,
      '$topRectangle$1': null,
      '$rightRectangle$1': null,
      '$bottomRectangle$1': null,
      '$borderBrush$1': null,
      '$backgroundBrush$1': null,
      '$transform$1': null,
      '$visible$1': false,
      '$bounds$1': null,
      '$borderThickness$1': null,
      'svgElement': {
        'get': function() {
          return this.$group$1;
        }
      },
      /**
       * Returns the background brush of the border
       */
      'backgroundBrush': {
        'get': function() {
          return this.$backgroundBrush$1;
        }
      },
      /**
       * Returns the border brush of the border element
       */
      'borderBrush': {
        'get': function() {
          return this.$borderBrush$1;
        }
      },
      '$SetBackgroundBrush$1': function(/*yworks.canvas.drawing.headless.Brush*/ brush, /*yworks.canvas.ICanvasContext*/ context) {
        this.$backgroundBrush$1 = brush;
        yworks.canvas.svg.SVGExtensions.setBrush(this.$backgroundRectangle$1, brush, context);
      },
      '$SetBorderBrush$1': function(/*yworks.canvas.drawing.headless.Brush*/ brush, /*yworks.canvas.ICanvasContext*/ context) {
        this.$borderBrush$1 = brush;
        yworks.canvas.svg.SVGExtensions.setBrush(this.$leftRectangle$1, brush, context);
        yworks.canvas.svg.SVGExtensions.setBrush(this.$topRectangle$1, brush, context);
        yworks.canvas.svg.SVGExtensions.setBrush(this.$rightRectangle$1, brush, context);
        yworks.canvas.svg.SVGExtensions.setBrush(this.$bottomRectangle$1, brush, context);
      },
      '$UpdateLayout$1': function(/*yworks.canvas.geometry.IRectangle*/ layout) {
        this.bounds = yworks.canvas.geometry.structs.RectD.fromRectangle(layout);
      },
      /**
       * Gets or sets the border bounds
       */
      'bounds': {
        'get': function() {
          return this.$bounds$1.clone();
        },
        'set': function(/*yworks.canvas.geometry.structs.RectD*/ value) {
          this.$bounds$1 = value.clone();
          var /*yfiles.lang.String*/ width = "" + this.$bounds$1.$width;
          var /*yfiles.lang.String*/ height = "" + this.$bounds$1.$height;
          this.$backgroundRectangle$1.setAttributeNS(null, "width", width);
          this.$backgroundRectangle$1.setAttributeNS(null, "height", height);
          this.$backgroundRectangle$1.setAttributeNS(null, "x", this.$bounds$1.toRectD().topLeft.$x);
          this.$backgroundRectangle$1.setAttributeNS(null, "y", this.$bounds$1.toRectD().topLeft.$y);

          this.$leftRectangle$1.setAttributeNS(null, "height", height);
          this.$leftRectangle$1.setAttributeNS(null, "x", this.$bounds$1.toRectD().topLeft.$x);
          this.$leftRectangle$1.setAttributeNS(null, "y", this.$bounds$1.toRectD().topLeft.$y);
          this.$rightRectangle$1.setAttributeNS(null, "height", height);
          this.$rightRectangle$1.setAttributeNS(null, "x", this.$bounds$1.toRectD().topLeft.$x + this.$bounds$1.$width - this.$borderThickness$1.$right);
          this.$rightRectangle$1.setAttributeNS(null, "y", this.$bounds$1.toRectD().topLeft.$y);
          this.$topRectangle$1.setAttributeNS(null, "width", width);
          this.$topRectangle$1.setAttributeNS(null, "x", this.$bounds$1.toRectD().topLeft.$x);
          this.$topRectangle$1.setAttributeNS(null, "y", this.$bounds$1.toRectD().topLeft.$y);
          this.$bottomRectangle$1.setAttributeNS(null, "width", width);
          this.$bottomRectangle$1.setAttributeNS(null, "x", this.$bounds$1.toRectD().topLeft.$x);
          this.$bottomRectangle$1.setAttributeNS(null, "y", this.$bounds$1.toRectD().topLeft.$y + this.$bounds$1.$height - this.$borderThickness$1.$bottom);
        }
      },
      /**
       * Gets or sets the border's thickness
       */
      'borderThickness': {
        'get': function() {
          return this.$borderThickness$1.clone();
        },
        'set': function(/*yworks.canvas.geometry.structs.InsetsD*/ value) {
          this.$borderThickness$1 = value.clone();
          this.$leftRectangle$1.setAttributeNS(null, "width", "" + this.$borderThickness$1.$left);
          this.$rightRectangle$1.setAttributeNS(null, "width", "" + this.$borderThickness$1.$right);
          this.$topRectangle$1.setAttributeNS(null, "height", "" + this.$borderThickness$1.$top);
          this.$bottomRectangle$1.setAttributeNS(null, "height", "" + this.$borderThickness$1.$bottom);
        }
      },
      /**
       * Gets or sets the border's visibility
       */
      'visible': {
        'get': function() {
          return this.$visible$1;
        },
        'set': function(/*boolean*/ value) {
          this.$visible$1 = value;
          var /*stubs.pathTypeVisibility*/ visibility = this.$visible$1 ? "visible" : "hidden";
          this.$backgroundRectangle$1.setAttributeNS(null, "visibility", visibility);
          this.$leftRectangle$1.setAttributeNS(null, "visibility", visibility);
          this.$topRectangle$1.setAttributeNS(null, "visibility", visibility);
          this.$rightRectangle$1.setAttributeNS(null, "visibility", visibility);
          this.$bottomRectangle$1.setAttributeNS(null, "visibility", visibility);
        }
      },
      /**
       * Gets or sets the border's transform
       */
      'transform': {
        'get': function() {
          return this.$transform$1;
        },
        'set': function(/*yworks.canvas.geometry.Matrix2D*/ value) {
          this.$transform$1 = value;
          yworks.canvas.svg.SVGExtensions.setMatrix2D(this.$group$1, this.$transform$1);
        }
      },
      '$$init$1': function() {
        this.$bounds$1 = yworks.canvas.geometry.structs.RectD.createDefault();
        this.$borderThickness$1 = yworks.canvas.geometry.structs.InsetsD.createDefault();
      }
    };
  })


});});
