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
yfiles.module("demo.yfiles.io.fileoperations", function(exports) {

  /**
   * Base class for file operations. 
   */
  /*public*/ /*abstract*/ exports.FileOperation = new yfiles.ClassDefinition(function() {
    return {
      '$abstract': true,
      '$succeeded$0Event': null,
      'addSucceededListener': function(/*system.EventHandler<yfiles.system.EventArgs>*/ $succeeded$0Event) {
        this.$succeeded$0Event = yfiles.lang.delegate.combine(this.$succeeded$0Event, $succeeded$0Event);
      },
      'removeSucceededListener': function(/*system.EventHandler<yfiles.system.EventArgs>*/ $succeeded$0Event) {
        this.$succeeded$0Event = yfiles.lang.delegate.remove(this.$succeeded$0Event, $succeeded$0Event);
      },
      '$failed$0Event': null,
      'addFailedListener': function(/*system.EventHandler<yfiles.system.EventArgs>*/ $failed$0Event) {
        this.$failed$0Event = yfiles.lang.delegate.combine(this.$failed$0Event, $failed$0Event);
      },
      'removeFailedListener': function(/*system.EventHandler<yfiles.system.EventArgs>*/ $failed$0Event) {
        this.$failed$0Event = yfiles.lang.delegate.remove(this.$failed$0Event, $failed$0Event);
      },
      'onSuccess': function(/*demo.yfiles.io.fileoperations.FileEventArgs*/ args) {
        if (this.$succeeded$0Event !== null) {
          this.$succeeded$0Event(this, args);
        }
      },
      'onFail': function(/*demo.yfiles.io.fileoperations.FileEventArgs*/ args) {
        if (this.$failed$0Event !== null) {
          this.$failed$0Event(this, args);
        }
      },
      // Hides the given element either setting 'visibility:hidden' or 'display:none'.
      // In general, 'display:none' would be best but such elements are not clickable in Chrome 18,
      // therefore, we hide input elements as good as possible.
      '$static': {
        'setElementInvisible': function(/*HTMLElement*/ element, /*boolean*/ hideOnly) {
          var /*CSSStyleDeclaration*/ style = element.style;
          if (hideOnly) {
            style.setProperty("visibility", "hidden", "");
          } else {
            style.setProperty("display", "none", "");
          }
          style.setProperty("position", "absolute", "");
          style.setProperty("width", "0px", "");
          style.setProperty("height", "0px", "");
          style.setProperty("z-index", "0", "");
        }
      }
    };
  })


});});
