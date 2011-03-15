/*
 hub.js JavaScript library
 https://github.com/mantoni/hub.js

 Copyright 2011, Maximilian Antoni
 Released under the MIT license:
 https://github.com/mantoni/hub.js/raw/master/LICENSE
*/
Hub={util:{}};(function(){function s(){function m(){function g(){if(j<n.length&&!g.stop){o=Hub.util.merge(o,n[j++].apply(null,h));return true}return false}var h=arguments,o,d=r;r=g;j=0;try{for(;r(););return o}finally{r=d}}var n=arguments.length?Array.prototype.slice.call(arguments):[],j=-1;m.add=function(g){n.unshift(g);j!==-1&&j++};m.addAll=function(g){n=g.concat(n);if(j!==-1)j+=g.length};m.insert=function(g,h){n.splice(g,0,h);g<j&&j++};m.remove=function(g){if(typeof g==="number"){n.splice(g,1);g<j&&j--;return g}for(var h=
n.length;h--;)if(n[h]===g){n.splice(h,1);h<j&&j--;return h}return-1};m.all=function(){return n};return m}var r;Hub.stopPropagation=function(){r.stop=true};Hub.propagate=function(){r()};Hub.util.chain=s;Hub.util.topicChain=function(){var m=s(),n=m.remove,j=[];m.add=function(g,h){if(h.indexOf("*")===-1)m.insert(j.length,g);else{for(var o=0,d=j.length;o<d;o++){var e;a:{var k=h,l=j[o];e=k.indexOf("*");var q=l.indexOf("*");k=k.indexOf("/");l=l.indexOf("/");if(e<k){if(q>l){e=-1;break a}}else if(q<l){e=
1;break a}e=0}if(e<=0){j.splice(o,0,h);m.insert(o,g);return}}m.insert(j.length,g);j.push(h)}};m.addAll=function(g,h){for(var o=0,d=g.length;o<d;o++)m.add(g[o],h)};m.remove=function(g){g=n(g);g!==-1&&g<j.length&&j.splice(g,1);return g};return m}})();(function(){function s(a,b,c){var f=a[b];f||(a[b]=f=Hub.util.chain());f.add(c)}function r(a){var b={};if(a){for(var c=a.is,f=0,i;i=c[f++];){var u=b;i=q[i]||r(p[i]);var v=void 0;for(v in i)s(u,v,i[v])}a=a.instance||a.factory();for(var w in a)s(b,w,a[w])}return b}function m(a){a=a.replace(/\./g,"\\.").replace(/\*\*/g,"[a-zA-Z0-9\\.]+").replace(/\*/g,"[a-zA-Z0-9]+");return RegExp("^"+a+"$")}function n(a){return function(){var b=r(p[a]);j(b,a);Hub.propagate();for(var c in b)Hub.unsubscribe(a+"/"+c,b[c])}}
function j(a,b){for(var c in a)Hub.subscribe(b+"/"+c,a[c])}function g(a){return function(){d(Hub.util.substitute(a,arguments),arguments)}}function h(a){var b=typeof a;if(b!=="string")throw Error("Topic is not string: "+b);if(!a)throw Error("Topic is empty");if(!/^[a-zA-Z0-9\.\{\}\*]+(\/[a-zA-Z0-9\.\{\}\*]+)?$/.test(a))throw Error("Illegal topic: "+a);}function o(a){h(a);var b=k[a]=Hub.util.topicChain(),c;for(c in l){var f=l[c];f.re.test(a)&&b.addAll(f.chain.all(),c)}return b}function d(a,b){var c=
k[a];if(!c)if(a.indexOf("{")!==-1)c=k[a]=g(a);else if(a.indexOf("*")===-1)c=o(a);else if(c=l[a])c=c.chain;else{c=l[a]={re:m(a),chain:Hub.util.chain()};var f=c.re;c=c.chain;for(var i in k)f.test(i)&&c.addAll(k[i].all(),i)}try{return c.apply(null,b)}catch(u){if(a==="hub.error/publish")throw u;d("hub.error/publish",[new Hub.Error("error",'Error in call chain for topic "{topic}": {error}',{topic:a,error:u.message})])}}function e(a){a=typeof a;if(a!=="function")throw Error("Callback is not function: "+
a);}var k={},l={},q={},p={},t=[];Hub.reset=function(){k={};l={};q={};for(var a in p)a.indexOf("lib.")===-1&&delete p[a]};Hub.subscribe=function(a,b){e(b);var c=k[a];if(!c){if(a.indexOf("*")!==-1){var f=l[a];f||(f=l[a]={re:m(a),chain:Hub.util.chain()});f.chain.add(b);c=f.re;for(var i in k)if(c.test(i)){k[i].add(b,a);f.chain.addAll(k[i].all(),i)}return}c=o(a)}for(i in l){f=l[i];f.re.test(a)&&f.chain.add(b,a)}c.add(b,a)};Hub.unsubscribe=function(a,b){e(b);if(!k[a]){h(a);return false}k[a].remove(b);for(var c in l){var f=
l[c];f.re.test(a)&&f.chain.remove(b)}return true};Hub.peer=function(a,b,c){if(p[a])throw Error("Hub - peer already defined: "+a);if(!c){c=b;b=null}b={is:b?typeof b==="string"?[b]:b:t};if(typeof c==="function"){b.factory=c;Hub.subscribe(a+"/**",n(a))}else{b.instance=c;c=q[a]=r(b);j(c,a)}p[a]=b};Hub.invoke=function(a){var b=arguments.length>1?Array.prototype.slice.call(arguments,1):t;return d(a,b)};Hub.forward=function(a,b,c,f){if(typeof a==="object")for(var i in a){b=a[i];typeof b==="string"?Hub.subscribe(i,
Hub.publisher(b)):Hub.subscribe(i,Hub.publisher(b[0],b[1],b[2]))}else Hub.subscribe(a,Hub.publisher(b,c,f))};Hub.publisher=function(a,b,c){if(b){if(c)return function(){return Hub.publish(a,Hub.util.merge(b.apply(null,arguments),c))};if(typeof b==="function")return function(){return Hub.publish(a,b.apply(null,arguments))};return function(f){return Hub.publish(a,Hub.util.merge(f,b))}}return function(f){return Hub.publish(a,f)}};Hub.Error=function(a,b,c){return{toString:function(){return Hub.util.substitute(b,
this.context)},type:a,context:c||{}}};Hub.util.merge=function(a,b){if(a===undefined||a===null||a===b)return b;if(b===undefined||b===null)return a;var c=Object.prototype.toString,f=c.call(b);c=c.call(a);if(c===f){if(f==="[object Object]"){for(var i in b)a[i]=arguments.callee(a[i],b[i]);return a}if(f==="[object Array]")return a.concat(b)}d("hub.error/util.merge",[new Hub.Error("validation",c===f?"Cannot merge value {target} with {source}":"Cannot merge type {targetType} with {sourceType}",{target:a,
source:b,targetType:c,sourceType:f})]);return a};Hub.util.resolve=function(a,b,c){var f=b.indexOf(".");if(f!==-1){var i=b.substring(0,f);if(i in a)return arguments.callee(a[i],b.substring(f+1),c);return c}return b in a?a[b]:c};Hub.util.substitute=function(a,b,c){if(c===undefined)c="";return a.replace(/\{([a-zA-Z0-9\.]+)\}/g,b?function(f,i){return Hub.util.resolve(b,i,c)}:function(){return c})}})();(function(){function s(d,e){try{d(e)}catch(k){Hub.invoke("hub.error/promise.callback",new Hub.Error("error","Error in promise callback: ${error}",{error:k.message}))}}function r(){Hub.invoke("hub.error/promise.fulfilled",new Hub.Error("validation","Promise already fulfilled"))}function m(d){return function(){d.reject({type:"timeout"})}}function n(d,e,k){var l,q,p=true,t;t={then:function(a,b){if(d){var c=p?a:b;c&&s(c,e)}else{a&&l.push(a);b&&q.push(b)}return this},publish:function(a){if(d){e=Hub.invoke.apply(Hub,
arguments);return this}var b=[a];if(arguments.length>1)b=b.concat(arguments);return this.then(function(){e=Hub.invoke.apply(Hub,b)})},publishValue:function(a){if(d){e=Hub.invoke(a,e);return this}return this.then(function(){e=Hub.invoke(a,e)})},fulfill:function(a){if(d)r();else{d=true;clearTimeout(k);for(e=Hub.util.merge(e,a);l.length;)s(l.shift(),e)}return this},reject:function(a){if(d)r();else{d=true;p=false;for(clearTimeout(k);q.length;)s(q.shift(),a)}return this},fulfilled:function(){return d}};
if(!d){l=[];q=[];k=setTimeout(m(t),k||6E4)}return t}function j(d,e){function k(){if(++t===2)(b?a.fulfill:a.reject)(p)}function l(c){if(b)p=Hub.util.merge(p,c);k()}function q(c){if(b){b=false;p=c}else p=Hub.util.merge(p,c);k()}var p,t=0,a=n(false),b=true;d.then(l,q);e.then(l,q);return a}function g(d){var e=n(true);d.then=e.then;d.publish=e.publish;d.publishValue=e.publishValue;return e}var h=true,o=function(){};o.prototype={then:function(d,e){return g(this).then(d,e)},publish:function(){return g(this).publish.apply(null,
arguments)},publishValue:function(){return g(this).publishValue.apply(null,arguments)},fulfill:function(){throw Error("Hub - promise already fulfilled");},fulfilled:function(){return true}};Hub.publish=function(){var d=h;h=false;var e=Hub.invoke.apply(this,arguments);if(typeof e!=="undefined"){e=n(true,e);h=h?j(h,e):e}e=h;h=d;return e||new o};Hub.promise=function(d){d=n(false,undefined,d);if(h===true)return d;if(h===false)return h=d;h=j(h,d);return d}})();
