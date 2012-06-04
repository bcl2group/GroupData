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
(typeof define === 'function' ? define : function(args, fn) {fn(jQuery);})(['jquery', 'yfiles/complete'], function($) {
	$.fn.GraphControl = function(callback) {
		this.each(function() {
			var el = $(this);
			var graphControl = new yworks.yfiles.ui.GraphControl();

			if(el.attr("data-yEditMode") != 'GraphViewer') {
				// set the input mode
				var mode = new yworks.yfiles.ui.input.GraphEditorInputMode();

		        // make bend creation more important than moving of selected edges
		        // this has the effect that dragging a selected edge (not its bends)
		        // will create a new bend instead of moving all bends
		        // This is especially nicer in conjunction with orthogonal
		        // edge editing because this creates additional bends every time
		        // the edge is moved otherwise
		        mode.createBendModePriority = mode.moveModePriority - 1;

		        // set edge creation mode
		        switch(el.attr('data-yCreateEdgeMode')) {
		        	case 'orthogonal':
			        	var orthogonalEdgeEditingContext = new yworks.yfiles.ui.input.OrthogonalEdgeEditingContext();
				        orthogonalEdgeEditingContext.orthogonalEdgeEditing = true;
				        mode.orthogonalEdgeEditingContext = orthogonalEdgeEditingContext;
				        mode.createEdgeInputMode.orthogonalEdgeCreation = true;
				        break;
		        }

		        graphControl.inputMode = mode;
		    } else {
		    	var graphViewerInputMode = new yworks.yfiles.ui.input.GraphViewerInputMode();
		    	graphViewerInputMode.toolTipItems = yworks.yfiles.ui.model.GraphItemTypes.LABELED_ITEM;
		        graphViewerInputMode.clickableItems = yworks.yfiles.ui.model.GraphItemTypes.NODE;
		        graphViewerInputMode.focusableItems = yworks.yfiles.ui.model.GraphItemTypes.NODE;
		        graphViewerInputMode.selectableItems = yworks.yfiles.ui.model.GraphItemTypes.NONE;
		        graphViewerInputMode.marqueeSelectableItems = yworks.yfiles.ui.model.GraphItemTypes.NONE;

		        graphViewerInputMode.navigationInputMode.collapsingGroupsAllowed = true;
		        graphViewerInputMode.navigationInputMode.expandingGroupsAllowed = true;
		        graphViewerInputMode.navigationInputMode.useCurrentItemForCommands = true;
		        graphViewerInputMode.navigationInputMode.fitContentAfterGroupActions = false;

		        graphControl.inputMode = graphViewerInputMode;
		    }

	        // set default node style
	        switch(el.attr('data-yNodeStyle')) {
				case 'ShinyPlateNodeStyle':
					var nodeStyle = new yworks.yfiles.ui.drawing.ShinyPlateNodeStyle.WithColor(yworks.support.windows.Colors.orange);
			        nodeStyle.drawShadow = true;
			        graphControl.graph.nodeDefaults.style = nodeStyle;
			        break;
			}

			var graphMLSource = el.attr('data-yGraphMLSource');
			if(graphMLSource) {
				var THIS = this;
	          	var ioHandler = new yworks.yfiles.graphml.GraphMLIOHandler();
	          	ioHandler.addParsedListener(function(/*yfiles.lang.Object*/ sender, /*yworks.yfiles.graphml.parser.ParseEventArgs*/ args) {
		            yworks.yfiles.ui.GraphControl.FIT_GRAPH_BOUNDS_COMMAND.executeOnTarget(null, graphControl);
		        });
		        ioHandler.readFromURI(graphControl.graph, graphMLSource);

		        // add to dom
		        if(el.attr('data-replace') == 'true') {
		        	el.replaceWith(graphControl.div);
		        } else {
		        	el.children().remove();
		        	el.append(graphControl.div);
		    	}

		        if(callback) {
					callback.call(THIS, graphControl);
				}
			} else {
		        // add to dom
		        if(el.attr('data-replace') == 'true') {
		        	el.replaceWith(graphControl.div);
		        } else {
		        	el.children().remove();
		        	el.append(graphControl.div);
		    	}

		        if(callback) {
					callback.call(this, graphControl);
				}
			}
		});
		return this;
	};
});