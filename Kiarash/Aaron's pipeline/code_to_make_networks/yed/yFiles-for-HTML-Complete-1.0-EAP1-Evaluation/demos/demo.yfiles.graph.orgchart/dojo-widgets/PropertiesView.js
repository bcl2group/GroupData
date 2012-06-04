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
define(['dojo/_base/declare', 'dijit/_WidgetBase', 'dijit/_TemplatedMixin',"dojo/text!./PropertiesView.html"], function(declare, WidgetBase, TemplatedMixin,template) {

declare("demos.orgchart.widget.PropertiesView", [WidgetBase, TemplatedMixin], {

  templateString : template,

  propertiesDiv : null,
  propertiesTable : null,
  nameCell : null,
  positionCell : null,
  businessUnitCell : null,
  statusCell : null,
  emailCell : null,
  phoneCell : null,
  faxCell : null,

  graphControl : null,

  _getGraphControlAttr: function() {
    return this.graphControl;
  },

  _setGraphControlAttr: function(value) {
    this._set("graphControl", value);
    this._registerCurrentItemChangedListener();
  },

  _registerCurrentItemChangedListener : function() {
    this.get("graphControl").addCurrentItemChangedListener(yfiles.lang.delegate(this._currentItemChanged, this));
  },

  _currentItemChanged: function(/*yfiles.lang.Object*/ source, /*com.yworks.canvas.model.ItemEventArgs<com.yworks.yfiles.ui.model.INode>*/ evt) {
    this.showProperties(this.get("graphControl").currentItem);
  },

  showProperties : function(node) {
    for (attribute in node.tag) {
      var td = this[ attribute + "Cell" ];
      if (td) {
        var val = node.tag[ attribute ];
        this._removeDOMChildren(td);
        td.appendChild(dojo.doc.createTextNode(val));
      }
    }
  },

  _removeDOMChildren : function(domNode) {
    while (domNode.hasChildNodes()) {
      this._removeDOMChildren(domNode.firstChild);
      dojo._destroyElement(domNode.firstChild);
    }
  }
});
});