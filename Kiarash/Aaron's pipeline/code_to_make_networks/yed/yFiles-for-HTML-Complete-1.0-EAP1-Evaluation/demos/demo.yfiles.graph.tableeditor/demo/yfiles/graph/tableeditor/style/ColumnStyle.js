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
   * Custom stripe style that alternates the visualizations for the leaf nodes and uses a different style for all parent stripes.
   */
  /*public*/ exports.ColumnStyle = new yfiles.ClassDefinition(function() {
    return {
      '$extends': yworks.yfiles.ui.drawing.SimpleAbstractNodeStyle,
      'constructor': function() {
        yworks.yfiles.ui.drawing.SimpleAbstractNodeStyle.call(this, yworks.canvas.CanvasContainer.$class);
        yworks.yfiles.ui.drawing.SimpleAbstractNodeStyle.call(this, yworks.canvas.CanvasContainer.$class);
      },
      '$evenLeafDescriptor$1': null,
      /**
       * Visualization for all leaf stripes that have an even index
       */
      'evenLeafDescriptor': {
        'get': function() {
          return this.$evenLeafDescriptor$1;
        },
        'set': function(/*demo.yfiles.graph.tableeditor.style.StripeDescriptor*/ value) {
          this.$evenLeafDescriptor$1 = value;
        }
      },
      '$parentDescriptor$1': null,
      /**
       * Visualization for all stripes that are not leafs
       */
      'parentDescriptor': {
        'get': function() {
          return this.$parentDescriptor$1;
        },
        'set': function(/*demo.yfiles.graph.tableeditor.style.StripeDescriptor*/ value) {
          this.$parentDescriptor$1 = value;
        }
      },
      '$oddLeafDescriptor$1': null,
      /**
       * Visualization for all leaf stripes that have an odd index
       */
      'oddLeafDescriptor': {
        'get': function() {
          return this.$oddLeafDescriptor$1;
        },
        'set': function(/*demo.yfiles.graph.tableeditor.style.StripeDescriptor*/ value) {
          this.$oddLeafDescriptor$1 = value;
        }
      },
      'createVisual': function(/*yworks.yfiles.ui.model.INode*/ node, /*yworks.canvas.drawing.IRenderContext*/ ctx) {
        var /*yworks.yfiles.ui.model.IStripe*/ stripe = node.lookup(yworks.yfiles.ui.model.IStripe.$class);
        var /*yworks.canvas.geometry.IRectangle*/ layout = node.layout;
        if (stripe !== null) {
          var /*yworks.canvas.CanvasContainer*/ cc = new yworks.canvas.CanvasContainer();// { AllowDrop = true };
          var /*yworks.canvas.geometry.structs.InsetsD*/ stripeInsets;

          var /*demo.yfiles.graph.tableeditor.style.StripeDescriptor*/ descriptor;
          //Depending on the stripe type, we need to consider horizontal or vertical insets
          if (yworks.yfiles.ui.model.IColumn.isInstance(stripe)) {
            var /*yworks.yfiles.ui.model.IColumn*/ col = /*(yworks.yfiles.ui.model.IColumn)*/stripe;
            stripeInsets = new yworks.canvas.geometry.structs.InsetsD.FromLeftTopRightAndBottom(0, col.getActualInsets().$top, 0, col.getActualInsets().$bottom);
          } else {
            var /*yworks.yfiles.ui.model.IRow*/ row = /*(yworks.yfiles.ui.model.IRow)*/stripe;
            stripeInsets = new yworks.canvas.geometry.structs.InsetsD.FromLeftTopRightAndBottom(row.getActualInsets().$left, 0, row.getActualInsets().$right, 0);
          }

          var /*yworks.canvas.geometry.structs.InsetsD*/ actualBorderThickness;

          if (yfiles.system.collections.EnumerableExtensions./*<yworks.yfiles.ui.model.IStripe>*/count(stripe.getChildren()) > 0) {
            //Parent stripe - use the parent descriptor
            descriptor = this.parentDescriptor;
            actualBorderThickness = descriptor.borderThickness;
          } else {
            var /*int*/ index;
            if (yworks.yfiles.ui.model.IColumn.isInstance(stripe)) {
              var /*yworks.yfiles.ui.model.IColumn*/ col = /*(yworks.yfiles.ui.model.IColumn)*/stripe;
              //Get all leaf columns
              var /*yfiles.system.collections.generic.List<yworks.yfiles.ui.model.IStripe>*/ leafs = yfiles.system.collections.EnumerableExtensions./*<yworks.yfiles.ui.model.IStripe>*/toList(col.table.rootColumn.getLeaves());
              //Determine the index
              index = leafs.findIndex((function(/*yworks.yfiles.ui.model.IStripe*/ curr) {
                return col === curr;
              }).bind(this));
              //Use the correct descriptor
              descriptor = index % 2 === 0 ? this.evenLeafDescriptor : this.oddLeafDescriptor;
              actualBorderThickness = descriptor.borderThickness;
            } else {
              var /*yworks.yfiles.ui.model.IRow*/ row = /*(yworks.yfiles.ui.model.IRow)*/stripe;
              var /*yfiles.system.collections.generic.List<yworks.yfiles.ui.model.IStripe>*/ leafs = yfiles.system.collections.EnumerableExtensions./*<yworks.yfiles.ui.model.IStripe>*/toList(row.table.rootRow.getLeaves());
              index = leafs.findIndex((function(/*yworks.yfiles.ui.model.IStripe*/ curr) {
                return row === curr;
              }).bind(this));
              descriptor = index % 2 === 0 ? this.evenLeafDescriptor : this.oddLeafDescriptor;
              actualBorderThickness = descriptor.borderThickness;
            }
          }

          {
            var /*demo.yfiles.graph.tableeditor.style.BorderVisual*/ newInstance = new demo.yfiles.graph.tableeditor.style.BorderVisual();
            {
              newInstance.bounds = new yworks.canvas.geometry.structs.RectD(0, 0, layout.width, layout.height);
              newInstance.borderThickness = stripeInsets;
            }
            var /*demo.yfiles.graph.tableeditor.style.BorderVisual*/ border1 = newInstance;
            border1.$SetBackgroundBrush$1(descriptor.backgroundBrush, ctx);
            border1.$SetBorderBrush$1(descriptor.insetBrush, ctx);
            cc.add(border1);
            var /*demo.yfiles.graph.tableeditor.style.BorderVisual*/ newInstance1 = new demo.yfiles.graph.tableeditor.style.BorderVisual();
            {
              newInstance1.bounds = new yworks.canvas.geometry.structs.RectD(0, 0, layout.width, layout.height);
              newInstance1.borderThickness = actualBorderThickness;
            }
            var /*demo.yfiles.graph.tableeditor.style.BorderVisual*/ border2 = newInstance1;
            border2.$SetBackgroundBrush$1(yworks.support.windows.Brushes.transparent, ctx);
            border2.$SetBorderBrush$1(descriptor.borderBrush, ctx);
            cc.add(border2);
          }
          cc.setCanvasArrangeRect(layout.toRectD());
          var /*demo.yfiles.graph.tableeditor.style.ColumnStyle.RenderDataCache*/ renderData = demo.yfiles.graph.tableeditor.style.ColumnStyle.createRenderDataCache(ctx, descriptor, stripe, stripeInsets.clone());
          cc.setRenderDataCache(renderData);
          return cc;
        }
        return new yworks.canvas.CanvasContainer();
      },
      'updateVisual': function(/*yworks.yfiles.ui.model.INode*/ node, /*yworks.canvas.drawing.IRenderContext*/ ctx, /*yworks.canvas.CanvasContainer*/ oldVisual) {
        var /*yworks.yfiles.ui.model.IStripe*/ stripe = node.lookup(yworks.yfiles.ui.model.IStripe.$class);
        var /*yworks.canvas.geometry.IRectangle*/ layout = node.layout;
        if (stripe !== null) {
          var /*yworks.canvas.geometry.structs.InsetsD*/ stripeInsets;
          //Check if values have changed - then update everything
          var /*demo.yfiles.graph.tableeditor.style.StripeDescriptor*/ descriptor;
          if (yworks.yfiles.ui.model.IColumn.isInstance(stripe)) {
            var /*yworks.yfiles.ui.model.IColumn*/ col = /*(yworks.yfiles.ui.model.IColumn)*/stripe;
            stripeInsets = new yworks.canvas.geometry.structs.InsetsD.FromLeftTopRightAndBottom(0, col.getActualInsets().$top, 0, col.getActualInsets().$bottom);
          } else {
            var /*yworks.yfiles.ui.model.IRow*/ row = /*(yworks.yfiles.ui.model.IRow)*/stripe;
            stripeInsets = new yworks.canvas.geometry.structs.InsetsD.FromLeftTopRightAndBottom(row.getActualInsets().$left, 0, row.getActualInsets().$right, 0);
          }

          var /*yworks.canvas.geometry.structs.InsetsD*/ actualBorderThickness;

          if (yfiles.system.collections.EnumerableExtensions./*<yworks.yfiles.ui.model.IStripe>*/count(stripe.getChildren()) > 0) {
            descriptor = this.parentDescriptor;
            actualBorderThickness = descriptor.borderThickness;
          } else {
            var /*int*/ index;
            if (yworks.yfiles.ui.model.IColumn.isInstance(stripe)) {
              var /*yworks.yfiles.ui.model.IColumn*/ col = /*(yworks.yfiles.ui.model.IColumn)*/stripe;
              var /*yfiles.system.collections.generic.List<yworks.yfiles.ui.model.IStripe>*/ leafs = yfiles.system.collections.EnumerableExtensions./*<yworks.yfiles.ui.model.IStripe>*/toList(col.table.rootColumn.getLeaves());
              index = leafs.findIndex((function(/*yworks.yfiles.ui.model.IStripe*/ curr) {
                return col === curr;
              }).bind(this));
              descriptor = index % 2 === 0 ? this.evenLeafDescriptor : this.oddLeafDescriptor;
              actualBorderThickness = descriptor.borderThickness;
            } else {
              var /*yworks.yfiles.ui.model.IRow*/ row = /*(yworks.yfiles.ui.model.IRow)*/stripe;
              var /*yfiles.system.collections.generic.List<yworks.yfiles.ui.model.IStripe>*/ leafs = yfiles.system.collections.EnumerableExtensions./*<yworks.yfiles.ui.model.IStripe>*/toList(row.table.rootRow.getLeaves());
              index = leafs.findIndex((function(/*yworks.yfiles.ui.model.IStripe*/ curr) {
                return row === curr;
              }).bind(this));
              descriptor = index % 2 === 0 ? this.evenLeafDescriptor : this.oddLeafDescriptor;
              actualBorderThickness = descriptor.borderThickness;
            }
          }

          // get the data with wich the oldvisual was created
          var /*demo.yfiles.graph.tableeditor.style.ColumnStyle.RenderDataCache*/ oldCache = yworks.canvas.svg.SVGExtensions.getRenderDataCache(demo.yfiles.graph.tableeditor.style.ColumnStyle.RenderDataCache.$class, oldVisual);
          // get the data for the new visual
          var /*demo.yfiles.graph.tableeditor.style.ColumnStyle.RenderDataCache*/ newCache = demo.yfiles.graph.tableeditor.style.ColumnStyle.createRenderDataCache(ctx, descriptor, stripe, stripeInsets.clone());

          // check if something changed except for the location of the node
          if (!newCache.$Equals$0(oldCache)) {
            // something changed - just re-render the visual
            return this.createVisual(node, ctx);
          }
          var /*demo.yfiles.graph.tableeditor.style.BorderVisual*/ borderVisual = /*(demo.yfiles.graph.tableeditor.style.BorderVisual)*/oldVisual.children.get(0);
          borderVisual.bounds = new yworks.canvas.geometry.structs.RectD(borderVisual.bounds.$x, borderVisual.bounds.$y, layout.width, layout.height);
          borderVisual.borderThickness = stripeInsets.clone();

          var /*demo.yfiles.graph.tableeditor.style.BorderVisual*/ stripeVisual = /*(demo.yfiles.graph.tableeditor.style.BorderVisual)*/oldVisual.children.get(1);
          stripeVisual.bounds = new yworks.canvas.geometry.structs.RectD(stripeVisual.bounds.$x, stripeVisual.bounds.$y, layout.width, layout.height);
          stripeVisual.borderThickness = actualBorderThickness.clone();
          oldVisual.setCanvasArrangeRect(layout.toRectD());
          return oldVisual;
        }
        return new yworks.canvas.CanvasContainer();
      },
      '$static': {
        'RenderDataCache': new yfiles.ClassDefinition(function() {
          return {
            'constructor': function() {
              this.$$init$0();
            },
            '$descriptor$0': null,
            'descriptor': {
              'get': function() {
                return this.$descriptor$0;
              },
              'set': function(/*demo.yfiles.graph.tableeditor.style.StripeDescriptor*/ value) {
                this.$descriptor$0 = value;
              }
            },
            '$insets$0': null,
            'insets': {
              'get': function() {
                return this.$insets$0;
              },
              'set': function(/*yworks.canvas.geometry.structs.InsetsD*/ value) {
                this.$insets$0 = value;
              }
            },
            '$stripe$0': null,
            'stripe': {
              'get': function() {
                return this.$stripe$0;
              },
              'set': function(/*yworks.yfiles.ui.model.IStripe*/ value) {
                this.$stripe$0 = value;
              }
            },
            '$Equals$0': function(/*demo.yfiles.graph.tableeditor.style.ColumnStyle.RenderDataCache*/ other) {
              return demo.yfiles.graph.tableeditor.style.StripeDescriptor.equals(other.descriptor, this.descriptor) && yworks.canvas.geometry.structs.InsetsD.equals(other.insets, this.insets) && other.stripe === this.stripe;
            },
            'equals': function(/*yfiles.lang.Object*/ obj) {
              if (yfiles.lang.Object.referenceEquals(null, obj)) {
                return false;
              }
              if (yfiles.lang.getType(obj) !== demo.yfiles.graph.tableeditor.style.ColumnStyle.RenderDataCache.$class) {
                return false;
              }
              return this.$Equals$0(/*(demo.yfiles.graph.tableeditor.style.ColumnStyle.RenderDataCache)*/obj);
            },
            '$$init$0': function() {
              this.$insets$0 = yworks.canvas.geometry.structs.InsetsD.createDefault();
            }
          };
        }),
        'createRenderDataCache': function(/*yworks.canvas.drawing.IRenderContext*/ renderContext, /*demo.yfiles.graph.tableeditor.style.StripeDescriptor*/ descriptor, /*yworks.yfiles.ui.model.IStripe*/ stripe, /*yworks.canvas.geometry.structs.InsetsD*/ insets) {
          var /*demo.yfiles.graph.tableeditor.style.ColumnStyle.RenderDataCache*/ newInstance = new demo.yfiles.graph.tableeditor.style.ColumnStyle.RenderDataCache();
          {
            newInstance.descriptor = descriptor;
            newInstance.stripe = stripe;
            newInstance.insets = insets;
          }
          return newInstance;
        }
      }
    };
  })


});});
