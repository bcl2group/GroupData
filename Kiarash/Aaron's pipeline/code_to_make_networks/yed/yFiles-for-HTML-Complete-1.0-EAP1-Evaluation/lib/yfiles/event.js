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
'use strict';("undefined"!=typeof define?define:function(e,c){c()})(["yfiles/lang"],function(){yfiles.module("yfiles.lang",function(e){e=e.delegate=function(c,d){if(!yfiles.lang.isFunction(c))var b=c,c=c[d],d=b;b=function(){return c.apply(d,arguments)};if(!c.$___belongsTo&&d&&d.getClass)c.$___belongsTo=d.getClass().name;b.handler=b;b.target=d;b.hashCode=function(){return yfiles.lang.HashCode.of(c.name||c.displayName)^41*(d&&d.hashCode?d.hashCode():13)};b.equals=function(a){return null==a?!1:a===this?
!0:a.target!==this.target?!1:a.hashCode&&a.hashCode()===this.hashCode()};return b};e.dynamicInvoke=function(c,d){return c.apply(null,d)};e.createDelegate=function(c,d){var b=function(){for(var a=0,b=c.length;a<b;a++)c[a].apply(d,arguments)};b.handler=c;b.target=d;b.hashCode=function(){for(var a=0,b=0,d=c.length;b<d;b++)a+=c[b].hashCode()^41;return a*(this.target&&this.target.hashCode?this.target.hashCode():13)};b.equals=function(a){return null==a?!1:a===this?!0:a.target!==this.target?!1:a.hashCode&&
a.hashCode()===this.hashCode()};return b};e.getInvocationList=function(c){return!c?[]:c.handler?yfiles.lang.isArray(c.handler)?c.handler:[c.handler]:[c]};e.combine=function(c,d){if(2<arguments.length){for(var b=null,a=0,e=arguments.length;a<e;a++)b=yfiles.lang.delegate.combine(b,arguments[a]);return b}b=yfiles.lang.isArray;if(null==c)return d;if(null==d)return c;a=[];b(c.handler)?Array.prototype.push.apply(a,c.handler):a.push(c);b(d.handler)?Array.prototype.push.apply(a,d.handler):a.push(d);return yfiles.lang.delegate.createDelegate(a)};
e.removeAll=function(c,d){var b=yfiles.lang.delegate.remove,a=null;do a=c,c=b(c,d);while(!a.equals(c));return a};e.remove=function(c,d){var b=yfiles.lang.isArray;if(null==c)return null;if(null==d)return c;if(c===d||c.equals(d))return null;var a=c.handler,e,h,f;if(!b(c.handler)&&!b(d.handler))return c;if(!b(d.handler)){for(b=a.length-1;0<=b;b--)if(a[b]===d||a[b].equals(d)){if(1===a.length)return null;if(2===a.length)return a[0===b?1:0];e=[];if(0<b)for(f=0;f<b;f++)e.push(a[f]);if(b<a.length-1)for(f=
0;f<a.length-(b+1);f++)e.push(a[b+1+f]);return yfiles.lang.delegate.createDelegate(e)}return c}var g=d.handler;if(g.length>a.length)return c;b=a.length-1;a:for(;b>=g.length-1;b--){for(h=0;h<g.length;h++)if(!a[b-h].equals(g[g.length-1-h]))continue a;if(g.length==a.length-1)return b==g.length?a[a.length-1]:a[0];e=[];if(b>g.length)for(f=0;f<b-g.length;f++)e.push(a[f]);if(b<a.length)for(h=0,f=b+1;h<a.length-g.length;f++,h++)e.push(a[f]);break}return yfiles.lang.delegate.createDelegate(e)}});yfiles.module("yfiles.lang",
function(e){var c=yfiles.lang.delegate;e.event=function(){var d=null,b=function(){d.apply(null,arguments)};b.add=function(a){d=c.combine(d,a)};b.remove=function(a){d=c.remove(d,a)};return b}})});
