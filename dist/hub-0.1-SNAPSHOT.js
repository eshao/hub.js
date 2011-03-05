/*
 hub.js JavaScript library
 https://github.com/mantoni/hub.js

 Copyright 2011, Maximilian Antoni
 Released under the MIT license:
 https://github.com/mantoni/hub.js/raw/master/LICENSE
*/
Hub=function(){function p(a,b){var c=function(d){if(!a)return b(d);if(b){var e=m;m=b;v=d;try{var f=a(d);if(m)f=Hub.util.merge(f,b(d));return f}finally{m=e;v=undefined}}else return a(d)};c.remove=function(d){if(d===a){a=undefined;return b}if(d===b||typeof b.remove==="function"&&!(b=b.remove(d))){b=undefined;return a}return c};return c}function y(a){var b={};if(a=s[a]){for(var c=a.is?typeof a.is==="string"?[a.is]:a.is:H,d=0,e;e=c[d++];){var f=b;e=w[e]||y(topic);var h=void 0;for(h in e){var l=e[h];f[h]=
h in f?p(l,f[h]):l}}a=a.factory();for(var g in a){c=a[g];b[g]=g in b?p(c,b[g]):c}}return b}function z(a){var b=A[a];if(b)return b;b=a.replace(/\./g,"\\.").replace(/\*\*/g,"[a-zA-Z0-9\\.]+").replace(/\*/g,"[a-zA-Z0-9]+");return A[a]=RegExp("^"+b+"$")}function I(a){return function(){q(Hub.util.substitute(a,arguments),arguments)}}function q(a,b){var c=k[a];if(!c){c=typeof a;if(c!=="string")throw Error("Topic is not string: "+c);if(!a)throw Error("Topic is empty");if(!/^[a-zA-Z0-9\.\{\}\*]+(\/[a-zA-Z0-9\.\{\}\*]+)?$/.test(a))throw Error("Illegal topic: "+
a);var d;if(a.indexOf("{")!==-1)d=I(a);if(a.indexOf("*")!==-1){c=z(a);for(var e in k)if(c.test(e)){var f=k[e];d=d?p(d,f):f}}c=k[a]=d||B}try{return c.apply(null,b)}catch(h){if(a==="hub.error/publish")throw h;q("hub.error/publish",[new Hub.Error("error",'Error in callback for topic "{topic}": {error}',{topic:a,error:h.message})])}}function C(){r=undefined;n=(new Date).getTime();var a=-1,b;for(b in o){var c=o[b],d=c[0];if(d<=n){c[1].reject({type:"timeout"});delete o[b]}else a=a===-1?d:Math.min(d,a)}if(a!==
-1)t=setTimeout(C,a);n=undefined}function J(a,b){n||(n=(new Date).getTime());var c=++K;o[c]=[n+b,a];if(!r){clearTimeout(t);r=setTimeout(C,15)}return c}function x(a,b){if(a)try{a(b)}catch(c){q("hub.error/promise.callback",[new Hub.Error("error","Error in promise callback: ${error}",{error:c.message})])}}function D(){q("hub.error/promise.fulfilled",[new Hub.Error("validation","Promise already fulfilled")])}function u(a,b,c){var d=[],e=[],f=true,h,l;l={then:function(g,i){if(a)x(f?g:i,b);else{g&&d.push(g);
i&&e.push(i)}return this},publish:function(g){if(a)return Hub.publish.apply(Hub,arguments);var i=[g];if(arguments.length>1)i=i.concat(arguments);return this.then(function(){return Hub.publish.apply(Hub,i)})},fulfill:function(g){if(a)D();else{a=true;delete o[h];for(b=Hub.util.merge(b,g);d.length;)x(d.shift(),b)}return this},reject:function(g){if(a)D();else{a=true;f=false;for(delete o[h];d.length;)x(e.shift(),g)}return this},fulfilled:function(){return a}};a||(h=J(l,c||6E4));return l}function E(a,b){function c(){if(++h===
2)(g?l.fulfill:l.reject)(f)}function d(i){if(g)f=Hub.util.merge(f,i);c()}function e(i){if(g){g=false;f=i}else f=Hub.util.merge(f,i);c()}var f,h=0,l=u(false,undefined),g=true;a.then(d,e);b.then(d,e);return l}function F(a){var b=u(true);a.then=b.then;a.publish=b.publish;return b}var B=function(){},k={},w={},s={},m=false,v,H=[],j=true,o={},A={},t,r,K=0,n,G=function(){};G.prototype={then:function(a,b){return F(this).then(a,b)},publish:function(a,b,c){return F(this).publish(a,b,c)},fulfill:function(){throw Error("Hub - promise already fulfilled");
},fulfilled:function(){return true}};return{SINGLETON:"SINGLETON",PROTOTYPE:"PROTOTYPE",reset:function(){k={};w={};for(var a in s)a.indexOf("lib.")===-1&&delete s[a];if(r){clearTimeout(r);r=undefined}if(t){clearTimeout(t);t=undefined}n=undefined;o={}},subscribe:function(a,b){var c=k[a];k[a]=c&&c!==B?p(b,c):b},unsubscribe:function(a,b){var c=k[a];if(c)for(var d in k)if(z(d).test(a)){c=k[d];if(c===b)delete k[d];else c.remove(b)}},peer:function(a,b,c){if(s[a])throw Error("Hub - peer already defined: "+
a);if(typeof b==="function"){c=b;b={}}b.factory=c;s[a]=b;if(!b.scope||b.scope===Hub.SINGLETON){b=w[a]=y(a);for(var d in b)Hub.subscribe(a+"/"+d,b[d])}},publish:function(a){var b=j;j=false;var c=Array.prototype.slice.call(arguments,1);c=q(a,c);if(c!==undefined){c=u(true,c);j=j?E(j,c):c}c=j;j=b;return c||new G},stopPropagation:function(){m=false},propagate:function(){m(v);m=false},promise:function(a){a=u(false,undefined,a);if(j===true)return a;if(j===false)return j=a;j=E(j,a);return a},forward:function(a,
b,c,d){if(typeof a==="object")for(var e in a){b=a[e];typeof b==="string"?Hub.subscribe(e,Hub.publisher(b)):Hub.subscribe(e,Hub.publisher(b[0],b[1],b[2]))}else Hub.subscribe(a,Hub.publisher(b,c,d))},publisher:function(a,b,c){if(b){if(c)return function(){return Hub.publish(a,Hub.util.merge(b.apply(null,arguments),c))};if(typeof b==="function")return function(){return Hub.publish(a,b.apply(null,arguments))};return function(d){return Hub.publish(a,Hub.util.merge(d,b))}}return function(d){return Hub.publish(a,
d)}},Error:function(a,b,c){return{toString:function(){return Hub.util.substitute(b,this.context)},type:a,context:c||{}}},util:{merge:function(a,b){if(a===undefined||a===null||a===b)return b;if(b===undefined||b===null)return a;var c=Object.prototype.toString,d=c.call(b);c=c.call(a);if(c===d){if(d==="[object Object]"){for(var e in b)a[e]=arguments.callee(a[e],b[e]);return a}if(d==="[object Array]")return a.concat(b)}q("hub.error/util.merge",[new Hub.Error("validation",c===d?"Cannot merge value {target} with {source}":
"Cannot merge type {targetType} with {sourceType}",{target:a,source:b,targetType:c,sourceType:d})]);return a},chain:function(){var a=arguments.length-1,b=p(arguments[a-1],arguments[a]);for(a--;a;)b=p(arguments[--a],b);return b},resolve:function(a,b,c){var d=b.indexOf(".");if(d!==-1){var e=b.substring(0,d);if(e in a)return arguments.callee(a[e],b.substring(d+1),c);return c}return b in a?a[b]:c},substitute:function(a,b,c){if(c===undefined)c="";return a.replace(/\{([a-zA-Z0-9\.]+)\}/g,b?function(d,e){return Hub.util.resolve(b,
e,c)}:function(){return c})}}}}();
