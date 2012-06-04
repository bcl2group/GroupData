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
(typeof define=='function'?define:(function(dependencies, fn){fn();}))(['yfiles/lang'],function(){yfiles.module("_$$_xvb",function(exports){exports._$$_wvb=new yfiles.ClassDefinition(function(){return {'$extends':Root.BSB,'$meta':[Root.DSB("items")],'constructor':{'default':function(){Root.BSB.call(this);this.$$init$1();},'_$$_bm':{'$meta':function(){return [Root.UQC("type",yfiles.lang.Class.$class,!1)];},'value':function(a){Root.BSB.call(this);this.$$init$1(),this.$f=a;}},'_$$_am':{'$meta':function(){return [Root.UQC("array",Object.$class,!1)];},'value':function(a){Root.BSB.call(this);this.$$init$1(),this.$f=yfiles.lang.getType(a).getElementType();var c=a.m();while(c.g()){var b=c.c;this.$f1.n(b);}}}},'_$$_nz':{'$meta':function(){return [Root.UYB().init({"c":1}),Root.TQC(yfiles.lang.Class.$class)];},'get':function(){return this.$f;},'set':function(value){this.$f=value;}},'_$$_aab':{'$meta':function(){return [Root.ZNC(2),Root.TQC(Root.XPC.$class)];},'get':function(){return this.$f1;}},'$f':null,'$f1':null,'h':function(a){if(this.a===null){throw new Root.ROC.a("Type must not be null");}return this.$m1(this.$f1,this.$f);},'$m1':function(a,b){var c=Object.createInstance(b,a.c);var d=0;var f=a.E();while(f.g()){var e=f.d;c[d++]=e;}return c;},'$$init$1':function(){this.$f1=new Root.AQC();}};})});yfiles.module("_$$_xvb",function(exports){exports._$$_yvb=new yfiles.ClassDefinition(function(){return {'$extends':Root.BSB,'constructor':function(){Root.BSB.call(this);},'h':function(a){return null;}};})});yfiles.module("_$$_xvb",function(exports){exports._$$_zvb=new yfiles.ClassDefinition(function(){return {'$extends':Root.BSB,'constructor':{'default':function(){Root.BSB.call(this);},'_$$_cm':{'$meta':function(){return [Root.UQC("member",yfiles.system.reflect.MemberInfo.$class,!1)];},'value':function(a){Root.BSB.call(this);this.$f=a;}}},'$f':null,'_$$_hbb':{'$meta':function(){return [Root.UYB().init({"c":1}),Root.TQC(yfiles.system.reflect.MemberInfo.$class)];},'get':function(){return this.$f;},'set':function(value){this.$f=value;}},'h':function(a){if(this.$f instanceof yfiles.system.reflect.FieldInfo){return (this.$f).getValue(null);}if(this.$f instanceof yfiles.system.reflect.PropertyInfo){return Root.ZB.$m7((this.$f),null);}throw new Root.OOC.a("Invalid type for property Member");}};})});yfiles.module("_$$_xvb",function(exports){exports._$_rml=new yfiles.ClassDefinition(function(){return {'$extends':Root.SSB,'constructor':function(){Root.SSB.call(this);},'c':function(a,b){return a instanceof yfiles.system.reflect.MemberInfo&&b.n(Root.GZB.$class)!==null;},'a':function(a,b){var c=(a instanceof yfiles.system.reflect.MemberInfo)?a:null;if(c!==null){var d=b.n(Root.RXB.$class);var e={};var f={};if(Root.KF.$m8(d,c.declaringType,e,f)){var g=Root.ZRC.d(f.value)?"":f.value+":";return g+c.declaringType.name+"."+c.name;}}throw new Root.OOC.a("Unable to convert "+a+" to string");},'d':function(a,b){return !0;},'b':function(a,b){var i=b.n(Root.AXB.$class);var c=(Root.AXB.isInstance(i))?i:null;if(c!==null){var d=Root.ZRC.s(a,".");var e=a.substr(0,d);var f=Root.KF.$m(e,c);var g=a.substr(d+1);if(f!==null){var h=this.$m1(f,g);if(h!==null){return h;}if(c.e(yfiles.lang.Boolean.$class,Root.AYB.CONVERT_PROPERTY_CASE)){h=this.$m1(f,Root.LF.$m(g));}if(h!==null){return h;}if(c.e(yfiles.lang.Boolean.$class,Root.AYB.CONVERT_PROPERTY_CASE)){h=this.$m1(f,Root.LF.$m1(g));}if(h!==null){return h;}throw new Root.OOC.a("No public member with name "+a+" found");}}throw new Root.OOC.a("Unable to convert "+a+" to MemberInfo");},'$m1':function(a,b){var c=a.getProperty(b,16|8);if(c!==null){return c;}var d=a.getField(b,16|8);if(d!==null){return d;}return null;}};})});yfiles.module("_$$_xvb",function(exports){exports._$$_awb=new yfiles.ClassDefinition(function(){return {'$extends':Root.BSB,'constructor':{'default':function(){Root.BSB.call(this);},'_$$_dm':{'$meta':function(){return [Root.UQC("typeName",yfiles.lang.String.$class,!1)];},'value':function(a){Root.BSB.call(this);this.$f1=a;}}},'$f1':null,'_$$_bdb':{'$meta':function(){return [Root.UYB().init({"c":1}),Root.TQC(yfiles.lang.String.$class)];},'get':function(){return this.$f1;},'set':function(value){this.$f1=value;}},'_$$_nz':{'$meta':function(){return [Root.TQC(yfiles.lang.Class.$class)];},'get':function(){return this.$f;},'set':function(value){this.$f=value;}},'$f':null,'h':function(a){if(this.a!==null){return this.a;}var c=a.n(Root.AXB.$class);var b=(Root.AXB.isInstance(c))?c:null;if(b!==null&&this.$f1!==null){return Root.KF.$m(this.$f1,b);}throw new Root.OOC.a("Unable to convert Type Extension");}};})});yfiles.module("_$$_xvb",function(exports){exports._$$_fwb=new yfiles.ClassDefinition(function(){return {'$extends':Root.BSB,'$meta':[Root.DSB("items")],'constructor':{'default':function(){Root.BSB.call(this);this.$$init$1();},'_$$_em':{'$meta':function(){return [Root.UQC("enumerable",Root.MPC.$class,!1)];},'value':function(a){Root.BSB.call(this);this.$$init$1();var c=a.m();while(c.g()){var b=c.c;this.$f.n(b);}}},'_$$_fm':{'$meta':function(){return [Root.UQC("enumerable",Root.RPC.$class,!1)];},'value':function(a){Root.BSB.call(this);this.$$init$1();var c=a.m();while(c.g()){var b=c.c;this.$f.n(b);}}}},'$f':null,'_$$_bab':{'$meta':function(){return [Root.ZNC(2),Root.TQC(Root.XPC.$class)];},'get':function(){return this.$f;}},'h':function(a){return this.$f;},'$$init$1':function(){this.$f=new Root.AQC();}};})});yfiles.module("_$$_xvb",function(exports){exports._$$_gwb=new yfiles.ClassDefinition(function(){return {'$extends':Root.BSB,'$meta':[Root.DSB("items")],'constructor':{'_$$_gm':{'$meta':function(){return [Root.UQC("typeArgument",yfiles.lang.Class.$class,!1)];},'value':function(a){Root.BSB.call(this);this.$f=a,this.$f1=this.$m1(this.$f);}},'_$$_hm':{'$meta':function(){return [Root.UQC("enumerable",Root.RPC.$class,!1),Root.UQC("typeArgument",yfiles.lang.Class.$class,!1)];},'value':function(a,b){Root.JZB.a.call(this,b);var d=a.m();while(d.g()){var c=d.c;this.$f1.b(c);}}},'default':function(){Root.JZB.a.call(this,yfiles.lang.Object.$class);}},'$f1':null,'_$$_aab':{'$meta':function(){return [Root.ZNC(2),Root.TQC(Root.XPC.$class)];},'get':function(){if(this.$f1===null){this.$f1=this.$m1(this.$f);}return this.$f1;}},'$m1':function(a){var b=this.d(a);var c=Root.QNC.a(b);return (Root.XPC.isInstance(c))?c:null;},'$f':null,'_$$_nz':{'$meta':function(){return [Root.UYB().init({"c":1,"f":2}),Root.TQC(yfiles.lang.Class.$class)];},'get':function(){return this.$f;},'set':function(value){this.$f=value;if(this.$f1!==null){var a=this.$f1;this.$f1=null,this.c(a);}}},'_$$_oqb':function(a){var b=a;var c=this.b;for(var d=0;d<b.c;d++)c.b(b.q(d));},'_$$_xqb':function(a){return Root.AQC.$class.makeGenericType([a]);},'h':function(a){return this.$f1;}};})});});