/*
 hub.js JavaScript library
 https://github.com/mantoni/hub.js

 Copyright 2011, Maximilian Antoni
 Released under the MIT license:
 https://github.com/mantoni/hub.js/raw/master/LICENSE
*/
Hub=function(){function K(a,b){function c(){if(d<a.length&&!c.stop){c.result=Hub.util.merge(c.result,a[d++].apply(null,b));return true}return false}var d=0;return c}function u(){function a(){var c=n;n=K(b,arguments);try{for(;n(););return n.result}finally{n=c}}var b=arguments.length?Array.prototype.slice.call(arguments):[];a.add=function(c){b.unshift(c)};a.remove=function(c){for(var d=b.length;d--;)if(b[d]===c){b.splice(d,1);break}};return a}function w(a){var b={};if(a=s[a]){for(var c=a.is?typeof a.is===
"string"?[a.is]:a.is:z,d=0,e;e=c[d++];){var h=b;e=x[e]||w(topic);var k=void 0;for(k in e){var l=e[k],f=h[k];f||(h[k]=f=u());f.add(l)}}a=a.factory();for(var g in a){c=a[g];(d=b[g])||(b[g]=d=u());d.add(c)}}return b}function L(a){return function(){var b=w(a);A(b,a);Hub.propagate();for(var c in b)Hub.unsubscribe(a+"/"+c,b[c])}}function A(a,b){for(var c in a)Hub.subscribe(b+"/"+c,a[c])}function M(a){return function(){q(Hub.util.substitute(a,arguments),arguments)}}function B(a){var b=typeof a;if(b!=="string")throw Error("Topic is not string: "+
b);if(!a)throw Error("Topic is empty");if(!/^[a-zA-Z0-9\.\{\}\*]+(\/[a-zA-Z0-9\.\{\}\*]+)?$/.test(a))throw Error("Illegal topic: "+a);}function C(a,b){B(a);var c=u(),d,e;b&&c.add(b);if(a.indexOf("*")!==-1){d=D[a];if(!d){d=a.replace(/\./g,"\\.").replace(/\*\*/g,"[a-zA-Z0-9\\.]+").replace(/\*/g,"[a-zA-Z0-9]+");d=D[a]=RegExp("^"+d+"$")}for(e in j)d.test(e)&&c.add(j[e]);m[a]=d}else for(e in m){d=m[e];d.test(a)&&c.add(j[e])}a.indexOf("{")!==-1&&c.add(M(a));return j[a]=c}function q(a,b){var c=j[a]||C(a);
try{return c.apply(null,b)}catch(d){if(a==="hub.error/publish")throw d;q("hub.error/publish",[new Hub.Error("error",'Error in callback for topic "{topic}": {error}',{topic:a,error:d.message})])}}function E(){r=undefined;o=(new Date).getTime();var a=-1,b;for(b in p){var c=p[b],d=c[0];if(d<=o){c[1].reject({type:"timeout"});delete p[b]}else a=a===-1?d:Math.min(d,a)}if(a!==-1)t=setTimeout(E,a);o=undefined}function N(a,b){o||(o=(new Date).getTime());var c=++O;p[c]=[o+b,a];if(!r){clearTimeout(t);r=setTimeout(E,
15)}return c}function y(a,b){if(a)try{a(b)}catch(c){q("hub.error/promise.callback",[new Hub.Error("error","Error in promise callback: ${error}",{error:c.message})])}}function F(){q("hub.error/promise.fulfilled",[new Hub.Error("validation","Promise already fulfilled")])}function v(a,b,c){var d=[],e=[],h=true,k,l;l={then:function(f,g){if(a)y(h?f:g,b);else{f&&d.push(f);g&&e.push(g)}return this},publish:function(f){if(a)return Hub.publish.apply(Hub,arguments);var g=[f];if(arguments.length>1)g=g.concat(arguments);
return this.then(function(){return Hub.publish.apply(Hub,g)})},fulfill:function(f){if(a)F();else{a=true;delete p[k];for(b=Hub.util.merge(b,f);d.length;)y(d.shift(),b)}return this},reject:function(f){if(a)F();else{a=true;h=false;for(delete p[k];d.length;)y(e.shift(),f)}return this},fulfilled:function(){return a}};a||(k=N(l,c||6E4));return l}function G(a,b){function c(){if(++k===2)(f?l.fulfill:l.reject)(h)}function d(g){if(f)h=Hub.util.merge(h,g);c()}function e(g){if(f){f=false;h=g}else h=Hub.util.merge(h,
g);c()}var h,k=0,l=v(false,undefined),f=true;a.then(d,e);b.then(d,e);return l}function H(a){var b=v(true);a.then=b.then;a.publish=b.publish;return b}function I(a){a=typeof a;if(a!=="function")throw Error("Callback is not function: "+a);}var j={},m={},x={},s={},n,z=[],i=true,p={},D={},t,r,O=0,o,J=function(){};J.prototype={then:function(a,b){return H(this).then(a,b)},publish:function(a,b,c){return H(this).publish(a,b,c)},fulfill:function(){throw Error("Hub - promise already fulfilled");},fulfilled:function(){return true}};
return{SINGLETON:"SINGLETON",PROTOTYPE:"PROTOTYPE",reset:function(){j={};m={};x={};for(var a in s)a.indexOf("lib.")===-1&&delete s[a];if(r){clearTimeout(r);r=undefined}if(t){clearTimeout(t);t=undefined}o=undefined;p={}},subscribe:function(a,b){I(b);var c=j[a];c?c.add(b):C(a,b);for(var d in m)m[d].test(a)&&j[d].add(b)},unsubscribe:function(a,b){I(b);if(!j[a]){B(a);return false}j[a].remove(b);for(var c in m)m[c].test(a)&&j[c].remove(b);return true},peer:function(a,b,c){if(s[a])throw Error("Hub - peer already defined: "+
a);if(typeof b==="function"){c=b;b={}}b.factory=c;s[a]=b;if(!b.scope||b.scope===Hub.SINGLETON){b=x[a]=w(a);A(b,a)}else Hub.subscribe(a+"/**",L(a))},publish:function(a){var b=i;i=false;var c=arguments.length>1?Array.prototype.slice.call(arguments,1):z;c=q(a,c);if(c!==undefined){c=v(true,c);i=i?G(i,c):c}c=i;i=b;return c||new J},stopPropagation:function(){n.stop=true},propagate:function(){n()},promise:function(a){a=v(false,undefined,a);if(i===true)return a;if(i===false)return i=a;i=G(i,a);return a},
forward:function(a,b,c,d){if(typeof a==="object")for(var e in a){b=a[e];typeof b==="string"?Hub.subscribe(e,Hub.publisher(b)):Hub.subscribe(e,Hub.publisher(b[0],b[1],b[2]))}else Hub.subscribe(a,Hub.publisher(b,c,d))},publisher:function(a,b,c){if(b){if(c)return function(){return Hub.publish(a,Hub.util.merge(b.apply(null,arguments),c))};if(typeof b==="function")return function(){return Hub.publish(a,b.apply(null,arguments))};return function(d){return Hub.publish(a,Hub.util.merge(d,b))}}return function(d){return Hub.publish(a,
d)}},Error:function(a,b,c){return{toString:function(){return Hub.util.substitute(b,this.context)},type:a,context:c||{}}},util:{merge:function(a,b){if(a===undefined||a===null||a===b)return b;if(b===undefined||b===null)return a;var c=Object.prototype.toString,d=c.call(b);c=c.call(a);if(c===d){if(d==="[object Object]"){for(var e in b)a[e]=arguments.callee(a[e],b[e]);return a}if(d==="[object Array]")return a.concat(b)}q("hub.error/util.merge",[new Hub.Error("validation",c===d?"Cannot merge value {target} with {source}":
"Cannot merge type {targetType} with {sourceType}",{target:a,source:b,targetType:c,sourceType:d})]);return a},chain:u,resolve:function(a,b,c){var d=b.indexOf(".");if(d!==-1){var e=b.substring(0,d);if(e in a)return arguments.callee(a[e],b.substring(d+1),c);return c}return b in a?a[b]:c},substitute:function(a,b,c){if(c===undefined)c="";return a.replace(/\{([a-zA-Z0-9\.]+)\}/g,b?function(d,e){return Hub.util.resolve(b,e,c)}:function(){return c})}}}}();
