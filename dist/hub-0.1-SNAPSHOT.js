/*
 hub.js JavaScript library
 https://github.com/mantoni/hub.js

 Copyright 2011, Maximilian Antoni
 Released under the MIT license:
 https://github.com/mantoni/hub.js/raw/master/LICENSE
*/
Hub={util:{}};Hub.iterator=function(r){function o(){if(m>=p)throw Error("Iterator out of bounds.");var l=r[m++];o.hasNext=m<p;return l}var m=0,p=r.length;o.hasNext=m<p;o.remove=function(l){if(typeof l==="undefined")l=m;else l<m&&m--;r.splice(l,1);o.hasNext=m<--p};o.insert=function(l,n){if(typeof n==="undefined"){n=l;l=m}else l<m&&m++;r.splice(l,0,n);o.hasNext=m<++p};return o};(function(){function r(){var i=n.length;if(!i)return false;i=n[i-1];if(!i.hasNext){n.pop();return r()}l=Hub.util.merge(l,i().apply(null,p));return true}function o(){function i(){o.aborted=false;if(!n.length){m=false;p=arguments;l=undefined}try{d=Hub.iterator(h);for(n.push(d);r(););}finally{o.aborted=m;d=false}if(!n.length){var c=l;p=l=undefined;return c}}var h=arguments.length?Array.prototype.slice.call(arguments):[],d=false;i.add=function(c){if(typeof c.all==="function"){c=c.all();if(d)for(var f=
0,k=c.length;f<k;f++)d.insert(f,c[f]);else h=c.concat(h)}else d?d.insert(0,c):h.unshift(c)};i.insert=function(c,f){d?d.insert(c,f):h.splice(c,0,f)};i.remove=function(c){if(typeof c==="number"){d?d.remove(c):h.splice(c,1);return c}for(var f=h.length;f--;)if(h[f]===c){d?d.remove(f):h.splice(f,1);return f}return-1};i.all=function(){return h};return i}var m=false,p,l,n=[];Hub.stopPropagation=function(){m=true;n.length=0};Hub.propagate=function(){r()};Hub.util.chain=o;Hub.util.topicChain=function(){var i=
o(),h=i.remove,d=[];i.add=function(c,f){if(typeof c.all==="function")for(var k=c.all(),a=k.length-1;a>=0;a--)i.add(k[a],f);else if(f.indexOf("*")===-1)i.insert(d.length,c);else{a=0;for(k=d.length;a<k;a++){var b;a:{var g=f,e=d[a];b=g.indexOf("*");var j=e.indexOf("*");g=g.indexOf("/");e=e.indexOf("/");if(b<g){if(j>e){b=-1;break a}}else if(j<e){b=1;break a}b=0}if(b<=0){d.splice(a,0,f);i.insert(a,c);return}}i.insert(d.length,c);d.push(f)}};i.remove=function(c){c=h(c);c!==-1&&c<d.length&&d.splice(c,1);
return c};return i}})();(function(){function r(h,d,c){var f=h[d];f||(h[d]=f=Hub.util.chain());f.add(c)}function o(h,d){return function(){var c=Hub.subscriberChain(h),f=c.apply(null,arguments);if(c.aborted)return f;return Hub.util.merge(f,d.apply(null,arguments))}}function m(h){var d=l[h];if(d)return d;d=n[h];if(!d)throw Error("Peer is not defined: "+h);d=p(d);var c={},f;for(f in d){var k=d[f];if(typeof k==="function")c[f]=o(h+"/"+f,k)}d.api=c;return d}function p(h){for(var d={},c=h.is,f=0,k;k=c[f++];){var a=d;k=m(k);var b=
void 0;for(b in k)r(a,b,k[b])}h=h.instance||h.factory();for(var g in h)r(d,g,h[g]);return d}var l={},n={},i=[];Hub.peer=function(h,d,c){if(n[h])throw Error("Hub - peer already defined: "+h);if(!c){c=d;d=null}d={is:d?typeof d==="string"?[d]:d:i};if(typeof c==="function")d.factory=c;else{d.instance=c;c=l[h]=p(d);var f=c.api={},k;for(k in c){var a=c[k];if(typeof a==="function"){var b=h+"/"+k;Hub.subscribe(b,a);f[k]=Hub.publisher(b)}}}n[h]=d};Hub.get=function(h){return m(h).api};Hub.resetPeers=function(){l=
{};for(var h in n)h.indexOf("lib.")===-1&&delete n[h]}})();(function(){function r(a){return function(){h(Hub.util.substitute(a,arguments),arguments)}}function o(a){var b=typeof a;if(b!=="string")throw Error("Topic is not string: "+b);if(!a)throw Error("Topic is empty");if(!/^[a-zA-Z0-9\.\{\}\*]+(\/[a-zA-Z0-9\.\{\}\*]+)?$/.test(a))throw Error("Illegal topic: "+a);}function m(a){var b=f[a];if(!b){b=f;var g=a.replace(/\./g,"\\.").replace(/\*\*/g,"[a-zA-Z0-9\\.]+").replace(/\*/g,"[a-zA-Z0-9]+");b=b[a]={re:RegExp("^"+g+"$"),chain:Hub.util.chain()};l(c,b.chain,
b.re,null)}return b}function p(a,b,g,e){for(var j in a){var q=a[j];if((g||q.re).test(e))q.chain.add(b,e)}}function l(a,b,g,e){for(var j in a){var q=a[j];if((g||q.re).test(e||j))(b||q.chain).add(q.chain,j)}}function n(a,b){c[a]={chain:b};return b}function i(a){o(a);var b=n(a,Hub.util.topicChain());l(f,b,null,a);return b}function h(a,b){var g=Hub.subscriberChain(a);try{return g.apply(null,b)}catch(e){throw new Hub.Error("error",'Error in call chain for topic "{topic}": {error}',{topic:a,error:e.message});
}}function d(a){a=typeof a;if(a!=="function")throw Error("Callback is not function: "+a);}var c={},f={},k=[];Hub.reset=function(){c={};f={};Hub.resetPeers()};Hub.subscribe=function(a,b){d(b);var g=a.indexOf("*")!==-1,e;if(e=c[a])e=e.chain;else{if(g){e=m(a);e.chain.add(b);p(c,b,e.re,a);return}e=i(a)}g||p(f,b,null,a);e.add(b,a)};Hub.unsubscribe=function(a,b){d(b);var g=c[a];if(!g){o(a);return false}g.chain.remove(b);for(var e in f){g=f[e];g.re.test(a)&&g.chain.remove(b)}return true};Hub.subscriberChain=
function(a){var b=c[a];if(b)return b.chain;if(a.indexOf("{")!==-1)return n(a,r(a));if(a.indexOf("*")===-1)return i(a);return m(a).chain};Hub.invoke=function(a){var b=arguments.length>1?Array.prototype.slice.call(arguments,1):k;return h(a,b)};Hub.forward=function(a,b,g,e){if(typeof a==="object")for(var j in a){b=a[j];typeof b==="string"?Hub.subscribe(j,Hub.publisher(b)):Hub.subscribe(j,Hub.publisher(b[0],b[1],b[2]))}else Hub.subscribe(a,Hub.publisher(b,g,e))};Hub.publisher=function(a,b,g){if(typeof a===
"string"){if(b){if(g)return function(){return Hub.publish(a,Hub.util.merge(b.apply(null,arguments),g))};if(typeof b==="function")return function(){return Hub.publish(a,b.apply(null,arguments))};return function(s){return Hub.publish(a,Hub.util.merge(s,b))}}return function(){if(arguments.length)return Hub.publish.apply(Hub,[a].concat(Array.prototype.slice.call(arguments)));return Hub.publish(a)}}var e=Hub.util.chain(),j;for(j in a){var q=a[j];e[j]=typeof q==="string"?Hub.publisher(q):Hub.publisher.apply(Hub,
q);e.add(e[j])}return e};Hub.Error=function(a,b,g){this.type=a;this.context=g;this.toString=function(){return Hub.util.substitute(b,g)}};Hub.util.merge=function(a,b){if(a===undefined||a===null||a===b)return b;if(b===undefined||b===null)return a;var g=Object.prototype.toString,e=g.call(b);g=g.call(a);if(g===e){if(e==="[object Object]"){for(var j in b)a[j]=arguments.callee(a[j],b[j]);return a}if(e==="[object Array]")return a.concat(b)}throw new Hub.Error("validation",g===e?"Cannot merge value {target} with {source}":
"Cannot merge type {targetType} with {sourceType}",{target:a,source:b,targetType:g,sourceType:e});};Hub.util.resolve=function(a,b,g){var e=b.indexOf(".");if(e!==-1){var j=b.substring(0,e);if(j in a)return arguments.callee(a[j],b.substring(e+1),g);return g}return b in a?a[b]:g};Hub.util.substitute=function(a,b,g){if(g===undefined)g="";return a.replace(/\{([a-zA-Z0-9\.]+)\}/g,b?function(e,j){return Hub.util.resolve(b,j,g)}:function(){return g})}})();(function(){function r(d,c){try{d(c)}catch(f){Hub.invoke("hub.error/promise.callback",new Hub.Error("error","Error in promise callback: ${error}",{error:f.message}))}}function o(){Hub.invoke("hub.error/promise.fulfilled",new Hub.Error("validation","Promise already fulfilled"))}function m(d){return function(){d.reject({type:"timeout"})}}function p(d,c,f){var k,a,b=!(c instanceof Hub.Error),g;g={then:function(e,j){if(d){var q=b?e:j;q&&r(q,c)}else{e&&k.push(e);j&&a.push(j)}return this},publish:function(e){if(d){c=
Hub.invoke.apply(Hub,arguments);return this}var j=[e];if(arguments.length>1)j=j.concat(arguments);return this.then(function(){c=Hub.invoke.apply(Hub,j)})},publishResult:function(e){if(d){c=Hub.invoke(e,c);return this}return this.then(function(){c=Hub.invoke(e,c)})},fulfill:function(e){if(d)o();else{d=true;clearTimeout(f);for(c=Hub.util.merge(c,e);k.length;)r(k.shift(),c)}return this},reject:function(e){if(d)o();else{d=true;b=false;for(clearTimeout(f);a.length;)r(a.shift(),e)}return this},fulfilled:function(){return d}};
if(!d){k=[];a=[];f=setTimeout(m(g),f||6E4)}return g}function l(d,c){function f(){if(++g===2)(j?e.fulfill:e.reject)(b)}function k(q){if(j)b=Hub.util.merge(b,q);f()}function a(q){if(j){j=false;b=q}else b=Hub.util.merge(b,q);f()}var b,g=0,e=p(false),j=true;d.then(k,a);c.then(k,a);return e}function n(d){var c=p(true);d.then=c.then;d.publish=c.publish;d.publishResult=c.publishResult;return c}var i=true,h=function(){};h.prototype={then:function(d,c){return n(this).then(d,c)},publish:function(){return n(this).publish.apply(null,
arguments)},publishResult:function(){return n(this).publishResult.apply(null,arguments)},fulfill:function(){throw Error("Hub - promise already fulfilled");},reject:function(){throw Error("Hub - promise already fulfilled");},fulfilled:function(){return true}};Hub.publish=function(){var d=i;i=false;var c;try{c=Hub.invoke.apply(this,arguments)}catch(f){if(i&&f instanceof Hub.Error){i.reject(f);return i}throw f;}if(typeof c!=="undefined"){c=p(true,c);i=i?l(i,c):c}c=i;i=d;return c||new h};Hub.promise=
function(d){d=p(false,undefined,d);if(i===true)return d;if(i===false)return i=d;i=l(i,d);return d}})();
