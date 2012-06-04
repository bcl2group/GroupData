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
define(['dojo/_base/declare', 'dijit/_WidgetBase', 'dijit/_TemplatedMixin',"dojo/text!./GraphView.html"], function(declare, WidgetBase, TemplatedMixin, template) {
  return declare('demo.yfiles.dojo.GraphView', [WidgetBase, TemplatedMixin], {
    templateString: template,
    graphControl: null,
    _marginBox: null,

    postCreate: function() {
      this.set("graphControl", new yworks.yfiles.ui.GraphControl());
    },

    _getGraphControlAttr: function () {
      return this.graphControl;
    },

    _setGraphControlAttr: function (value) {
      this._set("graphControl", value);
      this.domNode.appendChild(value.div);

      if (this._marginBox) {
        this._resizeCore(this._marginBox);
      }
    },

    resize: function (/*Object*/ marginBox) {
  //    this.inherited(arguments); // TODO call the super method
      this._marginBox = marginBox;

      if (this.get("graphControl") && marginBox) {
        this._resizeCore(marginBox);
      }
    },

    _resizeCore: function (/*Object*/ marginBox) {
      var control = this.graphControl;
      dojo.marginBox(control.div, marginBox);

      // manually fire SizeChanged events for better responsiveness than the timer-based approach
      control.fireSizeChanged();
    }
  });
});