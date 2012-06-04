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
yfiles.module("yworks", function(exports) {

  exports.$meta = function() {
    return [yworks.support.XmlnsDefinitionAttribute("http://www.yworks.com/yfiles-for-html/1.0/demos/graphviewer/styles", "demo.yfiles.graph.viewer"), yworks.support.XmlnsPrefixAttribute("http://www.yworks.com/yfiles-for-html/1.0/demos/graphviewer/styles", "ydemo")];
  };


});});
