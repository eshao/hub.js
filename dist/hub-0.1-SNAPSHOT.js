/*
 hub.js JavaScript library
 https://github.com/mantoni/hub.js

 Copyright 2011, Maximilian Antoni
 Released under the MIT license:
 https://github.com/mantoni/hub.js/raw/master/LICENSE
*/
Hub=function(){function t(a,b){function c(d){var e=j;j=c.second;p=d;try{c.first(d);j&&c.second(d)}finally{j=e;p=undefined}}c.first=a;c.second=b;return c}function u(a,b){if(a!==b){if(a.first===b)return a.second;if(!(a.second=u(a.second,b)))return a.first;return a}}function q(a,b){for(var c in b){var d=b[c];a[c]=c in a?t(d,a[c]):d}}function l(a){var b={},c=k[a],d=true;if(c){for(var e=c.is?typeof c.is==="string"?[c.is]:c.is:C,f=0,g;g=e[f++];)q(b,i[g]||l(g));q(b,c.factory());if(c.scope===Hub.PROTOTYPE)d=
false}if(d)if(a in i)q(i[a],b);else i[a]=b;return b}function v(a){a=a.replace(/\./g,"\\.").replace(/\*\*/g,"[a-zA-Z0-9\\.]+").replace(/\*/g,"[a-zA-Z0-9]+");return RegExp("^"+a+"$")}function w(a,b,c){Hub.publish("hub.error.error","publish",{message:"Error in callback for {namespace}/{message}: {error}",context:{namespace:a,message:b,error:c}})}function x(a){if(a!==undefined){a=m(true,a);h=h?y(h,a):a}}function z(a,b,c,d){if(b[c])try{x(b[c](d))}catch(e){w(a,c,e.message);return}if(c.indexOf("*")!==-1){var f=
v(c);for(c in b)if(f.test(c))try{x(b[c](d))}catch(g){w(a,c,g.message)}}}function r(a,b,c){if(c){if(!a.success)return true;try{a.success(b);return true}catch(d){console.warn("Hub - error in promise success handler: "+d.message);return false}}if(a.error)try{a.error(b)}catch(e){console.warn("Hub - error in promise error handler: "+e.message)}return false}function m(a,b){var c=[],d=true;return{then:function(e,f){var g={success:e,error:f};a?r(g,b,e):c.push(g);return this},publish:function(e,f,g){if(a){g=
Hub.util.merge(b,g);return Hub.publish(e,f,g)}return this.then(function(){g=Hub.util.merge(b,g);Hub.publish(e,f,g)})},fulfill:function(e){if(a)throw Error("Hub - promise already fulfilled");a=true;for(b=Hub.util.merge(b,e);c.length;)d=r(c.shift(),b,d);return this},reject:function(e){if(a)throw Error("Hub - promise already fulfilled");a=true;for(d=false;c.length;)d=r(c.shift(),e,d);return this},fulfilled:function(){return a}}}function y(a,b){function c(){if(++g===2)(n?s.fulfill:s.reject)(f)}function d(o){if(n)f=
Hub.util.merge(f,o);c()}function e(o){if(n){n=false;f=o}else f=Hub.util.merge(f,o);c()}var f,g=0,s=m(false),n=true;a.then(d,e);b.then(d,e);return s}function A(a){var b=m(true);a.then=b.then;a.publish=b.publish;return b}var i={},k={},j=false,p,h=true,C=[],B=function(){};B.prototype={then:function(a,b){return A(this).then(a,b)},publish:function(a,b,c){return A(this).publish(a,b,c)},fulfill:function(){throw Error("Hub - promise already fulfilled");},fulfilled:function(){return true}};return{SINGLETON:"SINGLETON",
PROTOTYPE:"PROTOTYPE",reset:function(){i={};for(var a in k)a.indexOf("lib.")===-1&&delete k[a]},subscribe:function(a,b,c){var d=a.indexOf("/");if(d!==-1){c=b;b=a.substring(d+1);a=a.substring(0,d)}a=i[a]||l(a);a[b]=b in a?t(c,a[b]):c},unsubscribe:function(a,b,c){var d=a.indexOf("/");if(d!==-1){c=b;b=a.substring(d+1);a=a.substring(0,d)}if(a=i[a])if(a[b]&&!(a[b]=u(a[b],c)))delete a[b]},peer:function(a,b,c){if(k[a])throw Error("Hub - peer already defined: "+a);if(typeof b==="function"){c=b;b={}}b.factory=
c;k[a]=b;i[a]&&l(a)},publish:function(a,b,c){var d=a.indexOf("/");if(d!==-1){c=b;b=a.substring(d+1);a=a.substring(0,d)}d=h;h=false;if(a.indexOf("*")===-1){var e=i[a]||l(a);z(a,e,b,c)}else{var f=[],g=v(a);for(e in k)g.test(e)&&f.push(i[e]||l(e));for(g=0;e=f[g++];)z(a,e,b,c)}a=h;h=d;return a||new B},stopPropagation:function(){j=false},propagate:function(){j(p);j=false},promise:function(){var a=m(false);if(h===true)return a;if(h===false)return h=a;h=y(h,a);return a},lazy:function(){throw Error("Not yet supported");
},forward:function(a,b,c,d,e,f){if(typeof a==="object")for(var g in a){b=a[g];typeof b==="string"?Hub.forward(g,b):Hub.forward.apply(Hub,[g].concat(b))}else{g=a.indexOf("/");if(g!==-1){f=e;e=d;d=c;c=b;b=a.substring(g+1);a=a.substring(0,g)}Hub.subscribe(a,b,Hub.forwarder(c,d,f,e))}},forwarder:function(a,b,c,d){var e=a.indexOf("/");if(e!==-1){d=c;c=b;b=a.substring(e+1);a=a.substring(0,e)}if(c){if(d)return function(f){return Hub.publish(a,b,Hub.util.merge(c(f),d))};if(typeof c==="function")return function(f){return Hub.publish(a,
b,c(f))};return function(f){return Hub.publish(a,b,Hub.util.merge(f,c))}}return function(f){return Hub.publish(a,b,f)}},util:{merge:function(a,b){if(a===undefined||a===null||a===b)return b;if(b===undefined||b===null)return a;var c=Object.prototype.toString.call(b),d=Object.prototype.toString.call(a);if(d===c){if(c==="[object Object]"){for(var e in b)a[e]=arguments.callee(a[e],b[e]);return a}if(c==="[object Array]")return a.concat(b)}Hub.publish("hub.error.warn","util.merge",{message:d===c?"Cannot merge value {target} with {source}":
"Cannot merge type {targetType} with {sourceType}",context:{target:a,source:b,targetType:d,sourceType:c}});return a}}}}();
