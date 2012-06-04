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
define(['dojo/_base/declare', 'dijit/_WidgetBase', 'dijit/_TemplatedMixin', 'dojo/data/ItemFileReadStore', 'dijit/tree/ForestStoreModel', 'dijit/tree/TreeStoreModel',"dojo/text!./StructureView.html"],
  function(declare, WidgetBase, TemplatedMixin, ItemFileReadStore, ForestStoreModel, TreeStoreModel,template) {

declare("demos.orgchart.widget.StructureView", [WidgetBase, TemplatedMixin], {

  templateString : template,

  tree : null,
  graphControl : null,
  commandManager : null,

  _rootItem : null,
  _store : null,

  _getGraphControlAttr: function() {
    return this.graphControl;
  },

  _setGraphControlAttr: function(value) {
    this._set("graphControl", value);
    this._initModel(value.graph);
    this._registerCurrentItemChangedListener();
  },
  
  _getCommandManagerAttr: function() {
    return this.commandManager;
  },

  _setCommandManagerAttr: function(value) {
    this._set("commandManager", value);
  },

  _initModel : function(graph) {
    var rootNode = orgchart.OrgChartUI.getRootNode(graph);
    var treeData = {
      identifier: "nodeId",
      label: "name",
      items : orgchart.TreeDataBuilder.createItems(graph)
    };

    this._store = new dojo.data.ItemFileReadStore({
      data: treeData
    });
    
    var treeModel = new dijit.tree.TreeStoreModel({
      store: this._store, 
      query : {
        nodeId : rootNode.tag.name
      }
    });

    this.tree = new dijit.Tree({
      persist: false,
      model: treeModel,
      onClick : dojo.hitch(this, "_onTreeNodeClicked")
    },
    "treeDiv");
    
    dojo.connect(this.tree, "_onEnterKey", this, "_onTreeEnterKey");
  },

  _onTreeNodeClicked : function(/* TreeDataItem */item) {  
    var control = this.get("graphControl");
    var node = this._store.getValue(item, "node");
    this.get("commandManager").selectAndCenterNode(node);
  },
  
  _onTreeEnterKey: function(/*Object*/ message, /*Event*/ evt) {
    var control = this.get("graphControl");
    var node = this._store.getValue(message.item, "node");
    this.get("commandManager").selectAndZoomToNode(node);
  },

  _registerCurrentItemChangedListener : function() {
    this.get("graphControl").addCurrentItemChangedListener(yfiles.lang.delegate(this._currentItemChanged, this));
  },

  _currentItemChanged: function(/*yfiles.lang.Object*/ source, /*yworks.canvas.model.ItemEventArgs<yworks.yfiles.ui.model.INode>*/ evt) {
    var node = this.get("graphControl").currentItem;
    this.onGraphViewNodeSelected(node.tag.name);
  },

  onGraphViewNodeSelected : function (nodeId) {
    // node already focused?
    var lastFocused = this.tree.lastFocused;
    if (lastFocused) {
      var item = lastFocused.item;
      var focusId = this._store.getValue(item, "nodeId");
      if (focusId === nodeId) {
        return;
      }
    }

    var self = this;

    var fetchArgs = {
      query : {
        nodeId : nodeId
      },
      onComplete : function(items, request) {
        if (items.length == 1) {
          var item = items[0];
          var path = [ self._store.getValue(item, "nodeId") ];
          self._focusItem(item, path);
        }
      }
    };

    this._store.fetch(fetchArgs);
  },

  _focusItem : function(item, path) {
    var parentId = this._store.getValue(item, "parentId");
    if (parentId) {
      var self = this;
      var fetchArgs = {
        query : {
          nodeId : parentId
        },
        onComplete : function(items, request) {
          if (items.length == 1) {
            var item = items[0];
            path.push(self._store.getValue(item, "nodeId"));
            self._focusItem(item, path);
          }
        }
      };

      this._store.fetch(fetchArgs);
    } else {

      // bug in dojo? if path only contains the root node,
      // the path attribute doesn't work.

      if (path.length > 1) {
        path.reverse();
        this.tree.set("path", path);
      } else {
        this.tree.focusNode(this.tree.rootNode);
      }

    }
  }

});
});
