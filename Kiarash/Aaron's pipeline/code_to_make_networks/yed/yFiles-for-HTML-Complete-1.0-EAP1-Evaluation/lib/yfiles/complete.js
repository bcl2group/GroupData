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
("undefined"!=typeof define?define:function(q,z){z()})([], function() {
    window.yfiles || (window.yfiles = {});

    var head = document.head || document.getElementsByTagName('head')[0];
    var downloadCompleted = function(ctx) {
        ctx.counter--;
        if(ctx.counter == 0) {
            ctx.callback();
        }
    };

    function loadScript(path, context, loader) {
        var script = document.createElement('script');
        var timerId = -1;
        script.type = 'text/javascript';
        script.onload = function() {
            downloadCompleted(context);
            script.onload = undefined;
            clearTimeout(timerId);
        };
        script.onerror = function(e) {
            console.log('Error loading '+path, e);
            script.onload = undefined;
            downloadCompleted(context);
            clearTimeout(timerId);
        };
        timerId = setTimeout(function() {
            console.log('Timeout while trying to load '+path);
            script.onload = undefined;
            downloadCompleted(context);
        }, yfiles.require.timeout);
        script.src = path;
        loader.appendChild(script);
    }
    
    function require(deps, callback) {
        var loader = document.createElement('div');
        loader.style.display = 'none';
        var ctx = {
            callback: function() {
                document.body.removeChild(loader);
                callback();
            },
            counter: deps.length
        };
        for(var i = 0, n = deps.length; i < n; i++) {
            loadScript(toURL(deps[i]), ctx, loader);
        }
        if(!document.body) {
          document.addEventListener("DOMContentLoaded", function() {
            document.body.appendChild(loader);
          }, false);
        } else {
          document.body.appendChild(loader);
        }
    }
    
    function toURL(file) {
        return yfiles.require.baseUrl + file + '.js';
    }
    
    function ready(additionalImports, callback) {

        if(typeof callback === 'undefined') {
            callback = additionalImports;
            additionalImports = null;
        }
        require(['yfiles/yfiles-complete','yfiles/mappings'], function() {
            var imports = additionalImports ? additionalImports.concat(window.yfiles.imports) : window.yfiles.imports;
            require(imports, callback);
        });
    }
    
    yfiles.require = require;
    yfiles.require.baseUrl = yfiles.baseUrl || '';
    yfiles.require.timeout = 400000;
    yfiles.ready = ready;

    return ready;
});