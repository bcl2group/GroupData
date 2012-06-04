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
   * This class is an example for a custom style based on the {@link yworks.yfiles.ui.drawing.SimpleAbstractLabelStyle}.
   * The typeface for the label text can be set. The label text is drawn with black letters inside a blue rounded rectangle.
   * Also there is a customized button displayed in the label at certain zoom levels that enables editing of the label text.
   */
  /*public*/ exports.MySimpleLabelStyle = new yfiles.ClassDefinition(function() {
    return {
      '$extends': yworks.yfiles.ui.drawing.SimpleAbstractLabelStyle,
      'constructor': function() {
        yworks.yfiles.ui.drawing.SimpleAbstractLabelStyle.call(this, yworks.canvas.CanvasContainer.$class);
        var /*yfiles.system.Typeface*/ newInstance = new yfiles.system.Typeface();
        {
          newInstance.fontFamily = "Arial";
          newInstance.fontSize = 12;
        }
        this.typeface = newInstance;
      },
      // #region Constructor
      // #endregion 
      // #region Properties
      '$typeface$1': null,
      /**
       * Gets or sets the typeface used for rendering the label text.
       */
      'typeface': {
        'get': function() {
          return this.$typeface$1;
        },
        'set': function(/*yfiles.system.Typeface*/ value) {
          this.$typeface$1 = value;
        }
      },
      // #endregion 
      // #region Rendering
      'createVisual': function(/*yworks.yfiles.ui.model.ILabel*/ label, /*yworks.canvas.drawing.IRenderContext*/ renderContext) {
        // This implementation creates a CanvasContainer and uses it for the rendering of the label.
        var /*yworks.canvas.CanvasContainer*/ container = new yworks.canvas.CanvasContainer();
        // Get the necessary data for rendering of the label
        var /*demo.yfiles.graph.simplecustomstyle.MySimpleLabelStyle.RenderDataCache*/ cache = this.$CreateRenderDataCache$1(renderContext, label, this.typeface);
        // Render the label
        this.$Render$1(label, container, label.layout, renderContext, cache);
        // move container to correct location
        this.arrangeByLayout(container, label.layout, true);
        // set data item
        container.svgElement.setAttribute("data-internalId", "MySimpleLabel");
        container.svgElement["data-item"] = label;
        return container;
      },
      'updateVisual': function(/*yworks.yfiles.ui.model.ILabel*/ label, /*yworks.canvas.drawing.IRenderContext*/ renderContext, /*yworks.canvas.CanvasContainer*/ oldVisual) {
        // get the data with wich the oldvisual was created
        var /*demo.yfiles.graph.simplecustomstyle.MySimpleLabelStyle.RenderDataCache*/ oldCache = yworks.canvas.svg.SVGExtensions.getRenderDataCache(demo.yfiles.graph.simplecustomstyle.MySimpleLabelStyle.RenderDataCache.$class, oldVisual);
        // get the data for the new visual
        var /*demo.yfiles.graph.simplecustomstyle.MySimpleLabelStyle.RenderDataCache*/ newCache = this.$CreateRenderDataCache$1(renderContext, label, this.typeface);
        if (!oldCache.$Equals$0(newCache)) {
          // someting changed - re-render the visual
          this.$Render$1(label, oldVisual, label.layout, renderContext, newCache);
        }
        // nothing changed, return the old visual
        // arrange because the layout might have changed
        this.arrangeByLayout(oldVisual, label.layout, true);
        return oldVisual;
      },
      '$CreateRenderDataCache$1': function(/*yworks.canvas.drawing.IRenderContext*/ context, /*yworks.yfiles.ui.model.ILabel*/ label, /*yfiles.system.Typeface*/ typeface) {
        // Visibility of button changes dependent on the zoom level
        var /*boolean*/ buttonVisibility = context.zoom > 1;
        return new demo.yfiles.graph.simplecustomstyle.MySimpleLabelStyle.RenderDataCache(label.text, buttonVisibility, typeface);
      },
      '$Render$1': function(/*yworks.yfiles.ui.model.ILabel*/ label, /*yworks.canvas.CanvasContainer*/ container, /*yworks.canvas.geometry.IOrientedRectangle*/ labelLayout, /*yworks.canvas.drawing.IRenderContext*/ context, /*demo.yfiles.graph.simplecustomstyle.MySimpleLabelStyle.RenderDataCache*/ cache) {
        // store information with the visual on how we created it
        container.setRenderDataCache(cache);

        // background rectangle
        var /*yworks.canvas.drawing.headless.RectVisual*/ rect;
        if (container.children.count > 0) {
          rect = /*(yworks.canvas.drawing.headless.RectVisual)*/container.children.get(0);
        } else {
          rect = new yworks.canvas.drawing.headless.RectVisual.FromRectangle(new yworks.canvas.geometry.Rectangle(0, 0, labelLayout.width, labelLayout.height));
          container.add(rect);
        }
        rect.setArcRadius(labelLayout.width / 10);
        rect.setPen(yworks.canvas.drawing.Pens.skyBlue, context);
        rect.setBrush(demo.yfiles.graph.simplecustomstyle.MySimpleLabelStyle.FILL_BRUSH, context);

        var /*yworks.canvas.drawing.headless.TextVisual*/ textVisual;
        if (container.children.count > 1) {
          textVisual = /*(yworks.canvas.drawing.headless.TextVisual)*/container.children.get(1);
        } else {
          textVisual = new yworks.canvas.drawing.headless.TextVisual();
          container.add(textVisual);
        }
        // Textblock with label text
        var /*stubs.textType*/ textBlock = /*(stubs.textType)*/textVisual.svgElement;
        textBlock.textContent = cache.labelText;
        textBlock.setAttributeNS(null, "font-family", cache.typeface.fontFamily);
        textBlock.setAttributeNS(null, "font-style", yworks.canvas.svg.SVGExtensions.toSvgFontStyle(cache.typeface.fontStyle));
        textBlock.setAttributeNS(null, "font-weight", yworks.canvas.svg.SVGExtensions.toSvgFontWeight(cache.typeface.fontWeight));
        textBlock.setAttributeNS(null, "font-size", "" + cache.typeface.fontSize);
        textBlock.setAttributeNS(null, "fill", yworks.support.windows.Colors.black.toSvgColor());
        textBlock.setAttributeNS(null, "style", "dominant-baseline: central;");

        var /*yworks.canvas.geometry.structs.SizeD*/ textSize = yworks.yfiles.ui.drawing.SimpleLabelStyleRenderer.measureTextForFont(cache.labelText, cache.typeface);

        // if edit button is visible align left, otherwise center
        var /*double*/ textPositionLeft = cache.buttonVisibility ? demo.yfiles.graph.simplecustomstyle.MySimpleLabelStyle.HORIZONTAL_INSET : (labelLayout.width - textSize.$width) / 2;


        textVisual.transform = new yworks.canvas.geometry.Matrix2D.FromValues(1, 0, 0, 1, textPositionLeft, labelLayout.height * 0.5);
        if (container.children.count > 2) {
          container.remove(container.children.get(2));
        }
        if (cache.buttonVisibility) {
          var /*yworks.canvas.drawing.headless.FrameworkElement*/ button = this.createButton(context);
          button.transform = new yworks.canvas.geometry.Matrix2D.FromValues(1, 0, 0, 1, labelLayout.width - demo.yfiles.graph.simplecustomstyle.MySimpleLabelStyle.HORIZONTAL_INSET - demo.yfiles.graph.simplecustomstyle.MySimpleLabelStyle.BUTTON_SIZE, demo.yfiles.graph.simplecustomstyle.MySimpleLabelStyle.VERTICAL_INSET);
          container.children.add(button);

          button.svgElement.addEventListener("click", (function(/*Event*/ evt) {
            this.$OnMouseDown$1(/*(MouseEvent)*/evt);
          }).bind(this), false);
        }
      },
      'createButton': function(/*yworks.canvas.ICanvasContext*/ ctx) {
        var /*yworks.canvas.drawing.headless.RectVisual*/ newInstance = new yworks.canvas.drawing.headless.RectVisual();
        {
          newInstance.bounds = new yworks.canvas.geometry.structs.RectD(0, 0, demo.yfiles.graph.simplecustomstyle.MySimpleLabelStyle.BUTTON_SIZE, demo.yfiles.graph.simplecustomstyle.MySimpleLabelStyle.BUTTON_SIZE);
        }
        var /*yworks.canvas.drawing.headless.RectVisual*/ button = newInstance;
        button.setBrush(new yworks.canvas.drawing.headless.SolidColorBrush(yworks.canvas.drawing.headless.Color.fromArgb(20, 0, 0, 0)), ctx);
        button.setPen(yworks.canvas.drawing.Pens.black, ctx);
        button.setArcRadius(3);
        return button;
      },
      '$OnMouseDown$1': function(/*MouseEvent*/ evt) {
        var /*Element*/ graphControlElement = demo.yfiles.graph.simplecustomstyle.MySimpleLabelStyle.getAncestorElementByAttribute((evt.target instanceof Element) ? /*(Element)*/evt.target : null, "id", "graphControl");
        var /*yworks.yfiles.ui.GraphControl*/ graphControl = graphControlElement !== null ? (graphControlElement["data-this"] instanceof yworks.yfiles.ui.GraphControl) ? /*(yworks.yfiles.ui.GraphControl)*/graphControlElement["data-this"] : null : null;
        var /*Element*/ svgElement = demo.yfiles.graph.simplecustomstyle.MySimpleLabelStyle.getAncestorElementByAttribute((evt.target instanceof Element) ? /*(Element)*/evt.target : null, "data-internalId", "MySimpleLabel");
        var /*yworks.yfiles.ui.model.ILabel*/ label = svgElement !== null ? (yworks.yfiles.ui.model.ILabel.isInstance(svgElement["data-item"])) ? /*(yworks.yfiles.ui.model.ILabel)*/svgElement["data-item"] : null : null;
        if (graphControl !== null && label !== null) {
          var /*yfiles.lang.Object*/ tmp = graphControl.inputMode;
          var /*yworks.yfiles.ui.input.GraphEditorInputMode*/ inputMode = (tmp instanceof yworks.yfiles.ui.input.GraphEditorInputMode) ? /*(yworks.yfiles.ui.input.GraphEditorInputMode)*/tmp : null;
          if (inputMode !== null) {
            inputMode.editLabel(label);
          }
        }
      },
      // #endregion 
      // #region Rendering Helper Methods
      'getPreferredSize': function(/*yworks.yfiles.ui.model.ILabel*/ label) {
        // first measure
        var /*yworks.canvas.geometry.structs.SizeD*/ size = yworks.yfiles.ui.drawing.SimpleLabelStyleRenderer.measureTextForFont(label.text, this.typeface);
        // then use the desired size - plus rounding and insets, as well as space for button
        return new yworks.canvas.geometry.structs.SizeD(Math.ceil(0.5 + size.$width) + demo.yfiles.graph.simplecustomstyle.MySimpleLabelStyle.HORIZONTAL_INSET * 3 + demo.yfiles.graph.simplecustomstyle.MySimpleLabelStyle.BUTTON_SIZE, 2 * demo.yfiles.graph.simplecustomstyle.MySimpleLabelStyle.VERTICAL_INSET + Math.max(demo.yfiles.graph.simplecustomstyle.MySimpleLabelStyle.BUTTON_SIZE, Math.ceil(0.5 + size.$height)));
      },
      // #endregion 
      '$static': {
        'FILL_BRUSH': null,
        'EDIT_BUTTON_STYLE': null,
        'HORIZONTAL_INSET': 4,
        'VERTICAL_INSET': 2,
        'BUTTON_SIZE': 16,
        'getAncestorElementByAttribute': function(/*Element*/ descendent, /*yfiles.lang.String*/ attributeName, /*yfiles.lang.String*/ attributeValue) {
          var /*Element*/ walker = descendent;
          while (walker !== null && (yfiles.system.text.StringExtensions.isNotEqual(walker.getAttribute(attributeName), attributeValue))) {
            walker = (walker.parentNode instanceof Element) ? /*(Element)*/walker.parentNode : null;
          }
          return walker;
        },
        'RenderDataCache': new yfiles.ClassDefinition(function() {
          return {
            'constructor': function(/*yfiles.lang.String*/ labelText, /*boolean*/ buttonVisibility, /*yfiles.system.Typeface*/ typeface) {
              this.labelText = labelText;
              this.buttonVisibility = buttonVisibility;
              this.typeface = typeface;
            },
            '$labelText$0': null,
            'labelText': {
              'get': function() {
                return this.$labelText$0;
              },
              'set': function(/*yfiles.lang.String*/ value) {
                this.$labelText$0 = value;
              }
            },
            '$buttonVisibility$0': false,
            'buttonVisibility': {
              'get': function() {
                return this.$buttonVisibility$0;
              },
              'set': function(/*boolean*/ value) {
                this.$buttonVisibility$0 = value;
              }
            },
            '$typeface$0': null,
            'typeface': {
              'get': function() {
                return this.$typeface$0;
              },
              'set': function(/*yfiles.system.Typeface*/ value) {
                this.$typeface$0 = value;
              }
            },
            '$Equals$0': function(/*demo.yfiles.graph.simplecustomstyle.MySimpleLabelStyle.RenderDataCache*/ other) {
              return yfiles.system.text.StringExtensions.stringEquals(other.labelText, this.labelText) && other.buttonVisibility === this.buttonVisibility && other.typeface.equals(this.typeface);
            },
            'equals': function(/*yfiles.lang.Object*/ obj) {
              if (yfiles.lang.Object.referenceEquals(null, obj)) {
                return false;
              }
              if (yfiles.lang.getType(obj) !== demo.yfiles.graph.simplecustomstyle.MySimpleLabelStyle.RenderDataCache.$class) {
                return false;
              }
              return this.$Equals$0(/*(demo.yfiles.graph.simplecustomstyle.MySimpleLabelStyle.RenderDataCache)*/obj);
            }
          };
        }),
        '$clinit': function() {
          demo.yfiles.graph.simplecustomstyle.MySimpleLabelStyle.FILL_BRUSH = new yworks.canvas.drawing.headless.SolidColorBrush(yworks.canvas.drawing.headless.Color.fromArgb(255, 155, 226, 255));
        }
      }
    };
  })


});});
